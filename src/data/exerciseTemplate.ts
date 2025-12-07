// ACM/OJ 标准题目模板和规范
// 所有题目应遵循此规范

import type { Exercise } from './exercises';

/**
 * ACM/OJ 标准题目规范
 * 
 * 1. description 必须包含：
 *    - 【题目描述】问题背景和要求
 *    - 【输入格式】每行输入的含义
 *    - 【输出格式】输出要求
 *    - 【数据范围】数据规模限制
 * 
 * 2. templates 代码模板必须：
 *    - 是完整可编译的程序
 *    - 包含标准输入输出
 *    - 用 TODO 标注需要填写的部分
 * 
 * 3. solutions 答案必须：
 *    - 可直接运行通过所有测试用例
 *    - 包含完整的输入输出处理
 * 
 * 4. testCases 测试用例：
 *    - 至少3个测试用例
 *    - input/expectedOutput 为纯文本格式
 */

// ==================== 规范化题目示例 ====================

export const standardExampleExercises: Exercise[] = [
  {
    id: 'std-two-sum',
    category: '哈希表',
    title: '两数之和',
    difficulty: 'easy',
    type: 'coding',
    description: `【题目描述】
给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那两个整数，并返回它们的数组下标。

假设每种输入只会对应一个答案，且同样的元素不能被重复利用。

【输入格式】
第一行：一个整数 n，表示数组长度 (1 ≤ n ≤ 10^4)
第二行：n 个整数，表示数组元素，空格分隔 (-10^9 ≤ nums[i] ≤ 10^9)
第三行：一个整数 target，表示目标值

【输出格式】
输出一行，两个整数，表示两个数的下标（从0开始），空格分隔
如果有多个答案，输出任意一组即可

【数据范围】
- 1 ≤ n ≤ 10^4
- -10^9 ≤ nums[i] ≤ 10^9
- 保证有且仅有一个有效答案

【样例说明】
对于样例输入 nums=[2,7,11,15], target=9
因为 nums[0] + nums[1] = 2 + 7 = 9
所以输出 0 1`,
    templates: {
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    scanf("%d", &n);
    
    int* nums = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        scanf("%d", &nums[i]);
    }
    
    int target;
    scanf("%d", &target);
    
    // TODO: 在此实现两数之和算法
    // 找到两个数使得 nums[i] + nums[j] == target
    // 输出 i 和 j（空格分隔）
    
    free(nums);
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    vector<int> nums(n);
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }
    
    int target;
    cin >> target;
    
    // TODO: 在此实现两数之和算法
    // 找到两个数使得 nums[i] + nums[j] == target
    // 输出 i 和 j（空格分隔）
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextInt();
        }
        int target = sc.nextInt();
        
        // TODO: 在此实现两数之和算法
        // 找到两个数使得 nums[i] + nums[j] == target
        // 输出 i 和 j（空格分隔）
        
        sc.close();
    }
}`,
      python: `n = int(input())
nums = list(map(int, input().split()))
target = int(input())

