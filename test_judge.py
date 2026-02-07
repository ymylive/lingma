#!/usr/bin/env python3
import requests
import json

print("🔍 测试判题服务...")

# 测试健康检查
url = "http://lingma.cornna.xyz/api/health"
try:
    r = requests.get(url, timeout=10)
    print(f"健康检查: {r.json()}")
except Exception as e:
    print(f"健康检查失败: {e}")

# 测试判题
url = "http://lingma.cornna.xyz/api/judge"
payload = {
    "code": """#include <stdio.h>
int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d\\n", a + b);
    return 0;
}""",
    "language": "c",
    "testCases": [
        {"input": "1 2", "expectedOutput": "3"},
        {"input": "10 20", "expectedOutput": "30"},
        {"input": "-5 5", "expectedOutput": "0"}
    ]
}

try:
    r = requests.post(url, json=payload, timeout=30)
    data = r.json()
    print(f"\n判题结果:")
    print(json.dumps(data, ensure_ascii=False, indent=2))
except Exception as e:
    print(f"判题失败: {e}")
