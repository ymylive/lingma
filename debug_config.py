import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('8.134.33.19', username='root', password='Qq159741')

print("查看完整LANG_CONFIG...")
stdin, stdout, stderr = ssh.exec_command('sed -n "35,75p" /var/www/lingma/api-proxy/server.js')
print(stdout.read().decode())

print("\n检查cpp关键字上下文...")
stdin, stdout, stderr = ssh.exec_command('grep -n "cpp" /var/www/lingma/api-proxy/server.js | head -5')
print(stdout.read().decode())

ssh.close()
