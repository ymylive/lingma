// 数字逻辑电路考试题目 - 覆盖高精度、递归、双指针、强制转换、链表、二维数组
// 所有题目标记考试重点 isExamFocus: true

import type { Exercise } from './exercises';

// ==================== 高精度运算 ====================
export const highPrecisionExercises: Exercise[] = [
  {
    id: 'hp-add',
    category: '高精度',
    title: '高精度加法',
    difficulty: 'medium',
    type: 'coding',
    isExamFocus: true,
    description: `【题目描述】
给定两个非负整数（可能非常大，超出long long范围），计算它们的和。

【输入格式】
第一行：第一个非负整数a（位数不超过10000）
第二行：第二个非负整数b（位数不超过10000）

【输出格式】
输出a+b的结果

【样例输入】
123456789012345678901234567890
987654321098765432109876543210

【样例输出】
1111111110111111111011111111100

【数据范围】
- 0 ≤ a, b
- 位数不超过10000`,
    templates: {
      c: `#include <stdio.h>
#include <string.h>

char a[10005], b[10005], c[10006];

int main() {
    scanf("%s%s", a, b);
    // TODO: 实现高精度加法
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

string add(string a, string b) {
    // TODO: 实现高精度加法
    return "";
}

int main() {
    string a, b;
    cin >> a >> b;
    cout << add(a, b) << endl;
    return 0;
}`,
      java: `import java.util.*;
import java.math.BigInteger;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String a = sc.next();
        String b = sc.next();
        // TODO: 实现高精度加法（不使用BigInteger）
    }
}`,
      python: `a = input()
b = input()
# TODO: 实现高精度加法（模拟手算过程）
`
    },
    solutions: {
      c: `#include <stdio.h>
#include <string.h>

char a[10005], b[10005], c[10006];

void reverse(char* s, int len) {
    for (int i = 0; i < len / 2; i++) {
        char t = s[i]; s[i] = s[len-1-i]; s[len-1-i] = t;
    }
}

int main() {
    scanf("%s%s", a, b);
    int la = strlen(a), lb = strlen(b);
    reverse(a, la); reverse(b, lb);
    
    int carry = 0, i = 0;
    while (i < la || i < lb || carry) {
        int sum = carry;
        if (i < la) sum += a[i] - '0';
        if (i < lb) sum += b[i] - '0';
        c[i++] = sum % 10 + '0';
        carry = sum / 10;
    }
    c[i] = '\\0';
    reverse(c, i);
    printf("%s\\n", c);
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

string add(string a, string b) {
    string result;
    reverse(a.begin(), a.end());
    reverse(b.begin(), b.end());
    
    int carry = 0, i = 0;
    while (i < a.size() || i < b.size() || carry) {
        int sum = carry;
        if (i < a.size()) sum += a[i] - '0';
        if (i < b.size()) sum += b[i] - '0';
        result += (sum % 10) + '0';
        carry = sum / 10;
        i++;
    }
    reverse(result.begin(), result.end());
    return result;
}

int main() {
    string a, b;
    cin >> a >> b;
    cout << add(a, b) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static String add(String a, String b) {
        StringBuilder result = new StringBuilder();
        int i = a.length() - 1, j = b.length() - 1;
        int carry = 0;
        while (i >= 0 || j >= 0 || carry > 0) {
            int sum = carry;
            if (i >= 0) sum += a.charAt(i--) - '0';
            if (j >= 0) sum += b.charAt(j--) - '0';
            result.append(sum % 10);
            carry = sum / 10;
        }
        return result.reverse().toString();
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(add(sc.next(), sc.next()));
    }
}`,
      python: `def add(a, b):
    result = []
    i, j = len(a) - 1, len(b) - 1
    carry = 0
    while i >= 0 or j >= 0 or carry:
        s = carry
        if i >= 0: s += int(a[i]); i -= 1
        if j >= 0: s += int(b[j]); j -= 1
        result.append(str(s % 10))
        carry = s // 10
    return ''.join(reversed(result))

a = input()
b = input()
print(add(a, b))`
    },
    testCases: [
      { input: '123\\n456', expectedOutput: '579', description: '普通加法' },
      { input: '999\\n1', expectedOutput: '1000', description: '进位' },
      { input: '123456789012345678901234567890\\n987654321098765432109876543210', expectedOutput: '1111111110111111111011111111100', description: '大数加法' }
    ],
    hints: [
      '将字符串反转，从低位开始相加',
      '注意处理进位',
      '两数位数可能不同，需要分别处理'
    ],
    explanation: `【高精度加法核心思想】
模拟手算竖式加法：
1. 将两个数字字符串反转（或从末尾开始）
2. 逐位相加，处理进位
3. 最后反转结果

【时间复杂度】O(max(n,m))，n和m为两数位数
【空间复杂度】O(max(n,m))`,
    commonMistakes: [
      '忘记处理最后的进位',
      '字符与数字转换错误（忘记-\'0\'）',
      '两数位数不同时越界访问'
    ]
  },
  {
    id: 'hp-multiply',
    category: '高精度',
    title: '高精度乘法',
    difficulty: 'hard',
    type: 'coding',
    isExamFocus: true,
    description: `【题目描述】
给定两个非负整数（可能非常大），计算它们的乘积。

【输入格式】
第一行：第一个非负整数a
第二行：第二个非负整数b

【输出格式】
输出a×b的结果

【样例输入】
123456789
987654321

【样例输出】
121932631112635269

【数据范围】
- 0 ≤ a, b
- 位数不超过1000`,
    templates: {
      c: `#include <stdio.h>
#include <string.h>

char a[1005], b[1005];
int c[2010];

int main() {
    scanf("%s%s", a, b);
    // TODO: 实现高精度乘法
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

string multiply(string a, string b) {
    // TODO: 实现高精度乘法
    return "";
}

int main() {
    string a, b;
    cin >> a >> b;
    cout << multiply(a, b) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String a = sc.next();
        String b = sc.next();
        // TODO: 实现高精度乘法
    }
}`,
      python: `a = input()
b = input()
# TODO: 实现高精度乘法（模拟手算过程）
`
    },
    solutions: {
      c: `#include <stdio.h>
#include <string.h>

char a[1005], b[1005];
int c[2010];

int main() {
    scanf("%s%s", a, b);
    int la = strlen(a), lb = strlen(b);
    
    // 逐位相乘
    for (int i = la - 1; i >= 0; i--) {
        for (int j = lb - 1; j >= 0; j--) {
            int p1 = i + j, p2 = i + j + 1;
            int mul = (a[i] - '0') * (b[j] - '0');
            int sum = mul + c[p2];
            c[p2] = sum % 10;
            c[p1] += sum / 10;
        }
    }
    
    // 输出结果，跳过前导零
    int start = 0;
    while (start < la + lb - 1 && c[start] == 0) start++;
    for (int i = start; i < la + lb; i++) printf("%d", c[i]);
    printf("\\n");
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

string multiply(string a, string b) {
    int n = a.size(), m = b.size();
    vector<int> result(n + m, 0);
    
    for (int i = n - 1; i >= 0; i--) {
        for (int j = m - 1; j >= 0; j--) {
            int mul = (a[i] - '0') * (b[j] - '0');
            int p1 = i + j, p2 = i + j + 1;
            int sum = mul + result[p2];
            result[p2] = sum % 10;
            result[p1] += sum / 10;
        }
    }
    
    string str;
    for (int x : result) {
        if (!(str.empty() && x == 0)) str += to_string(x);
    }
    return str.empty() ? "0" : str;
}

int main() {
    string a, b;
    cin >> a >> b;
    cout << multiply(a, b) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static String multiply(String a, String b) {
        int n = a.length(), m = b.length();
        int[] result = new int[n + m];
        
        for (int i = n - 1; i >= 0; i--) {
            for (int j = m - 1; j >= 0; j--) {
                int mul = (a.charAt(i) - '0') * (b.charAt(j) - '0');
                int p1 = i + j, p2 = i + j + 1;
                int sum = mul + result[p2];
                result[p2] = sum % 10;
                result[p1] += sum / 10;
            }
        }
        
        StringBuilder sb = new StringBuilder();
        for (int x : result) {
            if (!(sb.length() == 0 && x == 0)) sb.append(x);
        }
        return sb.length() == 0 ? "0" : sb.toString();
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(multiply(sc.next(), sc.next()));
    }
}`,
      python: `def multiply(a, b):
    n, m = len(a), len(b)
    result = [0] * (n + m)
    
    for i in range(n - 1, -1, -1):
        for j in range(m - 1, -1, -1):
            mul = int(a[i]) * int(b[j])
            p1, p2 = i + j, i + j + 1
            s = mul + result[p2]
            result[p2] = s % 10
            result[p1] += s // 10
    
    # 去除前导零
    res = ''.join(map(str, result)).lstrip('0')
    return res if res else '0'

a = input()
b = input()
print(multiply(a, b))`
    },
    testCases: [
      { input: '12\\n34', expectedOutput: '408', description: '普通乘法' },
      { input: '123456789\\n987654321', expectedOutput: '121932631112635269', description: '大数乘法' },
      { input: '0\\n12345', expectedOutput: '0', description: '乘以零' }
    ],
    hints: [
      '模拟竖式乘法',
      'a[i] × b[j] 的结果影响 result[i+j] 和 result[i+j+1]',
      '注意处理前导零和结果为0的情况'
    ],
    explanation: `【高精度乘法核心思想】
模拟竖式乘法：a[i] × b[j] 的结果加到 result[i+j+1]，进位加到 result[i+j]

【关键点】
1. 结果数组长度为 n+m（两数位数之和）
2. 位置关系：a[i] × b[j] → result[i+j], result[i+j+1]
3. 去除前导零

【时间复杂度】O(n×m)
【空间复杂度】O(n+m)`,
    commonMistakes: [
      '位置计算错误',
      '忘记处理前导零',
      '结果为0时输出空字符串'
    ]
  },
  {
    id: 'hp-factorial',
    category: '高精度',
    title: '高精度阶乘',
    difficulty: 'medium',
    type: 'coding',
    isExamFocus: true,
    description: `【题目描述】
计算n!（n的阶乘），结果可能非常大。

【输入格式】
一个整数n（0 ≤ n ≤ 1000）

【输出格式】
输出n!的值

【样例输入】
20

【样例输出】
2432902008176640000

【数据范围】
- 0 ≤ n ≤ 1000`,
    templates: {
      c: `#include <stdio.h>

int result[3000];
int len = 1;

void multiply(int x) {
    // TODO: 实现高精度乘以普通整数
}

int main() {
    int n;
    scanf("%d", &n);
    result[0] = 1;
    // TODO: 计算n!
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> multiply(vector<int>& num, int x) {
    // TODO: 实现高精度乘以普通整数
    return num;
}

int main() {
    int n;
    cin >> n;
    // TODO: 计算n!
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // TODO: 计算n!
    }
}`,
      python: `n = int(input())
# TODO: 计算n!（不使用内置函数）
`
    },
    solutions: {
      c: `#include <stdio.h>

int result[3000];
int len = 1;

void multiply(int x) {
    int carry = 0;
    for (int i = 0; i < len; i++) {
        int prod = result[i] * x + carry;
        result[i] = prod % 10;
        carry = prod / 10;
    }
    while (carry) {
        result[len++] = carry % 10;
        carry /= 10;
    }
}

int main() {
    int n;
    scanf("%d", &n);
    result[0] = 1;
    
    for (int i = 2; i <= n; i++) {
        multiply(i);
    }
    
    for (int i = len - 1; i >= 0; i--) {
        printf("%d", result[i]);
    }
    printf("\\n");
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    vector<int> result = {1};  // 低位在前
    
    for (int x = 2; x <= n; x++) {
        int carry = 0;
        for (int i = 0; i < result.size(); i++) {
            int prod = result[i] * x + carry;
            result[i] = prod % 10;
            carry = prod / 10;
        }
        while (carry) {
            result.push_back(carry % 10);
            carry /= 10;
        }
    }
    
    for (int i = result.size() - 1; i >= 0; i--) {
        cout << result[i];
    }
    cout << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        List<Integer> result = new ArrayList<>();
        result.add(1);
        
        for (int x = 2; x <= n; x++) {
            int carry = 0;
            for (int i = 0; i < result.size(); i++) {
                int prod = result.get(i) * x + carry;
                result.set(i, prod % 10);
                carry = prod / 10;
            }
            while (carry > 0) {
                result.add(carry % 10);
                carry /= 10;
            }
        }
        
        StringBuilder sb = new StringBuilder();
        for (int i = result.size() - 1; i >= 0; i--) {
            sb.append(result.get(i));
        }
        System.out.println(sb);
    }
}`,
      python: `def factorial(n):
    result = [1]  # 低位在前
    
    for x in range(2, n + 1):
        carry = 0
        for i in range(len(result)):
            prod = result[i] * x + carry
            result[i] = prod % 10
            carry = prod // 10
        while carry:
            result.append(carry % 10)
            carry //= 10
    
    return ''.join(map(str, reversed(result)))

n = int(input())
print(factorial(n))`
    },
    testCases: [
      { input: '5', expectedOutput: '120', description: '5!' },
      { input: '10', expectedOutput: '3628800', description: '10!' },
      { input: '20', expectedOutput: '2432902008176640000', description: '20!' },
      { input: '0', expectedOutput: '1', description: '0!' }
    ],
    hints: [
      '用数组存储大数，低位在前',
      '每次乘以一个整数，处理进位',
      '0! = 1'
    ],
    explanation: `【高精度阶乘核心思想】
用数组模拟大数，从1开始依次乘以2,3,...,n

【实现要点】
1. 数组低位在前，便于处理进位
2. 每次乘法后处理所有进位
3. 注意0!=1的特殊情况

【时间复杂度】O(n × 结果位数)
【空间复杂度】O(结果位数)，约为O(n log n)`,
    commonMistakes: [
      '忘记处理0!的情况',
      '进位处理不完整',
      '输出顺序错误（应从高位到低位）'
    ]
  }
];

