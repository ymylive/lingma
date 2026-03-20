import type { Exercise } from '../exercises';

// ==================== 结构体 ====================
export const structExercises: Exercise[] = [
  {
    id: 'struct-complex', category: '结构体', title: '复数运算', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
复数可以写成 A+Bi 的常规形式，其中 A 是实部，B 是虚部，i 是虚数单位，满足 i²=-1。
编写程序，分别计算两个复数的和、差、积。

【输入格式】
在一行中依次给出两个复数的实部和虚部，数字间以一个西文空格分隔。

【输出格式】
一行中按照 A+Bi 的格式输出两虚数的和、差、积，实部和虚部均保留2位小数。
- 如果 B 是负数，则应该写成 A-|B|i 的形式
- 如果 B 是零则不输出虚部
- 结果间以 4个西文空格 间隔

【样例1】
输入：2.3 3.5 5.2 0.4
输出：7.50+3.90i    -2.90+3.10i    10.56+19.12i

【样例2】
输入：3.3 4.5 3.3 -4.5
输出：6.60    0.00+9.00i    31.14`,
    templates: {
      c: `#include <stdio.h>

typedef struct {
    double real;  // 实部
    double imag;  // 虚部
} Complex;

// 格式化输出复数
void printComplex(Complex c) {
    // TODO: 实现输出格式
}

int main() {
    double a1, b1, a2, b2;
    scanf("%lf %lf %lf %lf", &a1, &b1, &a2, &b2);
    
    Complex c1 = {a1, b1};
    Complex c2 = {a2, b2};
    
    // TODO: 计算和、差、积并输出
    
    return 0;
}`,
      cpp: `#include <iostream>
#include <iomanip>
using namespace std;

struct Complex {
    double real, imag;
};

void printComplex(Complex c) {
    // TODO: 实现输出格式
}

int main() {
    double a1, b1, a2, b2;
    cin >> a1 >> b1 >> a2 >> b2;
    
    Complex c1 = {a1, b1};
    Complex c2 = {a2, b2};
    
    // TODO: 计算和、差、积并输出
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static class Complex {
        double real, imag;
        Complex(double r, double i) { real = r; imag = i; }
    }
    
    static String format(Complex c) {
        // TODO: 实现格式化
        return "";
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double a1 = sc.nextDouble(), b1 = sc.nextDouble();
        double a2 = sc.nextDouble(), b2 = sc.nextDouble();
        
        // TODO: 计算和、差、积并输出
    }
}`,
      python: `a1, b1, a2, b2 = map(float, input().split())

def format_complex(real, imag):
    # TODO: 实现格式化输出
    pass

# TODO: 计算和、差、积并输出
`
    },
    solutions: {
      c: `#include <stdio.h>

typedef struct {
    double real;
    double imag;
} Complex;

void printComplex(Complex c) {
    if (c.imag == 0) {
        printf("%.2f", c.real);
    } else if (c.imag > 0) {
        printf("%.2f+%.2fi", c.real, c.imag);
    } else {
        printf("%.2f%.2fi", c.real, c.imag);
    }
}

int main() {
    double a1, b1, a2, b2;
    scanf("%lf %lf %lf %lf", &a1, &b1, &a2, &b2);
    
    Complex c1 = {a1, b1};
    Complex c2 = {a2, b2};
    
    // 和
    Complex sum = {c1.real + c2.real, c1.imag + c2.imag};
    // 差
    Complex diff = {c1.real - c2.real, c1.imag - c2.imag};
    // 积: (a+bi)(c+di) = (ac-bd) + (ad+bc)i
    Complex prod = {c1.real * c2.real - c1.imag * c2.imag, 
                    c1.real * c2.imag + c1.imag * c2.real};
    
    printComplex(sum);
    printf("    ");
    printComplex(diff);
    printf("    ");
    printComplex(prod);
    printf("\\n");
    
    return 0;
}`,
      cpp: `#include <iostream>
#include <iomanip>
#include <cstdio>
using namespace std;

struct Complex {
    double real, imag;
};

void printComplex(Complex c) {
    if (c.imag == 0) {
        printf("%.2f", c.real);
    } else if (c.imag > 0) {
        printf("%.2f+%.2fi", c.real, c.imag);
    } else {
        printf("%.2f%.2fi", c.real, c.imag);
    }
}

int main() {
    double a1, b1, a2, b2;
    cin >> a1 >> b1 >> a2 >> b2;
    
    Complex c1 = {a1, b1}, c2 = {a2, b2};
    Complex sum = {c1.real + c2.real, c1.imag + c2.imag};
    Complex diff = {c1.real - c2.real, c1.imag - c2.imag};
    Complex prod = {c1.real * c2.real - c1.imag * c2.imag, 
                    c1.real * c2.imag + c1.imag * c2.real};
    
    printComplex(sum); cout << "    ";
    printComplex(diff); cout << "    ";
    printComplex(prod); cout << endl;
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static class Complex {
        double real, imag;
        Complex(double r, double i) { real = r; imag = i; }
    }
    
    static String format(Complex c) {
        if (c.imag == 0) {
            return String.format("%.2f", c.real);
        } else if (c.imag > 0) {
            return String.format("%.2f+%.2fi", c.real, c.imag);
        } else {
            return String.format("%.2f%.2fi", c.real, c.imag);
        }
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double a1 = sc.nextDouble(), b1 = sc.nextDouble();
        double a2 = sc.nextDouble(), b2 = sc.nextDouble();
        
        Complex c1 = new Complex(a1, b1), c2 = new Complex(a2, b2);
        Complex sum = new Complex(c1.real + c2.real, c1.imag + c2.imag);
        Complex diff = new Complex(c1.real - c2.real, c1.imag - c2.imag);
        Complex prod = new Complex(c1.real * c2.real - c1.imag * c2.imag,
                                   c1.real * c2.imag + c1.imag * c2.real);
        
        System.out.println(format(sum) + "    " + format(diff) + "    " + format(prod));
    }
}`,
      python: `a1, b1, a2, b2 = map(float, input().split())

def format_complex(real, imag):
    if imag == 0:
        return f"{real:.2f}"
    elif imag > 0:
        return f"{real:.2f}+{imag:.2f}i"
    else:
        return f"{real:.2f}{imag:.2f}i"

# 和
sum_r, sum_i = a1 + a2, b1 + b2
# 差
diff_r, diff_i = a1 - a2, b1 - b2
# 积: (a+bi)(c+di) = (ac-bd) + (ad+bc)i
prod_r = a1 * a2 - b1 * b2
prod_i = a1 * b2 + b1 * a2

print(f"{format_complex(sum_r, sum_i)}    {format_complex(diff_r, diff_i)}    {format_complex(prod_r, prod_i)}")`
    },
    testCases: [
      { input: '2.3 3.5 5.2 0.4', expectedOutput: '7.50+3.90i    -2.90+3.10i    10.56+19.12i', description: '正常情况' },
      { input: '3.3 4.5 3.3 -4.5', expectedOutput: '6.60    0.00+9.00i    31.14', description: '虚部为0和负虚部' }
    ],
    hints: ['复数乘法公式：(a+bi)(c+di) = (ac-bd) + (ad+bc)i', '注意输出格式：虚部为0不输出，负虚部显示为A-|B|i'],
    explanation: `结构体应用：定义复数结构体存储实部和虚部
复数运算：加减直接对应分量相加减，乘法用公式
输出格式处理是难点，需要分情况讨论`
  },
  {
    id: 'struct-teacher', category: '结构体', title: '构造教师结构体', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
构造一个表示教师的结构体（包含3个字段：姓名、性别、年龄），编写函数，读入 n 个教师的信息，存入一个结构体数组中。最后输出第 n/2 个教师的信息。

【输入格式】
依次输入一个正整数 n 及 n 个教师的姓名、性别、年龄。
说明：n 不大于 10；姓名长度不超过 20 个英文字符；性别输入 0/1 表示 女/男。

【输出格式】
数组下标为 n/2 的教师信息。
说明：n/2 直接截取整数，不进行四舍五入；性别输出 Female/Male 表示 女/男；每个数据后均有 1个空格。

【样例1】
输入：1 zhangsan 0 50
输出：zhangsan Female 50 

【样例2】
输入：4 zhangsan 0 50 lisi 1 28 wangwu 0 30 zhaoliu 1 34
输出：wangwu Female 30 `,
    templates: {
      c: `#include <stdio.h>

typedef struct {
    char name[21];
    int gender;  // 0-女 1-男
    int age;
} Teacher;

int main() {
    int n;
    scanf("%d", &n);
    
    Teacher teachers[10];
    // TODO: 读入n个教师信息
    
    // TODO: 输出第n/2个教师信息
    
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

struct Teacher {
    string name;
    int gender;  // 0-女 1-男
    int age;
};

int main() {
    int n;
    cin >> n;
    
    Teacher teachers[10];
    // TODO: 读入n个教师信息
    
    // TODO: 输出第n/2个教师信息
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static class Teacher {
        String name;
        int gender;  // 0-女 1-男
        int age;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        Teacher[] teachers = new Teacher[10];
        // TODO: 读入n个教师信息
        
        // TODO: 输出第n/2个教师信息
    }
}`,
      python: `class Teacher:
    def __init__(self, name, gender, age):
        self.name = name
        self.gender = gender
        self.age = age

data = input().split()
n = int(data[0])

teachers = []
# TODO: 读入n个教师信息

# TODO: 输出第n//2个教师信息
`
    },
    solutions: {
      c: `#include <stdio.h>

typedef struct {
    char name[21];
    int gender;
    int age;
} Teacher;

int main() {
    int n;
    scanf("%d", &n);
    
    Teacher teachers[10];
    for (int i = 0; i < n; i++) {
        scanf("%s %d %d", teachers[i].name, &teachers[i].gender, &teachers[i].age);
    }
    
    int idx = n / 2;
    printf("%s %s %d \\n", teachers[idx].name, 
           teachers[idx].gender == 0 ? "Female" : "Male",
           teachers[idx].age);
    
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

struct Teacher {
    string name;
    int gender;
    int age;
};

int main() {
    int n;
    cin >> n;
    
    Teacher teachers[10];
    for (int i = 0; i < n; i++) {
        cin >> teachers[i].name >> teachers[i].gender >> teachers[i].age;
    }
    
    int idx = n / 2;
    cout << teachers[idx].name << " " 
         << (teachers[idx].gender == 0 ? "Female" : "Male") << " "
         << teachers[idx].age << " " << endl;
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static class Teacher {
        String name;
        int gender;
        int age;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        Teacher[] teachers = new Teacher[10];
        for (int i = 0; i < n; i++) {
            teachers[i] = new Teacher();
            teachers[i].name = sc.next();
            teachers[i].gender = sc.nextInt();
            teachers[i].age = sc.nextInt();
        }
        
        int idx = n / 2;
        System.out.println(teachers[idx].name + " " + 
                          (teachers[idx].gender == 0 ? "Female" : "Male") + " " +
                          teachers[idx].age + " ");
    }
}`,
      python: `class Teacher:
    def __init__(self, name, gender, age):
        self.name = name
        self.gender = gender
        self.age = age

data = input().split()
n = int(data[0])

teachers = []
idx = 1
for i in range(n):
    name = data[idx]
    gender = int(data[idx + 1])
    age = int(data[idx + 2])
    teachers.append(Teacher(name, gender, age))
    idx += 3

t = teachers[n // 2]
print(f"{t.name} {'Female' if t.gender == 0 else 'Male'} {t.age} ")`
    },
    testCases: [
      { input: '1 zhangsan 0 50', expectedOutput: 'zhangsan Female 50 ', description: '单个教师' },
      { input: '4 zhangsan 0 50 lisi 1 28 wangwu 0 30 zhaoliu 1 34', expectedOutput: 'wangwu Female 30 ', description: '多个教师取中间' }
    ],
    hints: ['结构体数组存储多个教师', 'n/2 是整数除法', '性别0对应Female，1对应Male'],
    explanation: `结构体数组的基本应用：
1. 定义包含姓名、性别、年龄的结构体
2. 用循环读入n个结构体数据
3. 计算下标 n/2 输出对应教师信息
注意：数组下标从0开始，n/2是整数除法`
  },
  {
    id: 'struct-fail-student', category: '结构体', title: '求不及格学生姓名及成绩', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
定义一个学生结构体，包括学生的姓名和一门课程成绩。编程序，从键盘输入 n 名学生的所有信息，输出所有不及格的学生姓名和成绩。

【输入格式】
依次输入 n（1个不超过 10 的正整数），姓名（1个字符串，长度不超过 19 个字符），成绩（1个非负整数）。

【输出格式】
在一行内输出所有不及格的学生姓名和成绩，输出时保持输入时的先后顺序。
相邻的数据之间用 1 个空格隔开，最后 1 个数据的后面也有 1 个空格。

【样例】
输入：
3
zhang 8
wang 72
zhao 34

输出：zhang 8 zhao 34 `,
    templates: {
      c: `#include <stdio.h>

typedef struct {
    char name[20];
    int score;
} Student;

int main() {
    int n;
    scanf("%d", &n);
    
    Student students[10];
    // TODO: 读入学生信息
    
    // TODO: 输出不及格学生
    
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

struct Student {
    string name;
    int score;
};

int main() {
    int n;
    cin >> n;
    
    Student students[10];
    // TODO: 读入学生信息并输出不及格的
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static class Student {
        String name;
        int score;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        // TODO: 读入学生信息并输出不及格的
    }
}`,
      python: `n = int(input())

students = []
for _ in range(n):
    data = input().split()
    # TODO: 读入并存储学生信息

# TODO: 输出不及格学生
`
    },
    solutions: {
      c: `#include <stdio.h>

typedef struct {
    char name[20];
    int score;
} Student;

int main() {
    int n;
    scanf("%d", &n);
    
    Student students[10];
    for (int i = 0; i < n; i++) {
        scanf("%s %d", students[i].name, &students[i].score);
    }
    
    for (int i = 0; i < n; i++) {
        if (students[i].score < 60) {
            printf("%s %d ", students[i].name, students[i].score);
        }
    }
    printf("\\n");
    
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

struct Student {
    string name;
    int score;
};

int main() {
    int n;
    cin >> n;
    
    Student students[10];
    for (int i = 0; i < n; i++) {
        cin >> students[i].name >> students[i].score;
    }
    
    for (int i = 0; i < n; i++) {
        if (students[i].score < 60) {
            cout << students[i].name << " " << students[i].score << " ";
        }
    }
    cout << endl;
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static class Student {
        String name;
        int score;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        Student[] students = new Student[10];
        for (int i = 0; i < n; i++) {
            students[i] = new Student();
            students[i].name = sc.next();
            students[i].score = sc.nextInt();
        }
        
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (students[i].score < 60) {
                sb.append(students[i].name + " " + students[i].score + " ");
            }
        }
        System.out.println(sb.toString());
    }
}`,
      python: `n = int(input())

students = []
for _ in range(n):
    data = input().split()
    students.append({'name': data[0], 'score': int(data[1])})

result = []
for s in students:
    if s['score'] < 60:
        result.append(f"{s['name']} {s['score']}")

print(' '.join(result) + ' ' if result else '')`
    },
    testCases: [
      { input: '3\nzhang 8\nwang 72\nzhao 34', expectedOutput: 'zhang 8 zhao 34 ', description: '两个不及格' }
    ],
    hints: ['不及格即成绩<60', '按输入顺序输出', '注意最后一个数据后也有空格'],
    explanation: `结构体筛选应用：
1. 定义学生结构体存储姓名和成绩
2. 读入所有学生数据
3. 遍历筛选出成绩<60的学生输出`
  },
  {
    id: 'struct-total-score', category: '结构体', title: '求n名学生各自的总成绩', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
定义一个学生结构体，包括学生姓名、两门课成绩和总成绩。编程序，从键盘输入 n 名学生的所有信息，求每个学生的总成绩并输出。

【输入格式】
学生人数 n（1个不超过 10 的正整数），n 名学生的姓名（1个字符串，长度不超过 19 个字符）和两门课程的成绩（2个非负整数）。

【输出格式】
每个学生的姓名、总成绩（保持输入时的顺序）。
相邻数据用 1 个空格隔开，最后 1 个数据的后面也有 1 个空格。

【样例】
输入：
3
zhang 68 89
wang 72 56
zhao 34 78

输出：zhang 157 wang 128 zhao 112 `,
    templates: {
      c: `#include <stdio.h>

typedef struct {
    char name[20];
    int score1, score2;
    int total;
} Student;

int main() {
    int n;
    scanf("%d", &n);
    
    Student students[10];
    // TODO: 读入并计算总成绩
    
    // TODO: 输出结果
    
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

struct Student {
    string name;
    int score1, score2;
    int total;
};

int main() {
    int n;
    cin >> n;
    
    Student students[10];
    // TODO: 读入并计算总成绩
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static class Student {
        String name;
        int score1, score2, total;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        // TODO: 读入并计算总成绩
    }
}`,
      python: `n = int(input())

# TODO: 读入学生信息并计算总成绩
`
    },
    solutions: {
      c: `#include <stdio.h>

typedef struct {
    char name[20];
    int score1, score2;
    int total;
} Student;

int main() {
    int n;
    scanf("%d", &n);
    
    Student students[10];
    for (int i = 0; i < n; i++) {
        scanf("%s %d %d", students[i].name, &students[i].score1, &students[i].score2);
        students[i].total = students[i].score1 + students[i].score2;
    }
    
    for (int i = 0; i < n; i++) {
        printf("%s %d ", students[i].name, students[i].total);
    }
    printf("\\n");
    
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

struct Student {
    string name;
    int score1, score2;
    int total;
};

int main() {
    int n;
    cin >> n;
    
    Student students[10];
    for (int i = 0; i < n; i++) {
        cin >> students[i].name >> students[i].score1 >> students[i].score2;
        students[i].total = students[i].score1 + students[i].score2;
    }
    
    for (int i = 0; i < n; i++) {
        cout << students[i].name << " " << students[i].total << " ";
    }
    cout << endl;
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static class Student {
        String name;
        int score1, score2, total;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        Student[] students = new Student[10];
        for (int i = 0; i < n; i++) {
            students[i] = new Student();
            students[i].name = sc.next();
            students[i].score1 = sc.nextInt();
            students[i].score2 = sc.nextInt();
            students[i].total = students[i].score1 + students[i].score2;
        }
        
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            sb.append(students[i].name + " " + students[i].total + " ");
        }
        System.out.println(sb.toString());
    }
}`,
      python: `n = int(input())

students = []
for _ in range(n):
    data = input().split()
    name = data[0]
    score1, score2 = int(data[1]), int(data[2])
    students.append({'name': name, 'total': score1 + score2})

result = ' '.join([f"{s['name']} {s['total']}" for s in students])
print(result + ' ')`
    },
    testCases: [
      { input: '3\nzhang 68 89\nwang 72 56\nzhao 34 78', expectedOutput: 'zhang 157 wang 128 zhao 112 ', description: '计算三名学生总成绩' }
    ],
    hints: ['总成绩 = 成绩1 + 成绩2', '在读入时就计算总成绩', '注意输出格式'],
    explanation: `结构体计算应用：
1. 结构体包含姓名、两门成绩和总成绩
2. 读入数据时计算总成绩存入结构体
3. 遍历输出姓名和总成绩`
  },
  {
    id: 'struct-sort-score', category: '结构体', title: '学生成绩排序', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
定义学生结构体（姓名、成绩），输入n个学生信息，按成绩从高到低排序输出。成绩相同时按输入顺序。

【输入格式】
第一行：学生人数n（n≤10）
接下来n行：每行一个姓名和成绩

【输出格式】
按成绩降序输出所有学生信息，每行一个学生：姓名 成绩

【样例】
输入：
4
zhang 85
wang 92
li 78
zhao 92

输出：
wang 92
zhao 92
zhang 85
li 78`,
    templates: {
      c: `#include <stdio.h>
#include <string.h>

typedef struct {
    char name[20];
    int score;
    int order;  // 输入顺序
} Student;

int main() {
    int n;
    scanf("%d", &n);
    
    Student stu[10];
    // TODO: 读入并排序输出
    
    return 0;
}`,
      cpp: `#include <iostream>
#include <algorithm>
#include <string>
using namespace std;

struct Student {
    string name;
    int score;
    int order;
};

int main() {
    int n;
    cin >> n;
    
    Student stu[10];
    // TODO: 读入并排序输出
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        // TODO: 读入并排序输出
    }
}`,
      python: `n = int(input())

students = []
for i in range(n):
    data = input().split()
    # TODO: 读入并排序输出
`
    },
    solutions: {
      c: `#include <stdio.h>
#include <string.h>

typedef struct {
    char name[20];
    int score;
    int order;
} Student;

int main() {
    int n;
    scanf("%d", &n);
    
    Student stu[10];
    for (int i = 0; i < n; i++) {
        scanf("%s %d", stu[i].name, &stu[i].score);
        stu[i].order = i;
    }
    
    // 冒泡排序（稳定排序）
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (stu[j].score < stu[j+1].score) {
                Student tmp = stu[j];
                stu[j] = stu[j+1];
                stu[j+1] = tmp;
            }
        }
    }
    
    for (int i = 0; i < n; i++) {
        printf("%s %d\\n", stu[i].name, stu[i].score);
    }
    
    return 0;
}`,
      cpp: `#include <iostream>
