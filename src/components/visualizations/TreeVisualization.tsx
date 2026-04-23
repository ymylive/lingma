import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAlgorithmPlayer } from '../../hooks/useAlgorithmPlayer';
import useLowMotionMode from '../../hooks/useLowMotionMode';
import { PlayerControls } from './_shared/PlayerControls';
import { StepNarration } from './_shared/StepNarration';

type NodeStatus = 'normal' | 'visiting' | 'visited';

interface TreeNode {
  id: string;
  value: number | string;
  left?: TreeNode;
  right?: TreeNode;
}

interface Step {
  visitedIds: string[];
  visitingId: string | null;
  line: number;
  description: string;
  result: Array<number | string>;
  // Extension fields: stack/queue contents for recursion / BFS visualization.
  stack?: string[]; // node ids currently on the recursion stack (conceptually)
  queue?: string[]; // node ids in the BFS queue (for level order)
  compareHint?: string; // floating chip text next to the visiting node
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

// Default balanced tree used on first render.
function buildDefaultTree(): TreeNode {
  return {
    id: 'n1',
    value: 50,
    left: {
      id: 'n2',
      value: 30,
      left: { id: 'n4', value: 20 },
      right: { id: 'n5', value: 40 },
    },
    right: {
      id: 'n3',
      value: 70,
      left: { id: 'n6', value: 60 },
      right: { id: 'n7', value: 80 },
    },
  };
}

// Build a BST from an array of values (insertion order).
function buildBstFromArray(values: number[]): TreeNode | null {
  let idCounter = 0;
  const mk = (v: number): TreeNode => ({ id: `b${++idCounter}`, value: v });
  let root: TreeNode | null = null;
  for (const v of values) {
    if (root === null) {
      root = mk(v);
      continue;
    }
    let cur: TreeNode = root;
    while (true) {
      if (v < Number(cur.value)) {
        if (!cur.left) {
          cur.left = mk(v);
          break;
        }
        cur = cur.left;
      } else {
        if (!cur.right) {
          cur.right = mk(v);
          break;
        }
        cur = cur.right;
      }
    }
  }
  return root;
}

/**
 * Simplified Reingold–Tilford layout (preserved from Phase D).
 */
interface Layout {
  positions: Map<string, { x: number; y: number }>;
  width: number;
  height: number;
}

function computeTreeLayout(
  root: TreeNode | null | undefined,
  levelGap = 80,
  siblingGap = 24,
): Layout {
  const positions = new Map<string, { x: number; y: number }>();
  if (!root) {
    return { positions, width: 0, height: 0 };
  }

  interface Sub {
    offsets: Map<string, { x: number; y: number }>;
    leftContour: number[];
    rightContour: number[];
  }

  const walk = (node: TreeNode, depth: number): Sub => {
    if (!node.left && !node.right) {
      const offsets = new Map<string, { x: number; y: number }>();
      offsets.set(node.id, { x: 0, y: depth });
      return {
        offsets,
        leftContour: [0],
        rightContour: [0],
      };
    }

    let leftSub: Sub | null = null;
    let rightSub: Sub | null = null;
    if (node.left) leftSub = walk(node.left, depth + 1);
    if (node.right) rightSub = walk(node.right, depth + 1);

    let leftRootX: number;
    let rightRootX: number;

    if (leftSub && rightSub) {
      const compareLevels = Math.min(leftSub.rightContour.length, rightSub.leftContour.length);
      let minGap = -Infinity;
      for (let i = 0; i < compareLevels; i++) {
        const diff = leftSub.rightContour[i] - rightSub.leftContour[i];
        if (diff > minGap) minGap = diff;
      }
      const shift = minGap + siblingGap;
      leftRootX = 0;
      rightRootX = shift;
    } else if (leftSub) {
      leftRootX = -siblingGap;
      rightRootX = 0;
    } else {
      leftRootX = 0;
      rightRootX = siblingGap;
    }

    let parentX: number;
    if (leftSub && rightSub) {
      parentX = (leftRootX + rightRootX) / 2;
    } else {
      parentX = 0;
    }

    const shiftToZero = -parentX;
    const offsets = new Map<string, { x: number; y: number }>();
    offsets.set(node.id, { x: 0, y: depth });

    if (leftSub) {
      for (const [id, p] of leftSub.offsets) {
        offsets.set(id, { x: p.x + leftRootX + shiftToZero, y: p.y });
      }
    }
    if (rightSub) {
      for (const [id, p] of rightSub.offsets) {
        offsets.set(id, { x: p.x + rightRootX + shiftToZero, y: p.y });
      }
    }

    const leftContour: number[] = [0];
    const rightContour: number[] = [0];

    const addLeft = (sub: Sub, rootOffset: number) => {
      for (let i = 0; i < sub.leftContour.length; i++) {
        const absolute = sub.leftContour[i] + rootOffset + shiftToZero;
        const level = i + 1;
        if (leftContour[level] === undefined) leftContour[level] = absolute;
        else leftContour[level] = Math.min(leftContour[level], absolute);
      }
    };
    const addRight = (sub: Sub, rootOffset: number) => {
      for (let i = 0; i < sub.rightContour.length; i++) {
        const absolute = sub.rightContour[i] + rootOffset + shiftToZero;
        const level = i + 1;
        if (rightContour[level] === undefined) rightContour[level] = absolute;
        else rightContour[level] = Math.max(rightContour[level], absolute);
      }
    };

    if (leftSub) {
      addLeft(leftSub, leftRootX);
      addRight(leftSub, leftRootX);
    }
    if (rightSub) {
      addLeft(rightSub, rightRootX);
      addRight(rightSub, rightRootX);
    }

    return { offsets, leftContour, rightContour };
  };

  const sub = walk(root, 0);

  let minX = Infinity;
  let maxX = -Infinity;
  let maxDepth = 0;
  for (const { x, y } of sub.offsets.values()) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y > maxDepth) maxDepth = y;
  }

  const nodeRadius = 22;
  const horizontalScale = nodeRadius * 2 + siblingGap;
  const padding = nodeRadius + 16;

  for (const [id, p] of sub.offsets) {
    const px = (p.x - minX) * horizontalScale + padding;
    const py = p.y * levelGap + padding;
    positions.set(id, { x: px, y: py });
  }

  const width = (maxX - minX) * horizontalScale + padding * 2;
  const height = maxDepth * levelGap + padding * 2;

  return { positions, width, height };
}

