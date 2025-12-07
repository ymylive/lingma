// LeetCode 经典高频题库 - ACM 标准输入输出格式
import type { Exercise } from './exercises';

export const classicProblems: Exercise[] = [
  // ==================== 数组 ====================
  {
    id: 'lc-two-sum',
    category: '数组',
    title: '两数之和',
    difficulty: 'easy',
    type: 'coding',
    description: '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。\n\n输入格式：\n第一行：数组长度 n\n第二行：n 个整数（空格分隔）\n第三行：目标值 target\n\n输出格式：\n两个下标（空格分隔）',
    templates: {
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target;
    cin >> target;
    
    // 在此实现两数之和
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();
        
        // 在此实现两数之和
        
    }
}`,
      python: `n = int(input())
nums = list(map(int, input().split()))
target = int(input())

# 在此实现两数之和
`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target;
    cin >> target;
    
    unordered_map<int, int> mp;
    for (int i = 0; i < n; i++) {
        if (mp.count(target - nums[i])) {
            cout << mp[target - nums[i]] << " " << i << endl;
            return 0;
        }
        mp[nums[i]] = i;
    }
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();
        
        Map<Integer, Integer> mp = new HashMap<>();
        for (int i = 0; i < n; i++) {
            if (mp.containsKey(target - nums[i])) {
                System.out.println(mp.get(target - nums[i]) + " " + i);
                return;
            }
            mp.put(nums[i], i);
        }
    }
}`,
      python: `n = int(input())
nums = list(map(int, input().split()))
target = int(input())

mp = {}
for i, num in enumerate(nums):
    if target - num in mp:
        print(mp[target - num], i)
        break
    mp[num] = i
`
    },
    testCases: [
      { input: '4\n2 7 11 15\n9', expectedOutput: '0 1', description: '2+7=9' },
      { input: '3\n3 2 4\n6', expectedOutput: '1 2', description: '2+4=6' },
      { input: '2\n3 3\n6', expectedOutput: '0 1', description: '相同元素' }
    ],
    hints: ['使用哈希表存储已遍历的数及其下标', '对于每个数，查找 target-num 是否在哈希表中'],
    explanation: 'O(n) 哈希表：遍历时查找 target-nums[i] 是否存在'
  },
  {
    id: 'lc-three-sum',
    category: '数组',
    title: '三数之和',
    difficulty: 'medium',
    type: 'coding',
    description: '给你一个整数数组 nums，判断是否存在三元组 [nums[i], nums[j], nums[k]] 满足 i != j、i != k 且 j != k，同时还满足 nums[i] + nums[j] + nums[k] == 0。返回所有和为 0 且不重复的三元组。\n\n输入格式：\n第一行：数组长度 n\n第二行：n 个整数\n\n输出格式：\n每行一个三元组（空格分隔），按字典序输出',
    templates: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    
    // 在此实现三数之和
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        
        // 在此实现三数之和
        
    }
}`,
      python: `n = int(input())
nums = list(map(int, input().split()))

# 在此实现三数之和
`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    
    sort(nums.begin(), nums.end());
    for (int i = 0; i < n - 2; i++) {
        if (i > 0 && nums[i] == nums[i-1]) continue;
        int l = i + 1, r = n - 1;
        while (l < r) {
            int sum = nums[i] + nums[l] + nums[r];
            if (sum == 0) {
                cout << nums[i] << " " << nums[l] << " " << nums[r] << endl;
                while (l < r && nums[l] == nums[l+1]) l++;
                while (l < r && nums[r] == nums[r-1]) r--;
                l++; r--;
            } else if (sum < 0) l++;
            else r--;
        }
    }
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        
        Arrays.sort(nums);
        for (int i = 0; i < n - 2; i++) {
            if (i > 0 && nums[i] == nums[i-1]) continue;
            int l = i + 1, r = n - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    System.out.println(nums[i] + " " + nums[l] + " " + nums[r]);
                    while (l < r && nums[l] == nums[l+1]) l++;
                    while (l < r && nums[r] == nums[r-1]) r--;
                    l++; r--;
                } else if (sum < 0) l++;
                else r--;
            }
        }
    }
}`,
      python: `n = int(input())
nums = list(map(int, input().split()))

nums.sort()
for i in range(n - 2):
    if i > 0 and nums[i] == nums[i-1]:
        continue
    l, r = i + 1, n - 1
    while l < r:
        s = nums[i] + nums[l] + nums[r]
        if s == 0:
            print(nums[i], nums[l], nums[r])
            while l < r and nums[l] == nums[l+1]: l += 1
            while l < r and nums[r] == nums[r-1]: r -= 1
            l += 1; r -= 1
        elif s < 0: l += 1
        else: r -= 1
`
    },
    testCases: [
      { input: '6\n-1 0 1 2 -1 -4', expectedOutput: '-1 -1 2\n-1 0 1', description: '标准用例' },
      { input: '3\n0 0 0', expectedOutput: '0 0 0', description: '全零' }
    ],
    hints: ['先排序', '固定一个数，双指针找另外两个', '注意去重'],
    explanation: 'O(n²)：排序后固定 i，双指针找 j,k'
  },
  {
    id: 'lc-max-subarray',
    category: '数组',
    title: '最大子数组和',
    difficulty: 'medium',
    type: 'coding',
    description: '给你一个整数数组 nums，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。\n\n输入格式：\n第一行：数组长度 n\n第二行：n 个整数\n\n输出格式：\n最大和',
    templates: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    
    // 在此实现最大子数组和
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        
        // 在此实现最大子数组和
        
    }
}`,
      python: `n = int(input())
nums = list(map(int, input().split()))

