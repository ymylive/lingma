import type { Exercise } from '../exercises';

// ==================== 字符串 ====================
export const stringExercises: Exercise[] = [
  {
    id: 'str-reverse', category: '字符串', title: '反转字符串', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组char[]的形式给出。
不要给另外的数组分配额外的空间，你必须原地修改输入数组、使用O(1)的额外空间解决。

【输入格式】
一行字符串 s

【输出格式】
输出反转后的字符串

【数据范围】
- 1 ≤ s.length ≤ 10^5
- s 由可打印的 ASCII 字符组成`,
    templates: {
      cpp: `void reverseString(vector<char>& s) {\n    // 请实现\n}`,
      java: `void reverseString(char[] s) {\n    // 请实现\n}`,
      python: `def reverse_string(s):\n    pass`
    },
    solutions: {
      cpp: `void reverseString(vector<char>& s) {\n    int l = 0, r = s.size() - 1;\n    while (l < r) {\n        swap(s[l], s[r]);\n        l++; r--;\n    }\n}`,
      java: `void reverseString(char[] s) {\n    int l = 0, r = s.length - 1;\n    while (l < r) {\n        char t = s[l]; s[l] = s[r]; s[r] = t;\n        l++; r--;\n    }\n}`,
      python: `def reverse_string(s):\n    l, r = 0, len(s) - 1\n    while l < r:\n        s[l], s[r] = s[r], s[l]\n        l += 1; r -= 1`
    },
    testCases: [{ input: 'hello', expectedOutput: 'olleh', description: '反转' }],
    hints: ['双指针', '首尾交换'],
    explanation: `【双指针法】O(n)时间，O(1)空间
- 左指针从头开始，右指针从尾开始
- 交换两个指针指向的字符
- 两指针向中间移动，直到相遇`
  },
  {
    id: 'str-palindrome', category: '字符串', title: '验证回文串', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
给定一个字符串，判断它是否是回文串。
只考虑字母和数字字符，忽略字母的大小写。

【输入格式】
一行字符串 s (1 ≤ s.length ≤ 2 × 10^5)

【输出格式】
输出 true 或 false

【数据范围】
- 1 ≤ s.length ≤ 2 × 10^5
- s 由 ASCII 字符组成`,
    templates: {
      cpp: `bool isPalindrome(string s) {\n    // 请实现\n}`,
      java: `boolean isPalindrome(String s) {\n    // 请实现\n}`,
      python: `def is_palindrome(s):\n    pass`
    },
    solutions: {
      cpp: `bool isPalindrome(string s) {\n    int l = 0, r = s.size() - 1;\n    while (l < r) {\n        while (l < r && !isalnum(s[l])) l++;\n        while (l < r && !isalnum(s[r])) r--;\n        if (tolower(s[l]) != tolower(s[r])) return false;\n        l++; r--;\n    }\n    return true;\n}`,
      java: `boolean isPalindrome(String s) {\n    int l = 0, r = s.length() - 1;\n    while (l < r) {\n        while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;\n        while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;\n        if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r)))\n            return false;\n        l++; r--;\n    }\n    return true;\n}`,
      python: `def is_palindrome(s):\n    l, r = 0, len(s) - 1\n    while l < r:\n        while l < r and not s[l].isalnum(): l += 1\n        while l < r and not s[r].isalnum(): r -= 1\n        if s[l].lower() != s[r].lower(): return False\n        l += 1; r -= 1\n    return True`
    },
    testCases: [{ input: 'A man, a plan, a canal: Panama', expectedOutput: 'true', description: '是回文' }],
    hints: ['双指针', '跳过非字母数字字符', '忽略大小写比较'],
    explanation: `【回文】正读反读都一样
【双指针法】
- 左右指针向中间移动
- 跳过非字母数字字符
- 比较时忽略大小写`
  },
  {
    id: 'str-longest-palindrome', category: '字符串', title: '最长回文子串', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给定一个字符串s，找到s中最长的回文子串。

【输入格式】
一行字符串 s (1 ≤ s.length ≤ 1000)

【输出格式】
输出最长回文子串

【数据范围】
- 1 ≤ s.length ≤ 1000
- s 仅由数字和英文字母组成`,
    templates: {
      c: `char* longestPalindrome(char* s) {\n    // 请实现\n}`,
      cpp: `string longestPalindrome(string s) {\n    // 请实现\n}`,
      java: `String longestPalindrome(String s) {\n    // 请实现\n}`,
      python: `def longest_palindrome(s):\n    pass`
    },
    solutions: {
      c: `char* longestPalindrome(char* s) {\n    int n = strlen(s), start = 0, maxLen = 1;\n    for (int i = 0; i < n; i++) {\n        // 奇数长度\n        int l = i, r = i;\n        while (l >= 0 && r < n && s[l] == s[r]) { l--; r++; }\n        if (r - l - 1 > maxLen) { maxLen = r - l - 1; start = l + 1; }\n        // 偶数长度\n        l = i; r = i + 1;\n        while (l >= 0 && r < n && s[l] == s[r]) { l--; r++; }\n        if (r - l - 1 > maxLen) { maxLen = r - l - 1; start = l + 1; }\n    }\n    char* res = (char*)malloc(maxLen + 1);\n    strncpy(res, s + start, maxLen);\n    res[maxLen] = '\\0';\n    return res;\n}`,
      cpp: `string longestPalindrome(string s) {\n    int n = s.size(), start = 0, maxLen = 1;\n    auto expand = [&](int l, int r) {\n        while (l >= 0 && r < n && s[l] == s[r]) { l--; r++; }\n        if (r - l - 1 > maxLen) { maxLen = r - l - 1; start = l + 1; }\n    };\n    for (int i = 0; i < n; i++) {\n        expand(i, i);     // 奇数长度\n        expand(i, i + 1); // 偶数长度\n    }\n    return s.substr(start, maxLen);\n}`,
      java: `String longestPalindrome(String s) {\n    int start = 0, maxLen = 1;\n    for (int i = 0; i < s.length(); i++) {\n        int len1 = expand(s, i, i);\n        int len2 = expand(s, i, i + 1);\n        int len = Math.max(len1, len2);\n        if (len > maxLen) {\n            maxLen = len;\n            start = i - (len - 1) / 2;\n        }\n    }\n    return s.substring(start, start + maxLen);\n}\nint expand(String s, int l, int r) {\n    while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }\n    return r - l - 1;\n}`,
      python: `def longest_palindrome(s):\n    def expand(l, r):\n        while l >= 0 and r < len(s) and s[l] == s[r]:\n            l -= 1; r += 1\n        return l + 1, r - l - 1\n    start, max_len = 0, 1\n    for i in range(len(s)):\n        for l, r in [(i, i), (i, i + 1)]:\n            st, length = expand(l, r)\n            if length > max_len:\n                start, max_len = st, length\n    return s[start:start + max_len]`
    },
    testCases: [{ input: 'babad', expectedOutput: 'bab', description: '最长回文子串' }],
    hints: ['中心扩展法', '每个位置作为中心向两边扩展', '注意奇偶长度'],
    explanation: `【中心扩展法】O(n²)
- 回文串有两种：奇数长度(aba)和偶数长度(abba)
- 枚举每个中心点，向两边扩展
- 记录最长的回文子串`
  },
  {
    id: 'str-atoi', category: '字符串', title: '字符串转整数(atoi)', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
实现myAtoi(string s)函数，将字符串转换为32位有符号整数。
规则：
1. 跳过前导空格
2. 处理可选的正负号
3. 读取数字直到非数字字符或结尾
4. 超出范围返回边界值

【输入格式】
一行字符串 s

【输出格式】
输出转换后的整数

【数据范围】
- 0 ≤ s.length ≤ 200
- 结果在 [-2^31, 2^31-1] 范围内`,
    templates: {
      c: `int myAtoi(char* s) {\n    // 请实现\n}`,
      cpp: `int myAtoi(string s) {\n    // 请实现\n}`,
      java: `int myAtoi(String s) {\n    // 请实现\n}`,
      python: `def my_atoi(s):\n    pass`
    },
    solutions: {
      c: `int myAtoi(char* s) {\n    int i = 0, sign = 1;\n    long res = 0;\n    while (s[i] == ' ') i++;\n    if (s[i] == '-' || s[i] == '+') sign = s[i++] == '-' ? -1 : 1;\n    while (s[i] >= '0' && s[i] <= '9') {\n        res = res * 10 + (s[i++] - '0');\n        if (res * sign > 2147483647) return 2147483647;\n        if (res * sign < -2147483648) return -2147483648;\n    }\n    return (int)(res * sign);\n}`,
      cpp: `int myAtoi(string s) {\n    int i = 0, sign = 1;\n    long res = 0;\n    while (i < s.size() && s[i] == ' ') i++;\n    if (i < s.size() && (s[i] == '-' || s[i] == '+'))\n        sign = s[i++] == '-' ? -1 : 1;\n    while (i < s.size() && isdigit(s[i])) {\n        res = res * 10 + (s[i++] - '0');\n        if (res * sign > INT_MAX) return INT_MAX;\n        if (res * sign < INT_MIN) return INT_MIN;\n    }\n    return res * sign;\n}`,
      java: `int myAtoi(String s) {\n    int i = 0, sign = 1;\n    long res = 0;\n    s = s.trim();\n    if (s.isEmpty()) return 0;\n    if (s.charAt(0) == '-' || s.charAt(0) == '+') {\n        sign = s.charAt(0) == '-' ? -1 : 1;\n        i++;\n    }\n    while (i < s.length() && Character.isDigit(s.charAt(i))) {\n        res = res * 10 + (s.charAt(i++) - '0');\n        if (res * sign > Integer.MAX_VALUE) return Integer.MAX_VALUE;\n        if (res * sign < Integer.MIN_VALUE) return Integer.MIN_VALUE;\n    }\n    return (int)(res * sign);\n}`,
      python: `def my_atoi(s):\n    s = s.strip()\n    if not s: return 0\n    sign, i, res = 1, 0, 0\n    if s[0] in ['-', '+']:\n        sign = -1 if s[0] == '-' else 1\n        i = 1\n    while i < len(s) and s[i].isdigit():\n        res = res * 10 + int(s[i])\n        i += 1\n    res *= sign\n    return max(-2**31, min(2**31 - 1, res))`
    },
    testCases: [{ input: '   -42', expectedOutput: '-42', description: '处理空格和符号' }],
    hints: ['去除前导空格', '处理正负号', '逐位转换', '注意溢出'],
    explanation: `【atoi实现步骤】
1. 跳过前导空格
2. 处理正负号
3. 逐位转换数字
4. 处理溢出（超出32位范围返回边界值）`
  },
  {
    id: 'str-common-prefix', category: '字符串', title: '最长公共前缀', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
编写一个函数来查找字符串数组中的最长公共前缀。
如果不存在公共前缀，返回空字符串。

【输入格式】
第一行：整数n，表示字符串数量
第二行：n个空格分隔的字符串

【输出格式】
输出最长公共前缀

【数据范围】
- 1 ≤ n ≤ 200
- 0 ≤ strs[i].length ≤ 200`,
    templates: {
      c: `char* longestCommonPrefix(char** strs, int n) {\n    // 请实现\n}`,
      cpp: `string longestCommonPrefix(vector<string>& strs) {\n    // 请实现\n}`,
      java: `String longestCommonPrefix(String[] strs) {\n    // 请实现\n}`,
      python: `def longest_common_prefix(strs):\n    pass`
    },
    solutions: {
      c: `char* longestCommonPrefix(char** strs, int n) {\n    if (n == 0) return "";\n    for (int i = 0; strs[0][i]; i++) {\n        for (int j = 1; j < n; j++) {\n            if (strs[j][i] != strs[0][i]) {\n                char* res = (char*)malloc(i + 1);\n                strncpy(res, strs[0], i);\n                res[i] = '\\0';\n                return res;\n            }\n        }\n    }\n    return strs[0];\n}`,
      cpp: `string longestCommonPrefix(vector<string>& strs) {\n    if (strs.empty()) return "";\n    for (int i = 0; i < strs[0].size(); i++) {\n        for (int j = 1; j < strs.size(); j++) {\n            if (i >= strs[j].size() || strs[j][i] != strs[0][i])\n                return strs[0].substr(0, i);\n        }\n    }\n    return strs[0];\n}`,
      java: `String longestCommonPrefix(String[] strs) {\n    if (strs.length == 0) return "";\n    for (int i = 0; i < strs[0].length(); i++) {\n        char c = strs[0].charAt(i);\n        for (int j = 1; j < strs.length; j++) {\n            if (i >= strs[j].length() || strs[j].charAt(i) != c)\n                return strs[0].substring(0, i);\n        }\n    }\n    return strs[0];\n}`,
      python: `def longest_common_prefix(strs):\n    if not strs: return ""\n    for i, c in enumerate(strs[0]):\n        for s in strs[1:]:\n            if i >= len(s) or s[i] != c:\n                return strs[0][:i]\n    return strs[0]`
    },
    testCases: [{ input: '3\nflower flow flight', expectedOutput: 'fl', description: '公共前缀' }],
    hints: ['纵向扫描', '以第一个字符串为基准', '逐个字符比较'],
    explanation: `【纵向扫描法】
- 以第一个字符串为基准
- 逐个位置比较所有字符串的字符
- 遇到不同或超出长度就返回`
  },
  {
    id: 'str-kmp', category: '字符串', title: 'KMP字符串匹配', difficulty: 'hard', type: 'coding',
    description: '实现KMP算法，在文本串中查找模式串第一次出现的位置',
    templates: {
      c: `int kmp(char* text, char* pattern) {\n    // 请实现KMP算法\n}`,
      cpp: `int kmp(string text, string pattern) {\n    // 请实现KMP算法\n}`,
      java: `int kmp(String text, String pattern) {\n    // 请实现KMP算法\n}`,
      python: `def kmp(text, pattern):\n    pass`
    },
    solutions: {
      c: `void getNext(char* p, int* next, int m) {\n    next[0] = -1;\n    int k = -1, j = 0;\n    while (j < m - 1) {\n        if (k == -1 || p[j] == p[k]) {\n            k++; j++;\n            next[j] = k;\n        } else k = next[k];\n    }\n}\nint kmp(char* t, char* p) {\n    int n = strlen(t), m = strlen(p);\n    int* next = (int*)malloc(m * sizeof(int));\n    getNext(p, next, m);\n    int i = 0, j = 0;\n    while (i < n && j < m) {\n        if (j == -1 || t[i] == p[j]) { i++; j++; }\n        else j = next[j];\n    }\n    free(next);\n    return j == m ? i - j : -1;\n}`,
      cpp: `int kmp(string t, string p) {\n    int n = t.size(), m = p.size();\n    vector<int> next(m, 0);\n    // 构建next数组\n    for (int i = 1, j = 0; i < m; i++) {\n        while (j > 0 && p[i] != p[j]) j = next[j - 1];\n        if (p[i] == p[j]) j++;\n        next[i] = j;\n    }\n    // 匹配\n    for (int i = 0, j = 0; i < n; i++) {\n        while (j > 0 && t[i] != p[j]) j = next[j - 1];\n        if (t[i] == p[j]) j++;\n        if (j == m) return i - m + 1;\n    }\n    return -1;\n}`,
      java: `int kmp(String t, String p) {\n    int n = t.length(), m = p.length();\n    int[] next = new int[m];\n    for (int i = 1, j = 0; i < m; i++) {\n        while (j > 0 && p.charAt(i) != p.charAt(j)) j = next[j - 1];\n        if (p.charAt(i) == p.charAt(j)) j++;\n        next[i] = j;\n    }\n    for (int i = 0, j = 0; i < n; i++) {\n        while (j > 0 && t.charAt(i) != p.charAt(j)) j = next[j - 1];\n        if (t.charAt(i) == p.charAt(j)) j++;\n        if (j == m) return i - m + 1;\n    }\n    return -1;\n}`,
      python: `def kmp(t, p):\n    n, m = len(t), len(p)\n    # 构建next数组\n    next = [0] * m\n    j = 0\n    for i in range(1, m):\n        while j > 0 and p[i] != p[j]: j = next[j - 1]\n        if p[i] == p[j]: j += 1\n        next[i] = j\n    # 匹配\n    j = 0\n    for i in range(n):\n        while j > 0 and t[i] != p[j]: j = next[j - 1]\n        if t[i] == p[j]: j += 1\n        if j == m: return i - m + 1\n    return -1`
    },
    testCases: [{ input: 'ABABDABACDABABCABAB\nABABCABAB', expectedOutput: '10', description: '第一次出现位置' }],
    hints: ['构建next数组', 'next[i]表示p[0..i]的最长相同前后缀', '失配时利用next跳转'],
    explanation: `【KMP算法】O(n+m)时间复杂度
【核心思想】利用已匹配的信息，避免重复比较
【next数组】next[i]=p[0..i]的最长相同前后缀长度
【匹配过程】失配时，模式串跳到next[j-1]位置继续匹配`
  },
  {
    id: 'str-multiply', category: '字符串', title: '字符串相乘', difficulty: 'medium', type: 'coding',
    description: '给定两个以字符串形式表示的非负整数，返回它们的乘积（不能直接转换为整数）',
    templates: {
      c: `char* multiply(char* num1, char* num2) {\n    // 请实现\n}`,
      cpp: `string multiply(string num1, string num2) {\n    // 请实现\n}`,
      java: `String multiply(String num1, String num2) {\n    // 请实现\n}`,
      python: `def multiply(num1, num2):\n    pass`
    },
    solutions: {
      c: `char* multiply(char* num1, char* num2) {\n    int n1 = strlen(num1), n2 = strlen(num2);\n    int* res = (int*)calloc(n1 + n2, sizeof(int));\n    for (int i = n1 - 1; i >= 0; i--) {\n        for (int j = n2 - 1; j >= 0; j--) {\n            int mul = (num1[i] - '0') * (num2[j] - '0');\n            int p1 = i + j, p2 = i + j + 1;\n            int sum = mul + res[p2];\n            res[p2] = sum % 10;\n            res[p1] += sum / 10;\n        }\n    }\n    char* str = (char*)malloc(n1 + n2 + 1);\n    int k = 0, i = 0;\n    while (i < n1 + n2 && res[i] == 0) i++;\n    if (i == n1 + n2) return "0";\n    while (i < n1 + n2) str[k++] = res[i++] + '0';\n    str[k] = '\\0';\n    free(res);\n    return str;\n}`,
      cpp: `string multiply(string num1, string num2) {\n    int n1 = num1.size(), n2 = num2.size();\n    vector<int> res(n1 + n2, 0);\n    for (int i = n1 - 1; i >= 0; i--) {\n        for (int j = n2 - 1; j >= 0; j--) {\n            int mul = (num1[i] - '0') * (num2[j] - '0');\n            int p1 = i + j, p2 = i + j + 1;\n            int sum = mul + res[p2];\n            res[p2] = sum % 10;\n            res[p1] += sum / 10;\n        }\n    }\n    string str;\n    for (int x : res) if (!(str.empty() && x == 0)) str += (x + '0');\n    return str.empty() ? "0" : str;\n}`,
      java: `String multiply(String num1, String num2) {\n    int n1 = num1.length(), n2 = num2.length();\n    int[] res = new int[n1 + n2];\n    for (int i = n1 - 1; i >= 0; i--) {\n        for (int j = n2 - 1; j >= 0; j--) {\n            int mul = (num1.charAt(i) - '0') * (num2.charAt(j) - '0');\n            int p1 = i + j, p2 = i + j + 1;\n            int sum = mul + res[p2];\n            res[p2] = sum % 10;\n            res[p1] += sum / 10;\n        }\n    }\n    StringBuilder sb = new StringBuilder();\n    for (int x : res) if (!(sb.length() == 0 && x == 0)) sb.append(x);\n    return sb.length() == 0 ? "0" : sb.toString();\n}`,
      python: `def multiply(num1, num2):\n    n1, n2 = len(num1), len(num2)\n    res = [0] * (n1 + n2)\n    for i in range(n1 - 1, -1, -1):\n        for j in range(n2 - 1, -1, -1):\n            mul = int(num1[i]) * int(num2[j])\n            p1, p2 = i + j, i + j + 1\n            total = mul + res[p2]\n            res[p2] = total % 10\n            res[p1] += total // 10\n    result = ''.join(map(str, res)).lstrip('0')\n    return result if result else '0'`
    },
    testCases: [{ input: '123\n456', expectedOutput: '56088', description: '123*456' }],
    hints: ['模拟竖式乘法', 'num1[i]*num2[j]结果在位置[i+j, i+j+1]', '处理进位'],
    explanation: `【竖式乘法模拟】
- num1[i] * num2[j] 的结果位于 res[i+j] 和 res[i+j+1]
- 逐位相乘，累加到对应位置
- 处理进位`
  },
  {
    id: 'str-kmp-blank', category: '字符串', title: 'KMP的next数组填空', difficulty: 'medium', type: 'fillblank',
    description: '完成KMP算法中next数组的构建',
    codeTemplate: {
      cpp: `// next[i] = pattern[0..i]的最长相同前后缀长度
void buildNext(string p, vector<int>& next) {
    int m = p.size();
    next[0] = ___BLANK1___;  // 第一个位置
    for (int i = 1, j = 0; i < m; i++) {
        while (j > 0 && p[i] != p[j])
            j = ___BLANK2___;  // 失配时回退
        if (p[i] == p[j])
            ___BLANK3___;  // 匹配成功
        next[i] = j;
    }
}`,
      java: `同上`,
      python: `# next[i] = pattern[0..i]的最长相同前后缀长度
def build_next(p):
    m = len(p)
    next = [___BLANK1___] * m  # 初始化
    j = 0
    for i in range(1, m):
        while j > 0 and p[i] != p[j]:
            j = ___BLANK2___  # 失配时回退
        if p[i] == p[j]:
            ___BLANK3___  # 匹配成功
        next[i] = j
    return next`
    },
    blanks: [
      { id: 'BLANK1', answer: '0', hint: '单个字符没有真前后缀' },
      { id: 'BLANK2', answer: 'next[j - 1]|next[j-1]', hint: '利用已计算的next值回退' },
      { id: 'BLANK3', answer: 'j++', hint: '前后缀长度+1' }
    ],
    explanation: `【next数组含义】next[i] = p[0..i]最长相同前后缀的长度
例如：p = "ABABC"
- next[0] = 0 (A没有真前后缀)
- next[1] = 0 (AB没有相同前后缀)
- next[2] = 1 (ABA，前缀A=后缀A)
- next[3] = 2 (ABAB，前缀AB=后缀AB)
- next[4] = 0 (ABABC没有相同前后缀)`
  },
  {
    id: 'str-palindrome-blank', category: '字符串', title: '回文判断填空', difficulty: 'easy', type: 'fillblank',
    description: '完成判断字符串是否为回文的代码',
    codeTemplate: {
      cpp: `bool isPalindrome(string s) {
    int l = ___BLANK1___;
    int r = ___BLANK2___;
    while (l < r) {
        if (s[l] != s[r])
            return ___BLANK3___;
        l++;
        r--;
    }
    return ___BLANK4___;
}`,
      java: `同上`,
      python: `def is_palindrome(s):
    l = ___BLANK1___
    r = ___BLANK2___
    while l < r:
        if s[l] != s[r]:
            return ___BLANK3___
        l += 1
        r -= 1
    return ___BLANK4___`
    },
    blanks: [
      { id: 'BLANK1', answer: '0', hint: '左指针从头开始' },
      { id: 'BLANK2', answer: 's.size() - 1|s.length() - 1|len(s) - 1', hint: '右指针从尾开始' },
      { id: 'BLANK3', answer: 'false|False', hint: '发现不同，不是回文' },
      { id: 'BLANK4', answer: 'true|True', hint: '全部匹配，是回文' }
    ],
    explanation: `【回文】正读反读都一样，如 "aba", "abba"
【双指针法】
- 左指针从头，右指针从尾
- 向中间移动，逐个比较
- 全部相同则是回文`
  },
  {
    id: 'str-reverse-words', category: '字符串', title: '翻转字符串中的单词', difficulty: 'medium', type: 'coding',
    description: '翻转字符串中的单词顺序（单词由空格分隔）',
    templates: {
      c: `char* reverseWords(char* s) {\n    // 请实现\n}`,
      cpp: `string reverseWords(string s) {\n    // 请实现\n}`,
      java: `String reverseWords(String s) {\n    // 请实现\n}`,
      python: `def reverse_words(s):\n    pass`
    },
    solutions: {
      c: `char* reverseWords(char* s) {\n    // 简化版：分割后逆序拼接\n    int n = strlen(s);\n    char* res = (char*)malloc(n + 1);\n    int k = 0, j = n - 1;\n    while (j >= 0) {\n        while (j >= 0 && s[j] == ' ') j--;\n        int end = j;\n        while (j >= 0 && s[j] != ' ') j--;\n        if (end >= 0) {\n            if (k > 0) res[k++] = ' ';\n            for (int i = j + 1; i <= end; i++) res[k++] = s[i];\n        }\n    }\n    res[k] = '\\0';\n    return res;\n}`,
      cpp: `string reverseWords(string s) {\n    vector<string> words;\n    stringstream ss(s);\n    string word;\n    while (ss >> word) words.push_back(word);\n    reverse(words.begin(), words.end());\n    string res;\n    for (int i = 0; i < words.size(); i++) {\n        if (i > 0) res += " ";\n        res += words[i];\n    }\n    return res;\n}`,
      java: `String reverseWords(String s) {\n    String[] words = s.trim().split("\\\\s+");\n    StringBuilder sb = new StringBuilder();\n    for (int i = words.length - 1; i >= 0; i--) {\n        sb.append(words[i]);\n        if (i > 0) sb.append(" ");\n    }\n    return sb.toString();\n}`,
      python: `def reverse_words(s):\n    return ' '.join(s.split()[::-1])`
    },
    testCases: [{ input: 'the sky is blue', expectedOutput: 'blue is sky the', description: '翻转单词顺序' }],
    hints: ['分割单词', '逆序拼接', '处理多余空格'],
    explanation: `【方法】
1. 按空格分割成单词列表
2. 翻转列表
3. 用空格连接
【注意】去除首尾空格，处理多个连续空格`
  },
];

// ==================== 双指针 ====================
export const twoPointerExercises: Exercise[] = [
  {
    id: 'tp-two-sum-sorted', category: '双指针', title: '两数之和II(有序数组)', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
给定一个已按升序排列的整数数组 numbers，请找出两个数使得它们的和等于目标值 target。
返回这两个数的下标（下标从1开始）。

【输入格式】
第一行：整数 n，表示数组长度 (2 ≤ n ≤ 3×10^4)
第二行：n 个升序整数，空格分隔
第三行：整数 target，表示目标值

【输出格式】
输出一行，两个整数表示下标（从1开始），空格分隔

【数据范围】
- 2 ≤ n ≤ 3×10^4
- -1000 ≤ numbers[i] ≤ 1000
- 保证有且仅有一个有效答案
- 不能使用相同元素`,
    templates: {
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int nums[30005];\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    int target;\n    scanf("%d", &target);\n    \n    // TODO: 使用双指针查找，输出两个下标(1-indexed)\n    \n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int target;\n    cin >> target;\n    \n    // TODO: 使用双指针查找，输出两个下标(1-indexed)\n    \n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        \n        // TODO: 使用双指针查找，输出两个下标(1-indexed)\n        \n        sc.close();\n    }\n}`,
      python: `n = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\n\n# TODO: 使用双指针查找，输出两个下标(1-indexed)\n`
    },
    solutions: {
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int nums[30005];\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    int target;\n    scanf("%d", &target);\n    \n    int left = 0, right = n - 1;\n    while (left < right) {\n        int sum = nums[left] + nums[right];\n        if (sum == target) {\n            printf("%d %d\\n", left + 1, right + 1);\n            return 0;\n        } else if (sum < target) {\n            left++;\n        } else {\n            right--;\n        }\n    }\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int target;\n    cin >> target;\n    \n    int left = 0, right = n - 1;\n    while (left < right) {\n        int sum = nums[left] + nums[right];\n        if (sum == target) {\n            cout << left + 1 << " " << right + 1 << endl;\n            return 0;\n        } else if (sum < target) {\n            left++;\n        } else {\n            right--;\n        }\n    }\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        \n        int left = 0, right = n - 1;\n        while (left < right) {\n            int sum = nums[left] + nums[right];\n            if (sum == target) {\n                System.out.println((left + 1) + " " + (right + 1));\n                return;\n            } else if (sum < target) {\n                left++;\n            } else {\n                right--;\n            }\n        }\n        sc.close();\n    }\n}`,
      python: `n = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\n\nleft, right = 0, n - 1\nwhile left < right:\n    s = nums[left] + nums[right]\n    if s == target:\n        print(left + 1, right + 1)\n        break\n    elif s < target:\n        left += 1\n    else:\n        right -= 1`
    },
    testCases: [
      { input: '4\n2 7 11 15\n9', expectedOutput: '1 2', description: '基本测试：2+7=9' },
      { input: '3\n2 3 4\n6', expectedOutput: '1 3', description: '首尾元素' },
      { input: '2\n-1 0\n-1', expectedOutput: '1 2', description: '负数测试' }
    ],
    hints: ['数组有序，可用双指针', '左右指针向中间逼近', '和太小移左指针，和太大移右指针'],
    explanation: `【解题思路】

双指针法（利用数组有序性）：
1. 初始化 left = 0, right = n - 1
2. 计算 sum = nums[left] + nums[right]
3. 如果 sum == target，找到答案
4. 如果 sum < target，left++ (需要更大的数)
5. 如果 sum > target，right-- (需要更小的数)

【为什么正确？】
数组有序，当sum太小时增大左边，sum太大时减小右边

