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
}

// ==================== 链表 ====================
export const linkedListExercises: Exercise[] = [
  {
    id: 'll-insert', category: '链表', title: '单链表插入', difficulty: 'easy', type: 'coding',
    description: '在位置i处插入元素e，成功返回true，失败返回false。',
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
    testCases: [{ input: '[1,2,3], i=2, e=99', expectedOutput: '[1,99,2,3]', description: '中间插入' }],
    hints: ['找到第i-1个节点', '先连后面再连前面'], explanation: '插入关键：s.next=p.next; p.next=s',
    commonMistakes: ['顺序错误：先执行p.next=s会导致后继节点丢失', '未处理插入位置无效(p为空)的情况', '计数器j的初始值或终止条件设置错误']
  },
  {
    id: 'll-delete', category: '链表', title: '单链表删除', difficulty: 'easy', type: 'coding',
    description: '删除位置i的节点，返回被删除的值。',
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
    testCases: [{ input: '[1,2,3], i=2', expectedOutput: '2', description: '删除中间' }],
    hints: ['p.next = q.next 跳过待删节点'], explanation: '删除核心：让前驱直接指向后继',
    commonMistakes: ['忘记释放被删除节点的内存(C++)', '未检查待删除节点是否存在(p.next为空)', '删除头节点或尾节点时的边界处理不当']
  },
  {
    id: 'll-reverse', category: '链表', title: '链表反转', difficulty: 'medium', type: 'coding',
    description: '反转单链表，返回新头节点。',
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
    testCases: [{ input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]', description: '反转' }],
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
    description: '判断链表是否有环（快慢指针法）',
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
      { input: '[1,2,3,4] 尾连到2', expectedOutput: 'true', description: '有环' },
      { input: '[1,2,3,4]', expectedOutput: 'false', description: '无环' }
    ],
    hints: ['快慢指针', '快指针每次走2步，慢指针走1步', '如果有环，快慢指针一定会相遇'],
    explanation: '龟兔赛跑：有环的话，兔子（快）一定会追上乌龟（慢）',
    commonMistakes: ['未处理空链表或单节点链表', '快指针移动前未检查fast.next是否为空', '循环终止条件写错']
  },
  {
    id: 'll-middle', category: '链表', title: '链表中间节点', difficulty: 'easy', type: 'coding',
    description: '找到链表的中间节点',
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
    testCases: [{ input: '[1,2,3,4,5]', expectedOutput: '3', description: '中间' }],
    hints: ['快慢指针', '快指针走到头时，慢指针正好在中间'],
    explanation: '快指针速度是慢指针2倍，快到终点时慢在中间',
    commonMistakes: ['循环条件写成fast->next->next', '对于偶数长度链表返回了错误的中间节点（偏左或偏右）']
  },
  {
    id: 'll-merge', category: '链表', title: '合并两个有序链表', difficulty: 'easy', type: 'coding',
    description: '合并两个升序链表为一个新的升序链表',
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
    testCases: [{ input: '[1,3,5], [2,4,6]', expectedOutput: '[1,2,3,4,5,6]', description: '合并' }],
    hints: ['使用dummy头节点简化操作', '比较两链表头，取小的接上'],
    explanation: '双指针归并，每次取较小者',
    commonMistakes: ['未处理其中一个链表为空的情况', '忘记更新tail指针', '循环结束后未连接剩余节点']
  },
];

// ==================== 栈 ====================
export const stackExercises: Exercise[] = [
  {
    id: 'stack-brackets', category: '栈', title: '括号匹配', difficulty: 'medium', type: 'coding',
    description: '判断括号字符串是否有效。包含()[]{}',
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
    testCases: [{ input: '"()[]{}"', expectedOutput: 'true', description: '有效' }, { input: '"(]"', expectedOutput: 'false', description: '无效' }],
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
    description: '设计一个支持push、pop、top和getMin操作的栈，getMin能在O(1)时间返回最小元素',
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
    testCases: [{ input: 'push(-2),push(0),push(-3),getMin(),pop(),getMin()', expectedOutput: '-3,-2', description: '最小值' }],
    hints: ['使用辅助栈记录每个状态的最小值', '入栈时同步更新最小值栈'],
    explanation: '用辅助栈同步记录当前最小值，空间换时间'
  },
  {
    id: 'stack-postfix', category: '栈', title: '后缀表达式求值', difficulty: 'medium', type: 'coding',
    description: '计算后缀表达式（逆波兰表达式）的值',
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
    testCases: [{ input: '["2","1","+","3","*"]', expectedOutput: '9', description: '(2+1)*3=9' }],
    hints: ['数字入栈', '遇运算符弹出两个数计算后入栈'],
    explanation: '后缀表达式计算：遇数字入栈，遇运算符弹两个数计算'
  },
  {
    id: 'stack-daily-temp', category: '栈', title: '每日温度', difficulty: 'medium', type: 'coding',
    description: '给定每日温度数组，返回等几天后会更暖（单调栈经典题）',
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
    testCases: [{ input: '[73,74,75,71,69,72,76,73]', expectedOutput: '[1,1,4,2,1,1,0,0]', description: '等待天数' }],
    hints: ['单调递减栈', '栈存下标而不是值', '遇到更大的温度就计算等待天数'],
    explanation: '单调栈：维护一个递减栈，遇到更大元素时结算'
  },
];

// ==================== 队列 ====================
export const queueExercises: Exercise[] = [
  {
    id: 'queue-circular', category: '队列', title: '循环队列', difficulty: 'medium', type: 'coding',
    description: '实现循环队列，支持入队、出队、判空、判满。',
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
    testCases: [{ input: 'enqueue(1,2,3), dequeue()', expectedOutput: '1', description: '先进先出' }],
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
    description: '用两个栈实现队列的push、pop、peek、empty操作',
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
    testCases: [{ input: 'push(1),push(2),peek(),pop(),empty()', expectedOutput: '1,1,false', description: '队列操作' }],
    hints: ['一个栈负责入队，一个栈负责出队', '出队栈空时才从入队栈转移'],
    explanation: '两个栈倒一下，后进先出变先进先出',
    commonMistakes: ['出栈时直接从入队栈pop', '判空时只检查了一个栈']
  },
  {
    id: 'queue-sliding-window', category: '队列', title: '滑动窗口最大值', difficulty: 'hard', type: 'coding',
    description: '给定数组和窗口大小k，返回每个窗口的最大值',
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
    testCases: [{ input: '[1,3,-1,-3,5,3,6,7], k=3', expectedOutput: '[3,3,5,5,6,7]', description: '窗口最大值' }],
    hints: ['单调递减双端队列', '队首是当前窗口最大值', '及时移除过期和小于当前的元素'],
    explanation: '单调队列：维护递减队列，队首就是最大值',
    commonMistakes: ['未及时移除窗口左侧过期的元素', '单调性维护错误(应为单调递减)', '队列存了值而不是下标(导致无法判断过期)']
  },
];

// ==================== 树 ====================
export const treeExercises: Exercise[] = [
  {
    id: 'tree-preorder', category: '二叉树', title: '前序遍历', difficulty: 'easy', type: 'coding',
    description: '实现二叉树前序遍历（根-左-右）',
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
    testCases: [{ input: '[1,2,3]', expectedOutput: '[1,2,3]', description: '前序' }],
    hints: ['递归：先访问根，再左子树，再右子树'], explanation: '前序遍历顺序：根-左-右',
    commonMistakes: ['递归基准条件缺失(!root return)', '左右子树顺序写反']
  },
  {
    id: 'tree-level', category: '二叉树', title: '层序遍历', difficulty: 'medium', type: 'coding',
    description: '实现二叉树层序遍历（BFS）',
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
    testCases: [{ input: '[3,9,20,null,null,15,7]', expectedOutput: '[[3],[9,20],[15,7]]', description: '层序' }],
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
    description: '实现二叉树中序遍历（左-根-右）',
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
    testCases: [{ input: '[1,null,2,3]', expectedOutput: '[1,3,2]', description: '中序' }],
    hints: ['递归：先左子树，再根，再右子树'], explanation: '中序遍历顺序：左-根-右。BST的中序遍历是有序的！',
    commonMistakes: ['非递归实现时指针移动逻辑混乱', '混淆中序和前序的访问时机']
  },
  {
    id: 'tree-max-depth', category: '二叉树', title: '二叉树最大深度', difficulty: 'easy', type: 'coding',
    description: '计算二叉树的最大深度',
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
    testCases: [{ input: '[3,9,20,null,null,15,7]', expectedOutput: '3', description: '深度为3' }],
    hints: ['递归：空节点返回0', '非空节点：1 + 左右子树深度的最大值'],
    explanation: '最大深度 = 1 + max(左子树深度, 右子树深度)',
    commonMistakes: ['忘记+1', '叶子节点处理逻辑冗余']
  },
  {
    id: 'tree-invert', category: '二叉树', title: '翻转二叉树', difficulty: 'easy', type: 'coding',
    description: '翻转二叉树（交换所有节点的左右子树）',
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
    testCases: [{ input: '[4,2,7,1,3,6,9]', expectedOutput: '[4,7,2,9,6,3,1]', description: '翻转' }],
    hints: ['递归交换每个节点的左右子树', '先交换再递归，或先递归再交换'],
    explanation: '翻转=交换左右子树，递归处理所有节点',
    commonMistakes: ['交换后未更新递归调用的参数(如果先递归)', '只交换了值未交换节点结构']
  },
  {
    id: 'tree-symmetric', category: '二叉树', title: '对称二叉树', difficulty: 'easy', type: 'coding',
    description: '判断二叉树是否对称（镜像对称）',
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
    testCases: [{ input: '[1,2,2,3,4,4,3]', expectedOutput: 'true', description: '对称' }],
    hints: ['比较左子树和右子树是否镜像', '左的左=右的右，左的右=右的左'],
    explanation: '对称判断：左子树的左=右子树的右，左子树的右=右子树的左',
    commonMistakes: ['比较条件写错(应为l.left==r.right && l.right==r.left)', '空节点判断不全']
  },
  {
    id: 'tree-lca', category: '二叉树', title: '最近公共祖先', difficulty: 'medium', type: 'coding',
    description: '找到二叉树中两个节点的最近公共祖先(LCA)',
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
    testCases: [{ input: '[3,5,1,6,2,0,8], p=5, q=1', expectedOutput: '3', description: 'LCA' }],
    hints: ['递归查找', '如果p和q分别在左右子树，当前节点就是LCA'],
    explanation: '后序遍历：左右子树都找到时，当前节点就是LCA',
    commonMistakes: ['未处理当前节点就是p或q的情况', '递归返回值逻辑错误']
  },
];

