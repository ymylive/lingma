import TutorialPanel, { KnowledgeCard, StepList, CompareTable, CodeExample, TipBox, QuizQuestion } from './TutorialPanel';

export default function StackTutorial() {
  const sections = [
    {
      title: '栈的基础',
      icon: '📖',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">什么是栈？</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              栈是一种<strong>后进先出（LIFO）</strong>的线性数据结构。
              就像一摞盘子，只能从顶部放入和取出。最后放入的元素最先被取出。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <KnowledgeCard title="📥 入栈 Push" color="indigo">
              <p>将元素放入栈顶</p>
              <p className="mt-2">操作：top++，然后存入元素</p>
              <p className="text-slate-500">时间复杂度：O(1)</p>
            </KnowledgeCard>

            <KnowledgeCard title="📤 出栈 Pop" color="emerald">
              <p>将栈顶元素取出</p>
              <p className="mt-2">操作：取出元素，然后top--</p>
              <p className="text-slate-500">时间复杂度：O(1)</p>
            </KnowledgeCard>
          </div>

          <CodeExample lang="cpp" code={`// 顺序栈定义
#define MaxSize 100
struct Stack {
    int data[MaxSize];  // 存储元素
    int top;            // 栈顶指针
};

// 初始化
void InitStack(Stack &S) {
    S.top = -1;  // 空栈时top为-1
}

// 判空
bool IsEmpty(Stack S) {
    return S.top == -1;
}

// 判满
bool IsFull(Stack S) {
    return S.top == MaxSize - 1;
}`} />

          <TipBox type="tip">
            <strong>栈顶指针的两种设计：</strong>
            1) top指向栈顶元素（初始-1）：先++后存，先取后--
            2) top指向栈顶上一个位置（初始0）：先存后++，先--后取
          </TipBox>
        </div>
      ),
    },
    {
      title: '核心操作',
      icon: '⚙️',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">入栈与出栈</h3>
            
            <StepList steps={[
              { title: 'Push 入栈', desc: '检查栈是否已满 → 栈顶指针+1 → 存入新元素' },
              { title: 'Pop 出栈', desc: '检查栈是否为空 → 取出栈顶元素 → 栈顶指针-1' },
              { title: 'GetTop 取栈顶', desc: '只查看栈顶元素，不删除' },
            ]} />
          </div>

          <CodeExample lang="cpp" code={`// 入栈
bool Push(Stack &S, int x) {
    if (S.top == MaxSize - 1)  // 栈满
        return false;
    S.data[++S.top] = x;       // 先++，后存
    return true;
}

// 出栈
bool Pop(Stack &S, int &x) {
    if (S.top == -1)           // 栈空
        return false;
    x = S.data[S.top--];       // 先取，后--
    return true;
}

// 读取栈顶元素
bool GetTop(Stack S, int &x) {
    if (S.top == -1)
        return false;
    x = S.data[S.top];         // 只读不删
    return true;
}`} />

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <KnowledgeCard title="🔢 顺序栈" color="indigo">
              <ul className="space-y-1">
                <li>用数组实现</li>
                <li>需要预先分配空间</li>
                <li>可能栈满溢出</li>
                <li>访问效率高</li>
              </ul>
            </KnowledgeCard>

            <KnowledgeCard title="🔗 链栈" color="emerald">
              <ul className="space-y-1">
                <li>用链表实现</li>
                <li>动态分配空间</li>
                <li>不会溢出（理论上）</li>
                <li>每个节点需要额外指针空间</li>
              </ul>
            </KnowledgeCard>
          </div>

          <TipBox type="warning">
            <strong>共享栈：</strong>
            两个栈共享一个数组空间，一个从头往后增长，一个从尾往前增长。
            满的条件是：top1 + 1 == top2
          </TipBox>
        </div>
      ),
    },
    {
      title: '应用场景',
      icon: '💼',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-800 mb-3">栈的典型应用</h3>

          <div className="space-y-4">
            <KnowledgeCard title="🧮 表达式求值" color="indigo">
              <p><strong>中缀转后缀：</strong>使用运算符栈</p>
              <p><strong>后缀求值：</strong>使用操作数栈</p>
              <p className="mt-2">例：3 + 4 * 5 → 3 4 5 * + → 结果23</p>
            </KnowledgeCard>

            <KnowledgeCard title="🔄 括号匹配" color="emerald">
              <p>遇左括号入栈，遇右括号出栈匹配</p>
              <p>最后栈空则匹配成功</p>
              <p className="mt-2">例：检查 {"{ [ ( ) ] }"} 是否合法</p>
            </KnowledgeCard>

            <KnowledgeCard title="📞 函数调用" color="amber">
              <p><strong>调用栈：</strong>保存函数返回地址、参数、局部变量</p>
              <p><strong>递归：</strong>每次递归调用都在栈中创建新帧</p>
              <p className="text-rose-600 mt-2">递归太深会导致栈溢出！</p>
            </KnowledgeCard>

            <KnowledgeCard title="↩️ 撤销操作" color="rose">
              <p>编辑器的撤销功能：每次操作入栈</p>
              <p>撤销时从栈中取出上一步操作</p>
              <p>浏览器的后退功能也类似</p>
            </KnowledgeCard>
          </div>

          <CodeExample lang="cpp" code={`// 括号匹配检查
bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty()) return false;
            char top = st.top();
            st.pop();
            if ((c == ')' && top != '(') ||
                (c == ']' && top != '[') ||
                (c == '}' && top != '{'))
                return false;
        }
    }
    return st.empty();
}`} />
        </div>
      ),
    },
    {
      title: '队列对比',
      icon: '📊',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-800 mb-3">栈 vs 队列</h3>

          <CompareTable
            headers={['特性', '栈 Stack', '队列 Queue']}
            rows={[
              ['原则', '后进先出 LIFO', '先进先出 FIFO'],
              ['插入位置', '栈顶', '队尾'],
              ['删除位置', '栈顶', '队头'],
              ['操作名称', 'Push / Pop', 'Enqueue / Dequeue'],
              ['应用', '递归、表达式、撤销', 'BFS、缓冲区、排队'],
            ]}
          />

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <KnowledgeCard title="📚 栈的类比" color="indigo">
              <ul className="space-y-1">
                <li>一摞盘子</li>
                <li>子弹夹</li>
                <li>浏览器后退</li>
              </ul>
            </KnowledgeCard>

            <KnowledgeCard title="🚶 队列的类比" color="emerald">
              <ul className="space-y-1">
                <li>排队买票</li>
                <li>打印任务队列</li>
                <li>消息队列</li>
              </ul>
            </KnowledgeCard>
          </div>

          <TipBox type="important">
            <strong>循环队列：</strong>
            解决顺序队列"假溢出"问题。队满条件：(rear + 1) % MaxSize == front
            队空条件：front == rear
          </TipBox>
        </div>
      ),
    },
    {
      title: '练习题',
      icon: '✏️',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-800 mb-3">巩固练习</h3>

          <QuizQuestion
            question="1. 元素按 1,2,3,4 顺序入栈，下列哪个不可能是出栈序列？"
            options={[
              '4,3,2,1',
              '1,4,3,2',
              '3,2,1,4',
              '3,1,2,4',
            ]}
            answer={3}
            explanation="3出栈时，1,2已入栈且在栈底。要想1先出栈，必须先让2出栈。所以3,1,2,4是不可能的。"
          />

          <QuizQuestion
            question="2. 顺序栈S的top初始值为-1，现有5个元素入栈后，top的值是？"
            options={[
              '4',
              '5',
              '3',
              '6',
            ]}
            answer={0}
            explanation="top初始为-1，每入栈一个元素top+1。入栈5个元素后：-1+5=4。"
          />

          <QuizQuestion
            question="3. 栈在计算机系统中的哪个应用最为重要？"
            options={[
              '浏览器后退',
              '撤销操作',
              '函数调用和递归',
              '括号匹配',
            ]}
            answer={2}
            explanation="函数调用栈是操作系统最核心的机制之一，每次函数调用都需要使用栈保存返回地址、参数和局部变量。"
          />

          <QuizQuestion
            question="4. 链栈相比顺序栈的主要优点是？"
            options={[
              '访问速度更快',
              '不需要预先分配空间，不会溢出',
              '实现更简单',
              '空间利用率更高',
            ]}
            answer={1}
            explanation="链栈使用动态内存分配，不需要预先确定大小，理论上不会栈满溢出（除非内存耗尽）。"
          />
        </div>
      ),
    },
  ];

  return <TutorialPanel title="栈" sections={sections} />;
}