interface EdgeSegment {
  from: string;
  to: string;
  side: 'left' | 'right';
}

function collectEdges(root: TreeNode | null | undefined): EdgeSegment[] {
  const edges: EdgeSegment[] = [];
  const visit = (n: TreeNode | undefined) => {
    if (!n) return;
    if (n.left) {
      edges.push({ from: n.id, to: n.left.id, side: 'left' });
      visit(n.left);
    }
    if (n.right) {
      edges.push({ from: n.id, to: n.right.id, side: 'right' });
      visit(n.right);
    }
  };
  visit(root ?? undefined);
  return edges;
}

function flattenNodes(root: TreeNode | null | undefined): TreeNode[] {
  const out: TreeNode[] = [];
  const visit = (n: TreeNode | undefined) => {
    if (!n) return;
    out.push(n);
    visit(n.left);
    visit(n.right);
  };
  visit(root ?? undefined);
  return out;
}

function computeDepths(root: TreeNode | null | undefined): Map<string, number> {
  const depths = new Map<string, number>();
  const walk = (n: TreeNode | undefined, d: number) => {
    if (!n) return;
    depths.set(n.id, d);
    walk(n.left, d + 1);
    walk(n.right, d + 1);
  };
  walk(root ?? undefined, 0);
  return depths;
}

// ----- Step generators (with stack/queue enrichment) -----

