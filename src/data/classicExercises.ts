// 经典编程题库 - 覆盖数据结构与算法核心知识点
// 题目设计遵循：详细描述、输入输出规范、样例、解析

import type { Exercise } from './exercises';

// ==================== 递归与回溯 ====================
export const recursionExercises: Exercise[] = [
  {
    id: 'rec-integer-partition',
    category: '递归',
    title: '正整数分解',
    difficulty: 'medium',
    type: 'coding',
    description: `【题目描述】
正整数n，按第一项递减的顺序依次输出其和等于n的所有不增的正整数和式。

【输入格式】
一个正整数n（1<n≤15）

【输出格式】
每行输出一个和式，格式如：n=a+b+c...，数字和运算符间无空格

【样例输入】
4

【样例输出】
4=3+1
4=2+2
4=2+1+1
4=1+1+1+1`,
    templates: {
      c: `#include <stdio.h>

int path[20], pathLen = 0;
int n;

void dfs(int remain, int maxVal) {
    // remain: 剩余需要分解的数
    // maxVal: 当前能选的最大数
    // TODO: 请实现递归分解
}

int main() {
    scanf("%d", &n);
    dfs(n, n - 1);
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> path;  // 存储当前分解路径
int n;

void dfs(int remain, int maxVal) {
    // remain: 剩余需要分解的数
    // maxVal: 当前能选的最大数（保证不增）
    // TODO: 请实现递归分解
}

int main() {
    cin >> n;
    dfs(n, n - 1);  // 从n-1开始，因为至少要分成两部分
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    static List<Integer> path = new ArrayList<>();
    static int n;
    
    static void dfs(int remain, int maxVal) {
        // TODO: 请实现递归分解
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        dfs(n, n - 1);
    }
}`,
      python: `def dfs(remain, max_val, path, n):
    """
    remain: 剩余需要分解的数
    max_val: 当前能选的最大数
    path: 当前分解路径
    """
    # TODO: 请实现递归分解
    pass

n = int(input())
dfs(n, n - 1, [], n)`
    },
    solutions: {
      c: `#include <stdio.h>

int path[20], pathLen = 0;
int n;

void dfs(int remain, int maxVal) {
    if (remain == 0) {
        printf("%d=", n);
        for (int i = 0; i < pathLen; i++) {
            if (i > 0) printf("+");
            printf("%d", path[i]);
        }
        printf("\\n");
        return;
    }
    int start = remain < maxVal ? remain : maxVal;
    for (int i = start; i >= 1; i--) {
        path[pathLen++] = i;
        dfs(remain - i, i);
        pathLen--;
    }
}

int main() {
    scanf("%d", &n);
    dfs(n, n - 1);
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> path;
int n;

void dfs(int remain, int maxVal) {
    if (remain == 0) {
        cout << n << "=";
        for (int i = 0; i < path.size(); i++) {
            if (i > 0) cout << "+";
            cout << path[i];
        }
        cout << endl;
        return;
    }
    
    for (int i = min(remain, maxVal); i >= 1; i--) {
        path.push_back(i);
        dfs(remain - i, i);  // 下一个数最大为i（保证不增）
        path.pop_back();     // 回溯
    }
}

int main() {
    cin >> n;
    dfs(n, n - 1);
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    static List<Integer> path = new ArrayList<>();
    static int n;
    
    static void dfs(int remain, int maxVal) {
        if (remain == 0) {
            System.out.print(n + "=");
            for (int i = 0; i < path.size(); i++) {
                if (i > 0) System.out.print("+");
                System.out.print(path.get(i));
            }
            System.out.println();
            return;
        }
        
        for (int i = Math.min(remain, maxVal); i >= 1; i--) {
            path.add(i);
            dfs(remain - i, i);
            path.remove(path.size() - 1);
        }
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        dfs(n, n - 1);
    }
}`,
      python: `def dfs(remain, max_val, path, n):
    if remain == 0:
        print(f"{n}=" + "+".join(map(str, path)))
        return
    
    for i in range(min(remain, max_val), 0, -1):
        path.append(i)
        dfs(remain - i, i, path, n)
        path.pop()  # 回溯

n = int(input())
dfs(n, n - 1, [], n)`
    },
    testCases: [
      { input: '4', expectedOutput: '4=3+1\\n4=2+2\\n4=2+1+1\\n4=1+1+1+1', description: '分解4' },
      { input: '5', expectedOutput: '5=4+1\\n5=3+2\\n5=3+1+1\\n...', description: '分解5' }
    ],
    hints: [
      '使用DFS递归搜索所有可能的分解',
      '每次选择的数不能超过上一个选择的数（保证不增）',
      '使用回溯法：选择→递归→撤销选择'
    ],
    explanation: `【算法思想】回溯法 + 剪枝
    
【核心要点】
1. 递归参数：剩余值remain，当前最大可选值maxVal
2. 递归终止：remain=0时，输出当前路径
3. 剪枝条件：下一个数 ≤ 上一个数（保证不增序列）
4. 回溯：每次递归返回后，撤销当前选择

【时间复杂度】指数级，取决于n的分解方案数
【空间复杂度】O(n)，递归栈深度`
  },
  {
    id: 'rec-prime-check',
    category: '递归',
    title: '素数判断',
    difficulty: 'easy',
    type: 'fillblank',
    description: `【题目描述】
在自然数中，求100以内的所有素数。

【要求】
1. 实现prime函数判断一个数是否为素数
2. 在main函数前声明函数原型
3. 正确包含所需头文件`,
    codeTemplate: {
      cpp: `#include <stdio.h>
___BLANK1___  // 包含bool类型的头文件

___BLANK2___  // 函数原型声明

int main() {
    for (int i = 2; i <= 100; i++)
        if (prime(i))
            printf("%d ", i);
    return 0;
}

bool prime(int n) {
    if (n < 2) return false;
    for (int i = 2; ___BLANK3___; i++)  // 循环条件
        if (___BLANK4___)  // 判断条件
            return false;
    return true;
}`,
      java: `public class Prime {
    public static void main(String[] args) {
        for (int i = 2; i <= 100; i++)
            if (prime(i))
                System.out.print(i + " ");
    }
    
    static boolean prime(int n) {
        if (n < 2) return false;
        for (int i = 2; ___BLANK3___; i++)
            if (___BLANK4___)
                return false;
        return true;
    }
}`,
      python: `def prime(n):
    if n < 2:
        return False
    for i in range(2, ___BLANK3___):
        if ___BLANK4___:
            return False
    return True

for i in range(2, 101):
    if prime(i):
        print(i, end=' ')`
    },
    blanks: [
      { id: 'BLANK1', answer: '#include <stdbool.h>', hint: 'C语言中bool类型需要此头文件' },
      { id: 'BLANK2', answer: 'bool prime(int n);', hint: '函数原型：返回类型 函数名(参数);' },
      { id: 'BLANK3', answer: 'i * i <= n', hint: '只需检查到√n即可' },
      { id: 'BLANK4', answer: 'n % i == 0', hint: '能整除说明不是素数' }
    ],
    explanation: `【知识点解析】

1. 【头文件】C语言中bool不是内置类型，需要#include <stdbool.h>
   
2. 【函数原型】函数定义在后、调用在前时，必须先声明原型
   
3. 【优化技巧】判断素数只需检查到√n
   - 因为如果n=a×b，则a和b中必有一个≤√n
   - 循环条件：i*i<=n 比 i<=sqrt(n) 更高效（避免浮点运算）

4. 【判断逻辑】
   - n < 2：不是素数
   - 存在2到√n之间能整除n的数：不是素数
   - 否则：是素数

【时间复杂度】O(√n)
【常见错误】循环到n-1（效率低）、忘记处理n<2的情况`
  },
  {
    id: 'rec-n-queens',
    category: '递归',
    title: 'N皇后问题',
    difficulty: 'hard',
    type: 'coding',
    description: `【题目描述】
在N×N的棋盘上放置N个皇后，使得它们互不攻击。
皇后可以攻击同一行、同一列、同一对角线上的棋子。

【输入格式】
一个正整数N（1≤N≤10）

【输出格式】
输出所有解的数量

【样例】
输入：4
输出：2

【提示】
4皇后的两个解：
.Q..    ..Q.
...Q    Q...
Q...    ...Q
..Q.    .Q..`,
    templates: {
      c: `#include <stdio.h>
#include <stdlib.h>

int n, ans = 0;
int col[15];

int check(int row, int c) {
    // 检查第row行第c列能否放皇后
    // TODO: 实现检查逻辑
}

void dfs(int row) {
    // TODO: 实现DFS搜索
}

int main() {
    scanf("%d", &n);
    dfs(0);
    printf("%d\\n", ans);
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int n, ans = 0;
int col[15];  // col[i]=j表示第i行皇后放在第j列

bool check(int row, int c) {
    // 检查第row行第c列能否放皇后
    // TODO: 实现检查逻辑
}

void dfs(int row) {
    // row: 当前处理第几行
    // TODO: 实现DFS搜索
}

int main() {
    cin >> n;
    dfs(0);
    cout << ans << endl;
    return 0;
}`,
      java: `import java.util.*;

public class NQueens {
    static int n, ans = 0;
    static int[] col = new int[15];
    
    static boolean check(int row, int c) {
        // TODO: 实现检查逻辑
        return true;
    }
    
    static void dfs(int row) {
        // TODO: 实现DFS搜索
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        dfs(0);
        System.out.println(ans);
    }
}`,
      python: `def check(row, c, col):
    # 检查第row行第c列能否放皇后
    # TODO: 实现检查逻辑
    pass

def dfs(row, n, col):
    # TODO: 实现DFS搜索
    pass

n = int(input())
col = [0] * n
ans = dfs(0, n, col)
print(ans)`
    },
    solutions: {
      c: `#include <stdio.h>
#include <stdlib.h>

int n, ans = 0;
int col[15];

int check(int row, int c) {
    for (int i = 0; i < row; i++) {
        if (col[i] == c || abs(row - i) == abs(c - col[i]))
            return 0;
    }
    return 1;
}

void dfs(int row) {
    if (row == n) {
        ans++;
        return;
    }
    for (int c = 0; c < n; c++) {
        if (check(row, c)) {
            col[row] = c;
            dfs(row + 1);
        }
    }
}

int main() {
    scanf("%d", &n);
    dfs(0);
    printf("%d\\n", ans);
    return 0;
}`,
      cpp: `#include <iostream>
#include <cmath>
using namespace std;

int n, ans = 0;
int col[15];

bool check(int row, int c) {
    for (int i = 0; i < row; i++) {
        // 检查列冲突和对角线冲突
        if (col[i] == c || abs(row - i) == abs(c - col[i]))
            return false;
    }
    return true;
}

void dfs(int row) {
    if (row == n) {
        ans++;  // 找到一个解
        return;
    }
    for (int c = 0; c < n; c++) {
        if (check(row, c)) {
            col[row] = c;
            dfs(row + 1);
            // 回溯：这里不需要显式恢复，因为col[row]会被覆盖
        }
    }
}

int main() {
    cin >> n;
    dfs(0);
    cout << ans << endl;
    return 0;
}`,
      java: `import java.util.*;

public class NQueens {
    static int n, ans = 0;
    static int[] col = new int[15];
    
    static boolean check(int row, int c) {
        for (int i = 0; i < row; i++) {
            if (col[i] == c || Math.abs(row - i) == Math.abs(c - col[i]))
                return false;
        }
        return true;
    }
    
    static void dfs(int row) {
        if (row == n) {
            ans++;
            return;
        }
        for (int c = 0; c < n; c++) {
            if (check(row, c)) {
                col[row] = c;
                dfs(row + 1);
            }
        }
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        dfs(0);
        System.out.println(ans);
    }
}`,
      python: `def check(row, c, col):
    for i in range(row):
        if col[i] == c or abs(row - i) == abs(c - col[i]):
            return False
    return True

def dfs(row, n, col):
    if row == n:
        return 1
    count = 0
    for c in range(n):
        if check(row, c, col):
            col[row] = c
            count += dfs(row + 1, n, col)
    return count

n = int(input())
col = [0] * n
print(dfs(0, n, col))`
    },
    testCases: [
      { input: '4', expectedOutput: '2', description: '4皇后有2个解' },
      { input: '8', expectedOutput: '92', description: '8皇后有92个解' }
    ],
    hints: [
      '逐行放置皇后，每行只能放一个',
      '检查列冲突：col[i] == c',
      '检查对角线：|row-i| == |c-col[i]|',
      '使用回溯法遍历所有可能'
    ],
    explanation: `【经典回溯问题】

【问题分析】
- 每行恰好放一个皇后
- 需要检查：列冲突、主对角线冲突、副对角线冲突

【对角线判断技巧】
- 主对角线：row-col 相同
- 副对角线：row+col 相同
- 统一判断：|row1-row2| == |col1-col2|

【优化方向】
1. 位运算优化：用三个整数表示列、主对角线、副对角线的占用情况
2. 时间复杂度：O(N!)

【N皇后解的数量】
N=1: 1, N=4: 2, N=5: 10, N=6: 4, N=7: 40, N=8: 92`
  },
  {
    id: 'rec-permutation',
    category: '递归',
    title: '全排列',
    difficulty: 'medium',
    type: 'coding',
    description: `【题目描述】
给定一个不含重复数字的数组，返回其所有可能的全排列。

【输入格式】
第一行：数组长度n（1≤n≤8）
第二行：n个不重复的整数

【输出格式】
每行输出一个排列，数字间用空格分隔
按字典序输出

【样例】
输入：
3
1 2 3
输出：
1 2 3
1 3 2
2 1 3
2 3 1
3 1 2
3 2 1`,
    templates: {
      c: `#include <stdio.h>
#include <stdlib.h>

int a[10], n;
int used[10];
int path[10];

void dfs(int depth) {
    // depth: 已经选了几个数
    // TODO: 实现全排列
}

int cmp(const void* a, const void* b) {
    return *(int*)a - *(int*)b;
}

int main() {
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    qsort(a, n, sizeof(int), cmp);
    dfs(0);
    return 0;
}`,
      cpp: `#include <iostream>
#include <algorithm>
using namespace std;

int a[10], n;
bool used[10];
int path[10];

void dfs(int depth) {
    // depth: 已经选了几个数
    // TODO: 实现全排列
}

int main() {
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];
    sort(a, a + n);  // 保证字典序
    dfs(0);
    return 0;
}`,
      java: `import java.util.*;

public class Permutation {
    static int[] a, path;
    static boolean[] used;
    static int n;
    
    static void dfs(int depth) {
        // TODO: 实现全排列
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        a = new int[n];
        path = new int[n];
        used = new boolean[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        Arrays.sort(a);
        dfs(0);
    }
}`,
      python: `def dfs(depth, path, used, a, n):
    # TODO: 实现全排列
    pass

n = int(input())
a = list(map(int, input().split()))
a.sort()
dfs(0, [], [False] * n, a, n)`
    },
    solutions: {
      c: `#include <stdio.h>
#include <stdlib.h>

int a[10], n;
int used[10];
int path[10];

void dfs(int depth) {
    if (depth == n) {
        for (int i = 0; i < n; i++)
            printf("%d%c", path[i], i < n-1 ? ' ' : '\\n');
        return;
    }
    for (int i = 0; i < n; i++) {
        if (!used[i]) {
            used[i] = 1;
            path[depth] = a[i];
            dfs(depth + 1);
            used[i] = 0;
        }
    }
}

int cmp(const void* a, const void* b) {
    return *(int*)a - *(int*)b;
}

int main() {
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    qsort(a, n, sizeof(int), cmp);
    dfs(0);
    return 0;
}`,
      cpp: `#include <iostream>
#include <algorithm>
using namespace std;

int a[10], n;
bool used[10];
int path[10];

void dfs(int depth) {
    if (depth == n) {
        for (int i = 0; i < n; i++)
            cout << path[i] << (i < n-1 ? " " : "\\n");
        return;
    }
    for (int i = 0; i < n; i++) {
        if (!used[i]) {
            used[i] = true;
            path[depth] = a[i];
            dfs(depth + 1);
            used[i] = false;  // 回溯
        }
    }
}

int main() {
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];
    sort(a, a + n);
    dfs(0);
    return 0;
}`,
      java: `import java.util.*;

public class Permutation {
    static int[] a, path;
    static boolean[] used;
    static int n;
    
    static void dfs(int depth) {
        if (depth == n) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < n; i++) {
                sb.append(path[i]);
                if (i < n - 1) sb.append(" ");
            }
            System.out.println(sb);
            return;
        }
        for (int i = 0; i < n; i++) {
            if (!used[i]) {
                used[i] = true;
                path[depth] = a[i];
                dfs(depth + 1);
                used[i] = false;
            }
        }
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        a = new int[n];
        path = new int[n];
        used = new boolean[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        Arrays.sort(a);
        dfs(0);
    }
}`,
      python: `def dfs(depth, path, used, a, n):
    if depth == n:
        print(' '.join(map(str, path)))
        return
    for i in range(n):
        if not used[i]:
            used[i] = True
            path.append(a[i])
            dfs(depth + 1, path, used, a, n)
            path.pop()
            used[i] = False

n = int(input())
a = list(map(int, input().split()))
a.sort()
dfs(0, [], [False] * n, a, n)`
    },
    testCases: [
      { input: '3\\n1 2 3', expectedOutput: '1 2 3\\n1 3 2\\n2 1 3\\n2 3 1\\n3 1 2\\n3 2 1', description: '1,2,3的全排列' }
    ],
    hints: [
      '使用used数组标记哪些数已被使用',
      '递归深度等于n时输出一个排列',
      '回溯时恢复used状态'
    ],
    explanation: `【全排列算法】

【递归思路】
- 每次从未使用的数中选一个
- 递归选下一个位置的数
- 选完n个数后输出

【关键点】
1. used数组：标记元素是否已使用
2. 回溯：递归返回后，恢复used状态
3. 字典序：先排序，按顺序选择

【时间复杂度】O(n! × n)
【排列数量】n! 个`
  },
  {
    id: 'rec-factorial', category: '递归', title: '递归求阶乘', difficulty: 'easy', type: 'coding',
    description: `用递归计算n!。\n\n输入：整数n(0≤n≤12)\n输出：n!`,
    templates: { c: `#include <stdio.h>\nlong long f(int n) { /* TODO */ }\nint main() { int n; scanf("%d",&n); printf("%lld\\n",f(n)); }`,
      cpp: `#include <iostream>\nusing namespace std;\nlong long f(int n) { /* TODO */ }\nint main() { int n; cin>>n; cout<<f(n)<<endl; }`,
      java: `import java.util.*;\npublic class Main { static long f(int n) { /* TODO */ return 0; } public static void main(String[] a) { Scanner sc=new Scanner(System.in); System.out.println(f(sc.nextInt())); }}`,
      python: `def f(n):\n    pass\nprint(f(int(input())))`
    },
    solutions: { c: `#include <stdio.h>\nlong long f(int n) { return n<=1?1:n*f(n-1); }\nint main() { int n; scanf("%d",&n); printf("%lld\\n",f(n)); return 0; }`,
      cpp: `#include <iostream>\nusing namespace std;\nlong long f(int n) { return n<=1?1:n*f(n-1); }\nint main() { int n; cin>>n; cout<<f(n)<<endl; }`,
      java: `import java.util.*;\npublic class Main { static long f(int n) { return n<=1?1:n*f(n-1); } public static void main(String[] a) { System.out.println(f(new Scanner(System.in).nextInt())); }}`,
      python: `def f(n): return 1 if n<=1 else n*f(n-1)\nprint(f(int(input())))`
    },
    testCases: [{ input: '5', expectedOutput: '120', description: '5!=120' }, { input: '0', expectedOutput: '1', description: '0!=1' }],
    hints: ['基准：n<=1返回1', '递归：n*f(n-1)'], explanation: '递归阶乘：f(n)=n*f(n-1)'
  },
  {
    id: 'rec-hanoi', category: '递归', title: '汉诺塔', difficulty: 'medium', type: 'coding',
    description: `汉诺塔：n个盘子从A移到C，借助B，大盘不能放小盘上。\n\n输入：n(1≤n≤10)\n输出：移动步骤`,
    templates: { c: `#include <stdio.h>\nvoid h(int n,char a,char b,char c) { /* TODO */ }\nint main() { int n; scanf("%d",&n); h(n,'A','B','C'); }`,
      cpp: `#include <iostream>\nusing namespace std;\nvoid h(int n,char a,char b,char c) { /* TODO */ }\nint main() { int n; cin>>n; h(n,'A','B','C'); }`,
      java: `import java.util.*;\npublic class Main { static void h(int n,char a,char b,char c) { /* TODO */ } public static void main(String[] x) { h(new Scanner(System.in).nextInt(),'A','B','C'); }}`,
      python: `def h(n,a,b,c):\n    pass\nh(int(input()),'A','B','C')`
    },
    solutions: { c: `#include <stdio.h>\nvoid h(int n,char a,char b,char c) { if(n==1){printf("%c->%c\\n",a,c);return;} h(n-1,a,c,b); printf("%c->%c\\n",a,c); h(n-1,b,a,c); }\nint main() { int n; scanf("%d",&n); h(n,'A','B','C'); return 0; }`,
      cpp: `#include <iostream>\nusing namespace std;\nvoid h(int n,char a,char b,char c) { if(n==1){cout<<a<<"->"<<c<<endl;return;} h(n-1,a,c,b); cout<<a<<"->"<<c<<endl; h(n-1,b,a,c); }\nint main() { int n; cin>>n; h(n,'A','B','C'); }`,
      java: `import java.util.*;\npublic class Main { static void h(int n,char a,char b,char c) { if(n==1){System.out.println(a+"->"+c);return;} h(n-1,a,c,b); System.out.println(a+"->"+c); h(n-1,b,a,c); } public static void main(String[] x) { h(new Scanner(System.in).nextInt(),'A','B','C'); }}`,
      python: `def h(n,a,b,c):\n    if n==1: print(f"{a}->{c}"); return\n    h(n-1,a,c,b); print(f"{a}->{c}"); h(n-1,b,a,c)\nh(int(input()),'A','B','C')`
    },
    testCases: [{ input: '2', expectedOutput: 'A->B\\nA->C\\nB->C', description: '2盘3步' }],
    hints: ['n-1从A到B', '最大从A到C', 'n-1从B到C'], explanation: '分治：移n-1到辅助柱，移最大到目标，再移n-1到目标。步数2^n-1'
  },
  {
    id: 'rec-fib', category: '递归', title: '递归斐波那契', difficulty: 'easy', type: 'coding',
    description: `递归求F(n)。F(0)=0,F(1)=1,F(n)=F(n-1)+F(n-2)\n\n输入：n(0≤n≤40)\n输出：F(n)`,
    templates: { c: `#include <stdio.h>\nlong long memo[50];\nlong long f(int n) { /* TODO */ }\nint main() { int n; scanf("%d",&n); printf("%lld\\n",f(n)); }`,
      cpp: `#include <iostream>\nusing namespace std;\nlong long memo[50];\nlong long f(int n) { /* TODO */ }\nint main() { int n; cin>>n; cout<<f(n)<<endl; }`,
      java: `import java.util.*;\npublic class Main { static long[] m=new long[50]; static long f(int n) { /* TODO */ return 0; } public static void main(String[] a) { System.out.println(f(new Scanner(System.in).nextInt())); }}`,
      python: `from functools import lru_cache\n@lru_cache\ndef f(n):\n    pass\nprint(f(int(input())))`
    },
    solutions: { c: `#include <stdio.h>\nlong long m[50];\nlong long f(int n) { if(n<=1)return n; if(m[n])return m[n]; return m[n]=f(n-1)+f(n-2); }\nint main() { int n; scanf("%d",&n); printf("%lld\\n",f(n)); return 0; }`,
      cpp: `#include <iostream>\nusing namespace std;\nlong long m[50];\nlong long f(int n) { if(n<=1)return n; if(m[n])return m[n]; return m[n]=f(n-1)+f(n-2); }\nint main() { int n; cin>>n; cout<<f(n)<<endl; }`,
      java: `import java.util.*;\npublic class Main { static long[] m=new long[50]; static long f(int n) { if(n<=1)return n; if(m[n]!=0)return m[n]; return m[n]=f(n-1)+f(n-2); } public static void main(String[] a) { System.out.println(f(new Scanner(System.in).nextInt())); }}`,
      python: `from functools import lru_cache\n@lru_cache\ndef f(n): return n if n<=1 else f(n-1)+f(n-2)\nprint(f(int(input())))`
    },
    testCases: [{ input: '10', expectedOutput: '55', description: 'F(10)=55' }, { input: '0', expectedOutput: '0', description: 'F(0)=0' }],
    hints: ['基准：n<=1返回n', '记忆化避免重复'], explanation: '记忆化递归O(n)，朴素递归O(2^n)'
  },
  {
    id: 'rec-reverse-str', category: '递归', title: '递归反转字符串', difficulty: 'easy', type: 'coding',
    description: `递归反转字符串\n\n输入：字符串\n输出：反转后`,
    templates: { cpp: `#include <iostream>\nusing namespace std;\nstring r(string s) { /* TODO */ }\nint main() { string s; cin>>s; cout<<r(s)<<endl; }`,
      java: `import java.util.*;\npublic class Main { static String r(String s) { /* TODO */ return ""; } public static void main(String[] a) { System.out.println(r(new Scanner(System.in).next())); }}`,
      python: `def r(s):\n    pass\nprint(r(input()))`
    },
    solutions: { cpp: `#include <iostream>\nusing namespace std;\nstring r(string s) { return s.size()<=1?s:r(s.substr(1))+s[0]; }\nint main() { string s; cin>>s; cout<<r(s)<<endl; }`,
      java: `import java.util.*;\npublic class Main { static String r(String s) { return s.length()<=1?s:r(s.substring(1))+s.charAt(0); } public static void main(String[] a) { System.out.println(r(new Scanner(System.in).next())); }}`,
      python: `def r(s): return s if len(s)<=1 else r(s[1:])+s[0]\nprint(r(input()))`
    },
    testCases: [{ input: 'hello', expectedOutput: 'olleh', description: '反转' }],
    hints: ['r(s)=r(s[1:])+s[0]'], explanation: '首字符移到末尾'
  },
  {
    id: 'rec-sum', category: '递归', title: '递归数组求和', difficulty: 'easy', type: 'coding',
    description: `递归求数组和\n\n输入：n个整数\n输出：和`,
    templates: { cpp: `#include <iostream>\nusing namespace std;\nint s(int a[],int n) { /* TODO */ }\nint main() { int n; cin>>n; int a[1005]; for(int i=0;i<n;i++)cin>>a[i]; cout<<s(a,n)<<endl; }`,
      java: `import java.util.*;\npublic class Main { static int s(int[] a,int n) { /* TODO */ return 0; } public static void main(String[] x) { Scanner sc=new Scanner(System.in); int n=sc.nextInt(); int[] a=new int[n]; for(int i=0;i<n;i++)a[i]=sc.nextInt(); System.out.println(s(a,n)); }}`,
      python: `def s(a,n):\n    pass\nn=int(input())\na=list(map(int,input().split()))\nprint(s(a,n))`
    },
    solutions: { cpp: `#include <iostream>\nusing namespace std;\nint s(int a[],int n) { return n==0?0:a[n-1]+s(a,n-1); }\nint main() { int n; cin>>n; int a[1005]; for(int i=0;i<n;i++)cin>>a[i]; cout<<s(a,n)<<endl; }`,
      java: `import java.util.*;\npublic class Main { static int s(int[] a,int n) { return n==0?0:a[n-1]+s(a,n-1); } public static void main(String[] x) { Scanner sc=new Scanner(System.in); int n=sc.nextInt(); int[] a=new int[n]; for(int i=0;i<n;i++)a[i]=sc.nextInt(); System.out.println(s(a,n)); }}`,
      python: `def s(a,n): return 0 if n==0 else a[n-1]+s(a,n-1)\nn=int(input())\na=list(map(int,input().split()))\nprint(s(a,n))`
    },
    testCases: [{ input: '5\\n1 2 3 4 5', expectedOutput: '15', description: '和15' }],
    hints: ['s(a,n)=a[n-1]+s(a,n-1)'], explanation: 'O(n)时间，O(n)栈'
  },
  {
    id: 'rec-power', category: '递归', title: '递归快速幂', difficulty: 'medium', type: 'coding',
    description: `递归快速幂a^n mod m\n\n输入：a n m\n输出：结果`,
    templates: { cpp: `#include <iostream>\nusing namespace std;\ntypedef long long ll;\nll p(ll a,ll n,ll m) { /* TODO */ }\nint main() { ll a,n,m; cin>>a>>n>>m; cout<<p(a%m,n,m)<<endl; }`,
      java: `import java.util.*;\npublic class Main { static long p(long a,long n,long m) { /* TODO */ return 0; } public static void main(String[] x) { Scanner sc=new Scanner(System.in); System.out.println(p(sc.nextLong()%sc.nextLong(),sc.nextLong(),sc.nextLong())); }}`,
      python: `def p(a,n,m):\n    pass\na,n,m=map(int,input().split())\nprint(p(a%m,n,m))`
    },
    solutions: { cpp: `#include <iostream>\nusing namespace std;\ntypedef long long ll;\nll p(ll a,ll n,ll m) { if(n==0)return 1; if(n%2==0){ll h=p(a,n/2,m);return h*h%m;} return a*p(a,n-1,m)%m; }\nint main() { ll a,n,m; cin>>a>>n>>m; cout<<p(a%m,n,m)<<endl; }`,
      java: `import java.util.*;\npublic class Main { static long p(long a,long n,long m) { if(n==0)return 1; if(n%2==0){long h=p(a,n/2,m);return h*h%m;} return a*p(a,n-1,m)%m; } public static void main(String[] x) { Scanner sc=new Scanner(System.in); long a=sc.nextLong(),n=sc.nextLong(),m=sc.nextLong(); System.out.println(p(a%m,n,m)); }}`,
      python: `def p(a,n,m):\n    if n==0: return 1\n    if n%2==0: h=p(a,n//2,m); return h*h%m\n    return a*p(a,n-1,m)%m\na,n,m=map(int,input().split())\nprint(p(a%m,n,m))`
    },
    testCases: [{ input: '2 10 1000', expectedOutput: '24', description: '2^10 mod 1000' }],
    hints: ['偶数：(a^(n/2))^2', '奇数：a*a^(n-1)'], explanation: 'O(log n)'
  },
  {
    id: 'rec-palindrome', category: '递归', title: '递归判断回文', difficulty: 'easy', type: 'coding',
    description: `递归判断回文串\n\n输入：字符串\n输出：true/false`,
    templates: { cpp: `#include <iostream>\nusing namespace std;\nbool p(string& s,int l,int r) { /* TODO */ }\nint main() { string s; cin>>s; cout<<(p(s,0,s.size()-1)?"true":"false")<<endl; }`,
      java: `import java.util.*;\npublic class Main { static boolean p(String s,int l,int r) { /* TODO */ return true; } public static void main(String[] a) { String s=new Scanner(System.in).next(); System.out.println(p(s,0,s.length()-1)?"true":"false"); }}`,
      python: `def p(s,l,r):\n    pass\ns=input()\nprint("true" if p(s,0,len(s)-1) else "false")`
    },
    solutions: { cpp: `#include <iostream>\nusing namespace std;\nbool p(string& s,int l,int r) { if(l>=r)return true; if(s[l]!=s[r])return false; return p(s,l+1,r-1); }\nint main() { string s; cin>>s; cout<<(p(s,0,s.size()-1)?"true":"false")<<endl; }`,
      java: `import java.util.*;\npublic class Main { static boolean p(String s,int l,int r) { if(l>=r)return true; if(s.charAt(l)!=s.charAt(r))return false; return p(s,l+1,r-1); } public static void main(String[] a) { String s=new Scanner(System.in).next(); System.out.println(p(s,0,s.length()-1)?"true":"false"); }}`,
      python: `def p(s,l,r):\n    if l>=r: return True\n    if s[l]!=s[r]: return False\n    return p(s,l+1,r-1)\ns=input()\nprint("true" if p(s,0,len(s)-1) else "false")`
    },
    testCases: [{ input: 'abcba', expectedOutput: 'true', description: '是回文' }, { input: 'abc', expectedOutput: 'false', description: '非回文' }],
    hints: ['比较首尾，递归中间'], explanation: '左右指针向中间收缩'
  },
  {
    id: 'rec-max', category: '递归', title: '递归求最大值', difficulty: 'easy', type: 'coding',
    description: `递归求数组最大值\n\n输入：n个整数\n输出：最大值`,
    templates: { cpp: `#include <iostream>\nusing namespace std;\nint mx(int a[],int n) { /* TODO */ }\nint main() { int n; cin>>n; int a[1005]; for(int i=0;i<n;i++)cin>>a[i]; cout<<mx(a,n)<<endl; }`,
      java: `import java.util.*;\npublic class Main { static int mx(int[] a,int n) { /* TODO */ return 0; } public static void main(String[] x) { Scanner sc=new Scanner(System.in); int n=sc.nextInt(); int[] a=new int[n]; for(int i=0;i<n;i++)a[i]=sc.nextInt(); System.out.println(mx(a,n)); }}`,
      python: `def mx(a,n):\n    pass\nn=int(input())\na=list(map(int,input().split()))\nprint(mx(a,n))`
    },
    solutions: { cpp: `#include <iostream>\nusing namespace std;\nint mx(int a[],int n) { if(n==1)return a[0]; return max(a[n-1],mx(a,n-1)); }\nint main() { int n; cin>>n; int a[1005]; for(int i=0;i<n;i++)cin>>a[i]; cout<<mx(a,n)<<endl; }`,
      java: `import java.util.*;\npublic class Main { static int mx(int[] a,int n) { if(n==1)return a[0]; return Math.max(a[n-1],mx(a,n-1)); } public static void main(String[] x) { Scanner sc=new Scanner(System.in); int n=sc.nextInt(); int[] a=new int[n]; for(int i=0;i<n;i++)a[i]=sc.nextInt(); System.out.println(mx(a,n)); }}`,
      python: `def mx(a,n): return a[0] if n==1 else max(a[n-1],mx(a,n-1))\nn=int(input())\na=list(map(int,input().split()))\nprint(mx(a,n))`
    },
    testCases: [{ input: '5\\n3 1 4 1 5', expectedOutput: '5', description: '最大5' }],
    hints: ['mx=max(最后,前n-1最大)'], explanation: 'O(n)'
  },
  {
    id: 'rec-bsearch', category: '递归', title: '递归二分查找', difficulty: 'easy', type: 'coding',
    description: `递归二分查找\n\n输入：n target，n个升序数\n输出：下标或-1`,
    templates: { cpp: `#include <iostream>\nusing namespace std;\nint bs(int a[],int l,int r,int t) { /* TODO */ }\nint main() { int n,t; cin>>n>>t; int a[100005]; for(int i=0;i<n;i++)cin>>a[i]; cout<<bs(a,0,n-1,t)<<endl; }`,
      java: `import java.util.*;\npublic class Main { static int bs(int[] a,int l,int r,int t) { /* TODO */ return -1; } public static void main(String[] x) { Scanner sc=new Scanner(System.in); int n=sc.nextInt(),t=sc.nextInt(); int[] a=new int[n]; for(int i=0;i<n;i++)a[i]=sc.nextInt(); System.out.println(bs(a,0,n-1,t)); }}`,
      python: `def bs(a,l,r,t):\n    pass\nn,t=map(int,input().split())\na=list(map(int,input().split()))\nprint(bs(a,0,n-1,t))`
    },
    solutions: { cpp: `#include <iostream>\nusing namespace std;\nint bs(int a[],int l,int r,int t) { if(l>r)return -1; int m=l+(r-l)/2; if(a[m]==t)return m; if(a[m]>t)return bs(a,l,m-1,t); return bs(a,m+1,r,t); }\nint main() { int n,t; cin>>n>>t; int a[100005]; for(int i=0;i<n;i++)cin>>a[i]; cout<<bs(a,0,n-1,t)<<endl; }`,
      java: `import java.util.*;\npublic class Main { static int bs(int[] a,int l,int r,int t) { if(l>r)return -1; int m=l+(r-l)/2; if(a[m]==t)return m; if(a[m]>t)return bs(a,l,m-1,t); return bs(a,m+1,r,t); } public static void main(String[] x) { Scanner sc=new Scanner(System.in); int n=sc.nextInt(),t=sc.nextInt(); int[] a=new int[n]; for(int i=0;i<n;i++)a[i]=sc.nextInt(); System.out.println(bs(a,0,n-1,t)); }}`,
      python: `def bs(a,l,r,t):\n    if l>r: return -1\n    m=l+(r-l)//2\n    if a[m]==t: return m\n    if a[m]>t: return bs(a,l,m-1,t)\n    return bs(a,m+1,r,t)\nn,t=map(int,input().split())\na=list(map(int,input().split()))\nprint(bs(a,0,n-1,t))`
    },
    testCases: [{ input: '5 4\\n1 2 3 4 5', expectedOutput: '3', description: '下标3' }, { input: '5 6\\n1 2 3 4 5', expectedOutput: '-1', description: '未找到' }],
    hints: ['l>r返回-1', '中点比较决定方向'], explanation: 'O(log n)'
  },
  {
    id: 'rec-gcd', category: '递归', title: '递归求GCD', difficulty: 'easy', type: 'coding',
    description: `欧几里得算法求GCD\n\n输入：a b\n输出：gcd(a,b)`,
    templates: { cpp: `#include <iostream>\nusing namespace std;\nint g(int a,int b) { /* TODO */ }\nint main() { int a,b; cin>>a>>b; cout<<g(a,b)<<endl; }`,
      java: `import java.util.*;\npublic class Main { static int g(int a,int b) { /* TODO */ return 0; } public static void main(String[] x) { Scanner sc=new Scanner(System.in); System.out.println(g(sc.nextInt(),sc.nextInt())); }}`,
      python: `def g(a,b):\n    pass\na,b=map(int,input().split())\nprint(g(a,b))`
    },
    solutions: { cpp: `#include <iostream>\nusing namespace std;\nint g(int a,int b) { return b==0?a:g(b,a%b); }\nint main() { int a,b; cin>>a>>b; cout<<g(a,b)<<endl; }`,
      java: `import java.util.*;\npublic class Main { static int g(int a,int b) { return b==0?a:g(b,a%b); } public static void main(String[] x) { Scanner sc=new Scanner(System.in); System.out.println(g(sc.nextInt(),sc.nextInt())); }}`,
      python: `def g(a,b): return a if b==0 else g(b,a%b)\na,b=map(int,input().split())\nprint(g(a,b))`
    },
    testCases: [{ input: '48 18', expectedOutput: '6', description: 'gcd=6' }],
    hints: ['gcd(a,b)=gcd(b,a%b)'], explanation: 'O(log min(a,b))'
  },
  // ==================== 考试递归专题 ====================
  {
    id: 'rec-combination', category: '递归', title: '排列组合C(m,n)', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
编写程序求组合数 C(m, n) 的值。函数由分段递归公式定义：
C(m,n) = 0        当 n < 0
C(m,n) = 1        当 n = 0
C(m,n) = m        当 n = 1
C(m,n) = C(m, m-n)    当 m < 2n
C(m,n) = C(m-1, n-1) + C(m-1, n)  当 m >= 2n

【输入格式】
两个自然数 m 和 n（m >= n，m <= 20）

【输出格式】
C(m, n) 的值`,
    templates: {
      c: `#include <stdio.h>\nlong long C(int m, int n) {\n    // TODO: 实现递归\n}\nint main() {\n    int m, n;\n    scanf("%d %d", &m, &n);\n    printf("%lld\\n", C(m, n));\n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nlong long C(int m, int n) {\n    // TODO\n}\nint main() {\n    int m, n;\n    cin >> m >> n;\n    cout << C(m, n) << endl;\n}`,
      java: `import java.util.*;\npublic class Main {\n    static long C(int m, int n) {\n        // TODO\n        return 0;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.println(C(sc.nextInt(), sc.nextInt()));\n    }\n}`,
      python: `def C(m, n):\n    # TODO\n    pass\nm, n = map(int, input().split())\nprint(C(m, n))`
    },
    solutions: {
      c: `#include <stdio.h>\nlong long C(int m, int n) {\n    if (n < 0) return 0;\n    if (n == 0) return 1;\n    if (n == 1) return m;\n    if (m < 2 * n) return C(m, m - n);\n    return C(m - 1, n - 1) + C(m - 1, n);\n}\nint main() {\n    int m, n;\n    scanf("%d %d", &m, &n);\n    printf("%lld\\n", C(m, n));\n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nlong long C(int m, int n) {\n    if (n < 0) return 0;\n    if (n == 0) return 1;\n    if (n == 1) return m;\n    if (m < 2 * n) return C(m, m - n);\n    return C(m - 1, n - 1) + C(m - 1, n);\n}\nint main() {\n    int m, n;\n    cin >> m >> n;\n    cout << C(m, n) << endl;\n}`,
      java: `import java.util.*;\npublic class Main {\n    static long C(int m, int n) {\n        if (n < 0) return 0;\n        if (n == 0) return 1;\n        if (n == 1) return m;\n        if (m < 2 * n) return C(m, m - n);\n        return C(m - 1, n - 1) + C(m - 1, n);\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.println(C(sc.nextInt(), sc.nextInt()));\n    }\n}`,
      python: `def C(m, n):\n    if n < 0: return 0\n    if n == 0: return 1\n    if n == 1: return m\n    if m < 2 * n: return C(m, m - n)\n    return C(m - 1, n - 1) + C(m - 1, n)\nm, n = map(int, input().split())\nprint(C(m, n))`
    },
    testCases: [
      { input: '5 2', expectedOutput: '10', description: 'C(5,2)=10' },
      { input: '10 3', expectedOutput: '120', description: 'C(10,3)=120' }
    ],
    hints: ['注意分段条件的判断顺序', 'C(m,m-n)利用对称性减少计算'],
    explanation: '组合数递归公式：C(m,n) = C(m-1,n-1) + C(m-1,n)，利用对称性C(m,n)=C(m,m-n)优化'
  },
  {
    id: 'rec-hermite', category: '递归', title: 'Hermite多项式', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
用递归方法求解 Hermite 多项式值。多项式 H_n(x) 定义如下：
H_n(x) = 1                           当 n = 0
H_n(x) = 2x                          当 n = 1
H_n(x) = 2x * H_{n-1}(x) - 2(n-1) * H_{n-2}(x)  当 n > 1

【输入格式】
一个非负整数 n 和一个实数 x

【输出格式】
H_n(x) 的值，精确到小数点后 2 位`,
    templates: {
      c: `#include <stdio.h>\ndouble H(int n, double x) {\n    // TODO\n}\nint main() {\n    int n; double x;\n    scanf("%d %lf", &n, &x);\n    printf("%.2f\\n", H(n, x));\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <iomanip>\nusing namespace std;\ndouble H(int n, double x) {\n    // TODO\n}\nint main() {\n    int n; double x;\n    cin >> n >> x;\n    cout << fixed << setprecision(2) << H(n, x) << endl;\n}`,
      java: `import java.util.*;\npublic class Main {\n    static double H(int n, double x) {\n        // TODO\n        return 0;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.printf("%.2f\\n", H(sc.nextInt(), sc.nextDouble()));\n    }\n}`,
      python: `def H(n, x):\n    # TODO\n    pass\nn, x = input().split()\nprint(f"{H(int(n), float(x)):.2f}")`
    },
    solutions: {
      c: `#include <stdio.h>\ndouble H(int n, double x) {\n    if (n == 0) return 1;\n    if (n == 1) return 2 * x;\n    return 2 * x * H(n - 1, x) - 2 * (n - 1) * H(n - 2, x);\n}\nint main() {\n    int n; double x;\n    scanf("%d %lf", &n, &x);\n    printf("%.2f\\n", H(n, x));\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <iomanip>\nusing namespace std;\ndouble H(int n, double x) {\n    if (n == 0) return 1;\n    if (n == 1) return 2 * x;\n    return 2 * x * H(n - 1, x) - 2 * (n - 1) * H(n - 2, x);\n}\nint main() {\n    int n; double x;\n    cin >> n >> x;\n    cout << fixed << setprecision(2) << H(n, x) << endl;\n}`,
      java: `import java.util.*;\npublic class Main {\n    static double H(int n, double x) {\n        if (n == 0) return 1;\n        if (n == 1) return 2 * x;\n        return 2 * x * H(n - 1, x) - 2 * (n - 1) * H(n - 2, x);\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.printf("%.2f\\n", H(sc.nextInt(), sc.nextDouble()));\n    }\n}`,
      python: `def H(n, x):\n    if n == 0: return 1\n    if n == 1: return 2 * x\n    return 2 * x * H(n - 1, x) - 2 * (n - 1) * H(n - 2, x)\nn, x = input().split()\nprint(f"{H(int(n), float(x)):.2f}")`
    },
    testCases: [
      { input: '2 1.5', expectedOutput: '7.00', description: 'H(2,1.5)=7.00' },
      { input: '3 2.0', expectedOutput: '40.00', description: 'H(3,2)=40.00' }
    ],
    hints: ['基准情况：n=0返回1，n=1返回2x', '递归：2x*H(n-1) - 2(n-1)*H(n-2)'],
    explanation: 'Hermite多项式是物理数学中重要的正交多项式'
  },
  {
    id: 'rec-ackerman', category: '递归', title: 'Ackerman函数', difficulty: 'hard', type: 'coding',
    description: `【题目描述】
计算 Ackerman 函数值。函数定义如下：
Ack(m, n) = n + 1                    当 m = 0
Ack(m, n) = Ack(m - 1, 1)           当 m > 0 且 n = 0
Ack(m, n) = Ack(m - 1, Ack(m, n - 1))  当 m > 0 且 n > 0

【输入格式】
两个非负整数 m 和 n（m ≤ 3，n ≤ 10）

【输出格式】
Ack(m, n) 的值`,
    templates: {
      c: `#include <stdio.h>\nint Ack(int m, int n) {\n    // TODO\n}\nint main() {\n    int m, n;\n    scanf("%d %d", &m, &n);\n    printf("%d\\n", Ack(m, n));\n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint Ack(int m, int n) {\n    // TODO\n}\nint main() {\n    int m, n;\n    cin >> m >> n;\n    cout << Ack(m, n) << endl;\n}`,
      java: `import java.util.*;\npublic class Main {\n    static int Ack(int m, int n) {\n        // TODO\n        return 0;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.println(Ack(sc.nextInt(), sc.nextInt()));\n    }\n}`,
      python: `import sys\nsys.setrecursionlimit(100000)\ndef Ack(m, n):\n    # TODO\n    pass\nm, n = map(int, input().split())\nprint(Ack(m, n))`
    },
    solutions: {
      c: `#include <stdio.h>\nint Ack(int m, int n) {\n    if (m == 0) return n + 1;\n    if (n == 0) return Ack(m - 1, 1);\n    return Ack(m - 1, Ack(m, n - 1));\n}\nint main() {\n    int m, n;\n    scanf("%d %d", &m, &n);\n    printf("%d\\n", Ack(m, n));\n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint Ack(int m, int n) {\n    if (m == 0) return n + 1;\n    if (n == 0) return Ack(m - 1, 1);\n    return Ack(m - 1, Ack(m, n - 1));\n}\nint main() {\n    int m, n;\n    cin >> m >> n;\n    cout << Ack(m, n) << endl;\n}`,
      java: `import java.util.*;\npublic class Main {\n    static int Ack(int m, int n) {\n        if (m == 0) return n + 1;\n        if (n == 0) return Ack(m - 1, 1);\n        return Ack(m - 1, Ack(m, n - 1));\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.println(Ack(sc.nextInt(), sc.nextInt()));\n    }\n}`,
      python: `import sys\nsys.setrecursionlimit(100000)\ndef Ack(m, n):\n    if m == 0: return n + 1\n    if n == 0: return Ack(m - 1, 1)\n    return Ack(m - 1, Ack(m, n - 1))\nm, n = map(int, input().split())\nprint(Ack(m, n))`
    },
    testCases: [
      { input: '2 3', expectedOutput: '9', description: 'Ack(2,3)=9' },
      { input: '3 2', expectedOutput: '29', description: 'Ack(3,2)=29' }
    ],
    hints: ['注意嵌套递归的执行顺序', 'm=0时直接返回n+1', 'Ackerman函数增长极快，注意栈溢出'],
    explanation: 'Ackerman函数是经典的双递归函数，增长速度超过任何原始递归函数'
  },
  {
    id: 'rec-seq-search', category: '递归', title: '递归顺序检索', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
用递归方法在整型数组中进行顺序检索。

【输入格式】
第一行：正整数 n（0 < n ≤ 100），数组元素个数
第二行：n 个整数，数组元素
第三行：待检索的关键字

【输出格式】
关键字首次出现的下标位置（从0开始），若不存在输出 NULL`,
    templates: {
      c: `#include <stdio.h>\nint search(int a[], int n, int key, int i) {\n    // TODO: i为当前检索位置\n}\nint main() {\n    int n, a[105], key;\n    scanf("%d", &n);\n    for (int i = 0; i < n; i++) scanf("%d", &a[i]);\n    scanf("%d", &key);\n    int pos = search(a, n, key, 0);\n    if (pos == -1) printf("NULL\\n");\n    else printf("%d\\n", pos);\n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint search(int a[], int n, int key, int i) {\n    // TODO\n}\nint main() {\n    int n, a[105], key;\n    cin >> n;\n    for (int i = 0; i < n; i++) cin >> a[i];\n    cin >> key;\n    int pos = search(a, n, key, 0);\n    if (pos == -1) cout << "NULL" << endl;\n    else cout << pos << endl;\n}`,
      java: `import java.util.*;\npublic class Main {\n    static int search(int[] a, int n, int key, int i) {\n        // TODO\n        return -1;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int key = sc.nextInt();\n        int pos = search(a, n, key, 0);\n        System.out.println(pos == -1 ? "NULL" : pos);\n    }\n}`,
      python: `def search(a, n, key, i):\n    # TODO\n    pass\nn = int(input())\na = list(map(int, input().split()))\nkey = int(input())\npos = search(a, n, key, 0)\nprint("NULL" if pos == -1 else pos)`
    },
    solutions: {
      c: `#include <stdio.h>\nint search(int a[], int n, int key, int i) {\n    if (i >= n) return -1;\n    if (a[i] == key) return i;\n    return search(a, n, key, i + 1);\n}\nint main() {\n    int n, a[105], key;\n    scanf("%d", &n);\n    for (int i = 0; i < n; i++) scanf("%d", &a[i]);\n    scanf("%d", &key);\n    int pos = search(a, n, key, 0);\n    if (pos == -1) printf("NULL\\n");\n    else printf("%d\\n", pos);\n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint search(int a[], int n, int key, int i) {\n    if (i >= n) return -1;\n    if (a[i] == key) return i;\n    return search(a, n, key, i + 1);\n}\nint main() {\n    int n, a[105], key;\n    cin >> n;\n    for (int i = 0; i < n; i++) cin >> a[i];\n    cin >> key;\n    int pos = search(a, n, key, 0);\n    if (pos == -1) cout << "NULL" << endl;\n    else cout << pos << endl;\n}`,
      java: `import java.util.*;\npublic class Main {\n    static int search(int[] a, int n, int key, int i) {\n        if (i >= n) return -1;\n        if (a[i] == key) return i;\n        return search(a, n, key, i + 1);\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int key = sc.nextInt();\n        int pos = search(a, n, key, 0);\n        System.out.println(pos == -1 ? "NULL" : pos);\n    }\n}`,
      python: `def search(a, n, key, i):\n    if i >= n: return -1\n    if a[i] == key: return i\n    return search(a, n, key, i + 1)\nn = int(input())\na = list(map(int, input().split()))\nkey = int(input())\npos = search(a, n, key, 0)\nprint("NULL" if pos == -1 else pos)`
    },
    testCases: [
      { input: '5\\n1 3 5 7 9\\n5', expectedOutput: '2', description: '找到5在下标2' },
      { input: '5\\n1 3 5 7 9\\n4', expectedOutput: 'NULL', description: '未找到' }
    ],
    hints: ['从下标0开始顺序检索', '找到返回下标，越界返回-1'],
    explanation: '递归顺序检索：依次检查每个元素，时间复杂度O(n)'
  },
  {
    id: 'rec-array-reverse', category: '递归', title: '递归数组反序', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
用递归方法将数组反序（逆序）。

【输入格式】
第一行：正整数 n（0 < n ≤ 100），数组元素个数
第二行：n 个整数，数组元素

【输出格式】
顺次输出逆序后数组中元素，元素间以一个空格间隔，最后一个元素后无字符`,
    templates: {
      c: `#include <stdio.h>\nvoid reverse(int a[], int l, int r) {\n    // TODO: l为左端，r为右端\n}\nint main() {\n    int n, a[105];\n    scanf("%d", &n);\n    for (int i = 0; i < n; i++) scanf("%d", &a[i]);\n    reverse(a, 0, n - 1);\n    for (int i = 0; i < n; i++) printf("%d%c", a[i], i < n-1 ? ' ' : '\\n');\n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nvoid reverse(int a[], int l, int r) {\n    // TODO\n}\nint main() {\n    int n, a[105];\n    cin >> n;\n    for (int i = 0; i < n; i++) cin >> a[i];\n    reverse(a, 0, n - 1);\n    for (int i = 0; i < n; i++) cout << a[i] << (i < n-1 ? " " : "\\n");\n}`,
      java: `import java.util.*;\npublic class Main {\n    static void reverse(int[] a, int l, int r) {\n        // TODO\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        reverse(a, 0, n - 1);\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < n; i++) sb.append(a[i]).append(i < n-1 ? " " : "");\n        System.out.println(sb);\n    }\n}`,
      python: `def reverse(a, l, r):\n    # TODO\n    pass\nn = int(input())\na = list(map(int, input().split()))\nreverse(a, 0, n - 1)\nprint(' '.join(map(str, a)))`
    },
    solutions: {
      c: `#include <stdio.h>\nvoid reverse(int a[], int l, int r) {\n    if (l >= r) return;\n    int t = a[l]; a[l] = a[r]; a[r] = t;\n    reverse(a, l + 1, r - 1);\n}\nint main() {\n    int n, a[105];\n    scanf("%d", &n);\n    for (int i = 0; i < n; i++) scanf("%d", &a[i]);\n    reverse(a, 0, n - 1);\n    for (int i = 0; i < n; i++) printf("%d%c", a[i], i < n-1 ? ' ' : '\\n');\n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nvoid reverse(int a[], int l, int r) {\n    if (l >= r) return;\n    swap(a[l], a[r]);\n    reverse(a, l + 1, r - 1);\n}\nint main() {\n    int n, a[105];\n    cin >> n;\n    for (int i = 0; i < n; i++) cin >> a[i];\n    reverse(a, 0, n - 1);\n    for (int i = 0; i < n; i++) cout << a[i] << (i < n-1 ? " " : "\\n");\n}`,
      java: `import java.util.*;\npublic class Main {\n    static void reverse(int[] a, int l, int r) {\n        if (l >= r) return;\n        int t = a[l]; a[l] = a[r]; a[r] = t;\n        reverse(a, l + 1, r - 1);\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        reverse(a, 0, n - 1);\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < n; i++) sb.append(a[i]).append(i < n-1 ? " " : "");\n        System.out.println(sb);\n    }\n}`,
      python: `def reverse(a, l, r):\n    if l >= r: return\n    a[l], a[r] = a[r], a[l]\n    reverse(a, l + 1, r - 1)\nn = int(input())\na = list(map(int, input().split()))\nreverse(a, 0, n - 1)\nprint(' '.join(map(str, a)))`
    },
    testCases: [
      { input: '5\\n1 2 3 4 5', expectedOutput: '5 4 3 2 1', description: '反序' },
      { input: '4\\n1 2 3 4', expectedOutput: '4 3 2 1', description: '偶数个' }
    ],
    hints: ['交换首尾，递归处理中间部分', 'l >= r 时终止'],
    explanation: '双指针递归：交换a[l]和a[r]，递归处理[l+1, r-1]'
  },
  {
    id: 'rec-cut-stick', category: '递归', title: '截木条', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给定一个长度为 n 的木条，在约 2/5 的位置截断。短木条长度四舍五入为正整数，长木条长度为总长减去短木条长度。若新木条长度仍 > k，则继续按此法处理，直到所有木条长度都 ≤ k。
求最终得到的木条根数。

【输入格式】
两个正整数 n 和 k

【输出格式】
木条根数`,
    templates: {
      c: `#include <stdio.h>\n#include <math.h>\nint cut(int n, int k) {\n    // TODO\n}\nint main() {\n    int n, k;\n    scanf("%d %d", &n, &k);\n    printf("%d\\n", cut(n, k));\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <cmath>\nusing namespace std;\nint cut(int n, int k) {\n    // TODO\n}\nint main() {\n    int n, k;\n    cin >> n >> k;\n    cout << cut(n, k) << endl;\n}`,
      java: `import java.util.*;\npublic class Main {\n    static int cut(int n, int k) {\n        // TODO\n        return 0;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.println(cut(sc.nextInt(), sc.nextInt()));\n    }\n}`,
      python: `def cut(n, k):\n    # TODO\n    pass\nn, k = map(int, input().split())\nprint(cut(n, k))`
    },
    solutions: {
      c: `#include <stdio.h>\n#include <math.h>\nint cut(int n, int k) {\n    if (n <= k) return 1;\n    int shorter = (int)round(n * 0.4);\n    int longer = n - shorter;\n    return cut(shorter, k) + cut(longer, k);\n}\nint main() {\n    int n, k;\n    scanf("%d %d", &n, &k);\n    printf("%d\\n", cut(n, k));\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <cmath>\nusing namespace std;\nint cut(int n, int k) {\n    if (n <= k) return 1;\n    int shorter = round(n * 0.4);\n    int longer = n - shorter;\n    return cut(shorter, k) + cut(longer, k);\n}\nint main() {\n    int n, k;\n    cin >> n >> k;\n    cout << cut(n, k) << endl;\n}`,
      java: `import java.util.*;\npublic class Main {\n    static int cut(int n, int k) {\n        if (n <= k) return 1;\n        int shorter = (int)Math.round(n * 0.4);\n        int longer = n - shorter;\n        return cut(shorter, k) + cut(longer, k);\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.println(cut(sc.nextInt(), sc.nextInt()));\n    }\n}`,
      python: `def cut(n, k):\n    if n <= k: return 1\n    shorter = round(n * 0.4)\n    longer = n - shorter\n    return cut(shorter, k) + cut(longer, k)\nn, k = map(int, input().split())\nprint(cut(n, k))`
    },
    testCases: [
      { input: '100 20', expectedOutput: '7', description: '100截成7根' },
      { input: '50 10', expectedOutput: '5', description: '50截成5根' }
    ],
    hints: ['n <= k 时返回1', '短木条 = round(n*0.4)，长木条 = n - 短木条'],
    explanation: '分治递归：每次截成两段，分别递归处理'
  },
  {
    id: 'rec-base-convert', category: '递归', title: '十进制转任意进制', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
用递归方法将十进制的非负整数 N 转换为 b 进制数（2 ≤ b ≤ 36）。
10以上的数位用大写字母A-Z表示。

【输入格式】
一行输入两个非负整数：十进制的 N 和 b

【输出格式】
N 的 b 进制数`,
    templates: {
      c: `#include <stdio.h>\nvoid convert(unsigned long n, int b) {\n    // TODO\n}\nint main() {\n    unsigned long n; int b;\n    scanf("%lu %d", &n, &b);\n    if (n == 0) printf("0");\n    else convert(n, b);\n    printf("\\n");\n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nvoid convert(unsigned long n, int b) {\n    // TODO\n}\nint main() {\n    unsigned long n; int b;\n    cin >> n >> b;\n    if (n == 0) cout << 0;\n    else convert(n, b);\n    cout << endl;\n}`,
      java: `import java.util.*;\npublic class Main {\n    static void convert(long n, int b) {\n        // TODO\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong(); int b = sc.nextInt();\n        if (n == 0) System.out.print(0);\n        else convert(n, b);\n        System.out.println();\n    }\n}`,
      python: `def convert(n, b):\n    # TODO\n    pass\nn, b = map(int, input().split())\nif n == 0: print(0)\nelse: convert(n, b); print()`
    },
    solutions: {
      c: `#include <stdio.h>\nchar digits[] = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";\nvoid convert(unsigned long n, int b) {\n    if (n == 0) return;\n    convert(n / b, b);\n    printf("%c", digits[n % b]);\n}\nint main() {\n    unsigned long n; int b;\n    scanf("%lu %d", &n, &b);\n    if (n == 0) printf("0");\n    else convert(n, b);\n    printf("\\n");\n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nstring digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";\nvoid convert(unsigned long n, int b) {\n    if (n == 0) return;\n    convert(n / b, b);\n    cout << digits[n % b];\n}\nint main() {\n    unsigned long n; int b;\n    cin >> n >> b;\n    if (n == 0) cout << 0;\n    else convert(n, b);\n    cout << endl;\n}`,
      java: `import java.util.*;\npublic class Main {\n    static String digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";\n    static void convert(long n, int b) {\n        if (n == 0) return;\n        convert(n / b, b);\n        System.out.print(digits.charAt((int)(n % b)));\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong(); int b = sc.nextInt();\n        if (n == 0) System.out.print(0);\n        else convert(n, b);\n        System.out.println();\n    }\n}`,
      python: `digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"\ndef convert(n, b):\n    if n == 0: return\n    convert(n // b, b)\n    print(digits[n % b], end='')\nn, b = map(int, input().split())\nif n == 0: print(0)\nelse: convert(n, b); print()`
    },
    testCases: [
      { input: '255 16', expectedOutput: 'FF', description: '255转16进制' },
      { input: '10 2', expectedOutput: '1010', description: '10转2进制' }
    ],
    hints: ['先递归处理高位(n/b)，再输出当前位(n%b)', '注意n=0的特殊情况'],
    explanation: '递归进制转换：先处理高位再处理低位，利用递归栈逆序输出'
  },
  {
    id: 'rec-print-digits', category: '递归', title: '递归求正整数各位数字', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
编写递归函数，把正整数的各位数字依次打印输出。

【输入格式】
任意一个 int 范围内的正整数

【输出格式】
依次输出正整数的各位数字，从高位向低位依次输出、相邻数字用1个空格隔开、最后1个数字后面也有一个空格`,
    templates: {
      c: `#include <stdio.h>\nvoid printDigits(int n) {\n    // TODO\n}\nint main() {\n    int n;\n    scanf("%d", &n);\n    printDigits(n);\n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nvoid printDigits(int n) {\n    // TODO\n}\nint main() {\n    int n;\n    cin >> n;\n    printDigits(n);\n}`,
      java: `import java.util.*;\npublic class Main {\n    static void printDigits(int n) {\n        // TODO\n    }\n    public static void main(String[] args) {\n        printDigits(new Scanner(System.in).nextInt());\n    }\n}`,
      python: `def printDigits(n):\n    # TODO\n    pass\nprintDigits(int(input()))`
    },
    solutions: {
      c: `#include <stdio.h>\nvoid printDigits(int n) {\n    if (n >= 10) printDigits(n / 10);\n    printf("%d ", n % 10);\n}\nint main() {\n    int n;\n    scanf("%d", &n);\n    printDigits(n);\n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nvoid printDigits(int n) {\n    if (n >= 10) printDigits(n / 10);\n    cout << n % 10 << " ";\n}\nint main() {\n    int n;\n    cin >> n;\n    printDigits(n);\n}`,
      java: `import java.util.*;\npublic class Main {\n    static void printDigits(int n) {\n        if (n >= 10) printDigits(n / 10);\n        System.out.print(n % 10 + " ");\n    }\n    public static void main(String[] args) {\n        printDigits(new Scanner(System.in).nextInt());\n    }\n}`,
      python: `def printDigits(n):\n    if n >= 10: printDigits(n // 10)\n    print(n % 10, end=' ')\nprintDigits(int(input()))`
    },
    testCases: [
      { input: '12345', expectedOutput: '1 2 3 4 5 ', description: '输出各位' },
      { input: '100', expectedOutput: '1 0 0 ', description: '包含0' }
    ],
    hints: ['先递归处理高位(n/10)，再输出当前位(n%10)', '递归终止条件：n<10'],
    explanation: '利用递归栈的特性，先递归到最高位再输出'
  },
  {
    id: 'rec-strlen', category: '递归', title: '递归求字符串长度', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
编写递归函数，求给定字符串的长度。

【输入格式】
任意一个字符串（长度不超过100；字符串中可能包含空格）

【输出格式】
1 个整数，表示字符串的长度`,
    templates: {
      c: `#include <stdio.h>\nint myStrlen(char* s) {\n    // TODO\n}\nint main() {\n    char s[105];\n    fgets(s, 105, stdin);\n    // 去掉末尾换行\n    int len = myStrlen(s);\n    if (len > 0 && s[len-1] == '\\n') len--;\n    printf("%d\\n", len);\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint myStrlen(const string& s, int i) {\n    // TODO: i为当前位置\n}\nint main() {\n    string s;\n    getline(cin, s);\n    cout << myStrlen(s, 0) << endl;\n}`,
      java: `import java.util.*;\npublic class Main {\n    static int myStrlen(String s, int i) {\n        // TODO\n        return 0;\n    }\n    public static void main(String[] args) {\n        String s = new Scanner(System.in).nextLine();\n        System.out.println(myStrlen(s, 0));\n    }\n}`,
      python: `def myStrlen(s):\n    # TODO\n    pass\nprint(myStrlen(input()))`
    },
    solutions: {
      c: `#include <stdio.h>\nint myStrlen(char* s) {\n    if (*s == '\\0' || *s == '\\n') return 0;\n    return 1 + myStrlen(s + 1);\n}\nint main() {\n    char s[105];\n    fgets(s, 105, stdin);\n    printf("%d\\n", myStrlen(s));\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint myStrlen(const string& s, int i) {\n    if (i >= s.size()) return 0;\n    return 1 + myStrlen(s, i + 1);\n}\nint main() {\n    string s;\n    getline(cin, s);\n    cout << myStrlen(s, 0) << endl;\n}`,
      java: `import java.util.*;\npublic class Main {\n    static int myStrlen(String s, int i) {\n        if (i >= s.length()) return 0;\n        return 1 + myStrlen(s, i + 1);\n    }\n    public static void main(String[] args) {\n        String s = new Scanner(System.in).nextLine();\n        System.out.println(myStrlen(s, 0));\n    }\n}`,
      python: `def myStrlen(s):\n    if s == '': return 0\n    return 1 + myStrlen(s[1:])\nprint(myStrlen(input()))`
    },
    testCases: [
      { input: 'hello', expectedOutput: '5', description: '长度5' },
      { input: 'hello world', expectedOutput: '11', description: '含空格' }
    ],
    hints: ['空字符串返回0', '否则返回1+剩余部分长度'],
    explanation: '递归字符串长度：空串长度0，否则为1+子串长度'
  }
];