【时间复杂度】O(n)
【空间复杂度】O(1)`
  },
  {
    id: 'tp-container-water', category: '双指针', title: '盛最多水的容器', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给你 n 个非负整数 a1, a2, ..., an，每个数代表坐标中的一个点 (i, ai)。
在坐标内画 n 条垂直线，垂直线 i 的两个端点分别为 (i, 0) 和 (i, ai)。
找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。

【输入格式】
第一行：整数 n，表示垂直线数量 (2 ≤ n ≤ 10^5)
第二行：n 个非负整数，表示每条垂直线的高度，空格分隔

【输出格式】
输出一个整数，表示容器能容纳的最大水量

【数据范围】
- 2 ≤ n ≤ 10^5
- 0 ≤ height[i] ≤ 10^4`,
    templates: {
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int height[100005];\n    for (int i = 0; i < n; i++) scanf("%d", &height[i]);\n    \n    // TODO: 双指针求最大水量\n    \n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> height(n);\n    for (int i = 0; i < n; i++) cin >> height[i];\n    \n    // TODO: 双指针求最大水量\n    \n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] height = new int[n];\n        for (int i = 0; i < n; i++) height[i] = sc.nextInt();\n        \n        // TODO: 双指针求最大水量\n        \n        sc.close();\n    }\n}`,
      python: `n = int(input())\nheight = list(map(int, input().split()))\n\n# TODO: 双指针求最大水量\n`
    },
    solutions: {
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int height[100005];\n    for (int i = 0; i < n; i++) scanf("%d", &height[i]);\n    \n    int left = 0, right = n - 1;\n    int maxArea = 0;\n    while (left < right) {\n        int h = height[left] < height[right] ? height[left] : height[right];\n        int area = h * (right - left);\n        if (area > maxArea) maxArea = area;\n        if (height[left] < height[right]) left++;\n        else right--;\n    }\n    printf("%d\\n", maxArea);\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> height(n);\n    for (int i = 0; i < n; i++) cin >> height[i];\n    \n    int left = 0, right = n - 1;\n    int maxArea = 0;\n    while (left < right) {\n        int h = min(height[left], height[right]);\n        maxArea = max(maxArea, h * (right - left));\n        if (height[left] < height[right]) left++;\n        else right--;\n    }\n    cout << maxArea << endl;\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] height = new int[n];\n        for (int i = 0; i < n; i++) height[i] = sc.nextInt();\n        \n        int left = 0, right = n - 1;\n        int maxArea = 0;\n        while (left < right) {\n            int h = Math.min(height[left], height[right]);\n            maxArea = Math.max(maxArea, h * (right - left));\n            if (height[left] < height[right]) left++;\n            else right--;\n        }\n        System.out.println(maxArea);\n        sc.close();\n    }\n}`,
      python: `n = int(input())\nheight = list(map(int, input().split()))\n\nleft, right = 0, n - 1\nmax_area = 0\nwhile left < right:\n    h = min(height[left], height[right])\n    max_area = max(max_area, h * (right - left))\n    if height[left] < height[right]:\n        left += 1\n    else:\n        right -= 1\nprint(max_area)`
    },
    testCases: [
      { input: '9\n1 8 6 2 5 4 8 3 7', expectedOutput: '49', description: '基本测试：最大面积49' },
      { input: '2\n1 1', expectedOutput: '1', description: '边界：两条线' },
      { input: '4\n1 2 4 3', expectedOutput: '4', description: '非对称情况' }
    ],
    hints: ['面积 = min(height[l], height[r]) × (r - l)', '移动较短的那条边才可能找到更大面积', '移动较长边只会让宽度减小，高度不变或减小'],
    explanation: `【解题思路】

双指针 + 贪心：
1. 初始化左右指针 left = 0, right = n - 1
2. 计算当前面积 = min(height[left], height[right]) × (right - left)
3. 移动较短的那条边（贪心策略）

【为什么移动较短边？】
- 面积由较短边决定
- 移动较长边：宽度减小，高度不变或减小，面积必减小
- 移动较短边：宽度减小，但高度可能增大，面积可能增大

【时间复杂度】O(n)
【空间复杂度】O(1)`
  },
  {
    id: 'tp-move-zeroes', category: '双指针', title: '移动零', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
必须在原数组上操作，不能拷贝额外的数组。

【输入格式】
第一行：整数 n，表示数组长度 (1 ≤ n ≤ 10^4)
第二行：n 个整数，表示数组元素，空格分隔

【输出格式】
输出一行，n 个整数，表示移动后的数组，空格分隔

【数据范围】
- 1 ≤ n ≤ 10^4
- -2^31 ≤ nums[i] ≤ 2^31 - 1`,
    templates: {
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int nums[10005];\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    \n    // TODO: 移动零到末尾\n    \n    for (int i = 0; i < n; i++) {\n        if (i > 0) printf(" ");\n        printf("%d", nums[i]);\n    }\n    printf("\\n");\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    \n    // TODO: 移动零到末尾\n    \n    for (int i = 0; i < n; i++) {\n        if (i > 0) cout << " ";\n        cout << nums[i];\n    }\n    cout << endl;\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        \n        // TODO: 移动零到末尾\n        \n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < n; i++) {\n            if (i > 0) sb.append(" ");\n            sb.append(nums[i]);\n        }\n        System.out.println(sb);\n        sc.close();\n    }\n}`,
      python: `n = int(input())\nnums = list(map(int, input().split()))\n\n# TODO: 移动零到末尾\n\nprint(' '.join(map(str, nums)))`
    },
    solutions: {
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int nums[10005];\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    \n    int slow = 0;\n    for (int fast = 0; fast < n; fast++) {\n        if (nums[fast] != 0) {\n            int tmp = nums[slow];\n            nums[slow] = nums[fast];\n            nums[fast] = tmp;\n            slow++;\n        }\n    }\n    \n    for (int i = 0; i < n; i++) {\n        if (i > 0) printf(" ");\n        printf("%d", nums[i]);\n    }\n    printf("\\n");\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    \n    int slow = 0;\n    for (int fast = 0; fast < n; fast++) {\n        if (nums[fast] != 0) {\n            swap(nums[slow++], nums[fast]);\n        }\n    }\n    \n    for (int i = 0; i < n; i++) {\n        if (i > 0) cout << " ";\n        cout << nums[i];\n    }\n    cout << endl;\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        \n        int slow = 0;\n        for (int fast = 0; fast < n; fast++) {\n            if (nums[fast] != 0) {\n                int tmp = nums[slow];\n                nums[slow] = nums[fast];\n                nums[fast] = tmp;\n                slow++;\n            }\n        }\n        \n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < n; i++) {\n            if (i > 0) sb.append(" ");\n            sb.append(nums[i]);\n        }\n        System.out.println(sb);\n        sc.close();\n    }\n}`,
      python: `n = int(input())\nnums = list(map(int, input().split()))\n\nslow = 0\nfor fast in range(n):\n    if nums[fast] != 0:\n        nums[slow], nums[fast] = nums[fast], nums[slow]\n        slow += 1\n\nprint(' '.join(map(str, nums)))`
    },
    testCases: [
      { input: '5\n0 1 0 3 12', expectedOutput: '1 3 12 0 0', description: '基本测试' },
      { input: '1\n0', expectedOutput: '0', description: '边界：单个零' },
      { input: '3\n1 2 3', expectedOutput: '1 2 3', description: '无零情况' }
    ],
    hints: ['使用快慢双指针', 'slow指向下一个非零元素应该放的位置', 'fast遍历数组，遇到非零就和slow位置交换'],
    explanation: `【解题思路】

快慢双指针：
1. slow 指向下一个非零元素应该放的位置
2. fast 遍历整个数组
3. 遇到非零元素，与 slow 位置交换，slow++

【过程演示】
[0, 1, 0, 3, 12]
 s  f
交换后: [1, 0, 0, 3, 12], s=1, f=1
继续: f=2跳过0, f=3交换: [1, 3, 0, 0, 12], s=2
f=4交换: [1, 3, 12, 0, 0]

【时间复杂度】O(n)
【空间复杂度】O(1)`
  },
];

// ==================== 滑动窗口 ====================
export const slidingWindowExercises: Exercise[] = [
  {
    id: 'sw-longest-substring', category: '滑动窗口', title: '无重复字符的最长子串', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给定一个字符串 s，请你找出其中不含有重复字符的最长子串的长度。

【输入格式】
一行字符串 s (0 ≤ s.length ≤ 5×10^4)，只包含英文字母、数字、符号和空格

【输出格式】
输出一个整数，表示最长无重复字符子串的长度

【数据范围】
- 0 ≤ s.length ≤ 5×10^4
- s 由英文字母、数字、符号和空格组成`,
    templates: {
      c: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[50005];\n    fgets(s, 50005, stdin);\n    int n = strlen(s);\n    if (n > 0 && s[n-1] == '\\n') s[--n] = '\\0';\n    \n    // TODO: 滑动窗口求最长无重复子串\n    \n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    \n    // TODO: 滑动窗口求最长无重复子串\n    \n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        \n        // TODO: 滑动窗口求最长无重复子串\n        \n        sc.close();\n    }\n}`,
      python: `s = input()\n\n# TODO: 滑动窗口求最长无重复子串\n`
    },
    solutions: {
      c: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[50005];\n    fgets(s, 50005, stdin);\n    int n = strlen(s);\n    if (n > 0 && s[n-1] == '\\n') s[--n] = '\\0';\n    \n    int idx[128];\n    memset(idx, -1, sizeof(idx));\n    int left = 0, maxLen = 0;\n    for (int right = 0; right < n; right++) {\n        if (idx[(int)s[right]] >= left) {\n            left = idx[(int)s[right]] + 1;\n        }\n        idx[(int)s[right]] = right;\n        if (right - left + 1 > maxLen) maxLen = right - left + 1;\n    }\n    printf("%d\\n", maxLen);\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    \n    unordered_map<char, int> idx;\n    int left = 0, maxLen = 0;\n    for (int right = 0; right < s.size(); right++) {\n        if (idx.count(s[right]) && idx[s[right]] >= left) {\n            left = idx[s[right]] + 1;\n        }\n        idx[s[right]] = right;\n        maxLen = max(maxLen, right - left + 1);\n    }\n    cout << maxLen << endl;\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        \n        Map<Character, Integer> idx = new HashMap<>();\n        int left = 0, maxLen = 0;\n        for (int right = 0; right < s.length(); right++) {\n            char c = s.charAt(right);\n            if (idx.containsKey(c) && idx.get(c) >= left) {\n                left = idx.get(c) + 1;\n            }\n            idx.put(c, right);\n            maxLen = Math.max(maxLen, right - left + 1);\n        }\n        System.out.println(maxLen);\n        sc.close();\n    }\n}`,
      python: `s = input()\n\nidx = {}\nleft, max_len = 0, 0\nfor right, c in enumerate(s):\n    if c in idx and idx[c] >= left:\n        left = idx[c] + 1\n    idx[c] = right\n    max_len = max(max_len, right - left + 1)\nprint(max_len)`
    },
    testCases: [
      { input: 'abcabcbb', expectedOutput: '3', description: '最长无重复子串abc，长度3' },
      { input: 'bbbbb', expectedOutput: '1', description: '全相同字符' },
      { input: 'pwwkew', expectedOutput: '3', description: 'wke长度3' }
    ],
    hints: ['用哈希表记录每个字符最后出现的位置', '遇到重复字符时，移动左边界到重复字符的下一个位置', '注意左边界只能向右移动'],
    explanation: `【解题思路】

滑动窗口 + 哈希表：
1. 用哈希表记录每个字符最后出现的下标
2. 右指针遍历字符串
3. 如果当前字符在窗口内出现过，左指针跳到该字符上次出现位置的下一个
4. 更新最大长度

【时间复杂度】O(n)
【空间复杂度】O(min(n, 字符集大小))`
  },
  {
    id: 'sw-min-subarray-sum', category: '滑动窗口', title: '长度最小的子数组', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给定一个含有 n 个正整数的数组和一个正整数 target。
找出该数组中满足其和 ≥ target 的长度最小的连续子数组，并返回其长度。
如果不存在符合条件的子数组，返回 0。

【输入格式】
第一行：两个整数 n 和 target，空格分隔
第二行：n 个正整数，表示数组元素，空格分隔

【输出格式】
输出一个整数，表示最短子数组长度，不存在则输出0

【数据范围】
- 1 ≤ n ≤ 10^5
- 1 ≤ target ≤ 10^9
- 1 ≤ nums[i] ≤ 10^5`,
    templates: {
      c: `#include <stdio.h>\n\nint main() {\n    int n, target;\n    scanf("%d %d", &n, &target);\n    int nums[100005];\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    \n    // TODO: 滑动窗口求最短子数组\n    \n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n, target;\n    cin >> n >> target;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    \n    // TODO: 滑动窗口求最短子数组\n    \n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), target = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        \n        // TODO: 滑动窗口求最短子数组\n        \n        sc.close();\n    }\n}`,
      python: `n, target = map(int, input().split())\nnums = list(map(int, input().split()))\n\n# TODO: 滑动窗口求最短子数组\n`
    },
    solutions: {
      c: `#include <stdio.h>\n\nint main() {\n    int n, target;\n    scanf("%d %d", &n, &target);\n    int nums[100005];\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    \n    int left = 0, sum = 0, minLen = n + 1;\n    for (int right = 0; right < n; right++) {\n        sum += nums[right];\n        while (sum >= target) {\n            if (right - left + 1 < minLen) minLen = right - left + 1;\n            sum -= nums[left++];\n        }\n    }\n    printf("%d\\n", minLen > n ? 0 : minLen);\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n, target;\n    cin >> n >> target;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    \n    int left = 0, sum = 0, minLen = INT_MAX;\n    for (int right = 0; right < n; right++) {\n        sum += nums[right];\n        while (sum >= target) {\n            minLen = min(minLen, right - left + 1);\n            sum -= nums[left++];\n        }\n    }\n    cout << (minLen == INT_MAX ? 0 : minLen) << endl;\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), target = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        \n        int left = 0, sum = 0, minLen = Integer.MAX_VALUE;\n        for (int right = 0; right < n; right++) {\n            sum += nums[right];\n            while (sum >= target) {\n                minLen = Math.min(minLen, right - left + 1);\n                sum -= nums[left++];\n            }\n        }\n        System.out.println(minLen == Integer.MAX_VALUE ? 0 : minLen);\n        sc.close();\n    }\n}`,
      python: `n, target = map(int, input().split())\nnums = list(map(int, input().split()))\n\nleft, total, min_len = 0, 0, float('inf')\nfor right in range(n):\n    total += nums[right]\n    while total >= target:\n        min_len = min(min_len, right - left + 1)\n        total -= nums[left]\n        left += 1\nprint(0 if min_len == float('inf') else min_len)`
    },
    testCases: [
      { input: '6 7\n2 3 1 2 4 3', expectedOutput: '2', description: '子数组[4,3]，和为7' },
      { input: '3 11\n1 1 1', expectedOutput: '0', description: '不存在满足条件的子数组' },
      { input: '1 4\n4', expectedOutput: '1', description: '单元素满足' }
    ],
    hints: ['可变长度滑动窗口', '右边界扩展增加元素', '满足条件时收缩左边界寻找更短的'],
    explanation: `【解题思路】

可变滑动窗口：
1. 右指针扩展窗口，累加sum
2. 当sum >= target时，记录长度，尝试收缩左边界
3. 收缩时减去左边元素，左指针右移

【时间复杂度】O(n)，每个元素最多入窗口一次出窗口一次
【空间复杂度】O(1)`
  },
];

// ==================== 位运算 ====================
export const bitExercises: Exercise[] = [
  {
    id: 'bit-single-number', category: '位运算', title: '只出现一次的数字', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现一次的元素。

【输入格式】
第一行：整数 n，表示数组长度 (1 ≤ n ≤ 3×10^4，n为奇数)
第二行：n 个整数，表示数组元素，空格分隔

【输出格式】
输出一个整数，表示只出现一次的元素

【数据范围】
- 1 ≤ n ≤ 3×10^4
- -3×10^4 ≤ nums[i] ≤ 3×10^4
- 除某个元素只出现一次外，其余元素均出现两次`,
    templates: {
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int nums[30005];\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    \n    // TODO: 用异或找出只出现一次的数\n    \n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    \n    // TODO: 用异或找出只出现一次的数\n    \n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        \n        // TODO: 用异或找出只出现一次的数\n        \n        sc.close();\n    }\n}`,
      python: `n = int(input())\nnums = list(map(int, input().split()))\n\n# TODO: 用异或找出只出现一次的数\n`
    },
    solutions: {
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int nums[30005];\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    \n    int result = 0;\n    for (int i = 0; i < n; i++) {\n        result ^= nums[i];\n    }\n    printf("%d\\n", result);\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    \n    int result = 0;\n    for (int x : nums) result ^= x;\n    cout << result << endl;\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        \n        int result = 0;\n        for (int x : nums) result ^= x;\n        System.out.println(result);\n        sc.close();\n    }\n}`,
      python: `n = int(input())\nnums = list(map(int, input().split()))\n\nresult = 0\nfor x in nums:\n    result ^= x\nprint(result)`
    },
    testCases: [
      { input: '5\n4 1 2 1 2', expectedOutput: '4', description: '4只出现一次' },
      { input: '3\n2 2 1', expectedOutput: '1', description: '1只出现一次' },
      { input: '1\n1', expectedOutput: '1', description: '单个元素' }
    ],
    hints: ['异或运算性质：a^a=0, a^0=a', '所有数异或，成对的会抵消为0', '最后剩下的就是只出现一次的数'],
    explanation: `【解题思路】

利用异或运算的性质：
- a ^ a = 0（相同的数异或为0）
- a ^ 0 = a（任何数和0异或等于本身）
- 异或满足交换律和结合律

将所有数异或，成对出现的数会抵消为0，最后剩下只出现一次的数。

【时间复杂度】O(n)
【空间复杂度】O(1)`
  },
  {
    id: 'bit-count-ones', category: '位运算', title: '位1的个数', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
编写一个函数，输入是一个无符号整数，返回其二进制表达式中数字位数为 1 的个数（也称为汉明重量）。

【输入格式】
一行，一个非负整数 n (0 ≤ n ≤ 2^31 - 1)

【输出格式】
输出一个整数，表示n的二进制中1的个数

【数据范围】
- 0 ≤ n ≤ 2^31 - 1`,
    templates: {
      c: `#include <stdio.h>\n\nint main() {\n    unsigned int n;\n    scanf("%u", &n);\n    \n    // TODO: 统计二进制中1的个数\n    \n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    unsigned int n;\n    cin >> n;\n    \n    // TODO: 统计二进制中1的个数\n    \n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        \n        // TODO: 统计二进制中1的个数\n        \n        sc.close();\n    }\n}`,
      python: `n = int(input())\n\n# TODO: 统计二进制中1的个数\n`
    },
    solutions: {
      c: `#include <stdio.h>\n\nint main() {\n    unsigned int n;\n    scanf("%u", &n);\n    \n    int count = 0;\n    while (n) {\n        count++;\n        n &= (n - 1);  // 消除最低位的1\n    }\n    printf("%d\\n", count);\n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    unsigned int n;\n    cin >> n;\n    \n    int count = 0;\n    while (n) {\n        count++;\n        n &= (n - 1);  // 消除最低位的1\n    }\n    cout << count << endl;\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        \n        int count = 0;\n        while (n != 0) {\n            count++;\n            n &= (n - 1);  // 消除最低位的1\n        }\n        System.out.println(count);\n        sc.close();\n    }\n}`,
      python: `n = int(input())\n\ncount = 0\nwhile n:\n    count += 1\n    n &= (n - 1)  # 消除最低位的1\nprint(count)`
    },
    testCases: [
      { input: '11', expectedOutput: '3', description: '11的二进制1011有3个1' },
      { input: '128', expectedOutput: '1', description: '128=10000000有1个1' },
      { input: '0', expectedOutput: '0', description: '0没有1' }
    ],
    hints: ['n & (n-1) 可以消除n最低位的1', '循环直到n变为0', '每消除一次计数加1'],
    explanation: `【Brian Kernighan算法】n&(n-1)会消除最低位的1`
  },
  {
    id: 'bit-power-of-two', category: '位运算', title: '2的幂', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
给定一个整数n，判断它是否是2的幂次方。
如果n是2的幂，返回true；否则返回false。

【输入格式】
一个整数 n (-2^31 ≤ n ≤ 2^31 - 1)

【输出格式】
输出 true 或 false

【数据范围】
- -2^31 ≤ n ≤ 2^31 - 1`,
    templates: {
      c: `int isPowerOfTwo(int n) {\n    // 请实现\n}`,
      cpp: `bool isPowerOfTwo(int n) {\n    // 请实现\n}`,
      java: `boolean isPowerOfTwo(int n) {\n    // 请实现\n}`,
      python: `def is_power_of_two(n):\n    pass`
    },
    solutions: {
      c: `int isPowerOfTwo(int n) { return n > 0 && (n & (n - 1)) == 0; }`,
      cpp: `bool isPowerOfTwo(int n) { return n > 0 && (n & (n - 1)) == 0; }`,
      java: `boolean isPowerOfTwo(int n) { return n > 0 && (n & (n - 1)) == 0; }`,
      python: `def is_power_of_two(n): return n > 0 and (n & (n - 1)) == 0`
    },
    testCases: [{ input: '16', expectedOutput: 'true', description: '16=2^4' }],
    hints: ['2的幂的二进制只有1个1', 'n&(n-1)==0'],
    explanation: `2的幂的二进制只有1个1，n&(n-1)消除后为0`
  },
];

// ==================== 贪心算法 ====================
export const greedyExercises: Exercise[] = [
  {
    id: 'greedy-jump-game', category: '贪心', title: '跳跃游戏', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给定一个非负整数数组 nums，你最初位于数组的第一个下标。
数组中的每个元素代表你在该位置可以跳跃的最大长度。
判断你是否能够到达最后一个下标。

【输入格式】
第一行：整数 n，表示数组长度 (1 ≤ n ≤ 10^4)
第二行：n 个非负整数，表示每个位置能跳跃的最大长度

【输出格式】
输出 true 或 false

【数据范围】
- 1 ≤ n ≤ 10^4
- 0 ≤ nums[i] ≤ 10^5`,
    templates: {
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int nums[10005];\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    \n    // TODO: 判断能否跳到最后\n    \n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    \n    // TODO: 判断能否跳到最后\n    \n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        \n        // TODO: 判断能否跳到最后\n        \n        sc.close();\n    }\n}`,
      python: `n = int(input())\nnums = list(map(int, input().split()))\n\n# TODO: 判断能否跳到最后\n`
    },
    solutions: {
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int nums[10005];\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    \n    int maxReach = 0;\n    for (int i = 0; i < n && i <= maxReach; i++) {\n        if (i + nums[i] > maxReach) maxReach = i + nums[i];\n    }\n    printf("%s\\n", maxReach >= n - 1 ? "true" : "false");\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    \n    int maxReach = 0;\n    for (int i = 0; i < n && i <= maxReach; i++) {\n        maxReach = max(maxReach, i + nums[i]);\n    }\n    cout << (maxReach >= n - 1 ? "true" : "false") << endl;\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        \n        int maxReach = 0;\n        for (int i = 0; i < n && i <= maxReach; i++) {\n            maxReach = Math.max(maxReach, i + nums[i]);\n        }\n        System.out.println(maxReach >= n - 1 ? "true" : "false");\n        sc.close();\n    }\n}`,
      python: `n = int(input())\nnums = list(map(int, input().split()))\n\nmax_reach = 0\nfor i in range(n):\n    if i > max_reach:\n        print("false")\n        exit()\n    max_reach = max(max_reach, i + nums[i])\nprint("true")`
    },
    testCases: [
      { input: '5\n2 3 1 1 4', expectedOutput: 'true', description: '能到达：0→1→4' },
      { input: '5\n3 2 1 0 4', expectedOutput: 'false', description: '无法到达' },
      { input: '1\n0', expectedOutput: 'true', description: '已在终点' }
    ],
    hints: ['维护能到达的最远位置maxReach', '遍历时更新maxReach = max(maxReach, i + nums[i])', '如果当前位置i > maxReach则无法继续'],
    explanation: `【贪心算法】

思路：维护能够到达的最远位置 maxReach
- 遍历数组，更新 maxReach = max(maxReach, i + nums[i])
- 如果当前位置 i > maxReach，说明无法到达当前位置
- 如果 maxReach >= n - 1，说明可以到达终点

【时间复杂度】O(n)
【空间复杂度】O(1)`
  },
  {
    id: 'greedy-best-stock', category: '贪心', title: '买卖股票的最佳时机II', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给你一个整数数组 prices，其中 prices[i] 表示某支股票第 i 天的价格。
每天你可以决定是否购买和/或出售股票。你在任何时候最多只能持有一股股票。
返回你能获得的最大利润。

【输入格式】
第一行：整数 n，表示天数 (1 ≤ n ≤ 3×10^4)
第二行：n 个整数，表示每天的股票价格

【输出格式】
输出一个整数，表示最大利润

【数据范围】
- 1 ≤ n ≤ 3×10^4
- 0 ≤ prices[i] ≤ 10^4`,
    templates: {
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int prices[30005];\n    for (int i = 0; i < n; i++) scanf("%d", &prices[i]);\n    \n    // TODO: 计算最大利润\n    \n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> prices(n);\n    for (int i = 0; i < n; i++) cin >> prices[i];\n    \n    // TODO: 计算最大利润\n    \n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] prices = new int[n];\n        for (int i = 0; i < n; i++) prices[i] = sc.nextInt();\n        \n        // TODO: 计算最大利润\n        \n        sc.close();\n    }\n}`,
      python: `n = int(input())\nprices = list(map(int, input().split()))\n\n# TODO: 计算最大利润\n`
    },
    solutions: {
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int prices[30005];\n    for (int i = 0; i < n; i++) scanf("%d", &prices[i]);\n    \n    int profit = 0;\n    for (int i = 1; i < n; i++) {\n        if (prices[i] > prices[i - 1]) {\n            profit += prices[i] - prices[i - 1];\n        }\n    }\n    printf("%d\\n", profit);\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> prices(n);\n    for (int i = 0; i < n; i++) cin >> prices[i];\n    \n    int profit = 0;\n    for (int i = 1; i < n; i++) {\n        if (prices[i] > prices[i - 1]) {\n            profit += prices[i] - prices[i - 1];\n        }\n    }\n    cout << profit << endl;\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] prices = new int[n];\n        for (int i = 0; i < n; i++) prices[i] = sc.nextInt();\n        \n        int profit = 0;\n        for (int i = 1; i < n; i++) {\n            if (prices[i] > prices[i - 1]) {\n                profit += prices[i] - prices[i - 1];\n            }\n        }\n        System.out.println(profit);\n        sc.close();\n    }\n}`,
      python: `n = int(input())\nprices = list(map(int, input().split()))\n\nprofit = 0\nfor i in range(1, n):\n    if prices[i] > prices[i - 1]:\n        profit += prices[i] - prices[i - 1]\nprint(profit)`
    },
    testCases: [
      { input: '6\n7 1 5 3 6 4', expectedOutput: '7', description: '1买5卖(+4)，3买6卖(+3)' },
      { input: '5\n1 2 3 4 5', expectedOutput: '4', description: '持续上涨' },
      { input: '5\n7 6 4 3 1', expectedOutput: '0', description: '持续下跌' }
    ],
    hints: ['只要第二天比今天贵，就今天买明天卖', '收集所有上涨区间的利润', '贪心：累加所有正收益'],
    explanation: `【贪心算法】

思路：收集所有上涨区间的利润
- 只要 prices[i] > prices[i-1]，就把差价加入利润
- 相当于在每个低点买入，高点卖出

【为什么正确？】
连续上涨区间，每天买卖和一次买卖利润相同
如：1→2→3，(2-1)+(3-2) = 3-1 = 2

