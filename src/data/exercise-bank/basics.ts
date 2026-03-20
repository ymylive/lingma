import type { Exercise } from '../exercises';

export const basicProgrammingExercises: Exercise[] = [
  {
    id: 'basic-series-sum', category: '基础编程', title: '数列求和', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
计算数列 ak = 1/(k*(k+1)) 的前n项和。

【输入格式】
一个正整数n

【输出格式】
数列前n项和，保留6位小数

【样例】
输入：3
输出：0.833333

【提示】前3项：1/2 + 1/6 + 1/12 = 0.5 + 0.1667 + 0.0833 ≈ 0.75（注意浮点精度）`,
    templates: {
      c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    
    // TODO: 计算数列和
    
    return 0;
}`,
      cpp: `#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    // TODO: 计算数列和
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        // TODO: 计算数列和
    }
}`,
      python: `n = int(input())

# TODO: 计算数列和
`
    },
    solutions: {
      c: `#include <stdio.h>

int main() {
    int n, k;
    double sum = 0;
    scanf("%d", &n);
    
    for (k = 1; k <= n; k++) {
        sum += 1.0 / (k * (k + 1));
    }
    
    printf("%.6f\\n", sum);
    return 0;
}`,
      cpp: `#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    double sum = 0;
    for (int k = 1; k <= n; k++) {
        sum += 1.0 / (k * (k + 1));
    }
    
    cout << fixed << setprecision(6) << sum << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        double sum = 0;
        for (int k = 1; k <= n; k++) {
            sum += 1.0 / (k * (k + 1));
        }
        
        System.out.printf("%.6f%n", sum);
    }
}`,
      python: `n = int(input())

sum_val = 0
for k in range(1, n + 1):
    sum_val += 1.0 / (k * (k + 1))

print(f"{sum_val:.6f}")`
    },
    testCases: [
      { input: '3', expectedOutput: '0.750000', description: '前3项和' },
      { input: '10', expectedOutput: '0.909091', description: '前10项和' }
    ],
    hints: ['注意使用1.0而不是1来避免整数除法', '通项公式：1/(k*(k+1))'],
    explanation: '数列求和的基本循环应用，注意浮点数精度问题'
  },
  {
    id: 'basic-leap-years', category: '基础编程', title: '求N个闰年', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
输入一个年份year，求该年之后（包括该年）的n个闰年并输出。

【闰年条件】
能被4整除但不能被100整除，或者能被400整除

【输入格式】
两个整数：起始年份year 和 需要的闰年数量n

【输出格式】
n个闰年，每行一个

【样例】
输入：2020 5
输出：
2020
2024
2028
2032
2036`,
    templates: {
      c: `#include <stdio.h>

int isLeap(int year) {
    // TODO: 判断闰年
}

int main() {
    int year, n;
    scanf("%d %d", &year, &n);
    
    // TODO: 输出n个闰年
    
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

bool isLeap(int year) {
    // TODO: 判断闰年
}

int main() {
    int year, n;
    cin >> year >> n;
    
    // TODO: 输出n个闰年
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static boolean isLeap(int year) {
        // TODO: 判断闰年
        return false;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int year = sc.nextInt();
        int n = sc.nextInt();
        
        // TODO: 输出n个闰年
    }
}`,
      python: `def is_leap(year):
    # TODO: 判断闰年
    pass

year, n = map(int, input().split())

# TODO: 输出n个闰年
`
    },
    solutions: {
      c: `#include <stdio.h>

int isLeap(int year) {
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
}

int main() {
    int year, n;
    scanf("%d %d", &year, &n);
    
    int count = 0;
    while (count < n) {
        if (isLeap(year)) {
            printf("%d\\n", year);
            count++;
        }
        year++;
    }
    
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

bool isLeap(int year) {
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
}

int main() {
    int year, n;
    cin >> year >> n;
    
    int count = 0;
    while (count < n) {
        if (isLeap(year)) {
            cout << year << endl;
            count++;
        }
        year++;
    }
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static boolean isLeap(int year) {
        return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int year = sc.nextInt();
        int n = sc.nextInt();
        
        int count = 0;
        while (count < n) {
            if (isLeap(year)) {
                System.out.println(year);
                count++;
            }
            year++;
        }
    }
}`,
      python: `def is_leap(year):
    return (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)

year, n = map(int, input().split())

count = 0
while count < n:
    if is_leap(year):
        print(year)
        count += 1
    year += 1`
    },
    testCases: [
      { input: '2020 5', expectedOutput: '2020\n2024\n2028\n2032\n2036', description: '从2020开始5个闰年' }
    ],
    hints: ['闰年条件：(year%4==0 && year%100!=0) || (year%400==0)', '使用while循环和计数器'],
    explanation: '闰年判断是分支和循环的经典练习'
  },
  {
    id: 'basic-calc-e', category: '基础编程', title: '计算自然对数底e', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
使用公式 e = 1 + 1/1! + 1/2! + 1/3! + ... + 1/n! 计算自然对数底e的近似值。
当某项小于给定精度eps时停止计算。

【输入格式】
一个浮点数eps，表示精度（如1e-6）

【输出格式】
e的近似值，保留10位小数

【样例】
输入：1e-6
输出：2.7182818011

【数学背景】e ≈ 2.718281828...`,
    templates: {
      c: `#include <stdio.h>

int main() {
    double eps;
    scanf("%lf", &eps);
    
    // TODO: 计算e
    
    return 0;
}`,
      cpp: `#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double eps;
    cin >> eps;
    
    // TODO: 计算e
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double eps = sc.nextDouble();
        
        // TODO: 计算e
    }
}`,
      python: `eps = float(input())

# TODO: 计算e
`
    },
    solutions: {
      c: `#include <stdio.h>

int main() {
    double eps;
    scanf("%lf", &eps);
    
    double e = 1.0;
    double term = 1.0;  // 当前项
    int n = 1;
    
    while (term > eps) {
        e += term;
        n++;
        term = term / n;  // 递推：1/n! = 1/(n-1)! / n
    }
    
    printf("%.10f\\n", e);
    return 0;
}`,
      cpp: `#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double eps;
    cin >> eps;
    
    double e = 1.0;
    double term = 1.0;
    int n = 1;
    
    while (term > eps) {
        e += term;
        n++;
        term = term / n;
    }
    
    cout << fixed << setprecision(10) << e << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double eps = sc.nextDouble();
        
        double e = 1.0;
        double term = 1.0;
        int n = 1;
        
        while (term > eps) {
            e += term;
            n++;
            term = term / n;
        }
        
        System.out.printf("%.10f%n", e);
    }
}`,
      python: `eps = float(input())

e = 1.0
term = 1.0
n = 1

while term > eps:
    e += term
    n += 1
    term = term / n

print(f"{e:.10f}")`
    },
    testCases: [
      { input: '1e-6', expectedOutput: '2.7182818011', description: '精度1e-6' }
    ],
    hints: ['利用递推关系：1/n! = 1/(n-1)! / n', '避免直接计算阶乘导致溢出'],
    explanation: '利用级数展开和递推关系高效计算，避免阶乘溢出'
  },
  {
    id: 'basic-99-table', category: '基础编程', title: '打印99乘法表', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
打印99乘法表（下三角形式）

【输出格式】
每行从1乘到该行号，格式为"a*b=c"，用制表符分隔

【样例输出】
1*1=1
1*2=2	2*2=4
1*3=3	2*3=6	3*3=9
...
1*9=9	2*9=18	3*9=27	...	9*9=81`,
    templates: {
      c: `#include <stdio.h>

int main() {
    // TODO: 打印99乘法表
    
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    // TODO: 打印99乘法表
    
    return 0;
}`,
      java: `public class Main {
    public static void main(String[] args) {
        // TODO: 打印99乘法表
    }
}`,
      python: `# TODO: 打印99乘法表
`
    },
    solutions: {
      c: `#include <stdio.h>

int main() {
    for (int i = 1; i <= 9; i++) {
        for (int j = 1; j <= i; j++) {
            printf("%d*%d=%d", j, i, i * j);
            if (j < i) printf("\\t");
        }
        printf("\\n");
    }
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 9; i++) {
        for (int j = 1; j <= i; j++) {
            cout << j << "*" << i << "=" << i * j;
            if (j < i) cout << "\\t";
        }
        cout << endl;
    }
    return 0;
}`,
      java: `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 9; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print(j + "*" + i + "=" + (i * j));
                if (j < i) System.out.print("\\t");
            }
            System.out.println();
        }
    }
}`,
      python: `for i in range(1, 10):
    row = []
    for j in range(1, i + 1):
        row.append(f"{j}*{i}={i*j}")
    print("\\t".join(row))`
    },
    testCases: [
      { input: '', expectedOutput: '1*1=1\n1*2=2\t2*2=4\n1*3=3\t2*3=6\t3*3=9\n1*4=4\t2*4=8\t3*4=12\t4*4=16\n1*5=5\t2*5=10\t3*5=15\t4*5=20\t5*5=25\n1*6=6\t2*6=12\t3*6=18\t4*6=24\t5*6=30\t6*6=36\n1*7=7\t2*7=14\t3*7=21\t4*7=28\t5*7=35\t6*7=42\t7*7=49\n1*8=8\t2*8=16\t3*8=24\t4*8=32\t5*8=40\t6*8=48\t7*8=56\t8*8=64\n1*9=9\t2*9=18\t3*9=27\t4*9=36\t5*9=45\t6*9=54\t7*9=63\t8*9=72\t9*9=81', description: '99乘法表' }
    ],
    hints: ['外层循环控制行（1-9）', '内层循环控制列（1到当前行号）'],
    explanation: '嵌套循环的经典应用'
  },
  {
    id: 'basic-prime-100', category: '基础编程', title: '打印100以内素数', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
打印100以内的所有素数。

【素数定义】
大于1的自然数，除了1和它本身外，不能被其他自然数整除。

【输出格式】
每行输出一个素数

【样例输出】
2
3
5
7
11
...
97`,
    templates: {
      c: `#include <stdio.h>

int isPrime(int n) {
    // TODO: 判断是否为素数
}

int main() {
    // TODO: 打印100以内素数
    
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

bool isPrime(int n) {
    // TODO: 判断是否为素数
}

int main() {
    // TODO: 打印100以内素数
    
    return 0;
}`,
      java: `public class Main {
    static boolean isPrime(int n) {
        // TODO: 判断是否为素数
        return false;
    }
    
    public static void main(String[] args) {
        // TODO: 打印100以内素数
    }
}`,
      python: `def is_prime(n):
    # TODO: 判断是否为素数
    pass

# TODO: 打印100以内素数
`
    },
    solutions: {
      c: `#include <stdio.h>

int isPrime(int n) {
    if (n < 2) return 0;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return 0;
    }
    return 1;
}

int main() {
    for (int i = 2; i <= 100; i++) {
        if (isPrime(i)) {
            printf("%d\\n", i);
        }
    }
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}

int main() {
    for (int i = 2; i <= 100; i++) {
        if (isPrime(i)) {
            cout << i << endl;
        }
    }
    return 0;
}`,
      java: `public class Main {
    static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) return false;
        }
        return true;
    }
    
    public static void main(String[] args) {
        for (int i = 2; i <= 100; i++) {
            if (isPrime(i)) {
                System.out.println(i);
            }
        }
    }
}`,
      python: `def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

for i in range(2, 101):
    if is_prime(i):
        print(i)`
    },
    testCases: [
      { input: '', expectedOutput: '2\n3\n5\n7\n11\n13\n17\n19\n23\n29\n31\n37\n41\n43\n47\n53\n59\n61\n67\n71\n73\n79\n83\n89\n97', description: '100以内素数' }
    ],
    hints: ['只需检查到sqrt(n)即可', '2是最小的素数'],
    explanation: '素数判断优化：只检查到平方根'
  },
  {
    id: 'basic-gcd', category: '基础编程', title: '辗转相除法求GCD', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
使用欧几里得辗转相除法求两个正整数的最大公约数(GCD)。

【算法原理】
gcd(a, b) = gcd(b, a % b)，当b=0时，gcd = a

【输入格式】
两个正整数 u v

【输出格式】
它们的最大公约数

【样例】
输入：18 14
输出：2`,
    templates: {
      c: `#include <stdio.h>

int gcd(int u, int v) {
    // TODO: 辗转相除法
}

int main() {
    int u, v;
    scanf("%d %d", &u, &v);
    printf("%d\\n", gcd(u, v));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int gcd(int u, int v) {
    // TODO: 辗转相除法
}

int main() {
    int u, v;
    cin >> u >> v;
    cout << gcd(u, v) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static int gcd(int u, int v) {
        // TODO: 辗转相除法
        return 0;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int u = sc.nextInt();
        int v = sc.nextInt();
        System.out.println(gcd(u, v));
    }
}`,
      python: `def gcd(u, v):
    # TODO: 辗转相除法
    pass

u, v = map(int, input().split())
print(gcd(u, v))
`
    },
    solutions: {
      c: `#include <stdio.h>

int gcd(int u, int v) {
    while (v != 0) {
        int r = u % v;
        u = v;
        v = r;
    }
    return u;
}

int main() {
    int u, v;
    scanf("%d %d", &u, &v);
    printf("%d\\n", gcd(u, v));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int gcd(int u, int v) {
    while (v != 0) {
        int r = u % v;
        u = v;
        v = r;
    }
    return u;
}

int main() {
    int u, v;
    cin >> u >> v;
    cout << gcd(u, v) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static int gcd(int u, int v) {
        while (v != 0) {
            int r = u % v;
            u = v;
            v = r;
        }
        return u;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int u = sc.nextInt();
        int v = sc.nextInt();
        System.out.println(gcd(u, v));
    }
}`,
      python: `def gcd(u, v):
    while v != 0:
        u, v = v, u % v
    return u

u, v = map(int, input().split())
print(gcd(u, v))`
    },
    testCases: [
      { input: '18 14', expectedOutput: '2', description: 'gcd(18,14)=2' },
      { input: '48 36', expectedOutput: '12', description: 'gcd(48,36)=12' }
    ],
    hints: ['gcd(a,b) = gcd(b, a%b)', '当第二个数为0时，第一个数就是GCD'],
    explanation: '欧几里得算法是求GCD的经典高效算法，时间复杂度O(log(min(a,b)))'
  },
  {
    id: 'basic-digit-factorial-sum', category: '基础编程', title: '各位数字阶乘和', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
输入一个正整数N，计算N的各位数字的阶乘之和。

例如：N=1234，计算 1! + 2! + 3! + 4! = 1 + 2 + 6 + 24 = 33

【输入格式】
一个正整数N

【输出格式】
各位数字阶乘之和

【样例】
输入：1234
输出：33`,
    templates: {
      c: `#include <stdio.h>

int factorial(int n) {
    // TODO: 计算n的阶乘
}

int main() {
    int N;
    scanf("%d", &N);
    
    // TODO: 计算各位数字阶乘和
    
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int factorial(int n) {
    // TODO: 计算n的阶乘
}

int main() {
    int N;
    cin >> N;
    
    // TODO: 计算各位数字阶乘和
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static int factorial(int n) {
        // TODO: 计算n的阶乘
        return 0;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int N = sc.nextInt();
        
        // TODO: 计算各位数字阶乘和
    }
}`,
      python: `import math

N = int(input())

# TODO: 计算各位数字阶乘和
`
    },
    solutions: {
      c: `#include <stdio.h>

int factorial(int n) {
    int result = 1;
    for (int i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

int main() {
    int N, sum = 0;
    scanf("%d", &N);
    
    while (N != 0) {
        int digit = N % 10;
        sum += factorial(digit);
        N /= 10;
    }
    
    printf("%d\\n", sum);
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int factorial(int n) {
    int result = 1;
    for (int i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

int main() {
    int N, sum = 0;
    cin >> N;
    
    while (N != 0) {
        int digit = N % 10;
        sum += factorial(digit);
        N /= 10;
    }
    
    cout << sum << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static int factorial(int n) {
        int result = 1;
        for (int i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int N = sc.nextInt();
        
        int sum = 0;
        while (N != 0) {
            int digit = N % 10;
            sum += factorial(digit);
            N /= 10;
        }
        
        System.out.println(sum);
    }
}`,
      python: `import math

N = int(input())

sum_val = 0
while N != 0:
    digit = N % 10
    sum_val += math.factorial(digit)
    N //= 10

print(sum_val)`
    },
    testCases: [
      { input: '1234', expectedOutput: '33', description: '1!+2!+3!+4!=33' },
      { input: '145', expectedOutput: '145', description: '145是自恋数' }
    ],
    hints: ['用N%10取最低位', '用N/10去掉最低位', '循环处理每一位'],
    explanation: '分离数字各位的经典方法：取模和整除'
  },
  {
    id: 'basic-chicken', category: '基础编程', title: '百钱百鸡问题', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
鸡翁一，值钱五；鸡母一，值钱三；鸡雏三，值钱一。
百钱买百鸡，问鸡翁、母、雏各几何？

即：公鸡5元一只，母鸡3元一只，小鸡1元3只。
用100元钱买100只鸡，求所有可能的购买方案。

【输出格式】
每行输出一种方案：公鸡数 母鸡数 小鸡数

【样例输出】
0 25 75
4 18 78
8 11 81
12 4 84`,
    templates: {
      c: `#include <stdio.h>

int main() {
    // TODO: 百钱百鸡问题
    
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    // TODO: 百钱百鸡问题
    
    return 0;
}`,
      java: `public class Main {
    public static void main(String[] args) {
        // TODO: 百钱百鸡问题
    }
}`,
      python: `# TODO: 百钱百鸡问题
`
    },
    solutions: {
      c: `#include <stdio.h>

int main() {
    for (int x = 0; x <= 20; x++) {           // 公鸡最多20只
        for (int y = 0; y <= 33; y++) {       // 母鸡最多33只
            int z = 100 - x - y;              // 小鸡数量
            if (z >= 0 && z % 3 == 0) {       // 小鸡必须是3的倍数
                if (5 * x + 3 * y + z / 3 == 100) {  // 百钱
                    printf("%d %d %d\\n", x, y, z);
                }
            }
        }
    }
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    for (int x = 0; x <= 20; x++) {
        for (int y = 0; y <= 33; y++) {
            int z = 100 - x - y;
            if (z >= 0 && z % 3 == 0) {
                if (5 * x + 3 * y + z / 3 == 100) {
                    cout << x << " " << y << " " << z << endl;
                }
            }
        }
    }
    return 0;
}`,
      java: `public class Main {
    public static void main(String[] args) {
        for (int x = 0; x <= 20; x++) {
            for (int y = 0; y <= 33; y++) {
                int z = 100 - x - y;
                if (z >= 0 && z % 3 == 0) {
                    if (5 * x + 3 * y + z / 3 == 100) {
                        System.out.println(x + " " + y + " " + z);
                    }
                }
            }
        }
    }
}`,
      python: `for x in range(21):      # 公鸡最多20只
    for y in range(34):  # 母鸡最多33只
        z = 100 - x - y
        if z >= 0 and z % 3 == 0:
            if 5 * x + 3 * y + z // 3 == 100:
                print(x, y, z)`
    },
    testCases: [
      { input: '', expectedOutput: '0 25 75\n4 18 78\n8 11 81\n12 4 84', description: '所有方案' }
    ],
    hints: ['公鸡最多100/5=20只', '利用x+y+z=100消去一个变量', '小鸡必须是3的倍数'],
    explanation: '经典穷举问题，可用两重循环并通过约束减少搜索空间'
  },
  {
    id: 'basic-calculator', category: '基础编程', title: '简易计算器', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
设计一个简易计算器，输入两个数和一个运算符(+、-、*、/)，输出计算结果。

【输入格式】
一行：数字1 运算符 数字2

【输出格式】
计算结果，保留2位小数。除数为0时输出"Error"

【样例1】
输入：3.5 + 2.5
输出：6.00

【样例2】
输入：10 / 0
输出：Error`,
    templates: {
      c: `#include <stdio.h>

int main() {
    float a, b;
    char op;
    scanf("%f %c %f", &a, &op, &b);
    
    // TODO: 实现计算器
    
    return 0;
}`,
      cpp: `#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    float a, b;
    char op;
    cin >> a >> op >> b;
    
    // TODO: 实现计算器
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        float a = sc.nextFloat();
        char op = sc.next().charAt(0);
        float b = sc.nextFloat();
        
        // TODO: 实现计算器
    }
}`,
      python: `line = input().split()
a = float(line[0])
op = line[1]
b = float(line[2])

# TODO: 实现计算器
`
    },
    solutions: {
      c: `#include <stdio.h>

int main() {
    float a, b, result;
    char op;
    scanf("%f %c %f", &a, &op, &b);
    
    switch (op) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
        case '/':
            if (b == 0) {
                printf("Error\\n");
                return 0;
            }
            result = a / b;
            break;
        default:
            printf("Error\\n");
            return 0;
    }
    
    printf("%.2f\\n", result);
    return 0;
}`,
      cpp: `#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    float a, b, result;
    char op;
    cin >> a >> op >> b;
    
    switch (op) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
        case '/':
            if (b == 0) {
                cout << "Error" << endl;
                return 0;
            }
            result = a / b;
            break;
        default:
            cout << "Error" << endl;
            return 0;
    }
    
    cout << fixed << setprecision(2) << result << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        float a = sc.nextFloat();
        char op = sc.next().charAt(0);
        float b = sc.nextFloat();
        
        float result;
        switch (op) {
            case '+': result = a + b; break;
            case '-': result = a - b; break;
            case '*': result = a * b; break;
            case '/':
                if (b == 0) {
                    System.out.println("Error");
                    return;
                }
                result = a / b;
                break;
            default:
                System.out.println("Error");
                return;
        }
        
        System.out.printf("%.2f%n", result);
    }
}`,
      python: `line = input().split()
a = float(line[0])
op = line[1]
b = float(line[2])

if op == '+':
    result = a + b
elif op == '-':
    result = a - b
elif op == '*':
    result = a * b
elif op == '/':
    if b == 0:
        print("Error")
        exit()
    result = a / b
else:
    print("Error")
    exit()

print(f"{result:.2f}")`
    },
    testCases: [
      { input: '3.5 + 2.5', expectedOutput: '6.00', description: '加法' },
      { input: '10 / 0', expectedOutput: 'Error', description: '除零错误' }
    ],
    hints: ['使用switch-case处理不同运算符', '注意处理除数为0的情况'],
    explanation: 'switch-case语句的典型应用'
  },
  {
    id: 'basic-quadratic', category: '基础编程', title: '一元二次方程求解', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
求一元二次方程 ax² + bx + c = 0 的根。

【输入格式】
三个实数 a b c（a≠0）

【输出格式】
- 若有两个不等实根，输出 "x1=... x2=..."（x1<x2，保留2位小数）
- 若有两个相等实根，输出 "x1=x2=..."
- 若无实根，输出 "No real root"

【样例1】
输入：1 -5 6
输出：x1=2.00 x2=3.00

【样例2】
输入：1 2 1
输出：x1=x2=-1.00

【样例3】
输入：1 1 1
输出：No real root`,
    templates: {
      c: `#include <stdio.h>
#include <math.h>

int main() {
    double a, b, c;
    scanf("%lf %lf %lf", &a, &b, &c);
    
    // TODO: 求解一元二次方程
    
    return 0;
}`,
      cpp: `#include <iostream>
#include <cmath>
#include <iomanip>
using namespace std;

int main() {
    double a, b, c;
    cin >> a >> b >> c;
    
    // TODO: 求解一元二次方程
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double a = sc.nextDouble();
        double b = sc.nextDouble();
        double c = sc.nextDouble();
        
        // TODO: 求解一元二次方程
    }
}`,
      python: `import math

a, b, c = map(float, input().split())

# TODO: 求解一元二次方程
`
    },
    solutions: {
      c: `#include <stdio.h>
#include <math.h>

int main() {
    double a, b, c;
    scanf("%lf %lf %lf", &a, &b, &c);
    
    double delta = b * b - 4 * a * c;
    
    if (delta > 0) {
        double x1 = (-b - sqrt(delta)) / (2 * a);
        double x2 = (-b + sqrt(delta)) / (2 * a);
        if (x1 > x2) { double t = x1; x1 = x2; x2 = t; }
        printf("x1=%.2f x2=%.2f\\n", x1, x2);
    } else if (delta == 0) {
        double x = -b / (2 * a);
        printf("x1=x2=%.2f\\n", x);
    } else {
        printf("No real root\\n");
    }
    
    return 0;
}`,
      cpp: `#include <iostream>
#include <cmath>
#include <iomanip>
using namespace std;

int main() {
    double a, b, c;
    cin >> a >> b >> c;
    
    double delta = b * b - 4 * a * c;
    
    if (delta > 0) {
        double x1 = (-b - sqrt(delta)) / (2 * a);
        double x2 = (-b + sqrt(delta)) / (2 * a);
        if (x1 > x2) swap(x1, x2);
        cout << fixed << setprecision(2) << "x1=" << x1 << " x2=" << x2 << endl;
    } else if (delta == 0) {
        double x = -b / (2 * a);
        cout << fixed << setprecision(2) << "x1=x2=" << x << endl;
    } else {
        cout << "No real root" << endl;
    }
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double a = sc.nextDouble();
        double b = sc.nextDouble();
        double c = sc.nextDouble();
        
        double delta = b * b - 4 * a * c;
        
        if (delta > 0) {
            double x1 = (-b - Math.sqrt(delta)) / (2 * a);
            double x2 = (-b + Math.sqrt(delta)) / (2 * a);
            if (x1 > x2) { double t = x1; x1 = x2; x2 = t; }
            System.out.printf("x1=%.2f x2=%.2f%n", x1, x2);
        } else if (delta == 0) {
            double x = -b / (2 * a);
            System.out.printf("x1=x2=%.2f%n", x);
        } else {
            System.out.println("No real root");
        }
    }
}`,
      python: `import math

a, b, c = map(float, input().split())

delta = b * b - 4 * a * c

if delta > 0:
    x1 = (-b - math.sqrt(delta)) / (2 * a)
    x2 = (-b + math.sqrt(delta)) / (2 * a)
    if x1 > x2:
        x1, x2 = x2, x1
    print(f"x1={x1:.2f} x2={x2:.2f}")
elif delta == 0:
    x = -b / (2 * a)
    print(f"x1=x2={x:.2f}")
else:
    print("No real root")`
    },
    testCases: [
      { input: '1 -5 6', expectedOutput: 'x1=2.00 x2=3.00', description: '两个不等实根' },
      { input: '1 2 1', expectedOutput: 'x1=x2=-1.00', description: '两个相等实根' },
      { input: '1 1 1', expectedOutput: 'No real root', description: '无实根' }
    ],
    hints: ['判别式 Δ = b² - 4ac', 'Δ>0两不等实根，Δ=0两等实根，Δ<0无实根'],
    explanation: '分支结构的典型应用，根据判别式分情况讨论'
  },
  {
    id: 'basic-pointer-swap', category: '基础编程', title: '指针交换两数', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
使用指针实现两个整数的交换，并按从小到大的顺序输出。

【输入格式】
两个整数 a b

【输出格式】
较小数 较大数

【样例】
输入：38 25
输出：25 38`,
    templates: {
      c: `#include <stdio.h>

void swap(int *pa, int *pb) {
    // TODO: 通过指针交换两数
}

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    
    // TODO: 如果a>b则交换，然后输出
    
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

void swap(int *pa, int *pb) {
    // TODO: 通过指针交换两数
}

int main() {
    int a, b;
    cin >> a >> b;
    
    // TODO: 如果a>b则交换，然后输出
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        
        // TODO: 如果a>b则交换，然后输出
    }
}`,
      python: `a, b = map(int, input().split())

# TODO: 如果a>b则交换，然后输出
`
    },
    solutions: {
      c: `#include <stdio.h>

void swap(int *pa, int *pb) {
    int temp = *pa;
    *pa = *pb;
    *pb = temp;
}

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    
    if (a > b) {
        swap(&a, &b);
    }
    
    printf("%d %d\\n", a, b);
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

void mySwap(int *pa, int *pb) {
    int temp = *pa;
    *pa = *pb;
    *pb = temp;
}

int main() {
    int a, b;
    cin >> a >> b;
    
    if (a > b) {
        mySwap(&a, &b);
    }
    
    cout << a << " " << b << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        
        if (a > b) {
            int temp = a;
            a = b;
            b = temp;
        }
        
        System.out.println(a + " " + b);
    }
}`,
      python: `a, b = map(int, input().split())

if a > b:
    a, b = b, a

print(a, b)`
    },
    testCases: [
      { input: '38 25', expectedOutput: '25 38', description: '需要交换' },
      { input: '10 20', expectedOutput: '10 20', description: '无需交换' }
    ],
    hints: ['使用临时变量交换', 'C语言通过指针传递可以修改实参'],
    explanation: '指针传参的经典应用，理解值传递和地址传递的区别'
  },
  {
    id: 'basic-hex-to-dec', category: '基础编程', title: '十六进制转十进制', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
将一个十六进制整数字符串转换为十进制整数。

【输入格式】
一个十六进制字符串（可包含0-9, A-F, a-f）

【输出格式】
对应的十进制整数

【样例】
输入：1A
输出：26

输入：FF
输出：255`,
    templates: {
      c: `#include <stdio.h>
#include <string.h>

int hexToInt(char c) {
    // TODO: 将单个十六进制字符转换为数值
}

int main() {
    char hex[100];
    scanf("%s", hex);
    
    // TODO: 转换十六进制字符串为十进制
    
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

int hexToInt(char c) {
    // TODO: 将单个十六进制字符转换为数值
}

int main() {
    string hex;
    cin >> hex;
    
    // TODO: 转换十六进制字符串为十进制
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static int hexToInt(char c) {
        // TODO: 将单个十六进制字符转换为数值
        return 0;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String hex = sc.next();
        
        // TODO: 转换十六进制字符串为十进制
    }
}`,
      python: `hex_str = input()

# TODO: 转换十六进制字符串为十进制
`
    },
    solutions: {
      c: `#include <stdio.h>
#include <string.h>

int hexToInt(char c) {
    if (c >= '0' && c <= '9') return c - '0';
    if (c >= 'A' && c <= 'F') return c - 'A' + 10;
    if (c >= 'a' && c <= 'f') return c - 'a' + 10;
    return 0;
}

int main() {
    char hex[100];
    scanf("%s", hex);
    
    int result = 0;
    int len = strlen(hex);
    for (int i = 0; i < len; i++) {
        result = result * 16 + hexToInt(hex[i]);
    }
    
    printf("%d\\n", result);
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

int hexToInt(char c) {
    if (c >= '0' && c <= '9') return c - '0';
    if (c >= 'A' && c <= 'F') return c - 'A' + 10;
    if (c >= 'a' && c <= 'f') return c - 'a' + 10;
    return 0;
}

int main() {
    string hex;
    cin >> hex;
    
    int result = 0;
    for (char c : hex) {
        result = result * 16 + hexToInt(c);
    }
    
    cout << result << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static int hexToInt(char c) {
        if (c >= '0' && c <= '9') return c - '0';
        if (c >= 'A' && c <= 'F') return c - 'A' + 10;
        if (c >= 'a' && c <= 'f') return c - 'a' + 10;
        return 0;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String hex = sc.next();
        
        int result = 0;
        for (char c : hex.toCharArray()) {
            result = result * 16 + hexToInt(c);
        }
        
        System.out.println(result);
    }
}`,
      python: `hex_str = input()

def hex_to_int(c):
    if '0' <= c <= '9':
        return ord(c) - ord('0')
    if 'A' <= c <= 'F':
        return ord(c) - ord('A') + 10
    if 'a' <= c <= 'f':
        return ord(c) - ord('a') + 10
    return 0

result = 0
for c in hex_str:
    result = result * 16 + hex_to_int(c)

print(result)

# 或者直接用内置函数: print(int(hex_str, 16))`
    },
    testCases: [
      { input: '1A', expectedOutput: '26', description: '1A=26' },
      { input: 'FF', expectedOutput: '255', description: 'FF=255' }
    ],
    hints: ['A-F对应10-15', '使用秦九韶算法累加：result = result * 16 + digit'],
    explanation: '进制转换的经典应用，理解位权展开'
  },
  {
    id: 'basic-yang-hui', category: '基础编程', title: '打印杨辉三角', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
打印杨辉三角的前n行。

【杨辉三角性质】
- 每行第一个和最后一个数为1
- 其他位置的数等于上一行相邻两数之和

【输入格式】
一个正整数n（n≤15）

【输出格式】
杨辉三角前n行，每个数占4位宽度

【样例】
输入：5
输出：
   1
   1   1
   1   2   1
   1   3   3   1
   1   4   6   4   1`,
    templates: {
      c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    
    // TODO: 打印杨辉三角
    
    return 0;
}`,
      cpp: `#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    // TODO: 打印杨辉三角
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        // TODO: 打印杨辉三角
    }
}`,
      python: `n = int(input())

# TODO: 打印杨辉三角
`
    },
    solutions: {
      c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    
    int a[20] = {0};
    a[0] = 1;
    
    for (int i = 0; i < n; i++) {
        // 从后往前更新，避免覆盖
        for (int j = i; j > 0; j--) {
            a[j] = a[j] + a[j-1];
        }
        
        // 打印当前行
        for (int j = 0; j <= i; j++) {
            printf("%4d", a[j]);
        }
        printf("\\n");
    }
    
    return 0;
}`,
      cpp: `#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    int a[20] = {0};
    a[0] = 1;
    
    for (int i = 0; i < n; i++) {
        for (int j = i; j > 0; j--) {
            a[j] = a[j] + a[j-1];
        }
        
        for (int j = 0; j <= i; j++) {
            cout << setw(4) << a[j];
        }
        cout << endl;
    }
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        int[] a = new int[20];
        a[0] = 1;
        
        for (int i = 0; i < n; i++) {
            for (int j = i; j > 0; j--) {
                a[j] = a[j] + a[j-1];
            }
            
            for (int j = 0; j <= i; j++) {
                System.out.printf("%4d", a[j]);
            }
            System.out.println();
        }
    }
}`,
      python: `n = int(input())

