// 预设练习题库 - 覆盖所有数据结构与算法知识点

import { allClassicExercises, recursionExercises } from './classicExercises';

export interface Exercise {
  id: string;
  category: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'coding' | 'fillblank';
  templates?: { c?: string; cpp: string; java: string; python: string };
  solutions?: { c?: string; cpp: string; java: string; python: string };
  codeTemplate?: { c?: string; cpp: string; java: string; python: string };
  blanks?: { id: string; answer: string; hint: string }[];
  testCases?: { input: string; expectedOutput: string; description: string }[];
  hints?: string[];
  explanation: string;
  commonMistakes?: string[]; // 常见错误/易错点
  isExamFocus?: boolean; // 考试重点题目标记
}

// ==================== 链表 ====================
export const linkedListExercises: Exercise[] = [
  {
    id: 'll-insert', category: '链表', title: '单链表插入', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
在带头节点的单链表中，在第i个位置插入元素e。成功返回true，失败返回false。

【输入格式】
第一行：整数n，表示链表长度
第二行：n个整数，表示链表元素
第三行：整数i，表示插入位置（从1开始）
第四行：整数e，表示要插入的元素

【输出格式】
输出插入后的链表，元素用空格分隔

【数据范围】
- 0 ≤ n ≤ 100
- 1 ≤ i ≤ n+1`,
    templates: {
      c: `int insert(Node* head, int i, int e) {\n    // 请实现插入操作\n}`,
      cpp: `bool insert(Node* head, int i, int e) {\n    // 请实现插入操作\n}`,
      java: `boolean insert(Node head, int i, int e) {\n    // 请实现插入操作\n}`,
      python: `def insert(head, i, e):\n    # 请实现插入操作\n    pass`
    },
    solutions: {
      c: `int insert(Node* head, int i, int e) {\n    Node* p = head; int j = 0;\n    while (p && j < i-1) { p = p->next; j++; }\n    if (!p) return 0;\n    Node* s = (Node*)malloc(sizeof(Node));\n    s->data = e;\n    s->next = p->next;\n    p->next = s;\n    return 1;\n}`,
      cpp: `bool insert(Node* head, int i, int e) {\n    Node* p = head; int j = 0;\n    while (p && j < i-1) { p = p->next; j++; }\n    if (!p) return false;\n    Node* s = new Node(); s->data = e;\n    s->next = p->next;  // 关键：先连后面\n    p->next = s;        // 再连前面\n    return true;\n}`,
      java: `boolean insert(Node head, int i, int e) {\n    Node p = head; int j = 0;\n    while (p != null && j < i-1) { p = p.next; j++; }\n    if (p == null) return false;\n    Node s = new Node(); s.data = e;\n    s.next = p.next;\n    p.next = s;\n    return true;\n}`,
      python: `def insert(head, i, e):\n    p, j = head, 0\n    while p and j < i-1:\n        p = p.next; j += 1\n    if not p: return False\n    s = Node(e)\n    s.next = p.next\n    p.next = s\n    return True`
    },
    testCases: [{ input: '3\n1 2 3\n2\n99', expectedOutput: '1 99 2 3', description: '中间插入' }],
    hints: ['找到第i-1个节点', '先连后面再连前面'], explanation: '插入关键：s.next=p.next; p.next=s',
    commonMistakes: ['顺序错误：先执行p.next=s会导致后继节点丢失', '未处理插入位置无效(p为空)的情况', '计数器j的初始值或终止条件设置错误']
  },
  {
    id: 'll-delete', category: '链表', title: '单链表删除', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
在带头节点的单链表中，删除第i个位置的节点，返回被删除的元素值。

【输入格式】
第一行：整数n，表示链表长度
第二行：n个整数，表示链表元素
第三行：整数i，表示删除位置（从1开始）

【输出格式】
输出被删除的元素值

【数据范围】
- 1 ≤ n ≤ 100
- 1 ≤ i ≤ n`,
    templates: {
      c: `int deleteNode(Node* head, int i) {\n    // 请实现删除操作\n}`,
      cpp: `int deleteNode(Node* head, int i) {\n    // 请实现删除操作\n}`,
      java: `int deleteNode(Node head, int i) {\n    // 请实现删除操作\n}`,
      python: `def delete_node(head, i):\n    pass`
    },
    solutions: {
      c: `int deleteNode(Node* head, int i) {\n    Node* p = head; int j = 0;\n    while (p && j < i-1) { p = p->next; j++; }\n    if (!p || !p->next) return -1;\n    Node* q = p->next;\n    int e = q->data;\n    p->next = q->next;\n    free(q);\n    return e;\n}`,
      cpp: `int deleteNode(Node* head, int i) {\n    Node* p = head; int j = 0;\n    while (p && j < i-1) { p = p->next; j++; }\n    if (!p || !p->next) return -1;\n    Node* q = p->next;\n    int e = q->data;\n    p->next = q->next;  // 核心：跳过q\n    delete q;\n    return e;\n}`,
      java: `int deleteNode(Node head, int i) {\n    Node p = head; int j = 0;\n    while (p != null && j < i-1) { p = p.next; j++; }\n    if (p == null || p.next == null) return -1;\n    Node q = p.next;\n    int e = q.data;\n    p.next = q.next;\n    return e;\n}`,
      python: `def delete_node(head, i):\n    p, j = head, 0\n    while p and j < i-1:\n        p = p.next; j += 1\n    if not p or not p.next: return -1\n    q = p.next\n    e = q.data\n    p.next = q.next\n    return e`
    },
    testCases: [{ input: '3\n1 2 3\n2', expectedOutput: '2', description: '删除中间' }],
    hints: ['p.next = q.next 跳过待删节点'], explanation: '删除核心：让前驱直接指向后继',
    commonMistakes: ['忘记释放被删除节点的内存(C++)', '未检查待删除节点是否存在(p.next为空)', '删除头节点或尾节点时的边界处理不当']
  },
  {
    id: 'll-reverse', category: '链表', title: '链表反转', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给定单链表的头节点head，反转链表，并返回反转后的链表头节点。

【输入格式】
第一行：整数n，表示链表长度 (0 ≤ n ≤ 5000)
第二行：n个整数，表示链表节点值

【输出格式】
输出反转后的链表，元素用空格分隔

【数据范围】
- 0 ≤ n ≤ 5000
- -5000 ≤ Node.val ≤ 5000`,
    templates: {
      c: `Node* reverse(Node* head) {\n    // 请实现反转\n}`,
      cpp: `Node* reverse(Node* head) {\n    // 请实现反转\n}`,
      java: `Node reverse(Node head) {\n    // 请实现反转\n}`,
      python: `def reverse(head):\n    pass`
    },
    solutions: {
      c: `Node* reverse(Node* head) {\n    Node *prev = NULL, *curr = head;\n    while (curr) {\n        Node* next = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`,
      cpp: `Node* reverse(Node* head) {\n    Node *prev = nullptr, *curr = head;\n    while (curr) {\n        Node* next = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`,
      java: `Node reverse(Node head) {\n    Node prev = null, curr = head;\n    while (curr != null) {\n        Node next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`,
      python: `def reverse(head):\n    prev, curr = None, head\n    while curr:\n        next = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next\n    return prev`
    },
    testCases: [{ input: '5\n1 2 3 4 5', expectedOutput: '5 4 3 2 1', description: '反转' }],
    hints: ['三个指针：prev, curr, next'], explanation: '每次将当前节点指向前一个节点',
    commonMistakes: ['断链：忘记保存next节点(next = curr.next)', '返回了错误的节点(应返回prev)', '循环终止条件错误']
  },
  // 填空题
  {
    id: 'll-insert-blank', category: '链表', title: '链表插入填空', difficulty: 'easy', type: 'fillblank',
    description: '完成链表插入操作的关键代码',
    codeTemplate: {
      cpp: `// 在p节点后插入新节点s
Node* s = new Node(e);
___BLANK1___;  // 第一步：新节点指向p的下一个
___BLANK2___;  // 第二步：p指向新节点`,
      java: `// 在p节点后插入新节点s
Node s = new Node(e);
___BLANK1___;  // 第一步
___BLANK2___;  // 第二步`,
      python: `# 在p节点后插入新节点s
s = Node(e)
___BLANK1___  # 第一步
___BLANK2___  # 第二步`
    },
    blanks: [
      { id: 'BLANK1', answer: 's.next = p.next', hint: '新节点先连接后面的节点' },
      { id: 'BLANK2', answer: 'p.next = s', hint: '再让前面的节点指向新节点' }
    ],
    explanation: '插入顺序很重要！必须先连后面(s.next=p.next)，再连前面(p.next=s)，否则会丢失后续节点'
  },
  {
    id: 'll-delete-blank', category: '链表', title: '链表删除填空', difficulty: 'easy', type: 'fillblank',
    description: '完成链表删除操作的关键代码',
    codeTemplate: {
      cpp: `// 删除p的下一个节点q
Node* q = p->next;
___BLANK1___;  // 核心操作：跳过q
delete q;`,
      java: `// 删除p的下一个节点q
Node q = p.next;
___BLANK1___;  // 核心操作`,
      python: `# 删除p的下一个节点q
q = p.next
___BLANK1___  # 核心操作`
    },
    blanks: [
      { id: 'BLANK1', answer: 'p.next = q.next', hint: '让前驱直接指向后继，跳过被删节点' }
    ],
    explanation: '删除的本质就是"跳过"：p.next = q.next，让p直接指向q的后继'
  },
  {
    id: 'll-reverse-blank', category: '链表', title: '链表反转填空', difficulty: 'medium', type: 'fillblank',
    description: '完成链表反转的关键代码（三指针法）',
    codeTemplate: {
      cpp: `Node* reverse(Node* head) {
    Node *prev = nullptr, *curr = head;
    while (curr) {
        Node* next = ___BLANK1___;  // 保存下一个节点
        curr->next = ___BLANK2___;  // 反转指向
        prev = ___BLANK3___;        // 移动prev
        curr = ___BLANK4___;        // 移动curr
    }
    return prev;
}`,
      java: `同上`,
      python: `def reverse(head):
    prev, curr = None, head
    while curr:
        next = ___BLANK1___
        curr.next = ___BLANK2___
        prev = ___BLANK3___
        curr = ___BLANK4___
    return prev`
    },
    blanks: [
      { id: 'BLANK1', answer: 'curr->next', hint: '保存当前节点的下一个节点' },
      { id: 'BLANK2', answer: 'prev', hint: '让当前节点指向前一个节点' },
      { id: 'BLANK3', answer: 'curr', hint: 'prev移动到当前位置' },
      { id: 'BLANK4', answer: 'next', hint: 'curr移动到下一个位置' }
    ],
    explanation: '链表反转核心：保存next→反转指向→移动prev→移动curr。顺序不能乱！'
  },
  {
    id: 'll-middle-blank', category: '链表', title: '快慢指针找中点填空', difficulty: 'easy', type: 'fillblank',
    description: '用快慢指针找链表中点',
    codeTemplate: {
      cpp: `Node* findMiddle(Node* head) {
    Node *slow = head, *fast = head;
    while (___BLANK1___ && ___BLANK2___) {
        slow = ___BLANK3___;
        fast = ___BLANK4___;
    }
    return slow;  // slow就是中点
}`,
      java: `同上`,
      python: `def find_middle(head):
    slow = fast = head
    while ___BLANK1___ and ___BLANK2___:
        slow = ___BLANK3___
        fast = ___BLANK4___
    return slow`
    },
    blanks: [
      { id: 'BLANK1', answer: 'fast', hint: '快指针不为空' },
      { id: 'BLANK2', answer: 'fast->next', hint: '快指针的下一个不为空' },
      { id: 'BLANK3', answer: 'slow->next', hint: '慢指针走一步' },
      { id: 'BLANK4', answer: 'fast->next->next', hint: '快指针走两步' }
    ],
    explanation: '快指针速度是慢指针2倍，快到终点时慢在中间。这是快慢指针的经典应用！'
  },
  {
    id: 'll-cycle', category: '链表', title: '链表判环', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给定一个链表，判断链表中是否有环。

【输入格式】
第一行：整数n，表示链表长度
第二行：n个整数，表示链表节点值
第三行：整数pos，尾节点连接的位置（-1表示无环）

【输出格式】
输出true或false

【数据范围】
- 0 ≤ n ≤ 10^4
- -10^5 ≤ Node.val ≤ 10^5`,
    templates: {
      c: `int hasCycle(Node* head) {\n    // 请实现判环\n}`,
      cpp: `bool hasCycle(Node* head) {\n    // 请实现判环\n}`,
      java: `boolean hasCycle(Node head) {\n    // 请实现判环\n}`,
      python: `def has_cycle(head):\n    pass`
    },
    solutions: {
      c: `int hasCycle(Node* head) {\n    Node *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) return 1;\n    }\n    return 0;\n}`,
      cpp: `bool hasCycle(Node* head) {\n    Node *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;        // 慢指针走1步\n        fast = fast->next->next;  // 快指针走2步\n        if (slow == fast) return true;  // 相遇有环\n    }\n    return false;\n}`,
      java: `boolean hasCycle(Node head) {\n    Node slow = head, fast = head;\n    while (fast != null && fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if (slow == fast) return true;\n    }\n    return false;\n}`,
      python: `def has_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            return True\n    return False`
    },
    testCases: [
      { input: '4\n1 2 3 4\n1', expectedOutput: 'true', description: '有环' },
      { input: '4\n1 2 3 4\n-1', expectedOutput: 'false', description: '无环' }
    ],
    hints: ['快慢指针', '快指针每次走2步，慢指针走1步', '如果有环，快慢指针一定会相遇'],
    explanation: '龟兔赛跑：有环的话，兔子（快）一定会追上乌龟（慢）',
    commonMistakes: ['未处理空链表或单节点链表', '快指针移动前未检查fast.next是否为空', '循环终止条件写错']
  },
  {
    id: 'll-middle', category: '链表', title: '链表中间节点', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
给定单链表的头节点，返回链表的中间节点。如果有两个中间节点，返回第二个。

【输入格式】
第一行：整数n，表示链表长度 (1 ≤ n ≤ 100)
第二行：n个整数，表示链表节点值

【输出格式】
输出中间节点的值

【数据范围】
- 1 ≤ n ≤ 100`,
    templates: {
      c: `Node* middleNode(Node* head) {\n    // 请实现\n}`,
      cpp: `Node* middleNode(Node* head) {\n    // 请实现\n}`,
      java: `Node middleNode(Node head) {\n    // 请实现\n}`,
      python: `def middle_node(head):\n    pass`
    },
    solutions: {
      c: `Node* middleNode(Node* head) {\n    Node *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n    return slow;\n}`,
      cpp: `Node* middleNode(Node* head) {\n    Node *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n    return slow;  // 快指针到终点时，慢指针在中间\n}`,
      java: `Node middleNode(Node head) {\n    Node slow = head, fast = head;\n    while (fast != null && fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n    return slow;\n}`,
      python: `def middle_node(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    return slow`
    },
    testCases: [{ input: '5\n1 2 3 4 5', expectedOutput: '3', description: '中间' }],
    hints: ['快慢指针', '快指针走到头时，慢指针正好在中间'],
    explanation: '快指针速度是慢指针2倍，快到终点时慢在中间',
    commonMistakes: ['循环条件写成fast->next->next', '对于偶数长度链表返回了错误的中间节点（偏左或偏右）']
  },
  {
    id: 'll-merge', category: '链表', title: '合并两个有序链表', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
将两个升序链表合并为一个新的升序链表并返回。

【输入格式】
第一行：整数m，第一个链表长度
第二行：m个升序整数
第三行：整数n，第二个链表长度
第四行：n个升序整数

【输出格式】
输出合并后的链表，元素空格分隔

【数据范围】
- 0 ≤ m, n ≤ 50
- -100 ≤ Node.val ≤ 100`,
    templates: {
      c: `Node* mergeTwoLists(Node* l1, Node* l2) {\n    // 请实现\n}`,
      cpp: `Node* mergeTwoLists(Node* l1, Node* l2) {\n    // 请实现\n}`,
      java: `Node mergeTwoLists(Node l1, Node l2) {\n    // 请实现\n}`,
      python: `def merge_two_lists(l1, l2):\n    pass`
    },
    solutions: {
      c: `Node* mergeTwoLists(Node* l1, Node* l2) {\n    Node dummy; dummy.val = 0; dummy.next = NULL;\n    Node* tail = &dummy;\n    while (l1 && l2) {\n        if (l1->val <= l2->val) {\n            tail->next = l1; l1 = l1->next;\n        } else {\n            tail->next = l2; l2 = l2->next;\n        }\n        tail = tail->next;\n    }\n    tail->next = l1 ? l1 : l2;\n    return dummy.next;\n}`,
      cpp: `Node* mergeTwoLists(Node* l1, Node* l2) {\n    Node dummy(0), *tail = &dummy;\n    while (l1 && l2) {\n        if (l1->val <= l2->val) {\n            tail->next = l1; l1 = l1->next;\n        } else {\n            tail->next = l2; l2 = l2->next;\n        }\n        tail = tail->next;\n    }\n    tail->next = l1 ? l1 : l2;\n    return dummy.next;\n}`,
      java: `Node mergeTwoLists(Node l1, Node l2) {\n    Node dummy = new Node(0), tail = dummy;\n    while (l1 != null && l2 != null) {\n        if (l1.val <= l2.val) {\n            tail.next = l1; l1 = l1.next;\n        } else {\n            tail.next = l2; l2 = l2.next;\n        }\n        tail = tail.next;\n    }\n    tail.next = (l1 != null) ? l1 : l2;\n    return dummy.next;\n}`,
      python: `def merge_two_lists(l1, l2):\n    dummy = tail = Node(0)\n    while l1 and l2:\n        if l1.val <= l2.val:\n            tail.next = l1; l1 = l1.next\n        else:\n            tail.next = l2; l2 = l2.next\n        tail = tail.next\n    tail.next = l1 or l2\n    return dummy.next`
    },
    testCases: [{ input: '3\n1 3 5\n3\n2 4 6', expectedOutput: '1 2 3 4 5 6', description: '合并' }],
    hints: ['使用dummy头节点简化操作', '比较两链表头，取小的接上'],
    explanation: '双指针归并，每次取较小者',
    commonMistakes: ['未处理其中一个链表为空的情况', '忘记更新tail指针', '循环结束后未连接剩余节点']
  },
];