// ==================== 图 ====================
export const graphExercises: Exercise[] = [
  {
    id: 'graph-bfs', category: '图', title: 'BFS广度优先', difficulty: 'medium', type: 'coding',
    description: '实现图的BFS遍历',
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
    testCases: [{ input: '图0-1,0-2,1-3', expectedOutput: '0 1 2 3', description: 'BFS' }],
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
    description: '实现图的DFS遍历',
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
    testCases: [{ input: '图0-1,0-2,1-3', expectedOutput: '0 1 3 2', description: 'DFS' }],
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
    description: '实现Dijkstra单源最短路径算法',
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
    testCases: [{ input: '0-(1,4)-1, 0-(2,1)-2, 2-(1,2)-1', expectedOutput: 'dist=[0,3,1]', description: '最短路' }],
    hints: ['使用优先队列(小顶堆)', '贪心：每次取距离最小的点', '松弛操作：dist[v] = min(dist[v], dist[u]+w)'],
    explanation: `【Dijkstra算法】解决单源最短路径（边权非负）
【核心思想】贪心 + 松弛
【限制】不能处理负权边，负权用Bellman-Ford`,
    commonMistakes: ['用于带负权边的图', '未使用优先队列导致复杂度退化为O(V²)', '出队后未检查是否已处理(d > dist[u])']
  },
  {
    id: 'graph-topo', category: '图', title: '拓扑排序', difficulty: 'medium', type: 'coding',
    description: '实现有向无环图(DAG)的拓扑排序',
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
    description: '实现冒泡排序',
    templates: {
      c: `void bubbleSort(int arr[], int n) {\n    // 请实现冒泡排序\n}`,
      cpp: `void bubbleSort(int arr[], int n) {\n    // 请实现冒泡排序\n}`,
      java: `void bubbleSort(int[] arr) {\n    // 请实现冒泡排序\n}`,
      python: `def bubble_sort(arr):\n    pass`
    },
    solutions: {
      c: `void bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n-1; i++)\n        for (int j = 0; j < n-1-i; j++)\n            if (arr[j] > arr[j+1]) {\n                int t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t;\n            }\n}`,
      cpp: `void bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n-1; i++)\n        for (int j = 0; j < n-1-i; j++)\n            if (arr[j] > arr[j+1])\n                swap(arr[j], arr[j+1]);\n}`,
      java: `void bubbleSort(int[] arr) {\n    int n = arr.length;\n    for (int i = 0; i < n-1; i++)\n        for (int j = 0; j < n-1-i; j++)\n            if (arr[j] > arr[j+1]) {\n                int t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t;\n            }\n}`,
      python: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n-1):\n        for j in range(n-1-i):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr`
    },
    testCases: [{ input: '[5,3,8,4,2]', expectedOutput: '[2,3,4,5,8]', description: '排序' }],
    hints: ['相邻比较交换', '每轮把最大的移到末尾'], explanation: '冒泡排序O(n²)，稳定'
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
    description: '实现快速排序',
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
    testCases: [{ input: '[5,3,8,4,2]', expectedOutput: '[2,3,4,5,8]', description: '排序' }],
    hints: ['选基准分区', '递归处理左右'], explanation: '快速排序O(nlogn)平均，不稳定'
  },
  {
    id: 'sort-merge', category: '排序', title: '归并排序', difficulty: 'medium', type: 'coding',
    description: '实现归并排序',
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
    testCases: [{ input: '[5,3,8,4,2]', expectedOutput: '[2,3,4,5,8]', description: '排序' }],
    hints: ['分治：先分后合', '合并两个有序数组'], explanation: '归并排序O(nlogn)，稳定，需要O(n)额外空间'
  },
  {
    id: 'sort-insert', category: '排序', title: '插入排序', difficulty: 'easy', type: 'coding',
    description: '实现插入排序',
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
    testCases: [{ input: '[5,3,8,4,2]', expectedOutput: '[2,3,4,5,8]', description: '排序' }],
    hints: ['像打牌一样，把新牌插入已排好的手牌中'], explanation: '插入排序O(n²)，稳定，适合小规模或基本有序的数据'
  },
  {
    id: 'sort-heap', category: '排序', title: '堆排序', difficulty: 'hard', type: 'coding',
    description: '实现堆排序',
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
    testCases: [{ input: '[5,3,8,4,2]', expectedOutput: '[2,3,4,5,8]', description: '排序' }],
    hints: ['先建大顶堆', '每次取堆顶(最大)放末尾，再调整堆'], explanation: '堆排序O(nlogn)，不稳定，原地排序'
  },
];

// ==================== 查找 ====================
export const searchExercises: Exercise[] = [
  {
    id: 'search-binary', category: '查找', title: '二分查找', difficulty: 'easy', type: 'coding',
    description: '在有序数组中查找目标值，返回索引，未找到返回-1',
    templates: {
      c: `int binarySearch(int arr[], int n, int target) {\n    // 请实现二分查找\n}`,
      cpp: `int binarySearch(int arr[], int n, int target) {\n    // 请实现二分查找\n}`,
      java: `int binarySearch(int[] arr, int target) {\n    // 请实现二分查找\n}`,
      python: `def binary_search(arr, target):\n    pass`
    },
    solutions: {
      c: `int binarySearch(int arr[], int n, int target) {\n    int l = 0, r = n-1;\n    while (l <= r) {\n        int mid = l + (r-l)/2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) l = mid+1;\n        else r = mid-1;\n    }\n    return -1;\n}`,
      cpp: `int binarySearch(int arr[], int n, int target) {\n    int l = 0, r = n-1;\n    while (l <= r) {\n        int mid = l + (r-l)/2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) l = mid+1;\n        else r = mid-1;\n    }\n    return -1;\n}`,
      java: `int binarySearch(int[] arr, int target) {\n    int l = 0, r = arr.length-1;\n    while (l <= r) {\n        int mid = l + (r-l)/2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) l = mid+1;\n        else r = mid-1;\n    }\n    return -1;\n}`,
      python: `def binary_search(arr, target):\n    l, r = 0, len(arr)-1\n    while l <= r:\n        mid = l + (r-l)//2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: l = mid+1\n        else: r = mid-1\n    return -1`
    },
    testCases: [{ input: '[1,3,5,7,9], target=5', expectedOutput: '2', description: '找到' }, { input: '[1,3,5,7,9], target=4', expectedOutput: '-1', description: '未找到' }],
    hints: ['比较中间元素', '调整left或right'], explanation: '二分查找O(logn)，要求数组有序'
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
    description: '在有序数组中查找目标值第一次出现的位置',
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
    testCases: [{ input: '[1,2,2,2,3], target=2', expectedOutput: '1', description: '第一个2' }],
    hints: ['找到后不要立即返回', '继续往左找更小的位置'],
    explanation: '找到target后，记录位置但继续往左搜索'
  },
];

