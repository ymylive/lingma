import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('8.134.33.19', username='root', password='Qq159741')

# 下载JS文件并计数
sftp = ssh.open_sftp()
sftp.get('/var/www/lingma/assets/index-i0xXvbek.js', 'server_js.txt')
sftp.close()

# 本地计数
with open('server_js.txt', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()
    
# 计算category出现的次数（每道题都有category字段）
import re
categories = re.findall(r'category:["`\']', content)
print(f"服务器JS文件中题目数: {len(categories)}")

# 检查是否包含新题目
if 'exam-remove' in content:
    print("✓ 包含考试重点题目(exam-remove)")
else:
    print("✗ 不包含考试重点题目")

if 'examFocusExercises' in content:
    print("✓ 包含examFocusExercises数组")
else:
    print("✗ 不包含examFocusExercises数组")

ssh.close()

# 对比本地dist文件
with open('dist/assets/index-i0xXvbek.js', 'r', encoding='utf-8', errors='ignore') as f:
    local_content = f.read()
    
local_categories = re.findall(r'category:["`\']', local_content)
print(f"\n本地dist文件中题目数: {len(local_categories)}")

# 文件大小对比
import os
server_size = os.path.getsize('server_js.txt')
local_size = os.path.getsize('dist/assets/index-i0xXvbek.js')
print(f"\n文件大小对比:")
print(f"  服务器: {server_size} bytes")
print(f"  本地:   {local_size} bytes")
print(f"  差异:   {local_size - server_size} bytes")