# 在此实现最大子数组和
`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    
    int maxSum = nums[0], curSum = nums[0];
    for (int i = 1; i < n; i++) {
        curSum = max(nums[i], curSum + nums[i]);
        maxSum = max(maxSum, curSum);
    }
    cout << maxSum << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        
        int maxSum = nums[0], curSum = nums[0];
        for (int i = 1; i < n; i++) {
            curSum = Math.max(nums[i], curSum + nums[i]);
            maxSum = Math.max(maxSum, curSum);
        }
        System.out.println(maxSum);
    }
}`,
      python: `n = int(input())
nums = list(map(int, input().split()))

max_sum = cur_sum = nums[0]
for i in range(1, n):
    cur_sum = max(nums[i], cur_sum + nums[i])
    max_sum = max(max_sum, cur_sum)
print(max_sum)
`
    },
    testCases: [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6', description: '子数组[4,-1,2,1]' },
      { input: '1\n1', expectedOutput: '1', description: '单元素' },
      { input: '5\n5 4 -1 7 8', expectedOutput: '23', description: '全部相加' }
    ],
    hints: ['Kadane 算法', 'curSum = max(nums[i], curSum + nums[i])'],
    explanation: 'O(n)：动态规划，维护当前和与最大和'
  },
  // ==================== 字符串 ====================
  {
    id: 'lc-longest-substring',
    category: '字符串',
    title: '无重复字符的最长子串',
    difficulty: 'medium',
    type: 'coding',
    description: '给定一个字符串 s，请你找出其中不含有重复字符的最长子串的长度。\n\n输入格式：\n一行字符串\n\n输出格式：\n最长子串长度',
    templates: {
      cpp: `#include <iostream>
#include <string>
#include <unordered_map>
using namespace std;

int main() {
    string s;
    cin >> s;
    
    // 在此实现
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        
        // 在此实现
        
    }
}`,
      python: `s = input()

# 在此实现
`
    },
    solutions: {
      cpp: `#include <iostream>
#include <string>
#include <unordered_map>
using namespace std;

int main() {
    string s;
    cin >> s;
    
    unordered_map<char, int> mp;
    int maxLen = 0, left = 0;
    for (int r = 0; r < s.size(); r++) {
        if (mp.count(s[r]) && mp[s[r]] >= left) {
            left = mp[s[r]] + 1;
        }
        mp[s[r]] = r;
        maxLen = max(maxLen, r - left + 1);
    }
    cout << maxLen << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        
        Map<Character, Integer> mp = new HashMap<>();
        int maxLen = 0, left = 0;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            if (mp.containsKey(c) && mp.get(c) >= left) {
                left = mp.get(c) + 1;
            }
            mp.put(c, r);
            maxLen = Math.max(maxLen, r - left + 1);
        }
        System.out.println(maxLen);
    }
}`,
      python: `s = input()

mp = {}
max_len = left = 0
for r, c in enumerate(s):
    if c in mp and mp[c] >= left:
        left = mp[c] + 1
    mp[c] = r
    max_len = max(max_len, r - left + 1)
print(max_len)
`
    },
    testCases: [
      { input: 'abcabcbb', expectedOutput: '3', description: 'abc' },
      { input: 'bbbbb', expectedOutput: '1', description: '全相同' },
      { input: 'pwwkew', expectedOutput: '3', description: 'wke' }
    ],
    hints: ['滑动窗口', '哈希表记录字符最后出现位置'],
    explanation: 'O(n)：滑动窗口维护无重复子串'
  },
  {
    id: 'lc-valid-parentheses',
    category: '栈',
    title: '有效的括号',
    difficulty: 'easy',
    type: 'coding',
    description: '给定一个只包括 \'(\',\')\',\'{\',\'}\',\'[\',\']\' 的字符串 s，判断字符串是否有效。\n\n有效字符串需满足：左括号必须用相同类型的右括号闭合。左括号必须以正确的顺序闭合。\n\n输入格式：\n一行括号字符串\n\n输出格式：\ntrue 或 false',
    templates: {
      cpp: `#include <iostream>
#include <string>
#include <stack>
using namespace std;

int main() {
    string s;
    cin >> s;
    
    // 在此实现
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        
        // 在此实现
        
    }
}`,
      python: `s = input()

# 在此实现
`
    },
    solutions: {
      cpp: `#include <iostream>
#include <string>
#include <stack>
using namespace std;

int main() {
    string s;
    cin >> s;
    
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty()) { cout << "false" << endl; return 0; }
            char top = st.top(); st.pop();
            if ((c == ')' && top != '(') ||
                (c == ']' && top != '[') ||
                (c == '}' && top != '{')) {
                cout << "false" << endl; return 0;
            }
        }
    }
    cout << (st.empty() ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        
        Stack<Character> st = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                st.push(c);
            } else {
                if (st.isEmpty()) { System.out.println("false"); return; }
                char top = st.pop();
                if ((c == ')' && top != '(') ||
                    (c == ']' && top != '[') ||
                    (c == '}' && top != '{')) {
                    System.out.println("false"); return;
                }
            }
        }
        System.out.println(st.isEmpty() ? "true" : "false");
    }
}`,
      python: `s = input()

stack = []
pairs = {')': '(', ']': '[', '}': '{'}
for c in s:
    if c in '([{':
        stack.append(c)
    else:
        if not stack or stack.pop() != pairs[c]:
            print("false")
            exit()
print("true" if not stack else "false")
`
    },
    testCases: [
      { input: '()', expectedOutput: 'true', description: '简单匹配' },
      { input: '()[]{}', expectedOutput: 'true', description: '多种括号' },
      { input: '(]', expectedOutput: 'false', description: '不匹配' },
      { input: '([)]', expectedOutput: 'false', description: '交叉' }
    ],
    hints: ['用栈存左括号', '遇右括号检查栈顶是否匹配'],
    explanation: 'O(n)：栈实现括号匹配'
  },
  // ==================== 链表 ====================
  {
    id: 'lc-reverse-list',
    category: '链表',
    title: '反转链表',
    difficulty: 'easy',
    type: 'coding',
    description: '给你单链表的头节点 head，请你反转链表，并返回反转后的链表。\n\n输入格式：\n第一行：节点数 n\n第二行：n 个整数表示链表值\n\n输出格式：\n反转后的链表值（空格分隔）',
    templates: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> vals(n);
    for (int i = 0; i < n; i++) cin >> vals[i];
    
    // 构建链表并反转
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] vals = new int[n];
        for (int i = 0; i < n; i++) vals[i] = sc.nextInt();
        
        // 构建链表并反转
        
    }
}`,
      python: `n = int(input())
vals = list(map(int, input().split()))

# 反转列表
`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> vals(n);
    for (int i = 0; i < n; i++) cin >> vals[i];
    
    // 反转数组模拟
    for (int i = n - 1; i >= 0; i--) {
        cout << vals[i];
        if (i > 0) cout << " ";
    }
    cout << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] vals = new int[n];
        for (int i = 0; i < n; i++) vals[i] = sc.nextInt();
        
        StringBuilder sb = new StringBuilder();
        for (int i = n - 1; i >= 0; i--) {
            sb.append(vals[i]);
            if (i > 0) sb.append(" ");
        }
        System.out.println(sb);
    }
}`,
      python: `n = int(input())
vals = list(map(int, input().split()))

print(' '.join(map(str, vals[::-1])))
`
    },
    testCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: '5 4 3 2 1', description: '标准反转' },
      { input: '2\n1 2', expectedOutput: '2 1', description: '两个元素' },
      { input: '1\n1', expectedOutput: '1', description: '单元素' }
    ],
    hints: ['三个指针：prev, curr, next', '逐个反转指向'],
    explanation: 'O(n)：迭代反转，维护前驱指针'
  },
  // ==================== 二叉树 ====================
  {
    id: 'lc-tree-inorder',
    category: '二叉树',
    title: '二叉树中序遍历',
    difficulty: 'easy',
    type: 'coding',
    description: '给定一个二叉树的根节点 root，返回它的中序遍历。\n\n输入格式：\n第一行：节点数 n\n第二行：n 个整数表示层序遍历（-1 表示空节点）\n\n输出格式：\n中序遍历结果（空格分隔）',
    templates: {
      cpp: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

int main() {
    int n;
    cin >> n;
    vector<int> vals(n);
    for (int i = 0; i < n; i++) cin >> vals[i];
    
    // 构建树并中序遍历
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] vals = new int[n];
        for (int i = 0; i < n; i++) vals[i] = sc.nextInt();
        
        // 构建树并中序遍历
        
    }
}`,
      python: `n = int(input())
