import re

# 源码
with open('src/data/exercises.ts', 'r', encoding='utf8') as f:
    src = f.read()

src_ids = re.findall(r"id:\s*'([^']+)'", src)
print(f"源码题目数: {len(src_ids)}")

# dist
with open('dist/assets/index-i0xXvbek.js', 'r', encoding='utf8', errors='ignore') as f:
    dist = f.read()

# 检查新题目是否在dist中
new_ids = ['exam-remove-element', 'exam-remove-duplicates', 'exam-sorted-squares']
for id in new_ids:
    if id in dist:
        print(f"✓ {id} 存在于dist")
    else:
        print(f"✗ {id} 不存在于dist")
