import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('8.134.33.19', username='root', password='Qq159741')

# 统计服务器JS文件中的题目数量
cmd = '''
cd /var/www/lingma/assets
echo "=== 文件信息 ==="
ls -la *.js
echo ""
echo "=== 统计id数量 ==="
grep -o "id:\"[^\"]*\"" index-i0xXvbek.js 2>/dev/null | wc -l
grep -o "id:'" index-i0xXvbek.js 2>/dev/null | wc -l
echo ""
echo "=== 检查是否包含exam题目 ==="
grep -o "exam-remove" index-i0xXvbek.js | head -5
echo ""
echo "=== 检查allExercises ==="
grep -o "allExercises" index-i0xXvbek.js | wc -l
'''
stdin, stdout, stderr = ssh.exec_command(cmd)
print(stdout.read().decode())
print(stderr.read().decode())

ssh.close()
