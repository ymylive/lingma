import type { LessonContent } from './types';
import {
  KnowledgeCard,
  CompareTable,
  CodeExample,
  TipBox,
} from '../../components/tutorials/TutorialPanel';

/* eslint-disable no-irregular-whitespace */

export const linearLessons: Record<string, LessonContent> = {
  'linear/array': {
    title: '顺序表',
    category: '线性表',
    duration: '25分钟',
    demoLink: '/algorithms/sequence',
    sections: [
      {
        title: '顺序表的概念',
        content: (
          <div className="space-y-4">
            <KnowledgeCard title="📚 顺序表 = 数组实现的线性表" color="indigo">
              <p>用一段<strong>连续的存储单元</strong>依次存储线性表的数据元素。</p>
              <p className="text-sm text-slate-500 mt-2">就像书架上的书，一本挨着一本，位置固定。</p>
            </KnowledgeCard>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h4 className="text-lg font-bold text-blue-800 mb-3">🏠 生活例子：电影院座位</h4>
              <p className="text-slate-600 text-sm mb-3">电影院的座位就像顺序表：</p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• 座位号连续（1号、2号、3号...）</li>
                <li>• 知道座位号就能直接找到位置（随机访问O(1)）</li>
                <li>• 中间插人要让后面所有人挪位（插入O(n)）</li>
              </ul>
            </div>
            <CompareTable
              headers={['操作', '时间复杂度', '说明']}
              rows={[
                ['随机访问', 'O(1)', '直接用下标访问'],
                ['头部插入', 'O(n)', '所有元素后移'],
                ['尾部插入', 'O(1)', '直接追加'],
                ['中间插入', 'O(n)', '后面元素后移'],
                ['删除', 'O(n)', '后面元素前移'],
              ]}
            />
          </div>
        ),
      },
      {
        title: '代码实现',
        content: (
          <div className="space-y-4">
            <CodeExample lang="cpp" code={`// 顺序表的结构定义
#define MaxSize 100
typedef struct {
    int data[MaxSize];  // 存储数据的数组
    int length;         // 当前长度
} SqList;

// 插入操作（在位置i插入元素e）
bool ListInsert(SqList &L, int i, int e) {
    if (i < 1 || i > L.length + 1) return false;  // 位置不合法
    if (L.length >= MaxSize) return false;        // 已满
    
    // 后移元素（从后往前移）
    for (int j = L.length; j >= i; j--)
        L.data[j] = L.data[j-1];
    
    L.data[i-1] = e;  // 插入新元素
    L.length++;
    return true;
}

// 删除操作（删除位置i的元素）
bool ListDelete(SqList &L, int i, int &e) {
    if (i < 1 || i > L.length) return false;
    e = L.data[i-1];  // 保存被删除元素
    
    // 前移元素
    for (int j = i; j < L.length; j++)
        L.data[j-1] = L.data[j];
    
    L.length--;
    return true;
}`} />
            <TipBox type="tip">
              <strong>插入：从后往前移</strong>（避免覆盖）<br/>
              <strong>删除：从前往后移</strong>（填补空位）
            </TipBox>
          </div>
        ),
      },
    ],
  },
  'linear/linkedlist': {
    title: '单链表',
    category: '线性表',
    duration: '30分钟',
    demoLink: '/algorithms/link-head-node',
    sections: [
      {
        title: '单链表的概念',
        content: (
          <div className="space-y-4">
            <KnowledgeCard title="🔗 单链表 = 节点通过指针连接" color="emerald">
              <p>每个节点包含<strong>数据域</strong>和<strong>指针域</strong>（指向下一个节点）。</p>
              <p className="text-sm text-slate-500 mt-2">就像寻宝游戏，每个地点都有下一个地点的线索。</p>
            </KnowledgeCard>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-6 dark:from-emerald-950/40 dark:to-teal-950/30 dark:border-emerald-800/60">
              <h4 className="text-lg font-bold text-emerald-800 mb-3 dark:text-emerald-200">🚂 生活例子：火车车厢</h4>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xl sm:text-2xl my-4">
                <span>🚃</span><span>→</span><span>🚃</span><span>→</span><span>🚃</span><span>→</span><span>🚃</span><span>→</span><span className="text-slate-400">NULL</span>
              </div>
              <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                <li>• 每节车厢只知道下一节在哪（单向）</li>
                <li>• 要找第n节车厢，必须从头数（O(n)）</li>
                <li>• 插入/删除只需改挂钩，不用移动车厢（O(1)）</li>
              </ul>
            </div>
            <CompareTable
              headers={['操作', '顺序表', '链表']}
              rows={[
                ['随机访问', 'O(1) ✓', 'O(n) ✗'],
                ['插入/删除', 'O(n) ✗', 'O(1) ✓'],
                ['空间', '固定大小', '动态分配'],
              ]}
            />
          </div>
        ),
      },
      {
        title: '核心操作：插入与删除',
        content: (
          <div className="space-y-4">
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
              <h4 className="text-lg font-bold text-amber-800 mb-3">⚠️ 插入操作（关键！）</h4>
              <p className="text-slate-600 mb-3">在p节点后插入新节点s：</p>
              <div className="bg-white rounded-lg p-4 font-mono text-sm">
                <p className="text-emerald-600">s-&gt;next = p-&gt;next;  // 第1步：新节点指向p的后继</p>
                <p className="text-rose-600">p-&gt;next = s;         // 第2步：p指向新节点</p>
              </div>
              <TipBox type="important">
                <strong>顺序不能反！</strong>如果先执行p-&gt;next=s，就丢失了原来p的后继节点！
              </TipBox>
            </div>
            <div className="bg-rose-50 rounded-xl p-6 border border-rose-200">
              <h4 className="text-lg font-bold text-rose-800 mb-3">🗑️ 删除操作</h4>
              <p className="text-slate-600 mb-3">删除p节点的后继节点q：</p>
              <div className="bg-white rounded-lg p-4 font-mono text-sm">
                <p>q = p-&gt;next;         // 找到要删除的节点</p>
                <p className="text-rose-600">p-&gt;next = q-&gt;next;  // 跳过q，直接连到q的后继</p>
                <p>free(q);             // 释放q的内存</p>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
  'linear/doubly': {
    title: '双向链表',
    category: '线性表',
    duration: '20分钟',
    demoLink: '/algorithms/link-double',
    sections: [
      {
        title: '双向链表的概念',
        content: (
          <div className="space-y-4">
            <KnowledgeCard title="↔️ 双向链表 = 可以双向遍历" color="amber">
              <p>每个节点有<strong>两个指针</strong>：prior指向前驱，next指向后继。</p>
            </KnowledgeCard>
            <div className="flex flex-wrap items-center justify-center gap-1 text-base sm:text-lg my-4 font-mono">
              <span className="text-slate-400">NULL</span>
              <span>←</span>
              <span className="bg-blue-100 px-2 py-1 rounded">A</span>
              <span>⇄</span>
              <span className="bg-blue-100 px-2 py-1 rounded">B</span>
              <span>⇄</span>
              <span className="bg-blue-100 px-2 py-1 rounded">C</span>
              <span>→</span>
              <span className="text-slate-400">NULL</span>
            </div>
            <CompareTable
              headers={['特性', '单链表', '双向链表']}
              rows={[
                ['指针数', '1个(next)', '2个(prior+next)'],
                ['访问前驱', 'O(n)', 'O(1) ✓'],
                ['删除本节点', '需要知道前驱', '直接删除 ✓'],
                ['空间开销', '小', '大'],
              ]}
            />
          </div>
        ),
      },
      {
        title: '插入与删除',
        content: (
          <div className="space-y-4">
            <CodeExample lang="cpp" code={`// 双向链表节点
struct DNode {
    int data;
    DNode *prior, *next;
};

// 在p节点后插入s
s->next = p->next;       // ① s的后继 = p的后继
if (p->next != NULL)
    p->next->prior = s;  // ② p后继的前驱 = s
s->prior = p;            // ③ s的前驱 = p
p->next = s;             // ④ p的后继 = s

// 删除p节点的后继节点q
q = p->next;
if (q->next != NULL)
    q->next->prior = p;  // q后继的前驱指向p
p->next = q->next;       // p的后继指向q的后继
free(q);`} />
            <TipBox type="tip">
              双向链表的插入需要修改<strong>4个指针</strong>，删除需要修改<strong>2个指针</strong>。
            </TipBox>
          </div>
        ),
      },
    ],
  },
  'linear/stack': {
    title: '栈',
    category: '线性表',
    duration: '25分钟',
    demoLink: '/algorithms/stack-sequence',
    sections: [
      {
        title: '栈的概念',
        content: (
          <div className="space-y-4">
            <KnowledgeCard title="📚 栈 = 后进先出 (LIFO)" color="rose">
              <p>只能在一端（栈顶）进行插入和删除操作。</p>
              <p className="text-sm text-slate-500 mt-2">就像一摞盘子，只能从最上面拿。</p>
            </KnowledgeCard>
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100 p-6 dark:from-rose-950/40 dark:to-pink-950/30 dark:border-rose-800/60">
              <h4 className="text-lg font-bold text-rose-800 mb-3 dark:text-rose-200">🍽️ 生活例子</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white dark:bg-slate-900/70 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🍽️</div>
                  <p className="font-medium">一摞盘子</p>
                  <p className="text-slate-500">最后放的先拿</p>
                </div>
                <div className="bg-white dark:bg-slate-900/70 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">↩️</div>
                  <p className="font-medium">浏览器后退</p>
                  <p className="text-slate-500">最近访问的先返回</p>
                </div>
                <div className="bg-white dark:bg-slate-900/70 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">📝</div>
                  <p className="font-medium">撤销操作</p>
                  <p className="text-slate-500">最后操作先撤销</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="border-2 border-slate-300 rounded-lg p-4 w-32">
                <div className="text-center text-slate-400 mb-2">栈顶 ↓</div>
                <div className="space-y-1 [&>div:nth-child(n+2)]:text-rose-950 dark:[&>div:nth-child(n+2)]:text-white">
                  <div className="bg-rose-500 text-white text-center py-1 rounded">3 ← 后进</div>
                  <div className="bg-rose-400 text-white text-center py-1 rounded">2</div>
                  <div className="bg-rose-300 text-white text-center py-1 rounded">1 ← 先进</div>
                </div>
                <div className="text-center text-slate-400 mt-2">栈底</div>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: '栈的应用',
        content: (
          <div className="space-y-4">
            <CompareTable
              headers={['应用场景', '说明']}
              rows={[
                ['括号匹配', '左括号入栈，右括号出栈匹配'],
                ['表达式求值', '操作数栈 + 运算符栈'],
                ['函数调用', '递归调用时保存现场'],
                ['DFS遍历', '深度优先搜索用栈实现'],
                ['浏览器历史', '后退功能'],
              ]}
            />
            <CodeExample lang="cpp" code={`// 顺序栈
#define MaxSize 100
typedef struct {
    int data[MaxSize];
    int top;  // 栈顶指针（-1表示空栈）
} SqStack;

// 入栈
bool Push(SqStack &S, int e) {
    if (S.top == MaxSize - 1) return false;  // 栈满
    S.data[++S.top] = e;  // 先移动指针，再存入
    return true;
}

// 出栈
bool Pop(SqStack &S, int &e) {
    if (S.top == -1) return false;  // 栈空
    e = S.data[S.top--];  // 先取出，再移动指针
    return true;
}`} />
          </div>
        ),
      },
    ],
  },
  'linear/queue': {
    title: '队列',
    category: '线性表',
    duration: '25分钟',
    demoLink: '/algorithms/queue-sequence',
    sections: [
      {
        title: '队列的概念',
        content: (
          <div className="space-y-4">
            <KnowledgeCard title="🚶 队列 = 先进先出 (FIFO)" color="emerald">
              <p>只能在队尾插入，队头删除。</p>
              <p className="text-sm text-slate-500 mt-2">就像排队买东西，先来先服务。</p>
            </KnowledgeCard>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-6 dark:from-emerald-950/40 dark:to-teal-950/30 dark:border-emerald-800/60">
              <h4 className="text-lg font-bold text-emerald-800 mb-3 dark:text-emerald-200">🎢 生活例子</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white dark:bg-slate-900/70 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🧑‍🤝‍🧑</div>
                  <p className="font-medium">排队</p>
                  <p className="text-slate-500">先来先服务</p>
                </div>
                <div className="bg-white dark:bg-slate-900/70 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🖨️</div>
                  <p className="font-medium">打印任务</p>
                  <p className="text-slate-500">先提交先打印</p>
                </div>
                <div className="bg-white dark:bg-slate-900/70 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">📬</div>
                  <p className="font-medium">消息队列</p>
                  <p className="text-slate-500">按顺序处理</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="text-slate-500">出队 ←</div>
              <div className="flex flex-wrap justify-center border-2 border-slate-300 rounded-lg p-2 [&>div:nth-child(-n+2)]:text-emerald-950 dark:[&>div:nth-child(-n+2)]:text-white">
                <div className="bg-emerald-300 text-white px-3 py-1 rounded mx-1">1</div>
                <div className="bg-emerald-400 text-white px-3 py-1 rounded mx-1">2</div>
                <div className="bg-emerald-500 text-white px-3 py-1 rounded mx-1">3</div>
              </div>
              <div className="text-slate-500">← 入队</div>
            </div>
          </div>
        ),
      },
      {
        title: '循环队列',
        content: (
          <div className="space-y-4">
            <TipBox type="important">
              <strong>为什么需要循环队列？</strong><br/>
              普通队列出队后前面的空间浪费了。循环队列让指针"循环"使用空间。
            </TipBox>
            <CodeExample lang="cpp" code={`// 循环队列
#define MaxSize 100
typedef struct {
    int data[MaxSize];
    int front, rear;  // 队头、队尾指针
} SqQueue;

// 判断队空
bool isEmpty(SqQueue Q) {
    return Q.front == Q.rear;
}

// 判断队满（牺牲一个单元）
bool isFull(SqQueue Q) {
    return (Q.rear + 1) % MaxSize == Q.front;
}

// 入队
bool EnQueue(SqQueue &Q, int e) {
    if (isFull(Q)) return false;
    Q.data[Q.rear] = e;
    Q.rear = (Q.rear + 1) % MaxSize;  // 循环
    return true;
}

// 出队
bool DeQueue(SqQueue &Q, int &e) {
    if (isEmpty(Q)) return false;
    e = Q.data[Q.front];
    Q.front = (Q.front + 1) % MaxSize;  // 循环
    return true;
}

// 队列长度
int Length(SqQueue Q) {
    return (Q.rear - Q.front + MaxSize) % MaxSize;
}`} />
            <TipBox type="tip">
              <strong>循环队列公式记忆：</strong><br/>
              队空：front == rear<br/>
              队满：(rear+1) % MaxSize == front<br/>
              长度：(rear - front + MaxSize) % MaxSize
            </TipBox>
          </div>
        ),
      },
    ],
  },
  'linear/circular': {
    title: '循环链表',
    category: '线性表',
    duration: '20分钟',
    demoLink: '/algorithms/link-head-node',
    sections: [
      {
        title: '循环链表的概念',
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              <strong>循环链表</strong>是一种特殊的链表，其最后一个节点的指针不是NULL，
              而是指向头节点，形成一个"环"。
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <KnowledgeCard title="🔄 循环单链表" color="indigo">
                <p>最后节点的next指向头节点</p>
                <p className="mt-2">可从任意节点遍历整个链表</p>
              </KnowledgeCard>
              <KnowledgeCard title="🔁 循环双链表" color="emerald">
                <p>头节点的prior指向尾节点</p>
                <p>尾节点的next指向头节点</p>
              </KnowledgeCard>
            </div>
          </div>
        ),
      },
      {
        title: '代码实现',
        content: (
          <div className="space-y-4">
            <CodeExample lang="cpp" code={`// 循环单链表
struct Node {
    int data;
    Node* next;
};

// 判断是否为空（带头节点）
bool isEmpty(Node* head) {
    return head->next == head;  // 头节点指向自己
}

// 判断是否是尾节点
bool isTail(Node* head, Node* p) {
    return p->next == head;
}

// 遍历循环链表
void traverse(Node* head) {
    Node* p = head->next;
    while (p != head) {
        cout << p->data << " ";
        p = p->next;
    }
}`} />
            <TipBox type="tip">
              循环链表常用于实现<strong>约瑟夫环</strong>问题、循环队列等场景。
            </TipBox>
          </div>
        ),
      },
    ],
  },
};

