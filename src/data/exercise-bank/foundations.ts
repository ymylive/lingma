import type { Exercise } from '../exercises';

// ==================== 链表 ====================
export const linkedListExercises: Exercise[] = [
  {
    id: 'll-insert', category: '链表', title: '单链表插入', difficulty: 'easy', type: 'coding', isExamFocus: true,
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
    id: 'll-delete', category: '链表', title: '单链表删除', difficulty: 'easy', type: 'coding', isExamFocus: true,
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
    id: 'll-reverse', category: '链表', title: '链表反转', difficulty: 'medium', type: 'coding', isExamFocus: true,
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
    id: 'll-merge', category: '链表', title: '合并两个有序链表', difficulty: 'easy', type: 'coding', isExamFocus: true,
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


export const foundationsExerciseBank: Exercise[] = [
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
];