vals = list(map(int, input().split()))

# 构建树并中序遍历
`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* buildTree(vector<int>& vals) {
    if (vals.empty() || vals[0] == -1) return nullptr;
    TreeNode* root = new TreeNode(vals[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (!q.empty() && i < vals.size()) {
        TreeNode* node = q.front(); q.pop();
        if (i < vals.size() && vals[i] != -1) {
            node->left = new TreeNode(vals[i]);
            q.push(node->left);
        }
        i++;
        if (i < vals.size() && vals[i] != -1) {
            node->right = new TreeNode(vals[i]);
            q.push(node->right);
        }
        i++;
    }
    return root;
}

void inorder(TreeNode* root, vector<int>& res) {
    if (!root) return;
    inorder(root->left, res);
    res.push_back(root->val);
    inorder(root->right, res);
}

int main() {
    int n;
    cin >> n;
    vector<int> vals(n);
    for (int i = 0; i < n; i++) cin >> vals[i];
    
    TreeNode* root = buildTree(vals);
    vector<int> res;
    inorder(root, res);
    
    for (int i = 0; i < res.size(); i++) {
        cout << res[i];
        if (i < res.size() - 1) cout << " ";
    }
    cout << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int x) { val = x; }
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] vals = new int[n];
        for (int i = 0; i < n; i++) vals[i] = sc.nextInt();
        
        TreeNode root = buildTree(vals);
        List<Integer> res = new ArrayList<>();
        inorder(root, res);
        
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.size(); i++) {
            sb.append(res.get(i));
            if (i < res.size() - 1) sb.append(" ");
        }
        System.out.println(sb);
    }
    
    static TreeNode buildTree(int[] vals) {
        if (vals.length == 0 || vals[0] == -1) return null;
        TreeNode root = new TreeNode(vals[0]);
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        int i = 1;
        while (!q.isEmpty() && i < vals.length) {
            TreeNode node = q.poll();
            if (i < vals.length && vals[i] != -1) {
                node.left = new TreeNode(vals[i]);
                q.offer(node.left);
            }
            i++;
            if (i < vals.length && vals[i] != -1) {
                node.right = new TreeNode(vals[i]);
                q.offer(node.right);
            }
            i++;
        }
        return root;
    }
    
    static void inorder(TreeNode root, List<Integer> res) {
        if (root == null) return;
        inorder(root.left, res);
        res.add(root.val);
        inorder(root.right, res);
    }
}`,
      python: `from collections import deque

n = int(input())
vals = list(map(int, input().split()))

class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = self.right = None

def build_tree(vals):
    if not vals or vals[0] == -1:
        return None
    root = TreeNode(vals[0])
    q = deque([root])
    i = 1
    while q and i < len(vals):
        node = q.popleft()
        if i < len(vals) and vals[i] != -1:
            node.left = TreeNode(vals[i])
            q.append(node.left)
        i += 1
        if i < len(vals) and vals[i] != -1:
            node.right = TreeNode(vals[i])
            q.append(node.right)
        i += 1
    return root

def inorder(root, res):
    if not root:
        return
    inorder(root.left, res)
    res.append(root.val)
    inorder(root.right, res)

root = build_tree(vals)
res = []
inorder(root, res)
print(' '.join(map(str, res)))
`
    },
    testCases: [
      { input: '3\n1 -1 2', expectedOutput: '1 2', description: '右子树' },
      { input: '7\n1 2 3 4 5 6 7', expectedOutput: '4 2 5 1 6 3 7', description: '完全二叉树' }
    ],
    hints: ['左-根-右', '可用递归或栈模拟'],
    explanation: 'O(n)：递归实现中序遍历'
  },
  // ==================== 动态规划 ====================
  {
    id: 'lc-climb-stairs',
    category: '动态规划',
    title: '爬楼梯',
    difficulty: 'easy',
    type: 'coding',
    description: '假设你正在爬楼梯。需要 n 阶你才能到达楼顶。每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？\n\n输入格式：\n一个整数 n\n\n输出格式：\n方法数',
    templates: {
      cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    // 在此实现
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        // 在此实现
        
    }
}`,
      python: `n = int(input())

# 在此实现
`
    },
    solutions: {
      cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    if (n <= 2) { cout << n << endl; return 0; }
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
        int c = a + b;
        a = b;
        b = c;
    }
    cout << b << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        if (n <= 2) { System.out.println(n); return; }
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        System.out.println(b);
    }
}`,
      python: `n = int(input())

if n <= 2:
    print(n)
else:
    a, b = 1, 2
    for i in range(3, n + 1):
        a, b = b, a + b
    print(b)
`
    },
    testCases: [
      { input: '2', expectedOutput: '2', description: '1+1或2' },
      { input: '3', expectedOutput: '3', description: '三种方法' },
      { input: '5', expectedOutput: '8', description: '斐波那契' }
    ],
    hints: ['dp[i] = dp[i-1] + dp[i-2]', '类似斐波那契'],
    explanation: 'O(n)：f(n) = f(n-1) + f(n-2)'
  },
  {
    id: 'lc-coin-change',
    category: '动态规划',
    title: '零钱兑换',
    difficulty: 'medium',
    type: 'coding',
    description: '给你一个整数数组 coins 表示不同面额的硬币，一个整数 amount 表示总金额。计算并返回可以凑成总金额所需的最少的硬币个数。如果无法凑成，返回 -1。\n\n输入格式：\n第一行：硬币种类数 n 和目标金额 amount\n第二行：n 个硬币面额\n\n输出格式：\n最少硬币数或 -1',
    templates: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, amount;
    cin >> n >> amount;
    vector<int> coins(n);
    for (int i = 0; i < n; i++) cin >> coins[i];
    
    // 在此实现
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), amount = sc.nextInt();
        int[] coins = new int[n];
        for (int i = 0; i < n; i++) coins[i] = sc.nextInt();
        
        // 在此实现
        
    }
}`,
      python: `n, amount = map(int, input().split())
coins = list(map(int, input().split()))