a = [0] * 20
a[0] = 1

for i in range(n):
    for j in range(i, 0, -1):
        a[j] = a[j] + a[j-1]
    
    for j in range(i + 1):
        print(f"{a[j]:4d}", end="")
    print()`
    },
    testCases: [
      { input: '5', expectedOutput: '   1\n   1   1\n   1   2   1\n   1   3   3   1\n   1   4   6   4   1', description: '前5行' }
    ],
    hints: ['可以只用一个一维数组', '从后往前更新避免覆盖'],
    explanation: '利用递推关系：a[j] = a[j] + a[j-1]，从后往前更新'
  },
  {
    id: 'basic-bubble-sort', category: '基础编程', title: '冒泡排序', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
使用冒泡排序算法对n个整数进行从小到大排序。

【算法思想】
反复比较相邻元素，如果逆序则交换，直到没有交换发生。

【输入格式】
第一行：整数n
第二行：n个整数

【输出格式】
排序后的n个整数，空格分隔

【样例】
输入：
5
64 34 25 12 22
输出：
12 22 25 34 64`,
    templates: {
      c: `#include <stdio.h>

void bubbleSort(int arr[], int n) {
    // TODO: 冒泡排序
}

int main() {
    int n;
    scanf("%d", &n);
    int arr[100];
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    
    bubbleSort(arr, n);
    
    for (int i = 0; i < n; i++) {
        printf("%d", arr[i]);
        if (i < n - 1) printf(" ");
    }
    printf("\\n");
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

void bubbleSort(int arr[], int n) {
    // TODO: 冒泡排序
}

int main() {
    int n;
    cin >> n;
    int arr[100];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    bubbleSort(arr, n);
    
    for (int i = 0; i < n; i++) {
        cout << arr[i];
        if (i < n - 1) cout << " ";
    }
    cout << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static void bubbleSort(int[] arr) {
        // TODO: 冒泡排序
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        
        bubbleSort(arr);
        
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            sb.append(arr[i]);
            if (i < n - 1) sb.append(" ");
        }
        System.out.println(sb);
    }
}`,
      python: `n = int(input())
arr = list(map(int, input().split()))

# TODO: 冒泡排序

print(" ".join(map(str, arr)))
`
    },
    solutions: {
      c: `#include <stdio.h>

void bubbleSort(int arr[], int n) {
    int flag = 1;
    while (flag) {
        flag = 0;
        for (int i = 0; i < n - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                int temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                flag = 1;
            }
        }
    }
}

int main() {
    int n;
    scanf("%d", &n);
    int arr[100];
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    
    bubbleSort(arr, n);
    
    for (int i = 0; i < n; i++) {
        printf("%d", arr[i]);
        if (i < n - 1) printf(" ");
    }
    printf("\\n");
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

void bubbleSort(int arr[], int n) {
    bool flag = true;
    while (flag) {
        flag = false;
        for (int i = 0; i < n - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                swap(arr[i], arr[i + 1]);
                flag = true;
            }
        }
    }
}

int main() {
    int n;
    cin >> n;
    int arr[100];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    bubbleSort(arr, n);
    
    for (int i = 0; i < n; i++) {
        cout << arr[i];
        if (i < n - 1) cout << " ";
    }
    cout << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static void bubbleSort(int[] arr) {
        boolean flag = true;
        while (flag) {
            flag = false;
            for (int i = 0; i < arr.length - 1; i++) {
                if (arr[i] > arr[i + 1]) {
                    int temp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = temp;
                    flag = true;
                }
            }
        }
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        
        bubbleSort(arr);
        
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            sb.append(arr[i]);
            if (i < n - 1) sb.append(" ");
        }
        System.out.println(sb);
    }
}`,
      python: `n = int(input())
arr = list(map(int, input().split()))

flag = True
while flag:
    flag = False
    for i in range(n - 1):
        if arr[i] > arr[i + 1]:
            arr[i], arr[i + 1] = arr[i + 1], arr[i]
            flag = True

print(" ".join(map(str, arr)))`
    },
    testCases: [
      { input: '5\n64 34 25 12 22', expectedOutput: '12 22 25 34 64', description: '基本测试' }
    ],
    hints: ['使用flag标记本轮是否有交换', '没有交换则已排好序'],
    explanation: '冒泡排序时间复杂度O(n²)，优化版本在已排序时提前结束'
  },
  {
    id: 'basic-selection-sort', category: '基础编程', title: '选择排序', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
使用选择排序算法对n个整数进行从小到大排序。

【算法思想】
每轮从未排序部分选择最小元素，放到已排序部分末尾。

【输入格式】
第一行：整数n
第二行：n个整数

【输出格式】
排序后的n个整数，空格分隔

【样例】
输入：
5
64 25 12 22 11
输出：
11 12 22 25 64`,
    templates: {
      c: `#include <stdio.h>

void selectionSort(int arr[], int n) {
    // TODO: 选择排序
}

int main() {
    int n;
    scanf("%d", &n);
    int arr[100];
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    
    selectionSort(arr, n);
    
    for (int i = 0; i < n; i++) {
        printf("%d", arr[i]);
        if (i < n - 1) printf(" ");
    }
    printf("\\n");
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

void selectionSort(int arr[], int n) {
    // TODO: 选择排序
}

int main() {
    int n;
    cin >> n;
    int arr[100];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    selectionSort(arr, n);
    
    for (int i = 0; i < n; i++) {
        cout << arr[i];
        if (i < n - 1) cout << " ";
    }
    cout << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static void selectionSort(int[] arr) {
        // TODO: 选择排序
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        
        selectionSort(arr);
        
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            sb.append(arr[i]);
            if (i < n - 1) sb.append(" ");
        }
        System.out.println(sb);
    }
}`,
      python: `n = int(input())
arr = list(map(int, input().split()))

# TODO: 选择排序

print(" ".join(map(str, arr)))
`
    },
    solutions: {
      c: `#include <stdio.h>

void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx != i) {
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
}