// ==================== 栈 ====================
export const stackExercises: Exercise[] = [
  {
    id: 'stack-brackets', category: '栈', title: '括号匹配', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。
有效字符串需满足：左括号必须用相同类型的右括号闭合，且顺序正确。

【输入格式】
一行字符串 s (0 ≤ s.length ≤ 10^4)

【输出格式】
输出 true 或 false

【数据范围】
- 0 ≤ s.length ≤ 10^4
- s 仅由括号 '()[]{}' 组成`,
    templates: {
      c: `int isValid(char* s) {\n    // 请实现括号匹配\n}`,
      cpp: `bool isValid(string s) {\n    // 请实现括号匹配\n}`,
      java: `boolean isValid(String s) {\n    // 请实现括号匹配\n}`,
      python: `def is_valid(s):\n    pass`
    },
    solutions: {
      c: `int isValid(char* s) {\n    char stack[1000]; int top = -1;\n    for (int i = 0; s[i]; i++) {\n        char c = s[i];\n        if (c == '(' || c == '[' || c == '{') stack[++top] = c;\n        else {\n            if (top < 0) return 0;\n            char t = stack[top--];\n            if (c == ')' && t != '(') return 0;\n            if (c == ']' && t != '[') return 0;\n            if (c == '}' && t != '{') return 0;\n        }\n    }\n    return top < 0;\n}`,
      cpp: `bool isValid(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(' || c == '[' || c == '{') st.push(c);\n        else {\n            if (st.empty()) return false;\n            char top = st.top(); st.pop();\n            if (c == ')' && top != '(') return false;\n            if (c == ']' && top != '[') return false;\n            if (c == '}' && top != '{') return false;\n        }\n    }\n    return st.empty();\n}`,
      java: `boolean isValid(String s) {\n    Stack<Character> stack = new Stack<>();\n    for (char c : s.toCharArray()) {\n        if (c == '(' || c == '[' || c == '{') stack.push(c);\n        else {\n            if (stack.isEmpty()) return false;\n            char top = stack.pop();\n            if (c == ')' && top != '(') return false;\n            if (c == ']' && top != '[') return false;\n            if (c == '}' && top != '{') return false;\n        }\n    }\n    return stack.isEmpty();\n}`,
      python: `def is_valid(s):\n    stack = []\n    pairs = {')': '(', ']': '[', '}': '{'}\n    for c in s:\n        if c in '([{':\n            stack.append(c)\n        else:\n            if not stack or stack[-1] != pairs[c]:\n                return False\n            stack.pop()\n    return len(stack) == 0`
    },
    testCases: [{ input: '()[]{}', expectedOutput: 'true', description: '有效' }, { input: '(]', expectedOutput: 'false', description: '无效' }],
    hints: ['左括号入栈', '右括号时检查栈顶'], explanation: '经典栈应用：左括号入栈，右括号匹配出栈',
    commonMistakes: ['右括号时栈为空（即右括号多了）', '最后栈不为空（即左括号多了）', '括号类型不匹配']
  },
  // 填空题
  {
    id: 'stack-push-pop-blank', category: '栈', title: '栈的基本操作填空', difficulty: 'easy', type: 'fillblank',
    description: '完成栈的入栈和出栈操作',
    codeTemplate: {
      cpp: `// 顺序栈的入栈操作
bool push(int e) {
    if (top == MaxSize - 1) return false;  // 栈满
    ___BLANK1___;  // 先移动栈顶指针
    ___BLANK2___;  // 再存入元素
    return true;
}
// 出栈操作
int pop() {
    if (top == -1) return -1;  // 栈空
    return ___BLANK3___;  // 先取元素再移动指针
}`,
      java: `// 入栈
boolean push(int e) {
    if (top == maxSize - 1) return false;
    ___BLANK1___;
    ___BLANK2___;
    return true;
}`,
      python: `# 入栈
def push(self, e):
    if self.top == self.max_size - 1:
        return False
    ___BLANK1___
    ___BLANK2___
    return True`
    },
    blanks: [
      { id: 'BLANK1', answer: 'top++', hint: '栈顶指针加1' },
      { id: 'BLANK2', answer: 'data[top] = e', hint: '将元素存入栈顶位置' },
      { id: 'BLANK3', answer: 'data[top--]', hint: '返回栈顶元素并将指针减1' }
    ],
    explanation: '入栈：先top++再存；出栈：先取data[top]再top--'
  },
  {
    id: 'stack-brackets-blank', category: '栈', title: '括号匹配填空', difficulty: 'easy', type: 'fillblank',
    description: '用栈完成括号匹配判断',
    codeTemplate: {
      cpp: `bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            ___BLANK1___;  // 左括号处理
        } else {
            if (___BLANK2___) return false;  // 栈空检查
            char top = st.top(); st.pop();
            if (c == ')' && ___BLANK3___) return false;
            if (c == ']' && top != '[') return false;
            if (c == '}' && top != '{') return false;
        }
    }
    return ___BLANK4___;  // 最终判断
}`,
      java: `同上`,
      python: `def is_valid(s):
    stack = []
    for c in s:
        if c in '([{':
            ___BLANK1___
        else:
            if ___BLANK2___:
                return False
            top = stack.pop()
            if c == ')' and ___BLANK3___:
                return False
    return ___BLANK4___`
    },
    blanks: [
      { id: 'BLANK1', answer: 'st.push(c)', hint: '左括号入栈' },
      { id: 'BLANK2', answer: 'st.empty()', hint: '检查栈是否为空' },
      { id: 'BLANK3', answer: 'top != \'(\'', hint: '检查是否匹配' },
      { id: 'BLANK4', answer: 'st.empty()', hint: '栈空则所有括号匹配' }
    ],
    explanation: '括号匹配：左括号入栈，右括号检查栈顶是否匹配。最后栈必须为空！'
  },
  {
    id: 'stack-infix-postfix-blank', category: '栈', title: '中缀转后缀填空', difficulty: 'medium', type: 'fillblank',
    description: '完成中缀表达式转后缀表达式的核心逻辑',
    codeTemplate: {
      cpp: `// 中缀转后缀（假设只有+、-、*、/和括号）
// 输入: 3 + 4 * 2
// 输出: 3 4 2 * +
/*
规则：
1. 遇到数字：___BLANK1___
2. 遇到左括号：___BLANK2___
3. 遇到右括号：___BLANK3___
4. 遇到运算符：弹出优先级>=当前的运算符，然后入栈
*/`,
      java: `同上`,
      python: `# 中缀转后缀规则同上`
    },
    blanks: [
      { id: 'BLANK1', answer: '直接输出', hint: '数字不入栈，直接放入结果' },
      { id: 'BLANK2', answer: '入栈', hint: '左括号无条件入栈' },
      { id: 'BLANK3', answer: '弹出并输出直到遇到左括号', hint: '把括号内的运算符都弹出' }
    ],
    explanation: '中缀转后缀：数字直接输出，运算符根据优先级处理，括号控制优先级'
  },
  {
    id: 'stack-minstack', category: '栈', title: '最小栈', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
设计一个支持push、pop、top操作，并能在常数时间内检索到最小元素的栈。
实现MinStack类：
- MinStack() 初始化栈对象
- void push(int val) 将元素val推入栈中
- void pop() 删除栈顶元素
- int top() 获取栈顶元素
- int getMin() 获取栈中最小元素

【输入格式】
操作序列

【输出格式】
每个top和getMin操作的返回值

【数据范围】
- -2^31 ≤ val ≤ 2^31 - 1
- pop、top、getMin操作总是在非空栈上调用
- push、pop、top、getMin最多调用3×10^4次`,
    templates: {
      c: `typedef struct MinStack {\n    // 请实现\n} MinStack;`,
      cpp: `class MinStack {\npublic:\n    void push(int val) { }\n    void pop() { }\n    int top() { }\n    int getMin() { }\n};`,
      java: `class MinStack {\n    public void push(int val) { }\n    public void pop() { }\n    public int top() { }\n    public int getMin() { }\n}`,
      python: `class MinStack:\n    def push(self, val): pass\n    def pop(self): pass\n    def top(self): pass\n    def get_min(self): pass`
    },
    solutions: {
      c: `typedef struct {\n    int data[1000], minData[1000];\n    int top, minTop;\n} MinStack;\nvoid push(MinStack* s, int val) {\n    s->data[++s->top] = val;\n    if (s->minTop < 0 || val <= s->minData[s->minTop])\n        s->minData[++s->minTop] = val;\n}\nvoid pop(MinStack* s) {\n    if (s->data[s->top] == s->minData[s->minTop]) s->minTop--;\n    s->top--;\n}\nint top(MinStack* s) { return s->data[s->top]; }\nint getMin(MinStack* s) { return s->minData[s->minTop]; }`,
      cpp: `class MinStack {\n    stack<int> s, minS;  // 辅助栈存最小值\npublic:\n    void push(int val) {\n        s.push(val);\n        if (minS.empty() || val <= minS.top())\n            minS.push(val);\n    }\n    void pop() {\n        if (s.top() == minS.top()) minS.pop();\n        s.pop();\n    }\n    int top() { return s.top(); }\n    int getMin() { return minS.top(); }\n};`,
      java: `class MinStack {\n    Stack<Integer> s = new Stack<>(), minS = new Stack<>();\n    public void push(int val) {\n        s.push(val);\n        if (minS.isEmpty() || val <= minS.peek())\n            minS.push(val);\n    }\n    public void pop() {\n        if (s.peek().equals(minS.peek())) minS.pop();\n        s.pop();\n    }\n    public int top() { return s.peek(); }\n    public int getMin() { return minS.peek(); }\n}`,
      python: `class MinStack:\n    def __init__(self):\n        self.s, self.min_s = [], []\n    def push(self, val):\n        self.s.append(val)\n        if not self.min_s or val <= self.min_s[-1]:\n            self.min_s.append(val)\n    def pop(self):\n        if self.s[-1] == self.min_s[-1]:\n            self.min_s.pop()\n        self.s.pop()\n    def top(self): return self.s[-1]\n    def get_min(self): return self.min_s[-1]`
    },
    testCases: [{ input: '6\npush -2\npush 0\npush -3\ngetMin\npop\ngetMin', expectedOutput: '-3\n-2', description: '最小值' }],
    hints: ['使用辅助栈记录每个状态的最小值', '入栈时同步更新最小值栈'],
    explanation: '用辅助栈同步记录当前最小值，空间换时间'
  },
  {
    id: 'stack-postfix', category: '栈', title: '后缀表达式求值', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
计算后缀表达式（逆波兰表达式）的值。
有效的运算符包括+、-、*、/，每个操作数和运算符之间用空格分隔。
整数除法只保留整数部分。

【输入格式】
第一行：整数n，表示token数量
第二行：n个token（数字或运算符），空格分隔

【输出格式】
输出计算结果

【数据范围】
- 1 ≤ n ≤ 10^4
- tokens[i] 是一个运算符（+、-、*、/）或范围在[-200, 200]内的整数`,
    templates: {
      c: `int evalRPN(char** tokens, int n) {\n    // 请实现\n}`,
      cpp: `int evalRPN(vector<string>& tokens) {\n    // 请实现\n}`,
      java: `int evalRPN(String[] tokens) {\n    // 请实现\n}`,
      python: `def eval_rpn(tokens):\n    pass`
    },
    solutions: {
      c: `int evalRPN(char** tokens, int n) {\n    int stack[1000], top = -1;\n    for (int i = 0; i < n; i++) {\n        char* t = tokens[i];\n        if (t[0] == '+' || (t[0] == '-' && !t[1]) || t[0] == '*' || t[0] == '/') {\n            int b = stack[top--], a = stack[top--];\n            if (t[0] == '+') stack[++top] = a + b;\n            else if (t[0] == '-') stack[++top] = a - b;\n            else if (t[0] == '*') stack[++top] = a * b;\n            else stack[++top] = a / b;\n        } else stack[++top] = atoi(t);\n    }\n    return stack[0];\n}`,
      cpp: `int evalRPN(vector<string>& tokens) {\n    stack<int> s;\n    for (string& t : tokens) {\n        if (t == "+" || t == "-" || t == "*" || t == "/") {\n            int b = s.top(); s.pop();\n            int a = s.top(); s.pop();\n            if (t == "+") s.push(a + b);\n            else if (t == "-") s.push(a - b);\n            else if (t == "*") s.push(a * b);\n            else s.push(a / b);\n        } else {\n            s.push(stoi(t));\n        }\n    }\n    return s.top();\n}`,
      java: `int evalRPN(String[] tokens) {\n    Stack<Integer> s = new Stack<>();\n    for (String t : tokens) {\n        if ("+-*/".contains(t)) {\n            int b = s.pop(), a = s.pop();\n            switch (t) {\n                case "+": s.push(a + b); break;\n                case "-": s.push(a - b); break;\n                case "*": s.push(a * b); break;\n                case "/": s.push(a / b); break;\n            }\n        } else {\n            s.push(Integer.parseInt(t));\n        }\n    }\n    return s.peek();\n}`,
      python: `def eval_rpn(tokens):\n    s = []\n    for t in tokens:\n        if t in '+-*/':\n            b, a = s.pop(), s.pop()\n            if t == '+': s.append(a + b)\n            elif t == '-': s.append(a - b)\n            elif t == '*': s.append(a * b)\n            else: s.append(int(a / b))\n        else:\n            s.append(int(t))\n    return s[0]`
    },
    testCases: [{ input: '5\n2 1 + 3 *', expectedOutput: '9', description: '(2+1)*3=9' }],
    hints: ['数字入栈', '遇运算符弹出两个数计算后入栈'],
    explanation: '后缀表达式计算：遇数字入栈，遇运算符弹两个数计算'
  },
  {
    id: 'stack-daily-temp', category: '栈', title: '每日温度', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给定一个整数数组temperatures，表示每天的温度。
返回一个数组answer，其中answer[i]是指对于第i天，下一个更高温度出现在几天后。
如果气温在这之后都不会升高，请在该位置用 0 来代替。

【输入格式】
第一行：整数n，表示天数
第二行：n个整数，表示每天的温度

【输出格式】
输出n个整数，表示等待天数

【数据范围】
- 1 ≤ n ≤ 10^5
- 30 ≤ temperatures[i] ≤ 100`,
    templates: {
      c: `int* dailyTemperatures(int* T, int n) {\n    // 请实现\n}`,
      cpp: `vector<int> dailyTemperatures(vector<int>& T) {\n    // 请实现\n}`,
      java: `int[] dailyTemperatures(int[] T) {\n    // 请实现\n}`,
      python: `def daily_temperatures(T):\n    pass`
    },
    solutions: {
      c: `int* dailyTemperatures(int* T, int n) {\n    int* res = (int*)calloc(n, sizeof(int));\n    int stack[n], top = -1;\n    for (int i = 0; i < n; i++) {\n        while (top >= 0 && T[i] > T[stack[top]]) {\n            int j = stack[top--];\n            res[j] = i - j;\n        }\n        stack[++top] = i;\n    }\n    return res;\n}`,
      cpp: `vector<int> dailyTemperatures(vector<int>& T) {\n    int n = T.size();\n    vector<int> res(n, 0);\n    stack<int> s;  // 存下标，单调递减栈\n    for (int i = 0; i < n; i++) {\n        while (!s.empty() && T[i] > T[s.top()]) {\n            int j = s.top(); s.pop();\n            res[j] = i - j;  // 等了i-j天\n        }\n        s.push(i);\n    }\n    return res;\n}`,
      java: `int[] dailyTemperatures(int[] T) {\n    int n = T.length;\n    int[] res = new int[n];\n    Stack<Integer> s = new Stack<>();\n    for (int i = 0; i < n; i++) {\n        while (!s.isEmpty() && T[i] > T[s.peek()]) {\n            int j = s.pop();\n            res[j] = i - j;\n        }\n        s.push(i);\n    }\n    return res;\n}`,
      python: `def daily_temperatures(T):\n    n = len(T)\n    res = [0] * n\n    s = []  # 单调递减栈\n    for i in range(n):\n        while s and T[i] > T[s[-1]]:\n            j = s.pop()\n            res[j] = i - j\n        s.append(i)\n    return res`
    },
    testCases: [{ input: '8\n73 74 75 71 69 72 76 73', expectedOutput: '1 1 4 2 1 1 0 0', description: '等待天数' }],
    hints: ['单调递减栈', '栈存下标而不是值', '遇到更大的温度就计算等待天数'],
    explanation: '单调栈：维护一个递减栈，遇到更大元素时结算'
  },
];