【时间复杂度】O(n)
【空间复杂度】O(1)`
  },
];

// ==================== 回溯算法 ====================
export const backtrackExercises: Exercise[] = [
  {
    id: 'bt-permutations', category: '回溯', title: '全排列', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给定一个不含重复数字的数组 nums，返回其所有可能的全排列。可以按任意顺序返回答案。

【输入格式】
第一行：整数 n，表示数组长度 (1 ≤ n ≤ 6)
第二行：n 个不重复的整数

【输出格式】
输出所有排列，每行一个排列，元素用空格分隔

【数据范围】
- 1 ≤ n ≤ 6
- -10 ≤ nums[i] ≤ 10
- nums 中的所有整数互不相同`,
    templates: {
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint n;\nint nums[10], path[10], used[10];\n\nvoid backtrack(int len) {\n    // TODO: 实现回溯\n}\n\nint main() {\n    scanf("%d", &n);\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    backtrack(0);\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint n;\nvector<int> nums, path;\nvector<bool> used;\n\nvoid backtrack() {\n    // TODO: 实现回溯\n}\n\nint main() {\n    cin >> n;\n    nums.resize(n);\n    used.resize(n, false);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    backtrack();\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    static int n;\n    static int[] nums;\n    static boolean[] used;\n    static List<Integer> path = new ArrayList<>();\n    \n    static void backtrack() {\n        // TODO: 实现回溯\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        n = sc.nextInt();\n        nums = new int[n];\n        used = new boolean[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        backtrack();\n        sc.close();\n    }\n}`,
      python: `n = int(input())\nnums = list(map(int, input().split()))\n\ndef backtrack(path, used):\n    # TODO: 实现回溯\n    pass\n\nbacktrack([], [False] * n)`
    },
    solutions: {
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint n;\nint nums[10], path[10], used[10];\n\nvoid backtrack(int len) {\n    if (len == n) {\n        for (int i = 0; i < n; i++) {\n            if (i > 0) printf(" ");\n            printf("%d", path[i]);\n        }\n        printf("\\n");\n        return;\n    }\n    for (int i = 0; i < n; i++) {\n        if (used[i]) continue;\n        used[i] = 1;\n        path[len] = nums[i];\n        backtrack(len + 1);\n        used[i] = 0;\n    }\n}\n\nint main() {\n    scanf("%d", &n);\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    backtrack(0);\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint n;\nvector<int> nums, path;\nvector<bool> used;\n\nvoid backtrack() {\n    if (path.size() == n) {\n        for (int i = 0; i < n; i++) {\n            if (i > 0) cout << " ";\n            cout << path[i];\n        }\n        cout << endl;\n        return;\n    }\n    for (int i = 0; i < n; i++) {\n        if (used[i]) continue;\n        used[i] = true;\n        path.push_back(nums[i]);\n        backtrack();\n        path.pop_back();\n        used[i] = false;\n    }\n}\n\nint main() {\n    cin >> n;\n    nums.resize(n);\n    used.resize(n, false);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    backtrack();\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    static int n;\n    static int[] nums;\n    static boolean[] used;\n    static List<Integer> path = new ArrayList<>();\n    \n    static void backtrack() {\n        if (path.size() == n) {\n            StringBuilder sb = new StringBuilder();\n            for (int i = 0; i < n; i++) {\n                if (i > 0) sb.append(" ");\n                sb.append(path.get(i));\n            }\n            System.out.println(sb);\n            return;\n        }\n        for (int i = 0; i < n; i++) {\n            if (used[i]) continue;\n            used[i] = true;\n            path.add(nums[i]);\n            backtrack();\n            path.remove(path.size() - 1);\n            used[i] = false;\n        }\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        n = sc.nextInt();\n        nums = new int[n];\n        used = new boolean[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        backtrack();\n        sc.close();\n    }\n}`,
      python: `n = int(input())\nnums = list(map(int, input().split()))\n\ndef backtrack(path, used):\n    if len(path) == n:\n        print(' '.join(map(str, path)))\n        return\n    for i in range(n):\n        if used[i]:\n            continue\n        used[i] = True\n        path.append(nums[i])\n        backtrack(path, used)\n        path.pop()\n        used[i] = False\n\nbacktrack([], [False] * n)`
    },
    testCases: [
      { input: '3\n1 2 3', expectedOutput: '1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1', description: '3个数的6种排列' },
      { input: '2\n0 1', expectedOutput: '0 1\n1 0', description: '2个数的排列' }
    ],
    hints: ['回溯三要素：路径、选择列表、结束条件', '用used数组标记已使用的元素', '选择→递归→撤销选择'],
    explanation: `【回溯算法模板】

回溯三要素：
1. 路径(path)：已做出的选择
2. 选择列表：当前可做的选择
3. 结束条件：到达决策树底层

核心代码：
for 选择 in 选择列表:
    做选择（标记used, 加入path）
    backtrack(...)
    撤销选择（取消used, 移除path）

【时间复杂度】O(n! × n)
【空间复杂度】O(n)`
  },
  {
    id: 'bt-subsets', category: '回溯', title: '子集', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给定一个整数数组nums，数组中的元素互不相同。返回该数组所有可能的子集（幂集）。

【输入格式】
第一行：整数n，表示数组长度 (1 ≤ n ≤ 10)
第二行：n个不同的整数

【输出格式】
输出所有子集，每行一个

【数据范围】
- 1 ≤ n ≤ 10
- -10 ≤ nums[i] ≤ 10`,
    templates: {
      c: `int** subsets(int* nums, int n, int* returnSize, int** returnColumnSizes) {\n    // 请实现\n}`,
      cpp: `vector<vector<int>> subsets(vector<int>& nums) {\n    // 请实现\n}`,
      java: `List<List<Integer>> subsets(int[] nums) {\n    // 请实现\n}`,
      python: `def subsets(nums):\n    pass`
    },
    solutions: {
      c: `// 位运算方法\nint** subsets(int* nums, int n, int* returnSize, int** returnColumnSizes) {\n    int total = 1 << n;\n    int** res = malloc(total * sizeof(int*));\n    *returnColumnSizes = malloc(total * sizeof(int));\n    *returnSize = total;\n    for (int mask = 0; mask < total; mask++) {\n        int cnt = 0;\n        for (int i = 0; i < n; i++) if (mask & (1 << i)) cnt++;\n        res[mask] = malloc(cnt * sizeof(int));\n        (*returnColumnSizes)[mask] = cnt;\n        int idx = 0;\n        for (int i = 0; i < n; i++)\n            if (mask & (1 << i)) res[mask][idx++] = nums[i];\n    }\n    return res;\n}`,
      cpp: `vector<vector<int>> subsets(vector<int>& nums) {\n    vector<vector<int>> res;\n    vector<int> path;\n    function<void(int)> backtrack = [&](int start) {\n        res.push_back(path);  // 每个节点都是答案\n        for (int i = start; i < nums.size(); i++) {\n            path.push_back(nums[i]);\n            backtrack(i + 1);\n            path.pop_back();\n        }\n    };\n    backtrack(0);\n    return res;\n}`,
      java: `List<List<Integer>> subsets(int[] nums) {\n    List<List<Integer>> res = new ArrayList<>();\n    backtrack(res, new ArrayList<>(), nums, 0);\n    return res;\n}\nvoid backtrack(List<List<Integer>> res, List<Integer> path, int[] nums, int start) {\n    res.add(new ArrayList<>(path));\n    for (int i = start; i < nums.length; i++) {\n        path.add(nums[i]);\n        backtrack(res, path, nums, i + 1);\n        path.remove(path.size() - 1);\n    }\n}`,
      python: `def subsets(nums):\n    res = []\n    def backtrack(start, path):\n        res.append(path[:])\n        for i in range(start, len(nums)):\n            path.append(nums[i])\n            backtrack(i + 1, path)\n            path.pop()\n    backtrack(0, [])\n    return res`
    },
    testCases: [{ input: '3\n1 2 3', expectedOutput: '\n1\n2\n1 2\n3\n1 3\n2 3\n1 2 3', description: '8个子集' }],
    hints: ['子集问题：每个节点都是答案', '从start开始避免重复', '也可用位运算枚举'],
    explanation: `【子集 vs 排列】
- 排列：元素顺序不同算不同结果
- 子集：元素相同就是同一子集，需要start参数
【位运算】n个元素有2^n个子集，用n位二进制枚举`
  },
  {
    id: 'bt-combination-sum', category: '回溯', title: '组合总和', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给定一个无重复元素的整数数组candidates和一个目标整数target，找出所有相加之和为target的组合。
candiates中的同一个数字可以无限制重复被选取。

【输入格式】
第一行：两个整数n和target
第二行：n个正整数

【输出格式】
输出所有组合，每行一个

【数据范围】
- 1 ≤ n ≤ 30
- 2 ≤ candidates[i] ≤ 40
- 1 ≤ target ≤ 40`,
    templates: {
      c: `int** combinationSum(int* candidates, int n, int target, int* returnSize, int** returnColumnSizes) {\n    // 请实现\n}`,
      cpp: `vector<vector<int>> combinationSum(vector<int>& candidates, int target) {\n    // 请实现\n}`,
      java: `List<List<Integer>> combinationSum(int[] candidates, int target) {\n    // 请实现\n}`,
      python: `def combination_sum(candidates, target):\n    pass`
    },
    solutions: {
      c: `// 简化版，需要动态数组支持`,
      cpp: `vector<vector<int>> combinationSum(vector<int>& candidates, int target) {\n    vector<vector<int>> res;\n    vector<int> path;\n    function<void(int, int)> backtrack = [&](int start, int remain) {\n        if (remain == 0) { res.push_back(path); return; }\n        if (remain < 0) return;\n        for (int i = start; i < candidates.size(); i++) {\n            path.push_back(candidates[i]);\n            backtrack(i, remain - candidates[i]);  // 可重复选，所以是i不是i+1\n            path.pop_back();\n        }\n    };\n    backtrack(0, target);\n    return res;\n}`,
      java: `List<List<Integer>> combinationSum(int[] candidates, int target) {\n    List<List<Integer>> res = new ArrayList<>();\n    backtrack(res, new ArrayList<>(), candidates, target, 0);\n    return res;\n}\nvoid backtrack(List<List<Integer>> res, List<Integer> path, int[] candidates, int remain, int start) {\n    if (remain == 0) { res.add(new ArrayList<>(path)); return; }\n    if (remain < 0) return;\n    for (int i = start; i < candidates.length; i++) {\n        path.add(candidates[i]);\n        backtrack(res, path, candidates, remain - candidates[i], i);\n        path.remove(path.size() - 1);\n    }\n}`,
      python: `def combination_sum(candidates, target):\n    res = []\n    def backtrack(start, remain, path):\n        if remain == 0:\n            res.append(path[:])\n            return\n        if remain < 0: return\n        for i in range(start, len(candidates)):\n            path.append(candidates[i])\n            backtrack(i, remain - candidates[i], path)  # i不是i+1，可重复\n            path.pop()\n    backtrack(0, target, [])\n    return res`
    },
    testCases: [{ input: '4 7\n2 3 6 7', expectedOutput: '2 2 3\n7', description: '两种组合' }],
    hints: ['可重复选：递归时传i而非i+1', '剪枝：remain<0时返回'],
    explanation: `【组合问题】
- 不可重复选：递归传i+1
- 可重复选：递归传i
- 有重复元素去重：排序+跳过相同元素`
  },
  {
    id: 'bt-n-queens', category: '回溯', title: 'N皇后', difficulty: 'hard', type: 'coding',
    description: `【题目描述】
N皇后问题：将n个皇后放置在n×n的棋盘上，使得皇后彼此之间不能相互攻击。
皇后可以攻击同一行、同一列、同一斜线上的任意单元。

【输入格式】
一个整数n (1 ≤ n ≤ 9)

【输出格式】
输出所有不同的解法，每个解法为一个棋盘布局

【数据范围】
- 1 ≤ n ≤ 9`,
    templates: {
      c: `char*** solveNQueens(int n, int* returnSize) {\n    // 请实现\n}`,
      cpp: `vector<vector<string>> solveNQueens(int n) {\n    // 请实现\n}`,
      java: `List<List<String>> solveNQueens(int n) {\n    // 请实现\n}`,
      python: `def solve_n_queens(n):\n    pass`
    },
    solutions: {
      c: `// 需要较复杂的内存管理，此处省略`,
      cpp: `vector<vector<string>> solveNQueens(int n) {\n    vector<vector<string>> res;\n    vector<string> board(n, string(n, '.'));\n    vector<bool> col(n), diag1(2*n), diag2(2*n);\n    function<void(int)> backtrack = [&](int row) {\n        if (row == n) { res.push_back(board); return; }\n        for (int c = 0; c < n; c++) {\n            if (col[c] || diag1[row+c] || diag2[row-c+n]) continue;\n            board[row][c] = 'Q';\n            col[c] = diag1[row+c] = diag2[row-c+n] = true;\n            backtrack(row + 1);\n            board[row][c] = '.';\n            col[c] = diag1[row+c] = diag2[row-c+n] = false;\n        }\n    };\n    backtrack(0);\n    return res;\n}`,
      java: `List<List<String>> solveNQueens(int n) {\n    List<List<String>> res = new ArrayList<>();\n    char[][] board = new char[n][n];\n    for (char[] row : board) Arrays.fill(row, '.');\n    boolean[] col = new boolean[n], diag1 = new boolean[2*n], diag2 = new boolean[2*n];\n    backtrack(res, board, 0, col, diag1, diag2, n);\n    return res;\n}\nvoid backtrack(List<List<String>> res, char[][] board, int row, boolean[] col, boolean[] diag1, boolean[] diag2, int n) {\n    if (row == n) {\n        List<String> solution = new ArrayList<>();\n        for (char[] r : board) solution.add(new String(r));\n        res.add(solution);\n        return;\n    }\n    for (int c = 0; c < n; c++) {\n        if (col[c] || diag1[row+c] || diag2[row-c+n]) continue;\n        board[row][c] = 'Q';\n        col[c] = diag1[row+c] = diag2[row-c+n] = true;\n        backtrack(res, board, row+1, col, diag1, diag2, n);\n        board[row][c] = '.';\n        col[c] = diag1[row+c] = diag2[row-c+n] = false;\n    }\n}`,
      python: `def solve_n_queens(n):\n    res = []\n    board = [['.' for _ in range(n)] for _ in range(n)]\n    col, diag1, diag2 = set(), set(), set()\n    def backtrack(row):\n        if row == n:\n            res.append([''.join(r) for r in board])\n            return\n        for c in range(n):\n            if c in col or row+c in diag1 or row-c in diag2: continue\n            board[row][c] = 'Q'\n            col.add(c); diag1.add(row+c); diag2.add(row-c)\n            backtrack(row + 1)\n            board[row][c] = '.'\n            col.remove(c); diag1.remove(row+c); diag2.remove(row-c)\n    backtrack(0)\n    return res`
    },
    testCases: [{ input: '4', expectedOutput: '.Q..\n...Q\nQ...\n..Q.', description: '4皇后一种解法' }],
    hints: ['逐行放置皇后', '用三个数组记录列和两条对角线', '对角线特征：row+col相同或row-col相同'],
    explanation: `【N皇后】经典回溯问题
【冲突检测】
- 同列：col[c]
- 主对角线(↘)：row-col相同
- 副对角线(↙)：row+col相同
【优化】用集合O(1)判断冲突`
  },
  {
    id: 'bt-word-search', category: '回溯', title: '单词搜索', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给定一个m×n二维字符网格board和一个单词word，如果word存在于网格中返回true，否则返回false。
单词必须按照字母顺序，通过相邻的单元格内的字母构成。同一个单元格内的字母不允许被重复使用。

【输入格式】
第一行：两个整数m和n
接下来m行：每行n个字符
最后一行：单词word

【输出格式】
输出 true 或 false

【数据范围】
- 1 ≤ m, n ≤ 6
- 1 ≤ word.length ≤ 15`,
    templates: {
      c: `int exist(char** board, int m, int n, char* word) {\n    // 请实现\n}`,
      cpp: `bool exist(vector<vector<char>>& board, string word) {\n    // 请实现\n}`,
      java: `boolean exist(char[][] board, String word) {\n    // 请实现\n}`,
      python: `def exist(board, word):\n    pass`
    },
    solutions: {
      c: `int dirs[4][2] = {{0,1},{0,-1},{1,0},{-1,0}};\nint dfs(char** board, int m, int n, char* word, int idx, int i, int j) {\n    if (word[idx] == '\\0') return 1;\n    if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] != word[idx]) return 0;\n    char tmp = board[i][j];\n    board[i][j] = '#';\n    for (int d = 0; d < 4; d++) {\n        if (dfs(board, m, n, word, idx+1, i+dirs[d][0], j+dirs[d][1])) {\n            board[i][j] = tmp;\n            return 1;\n        }\n    }\n    board[i][j] = tmp;\n    return 0;\n}\nint exist(char** board, int m, int n, char* word) {\n    for (int i = 0; i < m; i++)\n        for (int j = 0; j < n; j++)\n            if (dfs(board, m, n, word, 0, i, j)) return 1;\n    return 0;\n}`,
      cpp: `bool exist(vector<vector<char>>& board, string word) {\n    int m = board.size(), n = board[0].size();\n    function<bool(int, int, int)> dfs = [&](int i, int j, int k) {\n        if (k == word.size()) return true;\n        if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] != word[k]) return false;\n        char tmp = board[i][j];\n        board[i][j] = '#';\n        bool found = dfs(i+1,j,k+1) || dfs(i-1,j,k+1) || dfs(i,j+1,k+1) || dfs(i,j-1,k+1);\n        board[i][j] = tmp;\n        return found;\n    };\n    for (int i = 0; i < m; i++)\n        for (int j = 0; j < n; j++)\n            if (dfs(i, j, 0)) return true;\n    return false;\n}`,
      java: `boolean exist(char[][] board, String word) {\n    int m = board.length, n = board[0].length;\n    for (int i = 0; i < m; i++)\n        for (int j = 0; j < n; j++)\n            if (dfs(board, word, i, j, 0)) return true;\n    return false;\n}\nboolean dfs(char[][] board, String word, int i, int j, int k) {\n    if (k == word.length()) return true;\n    if (i < 0 || i >= board.length || j < 0 || j >= board[0].length || board[i][j] != word.charAt(k)) return false;\n    char tmp = board[i][j];\n    board[i][j] = '#';\n    boolean found = dfs(board,word,i+1,j,k+1) || dfs(board,word,i-1,j,k+1) || dfs(board,word,i,j+1,k+1) || dfs(board,word,i,j-1,k+1);\n    board[i][j] = tmp;\n    return found;\n}`,
      python: `def exist(board, word):\n    m, n = len(board), len(board[0])\n    def dfs(i, j, k):\n        if k == len(word): return True\n        if i < 0 or i >= m or j < 0 or j >= n or board[i][j] != word[k]: return False\n        tmp, board[i][j] = board[i][j], '#'\n        found = dfs(i+1,j,k+1) or dfs(i-1,j,k+1) or dfs(i,j+1,k+1) or dfs(i,j-1,k+1)\n        board[i][j] = tmp\n        return found\n    return any(dfs(i, j, 0) for i in range(m) for j in range(n))`
    },
    testCases: [{ input: '3 4\nA B C E\nS F C S\nA D E E\nABCCED', expectedOutput: 'true', description: '存在路径' }],
    hints: ['DFS+回溯', '临时修改board标记已访问', '四个方向尝试'],
    explanation: `【网格DFS】
- 从每个位置开始尝试
- 标记已访问（修改为'#'）
- 四方向递归
- 回溯恢复原值`
  },
];

// ==================== 经典动态规划 ====================
export const classicDpExercises: Exercise[] = [
  {
    id: 'dp-lcs', category: '动态规划', title: '最长公共子序列', difficulty: 'medium', type: 'coding',
    description: '求两个字符串的最长公共子序列的长度',
    templates: {
      c: `int longestCommonSubsequence(char* text1, char* text2) {\n    // 请实现\n}`,
      cpp: `int longestCommonSubsequence(string text1, string text2) {\n    // 请实现\n}`,
      java: `int longestCommonSubsequence(String text1, String text2) {\n    // 请实现\n}`,
      python: `def longest_common_subsequence(text1, text2):\n    pass`
    },
    solutions: {
      c: `int longestCommonSubsequence(char* text1, char* text2) {\n    int m = strlen(text1), n = strlen(text2);\n    int** dp = malloc((m+1) * sizeof(int*));\n    for (int i = 0; i <= m; i++) { dp[i] = calloc(n+1, sizeof(int)); }\n    for (int i = 1; i <= m; i++) {\n        for (int j = 1; j <= n; j++) {\n            if (text1[i-1] == text2[j-1]) dp[i][j] = dp[i-1][j-1] + 1;\n            else dp[i][j] = dp[i-1][j] > dp[i][j-1] ? dp[i-1][j] : dp[i][j-1];\n        }\n    }\n    return dp[m][n];\n}`,
      cpp: `int longestCommonSubsequence(string text1, string text2) {\n    int m = text1.size(), n = text2.size();\n    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));\n    for (int i = 1; i <= m; i++) {\n        for (int j = 1; j <= n; j++) {\n            if (text1[i-1] == text2[j-1]) dp[i][j] = dp[i-1][j-1] + 1;\n            else dp[i][j] = max(dp[i-1][j], dp[i][j-1]);\n        }\n    }\n    return dp[m][n];\n}`,
      java: `int longestCommonSubsequence(String text1, String text2) {\n    int m = text1.length(), n = text2.length();\n    int[][] dp = new int[m+1][n+1];\n    for (int i = 1; i <= m; i++) {\n        for (int j = 1; j <= n; j++) {\n            if (text1.charAt(i-1) == text2.charAt(j-1)) dp[i][j] = dp[i-1][j-1] + 1;\n            else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\n        }\n    }\n    return dp[m][n];\n}`,
      python: `def longest_common_subsequence(text1, text2):\n    m, n = len(text1), len(text2)\n    dp = [[0] * (n+1) for _ in range(m+1)]\n    for i in range(1, m+1):\n        for j in range(1, n+1):\n            if text1[i-1] == text2[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[m][n]`
    },
    testCases: [{ input: 'abcde\nace', expectedOutput: '3', description: 'LCS是ace' }],
    hints: ['dp[i][j]表示text1前i个和text2前j个的LCS长度', '相等时+1，否则取max'],
    explanation: `【LCS状态转移】
dp[i][j] = text1前i个和text2前j个字符的LCS长度
- 若text1[i-1]==text2[j-1]: dp[i][j] = dp[i-1][j-1] + 1
- 否则: dp[i][j] = max(dp[i-1][j], dp[i][j-1])`
  },
  {
    id: 'dp-edit-distance', category: '动态规划', title: '编辑距离', difficulty: 'hard', type: 'coding',
    description: '将word1转换成word2所需的最少操作数（插入、删除、替换）',
    templates: {
      c: `int minDistance(char* word1, char* word2) {\n    // 请实现\n}`,
      cpp: `int minDistance(string word1, string word2) {\n    // 请实现\n}`,
      java: `int minDistance(String word1, String word2) {\n    // 请实现\n}`,
      python: `def min_distance(word1, word2):\n    pass`
    },
    solutions: {
      c: `int minDistance(char* word1, char* word2) {\n    int m = strlen(word1), n = strlen(word2);\n    int** dp = malloc((m+1) * sizeof(int*));\n    for (int i = 0; i <= m; i++) dp[i] = malloc((n+1) * sizeof(int));\n    for (int i = 0; i <= m; i++) dp[i][0] = i;\n    for (int j = 0; j <= n; j++) dp[0][j] = j;\n    for (int i = 1; i <= m; i++) {\n        for (int j = 1; j <= n; j++) {\n            if (word1[i-1] == word2[j-1]) dp[i][j] = dp[i-1][j-1];\n            else {\n                int a = dp[i-1][j], b = dp[i][j-1], c = dp[i-1][j-1];\n                dp[i][j] = 1 + (a < b ? (a < c ? a : c) : (b < c ? b : c));\n            }\n        }\n    }\n    return dp[m][n];\n}`,
      cpp: `int minDistance(string word1, string word2) {\n    int m = word1.size(), n = word2.size();\n    vector<vector<int>> dp(m+1, vector<int>(n+1));\n    for (int i = 0; i <= m; i++) dp[i][0] = i;\n    for (int j = 0; j <= n; j++) dp[0][j] = j;\n    for (int i = 1; i <= m; i++) {\n        for (int j = 1; j <= n; j++) {\n            if (word1[i-1] == word2[j-1]) dp[i][j] = dp[i-1][j-1];\n            else dp[i][j] = 1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});\n        }\n    }\n    return dp[m][n];\n}`,
      java: `int minDistance(String word1, String word2) {\n    int m = word1.length(), n = word2.length();\n    int[][] dp = new int[m+1][n+1];\n    for (int i = 0; i <= m; i++) dp[i][0] = i;\n    for (int j = 0; j <= n; j++) dp[0][j] = j;\n    for (int i = 1; i <= m; i++) {\n        for (int j = 1; j <= n; j++) {\n            if (word1.charAt(i-1) == word2.charAt(j-1)) dp[i][j] = dp[i-1][j-1];\n            else dp[i][j] = 1 + Math.min(dp[i-1][j-1], Math.min(dp[i-1][j], dp[i][j-1]));\n        }\n    }\n    return dp[m][n];\n}`,
      python: `def min_distance(word1, word2):\n    m, n = len(word1), len(word2)\n    dp = [[0] * (n+1) for _ in range(m+1)]\n    for i in range(m+1): dp[i][0] = i\n    for j in range(n+1): dp[0][j] = j\n    for i in range(1, m+1):\n        for j in range(1, n+1):\n            if word1[i-1] == word2[j-1]:\n                dp[i][j] = dp[i-1][j-1]\n            else:\n                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])\n    return dp[m][n]`
    },
    testCases: [{ input: 'horse\nros', expectedOutput: '3', description: 'horse→rorse→rose→ros' }],
    hints: ['dp[i][j]表示word1前i个变成word2前j个的最少操作', '三种操作对应三个状态'],
    explanation: `【编辑距离】
- dp[i-1][j]+1: 删除word1[i-1]
- dp[i][j-1]+1: 插入word2[j-1]
- dp[i-1][j-1]+1: 替换
- 相等时：dp[i-1][j-1]，无需操作`
  },
  {
    id: 'dp-knapsack-01', category: '动态规划', title: '0-1背包问题', difficulty: 'medium', type: 'coding',
    description: '有n个物品，重量weights[i]，价值values[i]，背包容量capacity，求最大价值',
    templates: {
      c: `int knapsack(int* weights, int* values, int n, int capacity) {\n    // 请实现\n}`,
      cpp: `int knapsack(vector<int>& weights, vector<int>& values, int capacity) {\n    // 请实现\n}`,
      java: `int knapsack(int[] weights, int[] values, int capacity) {\n    // 请实现\n}`,
      python: `def knapsack(weights, values, capacity):\n    pass`
    },
    solutions: {
      c: `int knapsack(int* weights, int* values, int n, int capacity) {\n    int* dp = calloc(capacity + 1, sizeof(int));\n    for (int i = 0; i < n; i++) {\n        for (int j = capacity; j >= weights[i]; j--) {\n            int val = dp[j - weights[i]] + values[i];\n            if (val > dp[j]) dp[j] = val;\n        }\n    }\n    return dp[capacity];\n}`,
      cpp: `int knapsack(vector<int>& weights, vector<int>& values, int capacity) {\n    int n = weights.size();\n    vector<int> dp(capacity + 1, 0);\n    for (int i = 0; i < n; i++) {\n        for (int j = capacity; j >= weights[i]; j--) {\n            dp[j] = max(dp[j], dp[j - weights[i]] + values[i]);\n        }\n    }\n    return dp[capacity];\n}`,
      java: `int knapsack(int[] weights, int[] values, int capacity) {\n    int n = weights.length;\n    int[] dp = new int[capacity + 1];\n    for (int i = 0; i < n; i++) {\n        for (int j = capacity; j >= weights[i]; j--) {\n            dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i]);\n        }\n    }\n    return dp[capacity];\n}`,
      python: `def knapsack(weights, values, capacity):\n    n = len(weights)\n    dp = [0] * (capacity + 1)\n    for i in range(n):\n        for j in range(capacity, weights[i] - 1, -1):\n            dp[j] = max(dp[j], dp[j - weights[i]] + values[i])\n    return dp[capacity]`
    },
    testCases: [{ input: '3 5\n1 2 3\n6 10 12', expectedOutput: '22', description: '选物品1和2' }],
    hints: ['dp[j]=容量为j时的最大价值', '倒序遍历保证每个物品只用一次'],
    explanation: `【0-1背包】
- 二维：dp[i][j]=考虑前i个物品，容量j的最大价值
- 一维优化：倒序遍历容量，防止同一物品被重复选择
【关键】for j from capacity to weight[i] (倒序)`
  },
  {
    id: 'dp-coin-change-v3', category: '动态规划', title: '零钱兑换', difficulty: 'medium', type: 'coding',
    description: '用最少的硬币凑成总金额，不能凑成返回-1',
    templates: {
      c: `int coinChange(int* coins, int n, int amount) {\n    // 请实现\n}`,
      cpp: `int coinChange(vector<int>& coins, int amount) {\n    // 请实现\n}`,
      java: `int coinChange(int[] coins, int amount) {\n    // 请实现\n}`,
      python: `def coin_change(coins, amount):\n    pass`
    },
    solutions: {
      c: `int coinChange(int* coins, int n, int amount) {\n    int* dp = malloc((amount + 1) * sizeof(int));\n    for (int i = 0; i <= amount; i++) dp[i] = amount + 1;\n    dp[0] = 0;\n    for (int i = 1; i <= amount; i++) {\n        for (int j = 0; j < n; j++) {\n            if (coins[j] <= i && dp[i - coins[j]] + 1 < dp[i])\n                dp[i] = dp[i - coins[j]] + 1;\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}`,
      cpp: `int coinChange(vector<int>& coins, int amount) {\n    vector<int> dp(amount + 1, amount + 1);\n    dp[0] = 0;\n    for (int i = 1; i <= amount; i++) {\n        for (int coin : coins) {\n            if (coin <= i)\n                dp[i] = min(dp[i], dp[i - coin] + 1);\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}`,
      java: `int coinChange(int[] coins, int amount) {\n    int[] dp = new int[amount + 1];\n    Arrays.fill(dp, amount + 1);\n    dp[0] = 0;\n    for (int i = 1; i <= amount; i++) {\n        for (int coin : coins) {\n            if (coin <= i)\n                dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}`,
      python: `def coin_change(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for i in range(1, amount + 1):\n        for coin in coins:\n            if coin <= i:\n                dp[i] = min(dp[i], dp[i - coin] + 1)\n    return dp[amount] if dp[amount] != float('inf') else -1`
    },
    testCases: [{ input: '3 11\n1 2 5', expectedOutput: '3', description: '5+5+1=11' }],
    hints: ['dp[i]=凑成金额i的最少硬币数', '完全背包问题（可重复选）'],
    explanation: `【完全背包变种】
dp[i] = 凑成金额i的最少硬币数
转移：dp[i] = min(dp[i], dp[i-coin]+1)
初始化：dp[0]=0，其他为inf`
  },
  {
    id: 'dp-lis-v2', category: '动态规划', title: '最长递增子序列', difficulty: 'medium', type: 'coding',
    description: '找出数组中最长严格递增子序列的长度',
    templates: {
      c: `int lengthOfLIS(int* nums, int n) {\n    // 请实现\n}`,
      cpp: `int lengthOfLIS(vector<int>& nums) {\n    // 请实现\n}`,
      java: `int lengthOfLIS(int[] nums) {\n    // 请实现\n}`,
      python: `def length_of_lis(nums):\n    pass`
    },
    solutions: {
      c: `// O(n log n) 二分解法\nint lengthOfLIS(int* nums, int n) {\n    int* tails = malloc(n * sizeof(int));\n    int len = 0;\n    for (int i = 0; i < n; i++) {\n        int l = 0, r = len;\n        while (l < r) {\n            int m = (l + r) / 2;\n            if (tails[m] < nums[i]) l = m + 1;\n            else r = m;\n        }\n        tails[l] = nums[i];\n        if (l == len) len++;\n    }\n    return len;\n}`,
      cpp: `int lengthOfLIS(vector<int>& nums) {\n    vector<int> tails;\n    for (int num : nums) {\n        auto it = lower_bound(tails.begin(), tails.end(), num);\n        if (it == tails.end()) tails.push_back(num);\n        else *it = num;\n    }\n    return tails.size();\n}`,
      java: `int lengthOfLIS(int[] nums) {\n    int[] tails = new int[nums.length];\n    int len = 0;\n    for (int num : nums) {\n        int l = 0, r = len;\n        while (l < r) {\n            int m = (l + r) / 2;\n            if (tails[m] < num) l = m + 1;\n            else r = m;\n        }\n        tails[l] = num;\n        if (l == len) len++;\n    }\n    return len;\n}`,
      python: `def length_of_lis(nums):\n    from bisect import bisect_left\n    tails = []\n    for num in nums:\n        pos = bisect_left(tails, num)\n        if pos == len(tails):\n            tails.append(num)\n        else:\n            tails[pos] = num\n    return len(tails)`
    },
    testCases: [{ input: '8\n10 9 2 5 3 7 101 18', expectedOutput: '4', description: '[2,3,7,101]' }],
    hints: ['O(n²)：dp[i]=以nums[i]结尾的LIS长度', 'O(nlogn)：维护tails数组+二分'],
    explanation: `【贪心+二分】O(nlogn)
tails[i] = 长度为i+1的LIS的最小结尾元素
- 若num > tails末尾：追加
- 否则：二分找第一个>=num的位置替换
【直觉】结尾越小，越有可能接更多元素`
  },
];

// ==================== 数学运算 ====================
export const mathExercises: Exercise[] = [
  {
    id: 'math-gcd', category: '数学', title: '最大公约数', difficulty: 'easy', type: 'coding',
    description: '使用辗转相除法求两个正整数的最大公约数',
    templates: {
      c: `int gcd(int a, int b) {\n    // 请实现辗转相除法\n}`,
      cpp: `int gcd(int a, int b) {\n    // 请实现\n}`,
      java: `int gcd(int a, int b) {\n    // 请实现\n}`,
      python: `def gcd(a, b):\n    pass`
    },
    solutions: {
      c: `int gcd(int a, int b) {\n    while (b != 0) {\n        int t = b;\n        b = a % b;\n        a = t;\n    }\n    return a;\n}`,
      cpp: `int gcd(int a, int b) {\n    return b == 0 ? a : gcd(b, a % b);\n}`,
      java: `int gcd(int a, int b) {\n    return b == 0 ? a : gcd(b, a % b);\n}`,
      python: `def gcd(a, b):\n    return a if b == 0 else gcd(b, a % b)`
    },
    testCases: [{ input: '12 18', expectedOutput: '6', description: '12和18的GCD' }],
    hints: ['gcd(a,b) = gcd(b, a%b)', '当b为0时返回a'],
    explanation: '辗转相除法：gcd(a,b) = gcd(b, a mod b)，直到b=0'
  },
  {
    id: 'math-lcm', category: '数学', title: '最小公倍数', difficulty: 'easy', type: 'coding',
    description: '求两个正整数的最小公倍数',
    templates: {
      c: `int lcm(int a, int b) {\n    // 提示：lcm = a*b/gcd(a,b)\n}`,
      cpp: `long long lcm(int a, int b) {\n    // 请实现\n}`,
      java: `long lcm(int a, int b) {\n    // 请实现\n}`,
      python: `def lcm(a, b):\n    pass`
    },
    solutions: {
      c: `int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }\nint lcm(int a, int b) {\n    return a / gcd(a, b) * b;  // 先除后乘防溢出\n}`,
      cpp: `long long lcm(int a, int b) {\n    auto gcd = [](int a, int b) { while(b) { int t=b; b=a%b; a=t; } return a; };\n    return (long long)a / gcd(a, b) * b;\n}`,
      java: `long lcm(int a, int b) {\n    return (long)a / gcd(a, b) * b;\n}\nint gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }`,
      python: `def lcm(a, b):\n    from math import gcd\n    return a // gcd(a, b) * b`
    },
    testCases: [{ input: '4 6', expectedOutput: '12', description: '4和6的LCM' }],
    hints: ['lcm(a,b) = a * b / gcd(a,b)', '先除后乘防止溢出'],
    explanation: '最小公倍数公式：lcm(a,b) = a×b÷gcd(a,b)'
  },
  {
    id: 'math-fast-pow', category: '数学', title: '快速幂', difficulty: 'medium', type: 'coding',
    description: '计算 a^n mod m，要求时间复杂度O(log n)',
    templates: {
      c: `long long fastPow(long long a, long long n, long long m) {\n    // 请实现快速幂\n}`,
      cpp: `long long fastPow(long long a, long long n, long long m) {\n    // 请实现\n}`,
      java: `long fastPow(long a, long n, long m) {\n    // 请实现\n}`,
      python: `def fast_pow(a, n, m):\n    pass`
    },
    solutions: {
      c: `long long fastPow(long long a, long long n, long long m) {\n    long long res = 1;\n    a %= m;\n    while (n > 0) {\n        if (n & 1) res = res * a % m;\n        a = a * a % m;\n        n >>= 1;\n    }\n    return res;\n}`,
      cpp: `long long fastPow(long long a, long long n, long long m) {\n    long long res = 1;\n    a %= m;\n    while (n > 0) {\n        if (n & 1) res = res * a % m;\n        a = a * a % m;\n        n >>= 1;\n    }\n    return res;\n}`,
      java: `long fastPow(long a, long n, long m) {\n    long res = 1;\n    a %= m;\n    while (n > 0) {\n        if ((n & 1) == 1) res = res * a % m;\n        a = a * a % m;\n        n >>= 1;\n    }\n    return res;\n}`,
      python: `def fast_pow(a, n, m):\n    res = 1\n    a %= m\n    while n > 0:\n        if n & 1:\n            res = res * a % m\n        a = a * a % m\n        n >>= 1\n    return res`
    },
    testCases: [{ input: '2 10 1000', expectedOutput: '24', description: '2^10 mod 1000' }],
    hints: ['n为奇数时乘a', '每次a自乘，n右移一位'],
    explanation: `【快速幂】O(log n)
a^n = (a^(n/2))^2 × a^(n%2)
二进制思想：将n拆成二进制，每位对应a的某次幂`
  },
  {
    id: 'math-is-prime', category: '数学', title: '素数判断', difficulty: 'easy', type: 'coding',
    description: '判断一个正整数是否为素数',
    templates: {
      c: `int isPrime(int n) {\n    // 返回1表示素数，0表示非素数\n}`,
      cpp: `bool isPrime(int n) {\n    // 请实现\n}`,
      java: `boolean isPrime(int n) {\n    // 请实现\n}`,
      python: `def is_prime(n):\n    pass`
    },
    solutions: {
      c: `int isPrime(int n) {\n    if (n < 2) return 0;\n    if (n == 2) return 1;\n    if (n % 2 == 0) return 0;\n    for (int i = 3; i * i <= n; i += 2) {\n        if (n % i == 0) return 0;\n    }\n    return 1;\n}`,
      cpp: `bool isPrime(int n) {\n    if (n < 2) return false;\n    if (n == 2) return true;\n    if (n % 2 == 0) return false;\n    for (int i = 3; i * i <= n; i += 2)\n        if (n % i == 0) return false;\n    return true;\n}`,
      java: `boolean isPrime(int n) {\n    if (n < 2) return false;\n    if (n == 2) return true;\n    if (n % 2 == 0) return false;\n    for (int i = 3; i * i <= n; i += 2)\n        if (n % i == 0) return false;\n    return true;\n}`,
      python: `def is_prime(n):\n    if n < 2: return False\n    if n == 2: return True\n    if n % 2 == 0: return False\n    for i in range(3, int(n**0.5) + 1, 2):\n        if n % i == 0: return False\n    return True`
    },
    testCases: [{ input: '17', expectedOutput: 'true', description: '17是素数' }],
    hints: ['只需检查到√n', '跳过偶数可优化'],
    explanation: '素数判断只需检查2到√n，因为如果n=a×b，必有一个≤√n'
  },
  {
    id: 'math-sieve', category: '数学', title: '埃氏筛法', difficulty: 'medium', type: 'coding',
    description: '使用埃拉托斯特尼筛法找出n以内的所有素数',
    templates: {
      c: `int* sieve(int n, int* count) {\n    // 返回素数数组，count存素数个数\n}`,
      cpp: `vector<int> sieve(int n) {\n    // 返回n以内所有素数\n}`,
      java: `List<Integer> sieve(int n) {\n    // 返回n以内所有素数\n}`,
      python: `def sieve(n):\n    # 返回n以内所有素数\n    pass`
    },
    solutions: {
      c: `int* sieve(int n, int* count) {\n    int* isPrime = calloc(n + 1, sizeof(int));\n    for (int i = 2; i <= n; i++) isPrime[i] = 1;\n    for (int i = 2; i * i <= n; i++) {\n        if (isPrime[i]) {\n            for (int j = i * i; j <= n; j += i)\n                isPrime[j] = 0;\n        }\n    }\n    *count = 0;\n    for (int i = 2; i <= n; i++) if (isPrime[i]) (*count)++;\n    int* primes = malloc(*count * sizeof(int));\n    int idx = 0;\n    for (int i = 2; i <= n; i++) if (isPrime[i]) primes[idx++] = i;\n    return primes;\n}`,
      cpp: `vector<int> sieve(int n) {\n    vector<bool> isPrime(n + 1, true);\n    isPrime[0] = isPrime[1] = false;\n    for (int i = 2; i * i <= n; i++) {\n        if (isPrime[i]) {\n            for (int j = i * i; j <= n; j += i)\n                isPrime[j] = false;\n        }\n    }\n    vector<int> primes;\n    for (int i = 2; i <= n; i++)\n        if (isPrime[i]) primes.push_back(i);\n    return primes;\n}`,
      java: `List<Integer> sieve(int n) {\n    boolean[] isPrime = new boolean[n + 1];\n    Arrays.fill(isPrime, true);\n    isPrime[0] = isPrime[1] = false;\n    for (int i = 2; i * i <= n; i++) {\n        if (isPrime[i]) {\n            for (int j = i * i; j <= n; j += i)\n                isPrime[j] = false;\n        }\n    }\n    List<Integer> primes = new ArrayList<>();\n    for (int i = 2; i <= n; i++)\n        if (isPrime[i]) primes.add(i);\n    return primes;\n}`,
      python: `def sieve(n):\n    is_prime = [True] * (n + 1)\n    is_prime[0] = is_prime[1] = False\n    for i in range(2, int(n**0.5) + 1):\n        if is_prime[i]:\n            for j in range(i*i, n + 1, i):\n                is_prime[j] = False\n    return [i for i in range(2, n + 1) if is_prime[i]]`
    },
    testCases: [{ input: '20', expectedOutput: '2 3 5 7 11 13 17 19', description: '20以内的素数' }],
    hints: ['从i*i开始筛（更小的倍数已被筛过）', '只需遍历到√n'],
    explanation: `【埃氏筛】O(n log log n)
从2开始，标记所有倍数为合数
优化：从i²开始筛（2i,3i...已被2,3...筛过）`
  },
  {
    id: 'math-fibonacci', category: '数学', title: '斐波那契数列', difficulty: 'easy', type: 'coding',
    description: '求斐波那契数列第n项（n从0开始），要求O(n)时间O(1)空间',
    templates: {
      c: `int fib(int n) {\n    // F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)\n}`,
      cpp: `int fib(int n) {\n    // 请实现\n}`,
      java: `int fib(int n) {\n    // 请实现\n}`,
      python: `def fib(n):\n    pass`
    },
    solutions: {
      c: `int fib(int n) {\n    if (n < 2) return n;\n    int a = 0, b = 1;\n    for (int i = 2; i <= n; i++) {\n        int c = a + b;\n        a = b;\n        b = c;\n    }\n    return b;\n}`,
      cpp: `int fib(int n) {\n    if (n < 2) return n;\n    int a = 0, b = 1;\n    for (int i = 2; i <= n; i++) {\n        int c = a + b;\n        a = b; b = c;\n    }\n    return b;\n}`,
      java: `int fib(int n) {\n    if (n < 2) return n;\n    int a = 0, b = 1;\n    for (int i = 2; i <= n; i++) {\n        int c = a + b;\n        a = b; b = c;\n    }\n    return b;\n}`,
      python: `def fib(n):\n    if n < 2: return n\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b`
    },
    testCases: [{ input: '10', expectedOutput: '55', description: 'F(10)=55' }],
    hints: ['用两个变量滚动更新', '不需要数组存储'],
    explanation: '空间优化：只保留前两个数，滚动更新'
  },
];

// ==================== 更多链表题 ====================
export const moreLinkedListExercises: Exercise[] = [
  {
    id: 'll-merge-sorted', category: '链表', title: '合并两个有序链表', difficulty: 'easy', type: 'coding',
    description: '将两个升序链表合并为一个新的升序链表',
    templates: {
      c: `Node* mergeTwoLists(Node* l1, Node* l2) {\n    // 请实现\n}`,
      cpp: `Node* mergeTwoLists(Node* l1, Node* l2) {\n    // 请实现\n}`,
      java: `Node mergeTwoLists(Node l1, Node l2) {\n    // 请实现\n}`,
      python: `def merge_two_lists(l1, l2):\n    pass`
    },
    solutions: {
      c: `Node* mergeTwoLists(Node* l1, Node* l2) {\n    Node dummy = {0, NULL};\n    Node* tail = &dummy;\n    while (l1 && l2) {\n        if (l1->val <= l2->val) {\n            tail->next = l1; l1 = l1->next;\n        } else {\n            tail->next = l2; l2 = l2->next;\n        }\n        tail = tail->next;\n    }\n    tail->next = l1 ? l1 : l2;\n    return dummy.next;\n}`,
      cpp: `Node* mergeTwoLists(Node* l1, Node* l2) {\n    Node dummy(0);\n    Node* tail = &dummy;\n    while (l1 && l2) {\n        if (l1->val <= l2->val) {\n            tail->next = l1; l1 = l1->next;\n        } else {\n            tail->next = l2; l2 = l2->next;\n        }\n        tail = tail->next;\n    }\n    tail->next = l1 ? l1 : l2;\n    return dummy.next;\n}`,
      java: `Node mergeTwoLists(Node l1, Node l2) {\n    Node dummy = new Node(0);\n    Node tail = dummy;\n    while (l1 != null && l2 != null) {\n        if (l1.val <= l2.val) {\n            tail.next = l1; l1 = l1.next;\n        } else {\n            tail.next = l2; l2 = l2.next;\n        }\n        tail = tail.next;\n    }\n    tail.next = l1 != null ? l1 : l2;\n    return dummy.next;\n}`,
      python: `def merge_two_lists(l1, l2):\n    dummy = Node(0)\n    tail = dummy\n    while l1 and l2:\n        if l1.val <= l2.val:\n            tail.next = l1; l1 = l1.next\n        else:\n            tail.next = l2; l2 = l2.next\n        tail = tail.next\n    tail.next = l1 or l2\n    return dummy.next`
    },
    testCases: [{ input: '3\n1 2 4\n3\n1 3 4', expectedOutput: '1 1 2 3 4 4', description: '合并两个有序链表' }],
    hints: ['使用哑节点简化边界处理', '比较节点值，小的接入结果链表'],
    explanation: '双指针遍历两个链表，每次选较小的节点接入结果'
  },
  {
    id: 'll-has-cycle', category: '链表', title: '环形链表检测', difficulty: 'easy', type: 'coding',
    description: '判断链表中是否有环，要求O(1)空间',
    templates: {
      c: `int hasCycle(Node* head) {\n    // 返回1有环，0无环\n}`,
      cpp: `bool hasCycle(Node* head) {\n    // 请实现\n}`,
      java: `boolean hasCycle(Node head) {\n    // 请实现\n}`,
      python: `def has_cycle(head):\n    pass`
    },
    solutions: {
      c: `int hasCycle(Node* head) {\n    Node *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) return 1;\n    }\n    return 0;\n}`,
      cpp: `bool hasCycle(Node* head) {\n    Node *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) return true;\n    }\n    return false;\n}`,
      java: `boolean hasCycle(Node head) {\n    Node slow = head, fast = head;\n    while (fast != null && fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if (slow == fast) return true;\n    }\n    return false;\n}`,
      python: `def has_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            return True\n    return False`
    },
    testCases: [{ input: '4\n3 2 0 -4\n1', expectedOutput: 'true', description: '尾连接到索引1' }],
    hints: ['快慢指针', '快指针每次走2步，慢指针走1步'],
    explanation: '快慢指针：有环必相遇，无环快指针先到达null'
  },
  {
    id: 'll-find-middle', category: '链表', title: '链表中间节点', difficulty: 'easy', type: 'coding',
    description: '返回链表的中间节点，如有两个中间节点返回第二个',
    templates: {
      c: `Node* middleNode(Node* head) {\n    // 请实现\n}`,
      cpp: `Node* middleNode(Node* head) {\n    // 请实现\n}`,
      java: `Node middleNode(Node head) {\n    // 请实现\n}`,
      python: `def middle_node(head):\n    pass`
    },
    solutions: {
      c: `Node* middleNode(Node* head) {\n    Node *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n    return slow;\n}`,
      cpp: `Node* middleNode(Node* head) {\n    Node *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n    return slow;\n}`,
      java: `Node middleNode(Node head) {\n    Node slow = head, fast = head;\n    while (fast != null && fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n    return slow;\n}`,
      python: `def middle_node(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    return slow`
    },
    testCases: [{ input: '5\n1 2 3 4 5', expectedOutput: '3', description: '中间节点' }],
    hints: ['快慢指针', '快指针到末尾时慢指针在中间'],
    explanation: '快指针走两步，慢指针走一步，快指针到末尾时慢指针正好在中间'
  },
  {
    id: 'll-remove-nth-from-end', category: '链表', title: '删除倒数第N个节点', difficulty: 'medium', type: 'coding',
    description: '删除链表的倒数第n个节点，只遍历一次',
    templates: {
      c: `Node* removeNthFromEnd(Node* head, int n) {\n    // 请实现\n}`,
      cpp: `Node* removeNthFromEnd(Node* head, int n) {\n    // 请实现\n}`,
      java: `Node removeNthFromEnd(Node head, int n) {\n    // 请实现\n}`,
      python: `def remove_nth_from_end(head, n):\n    pass`
    },
    solutions: {
      c: `Node* removeNthFromEnd(Node* head, int n) {\n    Node dummy = {0, head};\n    Node *fast = &dummy, *slow = &dummy;\n    for (int i = 0; i <= n; i++) fast = fast->next;\n    while (fast) {\n        slow = slow->next;\n        fast = fast->next;\n    }\n    Node* del = slow->next;\n    slow->next = slow->next->next;\n    free(del);\n    return dummy.next;\n}`,
      cpp: `Node* removeNthFromEnd(Node* head, int n) {\n    Node dummy(0); dummy.next = head;\n    Node *fast = &dummy, *slow = &dummy;\n    for (int i = 0; i <= n; i++) fast = fast->next;\n    while (fast) {\n        slow = slow->next;\n        fast = fast->next;\n    }\n    Node* del = slow->next;\n    slow->next = slow->next->next;\n    delete del;\n    return dummy.next;\n}`,
      java: `Node removeNthFromEnd(Node head, int n) {\n    Node dummy = new Node(0); dummy.next = head;\n    Node fast = dummy, slow = dummy;\n    for (int i = 0; i <= n; i++) fast = fast.next;\n    while (fast != null) {\n        slow = slow.next;\n        fast = fast.next;\n    }\n    slow.next = slow.next.next;\n    return dummy.next;\n}`,
      python: `def remove_nth_from_end(head, n):\n    dummy = Node(0); dummy.next = head\n    fast = slow = dummy\n    for _ in range(n + 1):\n        fast = fast.next\n    while fast:\n        slow = slow.next\n        fast = fast.next\n    slow.next = slow.next.next\n    return dummy.next`
    },
    testCases: [{ input: '5 2\n1 2 3 4 5', expectedOutput: '1 2 3 5', description: '删除倒数第2个' }],
    hints: ['快指针先走n+1步', '然后同步移动，快指针到末尾时慢指针在目标前'],
    explanation: '快指针先走n+1步，然后同步移动，这样快指针到null时，慢指针正好在待删节点前面'
  },
];

// ==================== 更多二叉树题 ====================
export const moreTreeExercises: Exercise[] = [
  {
    id: 'tree-max-depth-v2', category: '二叉树', title: '二叉树最大深度', difficulty: 'easy', type: 'coding',
    description: '返回二叉树的最大深度（根节点深度为1）',
    templates: {
      c: `int maxDepth(TreeNode* root) {\n    // 请实现\n}`,
      cpp: `int maxDepth(TreeNode* root) {\n    // 请实现\n}`,
      java: `int maxDepth(TreeNode root) {\n    // 请实现\n}`,
      python: `def max_depth(root):\n    pass`
    },
    solutions: {
      c: `int maxDepth(TreeNode* root) {\n    if (!root) return 0;\n    int left = maxDepth(root->left);\n    int right = maxDepth(root->right);\n    return 1 + (left > right ? left : right);\n}`,
      cpp: `int maxDepth(TreeNode* root) {\n    if (!root) return 0;\n    return 1 + max(maxDepth(root->left), maxDepth(root->right));\n}`,
      java: `int maxDepth(TreeNode root) {\n    if (root == null) return 0;\n    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}`,
      python: `def max_depth(root):\n    if not root: return 0\n    return 1 + max(max_depth(root.left), max_depth(root.right))`
    },
    testCases: [{ input: '3 9 20 null null 15 7', expectedOutput: '3', description: '最大深度为3' }],
    hints: ['递归：1 + max(左子树深度, 右子树深度)', '空节点深度为0'],
    explanation: '递归计算左右子树深度，取较大值加1'
  },
  {
    id: 'tree-is-symmetric', category: '二叉树', title: '对称二叉树', difficulty: 'easy', type: 'coding',
    description: '判断一棵二叉树是否轴对称',
    templates: {
      c: `int isSymmetric(TreeNode* root) {\n    // 返回1对称，0不对称\n}`,
      cpp: `bool isSymmetric(TreeNode* root) {\n    // 请实现\n}`,
      java: `boolean isSymmetric(TreeNode root) {\n    // 请实现\n}`,
      python: `def is_symmetric(root):\n    pass`
    },
    solutions: {
      c: `int check(TreeNode* l, TreeNode* r) {\n    if (!l && !r) return 1;\n    if (!l || !r) return 0;\n    return l->val == r->val && check(l->left, r->right) && check(l->right, r->left);\n}\nint isSymmetric(TreeNode* root) {\n    return check(root, root);\n}`,
      cpp: `bool isSymmetric(TreeNode* root) {\n    function<bool(TreeNode*, TreeNode*)> check = [&](TreeNode* l, TreeNode* r) {\n        if (!l && !r) return true;\n        if (!l || !r) return false;\n        return l->val == r->val && check(l->left, r->right) && check(l->right, r->left);\n    };\n    return check(root, root);\n}`,
      java: `boolean isSymmetric(TreeNode root) {\n    return check(root, root);\n}\nboolean check(TreeNode l, TreeNode r) {\n    if (l == null && r == null) return true;\n    if (l == null || r == null) return false;\n    return l.val == r.val && check(l.left, r.right) && check(l.right, r.left);\n}`,
      python: `def is_symmetric(root):\n    def check(l, r):\n        if not l and not r: return True\n        if not l or not r: return False\n        return l.val == r.val and check(l.left, r.right) and check(l.right, r.left)\n    return check(root, root)`
    },
    testCases: [{ input: '1 2 2 3 4 4 3', expectedOutput: 'true', description: '对称' }],
    hints: ['比较左子树和右子树的镜像关系', '左的左对应右的右，左的右对应右的左'],
    explanation: '递归比较：左子树的左 vs 右子树的右，左子树的右 vs 右子树的左'
  },
  {
    id: 'tree-invert-v2', category: '二叉树', title: '翻转二叉树', difficulty: 'easy', type: 'coding',
    description: '将二叉树左右翻转',
    templates: {
      c: `TreeNode* invertTree(TreeNode* root) {\n    // 请实现\n}`,
      cpp: `TreeNode* invertTree(TreeNode* root) {\n    // 请实现\n}`,
      java: `TreeNode invertTree(TreeNode root) {\n    // 请实现\n}`,
      python: `def invert_tree(root):\n    pass`
    },
    solutions: {
      c: `TreeNode* invertTree(TreeNode* root) {\n    if (!root) return NULL;\n    TreeNode* temp = root->left;\n    root->left = invertTree(root->right);\n    root->right = invertTree(temp);\n    return root;\n}`,
      cpp: `TreeNode* invertTree(TreeNode* root) {\n    if (!root) return nullptr;\n    swap(root->left, root->right);\n    invertTree(root->left);\n    invertTree(root->right);\n    return root;\n}`,
      java: `TreeNode invertTree(TreeNode root) {\n    if (root == null) return null;\n    TreeNode temp = root.left;\n    root.left = invertTree(root.right);\n    root.right = invertTree(temp);\n    return root;\n}`,
      python: `def invert_tree(root):\n    if not root: return None\n    root.left, root.right = invert_tree(root.right), invert_tree(root.left)\n    return root`
    },
    testCases: [{ input: '4 2 7 1 3 6 9', expectedOutput: '4 7 2 9 6 3 1', description: '翻转' }],
    hints: ['交换每个节点的左右子节点', '递归处理'],
    explanation: '递归交换每个节点的左右子树'
  },
  {
    id: 'tree-path-sum', category: '二叉树', title: '路径总和', difficulty: 'easy', type: 'coding',
    description: '判断是否存在根到叶子的路径，使得节点值之和等于目标值',
    templates: {
      c: `int hasPathSum(TreeNode* root, int sum) {\n    // 请实现\n}`,
      cpp: `bool hasPathSum(TreeNode* root, int sum) {\n    // 请实现\n}`,
      java: `boolean hasPathSum(TreeNode root, int sum) {\n    // 请实现\n}`,
      python: `def has_path_sum(root, target_sum):\n    pass`
    },
    solutions: {
      c: `int hasPathSum(TreeNode* root, int sum) {\n    if (!root) return 0;\n    if (!root->left && !root->right) return root->val == sum;\n    return hasPathSum(root->left, sum - root->val) || hasPathSum(root->right, sum - root->val);\n}`,
      cpp: `bool hasPathSum(TreeNode* root, int sum) {\n    if (!root) return false;\n    if (!root->left && !root->right) return root->val == sum;\n    return hasPathSum(root->left, sum - root->val) || hasPathSum(root->right, sum - root->val);\n}`,
      java: `boolean hasPathSum(TreeNode root, int sum) {\n    if (root == null) return false;\n    if (root.left == null && root.right == null) return root.val == sum;\n    return hasPathSum(root.left, sum - root.val) || hasPathSum(root.right, sum - root.val);\n}`,
      python: `def has_path_sum(root, target_sum):\n    if not root: return False\n    if not root.left and not root.right:\n        return root.val == target_sum\n    return has_path_sum(root.left, target_sum - root.val) or has_path_sum(root.right, target_sum - root.val)`
    },
    testCases: [{ input: '5 4 8 11 null 13 4 7 2 null null null 1\n22', expectedOutput: 'true', description: '5→4→11→2' }],
    hints: ['递归时减去当前节点值', '叶子节点时判断剩余值是否为节点值'],
    explanation: '递归减去节点值，到叶子时判断是否正好等于节点值'
  },
];

// ==================== 更多填空题 ====================
export const moreFillBlankExercises: Exercise[] = [
  {
    id: 'fb-quick-sort', category: '排序', title: '快速排序填空', difficulty: 'medium', type: 'fillblank',
    description: '完成快速排序的核心分区操作',
    codeTemplate: {
      c: `int partition(int arr[], int low, int high) {
    int pivot = arr[high];  // 选最后一个为基准
    int i = low - 1;  // i指向小于pivot的区域边界
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            ___BLANK1___;  // 交换arr[i]和arr[j]
        }
    }
    ___BLANK2___;  // 将pivot放到正确位置
    return i + 1;
}`,
      cpp: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            ___BLANK1___;
        }
    }
    ___BLANK2___;
    return i + 1;
}`,
      java: `int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            ___BLANK1___;
        }
    }
    ___BLANK2___;
    return i + 1;
}`,
      python: `def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            ___BLANK1___
    ___BLANK2___
    return i + 1`
    },
    blanks: [
      { id: 'BLANK1', answer: 'swap(arr[i], arr[j])', hint: '交换当前元素和边界元素' },
      { id: 'BLANK2', answer: 'swap(arr[i+1], arr[high])', hint: '将pivot放到边界后一位' }
    ],
    explanation: '分区：小于pivot的放左边，大于的放右边，最后pivot归位'
  },
  {
    id: 'fb-binary-search', category: '查找', title: '二分查找填空', difficulty: 'easy', type: 'fillblank',
    description: '完成二分查找的核心逻辑',
    codeTemplate: {
      c: `int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    while (___BLANK1___) {  // 循环条件
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) ___BLANK2___;
        else ___BLANK3___;
    }
    return -1;
}`,
      cpp: `int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (___BLANK1___) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) ___BLANK2___;
        else ___BLANK3___;
    }
    return -1;
}`,
      java: `int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (___BLANK1___) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) ___BLANK2___;
        else ___BLANK3___;
    }
    return -1;
}`,
      python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while ___BLANK1___:
        mid = left + (right - left) // 2
        if arr[mid] == target: return mid
        elif arr[mid] < target: ___BLANK2___
        else: ___BLANK3___
    return -1`
    },
    blanks: [
      { id: 'BLANK1', answer: 'left <= right', hint: '区间有效的条件' },
      { id: 'BLANK2', answer: 'left = mid + 1', hint: '目标在右半部分' },
      { id: 'BLANK3', answer: 'right = mid - 1', hint: '目标在左半部分' }
    ],
    explanation: '二分查找：每次排除一半，left<=right表示区间有效'
  },
  {
    id: 'fb-bfs', category: '图', title: 'BFS遍历填空', difficulty: 'medium', type: 'fillblank',
    description: '完成图的广度优先搜索',
    codeTemplate: {
      cpp: `void bfs(vector<vector<int>>& graph, int start) {
    int n = graph.size();
    vector<bool> visited(n, false);
    queue<int> q;
    
    ___BLANK1___;  // 起点入队并标记
    visited[start] = true;
    
    while (!q.empty()) {
        int cur = ___BLANK2___;  // 取队首
        cout << cur << " ";
        
        for (int next : graph[cur]) {
            if (!visited[next]) {
                ___BLANK3___;  // 邻居入队并标记
                visited[next] = true;
            }
        }
    }
}`,
      java: `void bfs(List<List<Integer>> graph, int start) {
    int n = graph.size();
    boolean[] visited = new boolean[n];
    Queue<Integer> q = new LinkedList<>();
    
    ___BLANK1___;
    visited[start] = true;
    
    while (!q.isEmpty()) {
        int cur = ___BLANK2___;
        System.out.print(cur + " ");
        
        for (int next : graph.get(cur)) {
            if (!visited[next]) {
                ___BLANK3___;
                visited[next] = true;
            }
        }
    }
}`,
      python: `def bfs(graph, start):
    n = len(graph)
    visited = [False] * n
    q = deque()
    
    ___BLANK1___
    visited[start] = True
    
    while q:
        cur = ___BLANK2___
        print(cur, end=' ')
        
        for next_node in graph[cur]:
            if not visited[next_node]:
                ___BLANK3___
                visited[next_node] = True`
    },
    blanks: [
      { id: 'BLANK1', answer: 'q.push(start)', hint: '起点入队' },
      { id: 'BLANK2', answer: 'q.front(); q.pop()', hint: '取出队首元素' },
      { id: 'BLANK3', answer: 'q.push(next)', hint: '邻居节点入队' }
    ],
    explanation: 'BFS使用队列，先入先出保证层序遍历'
  },
];