# 在此实现
`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n, amount;
    cin >> n >> amount;
    vector<int> coins(n);
    for (int i = 0; i < n; i++) cin >> coins[i];
    
    vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int c : coins) {
            if (c <= i) {
                dp[i] = min(dp[i], dp[i - c] + 1);
            }
        }
    }
    cout << (dp[amount] > amount ? -1 : dp[amount]) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), amount = sc.nextInt();
        int[] coins = new int[n];
        for (int i = 0; i < n; i++) coins[i] = sc.nextInt();
        
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int c : coins) {
                if (c <= i) {
                    dp[i] = Math.min(dp[i], dp[i - c] + 1);
                }
            }
        }
        System.out.println(dp[amount] > amount ? -1 : dp[amount]);
    }
}`,
      python: `n, amount = map(int, input().split())
coins = list(map(int, input().split()))

dp = [amount + 1] * (amount + 1)
dp[0] = 0
for i in range(1, amount + 1):
    for c in coins:
        if c <= i:
            dp[i] = min(dp[i], dp[i - c] + 1)
print(-1 if dp[amount] > amount else dp[amount])
`
    },
    testCases: [
      { input: '3 11\n1 2 5', expectedOutput: '3', description: '5+5+1' },
      { input: '1 3\n2', expectedOutput: '-1', description: '无法凑成' },
      { input: '1 0\n1', expectedOutput: '0', description: '金额为0' }
    ],
    hints: ['完全背包问题', 'dp[i] = min(dp[i], dp[i-c] + 1)'],
    explanation: 'O(n*amount)：动态规划求最少硬币'
  },
  // ==================== 二分查找 ====================
  {
    id: 'lc-binary-search',
    category: '二分查找',
    title: '二分查找',
    difficulty: 'easy',
    type: 'coding',
    description: '给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target，写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1。\n\n输入格式：\n第一行：数组长度 n 和目标值 target\n第二行：n 个有序整数\n\n输出格式：\n下标或 -1',
    templates: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, target;
    cin >> n >> target;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    
    // 在此实现二分查找
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), target = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        
        // 在此实现二分查找
        
    }
}`,
      python: `n, target = map(int, input().split())
nums = list(map(int, input().split()))

# 在此实现二分查找
`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, target;
    cin >> n >> target;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    
    int l = 0, r = n - 1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (nums[mid] == target) {
            cout << mid << endl;
            return 0;
        } else if (nums[mid] < target) {
            l = mid + 1;
        } else {
            r = mid - 1;
        }
    }
    cout << -1 << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), target = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        
        int l = 0, r = n - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) {
                System.out.println(mid);
                return;
            } else if (nums[mid] < target) {
                l = mid + 1;
            } else {
                r = mid - 1;
            }
        }
        System.out.println(-1);
    }
}`,
      python: `n, target = map(int, input().split())
nums = list(map(int, input().split()))

l, r = 0, n - 1
result = -1
while l <= r:
    mid = (l + r) // 2
    if nums[mid] == target:
        result = mid
        break
    elif nums[mid] < target:
        l = mid + 1
    else:
        r = mid - 1
print(result)
`
    },
    testCases: [
      { input: '6 9\n-1 0 3 5 9 12', expectedOutput: '4', description: '找到9' },
      { input: '6 2\n-1 0 3 5 9 12', expectedOutput: '-1', description: '不存在' }
    ],
    hints: ['左闭右闭区间', 'mid = l + (r - l) / 2 防止溢出'],
    explanation: 'O(log n)：经典二分查找'
  },
  // ==================== 回溯 ====================
  {
    id: 'lc-permutations',
    category: '回溯',
    title: '全排列',
    difficulty: 'medium',
    type: 'coding',
    description: '给定一个不含重复数字的数组 nums，返回其所有可能的全排列。\n\n输入格式：\n第一行：数组长度 n\n第二行：n 个不重复整数\n\n输出格式：\n每行一个排列（空格分隔）',
    templates: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    
    // 在此实现全排列
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        
        // 在此实现全排列
        
    }
}`,
      python: `n = int(input())
nums = list(map(int, input().split()))

# 在此实现全排列
`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> path;
vector<bool> used;

void backtrack(vector<int>& nums) {
    if (path.size() == nums.size()) {
        for (int i = 0; i < path.size(); i++) {
            cout << path[i];
            if (i < path.size() - 1) cout << " ";
        }
        cout << endl;
        return;
    }
    for (int i = 0; i < nums.size(); i++) {
        if (used[i]) continue;
        used[i] = true;
        path.push_back(nums[i]);
        backtrack(nums);
        path.pop_back();
        used[i] = false;
    }
}

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    
    used.resize(n, false);
    backtrack(nums);
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static List<Integer> path = new ArrayList<>();
    static boolean[] used;
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        
        used = new boolean[n];
        backtrack(nums);
    }
    
    static void backtrack(int[] nums) {
        if (path.size() == nums.length) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < path.size(); i++) {
                sb.append(path.get(i));
                if (i < path.size() - 1) sb.append(" ");
            }
            System.out.println(sb);
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            path.add(nums[i]);
            backtrack(nums);
            path.remove(path.size() - 1);
            used[i] = false;
        }
    }
}`,
      python: `n = int(input())
nums = list(map(int, input().split()))

def backtrack(path, used):
    if len(path) == n:
        print(' '.join(map(str, path)))
        return
    for i in range(n):
        if used[i]:
            continue
        used[i] = True
        path.append(nums[i])
        backtrack(path, used)
        path.pop()
        used[i] = False

backtrack([], [False] * n)
`
    },
    testCases: [
      { input: '3\n1 2 3', expectedOutput: '1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1', description: '3个数全排列' }
    ],
    hints: ['回溯法', '用 used 数组标记已使用的数'],
    explanation: 'O(n!)：回溯生成所有排列'
  },
  // ==================== 图 ====================
  {
    id: 'lc-num-islands',
    category: '图',
    title: '岛屿数量',
    difficulty: 'medium',
    type: 'coding',
    description: '给你一个由 \'1\'（陆地）和 \'0\'（水）组成的的二维网格，请你计算网格中岛屿的数量。\n\n输入格式：\n第一行：行数 m 和列数 n\n接下来 m 行，每行 n 个字符（0 或 1）\n\n输出格式：\n岛屿数量',
    templates: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int m, n;
    cin >> m >> n;
    vector<vector<char>> grid(m, vector<char>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            cin >> grid[i][j];
    
    // 在此实现
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt(), n = sc.nextInt();
        char[][] grid = new char[m][n];
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                grid[i][j] = sc.next().charAt(0);
        
        // 在此实现
        
    }
}`,
      python: `m, n = map(int, input().split())
grid = []
for _ in range(m):
    grid.append(list(input().split()))