// ==================== 队列 ====================
export const queueExercises: Exercise[] = [
  {
    id: 'queue-circular', category: '队列', title: '循环队列', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
设计并实现循环队列，支持以下操作：
- MyCircularQueue(k) 初始化队列，最大容量为k
- bool enQueue(int value) 向队列尾部插入元素
- bool deQueue() 从队列头部删除元素
- int Front() 获取队首元素
- int Rear() 获取队尾元素
- bool isEmpty() 检查队列是否为空
- bool isFull() 检查队列是否已满

【输入格式】
操作序列

【输出格式】
每个操作的返回值

【数据范围】
- 1 ≤ k ≤ 1000
- 0 ≤ value ≤ 1000`,
    templates: {
      c: `typedef struct {\n    int data[100], front, rear, size;\n} CircularQueue;\nint enqueue(CircularQueue* q, int x) { }\nint dequeue(CircularQueue* q) { }`,
      cpp: `class CircularQueue {\n    int data[100], front=0, rear=0, size=100;\npublic:\n    bool enqueue(int x) { }\n    int dequeue() { }\n    bool isEmpty() { }\n    bool isFull() { }\n};`,
      java: `class CircularQueue {\n    int[] data = new int[100];\n    int front=0, rear=0, size=100;\n    boolean enqueue(int x) { }\n    int dequeue() { }\n    boolean isEmpty() { }\n    boolean isFull() { }\n}`,
      python: `class CircularQueue:\n    def __init__(self, size=100):\n        self.data = [0]*size\n        self.front = self.rear = 0\n        self.size = size\n    def enqueue(self, x): pass\n    def dequeue(self): pass\n    def is_empty(self): pass\n    def is_full(self): pass`
    },
    solutions: {
      c: `typedef struct {\n    int data[100], front, rear, size;\n} CircularQueue;\nint enqueue(CircularQueue* q, int x) {\n    if ((q->rear + 1) % q->size == q->front) return 0;\n    q->data[q->rear] = x;\n    q->rear = (q->rear + 1) % q->size;\n    return 1;\n}\nint dequeue(CircularQueue* q) {\n    if (q->front == q->rear) return -1;\n    int x = q->data[q->front];\n    q->front = (q->front + 1) % q->size;\n    return x;\n}`,
      cpp: `class CircularQueue {\n    int data[100], front=0, rear=0, size=100;\npublic:\n    bool enqueue(int x) {\n        if (isFull()) return false;\n        data[rear] = x;\n        rear = (rear + 1) % size;\n        return true;\n    }\n    int dequeue() {\n        if (isEmpty()) return -1;\n        int x = data[front];\n        front = (front + 1) % size;\n        return x;\n    }\n    bool isEmpty() { return front == rear; }\n    bool isFull() { return (rear + 1) % size == front; }\n};`,
      java: `class CircularQueue {\n    int[] data = new int[100];\n    int front=0, rear=0, size=100;\n    boolean enqueue(int x) {\n        if (isFull()) return false;\n        data[rear] = x;\n        rear = (rear + 1) % size;\n        return true;\n    }\n    int dequeue() {\n        if (isEmpty()) return -1;\n        int x = data[front];\n        front = (front + 1) % size;\n        return x;\n    }\n    boolean isEmpty() { return front == rear; }\n    boolean isFull() { return (rear + 1) % size == front; }\n}`,
      python: `class CircularQueue:\n    def __init__(self, size=100):\n        self.data = [0]*size\n        self.front = self.rear = 0\n        self.size = size\n    def enqueue(self, x):\n        if self.is_full(): return False\n        self.data[self.rear] = x\n        self.rear = (self.rear + 1) % self.size\n        return True\n    def dequeue(self):\n        if self.is_empty(): return -1\n        x = self.data[self.front]\n        self.front = (self.front + 1) % self.size\n        return x\n    def is_empty(self): return self.front == self.rear\n    def is_full(self): return (self.rear + 1) % self.size == self.front`
    },
    testCases: [{ input: '4\nenqueue 1\nenqueue 2\nenqueue 3\ndequeue', expectedOutput: '1', description: '先进先出' }],
    hints: ['用取模实现循环', '空：front==rear', '满：(rear+1)%size==front'], explanation: '循环队列用取模让指针循环移动',
    commonMistakes: ['判满条件错误(如 front==rear)', '长度计算未取模', '指针移动未取模']
  },
  // 填空题
  {
    id: 'queue-circular-blank', category: '队列', title: '循环队列判断填空', difficulty: 'easy', type: 'fillblank',
    description: '完成循环队列的判空和判满条件',
    codeTemplate: {
      cpp: `// 循环队列（牺牲一个空间法）
// front指向队头，rear指向队尾的下一个位置
bool isEmpty() {
    return ___BLANK1___;  // 判空条件
}
bool isFull() {
    return ___BLANK2___;  // 判满条件
}
int getLength() {
    return ___BLANK3___;  // 计算队列长度
}`,
      java: `boolean isEmpty() { return ___BLANK1___; }
boolean isFull() { return ___BLANK2___; }
int getLength() { return ___BLANK3___; }`,
      python: `def is_empty(self): return ___BLANK1___
def is_full(self): return ___BLANK2___
def get_length(self): return ___BLANK3___`
    },
    blanks: [
      { id: 'BLANK1', answer: 'front == rear', hint: '队空时front和rear相等' },
      { id: 'BLANK2', answer: '(rear + 1) % size == front', hint: 'rear的下一个位置是front时队满' },
      { id: 'BLANK3', answer: '(rear - front + size) % size', hint: '用取模处理循环情况' }
    ],
    explanation: '循环队列核心：空(front==rear)，满((rear+1)%size==front)，长度((rear-front+size)%size)'
  },
  {
    id: 'queue-enqueue-dequeue-blank', category: '队列', title: '循环队列出入队填空', difficulty: 'easy', type: 'fillblank',
    description: '完成循环队列的入队和出队操作',
    codeTemplate: {
      cpp: `// 循环队列入队
bool enqueue(int e) {
    if (isFull()) return false;
    data[rear] = e;
    rear = ___BLANK1___;  // 更新rear
    return true;
}
// 循环队列出队
bool dequeue(int& e) {
    if (isEmpty()) return false;
    e = ___BLANK2___;     // 取出元素
    front = ___BLANK3___; // 更新front
    return true;
}`,
      java: `同上`,
      python: `def enqueue(self, e):
    if self.is_full(): return False
    self.data[self.rear] = e
    self.rear = ___BLANK1___
    return True
def dequeue(self):
    if self.is_empty(): return None
    e = ___BLANK2___
    self.front = ___BLANK3___
    return e`
    },
    blanks: [
      { id: 'BLANK1', answer: '(rear + 1) % size', hint: '循环移动rear' },
      { id: 'BLANK2', answer: 'data[front]', hint: '取队头元素' },
      { id: 'BLANK3', answer: '(front + 1) % size', hint: '循环移动front' }
    ],
    explanation: '循环队列关键：用取模实现循环，入队rear后移，出队front后移'
  },
  {
    id: 'queue-two-stacks-blank', category: '队列', title: '两栈实现队列填空', difficulty: 'medium', type: 'fillblank',
    description: '用两个栈实现队列的核心逻辑',
    codeTemplate: {
      cpp: `class MyQueue {
    stack<int> stackIn, stackOut;  // 入栈和出栈
    
    void transfer() {
        while (!stackIn.empty()) {
            ___BLANK1___;  // 转移逻辑
        }
    }
public:
    void push(int x) { ___BLANK2___; }
    
    int pop() {
        if (___BLANK3___) transfer();  // 何时转移
        int top = stackOut.top();
        stackOut.pop();
        return top;
    }
};`,
      java: `同上`,
      python: `class MyQueue:
    def transfer(self):
        while self.stack_in:
            ___BLANK1___
    def push(self, x): ___BLANK2___
    def pop(self):
        if ___BLANK3___: self.transfer()
        return self.stack_out.pop()`
    },
    blanks: [
      { id: 'BLANK1', answer: 'stackOut.push(stackIn.top()); stackIn.pop()', hint: '把入栈元素倒入出栈' },
      { id: 'BLANK2', answer: 'stackIn.push(x)', hint: '入队就是入到入栈' },
      { id: 'BLANK3', answer: 'stackOut.empty()', hint: '出栈空时才转移' }
    ],
    explanation: '两栈实现队列：入栈负责入队，出栈负责出队。只有出栈空时才从入栈转移！'
  },
  {
    id: 'queue-stack', category: '队列', title: '用栈实现队列', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
请你仅使用两个栈实现先入先出队列。队列应当支持以下操作：
push(x) - 将元素x推到队列末尾
pop() - 从队列头部移除并返回元素
peek() - 返回队列头部元素
empty() - 返回队列是否为空

【输入格式】
多行操作指令

【输出格式】
每个操作的结果

【数据范围】
- 1 ≤ x ≤ 9
- 最多调用100次操作`,
    templates: {
      c: `typedef struct {\n    int in[100], out[100], inTop, outTop;\n} MyQueue;\nvoid push(MyQueue* q, int x) { }\nint pop(MyQueue* q) { }`,
      cpp: `class MyQueue {\npublic:\n    void push(int x) { }\n    int pop() { }\n    int peek() { }\n    bool empty() { }\n};`,
      java: `class MyQueue {\n    public void push(int x) { }\n    public int pop() { }\n    public int peek() { }\n    public boolean empty() { }\n}`,
      python: `class MyQueue:\n    def push(self, x): pass\n    def pop(self): pass\n    def peek(self): pass\n    def empty(self): pass`
    },
    solutions: {
      c: `typedef struct {\n    int in[100], out[100], inTop, outTop;\n} MyQueue;\nvoid transfer(MyQueue* q) {\n    while (q->inTop >= 0) q->out[++q->outTop] = q->in[q->inTop--];\n}\nvoid push(MyQueue* q, int x) { q->in[++q->inTop] = x; }\nint pop(MyQueue* q) {\n    if (q->outTop < 0) transfer(q);\n    return q->out[q->outTop--];\n}\nint peek(MyQueue* q) {\n    if (q->outTop < 0) transfer(q);\n    return q->out[q->outTop];\n}\nint empty(MyQueue* q) { return q->inTop < 0 && q->outTop < 0; }`,
      cpp: `class MyQueue {\n    stack<int> in, out;  // in负责入，out负责出\n    void transfer() { while (!in.empty()) { out.push(in.top()); in.pop(); } }\npublic:\n    void push(int x) { in.push(x); }\n    int pop() { if (out.empty()) transfer(); int x = out.top(); out.pop(); return x; }\n    int peek() { if (out.empty()) transfer(); return out.top(); }\n    bool empty() { return in.empty() && out.empty(); }\n};`,
      java: `class MyQueue {\n    Stack<Integer> in = new Stack<>(), out = new Stack<>();\n    void transfer() { while (!in.isEmpty()) out.push(in.pop()); }\n    public void push(int x) { in.push(x); }\n    public int pop() { if (out.isEmpty()) transfer(); return out.pop(); }\n    public int peek() { if (out.isEmpty()) transfer(); return out.peek(); }\n    public boolean empty() { return in.isEmpty() && out.isEmpty(); }\n}`,
      python: `class MyQueue:\n    def __init__(self):\n        self.in_s, self.out_s = [], []\n    def transfer(self):\n        while self.in_s: self.out_s.append(self.in_s.pop())\n    def push(self, x): self.in_s.append(x)\n    def pop(self):\n        if not self.out_s: self.transfer()\n        return self.out_s.pop()\n    def peek(self):\n        if not self.out_s: self.transfer()\n        return self.out_s[-1]\n    def empty(self): return not self.in_s and not self.out_s`
    },
    testCases: [{ input: '5\npush 1\npush 2\npeek\npop\nempty', expectedOutput: '1\n1\nfalse', description: '队列操作' }],
    hints: ['一个栈负责入队，一个栈负责出队', '出队栈空时才从入队栈转移'],
    explanation: '两个栈倒一下，后进先出变先进先出',
    commonMistakes: ['出栈时直接从入队栈pop', '判空时只检查了一个栈']
  },
  {
    id: 'queue-sliding-window', category: '队列', title: '滑动窗口最大值', difficulty: 'hard', type: 'coding',
    description: `【题目描述】
给定一个数组nums和滑动窗口大小k，窗口从左到右滑动，返回每个窗口中的最大值。

【输入格式】
第一行：整数n，表示数组长度 (1 ≤ n ≤ 10^5)
第二行：n个整数
第三行：整数k，窗口大小 (1 ≤ k ≤ n)

【输出格式】
输出n-k+1个整数，表示每个窗口的最大值

【数据范围】
- 1 ≤ n ≤ 10^5
- -10^4 ≤ nums[i] ≤ 10^4
- 1 ≤ k ≤ n`,
    templates: {
      c: `int* maxSlidingWindow(int* nums, int n, int k) {\n    // 请实现\n}`,
      cpp: `vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n    // 请实现\n}`,
      java: `int[] maxSlidingWindow(int[] nums, int k) {\n    // 请实现\n}`,
      python: `def max_sliding_window(nums, k):\n    pass`
    },
    solutions: {
      c: `int* maxSlidingWindow(int* nums, int n, int k) {\n    int* res = (int*)malloc((n-k+1) * sizeof(int));\n    int dq[n], front = 0, rear = -1;\n    for (int i = 0; i < n; i++) {\n        while (front <= rear && dq[front] <= i - k) front++;\n        while (front <= rear && nums[dq[rear]] < nums[i]) rear--;\n        dq[++rear] = i;\n        if (i >= k - 1) res[i - k + 1] = nums[dq[front]];\n    }\n    return res;\n}`,
      cpp: `vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n    vector<int> res;\n    deque<int> dq;  // 单调递减双端队列，存下标\n    for (int i = 0; i < nums.size(); i++) {\n        // 移除过期元素\n        while (!dq.empty() && dq.front() <= i - k) dq.pop_front();\n        // 维护单调性\n        while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();\n        dq.push_back(i);\n        if (i >= k - 1) res.push_back(nums[dq.front()]);\n    }\n    return res;\n}`,
      java: `int[] maxSlidingWindow(int[] nums, int k) {\n    int n = nums.length;\n    int[] res = new int[n - k + 1];\n    Deque<Integer> dq = new LinkedList<>();\n    for (int i = 0; i < n; i++) {\n        while (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();\n        while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();\n        dq.offerLast(i);\n        if (i >= k - 1) res[i - k + 1] = nums[dq.peekFirst()];\n    }\n    return res;\n}`,
      python: `def max_sliding_window(nums, k):\n    from collections import deque\n    dq, res = deque(), []\n    for i, n in enumerate(nums):\n        while dq and dq[0] <= i - k: dq.popleft()\n        while dq and nums[dq[-1]] < n: dq.pop()\n        dq.append(i)\n        if i >= k - 1: res.append(nums[dq[0]])\n    return res`
    },
    testCases: [{ input: '8\n1 3 -1 -3 5 3 6 7\n3', expectedOutput: '3 3 5 5 6 7', description: '窗口最大值' }],
    hints: ['单调递减双端队列', '队首是当前窗口最大值', '及时移除过期和小于当前的元素'],
    explanation: '单调队列：维护递减队列，队首就是最大值',
    commonMistakes: ['未及时移除窗口左侧过期的元素', '单调性维护错误(应为单调递减)', '队列存了值而不是下标(导致无法判断过期)']
  },
];