#include <algorithm>
#include <string>
using namespace std;

struct Student {
    string name;
    int score;
    int order;
};

bool cmp(Student a, Student b) {
    if (a.score != b.score) return a.score > b.score;
    return a.order < b.order;
}

int main() {
    int n;
    cin >> n;
    
    Student stu[10];
    for (int i = 0; i < n; i++) {
        cin >> stu[i].name >> stu[i].score;
        stu[i].order = i;
    }
    
    sort(stu, stu + n, cmp);
    
    for (int i = 0; i < n; i++) {
        cout << stu[i].name << " " << stu[i].score << endl;
    }
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        String[] names = new String[n];
        int[] scores = new int[n];
        Integer[] idx = new Integer[n];
        
        for (int i = 0; i < n; i++) {
            names[i] = sc.next();
            scores[i] = sc.nextInt();
            idx[i] = i;
        }
        
        Arrays.sort(idx, (a, b) -> {
            if (scores[a] != scores[b]) return scores[b] - scores[a];
            return a - b;
        });
        
        for (int i : idx) {
            System.out.println(names[i] + " " + scores[i]);
        }
    }
}`,
      python: `n = int(input())

students = []
for i in range(n):
    data = input().split()
    students.append({'name': data[0], 'score': int(data[1]), 'order': i})