int main() {
    int n;
    scanf("%d", &n);
    int arr[100];
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    
    selectionSort(arr, n);
    
    for (int i = 0; i < n; i++) {
        printf("%d", arr[i]);
        if (i < n - 1) printf(" ");
    }
    printf("\\n");
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx != i) {
            swap(arr[i], arr[minIdx]);
        }
    }
}

int main() {
    int n;
    cin >> n;
    int arr[100];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    selectionSort(arr, n);
    
    for (int i = 0; i < n; i++) {
        cout << arr[i];
        if (i < n - 1) cout << " ";
    }
    cout << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static void selectionSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            if (minIdx != i) {
                int temp = arr[i];
                arr[i] = arr[minIdx];
                arr[minIdx] = temp;
            }
        }
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        
        selectionSort(arr);
        
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            sb.append(arr[i]);
            if (i < n - 1) sb.append(" ");
        }
        System.out.println(sb);
    }
}`,
      python: `n = int(input())
arr = list(map(int, input().split()))

for i in range(n - 1):
    min_idx = i
    for j in range(i + 1, n):
        if arr[j] < arr[min_idx]:
            min_idx = j
    if min_idx != i:
        arr[i], arr[min_idx] = arr[min_idx], arr[i]

print(" ".join(map(str, arr)))`
    },
    testCases: [
      { input: '5\n64 25 12 22 11', expectedOutput: '11 12 22 25 64', description: '基本测试' }
    ],
    hints: ['外层循环确定位置', '内层循环找最小值下标'],
    explanation: '选择排序时间复杂度O(n²)，交换次数最少的排序算法'
  },
  {
    id: 'basic-insertion-sort', category: '基础编程', title: '插入排序', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
使用插入排序算法对n个整数进行从小到大排序。

【算法思想】
将每个元素插入到已排序部分的正确位置。

【输入格式】
第一行：整数n
第二行：n个整数

【输出格式】
排序后的n个整数，空格分隔

【样例】
输入：
5
12 11 13 5 6
输出：
5 6 11 12 13`,
    templates: {
      c: `#include <stdio.h>

void insertionSort(int arr[], int n) {
    // TODO: 插入排序
}

int main() {
    int n;
    scanf("%d", &n);
    int arr[100];
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    
    insertionSort(arr, n);
    
    for (int i = 0; i < n; i++) {
        printf("%d", arr[i]);
        if (i < n - 1) printf(" ");
    }
    printf("\\n");
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

void insertionSort(int arr[], int n) {
    // TODO: 插入排序
}

int main() {
    int n;
    cin >> n;
    int arr[100];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    insertionSort(arr, n);
    
    for (int i = 0; i < n; i++) {
        cout << arr[i];
        if (i < n - 1) cout << " ";
    }
    cout << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static void insertionSort(int[] arr) {
        // TODO: 插入排序
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        
        insertionSort(arr);
        
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            sb.append(arr[i]);
            if (i < n - 1) sb.append(" ");
        }
        System.out.println(sb);
    }
}`,
      python: `n = int(input())
arr = list(map(int, input().split()))

# TODO: 插入排序

print(" ".join(map(str, arr)))
`
    },
    solutions: {
      c: `#include <stdio.h>

void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

int main() {
    int n;
    scanf("%d", &n);
    int arr[100];
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    
    insertionSort(arr, n);
    
    for (int i = 0; i < n; i++) {
        printf("%d", arr[i]);
        if (i < n - 1) printf(" ");
    }
    printf("\\n");
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

int main() {
    int n;
    cin >> n;
    int arr[100];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    insertionSort(arr, n);
    
    for (int i = 0; i < n; i++) {
        cout << arr[i];
        if (i < n - 1) cout << " ";
    }
    cout << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static void insertionSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        
        insertionSort(arr);
        
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            sb.append(arr[i]);
            if (i < n - 1) sb.append(" ");
        }
        System.out.println(sb);
    }
}`,
      python: `n = int(input())
arr = list(map(int, input().split()))

for i in range(1, n):
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key:
        arr[j + 1] = arr[j]
        j -= 1
    arr[j + 1] = key

print(" ".join(map(str, arr)))`
    },
    testCases: [
      { input: '5\n12 11 13 5 6', expectedOutput: '5 6 11 12 13', description: '基本测试' }
    ],
    hints: ['先保存当前元素', '向后移动比它大的元素', '找到位置后插入'],
    explanation: '插入排序时间复杂度O(n²)，对基本有序的数组效率高'
  },
  {
    id: 'basic-linear-search', category: '基础编程', title: '顺序查找', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
在数组中顺序查找指定的元素，返回其下标（从0开始）。

【输入格式】
第一行：数组长度n和要查找的数key
第二行：n个整数

【输出格式】
元素的下标，未找到输出-1

【样例】
输入：
5 25
10 20 25 30 40
输出：
2`,
    templates: {
      c: `#include <stdio.h>

int linearSearch(int arr[], int n, int key) {
    // TODO: 顺序查找
}

int main() {
    int n, key;
    scanf("%d %d", &n, &key);
    int arr[100];
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    
    printf("%d\\n", linearSearch(arr, n, key));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int linearSearch(int arr[], int n, int key) {
    // TODO: 顺序查找
}

int main() {
    int n, key;
    cin >> n >> key;
    int arr[100];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    cout << linearSearch(arr, n, key) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static int linearSearch(int[] arr, int key) {
        // TODO: 顺序查找
        return -1;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int key = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        
        System.out.println(linearSearch(arr, key));
    }
}`,
      python: `n, key = map(int, input().split())
arr = list(map(int, input().split()))

# TODO: 顺序查找
`
    },
    solutions: {
      c: `#include <stdio.h>

int linearSearch(int arr[], int n, int key) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == key) {
            return i;
        }
    }
    return -1;
}