// ==================== 动态规划 ====================
export const dpExercises: Exercise[] = [
  {
    id: 'dp-fib', category: '动态规划', title: '斐波那契数列', difficulty: 'easy', type: 'coding',
    description: '计算第n个斐波那契数（0,1,1,2,3,5,8...）',
    templates: {
      c: `int fib(int n) {\n    // 请实现\n}`,
      cpp: `int fib(int n) {\n    // 请实现\n}`,
      java: `int fib(int n) {\n    // 请实现\n}`,
      python: `def fib(n):\n    pass`
    },
    solutions: {
      c: `int fib(int n) {\n    if (n <= 1) return n;\n    int a = 0, b = 1;\n    for (int i = 2; i <= n; i++) {\n        int c = a + b;\n        a = b; b = c;\n    }\n    return b;\n}`,
      cpp: `int fib(int n) {\n    if (n <= 1) return n;\n    int a = 0, b = 1;\n    for (int i = 2; i <= n; i++) {\n        int c = a + b;\n        a = b; b = c;\n    }\n    return b;\n}`,
      java: `int fib(int n) {\n    if (n <= 1) return n;\n    int a = 0, b = 1;\n    for (int i = 2; i <= n; i++) {\n        int c = a + b;\n        a = b; b = c;\n    }\n    return b;\n}`,
      python: `def fib(n):\n    if n <= 1: return n\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b`
    },
    testCases: [{ input: 'n=10', expectedOutput: '55', description: '第10个' }],
    hints: ['只需保存前两个数', '空间优化到O(1)'],
    explanation: '状态转移：f(n)=f(n-1)+f(n-2)，用两个变量滚动更新'
  },
  {
    id: 'dp-climb-stairs', category: '动态规划', title: '爬楼梯', difficulty: 'easy', type: 'coding',
    description: '每次可以爬1或2个台阶，爬n阶有多少种方法',
    templates: {
      c: `int climbStairs(int n) {\n    // 请实现\n}`,
      cpp: `int climbStairs(int n) {\n    // 请实现\n}`,
      java: `int climbStairs(int n) {\n    // 请实现\n}`,
      python: `def climb_stairs(n):\n    pass`
    },
    solutions: {
      c: `int climbStairs(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int c = a + b;\n        a = b; b = c;\n    }\n    return b;\n}`,
      cpp: `int climbStairs(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int c = a + b;\n        a = b; b = c;\n    }\n    return b;\n}`,
      java: `int climbStairs(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int c = a + b;\n        a = b; b = c;\n    }\n    return b;\n}`,
      python: `def climb_stairs(n):\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b`
    },
    testCases: [{ input: 'n=5', expectedOutput: '8', description: '5阶有8种爬法' }],
    hints: ['到第n阶=从n-1阶爬1步+从n-2阶爬2步', '本质是斐波那契'],
    explanation: 'dp[n] = dp[n-1] + dp[n-2]，和斐波那契一样'
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
    description: '找到具有最大和的连续子数组',
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
    testCases: [{ input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', description: '[4,-1,2,1]=6' }],
    hints: ['dp[i]=以i结尾的最大和', '要么从头开始，要么接着前面'],
    explanation: 'Kadane算法：dp[i]=max(nums[i], dp[i-1]+nums[i])'
  },
  {
    id: 'dp-coin-change', category: '动态规划', title: '零钱兑换', difficulty: 'medium', type: 'coding',
    description: '给定硬币面额和总金额，求最少需要多少枚硬币',
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
    testCases: [{ input: 'coins=[1,2,5], amount=11', expectedOutput: '3', description: '5+5+1=11' }],
    hints: ['dp[i]=凑成金额i的最少硬币数', '枚举最后一枚硬币的选择'],
    explanation: '完全背包变形：dp[i]=min(dp[i-coin]+1)'
  },
  {
    id: 'dp-lis', category: '动态规划', title: '最长递增子序列', difficulty: 'medium', type: 'coding',
    description: '找到数组中最长严格递增子序列的长度',
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
    testCases: [{ input: '[10,9,2,5,3,7,101,18]', expectedOutput: '4', description: '[2,3,7,101]' }],
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
    description: '给定数组和目标值，找出和为目标值的两个数的索引',
    templates: {
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {\n    // 请实现\n}`,
      java: `int[] twoSum(int[] nums, int target) {\n    // 请实现\n}`,
      python: `def two_sum(nums, target):\n    pass`
    },
    solutions: {
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> map;  // 值->索引\n    for (int i = 0; i < nums.size(); i++) {\n        int complement = target - nums[i];\n        if (map.count(complement))\n            return {map[complement], i};\n        map[nums[i]] = i;\n    }\n    return {};\n}`,
      java: `int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int complement = target - nums[i];\n        if (map.containsKey(complement))\n            return new int[]{map.get(complement), i};\n        map.put(nums[i], i);\n    }\n    return new int[0];\n}`,
      python: `def two_sum(nums, target):\n    map = {}  # 值->索引\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in map:\n            return [map[complement], i]\n        map[num] = i\n    return []`
    },
    testCases: [{ input: 'nums=[2,7,11,15], target=9', expectedOutput: '[0,1]', description: '2+7=9' }],
    hints: ['用哈希表存储已遍历的数及其索引', '对每个数，查找target-num是否在哈希表中'],
    explanation: `【暴力解法】O(n²) - 双层循环检查所有数对
【哈希优化】O(n) - 边遍历边存入哈希表
- 对于每个num，需要找complement = target - num
- 如果complement在哈希表中，直接返回
- 否则把num存入哈希表供后续查找

【核心思想】哈希表把O(n)的查找变成O(1)`
  },
  {
    id: 'hash-groupanagram', category: '哈希表', title: '字母异位词分组', difficulty: 'medium', type: 'coding',
    description: '将字母异位词（字母相同但顺序不同的词）分组',
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
    testCases: [{ input: '["eat","tea","tan","ate","nat","bat"]', expectedOutput: '[["eat","tea","ate"],["tan","nat"],["bat"]]', description: '分组' }],
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
    description: '设计LRU(最近最少使用)缓存，支持get和put操作，时间复杂度O(1)',
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
    testCases: [{ input: 'cap=2, put(1,1), put(2,2), get(1), put(3,3), get(2)', expectedOutput: '1,-1', description: 'LRU' }],
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
    description: '原地反转字符数组',
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
    testCases: [{ input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]', description: '反转' }],
    hints: ['双指针', '首尾交换'],
    explanation: `【双指针法】O(n)时间，O(1)空间
- 左指针从头开始，右指针从尾开始
- 交换两个指针指向的字符
- 两指针向中间移动，直到相遇`
  },
  {
    id: 'str-palindrome', category: '字符串', title: '验证回文串', difficulty: 'easy', type: 'coding',
    description: '判断字符串是否是回文（只考虑字母和数字，忽略大小写）',
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
    testCases: [{ input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true', description: '是回文' }],
    hints: ['双指针', '跳过非字母数字字符', '忽略大小写比较'],
    explanation: `【回文】正读反读都一样
【双指针法】
- 左右指针向中间移动
- 跳过非字母数字字符
- 比较时忽略大小写`
  },
  {
    id: 'str-longest-palindrome', category: '字符串', title: '最长回文子串', difficulty: 'medium', type: 'coding',
    description: '给定字符串s，找出最长的回文子串',
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
    testCases: [{ input: '"babad"', expectedOutput: '"bab"或"aba"', description: '最长回文子串' }],
    hints: ['中心扩展法', '每个位置作为中心向两边扩展', '注意奇偶长度'],
    explanation: `【中心扩展法】O(n²)
- 回文串有两种：奇数长度(aba)和偶数长度(abba)
- 枚举每个中心点，向两边扩展
- 记录最长的回文子串`
  },
  {
    id: 'str-atoi', category: '字符串', title: '字符串转整数(atoi)', difficulty: 'medium', type: 'coding',
    description: '实现atoi函数：将字符串转换为32位整数',
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
    testCases: [{ input: '"   -42"', expectedOutput: '-42', description: '处理空格和符号' }],
    hints: ['去除前导空格', '处理正负号', '逐位转换', '注意溢出'],
    explanation: `【atoi实现步骤】
1. 跳过前导空格
2. 处理正负号
3. 逐位转换数字
4. 处理溢出（超出32位范围返回边界值）`
  },
  {
    id: 'str-common-prefix', category: '字符串', title: '最长公共前缀', difficulty: 'easy', type: 'coding',
    description: '找出字符串数组中的最长公共前缀',
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
    testCases: [{ input: '["flower","flow","flight"]', expectedOutput: '"fl"', description: '公共前缀' }],
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
    testCases: [{ input: 'text="ABABDABACDABABCABAB", pattern="ABABCABAB"', expectedOutput: '10', description: '第一次出现位置' }],
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
    testCases: [{ input: 'num1="123", num2="456"', expectedOutput: '"56088"', description: '123*456' }],
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
    testCases: [{ input: '"the sky is blue"', expectedOutput: '"blue is sky the"', description: '翻转单词顺序' }],
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
    description: '在有序数组中找到两个数使和等于目标值，返回下标（1-indexed）',
    templates: {
      c: `int* twoSum(int* nums, int n, int target, int* returnSize) {\n    // 请实现\n}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {\n    // 请实现\n}`,
      java: `int[] twoSum(int[] nums, int target) {\n    // 请实现\n}`,
      python: `def two_sum(nums, target):\n    pass`
    },
    solutions: {
      c: `int* twoSum(int* nums, int n, int target, int* returnSize) {\n    int* res = (int*)malloc(2 * sizeof(int));\n    *returnSize = 2;\n    int l = 0, r = n - 1;\n    while (l < r) {\n        int sum = nums[l] + nums[r];\n        if (sum == target) { res[0] = l + 1; res[1] = r + 1; return res; }\n        else if (sum < target) l++;\n        else r--;\n    }\n    return res;\n}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {\n    int l = 0, r = nums.size() - 1;\n    while (l < r) {\n        int sum = nums[l] + nums[r];\n        if (sum == target) return {l + 1, r + 1};\n        else if (sum < target) l++;\n        else r--;\n    }\n    return {};\n}`,
      java: `int[] twoSum(int[] nums, int target) {\n    int l = 0, r = nums.length - 1;\n    while (l < r) {\n        int sum = nums[l] + nums[r];\n        if (sum == target) return new int[]{l + 1, r + 1};\n        else if (sum < target) l++;\n        else r--;\n    }\n    return new int[]{};\n}`,
      python: `def two_sum(nums, target):\n    l, r = 0, len(nums) - 1\n    while l < r:\n        s = nums[l] + nums[r]\n        if s == target: return [l + 1, r + 1]\n        elif s < target: l += 1\n        else: r -= 1\n    return []`
    },
    testCases: [{ input: 'nums=[2,7,11,15], target=9', expectedOutput: '[1,2]', description: '2+7=9' }],
    hints: ['左右指针向中间逼近', '和太小移左指针，和太大移右指针'],
    explanation: `【双指针法】利用数组有序性，O(n)时间O(1)空间`
  },
  {
    id: 'tp-container-water', category: '双指针', title: '盛最多水的容器', difficulty: 'medium', type: 'coding',
    description: '找两条线与x轴构成的容器能容纳最多的水',
    templates: {
      c: `int maxArea(int* height, int n) {\n    // 请实现\n}`,
      cpp: `int maxArea(vector<int>& height) {\n    // 请实现\n}`,
      java: `int maxArea(int[] height) {\n    // 请实现\n}`,
      python: `def max_area(height):\n    pass`
    },
    solutions: {
      c: `int maxArea(int* height, int n) {\n    int l = 0, r = n - 1, maxA = 0;\n    while (l < r) {\n        int h = height[l] < height[r] ? height[l] : height[r];\n        int area = h * (r - l);\n        if (area > maxA) maxA = area;\n        if (height[l] < height[r]) l++;\n        else r--;\n    }\n    return maxA;\n}`,
      cpp: `int maxArea(vector<int>& height) {\n    int l = 0, r = height.size() - 1, maxA = 0;\n    while (l < r) {\n        int h = min(height[l], height[r]);\n        maxA = max(maxA, h * (r - l));\n        if (height[l] < height[r]) l++;\n        else r--;\n    }\n    return maxA;\n}`,
      java: `int maxArea(int[] height) {\n    int l = 0, r = height.length - 1, maxA = 0;\n    while (l < r) {\n        int h = Math.min(height[l], height[r]);\n        maxA = Math.max(maxA, h * (r - l));\n        if (height[l] < height[r]) l++;\n        else r--;\n    }\n    return maxA;\n}`,
      python: `def max_area(height):\n    l, r, max_a = 0, len(height) - 1, 0\n    while l < r:\n        h = min(height[l], height[r])\n        max_a = max(max_a, h * (r - l))\n        if height[l] < height[r]: l += 1\n        else: r -= 1\n    return max_a`
    },
    testCases: [{ input: 'height=[1,8,6,2,5,4,8,3,7]', expectedOutput: '49', description: '最大面积' }],
    hints: ['面积=min(h[l],h[r])*(r-l)', '移动较短的那条线'],
    explanation: `【贪心+双指针】移动较短边才可能找到更大面积`
  },
  {
    id: 'tp-move-zeroes', category: '双指针', title: '移动零', difficulty: 'easy', type: 'coding',
    description: '将数组中的0移动到末尾，保持非零元素相对顺序',
    templates: {
      c: `void moveZeroes(int* nums, int n) {\n    // 请实现\n}`,
      cpp: `void moveZeroes(vector<int>& nums) {\n    // 请实现\n}`,
      java: `void moveZeroes(int[] nums) {\n    // 请实现\n}`,
      python: `def move_zeroes(nums):\n    pass`
    },
    solutions: {
      c: `void moveZeroes(int* nums, int n) {\n    int slow = 0;\n    for (int fast = 0; fast < n; fast++) {\n        if (nums[fast] != 0) {\n            int tmp = nums[slow];\n            nums[slow] = nums[fast];\n            nums[fast] = tmp;\n            slow++;\n        }\n    }\n}`,
      cpp: `void moveZeroes(vector<int>& nums) {\n    int slow = 0;\n    for (int fast = 0; fast < nums.size(); fast++) {\n        if (nums[fast] != 0) swap(nums[slow++], nums[fast]);\n    }\n}`,
      java: `void moveZeroes(int[] nums) {\n    int slow = 0;\n    for (int fast = 0; fast < nums.length; fast++) {\n        if (nums[fast] != 0) {\n            int tmp = nums[slow]; nums[slow] = nums[fast]; nums[fast] = tmp;\n            slow++;\n        }\n    }\n}`,
      python: `def move_zeroes(nums):\n    slow = 0\n    for fast in range(len(nums)):\n        if nums[fast] != 0:\n            nums[slow], nums[fast] = nums[fast], nums[slow]\n            slow += 1`
    },
    testCases: [{ input: 'nums=[0,1,0,3,12]', expectedOutput: '[1,3,12,0,0]', description: '零移到末尾' }],
    hints: ['快慢指针+交换', 'slow指向下一个非零应放的位置'],
    explanation: `【快慢指针】slow指向下一个非零元素应该放的位置`
  },
];

// ==================== 滑动窗口 ====================
export const slidingWindowExercises: Exercise[] = [
  {
    id: 'sw-longest-substring', category: '滑动窗口', title: '无重复字符的最长子串', difficulty: 'medium', type: 'coding',
    description: '找出不含重复字符的最长子串的长度',
    templates: {
      c: `int lengthOfLongestSubstring(char* s) {\n    // 请实现\n}`,
      cpp: `int lengthOfLongestSubstring(string s) {\n    // 请实现\n}`,
      java: `int lengthOfLongestSubstring(String s) {\n    // 请实现\n}`,
      python: `def length_of_longest_substring(s):\n    pass`
    },
    solutions: {
      c: `int lengthOfLongestSubstring(char* s) {\n    int idx[128]; memset(idx, -1, sizeof(idx));\n    int l = 0, maxLen = 0, n = strlen(s);\n    for (int r = 0; r < n; r++) {\n        if (idx[(int)s[r]] >= l) l = idx[(int)s[r]] + 1;\n        idx[(int)s[r]] = r;\n        if (r - l + 1 > maxLen) maxLen = r - l + 1;\n    }\n    return maxLen;\n}`,
      cpp: `int lengthOfLongestSubstring(string s) {\n    unordered_map<char, int> idx;\n    int l = 0, maxLen = 0;\n    for (int r = 0; r < s.size(); r++) {\n        if (idx.count(s[r]) && idx[s[r]] >= l) l = idx[s[r]] + 1;\n        idx[s[r]] = r;\n        maxLen = max(maxLen, r - l + 1);\n    }\n    return maxLen;\n}`,
      java: `int lengthOfLongestSubstring(String s) {\n    Map<Character, Integer> idx = new HashMap<>();\n    int l = 0, maxLen = 0;\n    for (int r = 0; r < s.length(); r++) {\n        char c = s.charAt(r);\n        if (idx.containsKey(c) && idx.get(c) >= l) l = idx.get(c) + 1;\n        idx.put(c, r);\n        maxLen = Math.max(maxLen, r - l + 1);\n    }\n    return maxLen;\n}`,
      python: `def length_of_longest_substring(s):\n    idx = {}\n    l, max_len = 0, 0\n    for r, c in enumerate(s):\n        if c in idx and idx[c] >= l: l = idx[c] + 1\n        idx[c] = r\n        max_len = max(max_len, r - l + 1)\n    return max_len`
    },
    testCases: [{ input: 's="abcabcbb"', expectedOutput: '3', description: '"abc"长度3' }],
    hints: ['用哈希表记录字符位置', '遇到重复字符时移动左边界'],
    explanation: `【滑动窗口+哈希表】记录每个字符最后出现的位置`
  },
  {
    id: 'sw-min-subarray-sum', category: '滑动窗口', title: '长度最小的子数组', difficulty: 'medium', type: 'coding',
    description: '找出和>=target的最短连续子数组长度',
    templates: {
      c: `int minSubArrayLen(int target, int* nums, int n) {\n    // 请实现\n}`,
      cpp: `int minSubArrayLen(int target, vector<int>& nums) {\n    // 请实现\n}`,
      java: `int minSubArrayLen(int target, int[] nums) {\n    // 请实现\n}`,
      python: `def min_sub_array_len(target, nums):\n    pass`
    },
    solutions: {
      c: `int minSubArrayLen(int target, int* nums, int n) {\n    int l = 0, sum = 0, minLen = n + 1;\n    for (int r = 0; r < n; r++) {\n        sum += nums[r];\n        while (sum >= target) {\n            if (r - l + 1 < minLen) minLen = r - l + 1;\n            sum -= nums[l++];\n        }\n    }\n    return minLen > n ? 0 : minLen;\n}`,
      cpp: `int minSubArrayLen(int target, vector<int>& nums) {\n    int l = 0, sum = 0, minLen = INT_MAX;\n    for (int r = 0; r < nums.size(); r++) {\n        sum += nums[r];\n        while (sum >= target) {\n            minLen = min(minLen, r - l + 1);\n            sum -= nums[l++];\n        }\n    }\n    return minLen == INT_MAX ? 0 : minLen;\n}`,
      java: `int minSubArrayLen(int target, int[] nums) {\n    int l = 0, sum = 0, minLen = Integer.MAX_VALUE;\n    for (int r = 0; r < nums.length; r++) {\n        sum += nums[r];\n        while (sum >= target) {\n            minLen = Math.min(minLen, r - l + 1);\n            sum -= nums[l++];\n        }\n    }\n    return minLen == Integer.MAX_VALUE ? 0 : minLen;\n}`,
      python: `def min_sub_array_len(target, nums):\n    l, s, min_len = 0, 0, float('inf')\n    for r in range(len(nums)):\n        s += nums[r]\n        while s >= target:\n            min_len = min(min_len, r - l + 1)\n            s -= nums[l]; l += 1\n    return 0 if min_len == float('inf') else min_len`
    },
    testCases: [{ input: 'target=7, nums=[2,3,1,2,4,3]', expectedOutput: '2', description: '4+3=7' }],
    hints: ['可变窗口', '满足条件时尝试收缩左边界'],
    explanation: `【可变窗口】右边界扩展，满足条件时收缩左边界`
  },
];

// ==================== 位运算 ====================
export const bitExercises: Exercise[] = [
  {
    id: 'bit-single-number', category: '位运算', title: '只出现一次的数字', difficulty: 'easy', type: 'coding',
    description: '数组中只有一个数出现一次，其他都出现两次，找出它',
    templates: {
      c: `int singleNumber(int* nums, int n) {\n    // 请实现\n}`,
      cpp: `int singleNumber(vector<int>& nums) {\n    // 请实现\n}`,
      java: `int singleNumber(int[] nums) {\n    // 请实现\n}`,
      python: `def single_number(nums):\n    pass`
    },
    solutions: {
      c: `int singleNumber(int* nums, int n) {\n    int res = 0;\n    for (int i = 0; i < n; i++) res ^= nums[i];\n    return res;\n}`,
      cpp: `int singleNumber(vector<int>& nums) {\n    int res = 0;\n    for (int x : nums) res ^= x;\n    return res;\n}`,
      java: `int singleNumber(int[] nums) {\n    int res = 0;\n    for (int x : nums) res ^= x;\n    return res;\n}`,
      python: `def single_number(nums):\n    res = 0\n    for x in nums: res ^= x\n    return res`
    },
    testCases: [{ input: 'nums=[4,1,2,1,2]', expectedOutput: '4', description: '4只出现一次' }],
    hints: ['a^a=0, a^0=a', '所有数异或，成对的抵消'],
    explanation: `【异或运算】a^a=0，所有数异或后成对的抵消，剩下单独的数`
  },
  {
    id: 'bit-count-ones', category: '位运算', title: '位1的个数', difficulty: 'easy', type: 'coding',
    description: '计算整数的二进制表示中1的个数',
    templates: {
      c: `int hammingWeight(unsigned int n) {\n    // 请实现\n}`,
      cpp: `int hammingWeight(uint32_t n) {\n    // 请实现\n}`,
      java: `int hammingWeight(int n) {\n    // 请实现\n}`,
      python: `def hamming_weight(n):\n    pass`
    },
    solutions: {
      c: `int hammingWeight(unsigned int n) {\n    int count = 0;\n    while (n) { count++; n &= (n - 1); }\n    return count;\n}`,
      cpp: `int hammingWeight(uint32_t n) {\n    int count = 0;\n    while (n) { count++; n &= (n - 1); }\n    return count;\n}`,
      java: `int hammingWeight(int n) {\n    int count = 0;\n    while (n != 0) { count++; n &= (n - 1); }\n    return count;\n}`,
      python: `def hamming_weight(n):\n    count = 0\n    while n:\n        count += 1\n        n &= (n - 1)\n    return count`
    },
    testCases: [{ input: 'n=11 (1011)', expectedOutput: '3', description: '3个1' }],
    hints: ['n&(n-1)消除最低位的1', '循环直到n为0'],
    explanation: `【Brian Kernighan算法】n&(n-1)会消除最低位的1`
  },
  {
    id: 'bit-power-of-two', category: '位运算', title: '2的幂', difficulty: 'easy', type: 'coding',
    description: '判断一个整数是否是2的幂',
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
    testCases: [{ input: 'n=16', expectedOutput: 'true', description: '16=2^4' }],
    hints: ['2的幂的二进制只有1个1', 'n&(n-1)==0'],
    explanation: `2的幂的二进制只有1个1，n&(n-1)消除后为0`
  },
];

// ==================== 贪心算法 ====================
export const greedyExercises: Exercise[] = [
  {
    id: 'greedy-jump-game', category: '贪心', title: '跳跃游戏', difficulty: 'medium', type: 'coding',
    description: '每个位置能跳的最大距离是nums[i]，判断能否跳到最后',
    templates: {
      c: `int canJump(int* nums, int n) {\n    // 请实现\n}`,
      cpp: `bool canJump(vector<int>& nums) {\n    // 请实现\n}`,
      java: `boolean canJump(int[] nums) {\n    // 请实现\n}`,
      python: `def can_jump(nums):\n    pass`
    },
    solutions: {
      c: `int canJump(int* nums, int n) {\n    int maxReach = 0;\n    for (int i = 0; i < n && i <= maxReach; i++) {\n        if (i + nums[i] > maxReach) maxReach = i + nums[i];\n    }\n    return maxReach >= n - 1;\n}`,
      cpp: `bool canJump(vector<int>& nums) {\n    int maxReach = 0, n = nums.size();\n    for (int i = 0; i < n && i <= maxReach; i++)\n        maxReach = max(maxReach, i + nums[i]);\n    return maxReach >= n - 1;\n}`,
      java: `boolean canJump(int[] nums) {\n    int maxReach = 0, n = nums.length;\n    for (int i = 0; i < n && i <= maxReach; i++)\n        maxReach = Math.max(maxReach, i + nums[i]);\n    return maxReach >= n - 1;\n}`,
      python: `def can_jump(nums):\n    max_reach = 0\n    for i in range(len(nums)):\n        if i > max_reach: return False\n        max_reach = max(max_reach, i + nums[i])\n    return True`
    },
    testCases: [{ input: 'nums=[2,3,1,1,4]', expectedOutput: 'true', description: '能到达' }],
    hints: ['维护能到达的最远位置', '如果当前位置超过最远位置则失败'],
    explanation: `【贪心】维护能到达的最远位置maxReach`
  },
  {
    id: 'greedy-best-stock', category: '贪心', title: '买卖股票的最佳时机II', difficulty: 'medium', type: 'coding',
    description: '可以多次买卖股票，求最大利润',
    templates: {
      c: `int maxProfit(int* prices, int n) {\n    // 请实现\n}`,
      cpp: `int maxProfit(vector<int>& prices) {\n    // 请实现\n}`,
      java: `int maxProfit(int[] prices) {\n    // 请实现\n}`,
      python: `def max_profit(prices):\n    pass`
    },
    solutions: {
      c: `int maxProfit(int* prices, int n) {\n    int profit = 0;\n    for (int i = 1; i < n; i++)\n        if (prices[i] > prices[i-1]) profit += prices[i] - prices[i-1];\n    return profit;\n}`,
      cpp: `int maxProfit(vector<int>& prices) {\n    int profit = 0;\n    for (int i = 1; i < prices.size(); i++)\n        if (prices[i] > prices[i-1]) profit += prices[i] - prices[i-1];\n    return profit;\n}`,
      java: `int maxProfit(int[] prices) {\n    int profit = 0;\n    for (int i = 1; i < prices.length; i++)\n        if (prices[i] > prices[i-1]) profit += prices[i] - prices[i-1];\n    return profit;\n}`,
      python: `def max_profit(prices):\n    return sum(max(0, prices[i] - prices[i-1]) for i in range(1, len(prices)))`
    },
    testCases: [{ input: 'prices=[7,1,5,3,6,4]', expectedOutput: '7', description: '1买5卖+3买6卖' }],
    hints: ['只要有上涨就买卖', '收集所有上涨区间'],
    explanation: `【贪心】只要第二天比今天贵，就今天买明天卖`
  },
];

// ==================== 回溯算法 ====================
export const backtrackExercises: Exercise[] = [
  {
    id: 'bt-permutations', category: '回溯', title: '全排列', difficulty: 'medium', type: 'coding',
    description: '给定不含重复数字的数组，返回其所有可能的全排列',
    templates: {
      c: `int** permute(int* nums, int n, int* returnSize, int** returnColumnSizes) {\n    // 请实现\n}`,
      cpp: `vector<vector<int>> permute(vector<int>& nums) {\n    // 请实现\n}`,
      java: `List<List<Integer>> permute(int[] nums) {\n    // 请实现\n}`,
      python: `def permute(nums):\n    pass`
    },
    solutions: {
      c: `// 需要辅助函数实现，此处简化\nvoid backtrack(int* nums, int n, int* path, int len, int* used, int*** res, int* size) {\n    if (len == n) {\n        (*res)[*size] = malloc(n * sizeof(int));\n        memcpy((*res)[*size], path, n * sizeof(int));\n        (*size)++;\n        return;\n    }\n    for (int i = 0; i < n; i++) {\n        if (used[i]) continue;\n        used[i] = 1;\n        path[len] = nums[i];\n        backtrack(nums, n, path, len + 1, used, res, size);\n        used[i] = 0;\n    }\n}`,
      cpp: `vector<vector<int>> permute(vector<int>& nums) {\n    vector<vector<int>> res;\n    vector<int> path;\n    vector<bool> used(nums.size(), false);\n    function<void()> backtrack = [&]() {\n        if (path.size() == nums.size()) {\n            res.push_back(path);\n            return;\n        }\n        for (int i = 0; i < nums.size(); i++) {\n            if (used[i]) continue;\n            used[i] = true;\n            path.push_back(nums[i]);\n            backtrack();\n            path.pop_back();\n            used[i] = false;\n        }\n    };\n    backtrack();\n    return res;\n}`,
      java: `List<List<Integer>> permute(int[] nums) {\n    List<List<Integer>> res = new ArrayList<>();\n    boolean[] used = new boolean[nums.length];\n    backtrack(res, new ArrayList<>(), nums, used);\n    return res;\n}\nvoid backtrack(List<List<Integer>> res, List<Integer> path, int[] nums, boolean[] used) {\n    if (path.size() == nums.length) {\n        res.add(new ArrayList<>(path));\n        return;\n    }\n    for (int i = 0; i < nums.length; i++) {\n        if (used[i]) continue;\n        used[i] = true;\n        path.add(nums[i]);\n        backtrack(res, path, nums, used);\n        path.remove(path.size() - 1);\n        used[i] = false;\n    }\n}`,
      python: `def permute(nums):\n    res = []\n    def backtrack(path, used):\n        if len(path) == len(nums):\n            res.append(path[:])\n            return\n        for i in range(len(nums)):\n            if used[i]: continue\n            used[i] = True\n            path.append(nums[i])\n            backtrack(path, used)\n            path.pop()\n            used[i] = False\n    backtrack([], [False] * len(nums))\n    return res`
    },
    testCases: [{ input: 'nums=[1,2,3]', expectedOutput: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]', description: '6种排列' }],
    hints: ['回溯三要素：路径、选择列表、结束条件', '用used数组标记已使用的元素'],
    explanation: `【回溯模板】
1. 路径：已做出的选择
2. 选择列表：当前可做的选择
3. 结束条件：到达决策树底层
【核心】选择→递归→撤销选择`
  },
  {
    id: 'bt-subsets', category: '回溯', title: '子集', difficulty: 'medium', type: 'coding',
    description: '给定整数数组，返回该数组所有可能的子集（幂集）',
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
    testCases: [{ input: 'nums=[1,2,3]', expectedOutput: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]', description: '8个子集' }],
    hints: ['子集问题：每个节点都是答案', '从start开始避免重复', '也可用位运算枚举'],
    explanation: `【子集 vs 排列】
- 排列：元素顺序不同算不同结果
- 子集：元素相同就是同一子集，需要start参数
【位运算】n个元素有2^n个子集，用n位二进制枚举`
  },
  {
    id: 'bt-combination-sum', category: '回溯', title: '组合总和', difficulty: 'medium', type: 'coding',
    description: '找出所有相加之和为target的组合，同一数字可无限制重复选取',
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
    testCases: [{ input: 'candidates=[2,3,6,7], target=7', expectedOutput: '[[2,2,3],[7]]', description: '两种组合' }],
    hints: ['可重复选：递归时传i而非i+1', '剪枝：remain<0时返回'],
    explanation: `【组合问题】
- 不可重复选：递归传i+1
- 可重复选：递归传i
- 有重复元素去重：排序+跳过相同元素`
  },
  {
    id: 'bt-n-queens', category: '回溯', title: 'N皇后', difficulty: 'hard', type: 'coding',
    description: '在n×n棋盘上放置n个皇后，使其不能互相攻击（同行/同列/同对角线）',
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
    testCases: [{ input: 'n=4', expectedOutput: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]', description: '4皇后2种解法' }],
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
    description: '在二维字符网格中搜索单词，可上下左右移动但不能重复使用同一格子',
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
    testCases: [{ input: 'board=[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word="ABCCED"', expectedOutput: 'true', description: '存在路径' }],
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
    testCases: [{ input: 'text1="abcde", text2="ace"', expectedOutput: '3', description: 'LCS是"ace"' }],
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
    testCases: [{ input: 'word1="horse", word2="ros"', expectedOutput: '3', description: 'horse→rorse→rose→ros' }],
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
    testCases: [{ input: 'weights=[1,2,3], values=[6,10,12], capacity=5', expectedOutput: '22', description: '选物品1和2' }],
    hints: ['dp[j]=容量为j时的最大价值', '倒序遍历保证每个物品只用一次'],
    explanation: `【0-1背包】
- 二维：dp[i][j]=考虑前i个物品，容量j的最大价值
- 一维优化：倒序遍历容量，防止同一物品被重复选择
【关键】for j from capacity to weight[i] (倒序)`
  },
  {
    id: 'dp-coin-change', category: '动态规划', title: '零钱兑换', difficulty: 'medium', type: 'coding',
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
    testCases: [{ input: 'coins=[1,2,5], amount=11', expectedOutput: '3', description: '5+5+1=11' }],
    hints: ['dp[i]=凑成金额i的最少硬币数', '完全背包问题（可重复选）'],
    explanation: `【完全背包变种】
dp[i] = 凑成金额i的最少硬币数
转移：dp[i] = min(dp[i], dp[i-coin]+1)
初始化：dp[0]=0，其他为inf`
  },
  {
    id: 'dp-lis', category: '动态规划', title: '最长递增子序列', difficulty: 'medium', type: 'coding',
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
    testCases: [{ input: 'nums=[10,9,2,5,3,7,101,18]', expectedOutput: '4', description: '[2,3,7,101]' }],
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
    testCases: [{ input: 'a=12, b=18', expectedOutput: '6', description: '12和18的GCD' }],
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
    testCases: [{ input: 'a=4, b=6', expectedOutput: '12', description: '4和6的LCM' }],
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
    testCases: [{ input: 'a=2, n=10, m=1000', expectedOutput: '24', description: '2^10 mod 1000 = 1024 mod 1000' }],
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
    testCases: [{ input: 'n=17', expectedOutput: 'true', description: '17是素数' }],
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
    testCases: [{ input: 'n=20', expectedOutput: '[2,3,5,7,11,13,17,19]', description: '20以内的素数' }],
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
    testCases: [{ input: 'n=10', expectedOutput: '55', description: 'F(10)=55' }],
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
    testCases: [{ input: 'l1=[1,2,4], l2=[1,3,4]', expectedOutput: '[1,1,2,3,4,4]', description: '合并两个有序链表' }],
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
    testCases: [{ input: 'head=[3,2,0,-4], pos=1', expectedOutput: 'true', description: '尾连接到索引1' }],
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
    testCases: [{ input: 'head=[1,2,3,4,5]', expectedOutput: '节点3', description: '中间节点' }],
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
    testCases: [{ input: 'head=[1,2,3,4,5], n=2', expectedOutput: '[1,2,3,5]', description: '删除倒数第2个' }],
    hints: ['快指针先走n+1步', '然后同步移动，快指针到末尾时慢指针在目标前'],
    explanation: '快指针先走n+1步，然后同步移动，这样快指针到null时，慢指针正好在待删节点前面'
  },
];

// ==================== 更多二叉树题 ====================
export const moreTreeExercises: Exercise[] = [
  {
    id: 'tree-max-depth', category: '二叉树', title: '二叉树最大深度', difficulty: 'easy', type: 'coding',
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
    testCases: [{ input: 'root=[3,9,20,null,null,15,7]', expectedOutput: '3', description: '最大深度为3' }],
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
    testCases: [{ input: 'root=[1,2,2,3,4,4,3]', expectedOutput: 'true', description: '对称' }],
    hints: ['比较左子树和右子树的镜像关系', '左的左对应右的右，左的右对应右的左'],
    explanation: '递归比较：左子树的左 vs 右子树的右，左子树的右 vs 右子树的左'
  },
  {
    id: 'tree-invert', category: '二叉树', title: '翻转二叉树', difficulty: 'easy', type: 'coding',
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
    testCases: [{ input: 'root=[4,2,7,1,3,6,9]', expectedOutput: '[4,7,2,9,6,3,1]', description: '翻转' }],
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
    testCases: [{ input: 'root=[5,4,8,11,null,13,4,7,2,null,null,null,1], sum=22', expectedOutput: 'true', description: '5→4→11→2' }],
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
    testCases: [{ input: 'nums=[3,2,1,5,6,4], k=2', expectedOutput: '5', description: '第2大是5' }],
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
    testCases: [{ input: 'nums=[1,1,1,2,2,3], k=2', expectedOutput: '[1,2]', description: '1出现3次，2出现2次' }],
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
    testCases: [{ input: 'lists=[[1,4,5],[1,3,4],[2,6]]', expectedOutput: '[1,1,2,3,4,4,5,6]', description: '合并3个链表' }],
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
    testCases: [{ input: 'nums=[1,2,3,4,5,6,7], k=3', expectedOutput: '[5,6,7,1,2,3,4]', description: '右移3位' }],
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
    testCases: [{ input: 'nums=[0,1,0,3,12]', expectedOutput: '[1,3,12,0,0]', description: '移动零到末尾' }],
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
    testCases: [{ input: 'nums=[1,2,3,4]', expectedOutput: '[24,12,8,6]', description: '24=2*3*4' }],
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
    testCases: [{ input: 'nums=[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', description: '[4,-1,2,1]' }],
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
    testCases: [{ input: 'matrix=[[1,2,3],[4,5,6],[7,8,9]]', expectedOutput: '[[7,4,1],[8,5,2],[9,6,3]]', description: '顺时针90°' }],
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
    testCases: [{ input: 'matrix=[[1,2,3],[4,5,6],[7,8,9]]', expectedOutput: '[1,2,3,6,9,8,7,4,5]', description: '螺旋遍历' }],
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
    testCases: [{ input: 'matrix=[[1,1,1],[1,0,1],[1,1,1]]', expectedOutput: '[[1,0,1],[0,0,0],[1,0,1]]', description: '中心为0' }],
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
    testCases: [{ input: 'intervals=[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]', description: '[1,3]和[2,6]合并' }],
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
    testCases: [{ input: 'intervals=[[1,3],[6,9]], newInterval=[2,5]', expectedOutput: '[[1,5],[6,9]]', description: '插入并合并' }],
    hints: ['三步：添加左边→合并中间→添加右边', '判断重叠：start≤end'],
    explanation: '分三步：添加不重叠的左边部分，合并重叠部分，添加右边部分'
  },
];

// ==================== 更多图论题 ====================
export const moreGraphExercises: Exercise[] = [
  {
    id: 'graph-num-islands', category: '图', title: '岛屿数量', difficulty: 'medium', type: 'coding',
    description: '计算由"1"（陆地）组成的岛屿数量，水平或垂直相邻的陆地连成岛屿',
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
    testCases: [{ input: 'grid=[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expectedOutput: '3', description: '3个岛屿' }],
    hints: ['遇到1就DFS/BFS标记整个岛', '标记为0避免重复访问'],
    explanation: '遍历网格，每发现一个"1"就计数+1，然后DFS把整个岛标记为"0"'
  },
  {
    id: 'graph-course-schedule', category: '图', title: '课程表', difficulty: 'medium', type: 'coding',
    description: '判断是否能完成所有课程（检测有向图是否有环）',
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
    testCases: [{ input: 'numCourses=2, prerequisites=[[1,0]]', expectedOutput: 'true', description: '先修0再修1' }],
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
    testCases: [{ input: 'adjList=[[2,4],[1,3],[2,4],[1,3]]', expectedOutput: '深拷贝', description: '4节点图' }],
    hints: ['哈希表记录原节点到克隆节点的映射', 'DFS/BFS遍历并克隆'],
    explanation: '用哈希表避免重复克隆同一节点，DFS递归克隆邻居'
  },
];

// ==================== LeetCode高频经典 ====================
export const leetcodeClassicExercises: Exercise[] = [
  {
    id: 'lc-two-sum', category: '哈希表', title: '两数之和', difficulty: 'easy', type: 'coding',
    description: '给定数组和目标值，找出和为目标值的两个数的下标',
    templates: {
      c: `int* twoSum(int* nums, int n, int target, int* returnSize) {\n    // 请实现\n}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {\n    // 请实现\n}`,
      java: `int[] twoSum(int[] nums, int target) {\n    // 请实现\n}`,
      python: `def two_sum(nums, target):\n    pass`
    },
    solutions: {
      c: `// 简化版，实际需要哈希表\nint* twoSum(int* nums, int n, int target, int* returnSize) {\n    *returnSize = 2;\n    int* res = malloc(2 * sizeof(int));\n    for (int i = 0; i < n; i++)\n        for (int j = i + 1; j < n; j++)\n            if (nums[i] + nums[j] == target) { res[0] = i; res[1] = j; return res; }\n    return res;\n}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> mp;\n    for (int i = 0; i < nums.size(); i++) {\n        int complement = target - nums[i];\n        if (mp.count(complement)) return {mp[complement], i};\n        mp[nums[i]] = i;\n    }\n    return {};\n}`,
      java: `int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> mp = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int complement = target - nums[i];\n        if (mp.containsKey(complement)) return new int[]{mp.get(complement), i};\n        mp.put(nums[i], i);\n    }\n    return new int[0];\n}`,
      python: `def two_sum(nums, target):\n    mp = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in mp:\n            return [mp[complement], i]\n        mp[num] = i\n    return []`
    },
    testCases: [{ input: 'nums=[2,7,11,15], target=9', expectedOutput: '[0,1]', description: '2+7=9' }],
    hints: ['哈希表存已遍历的数及其下标', '查找target-nums[i]是否存在'],
    explanation: '用哈希表O(1)查找补数，一次遍历O(n)解决'
  },
  {
    id: 'lc-three-sum', category: '双指针', title: '三数之和', difficulty: 'medium', type: 'coding',
    description: '找出数组中所有和为0的三元组，不能重复',
    templates: {
      c: `int** threeSum(int* nums, int n, int* returnSize, int** returnColumnSizes) {\n    // 请实现\n}`,
      cpp: `vector<vector<int>> threeSum(vector<int>& nums) {\n    // 请实现\n}`,
      java: `List<List<Integer>> threeSum(int[] nums) {\n    // 请实现\n}`,
      python: `def three_sum(nums):\n    pass`
    },
    solutions: {
      c: `// 排序+双指针，实现较长省略`,
      cpp: `vector<vector<int>> threeSum(vector<int>& nums) {\n    vector<vector<int>> res;\n    sort(nums.begin(), nums.end());\n    int n = nums.size();\n    for (int i = 0; i < n - 2; i++) {\n        if (i > 0 && nums[i] == nums[i-1]) continue;  // 去重\n        int l = i + 1, r = n - 1;\n        while (l < r) {\n            int sum = nums[i] + nums[l] + nums[r];\n            if (sum == 0) {\n                res.push_back({nums[i], nums[l], nums[r]});\n                while (l < r && nums[l] == nums[l+1]) l++;  // 去重\n                while (l < r && nums[r] == nums[r-1]) r--;\n                l++; r--;\n            } else if (sum < 0) l++;\n            else r--;\n        }\n    }\n    return res;\n}`,
      java: `List<List<Integer>> threeSum(int[] nums) {\n    List<List<Integer>> res = new ArrayList<>();\n    Arrays.sort(nums);\n    for (int i = 0; i < nums.length - 2; i++) {\n        if (i > 0 && nums[i] == nums[i-1]) continue;\n        int l = i + 1, r = nums.length - 1;\n        while (l < r) {\n            int sum = nums[i] + nums[l] + nums[r];\n            if (sum == 0) {\n                res.add(Arrays.asList(nums[i], nums[l], nums[r]));\n                while (l < r && nums[l] == nums[l+1]) l++;\n                while (l < r && nums[r] == nums[r-1]) r--;\n                l++; r--;\n            } else if (sum < 0) l++;\n            else r--;\n        }\n    }\n    return res;\n}`,
      python: `def three_sum(nums):\n    nums.sort()\n    res = []\n    for i in range(len(nums) - 2):\n        if i > 0 and nums[i] == nums[i-1]: continue\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if s == 0:\n                res.append([nums[i], nums[l], nums[r]])\n                while l < r and nums[l] == nums[l+1]: l += 1\n                while l < r and nums[r] == nums[r-1]: r -= 1\n                l += 1; r -= 1\n            elif s < 0: l += 1\n            else: r -= 1\n    return res`
    },
    testCases: [{ input: 'nums=[-1,0,1,2,-1,-4]', expectedOutput: '[[-1,-1,2],[-1,0,1]]', description: '两个三元组' }],
    hints: ['排序后固定一个数，双指针找另两个', '跳过重复元素去重'],
    explanation: '排序O(nlogn) + 固定i遍历O(n) × 双指针O(n) = O(n²)'
  },
  {
    id: 'lc-trap-rain', category: '双指针', title: '接雨水', difficulty: 'hard', type: 'coding',
    description: '给定柱子高度数组，计算能接多少雨水',
    templates: {
      c: `int trap(int* height, int n) {\n    // 请实现\n}`,
      cpp: `int trap(vector<int>& height) {\n    // 请实现\n}`,
      java: `int trap(int[] height) {\n    // 请实现\n}`,
      python: `def trap(height):\n    pass`
    },
    solutions: {
      c: `int trap(int* height, int n) {\n    if (n == 0) return 0;\n    int l = 0, r = n - 1, lmax = 0, rmax = 0, res = 0;\n    while (l < r) {\n        if (height[l] < height[r]) {\n            if (height[l] >= lmax) lmax = height[l];\n            else res += lmax - height[l];\n            l++;\n        } else {\n            if (height[r] >= rmax) rmax = height[r];\n            else res += rmax - height[r];\n            r--;\n        }\n    }\n    return res;\n}`,
      cpp: `int trap(vector<int>& height) {\n    int l = 0, r = height.size() - 1;\n    int lmax = 0, rmax = 0, res = 0;\n    while (l < r) {\n        if (height[l] < height[r]) {\n            height[l] >= lmax ? lmax = height[l] : res += lmax - height[l];\n            l++;\n        } else {\n            height[r] >= rmax ? rmax = height[r] : res += rmax - height[r];\n            r--;\n        }\n    }\n    return res;\n}`,
      java: `int trap(int[] height) {\n    int l = 0, r = height.length - 1;\n    int lmax = 0, rmax = 0, res = 0;\n    while (l < r) {\n        if (height[l] < height[r]) {\n            if (height[l] >= lmax) lmax = height[l];\n            else res += lmax - height[l];\n            l++;\n        } else {\n            if (height[r] >= rmax) rmax = height[r];\n            else res += rmax - height[r];\n            r--;\n        }\n    }\n    return res;\n}`,
      python: `def trap(height):\n    l, r = 0, len(height) - 1\n    lmax = rmax = res = 0\n    while l < r:\n        if height[l] < height[r]:\n            if height[l] >= lmax: lmax = height[l]\n            else: res += lmax - height[l]\n            l += 1\n        else:\n            if height[r] >= rmax: rmax = height[r]\n            else: res += rmax - height[r]\n            r -= 1\n    return res`
    },
    testCases: [{ input: 'height=[0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6', description: '能接6单位水' }],
    hints: ['每个位置能接的水 = min(左边最高, 右边最高) - 当前高度', '双指针：矮的一边决定水量'],
    explanation: `【双指针】O(n) O(1)
左右指针向中间移动，矮的一边先处理
因为水量由较矮一边的最高柱子决定`
  },
  {
    id: 'lc-container-water', category: '双指针', title: '盛最多水的容器', difficulty: 'medium', type: 'coding',
    description: '找出两条线，使得与x轴构成的容器能容纳最多的水',
    templates: {
      c: `int maxArea(int* height, int n) {\n    // 请实现\n}`,
      cpp: `int maxArea(vector<int>& height) {\n    // 请实现\n}`,
      java: `int maxArea(int[] height) {\n    // 请实现\n}`,
      python: `def max_area(height):\n    pass`
    },
    solutions: {
      c: `int maxArea(int* height, int n) {\n    int l = 0, r = n - 1, maxA = 0;\n    while (l < r) {\n        int h = height[l] < height[r] ? height[l] : height[r];\n        int area = h * (r - l);\n        if (area > maxA) maxA = area;\n        if (height[l] < height[r]) l++;\n        else r--;\n    }\n    return maxA;\n}`,
      cpp: `int maxArea(vector<int>& height) {\n    int l = 0, r = height.size() - 1, maxA = 0;\n    while (l < r) {\n        maxA = max(maxA, min(height[l], height[r]) * (r - l));\n        height[l] < height[r] ? l++ : r--;\n    }\n    return maxA;\n}`,
      java: `int maxArea(int[] height) {\n    int l = 0, r = height.length - 1, maxA = 0;\n    while (l < r) {\n        maxA = Math.max(maxA, Math.min(height[l], height[r]) * (r - l));\n        if (height[l] < height[r]) l++;\n        else r--;\n    }\n    return maxA;\n}`,
      python: `def max_area(height):\n    l, r = 0, len(height) - 1\n    max_a = 0\n    while l < r:\n        max_a = max(max_a, min(height[l], height[r]) * (r - l))\n        if height[l] < height[r]: l += 1\n        else: r -= 1\n    return max_a`
    },
    testCases: [{ input: 'height=[1,8,6,2,5,4,8,3,7]', expectedOutput: '49', description: '8和7之间' }],
    hints: ['面积 = min(左高,右高) × 宽度', '移动较矮的一边才可能增大面积'],
    explanation: '双指针从两端向中间，移动较矮的指针（保留高的才可能找到更大面积）'
  },
  {
    id: 'lc-longest-substring', category: '滑动窗口', title: '无重复字符的最长子串', difficulty: 'medium', type: 'coding',
    description: '找出字符串中不含重复字符的最长子串的长度',
    templates: {
      c: `int lengthOfLongestSubstring(char* s) {\n    // 请实现\n}`,
      cpp: `int lengthOfLongestSubstring(string s) {\n    // 请实现\n}`,
      java: `int lengthOfLongestSubstring(String s) {\n    // 请实现\n}`,
      python: `def length_of_longest_substring(s):\n    pass`
    },
    solutions: {
      c: `int lengthOfLongestSubstring(char* s) {\n    int idx[128] = {0};  // 字符最后出现位置+1\n    int maxLen = 0, left = 0;\n    for (int i = 0; s[i]; i++) {\n        if (idx[s[i]] > left) left = idx[s[i]];\n        int len = i - left + 1;\n        if (len > maxLen) maxLen = len;\n        idx[s[i]] = i + 1;\n    }\n    return maxLen;\n}`,
      cpp: `int lengthOfLongestSubstring(string s) {\n    unordered_map<char, int> mp;\n    int maxLen = 0, left = 0;\n    for (int i = 0; i < s.size(); i++) {\n        if (mp.count(s[i]) && mp[s[i]] >= left)\n            left = mp[s[i]] + 1;\n        maxLen = max(maxLen, i - left + 1);\n        mp[s[i]] = i;\n    }\n    return maxLen;\n}`,
      java: `int lengthOfLongestSubstring(String s) {\n    Map<Character, Integer> mp = new HashMap<>();\n    int maxLen = 0, left = 0;\n    for (int i = 0; i < s.length(); i++) {\n        char c = s.charAt(i);\n        if (mp.containsKey(c) && mp.get(c) >= left)\n            left = mp.get(c) + 1;\n        maxLen = Math.max(maxLen, i - left + 1);\n        mp.put(c, i);\n    }\n    return maxLen;\n}`,
      python: `def length_of_longest_substring(s):\n    mp = {}\n    max_len = left = 0\n    for i, c in enumerate(s):\n        if c in mp and mp[c] >= left:\n            left = mp[c] + 1\n        max_len = max(max_len, i - left + 1)\n        mp[c] = i\n    return max_len`
    },
    testCases: [{ input: 's="abcabcbb"', expectedOutput: '3', description: 'abc长度3' }],
    hints: ['滑动窗口+哈希表记录字符位置', '遇到重复就移动左边界'],
    explanation: '滑动窗口：右指针扩展，遇到重复字符时左指针跳到重复位置之后'
  },
  {
    id: 'lc-valid-parentheses', category: '栈', title: '有效的括号', difficulty: 'easy', type: 'coding',
    description: '判断括号字符串是否有效（正确配对和嵌套）',
    templates: {
      c: `int isValid(char* s) {\n    // 请实现\n}`,
      cpp: `bool isValid(string s) {\n    // 请实现\n}`,
      java: `boolean isValid(String s) {\n    // 请实现\n}`,
      python: `def is_valid(s):\n    pass`
    },
    solutions: {
      c: `int isValid(char* s) {\n    char stack[10001];\n    int top = 0;\n    for (int i = 0; s[i]; i++) {\n        if (s[i] == '(' || s[i] == '[' || s[i] == '{') stack[top++] = s[i];\n        else {\n            if (top == 0) return 0;\n            char c = stack[--top];\n            if ((s[i] == ')' && c != '(') || (s[i] == ']' && c != '[') || (s[i] == '}' && c != '{'))\n                return 0;\n        }\n    }\n    return top == 0;\n}`,
      cpp: `bool isValid(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(' || c == '[' || c == '{') st.push(c);\n        else {\n            if (st.empty()) return false;\n            char top = st.top(); st.pop();\n            if ((c == ')' && top != '(') || (c == ']' && top != '[') || (c == '}' && top != '{'))\n                return false;\n        }\n    }\n    return st.empty();\n}`,
      java: `boolean isValid(String s) {\n    Stack<Character> st = new Stack<>();\n    for (char c : s.toCharArray()) {\n        if (c == '(' || c == '[' || c == '{') st.push(c);\n        else {\n            if (st.isEmpty()) return false;\n            char top = st.pop();\n            if ((c == ')' && top != '(') || (c == ']' && top != '[') || (c == '}' && top != '{'))\n                return false;\n        }\n    }\n    return st.isEmpty();\n}`,
      python: `def is_valid(s):\n    stack = []\n    pairs = {')': '(', ']': '[', '}': '{'}\n    for c in s:\n        if c in '([{':\n            stack.append(c)\n        else:\n            if not stack or stack.pop() != pairs[c]:\n                return False\n    return len(stack) == 0`
    },
    testCases: [{ input: 's="()[]{}"', expectedOutput: 'true', description: '有效' }],
    hints: ['左括号入栈', '右括号时检查栈顶是否匹配'],
    explanation: '经典栈应用：左括号入栈，右括号出栈匹配，最后栈空则有效'
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
    testCases: [{ input: 'prices=[7,1,5,3,6,4]', expectedOutput: '5', description: '1买6卖' }],
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
    testCases: [{ input: 'prices=[7,1,5,3,6,4]', expectedOutput: '7', description: '1买5卖+3买6卖' }],
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
    testCases: [{ input: 'nums=[1,2,3,1]', expectedOutput: '4', description: '偷1和3号房' }],
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
    testCases: [{ input: 'nums=[2,3,1,1,4]', expectedOutput: 'true', description: '能到达' }],
    hints: ['贪心：维护能到达的最远位置', '若当前位置超过最远位置则不可达'],
    explanation: '贪心：遍历时更新能到达的最远位置，若能覆盖终点则可达'
  },
  {
    id: 'dp-climb-stairs', category: '动态规划', title: '爬楼梯', difficulty: 'easy', type: 'coding',
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
    testCases: [{ input: 'n=3', expectedOutput: '3', description: '1+1+1,1+2,2+1' }],
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
    id: 'str-palindrome', category: '字符串', title: '验证回文串', difficulty: 'easy', type: 'coding',
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
    testCases: [{ input: 's="A man, a plan, a canal: Panama"', expectedOutput: 'true', description: '是回文' }],
    hints: ['双指针从两端向中间', '跳过非字母数字，忽略大小写比较'],
    explanation: '双指针：跳过非字母数字字符，比较时忽略大小写'
  },
  {
    id: 'str-longest-palindrome', category: '字符串', title: '最长回文子串', difficulty: 'medium', type: 'coding',
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
    testCases: [{ input: 's="babad"', expectedOutput: '"bab"或"aba"', description: '两个答案都对' }],
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
    testCases: [{ input: 'strs=["eat","tea","tan","ate","nat","bat"]', expectedOutput: '[["bat"],["nat","tan"],["ate","eat","tea"]]', description: '三组' }],
    hints: ['排序后的字符串作为key', '相同key的放一组'],
    explanation: '字母异位词排序后相同，用排序后的字符串作为哈希表的key'
  },
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
  ...leetcodeClassicExercises,
  ...classicDpProblems,
  ...designExercises,
  ...moreStringExercises,
];

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