# 在此实现
`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int m, n;
vector<vector<char>> grid;

void dfs(int i, int j) {
    if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] != '1') return;
    grid[i][j] = '0';
    dfs(i + 1, j);
    dfs(i - 1, j);
    dfs(i, j + 1);
    dfs(i, j - 1);
}

int main() {
    cin >> m >> n;
    grid.resize(m, vector<char>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            cin >> grid[i][j];
    
    int count = 0;
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == '1') {
                count++;
                dfs(i, j);
            }
        }
    }
    cout << count << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static int m, n;
    static char[][] grid;
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        m = sc.nextInt(); n = sc.nextInt();
        grid = new char[m][n];
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                grid[i][j] = sc.next().charAt(0);
        
        int count = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    count++;
                    dfs(i, j);
                }
            }
        }
        System.out.println(count);
    }
    
    static void dfs(int i, int j) {
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] != '1') return;
        grid[i][j] = '0';
        dfs(i + 1, j);
        dfs(i - 1, j);
        dfs(i, j + 1);
        dfs(i, j - 1);
    }
}`,
      python: `import sys
sys.setrecursionlimit(10000)

m, n = map(int, input().split())
grid = []
for _ in range(m):
    grid.append(list(input().split()))

def dfs(i, j):
    if i < 0 or i >= m or j < 0 or j >= n or grid[i][j] != '1':
        return
    grid[i][j] = '0'
    dfs(i + 1, j)
    dfs(i - 1, j)
    dfs(i, j + 1)
    dfs(i, j - 1)

count = 0
for i in range(m):
    for j in range(n):
        if grid[i][j] == '1':
            count += 1
            dfs(i, j)
print(count)
`
    },
    testCases: [
      { input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0', expectedOutput: '1', description: '一个大岛' },
      { input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', expectedOutput: '3', description: '三个岛' }
    ],
    hints: ['DFS/BFS 遍历', '访问过的陆地标记为水'],
    explanation: 'O(mn)：DFS 标记连通的陆地'
  },
  // ==================== 更多经典题目 ====================
  {
    id: 'lc-merge-intervals',
    category: '数组',
    title: '合并区间',
    difficulty: 'medium',
    type: 'coding',
    description: '以数组 intervals 表示若干个区间的集合，请你合并所有重叠的区间。\n\n输入格式：\n第一行：区间个数 n\n接下来 n 行，每行两个整数表示区间 [start, end]\n\n输出格式：\n每行一个合并后的区间',
    templates: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<int,int>> intervals(n);
    for (int i = 0; i < n; i++) 
        cin >> intervals[i].first >> intervals[i].second;
    
    // 在此实现合并区间
    
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] intervals = new int[n][2];
        for (int i = 0; i < n; i++) {
            intervals[i][0] = sc.nextInt();
            intervals[i][1] = sc.nextInt();
        }
        // 在此实现
    }
}`,
      python: `n = int(input())
intervals = []
for _ in range(n):
    a, b = map(int, input().split())
    intervals.append([a, b])

# 在此实现合并区间
`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<int,int>> intervals(n);
    for (int i = 0; i < n; i++) 
        cin >> intervals[i].first >> intervals[i].second;
    
    sort(intervals.begin(), intervals.end());
    vector<pair<int,int>> res;
    for (auto& p : intervals) {
        if (res.empty() || res.back().second < p.first) {
            res.push_back(p);
        } else {
            res.back().second = max(res.back().second, p.second);
        }
    }
    for (auto& p : res) {
        cout << p.first << " " << p.second << endl;
    }
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] intervals = new int[n][2];
        for (int i = 0; i < n; i++) { intervals[i][0] = sc.nextInt(); intervals[i][1] = sc.nextInt(); }
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        List<int[]> res = new ArrayList<>();
        for (int[] p : intervals) {
            if (res.isEmpty() || res.get(res.size()-1)[1] < p[0]) res.add(p);
            else res.get(res.size()-1)[1] = Math.max(res.get(res.size()-1)[1], p[1]);
        }
        for (int[] p : res) System.out.println(p[0] + " " + p[1]);
    }
}`,
      python: `n = int(input())
intervals = []
for _ in range(n):
    a, b = map(int, input().split())
    intervals.append([a, b])

intervals.sort()
res = []
for p in intervals:
    if not res or res[-1][1] < p[0]:
        res.append(p)
    else:
        res[-1][1] = max(res[-1][1], p[1])
for p in res:
    print(p[0], p[1])
`
    },
    testCases: [
      { input: '4\n1 3\n2 6\n8 10\n15 18', expectedOutput: '1 6\n8 10\n15 18', description: '合并重叠' },
      { input: '2\n1 4\n4 5', expectedOutput: '1 5', description: '边界相连' }
    ],
    hints: ['先按起点排序', '判断当前区间能否与上一个合并'],
    explanation: 'O(nlogn)：排序后一次遍历合并'
  },
  {
    id: 'lc-longest-palindrome',
    category: '字符串',
    title: '最长回文子串',
    difficulty: 'medium',
    type: 'coding',
    description: '给你一个字符串 s，找到 s 中最长的回文子串。\n\n输入格式：\n一行字符串\n\n输出格式：\n最长回文子串',
    templates: {
      cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    // 在此实现
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        // 在此实现
    }
}`,
      python: `s = input()
# 在此实现
`
    },
    solutions: {
      cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    int n = s.size(), start = 0, maxLen = 1;
    
    auto expand = [&](int l, int r) {
        while (l >= 0 && r < n && s[l] == s[r]) {
            if (r - l + 1 > maxLen) {
                start = l;
                maxLen = r - l + 1;
            }
            l--; r++;
        }
    };
    
    for (int i = 0; i < n; i++) {
        expand(i, i);     // 奇数长度
        expand(i, i + 1); // 偶数长度
    }
    cout << s.substr(start, maxLen) << endl;
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    static String s;
    static int expand(int l, int r) { while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; } return r - l - 1; }
    public static void main(String[] args) {
        s = new Scanner(System.in).next();
        int start = 0, maxLen = 1;
        for (int i = 0; i < s.length(); i++) {
            int len1 = expand(i, i), len2 = expand(i, i + 1);
            int len = Math.max(len1, len2);
            if (len > maxLen) { maxLen = len; start = i - (len - 1) / 2; }
        }
        System.out.println(s.substring(start, start + maxLen));
    }
}`,
      python: `s = input()
n = len(s)
start, max_len = 0, 1

def expand(l, r):
    global start, max_len
    while l >= 0 and r < n and s[l] == s[r]:
        if r - l + 1 > max_len:
            start, max_len = l, r - l + 1
        l -= 1
        r += 1

for i in range(n):
    expand(i, i)
    expand(i, i + 1)
print(s[start:start + max_len])
`
    },
    testCases: [
      { input: 'babad', expectedOutput: 'bab', description: 'aba也正确' },
      { input: 'cbbd', expectedOutput: 'bb', description: '偶数长度' }
    ],
    hints: ['中心扩展法', '分别考虑奇偶长度'],
    explanation: 'O(n²)：枚举中心向两边扩展'
  },
  {
    id: 'lc-container-water',
    category: '双指针',
    title: '盛最多水的容器',
    difficulty: 'medium',
    type: 'coding',
    description: '给定 n 个非负整数表示柱子高度，找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。\n\n输入格式：\n第一行：n\n第二行：n 个高度\n\n输出格式：\n最大容水量',
    templates: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> height(n);
    for (int i = 0; i < n; i++) cin >> height[i];
    // 在此实现
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] height = new int[n];
        for (int i = 0; i < n; i++) height[i] = sc.nextInt();
        // 在此实现
    }
}`,
      python: `n = int(input())