int main() {
    int n, key;
    scanf("%d %d", &n, &key);
    int arr[100];
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    
    printf("%d\\n", linearSearch(arr, n, key));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int linearSearch(int arr[], int n, int key) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == key) {
            return i;
        }
    }
    return -1;
}

int main() {
    int n, key;
    cin >> n >> key;
    int arr[100];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    cout << linearSearch(arr, n, key) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static int linearSearch(int[] arr, int key) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == key) {
                return i;
            }
        }
        return -1;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int key = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        
        System.out.println(linearSearch(arr, key));
    }
}`,
      python: `n, key = map(int, input().split())
arr = list(map(int, input().split()))

result = -1
for i in range(n):
    if arr[i] == key:
        result = i
        break

print(result)

# 或者: print(arr.index(key) if key in arr else -1)`
    },
    testCases: [
      { input: '5 25\n10 20 25 30 40', expectedOutput: '2', description: '找到' },
      { input: '5 15\n10 20 25 30 40', expectedOutput: '-1', description: '未找到' }
    ],
    hints: ['从头到尾遍历', '找到立即返回'],
    explanation: '顺序查找时间复杂度O(n)，适用于无序数组'
  },
  {
    id: 'basic-binary-search', category: '基础编程', title: '二分查找', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
在有序数组中使用二分查找法查找指定元素。

【算法思想】
每次比较中间元素，将搜索区间缩小一半。

【输入格式】
第一行：数组长度n和要查找的数key
第二行：n个递增整数

【输出格式】
元素的下标，未找到输出-1

【样例】
输入：
7 60
10 20 30 50 60 80 100
输出：
4`,
    templates: {
      c: `#include <stdio.h>

int binarySearch(int arr[], int n, int key) {
    // TODO: 二分查找
}

int main() {
    int n, key;
    scanf("%d %d", &n, &key);
    int arr[100];
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    
    printf("%d\\n", binarySearch(arr, n, key));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int binarySearch(int arr[], int n, int key) {
    // TODO: 二分查找
}

int main() {
    int n, key;
    cin >> n >> key;
    int arr[100];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    cout << binarySearch(arr, n, key) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static int binarySearch(int[] arr, int key) {
        // TODO: 二分查找
        return -1;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int key = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        
        System.out.println(binarySearch(arr, key));
    }
}`,
      python: `n, key = map(int, input().split())
arr = list(map(int, input().split()))

# TODO: 二分查找
`
    },
    solutions: {
      c: `#include <stdio.h>

int binarySearch(int arr[], int n, int key) {
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = (left + right) / 2;
        if (arr[mid] == key) {
            return mid;
        } else if (arr[mid] < key) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}

int main() {
    int n, key;
    scanf("%d %d", &n, &key);
    int arr[100];
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    
    printf("%d\\n", binarySearch(arr, n, key));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int binarySearch(int arr[], int n, int key) {
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = (left + right) / 2;
        if (arr[mid] == key) {
            return mid;
        } else if (arr[mid] < key) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}

int main() {
    int n, key;
    cin >> n >> key;
    int arr[100];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    cout << binarySearch(arr, n, key) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static int binarySearch(int[] arr, int key) {
        int left = 0, right = arr.length - 1;
        while (left <= right) {
            int mid = (left + right) / 2;
            if (arr[mid] == key) {
                return mid;
            } else if (arr[mid] < key) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int key = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        
        System.out.println(binarySearch(arr, key));
    }
}`,
      python: `n, key = map(int, input().split())
arr = list(map(int, input().split()))

left, right = 0, n - 1
result = -1
while left <= right:
    mid = (left + right) // 2
    if arr[mid] == key:
        result = mid
        break
    elif arr[mid] < key:
        left = mid + 1
    else:
        right = mid - 1

print(result)`
    },
    testCases: [
      { input: '7 60\n10 20 30 50 60 80 100', expectedOutput: '4', description: '找到' },
      { input: '7 55\n10 20 30 50 60 80 100', expectedOutput: '-1', description: '未找到' }
    ],
    hints: ['循环条件：left <= right', '更新时注意mid±1'],
    explanation: '二分查找时间复杂度O(log n)，要求数组有序'
  },
  {
    id: 'basic-matrix-multiply', category: '基础编程', title: '矩阵乘法', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
计算两个矩阵的乘积 C = A × B。

【矩阵乘法规则】
C[i][j] = Σ(A[i][k] * B[k][j])

【输入格式】
第一行：A的行数m、A的列数(B的行数)p、B的列数n
接下来m行：矩阵A
接下来p行：矩阵B

【输出格式】
矩阵C (m×n)

【样例】
输入：
2 3 2
1 2 3
4 5 6
1 2
3 4
5 6
输出：
22 28
49 64`,
    templates: {
      c: `#include <stdio.h>

int main() {
    int m, p, n;
    scanf("%d %d %d", &m, &p, &n);
    
    int A[10][10], B[10][10], C[10][10];
    
    // 读入矩阵A和B
    for (int i = 0; i < m; i++)
        for (int j = 0; j < p; j++)
            scanf("%d", &A[i][j]);
    for (int i = 0; i < p; i++)
        for (int j = 0; j < n; j++)
            scanf("%d", &B[i][j]);
    
    // TODO: 矩阵乘法
    
    // 输出矩阵C
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            printf("%d", C[i][j]);
            if (j < n - 1) printf(" ");
        }
        printf("\\n");
    }
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int m, p, n;
    cin >> m >> p >> n;
    
    int A[10][10], B[10][10], C[10][10];
    
    for (int i = 0; i < m; i++)
        for (int j = 0; j < p; j++)
            cin >> A[i][j];
    for (int i = 0; i < p; i++)
        for (int j = 0; j < n; j++)
            cin >> B[i][j];
    
    // TODO: 矩阵乘法
    
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            cout << C[i][j];
            if (j < n - 1) cout << " ";
        }
        cout << endl;
    }
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt(), p = sc.nextInt(), n = sc.nextInt();
        
        int[][] A = new int[m][p];
        int[][] B = new int[p][n];
        int[][] C = new int[m][n];
        
        for (int i = 0; i < m; i++)
            for (int j = 0; j < p; j++)
                A[i][j] = sc.nextInt();
        for (int i = 0; i < p; i++)
            for (int j = 0; j < n; j++)
                B[i][j] = sc.nextInt();
        
        // TODO: 矩阵乘法
        
        for (int i = 0; i < m; i++) {
            StringBuilder sb = new StringBuilder();
            for (int j = 0; j < n; j++) {
                sb.append(C[i][j]);
                if (j < n - 1) sb.append(" ");
            }
            System.out.println(sb);
        }
    }
}`,
      python: `m, p, n = map(int, input().split())

A = []
for _ in range(m):
    A.append(list(map(int, input().split())))
B = []
for _ in range(p):
    B.append(list(map(int, input().split())))

# TODO: 矩阵乘法
C = [[0] * n for _ in range(m)]

for row in C:
    print(" ".join(map(str, row)))
`
    },
    solutions: {
      c: `#include <stdio.h>

int main() {
    int m, p, n;
    scanf("%d %d %d", &m, &p, &n);
    
    int A[10][10], B[10][10], C[10][10];
    
    for (int i = 0; i < m; i++)
        for (int j = 0; j < p; j++)
            scanf("%d", &A[i][j]);
    for (int i = 0; i < p; i++)
        for (int j = 0; j < n; j++)
            scanf("%d", &B[i][j]);
    
    // 矩阵乘法
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            C[i][j] = 0;
            for (int k = 0; k < p; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            printf("%d", C[i][j]);
            if (j < n - 1) printf(" ");
        }
        printf("\\n");
    }
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int m, p, n;
    cin >> m >> p >> n;
    
    int A[10][10], B[10][10], C[10][10];
    
    for (int i = 0; i < m; i++)
        for (int j = 0; j < p; j++)
            cin >> A[i][j];
    for (int i = 0; i < p; i++)
        for (int j = 0; j < n; j++)
            cin >> B[i][j];
    
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            C[i][j] = 0;
            for (int k = 0; k < p; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            cout << C[i][j];
            if (j < n - 1) cout << " ";
        }
        cout << endl;
    }
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt(), p = sc.nextInt(), n = sc.nextInt();
        
        int[][] A = new int[m][p];
        int[][] B = new int[p][n];
        int[][] C = new int[m][n];
        
        for (int i = 0; i < m; i++)
            for (int j = 0; j < p; j++)
                A[i][j] = sc.nextInt();
        for (int i = 0; i < p; i++)
            for (int j = 0; j < n; j++)
                B[i][j] = sc.nextInt();
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                C[i][j] = 0;
                for (int k = 0; k < p; k++) {
                    C[i][j] += A[i][k] * B[k][j];
                }
            }
        }
        
        for (int i = 0; i < m; i++) {
            StringBuilder sb = new StringBuilder();
            for (int j = 0; j < n; j++) {
                sb.append(C[i][j]);
                if (j < n - 1) sb.append(" ");
            }
            System.out.println(sb);
        }
    }
}`,
      python: `m, p, n = map(int, input().split())

A = []
for _ in range(m):
    A.append(list(map(int, input().split())))
B = []
for _ in range(p):
    B.append(list(map(int, input().split())))

C = [[0] * n for _ in range(m)]
for i in range(m):
    for j in range(n):
        for k in range(p):
            C[i][j] += A[i][k] * B[k][j]

for row in C:
    print(" ".join(map(str, row)))`
    },
    testCases: [
      { input: '2 3 2\n1 2 3\n4 5 6\n1 2\n3 4\n5 6', expectedOutput: '22 28\n49 64', description: '2x3乘3x2' }
    ],
    hints: ['三重循环：i遍历行，j遍历列，k累加', 'C[i][j] = Σ A[i][k]*B[k][j]'],
    explanation: '矩阵乘法时间复杂度O(m*n*p)，是线性代数的基本运算'
  },
  {
    id: 'basic-fibonacci', category: '基础编程', title: '斐波那契数列', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
计算斐波那契数列的第n项。

【数列定义】
F(1) = 1, F(2) = 1
F(n) = F(n-1) + F(n-2) (n > 2)

【输入格式】
一个正整数n

【输出格式】
斐波那契数列第n项

【样例】
输入：10
输出：55`,
    templates: {
      c: `#include <stdio.h>

long long fibonacci(int n) {
    // TODO: 计算第n项斐波那契数
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%lld\\n", fibonacci(n));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

long long fibonacci(int n) {
    // TODO: 计算第n项斐波那契数
}

int main() {
    int n;
    cin >> n;
    cout << fibonacci(n) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static long fibonacci(int n) {
        // TODO: 计算第n项斐波那契数
        return 0;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(fibonacci(n));
    }
}`,
      python: `n = int(input())

# TODO: 计算第n项斐波那契数
`
    },
    solutions: {
      c: `#include <stdio.h>

long long fibonacci(int n) {
    if (n <= 2) return 1;
    long long a = 1, b = 1;
    for (int i = 3; i <= n; i++) {
        long long c = a + b;
        a = b;
        b = c;
    }
    return b;
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%lld\\n", fibonacci(n));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

long long fibonacci(int n) {
    if (n <= 2) return 1;
    long long a = 1, b = 1;
    for (int i = 3; i <= n; i++) {
        long long c = a + b;
        a = b;
        b = c;
    }
    return b;
}

int main() {
    int n;
    cin >> n;
    cout << fibonacci(n) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static long fibonacci(int n) {
        if (n <= 2) return 1;
        long a = 1, b = 1;
        for (int i = 3; i <= n; i++) {
            long c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(fibonacci(n));
    }
}`,
      python: `n = int(input())

if n <= 2:
    print(1)
else:
    a, b = 1, 1
    for i in range(3, n + 1):
        a, b = b, a + b
    print(b)`
    },
    testCases: [
      { input: '10', expectedOutput: '55', description: 'F(10)=55' },
      { input: '20', expectedOutput: '6765', description: 'F(20)=6765' }
    ],
    hints: ['使用迭代而非递归', '只需保存前两项'],
    explanation: '迭代法时间O(n)空间O(1)，比递归效率高很多'
  },
  {
    id: 'basic-palindrome', category: '基础编程', title: '判断回文字符串', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
判断一个字符串是否为回文字符串。回文字符串是指正读和反读都相同的字符串。

【输入格式】
一个字符串（只包含小写字母，长度不超过100）

【输出格式】
如果是回文输出"Yes"，否则输出"No"

【样例】
输入：abcba
输出：Yes

输入：hello
输出：No`,
    templates: {
      c: `#include <stdio.h>
#include <string.h>

int isPalindrome(char *s) {
    // TODO: 判断是否回文
}

int main() {
    char s[101];
    scanf("%s", s);
    printf("%s\\n", isPalindrome(s) ? "Yes" : "No");
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

bool isPalindrome(string s) {
    // TODO: 判断是否回文
}

int main() {
    string s;
    cin >> s;
    cout << (isPalindrome(s) ? "Yes" : "No") << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static boolean isPalindrome(String s) {
        // TODO: 判断是否回文
        return false;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        System.out.println(isPalindrome(s) ? "Yes" : "No");
    }
}`,
      python: `s = input()

# TODO: 判断是否回文
`
    },
    solutions: {
      c: `#include <stdio.h>
#include <string.h>

int isPalindrome(char *s) {
    int i = 0, j = strlen(s) - 1;
    while (i < j) {
        if (s[i] != s[j]) return 0;
        i++;
        j--;
    }
    return 1;
}

int main() {
    char s[101];
    scanf("%s", s);
    printf("%s\\n", isPalindrome(s) ? "Yes" : "No");
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

bool isPalindrome(string s) {
    int i = 0, j = s.length() - 1;
    while (i < j) {
        if (s[i] != s[j]) return false;
        i++;
        j--;
    }
    return true;
}

int main() {
    string s;
    cin >> s;
    cout << (isPalindrome(s) ? "Yes" : "No") << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static boolean isPalindrome(String s) {
        int i = 0, j = s.length() - 1;
        while (i < j) {
            if (s.charAt(i) != s.charAt(j)) return false;
            i++;
            j--;
        }
        return true;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        System.out.println(isPalindrome(s) ? "Yes" : "No");
    }
}`,
      python: `s = input()

def is_palindrome(s):
    i, j = 0, len(s) - 1
    while i < j:
        if s[i] != s[j]:
            return False
        i += 1
        j -= 1
    return True

print("Yes" if is_palindrome(s) else "No")

# 或者: print("Yes" if s == s[::-1] else "No")`
    },
    testCases: [
      { input: 'abcba', expectedOutput: 'Yes', description: '回文' },
      { input: 'hello', expectedOutput: 'No', description: '非回文' }
    ],
    hints: ['使用双指针，一个从头，一个从尾', '相向移动比较字符'],
    explanation: '双指针法时间O(n)空间O(1)'
  },
  {
    id: 'basic-strlen', category: '基础编程', title: '实现字符串长度函数', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
实现一个函数计算字符串的长度（不使用标准库函数）。

【输入格式】
一个字符串

【输出格式】
字符串的长度

【样例】
输入：hello
输出：5`,
    templates: {
      c: `#include <stdio.h>

int myStrlen(char *s) {
    // TODO: 计算字符串长度
}

int main() {
    char s[1001];
    scanf("%s", s);
    printf("%d\\n", myStrlen(s));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int myStrlen(const char *s) {
    // TODO: 计算字符串长度
}

int main() {
    char s[1001];
    cin >> s;
    cout << myStrlen(s) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static int myStrlen(String s) {
        // TODO: 计算字符串长度（不用length()）
        return 0;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        System.out.println(myStrlen(s));
    }
}`,
      python: `s = input()

def my_strlen(s):
    # TODO: 计算字符串长度（不用len()）
    pass

print(my_strlen(s))
`
    },
    solutions: {
      c: `#include <stdio.h>

int myStrlen(char *s) {
    int len = 0;
    while (*s != '\\0') {
        len++;
        s++;
    }
    return len;
}

// 或者使用指针减法
int myStrlen2(char *s) {
    char *p = s;
    while (*p != '\\0') p++;
    return p - s;
}

int main() {
    char s[1001];
    scanf("%s", s);
    printf("%d\\n", myStrlen(s));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int myStrlen(const char *s) {
    const char *p = s;
    while (*p != '\\0') p++;
    return p - s;
}

int main() {
    char s[1001];
    cin >> s;
    cout << myStrlen(s) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static int myStrlen(String s) {
        int len = 0;
        try {
            while (true) {
                s.charAt(len);
                len++;
            }
        } catch (Exception e) {}
        return len;
    }
    
    // 实际上Java中可以用toCharArray遍历
    static int myStrlen2(String s) {
        int len = 0;
        for (char c : s.toCharArray()) {
            len++;
        }
        return len;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        System.out.println(myStrlen2(s));
    }
}`,
      python: `s = input()

def my_strlen(s):
    count = 0
    for c in s:
        count += 1
    return count

print(my_strlen(s))`
    },
    testCases: [
      { input: 'hello', expectedOutput: '5', description: '5个字符' },
      { input: 'programming', expectedOutput: '11', description: '11个字符' }
    ],
    hints: ['遍历直到遇到\\0结束符', '也可以用指针减法'],
    explanation: '理解C字符串以\\0结尾的特性'
  },
  {
    id: 'basic-reverse-string', category: '基础编程', title: '字符串反转', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
将一个字符串反转后输出。

【输入格式】
一个字符串

【输出格式】
反转后的字符串

【样例】
输入：hello
输出：olleh`,
    templates: {
      c: `#include <stdio.h>
#include <string.h>

void reverseString(char *s) {
    // TODO: 反转字符串
}

int main() {
    char s[1001];
    scanf("%s", s);
    reverseString(s);
    printf("%s\\n", s);
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

void reverseString(string &s) {
    // TODO: 反转字符串
}

int main() {
    string s;
    cin >> s;
    reverseString(s);
    cout << s << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static String reverseString(String s) {
        // TODO: 反转字符串
        return "";
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        System.out.println(reverseString(s));
    }
}`,
      python: `s = input()

# TODO: 反转字符串
`
    },
    solutions: {
      c: `#include <stdio.h>
#include <string.h>

void reverseString(char *s) {
    int i = 0, j = strlen(s) - 1;
    while (i < j) {
        char temp = s[i];
        s[i] = s[j];
        s[j] = temp;
        i++;
        j--;
    }
}

int main() {
    char s[1001];
    scanf("%s", s);
    reverseString(s);
    printf("%s\\n", s);
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

void reverseString(string &s) {
    int i = 0, j = s.length() - 1;
    while (i < j) {
        swap(s[i], s[j]);
        i++;
        j--;
    }
}

int main() {
    string s;
    cin >> s;
    reverseString(s);
    cout << s << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static String reverseString(String s) {
        char[] arr = s.toCharArray();
        int i = 0, j = arr.length - 1;
        while (i < j) {
            char temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            i++;
            j--;
        }
        return new String(arr);
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        System.out.println(reverseString(s));
    }
}`,
      python: `s = input()

# 方法1：双指针
def reverse_string(s):
    arr = list(s)
    i, j = 0, len(arr) - 1
    while i < j:
        arr[i], arr[j] = arr[j], arr[i]
        i += 1
        j -= 1
    return ''.join(arr)

print(reverse_string(s))

# 方法2：切片（更Pythonic）
# print(s[::-1])`
    },
    testCases: [
      { input: 'hello', expectedOutput: 'olleh', description: '基本测试' },
      { input: 'abc', expectedOutput: 'cba', description: '3个字符' }
    ],
    hints: ['双指针从两端向中间移动', '交换首尾对应位置的字符'],
    explanation: '原地反转，时间O(n)空间O(1)'
  },
  {
    id: 'basic-array-reverse', category: '基础编程', title: '数组逆序', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
将一个整数数组逆序排列。

【输入格式】
第一行：整数n
第二行：n个整数

【输出格式】
逆序后的n个整数

【样例】
输入：
5
1 2 3 4 5
输出：
5 4 3 2 1`,
    templates: {
      c: `#include <stdio.h>

void reverseArray(int arr[], int n) {
    // TODO: 数组逆序
}

int main() {
    int n;
    scanf("%d", &n);
    int arr[100];
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    
    reverseArray(arr, n);
    
    for (int i = 0; i < n; i++) {
        printf("%d", arr[i]);
        if (i < n - 1) printf(" ");
    }
    printf("\\n");
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

void reverseArray(int arr[], int n) {
    // TODO: 数组逆序
}

int main() {
    int n;
    cin >> n;
    int arr[100];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    reverseArray(arr, n);
    
    for (int i = 0; i < n; i++) {
        cout << arr[i];
        if (i < n - 1) cout << " ";
    }
    cout << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static void reverseArray(int[] arr) {
        // TODO: 数组逆序
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        
        reverseArray(arr);
        
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            sb.append(arr[i]);
            if (i < n - 1) sb.append(" ");
        }
        System.out.println(sb);
    }
}`,
      python: `n = int(input())
arr = list(map(int, input().split()))

# TODO: 数组逆序

print(" ".join(map(str, arr)))
`
    },
    solutions: {
      c: `#include <stdio.h>

void reverseArray(int arr[], int n) {
    int i = 0, j = n - 1;
    while (i < j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        i++;
        j--;
    }
}

int main() {
    int n;
    scanf("%d", &n);
    int arr[100];
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    
    reverseArray(arr, n);
    
    for (int i = 0; i < n; i++) {
        printf("%d", arr[i]);
        if (i < n - 1) printf(" ");
    }
    printf("\\n");
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

void reverseArray(int arr[], int n) {
    int i = 0, j = n - 1;
    while (i < j) {
        swap(arr[i], arr[j]);
        i++;
        j--;
    }
}

int main() {
    int n;
    cin >> n;
    int arr[100];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    reverseArray(arr, n);
    
    for (int i = 0; i < n; i++) {
        cout << arr[i];
        if (i < n - 1) cout << " ";
    }
    cout << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static void reverseArray(int[] arr) {
        int i = 0, j = arr.length - 1;
        while (i < j) {
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            i++;
            j--;
        }
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        
        reverseArray(arr);
        
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            sb.append(arr[i]);
            if (i < n - 1) sb.append(" ");
        }
        System.out.println(sb);
    }
}`,
      python: `n = int(input())
arr = list(map(int, input().split()))

# 方法1：双指针
i, j = 0, n - 1
while i < j:
    arr[i], arr[j] = arr[j], arr[i]
    i += 1
    j -= 1

print(" ".join(map(str, arr)))

# 方法2：切片
# arr = arr[::-1]`
    },
    testCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: '5 4 3 2 1', description: '基本测试' }
    ],
    hints: ['双指针交换首尾元素', '原地操作节省空间'],
    explanation: '与字符串反转类似，使用双指针法'
  },
  {
    id: 'basic-digit-sum', category: '基础编程', title: '整数各位数之和', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
计算一个正整数各位数字之和。

【输入格式】
一个正整数n

【输出格式】
各位数字之和

【样例】
输入：12345
输出：15

输入：999
输出：27`,
    templates: {
      c: `#include <stdio.h>

int digitSum(int n) {
    // TODO: 计算各位数之和
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%d\\n", digitSum(n));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int digitSum(int n) {
    // TODO: 计算各位数之和
}

int main() {
    int n;
    cin >> n;
    cout << digitSum(n) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static int digitSum(int n) {
        // TODO: 计算各位数之和
        return 0;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(digitSum(n));
    }
}`,
      python: `n = int(input())

# TODO: 计算各位数之和
`
    },
    solutions: {
      c: `#include <stdio.h>

int digitSum(int n) {
    int sum = 0;
    while (n > 0) {
        sum += n % 10;
        n /= 10;
    }
    return sum;
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%d\\n", digitSum(n));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int digitSum(int n) {
    int sum = 0;
    while (n > 0) {
        sum += n % 10;
        n /= 10;
    }
    return sum;
}

int main() {
    int n;
    cin >> n;
    cout << digitSum(n) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static int digitSum(int n) {
        int sum = 0;
        while (n > 0) {
            sum += n % 10;
            n /= 10;
        }
        return sum;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(digitSum(n));
    }
}`,
      python: `n = int(input())

def digit_sum(n):
    total = 0
    while n > 0:
        total += n % 10
        n //= 10
    return total

print(digit_sum(n))

# 或者: print(sum(int(d) for d in str(n)))`
    },
    testCases: [
      { input: '12345', expectedOutput: '15', description: '1+2+3+4+5=15' },
      { input: '999', expectedOutput: '27', description: '9+9+9=27' }
    ],
    hints: ['用%10取个位', '用/10去掉个位'],
    explanation: '数位分离的经典方法'
  },
  {
    id: 'basic-count-digits', category: '基础编程', title: '统计数字位数', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
统计一个正整数有多少位数字。

【输入格式】
一个正整数n

【输出格式】
数字的位数

【样例】
输入：12345
输出：5

输入：100
输出：3`,
    templates: {
      c: `#include <stdio.h>

int countDigits(int n) {
    // TODO: 统计位数
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%d\\n", countDigits(n));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int countDigits(int n) {
    // TODO: 统计位数
}

int main() {
    int n;
    cin >> n;
    cout << countDigits(n) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static int countDigits(int n) {
        // TODO: 统计位数
        return 0;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(countDigits(n));
    }
}`,
      python: `n = int(input())

# TODO: 统计位数
`
    },
    solutions: {
      c: `#include <stdio.h>

int countDigits(int n) {
    int count = 0;
    while (n > 0) {
        count++;
        n /= 10;
    }
    return count;
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%d\\n", countDigits(n));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int countDigits(int n) {
    int count = 0;
    while (n > 0) {
        count++;
        n /= 10;
    }
    return count;
}

int main() {
    int n;
    cin >> n;
    cout << countDigits(n) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static int countDigits(int n) {
        int count = 0;
        while (n > 0) {
            count++;
            n /= 10;
        }
        return count;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(countDigits(n));
    }
}`,
      python: `n = int(input())

def count_digits(n):
    count = 0
    while n > 0:
        count += 1
        n //= 10
    return count

print(count_digits(n))

# 或者: print(len(str(n)))`
    },
    testCases: [
      { input: '12345', expectedOutput: '5', description: '5位数' },
      { input: '100', expectedOutput: '3', description: '3位数' }
    ],
    hints: ['每次除以10，计数加1', '直到数字变为0'],
    explanation: '数位分离的基本操作'
  },
  {
    id: 'basic-reverse-number', category: '基础编程', title: '整数反转', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
将一个正整数的各位数字反转。

【输入格式】
一个正整数n

【输出格式】
反转后的整数

【样例】
输入：12345
输出：54321

输入：100
输出：1`,
    templates: {
      c: `#include <stdio.h>

int reverseNumber(int n) {
    // TODO: 反转整数
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%d\\n", reverseNumber(n));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int reverseNumber(int n) {
    // TODO: 反转整数
}

int main() {
    int n;
    cin >> n;
    cout << reverseNumber(n) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static int reverseNumber(int n) {
        // TODO: 反转整数
        return 0;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(reverseNumber(n));
    }
}`,
      python: `n = int(input())

# TODO: 反转整数
`
    },
    solutions: {
      c: `#include <stdio.h>

int reverseNumber(int n) {
    int result = 0;
    while (n > 0) {
        result = result * 10 + n % 10;
        n /= 10;
    }
    return result;
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%d\\n", reverseNumber(n));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int reverseNumber(int n) {
    int result = 0;
    while (n > 0) {
        result = result * 10 + n % 10;
        n /= 10;
    }
    return result;
}

int main() {
    int n;
    cin >> n;
    cout << reverseNumber(n) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static int reverseNumber(int n) {
        int result = 0;
        while (n > 0) {
            result = result * 10 + n % 10;
            n /= 10;
        }
        return result;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(reverseNumber(n));
    }
}`,
      python: `n = int(input())

def reverse_number(n):
    result = 0
    while n > 0:
        result = result * 10 + n % 10
        n //= 10
    return result

print(reverse_number(n))

# 或者: print(int(str(n)[::-1]))`
    },
    testCases: [
      { input: '12345', expectedOutput: '54321', description: '基本测试' },
      { input: '100', expectedOutput: '1', description: '末尾有0' }
    ],
    hints: ['每次取出个位，加到结果的末尾', 'result = result * 10 + digit'],
    explanation: '数位分离与重组的结合应用'
  },
  {
    id: 'basic-power', category: '基础编程', title: '幂运算', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
计算x的n次方（不使用pow函数）。

【输入格式】
两个整数x和n（0 ≤ n ≤ 20）

【输出格式】
x的n次方

【样例】
输入：2 10
输出：1024

输入：3 0
输出：1`,
    templates: {
      c: `#include <stdio.h>

long long power(int x, int n) {
    // TODO: 计算x的n次方
}

int main() {
    int x, n;
    scanf("%d %d", &x, &n);
    printf("%lld\\n", power(x, n));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

long long power(int x, int n) {
    // TODO: 计算x的n次方
}

int main() {
    int x, n;
    cin >> x >> n;
    cout << power(x, n) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static long power(int x, int n) {
        // TODO: 计算x的n次方
        return 0;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        int n = sc.nextInt();
        System.out.println(power(x, n));
    }
}`,
      python: `x, n = map(int, input().split())

# TODO: 计算x的n次方
`
    },
    solutions: {
      c: `#include <stdio.h>

long long power(int x, int n) {
    long long result = 1;
    for (int i = 0; i < n; i++) {
        result *= x;
    }
    return result;
}

// 快速幂优化版本
long long fastPower(int x, int n) {
    long long result = 1;
    long long base = x;
    while (n > 0) {
        if (n % 2 == 1) {
            result *= base;
        }
        base *= base;
        n /= 2;
    }
    return result;
}

int main() {
    int x, n;
    scanf("%d %d", &x, &n);
    printf("%lld\\n", power(x, n));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

long long power(int x, int n) {
    long long result = 1;
    for (int i = 0; i < n; i++) {
        result *= x;
    }
    return result;
}

int main() {
    int x, n;
    cin >> x >> n;
    cout << power(x, n) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static long power(int x, int n) {
        long result = 1;
        for (int i = 0; i < n; i++) {
            result *= x;
        }
        return result;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        int n = sc.nextInt();
        System.out.println(power(x, n));
    }
}`,
      python: `x, n = map(int, input().split())

def power(x, n):
    result = 1
    for _ in range(n):
        result *= x
    return result

print(power(x, n))

# 或者直接: print(x ** n)`
    },
    testCases: [
      { input: '2 10', expectedOutput: '1024', description: '2^10=1024' },
      { input: '3 0', expectedOutput: '1', description: '任何数的0次方=1' }
    ],
    hints: ['循环n次乘以x', '注意n=0时返回1'],
    explanation: '循环法时间O(n)，快速幂可优化到O(log n)'
  }
];


export const basicsExerciseBank: Exercise[] = [
  ...basicProgrammingExercises,
];