// ==================== 双指针 ====================
export const twoPointerExamExercises: Exercise[] = [
  {
    id: 'tp-two-sum-sorted',
    category: '双指针',
    title: '有序数组两数之和',
    difficulty: 'easy',
    type: 'coding',
    isExamFocus: true,
    description: `【题目描述】
给定一个已按升序排列的整数数组numbers，找出两个数使它们的和等于目标数target。
返回这两个数的下标（从1开始）。

【输入格式】
第一行：整数n和target
第二行：n个升序整数

【输出格式】
输出两个下标，空格分隔

【样例输入】
4 9
2 3 4 7

【样例输出】
1 4

【数据范围】
- 2 ≤ n ≤ 3×10^4
- -1000 ≤ numbers[i] ≤ 1000
- 保证有唯一解`,
    templates: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

pair<int,int> twoSum(vector<int>& nums, int target) {
    // TODO: 双指针实现
    return {-1, -1};
}

int main() {
    int n, target;
    cin >> n >> target;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    auto [a, b] = twoSum(nums, target);
    cout << a << " " << b << endl;
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static int[] twoSum(int[] nums, int target) {
        // TODO: 双指针实现
        return new int[]{-1, -1};
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), target = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int[] res = twoSum(nums, target);
        System.out.println(res[0] + " " + res[1]);
    }
}`,
      python: `def two_sum(nums, target):
    # TODO: 双指针实现
    pass

n, target = map(int, input().split())
nums = list(map(int, input().split()))
a, b = two_sum(nums, target)
print(a, b)`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

pair<int,int> twoSum(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) return {left + 1, right + 1};
        else if (sum < target) left++;
        else right--;
    }
    return {-1, -1};
}

int main() {
    int n, target;
    cin >> n >> target;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    auto [a, b] = twoSum(nums, target);
    cout << a << " " << b << endl;
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static int[] twoSum(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left < right) {
            int sum = nums[left] + nums[right];
            if (sum == target) return new int[]{left + 1, right + 1};
            else if (sum < target) left++;
            else right--;
        }
        return new int[]{-1, -1};
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), target = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int[] res = twoSum(nums, target);
        System.out.println(res[0] + " " + res[1]);
    }
}`,
      python: `def two_sum(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        s = nums[left] + nums[right]
        if s == target:
            return left + 1, right + 1
        elif s < target:
            left += 1
        else:
            right -= 1
    return -1, -1

n, target = map(int, input().split())
nums = list(map(int, input().split()))
a, b = two_sum(nums, target)
print(a, b)`
    },
    testCases: [
      { input: '4 9\\n2 3 4 7', expectedOutput: '1 4', description: '基本测试' },
      { input: '3 6\\n1 2 4', expectedOutput: '2 3', description: '相邻元素' }
    ],
    hints: ['利用数组有序性', '左指针从头，右指针从尾', '和小了左移，和大了右移'],
    explanation: `【双指针核心思想】
利用数组有序性，左右指针向中间逼近：
- sum < target: 左指针右移（增大和）
- sum > target: 右指针左移（减小和）
- sum == target: 找到答案

【时间复杂度】O(n)
【空间复杂度】O(1)`,
    commonMistakes: ['下标从0还是从1开始', '指针移动方向错误', '循环条件写成left<=right导致死循环']
  },
  {
    id: 'tp-palindrome-check',
    category: '双指针',
    title: '双指针判断回文',
    difficulty: 'easy',
    type: 'coding',
    isExamFocus: true,
    description: `【题目描述】
给定一个字符串，判断它是否是回文串（只考虑字母和数字，忽略大小写）。

【输入格式】
一行字符串

【输出格式】
输出true或false

【样例输入】
A man, a plan, a canal: Panama

【样例输出】
true

【数据范围】
- 1 ≤ s.length ≤ 2×10^5`,
    templates: {
      cpp: `#include <iostream>
#include <string>
using namespace std;

bool isPalindrome(string s) {
    // TODO: 双指针判断回文
    return false;
}

int main() {
    string s;
    getline(cin, s);
    cout << (isPalindrome(s) ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static boolean isPalindrome(String s) {
        // TODO: 双指针判断回文
        return false;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(isPalindrome(s) ? "true" : "false");
    }
}`,
      python: `def is_palindrome(s):
    # TODO: 双指针判断回文
    pass

s = input()
print("true" if is_palindrome(s) else "false")`
    },
    solutions: {
      cpp: `#include <iostream>
#include <string>
#include <cctype>
using namespace std;

bool isPalindrome(string s) {
    int left = 0, right = s.size() - 1;
    while (left < right) {
        while (left < right && !isalnum(s[left])) left++;
        while (left < right && !isalnum(s[right])) right--;
        if (tolower(s[left]) != tolower(s[right])) return false;
        left++; right--;
    }
    return true;
}

int main() {
    string s;
    getline(cin, s);
    cout << (isPalindrome(s) ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right)))
                return false;
            left++; right--;
        }
        return true;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(isPalindrome(s) ? "true" : "false");
    }
}`,
      python: `def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True

s = input()
print("true" if is_palindrome(s) else "false")`
    },
    testCases: [
      { input: 'A man, a plan, a canal: Panama', expectedOutput: 'true', description: '含特殊字符的回文' },
      { input: 'race a car', expectedOutput: 'false', description: '非回文' },
      { input: ' ', expectedOutput: 'true', description: '空格' }
    ],
    hints: ['左右指针向中间移动', '跳过非字母数字字符', '忽略大小写比较'],
    explanation: `【双指针判断回文】
1. 左指针从头，右指针从尾
2. 跳过非字母数字字符
3. 忽略大小写比较
4. 不相等则不是回文

【时间复杂度】O(n)
【空间复杂度】O(1)`,
    commonMistakes: ['忘记跳过非字母数字字符', '忘记忽略大小写', '边界条件处理不当']
  },
  {
    id: 'tp-remove-element',
    category: '双指针',
    title: '移除元素',
    difficulty: 'easy',
    type: 'coding',
    isExamFocus: true,
    description: `【题目描述】
给定一个数组nums和一个值val，原地移除所有等于val的元素，返回移除后数组的新长度。
不要使用额外的数组空间，必须仅使用O(1)额外空间并原地修改输入数组。

【输入格式】
第一行：整数n和val
第二行：n个整数

【输出格式】
第一行：新数组长度
第二行：新数组元素

【样例输入】
7 3
3 2 2 3 3 4 5

【样例输出】
4
2 2 4 5`,
    templates: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int removeElement(vector<int>& nums, int val) {
    // TODO: 双指针原地移除
    return 0;
}

int main() {
    int n, val;
    cin >> n >> val;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int len = removeElement(nums, val);
    cout << len << endl;
    for (int i = 0; i < len; i++) cout << nums[i] << " ";
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static int removeElement(int[] nums, int val) {
        // TODO: 双指针原地移除
        return 0;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), val = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int len = removeElement(nums, val);
        System.out.println(len);
        for (int i = 0; i < len; i++) System.out.print(nums[i] + " ");
    }
}`,
      python: `def remove_element(nums, val):
    # TODO: 双指针原地移除
    return 0