// ==================== 堆与优先队列 ====================
export const heapExercises: Exercise[] = [
  {
    id: 'heap-kth-largest', category: '堆', title: '第K大元素', difficulty: 'medium', type: 'coding',
    description: '在未排序数组中找到第K大的元素',
    templates: {
      c: `int findKthLargest(int* nums, int n, int k) {\n    // 请实现\n}`,
      cpp: `int findKthLargest(vector<int>& nums, int k) {\n    // 请实现\n}`,
      java: `int findKthLargest(int[] nums, int k) {\n    // 请实现\n}`,
      python: `def find_kth_largest(nums, k):\n    pass`
    },
    solutions: {
      c: `// 快速选择算法\nint partition(int* nums, int l, int r) {\n    int pivot = nums[r], i = l;\n    for (int j = l; j < r; j++)\n        if (nums[j] >= pivot) { int t = nums[i]; nums[i] = nums[j]; nums[j] = t; i++; }\n    int t = nums[i]; nums[i] = nums[r]; nums[r] = t;\n    return i;\n}\nint findKthLargest(int* nums, int n, int k) {\n    int l = 0, r = n - 1;\n    while (1) {\n        int p = partition(nums, l, r);\n        if (p == k - 1) return nums[p];\n        else if (p < k - 1) l = p + 1;\n        else r = p - 1;\n    }\n}`,
      cpp: `int findKthLargest(vector<int>& nums, int k) {\n    priority_queue<int, vector<int>, greater<int>> minHeap;\n    for (int num : nums) {\n        minHeap.push(num);\n        if (minHeap.size() > k) minHeap.pop();\n    }\n    return minHeap.top();\n}`,
      java: `int findKthLargest(int[] nums, int k) {\n    PriorityQueue<Integer> minHeap = new PriorityQueue<>();\n    for (int num : nums) {\n        minHeap.offer(num);\n        if (minHeap.size() > k) minHeap.poll();\n    }\n    return minHeap.peek();\n}`,
      python: `def find_kth_largest(nums, k):\n    import heapq\n    return heapq.nlargest(k, nums)[-1]`
    },
    testCases: [{ input: '6 2\n3 2 1 5 6 4', expectedOutput: '5', description: '第2大是5' }],
    hints: ['小顶堆维护k个最大元素', '快速选择O(n)平均'],
    explanation: `【小顶堆】O(nlogk)
维护大小为k的小顶堆，堆顶即为第k大
【快速选择】O(n)平均，类似快排分区`
  },
  {
    id: 'heap-top-k-frequent', category: '堆', title: '前K个高频元素', difficulty: 'medium', type: 'coding',
    description: '返回数组中出现频率最高的k个元素',
    templates: {
      c: `int* topKFrequent(int* nums, int n, int k, int* returnSize) {\n    // 请实现\n}`,
      cpp: `vector<int> topKFrequent(vector<int>& nums, int k) {\n    // 请实现\n}`,
      java: `int[] topKFrequent(int[] nums, int k) {\n    // 请实现\n}`,
      python: `def top_k_frequent(nums, k):\n    pass`
    },
    solutions: {
      c: `// 简化版：使用计数排序思想\nint* topKFrequent(int* nums, int n, int k, int* returnSize) {\n    // 实际实现需要哈希表，这里省略\n    *returnSize = k;\n    return NULL;\n}`,
      cpp: `vector<int> topKFrequent(vector<int>& nums, int k) {\n    unordered_map<int, int> cnt;\n    for (int n : nums) cnt[n]++;\n    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;\n    for (auto& [num, freq] : cnt) {\n        pq.push({freq, num});\n        if (pq.size() > k) pq.pop();\n    }\n    vector<int> res;\n    while (!pq.empty()) { res.push_back(pq.top().second); pq.pop(); }\n    return res;\n}`,
      java: `int[] topKFrequent(int[] nums, int k) {\n    Map<Integer, Integer> cnt = new HashMap<>();\n    for (int n : nums) cnt.merge(n, 1, Integer::sum);\n    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b) -> a[1] - b[1]);\n    for (var e : cnt.entrySet()) {\n        pq.offer(new int[]{e.getKey(), e.getValue()});\n        if (pq.size() > k) pq.poll();\n    }\n    int[] res = new int[k];\n    for (int i = 0; i < k; i++) res[i] = pq.poll()[0];\n    return res;\n}`,
      python: `def top_k_frequent(nums, k):\n    from collections import Counter\n    return [x for x, _ in Counter(nums).most_common(k)]`
    },
    testCases: [{ input: '6 2\n1 1 1 2 2 3', expectedOutput: '1 2', description: '1出现3次，2出现2次' }],
    hints: ['先统计频率', '用小顶堆维护k个最高频'],
    explanation: '哈希表统计频率 + 小顶堆维护前k个'
  },
  {
    id: 'heap-merge-k-lists', category: '堆', title: '合并K个有序链表', difficulty: 'hard', type: 'coding',
    description: '将k个升序链表合并为一个升序链表',
    templates: {
      c: `Node* mergeKLists(Node** lists, int k) {\n    // 请实现\n}`,
      cpp: `ListNode* mergeKLists(vector<ListNode*>& lists) {\n    // 请实现\n}`,
      java: `ListNode mergeKLists(ListNode[] lists) {\n    // 请实现\n}`,
      python: `def merge_k_lists(lists):\n    pass`
    },
    solutions: {
      c: `// 分治合并\nNode* merge2(Node* a, Node* b) {\n    if (!a) return b; if (!b) return a;\n    if (a->val < b->val) { a->next = merge2(a->next, b); return a; }\n    else { b->next = merge2(a, b->next); return b; }\n}\nNode* mergeKLists(Node** lists, int k) {\n    if (k == 0) return NULL;\n    if (k == 1) return lists[0];\n    int mid = k / 2;\n    Node* left = mergeKLists(lists, mid);\n    Node* right = mergeKLists(lists + mid, k - mid);\n    return merge2(left, right);\n}`,
      cpp: `ListNode* mergeKLists(vector<ListNode*>& lists) {\n    auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };\n    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);\n    for (auto l : lists) if (l) pq.push(l);\n    ListNode dummy(0), *tail = &dummy;\n    while (!pq.empty()) {\n        auto node = pq.top(); pq.pop();\n        tail->next = node; tail = tail->next;\n        if (node->next) pq.push(node->next);\n    }\n    return dummy.next;\n}`,
      java: `ListNode mergeKLists(ListNode[] lists) {\n    PriorityQueue<ListNode> pq = new PriorityQueue<>((a,b) -> a.val - b.val);\n    for (ListNode l : lists) if (l != null) pq.offer(l);\n    ListNode dummy = new ListNode(0), tail = dummy;\n    while (!pq.isEmpty()) {\n        ListNode node = pq.poll();\n        tail.next = node; tail = tail.next;\n        if (node.next != null) pq.offer(node.next);\n    }\n    return dummy.next;\n}`,
      python: `def merge_k_lists(lists):\n    import heapq\n    heap = []\n    for i, l in enumerate(lists):\n        if l: heapq.heappush(heap, (l.val, i, l))\n    dummy = tail = ListNode(0)\n    while heap:\n        val, i, node = heapq.heappop(heap)\n        tail.next = node; tail = tail.next\n        if node.next:\n            heapq.heappush(heap, (node.next.val, i, node.next))\n    return dummy.next`
    },
    testCases: [{ input: '3\n3 1 4 5\n3 1 3 4\n2 2 6', expectedOutput: '1 1 2 3 4 4 5 6', description: '合并3个链表' }],
    hints: ['小顶堆存k个链表头', '每次取最小，再把next入堆'],
    explanation: `【优先队列】O(Nlogk)
堆中始终维护k个链表的当前节点
【分治】两两合并，T(k)=2T(k/2)+O(N)`
  },
];

