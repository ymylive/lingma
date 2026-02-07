import re

# 需要修复的重复ID（排除BLANK开头的）
duplicates = [
    'tree-max-depth',
    'tree-invert', 
    'dp-climb-stairs',
    'dp-coin-change',
    'dp-lis',
    'str-palindrome',
    'str-longest-palindrome',
    'bt-subsets',
    'bt-word-search',
    'dp-lcs',
    'dp-edit-distance',
    'dp-knapsack-01',
    'll-merge-sorted'
]

with open('src/data/exercises.ts', 'r', encoding='utf8') as f:
    content = f.read()

# 对每个重复ID，找到第二次出现并添加后缀
for dup_id in duplicates:
    # 找到所有出现的位置
    pattern = f"id:\\s*'{dup_id}'"
    matches = list(re.finditer(pattern, content))
    
    if len(matches) >= 2:
        # 从后往前替换，避免位置偏移
        for i, match in enumerate(reversed(matches[1:]), 1):  # 跳过第一个
            old = match.group()
            new = f"id: '{dup_id}-v{i+1}'"
            # 替换这个特定位置
            content = content[:match.start()] + new + content[match.end():]
            print(f"修复: {dup_id} -> {dup_id}-v{i+1}")

with open('src/data/exercises.ts', 'w', encoding='utf8') as f:
    f.write(content)

print("\n修复完成！")