n, val = map(int, input().split())
nums = list(map(int, input().split()))
length = remove_element(nums, val)
print(length)
print(' '.join(map(str, nums[:length])))`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int removeElement(vector<int>& nums, int val) {
    int slow = 0;
    for (int fast = 0; fast < nums.size(); fast++) {
        if (nums[fast] != val) {
            nums[slow++] = nums[fast];
        }
    }
    return slow;
}

int main() {
    int n, val;
    cin >> n >> val;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int len = removeElement(nums, val);
    cout << len << endl;
    for (int i = 0; i < len; i++) cout << nums[i] << " ";
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static int removeElement(int[] nums, int val) {
        int slow = 0;
        for (int fast = 0; fast < nums.length; fast++) {
            if (nums[fast] != val) {
                nums[slow++] = nums[fast];
            }
        }
        return slow;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), val = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int len = removeElement(nums, val);
        System.out.println(len);
        for (int i = 0; i < len; i++) System.out.print(nums[i] + " ");
    }
}`,
      python: `def remove_element(nums, val):
    slow = 0
    for fast in range(len(nums)):
        if nums[fast] != val:
            nums[slow] = nums[fast]
            slow += 1
    return slow

n, val = map(int, input().split())
nums = list(map(int, input().split()))
length = remove_element(nums, val)
print(length)
print(' '.join(map(str, nums[:length])))`
    },
    testCases: [
      { input: '7 3\\n3 2 2 3 3 4 5', expectedOutput: '4\\n2 2 4 5', description: '移除3' },
      { input: '4 2\\n2 2 2 2', expectedOutput: '0\\n', description: '全部移除' }
    ],
    hints: ['快慢指针', '快指针遍历，慢指针记录有效位置', '不等于val时复制到慢指针位置'],
    explanation: `【快慢指针原地移除】
- 快指针：遍历数组
- 慢指针：指向下一个有效位置
- 当nums[fast] != val时，复制到slow位置

【时间复杂度】O(n)
【空间复杂度】O(1)`,
    commonMistakes: ['忘记移动慢指针', '返回值错误', '修改了原数组但返回长度不对']
  }
];


