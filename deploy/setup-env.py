#!/usr/bin/env python3
import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('8.134.33.19', username='root', password='Qq159741')

print("🔧 设置环境变量并重启服务...")

# 停止旧服务
ssh.exec_command('pm2 delete ai-proxy 2>/dev/null || true')

# 创建ecosystem配置文件
ecosystem = '''
module.exports = {
  apps: [{
    name: 'ai-proxy',
    script: 'server.js',
    cwd: '/var/www/lingma/api-proxy',
    env: {
      AI_API_KEY: 'sk-vJy5jCgbzjksuW1njIbymPABzjK4UkuIVT3fD7MNLmmY570R',
      AI_API_URL: 'https://api.aabao.top/v1/chat/completions',
      AI_MODEL: 'deepseek-v3.2-exp-thinking'
    }
  }]
};
'''

# 写入配置
stdin, stdout, stderr = ssh.exec_command(f"echo '{ecosystem}' > /var/www/lingma/api-proxy/ecosystem.config.js")
stdout.read()

# 用PM2启动
stdin, stdout, stderr = ssh.exec_command('cd /var/www/lingma/api-proxy && pm2 start ecosystem.config.js && pm2 save')
print(stdout.read().decode())
err = stderr.read().decode()
if err:
    print('⚠️', err)

ssh.close()
print("✅ 完成!")
