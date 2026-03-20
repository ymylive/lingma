import type { LessonContent } from './types';
import {
  KnowledgeCard,
  CompareTable,
  CodeExample,
  TipBox,
} from '../../components/tutorials/TutorialPanel';

/* eslint-disable no-irregular-whitespace */

export const treeLessons: Record<string, LessonContent> = {
  'tree/basics': {
    title: '树的基本概念',
    category: '树',
    duration: '20分钟',
    demoLink: '/algorithms/binary-tree',
    sections: [
      {
        title: '什么是树',
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              <strong>树</strong>是n个节点的有限集合，当n=0时为空树。非空树满足：
              有且仅有一个<strong>根节点</strong>，其余节点可分为若干互不相交的子树。
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <KnowledgeCard title="🌳 树的特点" color="indigo">
                <ul className="list-disc list-inside space-y-1">
                  <li>n个节点有n-1条边</li>
                  <li>任意两节点间只有一条路径</li>
                  <li>没有回路（环）</li>
                </ul>
              </KnowledgeCard>
              <KnowledgeCard title="📝 基本术语" color="emerald">
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>根</strong>：没有父节点的节点</li>
                  <li><strong>叶子</strong>：没有子节点的节点</li>
                  <li><strong>深度</strong>：从根到该节点的层数</li>
                </ul>
              </KnowledgeCard>
            </div>
          </div>
        ),
      },
      {
        title: '二叉树',
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              <strong>二叉树</strong>是每个节点最多有两个子节点的树，分别称为左子树和右子树。
            </p>
            <CompareTable
              headers={['类型', '定义', '性质']}
              rows={[
                ['满二叉树', '每层都是满的', '深度h有 2^h-1 个节点'],
                ['完全二叉树', '除最后一层外都满，最后一层左对齐', '堆的基础'],
                ['二叉搜索树', '左子树 < 根 < 右子树', '中序遍历有序'],
                ['平衡二叉树', '左右子树高度差≤1', 'AVL树、红黑树'],
              ]}
            />
            <TipBox type="tip">
              二叉树的第i层最多有 2^(i-1) 个节点；深度为h的二叉树最多有 2^h-1 个节点。
            </TipBox>
          </div>
        ),
      },
    ],
  },
  'tree/traversal': {
    title: '二叉树遍历',
    category: '树',
    duration: '30分钟',
    demoLink: '/algorithms/binary-tree',
    sections: [
      {
        title: '四种遍历方式',
        content: (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <KnowledgeCard title="🔄 前序遍历 (根-左-右)" color="indigo">
                <p className="text-sm">先访问根，再左子树，最后右子树</p>
                <p className="text-xs text-slate-500 mt-2">应用：复制二叉树、前缀表达式</p>
              </KnowledgeCard>
              <KnowledgeCard title="🔄 中序遍历 (左-根-右)" color="emerald">
                <p className="text-sm">先左子树，再根，最后右子树</p>
                <p className="text-xs text-slate-500 mt-2">应用：BST得到有序序列</p>
              </KnowledgeCard>
              <KnowledgeCard title="🔄 后序遍历 (左-右-根)" color="amber">
                <p className="text-sm">先左子树，再右子树，最后根</p>
                <p className="text-xs text-slate-500 mt-2">应用：计算目录大小、后缀表达式</p>
              </KnowledgeCard>
              <KnowledgeCard title="🔄 层序遍历 (BFS)" color="rose">
                <p className="text-sm">从上到下，从左到右逐层访问</p>
                <p className="text-xs text-slate-500 mt-2">应用：寻找最短路径、层级打印</p>
              </KnowledgeCard>
            </div>
            <TipBox type="tip">
              <strong>记忆口诀：</strong>前中后说的是"根"的位置！<br/>
              前序=根在前，中序=根在中，后序=根在后
            </TipBox>
          </div>
        ),
      },
      {
        title: '递归实现',
        content: (
          <div className="space-y-4">
            <CodeExample lang="cpp" code={`// 前序遍历
void preOrder(TreeNode* root) {
    if (root == NULL) return;
    visit(root);              // 访问根节点
    preOrder(root->left);     // 递归左子树
    preOrder(root->right);    // 递归右子树
}

// 中序遍历
void inOrder(TreeNode* root) {
    if (root == NULL) return;
    inOrder(root->left);      // 递归左子树
    visit(root);              // 访问根节点
    inOrder(root->right);     // 递归右子树
}

// 后序遍历
void postOrder(TreeNode* root) {
    if (root == NULL) return;
    postOrder(root->left);    // 递归左子树
    postOrder(root->right);   // 递归右子树
    visit(root);              // 访问根节点
}

// 层序遍历（用队列）
void levelOrder(TreeNode* root) {
    if (root == NULL) return;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front(); q.pop();
        visit(node);
        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
}`} />
          </div>
        ),
      },
    ],
  },
  'tree/bst': {
    title: '二叉搜索树',
    category: '树',
    duration: '35分钟',
    demoLink: '/algorithms/bst',
    sections: [
      {
        title: 'BST的特性',
        content: (
          <div className="space-y-4">
            <KnowledgeCard title="🔍 二叉搜索树 (BST)" color="indigo">
              <p><strong>左子树</strong>所有节点的值 &lt; <strong>根节点</strong>的值 &lt; <strong>右子树</strong>所有节点的值</p>
              <p className="text-sm text-slate-500 mt-2">中序遍历BST得到有序序列！</p>
            </KnowledgeCard>
            <div className="flex justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 mb-2">50</div>
                <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
                  <div className="text-center">
                    <div className="text-xl font-bold text-emerald-600">30</div>
                    <div className="flex gap-4">
                      <span className="text-lg">20</span>
                      <span className="text-lg">40</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-amber-600">70</div>
                    <div className="flex gap-4">
                      <span className="text-lg">60</span>
                      <span className="text-lg">80</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CompareTable
              headers={['操作', '平均时间', '最坏时间']}
              rows={[
                ['查找', 'O(log n)', 'O(n) 退化为链表'],
                ['插入', 'O(log n)', 'O(n)'],
                ['删除', 'O(log n)', 'O(n)'],
              ]}
            />
          </div>
        ),
      },
      {
        title: '基本操作',
        content: (
          <div className="space-y-4">
            <CodeExample lang="cpp" code={`// BST查找
TreeNode* search(TreeNode* root, int key) {
    if (root == NULL || root->val == key) 
        return root;
    if (key < root->val)
        return search(root->left, key);   // 在左子树找
    else
        return search(root->right, key);  // 在右子树找
}

// BST插入
TreeNode* insert(TreeNode* root, int key) {
    if (root == NULL) return new TreeNode(key);
    if (key < root->val)
        root->left = insert(root->left, key);
    else
        root->right = insert(root->right, key);
    return root;
}

// BST删除（三种情况）
// 1. 叶子节点：直接删除
// 2. 只有一个子节点：用子节点替代
// 3. 有两个子节点：用右子树最小值替代`} />
            <TipBox type="important">
              <strong>BST可能退化成链表！</strong>当按顺序插入1,2,3,4,5时，会变成一条链。<br/>
              解决方案：AVL树、红黑树等自平衡BST。
            </TipBox>
          </div>
        ),
      },
    ],
  },
  'tree/heap': {
    title: '堆',
    category: '树',
    duration: '30分钟',
    demoLink: '/algorithms/binary-tree',
    sections: [
      {
        title: '堆的概念',
        content: (
          <div className="space-y-4">
            <KnowledgeCard title="📊 堆 = 完全二叉树 + 堆序性" color="rose">
              <p><strong>大顶堆</strong>：每个节点 ≥ 其子节点（根是最大值）</p>
              <p><strong>小顶堆</strong>：每个节点 ≤ 其子节点（根是最小值）</p>
            </KnowledgeCard>
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100 p-6 dark:from-rose-950/40 dark:to-pink-950/30 dark:border-rose-800/60">
              <h4 className="text-lg font-bold text-rose-800 mb-3 dark:text-rose-200">🏆 生活例子：公司层级</h4>
              <p className="text-slate-600 text-sm dark:text-slate-300">大顶堆就像公司：老板(根)工资最高，每个上级工资都比下属高。</p>
            </div>
            <CompareTable
              headers={['操作', '时间复杂度', '说明']}
              rows={[
                ['获取最值', 'O(1)', '直接返回根节点'],
                ['插入', 'O(log n)', '上浮调整'],
                ['删除最值', 'O(log n)', '下沉调整'],
                ['建堆', 'O(n)', '从最后一个非叶节点开始调整'],
              ]}
            />
          </div>
        ),
      },
      {
        title: '堆的应用',
        content: (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <KnowledgeCard title="📊 堆排序" color="indigo">
                <p className="text-sm">1. 建大顶堆</p>
                <p className="text-sm">2. 取堆顶放末尾</p>
                <p className="text-sm">3. 调整堆，重复</p>
                <p className="text-xs text-slate-500 mt-2">时间O(nlogn)，空间O(1)</p>
              </KnowledgeCard>
              <KnowledgeCard title="🏆 优先队列" color="emerald">
                <p className="text-sm">用堆实现，每次取优先级最高的元素</p>
                <p className="text-xs text-slate-500 mt-2">应用：任务调度、Dijkstra算法</p>
              </KnowledgeCard>
              <KnowledgeCard title="🔢 Top-K问题" color="amber">
                <p className="text-sm">找最大的K个数：用小顶堆</p>
                <p className="text-sm">找最小的K个数：用大顶堆</p>
              </KnowledgeCard>
              <KnowledgeCard title="📈 合并K个有序链表" color="rose">
                <p className="text-sm">用小顶堆维护每个链表的当前最小值</p>
              </KnowledgeCard>
            </div>
            <TipBox type="tip">
              <strong>堆用数组存储：</strong>父节点i的左孩子是2i+1，右孩子是2i+2，父节点是(i-1)/2
            </TipBox>
          </div>
        ),
      },
    ],
  },
  // ========== 查找（补充） ==========
};

