import sys
import textwrap

import paramiko

HOST = "8.134.33.19"
USER = "root"
PASSWORD = "Qq159741"
DOMAIN = "lingma.cornna.xyz"

WEBROOT = "/var/www/lingma"
CERT_DIR = f"/etc/nginx/ssl/{DOMAIN}"


def exec_cmd(ssh, cmd, show=True):
    if show:
        print(f"$ {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read()
    err = stderr.read()
    status = stdout.channel.recv_exit_status()
    if show and out:
        sys.stdout.buffer.write(out)
        sys.stdout.flush()
    if show and err:
        sys.stdout.buffer.write(err)
        sys.stdout.flush()
    return out, err, status


def pick_nginx_conf_path(ssh):
    candidates = [
        f"/etc/nginx/conf.d/{DOMAIN}.conf",
        f"/www/server/panel/vhost/nginx/{DOMAIN}.conf",
    ]
    for path in candidates:
        _, _, status = exec_cmd(ssh, f"test -f {path}", show=False)
        if status == 0:
            return path
    return candidates[0]


def get_nginx_cmd(ssh):
    _, _, status = exec_cmd(ssh, "command -v nginx", show=False)
    if status == 0:
        return "nginx"
    return "/www/server/nginx/sbin/nginx"


def build_nginx_conf():
    return textwrap.dedent(
        f"""\
        server {{
            listen 80;
            server_name {DOMAIN};

            location ^~ /.well-known/acme-challenge/ {{
                root {WEBROOT};
                default_type text/plain;
            }}

            location / {{
                return 301 https://$host$request_uri;
            }}
        }}

        server {{
            listen 443 ssl;
            server_name {DOMAIN};

            ssl_certificate {CERT_DIR}/fullchain.pem;
            ssl_certificate_key {CERT_DIR}/privkey.pem;
            ssl_protocols TLSv1.2 TLSv1.3;
            ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
            ssl_prefer_server_ciphers on;

            location / {{
                proxy_pass http://127.0.0.1:8080;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
            }}
        }}
        """
    )


def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASSWORD)

    nginx_cmd = get_nginx_cmd(ssh)
    conf_path = pick_nginx_conf_path(ssh)

    exec_cmd(ssh, f"mkdir -p {WEBROOT}/.well-known/acme-challenge")
    exec_cmd(ssh, f"mkdir -p {CERT_DIR}")

    conf = build_nginx_conf()
    cmd = f"cat > {conf_path} <<'EOF'\n{conf}\nEOF"
    exec_cmd(ssh, cmd)
    _, _, status = exec_cmd(ssh, f"{nginx_cmd} -t")
    if status != 0:
        ssh.close()
        raise RuntimeError("Nginx config test failed.")
    exec_cmd(ssh, f"{nginx_cmd} -s reload")

    exec_cmd(
        ssh,
        "if [ ! -f ~/.acme.sh/acme.sh ]; then "
        "curl https://get.acme.sh | sh -s email=admin@cornna.xyz; "
        "fi",
    )

    exec_cmd(
        ssh,
        f"~/.acme.sh/acme.sh --issue -d {DOMAIN} --webroot {WEBROOT} --force",
    )
    exec_cmd(
        ssh,
        f"~/.acme.sh/acme.sh --install-cert -d {DOMAIN} "
        f"--key-file {CERT_DIR}/privkey.pem "
        f"--fullchain-file {CERT_DIR}/fullchain.pem "
        f'--reloadcmd "{nginx_cmd} -s reload"',
    )

    exec_cmd(ssh, f"{nginx_cmd} -t")
    exec_cmd(ssh, f"{nginx_cmd} -s reload")

    ssh.close()
    print("SSL setup finished.")


if __name__ == "__main__":
    main()