// ==================== 强制转换 ====================
export const typeCastExercises: Exercise[] = [
  {
    id: 'tc-int-char',
    category: '强制转换',
    title: '整型与字符转换',
    difficulty: 'easy',
    type: 'coding',
    isExamFocus: true,
    description: `【题目描述】
给定一个字符串，将其中的小写字母转换为大写字母，大写字母转换为小写字母，数字字符转换为对应的整数并求和。

【输入格式】
一行字符串（只包含字母和数字）

【输出格式】
第一行：转换后的字符串（数字用*替代）
第二行：数字之和

【样例输入】
Hello123World

【样例输出】
hELLO***wORLD
6

【数据范围】
- 1 ≤ s.length ≤ 1000`,
    templates: {
      c: `#include <stdio.h>
#include <string.h>
#include <ctype.h>

int main() {
    char s[1005];
    scanf("%s", s);
    // TODO: 实现转换
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    // TODO: 实现转换
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        // TODO: 实现转换
    }
}`,
      python: `s = input()
# TODO: 实现转换
`
    },
    solutions: {
      c: `#include <stdio.h>
#include <string.h>
#include <ctype.h>

int main() {
    char s[1005], result[1005];
    scanf("%s", s);
    int sum = 0, len = strlen(s);
    
    for (int i = 0; i < len; i++) {
        char c = s[i];
        if (c >= 'a' && c <= 'z') {
            result[i] = c - 'a' + 'A';  // 小写转大写
        } else if (c >= 'A' && c <= 'Z') {
            result[i] = c - 'A' + 'a';  // 大写转小写
        } else if (c >= '0' && c <= '9') {
            sum += c - '0';  // 字符转数字
            result[i] = '*';
        }
    }
    result[len] = '\\0';
    printf("%s\\n%d\\n", result, sum);
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    int sum = 0;
    string result;
    
    for (char c : s) {
        if (c >= 'a' && c <= 'z') {
            result += (char)(c - 'a' + 'A');
        } else if (c >= 'A' && c <= 'Z') {
            result += (char)(c - 'A' + 'a');
        } else if (c >= '0' && c <= '9') {
            sum += c - '0';
            result += '*';
        }
    }
    cout << result << endl << sum << endl;
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        StringBuilder result = new StringBuilder();
        int sum = 0;
        
        for (char c : s.toCharArray()) {
            if (c >= 'a' && c <= 'z') {
                result.append((char)(c - 'a' + 'A'));
            } else if (c >= 'A' && c <= 'Z') {
                result.append((char)(c - 'A' + 'a'));
            } else if (c >= '0' && c <= '9') {
                sum += c - '0';
                result.append('*');
            }
        }
        System.out.println(result);
        System.out.println(sum);
    }
}`,
      python: `s = input()
result = []
total = 0

for c in s:
    if 'a' <= c <= 'z':
        result.append(chr(ord(c) - ord('a') + ord('A')))
    elif 'A' <= c <= 'Z':
        result.append(chr(ord(c) - ord('A') + ord('a')))
    elif '0' <= c <= '9':
        total += int(c)
        result.append('*')

print(''.join(result))
print(total)`
    },
    testCases: [
      { input: 'Hello123World', expectedOutput: 'hELLO***wORLD\\n6', description: '混合转换' },
      { input: 'ABC', expectedOutput: 'abc\\n0', description: '纯大写' },
      { input: '123', expectedOutput: '***\\n6', description: '纯数字' }
    ],
    hints: [
      '字符与ASCII码的关系',
      '大小写转换：差值为32或用\'a\'-\'A\'',
      '数字字符转整数：c - \'0\''
    ],
    explanation: `【字符与整数转换核心】
1. 大写转小写：c - 'A' + 'a' 或 c + 32
2. 小写转大写：c - 'a' + 'A' 或 c - 32
3. 数字字符转整数：c - '0'
4. 整数转数字字符：n + '0'

【ASCII码关系】
- 'A'=65, 'Z'=90
- 'a'=97, 'z'=122
- '0'=48, '9'=57`,
    commonMistakes: [
      '忘记强制转换为char类型',
      '大小写转换方向搞反',
      '字符\'0\'和数字0混淆',
      '忘记处理边界字符'
    ]
  },
  {
    id: 'tc-overflow',
    category: '强制转换',
    title: '整型溢出检测',
    difficulty: 'medium',
    type: 'coding',
    isExamFocus: true,
    description: `【题目描述】
给定两个32位有符号整数a和b，判断它们的和是否会溢出。
如果不溢出，输出它们的和；如果溢出，输出"overflow"。

【输入格式】
两个整数a和b（在int范围内）

【输出格式】
和或"overflow"

【样例输入1】
2147483647 1

【样例输出1】
overflow

【样例输入2】
100 200

【样例输出2】
300

【数据范围】
- -2^31 ≤ a, b ≤ 2^31-1`,
    templates: {
      c: `#include <stdio.h>
#include <limits.h>

int main() {
    int a, b;
    scanf("%d%d", &a, &b);
    // TODO: 检测溢出并输出结果
    return 0;
}`,
      cpp: `#include <iostream>
#include <climits>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    // TODO: 检测溢出并输出结果
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt(), b = sc.nextInt();
        // TODO: 检测溢出并输出结果
    }
}`,
      python: `a, b = map(int, input().split())
# Python整数无溢出，但模拟32位整数溢出检测
INT_MAX = 2147483647
INT_MIN = -2147483648
# TODO: 检测溢出并输出结果
`
    },
    solutions: {
      c: `#include <stdio.h>
#include <limits.h>

int main() {
    int a, b;
    scanf("%d%d", &a, &b);
    
    // 检测正溢出：a > 0 && b > 0 && a > INT_MAX - b
    // 检测负溢出：a < 0 && b < 0 && a < INT_MIN - b
    if ((b > 0 && a > INT_MAX - b) || (b < 0 && a < INT_MIN - b)) {
        printf("overflow\\n");
    } else {
        printf("%d\\n", a + b);
    }
    return 0;
}`,
      cpp: `#include <iostream>
#include <climits>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    
    if ((b > 0 && a > INT_MAX - b) || (b < 0 && a < INT_MIN - b)) {
        cout << "overflow" << endl;
    } else {
        cout << a + b << endl;
    }
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt(), b = sc.nextInt();
        
        if ((b > 0 && a > Integer.MAX_VALUE - b) || 
            (b < 0 && a < Integer.MIN_VALUE - b)) {
            System.out.println("overflow");
        } else {
            System.out.println(a + b);
        }
    }
}`,
      python: `a, b = map(int, input().split())
INT_MAX = 2147483647
INT_MIN = -2147483648

if (b > 0 and a > INT_MAX - b) or (b < 0 and a < INT_MIN - b):
    print("overflow")
else:
    print(a + b)`
    },
    testCases: [
      { input: '2147483647 1', expectedOutput: 'overflow', description: '正溢出' },
      { input: '-2147483648 -1', expectedOutput: 'overflow', description: '负溢出' },
      { input: '100 200', expectedOutput: '300', description: '正常相加' }
    ],
    hints: [
      '不能直接相加后判断，因为溢出后结果已经错误',
      '正溢出条件：b>0 且 a>INT_MAX-b',
      '负溢出条件：b<0 且 a<INT_MIN-b'
    ],
    explanation: `【整型溢出检测核心】
不能先加后判断！必须在加之前检测：
- 正溢出：a + b > INT_MAX → a > INT_MAX - b（当b>0时）
- 负溢出：a + b < INT_MIN → a < INT_MIN - b（当b<0时）

【32位有符号整数范围】
- INT_MAX = 2147483647 (2^31-1)
- INT_MIN = -2147483648 (-2^31)`,
    commonMistakes: [
      '先相加再判断（溢出后结果已错）',
      '只检测正溢出忘记负溢出',
      '边界条件判断错误',
      '使用long long存储后忘记转回int'
    ]
  }
];


