import re

with open('src/data/exercises.ts', 'r', encoding='utf8') as f:
    content = f.read()

with open('src/data/classicExercises.ts', 'r', encoding='utf8') as f:
    content += f.read()

ids = re.findall(r"id:\s*['\"`]([^'\"`]+)['\"`]", content)
print(f"总ID数: {len(ids)}")

# 检查重复
from collections import Counter
counter = Counter(ids)
duplicates = [(id, count) for id, count in counter.items() if count > 1]

if duplicates:
    print(f"\n重复的ID ({len(duplicates)}个):")
    for id, count in duplicates:
        print(f"  {id}: {count}次")
else:
    print("没有重复ID")

print(f"\n唯一ID数: {len(set(ids))}")