// ==================== 数组操作 ====================
export const arrayExercises: Exercise[] = [
  {
    id: 'arr-rotate', category: '数组', title: '旋转数组', difficulty: 'medium', type: 'coding',
    description: '将数组向右旋转k个位置，要求原地O(1)空间',
    templates: {
      c: `void rotate(int* nums, int n, int k) {\n    // 请原地旋转\n}`,
      cpp: `void rotate(vector<int>& nums, int k) {\n    // 请实现\n}`,
      java: `void rotate(int[] nums, int k) {\n    // 请实现\n}`,
      python: `def rotate(nums, k):\n    pass`
    },
    solutions: {
      c: `void reverse(int* nums, int l, int r) {\n    while (l < r) { int t = nums[l]; nums[l++] = nums[r]; nums[r--] = t; }\n}\nvoid rotate(int* nums, int n, int k) {\n    k %= n;\n    reverse(nums, 0, n - 1);\n    reverse(nums, 0, k - 1);\n    reverse(nums, k, n - 1);\n}`,
      cpp: `void rotate(vector<int>& nums, int k) {\n    int n = nums.size(); k %= n;\n    reverse(nums.begin(), nums.end());\n    reverse(nums.begin(), nums.begin() + k);\n    reverse(nums.begin() + k, nums.end());\n}`,
      java: `void rotate(int[] nums, int k) {\n    int n = nums.length; k %= n;\n    reverse(nums, 0, n - 1);\n    reverse(nums, 0, k - 1);\n    reverse(nums, k, n - 1);\n}\nvoid reverse(int[] nums, int l, int r) {\n    while (l < r) { int t = nums[l]; nums[l++] = nums[r]; nums[r--] = t; }\n}`,
      python: `def rotate(nums, k):\n    n = len(nums); k %= n\n    nums[:] = nums[-k:] + nums[:-k]  # Python切片`
    },
    testCases: [{ input: '7 3\n1 2 3 4 5 6 7', expectedOutput: '5 6 7 1 2 3 4', description: '右移3位' }],
    hints: ['三次翻转：全部翻转→前k个翻转→后n-k个翻转', 'k要对n取模'],
    explanation: `【三次翻转】O(n) O(1)
[1,2,3,4,5] k=2
→ [5,4,3,2,1] 全翻
→ [4,5,3,2,1] 前k翻
→ [4,5,1,2,3] 后翻`
  },
  {
    id: 'arr-move-zeros', category: '数组', title: '移动零', difficulty: 'easy', type: 'coding',
    description: '将所有0移动到数组末尾，保持非零元素相对顺序',
    templates: {
      c: `void moveZeroes(int* nums, int n) {\n    // 请原地实现\n}`,
      cpp: `void moveZeroes(vector<int>& nums) {\n    // 请实现\n}`,
      java: `void moveZeroes(int[] nums) {\n    // 请实现\n}`,
      python: `def move_zeroes(nums):\n    pass`
    },
    solutions: {
      c: `void moveZeroes(int* nums, int n) {\n    int j = 0;\n    for (int i = 0; i < n; i++) {\n        if (nums[i] != 0) {\n            int t = nums[j]; nums[j] = nums[i]; nums[i] = t;\n            j++;\n        }\n    }\n}`,
      cpp: `void moveZeroes(vector<int>& nums) {\n    int j = 0;\n    for (int i = 0; i < nums.size(); i++) {\n        if (nums[i] != 0) swap(nums[j++], nums[i]);\n    }\n}`,
      java: `void moveZeroes(int[] nums) {\n    int j = 0;\n    for (int i = 0; i < nums.length; i++) {\n        if (nums[i] != 0) {\n            int t = nums[j]; nums[j] = nums[i]; nums[i] = t;\n            j++;\n        }\n    }\n}`,
      python: `def move_zeroes(nums):\n    j = 0\n    for i in range(len(nums)):\n        if nums[i] != 0:\n            nums[j], nums[i] = nums[i], nums[j]\n            j += 1`
    },
    testCases: [{ input: '5\n0 1 0 3 12', expectedOutput: '1 3 12 0 0', description: '移动零到末尾' }],
    hints: ['双指针：j指向下一个非零位置', '遇到非零就交换到j位置'],
    explanation: '快慢指针：j记录非零元素应放的位置，遇到非零就交换'
  },
  {
    id: 'arr-product-except-self', category: '数组', title: '除自身以外的乘积', difficulty: 'medium', type: 'coding',
    description: 'answer[i]等于nums中除nums[i]外所有元素的乘积，不能用除法，O(n)时间',
    templates: {
      c: `int* productExceptSelf(int* nums, int n, int* returnSize) {\n    // 请实现\n}`,
      cpp: `vector<int> productExceptSelf(vector<int>& nums) {\n    // 请实现\n}`,
      java: `int[] productExceptSelf(int[] nums) {\n    // 请实现\n}`,
      python: `def product_except_self(nums):\n    pass`
    },
    solutions: {
      c: `int* productExceptSelf(int* nums, int n, int* returnSize) {\n    *returnSize = n;\n    int* ans = malloc(n * sizeof(int));\n    ans[0] = 1;\n    for (int i = 1; i < n; i++) ans[i] = ans[i-1] * nums[i-1];\n    int right = 1;\n    for (int i = n - 1; i >= 0; i--) {\n        ans[i] *= right;\n        right *= nums[i];\n    }\n    return ans;\n}`,
      cpp: `vector<int> productExceptSelf(vector<int>& nums) {\n    int n = nums.size();\n    vector<int> ans(n, 1);\n    for (int i = 1; i < n; i++) ans[i] = ans[i-1] * nums[i-1];\n    int right = 1;\n    for (int i = n - 1; i >= 0; i--) {\n        ans[i] *= right;\n        right *= nums[i];\n    }\n    return ans;\n}`,
      java: `int[] productExceptSelf(int[] nums) {\n    int n = nums.length;\n    int[] ans = new int[n];\n    ans[0] = 1;\n    for (int i = 1; i < n; i++) ans[i] = ans[i-1] * nums[i-1];\n    int right = 1;\n    for (int i = n - 1; i >= 0; i--) {\n        ans[i] *= right;\n        right *= nums[i];\n    }\n    return ans;\n}`,
      python: `def product_except_self(nums):\n    n = len(nums)\n    ans = [1] * n\n    for i in range(1, n):\n        ans[i] = ans[i-1] * nums[i-1]\n    right = 1\n    for i in range(n-1, -1, -1):\n        ans[i] *= right\n        right *= nums[i]\n    return ans`
    },
    testCases: [{ input: '4\n1 2 3 4', expectedOutput: '24 12 8 6', description: '24=2*3*4' }],
    hints: ['左边乘积数组 × 右边乘积', '可用一个变量代替右边数组'],
    explanation: `【前缀积+后缀积】
ans[i] = 左边所有数乘积 × 右边所有数乘积
先从左往右算左边积，再从右往左乘右边积`
  },
  {
    id: 'arr-max-subarray', category: '数组', title: '最大子数组和', difficulty: 'medium', type: 'coding',
    description: '找到具有最大和的连续子数组',
    templates: {
      c: `int maxSubArray(int* nums, int n) {\n    // 请实现\n}`,
      cpp: `int maxSubArray(vector<int>& nums) {\n    // 请实现\n}`,
      java: `int maxSubArray(int[] nums) {\n    // 请实现\n}`,
      python: `def max_sub_array(nums):\n    pass`
    },
    solutions: {
      c: `int maxSubArray(int* nums, int n) {\n    int maxSum = nums[0], curSum = nums[0];\n    for (int i = 1; i < n; i++) {\n        curSum = curSum > 0 ? curSum + nums[i] : nums[i];\n        if (curSum > maxSum) maxSum = curSum;\n    }\n    return maxSum;\n}`,
      cpp: `int maxSubArray(vector<int>& nums) {\n    int maxSum = nums[0], curSum = nums[0];\n    for (int i = 1; i < nums.size(); i++) {\n        curSum = max(curSum + nums[i], nums[i]);\n        maxSum = max(maxSum, curSum);\n    }\n    return maxSum;\n}`,
      java: `int maxSubArray(int[] nums) {\n    int maxSum = nums[0], curSum = nums[0];\n    for (int i = 1; i < nums.length; i++) {\n        curSum = Math.max(curSum + nums[i], nums[i]);\n        maxSum = Math.max(maxSum, curSum);\n    }\n    return maxSum;\n}`,
      python: `def max_sub_array(nums):\n    max_sum = cur_sum = nums[0]\n    for num in nums[1:]:\n        cur_sum = max(cur_sum + num, num)\n        max_sum = max(max_sum, cur_sum)\n    return max_sum`
    },
    testCases: [{ input: '9\n-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6', description: '[4,-1,2,1]' }],
    hints: ['Kadane算法', '当前和<0时重新开始'],
    explanation: `【Kadane算法】O(n)
curSum = max(curSum + num, num)
若前面累加和为负，不如从当前重新开始`
  },
];

// ==================== 矩阵操作 ====================
export const matrixExercises: Exercise[] = [
  {
    id: 'matrix-rotate', category: '矩阵', title: '旋转图像', difficulty: 'medium', type: 'coding',
    description: '将n×n矩阵顺时针旋转90度，原地操作',
    templates: {
      c: `void rotate(int** matrix, int n) {\n    // 请原地旋转\n}`,
      cpp: `void rotate(vector<vector<int>>& matrix) {\n    // 请实现\n}`,
      java: `void rotate(int[][] matrix) {\n    // 请实现\n}`,
      python: `def rotate(matrix):\n    pass`
    },
    solutions: {
      c: `void rotate(int** matrix, int n) {\n    // 先转置\n    for (int i = 0; i < n; i++)\n        for (int j = i + 1; j < n; j++) {\n            int t = matrix[i][j]; matrix[i][j] = matrix[j][i]; matrix[j][i] = t;\n        }\n    // 再左右翻转\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < n / 2; j++) {\n            int t = matrix[i][j]; matrix[i][j] = matrix[i][n-1-j]; matrix[i][n-1-j] = t;\n        }\n}`,
      cpp: `void rotate(vector<vector<int>>& matrix) {\n    int n = matrix.size();\n    // 转置\n    for (int i = 0; i < n; i++)\n        for (int j = i + 1; j < n; j++)\n            swap(matrix[i][j], matrix[j][i]);\n    // 左右翻转\n    for (auto& row : matrix)\n        reverse(row.begin(), row.end());\n}`,
      java: `void rotate(int[][] matrix) {\n    int n = matrix.length;\n    // 转置\n    for (int i = 0; i < n; i++)\n        for (int j = i + 1; j < n; j++) {\n            int t = matrix[i][j]; matrix[i][j] = matrix[j][i]; matrix[j][i] = t;\n        }\n    // 左右翻转\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < n / 2; j++) {\n            int t = matrix[i][j]; matrix[i][j] = matrix[i][n-1-j]; matrix[i][n-1-j] = t;\n        }\n}`,
      python: `def rotate(matrix):\n    n = len(matrix)\n    # 转置\n    for i in range(n):\n        for j in range(i + 1, n):\n            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]\n    # 左右翻转\n    for row in matrix:\n        row.reverse()`
    },
    testCases: [{ input: '3\n1 2 3\n4 5 6\n7 8 9', expectedOutput: '7 4 1\n8 5 2\n9 6 3', description: '顺时针90°' }],
    hints: ['先转置（行列互换）', '再左右翻转每一行'],
    explanation: `【转置+翻转】
顺时针90° = 转置 + 左右翻转
逆时针90° = 转置 + 上下翻转`
  },
  {
    id: 'matrix-spiral', category: '矩阵', title: '螺旋矩阵', difficulty: 'medium', type: 'coding',
    description: '按螺旋顺序返回矩阵中的所有元素',
    templates: {
      c: `int* spiralOrder(int** matrix, int m, int n, int* returnSize) {\n    // 请实现\n}`,
      cpp: `vector<int> spiralOrder(vector<vector<int>>& matrix) {\n    // 请实现\n}`,
      java: `List<Integer> spiralOrder(int[][] matrix) {\n    // 请实现\n}`,
      python: `def spiral_order(matrix):\n    pass`
    },
    solutions: {
      c: `int* spiralOrder(int** matrix, int m, int n, int* returnSize) {\n    *returnSize = m * n;\n    int* res = malloc(*returnSize * sizeof(int));\n    int idx = 0, top = 0, bottom = m - 1, left = 0, right = n - 1;\n    while (top <= bottom && left <= right) {\n        for (int i = left; i <= right; i++) res[idx++] = matrix[top][i];\n        top++;\n        for (int i = top; i <= bottom; i++) res[idx++] = matrix[i][right];\n        right--;\n        if (top <= bottom) { for (int i = right; i >= left; i--) res[idx++] = matrix[bottom][i]; bottom--; }\n        if (left <= right) { for (int i = bottom; i >= top; i--) res[idx++] = matrix[i][left]; left++; }\n    }\n    return res;\n}`,
      cpp: `vector<int> spiralOrder(vector<vector<int>>& matrix) {\n    vector<int> res;\n    if (matrix.empty()) return res;\n    int top = 0, bottom = matrix.size() - 1;\n    int left = 0, right = matrix[0].size() - 1;\n    while (top <= bottom && left <= right) {\n        for (int i = left; i <= right; i++) res.push_back(matrix[top][i]); top++;\n        for (int i = top; i <= bottom; i++) res.push_back(matrix[i][right]); right--;\n        if (top <= bottom) { for (int i = right; i >= left; i--) res.push_back(matrix[bottom][i]); bottom--; }\n        if (left <= right) { for (int i = bottom; i >= top; i--) res.push_back(matrix[i][left]); left++; }\n    }\n    return res;\n}`,
      java: `List<Integer> spiralOrder(int[][] matrix) {\n    List<Integer> res = new ArrayList<>();\n    if (matrix.length == 0) return res;\n    int top = 0, bottom = matrix.length - 1;\n    int left = 0, right = matrix[0].length - 1;\n    while (top <= bottom && left <= right) {\n        for (int i = left; i <= right; i++) res.add(matrix[top][i]); top++;\n        for (int i = top; i <= bottom; i++) res.add(matrix[i][right]); right--;\n        if (top <= bottom) { for (int i = right; i >= left; i--) res.add(matrix[bottom][i]); bottom--; }\n        if (left <= right) { for (int i = bottom; i >= top; i--) res.add(matrix[i][left]); left++; }\n    }\n    return res;\n}`,
      python: `def spiral_order(matrix):\n    res = []\n    if not matrix: return res\n    top, bottom = 0, len(matrix) - 1\n    left, right = 0, len(matrix[0]) - 1\n    while top <= bottom and left <= right:\n        for i in range(left, right + 1): res.append(matrix[top][i])\n        top += 1\n        for i in range(top, bottom + 1): res.append(matrix[i][right])\n        right -= 1\n        if top <= bottom:\n            for i in range(right, left - 1, -1): res.append(matrix[bottom][i])\n            bottom -= 1\n        if left <= right:\n            for i in range(bottom, top - 1, -1): res.append(matrix[i][left])\n            left += 1\n    return res`
    },
    testCases: [{ input: '3 3\n1 2 3\n4 5 6\n7 8 9', expectedOutput: '1 2 3 6 9 8 7 4 5', description: '螺旋遍历' }],
    hints: ['四个边界：top/bottom/left/right', '一圈一圈向内收缩'],
    explanation: '模拟：按右→下→左→上的顺序遍历，每遍历一边就收缩对应边界'
  },
  {
    id: 'matrix-set-zeroes', category: '矩阵', title: '矩阵置零', difficulty: 'medium', type: 'coding',
    description: '如果矩阵中有0，则将其所在行和列都设为0，原地操作',
    templates: {
      c: `void setZeroes(int** matrix, int m, int n) {\n    // 请原地实现\n}`,
      cpp: `void setZeroes(vector<vector<int>>& matrix) {\n    // 请实现\n}`,
      java: `void setZeroes(int[][] matrix) {\n    // 请实现\n}`,
      python: `def set_zeroes(matrix):\n    pass`
    },
    solutions: {
      c: `void setZeroes(int** matrix, int m, int n) {\n    int row0 = 0, col0 = 0;\n    for (int i = 0; i < m; i++) if (matrix[i][0] == 0) col0 = 1;\n    for (int j = 0; j < n; j++) if (matrix[0][j] == 0) row0 = 1;\n    for (int i = 1; i < m; i++)\n        for (int j = 1; j < n; j++)\n            if (matrix[i][j] == 0) { matrix[i][0] = 0; matrix[0][j] = 0; }\n    for (int i = 1; i < m; i++)\n        for (int j = 1; j < n; j++)\n            if (matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;\n    if (col0) for (int i = 0; i < m; i++) matrix[i][0] = 0;\n    if (row0) for (int j = 0; j < n; j++) matrix[0][j] = 0;\n}`,
      cpp: `void setZeroes(vector<vector<int>>& matrix) {\n    int m = matrix.size(), n = matrix[0].size();\n    bool row0 = false, col0 = false;\n    for (int i = 0; i < m; i++) if (matrix[i][0] == 0) col0 = true;\n    for (int j = 0; j < n; j++) if (matrix[0][j] == 0) row0 = true;\n    for (int i = 1; i < m; i++)\n        for (int j = 1; j < n; j++)\n            if (matrix[i][j] == 0) { matrix[i][0] = 0; matrix[0][j] = 0; }\n    for (int i = 1; i < m; i++)\n        for (int j = 1; j < n; j++)\n            if (matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;\n    if (col0) for (int i = 0; i < m; i++) matrix[i][0] = 0;\n    if (row0) for (int j = 0; j < n; j++) matrix[0][j] = 0;\n}`,
      java: `void setZeroes(int[][] matrix) {\n    int m = matrix.length, n = matrix[0].length;\n    boolean row0 = false, col0 = false;\n    for (int i = 0; i < m; i++) if (matrix[i][0] == 0) col0 = true;\n    for (int j = 0; j < n; j++) if (matrix[0][j] == 0) row0 = true;\n    for (int i = 1; i < m; i++)\n        for (int j = 1; j < n; j++)\n            if (matrix[i][j] == 0) { matrix[i][0] = 0; matrix[0][j] = 0; }\n    for (int i = 1; i < m; i++)\n        for (int j = 1; j < n; j++)\n            if (matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;\n    if (col0) for (int i = 0; i < m; i++) matrix[i][0] = 0;\n    if (row0) for (int j = 0; j < n; j++) matrix[0][j] = 0;\n}`,
      python: `def set_zeroes(matrix):\n    m, n = len(matrix), len(matrix[0])\n    row0 = any(matrix[0][j] == 0 for j in range(n))\n    col0 = any(matrix[i][0] == 0 for i in range(m))\n    for i in range(1, m):\n        for j in range(1, n):\n            if matrix[i][j] == 0:\n                matrix[i][0] = matrix[0][j] = 0\n    for i in range(1, m):\n        for j in range(1, n):\n            if matrix[i][0] == 0 or matrix[0][j] == 0:\n                matrix[i][j] = 0\n    if row0:\n        for j in range(n): matrix[0][j] = 0\n    if col0:\n        for i in range(m): matrix[i][0] = 0`
    },
    testCases: [{ input: '3 3\n1 1 1\n1 0 1\n1 1 1', expectedOutput: '1 0 1\n0 0 0\n1 0 1', description: '中心为0' }],
    hints: ['用第一行第一列作为标记数组', '先记录第一行/列本身是否有0'],
    explanation: `【原地标记】O(1)空间
用第一行/列存储该行/列是否需要置零
注意先处理内部，最后处理第一行/列`
  },
];

// ==================== 区间问题 ====================
export const intervalExercises: Exercise[] = [
  {
    id: 'interval-merge', category: '区间', title: '合并区间', difficulty: 'medium', type: 'coding',
    description: '合并所有重叠的区间',
    templates: {
      c: `int** merge(int** intervals, int n, int* returnSize, int** returnColumnSizes) {\n    // 请实现\n}`,
      cpp: `vector<vector<int>> merge(vector<vector<int>>& intervals) {\n    // 请实现\n}`,
      java: `int[][] merge(int[][] intervals) {\n    // 请实现\n}`,
      python: `def merge(intervals):\n    pass`
    },
    solutions: {
      c: `int cmp(const void* a, const void* b) { return (*(int**)a)[0] - (*(int**)b)[0]; }\nint** merge(int** intervals, int n, int* returnSize, int** returnColumnSizes) {\n    if (n == 0) { *returnSize = 0; return NULL; }\n    qsort(intervals, n, sizeof(int*), cmp);\n    int** res = malloc(n * sizeof(int*));\n    *returnColumnSizes = malloc(n * sizeof(int));\n    int idx = 0;\n    res[0] = malloc(2 * sizeof(int));\n    res[0][0] = intervals[0][0]; res[0][1] = intervals[0][1];\n    for (int i = 1; i < n; i++) {\n        if (intervals[i][0] <= res[idx][1]) {\n            if (intervals[i][1] > res[idx][1]) res[idx][1] = intervals[i][1];\n        } else {\n            idx++;\n            res[idx] = malloc(2 * sizeof(int));\n            res[idx][0] = intervals[i][0]; res[idx][1] = intervals[i][1];\n        }\n    }\n    *returnSize = idx + 1;\n    for (int i = 0; i <= idx; i++) (*returnColumnSizes)[i] = 2;\n    return res;\n}`,
      cpp: `vector<vector<int>> merge(vector<vector<int>>& intervals) {\n    sort(intervals.begin(), intervals.end());\n    vector<vector<int>> res;\n    for (auto& i : intervals) {\n        if (res.empty() || res.back()[1] < i[0])\n            res.push_back(i);\n        else\n            res.back()[1] = max(res.back()[1], i[1]);\n    }\n    return res;\n}`,
      java: `int[][] merge(int[][] intervals) {\n    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);\n    List<int[]> res = new ArrayList<>();\n    for (int[] i : intervals) {\n        if (res.isEmpty() || res.get(res.size()-1)[1] < i[0])\n            res.add(i);\n        else\n            res.get(res.size()-1)[1] = Math.max(res.get(res.size()-1)[1], i[1]);\n    }\n    return res.toArray(new int[0][]);\n}`,
      python: `def merge(intervals):\n    intervals.sort()\n    res = []\n    for i in intervals:\n        if not res or res[-1][1] < i[0]:\n            res.append(i)\n        else:\n            res[-1][1] = max(res[-1][1], i[1])\n    return res`
    },
    testCases: [{ input: '4\n1 3\n2 6\n8 10\n15 18', expectedOutput: '1 6\n8 10\n15 18', description: '[1,3]和[2,6]合并' }],
    hints: ['先按起点排序', '若当前起点≤上一个终点则合并'],
    explanation: '排序后，若当前区间起点≤前一个终点，说明重叠，更新终点'
  },
  {
    id: 'interval-insert', category: '区间', title: '插入区间', difficulty: 'medium', type: 'coding',
    description: '将新区间插入到有序不重叠区间列表中，合并重叠部分',
    templates: {
      c: `int** insert(int** intervals, int n, int* newInterval, int* returnSize, int** returnColumnSizes) {\n    // 请实现\n}`,
      cpp: `vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {\n    // 请实现\n}`,
      java: `int[][] insert(int[][] intervals, int[] newInterval) {\n    // 请实现\n}`,
      python: `def insert(intervals, new_interval):\n    pass`
    },
    solutions: {
      c: `// 简化实现省略`,
      cpp: `vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {\n    vector<vector<int>> res;\n    int i = 0, n = intervals.size();\n    // 添加所有在newInterval左边的\n    while (i < n && intervals[i][1] < newInterval[0])\n        res.push_back(intervals[i++]);\n    // 合并重叠\n    while (i < n && intervals[i][0] <= newInterval[1]) {\n        newInterval[0] = min(newInterval[0], intervals[i][0]);\n        newInterval[1] = max(newInterval[1], intervals[i][1]);\n        i++;\n    }\n    res.push_back(newInterval);\n    // 添加右边剩余的\n    while (i < n) res.push_back(intervals[i++]);\n    return res;\n}`,
      java: `int[][] insert(int[][] intervals, int[] newInterval) {\n    List<int[]> res = new ArrayList<>();\n    int i = 0, n = intervals.length;\n    while (i < n && intervals[i][1] < newInterval[0])\n        res.add(intervals[i++]);\n    while (i < n && intervals[i][0] <= newInterval[1]) {\n        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);\n        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);\n        i++;\n    }\n    res.add(newInterval);\n    while (i < n) res.add(intervals[i++]);\n    return res.toArray(new int[0][]);\n}`,
      python: `def insert(intervals, new_interval):\n    res = []\n    i, n = 0, len(intervals)\n    while i < n and intervals[i][1] < new_interval[0]:\n        res.append(intervals[i]); i += 1\n    while i < n and intervals[i][0] <= new_interval[1]:\n        new_interval[0] = min(new_interval[0], intervals[i][0])\n        new_interval[1] = max(new_interval[1], intervals[i][1])\n        i += 1\n    res.append(new_interval)\n    while i < n:\n        res.append(intervals[i]); i += 1\n    return res`
    },
    testCases: [{ input: '2\n1 3\n6 9\n2 5', expectedOutput: '1 5\n6 9', description: '插入并合并' }],
    hints: ['三步：添加左边→合并中间→添加右边', '判断重叠：start≤end'],
    explanation: '分三步：添加不重叠的左边部分，合并重叠部分，添加右边部分'
  },
];

