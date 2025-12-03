import TutorialPanel, { KnowledgeCard, StepList, CompareTable, CodeExample, TipBox, QuizQuestion } from './TutorialPanel';

export default function LinkedListTutorial() {
  const sections = [
    {
      title: '基础概念',
      icon: '📖',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">什么是链表？</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              链表是一种<strong>动态数据结构</strong>，由一系列<strong>节点</strong>组成。每个节点包含两部分：
              <strong>数据域</strong>（存储数据）和<strong>指针域</strong>（指向下一个节点）。
              链表不需要连续的内存空间，可以灵活地进行插入和删除操作。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <KnowledgeCard title="🔗 节点结构" color="indigo">
              <p>每个节点包含：</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>data</strong>：存储的数据</li>
                <li><strong>next</strong>：指向下一节点的指针</li>
              </ul>
            </KnowledgeCard>

            <KnowledgeCard title="📍 头结点 vs 首元结点" color="emerald">
              <ul className="space-y-1">
                <li><strong>头结点</strong>：不存数据，仅作为起点</li>
                <li><strong>首元结点</strong>：第一个存数据的节点</li>
                <li>头结点让操作更统一，推荐使用</li>
              </ul>
            </KnowledgeCard>
          </div>

          <CodeExample lang="cpp" code={`// 节点定义
struct LNode {
    int data;         // 数据域
    LNode* next;      // 指针域
};
typedef LNode* LinkList;  // 头指针类型

// 带头结点的链表初始化
bool InitList(LinkList &L) {
    L = new LNode;    // 创建头结点
    L->next = NULL;   // 头结点指针置空
    return true;
}`} />

          <TipBox type="tip">
            使用头结点的好处：插入和删除第一个元素时，操作与其他位置完全相同，代码更简洁。
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
            <h3 className="text-lg font-bold text-slate-800 mb-3">插入操作详解</h3>
            <p className="text-slate-600 mb-4">在位置 i 插入元素，需要先找到位置 i-1 的节点（前驱节点）</p>
            
            <StepList steps={[
              { title: '找前驱节点', desc: '从头结点出发，移动 i-1 次找到前驱节点 p' },
              { title: '创建新节点', desc: '为新元素分配内存空间，设置数据' },
              { title: '连接后继', desc: '新节点的 next 指向 p 的下一个节点（s->next = p->next）' },
              { title: '连接前驱', desc: '前驱节点的 next 指向新节点（p->next = s）' },
            ]} />
          </div>

          <TipBox type="warning">
            <strong>顺序很重要！</strong>必须先执行 s→next = p→next，再执行 p→next = s。
            如果顺序反了，会丢失后续节点的地址！
          </TipBox>

          <CodeExample lang="cpp" code={`// 在位置i插入元素e
bool ListInsert(LinkList &L, int i, int e) {
    LNode *p = L;     // p指向头结点
    int j = 0;
    
    // 找到第i-1个节点
    while (p != NULL && j < i-1) {
        p = p->next;
        j++;
    }
    
    if (p == NULL) return false;  // 位置不合法
    
    LNode *s = new LNode;  // 创建新节点
    s->data = e;
    s->next = p->next;     // ① 先连后面
    p->next = s;           // ② 再连前面
    return true;
}`} />

          <div className="mt-6">
            <h3 className="text-lg font-bold text-slate-800 mb-3">删除操作详解</h3>
            <StepList steps={[
              { title: '找前驱节点', desc: '找到待删除节点的前驱节点 p' },
              { title: '标记待删节点', desc: '用指针 q 指向待删除的节点（q = p->next）' },
              { title: '跳过该节点', desc: '让前驱直接指向后继（p->next = q->next）' },
              { title: '释放内存', desc: '删除节点 q，释放其占用的内存' },
            ]} />
          </div>

          <CodeExample lang="cpp" code={`// 删除位置i的元素
bool ListDelete(LinkList &L, int i, int &e) {
    LNode *p = L;
    int j = 0;
    
    while (p != NULL && j < i-1) {
        p = p->next;
        j++;
    }
    
    if (p == NULL || p->next == NULL) 
        return false;
    
    LNode *q = p->next;   // q指向待删节点
    e = q->data;          // 保存被删数据
    p->next = q->next;    // 跳过q
    delete q;             // 释放内存
    return true;
}`} />
        </div>
      ),
    },
    {
      title: '复杂度分析',
      icon: '📊',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-800 mb-3">时间复杂度对比</h3>
          
          <CompareTable
            headers={['操作', '顺序表', '链表', '说明']}
            rows={[
              ['按位查找', 'O(1)', 'O(n)', '顺序表可随机访问，链表需遍历'],
              ['按值查找', 'O(n)', 'O(n)', '都需要遍历查找'],
              ['插入(已知位置)', 'O(n)', 'O(1)', '顺序表需移动元素，链表只改指针'],
              ['删除(已知位置)', 'O(n)', 'O(1)', '顺序表需移动元素，链表只改指针'],
              ['插入(按位序)', 'O(n)', 'O(n)', '链表需先找到位置'],
            ]}
          />

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <KnowledgeCard title="✅ 链表优点" color="emerald">
              <ul className="list-disc list-inside space-y-1">
                <li>插入删除效率高（不需移动元素）</li>
                <li>内存动态分配，空间利用率高</li>
                <li>大小可变，无需预先分配</li>
              </ul>
            </KnowledgeCard>

            <KnowledgeCard title="❌ 链表缺点" color="rose">
              <ul className="list-disc list-inside space-y-1">
                <li>不支持随机访问，查找慢</li>
                <li>每个节点需额外存储指针</li>
                <li>缓存不友好（内存不连续）</li>
              </ul>
            </KnowledgeCard>
          </div>

          <TipBox type="important">
            <strong>选择建议：</strong>
            频繁插入删除用链表，频繁查找用顺序表。如果元素数量固定且需要随机访问，选顺序表。
          </TipBox>
        </div>
      ),
    },
    {
      title: '常见错误',
      icon: '⚠️',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-800 mb-3">新手常犯错误</h3>

          <div className="space-y-4">
            <KnowledgeCard title="❌ 错误1：插入时顺序写反" color="rose">
              <p className="mb-2">错误写法：</p>
              <code className="bg-slate-800 text-rose-400 px-2 py-1 rounded text-sm">
                p→next = s; s→next = p→next;
              </code>
              <p className="mt-2">后果：丢失原来 p→next 指向的节点，造成内存泄漏！</p>
              <p className="text-emerald-600 mt-2">✓ 正确：先 s→next = p→next，再 p→next = s</p>
            </KnowledgeCard>

            <KnowledgeCard title="❌ 错误2：忘记检查空指针" color="rose">
              <p className="mb-2">问题代码：</p>
              <code className="bg-slate-800 text-rose-400 px-2 py-1 rounded text-sm">
                while (p→next != NULL) // 如果p本身是NULL呢？
              </code>
              <p className="mt-2">后果：访问空指针导致程序崩溃！</p>
              <p className="text-emerald-600 mt-2">✓ 正确：先检查 p != NULL</p>
            </KnowledgeCard>

            <KnowledgeCard title="❌ 错误3：删除后忘记释放内存" color="rose">
              <p className="mb-2">问题代码：</p>
              <code className="bg-slate-800 text-rose-400 px-2 py-1 rounded text-sm">
                p→next = q→next; // 没有 delete q
              </code>
              <p className="mt-2">后果：内存泄漏，程序长时间运行会耗尽内存！</p>
              <p className="text-emerald-600 mt-2">✓ 正确：删除前用指针保存，删除后 delete</p>
            </KnowledgeCard>

            <KnowledgeCard title="❌ 错误4：位置计算错误" color="rose">
              <p>链表位置通常从1开始（不是0），循环条件 j &lt; i-1 找的是第 i-1 个节点。</p>
              <p className="text-emerald-600 mt-2">✓ 建议：画图理解，用具体例子验证</p>
            </KnowledgeCard>
          </div>
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
            question="1. 在单链表中，要删除某个节点，必须知道什么？"
            options={[
              '该节点的地址',
              '该节点的前驱节点地址',
              '该节点的后继节点地址',
              '链表的长度',
            ]}
            answer={1}
            explanation="删除节点需要修改其前驱节点的指针，所以必须知道前驱节点的地址。这也是单链表的一个缺点。"
          />

          <QuizQuestion
            question="2. 带头结点的单链表 L 为空的条件是？"
            options={[
              'L == NULL',
              'L->next == NULL',
              'L->next == L',
              'L->data == 0',
            ]}
            answer={1}
            explanation="带头结点的链表，头结点始终存在。当 L->next == NULL 时，说明头结点后面没有数据节点，链表为空。"
          />

          <QuizQuestion
            question="3. 在位置3插入新节点，需要找到哪个位置的节点？"
            options={[
              '位置1的节点',
              '位置2的节点',
              '位置3的节点',
              '位置4的节点',
            ]}
            answer={1}
            explanation="在位置i插入，需要找到位置i-1的节点（前驱节点），然后在它后面插入新节点。位置3插入需要找位置2。"
          />

          <QuizQuestion
            question="4. 单链表插入操作的时间复杂度是？"
            options={[
              'O(1)',
              'O(log n)',
              'O(n)',
              'O(n²)',
            ]}
            answer={2}
            explanation="虽然插入本身只需要修改指针（O(1)），但需要先遍历找到插入位置，最坏情况需要遍历整个链表，所以是O(n)。"
          />
        </div>
      ),
    },
  ];

  return <TutorialPanel title="单链表" sections={sections} />;
}
