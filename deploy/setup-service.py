#!/usr/bin/env python3
import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('8.134.33.19', username='root', password='Qq159741')

print("🔧 配置AI代理服务...")

# 创建systemd服务文件
service_content = '''[Unit]
Description=LingMa AI API Proxy
After=network.target

[Service]
Type=simple
WorkingDirectory=/var/www/lingma/api-proxy
Environment=AI_API_KEY=sk-vJy5jCgbzjksuW1njIbymPABzjK4UkuIVT3fD7MNLmmY570R
Environment=AI_API_URL=https://api.aabao.top/v1/chat/completions
Environment=AI_MODEL=deepseek-v3.2-exp-thinking
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
'''

# 写入服务文件
cmd = f"echo '{service_content}' > /etc/systemd/system/ai-proxy.service"
stdin, stdout, stderr = ssh.exec_command(cmd)
stdout.read()

# 重载并启动服务
commands = [
    'systemctl daemon-reload',
    'systemctl stop ai-proxy 2>/dev/null || true',
    'systemctl start ai-proxy',
    'systemctl enable ai-proxy',
    'systemctl status ai-proxy'
]

for cmd in commands:
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode()
    if out:
        print(out)

ssh.close()
print("✅ AI代理服务配置完成!")
