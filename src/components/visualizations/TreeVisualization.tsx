import { useState, useEffect, useRef, useCallback } from 'react';

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  status: 'normal' | 'visiting' | 'visited';
}

interface Step {
  tree: TreeNode;
  result: number[];
  line: number;
  desc: string;
}

type Traversal = 'preorder' | 'inorder' | 'postorder' | 'level';
type Lang = 'cpp' | 'java' | 'python';

const TRAVERSALS: Record<Traversal, { name: string; order: string; use: string }> = {
  preorder: { name: '先序遍历', order: '根 → 左 → 右', use: '复制树、前缀表达式' },
  inorder: { name: '中序遍历', order: '左 → 根 → 右', use: 'BST排序输出' },
  postorder: { name: '后序遍历', order: '左 → 右 → 根', use: '删除树、后缀表达式' },
  level: { name: '层序遍历', order: '按层从上到下', use: '层级打印、BFS' },
};

const LANG_NAMES: Record<Lang, string> = { cpp: 'C++', java: 'Java', python: 'Python' };

const CODE: Record<Traversal, Record<Lang, { text: string; indent: number }[]>> = {
  preorder: {
    cpp: [
      { text: 'void preOrder(Node* root) {', indent: 0 },
      { text: 'if (!root) return;', indent: 1 },
      { text: 'visit(root);', indent: 1 },
      { text: 'preOrder(root->left);', indent: 1 },
      { text: 'preOrder(root->right);', indent: 1 },
      { text: '}', indent: 0 },
    ],
    java: [
      { text: 'void preOrder(Node root) {', indent: 0 },
      { text: 'if (root == null) return;', indent: 1 },
      { text: 'visit(root);', indent: 1 },
      { text: 'preOrder(root.left);', indent: 1 },
      { text: 'preOrder(root.right);', indent: 1 },
      { text: '}', indent: 0 },
    ],
    python: [
      { text: 'def preorder(root):', indent: 0 },
      { text: 'if not root: return', indent: 1 },
      { text: 'visit(root)', indent: 1 },
      { text: 'preorder(root.left)', indent: 1 },
      { text: 'preorder(root.right)', indent: 1 },
    ],
  },
  inorder: {
    cpp: [
      { text: 'void inOrder(Node* root) {', indent: 0 },
      { text: 'if (!root) return;', indent: 1 },
      { text: 'inOrder(root->left);', indent: 1 },
      { text: 'visit(root);', indent: 1 },
      { text: 'inOrder(root->right);', indent: 1 },
      { text: '}', indent: 0 },
    ],
    java: [
      { text: 'void inOrder(Node root) {', indent: 0 },
      { text: 'if (root == null) return;', indent: 1 },
      { text: 'inOrder(root.left);', indent: 1 },
      { text: 'visit(root);', indent: 1 },
      { text: 'inOrder(root.right);', indent: 1 },
      { text: '}', indent: 0 },
    ],
    python: [
      { text: 'def inorder(root):', indent: 0 },
      { text: 'if not root: return', indent: 1 },
      { text: 'inorder(root.left)', indent: 1 },
      { text: 'visit(root)', indent: 1 },
      { text: 'inorder(root.right)', indent: 1 },
    ],
  },
  postorder: {
    cpp: [
      { text: 'void postOrder(Node* root) {', indent: 0 },
      { text: 'if (!root) return;', indent: 1 },
      { text: 'postOrder(root->left);', indent: 1 },
      { text: 'postOrder(root->right);', indent: 1 },
      { text: 'visit(root);', indent: 1 },
      { text: '}', indent: 0 },
    ],
    java: [
      { text: 'void postOrder(Node root) {', indent: 0 },
      { text: 'if (root == null) return;', indent: 1 },
      { text: 'postOrder(root.left);', indent: 1 },
      { text: 'postOrder(root.right);', indent: 1 },
      { text: 'visit(root);', indent: 1 },
      { text: '}', indent: 0 },
    ],
    python: [
      { text: 'def postorder(root):', indent: 0 },
      { text: 'if not root: return', indent: 1 },
      { text: 'postorder(root.left)', indent: 1 },
      { text: 'postorder(root.right)', indent: 1 },
      { text: 'visit(root)', indent: 1 },
    ],
  },
  level: {
    cpp: [
      { text: 'void levelOrder(Node* root) {', indent: 0 },
      { text: 'queue<Node*> q;', indent: 1 },
      { text: 'q.push(root);', indent: 1 },
      { text: 'while (!q.empty()) {', indent: 1 },
      { text: 'Node* p = q.front(); q.pop();', indent: 2 },
      { text: 'visit(p);', indent: 2 },
      { text: 'if (p->left) q.push(p->left);', indent: 2 },
      { text: 'if (p->right) q.push(p->right);', indent: 2 },
      { text: '}}', indent: 0 },
    ],
    java: [
      { text: 'void levelOrder(Node root) {', indent: 0 },
      { text: 'Queue<Node> q = new LinkedList<>();', indent: 1 },
      { text: 'q.offer(root);', indent: 1 },
      { text: 'while (!q.isEmpty()) {', indent: 1 },
      { text: 'Node p = q.poll();', indent: 2 },
      { text: 'visit(p);', indent: 2 },
      { text: 'if (p.left != null) q.offer(p.left);', indent: 2 },
      { text: 'if (p.right != null) q.offer(p.right);', indent: 2 },
      { text: '}}', indent: 0 },
    ],
    python: [
      { text: 'def level_order(root):', indent: 0 },
      { text: 'from collections import deque', indent: 1 },
      { text: 'q = deque([root])', indent: 1 },
      { text: 'while q:', indent: 1 },
      { text: 'p = q.popleft()', indent: 2 },
      { text: 'visit(p)', indent: 2 },
      { text: 'if p.left: q.append(p.left)', indent: 2 },
      { text: 'if p.right: q.append(p.right)', indent: 2 },
    ],
  },
};