height = list(map(int, input().split()))
# 在此实现
`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> height(n);
    for (int i = 0; i < n; i++) cin >> height[i];
    
    int l = 0, r = n - 1, ans = 0;
    while (l < r) {
        ans = max(ans, min(height[l], height[r]) * (r - l));
        if (height[l] < height[r]) l++;
        else r--;
    }
    cout << ans << endl;
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] h = new int[n];
        for (int i = 0; i < n; i++) h[i] = sc.nextInt();
        int l = 0, r = n - 1, ans = 0;
        while (l < r) {
            int height = Math.min(h[l], h[r]);
            ans = Math.max(ans, height * (r - l));
            if (h[l] < h[r]) l++; else r--;
        }
        System.out.println(ans);
    }
}`,
      python: `n = int(input())
height = list(map(int, input().split()))

l, r = 0, n - 1
ans = 0
while l < r:
    h = min(height[l], height[r])
    ans = max(ans, h * (r - l))
    if height[l] < height[r]: l += 1
    else: r -= 1
print(ans)
`
    },
    testCases: [
      { input: '9\n1 8 6 2 5 4 8 3 7', expectedOutput: '49', description: '最大面积' }
    ],
    hints: ['双指针从两端向中间移动', '移动较矮的那一边'],
    explanation: 'O(n)：双指针，每次移动较短边'
  },
  {
    id: 'lc-trap-rain',
    category: '双指针',
    title: '接雨水',
    difficulty: 'hard',
    type: 'coding',
    description: '给定 n 个非负整数表示柱子高度，计算下雨之后能接多少雨水。\n\n输入格式：\n第一行：n\n第二行：n 个高度\n\n输出格式：\n雨水总量',
    templates: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> height(n);
    for (int i = 0; i < n; i++) cin >> height[i];
    // 在此实现
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] height = new int[n];
        for (int i = 0; i < n; i++) height[i] = sc.nextInt();
        // 在此实现
    }
}`,
      python: `n = int(input())
height = list(map(int, input().split()))
# 在此实现
`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> height(n);
    for (int i = 0; i < n; i++) cin >> height[i];
    
    int l = 0, r = n - 1, lmax = 0, rmax = 0, res = 0;
    while (l < r) {
        if (height[l] < height[r]) {
            lmax = max(lmax, height[l]);
            res += lmax - height[l];
            l++;
        } else {
            rmax = max(rmax, height[r]);
            res += rmax - height[r];
            r--;
        }
    }
    cout << res << endl;
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] h = new int[n];
        for (int i = 0; i < n; i++) h[i] = sc.nextInt();
        int l = 0, r = n - 1, lmax = 0, rmax = 0, res = 0;
        while (l < r) {
            if (h[l] < h[r]) { lmax = Math.max(lmax, h[l]); res += lmax - h[l]; l++; }
            else { rmax = Math.max(rmax, h[r]); res += rmax - h[r]; r--; }
        }
        System.out.println(res);
    }
}`,
      python: `n = int(input())
height = list(map(int, input().split()))

l, r = 0, n - 1
lmax = rmax = res = 0
while l < r:
    if height[l] < height[r]:
        lmax = max(lmax, height[l])
        res += lmax - height[l]
        l += 1
    else:
        rmax = max(rmax, height[r])
        res += rmax - height[r]
        r -= 1
print(res)
`
    },
    testCases: [
      { input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', expectedOutput: '6', description: '标准用例' },
      { input: '6\n4 2 0 3 2 5', expectedOutput: '9', description: '中间凹陷' }
    ],
    hints: ['双指针', '每个位置能接水 = min(左最大,右最大) - height[i]'],
    explanation: 'O(n)：双指针维护左右最大值'
  },
  {
    id: 'lc-longest-common-subsequence',
    category: '动态规划',
    title: '最长公共子序列',
    difficulty: 'medium',
    type: 'coding',
    description: '给定两个字符串，返回它们的最长公共子序列的长度。\n\n输入格式：\n第一行：字符串1\n第二行：字符串2\n\n输出格式：\nLCS长度',
    templates: {
      cpp: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    string s1, s2;
    cin >> s1 >> s2;
    // 在此实现
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s1 = sc.nextLine();
        String s2 = sc.nextLine();
        // 在此实现
    }
}`,
      python: `s1 = input()
s2 = input()
# 在此实现
`
    },
    solutions: {
      cpp: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    string s1, s2;
    cin >> s1 >> s2;
    int m = s1.size(), n = s2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1[i-1] == s2[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    cout << dp[m][n] << endl;
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s1 = sc.next(), s2 = sc.next();
        int m = s1.length(), n = s2.length();
        int[][] dp = new int[m+1][n+1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (s1.charAt(i-1) == s2.charAt(j-1)) dp[i][j] = dp[i-1][j-1] + 1;
                else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }
        System.out.println(dp[m][n]);
    }
}`,
      python: `s1 = input()
s2 = input()
m, n = len(s1), len(s2)
dp = [[0] * (n + 1) for _ in range(m + 1)]

for i in range(1, m + 1):
    for j in range(1, n + 1):
        if s1[i-1] == s2[j-1]:
            dp[i][j] = dp[i-1][j-1] + 1
        else:
            dp[i][j] = max(dp[i-1][j], dp[i][j-1])
print(dp[m][n])
`
    },
    testCases: [
      { input: 'abcde\nace', expectedOutput: '3', description: 'ace' },
      { input: 'abc\nabc', expectedOutput: '3', description: '完全相同' },
      { input: 'abc\ndef', expectedOutput: '0', description: '无公共' }
    ],
    hints: ['dp[i][j]表示s1前i个和s2前j个的LCS', '相等则+1，不等则取max'],
    explanation: 'O(mn)：经典DP'
  },
  {
    id: 'lc-house-robber',
    category: '动态规划',
    title: '打家劫舍',
    difficulty: 'medium',
    type: 'coding',
    description: '相邻房屋不能同时偷，求能偷到的最大金额。\n\n输入格式：\n第一行：房屋数 n\n第二行：n 个金额\n\n输出格式：\n最大金额',
    templates: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    // 在此实现
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        // 在此实现
    }
}`,
      python: `n = int(input())
nums = list(map(int, input().split()))
# 在此实现
`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    
    if (n == 0) { cout << 0 << endl; return 0; }
    if (n == 1) { cout << nums[0] << endl; return 0; }
    
    int prev2 = nums[0], prev1 = max(nums[0], nums[1]);
    for (int i = 2; i < n; i++) {
        int cur = max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = cur;
    }
    cout << prev1 << endl;
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        if (n == 0) { System.out.println(0); return; }
        if (n == 1) { System.out.println(nums[0]); return; }
        int prev2 = nums[0], prev1 = Math.max(nums[0], nums[1]);
        for (int i = 2; i < n; i++) {
            int cur = Math.max(prev1, prev2 + nums[i]);
            prev2 = prev1; prev1 = cur;
        }
        System.out.println(prev1);
    }
}`,
      python: `n = int(input())
nums = list(map(int, input().split()))

if n == 0:
    print(0)
elif n == 1:
    print(nums[0])
else:
    prev2, prev1 = nums[0], max(nums[0], nums[1])
    for i in range(2, n):
        prev2, prev1 = prev1, max(prev1, prev2 + nums[i])
    print(prev1)
`
    },
    testCases: [
      { input: '4\n1 2 3 1', expectedOutput: '4', description: '偷1和3' },
      { input: '5\n2 7 9 3 1', expectedOutput: '12', description: '偷2+9+1' }
    ],
    hints: ['dp[i] = max(dp[i-1], dp[i-2] + nums[i])', '每个房子选或不选'],
    explanation: 'O(n)：选或不选的DP'
  },
  {
    id: 'lc-longest-increasing-subsequence',
    category: '动态规划',
    title: '最长递增子序列',
    difficulty: 'medium',
    type: 'coding',
    description: '给定整数数组，找到最长严格递增子序列的长度。\n\n输入格式：\n第一行：n\n第二行：n 个整数\n\n输出格式：\nLIS长度',
    templates: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    // 在此实现
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        // 在此实现
    }
}`,
      python: `n = int(input())