// ==================== 二维数组 ====================
export const array2DExercises: Exercise[] = [
  {
    id: 'arr2d-transpose',
    category: '二维数组',
    title: '矩阵转置',
    difficulty: 'easy',
    type: 'coding',
    isExamFocus: true,
    description: `【题目描述】
给定一个m×n的矩阵，返回其转置矩阵。
转置矩阵是将原矩阵的行变成列，列变成行。

【输入格式】
第一行：整数m和n
接下来m行，每行n个整数

【输出格式】
输出n×m的转置矩阵

【样例输入】
2 3
1 2 3
4 5 6

【样例输出】
1 4
2 5
3 6

【数据范围】
- 1 ≤ m, n ≤ 1000`,
    templates: {
      c: `#include <stdio.h>

int main() {
    int m, n;
    scanf("%d%d", &m, &n);
    int a[1005][1005], b[1005][1005];
    // TODO: 读入矩阵并转置
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<vector<int>> transpose(vector<vector<int>>& matrix) {
    // TODO: 实现矩阵转置
    return {};
}

int main() {
    int m, n;
    cin >> m >> n;
    vector<vector<int>> matrix(m, vector<int>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            cin >> matrix[i][j];
    auto result = transpose(matrix);
    for (auto& row : result) {
        for (int x : row) cout << x << " ";
        cout << endl;
    }
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static int[][] transpose(int[][] matrix) {
        // TODO: 实现矩阵转置
        return null;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt(), n = sc.nextInt();
        int[][] matrix = new int[m][n];
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                matrix[i][j] = sc.nextInt();
        int[][] result = transpose(matrix);
        for (int[] row : result) {
            for (int x : row) System.out.print(x + " ");
            System.out.println();
        }
    }
}`,
      python: `def transpose(matrix):
    # TODO: 实现矩阵转置
    pass

m, n = map(int, input().split())
matrix = [list(map(int, input().split())) for _ in range(m)]
result = transpose(matrix)
for row in result:
    print(' '.join(map(str, row)))`
    },
    solutions: {
      c: `#include <stdio.h>

int main() {
    int m, n;
    scanf("%d%d", &m, &n);
    int a[1005][1005], b[1005][1005];
    
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            scanf("%d", &a[i][j]);
    
    // 转置：b[j][i] = a[i][j]
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            b[j][i] = a[i][j];
    
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++)
            printf("%d ", b[i][j]);
        printf("\\n");
    }
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<vector<int>> transpose(vector<vector<int>>& matrix) {
    int m = matrix.size(), n = matrix[0].size();
    vector<vector<int>> result(n, vector<int>(m));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            result[j][i] = matrix[i][j];
    return result;
}

int main() {
    int m, n;
    cin >> m >> n;
    vector<vector<int>> matrix(m, vector<int>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            cin >> matrix[i][j];
    auto result = transpose(matrix);
    for (auto& row : result) {
        for (int x : row) cout << x << " ";
        cout << endl;
    }
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static int[][] transpose(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        int[][] result = new int[n][m];
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                result[j][i] = matrix[i][j];
        return result;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt(), n = sc.nextInt();
        int[][] matrix = new int[m][n];
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                matrix[i][j] = sc.nextInt();
        int[][] result = transpose(matrix);
        for (int[] row : result) {
            for (int x : row) System.out.print(x + " ");
            System.out.println();
        }
    }
}`,
      python: `def transpose(matrix):
    m, n = len(matrix), len(matrix[0])
    return [[matrix[i][j] for i in range(m)] for j in range(n)]

m, n = map(int, input().split())
matrix = [list(map(int, input().split())) for _ in range(m)]
result = transpose(matrix)
for row in result:
    print(' '.join(map(str, row)))`
    },
    testCases: [
      { input: '2 3\\n1 2 3\\n4 5 6', expectedOutput: '1 4\\n2 5\\n3 6', description: '2×3矩阵转置' },
      { input: '1 3\\n1 2 3', expectedOutput: '1\\n2\\n3', description: '行向量转列向量' }
    ],
    hints: [
      '转置后矩阵大小从m×n变为n×m',
      '核心公式：result[j][i] = matrix[i][j]',
      '注意边界检查：i<m, j<n'
    ],
    explanation: `【矩阵转置核心】
转置公式：B[j][i] = A[i][j]
- 原矩阵第i行第j列 → 新矩阵第j行第i列
- 原矩阵m×n → 新矩阵n×m

【时间复杂度】O(m×n)
【空间复杂度】O(m×n)`,
    commonMistakes: [
      '新矩阵大小设置错误（应为n×m）',
      '下标i和j混淆',
      '原地转置时覆盖了未处理的元素'
    ]
  },
  {
    id: 'arr2d-spiral',
    category: '二维数组',
    title: '螺旋矩阵遍历',
    difficulty: 'medium',
    type: 'coding',
    isExamFocus: true,
    description: `【题目描述】
给定一个m×n的矩阵，按照顺时针螺旋顺序，返回矩阵中的所有元素。

【输入格式】
第一行：整数m和n
接下来m行，每行n个整数

【输出格式】
一行，按螺旋顺序输出所有元素

【样例输入】
3 3
1 2 3
4 5 6
7 8 9

【样例输出】
1 2 3 6 9 8 7 4 5

【数据范围】
- 1 ≤ m, n ≤ 10`,
    templates: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> spiralOrder(vector<vector<int>>& matrix) {
    // TODO: 实现螺旋遍历
    return {};
}

int main() {
    int m, n;
    cin >> m >> n;
    vector<vector<int>> matrix(m, vector<int>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            cin >> matrix[i][j];
    auto result = spiralOrder(matrix);
    for (int x : result) cout << x << " ";
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static List<Integer> spiralOrder(int[][] matrix) {
        // TODO: 实现螺旋遍历
        return new ArrayList<>();
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt(), n = sc.nextInt();
        int[][] matrix = new int[m][n];
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                matrix[i][j] = sc.nextInt();
        List<Integer> result = spiralOrder(matrix);
        for (int x : result) System.out.print(x + " ");
    }
}`,
      python: `def spiral_order(matrix):
    # TODO: 实现螺旋遍历
    pass

m, n = map(int, input().split())
matrix = [list(map(int, input().split())) for _ in range(m)]
result = spiral_order(matrix)
print(' '.join(map(str, result)))`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> spiralOrder(vector<vector<int>>& matrix) {
    vector<int> result;
    if (matrix.empty()) return result;
    
    int top = 0, bottom = matrix.size() - 1;
    int left = 0, right = matrix[0].size() - 1;
    
    while (top <= bottom && left <= right) {
        // 向右
        for (int j = left; j <= right; j++)
            result.push_back(matrix[top][j]);
        top++;
        
        // 向下
        for (int i = top; i <= bottom; i++)
            result.push_back(matrix[i][right]);
        right--;
        
        // 向左（需要检查是否还有行）
        if (top <= bottom) {
            for (int j = right; j >= left; j--)
                result.push_back(matrix[bottom][j]);
            bottom--;
        }
        
        // 向上（需要检查是否还有列）
        if (left <= right) {
            for (int i = bottom; i >= top; i--)
                result.push_back(matrix[i][left]);
            left++;
        }
    }
    return result;
}

int main() {
    int m, n;
    cin >> m >> n;
    vector<vector<int>> matrix(m, vector<int>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            cin >> matrix[i][j];
    auto result = spiralOrder(matrix);
    for (int x : result) cout << x << " ";
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> result = new ArrayList<>();
        if (matrix.length == 0) return result;
        
        int top = 0, bottom = matrix.length - 1;
        int left = 0, right = matrix[0].length - 1;
        
        while (top <= bottom && left <= right) {
            for (int j = left; j <= right; j++)
                result.add(matrix[top][j]);
            top++;
            
            for (int i = top; i <= bottom; i++)
                result.add(matrix[i][right]);
            right--;
            
            if (top <= bottom) {
                for (int j = right; j >= left; j--)
                    result.add(matrix[bottom][j]);
                bottom--;
            }
            
            if (left <= right) {
                for (int i = bottom; i >= top; i--)
                    result.add(matrix[i][left]);
                left++;
            }
        }
        return result;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt(), n = sc.nextInt();
        int[][] matrix = new int[m][n];
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                matrix[i][j] = sc.nextInt();
        List<Integer> result = spiralOrder(matrix);
        for (int x : result) System.out.print(x + " ");
    }
}`,
      python: `def spiral_order(matrix):
    if not matrix:
        return []
    
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    
    while top <= bottom and left <= right:
        for j in range(left, right + 1):
            result.append(matrix[top][j])
        top += 1
        
        for i in range(top, bottom + 1):
            result.append(matrix[i][right])
        right -= 1
        
        if top <= bottom:
            for j in range(right, left - 1, -1):
                result.append(matrix[bottom][j])
            bottom -= 1
        
        if left <= right:
            for i in range(bottom, top - 1, -1):
                result.append(matrix[i][left])
            left += 1
    
    return result

m, n = map(int, input().split())
matrix = [list(map(int, input().split())) for _ in range(m)]
result = spiral_order(matrix)
print(' '.join(map(str, result)))`
    },
    testCases: [
      { input: '3 3\\n1 2 3\\n4 5 6\\n7 8 9', expectedOutput: '1 2 3 6 9 8 7 4 5', description: '3×3矩阵' },
      { input: '2 3\\n1 2 3\\n4 5 6', expectedOutput: '1 2 3 6 5 4', description: '2×3矩阵' }
    ],
    hints: [
      '用四个边界变量：top, bottom, left, right',
      '每遍历完一条边，收缩对应边界',
      '注意检查边界条件，避免重复遍历'
    ],
    explanation: `【螺旋遍历核心思想】
用四个边界变量控制遍历范围：
1. 向右遍历top行，然后top++
2. 向下遍历right列，然后right--
3. 向左遍历bottom行（需检查top<=bottom），然后bottom--
4. 向上遍历left列（需检查left<=right），然后left++

【时间复杂度】O(m×n)
【空间复杂度】O(1)（不计输出）`,
    commonMistakes: [
      '边界收缩后忘记检查是否还需要继续',
      '向左和向上遍历时忘记检查边界条件',
      '循环终止条件错误导致死循环或遗漏元素'
    ]
  },
  {
    id: 'arr2d-multiply',
    category: '二维数组',
    title: '矩阵乘法',
    difficulty: 'medium',
    type: 'coding',
    isExamFocus: true,
    description: `【题目描述】
给定两个矩阵A(m×k)和B(k×n)，计算它们的乘积C=A×B。
矩阵乘法定义：C[i][j] = Σ(A[i][p] × B[p][j])，其中p从0到k-1。

【输入格式】
第一行：整数m, k, n
接下来m行，每行k个整数，表示矩阵A
接下来k行，每行n个整数，表示矩阵B

【输出格式】
输出m×n的结果矩阵C

【样例输入】
2 3 2
1 2 3
4 5 6
1 2
3 4
5 6

【样例输出】
22 28
49 64

【数据范围】
- 1 ≤ m, k, n ≤ 100`,
    templates: {
      c: `#include <stdio.h>

int main() {
    int m, k, n;
    scanf("%d%d%d", &m, &k, &n);
    int A[105][105], B[105][105], C[105][105] = {0};
    // TODO: 读入矩阵并计算乘积
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<vector<int>> multiply(vector<vector<int>>& A, vector<vector<int>>& B) {
    // TODO: 实现矩阵乘法
    return {};
}

int main() {
    int m, k, n;
    cin >> m >> k >> n;
    vector<vector<int>> A(m, vector<int>(k));
    vector<vector<int>> B(k, vector<int>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < k; j++)
            cin >> A[i][j];
    for (int i = 0; i < k; i++)
        for (int j = 0; j < n; j++)
            cin >> B[i][j];
    auto C = multiply(A, B);
    for (auto& row : C) {
        for (int x : row) cout << x << " ";
        cout << endl;
    }
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static int[][] multiply(int[][] A, int[][] B) {
        // TODO: 实现矩阵乘法
        return null;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt(), k = sc.nextInt(), n = sc.nextInt();
        int[][] A = new int[m][k], B = new int[k][n];
        for (int i = 0; i < m; i++)
            for (int j = 0; j < k; j++)
                A[i][j] = sc.nextInt();
        for (int i = 0; i < k; i++)
            for (int j = 0; j < n; j++)
                B[i][j] = sc.nextInt();
        int[][] C = multiply(A, B);
        for (int[] row : C) {
            for (int x : row) System.out.print(x + " ");
            System.out.println();
        }
    }
}`,
      python: `def multiply(A, B):
    # TODO: 实现矩阵乘法
    pass

m, k, n = map(int, input().split())
A = [list(map(int, input().split())) for _ in range(m)]
B = [list(map(int, input().split())) for _ in range(k)]
C = multiply(A, B)
for row in C:
    print(' '.join(map(str, row)))`
    },
    solutions: {
      c: `#include <stdio.h>

int main() {
    int m, k, n;
    scanf("%d%d%d", &m, &k, &n);
    int A[105][105], B[105][105], C[105][105] = {0};
    
    for (int i = 0; i < m; i++)
        for (int j = 0; j < k; j++)
            scanf("%d", &A[i][j]);
    for (int i = 0; i < k; i++)
        for (int j = 0; j < n; j++)
            scanf("%d", &B[i][j]);
    
    // 矩阵乘法：C[i][j] = Σ A[i][p] * B[p][j]
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            for (int p = 0; p < k; p++)
                C[i][j] += A[i][p] * B[p][j];
    
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++)
            printf("%d ", C[i][j]);
        printf("\\n");
    }
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<vector<int>> multiply(vector<vector<int>>& A, vector<vector<int>>& B) {
    int m = A.size(), k = A[0].size(), n = B[0].size();
    vector<vector<int>> C(m, vector<int>(n, 0));
    
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            for (int p = 0; p < k; p++)
                C[i][j] += A[i][p] * B[p][j];
    
    return C;
}

int main() {
    int m, k, n;
    cin >> m >> k >> n;
    vector<vector<int>> A(m, vector<int>(k));
    vector<vector<int>> B(k, vector<int>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < k; j++)
            cin >> A[i][j];
    for (int i = 0; i < k; i++)
        for (int j = 0; j < n; j++)
            cin >> B[i][j];
    auto C = multiply(A, B);
    for (auto& row : C) {
        for (int x : row) cout << x << " ";
        cout << endl;
    }
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static int[][] multiply(int[][] A, int[][] B) {
        int m = A.length, k = A[0].length, n = B[0].length;
        int[][] C = new int[m][n];
        
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                for (int p = 0; p < k; p++)
                    C[i][j] += A[i][p] * B[p][j];
        
        return C;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt(), k = sc.nextInt(), n = sc.nextInt();
        int[][] A = new int[m][k], B = new int[k][n];
        for (int i = 0; i < m; i++)
            for (int j = 0; j < k; j++)
                A[i][j] = sc.nextInt();
        for (int i = 0; i < k; i++)
            for (int j = 0; j < n; j++)
                B[i][j] = sc.nextInt();
        int[][] C = multiply(A, B);
        for (int[] row : C) {
            for (int x : row) System.out.print(x + " ");
            System.out.println();
        }
    }
}`,
      python: `def multiply(A, B):
    m, k, n = len(A), len(A[0]), len(B[0])
    C = [[0] * n for _ in range(m)]
    
    for i in range(m):
        for j in range(n):
            for p in range(k):
                C[i][j] += A[i][p] * B[p][j]
    
    return C

m, k, n = map(int, input().split())
A = [list(map(int, input().split())) for _ in range(m)]
B = [list(map(int, input().split())) for _ in range(k)]
C = multiply(A, B)
for row in C:
    print(' '.join(map(str, row)))`
    },
    testCases: [
      { input: '2 3 2\\n1 2 3\\n4 5 6\\n1 2\\n3 4\\n5 6', expectedOutput: '22 28\\n49 64', description: '2×3 × 3×2' },
      { input: '1 2 1\\n1 2\\n3\\n4', expectedOutput: '11', description: '行向量×列向量' }
    ],
    hints: [
      '结果矩阵大小为m×n',
      '三重循环：i遍历行，j遍历列，p累加乘积',
      'C[i][j] = Σ A[i][p] × B[p][j]'
    ],
    explanation: `【矩阵乘法核心公式】
C[i][j] = Σ(p=0 to k-1) A[i][p] × B[p][j]

【矩阵乘法条件】
A的列数 = B的行数（即k）
结果矩阵大小：m×n

【时间复杂度】O(m×k×n)
【空间复杂度】O(m×n)`,
    commonMistakes: [
      '结果矩阵大小设置错误',
      '三重循环的顺序或范围错误',
      '忘记初始化结果矩阵为0',
      '下标p的范围应该是A的列数（或B的行数）'
    ]
  }
];