// ==================== 树 ====================
export const treeExercises: Exercise[] = [
  {
    id: 'tree-preorder', category: '二叉树', title: '前序遍历', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
给定二叉树的根节点，返回它的前序遍历结果（根-左-右）。

【输入格式】
第一行：整数n，表示节点数
第二行：层序遍历序列，-1表示null

【输出格式】
输出前序遍历结果，空格分隔

【数据范围】
- 0 ≤ n ≤ 100
- -100 ≤ Node.val ≤ 100`,
    templates: {
      c: `void preorder(TreeNode* root, int* res, int* idx) {\n    // 请实现前序遍历\n}`,
      cpp: `vector<int> preorder(TreeNode* root) {\n    // 请实现前序遍历\n}`,
      java: `List<Integer> preorder(TreeNode root) {\n    // 请实现前序遍历\n}`,
      python: `def preorder(root):\n    pass`
    },
    solutions: {
      c: `void preorder(TreeNode* root, int* res, int* idx) {\n    if (!root) return;\n    res[(*idx)++] = root->val;\n    preorder(root->left, res, idx);\n    preorder(root->right, res, idx);\n}`,
      cpp: `vector<int> preorder(TreeNode* root) {\n    vector<int> res;\n    function<void(TreeNode*)> dfs = [&](TreeNode* n) {\n        if (!n) return;\n        res.push_back(n->val);  // 根\n        dfs(n->left);           // 左\n        dfs(n->right);          // 右\n    };\n    dfs(root);\n    return res;\n}`,
      java: `List<Integer> preorder(TreeNode root) {\n    List<Integer> res = new ArrayList<>();\n    dfs(root, res);\n    return res;\n}\nvoid dfs(TreeNode n, List<Integer> res) {\n    if (n == null) return;\n    res.add(n.val);\n    dfs(n.left, res);\n    dfs(n.right, res);\n}`,
      python: `def preorder(root):\n    res = []\n    def dfs(n):\n        if not n: return\n        res.append(n.val)  # 根\n        dfs(n.left)         # 左\n        dfs(n.right)        # 右\n    dfs(root)\n    return res`
    },
    testCases: [{ input: '3\n1 2 3', expectedOutput: '1 2 3', description: '前序' }],
    hints: ['递归：先访问根，再左子树，再右子树'], explanation: '前序遍历顺序：根-左-右',
    commonMistakes: ['递归基准条件缺失(!root return)', '左右子树顺序写反']
  },
  {
    id: 'tree-level', category: '二叉树', title: '层序遍历', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给定二叉树的根节点，返回其节点值的层序遍历结果（从上到下，从左到右）。

【输入格式】
第一行：整数n，表示节点数
第二行：层序遍历序列，-1表示null

【输出格式】
每层输出一行，元素空格分隔

【数据范围】
- 0 ≤ n ≤ 2000
- -1000 ≤ Node.val ≤ 1000`,
    templates: {
      c: `int** levelOrder(TreeNode* root, int* returnSize) {\n    // 请实现层序遍历\n}`,
      cpp: `vector<vector<int>> levelOrder(TreeNode* root) {\n    // 请实现层序遍历\n}`,
      java: `List<List<Integer>> levelOrder(TreeNode root) {\n    // 请实现层序遍历\n}`,
      python: `def level_order(root):\n    pass`
    },
    solutions: {
      c: `int** levelOrder(TreeNode* root, int* returnSize) {\n    if (!root) { *returnSize = 0; return NULL; }\n    TreeNode* queue[1000]; int front = 0, rear = 0;\n    queue[rear++] = root;\n    int** res = (int**)malloc(100 * sizeof(int*));\n    *returnSize = 0;\n    while (front < rear) {\n        int size = rear - front;\n        res[*returnSize] = (int*)malloc(size * sizeof(int));\n        for (int i = 0; i < size; i++) {\n            TreeNode* n = queue[front++];\n            res[*returnSize][i] = n->val;\n            if (n->left) queue[rear++] = n->left;\n            if (n->right) queue[rear++] = n->right;\n        }\n        (*returnSize)++;\n    }\n    return res;\n}`,
      cpp: `vector<vector<int>> levelOrder(TreeNode* root) {\n    vector<vector<int>> res;\n    if (!root) return res;\n    queue<TreeNode*> q;\n    q.push(root);\n    while (!q.empty()) {\n        int size = q.size();\n        vector<int> level;\n        for (int i = 0; i < size; i++) {\n            TreeNode* n = q.front(); q.pop();\n            level.push_back(n->val);\n            if (n->left) q.push(n->left);\n            if (n->right) q.push(n->right);\n        }\n        res.push_back(level);\n    }\n    return res;\n}`,
      java: `List<List<Integer>> levelOrder(TreeNode root) {\n    List<List<Integer>> res = new ArrayList<>();\n    if (root == null) return res;\n    Queue<TreeNode> q = new LinkedList<>();\n    q.offer(root);\n    while (!q.isEmpty()) {\n        int size = q.size();\n        List<Integer> level = new ArrayList<>();\n        for (int i = 0; i < size; i++) {\n            TreeNode n = q.poll();\n            level.add(n.val);\n            if (n.left != null) q.offer(n.left);\n            if (n.right != null) q.offer(n.right);\n        }\n        res.add(level);\n    }\n    return res;\n}`,
      python: `def level_order(root):\n    if not root: return []\n    res, q = [], [root]\n    while q:\n        size = len(q)\n        level = []\n        for _ in range(size):\n            n = q.pop(0)\n            level.append(n.val)\n            if n.left: q.append(n.left)\n            if n.right: q.append(n.right)\n        res.append(level)\n    return res`
    },
    testCases: [{ input: '7\n3 9 20 -1 -1 15 7', expectedOutput: '3\n9 20\n15 7', description: '层序' }],
    hints: ['使用队列', '每层开始记录队列大小'], explanation: '层序遍历用队列BFS，按层输出',
    commonMistakes: ['未记录当前层节点数导致无法分层', '队列为空的判断位置错误', '子节点入队顺序反了']
  },
  // 填空题
  {
    id: 'tree-traversal-blank', category: '二叉树', title: '三种遍历填空', difficulty: 'easy', type: 'fillblank',
    description: '完成三种遍历的递归代码',
    codeTemplate: {
      cpp: `// 前序遍历
void preorder(Node* n) {
    if (!n) return;
    ___BLANK1___;  // 前序：先访问根
    preorder(n->left);
    preorder(n->right);
}
// 中序遍历
void inorder(Node* n) {
    if (!n) return;
    inorder(n->left);
    ___BLANK2___;  // 中序：中间访问根
    inorder(n->right);
}
// 后序遍历
void postorder(Node* n) {
    if (!n) return;
    postorder(n->left);
    postorder(n->right);
    ___BLANK3___;  // 后序：最后访问根
}`,
      java: `void preorder(Node n) { if(n==null) return; ___BLANK1___; preorder(n.left); preorder(n.right); }`,
      python: `def preorder(n):\n    if not n: return\n    ___BLANK1___\n    preorder(n.left)\n    preorder(n.right)`
    },
    blanks: [
      { id: 'BLANK1', answer: 'visit(n)', hint: '访问当前节点' },
      { id: 'BLANK2', answer: 'visit(n)', hint: '访问当前节点' },
      { id: 'BLANK3', answer: 'visit(n)', hint: '访问当前节点' }
    ],
    explanation: '三种遍历只是visit(n)位置不同：前序(根左右)、中序(左根右)、后序(左右根)'
  },
  {
    id: 'tree-depth-blank', category: '二叉树', title: '二叉树深度填空', difficulty: 'easy', type: 'fillblank',
    description: '完成二叉树最大深度的递归计算',
    codeTemplate: {
      cpp: `int maxDepth(TreeNode* root) {
    if (___BLANK1___) return 0;  // 递归终止条件
    int leftDepth = maxDepth(___BLANK2___);
    int rightDepth = maxDepth(___BLANK3___);
    return ___BLANK4___;  // 返回最大深度
}`,
      java: `同上`,
      python: `def max_depth(root):
    if ___BLANK1___: return 0
    left_depth = max_depth(___BLANK2___)
    right_depth = max_depth(___BLANK3___)
    return ___BLANK4___`
    },
    blanks: [
      { id: 'BLANK1', answer: '!root', hint: '空节点深度为0' },
      { id: 'BLANK2', answer: 'root->left', hint: '左子树' },
      { id: 'BLANK3', answer: 'root->right', hint: '右子树' },
      { id: 'BLANK4', answer: '1 + max(leftDepth, rightDepth)', hint: '当前节点深度+子树最大深度' }
    ],
    explanation: '树的深度=1+max(左子树深度,右子树深度)。空节点返回0是递归的基础！'
  },
  {
    id: 'tree-bst-search-blank', category: '二叉树', title: 'BST查找填空', difficulty: 'easy', type: 'fillblank',
    description: '完成二叉搜索树的查找',
    codeTemplate: {
      cpp: `TreeNode* search(TreeNode* root, int val) {
    if (!root || root->val == val)
        return ___BLANK1___;
    if (val < root->val)
        return search(___BLANK2___, val);
    else
        return search(___BLANK3___, val);
}`,
      java: `同上`,
      python: `def search(root, val):
    if not root or root.val == val:
        return ___BLANK1___
    if val < root.val:
        return search(___BLANK2___, val)
    else:
        return search(___BLANK3___, val)`
    },
    blanks: [
      { id: 'BLANK1', answer: 'root', hint: '找到或为空，返回当前节点' },
      { id: 'BLANK2', answer: 'root->left', hint: '目标小于当前值，在左子树找' },
      { id: 'BLANK3', answer: 'root->right', hint: '目标大于当前值，在右子树找' }
    ],
    explanation: 'BST特性：左<根<右。查找时根据大小关系决定往哪边走，时间O(logn)'
  },
  {
    id: 'tree-level-order-blank', category: '二叉树', title: '层序遍历填空', difficulty: 'medium', type: 'fillblank',
    description: '用队列完成二叉树层序遍历',
    codeTemplate: {
      cpp: `vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> res;
    if (!root) return res;
    queue<TreeNode*> q;
    ___BLANK1___;  // 根节点入队
    while (!q.empty()) {
        int size = q.size();  // 当前层节点数
        vector<int> level;
        for (int i = 0; i < size; i++) {
            TreeNode* node = ___BLANK2___;  // 出队
            level.push_back(node->val);
            if (___BLANK3___) q.push(node->left);
            if (___BLANK4___) q.push(node->right);
        }
        res.push_back(level);
    }
    return res;
}`,
      java: `同上`,
      python: `def level_order(root):
    if not root: return []
    res, q = [], [root]
    while q:
        level = []
        for _ in range(len(q)):
            node = ___BLANK2___
            level.append(node.val)
            if ___BLANK3___: q.append(node.left)
            if ___BLANK4___: q.append(node.right)
        res.append(level)
    return res`
    },
    blanks: [
      { id: 'BLANK1', answer: 'q.push(root)', hint: '根节点入队' },
      { id: 'BLANK2', answer: 'q.front(); q.pop()', hint: '取出队首节点' },
      { id: 'BLANK3', answer: 'node->left', hint: '左子节点存在' },
      { id: 'BLANK4', answer: 'node->right', hint: '右子节点存在' }
    ],
    explanation: '层序遍历用队列BFS：每层节点依次出队，子节点入队。记录每层size实现分层！'
  },
  {
    id: 'tree-inorder', category: '二叉树', title: '中序遍历', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
给定一个二叉树的根节点root，返回它的中序遍历结果。
中序遍历顺序：左子树 -> 根节点 -> 右子树

【输入格式】
第一行：整数n，表示节点数
第二行：层序遍历序列，-1表示null

【输出格式】
输出中序遍历结果，空格分隔

【数据范围】
- 0 ≤ n ≤ 100
- -100 ≤ Node.val ≤ 100`,
    templates: {
      c: `void inorder(TreeNode* root, int* res, int* idx) {\n    // 请实现中序遍历\n}`,
      cpp: `vector<int> inorder(TreeNode* root) {\n    // 请实现中序遍历\n}`,
      java: `List<Integer> inorder(TreeNode root) {\n    // 请实现中序遍历\n}`,
      python: `def inorder(root):\n    pass`
    },
    solutions: {
      c: `void inorder(TreeNode* root, int* res, int* idx) {\n    if (!root) return;\n    inorder(root->left, res, idx);\n    res[(*idx)++] = root->val;\n    inorder(root->right, res, idx);\n}`,
      cpp: `vector<int> inorder(TreeNode* root) {\n    vector<int> res;\n    function<void(TreeNode*)> dfs = [&](TreeNode* n) {\n        if (!n) return;\n        dfs(n->left);           // 左\n        res.push_back(n->val);  // 根\n        dfs(n->right);          // 右\n    };\n    dfs(root);\n    return res;\n}`,
      java: `List<Integer> inorder(TreeNode root) {\n    List<Integer> res = new ArrayList<>();\n    dfs(root, res);\n    return res;\n}\nvoid dfs(TreeNode n, List<Integer> res) {\n    if (n == null) return;\n    dfs(n.left, res);\n    res.add(n.val);\n    dfs(n.right, res);\n}`,
      python: `def inorder(root):\n    res = []\n    def dfs(n):\n        if not n: return\n        dfs(n.left)         # 左\n        res.append(n.val)   # 根\n        dfs(n.right)        # 右\n    dfs(root)\n    return res`
    },
    testCases: [{ input: '3\n1 -1 2', expectedOutput: '1 2', description: '中序' }],
    hints: ['递归：先左子树，再根，再右子树'], explanation: '中序遍历顺序：左-根-右。BST的中序遍历是有序的！',
    commonMistakes: ['非递归实现时指针移动逻辑混乱', '混淆中序和前序的访问时机']
  },
  {
    id: 'tree-depth', category: '二叉树', title: '二叉树最大深度', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
给定一个二叉树，找出其最大深度。
最大深度是从根节点到最远叶子节点的最长路径上的节点数。

【输入格式】
第一行：整数n，表示节点数
第二行：层序遍历序列，-1表示null

【输出格式】
输出最大深度

【数据范围】
- 0 ≤ n ≤ 10^4`,
    templates: {
      c: `int maxDepth(TreeNode* root) {\n    // 请实现\n}`,
      cpp: `int maxDepth(TreeNode* root) {\n    // 请实现\n}`,
      java: `int maxDepth(TreeNode root) {\n    // 请实现\n}`,
      python: `def max_depth(root):\n    pass`
    },
    solutions: {
      c: `int maxDepth(TreeNode* root) {\n    if (!root) return 0;\n    int l = maxDepth(root->left);\n    int r = maxDepth(root->right);\n    return 1 + (l > r ? l : r);\n}`,
      cpp: `int maxDepth(TreeNode* root) {\n    if (!root) return 0;\n    return 1 + max(maxDepth(root->left), maxDepth(root->right));\n}`,
      java: `int maxDepth(TreeNode root) {\n    if (root == null) return 0;\n    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}`,
      python: `def max_depth(root):\n    if not root: return 0\n    return 1 + max(max_depth(root.left), max_depth(root.right))`
    },
    testCases: [{ input: '7\n3 9 20 -1 -1 15 7', expectedOutput: '3', description: '深度为3' }],
    hints: ['递归：空节点返回0', '非空节点：1 + 左右子树深度的最大值'],
    explanation: '最大深度 = 1 + max(左子树深度, 右子树深度)',
    commonMistakes: ['忘记+1', '叶子节点处理逻辑冗余']
  },
  {
    id: 'tree-invert', category: '二叉树', title: '翻转二叉树', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
给定一棵二叉树的根节点root，翻转这棵二叉树，并返回其根节点。
翻转即交换每个节点的左右子树。

【输入格式】
第一行：整数n，表示节点数
第二行：层序遍历序列，-1表示null

【输出格式】
输出翻转后的层序遍历序列

【数据范围】
- 0 ≤ n ≤ 100`,
    templates: {
      c: `TreeNode* invertTree(TreeNode* root) {\n    // 请实现\n}`,
      cpp: `TreeNode* invertTree(TreeNode* root) {\n    // 请实现\n}`,
      java: `TreeNode invertTree(TreeNode root) {\n    // 请实现\n}`,
      python: `def invert_tree(root):\n    pass`
    },
    solutions: {
      c: `TreeNode* invertTree(TreeNode* root) {\n    if (!root) return NULL;\n    TreeNode* temp = root->left;\n    root->left = root->right;\n    root->right = temp;\n    invertTree(root->left);\n    invertTree(root->right);\n    return root;\n}`,
      cpp: `TreeNode* invertTree(TreeNode* root) {\n    if (!root) return nullptr;\n    swap(root->left, root->right);\n    invertTree(root->left);\n    invertTree(root->right);\n    return root;\n}`,
      java: `TreeNode invertTree(TreeNode root) {\n    if (root == null) return null;\n    TreeNode temp = root.left;\n    root.left = root.right;\n    root.right = temp;\n    invertTree(root.left);\n    invertTree(root.right);\n    return root;\n}`,
      python: `def invert_tree(root):\n    if not root: return None\n    root.left, root.right = root.right, root.left\n    invert_tree(root.left)\n    invert_tree(root.right)\n    return root`
    },
    testCases: [{ input: '7\n4 2 7 1 3 6 9', expectedOutput: '4 7 2 9 6 3 1', description: '翻转' }],
    hints: ['递归交换每个节点的左右子树', '先交换再递归，或先递归再交换'],
    explanation: '翻转=交换左右子树，递归处理所有节点',
    commonMistakes: ['交换后未更新递归调用的参数(如果先递归)', '只交换了值未交换节点结构']
  },
  {
    id: 'tree-symmetric', category: '二叉树', title: '对称二叉树', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
给定一个二叉树的根节点root，检查它是否轴对称。
轴对称即左子树和右子树互为镜像。

【输入格式】
第一行：整数n，表示节点数
第二行：层序遍历序列，-1表示null

【输出格式】
输出 true 或 false

【数据范围】
- 1 ≤ n ≤ 1000`,
    templates: {
      c: `int isSymmetric(TreeNode* root) {\n    // 请实现\n}`,
      cpp: `bool isSymmetric(TreeNode* root) {\n    // 请实现\n}`,
      java: `boolean isSymmetric(TreeNode root) {\n    // 请实现\n}`,
      python: `def is_symmetric(root):\n    pass`
    },
    solutions: {
      c: `int check(TreeNode* l, TreeNode* r) {\n    if (!l && !r) return 1;\n    if (!l || !r) return 0;\n    return l->val == r->val && check(l->left, r->right) && check(l->right, r->left);\n}\nint isSymmetric(TreeNode* root) {\n    return check(root, root);\n}`,
      cpp: `bool check(TreeNode* l, TreeNode* r) {\n    if (!l && !r) return true;\n    if (!l || !r) return false;\n    return l->val == r->val && check(l->left, r->right) && check(l->right, r->left);\n}\nbool isSymmetric(TreeNode* root) {\n    return check(root, root);\n}`,
      java: `boolean check(TreeNode l, TreeNode r) {\n    if (l == null && r == null) return true;\n    if (l == null || r == null) return false;\n    return l.val == r.val && check(l.left, r.right) && check(l.right, r.left);\n}\nboolean isSymmetric(TreeNode root) {\n    return check(root, root);\n}`,
      python: `def is_symmetric(root):\n    def check(l, r):\n        if not l and not r: return True\n        if not l or not r: return False\n        return l.val == r.val and check(l.left, r.right) and check(l.right, r.left)\n    return check(root, root)`
    },
    testCases: [{ input: '7\n1 2 2 3 4 4 3', expectedOutput: 'true', description: '对称' }],
    hints: ['比较左子树和右子树是否镜像', '左的左=右的右，左的右=右的左'],
    explanation: '对称判断：左子树的左=右子树的右，左子树的右=右子树的左',
    commonMistakes: ['比较条件写错(应为l.left==r.right && l.right==r.left)', '空节点判断不全']
  },
  {
    id: 'tree-lca', category: '二叉树', title: '最近公共祖先', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给定一个二叉树，找到该树中两个指定节点的最近公共祖先(LCA)。
最近公共祖先的定义：对于树中的两个节点p和q，最近公共祖先表示为一个节点x，
满足x是p、q的祖先且x的深度尽可能大（一个节点也可以是它自己的祖先）。

【输入格式】
第一行：整数n，表示节点数
第二行：层序遍历序列
第三行：节点p的值
第四行：节点q的值

【输出格式】
输出LCA节点的值

【数据范围】
- 2 ≤ n ≤ 10^5
- p ≠ q
- p和q均存在于树中`,
    templates: {
      c: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n    // 请实现\n}`,
      cpp: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n    // 请实现\n}`,
      java: `TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n    // 请实现\n}`,
      python: `def lowest_common_ancestor(root, p, q):\n    pass`
    },
    solutions: {
      c: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n    if (!root || root == p || root == q) return root;\n    TreeNode* left = lowestCommonAncestor(root->left, p, q);\n    TreeNode* right = lowestCommonAncestor(root->right, p, q);\n    if (left && right) return root;\n    return left ? left : right;\n}`,
      cpp: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n    if (!root || root == p || root == q) return root;\n    TreeNode* left = lowestCommonAncestor(root->left, p, q);\n    TreeNode* right = lowestCommonAncestor(root->right, p, q);\n    if (left && right) return root;  // p和q分别在左右子树\n    return left ? left : right;      // 都在一边\n}`,
      java: `TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n    if (root == null || root == p || root == q) return root;\n    TreeNode left = lowestCommonAncestor(root.left, p, q);\n    TreeNode right = lowestCommonAncestor(root.right, p, q);\n    if (left != null && right != null) return root;\n    return left != null ? left : right;\n}`,
      python: `def lowest_common_ancestor(root, p, q):\n    if not root or root == p or root == q:\n        return root\n    left = lowest_common_ancestor(root.left, p, q)\n    right = lowest_common_ancestor(root.right, p, q)\n    if left and right: return root\n    return left if left else right`
    },
    testCases: [{ input: '7\n3 5 1 6 2 0 8\n5\n1', expectedOutput: '3', description: 'LCA' }],
    hints: ['递归查找', '如果p和q分别在左右子树，当前节点就是LCA'],
    explanation: '后序遍历：左右子树都找到时，当前节点就是LCA',
    commonMistakes: ['未处理当前节点就是p或q的情况', '递归返回值逻辑错误']
  },
];