nums = list(map(int, input().split()))
# 在此实现
`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    
    vector<int> tails;
    for (int num : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), num);
        if (it == tails.end()) tails.push_back(num);
        else *it = num;
    }
    cout << tails.size() << endl;
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int[] tails = new int[n];
        int len = 0;
        for (int num : nums) {
            int l = 0, r = len;
            while (l < r) { int m = (l+r)/2; if (tails[m] < num) l = m+1; else r = m; }
            tails[l] = num;
            if (l == len) len++;
        }
        System.out.println(len);
    }
}`,
      python: `import bisect
n = int(input())
nums = list(map(int, input().split()))

tails = []
for num in nums:
    pos = bisect.bisect_left(tails, num)
    if pos == len(tails):
        tails.append(num)
    else:
        tails[pos] = num
print(len(tails))
`
    },
    testCases: [
      { input: '8\n10 9 2 5 3 7 101 18', expectedOutput: '4', description: '[2,3,7,101]' },
      { input: '4\n0 1 0 3', expectedOutput: '3', description: '[0,1,3]' }
    ],
    hints: ['贪心：保持末尾尽量小', '二分查找替换位置'],
    explanation: 'O(nlogn)：贪心+二分'
  },
  {
    id: 'lc-subsets',
    category: '回溯',
    title: '子集',
    difficulty: 'medium',
    type: 'coding',
    description: '给定整数数组 nums，返回该数组所有可能的子集。\n\n输入格式：\n第一行：n\n第二行：n 个整数\n\n输出格式：\n每行一个子集',
    templates: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    // 在此实现
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        // 在此实现
    }
}`,
      python: `n = int(input())
nums = list(map(int, input().split()))
# 在此实现
`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> path;
void backtrack(vector<int>& nums, int start) {
    for (int x : path) cout << x << " ";
    cout << endl;
    
    for (int i = start; i < nums.size(); i++) {
        path.push_back(nums[i]);
        backtrack(nums, i + 1);
        path.pop_back();
    }
}

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    backtrack(nums, 0);
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    static int[] nums;
    static int n;
    static void backtrack(int start, List<Integer> path) {
        System.out.println(path.toString().replaceAll("[\\[\\],]", ""));
        for (int i = start; i < n; i++) {
            path.add(nums[i]);
            backtrack(i + 1, path);
            path.remove(path.size() - 1);
        }
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        backtrack(0, new ArrayList<>());
    }
}`,
      python: `n = int(input())
nums = list(map(int, input().split()))

def backtrack(start, path):
    print(' '.join(map(str, path)) if path else '')
    for i in range(start, n):
        backtrack(i + 1, path + [nums[i]])

backtrack(0, [])
`
    },
    testCases: [
      { input: '3\n1 2 3', expectedOutput: '\n1\n1 2\n1 2 3\n1 3\n2\n2 3\n3', description: '8个子集' }
    ],
    hints: ['回溯法', 'start控制不重复'],
    explanation: 'O(2^n)：每层递归记录当前path'
  },
  {
    id: 'lc-combination-sum',
    category: '回溯',
    title: '组合总和',
    difficulty: 'medium',
    type: 'coding',
    description: '给定无重复元素的整数数组和目标数 target，找出和为 target 的所有组合（数字可重复选取）。\n\n输入格式：\n第一行：n 和 target\n第二行：n 个整数\n\n输出格式：\n每行一个组合',
    templates: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, target;
    cin >> n >> target;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    // 在此实现
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), target = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        // 在此实现
    }
}`,
      python: `n, target = map(int, input().split())
nums = list(map(int, input().split()))
# 在此实现
`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> path;
void backtrack(vector<int>& nums, int start, int target) {
    if (target == 0) {
        for (int i = 0; i < path.size(); i++) {
            cout << path[i];
            if (i < path.size() - 1) cout << " ";
        }
        cout << endl;
        return;
    }
    for (int i = start; i < nums.size(); i++) {
        if (nums[i] > target) continue;
        path.push_back(nums[i]);
        backtrack(nums, i, target - nums[i]); // i不变，允许重复
        path.pop_back();
    }
}

int main() {
    int n, target;
    cin >> n >> target;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    backtrack(nums, 0, target);
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    static int[] nums;
    static int n;
    static void backtrack(int start, int target, List<Integer> path) {
        if (target == 0) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < path.size(); i++) {
                sb.append(path.get(i));
                if (i < path.size() - 1) sb.append(" ");
            }
            System.out.println(sb);
            return;
        }
        for (int i = start; i < n; i++) {
            if (nums[i] > target) continue;
            path.add(nums[i]);
            backtrack(i, target - nums[i], path);
            path.remove(path.size() - 1);
        }
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        int target = sc.nextInt();
        nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        backtrack(0, target, new ArrayList<>());
    }
}`,
      python: `n, target = map(int, input().split())
nums = list(map(int, input().split()))

def backtrack(start, target, path):
    if target == 0:
        print(' '.join(map(str, path)))
        return
    for i in range(start, n):
        if nums[i] > target:
            continue
        backtrack(i, target - nums[i], path + [nums[i]])

backtrack(0, target, [])
`
    },
    testCases: [
      { input: '4 7\n2 3 6 7', expectedOutput: '2 2 3\n7', description: '两种组合' },
      { input: '3 8\n2 3 5', expectedOutput: '2 2 2 2\n2 3 3\n3 5', description: '三种组合' }
    ],
    hints: ['回溯法', '允许重复选取，所以递归时 start=i'],
    explanation: '回溯：允许重复选取'
  },
  {
    id: 'lc-word-search',
    category: '回溯',
    title: '单词搜索',
    difficulty: 'medium',
    type: 'coding',
    description: '在二维网格中搜索单词，可以上下左右相邻移动。\n\n输入格式：\n第一行：m n\n接下来 m 行，每行 n 个字符\n最后一行：目标单词\n\n输出格式：\ntrue 或 false',
    templates: {
      cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    int m, n;
    cin >> m >> n;
    vector<string> board(m);
    for (int i = 0; i < m; i++) cin >> board[i];
    string word;
    cin >> word;
    // 在此实现
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt(), n = sc.nextInt();
        String[] board = new String[m];
        for (int i = 0; i < m; i++) board[i] = sc.next();
        String word = sc.next();
        // 在此实现
    }
}`,
      python: `m, n = map(int, input().split())