// ==================== 更多图论题 ====================
export const moreGraphExercises: Exercise[] = [
  {
    id: 'graph-num-islands', category: '图', title: '岛屿数量', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给你一个由'1'（陆地）和'0'（水）组成的二维网格，请计算网格中岛屿的数量。
岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。

【输入格式】
第一行：两个整数m和n，表示网格行数和列数
接下来m行：每行n个字符('0'或'1')，空格分隔

【输出格式】
输出岛屿数量

【数据范围】
- 1 ≤ m, n ≤ 300`,
    templates: {
      c: `int numIslands(char** grid, int m, int n) {\n    // 请实现\n}`,
      cpp: `int numIslands(vector<vector<char>>& grid) {\n    // 请实现\n}`,
      java: `int numIslands(char[][] grid) {\n    // 请实现\n}`,
      python: `def num_islands(grid):\n    pass`
    },
    solutions: {
      c: `void dfs(char** grid, int m, int n, int i, int j) {\n    if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] != '1') return;\n    grid[i][j] = '0';\n    dfs(grid, m, n, i+1, j); dfs(grid, m, n, i-1, j);\n    dfs(grid, m, n, i, j+1); dfs(grid, m, n, i, j-1);\n}\nint numIslands(char** grid, int m, int n) {\n    int count = 0;\n    for (int i = 0; i < m; i++)\n        for (int j = 0; j < n; j++)\n            if (grid[i][j] == '1') { count++; dfs(grid, m, n, i, j); }\n    return count;\n}`,
      cpp: `int numIslands(vector<vector<char>>& grid) {\n    int m = grid.size(), n = grid[0].size(), count = 0;\n    function<void(int, int)> dfs = [&](int i, int j) {\n        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] != '1') return;\n        grid[i][j] = '0';\n        dfs(i+1, j); dfs(i-1, j); dfs(i, j+1); dfs(i, j-1);\n    };\n    for (int i = 0; i < m; i++)\n        for (int j = 0; j < n; j++)\n            if (grid[i][j] == '1') { count++; dfs(i, j); }\n    return count;\n}`,
      java: `int numIslands(char[][] grid) {\n    int m = grid.length, n = grid[0].length, count = 0;\n    for (int i = 0; i < m; i++)\n        for (int j = 0; j < n; j++)\n            if (grid[i][j] == '1') { count++; dfs(grid, i, j); }\n    return count;\n}\nvoid dfs(char[][] grid, int i, int j) {\n    if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] != '1') return;\n    grid[i][j] = '0';\n    dfs(grid, i+1, j); dfs(grid, i-1, j); dfs(grid, i, j+1); dfs(grid, i, j-1);\n}`,
      python: `def num_islands(grid):\n    if not grid: return 0\n    m, n = len(grid), len(grid[0])\n    def dfs(i, j):\n        if i < 0 or i >= m or j < 0 or j >= n or grid[i][j] != '1': return\n        grid[i][j] = '0'\n        dfs(i+1, j); dfs(i-1, j); dfs(i, j+1); dfs(i, j-1)\n    count = 0\n    for i in range(m):\n        for j in range(n):\n            if grid[i][j] == '1':\n                count += 1; dfs(i, j)\n    return count`
    },
    testCases: [{ input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', expectedOutput: '3', description: '3个岛屿' }],
    hints: ['遇到1就DFS/BFS标记整个岛', '标记为0避免重复访问'],
    explanation: '遍历网格，每发现一个"1"就计数+1，然后DFS把整个岛标记为"0"'
  },
  {
    id: 'graph-course-schedule', category: '图', title: '课程表', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
你这个学期必须选修numCourses门课程，记为0到numCourses-1。
在选修某些课程之前需要先修完其他课程，例如[1,0]表示先修0才能修1。
判断是否能完成所有课程的学习。

【输入格式】
第一行：两个整数numCourses和m，表示课程数和先修关系数
接下来m行：每行两个整数a b，表示修课程a之前必须先修课程b

【输出格式】
输出 true 或 false

【数据范围】
- 1 ≤ numCourses ≤ 2000
- 0 ≤ m ≤ 5000`,
    templates: {
      c: `int canFinish(int numCourses, int** prerequisites, int n) {\n    // 请实现\n}`,
      cpp: `bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n    // 请实现\n}`,
      java: `boolean canFinish(int numCourses, int[][] prerequisites) {\n    // 请实现\n}`,
      python: `def can_finish(num_courses, prerequisites):\n    pass`
    },
    solutions: {
      c: `// 拓扑排序BFS实现省略`,
      cpp: `bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n    vector<int> indegree(numCourses, 0);\n    vector<vector<int>> adj(numCourses);\n    for (auto& p : prerequisites) {\n        adj[p[1]].push_back(p[0]);\n        indegree[p[0]]++;\n    }\n    queue<int> q;\n    for (int i = 0; i < numCourses; i++)\n        if (indegree[i] == 0) q.push(i);\n    int count = 0;\n    while (!q.empty()) {\n        int cur = q.front(); q.pop(); count++;\n        for (int next : adj[cur])\n            if (--indegree[next] == 0) q.push(next);\n    }\n    return count == numCourses;\n}`,
      java: `boolean canFinish(int numCourses, int[][] prerequisites) {\n    int[] indegree = new int[numCourses];\n    List<List<Integer>> adj = new ArrayList<>();\n    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());\n    for (int[] p : prerequisites) {\n        adj.get(p[1]).add(p[0]);\n        indegree[p[0]]++;\n    }\n    Queue<Integer> q = new LinkedList<>();\n    for (int i = 0; i < numCourses; i++)\n        if (indegree[i] == 0) q.offer(i);\n    int count = 0;\n    while (!q.isEmpty()) {\n        int cur = q.poll(); count++;\n        for (int next : adj.get(cur))\n            if (--indegree[next] == 0) q.offer(next);\n    }\n    return count == numCourses;\n}`,
      python: `def can_finish(num_courses, prerequisites):\n    from collections import deque\n    indegree = [0] * num_courses\n    adj = [[] for _ in range(num_courses)]\n    for a, b in prerequisites:\n        adj[b].append(a)\n        indegree[a] += 1\n    q = deque([i for i in range(num_courses) if indegree[i] == 0])\n    count = 0\n    while q:\n        cur = q.popleft(); count += 1\n        for nxt in adj[cur]:\n            indegree[nxt] -= 1\n            if indegree[nxt] == 0: q.append(nxt)\n    return count == num_courses`
    },
    testCases: [{ input: '2 1\n1 0', expectedOutput: 'true', description: '先修0再修1' }],
    hints: ['拓扑排序', '入度为0的先修，修完后更新后继入度'],
    explanation: `【拓扑排序/Kahn算法】
1. 统计入度，入度0的入队
2. 出队时将后继入度-1，变0则入队
3. 若处理数=课程数，则无环`
  },
  {
    id: 'graph-clone', category: '图', title: '克隆图', difficulty: 'medium', type: 'coding',
    description: '深拷贝一个无向连通图',
    templates: {
      c: `struct Node* cloneGraph(struct Node* node) {\n    // 请实现\n}`,
      cpp: `Node* cloneGraph(Node* node) {\n    // 请实现\n}`,
      java: `Node cloneGraph(Node node) {\n    // 请实现\n}`,
      python: `def clone_graph(node):\n    pass`
    },
    solutions: {
      c: `// 需要哈希表实现，省略`,
      cpp: `Node* cloneGraph(Node* node) {\n    if (!node) return nullptr;\n    unordered_map<Node*, Node*> visited;\n    function<Node*(Node*)> dfs = [&](Node* n) -> Node* {\n        if (visited.count(n)) return visited[n];\n        Node* clone = new Node(n->val);\n        visited[n] = clone;\n        for (Node* neighbor : n->neighbors)\n            clone->neighbors.push_back(dfs(neighbor));\n        return clone;\n    };\n    return dfs(node);\n}`,
      java: `Map<Node, Node> visited = new HashMap<>();\nNode cloneGraph(Node node) {\n    if (node == null) return null;\n    if (visited.containsKey(node)) return visited.get(node);\n    Node clone = new Node(node.val);\n    visited.put(node, clone);\n    for (Node neighbor : node.neighbors)\n        clone.neighbors.add(cloneGraph(neighbor));\n    return clone;\n}`,
      python: `def clone_graph(node):\n    if not node: return None\n    visited = {}\n    def dfs(n):\n        if n in visited: return visited[n]\n        clone = Node(n.val)\n        visited[n] = clone\n        clone.neighbors = [dfs(neighbor) for neighbor in n.neighbors]\n        return clone\n    return dfs(node)`
    },
    testCases: [{ input: '4\n2 4\n1 3\n2 4\n1 3', expectedOutput: '深拷贝', description: '4节点图' }],
    hints: ['哈希表记录原节点到克隆节点的映射', 'DFS/BFS遍历并克隆'],
    explanation: '用哈希表避免重复克隆同一节点，DFS递归克隆邻居'
  },
];

// ==================== 经典DP问题 ====================
export const classicDpProblems: Exercise[] = [
  {
    id: 'dp-stock-1', category: '动态规划', title: '买卖股票的最佳时机', difficulty: 'easy', type: 'coding',
    description: '只能买卖一次，求最大利润',
    templates: {
      c: `int maxProfit(int* prices, int n) {\n    // 请实现\n}`,
      cpp: `int maxProfit(vector<int>& prices) {\n    // 请实现\n}`,
      java: `int maxProfit(int[] prices) {\n    // 请实现\n}`,
      python: `def max_profit(prices):\n    pass`
    },
    solutions: {
      c: `int maxProfit(int* prices, int n) {\n    int minPrice = prices[0], maxProfit = 0;\n    for (int i = 1; i < n; i++) {\n        if (prices[i] < minPrice) minPrice = prices[i];\n        else if (prices[i] - minPrice > maxProfit) maxProfit = prices[i] - minPrice;\n    }\n    return maxProfit;\n}`,
      cpp: `int maxProfit(vector<int>& prices) {\n    int minPrice = INT_MAX, maxProfit = 0;\n    for (int p : prices) {\n        minPrice = min(minPrice, p);\n        maxProfit = max(maxProfit, p - minPrice);\n    }\n    return maxProfit;\n}`,
      java: `int maxProfit(int[] prices) {\n    int minPrice = Integer.MAX_VALUE, maxProfit = 0;\n    for (int p : prices) {\n        minPrice = Math.min(minPrice, p);\n        maxProfit = Math.max(maxProfit, p - minPrice);\n    }\n    return maxProfit;\n}`,
      python: `def max_profit(prices):\n    min_price = float('inf')\n    max_profit = 0\n    for p in prices:\n        min_price = min(min_price, p)\n        max_profit = max(max_profit, p - min_price)\n    return max_profit`
    },
    testCases: [{ input: '6\n7 1 5 3 6 4', expectedOutput: '5', description: '1买6卖' }],
    hints: ['记录历史最低价', '当前价-最低价=当前能获得的最大利润'],
    explanation: '一次遍历：维护最低价和最大利润，每天更新'
  },
  {
    id: 'dp-stock-2', category: '动态规划', title: '买卖股票II(多次交易)', difficulty: 'medium', type: 'coding',
    description: '可以多次买卖，求最大利润',
    templates: {
      c: `int maxProfit(int* prices, int n) {\n    // 请实现\n}`,
      cpp: `int maxProfit(vector<int>& prices) {\n    // 请实现\n}`,
      java: `int maxProfit(int[] prices) {\n    // 请实现\n}`,
      python: `def max_profit(prices):\n    pass`
    },
    solutions: {
      c: `int maxProfit(int* prices, int n) {\n    int profit = 0;\n    for (int i = 1; i < n; i++)\n        if (prices[i] > prices[i-1])\n            profit += prices[i] - prices[i-1];\n    return profit;\n}`,
      cpp: `int maxProfit(vector<int>& prices) {\n    int profit = 0;\n    for (int i = 1; i < prices.size(); i++)\n        if (prices[i] > prices[i-1])\n            profit += prices[i] - prices[i-1];\n    return profit;\n}`,
      java: `int maxProfit(int[] prices) {\n    int profit = 0;\n    for (int i = 1; i < prices.length; i++)\n        if (prices[i] > prices[i-1])\n            profit += prices[i] - prices[i-1];\n    return profit;\n}`,
      python: `def max_profit(prices):\n    return sum(max(0, prices[i] - prices[i-1]) for i in range(1, len(prices)))`
    },
    testCases: [{ input: '6\n7 1 5 3 6 4', expectedOutput: '7', description: '1买5卖+3买6卖' }],
    hints: ['贪心：只要后一天比前一天高就累加差价', '等价于捕获所有上涨段'],
    explanation: '贪心：收集所有上涨的差价，等价于低买高卖多次'
  },
  {
    id: 'dp-rob-1', category: '动态规划', title: '打家劫舍', difficulty: 'medium', type: 'coding',
    description: '不能偷相邻房屋，求能偷到的最高金额',
    templates: {
      c: `int rob(int* nums, int n) {\n    // 请实现\n}`,
      cpp: `int rob(vector<int>& nums) {\n    // 请实现\n}`,
      java: `int rob(int[] nums) {\n    // 请实现\n}`,
      python: `def rob(nums):\n    pass`
    },
    solutions: {
      c: `int rob(int* nums, int n) {\n    if (n == 0) return 0;\n    if (n == 1) return nums[0];\n    int prev2 = nums[0], prev1 = nums[0] > nums[1] ? nums[0] : nums[1];\n    for (int i = 2; i < n; i++) {\n        int curr = prev1 > prev2 + nums[i] ? prev1 : prev2 + nums[i];\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n}`,
      cpp: `int rob(vector<int>& nums) {\n    int n = nums.size();\n    if (n == 0) return 0;\n    if (n == 1) return nums[0];\n    int prev2 = nums[0], prev1 = max(nums[0], nums[1]);\n    for (int i = 2; i < n; i++) {\n        int curr = max(prev1, prev2 + nums[i]);\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n}`,
      java: `int rob(int[] nums) {\n    if (nums.length == 0) return 0;\n    if (nums.length == 1) return nums[0];\n    int prev2 = nums[0], prev1 = Math.max(nums[0], nums[1]);\n    for (int i = 2; i < nums.length; i++) {\n        int curr = Math.max(prev1, prev2 + nums[i]);\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n}`,
      python: `def rob(nums):\n    if not nums: return 0\n    if len(nums) == 1: return nums[0]\n    prev2, prev1 = nums[0], max(nums[0], nums[1])\n    for i in range(2, len(nums)):\n        prev2, prev1 = prev1, max(prev1, prev2 + nums[i])\n    return prev1`
    },
    testCases: [{ input: '4\n1 2 3 1', expectedOutput: '4', description: '偷1和3号房' }],
    hints: ['dp[i] = max(dp[i-1], dp[i-2]+nums[i])', '偷或不偷当前房'],
    explanation: `dp[i] = 到第i间房能偷的最大金额
= max(不偷当前dp[i-1], 偷当前dp[i-2]+nums[i])`
  },
  {
    id: 'dp-jump-game', category: '动态规划', title: '跳跃游戏', difficulty: 'medium', type: 'coding',
    description: '数组元素表示最大跳跃长度，判断能否到达最后位置',
    templates: {
      c: `int canJump(int* nums, int n) {\n    // 请实现\n}`,
      cpp: `bool canJump(vector<int>& nums) {\n    // 请实现\n}`,
      java: `boolean canJump(int[] nums) {\n    // 请实现\n}`,
      python: `def can_jump(nums):\n    pass`
    },
    solutions: {
      c: `int canJump(int* nums, int n) {\n    int maxReach = 0;\n    for (int i = 0; i < n && i <= maxReach; i++) {\n        if (i + nums[i] > maxReach) maxReach = i + nums[i];\n        if (maxReach >= n - 1) return 1;\n    }\n    return 0;\n}`,
      cpp: `bool canJump(vector<int>& nums) {\n    int maxReach = 0;\n    for (int i = 0; i < nums.size() && i <= maxReach; i++) {\n        maxReach = max(maxReach, i + nums[i]);\n        if (maxReach >= nums.size() - 1) return true;\n    }\n    return false;\n}`,
      java: `boolean canJump(int[] nums) {\n    int maxReach = 0;\n    for (int i = 0; i < nums.length && i <= maxReach; i++) {\n        maxReach = Math.max(maxReach, i + nums[i]);\n        if (maxReach >= nums.length - 1) return true;\n    }\n    return false;\n}`,
      python: `def can_jump(nums):\n    max_reach = 0\n    for i, jump in enumerate(nums):\n        if i > max_reach: return False\n        max_reach = max(max_reach, i + jump)\n        if max_reach >= len(nums) - 1: return True\n    return True`
    },
    testCases: [{ input: '5\n2 3 1 1 4', expectedOutput: 'true', description: '能到达' }],
    hints: ['贪心：维护能到达的最远位置', '若当前位置超过最远位置则不可达'],
    explanation: '贪心：遍历时更新能到达的最远位置，若能覆盖终点则可达'
  },
  {
    id: 'dp-climb-stairs-v2', category: '动态规划', title: '爬楼梯', difficulty: 'easy', type: 'coding',
    description: '每次爬1或2阶，有多少种方法爬到第n阶',
    templates: {
      c: `int climbStairs(int n) {\n    // 请实现\n}`,
      cpp: `int climbStairs(int n) {\n    // 请实现\n}`,
      java: `int climbStairs(int n) {\n    // 请实现\n}`,
      python: `def climb_stairs(n):\n    pass`
    },
    solutions: {
      c: `int climbStairs(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int c = a + b;\n        a = b;\n        b = c;\n    }\n    return b;\n}`,
      cpp: `int climbStairs(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int c = a + b;\n        a = b; b = c;\n    }\n    return b;\n}`,
      java: `int climbStairs(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int c = a + b;\n        a = b; b = c;\n    }\n    return b;\n}`,
      python: `def climb_stairs(n):\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b`
    },
    testCases: [{ input: '3', expectedOutput: '3', description: '1+1+1,1+2,2+1' }],
    hints: ['dp[n] = dp[n-1] + dp[n-2]', '斐波那契数列'],
    explanation: '到第n阶 = 从n-1阶爬1阶 + 从n-2阶爬2阶，即斐波那契'
  },
];

// ==================== 设计类题目 ====================
export const designExercises: Exercise[] = [
  {
    id: 'design-lru', category: '设计', title: 'LRU缓存', difficulty: 'medium', type: 'coding',
    description: '实现LRU(最近最少使用)缓存，get和put操作O(1)',
    templates: {
      c: `// 需要哈希表+双向链表`,
      cpp: `class LRUCache {\npublic:\n    LRUCache(int capacity) {\n        // 初始化\n    }\n    int get(int key) {\n        // 获取并更新为最近使用\n    }\n    void put(int key, int value) {\n        // 插入或更新\n    }\n};`,
      java: `class LRUCache {\n    public LRUCache(int capacity) {\n        // 初始化\n    }\n    public int get(int key) {\n        // 获取\n    }\n    public void put(int key, int value) {\n        // 插入或更新\n    }\n}`,
      python: `class LRUCache:\n    def __init__(self, capacity):\n        pass\n    def get(self, key):\n        pass\n    def put(self, key, value):\n        pass`
    },
    solutions: {
      c: `// 实现较长，需要手写哈希表和双向链表`,
      cpp: `class LRUCache {\n    int cap;\n    list<pair<int, int>> lst;  // 双向链表\n    unordered_map<int, list<pair<int,int>>::iterator> mp;  // key到节点的映射\npublic:\n    LRUCache(int capacity) : cap(capacity) {}\n    int get(int key) {\n        if (!mp.count(key)) return -1;\n        lst.splice(lst.begin(), lst, mp[key]);  // 移到头部\n        return mp[key]->second;\n    }\n    void put(int key, int value) {\n        if (mp.count(key)) {\n            mp[key]->second = value;\n            lst.splice(lst.begin(), lst, mp[key]);\n        } else {\n            if (lst.size() == cap) {\n                mp.erase(lst.back().first);\n                lst.pop_back();\n            }\n            lst.push_front({key, value});\n            mp[key] = lst.begin();\n        }\n    }\n};`,
      java: `class LRUCache extends LinkedHashMap<Integer, Integer> {\n    private int capacity;\n    public LRUCache(int capacity) {\n        super(capacity, 0.75f, true);\n        this.capacity = capacity;\n    }\n    public int get(int key) {\n        return super.getOrDefault(key, -1);\n    }\n    public void put(int key, int value) {\n        super.put(key, value);\n    }\n    @Override\n    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {\n        return size() > capacity;\n    }\n}`,
      python: `class LRUCache:\n    def __init__(self, capacity):\n        from collections import OrderedDict\n        self.cache = OrderedDict()\n        self.cap = capacity\n    def get(self, key):\n        if key not in self.cache: return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n    def put(self, key, value):\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.cap:\n            self.cache.popitem(last=False)`
    },
    testCases: [{ input: 'LRUCache(2), put(1,1), put(2,2), get(1), put(3,3), get(2)', expectedOutput: '1, -1', description: '2被淘汰' }],
    hints: ['哈希表O(1)查找', '双向链表O(1)增删和移动'],
    explanation: `【哈希表+双向链表】
- 哈希表: key → 链表节点
- 双向链表: 最近使用的在头部
- get: 存在则移到头部
- put: 满则删尾部，新/更新放头部`
  },
  {
    id: 'design-min-stack', category: '设计', title: '最小栈', difficulty: 'medium', type: 'coding',
    description: '实现支持O(1)获取最小值的栈',
    templates: {
      c: `typedef struct {\n    // 定义结构\n} MinStack;`,
      cpp: `class MinStack {\npublic:\n    MinStack() {}\n    void push(int val) {}\n    void pop() {}\n    int top() {}\n    int getMin() {}\n};`,
      java: `class MinStack {\n    public MinStack() {}\n    public void push(int val) {}\n    public void pop() {}\n    public int top() {}\n    public int getMin() {}\n}`,
      python: `class MinStack:\n    def __init__(self):\n        pass\n    def push(self, val):\n        pass\n    def pop(self):\n        pass\n    def top(self):\n        pass\n    def get_min(self):\n        pass`
    },
    solutions: {
      c: `typedef struct {\n    int* data;\n    int* minStack;\n    int top;\n    int minTop;\n} MinStack;\n// 实现省略`,
      cpp: `class MinStack {\n    stack<int> st, minSt;\npublic:\n    void push(int val) {\n        st.push(val);\n        if (minSt.empty() || val <= minSt.top())\n            minSt.push(val);\n    }\n    void pop() {\n        if (st.top() == minSt.top()) minSt.pop();\n        st.pop();\n    }\n    int top() { return st.top(); }\n    int getMin() { return minSt.top(); }\n};`,
      java: `class MinStack {\n    Stack<Integer> st = new Stack<>();\n    Stack<Integer> minSt = new Stack<>();\n    public void push(int val) {\n        st.push(val);\n        if (minSt.isEmpty() || val <= minSt.peek())\n            minSt.push(val);\n    }\n    public void pop() {\n        if (st.pop().equals(minSt.peek())) minSt.pop();\n    }\n    public int top() { return st.peek(); }\n    public int getMin() { return minSt.peek(); }\n}`,
      python: `class MinStack:\n    def __init__(self):\n        self.st = []\n        self.min_st = []\n    def push(self, val):\n        self.st.append(val)\n        if not self.min_st or val <= self.min_st[-1]:\n            self.min_st.append(val)\n    def pop(self):\n        if self.st.pop() == self.min_st[-1]:\n            self.min_st.pop()\n    def top(self):\n        return self.st[-1]\n    def get_min(self):\n        return self.min_st[-1]`
    },
    testCases: [{ input: 'push(-2), push(0), push(-3), getMin(), pop(), getMin()', expectedOutput: '-3, -2', description: '最小值变化' }],
    hints: ['辅助栈存储当前最小值', 'push时若≤当前最小则也入辅助栈'],
    explanation: '用辅助栈同步存储每个状态的最小值，空间换时间'
  },
];

// ==================== 更多字符串题 ====================
export const moreStringExercises: Exercise[] = [
  {
    id: 'str-palindrome-v2', category: '字符串', title: '验证回文串', difficulty: 'easy', type: 'coding',
    description: '判断字符串是否是回文（只考虑字母数字，忽略大小写）',
    templates: {
      c: `int isPalindrome(char* s) {\n    // 请实现\n}`,
      cpp: `bool isPalindrome(string s) {\n    // 请实现\n}`,
      java: `boolean isPalindrome(String s) {\n    // 请实现\n}`,
      python: `def is_palindrome(s):\n    pass`
    },
    solutions: {
      c: `int isAlnum(char c) { return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9'); }\nchar toLower(char c) { return c >= 'A' && c <= 'Z' ? c + 32 : c; }\nint isPalindrome(char* s) {\n    int l = 0, r = strlen(s) - 1;\n    while (l < r) {\n        while (l < r && !isAlnum(s[l])) l++;\n        while (l < r && !isAlnum(s[r])) r--;\n        if (toLower(s[l]) != toLower(s[r])) return 0;\n        l++; r--;\n    }\n    return 1;\n}`,
      cpp: `bool isPalindrome(string s) {\n    int l = 0, r = s.size() - 1;\n    while (l < r) {\n        while (l < r && !isalnum(s[l])) l++;\n        while (l < r && !isalnum(s[r])) r--;\n        if (tolower(s[l]) != tolower(s[r])) return false;\n        l++; r--;\n    }\n    return true;\n}`,
      java: `boolean isPalindrome(String s) {\n    int l = 0, r = s.length() - 1;\n    while (l < r) {\n        while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;\n        while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;\n        if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r)))\n            return false;\n        l++; r--;\n    }\n    return true;\n}`,
      python: `def is_palindrome(s):\n    s = ''.join(c.lower() for c in s if c.isalnum())\n    return s == s[::-1]`
    },
    testCases: [{ input: 'A man, a plan, a canal: Panama', expectedOutput: 'true', description: '是回文' }],
    hints: ['双指针从两端向中间', '跳过非字母数字，忽略大小写比较'],
    explanation: '双指针：跳过非字母数字字符，比较时忽略大小写'
  },
  {
    id: 'str-longest-palindrome-v2', category: '字符串', title: '最长回文子串', difficulty: 'medium', type: 'coding',
    description: '返回字符串中最长的回文子串',
    templates: {
      c: `char* longestPalindrome(char* s) {\n    // 请实现\n}`,
      cpp: `string longestPalindrome(string s) {\n    // 请实现\n}`,
      java: `String longestPalindrome(String s) {\n    // 请实现\n}`,
      python: `def longest_palindrome(s):\n    pass`
    },
    solutions: {
      c: `// 中心扩展法，实现较长`,
      cpp: `string longestPalindrome(string s) {\n    int n = s.size(), start = 0, maxLen = 1;\n    auto expand = [&](int l, int r) {\n        while (l >= 0 && r < n && s[l] == s[r]) { l--; r++; }\n        return r - l - 1;\n    };\n    for (int i = 0; i < n; i++) {\n        int len1 = expand(i, i);      // 奇数长度\n        int len2 = expand(i, i + 1);  // 偶数长度\n        int len = max(len1, len2);\n        if (len > maxLen) {\n            maxLen = len;\n            start = i - (len - 1) / 2;\n        }\n    }\n    return s.substr(start, maxLen);\n}`,
      java: `String longestPalindrome(String s) {\n    int start = 0, maxLen = 1;\n    for (int i = 0; i < s.length(); i++) {\n        int len1 = expand(s, i, i);\n        int len2 = expand(s, i, i + 1);\n        int len = Math.max(len1, len2);\n        if (len > maxLen) {\n            maxLen = len;\n            start = i - (len - 1) / 2;\n        }\n    }\n    return s.substring(start, start + maxLen);\n}\nint expand(String s, int l, int r) {\n    while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }\n    return r - l - 1;\n}`,
      python: `def longest_palindrome(s):\n    def expand(l, r):\n        while l >= 0 and r < len(s) and s[l] == s[r]:\n            l -= 1; r += 1\n        return s[l+1:r]\n    res = ''\n    for i in range(len(s)):\n        p1 = expand(i, i)\n        p2 = expand(i, i + 1)\n        res = max(res, p1, p2, key=len)\n    return res`
    },
    testCases: [{ input: 'babad', expectedOutput: 'bab', description: 'bab或aba都对' }],
    hints: ['中心扩展法', '分别考虑奇数长度和偶数长度'],
    explanation: `【中心扩展】O(n²)
以每个位置为中心向两边扩展
注意分奇偶：单字符中心 vs 双字符中心`
  },
  {
    id: 'str-group-anagrams', category: '字符串', title: '字母异位词分组', difficulty: 'medium', type: 'coding',
    description: '将字母异位词（字母相同但顺序不同）分组',
    templates: {
      c: `char*** groupAnagrams(char** strs, int n, int* returnSize, int** returnColumnSizes) {\n    // 请实现\n}`,
      cpp: `vector<vector<string>> groupAnagrams(vector<string>& strs) {\n    // 请实现\n}`,
      java: `List<List<String>> groupAnagrams(String[] strs) {\n    // 请实现\n}`,
      python: `def group_anagrams(strs):\n    pass`
    },
    solutions: {
      c: `// 需要哈希表，实现较长`,
      cpp: `vector<vector<string>> groupAnagrams(vector<string>& strs) {\n    unordered_map<string, vector<string>> mp;\n    for (auto& s : strs) {\n        string key = s;\n        sort(key.begin(), key.end());\n        mp[key].push_back(s);\n    }\n    vector<vector<string>> res;\n    for (auto& [k, v] : mp) res.push_back(v);\n    return res;\n}`,
      java: `List<List<String>> groupAnagrams(String[] strs) {\n    Map<String, List<String>> mp = new HashMap<>();\n    for (String s : strs) {\n        char[] arr = s.toCharArray();\n        Arrays.sort(arr);\n        String key = new String(arr);\n        mp.computeIfAbsent(key, k -> new ArrayList<>()).add(s);\n    }\n    return new ArrayList<>(mp.values());\n}`,
      python: `def group_anagrams(strs):\n    from collections import defaultdict\n    mp = defaultdict(list)\n    for s in strs:\n        key = ''.join(sorted(s))\n        mp[key].append(s)\n    return list(mp.values())`
    },
    testCases: [{ input: '6\neat tea tan ate nat bat', expectedOutput: 'bat\nnat tan\nate eat tea', description: '三组' }],
    hints: ['排序后的字符串作为key', '相同key的放一组'],
    explanation: '字母异位词排序后相同，用排序后的字符串作为哈希表的key'
  },
];

// ==================== 并查集 ====================
export const unionFindExercises: Exercise[] = [
  { id: 'uf-provinces', category: '并查集', title: '省份数量', difficulty: 'medium', type: 'coding',
    description: '给定城市连接矩阵，求省份数量', templates: { c: `int findCircleNum(int** m, int n) {}`, cpp: `int findCircleNum(vector<vector<int>>& m) {}`, java: `int findCircleNum(int[][] m) {}`, python: `def find_circle_num(m): pass` },
    solutions: { c: `int findCircleNum(int** m, int n) {\n    int* p = malloc(n*sizeof(int));\n    for(int i=0;i<n;i++) p[i]=i;\n    int find(int x) { return p[x]==x?x:(p[x]=find(p[x])); }\n    for(int i=0;i<n;i++) for(int j=i+1;j<n;j++) if(m[i][j]) p[find(i)]=find(j);\n    int c=0; for(int i=0;i<n;i++) if(p[i]==i) c++;\n    return c;\n}`, cpp: `int findCircleNum(vector<vector<int>>& m) {\n    int n = m.size();\n    vector<int> p(n); iota(p.begin(),p.end(),0);\n    function<int(int)> f = [&](int x) { return p[x]==x?x:p[x]=f(p[x]); };\n    for(int i=0;i<n;i++) for(int j=i+1;j<n;j++) if(m[i][j]) p[f(i)]=f(j);\n    int c=0; for(int i=0;i<n;i++) if(p[i]==i) c++;\n    return c;\n}`, java: `int findCircleNum(int[][] m) {\n    int n = m.length; int[] p = new int[n];\n    for(int i=0;i<n;i++) p[i]=i;\n    java.util.function.IntUnaryOperator f = x -> p[x]==x?x:(p[x]=f.applyAsInt(p[x]));\n    for(int i=0;i<n;i++) for(int j=i+1;j<n;j++) if(m[i][j]==1) p[f.applyAsInt(i)]=f.applyAsInt(j);\n    int c=0; for(int i=0;i<n;i++) if(p[i]==i) c++;\n    return c;\n}`, python: `def find_circle_num(m):\n    n=len(m); p=list(range(n))\n    def f(x): p[x]=f(p[x]) if p[x]!=x else x; return p[x]\n    for i in range(n):\n        for j in range(i+1,n):\n            if m[i][j]: p[f(i)]=f(j)\n    return sum(1 for i in range(n) if p[i]==i)` },
    testCases: [{ input: '[[1,1,0],[1,1,0],[0,0,1]]', expectedOutput: '2', description: '2省份' }], hints: ['并查集'], explanation: '连通的城市合并' },
  { id: 'uf-redundant', category: '并查集', title: '冗余连接', difficulty: 'medium', type: 'coding',
    description: '找出使树变图的多余边', templates: { c: `int* findRedundant(int** e, int n) {}`, cpp: `vector<int> findRedundantConnection(vector<vector<int>>& e) {}`, java: `int[] findRedundant(int[][] e) {}`, python: `def find_redundant(e): pass` },
    solutions: { c: `int* findRedundant(int** e, int n) {\n    int* p = malloc((n+1)*sizeof(int));\n    for(int i=0;i<=n;i++) p[i]=i;\n    int find(int x) { return p[x]==x?x:(p[x]=find(p[x])); }\n    for(int i=0;i<n;i++) {\n        int a=find(e[i][0]),b=find(e[i][1]);\n        if(a==b) { int* r=malloc(2*sizeof(int)); r[0]=e[i][0]; r[1]=e[i][1]; return r; }\n        p[a]=b;\n    }\n    return NULL;\n}`, cpp: `vector<int> findRedundantConnection(vector<vector<int>>& e) {\n    int n=e.size(); vector<int> p(n+1); iota(p.begin(),p.end(),0);\n    function<int(int)> f=[&](int x){return p[x]==x?x:p[x]=f(p[x]);};\n    for(auto& edge:e) { int a=f(edge[0]),b=f(edge[1]); if(a==b) return edge; p[a]=b; }\n    return {};\n}`, java: `int[] findRedundant(int[][] e) {\n    int n = e.length; int[] p = new int[n+1];\n    for(int i=0;i<=n;i++) p[i]=i;\n    java.util.function.IntUnaryOperator f = x -> p[x]==x?x:(p[x]=f.applyAsInt(p[x]));\n    for(int[] edge:e) { int a=f.applyAsInt(edge[0]),b=f.applyAsInt(edge[1]); if(a==b) return edge; p[a]=b; }\n    return null;\n}`, python: `def find_redundant(e):\n    p=list(range(len(e)+1))\n    def f(x): p[x]=f(p[x]) if p[x]!=x else x; return p[x]\n    for a,b in e:\n        if f(a)==f(b): return [a,b]\n        p[f(a)]=f(b)\n    return []` },
    testCases: [{ input: '[[1,2],[1,3],[2,3]]', expectedOutput: '[2,3]', description: '删[2,3]' }], hints: ['逐边union'], explanation: '已连通再加边则多余' },
];

// ==================== 单调栈 ====================
export const monotoneStackExercises: Exercise[] = [
  { id: 'mono-next-greater', category: '单调栈', title: '下一个更大元素', difficulty: 'easy', type: 'coding',
    description: '每个元素右边第一个更大的', templates: { c: `int* nextGreater(int* a, int n) {}`, cpp: `vector<int> nextGreater(vector<int>& a) {}`, java: `int[] nextGreater(int[] a) {}`, python: `def next_greater(a): pass` },
    solutions: { c: `int* nextGreater(int* a, int n) {\n    int* r = malloc(n * sizeof(int));\n    int* s = malloc(n * sizeof(int)); int top = -1;\n    for (int i = n-1; i >= 0; i--) {\n        while (top >= 0 && s[top] <= a[i]) top--;\n        r[i] = top >= 0 ? s[top] : -1;\n        s[++top] = a[i];\n    }\n    free(s); return r;\n}`, cpp: `vector<int> nextGreater(vector<int>& a) {\n    int n=a.size(); vector<int> r(n,-1); stack<int> s;\n    for(int i=n-1;i>=0;i--) { while(!s.empty()&&s.top()<=a[i]) s.pop(); if(!s.empty()) r[i]=s.top(); s.push(a[i]); }\n    return r;\n}`, java: `int[] nextGreater(int[] a) {\n    int n = a.length; int[] r = new int[n]; java.util.Arrays.fill(r, -1);\n    java.util.Stack<Integer> s = new java.util.Stack<>();\n    for (int i = n-1; i >= 0; i--) {\n        while (!s.isEmpty() && s.peek() <= a[i]) s.pop();\n        if (!s.isEmpty()) r[i] = s.peek();\n        s.push(a[i]);\n    }\n    return r;\n}`, python: `def next_greater(a):\n    n=len(a); r=[-1]*n; s=[]\n    for i in range(n-1,-1,-1):\n        while s and s[-1]<=a[i]: s.pop()\n        if s: r[i]=s[-1]\n        s.append(a[i])\n    return r` },
    testCases: [{ input: '[2,1,2,4,3]', expectedOutput: '[4,2,4,-1,-1]', description: '' }], hints: ['单调递减栈'], explanation: '栈顶是右边第一个更大' },
  { id: 'mono-daily-temp', category: '单调栈', title: '每日温度', difficulty: 'medium', type: 'coding',
    description: '等几天才有更高温度', templates: { c: `int* dailyTemp(int* t, int n) {}`, cpp: `vector<int> dailyTemperatures(vector<int>& t) {}`, java: `int[] dailyTemp(int[] t) {}`, python: `def daily_temp(t): pass` },
    solutions: { c: `int* dailyTemp(int* t, int n) {\n    int* r = calloc(n, sizeof(int));\n    int* s = malloc(n * sizeof(int)); int top = -1;\n    for (int i = 0; i < n; i++) {\n        while (top >= 0 && t[s[top]] < t[i]) { r[s[top]] = i - s[top]; top--; }\n        s[++top] = i;\n    }\n    free(s); return r;\n}`, cpp: `vector<int> dailyTemperatures(vector<int>& t) {\n    int n=t.size(); vector<int> r(n,0); stack<int> s;\n    for(int i=0;i<n;i++) { while(!s.empty()&&t[s.top()]<t[i]) { r[s.top()]=i-s.top(); s.pop(); } s.push(i); }\n    return r;\n}`, java: `int[] dailyTemp(int[] t) {\n    int n = t.length; int[] r = new int[n];\n    java.util.Stack<Integer> s = new java.util.Stack<>();\n    for (int i = 0; i < n; i++) {\n        while (!s.isEmpty() && t[s.peek()] < t[i]) r[s.peek()] = i - s.pop();\n        s.push(i);\n    }\n    return r;\n}`, python: `def daily_temp(t):\n    n=len(t); r=[0]*n; s=[]\n    for i in range(n):\n        while s and t[s[-1]]<t[i]: r[s[-1]]=i-s[-1]; s.pop()\n        s.append(i)\n    return r` },
    testCases: [{ input: '[73,74,75,71,69,72,76,73]', expectedOutput: '[1,1,4,2,1,1,0,0]', description: '' }], hints: ['栈存下标'], explanation: '遇到更高时出栈计算' },
  { id: 'mono-largest-rect', category: '单调栈', title: '柱状图最大矩形', difficulty: 'hard', type: 'coding',
    description: '柱状图中最大矩形面积', templates: { c: `int largestRect(int* h, int n) {}`, cpp: `int largestRectangleArea(vector<int>& h) {}`, java: `int largestRect(int[] h) {}`, python: `def largest_rect(h): pass` },
    solutions: { c: `int largestRect(int* h, int n) {\n    int* s = malloc((n+1) * sizeof(int)); int top = -1, m = 0;\n    for (int i = 0; i <= n; i++) {\n        int cur = (i == n) ? 0 : h[i];\n        while (top >= 0 && h[s[top]] > cur) {\n            int t = h[s[top--]]; int w = top < 0 ? i : i - s[top] - 1;\n            if (t * w > m) m = t * w;\n        }\n        s[++top] = i;\n    }\n    free(s); return m;\n}`, cpp: `int largestRectangleArea(vector<int>& h) {\n    h.push_back(0); stack<int> s; int m=0;\n    for(int i=0;i<h.size();i++) { while(!s.empty()&&h[s.top()]>h[i]) { int t=h[s.top()]; s.pop(); int w=s.empty()?i:i-s.top()-1; m=max(m,t*w); } s.push(i); }\n    return m;\n}`, java: `int largestRect(int[] h) {\n    java.util.Stack<Integer> s = new java.util.Stack<>(); int m = 0, n = h.length;\n    for (int i = 0; i <= n; i++) {\n        int cur = (i == n) ? 0 : h[i];\n        while (!s.isEmpty() && h[s.peek()] > cur) {\n            int t = h[s.pop()]; int w = s.isEmpty() ? i : i - s.peek() - 1;\n            m = Math.max(m, t * w);\n        }\n        s.push(i);\n    }\n    return m;\n}`, python: `def largest_rect(h):\n    h.append(0); s=[]; m=0\n    for i,v in enumerate(h):\n        while s and h[s[-1]]>v: t=h[s.pop()]; w=i if not s else i-s[-1]-1; m=max(m,t*w)\n        s.append(i)\n    return m` },
    testCases: [{ input: '[2,1,5,6,2,3]', expectedOutput: '10', description: '' }], hints: ['单调递增栈'], explanation: '出栈时计算该高度最大矩形' },
];

// ==================== 前缀和 ====================
export const prefixSumExercises: Exercise[] = [
  { id: 'prefix-subarray-k', category: '前缀和', title: '和为K的子数组', difficulty: 'medium', type: 'coding',
    description: '和为k的连续子数组个数', templates: { c: `int subarraySum(int* a, int n, int k) {}`, cpp: `int subarraySum(vector<int>& a, int k) {}`, java: `int subarraySum(int[] a, int k) {}`, python: `def subarray_sum(a, k): pass` },
    solutions: { c: `int subarraySum(int* a, int n, int k) {\n    int c = 0;\n    for (int i = 0; i < n; i++) {\n        int s = 0;\n        for (int j = i; j < n; j++) { s += a[j]; if (s == k) c++; }\n    }\n    return c;\n}`, cpp: `int subarraySum(vector<int>& a, int k) {\n    unordered_map<int,int> m{{0,1}}; int s=0,c=0;\n    for(int x:a) { s+=x; if(m.count(s-k)) c+=m[s-k]; m[s]++; }\n    return c;\n}`, java: `int subarraySum(int[] a, int k) {\n    java.util.Map<Integer,Integer> m = new java.util.HashMap<>(); m.put(0,1);\n    int s = 0, c = 0;\n    for (int x : a) { s += x; c += m.getOrDefault(s-k, 0); m.put(s, m.getOrDefault(s,0)+1); }\n    return c;\n}`, python: `def subarray_sum(a, k):\n    from collections import defaultdict\n    m=defaultdict(int); m[0]=1; s=c=0\n    for x in a: s+=x; c+=m[s-k]; m[s]+=1\n    return c` },
    testCases: [{ input: '[1,1,1], k=2', expectedOutput: '2', description: '' }], hints: ['prefix[j]-prefix[i]=k'], explanation: '哈希存前缀和次数' },
  { id: 'prefix-range-sum', category: '前缀和', title: '区域和检索', difficulty: 'easy', type: 'coding',
    description: '多次查询区间和', templates: { c: `// NumArray`, cpp: `class NumArray { public: NumArray(vector<int>& a) {} int sumRange(int l, int r) {} };`, java: `class NumArray {}`, python: `class NumArray: pass` },
    solutions: { c: `typedef struct { int* p; } NumArray;\nNumArray* create(int* a, int n) {\n    NumArray* na = malloc(sizeof(NumArray));\n    na->p = malloc((n+1)*sizeof(int)); na->p[0] = 0;\n    for (int i = 0; i < n; i++) na->p[i+1] = na->p[i] + a[i];\n    return na;\n}\nint sumRange(NumArray* na, int l, int r) { return na->p[r+1] - na->p[l]; }`, cpp: `class NumArray { vector<int> p;\npublic: NumArray(vector<int>& a) { p.resize(a.size()+1,0); for(int i=0;i<a.size();i++) p[i+1]=p[i]+a[i]; }\n    int sumRange(int l, int r) { return p[r+1]-p[l]; }\n};`, java: `class NumArray {\n    int[] p;\n    NumArray(int[] a) { p = new int[a.length+1]; for(int i=0;i<a.length;i++) p[i+1]=p[i]+a[i]; }\n    int sumRange(int l, int r) { return p[r+1]-p[l]; }\n}`, python: `class NumArray:\n    def __init__(self, a): self.p=[0]; [self.p.append(self.p[-1]+x) for x in a]\n    def sum_range(self, l, r): return self.p[r+1]-self.p[l]` },
    testCases: [{ input: '[-2,0,3,-5,2,-1], sumRange(0,2)', expectedOutput: '1', description: '' }], hints: ['预处理前缀和'], explanation: 'O(n)预处理O(1)查询' },
];

// ==================== 更多二分 ====================
export const moreBinarySearchExercises: Exercise[] = [
  { id: 'bs-search-range', category: '二分查找', title: '查找元素范围', difficulty: 'medium', type: 'coding',
    description: '目标值第一个和最后一个位置', templates: { c: `int* searchRange(int* a, int n, int t) {}`, cpp: `vector<int> searchRange(vector<int>& a, int t) {}`, java: `int[] searchRange(int[] a, int t) {}`, python: `def search_range(a, t): pass` },
    solutions: { c: `int* searchRange(int* a, int n, int t) {\n    int* r = malloc(2*sizeof(int)); r[0] = r[1] = -1;\n    int l = 0, h = n - 1;\n    while (l <= h) { int m = (l+h)/2; if (a[m] >= t) h = m-1; else l = m+1; }\n    if (l >= n || a[l] != t) return r;\n    r[0] = l; h = n - 1;\n    while (l <= h) { int m = (l+h)/2; if (a[m] <= t) l = m+1; else h = m-1; }\n    r[1] = h;\n    return r;\n}`, cpp: `vector<int> searchRange(vector<int>& a, int t) {\n    int l=lower_bound(a.begin(),a.end(),t)-a.begin();\n    if(l==a.size()||a[l]!=t) return {-1,-1};\n    int r=upper_bound(a.begin(),a.end(),t)-a.begin()-1;\n    return {l,r};\n}`, java: `int[] searchRange(int[] a, int t) {\n    int l = 0, h = a.length - 1;\n    while (l <= h) { int m = (l+h)/2; if (a[m] >= t) h = m-1; else l = m+1; }\n    if (l >= a.length || a[l] != t) return new int[]{-1,-1};\n    int first = l; h = a.length - 1;\n    while (l <= h) { int m = (l+h)/2; if (a[m] <= t) l = m+1; else h = m-1; }\n    return new int[]{first, h};\n}`, python: `def search_range(a, t):\n    from bisect import bisect_left, bisect_right\n    l=bisect_left(a,t)\n    if l==len(a) or a[l]!=t: return [-1,-1]\n    return [l, bisect_right(a,t)-1]` },
    testCases: [{ input: '[5,7,7,8,8,10], t=8', expectedOutput: '[3,4]', description: '' }], hints: ['lower_bound+upper_bound'], explanation: '两次二分找左右边界' },
  { id: 'bs-rotated', category: '二分查找', title: '搜索旋转数组', difficulty: 'medium', type: 'coding',
    description: '旋转排序数组中搜索', templates: { c: `int search(int* a, int n, int t) {}`, cpp: `int search(vector<int>& a, int t) {}`, java: `int search(int[] a, int t) {}`, python: `def search(a, t): pass` },
    solutions: { c: `int search(int* a, int n, int t) {\n    int l=0, r=n-1;\n    while(l<=r) { int m=(l+r)/2; if(a[m]==t) return m;\n        if(a[l]<=a[m]) { if(a[l]<=t&&t<a[m]) r=m-1; else l=m+1; }\n        else { if(a[m]<t&&t<=a[r]) l=m+1; else r=m-1; } }\n    return -1;\n}`, cpp: `int search(vector<int>& a, int t) {\n    int l=0,r=a.size()-1;\n    while(l<=r) { int m=(l+r)/2; if(a[m]==t) return m;\n        if(a[l]<=a[m]) { if(a[l]<=t&&t<a[m]) r=m-1; else l=m+1; }\n        else { if(a[m]<t&&t<=a[r]) l=m+1; else r=m-1; } }\n    return -1;\n}`, java: `int search(int[] a, int t) {\n    int l=0, r=a.length-1;\n    while(l<=r) { int m=(l+r)/2; if(a[m]==t) return m;\n        if(a[l]<=a[m]) { if(a[l]<=t&&t<a[m]) r=m-1; else l=m+1; }\n        else { if(a[m]<t&&t<=a[r]) l=m+1; else r=m-1; } }\n    return -1;\n}`, python: `def search(a, t):\n    l,r=0,len(a)-1\n    while l<=r:\n        m=(l+r)//2\n        if a[m]==t: return m\n        if a[l]<=a[m]:\n            if a[l]<=t<a[m]: r=m-1\n            else: l=m+1\n        else:\n            if a[m]<t<=a[r]: l=m+1\n            else: r=m-1\n    return -1` },
    testCases: [{ input: '[4,5,6,7,0,1,2], t=0', expectedOutput: '4', description: '' }], hints: ['判断哪半有序'], explanation: '二分时判断target在哪半' },
  { id: 'bs-find-min', category: '二分查找', title: '旋转数组最小值', difficulty: 'medium', type: 'coding',
    description: '找旋转数组最小元素', templates: { c: `int findMin(int* a, int n) {}`, cpp: `int findMin(vector<int>& a) {}`, java: `int findMin(int[] a) {}`, python: `def find_min(a): pass` },
    solutions: { c: `int findMin(int* a, int n) { int l=0,r=n-1; while(l<r) { int m=(l+r)/2; if(a[m]>a[r]) l=m+1; else r=m; } return a[l]; }`, cpp: `int findMin(vector<int>& a) { int l=0,r=a.size()-1; while(l<r) { int m=(l+r)/2; if(a[m]>a[r]) l=m+1; else r=m; } return a[l]; }`, java: `int findMin(int[] a) { int l=0,r=a.length-1; while(l<r) { int m=(l+r)/2; if(a[m]>a[r]) l=m+1; else r=m; } return a[l]; }`, python: `def find_min(a):\n    l,r=0,len(a)-1\n    while l<r: m=(l+r)//2; l,r=(m+1,r) if a[m]>a[r] else (l,m)\n    return a[l]` },
    testCases: [{ input: '[3,4,5,1,2]', expectedOutput: '1', description: '' }], hints: ['a[m]>a[r]则最小在右'], explanation: '二分找最小' },
  { id: 'bs-sqrt', category: '二分查找', title: '求平方根', difficulty: 'easy', type: 'coding',
    description: '计算平方根向下取整', templates: { c: `int mySqrt(int x) {}`, cpp: `int mySqrt(int x) {}`, java: `int mySqrt(int x) {}`, python: `def my_sqrt(x): pass` },
    solutions: { c: `int mySqrt(int x) { if(x<2) return x; long l=1,r=x/2; while(l<=r) { long m=(l+r)/2; if(m*m==x) return m; else if(m*m<x) l=m+1; else r=m-1; } return r; }`, cpp: `int mySqrt(int x) { if(x<2) return x; long l=1,r=x/2; while(l<=r) { long m=(l+r)/2; if(m*m==x) return m; else if(m*m<x) l=m+1; else r=m-1; } return r; }`, java: `int mySqrt(int x) { if(x<2) return x; long l=1,r=x/2; while(l<=r) { long m=(l+r)/2; if(m*m==x) return (int)m; else if(m*m<x) l=m+1; else r=m-1; } return (int)r; }`, python: `def my_sqrt(x):\n    if x<2: return x\n    l,r=1,x//2\n    while l<=r: m=(l+r)//2; l,r=(m+1,r) if m*m<x else ((l,m-1) if m*m>x else (m,m))\n    return r if l>r else l` },
    testCases: [{ input: 'x=8', expectedOutput: '2', description: '' }], hints: ['二分找m²≤x最大m'], explanation: '注意用long防溢出' },
];
export const moreBacktrackExercises: Exercise[] = [
  { id: 'bt-permute', category: '回溯', title: '全排列', difficulty: 'medium', type: 'coding',
    description: '返回所有排列', templates: { c: `int** permute(int* a, int n) {}`, cpp: `vector<vector<int>> permute(vector<int>& a) {}`, java: `List<List<Integer>> permute(int[] a) {}`, python: `def permute(a): pass` },
    solutions: { c: `int** permute(int* a, int n) {
    // 简化实现，交换法
    int** r = malloc(n * sizeof(int*));
    for (int i = 0; i < n; i++) {
        r[i] = malloc(n * sizeof(int));
    }
    bt(a, 0, r);
    return r;
}
void bt(int* a, int s, int** r) {
    if (s == n) {
        for (int i = 0; i < n; i++) {
            r[s][i] = a[i];
        }
        return;
    }
    for (int i = s; i < n; i++) {
        int t = a[s];
        a[s] = a[i];
        a[i] = t;
        bt(a, s + 1, r);
        t = a[s];
        a[s] = a[i];
        a[i] = t;
    }
}`, cpp: `vector<vector<int>> permute(vector<int>& a) {
    vector<vector<int>> r; function<void(int)> bt=[&](int s) { if(s==a.size()) { r.push_back(a); return; } for(int i=s;i<a.size();i++) { swap(a[s],a[i]); bt(s+1); swap(a[s],a[i]); } }; bt(0); return r;
}`, java: `List<List<Integer>> permute(int[] a) {
    List<List<Integer>> r = new ArrayList<>();
    bt(a, 0, r); return r;
}
void bt(int[] a, int s, List<List<Integer>> r) {
    if(s==a.length) { List<Integer> p=new ArrayList<>(); for(int x:a) p.add(x); r.add(p); return; }
    for(int i=s;i<a.length;i++) { int t=a[s];a[s]=a[i];a[i]=t; bt(a,s+1,r); t=a[s];a[s]=a[i];a[i]=t; }
}`, python: `def permute(a):\n    r=[]\n    def bt(s):\n        if s==len(a): r.append(a[:]); return\n        for i in range(s,len(a)): a[s],a[i]=a[i],a[s]; bt(s+1); a[s],a[i]=a[i],a[s]\n    bt(0); return r` },
    testCases: [{ input: '[1,2,3]', expectedOutput: '[[1,2,3],...]', description: '6种' }], hints: ['交换法'], explanation: '每位和后面交换' },
  { id: 'bt-subsets-v2', category: '回溯', title: '子集', difficulty: 'medium', type: 'coding',
    description: '返回所有子集', templates: { c: `int** subsets(int* a, int n) {}`, cpp: `vector<vector<int>> subsets(vector<int>& a) {}`, java: `List<List<Integer>> subsets(int[] a) {}`, python: `def subsets(a): pass` },
    solutions: { c: `int** subsets(int* a, int n) {
    int** r = malloc((1 << n) * sizeof(int*));
    for (int i = 0; i < (1 << n); i++) {
        r[i] = malloc(n * sizeof(int));
    }
    bt(a, 0, r);
    return r;
}
void bt(int* a, int s, int** r) {
    if (s == n) {
        int len = 0;
        for (int i = 0; i < n; i++) {
            if (a[i]) {
                r[s][len++] = a[i];
            }
        }
        return;
    }
    a[s] = 1;
    bt(a, s + 1, r);
    a[s] = 0;
    bt(a, s + 1, r);
}`, cpp: `vector<vector<int>> subsets(vector<int>& a) {
    vector<vector<int>> r; vector<int> p;
    function<void(int)> bt=[&](int s) { r.push_back(p); for(int i=s;i<a.size();i++) { p.push_back(a[i]); bt(i+1); p.pop_back(); } }; bt(0); return r;
}`, java: `List<List<Integer>> subsets(int[] a) {
    List<List<Integer>> r = new ArrayList<>();
    bt(a, 0, new ArrayList<>(), r); return r;
}
void bt(int[] a, int s, List<Integer> p, List<List<Integer>> r) {
    r.add(new ArrayList<>(p));
    for(int i=s;i<a.length;i++) { p.add(a[i]); bt(a,i+1,p,r); p.remove(p.size()-1); }
}`, python: `def subsets(a):\n    r=[]\n    def bt(s,p): r.append(p[:]); [bt(i+1,p+[a[i]]) for i in range(s,len(a))]\n    bt(0,[]); return r` },
    testCases: [{ input: '[1,2,3]', expectedOutput: '[[],[1],...]', description: '8个' }], hints: ['选或不选'], explanation: '每步都是有效子集' },
  { id: 'bt-combine-sum', category: '回溯', title: '组合总和', difficulty: 'medium', type: 'coding',
    description: '和为target的组合，可重复', templates: { c: `int** combinationSum(int* c, int n, int t) {}`, cpp: `vector<vector<int>> combinationSum(vector<int>& c, int t) {}`, java: `List<List<Integer>> combinationSum(int[] c, int t) {}`, python: `def combination_sum(c, t): pass` },
    solutions: { c: `int** combinationSum(int* c, int n, int t) {
    int** r = malloc((1 << n) * sizeof(int*));
    for (int i = 0; i < (1 << n); i++) {
        r[i] = malloc(n * sizeof(int));
    }
    bt(c, 0, t, r);
    return r;
}
void bt(int* c, int s, int rem, int** r) {
    if (rem == 0) {
        int len = 0;
        for (int i = 0; i < n; i++) {
            if (c[i]) {
                r[s][len++] = c[i];
            }
        }
        return;
    }
    if (rem < 0) return;
    for (int i = s; i < n; i++) {
        c[i] = 1;
        bt(c, i, rem - c[i], r);
        c[i] = 0;
    }
}`, cpp: `vector<vector<int>> combinationSum(vector<int>& c, int t) {
    vector<vector<int>> r; vector<int> p;
    function<void(int,int)> bt=[&](int s,int rem) { if(rem==0) { r.push_back(p); return; } if(rem<0) return;
        for(int i=s;i<c.size();i++) { p.push_back(c[i]); bt(i,rem-c[i]); p.pop_back(); } }; bt(0,t); return r;
}`, java: `List<List<Integer>> combinationSum(int[] c, int t) {
    List<List<Integer>> r = new ArrayList<>();
    bt(c, 0, t, new ArrayList<>(), r); return r;
}
void bt(int[] c, int s, int rem, List<Integer> p, List<List<Integer>> r) {
    if(rem==0) { r.add(new ArrayList<>(p)); return; }
    if(rem<0) return;
    for(int i=s;i<c.length;i++) { p.add(c[i]); bt(c,i,rem-c[i],p,r); p.remove(p.size()-1); }
}`, python: `def combination_sum(c, t):\n    r=[]\n    def bt(s,rem,p):\n        if rem==0: r.append(p[:]); return\n        if rem<0: return\n        for i in range(s,len(c)): bt(i,rem-c[i],p+[c[i]])\n    bt(0,t,[]); return r` },
    testCases: [{ input: '4 7\n2 3 6 7', expectedOutput: '2 2 3\n7', description: '两种组合' }], hints: ['从i开始可重复'], explanation: '递归传i允许重复' },
  { id: 'bt-word-search-v2', category: '回溯', title: '单词搜索', difficulty: 'medium', type: 'coding',
    description: '网格中搜索单词', templates: { c: `int exist(char** b, int m, int n, char* w) {}`, cpp: `bool exist(vector<vector<char>>& b, string w) {}`, java: `boolean exist(char[][] b, String w) {}`, python: `def exist(b, w): pass` },
    solutions: { c: `int exist(char** b, int m, int n, char* w) {
    int dfs(int i,int j,int k) {
        if(!w[k]) return 1; if(i<0||i>=m||j<0||j>=n||b[i][j]!=w[k]) return 0;
        char t=b[i][j]; b[i][j]='#'; int f=dfs(i+1,j,k+1)||dfs(i-1,j,k+1)||dfs(i,j+1,k+1)||dfs(i,j-1,k+1); b[i][j]=t; return f;
    }
    for(int i=0;i<m;i++) for(int j=0;j<n;j++) if(dfs(i,j,0)) return 1; return 0;
}`, cpp: `bool exist(vector<vector<char>>& b, string w) {
    int m=b.size(),n=b[0].size();
    function<bool(int,int,int)> dfs=[&](int i,int j,int k) {
        if(k==w.size()) return true; if(i<0||i>=m||j<0||j>=n||b[i][j]!=w[k]) return false;
        char t=b[i][j]; b[i][j]='#'; bool f=dfs(i+1,j,k+1)||dfs(i-1,j,k+1)||dfs(i,j+1,k+1)||dfs(i,j-1,k+1); b[i][j]=t; return f;
    };
    for(int i=0;i<m;i++) for(int j=0;j<n;j++) if(dfs(i,j,0)) return true; return false;
}`, java: `boolean exist(char[][] b, String w) {
    int m=b.length,n=b[0].length;
    for(int i=0;i<m;i++) for(int j=0;j<n;j++) if(dfs(b,w,i,j,0)) return true;
    return false;
}
boolean dfs(char[][] b,String w,int i,int j,int k) {
    if(k==w.length()) return true;
    if(i<0||i>=b.length||j<0||j>=b[0].length||b[i][j]!=w.charAt(k)) return false;
    char t=b[i][j]; b[i][j]='#'; boolean f=dfs(b,w,i+1,j,k+1)||dfs(b,w,i-1,j,k+1)||dfs(b,w,i,j+1,k+1)||dfs(b,w,i,j-1,k+1); b[i][j]=t; return f;
}`, python: `def exist(b, w):\n    m,n=len(b),len(b[0])\n    def dfs(i,j,k):\n        if k==len(w): return True\n        if i<0 or i>=m or j<0 or j>=n or b[i][j]!=w[k]: return False\n        t,b[i][j]=b[i][j],'#'; f=dfs(i+1,j,k+1) or dfs(i-1,j,k+1) or dfs(i,j+1,k+1) or dfs(i,j-1,k+1); b[i][j]=t\n        return f\n    return any(dfs(i,j,0) for i in range(m) for j in range(n))` },
    testCases: [{ input: '2 2\nA B\nC D\nABCD', expectedOutput: 'false', description: '无路径' }], hints: ['DFS+标记'], explanation: '访问过标记#' },
];

// ==================== 更多贪心 ====================
export const moreGreedyExercises: Exercise[] = [
  { id: 'greedy-jump2', category: '贪心', title: '跳跃游戏II', difficulty: 'medium', type: 'coding',
    description: '最少跳跃次数', templates: { c: `int jump(int* a, int n) {}`, cpp: `int jump(vector<int>& a) {}`, java: `int jump(int[] a) {}`, python: `def jump(a): pass` },
    solutions: { c: `int jump(int* a, int n) { int j=0,e=0,f=0; for(int i=0;i<n-1;i++) { if(i+a[i]>f) f=i+a[i]; if(i==e) { j++; e=f; } } return j; }`, cpp: `int jump(vector<int>& a) { int j=0,e=0,f=0; for(int i=0;i<a.size()-1;i++) { f=max(f,i+a[i]); if(i==e) { j++; e=f; } } return j; }`, java: `int jump(int[] a) { int j=0,e=0,f=0; for(int i=0;i<a.length-1;i++) { f=Math.max(f,i+a[i]); if(i==e) { j++; e=f; } } return j; }`, python: `def jump(a):\n    j=e=f=0\n    for i in range(len(a)-1): f=max(f,i+a[i]); j,e=(j+1,f) if i==e else (j,e)\n    return j` },
    testCases: [{ input: '5\n2 3 1 1 4', expectedOutput: '2', description: '' }], hints: ['到边界必须跳'], explanation: '贪心选最远' },
  { id: 'greedy-gas', category: '贪心', title: '加油站', difficulty: 'medium', type: 'coding',
    description: '能绕一圈的起点', templates: { c: `int canComplete(int* g, int* c, int n) {}`, cpp: `int canCompleteCircuit(vector<int>& g, vector<int>& c) {}`, java: `int canComplete(int[] g, int[] c) {}`, python: `def can_complete(g, c): pass` },
    solutions: { c: `int canComplete(int* g, int* c, int n) { int t=0,tank=0,s=0; for(int i=0;i<n;i++) { int d=g[i]-c[i]; t+=d; tank+=d; if(tank<0) { s=i+1; tank=0; } } return t>=0?s:-1; }`, cpp: `int canCompleteCircuit(vector<int>& g, vector<int>& c) {\n    int t=0,tank=0,s=0;\n    for(int i=0;i<g.size();i++) { int d=g[i]-c[i]; t+=d; tank+=d; if(tank<0) { s=i+1; tank=0; } }\n    return t>=0?s:-1;\n}`, java: `int canComplete(int[] g, int[] c) { int t=0,tank=0,s=0; for(int i=0;i<g.length;i++) { int d=g[i]-c[i]; t+=d; tank+=d; if(tank<0) { s=i+1; tank=0; } } return t>=0?s:-1; }`, python: `def can_complete(g, c):\n    t=tank=s=0\n    for i in range(len(g)): d=g[i]-c[i]; t+=d; tank+=d; s,tank=(i+1,0) if tank<0 else (s,tank)\n    return s if t>=0 else -1` },
    testCases: [{ input: '5\n1 2 3 4 5\n3 4 5 1 2', expectedOutput: '3', description: '' }], hints: ['油箱负则换起点'], explanation: 'i到j负则i-j都不行' },
  { id: 'greedy-candy', category: '贪心', title: '分发糖果', difficulty: 'hard', type: 'coding',
    description: '最少糖果数', templates: { c: `int candy(int* r, int n) {}`, cpp: `int candy(vector<int>& r) {}`, java: `int candy(int[] r) {}`, python: `def candy(r): pass` },
    solutions: { c: `int candy(int* r, int n) { int* c=calloc(n,sizeof(int)); for(int i=0;i<n;i++) c[i]=1; for(int i=1;i<n;i++) if(r[i]>r[i-1]) c[i]=c[i-1]+1; for(int i=n-2;i>=0;i--) if(r[i]>r[i+1]&&c[i]<=c[i+1]) c[i]=c[i+1]+1; int s=0; for(int i=0;i<n;i++) s+=c[i]; return s; }`, cpp: `int candy(vector<int>& r) {\n    int n=r.size(); vector<int> c(n,1);\n    for(int i=1;i<n;i++) if(r[i]>r[i-1]) c[i]=c[i-1]+1;\n    for(int i=n-2;i>=0;i--) if(r[i]>r[i+1]&&c[i]<=c[i+1]) c[i]=c[i+1]+1;\n    return accumulate(c.begin(),c.end(),0);\n}`, java: `int candy(int[] r) { int n=r.length; int[] c=new int[n]; java.util.Arrays.fill(c,1); for(int i=1;i<n;i++) if(r[i]>r[i-1]) c[i]=c[i-1]+1; for(int i=n-2;i>=0;i--) if(r[i]>r[i+1]&&c[i]<=c[i+1]) c[i]=c[i+1]+1; int s=0; for(int x:c) s+=x; return s; }`, python: `def candy(r):\n    n=len(r); c=[1]*n\n    for i in range(1,n):\n        if r[i]>r[i-1]: c[i]=c[i-1]+1\n    for i in range(n-2,-1,-1):\n        if r[i]>r[i+1] and c[i]<=c[i+1]: c[i]=c[i+1]+1\n    return sum(c)` },
    testCases: [{ input: '3\n1 0 2', expectedOutput: '5', description: '2+1+2' }], hints: ['左右各遍历一次'], explanation: '先保证左边规则再保证右边' },
];

// ==================== 更多DP ====================
export const moreDpExercises: Exercise[] = [
  { id: 'dp-coin-change-v2', category: '动态规划', title: '零钱兑换', difficulty: 'medium', type: 'coding',
    description: '凑成金额的最少硬币数', templates: { c: `int coinChange(int* c, int n, int a) {}`, cpp: `int coinChange(vector<int>& c, int a) {}`, java: `int coinChange(int[] c, int a) {}`, python: `def coin_change(c, a): pass` },
    solutions: { c: `// DP`, cpp: `int coinChange(vector<int>& c, int a) {\n    vector<int> dp(a+1,a+1); dp[0]=0;\n    for(int i=1;i<=a;i++) for(int x:c) if(x<=i) dp[i]=min(dp[i],dp[i-x]+1);\n    return dp[a]>a?-1:dp[a];\n}`, java: `// DP`, python: `def coin_change(c, a):\n    dp=[0]+[a+1]*a\n    for i in range(1,a+1):\n        for x in c:\n            if x<=i: dp[i]=min(dp[i],dp[i-x]+1)\n    return dp[a] if dp[a]<=a else -1` },
    testCases: [{ input: '3 11\n1 2 5', expectedOutput: '3', description: '5+5+1' }], hints: ['dp[i]=min(dp[i-c]+1)'], explanation: '完全背包变体' },
  { id: 'dp-longest-increasing', category: '动态规划', title: '最长递增子序列', difficulty: 'medium', type: 'coding',
    description: '最长严格递增子序列长度', templates: { c: `int lengthOfLIS(int* a, int n) {}`, cpp: `int lengthOfLIS(vector<int>& a) {}`, java: `int lengthOfLIS(int[] a) {}`, python: `def length_of_lis(a): pass` },
    solutions: { c: `// DP或二分`, cpp: `int lengthOfLIS(vector<int>& a) {\n    vector<int> d;\n    for(int x:a) { auto it=lower_bound(d.begin(),d.end(),x); if(it==d.end()) d.push_back(x); else *it=x; }\n    return d.size();\n}`, java: `// 二分`, python: `def length_of_lis(a):\n    from bisect import bisect_left\n    d=[]\n    for x in a: i=bisect_left(d,x); d[i:i+1]=[x]\n    return len(d)` },
    testCases: [{ input: '8\n10 9 2 5 3 7 101 18', expectedOutput: '4', description: '2,3,7,101' }], hints: ['O(n²)DP或O(nlogn)二分'], explanation: '维护最小末尾数组' },
  { id: 'dp-word-break', category: '动态规划', title: '单词拆分', difficulty: 'medium', type: 'coding',
    description: '字符串能否拆成字典中的单词', templates: { c: `int wordBreak(char* s, char** dict, int n) {}`, cpp: `bool wordBreak(string s, vector<string>& dict) {}`, java: `boolean wordBreak(String s, List<String> dict) {}`, python: `def word_break(s, dict): pass` },
    solutions: { c: `// DP`, cpp: `bool wordBreak(string s, vector<string>& dict) {\n    unordered_set<string> st(dict.begin(),dict.end());\n    int n=s.size(); vector<bool> dp(n+1,false); dp[0]=true;\n    for(int i=1;i<=n;i++) for(int j=0;j<i;j++) if(dp[j]&&st.count(s.substr(j,i-j))) { dp[i]=true; break; }\n    return dp[n];\n}`, java: `// DP`, python: `def word_break(s, dict):\n    st=set(dict); n=len(s); dp=[True]+[False]*n\n    for i in range(1,n+1):\n        for j in range(i):\n            if dp[j] and s[j:i] in st: dp[i]=True; break\n    return dp[n]` },
    testCases: [{ input: 'leetcode\n2\nleet code', expectedOutput: 'true', description: '' }], hints: ['dp[i]=任意j使dp[j]且s[j:i]在字典'], explanation: '检查所有分割点' },
  { id: 'dp-unique-paths', category: '动态规划', title: '不同路径', difficulty: 'medium', type: 'coding',
    description: '从左上到右下的路径数', templates: { c: `int uniquePaths(int m, int n) {}`, cpp: `int uniquePaths(int m, int n) {}`, java: `int uniquePaths(int m, int n) {}`, python: `def unique_paths(m, n): pass` },
    solutions: { c: `// DP`, cpp: `int uniquePaths(int m, int n) { vector<int> dp(n,1); for(int i=1;i<m;i++) for(int j=1;j<n;j++) dp[j]+=dp[j-1]; return dp[n-1]; }`, java: `// DP`, python: `def unique_paths(m, n):\n    dp=[1]*n\n    for _ in range(1,m):\n        for j in range(1,n): dp[j]+=dp[j-1]\n    return dp[-1]` },
    testCases: [{ input: '3 7', expectedOutput: '28', description: '' }], hints: ['dp[i][j]=dp[i-1][j]+dp[i][j-1]'], explanation: '空间优化为一维' },
  { id: 'dp-edit-distance-v2', category: '动态规划', title: '编辑距离', difficulty: 'hard', type: 'coding',
    description: '将word1转换为word2的最少操作数', templates: { c: `int minDistance(char* w1, char* w2) {}`, cpp: `int minDistance(string w1, string w2) {}`, java: `int minDistance(String w1, String w2) {}`, python: `def min_distance(w1, w2): pass` },
    solutions: { c: `// DP`, cpp: `int minDistance(string w1, string w2) {\n    int m=w1.size(),n=w2.size(); vector<vector<int>> dp(m+1,vector<int>(n+1));\n    for(int i=0;i<=m;i++) dp[i][0]=i; for(int j=0;j<=n;j++) dp[0][j]=j;\n    for(int i=1;i<=m;i++) for(int j=1;j<=n;j++)\n        dp[i][j]=w1[i-1]==w2[j-1]?dp[i-1][j-1]:1+min({dp[i-1][j],dp[i][j-1],dp[i-1][j-1]});\n    return dp[m][n];\n}`, java: `// DP`, python: `def min_distance(w1, w2):\n    m,n=len(w1),len(w2); dp=[[0]*(n+1) for _ in range(m+1)]\n    for i in range(m+1): dp[i][0]=i\n    for j in range(n+1): dp[0][j]=j\n    for i in range(1,m+1):\n        for j in range(1,n+1):\n            dp[i][j]=dp[i-1][j-1] if w1[i-1]==w2[j-1] else 1+min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1])\n    return dp[m][n]` },
    testCases: [{ input: 'w1="horse", w2="ros"', expectedOutput: '3', description: '' }], hints: ['插入删除替换'], explanation: '经典二维DP' },
];

// ==================== 更多填空题 ====================
export const extraFillBlankExercises: Exercise[] = [
  { id: 'fb-merge-sort', category: '填空题', title: '归并排序填空', difficulty: 'medium', type: 'fillblank',
    description: '补全归并排序代码',
    templates: { cpp: `void merge(int* a, int l, int m, int r) {\n    int n1=m-l+1, n2=r-m;\n    int* L=new int[n1], *R=new int[n2];\n    for(int i=0;i<n1;i++) L[i]=a[l+i];\n    for(int j=0;j<n2;j++) R[j]=a[___BLANK1___];\n    int i=0, j=0, k=l;\n    while(i<n1 && j<n2) {\n        if(L[i]<=R[j]) a[k++]=___BLANK2___;\n        else a[k++]=R[j++];\n    }\n    while(i<n1) a[k++]=L[i++];\n    while(j<n2) a[k++]=___BLANK3___;\n}`, java: `// 归并排序`, python: `# 归并排序` },
    solutions: { cpp: `// 答案`, java: `// 答案`, python: `# 答案` },
    testCases: [], blanks: [{ id: 'BLANK1', answer: 'm+1+j', hint: '右半部分起点' }, { id: 'BLANK2', answer: 'L[i++]', hint: '取左边元素' }, { id: 'BLANK3', answer: 'R[j++]', hint: '剩余右边' }],
    hints: ['归并'], explanation: '归并：分别拷贝左右，合并时比较' },
  { id: 'fb-heap-down', category: '填空题', title: '堆下沉操作', difficulty: 'medium', type: 'fillblank',
    description: '补全堆的下沉操作',
    templates: { cpp: `void heapifyDown(int* heap, int n, int i) {\n    int largest = i;\n    int left = 2*i+1, right = 2*i+2;\n    if(left<n && heap[left]>heap[largest]) largest=___BLANK1___;\n    if(right<n && heap[right]>heap[largest]) largest=___BLANK2___;\n    if(largest != i) {\n        swap(heap[i], heap[largest]);\n        heapifyDown(heap, n, ___BLANK3___);\n    }\n}`, java: `// 堆下沉`, python: `# 堆下沉` },
    solutions: { cpp: `// 答案`, java: `// 答案`, python: `# 答案` },
    testCases: [], blanks: [{ id: 'BLANK1', answer: 'left', hint: '左子更大' }, { id: 'BLANK2', answer: 'right', hint: '右子更大' }, { id: 'BLANK3', answer: 'largest', hint: '递归下沉' }],
    hints: ['堆'], explanation: '大顶堆下沉：与较大的子节点交换' },
  { id: 'fb-dijkstra', category: '填空题', title: 'Dijkstra填空', difficulty: 'hard', type: 'fillblank',
    description: '补全Dijkstra最短路',
    templates: { cpp: `void dijkstra(vector<vector<int>>& g, int src, vector<int>& dist) {\n    int n=g.size();\n    vector<bool> vis(n,false);\n    dist.assign(n, ___BLANK1___);\n    dist[src]=0;\n    for(int c=0;c<n-1;c++) {\n        int u=-1, minD=INT_MAX;\n        for(int v=0;v<n;v++) if(!vis[v]&&dist[v]<minD) { minD=dist[v]; u=v; }\n        vis[u]=true;\n        for(int v=0;v<n;v++)\n            if(!vis[v]&&g[u][v]&&dist[u]+g[u][v]<dist[v])\n                dist[v]=___BLANK2___;\n    }\n}`, java: `// Dijkstra`, python: `# Dijkstra` },
    solutions: { cpp: `// 答案`, java: `// 答案`, python: `# 答案` },
    testCases: [], blanks: [{ id: 'BLANK1', answer: 'INT_MAX', hint: '初始化无穷大' }, { id: 'BLANK2', answer: 'dist[u]+g[u][v]', hint: '松弛操作' }],
    hints: ['最短路'], explanation: 'Dijkstra：贪心选最近，松弛邻居' },
  { id: 'fb-trie-insert', category: '填空题', title: '字典树插入', difficulty: 'medium', type: 'fillblank',
    description: '补全Trie插入操作',
    templates: { cpp: `struct TrieNode { TrieNode* ch[26]={}; bool end=false; };\nvoid insert(TrieNode* root, string& word) {\n    TrieNode* node = root;\n    for(char c:word) {\n        int idx = c - 'a';\n        if(!node->ch[idx]) node->ch[idx] = ___BLANK1___;\n        node = node->___BLANK2___;\n    }\n    node->end = ___BLANK3___;\n}`, java: `// Trie`, python: `# Trie` },
    solutions: { cpp: `// 答案`, java: `// 答案`, python: `# 答案` },
    testCases: [], blanks: [{ id: 'BLANK1', answer: 'new TrieNode()', hint: '创建新节点' }, { id: 'BLANK2', answer: 'ch[idx]', hint: '移动到子节点' }, { id: 'BLANK3', answer: 'true', hint: '标记单词结束' }],
    hints: ['字典树'], explanation: 'Trie：按字符路径插入' },
  { id: 'fb-kmp', category: '填空题', title: 'KMP算法填空', difficulty: 'hard', type: 'fillblank',
    description: '补全KMP的next数组构建',
    templates: { cpp: `void buildNext(string& p, vector<int>& next) {\n    int m=p.size(); next.resize(m);\n    next[0] = ___BLANK1___;\n    int j = -1;\n    for(int i=1; i<m; i++) {\n        while(j>=0 && p[i]!=p[j+1]) j=___BLANK2___;\n        if(p[i]==p[j+1]) j++;\n        next[i] = ___BLANK3___;\n    }\n}`, java: `// KMP`, python: `# KMP` },
    solutions: { cpp: `// 答案`, java: `// 答案`, python: `# 答案` },
    testCases: [], blanks: [{ id: 'BLANK1', answer: '-1', hint: '第一个字符无前缀' }, { id: 'BLANK2', answer: 'next[j]', hint: '回退到前缀' }, { id: 'BLANK3', answer: 'j', hint: '记录最长前缀' }],
    hints: ['KMP'], explanation: 'KMP：next[i]表示最长相等前后缀' },
];

// ==================== 考试重点题目 ====================
// 老师强调：双指针法实现数组原地删除，不申请额外空间
export const examFocusExercises: Exercise[] = [
  {
    id: 'exam-remove-element', category: '双指针', title: '【考试重点】移除元素', difficulty: 'easy', type: 'coding',
    description: '原地移除数组中所有等于val的元素，返回新数组长度。要求：不申请额外空间，使用双指针法。\n\n这是老师课上强调的重点：普通方法用三层循环，双指针法只需两层循环，时间复杂度更低。',
    isExamFocus: true,
    templates: {
      c: `// 【考试重点】双指针法原地删除\n// 不能申请新数组，只能在原数组上操作\nint removeElement(int* nums, int numsSize, int val) {\n    // slow: 指向下一个要保留元素应该放的位置\n    // fast: 遍历数组的指针\n    // 请实现双指针法\n}`,
      cpp: `// 【考试重点】双指针法原地删除\nint removeElement(vector<int>& nums, int val) {\n    // 请实现双指针法\n}`,
      java: `// 【考试重点】双指针法原地删除\nint removeElement(int[] nums, int val) {\n    // 请实现双指针法\n}`,
      python: `# 【考试重点】双指针法原地删除\ndef remove_element(nums, val):\n    # 请实现双指针法\n    pass`
    },
    solutions: {
      c: `// 【双指针法】时间O(n)，空间O(1)\nint removeElement(int* nums, int numsSize, int val) {\n    int slow = 0;  // 慢指针：指向下一个保留元素应放的位置\n    for (int fast = 0; fast < numsSize; fast++) {\n        // 快指针遍历，遇到不等于val的元素就保留\n        if (nums[fast] != val) {\n            nums[slow] = nums[fast];  // 把要保留的元素放到slow位置\n            slow++;  // slow前进一步\n        }\n        // 如果等于val，fast继续走，slow不动（相当于跳过了这个元素）\n    }\n    return slow;  // slow就是新数组的长度\n}`,
      cpp: `int removeElement(vector<int>& nums, int val) {\n    int slow = 0;\n    for (int fast = 0; fast < nums.size(); fast++) {\n        if (nums[fast] != val) {\n            nums[slow++] = nums[fast];\n        }\n    }\n    return slow;\n}`,
      java: `int removeElement(int[] nums, int val) {\n    int slow = 0;\n    for (int fast = 0; fast < nums.length; fast++) {\n        if (nums[fast] != val) {\n            nums[slow++] = nums[fast];\n        }\n    }\n    return slow;\n}`,
      python: `def remove_element(nums, val):\n    slow = 0\n    for fast in range(len(nums)):\n        if nums[fast] != val:\n            nums[slow] = nums[fast]\n            slow += 1\n    return slow`
    },
    testCases: [
      { input: '4\n3 2 2 3\n3', expectedOutput: '2', description: '删除所有3' },
      { input: '8\n0 1 2 2 3 0 4 2\n2', expectedOutput: '5', description: '删除所有2' }
    ],
    hints: [
      '【核心思想】slow指向"下一个要保留元素应该放的位置"',
      '【工作原理】fast遍历，遇到不等于val的就复制到slow位置',
      '【为什么高效】普通方法每删一个要移动后面所有元素O(n²)，双指针只遍历一次O(n)'
    ],
    explanation: `【双指针法核心原理】
    
slow和fast两个"指针"（下标）：
- fast：快指针，负责遍历整个数组
- slow：慢指针，指向下一个保留元素应该放的位置

工作过程：
1. fast遍历数组的每个元素
2. 如果nums[fast] != val（不是要删除的），把它复制到nums[slow]，然后slow++
3. 如果nums[fast] == val（是要删除的），fast继续走，slow不动
4. 最后slow的值就是新数组长度

【对比普通方法】
普通方法：遇到要删除的元素，把后面所有元素前移一位 → 三层循环O(n²)
双指针法：一次遍历，直接把要保留的覆盖到前面 → 两层循环O(n)`,
    commonMistakes: [
      '忘记在保留元素后slow++',
      '把slow和fast的角色搞混',
      '返回值错误（应返回slow，不是slow-1）'
    ]
  },
  {
    id: 'exam-remove-duplicates', category: '双指针', title: '【考试重点】删除有序数组重复项', difficulty: 'easy', type: 'coding',
    description: '原地删除有序数组中的重复元素，使每个元素只出现一次，返回新长度。要求：不申请额外空间，使用双指针法。',
    isExamFocus: true,
    templates: {
      c: `// 【考试重点】双指针法去重\nint removeDuplicates(int* nums, int numsSize) {\n    // 请实现\n}`,
      cpp: `int removeDuplicates(vector<int>& nums) {\n    // 请实现\n}`,
      java: `int removeDuplicates(int[] nums) {\n    // 请实现\n}`,
      python: `def remove_duplicates(nums):\n    pass`
    },
    solutions: {
      c: `int removeDuplicates(int* nums, int numsSize) {\n    if (numsSize == 0) return 0;\n    int slow = 0;  // slow指向最后一个不重复元素的位置\n    for (int fast = 1; fast < numsSize; fast++) {\n        if (nums[fast] != nums[slow]) {\n            slow++;  // slow前进\n            nums[slow] = nums[fast];  // 把新元素放到slow位置\n        }\n    }\n    return slow + 1;  // 长度是下标+1\n}`,
      cpp: `int removeDuplicates(vector<int>& nums) {\n    if (nums.empty()) return 0;\n    int slow = 0;\n    for (int fast = 1; fast < nums.size(); fast++) {\n        if (nums[fast] != nums[slow]) {\n            nums[++slow] = nums[fast];\n        }\n    }\n    return slow + 1;\n}`,
      java: `int removeDuplicates(int[] nums) {\n    if (nums.length == 0) return 0;\n    int slow = 0;\n    for (int fast = 1; fast < nums.length; fast++) {\n        if (nums[fast] != nums[slow]) {\n            nums[++slow] = nums[fast];\n        }\n    }\n    return slow + 1;\n}`,
      python: `def remove_duplicates(nums):\n    if not nums: return 0\n    slow = 0\n    for fast in range(1, len(nums)):\n        if nums[fast] != nums[slow]:\n            slow += 1\n            nums[slow] = nums[fast]\n    return slow + 1`
    },
    testCases: [
      { input: '3\n1 1 2', expectedOutput: '2', description: '去重后[1,2]' },
      { input: '10\n0 0 1 1 1 2 2 3 3 4', expectedOutput: '5', description: '去重后5个元素' }
    ],
    hints: [
      'slow指向最后一个不重复元素',
      'fast遇到新元素时，slow先++再赋值',
      '返回slow+1（长度=下标+1）'
    ],
    explanation: `【去重双指针】
slow指向当前不重复序列的最后一个元素
fast遍历时，若与slow不同，说明是新元素，放到slow+1位置`,
    commonMistakes: ['数组为空时未特判', '返回slow而不是slow+1']
  },
  {
    id: 'exam-sorted-squares', category: '双指针', title: '【考试重点】有序数组的平方', difficulty: 'easy', type: 'coding',
    description: '给定非递减数组，返回每个数字的平方组成的新数组，也要非递减排序。要求：使用双指针法达到O(n)时间复杂度。',
    isExamFocus: true,
    templates: {
      c: `int* sortedSquares(int* nums, int n, int* returnSize) {\n    // 请实现双指针法\n}`,
      cpp: `vector<int> sortedSquares(vector<int>& nums) {\n    // 请实现\n}`,
      java: `int[] sortedSquares(int[] nums) {\n    // 请实现\n}`,
      python: `def sorted_squares(nums):\n    pass`
    },
    solutions: {
      c: `int* sortedSquares(int* nums, int n, int* returnSize) {\n    *returnSize = n;\n    int* res = (int*)malloc(n * sizeof(int));\n    int l = 0, r = n - 1, pos = n - 1;  // 从结果数组末尾开始填\n    while (l <= r) {\n        int sl = nums[l] * nums[l];\n        int sr = nums[r] * nums[r];\n        if (sl > sr) {\n            res[pos--] = sl;\n            l++;\n        } else {\n            res[pos--] = sr;\n            r--;\n        }\n    }\n    return res;\n}`,
      cpp: `vector<int> sortedSquares(vector<int>& nums) {\n    int n = nums.size();\n    vector<int> res(n);\n    int l = 0, r = n - 1, pos = n - 1;\n    while (l <= r) {\n        int sl = nums[l] * nums[l], sr = nums[r] * nums[r];\n        if (sl > sr) { res[pos--] = sl; l++; }\n        else { res[pos--] = sr; r--; }\n    }\n    return res;\n}`,
      java: `int[] sortedSquares(int[] nums) {\n    int n = nums.length;\n    int[] res = new int[n];\n    int l = 0, r = n - 1, pos = n - 1;\n    while (l <= r) {\n        int sl = nums[l] * nums[l], sr = nums[r] * nums[r];\n        if (sl > sr) { res[pos--] = sl; l++; }\n        else { res[pos--] = sr; r--; }\n    }\n    return res;\n}`,
      python: `def sorted_squares(nums):\n    n = len(nums)\n    res = [0] * n\n    l, r, pos = 0, n - 1, n - 1\n    while l <= r:\n        sl, sr = nums[l] ** 2, nums[r] ** 2\n        if sl > sr:\n            res[pos] = sl; l += 1\n        else:\n            res[pos] = sr; r -= 1\n        pos -= 1\n    return res`
    },
    testCases: [
      { input: '5\n-4 -1 0 3 10', expectedOutput: '0 1 9 16 100', description: '包含负数' },
      { input: '5\n-7 -3 2 3 11', expectedOutput: '4 9 9 49 121', description: '负数平方可能更大' }
    ],
    hints: [
      '原数组有序，平方后最大值一定在两端',
      '左右双指针，比较平方值，大的放到结果末尾',
      '从结果数组的末尾往前填'
    ],
    explanation: `【双指针法】
关键观察：原数组有序（可能有负数），平方后最大值一定在两端之一
用左右双指针，每次比较两端平方值，大的放到结果数组末尾`,
    commonMistakes: ['忘记负数平方可能更大', '结果数组填充方向错误']
  },
  {
    id: 'exam-array-shift', category: '双指针', title: '【考试重点】数组元素删除与移动', difficulty: 'medium', type: 'coding',
    description: '实现一个函数，删除数组中所有小于给定阈值的元素，并返回新数组长度。要求：原地操作，不申请额外空间，使用双指针法。',
    isExamFocus: true,
    templates: {
      c: `// 【考试典型题】删除所有小于threshold的元素\nint removeSmaller(int* nums, int n, int threshold) {\n    // 使用双指针法实现\n}`,
      cpp: `int removeSmaller(vector<int>& nums, int threshold) {\n    // 请实现\n}`,
      java: `int removeSmaller(int[] nums, int threshold) {\n    // 请实现\n}`,
      python: `def remove_smaller(nums, threshold):\n    pass`
    },
    solutions: {
      c: `int removeSmaller(int* nums, int n, int threshold) {\n    int slow = 0;\n    for (int fast = 0; fast < n; fast++) {\n        if (nums[fast] >= threshold) {  // 保留>=threshold的\n            nums[slow] = nums[fast];\n            slow++;\n        }\n    }\n    return slow;\n}`,
      cpp: `int removeSmaller(vector<int>& nums, int threshold) {\n    int slow = 0;\n    for (int fast = 0; fast < nums.size(); fast++) {\n        if (nums[fast] >= threshold) nums[slow++] = nums[fast];\n    }\n    return slow;\n}`,
      java: `int removeSmaller(int[] nums, int threshold) {\n    int slow = 0;\n    for (int fast = 0; fast < nums.length; fast++) {\n        if (nums[fast] >= threshold) nums[slow++] = nums[fast];\n    }\n    return slow;\n}`,
      python: `def remove_smaller(nums, threshold):\n    slow = 0\n    for fast in range(len(nums)):\n        if nums[fast] >= threshold:\n            nums[slow] = nums[fast]\n            slow += 1\n    return slow`
    },
    testCases: [
      { input: '6 4\n1 5 3 8 2 9', expectedOutput: '3', description: '保留>=4的元素' }
    ],
    hints: ['双指针模板：slow指向下一个保留位置，fast遍历', '条件改为保留>=threshold的元素'],
    explanation: '与移除元素思路相同，只是判断条件不同',
    commonMistakes: ['条件写反（删除>=threshold而不是<threshold）']
  },
  {
    id: 'exam-fb-two-pointer', category: '填空题', title: '【考试重点】双指针删除填空', difficulty: 'medium', type: 'fillblank',
    description: '补全双指针法删除数组中指定元素的代码',
    isExamFocus: true,
    templates: {
      cpp: `// 双指针法删除数组中等于val的元素\nint removeElement(int* nums, int n, int val) {\n    int slow = ___BLANK1___;  // 初始化慢指针\n    for (int fast = 0; fast < n; fast++) {\n        if (nums[fast] ___BLANK2___ val) {  // 判断条件\n            nums[slow] = nums[___BLANK3___];\n            slow++;\n        }\n    }\n    return ___BLANK4___;  // 返回新长度\n}`,
      java: `// 同上`, python: `# 同上`
    },
    solutions: { cpp: `// 答案`, java: `// 答案`, python: `# 答案` },
    testCases: [],
    blanks: [
      { id: 'BLANK1', answer: '0', hint: 'slow从0开始' },
      { id: 'BLANK2', answer: '!=', hint: '保留不等于val的' },
      { id: 'BLANK3', answer: 'fast', hint: '把fast位置的值复制过来' },
      { id: 'BLANK4', answer: 'slow', hint: 'slow就是新长度' }
    ],
    hints: ['slow初始为0', '保留nums[fast]!=val的元素', '返回slow'],
    explanation: '双指针法：slow=0，保留!=val的元素到slow位置，最后返回slow'
  },
];


export const patternsExerciseBank: Exercise[] = [
  ...stringExercises,
  ...twoPointerExercises,
  ...slidingWindowExercises,
  ...bitExercises,
  ...greedyExercises,
  ...backtrackExercises,
  ...classicDpExercises,
  ...mathExercises,
  ...moreLinkedListExercises,
  ...moreTreeExercises,
  ...moreFillBlankExercises,
  ...heapExercises,
  ...arrayExercises,
  ...matrixExercises,
  ...intervalExercises,
  ...moreGraphExercises,
  ...classicDpProblems,
  ...designExercises,
  ...moreStringExercises,
  ...unionFindExercises,
  ...monotoneStackExercises,
  ...prefixSumExercises,
  ...moreBinarySearchExercises,
  ...moreBacktrackExercises,
  ...moreGreedyExercises,
  ...moreDpExercises,
  ...extraFillBlankExercises,
  ...examFocusExercises,
];

