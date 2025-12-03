import paramiko
import os

HOST = '8.134.33.19'
USER = 'root'
PASSWORD = 'Qq159741'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASSWORD)
sftp = ssh.open_sftp()

def upload_dir(local_dir, remote_dir):
    try:
        sftp.mkdir(remote_dir)
    except:
        pass
    for item in os.listdir(local_dir):
        local_path = os.path.join(local_dir, item)
        remote_path = f'{remote_dir}/{item}'
        if os.path.isfile(local_path):
            print(f'📤 {item}')
            sftp.put(local_path, remote_path)
        elif os.path.isdir(local_path):
            upload_dir(local_path, remote_path)

print('📤 上传前端文件...')
base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
upload_dir(os.path.join(base, 'dist'), '/var/www/lingma')

sftp.close()
ssh.close()
print('✅ 上传完成!')