// ==================== 图 ====================
export const graphExercises: Exercise[] = [
  {
    id: 'graph-bfs', category: '图', title: 'BFS广度优先', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给定一个无向图，从指定起点开始进行广度优先遍历（BFS）。

【输入格式】
第一行：两个整数n和m，表示顶点数和边数
接下来m行：每行两个整数u v，表示一条边
最后一行：起点编号

【输出格式】
输出BFS遍历序列，空格分隔

【数据范围】
- 1 ≤ n ≤ 1000
- 0 ≤ m ≤ n(n-1)/2`,
    templates: {
      c: `void bfs(int** adj, int* adjSize, int start, int n) {\n    // 请实现BFS\n}`,
      cpp: `void bfs(vector<int> adj[], int start, int n) {\n    // 请实现BFS\n}`,
      java: `void bfs(List<Integer>[] adj, int start, int n) {\n    // 请实现BFS\n}`,
      python: `def bfs(adj, start, n):\n    pass`
    },
    solutions: {
      c: `void bfs(int** adj, int* adjSize, int start, int n) {\n    int* vis = (int*)calloc(n, sizeof(int));\n    int queue[n], front = 0, rear = 0;\n    queue[rear++] = start; vis[start] = 1;\n    while (front < rear) {\n        int u = queue[front++];\n        printf("%d ", u);\n        for (int i = 0; i < adjSize[u]; i++) {\n            int v = adj[u][i];\n            if (!vis[v]) { vis[v] = 1; queue[rear++] = v; }\n        }\n    }\n    free(vis);\n}`,
      cpp: `void bfs(vector<int> adj[], int start, int n) {\n    vector<bool> vis(n, false);\n    queue<int> q;\n    q.push(start); vis[start] = true;\n    while (!q.empty()) {\n        int u = q.front(); q.pop();\n        cout << u << " ";\n        for (int v : adj[u]) {\n            if (!vis[v]) { vis[v] = true; q.push(v); }\n        }\n    }\n}`,
      java: `void bfs(List<Integer>[] adj, int start, int n) {\n    boolean[] vis = new boolean[n];\n    Queue<Integer> q = new LinkedList<>();\n    q.offer(start); vis[start] = true;\n    while (!q.isEmpty()) {\n        int u = q.poll();\n        System.out.print(u + " ");\n        for (int v : adj[u]) {\n            if (!vis[v]) { vis[v] = true; q.offer(v); }\n        }\n    }\n}`,
      python: `def bfs(adj, start, n):\n    from collections import deque\n    vis = [False] * n\n    q = deque([start])\n    vis[start] = True\n    res = []\n    while q:\n        u = q.popleft()\n        res.append(u)\n        for v in adj[u]:\n            if not vis[v]:\n                vis[v] = True\n                q.append(v)\n    return res`
    },
    testCases: [{ input: '4 3\n0 1\n0 2\n1 3\n0', expectedOutput: '0 1 2 3', description: 'BFS' }],
    hints: ['使用队列', '入队时标记已访问'],
    explanation: `【BFS核心思想】像水波扩散一样，一层一层向外探索
【数据结构】使用队列(Queue)，先进先出保证按层访问
【关键点】入队时就标记visited，避免重复入队
【时间复杂度】O(V+E)，V是顶点数，E是边数
【应用场景】最短路径（无权图）、层序遍历、连通性判断`,
    commonMistakes: ['出队时才标记visited(会导致节点重复入队)', '未使用队列而用了栈(变成了DFS)']
  },
  {
    id: 'graph-dfs', category: '图', title: 'DFS深度优先', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给定一个无向图，从指定起点开始进行深度优先遍历（DFS）。

【输入格式】
第一行：两个整数n和m，表示顶点数和边数
接下来m行：每行两个整数u v，表示一条边
最后一行：起点编号

【输出格式】
输出DFS遍历序列，空格分隔

【数据范围】
- 1 ≤ n ≤ 1000
- 0 ≤ m ≤ n(n-1)/2`,
    templates: {
      c: `void dfs(int** adj, int* adjSize, int start, int n) {\n    // 请实现DFS\n}`,
      cpp: `void dfs(vector<int> adj[], int start, int n) {\n    // 请实现DFS\n}`,
      java: `void dfs(List<Integer>[] adj, int start, int n) {\n    // 请实现DFS\n}`,
      python: `def dfs(adj, start, n):\n    pass`
    },
    solutions: {
      c: `int* vis;\nvoid dfsUtil(int** adj, int* adjSize, int u) {\n    vis[u] = 1;\n    printf("%d ", u);\n    for (int i = 0; i < adjSize[u]; i++) {\n        int v = adj[u][i];\n        if (!vis[v]) dfsUtil(adj, adjSize, v);\n    }\n}\nvoid dfs(int** adj, int* adjSize, int start, int n) {\n    vis = (int*)calloc(n, sizeof(int));\n    dfsUtil(adj, adjSize, start);\n    free(vis);\n}`,
      cpp: `vector<bool> vis;\nvoid dfsUtil(vector<int> adj[], int u) {\n    vis[u] = true;\n    cout << u << " ";\n    for (int v : adj[u])\n        if (!vis[v]) dfsUtil(adj, v);\n}\nvoid dfs(vector<int> adj[], int start, int n) {\n    vis.assign(n, false);\n    dfsUtil(adj, start);\n}`,
      java: `boolean[] vis;\nvoid dfsUtil(List<Integer>[] adj, int u) {\n    vis[u] = true;\n    System.out.print(u + " ");\n    for (int v : adj[u])\n        if (!vis[v]) dfsUtil(adj, v);\n}\nvoid dfs(List<Integer>[] adj, int start, int n) {\n    vis = new boolean[n];\n    dfsUtil(adj, start);\n}`,
      python: `def dfs(adj, start, n):\n    vis = [False] * n\n    res = []\n    def dfsUtil(u):\n        vis[u] = True\n        res.append(u)\n        for v in adj[u]:\n            if not vis[v]: dfsUtil(v)\n    dfsUtil(start)\n    return res`
    },
    testCases: [{ input: '4 3\n0 1\n0 2\n1 3\n0', expectedOutput: '0 1 3 2', description: 'DFS' }],
    hints: ['使用递归或栈'],
    explanation: `【DFS核心思想】像走迷宫一样，沿一条路走到底，走不通再回头
【实现方式】递归(系统栈)或显式栈
【关键点】访问节点后立即标记，递归处理所有未访问邻居
【时间复杂度】O(V+E)
【应用场景】拓扑排序、连通分量、判断环、路径查找`,
    commonMistakes: ['递归没有基准条件(虽然DFS通常隐式包含)', '忘记标记visited导致死循环']
  },
  {
    id: 'graph-bfs-blank', category: '图', title: 'BFS遍历填空', difficulty: 'medium', type: 'fillblank',
    description: '完成图的BFS遍历核心代码',
    codeTemplate: {
      cpp: `void bfs(vector<int> adj[], int start, int n) {
    vector<bool> visited(n, false);
    queue<int> q;
    ___BLANK1___;  // 起点入队
    ___BLANK2___;  // 标记起点已访问
    
    while (!q.empty()) {
        int u = ___BLANK3___;  // 取出队首
        cout << u << " ";
        
        for (int v : adj[u]) {
            if (___BLANK4___) {  // 未访问的邻居
                visited[v] = true;
                q.push(v);
            }
        }
    }
}`,
      java: `同上`,
      python: `def bfs(adj, start, n):
    visited = [False] * n
    q = deque()
    ___BLANK1___
    ___BLANK2___
    while q:
        u = ___BLANK3___
        for v in adj[u]:
            if ___BLANK4___:
                visited[v] = True
                q.append(v)`
    },
    blanks: [
      { id: 'BLANK1', answer: 'q.push(start)', hint: '起点入队' },
      { id: 'BLANK2', answer: 'visited[start] = true', hint: '入队时就标记' },
      { id: 'BLANK3', answer: 'q.front(); q.pop()', hint: '取出并移除队首' },
      { id: 'BLANK4', answer: '!visited[v]', hint: '只处理未访问节点' }
    ],
    explanation: 'BFS：用队列保证层序访问，入队时标记防止重复！'
  },
  {
    id: 'graph-dfs-blank', category: '图', title: 'DFS遍历填空', difficulty: 'medium', type: 'fillblank',
    description: '完成图的DFS递归遍历',
    codeTemplate: {
      cpp: `vector<bool> visited;

void dfs(vector<int> adj[], int u) {
    ___BLANK1___;  // 标记当前节点
    cout << u << " ";
    
    for (int v : adj[u]) {
        if (___BLANK2___) {  // 递归条件
            ___BLANK3___;    // 递归调用
        }
    }
}

void dfsMain(vector<int> adj[], int start, int n) {
    visited.assign(n, ___BLANK4___);
    dfs(adj, start);
}`,
      java: `同上`,
      python: `def dfs(adj, u, visited):
    ___BLANK1___
    for v in adj[u]:
        if ___BLANK2___:
            ___BLANK3___`
    },
    blanks: [
      { id: 'BLANK1', answer: 'visited[u] = true', hint: '标记当前节点已访问' },
      { id: 'BLANK2', answer: '!visited[v]', hint: '邻居未被访问' },
      { id: 'BLANK3', answer: 'dfs(adj, v)', hint: '递归处理邻居' },
      { id: 'BLANK4', answer: 'false', hint: '初始都未访问' }
    ],
    explanation: 'DFS：先标记再递归，访问一个走到底再回溯！'
  },
  {
    id: 'graph-topo-blank', category: '图', title: '拓扑排序填空', difficulty: 'medium', type: 'fillblank',
    description: '完成Kahn算法拓扑排序',
    codeTemplate: {
      cpp: `vector<int> topoSort(int n, vector<vector<int>>& adj) {
    vector<int> indegree(n, 0);
    // 计算入度
    for (int u = 0; u < n; u++)
        for (int v : adj[u])
            ___BLANK1___;  // 更新入度
    
    queue<int> q;
    // 入度为0的点入队
    for (int i = 0; i < n; i++)
        if (___BLANK2___) q.push(i);
    
    vector<int> result;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        result.push_back(u);
        for (int v : adj[u]) {
            ___BLANK3___;  // 更新邻居入度
            if (___BLANK4___) q.push(v);
        }
    }
    return result;
}`,
      java: `同上`,
      python: `def topo_sort(n, adj):
    indegree = [0] * n
    for u in range(n):
        for v in adj[u]:
            ___BLANK1___
    q = [i for i in range(n) if ___BLANK2___]
    result = []
    while q:
        u = q.pop(0)
        result.append(u)
        for v in adj[u]:
            ___BLANK3___
            if ___BLANK4___: q.append(v)`
    },
    blanks: [
      { id: 'BLANK1', answer: 'indegree[v]++', hint: '边u→v使v的入度+1' },
      { id: 'BLANK2', answer: 'indegree[i] == 0', hint: '入度为0可以先输出' },
      { id: 'BLANK3', answer: 'indegree[v]--', hint: '删掉u后v的入度-1' },
      { id: 'BLANK4', answer: 'indegree[v] == 0', hint: '入度变0就能入队' }
    ],
    explanation: '拓扑排序：入度为0的先出，删除后更新邻居入度，重复！'
  },
  {
    id: 'graph-dijkstra', category: '图', title: 'Dijkstra最短路径', difficulty: 'hard', type: 'coding',
    description: `【题目描述】
给定一个有向图，每条边有非负权值。求从源点到所有其他顶点的最短路径。

【输入格式】
第一行：三个整数n、m、src，表示顶点数、边数和源点
接下来m行：每行三个整数u v w，表示一条从u到v权值为w的有向边

【输出格式】
输出n个整数，表示从源点到各顶点的最短距离，不可达输出-1

【数据范围】
- 1 ≤ n ≤ 10^5
- 0 ≤ m ≤ n(n-1)
- 0 ≤ w ≤ 10^6
- 边权保证非负`,
    templates: {
      c: `int* dijkstra(int** adj, int** weight, int* adjSize, int src, int n) {\n    // 返回从src到所有点的最短距离\n}`,
      cpp: `vector<int> dijkstra(vector<vector<pair<int,int>>>& adj, int src) {\n    // 返回从 src到所有点的最短距离\n}`,
      java: `int[] dijkstra(List<int[]>[] adj, int src, int n) {\n    // 返回从src到所有点的最短距离\n}`,
      python: `def dijkstra(adj, src, n):\n    pass`
    },
    solutions: {
      c: `int* dijkstra(int** adj, int** weight, int* adjSize, int src, int n) {\n    int* dist = (int*)malloc(n * sizeof(int));\n    int* vis = (int*)calloc(n, sizeof(int));\n    for (int i = 0; i < n; i++) dist[i] = INT_MAX;\n    dist[src] = 0;\n    for (int cnt = 0; cnt < n; cnt++) {\n        int u = -1, minD = INT_MAX;\n        for (int i = 0; i < n; i++)\n            if (!vis[i] && dist[i] < minD) { minD = dist[i]; u = i; }\n        if (u == -1) break;\n        vis[u] = 1;\n        for (int i = 0; i < adjSize[u]; i++) {\n            int v = adj[u][i], w = weight[u][i];\n            if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;\n        }\n    }\n    free(vis);\n    return dist;\n}`,
      cpp: `vector<int> dijkstra(vector<vector<pair<int,int>>>& adj, int src) {\n    int n = adj.size();\n    vector<int> dist(n, INT_MAX);\n    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;\n    dist[src] = 0;\n    pq.push({0, src});\n    while (!pq.empty()) {\n        auto [d, u] = pq.top(); pq.pop();\n        if (d > dist[u]) continue;\n        for (auto [v, w] : adj[u]) {\n            if (dist[u] + w < dist[v]) {\n                dist[v] = dist[u] + w;\n                pq.push({dist[v], v});\n            }\n        }\n    }\n    return dist;\n}`,
      java: `int[] dijkstra(List<int[]>[] adj, int src, int n) {\n    int[] dist = new int[n];\n    Arrays.fill(dist, Integer.MAX_VALUE);\n    dist[src] = 0;\n    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]);\n    pq.offer(new int[]{0, src});\n    while (!pq.isEmpty()) {\n        int[] cur = pq.poll();\n        int d = cur[0], u = cur[1];\n        if (d > dist[u]) continue;\n        for (int[] e : adj[u]) {\n            int v = e[0], w = e[1];\n            if (dist[u] + w < dist[v]) {\n                dist[v] = dist[u] + w;\n                pq.offer(new int[]{dist[v], v});\n            }\n        }\n    }\n    return dist;\n}`,
      python: `def dijkstra(adj, src, n):\n    import heapq\n    dist = [float('inf')] * n\n    dist[src] = 0\n    pq = [(0, src)]\n    while pq:\n        d, u = heapq.heappop(pq)\n        if d > dist[u]: continue\n        for v, w in adj[u]:\n            if dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n                heapq.heappush(pq, (dist[v], v))\n    return dist`
    },
    testCases: [{ input: '3 3\n0 1 4\n0 2 1\n2 1 2\n0', expectedOutput: '0 3 1', description: '最短路' }],
    hints: ['使用优先队列(小顶堆)', '贪心：每次取距离最小的点', '松弛操作：dist[v] = min(dist[v], dist[u]+w)'],
    explanation: `【Dijkstra算法】解决单源最短路径（边权非负）
【核心思想】贪心 + 松弛
【限制】不能处理负权边，负权用Bellman-Ford`,
    commonMistakes: ['用于带负权边的图', '未使用优先队列导致复杂度退化为O(V²)', '出队后未检查是否已处理(d > dist[u])']
  },
  {
    id: 'graph-topo', category: '图', title: '拓扑排序', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给定一个有向无环图(DAG)，输出其拓扑排序结果。
拓扑排序是对有向无环图的顶点的一种线性排序，使得对于每条有向边(u,v)，u都在v之前。

【输入格式】
第一行：两个整数n和m，表示顶点数和边数
接下来m行：每行两个整数u v，表示一条从u到v的有向边

【输出格式】
输出拓扑排序结果，空格分隔（可能有多个有效解）

【数据范围】
- 1 ≤ n ≤ 1000
- 0 ≤ m ≤ n(n-1)/2
- 图保证是有向无环图`,
    templates: {
      c: `int* topoSort(int n, int** adj, int* adjSize, int* returnSize) {\n    // 返回拓扑序列\n}`,
      cpp: `vector<int> topoSort(int n, vector<vector<int>>& adj) {\n    // 返回拓扑序列\n}`,
      java: `int[] topoSort(int n, List<Integer>[] adj) {\n    // 返回拓扑序列\n}`,
      python: `def topo_sort(n, adj):\n    pass`
    },
    solutions: {
      c: `int* topoSort(int n, int** adj, int* adjSize, int* returnSize) {\n    int* indeg = (int*)calloc(n, sizeof(int));\n    for (int u = 0; u < n; u++)\n        for (int i = 0; i < adjSize[u]; i++) indeg[adj[u][i]]++;\n    int queue[n], front = 0, rear = 0;\n    for (int i = 0; i < n; i++)\n        if (indeg[i] == 0) queue[rear++] = i;\n    int* res = (int*)malloc(n * sizeof(int));\n    *returnSize = 0;\n    while (front < rear) {\n        int u = queue[front++];\n        res[(*returnSize)++] = u;\n        for (int i = 0; i < adjSize[u]; i++) {\n            int v = adj[u][i];\n            if (--indeg[v] == 0) queue[rear++] = v;\n        }\n    }\n    free(indeg);\n    return res;\n}`,
      cpp: `vector<int> topoSort(int n, vector<vector<int>>& adj) {\n    vector<int> indeg(n, 0);\n    for (int u = 0; u < n; u++)\n        for (int v : adj[u]) indeg[v]++;\n    queue<int> q;\n    for (int i = 0; i < n; i++)\n        if (indeg[i] == 0) q.push(i);\n    vector<int> res;\n    while (!q.empty()) {\n        int u = q.front(); q.pop();\n        res.push_back(u);\n        for (int v : adj[u])\n            if (--indeg[v] == 0) q.push(v);\n    }\n    return res.size() == n ? res : vector<int>();\n}`,
      java: `int[] topoSort(int n, List<Integer>[] adj) {\n    int[] indeg = new int[n];\n    for (int u = 0; u < n; u++)\n        for (int v : adj[u]) indeg[v]++;\n    Queue<Integer> q = new LinkedList<>();\n    for (int i = 0; i < n; i++)\n        if (indeg[i] == 0) q.offer(i);\n    int[] res = new int[n];\n    int idx = 0;\n    while (!q.isEmpty()) {\n        int u = q.poll();\n        res[idx++] = u;\n        for (int v : adj[u])\n            if (--indeg[v] == 0) q.offer(v);\n    }\n    return idx == n ? res : new int[0];\n}`,
      python: `def topo_sort(n, adj):\n    from collections import deque\n    indeg = [0] * n\n    for u in range(n):\n        for v in adj[u]: indeg[v] += 1\n    q = deque([i for i in range(n) if indeg[i] == 0])\n    res = []\n    while q:\n        u = q.popleft()\n        res.append(u)\n        for v in adj[u]:\n            indeg[v] -= 1\n            if indeg[v] == 0: q.append(v)\n    return res if len(res) == n else []`
    },
    testCases: [{ input: '0→1, 0→2, 1→3, 2→3', expectedOutput: '[0,1,2,3]或[0,2,1,3]', description: '拓扑排序' }],
    hints: ['计算所有节点的入度', '入度为0的点先输出', '删除该点后更新邻居入度'],
    explanation: `【拓扑排序】对有向无环图(DAG)的顶点排序，使所有边从前指向后
【Kahn算法(BFS)】
1. 计算所有点的入度
2. 入度为0的点入队
3. 取出队首，加入结果，将其邻居入度-1
4. 入度变0的点入队，重复直到队空

【应用场景】课程安排、任务调度、编译依赖
【判断有环】如果结果长度≠n，说明有环`
  },
];