students.sort(key=lambda x: (-x['score'], x['order']))

for s in students:
    print(f"{s['name']} {s['score']}")`
    },
    testCases: [
      { input: '4\nzhang 85\nwang 92\nli 78\nzhao 92', expectedOutput: 'wang 92\nzhao 92\nzhang 85\nli 78', description: '成绩相同保持输入顺序' }
    ],
    hints: ['需要记录输入顺序', '使用稳定排序或自定义比较函数', '成绩相同时按order升序'],
    explanation: `结构体排序：
1. 结构体增加order字段记录输入顺序
2. 自定义比较：先按成绩降序，成绩相同按order升序
3. C语言用冒泡排序（稳定），C++用sort+自定义cmp`
  },
  {
    id: 'struct-date', category: '结构体', title: '日期结构体计算', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
定义日期结构体（年、月、日），输入一个日期，计算它是该年的第几天。

【输入格式】
一行三个整数：年 月 日

【输出格式】
该日期是当年的第几天

【样例1】
输入：2024 3 1
输出：61

【样例2】
输入：2023 3 1
输出：60

【提示】闰年判断：能被4整除但不能被100整除，或能被400整除`,
    templates: {
      c: `#include <stdio.h>

typedef struct {
    int year, month, day;
} Date;

int isLeap(int year) {
    // TODO: 判断闰年
}

int dayOfYear(Date d) {
    // TODO: 计算是第几天
}

int main() {
    Date d;
    scanf("%d %d %d", &d.year, &d.month, &d.day);
    printf("%d\\n", dayOfYear(d));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

struct Date {
    int year, month, day;
};

int main() {
    Date d;
    cin >> d.year >> d.month >> d.day;
    
    // TODO: 计算是第几天
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static class Date {
        int year, month, day;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Date d = new Date();
        d.year = sc.nextInt();
        d.month = sc.nextInt();
        d.day = sc.nextInt();
        
        // TODO: 计算是第几天
    }
}`,
      python: `year, month, day = map(int, input().split())

# TODO: 计算是第几天
`
    },
    solutions: {
      c: `#include <stdio.h>

typedef struct {
    int year, month, day;
} Date;

int isLeap(int year) {
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
}

int dayOfYear(Date d) {
    int days[] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
    if (isLeap(d.year)) days[2] = 29;
    
    int total = 0;
    for (int i = 1; i < d.month; i++) {
        total += days[i];
    }
    total += d.day;
    return total;
}

int main() {
    Date d;
    scanf("%d %d %d", &d.year, &d.month, &d.day);
    printf("%d\\n", dayOfYear(d));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

struct Date {
    int year, month, day;
};

bool isLeap(int year) {
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
}

int main() {
    Date d;
    cin >> d.year >> d.month >> d.day;
    
    int days[] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
    if (isLeap(d.year)) days[2] = 29;
    
    int total = 0;
    for (int i = 1; i < d.month; i++) {
        total += days[i];
    }
    total += d.day;
    
    cout << total << endl;
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
        int month = sc.nextInt();
        int day = sc.nextInt();
        
        int[] days = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
        if (isLeap(year)) days[2] = 29;
        
        int total = 0;
        for (int i = 1; i < month; i++) {
            total += days[i];
        }
        total += day;
        
        System.out.println(total);
    }
}`,
      python: `year, month, day = map(int, input().split())

def is_leap(y):
    return (y % 4 == 0 and y % 100 != 0) or (y % 400 == 0)

days = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
if is_leap(year):
    days[2] = 29

total = sum(days[1:month]) + day
print(total)`
    },
    testCases: [
      { input: '2024 3 1', expectedOutput: '61', description: '闰年3月1日' },
      { input: '2023 3 1', expectedOutput: '60', description: '平年3月1日' }
    ],
    hints: ['先判断闰年决定2月天数', '累加前几个月的天数再加当月日期'],
    explanation: `日期结构体应用：
1. 存储年月日三个字段
2. 闰年判断：能被4整除但不能被100整除，或能被400整除
3. 累加1月到(month-1)月的天数，再加day`
  },
  {
    id: 'struct-point-distance', category: '结构体', title: '点结构体求距离', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
定义点结构体（x坐标、y坐标），输入两个点的坐标，计算两点间的距离。

【输入格式】
一行四个实数：x1 y1 x2 y2

【输出格式】
两点间距离，保留2位小数

【样例】
输入：0 0 3 4
输出：5.00`,
    templates: {
      c: `#include <stdio.h>
#include <math.h>

typedef struct {
    double x, y;
} Point;

double distance(Point p1, Point p2) {
    // TODO: 计算两点距离
}

int main() {
    Point p1, p2;
    scanf("%lf %lf %lf %lf", &p1.x, &p1.y, &p2.x, &p2.y);
    printf("%.2f\\n", distance(p1, p2));
    return 0;
}`,
      cpp: `#include <iostream>
#include <cmath>
#include <iomanip>
using namespace std;

struct Point {
    double x, y;
};

int main() {
    Point p1, p2;
    cin >> p1.x >> p1.y >> p2.x >> p2.y;
    
    // TODO: 计算并输出距离
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static class Point {
        double x, y;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Point p1 = new Point(), p2 = new Point();
        p1.x = sc.nextDouble(); p1.y = sc.nextDouble();
        p2.x = sc.nextDouble(); p2.y = sc.nextDouble();
        
        // TODO: 计算并输出距离
    }
}`,
      python: `x1, y1, x2, y2 = map(float, input().split())

# TODO: 计算并输出距离
`
    },
    solutions: {
      c: `#include <stdio.h>
#include <math.h>

typedef struct {
    double x, y;
} Point;

double distance(Point p1, Point p2) {
    double dx = p2.x - p1.x;
    double dy = p2.y - p1.y;
    return sqrt(dx * dx + dy * dy);
}

int main() {
    Point p1, p2;
    scanf("%lf %lf %lf %lf", &p1.x, &p1.y, &p2.x, &p2.y);
    printf("%.2f\\n", distance(p1, p2));
    return 0;
}`,
      cpp: `#include <iostream>
#include <cmath>
#include <iomanip>
using namespace std;

struct Point {
    double x, y;
};

int main() {
    Point p1, p2;
    cin >> p1.x >> p1.y >> p2.x >> p2.y;
    
    double dx = p2.x - p1.x;
    double dy = p2.y - p1.y;
    double dist = sqrt(dx * dx + dy * dy);
    
    cout << fixed << setprecision(2) << dist << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static class Point {
        double x, y;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Point p1 = new Point(), p2 = new Point();
        p1.x = sc.nextDouble(); p1.y = sc.nextDouble();
        p2.x = sc.nextDouble(); p2.y = sc.nextDouble();
        
        double dx = p2.x - p1.x;
        double dy = p2.y - p1.y;
        double dist = Math.sqrt(dx * dx + dy * dy);
        
        System.out.printf("%.2f%n", dist);
    }
}`,
      python: `import math

x1, y1, x2, y2 = map(float, input().split())

dist = math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
print(f"{dist:.2f}")`
    },
    testCases: [
      { input: '0 0 3 4', expectedOutput: '5.00', description: '3-4-5直角三角形' },
      { input: '1 1 4 5', expectedOutput: '5.00', description: '另一组测试' }
    ],
    hints: ['距离公式：sqrt((x2-x1)² + (y2-y1)²)', '需要引入math库使用sqrt'],
    explanation: `点结构体应用：
1. 结构体存储x、y坐标
2. 距离公式：d = √[(x2-x1)² + (y2-y1)²]`
  },
  {
    id: 'struct-rect-area', category: '结构体', title: '矩形结构体求面积', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
用点结构体表示矩形的左下角和右上角两个点，计算矩形面积。

【输入格式】
一行四个整数：左下角x1 y1，右上角x2 y2

【输出格式】
矩形面积

【样例】
输入：1 1 4 5
输出：12`,
    templates: {
      c: `#include <stdio.h>

typedef struct {
    int x, y;
} Point;

typedef struct {
    Point bottomLeft;
    Point topRight;
} Rectangle;

int area(Rectangle r) {
    // TODO: 计算面积
}

int main() {
    Rectangle r;
    scanf("%d %d %d %d", &r.bottomLeft.x, &r.bottomLeft.y, 
          &r.topRight.x, &r.topRight.y);
    printf("%d\\n", area(r));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

struct Point { int x, y; };
struct Rectangle { Point bottomLeft, topRight; };

int main() {
    Rectangle r;
    cin >> r.bottomLeft.x >> r.bottomLeft.y 
        >> r.topRight.x >> r.topRight.y;
    
    // TODO: 计算并输出面积
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static class Point { int x, y; }
    static class Rectangle { Point bl = new Point(), tr = new Point(); }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Rectangle r = new Rectangle();
        r.bl.x = sc.nextInt(); r.bl.y = sc.nextInt();
        r.tr.x = sc.nextInt(); r.tr.y = sc.nextInt();
        
        // TODO: 计算并输出面积
    }
}`,
      python: `x1, y1, x2, y2 = map(int, input().split())

# TODO: 计算并输出面积
`
    },
    solutions: {
      c: `#include <stdio.h>

typedef struct {
    int x, y;
} Point;

typedef struct {
    Point bottomLeft;
    Point topRight;
} Rectangle;

int area(Rectangle r) {
    int width = r.topRight.x - r.bottomLeft.x;
    int height = r.topRight.y - r.bottomLeft.y;
    return width * height;
}

int main() {
    Rectangle r;
    scanf("%d %d %d %d", &r.bottomLeft.x, &r.bottomLeft.y, 
          &r.topRight.x, &r.topRight.y);
    printf("%d\\n", area(r));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

struct Point { int x, y; };
struct Rectangle { Point bottomLeft, topRight; };

int main() {
    Rectangle r;
    cin >> r.bottomLeft.x >> r.bottomLeft.y 
        >> r.topRight.x >> r.topRight.y;
    
    int width = r.topRight.x - r.bottomLeft.x;
    int height = r.topRight.y - r.bottomLeft.y;
    
    cout << width * height << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static class Point { int x, y; }
    static class Rectangle { Point bl = new Point(), tr = new Point(); }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Rectangle r = new Rectangle();
        r.bl.x = sc.nextInt(); r.bl.y = sc.nextInt();
        r.tr.x = sc.nextInt(); r.tr.y = sc.nextInt();
        
        int width = r.tr.x - r.bl.x;
        int height = r.tr.y - r.bl.y;
        System.out.println(width * height);
    }
}`,
      python: `x1, y1, x2, y2 = map(int, input().split())

width = x2 - x1
height = y2 - y1
print(width * height)`
    },
    testCases: [
      { input: '1 1 4 5', expectedOutput: '12', description: '3×4矩形' },
      { input: '0 0 5 5', expectedOutput: '25', description: '5×5正方形' }
    ],
    hints: ['宽 = x2 - x1，高 = y2 - y1', '面积 = 宽 × 高'],
    explanation: `结构体嵌套：
1. Point结构体存储坐标
2. Rectangle结构体包含两个Point
3. 面积 = (x2-x1) × (y2-y1)`
  },
  {
    id: 'struct-time-add', category: '结构体', title: '时间结构体加法', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
定义时间结构体（时、分、秒），输入两个时间，计算它们的和。

【输入格式】
两行，每行三个整数表示时、分、秒

【输出格式】
一行三个整数：时 分 秒（秒和分不超过59）

【样例】
输入：
1 30 45
2 45 30

输出：4 16 15`,
    templates: {
      c: `#include <stdio.h>

typedef struct {
    int hour, minute, second;
} Time;

Time addTime(Time t1, Time t2) {
    // TODO: 实现时间相加
}

int main() {
    Time t1, t2;
    scanf("%d %d %d", &t1.hour, &t1.minute, &t1.second);
    scanf("%d %d %d", &t2.hour, &t2.minute, &t2.second);
    
    Time result = addTime(t1, t2);
    printf("%d %d %d\\n", result.hour, result.minute, result.second);
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

struct Time {
    int hour, minute, second;
};

int main() {
    Time t1, t2;
    cin >> t1.hour >> t1.minute >> t1.second;
    cin >> t2.hour >> t2.minute >> t2.second;
    
    // TODO: 计算时间和
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static class Time {
        int hour, minute, second;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Time t1 = new Time(), t2 = new Time();
        t1.hour = sc.nextInt(); t1.minute = sc.nextInt(); t1.second = sc.nextInt();
        t2.hour = sc.nextInt(); t2.minute = sc.nextInt(); t2.second = sc.nextInt();
        
        // TODO: 计算时间和
    }
}`,
      python: `h1, m1, s1 = map(int, input().split())
h2, m2, s2 = map(int, input().split())

# TODO: 计算时间和
`
    },
    solutions: {
      c: `#include <stdio.h>

typedef struct {
    int hour, minute, second;
} Time;

Time addTime(Time t1, Time t2) {
    Time result;
    int totalSeconds = t1.second + t2.second;
    result.second = totalSeconds % 60;
    
    int totalMinutes = t1.minute + t2.minute + totalSeconds / 60;
    result.minute = totalMinutes % 60;
    
    result.hour = t1.hour + t2.hour + totalMinutes / 60;
    
    return result;
}

int main() {
    Time t1, t2;
    scanf("%d %d %d", &t1.hour, &t1.minute, &t1.second);
    scanf("%d %d %d", &t2.hour, &t2.minute, &t2.second);
    
    Time result = addTime(t1, t2);
    printf("%d %d %d\\n", result.hour, result.minute, result.second);
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

struct Time {
    int hour, minute, second;
};

int main() {
    Time t1, t2;
    cin >> t1.hour >> t1.minute >> t1.second;
    cin >> t2.hour >> t2.minute >> t2.second;
    
    int totalSec = t1.second + t2.second;
    int sec = totalSec % 60;
    
    int totalMin = t1.minute + t2.minute + totalSec / 60;
    int min = totalMin % 60;
    
    int hour = t1.hour + t2.hour + totalMin / 60;
    
    cout << hour << " " << min << " " << sec << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int h1 = sc.nextInt(), m1 = sc.nextInt(), s1 = sc.nextInt();
        int h2 = sc.nextInt(), m2 = sc.nextInt(), s2 = sc.nextInt();
        
        int totalSec = s1 + s2;
        int sec = totalSec % 60;
        
        int totalMin = m1 + m2 + totalSec / 60;
        int min = totalMin % 60;
        
        int hour = h1 + h2 + totalMin / 60;
        
        System.out.println(hour + " " + min + " " + sec);
    }
}`,
      python: `h1, m1, s1 = map(int, input().split())
h2, m2, s2 = map(int, input().split())

total_sec = s1 + s2
sec = total_sec % 60

total_min = m1 + m2 + total_sec // 60
min_ = total_min % 60

hour = h1 + h2 + total_min // 60

print(hour, min_, sec)`
    },
    testCases: [
      { input: '1 30 45\n2 45 30', expectedOutput: '4 16 15', description: '需要进位' },
      { input: '0 0 30\n0 0 40', expectedOutput: '0 1 10', description: '秒进位到分' }
    ],
    hints: ['先加秒，超过60进位到分', '再加分，超过60进位到时'],
    explanation: `时间结构体应用：
1. 秒相加，取模60得秒，除60得进位
2. 分相加（含进位），取模60得分，除60得进位
3. 时相加（含进位）`
  },
  {
    id: 'struct-book-search', category: '结构体', title: '图书信息查找', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
定义图书结构体（书名、作者、价格），输入n本书的信息，然后查找指定书名的图书并输出其信息。

【输入格式】
第一行：图书数量n（n≤10）
接下来n行：每行书名、作者、价格（书名和作者不含空格）
最后一行：要查找的书名

【输出格式】
找到则输出：书名 作者 价格（价格保留2位小数）
未找到则输出：Not Found

【样例】
输入：
3
CPrimer Zhang 58.5
Java Lee 45.0
Python Wang 39.9
Java

输出：Java Lee 45.00`,
    templates: {
      c: `#include <stdio.h>
#include <string.h>

typedef struct {
    char title[50];
    char author[50];
    double price;
} Book;

int main() {
    int n;
    scanf("%d", &n);
    
    Book books[10];
    // TODO: 读入图书信息
    
    char target[50];
    scanf("%s", target);
    // TODO: 查找并输出
    
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
#include <iomanip>
using namespace std;

struct Book {
    string title, author;
    double price;
};

int main() {
    int n;
    cin >> n;
    
    Book books[10];
    // TODO: 读入图书信息
    
    string target;
    cin >> target;
    // TODO: 查找并输出
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static class Book {
        String title, author;
        double price;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        // TODO: 读入图书信息，查找并输出
    }
}`,
      python: `n = int(input())

books = []
for _ in range(n):
    data = input().split()
    # TODO: 读入图书信息

target = input()
# TODO: 查找并输出
`
    },
    solutions: {
      c: `#include <stdio.h>
#include <string.h>

typedef struct {
    char title[50];
    char author[50];
    double price;
} Book;

int main() {
    int n;
    scanf("%d", &n);
    
    Book books[10];
    for (int i = 0; i < n; i++) {
        scanf("%s %s %lf", books[i].title, books[i].author, &books[i].price);
    }
    
    char target[50];
    scanf("%s", target);
    
    int found = 0;
    for (int i = 0; i < n; i++) {
        if (strcmp(books[i].title, target) == 0) {
            printf("%s %s %.2f\\n", books[i].title, books[i].author, books[i].price);
            found = 1;
            break;
        }
    }
    
    if (!found) printf("Not Found\\n");
    
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
#include <iomanip>
using namespace std;

struct Book {
    string title, author;
    double price;
};

int main() {
    int n;
    cin >> n;
    
    Book books[10];
    for (int i = 0; i < n; i++) {
        cin >> books[i].title >> books[i].author >> books[i].price;
    }
    
    string target;
    cin >> target;
    
    bool found = false;
    for (int i = 0; i < n; i++) {
        if (books[i].title == target) {
            cout << books[i].title << " " << books[i].author << " "
                 << fixed << setprecision(2) << books[i].price << endl;
            found = true;
            break;
        }
    }
    
    if (!found) cout << "Not Found" << endl;
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static class Book {
        String title, author;
        double price;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        Book[] books = new Book[10];
        for (int i = 0; i < n; i++) {
            books[i] = new Book();
            books[i].title = sc.next();
            books[i].author = sc.next();
            books[i].price = sc.nextDouble();
        }
        
        String target = sc.next();
        
        boolean found = false;
        for (int i = 0; i < n; i++) {
            if (books[i].title.equals(target)) {
                System.out.printf("%s %s %.2f%n", books[i].title, books[i].author, books[i].price);
                found = true;
                break;
            }
        }
        
        if (!found) System.out.println("Not Found");
    }
}`,
      python: `n = int(input())

books = []
for _ in range(n):
    data = input().split()
    books.append({'title': data[0], 'author': data[1], 'price': float(data[2])})

target = input()

found = False
for book in books:
    if book['title'] == target:
        print(f"{book['title']} {book['author']} {book['price']:.2f}")
        found = True
        break

if not found:
    print("Not Found")`
    },
    testCases: [
      { input: '3\nCPrimer Zhang 58.5\nJava Lee 45.0\nPython Wang 39.9\nJava', expectedOutput: 'Java Lee 45.00', description: '找到图书' },
      { input: '2\nC Zhang 50\nJava Lee 40\nPython', expectedOutput: 'Not Found', description: '未找到' }
    ],
    hints: ['C语言用strcmp比较字符串', '遍历查找匹配的书名'],
    explanation: `结构体查找应用：
1. 结构体存储书名、作者、价格
2. 遍历数组比较书名
3. 找到输出信息，否则输出Not Found`
  },
  {
    id: 'struct-employee-avg', category: '结构体', title: '员工平均工资', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
定义员工结构体（姓名、部门、工资），输入n个员工信息，计算并输出所有员工的平均工资，以及工资高于平均值的员工姓名。

【输入格式】
第一行：员工数n（n≤10）
接下来n行：每行姓名、部门、工资

【输出格式】
第一行：平均工资（保留2位小数）
第二行：工资高于平均值的员工姓名（空格分隔）

【样例】
输入：
4
zhang IT 8000
wang HR 6000
li IT 9000
zhao Sales 7000

输出：
7500.00
zhang li`,
    templates: {
      c: `#include <stdio.h>

typedef struct {
    char name[20];
    char dept[20];
    double salary;
} Employee;

int main() {
    int n;
    scanf("%d", &n);
    
    Employee emp[10];
    // TODO: 读入员工信息
    
    // TODO: 计算平均工资并输出高于平均的员工
    
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
#include <iomanip>
using namespace std;

struct Employee {
    string name, dept;
    double salary;
};

int main() {
    int n;
    cin >> n;
    
    Employee emp[10];
    // TODO: 读入员工信息
    
    // TODO: 计算平均工资并输出高于平均的员工
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static class Employee {
        String name, dept;
        double salary;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        // TODO: 读入员工信息，计算平均工资
    }
}`,
      python: `n = int(input())

employees = []
for _ in range(n):
    data = input().split()
    # TODO: 读入员工信息

# TODO: 计算平均工资并输出高于平均的员工
`
    },
    solutions: {
      c: `#include <stdio.h>

typedef struct {
    char name[20];
    char dept[20];
    double salary;
} Employee;

int main() {
    int n;
    scanf("%d", &n);
    
    Employee emp[10];
    double total = 0;
    for (int i = 0; i < n; i++) {
        scanf("%s %s %lf", emp[i].name, emp[i].dept, &emp[i].salary);
        total += emp[i].salary;
    }
    
    double avg = total / n;
    printf("%.2f\\n", avg);
    
    for (int i = 0; i < n; i++) {
        if (emp[i].salary > avg) {
            printf("%s ", emp[i].name);
        }
    }
    printf("\\n");
    
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
#include <iomanip>
using namespace std;

struct Employee {
    string name, dept;
    double salary;
};

int main() {
    int n;
    cin >> n;
    
    Employee emp[10];
    double total = 0;
    for (int i = 0; i < n; i++) {
        cin >> emp[i].name >> emp[i].dept >> emp[i].salary;
        total += emp[i].salary;
    }
    
    double avg = total / n;
    cout << fixed << setprecision(2) << avg << endl;
    
    for (int i = 0; i < n; i++) {
        if (emp[i].salary > avg) {
            cout << emp[i].name << " ";
        }
    }
    cout << endl;
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static class Employee {
        String name, dept;
        double salary;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        Employee[] emp = new Employee[10];
        double total = 0;
        for (int i = 0; i < n; i++) {
            emp[i] = new Employee();
            emp[i].name = sc.next();
            emp[i].dept = sc.next();
            emp[i].salary = sc.nextDouble();
            total += emp[i].salary;
        }
        
        double avg = total / n;
        System.out.printf("%.2f%n", avg);
        
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (emp[i].salary > avg) {
                sb.append(emp[i].name + " ");
            }
        }
        System.out.println(sb.toString().trim());
    }
}`,
      python: `n = int(input())

employees = []
total = 0
for _ in range(n):
    data = input().split()
    emp = {'name': data[0], 'dept': data[1], 'salary': float(data[2])}
    employees.append(emp)
    total += emp['salary']

avg = total / n
print(f"{avg:.2f}")

above_avg = [e['name'] for e in employees if e['salary'] > avg]
print(' '.join(above_avg))`
    },
    testCases: [
      { input: '4\nzhang IT 8000\nwang HR 6000\nli IT 9000\nzhao Sales 7000', expectedOutput: '7500.00\nzhang li', description: '计算平均工资' }
    ],
    hints: ['先遍历计算总工资求平均', '再遍历筛选高于平均的员工'],
    explanation: `结构体统计应用：
1. 第一次遍历累加工资计算平均值
2. 第二次遍历筛选高于平均值的员工`
  },
  {
    id: 'struct-fraction', category: '结构体', title: '分数结构体运算', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
定义分数结构体（分子、分母），输入两个分数，计算它们的和，结果化为最简分数。

【输入格式】
一行四个整数：a1 b1 a2 b2，表示分数 a1/b1 和 a2/b2

【输出格式】
最简分数形式 a/b，如果分母为1则只输出分子

【样例1】
输入：1 2 1 3
输出：5/6

【样例2】
输入：1 2 1 2
输出：1`,
    templates: {
      c: `#include <stdio.h>

typedef struct {
    int num;   // 分子
    int den;   // 分母
} Fraction;

int gcd(int a, int b) {
    // TODO: 求最大公约数
}

Fraction add(Fraction f1, Fraction f2) {
    // TODO: 分数相加并化简
}

int main() {
    Fraction f1, f2;
    scanf("%d %d %d %d", &f1.num, &f1.den, &f2.num, &f2.den);
    
    Fraction result = add(f1, f2);
    // TODO: 输出结果
    
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

struct Fraction {
    int num, den;
};

int main() {
    Fraction f1, f2;
    cin >> f1.num >> f1.den >> f2.num >> f2.den;
    
    // TODO: 计算和并化简输出
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static int gcd(int a, int b) {
        return b == 0 ? a : gcd(b, a % b);
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a1 = sc.nextInt(), b1 = sc.nextInt();
        int a2 = sc.nextInt(), b2 = sc.nextInt();
        
        // TODO: 计算和并化简输出
    }
}`,
      python: `import math

a1, b1, a2, b2 = map(int, input().split())

# TODO: 计算和并化简输出
`
    },
    solutions: {
      c: `#include <stdio.h>

typedef struct {
    int num;
    int den;
} Fraction;

int gcd(int a, int b) {
    if (a < 0) a = -a;
    if (b < 0) b = -b;
    return b == 0 ? a : gcd(b, a % b);
}

Fraction add(Fraction f1, Fraction f2) {
    Fraction result;
    result.num = f1.num * f2.den + f2.num * f1.den;
    result.den = f1.den * f2.den;
    
    int g = gcd(result.num, result.den);
    result.num /= g;
    result.den /= g;
    
    return result;
}

int main() {
    Fraction f1, f2;
    scanf("%d %d %d %d", &f1.num, &f1.den, &f2.num, &f2.den);
    
    Fraction result = add(f1, f2);
    
    if (result.den == 1) {
        printf("%d\\n", result.num);
    } else {
        printf("%d/%d\\n", result.num, result.den);
    }
    
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

struct Fraction {
    int num, den;
};

int gcd(int a, int b) {
    if (a < 0) a = -a;
    if (b < 0) b = -b;
    return b == 0 ? a : gcd(b, a % b);
}

int main() {
    Fraction f1, f2;
    cin >> f1.num >> f1.den >> f2.num >> f2.den;
    
    int num = f1.num * f2.den + f2.num * f1.den;
    int den = f1.den * f2.den;
    
    int g = gcd(num, den);
    num /= g;
    den /= g;
    
    if (den == 1) {
        cout << num << endl;
    } else {
        cout << num << "/" << den << endl;
    }
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static int gcd(int a, int b) {
        if (a < 0) a = -a;
        if (b < 0) b = -b;
        return b == 0 ? a : gcd(b, a % b);
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a1 = sc.nextInt(), b1 = sc.nextInt();
        int a2 = sc.nextInt(), b2 = sc.nextInt();
        
        int num = a1 * b2 + a2 * b1;
        int den = b1 * b2;
        
        int g = gcd(num, den);
        num /= g;
        den /= g;
        
        if (den == 1) {
            System.out.println(num);
        } else {
            System.out.println(num + "/" + den);
        }
    }
}`,
      python: `import math

a1, b1, a2, b2 = map(int, input().split())

num = a1 * b2 + a2 * b1
den = b1 * b2

g = math.gcd(abs(num), abs(den))
num //= g
den //= g

if den == 1:
    print(num)
else:
    print(f"{num}/{den}")`
    },
    testCases: [
      { input: '1 2 1 3', expectedOutput: '5/6', description: '1/2+1/3=5/6' },
      { input: '1 2 1 2', expectedOutput: '1', description: '1/2+1/2=1' }
    ],
    hints: ['分数加法：a/b + c/d = (ad+bc)/bd', '用GCD化简分数'],
    explanation: `分数结构体应用：
1. 结构体存储分子分母
2. 加法公式：(a1*b2 + a2*b1) / (b1*b2)
3. 用最大公约数化简结果`
  }
];


export const structuresExerciseBank: Exercise[] = [
  ...structExercises,
];