// ==================== 经典算法题 ====================
export const classicAlgorithmExercises: Exercise[] = [
  {
    id: 'algo-gcd',
    category: '数学',
    title: '最大公约数',
    difficulty: 'easy',
    type: 'coding',
    description: `【题目描述】
求两个正整数的最大公约数（GCD）。

【输入格式】
两个正整数a和b（1≤a,b≤10^9）

【输出格式】
它们的最大公约数

【样例】
输入：12 18
输出：6`,
    templates: {
      c: `#include <stdio.h>

int gcd(int a, int b) {
    // TODO: 实现欧几里得算法
}

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d\\n", gcd(a, b));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int gcd(int a, int b) {
    // TODO: 实现欧几里得算法
}

int main() {
    int a, b;
    cin >> a >> b;
    cout << gcd(a, b) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class GCD {
    static int gcd(int a, int b) {
        // TODO: 实现欧几里得算法
        return 0;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt(), b = sc.nextInt();
        System.out.println(gcd(a, b));
    }
}`,
      python: `def gcd(a, b):
    # TODO: 实现欧几里得算法
    pass

a, b = map(int, input().split())
print(gcd(a, b))`
    },
    solutions: {
      c: `#include <stdio.h>

int gcd(int a, int b) {
    return b == 0 ? a : gcd(b, a % b);
}

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d\\n", gcd(a, b));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int gcd(int a, int b) {
    return b == 0 ? a : gcd(b, a % b);
}

// 非递归版本
int gcd_iter(int a, int b) {
    while (b != 0) {
        int t = a % b;
        a = b;
        b = t;
    }
    return a;
}

int main() {
    int a, b;
    cin >> a >> b;
    cout << gcd(a, b) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class GCD {
    static int gcd(int a, int b) {
        return b == 0 ? a : gcd(b, a % b);
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt(), b = sc.nextInt();
        System.out.println(gcd(a, b));
    }
}`,
      python: `def gcd(a, b):
    return a if b == 0 else gcd(b, a % b)

# 或者使用math.gcd
# from math import gcd

a, b = map(int, input().split())
print(gcd(a, b))`
    },
    testCases: [
      { input: '12 18', expectedOutput: '6', description: 'gcd(12,18)=6' },
      { input: '17 13', expectedOutput: '1', description: '互质' }
    ],
    hints: ['欧几里得算法：gcd(a,b) = gcd(b, a%b)', '终止条件：b=0时返回a'],
    explanation: `【欧几里得算法（辗转相除法）】

【原理】gcd(a, b) = gcd(b, a mod b)

【证明】
设 a = bq + r，则 a 和 b 的公约数 = b 和 r 的公约数

【递归实现】
gcd(a, b) = b == 0 ? a : gcd(b, a % b)

【时间复杂度】O(log(min(a,b)))

【扩展】
- 最小公倍数：lcm(a,b) = a * b / gcd(a,b)
- 扩展欧几里得：求 ax + by = gcd(a,b) 的解`
  },
  {
    id: 'algo-binary-search-variants',
    category: '查找',
    title: '二分查找变体',
    difficulty: 'medium',
    type: 'coding',
    description: `【题目描述】
给定一个升序排列的整数数组（可能有重复元素），实现以下功能：
1. 查找第一个等于target的位置
2. 查找最后一个等于target的位置
3. 查找第一个大于等于target的位置

【输入格式】
第一行：数组长度n和查询数target
第二行：n个升序整数

【输出格式】
三个数，分别是上述三个问题的答案（不存在输出-1）

【样例】
输入：
7 5
1 2 5 5 5 7 9
输出：
2 4 2`,
    templates: {
      c: `#include <stdio.h>

int a[100005], n, target;

int findFirst() {
    // 查找第一个等于target的位置
    // TODO
}

int findLast() {
    // 查找最后一个等于target的位置
    // TODO
}

int lowerBound() {
    // 查找第一个>=target的位置
    // TODO
}

int main() {
    scanf("%d %d", &n, &target);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    printf("%d %d %d\\n", findFirst(), findLast(), lowerBound());
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int a[100005], n, target;

int findFirst() {
    // 查找第一个等于target的位置
    // TODO
}

int findLast() {
    // 查找最后一个等于target的位置
    // TODO
}

int lowerBound() {
    // 查找第一个>=target的位置
    // TODO
}

int main() {
    cin >> n >> target;
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << findFirst() << " " << findLast() << " " << lowerBound() << endl;
    return 0;
}`,
      java: `import java.util.*;

public class BinarySearch {
    static int[] a;
    static int n, target;
    
    static int findFirst() { /* TODO */ return -1; }
    static int findLast() { /* TODO */ return -1; }
    static int lowerBound() { /* TODO */ return -1; }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        target = sc.nextInt();
        a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(findFirst() + " " + findLast() + " " + lowerBound());
    }
}`,
      python: `def find_first(a, target):
    # TODO
    pass

def find_last(a, target):
    # TODO
    pass

def lower_bound(a, target):
    # TODO
    pass

n, target = map(int, input().split())
a = list(map(int, input().split()))
print(find_first(a, target), find_last(a, target), lower_bound(a, target))`
    },
    solutions: {
      c: `#include <stdio.h>

int a[100005], n, target;

int findFirst() {
    int l = 0, r = n - 1, ans = -1;
    while (l <= r) {
        int mid = (l + r) / 2;
        if (a[mid] == target) { ans = mid; r = mid - 1; }
        else if (a[mid] < target) l = mid + 1;
        else r = mid - 1;
    }
    return ans;
}

int findLast() {
    int l = 0, r = n - 1, ans = -1;
    while (l <= r) {
        int mid = (l + r) / 2;
        if (a[mid] == target) { ans = mid; l = mid + 1; }
        else if (a[mid] < target) l = mid + 1;
        else r = mid - 1;
    }
    return ans;
}

int lowerBound() {
    int l = 0, r = n - 1, ans = -1;
    while (l <= r) {
        int mid = (l + r) / 2;
        if (a[mid] >= target) { ans = mid; r = mid - 1; }
        else l = mid + 1;
    }
    return ans;
}

int main() {
    scanf("%d %d", &n, &target);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    printf("%d %d %d\\n", findFirst(), findLast(), lowerBound());
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int a[100005], n, target;

int findFirst() {
    int l = 0, r = n - 1, ans = -1;
    while (l <= r) {
        int mid = (l + r) / 2;
        if (a[mid] == target) {
            ans = mid;
            r = mid - 1;  // 继续往左找
        } else if (a[mid] < target) {
            l = mid + 1;
        } else {
            r = mid - 1;
        }
    }
    return ans;
}

int findLast() {
    int l = 0, r = n - 1, ans = -1;
    while (l <= r) {
        int mid = (l + r) / 2;
        if (a[mid] == target) {
            ans = mid;
            l = mid + 1;  // 继续往右找
        } else if (a[mid] < target) {
            l = mid + 1;
        } else {
            r = mid - 1;
        }
    }
    return ans;
}

int lowerBound() {
    int l = 0, r = n - 1, ans = -1;
    while (l <= r) {
        int mid = (l + r) / 2;
        if (a[mid] >= target) {
            ans = mid;
            r = mid - 1;
        } else {
            l = mid + 1;
        }
    }
    return ans;
}

int main() {
    cin >> n >> target;
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << findFirst() << " " << findLast() << " " << lowerBound() << endl;
    return 0;
}`,
      java: `// 类似C++实现`,
      python: `def find_first(a, target):
    l, r, ans = 0, len(a) - 1, -1
    while l <= r:
        mid = (l + r) // 2
        if a[mid] == target:
            ans = mid
            r = mid - 1
        elif a[mid] < target:
            l = mid + 1
        else:
            r = mid - 1
    return ans

def find_last(a, target):
    l, r, ans = 0, len(a) - 1, -1
    while l <= r:
        mid = (l + r) // 2
        if a[mid] == target:
            ans = mid
            l = mid + 1
        elif a[mid] < target:
            l = mid + 1
        else:
            r = mid - 1
    return ans

def lower_bound(a, target):
    l, r, ans = 0, len(a) - 1, -1
    while l <= r:
        mid = (l + r) // 2
        if a[mid] >= target:
            ans = mid
            r = mid - 1
        else:
            l = mid + 1
    return ans

n, target = map(int, input().split())
a = list(map(int, input().split()))
print(find_first(a, target), find_last(a, target), lower_bound(a, target))`
    },
    testCases: [
      { input: '7 5\\n1 2 5 5 5 7 9', expectedOutput: '2 4 2', description: '查找5' }
    ],
    hints: [
      '找到target后不要立即返回',
      '找第一个：记录答案后继续往左找',
      '找最后一个：记录答案后继续往右找'
    ],
    explanation: `【二分查找变体总结】

【找第一个等于target】
找到后，ans=mid，继续r=mid-1往左找

【找最后一个等于target】
找到后，ans=mid，继续l=mid+1往右找

【lower_bound（第一个>=target）】
a[mid]>=target时，ans=mid，r=mid-1

【upper_bound（第一个>target）】
a[mid]>target时，ans=mid，r=mid-1

【记忆口诀】
- 找左边界：找到后往左缩
- 找右边界：找到后往右扩`
  },
  {
    id: 'algo-merge-sort',
    category: '排序',
    title: '归并排序',
    difficulty: 'medium',
    type: 'coding',
    description: `【题目描述】
使用归并排序对数组进行排序。

【输入格式】
第一行：数组长度n（1≤n≤100000）
第二行：n个整数

【输出格式】
排序后的数组

【样例】
输入：
5
5 2 4 6 1
输出：
1 2 4 5 6

【要求】
实现分治思想的归并排序`,
    templates: {
      c: `#include <stdio.h>

int a[100005], temp[100005];
int n;

void merge(int l, int mid, int r) {
    // 合并 [l,mid] 和 [mid+1,r]
    // TODO
}

void mergeSort(int l, int r) {
    // TODO
}

int main() {
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    mergeSort(0, n - 1);
    for (int i = 0; i < n; i++) printf("%d ", a[i]);
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int a[100005], temp[100005];
int n;

void merge(int l, int mid, int r) {
    // 合并 [l,mid] 和 [mid+1,r]
    // TODO
}

void mergeSort(int l, int r) {
    // TODO
}

int main() {
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];
    mergeSort(0, n - 1);
    for (int i = 0; i < n; i++) cout << a[i] << " ";
    return 0;
}`,
      java: `import java.util.*;

public class MergeSort {
    static int[] a, temp;
    
    static void merge(int l, int mid, int r) { /* TODO */ }
    static void mergeSort(int l, int r) { /* TODO */ }
    
    public static void main(String[] args) {
        // ...
    }
}`,
      python: `def merge(a, l, mid, r, temp):
    # TODO
    pass

def merge_sort(a, l, r, temp):
    # TODO
    pass`
    },
    solutions: {
      c: `#include <stdio.h>

int a[100005], temp[100005];
int n;

void merge(int l, int mid, int r) {
    int i = l, j = mid + 1, k = l;
    while (i <= mid && j <= r) {
        if (a[i] <= a[j]) temp[k++] = a[i++];
        else temp[k++] = a[j++];
    }
    while (i <= mid) temp[k++] = a[i++];
    while (j <= r) temp[k++] = a[j++];
    for (i = l; i <= r; i++) a[i] = temp[i];
}

void mergeSort(int l, int r) {
    if (l >= r) return;
    int mid = (l + r) / 2;
    mergeSort(l, mid);
    mergeSort(mid + 1, r);
    merge(l, mid, r);
}

int main() {
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    mergeSort(0, n - 1);
    for (int i = 0; i < n; i++) printf("%d ", a[i]);
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int a[100005], temp[100005];
int n;

void merge(int l, int mid, int r) {
    int i = l, j = mid + 1, k = l;
    while (i <= mid && j <= r) {
        if (a[i] <= a[j])
            temp[k++] = a[i++];
        else
            temp[k++] = a[j++];
    }
    while (i <= mid) temp[k++] = a[i++];
    while (j <= r) temp[k++] = a[j++];
    for (int i = l; i <= r; i++) a[i] = temp[i];
}

void mergeSort(int l, int r) {
    if (l >= r) return;
    int mid = (l + r) / 2;
    mergeSort(l, mid);
    mergeSort(mid + 1, r);
    merge(l, mid, r);
}

int main() {
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];
    mergeSort(0, n - 1);
    for (int i = 0; i < n; i++) cout << a[i] << " ";
    return 0;
}`,
      java: `// 类似实现`,
      python: `def merge(a, l, mid, r, temp):
    i, j, k = l, mid + 1, l
    while i <= mid and j <= r:
        if a[i] <= a[j]:
            temp[k] = a[i]
            i += 1
        else:
            temp[k] = a[j]
            j += 1
        k += 1
    while i <= mid:
        temp[k] = a[i]
        i += 1; k += 1
    while j <= r:
        temp[k] = a[j]
        j += 1; k += 1
    for i in range(l, r + 1):
        a[i] = temp[i]

def merge_sort(a, l, r, temp):
    if l >= r:
        return
    mid = (l + r) // 2
    merge_sort(a, l, mid, temp)
    merge_sort(a, mid + 1, r, temp)
    merge(a, l, mid, r, temp)`
    },
    testCases: [
      { input: '5\\n5 2 4 6 1', expectedOutput: '1 2 4 5 6', description: '基本测试' }
    ],
    hints: [
      '分治：先排左半边，再排右半边，最后合并',
      '合并时用双指针',
      '需要额外的temp数组'
    ],
    explanation: `【归并排序】分治思想的典型应用

【算法步骤】
1. 分解：将数组分成两半
2. 递归：分别对两半排序
3. 合并：将两个有序数组合并

【合并过程】
- 双指针分别指向两个子数组
- 比较后较小的放入temp
- 最后将temp复制回原数组

【复杂度分析】
- 时间：O(n log n)，稳定
- 空间：O(n)，需要额外数组

【应用】
- 外部排序
- 求逆序对数量`
  }
];

