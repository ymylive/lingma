import paramiko

HOST = '8.134.33.19'
USER = 'root'
PASSWORD = 'Qq159741'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASSWORD)

def run(cmd):
    print(f'$ {cmd}')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=300)
    out = stdout.read().decode()
    err = stderr.read().decode()
    if out: print(out)
    if err: print(f'[E] {err}')
    return stdout.channel.recv_exit_status()

# 使用二进制方式安装Node.js
commands = [
    # 下载Node.js二进制包
    'cd /tmp && curl -fsSL https://nodejs.org/dist/v18.20.5/node-v18.20.5-linux-x64.tar.xz -o node.tar.xz',
    
    # 解压并安装
    'cd /tmp && tar -xf node.tar.xz',
    'cp -r /tmp/node-v18.20.5-linux-x64/{bin,lib,share} /usr/',
    
    # 验证
    'node --version && npm --version',
    
    # 安装判题服务依赖
    'cd /var/www/judge-server && npm install',
    
    # 重启服务
    'systemctl restart lingma-judge',
    'sleep 2 && systemctl status lingma-judge --no-pager',
    
    # 测试
    'curl -s http://127.0.0.1:3001/api/health',
]

for cmd in commands:
    print('\n' + '='*50)
    run(cmd)

ssh.close()
print('\n✅ Node.js安装完成!')
