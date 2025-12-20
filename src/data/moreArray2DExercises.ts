// 更多二维数组题目 - 数字逻辑电路考试
import type { Exercise } from './exercises';

export const moreArray2DExercises: Exercise[] = [
  {
    id: 'arr2d-rotate',
    category: '二维数组',
    title: '矩阵顺时针旋转90度',
    difficulty: 'medium',
    type: 'coding',
    isExamFocus: true,
    description: `【题目描述】
给定一个n×n的矩阵，将其顺时针旋转90度。要求原地旋转。

【输入格式】
第一行：整数n
接下来n行，每行n个整数

【输出格式】
输出旋转后的n×n矩阵

【样例输入】
3
1 2 3
4 5 6
7 8 9

【样例输出】
7 4 1
8 5 2
9 6 3

【数据范围】
- 1 ≤ n ≤ 100`,
    templates: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void rotate(vector<vector<int>>& matrix) {
    // TODO: 原地顺时针旋转90度
}

int main() {
    int n;
    cin >> n;
    vector<vector<int>> matrix(n, vector<int>(n));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> matrix[i][j];
    rotate(matrix);
    for (auto& row : matrix) {
        for (int x : row) cout << x << " ";
        cout << endl;
    }
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void rotate(int[][] matrix) {
        // TODO: 原地顺时针旋转90度
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] matrix = new int[n][n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                matrix[i][j] = sc.nextInt();
        rotate(matrix);
        for (int[] row : matrix) {
            for (int x : row) System.out.print(x + " ");
            System.out.println();
        }
    }
}`,
      python: `def rotate(matrix):
    # TODO: 原地顺时针旋转90度
    pass

n = int(input())
matrix = [list(map(int, input().split())) for _ in range(n)]
rotate(matrix)
for row in matrix:
    print(' '.join(map(str, row)))`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

void rotate(vector<vector<int>>& matrix) {
    int n = matrix.size();
    // 方法：先转置，再左右翻转
    // 1. 转置：matrix[i][j] <-> matrix[j][i]
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            swap(matrix[i][j], matrix[j][i]);
    // 2. 左右翻转每一行
    for (int i = 0; i < n; i++)
        reverse(matrix[i].begin(), matrix[i].end());
}

int main() {
    int n;
    cin >> n;
    vector<vector<int>> matrix(n, vector<int>(n));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> matrix[i][j];
    rotate(matrix);
    for (auto& row : matrix) {
        for (int x : row) cout << x << " ";
        cout << endl;
    }
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void rotate(int[][] matrix) {
        int n = matrix.length;
        // 1. 转置
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        // 2. 左右翻转
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n / 2; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[i][n - 1 - j];
                matrix[i][n - 1 - j] = temp;
            }
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] matrix = new int[n][n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                matrix[i][j] = sc.nextInt();
        rotate(matrix);
        for (int[] row : matrix) {
            for (int x : row) System.out.print(x + " ");
            System.out.println();
        }
    }
}`,
      python: `def rotate(matrix):
    n = len(matrix)
    # 1. 转置
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    # 2. 左右翻转
    for i in range(n):
        matrix[i].reverse()

n = int(input())
matrix = [list(map(int, input().split())) for _ in range(n)]
rotate(matrix)
for row in matrix:
    print(' '.join(map(str, row)))`
    },
    testCases: [
      { input: '3\\n1 2 3\\n4 5 6\\n7 8 9', expectedOutput: '7 4 1\\n8 5 2\\n9 6 3', description: '3×3矩阵' },
      { input: '2\\n1 2\\n3 4', expectedOutput: '3 1\\n4 2', description: '2×2矩阵' }
    ],
    hints: [
      '顺时针旋转90度 = 先转置 + 再左右翻转',
      '转置：交换matrix[i][j]和matrix[j][i]',
      '只需遍历上三角（j > i）避免重复交换'
    ],
    explanation: `【矩阵旋转技巧】
顺时针旋转90度 = 转置 + 左右翻转
逆时针旋转90度 = 转置 + 上下翻转

【原地旋转的关键】
1. 转置时只遍历上三角(j>i)
2. 翻转时只遍历一半

【时间复杂度】O(n²)
【空间复杂度】O(1)`,
    commonMistakes: [
      '转置时遍历整个矩阵导致交换两次',
      '旋转方向搞反（顺时针vs逆时针）',
      '非方阵无法原地旋转'
    ]
  },
  {
    id: 'arr2d-diagonal-sum',
    category: '二维数组',
    title: '矩阵对角线元素和',
    difficulty: 'easy',
    type: 'coding',
    isExamFocus: true,
    description: `【题目描述】
给定一个n×n的方阵，计算主对角线和副对角线元素之和。
注意：如果n为奇数，中心元素只计算一次。

【输入格式】
第一行：整数n
接下来n行，每行n个整数

【输出格式】
输出对角线元素之和

【样例输入】
3
1 2 3
4 5 6
7 8 9

【样例输出】
25

【解释】
主对角线：1+5+9=15
副对角线：3+5+7=15
中心元素5只算一次：15+15-5=25`,
    templates: {
      cpp: `#include <iostream>
using namespace std;

int diagonalSum(int a[][105], int n) {
    // TODO: 计算对角线元素和
    return 0;
}

int main() {
    int n;
    cin >> n;
    int a[105][105];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> a[i][j];
    cout << diagonalSum(a, n) << endl;
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static int diagonalSum(int[][] a) {
        // TODO: 计算对角线元素和
        return 0;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] a = new int[n][n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                a[i][j] = sc.nextInt();
        System.out.println(diagonalSum(a));
    }
}`,
      python: `def diagonal_sum(a):
    # TODO: 计算对角线元素和
    pass

n = int(input())
a = [list(map(int, input().split())) for _ in range(n)]
print(diagonal_sum(a))`
    },
    solutions: {
      cpp: `#include <iostream>
using namespace std;

int diagonalSum(int a[][105], int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += a[i][i];           // 主对角线
        sum += a[i][n - 1 - i];   // 副对角线
    }
    // 如果n为奇数，中心元素被加了两次，需要减去一次
    if (n % 2 == 1) {
        sum -= a[n / 2][n / 2];
    }
    return sum;
}

int main() {
    int n;
    cin >> n;
    int a[105][105];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> a[i][j];
    cout << diagonalSum(a, n) << endl;
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static int diagonalSum(int[][] a) {
        int n = a.length, sum = 0;
        for (int i = 0; i < n; i++) {
            sum += a[i][i];
            sum += a[i][n - 1 - i];
        }
        if (n % 2 == 1) sum -= a[n / 2][n / 2];
        return sum;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] a = new int[n][n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                a[i][j] = sc.nextInt();
        System.out.println(diagonalSum(a));
    }
}`,
      python: `def diagonal_sum(a):
    n = len(a)
    total = 0
    for i in range(n):
        total += a[i][i]           # 主对角线
        total += a[i][n - 1 - i]   # 副对角线
    if n % 2 == 1:
        total -= a[n // 2][n // 2]  # 中心元素减一次
    return total

n = int(input())
a = [list(map(int, input().split())) for _ in range(n)]
print(diagonal_sum(a))`
    },
    testCases: [
      { input: '3\\n1 2 3\\n4 5 6\\n7 8 9', expectedOutput: '25', description: '3×3矩阵' },
      { input: '4\\n1 2 3 4\\n5 6 7 8\\n9 10 11 12\\n13 14 15 16', expectedOutput: '68', description: '4×4矩阵' }
    ],
    hints: [
      '主对角线：a[i][i]',
      '副对角线：a[i][n-1-i]',
      'n为奇数时中心元素会被加两次'
    ],
    explanation: `【对角线遍历】
主对角线：行号=列号，即a[i][i]
副对角线：行号+列号=n-1，即a[i][n-1-i]

【注意】
当n为奇数时，中心元素(n/2, n/2)同时在两条对角线上，会被加两次，需要减去一次。

【时间复杂度】O(n)
【空间复杂度】O(1)`,
    commonMistakes: [
      '忘记处理n为奇数时中心元素重复计算',
      '副对角线下标计算错误',
      '遍历整个矩阵而不是只遍历对角线'
    ]
  },
  {
    id: 'arr2d-search',
    category: '二维数组',
    title: '二维数组查找',
    difficulty: 'medium',
    type: 'coding',
    isExamFocus: true,
    description: `【题目描述】
在一个m×n的二维数组中，每一行从左到右递增，每一列从上到下递增。
判断数组中是否存在目标值target。

【输入格式】
第一行：整数m, n, target
接下来m行，每行n个整数

【输出格式】
输出true或false

【样例输入】
4 5 14
1 4 7 11 15
2 5 8 12 19
3 6 9 16 22
10 13 14 17 24

【样例输出】
true

【数据范围】
- 1 ≤ m, n ≤ 300`,
    templates: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

bool searchMatrix(vector<vector<int>>& matrix, int target) {
    // TODO: 实现查找
    return false;
}

int main() {
    int m, n, target;
    cin >> m >> n >> target;
    vector<vector<int>> matrix(m, vector<int>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            cin >> matrix[i][j];
    cout << (searchMatrix(matrix, target) ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static boolean searchMatrix(int[][] matrix, int target) {
        // TODO: 实现查找
        return false;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt(), n = sc.nextInt(), target = sc.nextInt();
        int[][] matrix = new int[m][n];
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                matrix[i][j] = sc.nextInt();
        System.out.println(searchMatrix(matrix, target) ? "true" : "false");
    }
}`,
      python: `def search_matrix(matrix, target):
    # TODO: 实现查找
    pass

m, n, target = map(int, input().split())
matrix = [list(map(int, input().split())) for _ in range(m)]
print("true" if search_matrix(matrix, target) else "false")`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

bool searchMatrix(vector<vector<int>>& matrix, int target) {
    if (matrix.empty()) return false;
    int m = matrix.size(), n = matrix[0].size();
    // 从右上角开始搜索
    int i = 0, j = n - 1;
    while (i < m && j >= 0) {
        if (matrix[i][j] == target) return true;
        else if (matrix[i][j] > target) j--;  // 当前值太大，左移
        else i++;  // 当前值太小，下移
    }
    return false;
}

int main() {
    int m, n, target;
    cin >> m >> n >> target;
    vector<vector<int>> matrix(m, vector<int>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            cin >> matrix[i][j];
    cout << (searchMatrix(matrix, target) ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static boolean searchMatrix(int[][] matrix, int target) {
        if (matrix.length == 0) return false;
        int m = matrix.length, n = matrix[0].length;
        int i = 0, j = n - 1;
        while (i < m && j >= 0) {
            if (matrix[i][j] == target) return true;
            else if (matrix[i][j] > target) j--;
            else i++;
        }
        return false;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt(), n = sc.nextInt(), target = sc.nextInt();
        int[][] matrix = new int[m][n];
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                matrix[i][j] = sc.nextInt();
        System.out.println(searchMatrix(matrix, target) ? "true" : "false");
    }
}`,
      python: `def search_matrix(matrix, target):
    if not matrix:
        return False
    m, n = len(matrix), len(matrix[0])
    i, j = 0, n - 1  # 从右上角开始
    while i < m and j >= 0:
        if matrix[i][j] == target:
            return True
        elif matrix[i][j] > target:
            j -= 1
        else:
            i += 1
    return False

m, n, target = map(int, input().split())
matrix = [list(map(int, input().split())) for _ in range(m)]
print("true" if search_matrix(matrix, target) else "false")`
    },
    testCases: [
      { input: '4 5 14\\n1 4 7 11 15\\n2 5 8 12 19\\n3 6 9 16 22\\n10 13 14 17 24', expectedOutput: 'true', description: '存在' },
      { input: '4 5 20\\n1 4 7 11 15\\n2 5 8 12 19\\n3 6 9 16 22\\n10 13 14 17 24', expectedOutput: 'false', description: '不存在' }
    ],
    hints: [
      '从右上角或左下角开始搜索',
      '右上角：比target大则左移，比target小则下移',
      '每次可以排除一行或一列'
    ],
    explanation: `【二维有序数组查找技巧】
从右上角(0, n-1)开始：
- 当前值 > target：左移（排除当前列）
- 当前值 < target：下移（排除当前行）
- 当前值 = target：找到

【为什么选右上角？】
右上角元素是该行最大、该列最小，可以明确决定移动方向。

【时间复杂度】O(m+n)
【空间复杂度】O(1)`,
    commonMistakes: [
      '从左上角开始无法确定移动方向',
      '边界条件判断错误',
      '使用暴力O(mn)搜索'
    ]
  },
  {
    id: 'arr2d-set-zeroes',
    category: '二维数组',
    title: '矩阵置零',
    difficulty: 'medium',
    type: 'coding',
    isExamFocus: true,
    description: `【题目描述】
给定一个m×n的矩阵，如果某个元素为0，则将其所在的整行和整列都置为0。
要求原地修改。

【输入格式】
第一行：整数m和n
接下来m行，每行n个整数

【输出格式】
输出修改后的矩阵

【样例输入】
3 3
1 1 1
1 0 1
1 1 1

【样例输出】
1 0 1
0 0 0
1 0 1`,
    templates: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void setZeroes(vector<vector<int>>& matrix) {
    // TODO: 原地将0所在行列置零
}

int main() {
    int m, n;
    cin >> m >> n;
    vector<vector<int>> matrix(m, vector<int>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            cin >> matrix[i][j];
    setZeroes(matrix);
    for (auto& row : matrix) {
        for (int x : row) cout << x << " ";
        cout << endl;
    }
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void setZeroes(int[][] matrix) {
        // TODO: 原地将0所在行列置零
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt(), n = sc.nextInt();
        int[][] matrix = new int[m][n];
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                matrix[i][j] = sc.nextInt();
        setZeroes(matrix);
        for (int[] row : matrix) {
            for (int x : row) System.out.print(x + " ");
            System.out.println();
        }
    }
}`,
      python: `def set_zeroes(matrix):
    # TODO: 原地将0所在行列置零
    pass

m, n = map(int, input().split())
matrix = [list(map(int, input().split())) for _ in range(m)]
set_zeroes(matrix)
for row in matrix:
    print(' '.join(map(str, row)))`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void setZeroes(vector<vector<int>>& matrix) {
    int m = matrix.size(), n = matrix[0].size();
    bool firstRowZero = false, firstColZero = false;
    
    // 检查第一行和第一列是否有0
    for (int j = 0; j < n; j++)
        if (matrix[0][j] == 0) firstRowZero = true;
    for (int i = 0; i < m; i++)
        if (matrix[i][0] == 0) firstColZero = true;
    
    // 用第一行和第一列作为标记
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            if (matrix[i][j] == 0) {
                matrix[i][0] = 0;
                matrix[0][j] = 0;
            }
    
    // 根据标记置零
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            if (matrix[i][0] == 0 || matrix[0][j] == 0)
                matrix[i][j] = 0;
    
    // 处理第一行和第一列
    if (firstRowZero)
        for (int j = 0; j < n; j++) matrix[0][j] = 0;
    if (firstColZero)
        for (int i = 0; i < m; i++) matrix[i][0] = 0;
}

int main() {
    int m, n;
    cin >> m >> n;
    vector<vector<int>> matrix(m, vector<int>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            cin >> matrix[i][j];
    setZeroes(matrix);
    for (auto& row : matrix) {
        for (int x : row) cout << x << " ";
        cout << endl;
    }
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void setZeroes(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        boolean firstRowZero = false, firstColZero = false;
        
        for (int j = 0; j < n; j++)
            if (matrix[0][j] == 0) firstRowZero = true;
        for (int i = 0; i < m; i++)
            if (matrix[i][0] == 0) firstColZero = true;
        
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                if (matrix[i][j] == 0) {
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                }
        
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                if (matrix[i][0] == 0 || matrix[0][j] == 0)
                    matrix[i][j] = 0;
        
        if (firstRowZero)
            for (int j = 0; j < n; j++) matrix[0][j] = 0;
        if (firstColZero)
            for (int i = 0; i < m; i++) matrix[i][0] = 0;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt(), n = sc.nextInt();
        int[][] matrix = new int[m][n];
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                matrix[i][j] = sc.nextInt();
        setZeroes(matrix);
        for (int[] row : matrix) {
            for (int x : row) System.out.print(x + " ");
            System.out.println();
        }
    }
}`,
      python: `def set_zeroes(matrix):
    m, n = len(matrix), len(matrix[0])
    first_row_zero = any(matrix[0][j] == 0 for j in range(n))
    first_col_zero = any(matrix[i][0] == 0 for i in range(m))
    
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = 0
                matrix[0][j] = 0
    
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0
    
    if first_row_zero:
        for j in range(n):
            matrix[0][j] = 0
    if first_col_zero:
        for i in range(m):
            matrix[i][0] = 0

m, n = map(int, input().split())
matrix = [list(map(int, input().split())) for _ in range(m)]
set_zeroes(matrix)
for row in matrix:
    print(' '.join(map(str, row)))`
    },
    testCases: [
      { input: '3 3\\n1 1 1\\n1 0 1\\n1 1 1', expectedOutput: '1 0 1\\n0 0 0\\n1 0 1', description: '中间有0' },
      { input: '3 4\\n0 1 2 0\\n3 4 5 2\\n1 3 1 5', expectedOutput: '0 0 0 0\\n0 4 5 0\\n0 3 1 0', description: '边角有0' }
    ],
    hints: [
      '用第一行和第一列作为标记数组',
      '先记录第一行和第一列本身是否有0',
      '最后再处理第一行和第一列'
    ],
    explanation: `【O(1)空间的技巧】
用矩阵的第一行和第一列作为标记：
1. 先记录第一行/列本身是否有0
2. 遍历其他元素，有0则标记到第一行/列
3. 根据标记置零
4. 最后处理第一行和第一列

【时间复杂度】O(mn)
【空间复杂度】O(1)`,
    commonMistakes: [
      '直接遍历时置零会影响后续判断',
      '忘记单独处理第一行和第一列',
      '处理顺序错误导致标记被覆盖'
    ]
  },
  {
    id: 'arr2d-zigzag',
    category: '二维数组',
    title: '之字形遍历矩阵',
    difficulty: 'medium',
    type: 'coding',
    isExamFocus: true,
    description: `【题目描述】
给定一个m×n的矩阵，按照之字形（Z字形）顺序遍历并输出所有元素。
即：第一行从左到右，第二行从右到左，第三行从左到右...交替进行。

【输入格式】
第一行：整数m和n
接下来m行，每行n个整数

【输出格式】
一行，按之字形顺序输出所有元素

【样例输入】
3 4
1 2 3 4
5 6 7 8
9 10 11 12

【样例输出】
1 2 3 4 8 7 6 5 9 10 11 12`,
    templates: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> zigzagTraversal(vector<vector<int>>& matrix) {
    // TODO: 之字形遍历
    return {};
}

int main() {
    int m, n;
    cin >> m >> n;
    vector<vector<int>> matrix(m, vector<int>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            cin >> matrix[i][j];
    auto result = zigzagTraversal(matrix);
    for (int x : result) cout << x << " ";
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static List<Integer> zigzagTraversal(int[][] matrix) {
        // TODO: 之字形遍历
        return new ArrayList<>();
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt(), n = sc.nextInt();
        int[][] matrix = new int[m][n];
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                matrix[i][j] = sc.nextInt();
        List<Integer> result = zigzagTraversal(matrix);
        for (int x : result) System.out.print(x + " ");
    }
}`,
      python: `def zigzag_traversal(matrix):
    # TODO: 之字形遍历
    pass

m, n = map(int, input().split())
matrix = [list(map(int, input().split())) for _ in range(m)]
result = zigzag_traversal(matrix)
print(' '.join(map(str, result)))`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

vector<int> zigzagTraversal(vector<vector<int>>& matrix) {
    vector<int> result;
    int m = matrix.size();
    if (m == 0) return result;
    
    for (int i = 0; i < m; i++) {
        if (i % 2 == 0) {
            // 偶数行：从左到右
            for (int j = 0; j < matrix[i].size(); j++)
                result.push_back(matrix[i][j]);
        } else {
            // 奇数行：从右到左
            for (int j = matrix[i].size() - 1; j >= 0; j--)
                result.push_back(matrix[i][j]);
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
    auto result = zigzagTraversal(matrix);
    for (int x : result) cout << x << " ";
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static List<Integer> zigzagTraversal(int[][] matrix) {
        List<Integer> result = new ArrayList<>();
        int m = matrix.length;
        if (m == 0) return result;
        
        for (int i = 0; i < m; i++) {
            if (i % 2 == 0) {
                for (int j = 0; j < matrix[i].length; j++)
                    result.add(matrix[i][j]);
            } else {
                for (int j = matrix[i].length - 1; j >= 0; j--)
                    result.add(matrix[i][j]);
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
        List<Integer> result = zigzagTraversal(matrix);
        for (int x : result) System.out.print(x + " ");
    }
}`,
      python: `def zigzag_traversal(matrix):
    result = []
    for i, row in enumerate(matrix):
        if i % 2 == 0:
            result.extend(row)
        else:
            result.extend(reversed(row))
    return result

m, n = map(int, input().split())
matrix = [list(map(int, input().split())) for _ in range(m)]
result = zigzag_traversal(matrix)
print(' '.join(map(str, result)))`
    },
    testCases: [
      { input: '3 4\\n1 2 3 4\\n5 6 7 8\\n9 10 11 12', expectedOutput: '1 2 3 4 8 7 6 5 9 10 11 12', description: '3×4矩阵' },
      { input: '2 3\\n1 2 3\\n4 5 6', expectedOutput: '1 2 3 6 5 4', description: '2×3矩阵' }
    ],
    hints: [
      '偶数行从左到右遍历',
      '奇数行从右到左遍历',
      '用行号的奇偶性判断方向'
    ],
    explanation: `【之字形遍历】
根据行号的奇偶性决定遍历方向：
- 偶数行(0,2,4...)：从左到右
- 奇数行(1,3,5...)：从右到左

【时间复杂度】O(mn)
【空间复杂度】O(1)（不计输出）`,
    commonMistakes: [
      '行号从0还是1开始影响奇偶判断',
      '反向遍历时下标越界',
      '空矩阵处理'
    ]
  }
];