// ==================== 链表进阶 ====================
export const linkedListAdvancedExercises: Exercise[] = [
  {
    id: 'll-cycle-advanced',
    category: '链表',
    title: '判断链表是否有环（进阶）',
    difficulty: 'medium',
    type: 'coding',
    description: `【题目描述】
给定一个链表，判断链表中是否有环。

【进阶】
如果有环，返回环的入口节点。

【要求】
使用O(1)空间复杂度`,
    templates: {
      c: `typedef struct ListNode {
    int val;
    struct ListNode* next;
} ListNode;

int hasCycle(ListNode* head) {
    // TODO: 使用快慢指针
}

ListNode* detectCycle(ListNode* head) {
    // TODO: 返回环的入口
}`,
      cpp: `struct ListNode {
    int val;
    ListNode* next;
};

bool hasCycle(ListNode* head) {
    // TODO: 使用快慢指针
}

ListNode* detectCycle(ListNode* head) {
    // TODO: 返回环的入口
}`,
      java: `// 类似实现`,
      python: `def has_cycle(head):
    # TODO
    pass

def detect_cycle(head):
    # TODO
    pass`
    },
    solutions: {
      c: `int hasCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return 1;
    }
    return 0;
}

ListNode* detectCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {
            ListNode* p = head;
            while (p != slow) {
                p = p->next;
                slow = slow->next;
            }
            return p;
        }
    }
    return NULL;
}`,
      cpp: `bool hasCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}

ListNode* detectCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {
            // 找到相遇点后，一个从头开始，一个从相遇点开始
            ListNode* p = head;
            while (p != slow) {
                p = p->next;
                slow = slow->next;
            }
            return p;
        }
    }
    return nullptr;
}`,
      java: `// 类似`,
      python: `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False

def detect_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            p = head
            while p != slow:
                p = p.next
                slow = slow.next
            return p
    return None`
    },
    testCases: [
      { input: '有环链表', expectedOutput: 'true', description: '检测到环' }
    ],
    hints: ['快慢指针：快指针每次走2步，慢指针每次走1步', '有环必相遇', '找入口：从头和相遇点同时走'],
    explanation: `【快慢指针判环】

【原理】
- 快指针速度是慢指针的2倍
- 如果有环，快指针必追上慢指针

【找环入口】
设链表头到入口距离为a，入口到相遇点距离为b，环长为c
- 慢指针走了：a + b
- 快指针走了：a + b + k*c（绕了k圈）
- 2(a+b) = a + b + k*c → a = k*c - b

从头和相遇点同时走，a步后必在入口相遇！

【时间复杂度】O(n)
【空间复杂度】O(1)`
  },
  {
    id: 'll-merge-sorted-classic',
    category: '链表',
    title: '合并两个有序链表',
    difficulty: 'easy',
    type: 'coding',
    description: `【题目描述】
将两个升序链表合并为一个新的升序链表并返回。

【样例】
输入：1->2->4, 1->3->4
输出：1->1->2->3->4->4`,
    templates: {
      cpp: `ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
    // TODO
}`,
      java: `ListNode mergeTwoLists(ListNode l1, ListNode l2) { }`,
      python: `def merge_two_lists(l1, l2):\n    pass`
    },
    solutions: {
      cpp: `ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
    ListNode dummy(0), *p = &dummy;
    while (l1 && l2) {
        if (l1->val <= l2->val) {
            p->next = l1;
            l1 = l1->next;
        } else {
            p->next = l2;
            l2 = l2->next;
        }
        p = p->next;
    }
    p->next = l1 ? l1 : l2;
    return dummy.next;
}`,
      java: `// 类似`,
      python: `def merge_two_lists(l1, l2):
    dummy = ListNode(0)
    p = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            p.next = l1
            l1 = l1.next
        else:
            p.next = l2
            l2 = l2.next
        p = p.next
    p.next = l1 or l2
    return dummy.next`
    },
    testCases: [
      { input: '[1,2,4], [1,3,4]', expectedOutput: '[1,1,2,3,4,4]', description: '合并' }
    ],
    hints: ['使用虚拟头节点简化操作', '双指针逐一比较'],
    explanation: `【合并有序链表】

【技巧】使用dummy头节点
- 避免处理头节点为空的特殊情况
- 最后返回dummy.next

【时间复杂度】O(n+m)
【空间复杂度】O(1)`
  }
];

