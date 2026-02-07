#!/usr/bin/env python3
# 测试 ModelScope AI API 是否正常工作

import requests
import json

# 测试代理服务
print("🔍 测试 AI 代理服务...")
url = "https://lingma.cornna.xyz/api/ai"

payload = {
    "messages": [
        {"role": "user", "content": "你好，请简单回复一句话"}
    ]
}

try:
    response = requests.post(url, json=payload, timeout=60)
    print(f"状态码: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        if 'choices' in data and len(data['choices']) > 0:
            content = data['choices'][0].get('message', {}).get('content', '')
            print(f"✅ AI 响应: {content[:200]}...")
        else:
            print(f"⚠️ 响应格式: {json.dumps(data, ensure_ascii=False)[:300]}")
    else:
        print(f"❌ 错误: {response.text[:300]}")
        
except Exception as e:
    print(f"❌ 请求失败: {e}")
