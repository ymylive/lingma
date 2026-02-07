import re

with open('src/data/exercises.ts', 'r', encoding='utf8') as f:
    content = f.read()

# 找到allExercises中展开的所有数组
match = re.search(r'export const allExercises.*?\[([\s\S]*?)\];', content)
if match:
    arrays_content = match.group(1)
    arrays = re.findall(r'\.\.\.(\w+)', arrays_content)
    print(f"allExercises包含 {len(arrays)} 个数组:")
    
    total = 0
    for arr_name in arrays:
        # 找到每个数组定义并计算题目数
        pattern = rf'export const {arr_name}:\s*Exercise\[\]\s*=\s*\[([\s\S]*?)\];'
        arr_match = re.search(pattern, content)
        if arr_match:
            arr_content = arr_match.group(1)
            # 计算id字段数量
            count = len(re.findall(r"id:\s*['\"`]", arr_content))
            print(f"  {arr_name}: {count}题")
            total += count
        else:
            print(f"  {arr_name}: 未找到定义!")
    
    print(f"\n总计: {total}题")