function preorderSteps(root: TreeNode | null | undefined): Step[] {
  const result: Step[] = [];
  const visited: Array<number | string> = [];
  const visitedIds: string[] = [];
  const stack: string[] = [];
  result.push({
    visitedIds: [],
    visitingId: null,
    line: 0,
    description: '🚀 开始先序遍历：根 → 左 → 右',
    result: [],
    stack: [],
  });
  if (!root) return result;
  const inner = (n: TreeNode | undefined) => {
    if (!n) return;
    stack.push(String(n.value));
    result.push({
      visitedIds: [...visitedIds],
      visitingId: n.id,
      line: 2,
      description: `📍 访问节点 ${n.value}`,
      result: [...visited],
      stack: [...stack],
    });
    visitedIds.push(n.id);
    visited.push(n.value);
    result.push({
      visitedIds: [...visitedIds],
      visitingId: null,
      line: 2,
      description: `✓ 节点 ${n.value} 已访问，加入结果`,
      result: [...visited],
      stack: [...stack],
    });
    if (n.left) {
      result.push({
        visitedIds: [...visitedIds],
        visitingId: null,
        line: 3,
        description: `↙️ 递归进入左子树 (节点${n.left.value})`,
        result: [...visited],
        stack: [...stack],
      });
      inner(n.left);
    }
    if (n.right) {
      result.push({
        visitedIds: [...visitedIds],
        visitingId: null,
        line: 4,
        description: `↘️ 递归进入右子树 (节点${n.right.value})`,
        result: [...visited],
        stack: [...stack],
      });
      inner(n.right);
    }
    stack.pop();
  };
  inner(root);
  result.push({
    visitedIds: [...visitedIds],
    visitingId: null,
    line: -1,
    description: `🎉 先序遍历完成！结果: ${visited.join(' → ')}`,
    result: [...visited],
    stack: [],
  });
  return result;
}

function inorderSteps(root: TreeNode | null | undefined): Step[] {
  const result: Step[] = [];
  const visited: Array<number | string> = [];
  const visitedIds: string[] = [];
  const stack: string[] = [];
  result.push({
    visitedIds: [],
    visitingId: null,
    line: 0,
    description: '🚀 开始中序遍历：左 → 根 → 右',
    result: [],
    stack: [],
  });
  if (!root) return result;
  const inner = (n: TreeNode | undefined) => {
    if (!n) return;
    stack.push(String(n.value));
    if (n.left) {
      result.push({
        visitedIds: [...visitedIds],
        visitingId: null,
        line: 2,
        description: `↙️ 递归进入左子树 (节点${n.left.value})`,
        result: [...visited],
        stack: [...stack],
      });
      inner(n.left);
    }
    result.push({
      visitedIds: [...visitedIds],
      visitingId: n.id,
      line: 3,
      description: `📍 访问节点 ${n.value}`,
      result: [...visited],
      stack: [...stack],
    });
    visitedIds.push(n.id);
    visited.push(n.value);
    result.push({
      visitedIds: [...visitedIds],
      visitingId: null,
      line: 3,
      description: `✓ 节点 ${n.value} 已访问，加入结果`,
      result: [...visited],
      stack: [...stack],
    });
    if (n.right) {
      result.push({
        visitedIds: [...visitedIds],
        visitingId: null,
        line: 4,
        description: `↘️ 递归进入右子树 (节点${n.right.value})`,
        result: [...visited],
        stack: [...stack],
      });
      inner(n.right);
    }
    stack.pop();
  };
  inner(root);
  result.push({
    visitedIds: [...visitedIds],
    visitingId: null,
    line: -1,
    description: `🎉 中序遍历完成！结果: ${visited.join(' → ')}`,
    result: [...visited],
    stack: [],
  });
  return result;
}

function postorderSteps(root: TreeNode | null | undefined): Step[] {
  const result: Step[] = [];
  const visited: Array<number | string> = [];
  const visitedIds: string[] = [];
  const stack: string[] = [];
  result.push({
    visitedIds: [],
    visitingId: null,
    line: 0,
    description: '🚀 开始后序遍历：左 → 右 → 根',
    result: [],
    stack: [],
  });
  if (!root) return result;
  const inner = (n: TreeNode | undefined) => {
    if (!n) return;
    stack.push(String(n.value));
    if (n.left) {
      result.push({
        visitedIds: [...visitedIds],
        visitingId: null,
        line: 2,
        description: `↙️ 递归进入左子树 (节点${n.left.value})`,
        result: [...visited],
        stack: [...stack],
      });
      inner(n.left);
    }
    if (n.right) {
      result.push({
        visitedIds: [...visitedIds],
        visitingId: null,
        line: 3,
        description: `↘️ 递归进入右子树 (节点${n.right.value})`,
        result: [...visited],
        stack: [...stack],
      });
      inner(n.right);
    }
    result.push({
      visitedIds: [...visitedIds],
      visitingId: n.id,
      line: 4,
      description: `📍 访问节点 ${n.value}`,
      result: [...visited],
      stack: [...stack],
    });
    visitedIds.push(n.id);
    visited.push(n.value);
    result.push({
      visitedIds: [...visitedIds],
      visitingId: null,
      line: 4,
      description: `✓ 节点 ${n.value} 已访问，加入结果`,
      result: [...visited],
      stack: [...stack],
    });
    stack.pop();
  };
  inner(root);
  result.push({
    visitedIds: [...visitedIds],
    visitingId: null,
    line: -1,
    description: `🎉 后序遍历完成！结果: ${visited.join(' → ')}`,
    result: [...visited],
    stack: [],
  });
  return result;
}

