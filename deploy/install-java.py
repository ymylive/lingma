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
    if err and 'warning' not in err.lower(): print(f'[E] {err}')
    return stdout.channel.recv_exit_status()

# 安装Java
commands = [
    # 下载并安装OpenJDK 11
    'yum install -y java-11-openjdk java-11-openjdk-devel --disablerepo=alinux3-os --disablerepo=alinux3-updates || echo "尝试其他方式..."',
    
    # 如果yum失败，使用手动安装
    '''if ! java -version 2>&1 | grep -q "11"; then
        cd /tmp
        curl -fsSL https://download.java.net/java/GA/jdk11/9/GPL/openjdk-11.0.2_linux-x64_bin.tar.gz -o jdk.tar.gz
        tar -xf jdk.tar.gz
        mv jdk-11.0.2 /usr/local/
        ln -sf /usr/local/jdk-11.0.2/bin/java /usr/bin/java
        ln -sf /usr/local/jdk-11.0.2/bin/javac /usr/bin/javac
    fi''',
    
    # 验证安装
    'java -version',
    'javac -version',
    
    # 重启判题服务
    'systemctl restart lingma-judge',
    'sleep 2',
    
    # 测试
    'curl -s http://127.0.0.1:3001/api/health',
]

for cmd in commands:
    print('\n' + '='*50)
    run(cmd)

ssh.close()
print('\n✅ Java安装完成!')