const createTree = (): TreeNode => ({
  value: 50, status: 'normal',
  left: { value: 30, status: 'normal',
    left: { value: 20, status: 'normal', left: null, right: null },
    right: { value: 40, status: 'normal', left: null, right: null }
  },
  right: { value: 70, status: 'normal',
    left: { value: 60, status: 'normal', left: null, right: null },
    right: { value: 80, status: 'normal', left: null, right: null }
  }
});

// 节点位置映射
const NODES = [
  { val: 50, x: 150, y: 30 },
  { val: 30, x: 80, y: 100 },
  { val: 70, x: 220, y: 100 },
  { val: 20, x: 45, y: 170 },
  { val: 40, x: 115, y: 170 },
  { val: 60, x: 185, y: 170 },
  { val: 80, x: 255, y: 170 },
];

export default function TreeVisualization() {
  const [traversal, setTraversal] = useState<Traversal>('preorder');
  const [lang, setLang] = useState<Lang>('cpp');
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<number | null>(null);

  const cloneTree = useCallback((node: TreeNode | null): TreeNode | null => {
    if (!node) return null;
    return { ...node, left: cloneTree(node.left), right: cloneTree(node.right) };
  }, []);

  const updateNode = useCallback((root: TreeNode, val: number, status: 'normal' | 'visiting' | 'visited'): TreeNode => {
    const t = cloneTree(root) as TreeNode;
    const update = (n: TreeNode | null): boolean => {
      if (!n) return false;
      if (n.value === val) { n.status = status; return true; }
      return update(n.left) || update(n.right);
    };
    update(t);
    return t;
  }, [cloneTree]);

  // 生成先序遍历步骤
  const generatePreorderSteps = useCallback(() => {
    const result: Step[] = [];
    const visited: number[] = [];
    
    const traverse = (node: TreeNode | null, tree: TreeNode) => {
      if (!node) return tree;
      
      // 访问节点
      let t = updateNode(tree, node.value, 'visiting');
      result.push({ tree: t, result: [...visited], line: 2, desc: `📍 访问节点 ${node.value}` });
      
      visited.push(node.value);
      t = updateNode(t, node.value, 'visited');
      result.push({ tree: t, result: [...visited], line: 2, desc: `✓ 节点 ${node.value} 已访问，加入结果` });
      
      // 递归左子树
      if (node.left) {
        result.push({ tree: t, result: [...visited], line: 3, desc: `↙️ 递归进入左子树 (节点${node.left.value})` });
        t = traverse(node.left, t);
      }
      
      // 递归右子树  
      if (node.right) {
        result.push({ tree: t, result: [...visited], line: 4, desc: `↘️ 递归进入右子树 (节点${node.right.value})` });
        t = traverse(node.right, t);
      }
      
      return t;
    };
    
    const initTree = createTree();
    result.push({ tree: initTree, result: [], line: 0, desc: '🚀 开始先序遍历：根 → 左 → 右' });
    traverse(initTree, initTree);
    result.push({ tree: result[result.length - 1].tree, result: visited, line: -1, desc: `🎉 先序遍历完成！结果: ${visited.join(' → ')}` });
    
    return result;
  }, [updateNode]);

  // 生成中序遍历步骤
  const generateInorderSteps = useCallback(() => {
    const result: Step[] = [];
    const visited: number[] = [];
    
    const traverse = (node: TreeNode | null, tree: TreeNode) => {
      if (!node) return tree;
      
      // 递归左子树
      let t = tree;
      if (node.left) {
        result.push({ tree: t, result: [...visited], line: 2, desc: `↙️ 递归进入左子树 (节点${node.left.value})` });
        t = traverse(node.left, t);
      }
      
      // 访问节点
      t = updateNode(t, node.value, 'visiting');
      result.push({ tree: t, result: [...visited], line: 3, desc: `📍 访问节点 ${node.value}` });
      
      visited.push(node.value);
      t = updateNode(t, node.value, 'visited');
      result.push({ tree: t, result: [...visited], line: 3, desc: `✓ 节点 ${node.value} 已访问，加入结果` });
      
      // 递归右子树
      if (node.right) {
        result.push({ tree: t, result: [...visited], line: 4, desc: `↘️ 递归进入右子树 (节点${node.right.value})` });
        t = traverse(node.right, t);
      }
      
      return t;
    };
    
    const initTree = createTree();
    result.push({ tree: initTree, result: [], line: 0, desc: '🚀 开始中序遍历：左 → 根 → 右' });
    traverse(initTree, initTree);
    result.push({ tree: result[result.length - 1].tree, result: visited, line: -1, desc: `🎉 中序遍历完成！结果: ${visited.join(' → ')}` });
    
    return result;
  }, [updateNode]);

  // 生成后序遍历步骤
  const generatePostorderSteps = useCallback(() => {
    const result: Step[] = [];
    const visited: number[] = [];
    
    const traverse = (node: TreeNode | null, tree: TreeNode) => {
      if (!node) return tree;
      
      let t = tree;
      // 递归左子树
      if (node.left) {
        result.push({ tree: t, result: [...visited], line: 2, desc: `↙️ 递归进入左子树 (节点${node.left.value})` });
        t = traverse(node.left, t);
      }
      
      // 递归右子树
      if (node.right) {
        result.push({ tree: t, result: [...visited], line: 3, desc: `↘️ 递归进入右子树 (节点${node.right.value})` });
        t = traverse(node.right, t);
      }
      
      // 访问节点
      t = updateNode(t, node.value, 'visiting');
      result.push({ tree: t, result: [...visited], line: 4, desc: `📍 访问节点 ${node.value}` });
      
      visited.push(node.value);
      t = updateNode(t, node.value, 'visited');
      result.push({ tree: t, result: [...visited], line: 4, desc: `✓ 节点 ${node.value} 已访问，加入结果` });
      
      return t;
    };
    
    const initTree = createTree();
    result.push({ tree: initTree, result: [], line: 0, desc: '🚀 开始后序遍历：左 → 右 → 根' });
    traverse(initTree, initTree);
    result.push({ tree: result[result.length - 1].tree, result: visited, line: -1, desc: `🎉 后序遍历完成！结果: ${visited.join(' → ')}` });
    
    return result;
  }, [updateNode]);

  // 生成层序遍历步骤
  const generateLevelorderSteps = useCallback(() => {
    const result: Step[] = [];
    const visited: number[] = [];
    const initTree = createTree();
    
    result.push({ tree: initTree, result: [], line: 0, desc: '🚀 开始层序遍历（使用队列）' });
    
    const queue: TreeNode[] = [initTree];
    let t = cloneTree(initTree) as TreeNode;
    result.push({ tree: t, result: [], line: 2, desc: '📥 将根节点 50 入队' });
    
    while (queue.length > 0) {
      const node = queue.shift()!;
      result.push({ tree: t, result: [...visited], line: 4, desc: `📤 取出队首节点 ${node.value}` });
      
      t = updateNode(t, node.value, 'visiting');
      result.push({ tree: t, result: [...visited], line: 5, desc: `📍 访问节点 ${node.value}` });
      
      visited.push(node.value);
      t = updateNode(t, node.value, 'visited');
      result.push({ tree: t, result: [...visited], line: 5, desc: `✓ 节点 ${node.value} 已访问` });
      
      if (node.left) {
        queue.push(node.left);
        result.push({ tree: t, result: [...visited], line: 6, desc: `📥 左孩子 ${node.left.value} 入队` });
      }
      if (node.right) {
        queue.push(node.right);
        result.push({ tree: t, result: [...visited], line: 7, desc: `📥 右孩子 ${node.right.value} 入队` });
      }
    }
    
    result.push({ tree: t, result: visited, line: -1, desc: `🎉 层序遍历完成！结果: ${visited.join(' → ')}` });
    return result;
  }, [cloneTree, updateNode]);

  const start = () => {
    let newSteps: Step[] = [];
    if (traversal === 'preorder') newSteps = generatePreorderSteps();
    else if (traversal === 'inorder') newSteps = generateInorderSteps();
    else if (traversal === 'postorder') newSteps = generatePostorderSteps();
    else newSteps = generateLevelorderSteps();
    
    setSteps(newSteps);
    setStepIdx(0);
    setPlaying(false);  // 默认不自动播放，让用户手动点击
  };

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSteps([]);
    setStepIdx(-1);
    setPlaying(false);
  };

  // 自动播放
  useEffect(() => {
    if (!playing || stepIdx < 0 || steps.length === 0) return;
    if (stepIdx >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    timerRef.current = window.setTimeout(() => setStepIdx(i => i + 1), 1200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [playing, stepIdx, steps]);

  const currentStep = steps[stepIdx];
  const displayTree = currentStep?.tree || createTree();
  const displayResult = currentStep?.result || [];
  const displayLine = currentStep?.line ?? -1;
  const displayDesc = currentStep?.desc || '选择遍历方式，点击"开始"生成步骤';

  const getNodeStatus = (val: number): string => {
    const find = (n: TreeNode | null): string | null => {
      if (!n) return null;
      if (n.value === val) return n.status;
      return find(n.left) || find(n.right);
    };
    return find(displayTree) || 'normal';
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            {(Object.keys(TRAVERSALS) as Traversal[]).map(t => (
              <button key={t} onClick={() => { setTraversal(t); reset(); }} disabled={steps.length > 0}
                className={'px-3 py-1.5 rounded-md text-xs font-medium transition-all ' +
                  (traversal === t ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-300')}>
                {TRAVERSALS[t].name}
              </button>
            ))}
          </div>
          <button onClick={start} disabled={steps.length > 0}
            className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
            开始遍历
          </button>
          <button onClick={reset} className="px-4 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600">重置</button>
          
          {/* 步进控制 */}
          {steps.length > 0 && (
            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-600 pl-3">
              <button onClick={() => setStepIdx(i => Math.max(0, i - 1))} disabled={stepIdx <= 0}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-slate-300 dark:hover:bg-slate-500">
                ◀ 上一步
              </button>
              <span className="text-xs text-slate-500 dark:text-slate-400 min-w-[60px] text-center">{stepIdx + 1} / {steps.length}</span>
              <button onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))} disabled={stepIdx >= steps.length - 1}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-slate-300 dark:hover:bg-slate-500">
                下一步 ▶
              </button>
              {!playing ? (
                <button onClick={() => setPlaying(true)} disabled={stepIdx >= steps.length - 1}
                  className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                  ▶ 自动
                </button>
              ) : (
                <button onClick={() => setPlaying(false)}
                  className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium">
                  ⏸ 暂停
                </button>
              )}
            </div>
          )}
          
          {displayResult.length > 0 && (
            <div className="ml-auto text-sm">
              <span className="text-slate-500 dark:text-slate-400">结果: </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">{displayResult.join(' → ')}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-slate-800 rounded-xl p-6">
          <div className="mb-4 px-4 py-2 bg-slate-700/50 rounded-lg text-white text-sm">{displayDesc}</div>
          <svg width="100%" height="220" viewBox="0 0 300 220">
            {/* 连线 */}
            <line x1="150" y1="50" x2="80" y2="80" stroke="#475569" strokeWidth="2"/>
            <line x1="150" y1="50" x2="220" y2="80" stroke="#475569" strokeWidth="2"/>
            <line x1="80" y1="120" x2="45" y2="150" stroke="#475569" strokeWidth="2"/>
            <line x1="80" y1="120" x2="115" y2="150" stroke="#475569" strokeWidth="2"/>
            <line x1="220" y1="120" x2="185" y2="150" stroke="#475569" strokeWidth="2"/>
            <line x1="220" y1="120" x2="255" y2="150" stroke="#475569" strokeWidth="2"/>
            
            {/* 节点 */}
            {NODES.map(n => {
              const status = getNodeStatus(n.val);
              return (
                <g key={n.val}>
                  <circle cx={n.x} cy={n.y} r="22"
                    className={'transition-all duration-300 ' +
                      (status === 'visiting' ? 'fill-amber-400' :
                       status === 'visited' ? 'fill-emerald-500' : 'fill-indigo-500')} />
                  <text x={n.x} y={n.y + 5} textAnchor="middle" className="fill-white font-bold text-sm">{n.val}</text>
                </g>
              );
            })}
          </svg>
          <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-slate-700">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-indigo-500"></div><span className="text-slate-400 text-xs">未访问</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-amber-400"></div><span className="text-slate-400 text-xs">正在访问</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-emerald-500"></div><span className="text-slate-400 text-xs">已访问</span></div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-300 font-medium text-sm">{TRAVERSALS[traversal].name}</span>
            <div className="flex bg-slate-700 rounded p-0.5">
              {(['cpp', 'java', 'python'] as Lang[]).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className={'px-2 py-0.5 rounded text-xs transition-all ' + (lang === l ? 'bg-slate-600 text-white' : 'text-slate-400')}>
                  {LANG_NAMES[l]}
                </button>
              ))}
            </div>
          </div>
          <div className="font-mono text-xs space-y-0.5">
            {CODE[traversal][lang].map((item: { text: string; indent: number }, i: number) => (
              <div key={i}
                className={'py-0.5 px-2 rounded transition-all duration-200 ' + (displayLine === i ? 'bg-amber-500/30 text-amber-200' : 'text-slate-400')}
                style={{ paddingLeft: (item.indent * 12 + 8) + 'px' }}>
                <span className="text-slate-600 select-none w-4 inline-block text-right mr-2">{i + 1}</span>
                {item.text}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-slate-400 text-xs mb-2">遍历顺序: <span className="text-indigo-400">{TRAVERSALS[traversal].order}</span></p>
            <p className="text-slate-500 text-xs">
              {traversal === 'preorder' && '先序遍历常用于：复制树、表达式树的前缀表示'}
              {traversal === 'inorder' && '中序遍历BST可得到有序序列'}
              {traversal === 'postorder' && '后序遍历常用于：删除树、表达式求值'}
              {traversal === 'level' && '层序遍历常用于：BFS、求树的宽度'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
