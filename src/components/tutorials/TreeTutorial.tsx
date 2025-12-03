import TutorialPanel, { KnowledgeCard, StepList, CompareTable, CodeExample, TipBox, QuizQuestion } from './TutorialPanel';

export default function TreeTutorial() {
  const sections = [
    {
      title: '树的基础',
      icon: '📖',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">什么是二叉树？</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              二叉树是每个节点<strong>最多有两个子节点</strong>的树结构，分别称为<strong>左子树</strong>和<strong>右子树</strong>。
              二叉树是最常用的树结构，很多高级数据结构（如堆、BST）都基于二叉树。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <KnowledgeCard title="🌳 基本术语" color="indigo">
              <ul className="space-y-1">
                <li><strong>根节点</strong>：最顶层的节点</li>
                <li><strong>叶子节点</strong>：没有子节点的节点</li>
                <li><strong>深度</strong>：从根到该节点的层数</li>
                <li><strong>高度</strong>：从该节点到最远叶子的层数</li>
              </ul>
            </KnowledgeCard>

            <KnowledgeCard title="📊 特殊二叉树" color="emerald">
              <ul className="space-y-1">
                <li><strong>满二叉树</strong>：每层都是满的</li>
                <li><strong>完全二叉树</strong>：除最后一层外都满，最后一层左对齐</li>
                <li><strong>二叉搜索树</strong>：左 &lt; 根 &lt; 右</li>
              </ul>
            </KnowledgeCard>
          </div>

          <CodeExample lang="cpp" code={`// 二叉树节点定义
struct TreeNode {
    int data;
    TreeNode* left;   // 左子树
    TreeNode* right;  // 右子树
};

// 创建节点
TreeNode* createNode(int val) {
    TreeNode* node = new TreeNode;
    node->data = val;
    node->left = node->right = NULL;
    return node;
}`} />

          <TipBox type="tip">
            <strong>性质记忆：</strong>
            n个节点的二叉树有 n+1 个空指针（可用于线索化）；
            第i层最多有 2^(i-1) 个节点；
            高度为h的二叉树最多有 2^h - 1 个节点。
          </TipBox>
        </div>
      ),
    },
    {
      title: '遍历方法',
      icon: '🚶',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">四种遍历方式</h3>
            <p className="text-slate-600 mb-4">
              遍历是访问树中所有节点的过程，根据访问根节点的时机不同，分为以下四种方式：
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <KnowledgeCard title="1️⃣ 先序遍历 (Pre-order)" color="indigo">
              <p className="font-medium">根 → 左 → 右</p>
              <p className="mt-2">应用：复制树、前缀表达式</p>
              <p className="text-slate-500 mt-1">记忆：根在"先"</p>
            </KnowledgeCard>

            <KnowledgeCard title="2️⃣ 中序遍历 (In-order)" color="emerald">
              <p className="font-medium">左 → 根 → 右</p>
              <p className="mt-2">应用：BST得到有序序列</p>
              <p className="text-slate-500 mt-1">记忆：根在"中"间</p>
            </KnowledgeCard>

            <KnowledgeCard title="3️⃣ 后序遍历 (Post-order)" color="amber">
              <p className="font-medium">左 → 右 → 根</p>
              <p className="mt-2">应用：删除树、后缀表达式</p>
              <p className="text-slate-500 mt-1">记忆：根在"后"</p>
            </KnowledgeCard>

            <KnowledgeCard title="4️⃣ 层序遍历 (Level-order)" color="rose">
              <p className="font-medium">按层从上到下，从左到右</p>
              <p className="mt-2">应用：求树的宽度、BFS</p>
              <p className="text-slate-500 mt-1">需要使用队列辅助</p>
            </KnowledgeCard>
          </div>

          <CodeExample lang="cpp" code={`// 先序遍历（递归）
void preOrder(TreeNode* root) {
    if (root == NULL) return;
    visit(root);           // 访问根
    preOrder(root->left);  // 遍历左子树
    preOrder(root->right); // 遍历右子树
}

// 中序遍历
void inOrder(TreeNode* root) {
    if (root == NULL) return;
    inOrder(root->left);   // 先左
    visit(root);           // 再根
    inOrder(root->right);  // 最后右
}

// 后序遍历
void postOrder(TreeNode* root) {
    if (root == NULL) return;
    postOrder(root->left);
    postOrder(root->right);
    visit(root);           // 最后访问根
}

// 层序遍历（需要队列）
void levelOrder(TreeNode* root) {
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front();
        q.pop();
        visit(node);
        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
}`} />

          <TipBox type="important">
            <strong>由遍历序列构造二叉树：</strong>
            单独的先/中/后序无法唯一确定一棵树。但"先序+中序"或"后序+中序"可以唯一确定。
            中序是必需的，因为它能区分左右子树。
          </TipBox>
        </div>
      ),
    },
    {
      title: '二叉搜索树',
      icon: '🔍',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">二叉搜索树 (BST)</h3>
            <p className="text-slate-600 mb-4">
              二叉搜索树是一种特殊的二叉树，满足：<strong>左子树所有节点 &lt; 根 &lt; 右子树所有节点</strong>。
              这个性质使得查找、插入、删除操作都很高效。
            </p>
          </div>

          <StepList steps={[
            { title: 'BST 查找', desc: '比根小往左找，比根大往右找，相等则找到' },
            { title: 'BST 插入', desc: '按查找规则找到合适的空位置，插入新节点' },
            { title: 'BST 删除', desc: '分三种情况：叶子直接删、有一个子节点用子节点替代、有两个子节点用中序后继替代' },
          ]} />

          <CodeExample lang="cpp" code={`// BST 查找
TreeNode* search(TreeNode* root, int key) {
    if (root == NULL || root->data == key)
        return root;
    if (key < root->data)
        return search(root->left, key);
    else
        return search(root->right, key);
}

// BST 插入
TreeNode* insert(TreeNode* root, int key) {
    if (root == NULL)
        return createNode(key);
    if (key < root->data)
        root->left = insert(root->left, key);
    else if (key > root->data)
        root->right = insert(root->right, key);
    return root;
}`} />

          <CompareTable
            headers={['操作', '平均', '最坏（退化为链表）']}
            rows={[
              ['查找', 'O(log n)', 'O(n)'],
              ['插入', 'O(log n)', 'O(n)'],
              ['删除', 'O(log n)', 'O(n)'],
            ]}
          />

          <TipBox type="warning">
            <strong>BST的缺陷：</strong>
            如果按有序序列插入，BST会退化成链表，时间复杂度变成O(n)。
            解决方法：使用平衡二叉树（AVL树、红黑树）保持平衡。
          </TipBox>
        </div>
      ),
    },
    {
      title: '应用场景',
      icon: '💼',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-800 mb-3">遍历的实际应用</h3>

          <div className="space-y-4">
            <KnowledgeCard title="📁 文件系统" color="indigo">
              <p><strong>先序遍历</strong>：列出目录结构（先显示文件夹，再显示子文件夹）</p>
              <p><strong>后序遍历</strong>：计算目录大小（需要先知道子目录大小）</p>
            </KnowledgeCard>

            <KnowledgeCard title="🧮 表达式树" color="emerald">
              <p><strong>中序遍历</strong>：得到中缀表达式 (3 + 4) * 5</p>
              <p><strong>先序遍历</strong>：得到前缀表达式 * + 3 4 5</p>
              <p><strong>后序遍历</strong>：得到后缀表达式 3 4 + 5 *（计算器常用）</p>
            </KnowledgeCard>

            <KnowledgeCard title="🗂️ 数据库索引" color="amber">
              <p><strong>B树/B+树</strong>：数据库索引的基础</p>
              <p>利用树的有序性质快速定位数据</p>
            </KnowledgeCard>

            <KnowledgeCard title="🎮 游戏/AI" color="rose">
              <p><strong>决策树</strong>：AI决策、博弈树</p>
              <p><strong>场景树</strong>：3D游戏中的空间划分</p>
            </KnowledgeCard>
          </div>

          <TipBox type="tip">
            <strong>面试高频：</strong>
            二叉树的遍历（递归/非递归）、BST操作、求树的高度/宽度、判断是否平衡/对称，是面试常考题目。
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
            question="1. 对二叉搜索树进行哪种遍历可以得到有序序列？"
            options={[
              '先序遍历',
              '中序遍历',
              '后序遍历',
              '层序遍历',
            ]}
            answer={1}
            explanation="中序遍历顺序是左-根-右，由于BST满足 左小于根小于右，所以中序遍历自然得到升序序列。"
          />

          <QuizQuestion
            question="2. 已知先序遍历为ABDEC，中序遍历为DBEAC，则后序遍历为？"
            options={[
              'DEBCA',
              'DEBAC',
              'DBEAC',
              'BDECA',
            ]}
            answer={0}
            explanation="先序第一个A是根。中序中A左边DBE是左子树，右边C是右子树。递归处理可得后序为DEBCA。"
          />

          <QuizQuestion
            question="3. n个节点的二叉树最多有多少层（根为第1层）？"
            options={[
              'n',
              'n-1',
              'log₂n',
              '⌈log₂(n+1)⌉',
            ]}
            answer={0}
            explanation="最坏情况是退化成链表，每层只有一个节点，n个节点就有n层。"
          />

          <QuizQuestion
            question="4. 完全二叉树中，若某节点编号为i（从1开始），则其左孩子编号为？"
            options={[
              'i+1',
              '2i',
              '2i+1',
              'i/2',
            ]}
            answer={1}
            explanation="完全二叉树的重要性质：节点i的左孩子是2i，右孩子是2i+1，父节点是i/2向下取整。这是堆排序的基础。"
          />
        </div>
      ),
    },
  ];

  return <TutorialPanel title="二叉树" sections={sections} />;
}