function levelorderSteps(root: TreeNode | null | undefined): Step[] {
  const result: Step[] = [];
  const visited: Array<number | string> = [];
  const visitedIds: string[] = [];
  result.push({
    visitedIds: [],
    visitingId: null,
    line: 0,
    description: '🚀 开始层序遍历（使用队列）',
    result: [],
    queue: [],
  });
  if (!root) return result;
  const queue: TreeNode[] = [root];
  result.push({
    visitedIds: [],
    visitingId: null,
    line: 2,
    description: `📥 将根节点 ${root.value} 入队`,
    result: [],
    queue: queue.map((n) => String(n.value)),
  });
  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push({
      visitedIds: [...visitedIds],
      visitingId: null,
      line: 4,
      description: `📤 取出队首节点 ${node.value}`,
      result: [...visited],
      queue: queue.map((n) => String(n.value)),
    });
    result.push({
      visitedIds: [...visitedIds],
      visitingId: node.id,
      line: 5,
      description: `📍 访问节点 ${node.value}`,
      result: [...visited],
      queue: queue.map((n) => String(n.value)),
    });
    visitedIds.push(node.id);
    visited.push(node.value);
    result.push({
      visitedIds: [...visitedIds],
      visitingId: null,
      line: 5,
      description: `✓ 节点 ${node.value} 已访问`,
      result: [...visited],
      queue: queue.map((n) => String(n.value)),
    });
    if (node.left) {
      queue.push(node.left);
      result.push({
        visitedIds: [...visitedIds],
        visitingId: null,
        line: 6,
        description: `📥 左孩子 ${node.left.value} 入队`,
        result: [...visited],
        queue: queue.map((n) => String(n.value)),
      });
    }
    if (node.right) {
      queue.push(node.right);
      result.push({
        visitedIds: [...visitedIds],
        visitingId: null,
        line: 7,
        description: `📥 右孩子 ${node.right.value} 入队`,
        result: [...visited],
        queue: queue.map((n) => String(n.value)),
      });
    }
  }
  result.push({
    visitedIds: [...visitedIds],
    visitingId: null,
    line: -1,
    description: `🎉 层序遍历完成！结果: ${visited.join(' → ')}`,
    result: [...visited],
    queue: [],
  });
  return result;
}