// ==================== 动态规划进阶 ====================
export const dpAdvancedExercises: Exercise[] = [
  {
    id: 'dp-knapsack-01-classic',
    category: '动态规划',
    title: '0-1背包问题',
    difficulty: 'medium',
    type: 'coding',
    description: `【题目描述】
有N件物品和一个容量为V的背包。第i件物品的体积是v[i]，价值是w[i]。
求解将哪些物品装入背包，可使价值总和最大。
每件物品只能用一次。

【输入格式】
第一行：N V（物品数和背包容量）
接下来N行：每行两个整数v[i] w[i]

【输出格式】
最大价值

【样例】
输入：
4 5
1 2
2 4
3 4
4 5
输出：
8`,
    templates: {
      cpp: `#include <iostream>
using namespace std;

int n, V;
int v[1005], w[1005];
int dp[1005];  // 空间优化后的一维数组

int main() {
    cin >> n >> V;
    for (int i = 1; i <= n; i++)
        cin >> v[i] >> w[i];
    
    // TODO: 实现0-1背包
    
    cout << dp[V] << endl;
    return 0;
}`,
      java: `// 类似实现`,
      python: `n, V = map(int, input().split())
items = [tuple(map(int, input().split())) for _ in range(n)]

# TODO: 实现0-1背包`
    },
    solutions: {
      cpp: `#include <iostream>
using namespace std;

int n, V;
int v[1005], w[1005];
int dp[1005];

int main() {
    cin >> n >> V;
    for (int i = 1; i <= n; i++)
        cin >> v[i] >> w[i];
    
    // 一维空间优化：逆序遍历体积
    for (int i = 1; i <= n; i++) {
        for (int j = V; j >= v[i]; j--) {
            dp[j] = max(dp[j], dp[j - v[i]] + w[i]);
        }
    }
    
    cout << dp[V] << endl;
    return 0;
}`,
      java: `// 类似`,
      python: `n, V = map(int, input().split())
items = [tuple(map(int, input().split())) for _ in range(n)]

dp = [0] * (V + 1)
for vi, wi in items:
    for j in range(V, vi - 1, -1):
        dp[j] = max(dp[j], dp[j - vi] + wi)

print(dp[V])`
    },
    testCases: [
      { input: '4 5\\n1 2\\n2 4\\n3 4\\n4 5', expectedOutput: '8', description: '选物品1和2' }
    ],
    hints: [
      '状态定义：dp[i][j]表示前i个物品、容量j的最大价值',
      '转移方程：dp[i][j] = max(不选第i个, 选第i个)',
      '空间优化：一维数组，逆序遍历体积'
    ],
    explanation: `【0-1背包】动态规划经典问题

【状态定义】
dp[i][j] = 考虑前i个物品，容量为j时的最大价值

【转移方程】
dp[i][j] = max(dp[i-1][j], dp[i-1][j-v[i]] + w[i])
- 不选第i个：dp[i-1][j]
- 选第i个：dp[i-1][j-v[i]] + w[i]

【空间优化】
用一维数组，逆序遍历体积
- 逆序原因：保证每个物品只用一次
- 如果正序，dp[j-v[i]]可能已经被更新（相当于物品重复使用）

【时间复杂度】O(N×V)
【空间复杂度】O(V)`
  },
  {
    id: 'dp-lcs-classic',
    category: '动态规划',
    title: '最长公共子序列',
    difficulty: 'medium',
    type: 'coding',
    description: `【题目描述】
给定两个字符串，求它们的最长公共子序列（LCS）的长度。

【输入格式】
两行字符串

【输出格式】
LCS的长度

【样例】
输入：
ABCBDAB
BDCABA
输出：
4

【解释】
LCS = "BCBA" 或 "BDAB"`,
    templates: {
      cpp: `#include <iostream>
#include <string>
using namespace std;

int dp[1005][1005];

int main() {
    string a, b;
    cin >> a >> b;
    int n = a.size(), m = b.size();
    
    // TODO: 实现LCS
    
    return 0;
}`,
      java: `// 类似`,
      python: `a = input()
b = input()
# TODO: 实现LCS`
    },
    solutions: {
      cpp: `#include <iostream>
#include <string>
using namespace std;

int dp[1005][1005];

int main() {
    string a, b;
    cin >> a >> b;
    int n = a.size(), m = b.size();
    
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (a[i-1] == b[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    
    cout << dp[n][m] << endl;
    return 0;
}`,
      java: `// 类似`,
      python: `a = input()
b = input()
n, m = len(a), len(b)
dp = [[0] * (m + 1) for _ in range(n + 1)]

for i in range(1, n + 1):
    for j in range(1, m + 1):
        if a[i-1] == b[j-1]:
            dp[i][j] = dp[i-1][j-1] + 1
        else:
            dp[i][j] = max(dp[i-1][j], dp[i][j-1])

print(dp[n][m])`
    },
    testCases: [
      { input: 'ABCBDAB\\nBDCABA', expectedOutput: '4', description: 'LCS长度为4' }
    ],
    hints: [
      '状态：dp[i][j]表示a的前i个字符和b的前j个字符的LCS长度',
      '相等时：dp[i][j] = dp[i-1][j-1] + 1',
      '不等时：dp[i][j] = max(dp[i-1][j], dp[i][j-1])'
    ],
    explanation: `【最长公共子序列LCS】

【状态定义】
dp[i][j] = a的前i个字符与b的前j个字符的LCS长度

【转移方程】
if a[i] == b[j]:
    dp[i][j] = dp[i-1][j-1] + 1
else:
    dp[i][j] = max(dp[i-1][j], dp[i][j-1])

【如何输出LCS】
从dp[n][m]回溯：
- 若a[i]==b[j]，该字符在LCS中
- 否则往较大的方向走

【时间复杂度】O(n×m)
【空间复杂度】O(n×m)，可优化到O(min(n,m))`
  }
];

// 导出所有经典题目
export const allClassicExercises: Exercise[] = [
  ...recursionExercises,
  ...classicAlgorithmExercises,
  ...linkedListAdvancedExercises,
  ...dpAdvancedExercises,
];