// ==================== 排序 ====================
export const sortExercises: Exercise[] = [
  {
    id: 'sort-bubble', category: '排序', title: '冒泡排序', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
实现冒泡排序算法，将给定的整数数组按升序排列。

【输入格式】
第一行：整数 n，表示数组长度 (1 ≤ n ≤ 1000)
第二行：n 个整数，表示数组元素，空格分隔

【输出格式】
输出一行，n 个整数，表示排序后的数组，空格分隔

【数据范围】
- 1 ≤ n ≤ 1000
- -10^6 ≤ arr[i] ≤ 10^6

【算法说明】
冒泡排序：每次比较相邻元素，如果逆序则交换。每轮将最大元素"冒泡"到末尾。`,
    templates: {
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[1005];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    \n    // TODO: 实现冒泡排序\n    \n    for (int i = 0; i < n; i++) {\n        if (i > 0) printf(" ");\n        printf("%d", arr[i]);\n    }\n    printf("\\n");\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    \n    // TODO: 实现冒泡排序\n    \n    for (int i = 0; i < n; i++) {\n        if (i > 0) cout << " ";\n        cout << arr[i];\n    }\n    cout << endl;\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        \n        // TODO: 实现冒泡排序\n        \n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < n; i++) {\n            if (i > 0) sb.append(" ");\n            sb.append(arr[i]);\n        }\n        System.out.println(sb);\n        sc.close();\n    }\n}`,
      python: `n = int(input())\narr = list(map(int, input().split()))\n\n# TODO: 实现冒泡排序\n\nprint(' '.join(map(str, arr)))`
    },
    solutions: {
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[1005];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    \n    // 冒泡排序\n    for (int i = 0; i < n - 1; i++) {\n        for (int j = 0; j < n - 1 - i; j++) {\n            if (arr[j] > arr[j + 1]) {\n                int temp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = temp;\n            }\n        }\n    }\n    \n    for (int i = 0; i < n; i++) {\n        if (i > 0) printf(" ");\n        printf("%d", arr[i]);\n    }\n    printf("\\n");\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    \n    // 冒泡排序\n    for (int i = 0; i < n - 1; i++) {\n        for (int j = 0; j < n - 1 - i; j++) {\n            if (arr[j] > arr[j + 1]) {\n                swap(arr[j], arr[j + 1]);\n            }\n        }\n    }\n    \n    for (int i = 0; i < n; i++) {\n        if (i > 0) cout << " ";\n        cout << arr[i];\n    }\n    cout << endl;\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        \n        // 冒泡排序\n        for (int i = 0; i < n - 1; i++) {\n            for (int j = 0; j < n - 1 - i; j++) {\n                if (arr[j] > arr[j + 1]) {\n                    int temp = arr[j];\n                    arr[j] = arr[j + 1];\n                    arr[j + 1] = temp;\n                }\n            }\n        }\n        \n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < n; i++) {\n            if (i > 0) sb.append(" ");\n            sb.append(arr[i]);\n        }\n        System.out.println(sb);\n        sc.close();\n    }\n}`,
      python: `n = int(input())\narr = list(map(int, input().split()))\n\n# 冒泡排序\nfor i in range(n - 1):\n    for j in range(n - 1 - i):\n        if arr[j] > arr[j + 1]:\n            arr[j], arr[j + 1] = arr[j + 1], arr[j]\n\nprint(' '.join(map(str, arr)))`
    },
    testCases: [
      { input: '5\n5 3 8 4 2', expectedOutput: '2 3 4 5 8', description: '基本测试' },
      { input: '3\n1 2 3', expectedOutput: '1 2 3', description: '已排序' },
      { input: '4\n4 3 2 1', expectedOutput: '1 2 3 4', description: '逆序' }
    ],
    hints: ['外层循环n-1轮', '内层循环n-1-i次（后面已排好）', '相邻元素逆序则交换'],
    explanation: `【冒泡排序算法】

原理：每轮遍历相邻元素，逆序则交换，将最大元素"冒泡"到末尾。

【时间复杂度】O(n²)
【空间复杂度】O(1)
【稳定性】稳定排序`
  },
  {
    id: 'sort-bubble-blank', category: '排序', title: '冒泡排序填空', difficulty: 'easy', type: 'fillblank',
    description: '完成冒泡排序的核心代码',
    codeTemplate: {
      cpp: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < ___BLANK1___; i++) {
        for (int j = 0; j < ___BLANK2___; j++) {
            if (___BLANK3___) {
                swap(arr[j], arr[j+1]);
            }
        }
    }
}`,
      java: `同上`,
      python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(___BLANK1___):
        for j in range(___BLANK2___):
            if ___BLANK3___:
                arr[j], arr[j+1] = arr[j+1], arr[j]`
    },
    blanks: [
      { id: 'BLANK1', answer: 'n-1', hint: '外层循环n-1轮' },
      { id: 'BLANK2', answer: 'n-1-i', hint: '内层每轮减少比较次数' },
      { id: 'BLANK3', answer: 'arr[j] > arr[j+1]', hint: '相邻元素比较' }
    ],
    explanation: '冒泡：外层n-1轮，内层n-1-i次（后面已排好）。每轮把最大的"冒"到后面！'
  },
  {
    id: 'sort-quick-partition-blank', category: '排序', title: '快排分区填空', difficulty: 'medium', type: 'fillblank',
    description: '完成快速排序分区函数',
    codeTemplate: {
      cpp: `int partition(int arr[], int l, int r) {
    int pivot = ___BLANK1___;  // 选择基准
    int i = l - 1;  // 小于pivot区域的右边界
    for (int j = l; j < r; j++) {
        if (___BLANK2___) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[___BLANK3___], arr[r]);  // 把pivot放到正确位置
    return ___BLANK4___;  // 返回pivot的位置
}`,
      java: `同上`,
      python: `def partition(arr, l, r):
    pivot = ___BLANK1___
    i = l - 1
    for j in range(l, r):
        if ___BLANK2___:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[___BLANK3___], arr[r] = arr[r], arr[___BLANK3___]
    return ___BLANK4___`
    },
    blanks: [
      { id: 'BLANK1', answer: 'arr[r]', hint: '选最右边的元素作为基准' },
      { id: 'BLANK2', answer: 'arr[j] < pivot', hint: '小于基准的放左边' },
      { id: 'BLANK3', answer: 'i+1', hint: 'pivot的最终位置' },
      { id: 'BLANK4', answer: 'i+1', hint: '返回分区点' }
    ],
    explanation: '分区：把小于pivot的放左边，大于的放右边，最后把pivot放中间！'
  },
  {
    id: 'sort-merge-blank', category: '排序', title: '归并排序合并填空', difficulty: 'medium', type: 'fillblank',
    description: '完成归并排序的合并函数',
    codeTemplate: {
      cpp: `void merge(int arr[], int l, int m, int r, int temp[]) {
    int i = l, j = ___BLANK1___, k = l;
    // 比较两个子数组的元素
    while (i <= m && j <= r) {
        if (___BLANK2___) {
            temp[k++] = arr[i++];
        } else {
            temp[k++] = arr[j++];
        }
    }
    // 复制剩余元素
    while (___BLANK3___) temp[k++] = arr[i++];
    while (___BLANK4___) temp[k++] = arr[j++];
    // 拷贝回原数组
    for (i = l; i <= r; i++) arr[i] = temp[i];
}`,
      java: `同上`,
      python: `def merge(arr, l, m, r):
    left = arr[l:m+1]
    right = arr[m+1:r+1]
    i = j = 0
    k = l
    while i < len(left) and j < len(right):
        if ___BLANK2___:
            arr[k] = left[i]; i += 1
        else:
            arr[k] = right[j]; j += 1
        k += 1`
    },
    blanks: [
      { id: 'BLANK1', answer: 'm+1', hint: '右半部分起始位置' },
      { id: 'BLANK2', answer: 'arr[i] <= arr[j]', hint: '取较小的元素（稳定排序用<=）' },
      { id: 'BLANK3', answer: 'i <= m', hint: '左半部分还有剩余' },
      { id: 'BLANK4', answer: 'j <= r', hint: '右半部分还有剩余' }
    ],
    explanation: '归并核心：双指针比较两个有序数组，取较小的放入temp，最后拷贝回去！'
  },
  {
    id: 'sort-quick', category: '排序', title: '快速排序', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
实现快速排序算法，将给定的整数数组按升序排列。

【输入格式】
第一行：整数n，表示数组长度 (1 ≤ n ≤ 10^5)
第二行：n个整数

【输出格式】
输出排序后的数组，空格分隔

【数据范围】
- 1 ≤ n ≤ 10^5
- -10^6 ≤ arr[i] ≤ 10^6`,
    templates: {
      c: `void quickSort(int arr[], int l, int r) {\n    // 请实现快速排序\n}`,
      cpp: `void quickSort(int arr[], int l, int r) {\n    // 请实现快速排序\n}`,
      java: `void quickSort(int[] arr, int l, int r) {\n    // 请实现快速排序\n}`,
      python: `def quick_sort(arr, l, r):\n    pass`
    },
    solutions: {
      c: `int partition(int arr[], int l, int r) {\n    int pivot = arr[r], i = l-1;\n    for (int j = l; j < r; j++)\n        if (arr[j] < pivot) { i++; int t=arr[i];arr[i]=arr[j];arr[j]=t; }\n    int t=arr[i+1];arr[i+1]=arr[r];arr[r]=t;\n    return i+1;\n}\nvoid quickSort(int arr[], int l, int r) {\n    if (l < r) {\n        int p = partition(arr, l, r);\n        quickSort(arr, l, p-1);\n        quickSort(arr, p+1, r);\n    }\n}`,
      cpp: `int partition(int arr[], int l, int r) {\n    int pivot = arr[r], i = l-1;\n    for (int j = l; j < r; j++)\n        if (arr[j] < pivot) swap(arr[++i], arr[j]);\n    swap(arr[i+1], arr[r]);\n    return i+1;\n}\nvoid quickSort(int arr[], int l, int r) {\n    if (l < r) {\n        int p = partition(arr, l, r);\n        quickSort(arr, l, p-1);\n        quickSort(arr, p+1, r);\n    }\n}`,
      java: `int partition(int[] arr, int l, int r) {\n    int pivot = arr[r], i = l-1;\n    for (int j = l; j < r; j++)\n        if (arr[j] < pivot) { i++; int t=arr[i];arr[i]=arr[j];arr[j]=t; }\n    int t=arr[i+1];arr[i+1]=arr[r];arr[r]=t;\n    return i+1;\n}\nvoid quickSort(int[] arr, int l, int r) {\n    if (l < r) {\n        int p = partition(arr, l, r);\n        quickSort(arr, l, p-1);\n        quickSort(arr, p+1, r);\n    }\n}`,
      python: `def partition(arr, l, r):\n    pivot, i = arr[r], l-1\n    for j in range(l, r):\n        if arr[j] < pivot:\n            i += 1\n            arr[i], arr[j] = arr[j], arr[i]\n    arr[i+1], arr[r] = arr[r], arr[i+1]\n    return i+1\ndef quick_sort(arr, l, r):\n    if l < r:\n        p = partition(arr, l, r)\n        quick_sort(arr, l, p-1)\n        quick_sort(arr, p+1, r)`
    },
    testCases: [{ input: '5\n5 3 8 4 2', expectedOutput: '2 3 4 5 8', description: '排序' }],
    hints: ['选基准分区', '递归处理左右'], explanation: '快速排序O(nlogn)平均，不稳定'
  },
  {
    id: 'sort-merge', category: '排序', title: '归并排序', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
实现归并排序算法，将给定的整数数组按升序排列。

【输入格式】
第一行：整数n，表示数组长度 (1 ≤ n ≤ 10^5)
第二行：n个整数

【输出格式】
输出排序后的数组，空格分隔

【数据范围】
- 1 ≤ n ≤ 10^5
- -10^6 ≤ arr[i] ≤ 10^6`,
    templates: {
      c: `void mergeSort(int arr[], int l, int r) {\n    // 请实现归并排序\n}`,
      cpp: `void mergeSort(int arr[], int l, int r) {\n    // 请实现归并排序\n}`,
      java: `void mergeSort(int[] arr, int l, int r) {\n    // 请实现归并排序\n}`,
      python: `def merge_sort(arr):\n    pass`
    },
    solutions: {
      c: `int temp[100000];\nvoid merge(int arr[], int l, int m, int r) {\n    int i = l, j = m+1, k = l;\n    while (i <= m && j <= r)\n        temp[k++] = arr[i] <= arr[j] ? arr[i++] : arr[j++];\n    while (i <= m) temp[k++] = arr[i++];\n    while (j <= r) temp[k++] = arr[j++];\n    for (i = l; i <= r; i++) arr[i] = temp[i];\n}\nvoid mergeSort(int arr[], int l, int r) {\n    if (l < r) {\n        int m = l + (r-l)/2;\n        mergeSort(arr, l, m);\n        mergeSort(arr, m+1, r);\n        merge(arr, l, m, r);\n    }\n}`,
      cpp: `void merge(int arr[], int l, int m, int r) {\n    vector<int> L(arr+l, arr+m+1), R(arr+m+1, arr+r+1);\n    int i=0, j=0, k=l;\n    while (i < L.size() && j < R.size())\n        arr[k++] = L[i] <= R[j] ? L[i++] : R[j++];\n    while (i < L.size()) arr[k++] = L[i++];\n    while (j < R.size()) arr[k++] = R[j++];\n}\nvoid mergeSort(int arr[], int l, int r) {\n    if (l < r) {\n        int m = l + (r-l)/2;\n        mergeSort(arr, l, m);\n        mergeSort(arr, m+1, r);\n        merge(arr, l, m, r);\n    }\n}`,
      java: `void merge(int[] arr, int l, int m, int r) {\n    int[] L = Arrays.copyOfRange(arr, l, m+1);\n    int[] R = Arrays.copyOfRange(arr, m+1, r+1);\n    int i=0, j=0, k=l;\n    while (i < L.length && j < R.length)\n        arr[k++] = L[i] <= R[j] ? L[i++] : R[j++];\n    while (i < L.length) arr[k++] = L[i++];\n    while (j < R.length) arr[k++] = R[j++];\n}\nvoid mergeSort(int[] arr, int l, int r) {\n    if (l < r) {\n        int m = l + (r-l)/2;\n        mergeSort(arr, l, m);\n        mergeSort(arr, m+1, r);\n        merge(arr, l, m, r);\n    }\n}`,
      python: `def merge_sort(arr):\n    if len(arr) <= 1: return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i]); i += 1\n        else:\n            result.append(right[j]); j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result`
    },
    testCases: [{ input: '5\n5 3 8 4 2', expectedOutput: '2 3 4 5 8', description: '排序' }],
    hints: ['分治：先分后合', '合并两个有序数组'], explanation: '归并排序O(nlogn)，稳定，需要O(n)额外空间'
  },
  {
    id: 'sort-insert', category: '排序', title: '插入排序', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
实现插入排序算法，将给定的整数数组按升序排列。

【输入格式】
第一行：整数n，表示数组长度 (1 ≤ n ≤ 1000)
第二行：n个整数

【输出格式】
输出排序后的数组，空格分隔

【数据范围】
- 1 ≤ n ≤ 1000
- -10^6 ≤ arr[i] ≤ 10^6`,
    templates: {
      c: `void insertionSort(int arr[], int n) {\n    // 请实现插入排序\n}`,
      cpp: `void insertionSort(int arr[], int n) {\n    // 请实现插入排序\n}`,
      java: `void insertionSort(int[] arr) {\n    // 请实现插入排序\n}`,
      python: `def insertion_sort(arr):\n    pass`
    },
    solutions: {
      c: `void insertionSort(int arr[], int n) {\n    for (int i = 1; i < n; i++) {\n        int key = arr[i], j = i - 1;\n        while (j >= 0 && arr[j] > key) {\n            arr[j+1] = arr[j];\n            j--;\n        }\n        arr[j+1] = key;\n    }\n}`,
      cpp: `void insertionSort(int arr[], int n) {\n    for (int i = 1; i < n; i++) {\n        int key = arr[i], j = i - 1;\n        while (j >= 0 && arr[j] > key) {\n            arr[j+1] = arr[j];\n            j--;\n        }\n        arr[j+1] = key;\n    }\n}`,
      java: `void insertionSort(int[] arr) {\n    for (int i = 1; i < arr.length; i++) {\n        int key = arr[i], j = i - 1;\n        while (j >= 0 && arr[j] > key) {\n            arr[j+1] = arr[j];\n            j--;\n        }\n        arr[j+1] = key;\n    }\n}`,
      python: `def insertion_sort(arr):\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and arr[j] > key:\n            arr[j+1] = arr[j]\n            j -= 1\n        arr[j+1] = key\n    return arr`
    },
    testCases: [{ input: '5\n5 3 8 4 2', expectedOutput: '2 3 4 5 8', description: '排序' }],
    hints: ['像打牌一样，把新牌插入已排好的手牌中'], explanation: '插入排序O(n²)，稳定，适合小规模或基本有序的数据'
  },
  {
    id: 'sort-heap', category: '排序', title: '堆排序', difficulty: 'hard', type: 'coding',
    description: `【题目描述】
实现堆排序算法，将给定的整数数组按升序排列。

【输入格式】
第一行：整数n，表示数组长度 (1 ≤ n ≤ 10^5)
第二行：n个整数

【输出格式】
输出排序后的数组，空格分隔

【数据范围】
- 1 ≤ n ≤ 10^5
- -10^6 ≤ arr[i] ≤ 10^6`,
    templates: {
      c: `void heapSort(int arr[], int n) {\n    // 请实现堆排序\n}`,
      cpp: `void heapSort(int arr[], int n) {\n    // 请实现堆排序\n}`,
      java: `void heapSort(int[] arr) {\n    // 请实现堆排序\n}`,
      python: `def heap_sort(arr):\n    pass`
    },
    solutions: {
      c: `void heapify(int arr[], int n, int i) {\n    int largest = i, l = 2*i+1, r = 2*i+2;\n    if (l < n && arr[l] > arr[largest]) largest = l;\n    if (r < n && arr[r] > arr[largest]) largest = r;\n    if (largest != i) {\n        int t = arr[i]; arr[i] = arr[largest]; arr[largest] = t;\n        heapify(arr, n, largest);\n    }\n}\nvoid heapSort(int arr[], int n) {\n    for (int i = n/2-1; i >= 0; i--) heapify(arr, n, i);\n    for (int i = n-1; i > 0; i--) {\n        int t = arr[0]; arr[0] = arr[i]; arr[i] = t;\n        heapify(arr, i, 0);\n    }\n}`,
      cpp: `void heapify(int arr[], int n, int i) {\n    int largest = i, l = 2*i+1, r = 2*i+2;\n    if (l < n && arr[l] > arr[largest]) largest = l;\n    if (r < n && arr[r] > arr[largest]) largest = r;\n    if (largest != i) {\n        swap(arr[i], arr[largest]);\n        heapify(arr, n, largest);\n    }\n}\nvoid heapSort(int arr[], int n) {\n    for (int i = n/2-1; i >= 0; i--) heapify(arr, n, i);  // 建堆\n    for (int i = n-1; i > 0; i--) {\n        swap(arr[0], arr[i]);  // 堆顶移到末尾\n        heapify(arr, i, 0);    // 调整堆\n    }\n}`,
      java: `void heapify(int[] arr, int n, int i) {\n    int largest = i, l = 2*i+1, r = 2*i+2;\n    if (l < n && arr[l] > arr[largest]) largest = l;\n    if (r < n && arr[r] > arr[largest]) largest = r;\n    if (largest != i) {\n        int t = arr[i]; arr[i] = arr[largest]; arr[largest] = t;\n        heapify(arr, n, largest);\n    }\n}\nvoid heapSort(int[] arr) {\n    int n = arr.length;\n    for (int i = n/2-1; i >= 0; i--) heapify(arr, n, i);\n    for (int i = n-1; i > 0; i--) {\n        int t = arr[0]; arr[0] = arr[i]; arr[i] = t;\n        heapify(arr, i, 0);\n    }\n}`,
      python: `def heapify(arr, n, i):\n    largest, l, r = i, 2*i+1, 2*i+2\n    if l < n and arr[l] > arr[largest]: largest = l\n    if r < n and arr[r] > arr[largest]: largest = r\n    if largest != i:\n        arr[i], arr[largest] = arr[largest], arr[i]\n        heapify(arr, n, largest)\ndef heap_sort(arr):\n    n = len(arr)\n    for i in range(n//2-1, -1, -1): heapify(arr, n, i)\n    for i in range(n-1, 0, -1):\n        arr[0], arr[i] = arr[i], arr[0]\n        heapify(arr, i, 0)\n    return arr`
    },
    testCases: [{ input: '5\n5 3 8 4 2', expectedOutput: '2 3 4 5 8', description: '排序' }],
    hints: ['先建大顶堆', '每次取堆顶(最大)放末尾，再调整堆'], explanation: '堆排序O(nlogn)，不稳定，原地排序'
  },
];