board = [input() for _ in range(m)]
word = input()
# 在此实现
`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

int m, n;
vector<string> board;

bool dfs(int i, int j, const string& word, int k) {
    if (k == word.size()) return true;
    if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] != word[k]) return false;
    
    char tmp = board[i][j];
    board[i][j] = '#';
    bool found = dfs(i+1,j,word,k+1) || dfs(i-1,j,word,k+1) || 
                 dfs(i,j+1,word,k+1) || dfs(i,j-1,word,k+1);
    board[i][j] = tmp;
    return found;
}

int main() {
    cin >> m >> n;
    board.resize(m);
    for (int i = 0; i < m; i++) cin >> board[i];
    string word;
    cin >> word;
    
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (dfs(i, j, word, 0)) {
                cout << "true" << endl;
                return 0;
            }
        }
    }
    cout << "false" << endl;
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    static String[] board;
    static int m, n;
    
    static boolean dfs(int i, int j, String word, int k) {
        if (k == word.length()) return true;
        if (i < 0 || i >= m || j < 0 || j >= n || board[i].charAt(j) != word.charAt(k)) return false;
        char tmp = board[i].charAt(j);
        board[i] = board[i].substring(0,j) + '#' + board[i].substring(j+1);
        boolean found = dfs(i+1,j,word,k+1) || dfs(i-1,j,word,k+1) || dfs(i,j+1,word,k+1) || dfs(i,j-1,word,k+1);
        board[i] = board[i].substring(0,j) + tmp + board[i].substring(j+1);
        return found;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        m = sc.nextInt(); n = sc.nextInt();
        board = new String[m];
        for (int i = 0; i < m; i++) board[i] = sc.next();
        String word = sc.next();
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (dfs(i, j, word, 0)) {
                    System.out.println("true");
                    return;
                }
            }
        }
        System.out.println("false");
    }
}`,
      python: `m, n = map(int, input().split())
board = [list(input()) for _ in range(m)]
word = input()

def dfs(i, j, k):
    if k == len(word): return True
    if i < 0 or i >= m or j < 0 or j >= n or board[i][j] != word[k]:
        return False
    tmp, board[i][j] = board[i][j], '#'
    found = dfs(i+1,j,k+1) or dfs(i-1,j,k+1) or dfs(i,j+1,k+1) or dfs(i,j-1,k+1)
    board[i][j] = tmp
    return found

result = any(dfs(i, j, 0) for i in range(m) for j in range(n))
print("true" if result else "false")
`
    },
    testCases: [
      { input: '3 4\nABCE\nSFCS\nADEE\nABCCED', expectedOutput: 'true', description: '找到路径' },
      { input: '3 4\nABCE\nSFCS\nADEE\nSEE', expectedOutput: 'true', description: 'SEE' }
    ],
    hints: ['DFS四个方向', '标记访问过的格子'],
    explanation: 'O(mn*4^L)：DFS回溯搜索'
  },
  {
    id: 'lc-course-schedule',
    category: '图',
    title: '课程表',
    difficulty: 'medium',
    type: 'coding',
    description: '判断能否完成所有课程（检测有向图是否有环）。\n\n输入格式：\n第一行：课程数 n 和依赖数 m\n接下来 m 行，每行 a b 表示学 a 之前需要先学 b\n\n输出格式：\ntrue 或 false',
    templates: {
      cpp: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    // 在此实现
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), m = sc.nextInt();
        // 在此实现
    }
}`,
      python: `n, m = map(int, input().split())
# 在此实现
`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    
    vector<vector<int>> g(n);
    vector<int> indeg(n, 0);
    
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        g[b].push_back(a);
        indeg[a]++;
    }
    
    queue<int> q;
    for (int i = 0; i < n; i++) {
        if (indeg[i] == 0) q.push(i);
    }
    
    int cnt = 0;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        cnt++;
        for (int v : g[u]) {
            if (--indeg[v] == 0) q.push(v);
        }
    }
    
    cout << (cnt == n ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), m = sc.nextInt();
        List<List<Integer>> g = new ArrayList<>();
        int[] indeg = new int[n];
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            int a = sc.nextInt(), b = sc.nextInt();
            g.get(b).add(a);
            indeg[a]++;
        }
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);
        int cnt = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            cnt++;
            for (int v : g.get(u)) if (--indeg[v] == 0) q.offer(v);
        }
        System.out.println(cnt == n ? "true" : "false");
    }
}`,
      python: `from collections import deque
n, m = map(int, input().split())

g = [[] for _ in range(n)]
indeg = [0] * n

for _ in range(m):
    a, b = map(int, input().split())
    g[b].append(a)
    indeg[a] += 1

q = deque([i for i in range(n) if indeg[i] == 0])
cnt = 0
while q:
    u = q.popleft()
    cnt += 1
    for v in g[u]:
        indeg[v] -= 1
        if indeg[v] == 0:
            q.append(v)

print("true" if cnt == n else "false")
`
    },
    testCases: [
      { input: '2 1\n1 0', expectedOutput: 'true', description: '可完成' },
      { input: '2 2\n1 0\n0 1', expectedOutput: 'false', description: '有环' }
    ],
    hints: ['拓扑排序', '检测有向图是否有环'],
    explanation: 'O(V+E)：BFS拓扑排序'
  },
  {
    id: 'lc-kth-largest',
    category: '堆',
    title: '数组中第K大元素',
    difficulty: 'medium',
    type: 'coding',
    description: '找到数组中第 k 大的元素。\n\n输入格式：\n第一行：n 和 k\n第二行：n 个整数\n\n输出格式：\n第 k 大的元素',
    templates: {
      cpp: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    // 在此实现
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        // 在此实现
    }
}`,
      python: `n, k = map(int, input().split())
nums = list(map(int, input().split()))
# 在此实现
`
    },
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;
    
    priority_queue<int, vector<int>, greater<int>> pq; // 小顶堆
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        pq.push(x);
        if (pq.size() > k) pq.pop();
    }
    cout << pq.top() << endl;
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int i = 0; i < n; i++) {
            int x = sc.nextInt();
            pq.offer(x);
            if (pq.size() > k) pq.poll();
        }
        System.out.println(pq.peek());
    }
}`,
      python: `import heapq
n, k = map(int, input().split())
nums = list(map(int, input().split()))

heap = []
for num in nums:
    heapq.heappush(heap, num)
    if len(heap) > k:
        heapq.heappop(heap)
print(heap[0])
`
    },
    testCases: [
      { input: '6 2\n3 2 1 5 6 4', expectedOutput: '5', description: '第2大' },
      { input: '9 4\n3 2 3 1 2 4 5 5 6', expectedOutput: '4', description: '第4大' }
    ],
    hints: ['小顶堆维护前k大', '堆大小超过k就弹出'],
    explanation: 'O(nlogk)：小顶堆维护k个最大元素'
  }
];
