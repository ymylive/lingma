import paramiko
import os
import sys

HOST = '8.134.33.19'
USER = 'root'
PASSWORD = 'Qq159741'

def ssh_connect():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASSWORD)
    return ssh

def exec_cmd(ssh, cmd, show=True):
    if show:
        print(f'$ {cmd}')
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode()
    err = stderr.read().decode()
    if show and out:
        print(out)
    if show and err:
        print(f'[stderr] {err}')
    return out, err

def upload_file(sftp, local, remote):
    print(f'📤 上传 {local} -> {remote}')
    sftp.put(local, remote)

def upload_dir(sftp, local_dir, remote_dir):
    try:
        sftp.mkdir(remote_dir)
    except:
        pass
    for item in os.listdir(local_dir):
        local_path = os.path.join(local_dir, item)
        remote_path = f'{remote_dir}/{item}'
        if os.path.isfile(local_path):
            upload_file(sftp, local_path, remote_path)
        elif os.path.isdir(local_path):
            upload_dir(sftp, local_path, remote_path)

def main():
    print('🔗 连接服务器...')
    ssh = ssh_connect()
    sftp = ssh.open_sftp()
    
    # 创建目录
    print('📁 创建目录...')
    exec_cmd(ssh, 'mkdir -p /var/www/judge-server')
    
    # 上传判题服务文件
    print('📤 上传判题服务...')
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    judge_dir = os.path.join(base_dir, 'judge-server')
    
    for f in os.listdir(judge_dir):
        local = os.path.join(judge_dir, f)
        if os.path.isfile(local):
            upload_file(sftp, local, f'/var/www/judge-server/{f}')
    
    # 上传部署脚本
    setup_script = os.path.join(base_dir, 'deploy', 'setup-judge.sh')
    upload_file(sftp, setup_script, '/tmp/setup-judge.sh')
    
    # 执行部署脚本
    print('\n🚀 执行部署脚本...\n')
    exec_cmd(ssh, 'chmod +x /tmp/setup-judge.sh && /tmp/setup-judge.sh')
    
    sftp.close()
    ssh.close()
    print('\n✅ 部署完成!')

if __name__ == '__main__':
    main()