// ==================== 递归题目（考试重点标记版本） ====================
export const recursionExamExercises: Exercise[] = [
  {
    id: 'rec-factorial-exam',
    category: '递归',
    title: '递归求阶乘（考试重点）',
    difficulty: 'easy',
    type: 'coding',
    isExamFocus: true,
    description: `【题目描述】
用递归方法计算n的阶乘。

【输入格式】
一个整数n（0≤n≤12）

【输出格式】
输出n!

【样例输入】
5

【样例输出】
120

【递归思想】
- 基准情况：n≤1时返回1
- 递归情况：n! = n × (n-1)!`,
    templates: {
      cpp: `#include <iostream>
using namespace std;

long long factorial(int n) {
    // TODO: 递归实现
    return 0;
}

int main() {
    int n;
    cin >> n;
    cout << factorial(n) << endl;
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    static long factorial(int n) {
        // TODO: 递归实现
        return 0;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(factorial(sc.nextInt()));
    }
}`,
      python: `def factorial(n):
    # TODO: 递归实现
    pass

n = int(input())
print(factorial(n))`
    },
    solutions: {
      cpp: `#include <iostream>
using namespace std;

long long factorial(int n) {
    if (n <= 1) return 1;  // 基准情况
    return n * factorial(n - 1);  // 递归情况
}

int main() {
    int n;
    cin >> n;
    cout << factorial(n) << endl;
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    static long factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(factorial(sc.nextInt()));
    }
}`,
      python: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

n = int(input())
print(factorial(n))`
    },
    testCases: [
      { input: '5', expectedOutput: '120', description: '5!' },
      { input: '0', expectedOutput: '1', description: '0!' },
      { input: '10', expectedOutput: '3628800', description: '10!' }
    ],
    hints: ['基准情况：n<=1返回1', '递归公式：f(n)=n*f(n-1)', '注意0!=1'],
    explanation: `【递归三要素】
1. 基准情况（终止条件）：n≤1时返回1
2. 递归情况：n! = n × (n-1)!
3. 问题规模缩小：n → n-1

【时间复杂度】O(n)
【空间复杂度】O(n)（递归栈）`,
    commonMistakes: ['忘记基准情况导致无限递归', '基准情况返回值错误', '递归调用参数未缩小']
  },
  {
    id: 'rec-fib-exam',
    category: '递归',
    title: '递归斐波那契（考试重点）',
    difficulty: 'easy',
    type: 'coding',
    isExamFocus: true,
    description: `【题目描述】
用递归方法计算斐波那契数列第n项。
F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)

【输入格式】
一个整数n（0≤n≤40）

【输出格式】
输出F(n)

【优化提示】
朴素递归时间复杂度O(2^n)，可用记忆化优化到O(n)`,
    templates: {
      cpp: `#include <iostream>
using namespace std;

long long memo[50] = {0};

long long fib(int n) {
    // TODO: 记忆化递归实现
    return 0;
}

int main() {
    int n;
    cin >> n;
    cout << fib(n) << endl;
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    static long[] memo = new long[50];
    static long fib(int n) {
        // TODO: 记忆化递归实现
        return 0;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(fib(sc.nextInt()));
    }
}`,
      python: `from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    # TODO: 递归实现
    pass

n = int(input())
print(fib(n))`
    },
    solutions: {
      cpp: `#include <iostream>
using namespace std;

long long memo[50] = {0};

long long fib(int n) {
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];  // 已计算过
    return memo[n] = fib(n-1) + fib(n-2);  // 记忆化
}

int main() {
    int n;
    cin >> n;
    cout << fib(n) << endl;
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    static long[] memo = new long[50];
    static long fib(int n) {
        if (n <= 1) return n;
        if (memo[n] != 0) return memo[n];
        return memo[n] = fib(n-1) + fib(n-2);
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(fib(sc.nextInt()));
    }
}`,
      python: `from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)

