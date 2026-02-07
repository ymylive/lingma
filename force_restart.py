import paramiko
import time

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('8.134.33.19', username='root', password='Qq159741')

print("杀掉所有node进程...")
ssh.exec_command('pkill -9 node')
ssh.exec_command('pm2 kill')
time.sleep(2)

print("重新启动systemd服务...")
stdin, stdout, stderr = ssh.exec_command('systemctl restart lingma-api')
time.sleep(4)

print("检查服务状态...")
stdin, stdout, stderr = ssh.exec_command('systemctl status lingma-api --no-pager')
print(stdout.read().decode()[:800])

print("\n测试健康检查...")
stdin, stdout, stderr = ssh.exec_command('curl -s http://localhost:3001/api/health')
health = stdout.read().decode()
print("Health:", health)

# 测试Java判题
print("\n测试Java判题（多行输入）...")
import json
test_data = {
    "code": """import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int sum = 0;
        for (int i = 0; i < n; i++) {
            sum += sc.nextInt();
        }
        System.out.println(sum);
    }
}""",
    "language": "java",
    "testCases": [
        {"input": "3\n1 2 3", "expectedOutput": "6"},
        {"input": "2\n10 20", "expectedOutput": "30"}
    ]
}
cmd = f"curl -s -X POST http://localhost:3001/api/judge -H 'Content-Type: application/json' -d '{json.dumps(test_data)}'"
stdin, stdout, stderr = ssh.exec_command(cmd)
print(stdout.read().decode())

ssh.close()