export default function TreeVisualization() {
  const [traversal, setTraversal] = useState<Traversal>('preorder');
  const [lang, setLang] = useState<Lang>('cpp');
  const [inputValues, setInputValues] = useState('');
  const [tree, setTree] = useState<TreeNode | null>(() => buildDefaultTree());
  const [armed, setArmed] = useState(false);
  const lowMotion = useLowMotionMode();

  const layout = useMemo(() => computeTreeLayout(tree), [tree]);
  const edges = useMemo(() => collectEdges(tree), [tree]);
  const allNodes = useMemo(() => flattenNodes(tree), [tree]);
  const depths = useMemo(() => computeDepths(tree), [tree]);

  const steps = useMemo<Step[]>(() => {
    if (!armed) return [];
    switch (traversal) {
      case 'preorder':
        return preorderSteps(tree);
      case 'inorder':
        return inorderSteps(tree);
      case 'postorder':
        return postorderSteps(tree);
      case 'level':
        return levelorderSteps(tree);
    }
  }, [armed, traversal, tree]);

  const player = useAlgorithmPlayer<Step>({
    steps,
    stepDurationMs: 900,
    autoPlay: false,
  });

  const current = player.currentStep;
  const visitedSet = useMemo(
    () => new Set(current?.visitedIds ?? []),
    [current],
  );
  const displayResult = current?.result ?? [];
  const activeLine = current?.line ?? -1;
  const narrationDescription = current?.description ?? '选择遍历方式，点击"开始"生成步骤';

  const getNodeStatus = useCallback(
    (id: string): NodeStatus => {
      if (current?.visitingId === id) return 'visiting';
      if (visitedSet.has(id)) return 'visited';
      return 'normal';
    },
    [current, visitedSet],
  );

  const start = () => {
    setArmed(true);
  };

  const resetAll = () => {
    setArmed(false);
  };

  const applyCustomTree = () => {
    const parts = inputValues
      .split(/[,，\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);
    const nums = parts.map((p) => Number(p)).filter((n) => !Number.isNaN(n));
    if (nums.length === 0) {
      setTree(buildDefaultTree());
    } else {
      setTree(buildBstFromArray(nums));
    }
    setArmed(false);
  };

  const resetDefaultTree = () => {
    setTree(buildDefaultTree());
    setInputValues('');
    setArmed(false);
  };

  const viewBoxW = Math.max(layout.width, 180);
  const viewBoxH = Math.max(layout.height, 120);

  // Depth indicator (left edge). Build a set of unique y-positions per depth.
  const depthRows = useMemo(() => {
    const byDepth = new Map<number, number>();
    for (const n of allNodes) {
      const p = layout.positions.get(n.id);
      const d = depths.get(n.id);
      if (!p || typeof d !== 'number') continue;
      byDepth.set(d, p.y);
    }
    return Array.from(byDepth.entries()).sort((a, b) => a[0] - b[0]);
  }, [allNodes, layout, depths]);

  // Id → edge lookup so we can highlight traversal path.
  const visitingId = current?.visitingId ?? null;
  const visitedEdges = useMemo(() => {
    // An edge (parent,child) is "visited" if the child has been visited or is being visited.
    const set = new Set<string>();
    const active = new Set<string>(current?.visitedIds ?? []);
    if (visitingId) active.add(visitingId);
    for (const e of edges) {
      if (active.has(e.to)) set.add(`${e.from}->${e.to}`);
    }
    return set;
  }, [edges, current, visitingId]);

  // BST comparison chip text (based on visiting node + root)
  const rootValue = tree ? Number(tree.value) : null;
  const compareHint = useMemo(() => {
    if (!visitingId || rootValue === null) return null;
    const visitingNode = allNodes.find((n) => n.id === visitingId);
    if (!visitingNode) return null;
    const v = Number(visitingNode.value);
    if (Number.isNaN(v)) return null;
    if (visitingNode.id === tree?.id) return `root = ${v}`;
    return v < rootValue ? `${v} < ${rootValue} → 左子树` : `${v} ≥ ${rootValue} → 右子树`;
  }, [visitingId, rootValue, allNodes, tree]);

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            {(Object.keys(TRAVERSALS) as Traversal[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTraversal(t);
                  setArmed(false);
                }}
                disabled={armed}
                className={
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-all ' +
                  (traversal === t
                    ? 'bg-white dark:bg-slate-600 text-klein-600 dark:text-klein-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300')
                }
              >
                {TRAVERSALS[t].name}
              </button>
            ))}
          </div>
          <button
            onClick={start}
            disabled={armed}
            className="px-4 py-1.5 bg-klein-500 text-white rounded-lg text-sm font-medium hover:bg-klein-600 disabled:opacity-50"
          >
            开始遍历
          </button>
          <button
            onClick={resetAll}
            className="px-4 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600"
          >
            重置步骤
          </button>

          <div className="flex items-center gap-2 ml-2">
            <input
              type="text"
              value={inputValues}
              onChange={(e) => setInputValues(e.target.value)}
              placeholder="自定义BST值，逗号分隔"
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white w-56"
            />
            <button
              onClick={applyCustomTree}
              className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600"
            >
              生成树
            </button>
            <button
              onClick={resetDefaultTree}
              className="px-3 py-1.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-500"
            >
              默认树
            </button>
          </div>

          {displayResult.length > 0 && (
            <div className="ml-auto text-sm">
              <span className="text-slate-500 dark:text-slate-400">结果: </span>
              <span className="text-klein-600 dark:text-klein-300 font-mono font-bold">
                {displayResult.join(' → ')}
              </span>
            </div>
          )}
        </div>
      </div>

      {steps.length > 0 && (
        <div className="space-y-2">
          <PlayerControls
            playing={player.playing}
            canStepBack={player.canStepBack}
            canStepForward={player.canStepForward}
            atEnd={player.atEnd}
            speed={player.speed}
            play={player.play}
            pause={player.pause}
            toggle={player.toggle}
            stepBack={player.stepBack}
            stepForward={player.stepForward}
            reset={player.reset}
            setSpeed={player.setSpeed}
          />
          <StepNarration
            description={narrationDescription}
            totalSteps={steps.length}
            currentIndex={player.index}
          />
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-slate-900 rounded-xl p-4 sm:p-6 border border-slate-800">
          <div className="relative">
            <svg
              width="100%"
              height={Math.min(viewBoxH, 400)}
              viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Depth rulers (left edge) */}
              {depthRows.map(([d, y]) => (
                <g key={`d-${d}`}>
                  <line
                    x1={0}
                    x2={viewBoxW}
                    y1={y}
                    y2={y}
                    stroke="#1e293b"
                    strokeWidth={0.6}
                    strokeDasharray="2,6"
                    opacity={0.6}
                  />
                  <text
                    x={4}
                    y={y - 4}
                    fontSize={9}
                    fontFamily="monospace"
                    fill="#475569"
                  >
                    depth {d}
                  </text>
                </g>
              ))}

              {/* Edges as cubic Béziers */}
              {edges.map((e, i) => {
                const p1 = layout.positions.get(e.from);
                const p2 = layout.positions.get(e.to);
                if (!p1 || !p2) return null;
                const midY = (p1.y + p2.y) / 2;
                const d = `M ${p1.x} ${p1.y + 18} C ${p1.x} ${midY + 4}, ${p2.x} ${midY - 4}, ${p2.x} ${p2.y - 18}`;
                const visited = visitedEdges.has(`${e.from}->${e.to}`);
                return (
                  <path
                    key={`e${i}`}
                    d={d}
                    stroke={visited ? '#002FA7' : '#334155'}
                    strokeWidth={visited ? 2.4 : 1.6}
                    fill="none"
                    strokeLinecap="round"
                    className="transition-[stroke,stroke-width] duration-200"
                  />
                );
              })}

              {/* Nodes — circles with mono value */}
              {allNodes.map((n) => {
                const p = layout.positions.get(n.id);
                if (!p) return null;
                const status = getNodeStatus(n.id);
                let fill = '#ffffff';
                let stroke = '#002FA7';
                let textFill = '#0f172a';
                if (status === 'visiting') {
                  fill = '#FFE135';
                  stroke = '#FFE135';
                  textFill = '#1e293b';
                } else if (status === 'visited') {
                  fill = '#10b981';
                  stroke = '#10b981';
                  textFill = '#ffffff';
                } else {
                  // unvisited
                  fill = '#0f172a';
                  stroke = '#334155';
                  textFill = '#cbd5e1';
                }
                return (
                  <g key={n.id} className="transition-[fill,stroke] duration-200">
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={18}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={2}
                    />
                    <text
                      x={p.x}
                      y={p.y + 4}
                      textAnchor="middle"
                      fontFamily="monospace"
                      fontSize={13}
                      fontWeight="bold"
                      fill={textFill}
                    >
                      {String(n.value)}
                    </text>
                  </g>
                );
              })}

              {/* Compare hint chip next to visiting node */}
              {compareHint && visitingId && (() => {
                const p = layout.positions.get(visitingId);
                if (!p) return null;
                const chipW = Math.max(compareHint.length * 6 + 16, 60);
                const overflowsRight = p.x + 22 + chipW > viewBoxW - 4;
                const chipX = overflowsRight ? p.x - 22 - chipW : p.x + 22;
                return (
                  <g>
                    <rect
                      x={chipX}
                      y={p.y - 30}
                      width={chipW}
                      height={20}
                      rx={10}
                      fill="#0f172a"
                      stroke="#FFE135"
                      strokeWidth={1}
                    />
                    <text
                      x={chipX + chipW / 2}
                      y={p.y - 16}
                      textAnchor="middle"
                      fontFamily="monospace"
                      fontSize={10}
                      fill="#FFE135"
                    >
                      {compareHint}
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* Stack / Queue side strip */}
          {current && (current.stack || current.queue) && (
            <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/40 p-3">
              <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-2">
                {traversal === 'level' ? '队列 (FIFO)' : '递归调用栈 (LIFO)'}
              </div>
              {traversal === 'level' ? (
                <HorizontalTape
                  items={current.queue ?? []}
                  direction="queue"
                  lowMotion={lowMotion}
                />
              ) : (
                <HorizontalTape
                  items={current.stack ?? []}
                  direction="stack"
                  lowMotion={lowMotion}
                />
              )}
            </div>
          )}

          {/* Legend */}
          <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-slate-800">
            <LegendChip color="bg-slate-900 border-slate-600" outline label="未访问" />
            <LegendChip color="bg-pine-500" label="正在访问" />
            <LegendChip color="bg-emerald-500" label="已访问" />
            <LegendChip color="bg-klein-500" label="遍历路径" />
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-300 font-medium text-sm">
              {TRAVERSALS[traversal].name}
            </span>
            <div className="flex bg-slate-800 rounded p-0.5">
              {(['cpp', 'java', 'python'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={
                    'px-2 py-0.5 rounded text-xs transition-all ' +
                    (lang === l ? 'bg-slate-700 text-white' : 'text-slate-400')
                  }
                >
                  {LANG_NAMES[l]}
                </button>
              ))}
            </div>
          </div>
          <div className="font-mono text-xs space-y-0.5">
            {CODE[traversal][lang].map((item: { text: string; indent: number }, i: number) => (
              <div
                key={i}
                className={
                  'py-0.5 px-2 rounded transition-all duration-200 ' +
                  (activeLine === i
                    ? 'bg-pine-500/25 text-pine-100 border-l-2 border-pine-400'
                    : 'text-slate-400 border-l-2 border-transparent')
                }
                style={{ paddingLeft: item.indent * 12 + 8 + 'px' }}
              >
                <span className="text-slate-600 select-none w-4 inline-block text-right mr-2">
                  {i + 1}
                </span>
                {item.text}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800">
            <p className="text-slate-400 text-xs mb-2">
              遍历顺序: <span className="text-klein-300 font-mono">{TRAVERSALS[traversal].order}</span>
            </p>
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

function LegendChip({
  color,
  label,
  outline,
}: {
  color: string;
  label: string;
  outline?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
      <div
        className={
          'w-3 h-3 rounded-full ' +
          (outline ? 'border-2 ' : '') +
          color
        }
      />
      <span>{label}</span>
    </div>
  );
}

interface HorizontalTapeProps {
  items: string[];
  direction: 'stack' | 'queue';
  lowMotion: boolean;
}

function HorizontalTape({ items, direction, lowMotion }: HorizontalTapeProps) {
  // For the stack, newest on the right ("top"). For the queue, head on the left.
  const showItems = items;

  if (showItems.length === 0) {
    return <div className="text-[11px] font-mono text-slate-600 italic">（空）</div>;
  }

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto">
      <AnimatePresence initial={false}>
        {showItems.map((v, i) => {
          const isTop = direction === 'stack' && i === showItems.length - 1;
          const isHead = direction === 'queue' && i === 0;
          const isTail = direction === 'queue' && i === showItems.length - 1;
          return (
            <motion.div
              key={`${v}-${i}`}
              layout={!lowMotion}
              initial={{ opacity: 0, scale: 0.6, y: direction === 'stack' ? -6 : 0, x: direction === 'queue' ? 6 : 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26, mass: 0.7 }}
              className={
                'min-w-[36px] h-7 px-2 rounded-md flex items-center justify-center font-mono text-xs font-bold border ' +
                (isTop
                  ? 'bg-pine-500 text-slate-900 border-pine-600 shadow-sm shadow-pine-500/40'
                  : isHead
                  ? 'bg-emerald-500 text-white border-emerald-600'
                  : isTail
                  ? 'bg-klein-500 text-white border-klein-600'
                  : 'bg-slate-800 text-slate-300 border-slate-700')
              }
              title={
                isTop ? 'top' : isHead ? 'front' : isTail ? 'rear' : undefined
              }
            >
              {v}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