n = int(input())
print(fib(n))`
    },
    testCases: [
      { input: '10', expectedOutput: '55', description: 'F(10)' },
      { input: '0', expectedOutput: '0', description: 'F(0)' },
      { input: '1', expectedOutput: '1', description: 'F(1)' }
    ],
    hints: ['基准：F(0)=0, F(1)=1', '递归：F(n)=F(n-1)+F(n-2)', '用数组记忆化避免重复计算'],
    explanation: `【记忆化递归优化】
朴素递归会重复计算大量子问题：
- F(5) 需要 F(4) 和 F(3)
- F(4) 需要 F(3) 和 F(2)
- F(3) 被计算了两次！

记忆化：用数组存储已计算的结果
- 时间复杂度：O(2^n) → O(n)
- 空间复杂度：O(n)`,
    commonMistakes: ['朴素递归超时', '记忆化数组大小不够', 'F(0)返回1而不是0']
  },
  {
    id: 'rec-hanoi-exam',
    category: '递归',
    title: '汉诺塔（考试重点）',
    difficulty: 'medium',
    type: 'coding',
    isExamFocus: true,
    description: `【题目描述】
汉诺塔问题：将n个盘子从A柱移到C柱，借助B柱。
规则：每次只能移动一个盘子，大盘不能放在小盘上面。

【输入格式】
一个整数n（1≤n≤10）

【输出格式】
输出移动步骤，每行格式：X->Y

【样例输入】
2

【样例输出】
A->B
A->C
B->C`,
    templates: {
      cpp: `#include <iostream>
using namespace std;

void hanoi(int n, char from, char aux, char to) {
    // TODO: 递归实现汉诺塔
}