# TODO: 在此实现两数之和算法
# 找到两个数使得 nums[i] + nums[j] == target
# 输出 i 和 j（空格分隔）
`
    },
    solutions: {
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    scanf("%d", &n);
    
    int* nums = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        scanf("%d", &nums[i]);
    }
    
    int target;
    scanf("%d", &target);
    
    // 暴力解法 O(n^2)
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] == target) {
                printf("%d %d\\n", i, j);
                free(nums);
                return 0;
            }
        }
    }
    
    free(nums);
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    vector<int> nums(n);
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }
    
    int target;
    cin >> target;
    
    // 哈希表解法 O(n)
    unordered_map<int, int> map;
    for (int i = 0; i < n; i++) {
        int complement = target - nums[i];
        if (map.find(complement) != map.end()) {
            cout << map[complement] << " " << i << endl;
            return 0;
        }
        map[nums[i]] = i;
    }
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextInt();
        }
        int target = sc.nextInt();
        
        // 哈希表解法 O(n)
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                System.out.println(map.get(complement) + " " + i);
                sc.close();
                return;
            }
            map.put(nums[i], i);
        }
        
        sc.close();
    }
}`,
      python: `n = int(input())
nums = list(map(int, input().split()))
target = int(input())

# 哈希表解法 O(n)
num_map = {}
for i, num in enumerate(nums):
    complement = target - num
    if complement in num_map:
        print(num_map[complement], i)
        break
    num_map[num] = i
`
    },
    testCases: [
      { input: '4\n2 7 11 15\n9', expectedOutput: '0 1', description: '基本测试：两数在开头' },
      { input: '3\n3 2 4\n6', expectedOutput: '1 2', description: '两数不相邻' },
      { input: '2\n3 3\n6', expectedOutput: '0 1', description: '边界测试：相同元素' }
    ],
    hints: [
      '暴力解法：双重循环遍历所有数对，时间复杂度O(n²)',
      '优化思路：使用哈希表存储已遍历的数及其下标',
      '对于当前数num，检查target-num是否在哈希表中'
    ],
    explanation: `【解题思路】

方法一：暴力枚举
- 双重循环遍历所有数对(i,j)，检查nums[i]+nums[j]是否等于target
- 时间复杂度：O(n²)，空间复杂度：O(1)

方法二：哈希表（推荐）
- 遍历数组，对于每个数num，计算complement = target - num
- 检查complement是否在哈希表中
- 如果在，返回答案；如果不在，将num及其下标存入哈希表
- 时间复杂度：O(n)，空间复杂度：O(n)

【关键点】
- 哈希表的key是数值，value是下标
- 先查询再插入，避免同一个元素被使用两次`
  },
  
  {
    id: 'std-reverse-linked-list',
    category: '链表',
    title: '反转链表',
    difficulty: 'easy',
    type: 'coding',
    description: `【题目描述】
给定单链表的头节点 head，请你反转链表，并返回反转后的链表头节点。

【输入格式】
第一行：一个整数 n，表示链表长度 (0 ≤ n ≤ 5000)
第二行：n 个整数，表示链表节点的值，空格分隔

【输出格式】
输出一行，表示反转后链表的所有节点值，空格分隔
如果链表为空，输出空行

【数据范围】
- 0 ≤ n ≤ 5000
- -5000 ≤ Node.val ≤ 5000

【样例说明】
对于输入 1 2 3 4 5，原链表为 1->2->3->4->5
反转后为 5->4->3->2->1
所以输出 5 4 3 2 1`,
    templates: {
      c: `#include <stdio.h>
#include <stdlib.h>

struct ListNode {
    int val;
    struct ListNode* next;
};

struct ListNode* reverseList(struct ListNode* head) {
    // TODO: 实现链表反转
    return NULL;
}

int main() {
    int n;
    scanf("%d", &n);
    
    struct ListNode* head = NULL;
    struct ListNode* tail = NULL;
    
    for (int i = 0; i < n; i++) {
        int val;
        scanf("%d", &val);
        struct ListNode* node = (struct ListNode*)malloc(sizeof(struct ListNode));
        node->val = val;
        node->next = NULL;
        if (!head) {
            head = tail = node;
        } else {
            tail->next = node;
            tail = node;
        }
    }
    
    head = reverseList(head);
    
    while (head) {
        printf("%d", head->val);
        if (head->next) printf(" ");
        head = head->next;
    }
    printf("\\n");
    
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* reverseList(ListNode* head) {
    // TODO: 实现链表反转
    return nullptr;
}

int main() {
    int n;
    cin >> n;
    
    ListNode* dummy = new ListNode(0);
    ListNode* tail = dummy;
    
    for (int i = 0; i < n; i++) {
        int val;
        cin >> val;
        tail->next = new ListNode(val);
        tail = tail->next;
    }
    
    ListNode* head = reverseList(dummy->next);
    
    while (head) {
        cout << head->val;
        if (head->next) cout << " ";
        head = head->next;
    }
    cout << endl;
    
    return 0;
}`,
      java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

public class Main {
    public static ListNode reverseList(ListNode head) {
        // TODO: 实现链表反转
        return null;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        
        for (int i = 0; i < n; i++) {
            tail.next = new ListNode(sc.nextInt());
            tail = tail.next;
        }
        
        ListNode head = reverseList(dummy.next);
        
        StringBuilder sb = new StringBuilder();
        while (head != null) {
            sb.append(head.val);
            if (head.next != null) sb.append(" ");
            head = head.next;
        }
        System.out.println(sb.toString());
        
        sc.close();
    }
}`,
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    # TODO: 实现链表反转
    pass

n = int(input())
if n == 0:
    print()
else:
    vals = list(map(int, input().split()))
    
    # 构建链表
    dummy = ListNode(0)
    tail = dummy
    for val in vals:
        tail.next = ListNode(val)
        tail = tail.next
    
    # 反转链表
    head = reverse_list(dummy.next)
    
    # 输出结果
    result = []
    while head:
        result.append(str(head.val))
        head = head.next
    print(' '.join(result))
`
    },
    solutions: {
      c: `#include <stdio.h>
#include <stdlib.h>

struct ListNode {
    int val;
    struct ListNode* next;
};

struct ListNode* reverseList(struct ListNode* head) {
    struct ListNode* prev = NULL;
    struct ListNode* curr = head;
    while (curr != NULL) {
        struct ListNode* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}

int main() {
    int n;
    scanf("%d", &n);
    
    struct ListNode* head = NULL;
    struct ListNode* tail = NULL;
    
    for (int i = 0; i < n; i++) {
        int val;
        scanf("%d", &val);
        struct ListNode* node = (struct ListNode*)malloc(sizeof(struct ListNode));
        node->val = val;
        node->next = NULL;
        if (!head) {
            head = tail = node;
        } else {
            tail->next = node;
            tail = node;
        }
    }
    
    head = reverseList(head);
    
    while (head) {
        printf("%d", head->val);
        if (head->next) printf(" ");
        head = head->next;
    }
    printf("\\n");
    
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr != nullptr) {
        ListNode* next = curr->next;  // 保存下一个节点
        curr->next = prev;             // 反转指针
        prev = curr;                   // prev前进
        curr = next;                   // curr前进
    }
    return prev;
}

int main() {
    int n;
    cin >> n;
    
    ListNode* dummy = new ListNode(0);
    ListNode* tail = dummy;
    
    for (int i = 0; i < n; i++) {
        int val;
        cin >> val;
        tail->next = new ListNode(val);
        tail = tail->next;
    }
    
    ListNode* head = reverseList(dummy->next);
    
    while (head) {
        cout << head->val;
        if (head->next) cout << " ";
        head = head->next;
    }
    cout << endl;
    
    return 0;
}`,
      java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

public class Main {
    public static ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode next = curr.next;  // 保存下一个节点
            curr.next = prev;            // 反转指针
            prev = curr;                 // prev前进
            curr = next;                 // curr前进
        }
        return prev;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        
        for (int i = 0; i < n; i++) {
            tail.next = new ListNode(sc.nextInt());
            tail = tail.next;
        }
        
        ListNode head = reverseList(dummy.next);
        
        StringBuilder sb = new StringBuilder();
        while (head != null) {
            sb.append(head.val);
            if (head.next != null) sb.append(" ");
            head = head.next;
        }
        System.out.println(sb.toString());
        
        sc.close();
    }
}`,
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next  # 保存下一个节点
        curr.next = prev       # 反转指针
        prev = curr            # prev前进
        curr = next_node       # curr前进
    return prev

n = int(input())
if n == 0:
    print()
else:
    vals = list(map(int, input().split()))
    
    # 构建链表
    dummy = ListNode(0)
    tail = dummy
    for val in vals:
        tail.next = ListNode(val)
        tail = tail.next
    
    # 反转链表
    head = reverse_list(dummy.next)
    
    # 输出结果
    result = []
    while head:
        result.append(str(head.val))
        head = head.next
    print(' '.join(result))
`
    },
    testCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: '5 4 3 2 1', description: '基本测试：正常链表' },
      { input: '2\n1 2', expectedOutput: '2 1', description: '边界测试：两个节点' },
      { input: '1\n1', expectedOutput: '1', description: '边界测试：单个节点' },
      { input: '0', expectedOutput: '', description: '边界测试：空链表' }
    ],
    hints: [
      '使用三个指针：prev（前一个节点）、curr（当前节点）、next（下一个节点）',
      '每次循环：1.保存next 2.反转指针 3.移动prev和curr',
      '循环结束后，prev指向新的头节点'
    ],
    explanation: `【解题思路】

迭代法（推荐）：
1. 初始化 prev = null, curr = head
2. 遍历链表，对于每个节点：
   - 保存 next = curr.next
   - 反转指针 curr.next = prev
   - 移动 prev = curr, curr = next
3. 返回 prev（新的头节点）

【图解】
原链表: 1 -> 2 -> 3 -> null
        ↓
第1步: null <- 1   2 -> 3 -> null
        ↓
第2步: null <- 1 <- 2   3 -> null
        ↓
第3步: null <- 1 <- 2 <- 3

【时间复杂度】O(n)
【空间复杂度】O(1)`
  },
  
  {
    id: 'std-binary-search',
    category: '查找',
    title: '二分查找',
    difficulty: 'easy',
    type: 'coding',
    description: `【题目描述】
给定一个升序排列的整数数组 nums 和一个目标值 target，请使用二分查找算法在数组中查找目标值。

如果目标值存在于数组中，返回其下标；否则返回 -1。

【输入格式】
第一行：一个整数 n，表示数组长度 (1 ≤ n ≤ 10^5)
第二行：n 个升序排列的整数，空格分隔
第三行：一个整数 target，表示目标值

【输出格式】
输出一个整数，表示目标值的下标（从0开始），如果不存在则输出 -1

【数据范围】
- 1 ≤ n ≤ 10^5
- -10^9 ≤ nums[i], target ≤ 10^9
- nums 中的所有元素互不相同
- nums 已按升序排列

【样例说明】
对于样例输入 nums=[-1,0,3,5,9,12], target=9
数组中存在元素9，其下标为4，所以输出4`,
    templates: {
      c: `#include <stdio.h>

int binarySearch(int* nums, int n, int target) {
    // TODO: 实现二分查找
    return -1;
}

int main() {
    int n;
    scanf("%d", &n);
    
    int nums[100005];
    for (int i = 0; i < n; i++) {
        scanf("%d", &nums[i]);
    }
    
    int target;
    scanf("%d", &target);
    
    printf("%d\\n", binarySearch(nums, n, target));
    
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int binarySearch(vector<int>& nums, int target) {
    // TODO: 实现二分查找
    return -1;
}

int main() {
    int n;
    cin >> n;
    
    vector<int> nums(n);
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }
    
    int target;
    cin >> target;
    
    cout << binarySearch(nums, target) << endl;
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static int binarySearch(int[] nums, int target) {
        // TODO: 实现二分查找
        return -1;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextInt();
        }
        
        int target = sc.nextInt();
        
        System.out.println(binarySearch(nums, target));
        
        sc.close();
    }
}`,
      python: `def binary_search(nums, target):
    # TODO: 实现二分查找
    return -1

n = int(input())
nums = list(map(int, input().split()))
target = int(input())

print(binary_search(nums, target))
`
    },
    solutions: {
      c: `#include <stdio.h>

int binarySearch(int* nums, int n, int target) {
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;  // 防止溢出
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}

int main() {
    int n;
    scanf("%d", &n);
    
    int nums[100005];
    for (int i = 0; i < n; i++) {
        scanf("%d", &nums[i]);
    }
    
    int target;
    scanf("%d", &target);
    
    printf("%d\\n", binarySearch(nums, n, target));
    
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int binarySearch(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;  // 防止溢出
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}

int main() {
    int n;
    cin >> n;
    
    vector<int> nums(n);
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }
    
    int target;
    cin >> target;
    
    cout << binarySearch(nums, target) << endl;
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static int binarySearch(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;  // 防止溢出
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
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
        
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextInt();
        }
        
        int target = sc.nextInt();
        
        System.out.println(binarySearch(nums, target));
        
        sc.close();
    }
}`,
      python: `def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2  # 防止溢出
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

n = int(input())
nums = list(map(int, input().split()))
target = int(input())

print(binary_search(nums, target))
`
    },
    testCases: [
      { input: '6\n-1 0 3 5 9 12\n9', expectedOutput: '4', description: '基本测试：目标在中间' },
      { input: '6\n-1 0 3 5 9 12\n2', expectedOutput: '-1', description: '目标不存在' },
      { input: '5\n1 2 3 4 5\n1', expectedOutput: '0', description: '边界测试：目标在开头' },
      { input: '5\n1 2 3 4 5\n5', expectedOutput: '4', description: '边界测试：目标在结尾' },
      { input: '1\n5\n5', expectedOutput: '0', description: '边界测试：单元素数组' }
    ],
    hints: [
      '二分查找的关键：每次将搜索区间缩小一半',
      '使用 left + (right - left) / 2 计算中点，防止整数溢出',
      '注意循环条件是 left <= right，不是 left < right'
    ],
    explanation: `【解题思路】

二分查找算法：
1. 初始化搜索区间 [left, right] = [0, n-1]
2. 当 left <= right 时循环：
   - 计算中点 mid = left + (right - left) / 2
   - 如果 nums[mid] == target，找到目标，返回 mid
   - 如果 nums[mid] < target，目标在右半部分，left = mid + 1
   - 如果 nums[mid] > target，目标在左半部分，right = mid - 1
3. 循环结束未找到，返回 -1

【关键点】
- 使用 left + (right - left) / 2 而不是 (left + right) / 2，防止溢出
- 循环条件 left <= right 确保搜索区间有效

【时间复杂度】O(log n)
【空间复杂度】O(1)`
  }
];

// 导出规范化示例供参考
export default standardExampleExercises;