// ==================== 查找 ====================
export const searchExercises: Exercise[] = [
  {
    id: 'search-binary', category: '查找', title: '二分查找', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
给定一个升序排列的整数数组和一个目标值，使用二分查找在数组中查找目标值。
如果目标值存在，返回其下标；否则返回 -1。

【输入格式】
第一行：两个整数 n 和 target，表示数组长度和目标值
第二行：n 个升序整数，表示数组元素，空格分隔

【输出格式】
输出一个整数，表示目标值的下标（从0开始），不存在则输出-1

【数据范围】
- 1 ≤ n ≤ 10^5
- -10^9 ≤ arr[i], target ≤ 10^9
- 数组元素各不相同且已升序排列`,
    templates: {
      c: `#include <stdio.h>\n\nint main() {\n    int n, target;\n    scanf("%d %d", &n, &target);\n    int arr[100005];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    \n    // TODO: 实现二分查找\n    \n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, target;\n    cin >> n >> target;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    \n    // TODO: 实现二分查找\n    \n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), target = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        \n        // TODO: 实现二分查找\n        \n        sc.close();\n    }\n}`,
      python: `n, target = map(int, input().split())\narr = list(map(int, input().split()))\n\n# TODO: 实现二分查找\n`
    },
    solutions: {
      c: `#include <stdio.h>\n\nint main() {\n    int n, target;\n    scanf("%d %d", &n, &target);\n    int arr[100005];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    \n    int left = 0, right = n - 1;\n    int result = -1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) {\n            result = mid;\n            break;\n        } else if (arr[mid] < target) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n    printf("%d\\n", result);\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, target;\n    cin >> n >> target;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    \n    int left = 0, right = n - 1;\n    int result = -1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) {\n            result = mid;\n            break;\n        } else if (arr[mid] < target) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n    cout << result << endl;\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), target = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        \n        int left = 0, right = n - 1;\n        int result = -1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (arr[mid] == target) {\n                result = mid;\n                break;\n            } else if (arr[mid] < target) {\n                left = mid + 1;\n            } else {\n                right = mid - 1;\n            }\n        }\n        System.out.println(result);\n        sc.close();\n    }\n}`,
      python: `n, target = map(int, input().split())\narr = list(map(int, input().split()))\n\nleft, right = 0, n - 1\nresult = -1\nwhile left <= right:\n    mid = left + (right - left) // 2\n    if arr[mid] == target:\n        result = mid\n        break\n    elif arr[mid] < target:\n        left = mid + 1\n    else:\n        right = mid - 1\nprint(result)`
    },
    testCases: [
      { input: '5 5\n1 3 5 7 9', expectedOutput: '2', description: '找到目标' },
      { input: '5 4\n1 3 5 7 9', expectedOutput: '-1', description: '未找到' },
      { input: '5 1\n1 3 5 7 9', expectedOutput: '0', description: '目标在开头' },
      { input: '5 9\n1 3 5 7 9', expectedOutput: '4', description: '目标在末尾' }
    ],
    hints: ['使用 left + (right - left) / 2 计算mid防止溢出', '循环条件是 left <= right', 'left = mid + 1 和 right = mid - 1 避免死循环'],
    explanation: `【二分查找算法】

核心思想：每次将搜索区间缩小一半。

步骤：
1. 初始化 left = 0, right = n - 1
2. 当 left <= right 时循环
3. 计算 mid = left + (right - left) / 2
4. 如果 arr[mid] == target，找到
5. 如果 arr[mid] < target，left = mid + 1
6. 如果 arr[mid] > target，right = mid - 1

【时间复杂度】O(log n)
【空间复杂度】O(1)`
  },
  // 填空题
  {
    id: 'search-binary-blank', category: '查找', title: '二分查找填空', difficulty: 'easy', type: 'fillblank',
    description: '完成二分查找的关键代码',
    codeTemplate: {
      cpp: `int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    while (___BLANK1___) {  // 循环条件
        int mid = ___BLANK2___;  // 计算中点（防溢出）
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) ___BLANK3___;
        else ___BLANK4___;
    }
    return -1;
}`,
      java: `同上`,
      python: `同上`
    },
    blanks: [
      { id: 'BLANK1', answer: 'left <= right', hint: '注意是小于等于' },
      { id: 'BLANK2', answer: 'left + (right - left) / 2', hint: '防止left+right溢出' },
      { id: 'BLANK3', answer: 'left = mid + 1', hint: '目标在右半边' },
      { id: 'BLANK4', answer: 'right = mid - 1', hint: '目标在左半边' }
    ],
    explanation: '二分查找易错点：1.循环条件是<=  2.mid防溢出  3.left/right要+1/-1避免死循环'
  },
  {
    id: 'search-first-last-blank', category: '查找', title: '查找边界填空', difficulty: 'medium', type: 'fillblank',
    description: '完成二分查找第一个和最后一个位置',
    codeTemplate: {
      cpp: `// 查找第一个等于target的位置
int findFirst(int arr[], int n, int target) {
    int l = 0, r = n - 1, res = -1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (arr[mid] >= target) {
            if (arr[mid] == target) res = mid;
            r = ___BLANK1___;  // 继续向左找
        } else {
            l = mid + 1;
        }
    }
    return res;
}
// 查找最后一个等于target的位置
int findLast(int arr[], int n, int target) {
    int l = 0, r = n - 1, res = -1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (arr[mid] <= target) {
            if (arr[mid] == target) res = mid;
            l = ___BLANK2___;  // 继续向右找
        } else {
            r = mid - 1;
        }
    }
    return res;
}`,
      java: `同上`,
      python: `# 查找边界的关键是找到后不停，继续往一个方向搜索`
    },
    blanks: [
      { id: 'BLANK1', answer: 'mid - 1', hint: '找第一个要往左缩小范围' },
      { id: 'BLANK2', answer: 'mid + 1', hint: '找最后一个要往右扩大范围' }
    ],
    explanation: '找第一个：找到后继续往左；找最后一个：找到后继续往右。记住方向！'
  },
  {
    id: 'search-first-pos', category: '查找', title: '查找第一个位置', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给定一个按升序排列的整数数组nums和一个目标值target，找出目标值在数组中第一次出现的位置。
如果目标值不存在于数组中，返回-1。

【输入格式】
第一行：两个整数n和target
第二行：n个整数，表示升序数组

【输出格式】
输出一个整数，表示target第一次出现的下标（从0开始），不存在输出-1

【数据范围】
- 0 ≤ n ≤ 10^5
- -10^9 ≤ nums[i], target ≤ 10^9
- 数组已按升序排列`,
    templates: {
      c: `int searchFirst(int arr[], int n, int target) {\n    // 请实现\n}`,
      cpp: `int searchFirst(int arr[], int n, int target) {\n    // 请实现\n}`,
      java: `int searchFirst(int[] arr, int target) {\n    // 请实现\n}`,
      python: `def search_first(arr, target):\n    pass`
    },
    solutions: {
      c: `int searchFirst(int arr[], int n, int target) {\n    int l = 0, r = n - 1, res = -1;\n    while (l <= r) {\n        int mid = l + (r - l) / 2;\n        if (arr[mid] >= target) {\n            if (arr[mid] == target) res = mid;\n            r = mid - 1;\n        } else {\n            l = mid + 1;\n        }\n    }\n    return res;\n}`,
      cpp: `int searchFirst(int arr[], int n, int target) {\n    int l = 0, r = n - 1, res = -1;\n    while (l <= r) {\n        int mid = l + (r - l) / 2;\n        if (arr[mid] >= target) {\n            if (arr[mid] == target) res = mid;\n            r = mid - 1;  // 继续往左找\n        } else {\n            l = mid + 1;\n        }\n    }\n    return res;\n}`,
      java: `int searchFirst(int[] arr, int target) {\n    int l = 0, r = arr.length - 1, res = -1;\n    while (l <= r) {\n        int mid = l + (r - l) / 2;\n        if (arr[mid] >= target) {\n            if (arr[mid] == target) res = mid;\n            r = mid - 1;\n        } else {\n            l = mid + 1;\n        }\n    }\n    return res;\n}`,
      python: `def search_first(arr, target):\n    l, r, res = 0, len(arr) - 1, -1\n    while l <= r:\n        mid = l + (r - l) // 2\n        if arr[mid] >= target:\n            if arr[mid] == target: res = mid\n            r = mid - 1\n        else:\n            l = mid + 1\n    return res`
    },
    testCases: [{ input: '5 2\n1 2 2 2 3', expectedOutput: '1', description: '第一个2' }],
    hints: ['找到后不要立即返回', '继续往左找更小的位置'],
    explanation: '找到target后，记录位置但继续往左搜索'
  },
];

// ==================== 动态规划 ====================
export const dpExercises: Exercise[] = [
  {
    id: 'dp-fib', category: '动态规划', title: '斐波那契数列', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
斐波那契数列定义如下：F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2)（n > 1）
给定 n，计算 F(n)。

【输入格式】
一个整数 n (0 ≤ n ≤ 45)

【输出格式】
输出 F(n) 的值

【数据范围】
- 0 ≤ n ≤ 45

【示例】
n=0 → 0, n=1 → 1, n=2 → 1, n=10 → 55`,
    templates: {
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    \n    // TODO: 计算斐波那契数列第n项\n    \n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    \n    // TODO: 计算斐波那契数列第n项\n    \n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        \n        // TODO: 计算斐波那契数列第n项\n        \n        sc.close();\n    }\n}`,
      python: `n = int(input())\n\n# TODO: 计算斐波那契数列第n项\n`
    },
    solutions: {
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    \n    if (n <= 1) {\n        printf("%d\\n", n);\n        return 0;\n    }\n    int a = 0, b = 1;\n    for (int i = 2; i <= n; i++) {\n        int c = a + b;\n        a = b;\n        b = c;\n    }\n    printf("%d\\n", b);\n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    \n    if (n <= 1) {\n        cout << n << endl;\n        return 0;\n    }\n    int a = 0, b = 1;\n    for (int i = 2; i <= n; i++) {\n        int c = a + b;\n        a = b;\n        b = c;\n    }\n    cout << b << endl;\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        \n        if (n <= 1) {\n            System.out.println(n);\n            return;\n        }\n        int a = 0, b = 1;\n        for (int i = 2; i <= n; i++) {\n            int c = a + b;\n            a = b;\n            b = c;\n        }\n        System.out.println(b);\n        sc.close();\n    }\n}`,
      python: `n = int(input())\n\nif n <= 1:\n    print(n)\nelse:\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    print(b)`
    },
    testCases: [
      { input: '10', expectedOutput: '55', description: 'F(10)=55' },
      { input: '0', expectedOutput: '0', description: 'F(0)=0' },
      { input: '1', expectedOutput: '1', description: 'F(1)=1' }
    ],
    hints: ['递归会超时，需要用动态规划', '只需保存前两个数，空间O(1)', '状态转移：f(n) = f(n-1) + f(n-2)'],
    explanation: `【动态规划解法】

状态转移方程：F(n) = F(n-1) + F(n-2)

空间优化：只需两个变量滚动更新
- a 存储 F(n-2)
- b 存储 F(n-1)
- 每次计算 c = a + b，然后 a = b, b = c

【时间复杂度】O(n)
【空间复杂度】O(1)`
  },
  {
    id: 'dp-climb-stairs', category: '动态规划', title: '爬楼梯', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
假设你正在爬楼梯，需要 n 阶才能到达楼顶。每次你可以爬 1 或 2 个台阶。
请问有多少种不同的方法可以爬到楼顶？

【输入格式】
一个正整数 n (1 ≤ n ≤ 45)

【输出格式】
输出爬到第 n 阶的方法数

【数据范围】
- 1 ≤ n ≤ 45

【示例】
n=2 → 2（1+1 或 2）
n=3 → 3（1+1+1 或 1+2 或 2+1）`,
    templates: {
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    \n    // TODO: 计算爬n阶楼梯的方法数\n    \n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    \n    // TODO: 计算爬n阶楼梯的方法数\n    \n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        \n        // TODO: 计算爬n阶楼梯的方法数\n        \n        sc.close();\n    }\n}`,
      python: `n = int(input())\n\n# TODO: 计算爬n阶楼梯的方法数\n`
    },
    solutions: {
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    \n    if (n <= 2) {\n        printf("%d\\n", n);\n        return 0;\n    }\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int c = a + b;\n        a = b;\n        b = c;\n    }\n    printf("%d\\n", b);\n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    \n    if (n <= 2) {\n        cout << n << endl;\n        return 0;\n    }\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int c = a + b;\n        a = b;\n        b = c;\n    }\n    cout << b << endl;\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        \n        if (n <= 2) {\n            System.out.println(n);\n            return;\n        }\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b;\n            b = c;\n        }\n        System.out.println(b);\n        sc.close();\n    }\n}`,
      python: `n = int(input())\n\nif n <= 2:\n    print(n)\nelse:\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    print(b)`
    },
    testCases: [
      { input: '2', expectedOutput: '2', description: '2阶：1+1或2' },
      { input: '3', expectedOutput: '3', description: '3阶：1+1+1,1+2,2+1' },
      { input: '5', expectedOutput: '8', description: '5阶有8种方法' }
    ],
    hints: ['到第n阶 = 从第n-1阶爬1步 + 从第n-2阶爬2步', '本质是斐波那契数列', 'dp[1]=1, dp[2]=2'],
    explanation: `【动态规划解法】

思路：到达第n阶有两种方式
1. 从第n-1阶爬1步
2. 从第n-2阶爬2步

状态转移方程：dp[n] = dp[n-1] + dp[n-2]
初始条件：dp[1] = 1, dp[2] = 2

【时间复杂度】O(n)
【空间复杂度】O(1)`
  },
  // 填空题
  {
    id: 'dp-formula-blank', category: '动态规划', title: 'DP状态转移填空', difficulty: 'easy', type: 'fillblank',
    description: '完成经典DP问题的状态转移方程',
    codeTemplate: {
      cpp: `// 爬楼梯问题
// dp[i] = 到达第i阶的方法数
dp[i] = ___BLANK1___;

// 最长递增子序列
// dp[i] = 以nums[i]结尾的LIS长度
if (nums[j] < nums[i])
    dp[i] = max(dp[i], ___BLANK2___);

// 0-1背包问题
// dp[i][j] = 前i个物品，容量j的最大价值
dp[i][j] = max(___BLANK3___, ___BLANK4___);`,
      java: `同上`,
      python: `同上`
    },
    blanks: [
      { id: 'BLANK1', answer: 'dp[i-1] + dp[i-2]', hint: '从i-1走1步或从i-2走2步' },
      { id: 'BLANK2', answer: 'dp[j] + 1', hint: '在j的基础上+1' },
      { id: 'BLANK3', answer: 'dp[i-1][j]', hint: '不选第i个物品' },
      { id: 'BLANK4', answer: 'dp[i-1][j-w[i]] + v[i]', hint: '选第i个物品' }
    ],
    explanation: 'DP核心是找状态转移方程：当前状态=之前状态的某种组合'
  },
  {
    id: 'dp-kadane-blank', category: '动态规划', title: '最大子数组和填空', difficulty: 'medium', type: 'fillblank',
    description: '完成Kadane算法求最大子数组和',
    codeTemplate: {
      cpp: `int maxSubArray(vector<int>& nums) {
    int maxSum = nums[0];
    int curSum = nums[0];
    for (int i = 1; i < nums.size(); i++) {
        // 要么从当前元素重新开始，要么接上前面
        curSum = max(___BLANK1___, ___BLANK2___);
        maxSum = max(___BLANK3___, ___BLANK4___);
    }
    return maxSum;
}`,
      java: `同上`,
      python: `def max_sub_array(nums):
    max_sum = cur_sum = nums[0]
    for n in nums[1:]:
        cur_sum = max(___BLANK1___, ___BLANK2___)
        max_sum = max(___BLANK3___, ___BLANK4___)
    return max_sum`
    },
    blanks: [
      { id: 'BLANK1', answer: 'nums[i]', hint: '从当前元素重新开始' },
      { id: 'BLANK2', answer: 'curSum + nums[i]', hint: '接上前面的和' },
      { id: 'BLANK3', answer: 'maxSum', hint: '之前的最大值' },
      { id: 'BLANK4', answer: 'curSum', hint: '当前的和' }
    ],
    explanation: 'Kadane算法：每个位置决定是"从头开始"还是"接着前面"，取最大！'
  },
  {
    id: 'dp-coin-blank', category: '动态规划', title: '零钱兑换填空', difficulty: 'medium', type: 'fillblank',
    description: '完成零钱兑换的状态转移',
    codeTemplate: {
      cpp: `int coinChange(vector<int>& coins, int amount) {
    // dp[i] = 凑成金额i需要的最少硬币数
    vector<int> dp(amount + 1, INT_MAX);
    dp[0] = ___BLANK1___;  // 金额0需要0枚硬币
    
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (coin <= i && dp[___BLANK2___] != INT_MAX) {
                dp[i] = min(dp[i], ___BLANK3___);
            }
        }
    }
    return dp[amount] == INT_MAX ? -1 : dp[amount];
}`,
      java: `同上`,
      python: `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = ___BLANK1___
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i and dp[___BLANK2___] != float('inf'):
                dp[i] = min(dp[i], ___BLANK3___)`
    },
    blanks: [
      { id: 'BLANK1', answer: '0', hint: '凑出0元需要0枚硬币' },
      { id: 'BLANK2', answer: 'i - coin', hint: '用一枚coin后，需要凑的金额' },
      { id: 'BLANK3', answer: 'dp[i - coin] + 1', hint: '在i-coin的基础上+1枚' }
    ],
    explanation: '零钱兑换：dp[i] = min(dp[i-coin]+1)，对每种硬币尝试！'
  },
  {
    id: 'dp-lis-blank', category: '动态规划', title: '最长递增子序列填空', difficulty: 'medium', type: 'fillblank',
    description: '完成LIS的动态规划解法',
    codeTemplate: {
      cpp: `int lengthOfLIS(vector<int>& nums) {
    int n = nums.size();
    // dp[i] = 以nums[i]结尾的LIS长度
    vector<int> dp(n, ___BLANK1___);  // 初始化
    int maxLen = 1;
    
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (___BLANK2___) {  // 可以接在j后面
                dp[i] = max(dp[i], ___BLANK3___);
            }
        }
        maxLen = max(maxLen, dp[i]);
    }
    return maxLen;
}`,
      java: `同上`,
      python: `def length_of_lis(nums):
    n = len(nums)
    dp = [___BLANK1___] * n
    for i in range(1, n):
        for j in range(i):
            if ___BLANK2___:
                dp[i] = max(dp[i], ___BLANK3___)`
    },
    blanks: [
      { id: 'BLANK1', answer: '1', hint: '每个元素自己就是长度1的LIS' },
      { id: 'BLANK2', answer: 'nums[j] < nums[i]', hint: 'j比i小才能接上' },
      { id: 'BLANK3', answer: 'dp[j] + 1', hint: '在j的LIS基础上+1' }
    ],
    explanation: 'LIS：遍历之前所有比当前小的位置，取最长的+1！'
  },
  {
    id: 'dp-max-subarray', category: '动态规划', title: '最大子数组和', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给定一个整数数组nums，找到一个具有最大和的连续子数组（至少包含一个元素），返回其最大和。

【输入格式】
第一行：整数n，表示数组长度 (1 ≤ n ≤ 10^5)
第二行：n个整数

【输出格式】
输出最大子数组和

【数据范围】
- 1 ≤ n ≤ 10^5
- -10^4 ≤ nums[i] ≤ 10^4`,
    templates: {
      c: `int maxSubArray(int* nums, int n) {\n    // 请实现\n}`,
      cpp: `int maxSubArray(vector<int>& nums) {\n    // 请实现\n}`,
      java: `int maxSubArray(int[] nums) {\n    // 请实现\n}`,
      python: `def max_sub_array(nums):\n    pass`
    },
    solutions: {
      c: `int maxSubArray(int* nums, int n) {\n    int maxSum = nums[0], curSum = nums[0];\n    for (int i = 1; i < n; i++) {\n        curSum = nums[i] > curSum + nums[i] ? nums[i] : curSum + nums[i];\n        maxSum = maxSum > curSum ? maxSum : curSum;\n    }\n    return maxSum;\n}`,
      cpp: `int maxSubArray(vector<int>& nums) {\n    int maxSum = nums[0], curSum = nums[0];\n    for (int i = 1; i < nums.size(); i++) {\n        curSum = max(nums[i], curSum + nums[i]);\n        maxSum = max(maxSum, curSum);\n    }\n    return maxSum;\n}`,
      java: `int maxSubArray(int[] nums) {\n    int maxSum = nums[0], curSum = nums[0];\n    for (int i = 1; i < nums.length; i++) {\n        curSum = Math.max(nums[i], curSum + nums[i]);\n        maxSum = Math.max(maxSum, curSum);\n    }\n    return maxSum;\n}`,
      python: `def max_sub_array(nums):\n    max_sum = cur_sum = nums[0]\n    for n in nums[1:]:\n        cur_sum = max(n, cur_sum + n)\n        max_sum = max(max_sum, cur_sum)\n    return max_sum`
    },
    testCases: [{ input: '9\n-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6', description: '[4,-1,2,1]=6' }],
    hints: ['dp[i]=以i结尾的最大和', '要么从头开始，要么接着前面'],
    explanation: 'Kadane算法：dp[i]=max(nums[i], dp[i-1]+nums[i])'
  },
  {
    id: 'dp-coin-change', category: '动态规划', title: '零钱兑换', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给定不同面额的硬币coins和一个总金额amount，计算凑成总金额所需的最少硬币个数。
如果没有任何一种硬币组合能组成总金额，返回-1。

【输入格式】
第一行：两个整数n和amount，表示硬币种类数和目标金额
第二行：n个正整数，表示每种硬币的面额

【输出格式】
输出最少硬币数，无法凑成则输出-1

【数据范围】
- 1 ≤ n ≤ 12
- 1 ≤ coins[i] ≤ 2^31 - 1
- 0 ≤ amount ≤ 10^4`,
    templates: {
      c: `int coinChange(int* coins, int coinsSize, int amount) {\n    // 请实现\n}`,
      cpp: `int coinChange(vector<int>& coins, int amount) {\n    // 请实现\n}`,
      java: `int coinChange(int[] coins, int amount) {\n    // 请实现\n}`,
      python: `def coin_change(coins, amount):\n    pass`
    },
    solutions: {
      c: `int coinChange(int* coins, int coinsSize, int amount) {\n    int* dp = (int*)malloc((amount + 1) * sizeof(int));\n    for (int i = 0; i <= amount; i++) dp[i] = amount + 1;\n    dp[0] = 0;\n    for (int i = 1; i <= amount; i++) {\n        for (int j = 0; j < coinsSize; j++) {\n            if (coins[j] <= i && dp[i - coins[j]] + 1 < dp[i])\n                dp[i] = dp[i - coins[j]] + 1;\n        }\n    }\n    int res = dp[amount] > amount ? -1 : dp[amount];\n    free(dp);\n    return res;\n}`,
      cpp: `int coinChange(vector<int>& coins, int amount) {\n    vector<int> dp(amount + 1, amount + 1);\n    dp[0] = 0;\n    for (int i = 1; i <= amount; i++) {\n        for (int c : coins) {\n            if (c <= i)\n                dp[i] = min(dp[i], dp[i - c] + 1);\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}`,
      java: `int coinChange(int[] coins, int amount) {\n    int[] dp = new int[amount + 1];\n    Arrays.fill(dp, amount + 1);\n    dp[0] = 0;\n    for (int i = 1; i <= amount; i++) {\n        for (int c : coins) {\n            if (c <= i)\n                dp[i] = Math.min(dp[i], dp[i - c] + 1);\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}`,
      python: `def coin_change(coins, amount):\n    dp = [amount + 1] * (amount + 1)\n    dp[0] = 0\n    for i in range(1, amount + 1):\n        for c in coins:\n            if c <= i:\n                dp[i] = min(dp[i], dp[i - c] + 1)\n    return dp[amount] if dp[amount] <= amount else -1`
    },
    testCases: [{ input: '3 11\n1 2 5', expectedOutput: '3', description: '5+5+1=11' }],
    hints: ['dp[i]=凑成金额i的最少硬币数', '枚举最后一枚硬币的选择'],
    explanation: '完全背包变形：dp[i]=min(dp[i-coin]+1)'
  },
  {
    id: 'dp-lis', category: '动态规划', title: '最长递增子序列', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给定一个整数数组nums，找到其中最长严格递增子序列的长度。
子序列是由数组派生而来的序列，删除或不删除元素且不改变其余元素顺序。

【输入格式】
第一行：整数n，表示数组长度 (1 ≤ n ≤ 2500)
第二行：n个整数

【输出格式】
输出最长递增子序列的长度

【数据范围】
- 1 ≤ n ≤ 2500
- -10^4 ≤ nums[i] ≤ 10^4`,
    templates: {
      c: `int lengthOfLIS(int* nums, int n) {\n    // 请实现\n}`,
      cpp: `int lengthOfLIS(vector<int>& nums) {\n    // 请实现\n}`,
      java: `int lengthOfLIS(int[] nums) {\n    // 请实现\n}`,
      python: `def length_of_lis(nums):\n    pass`
    },
    solutions: {
      c: `int lengthOfLIS(int* nums, int n) {\n    int* dp = (int*)malloc(n * sizeof(int));\n    for (int i = 0; i < n; i++) dp[i] = 1;\n    int maxLen = 1;\n    for (int i = 1; i < n; i++) {\n        for (int j = 0; j < i; j++) {\n            if (nums[j] < nums[i] && dp[j] + 1 > dp[i])\n                dp[i] = dp[j] + 1;\n        }\n        if (dp[i] > maxLen) maxLen = dp[i];\n    }\n    free(dp);\n    return maxLen;\n}`,
      cpp: `int lengthOfLIS(vector<int>& nums) {\n    int n = nums.size();\n    vector<int> dp(n, 1);\n    int maxLen = 1;\n    for (int i = 1; i < n; i++) {\n        for (int j = 0; j < i; j++) {\n            if (nums[j] < nums[i])\n                dp[i] = max(dp[i], dp[j] + 1);\n        }\n        maxLen = max(maxLen, dp[i]);\n    }\n    return maxLen;\n}`,
      java: `int lengthOfLIS(int[] nums) {\n    int n = nums.length;\n    int[] dp = new int[n];\n    Arrays.fill(dp, 1);\n    int maxLen = 1;\n    for (int i = 1; i < n; i++) {\n        for (int j = 0; j < i; j++) {\n            if (nums[j] < nums[i])\n                dp[i] = Math.max(dp[i], dp[j] + 1);\n        }\n        maxLen = Math.max(maxLen, dp[i]);\n    }\n    return maxLen;\n}`,
      python: `def length_of_lis(nums):\n    n = len(nums)\n    dp = [1] * n\n    for i in range(1, n):\n        for j in range(i):\n            if nums[j] < nums[i]:\n                dp[i] = max(dp[i], dp[j] + 1)\n    return max(dp)`
    },
    testCases: [{ input: '8\n10 9 2 5 3 7 101 18', expectedOutput: '4', description: '[2,3,7,101]' }],
    hints: ['dp[i]=以nums[i]结尾的LIS长度', '遍历前面所有比它小的数'],
    explanation: 'O(n²)解法：dp[i]=max(dp[j]+1)，其中j<i且nums[j]<nums[i]'
  },
];