int main() {
    int n;
    cin >> n;
    hanoi(n, 'A', 'B', 'C');
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    static void hanoi(int n, char from, char aux, char to) {
        // TODO: 递归实现汉诺塔
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        hanoi(sc.nextInt(), 'A', 'B', 'C');
    }
}`,
      python: `def hanoi(n, from_rod, aux_rod, to_rod):
    # TODO: 递归实现汉诺塔
    pass

n = int(input())
hanoi(n, 'A', 'B', 'C')`
    },
    solutions: {
      cpp: `#include <iostream>
using namespace std;

void hanoi(int n, char from, char aux, char to) {
    if (n == 1) {
        cout << from << "->" << to << endl;
        return;
    }
    hanoi(n-1, from, to, aux);  // 将n-1个盘子从from移到aux
    cout << from << "->" << to << endl;  // 将最大盘子从from移到to
    hanoi(n-1, aux, from, to);  // 将n-1个盘子从aux移到to
}

int main() {
    int n;
    cin >> n;
    hanoi(n, 'A', 'B', 'C');
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    static void hanoi(int n, char from, char aux, char to) {
        if (n == 1) {
            System.out.println(from + "->" + to);
            return;
        }
        hanoi(n-1, from, to, aux);
        System.out.println(from + "->" + to);
        hanoi(n-1, aux, from, to);
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        hanoi(sc.nextInt(), 'A', 'B', 'C');
    }
}`,
      python: `def hanoi(n, from_rod, aux_rod, to_rod):
    if n == 1:
        print(f"{from_rod}->{to_rod}")
        return
    hanoi(n-1, from_rod, to_rod, aux_rod)
    print(f"{from_rod}->{to_rod}")
    hanoi(n-1, aux_rod, from_rod, to_rod)

n = int(input())
hanoi(n, 'A', 'B', 'C')`
    },
    testCases: [
      { input: '2', expectedOutput: 'A->B\\nA->C\\nB->C', description: '2个盘子' },
      { input: '3', expectedOutput: 'A->C\\nA->B\\nC->B\\nA->C\\nB->A\\nB->C\\nA->C', description: '3个盘子' }
    ],
    hints: ['分治思想：先移n-1个到辅助柱', '再移最大的到目标柱', '最后移n-1个到目标柱'],
    explanation: `【汉诺塔递归思想】
将问题分解为三步：
1. 将上面n-1个盘子从A移到B（借助C）
2. 将最大的盘子从A移到C
3. 将n-1个盘子从B移到C（借助A）

【移动次数】T(n) = 2^n - 1
【时间复杂度】O(2^n)`,
    commonMistakes: ['递归调用时柱子参数顺序错误', '基准情况n=1时忘记输出', '辅助柱和目标柱混淆']
  },
  {
    id: 'rec-permutation-exam',
    category: '递归',
    title: '全排列（考试重点）',
    difficulty: 'medium',
    type: 'coding',
    isExamFocus: true,
    description: `【题目描述】
给定n个不重复的数字，输出所有全排列（按字典序）。

【输入格式】
第一行：整数n（1≤n≤8）
第二行：n个不重复的整数

【输出格式】
每行一个排列，数字用空格分隔

【样例输入】
3
1 2 3

【样例输出】
1 2 3
1 3 2
2 1 3
2 3 1
3 1 2
3 2 1`,
    templates: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int n;
vector<int> nums, path;
vector<bool> used;

void dfs(int depth) {
    // TODO: 回溯法生成全排列
}

int main() {
    cin >> n;
    nums.resize(n);
    used.resize(n, false);
    for (int i = 0; i < n; i++) cin >> nums[i];
    sort(nums.begin(), nums.end());
    dfs(0);
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    static int n;
    static int[] nums;
    static List<Integer> path = new ArrayList<>();
    static boolean[] used;
    
    static void dfs(int depth) {
        // TODO: 回溯法生成全排列
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        nums = new int[n];
        used = new boolean[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        Arrays.sort(nums);
        dfs(0);
    }
}`,
      python: `def dfs(depth, path, used, nums, n):
    # TODO: 回溯法生成全排列
    pass

n = int(input())
nums = list(map(int, input().split()))
nums.sort()
dfs(0, [], [False] * n, nums, n)`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int n;
vector<int> nums, path;
vector<bool> used;

void dfs(int depth) {
    if (depth == n) {
        for (int i = 0; i < n; i++)
            cout << path[i] << (i < n-1 ? " " : "\\n");
        return;
    }
    for (int i = 0; i < n; i++) {
        if (!used[i]) {
            used[i] = true;
            path.push_back(nums[i]);
            dfs(depth + 1);
            path.pop_back();  // 回溯
            used[i] = false;
        }
    }
}

int main() {
    cin >> n;
    nums.resize(n);
    used.resize(n, false);
    for (int i = 0; i < n; i++) cin >> nums[i];
    sort(nums.begin(), nums.end());
    dfs(0);
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    static int n;
    static int[] nums;
    static List<Integer> path = new ArrayList<>();
    static boolean[] used;
    
    static void dfs(int depth) {
        if (depth == n) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < n; i++) {
                sb.append(path.get(i));
                if (i < n - 1) sb.append(" ");
            }
            System.out.println(sb);
            return;
        }
        for (int i = 0; i < n; i++) {
            if (!used[i]) {
                used[i] = true;
                path.add(nums[i]);
                dfs(depth + 1);
                path.remove(path.size() - 1);
                used[i] = false;
            }
        }
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        nums = new int[n];
        used = new boolean[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        Arrays.sort(nums);
        dfs(0);
    }
}`,
      python: `def dfs(depth, path, used, nums, n):
    if depth == n:
        print(' '.join(map(str, path)))
        return
    for i in range(n):
        if not used[i]:
            used[i] = True
            path.append(nums[i])
            dfs(depth + 1, path, used, nums, n)
            path.pop()  # 回溯
            used[i] = False

n = int(input())
nums = list(map(int, input().split()))
nums.sort()
dfs(0, [], [False] * n, nums, n)`
    },
    testCases: [
      { input: '3\\n1 2 3', expectedOutput: '1 2 3\\n1 3 2\\n2 1 3\\n2 3 1\\n3 1 2\\n3 2 1', description: '3个数的全排列' }
    ],
    hints: ['用used数组标记已使用的数', '回溯时恢复used状态', '先排序保证字典序'],
    explanation: `【回溯法生成全排列】
1. 用used数组标记哪些数已被选择
2. 每次从未选择的数中选一个加入path
3. 递归选下一个位置
4. 回溯：撤销选择，恢复used状态

【排列数量】n!
【时间复杂度】O(n! × n)`,
    commonMistakes: ['忘记回溯（恢复used状态）', '输出格式错误', '未排序导致不是字典序']
  }
];


// ==================== 汇总导出 ====================
// 数字逻辑电路考试题目汇总
export const digitalLogicExamExercises: Exercise[] = [
  ...highPrecisionExercises,
  ...twoPointerExamExercises,
  ...typeCastExercises,
  ...array2DExercises,
  ...recursionExamExercises
];

// 按分类筛选题目
export const filterByCategory = (exercises: Exercise[], category: string): Exercise[] => {
  return exercises.filter(e => e.category === category);
};

// 关键词搜索题目（搜索title、description、category）
export const searchExercises = (exercises: Exercise[], keyword: string): Exercise[] => {
  const lowerKeyword = keyword.toLowerCase();
  return exercises.filter(e => 
    e.title.toLowerCase().includes(lowerKeyword) ||
    e.description.toLowerCase().includes(lowerKeyword) ||
    e.category.toLowerCase().includes(lowerKeyword)
  );
};

// 获取考试重点题目
export const getDigitalLogicExamFocus = (): Exercise[] => {
  return digitalLogicExamExercises.filter(e => e.isExamFocus === true);
};