// ==================== 基础概念 ====================
export const introExercises: Exercise[] = [
  {
    id: 'intro-complexity-blank', category: '基础概念', title: '时间复杂度填空', difficulty: 'easy', type: 'fillblank',
    description: '完成时间复杂度的计算和对比',
    codeTemplate: {
      cpp: `/*
常见时间复杂度从快到慢排序：
___BLANK1___ < ___BLANK2___ < ___BLANK3___ < ___BLANK4___ < ___BLANK5___

计算下列代码的时间复杂度：
*/

// 代码1
for (int i = 0; i < n; i++)
    sum += i;
// 复杂度：___BLANK6___

// 代码2
for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)
        sum += i + j;
// 复杂度：___BLANK7___

// 代码3
while (n > 1)
    n = n / 2;
// 复杂度：___BLANK8___`,
      java: `同上`,
      python: `同上`
    },
    blanks: [
      { id: 'BLANK1', answer: 'O(1)', hint: '常数时间，最快' },
      { id: 'BLANK2', answer: 'O(logn)', hint: '对数时间，如二分' },
      { id: 'BLANK3', answer: 'O(n)', hint: '线性时间' },
      { id: 'BLANK4', answer: 'O(nlogn)', hint: '如快排、归并' },
      { id: 'BLANK5', answer: 'O(n²)', hint: '平方时间，双层循环' },
      { id: 'BLANK6', answer: 'O(n)', hint: '单层循环n次' },
      { id: 'BLANK7', answer: 'O(n²)', hint: '双层循环各n次' },
      { id: 'BLANK8', answer: 'O(logn)', hint: '每次减半' }
    ],
    explanation: `【时间复杂度计算三步法】
1. 找循环：看有几层循环
2. 算次数：循环执行多少次
3. 只留最大：去掉常数和低次项

【常见复杂度速查】
- O(1)：直接访问数组元素
- O(logn)：二分查找、每次减半
- O(n)：单层循环遍历
- O(nlogn)：快排、归并、堆排
- O(n²)：双层循环、冒泡排序
- O(2ⁿ)：递归求所有子集`
  },
  {
    id: 'intro-space-blank', category: '基础概念', title: '空间复杂度填空', difficulty: 'easy', type: 'fillblank',
    description: '分析代码的空间复杂度',
    codeTemplate: {
      cpp: `/*
分析下列代码的空间复杂度：
*/

// 代码1：迭代求和
int sum = 0;
for (int i = 0; i < n; i++) sum += i;
// 空间复杂度：___BLANK1___（只用了常数个变量）

// 代码2：创建数组
int arr[n];
for (int i = 0; i < n; i++) arr[i] = i;
// 空间复杂度：___BLANK2___

// 代码3：递归求n!
int f(int n) {
    if (n <= 1) return 1;
    return n * f(n-1);
}
// 空间复杂度：___BLANK3___（递归深度）

// 代码4：归并排序
// 空间复杂度：___BLANK4___（需要临时数组）`,
      java: `同上`,
      python: `同上`
    },
    blanks: [
      { id: 'BLANK1', answer: 'O(1)', hint: '只用了sum和i两个变量' },
      { id: 'BLANK2', answer: 'O(n)', hint: '数组大小为n' },
      { id: 'BLANK3', answer: 'O(n)', hint: '递归栈深度为n' },
      { id: 'BLANK4', answer: 'O(n)', hint: '需要n大小的临时数组' }
    ],
    explanation: `【空间复杂度分析】
- 看变量：用了多少额外变量/数组
- 看递归：递归调用栈的深度

【常见空间复杂度】
- O(1)：原地算法，只用常数个变量（如冒泡排序）
- O(logn)：递归深度为logn（如快排平均）
- O(n)：需要n大小的辅助空间（如归并排序）
- O(n²)：需要n×n的二维数组

【时间空间权衡】
空间换时间：哈希表、动态规划记忆化
时间换空间：原地算法、流式处理`
  },
];

// ==================== 哈希表 ====================
export const hashExercises: Exercise[] = [
  {
    id: 'hash-twosum', category: '哈希表', title: '两数之和', difficulty: 'easy', type: 'coding',
    description: `【题目描述】
给定一个整数数组 nums 和一个目标值 target，请在数组中找出和为目标值的那两个整数，并返回它们的下标。
假设每种输入只会对应一个答案，且同一个元素不能使用两次。

【输入格式】
第一行：整数 n，表示数组长度 (2 ≤ n ≤ 10^4)
第二行：n 个整数，表示数组元素，空格分隔
第三行：整数 target，表示目标值

【输出格式】
输出一行，两个整数表示下标（从0开始），空格分隔

【数据范围】
- 2 ≤ n ≤ 10^4
- -10^9 ≤ nums[i], target ≤ 10^9
- 保证有且仅有一个有效答案`,
    templates: {
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int nums[10005];\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    int target;\n    scanf("%d", &target);\n    \n    // TODO: 实现两数之和，输出两个下标\n    \n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int target;\n    cin >> target;\n    \n    // TODO: 实现两数之和，输出两个下标\n    \n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        \n        // TODO: 实现两数之和，输出两个下标\n        \n        sc.close();\n    }\n}`,
      python: `n = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\n\n# TODO: 实现两数之和，输出两个下标\n`
    },
    solutions: {
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int nums[10005];\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    int target;\n    scanf("%d", &target);\n    \n    // 暴力解法 O(n^2)\n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            if (nums[i] + nums[j] == target) {\n                printf("%d %d\\n", i, j);\n                return 0;\n            }\n        }\n    }\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int target;\n    cin >> target;\n    \n    // 哈希表解法 O(n)\n    unordered_map<int, int> map;\n    for (int i = 0; i < n; i++) {\n        int complement = target - nums[i];\n        if (map.count(complement)) {\n            cout << map[complement] << " " << i << endl;\n            return 0;\n        }\n        map[nums[i]] = i;\n    }\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        \n        // 哈希表解法 O(n)\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                System.out.println(map.get(complement) + " " + i);\n                return;\n            }\n            map.put(nums[i], i);\n        }\n        sc.close();\n    }\n}`,
      python: `n = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\n\n# 哈希表解法 O(n)\nnum_map = {}\nfor i, num in enumerate(nums):\n    complement = target - num\n    if complement in num_map:\n        print(num_map[complement], i)\n        break\n    num_map[num] = i`
    },
    testCases: [
      { input: '4\n2 7 11 15\n9', expectedOutput: '0 1', description: '基本测试：2+7=9' },
      { input: '3\n3 2 4\n6', expectedOutput: '1 2', description: '两数不相邻' },
      { input: '2\n3 3\n6', expectedOutput: '0 1', description: '边界：相同元素' }
    ],
    hints: ['暴力法：双重循环O(n²)', '优化：用哈希表存储已遍历的数及其索引', '对每个数num，查找target-num是否在哈希表中'],
    explanation: `【解题思路】

方法一：暴力枚举 O(n²)
- 双重循环遍历所有数对

方法二：哈希表 O(n)
- 遍历数组，对于每个数num
- 计算complement = target - num
- 如果complement在哈希表中，返回答案
- 否则将num及其下标存入哈希表

【时间复杂度】O(n)
【空间复杂度】O(n)`
  },
  {
    id: 'hash-groupanagram', category: '哈希表', title: '字母异位词分组', difficulty: 'medium', type: 'coding',
    description: `【题目描述】
给你一个字符串数组，请你将字母异位词组合在一起。
字母异位词是由重新排列源单词的字母得到的新单词，所有源单词的字母都恰好只用一次。

【输入格式】
第一行：整数n，表示字符串数量
第二行：n个字符串，空格分隔

【输出格式】
每组异位词输出一行

【数据范围】
- 1 ≤ n ≤ 10^4
- 0 ≤ strs[i].length ≤ 100
- strs[i] 仅包含小写字母`,
    templates: {
      cpp: `vector<vector<string>> groupAnagrams(vector<string>& strs) {\n    // 请实现\n}`,
      java: `List<List<String>> groupAnagrams(String[] strs) {\n    // 请实现\n}`,
      python: `def group_anagrams(strs):\n    pass`
    },
    solutions: {
      cpp: `vector<vector<string>> groupAnagrams(vector<string>& strs) {\n    unordered_map<string, vector<string>> map;\n    for (string& s : strs) {\n        string key = s;\n        sort(key.begin(), key.end());  // 排序作为key\n        map[key].push_back(s);\n    }\n    vector<vector<string>> res;\n    for (auto& [k, v] : map)\n        res.push_back(v);\n    return res;\n}`,
      java: `List<List<String>> groupAnagrams(String[] strs) {\n    Map<String, List<String>> map = new HashMap<>();\n    for (String s : strs) {\n        char[] arr = s.toCharArray();\n        Arrays.sort(arr);\n        String key = new String(arr);\n        map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);\n    }\n    return new ArrayList<>(map.values());\n}`,
      python: `def group_anagrams(strs):\n    from collections import defaultdict\n    map = defaultdict(list)\n    for s in strs:\n        key = ''.join(sorted(s))  # 排序作为key\n        map[key].append(s)\n    return list(map.values())`
    },
    testCases: [{ input: '6\neat tea tan ate nat bat', expectedOutput: 'bat\nnat tan\nate eat tea', description: '分组' }],
    hints: ['异位词排序后相同', '用排序后的字符串作为哈希表的key'],
    explanation: `【关键洞察】字母异位词排序后完全相同！
如："eat","tea","ate" 排序后都是 "aet"

【算法】
1. 遍历每个字符串
2. 将字符串排序作为key
3. 相同key的字符串放在一组

【时间复杂度】O(n * k * logk)，n是字符串数，k是最长字符串长度`
  },
  {
    id: 'hash-lru', category: '哈希表', title: 'LRU缓存', difficulty: 'hard', type: 'coding',
    description: `【题目描述】
设计并实现一个LRU(最近最少使用)缓存机制。
实现LRUCache类：
- LRUCache(int capacity) 以正整数作为容量初始化LRU缓存
- int get(int key) 如果key存在，返回值并标记为最近使用；否则返回-1
- void put(int key, int value) 插入或更新key的值，超容量时淘汰最久未使用

【输入格式】
第一行：容量capacity
后续行：操作指令

【输出格式】
每个get操作的返回值

【数据范围】
- 1 ≤ capacity ≤ 3000
- 0 ≤ key, value ≤ 10^4
- get和put的时间复杂度必须为O(1)`,
    templates: {
      cpp: `class LRUCache {\npublic:\n    LRUCache(int capacity) { }\n    int get(int key) { }\n    void put(int key, int value) { }\n};`,
      java: `class LRUCache {\n    public LRUCache(int capacity) { }\n    public int get(int key) { }\n    public void put(int key, int value) { }\n}`,
      python: `class LRUCache:\n    def __init__(self, capacity): pass\n    def get(self, key): pass\n    def put(self, key, value): pass`
    },
    solutions: {
      cpp: `class LRUCache {\n    int cap;\n    list<pair<int,int>> cache;  // 双向链表\n    unordered_map<int, list<pair<int,int>>::iterator> map;  // key->迭代器\npublic:\n    LRUCache(int capacity): cap(capacity) {}\n    int get(int key) {\n        if (!map.count(key)) return -1;\n        cache.splice(cache.begin(), cache, map[key]);  // 移到头部\n        return map[key]->second;\n    }\n    void put(int key, int value) {\n        if (map.count(key)) {\n            map[key]->second = value;\n            cache.splice(cache.begin(), cache, map[key]);\n            return;\n        }\n        if (cache.size() == cap) {\n            map.erase(cache.back().first);\n            cache.pop_back();\n        }\n        cache.push_front({key, value});\n        map[key] = cache.begin();\n    }\n};`,
      java: `class LRUCache extends LinkedHashMap<Integer, Integer> {\n    int cap;\n    public LRUCache(int capacity) {\n        super(capacity, 0.75f, true);\n        cap = capacity;\n    }\n    public int get(int key) {\n        return super.getOrDefault(key, -1);\n    }\n    public void put(int key, int value) {\n        super.put(key, value);\n    }\n    @Override\n    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {\n        return size() > cap;\n    }\n}`,
      python: `class LRUCache:\n    def __init__(self, capacity):\n        from collections import OrderedDict\n        self.cache = OrderedDict()\n        self.cap = capacity\n    def get(self, key):\n        if key not in self.cache: return -1\n        self.cache.move_to_end(key)  # 移到末尾(最新)\n        return self.cache[key]\n    def put(self, key, value):\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.cap:\n            self.cache.popitem(last=False)  # 删除最旧的`
    },
    testCases: [{ input: '2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2', expectedOutput: '1\n-1', description: 'LRU' }],
    hints: ['哈希表+双向链表', '哈希表O(1)查找', '双向链表O(1)插入删除'],
    explanation: `【LRU原理】淘汰最久未使用的数据
【数据结构】哈希表 + 双向链表
- 哈希表：key -> 链表节点，O(1)查找
- 双向链表：按访问顺序排列，头部最新，尾部最旧

【操作】
- get：查哈希表，找到后移到链表头部
- put：插入链表头部，超容量时删除尾部

【为什么双向链表？】
删除节点需要O(1)，单链表删除需要知道前驱`
  },
];

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

// ==================== 基础编程 ====================
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

// 所有练习题汇总
export const allExercises: Exercise[] = [
  ...linkedListExercises,
  ...stackExercises,
  ...queueExercises,
  ...treeExercises,
  ...graphExercises,
  ...sortExercises,
  ...searchExercises,
  ...dpExercises,
  ...introExercises,
  ...hashExercises,
  ...stringExercises,
  ...twoPointerExercises,
  ...slidingWindowExercises,
  ...bitExercises,
  ...greedyExercises,
  ...backtrackExercises,
  ...classicDpExercises,
  ...allClassicExercises,
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
  ...examFocusExercises,  // 考试重点题目放在最后，便于优先显示
  ...structExercises,     // 结构体题目
  ...basicProgrammingExercises,  // 基础编程题目
];
// 注意: recursionExercises 已包含在 allClassicExercises 中，不要重复添加

// 导出递归分类供其他模块使用
export { recursionExercises };

// 按分类获取练习题
export const getExercisesByCategory = (category: string): Exercise[] => {
  return allExercises.filter(e => e.category === category);
};

// 按难度获取练习题
export const getExercisesByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): Exercise[] => {
  return allExercises.filter(e => e.difficulty === difficulty);
};

// 获取考试重点题目
export const getExamFocusExercises = (): Exercise[] => {
  return allExercises.filter(e => e.isExamFocus === true);
};
