import { useState, useEffect, useCallback } from 'react';

interface Node {
  id: number;
  value: number;
  status: 'normal' | 'highlight' | 'found' | 'new' | 'delete';
}

interface Arrow {
  from: number;  // 节点索引
  to: number;    // 目标节点索引
  type: 'normal' | 'new' | 'breaking' | 'highlight';
  label?: string;
}

interface Step {
  nodes: Node[];
  pointer: number;
  pointer2?: number;
  line: number;
  desc: string;
  finalNodes?: Node[];
  arrows?: Arrow[];  // 箭头状态
  newNodePos?: 'above' | 'inline';  // 新节点位置
}

type Operation = 'insert' | 'delete' | 'search';
type Lang = 'cpp' | 'java' | 'python';

const LANG_NAMES: Record<Lang, string> = { cpp: 'C++', java: 'Java', python: 'Python' };

const CODE: Record<Operation, Record<Lang, { text: string; indent: number }[]>> = {
  insert: {
    cpp: [
      { text: 'bool insert(Node* head, int i, int e) {', indent: 0 },
      { text: 'Node* p = head; int j = 0;', indent: 1 },
      { text: 'while (p && j < i-1) { p = p->next; j++; }', indent: 1 },
      { text: 'if (!p) return false;', indent: 1 },
      { text: 'Node* s = new Node(e);', indent: 1 },
      { text: 's->next = p->next;', indent: 1 },
      { text: 'p->next = s;', indent: 1 },
      { text: 'return true;', indent: 1 },
      { text: '}', indent: 0 },
    ],
    java: [
      { text: 'boolean insert(Node head, int i, int e) {', indent: 0 },
      { text: 'Node p = head; int j = 0;', indent: 1 },
      { text: 'while (p != null && j < i-1) { p = p.next; j++; }', indent: 1 },
      { text: 'if (p == null) return false;', indent: 1 },
      { text: 'Node s = new Node(e);', indent: 1 },
      { text: 's.next = p.next;', indent: 1 },
      { text: 'p.next = s;', indent: 1 },
      { text: 'return true;', indent: 1 },
      { text: '}', indent: 0 },
    ],
    python: [
      { text: 'def insert(head, i, e):', indent: 0 },
      { text: 'p, j = head, 0', indent: 1 },
      { text: 'while p and j < i-1:', indent: 1 },
      { text: 'p, j = p.next, j+1', indent: 2 },
      { text: 'if not p: return False', indent: 1 },
      { text: 's = Node(e)', indent: 1 },
      { text: 's.next = p.next', indent: 1 },
      { text: 'p.next = s', indent: 1 },
      { text: 'return True', indent: 1 },
    ],
  },
  delete: {
    cpp: [
      { text: 'bool remove(Node* head, int i, int& e) {', indent: 0 },
      { text: 'Node* p = head; int j = 0;', indent: 1 },
      { text: 'while (p && j < i-1) { p = p->next; j++; }', indent: 1 },
      { text: 'if (!p || !p->next) return false;', indent: 1 },
      { text: 'Node* q = p->next;', indent: 1 },
      { text: 'e = q->data;', indent: 1 },
      { text: 'p->next = q->next;', indent: 1 },
      { text: 'delete q;', indent: 1 },
      { text: 'return true;', indent: 1 },
      { text: '}', indent: 0 },
    ],
    java: [
      { text: 'int remove(Node head, int i) {', indent: 0 },
      { text: 'Node p = head; int j = 0;', indent: 1 },
      { text: 'while (p != null && j < i-1) { p = p.next; j++; }', indent: 1 },
      { text: 'if (p == null || p.next == null) return -1;', indent: 1 },
      { text: 'Node q = p.next;', indent: 1 },
      { text: 'int e = q.data;', indent: 1 },
      { text: 'p.next = q.next;', indent: 1 },
      { text: 'return e;', indent: 1 },
      { text: '}', indent: 0 },
    ],
    python: [
      { text: 'def remove(head, i):', indent: 0 },
      { text: 'p, j = head, 0', indent: 1 },
      { text: 'while p and j < i-1:', indent: 1 },
      { text: 'p, j = p.next, j+1', indent: 2 },
      { text: 'if not p or not p.next: return None', indent: 1 },
      { text: 'q = p.next', indent: 1 },
      { text: 'e = q.data', indent: 1 },
      { text: 'p.next = q.next', indent: 1 },
      { text: 'return e', indent: 1 },
    ],
  },
  search: {
    cpp: [
      { text: 'Node* search(Node* head, int e) {', indent: 0 },
      { text: 'Node* p = head->next;', indent: 1 },
      { text: 'while (p != NULL) {', indent: 1 },
      { text: 'if (p->data == e) return p;', indent: 2 },
      { text: 'p = p->next;', indent: 2 },
      { text: '}', indent: 1 },
      { text: 'return NULL;', indent: 1 },
      { text: '}', indent: 0 },
    ],
    java: [
      { text: 'Node search(Node head, int e) {', indent: 0 },
      { text: 'Node p = head.next;', indent: 1 },
      { text: 'while (p != null) {', indent: 1 },
      { text: 'if (p.data == e) return p;', indent: 2 },
      { text: 'p = p.next;', indent: 2 },
      { text: '}', indent: 1 },
      { text: 'return null;', indent: 1 },
      { text: '}', indent: 0 },
    ],
    python: [
      { text: 'def search(head, e):', indent: 0 },
      { text: 'p = head.next', indent: 1 },
      { text: 'while p:', indent: 1 },
      { text: 'if p.data == e: return p', indent: 2 },
      { text: 'p = p.next', indent: 2 },
      { text: 'return None', indent: 1 },
    ],
  },
};

const OP_NAMES: Record<Operation, string> = {
  insert: '插入',
  delete: '删除', 
  search: '查找',
};

let nodeIdCounter = 100;

export default function LinkedListVisualization() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 1, value: 0, status: 'normal' },
    { id: 2, value: 12, status: 'normal' },
    { id: 3, value: 25, status: 'normal' },
    { id: 4, value: 37, status: 'normal' },
    { id: 5, value: 48, status: 'normal' },
  ]);
  const [inputPos, setInputPos] = useState('3');
  const [inputVal, setInputVal] = useState('99');
  const [operation, setOperation] = useState<Operation>('insert');
  const [lang, setLang] = useState<Lang>('cpp');
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);  // 默认较慢，便于学习

  const step = steps[stepIdx];
  const displayNodes = step?.nodes || nodes;

  const cloneNodes = useCallback((arr: Node[]) => arr.map(n => ({ ...n })), []);

  const generateInsertSteps = useCallback(() => {
    const pos = Math.max(1, Math.min(parseInt(inputPos) || 1, nodes.length));
    const val = parseInt(inputVal) || 99;
    const arr = cloneNodes(nodes);
    const result: Step[] = [];

    // 生成默认箭头（所有相邻节点之间的箭头）
    const defaultArrows = (): Arrow[] => arr.slice(0, -1).map((_, i) => ({ from: i, to: i + 1, type: 'normal' as const }));

    // 开始说明
    result.push({
      nodes: arr,
      pointer: -1, line: 0, 
      desc: `📋 任务：在位置 ${pos} 插入值 ${val}。需要先找到位置 ${pos-1} 的节点（即插入点的前一个）`,
      arrows: defaultArrows()
    });

    // Step 1: p = L (头结点)
    result.push({
      nodes: arr.map((n, i) => ({ ...n, status: i === 0 ? 'highlight' : 'normal' })),
      pointer: 0, line: 1, 
      desc: `🚀 初始化指针 p 指向头结点(位置0)，计数器 j=0。目标：找到位置 ${pos-1}`,
      arrows: defaultArrows()
    });

    // 循环查找第 i-1 个节点
    let currentPos = 0;
    for (let j = 0; j < pos - 1 && currentPos < arr.length - 1; j++) {
      currentPos++;
      result.push({
        nodes: arr.map((n, i) => ({ ...n, status: i === currentPos ? 'highlight' : i < currentPos ? 'found' : 'normal' })),
        pointer: currentPos, line: 2, 
        desc: `👉 p 向后移动一步，现在指向位置 ${currentPos}（值=${arr[currentPos].value}），j=${j+1}`,
        arrows: defaultArrows()
      });
    }

    // 找到位置 - 高亮 p->next 这条边
    const pNextArrows = defaultArrows().map((a, i) => 
      i === currentPos ? { ...a, type: 'highlight' as const, label: 'p→next' } : a
    );
    result.push({
      nodes: arr.map((n, i) => ({ ...n, status: i === currentPos ? 'highlight' : i === currentPos + 1 ? 'new' : 'normal' })),
      pointer: currentPos, line: 3, 
      desc: `✅ 找到了！p 指向位置 ${currentPos}。注意 p→next 指向位置 ${currentPos + 1}`,
      arrows: pNextArrows
    });

    // 创建新节点 - 显示在上方
    nodeIdCounter++;
    const newNode: Node = { id: nodeIdCounter, value: val, status: 'new' };
    const nodesWithNew = [...arr.slice(0, currentPos + 1), newNode, ...arr.slice(currentPos + 1)];
    
    result.push({
      nodes: nodesWithNew.map((n, i) => ({ 
        ...n, 
        status: i === currentPos ? 'highlight' : i === currentPos + 1 ? 'new' : 'normal' 
      })),
      pointer: currentPos, line: 4, 
      desc: `📦 创建新节点 s，设置 s.data = ${val}。新节点暂时悬空，还没连接`,
      arrows: arr.slice(0, -1).map((_, i) => ({ 
        from: i >= currentPos + 1 ? i + 1 : i, 
        to: i >= currentPos ? i + 2 : i + 1, 
        type: 'normal' as const 
      })),
      newNodePos: 'above'
    });

    // 关键步骤1：s->next = p->next - 新节点连接到后继
    const step1Arrows: Arrow[] = [
      ...arr.slice(0, currentPos).map((_, i) => ({ from: i, to: i + 1, type: 'normal' as const })),
      { from: currentPos, to: currentPos + 2, type: 'normal' as const, label: 'p→next' }, // p仍然指向原来的后继
      { from: currentPos + 1, to: currentPos + 2, type: 'new' as const, label: '① s→next' }, // 新节点指向后继
      ...arr.slice(currentPos + 2).map((_, i) => ({ from: currentPos + 2 + i, to: currentPos + 3 + i, type: 'normal' as const })),
    ];
    
    result.push({
      nodes: nodesWithNew.map((n, i) => ({ 
        ...n, 
        status: i === currentPos ? 'highlight' : i === currentPos + 1 ? 'new' : i === currentPos + 2 ? 'found' : 'normal' 
      })),
      pointer: currentPos, line: 5, 
      desc: `🔗 【关键步骤1】s.next = p.next：新节点 s 的 next 指针指向原来 p 的后继节点！`,
      arrows: step1Arrows,
      newNodePos: 'above'
    });

    // 关键步骤2：p->next = s - 前驱连接到新节点
    const step2Arrows: Arrow[] = [
      ...arr.slice(0, currentPos).map((_, i) => ({ from: i, to: i + 1, type: 'normal' as const })),
      { from: currentPos, to: currentPos + 1, type: 'new' as const, label: '② p→next' }, // p指向新节点
      { from: currentPos + 1, to: currentPos + 2, type: 'highlight' as const, label: 's→next' }, // 新节点指向后继
      ...arr.slice(currentPos + 2).map((_, i) => ({ from: currentPos + 2 + i, to: currentPos + 3 + i, type: 'normal' as const })),
    ];
    
    result.push({
      nodes: nodesWithNew.map((n, i) => ({ 
        ...n, 
        status: i === currentPos ? 'highlight' : i === currentPos + 1 ? 'found' : 'normal' 
      })),
      pointer: currentPos, line: 6, 
      desc: `🔗 【关键步骤2】p.next = s：前驱节点 p 的 next 指针指向新节点 s！插入完成！`,
      arrows: step2Arrows,
      newNodePos: 'inline'
    });

    // 完成
    const finalArrows = nodesWithNew.slice(0, -1).map((_, i) => ({ from: i, to: i + 1, type: 'normal' as const }));
    result.push({
      nodes: nodesWithNew.map(n => ({ ...n, status: 'normal' })),
      pointer: -1, line: 7, 
      desc: `🎉 成功！值 ${val} 已插入到位置 ${pos}。链表长度: ${arr.length} → ${nodesWithNew.length}`,
      arrows: finalArrows,
      finalNodes: nodesWithNew.map(n => ({ ...n, status: 'normal' }))
    });

    return result;
  }, [nodes, inputPos, inputVal, cloneNodes]);

  const generateDeleteSteps = useCallback(() => {
    const pos = Math.max(1, parseInt(inputPos) || 1);
    const arr = cloneNodes(nodes);
    const result: Step[] = [];

    // 生成正常箭头
    const normalArrows = (): Arrow[] => arr.slice(0, -1).map((_, i) => ({ from: i, to: i + 1, type: 'normal' as const }));

    // 边界检查
    if (pos >= arr.length) {
      result.push({
        nodes: arr,
        arrows: normalArrows(),
        pointer: -1, line: 3, desc: `❌ 错误: 位置 ${pos} 超出链表范围(1~${arr.length - 1})，删除失败！`
      });
      return result;
    }

    const pIdx = pos - 1;  // p的位置（前驱）
    const qIdx = pos;      // q的位置（待删除）
    const delVal = arr[qIdx].value;
    const hasNext = qIdx < arr.length - 1;  // q是否有后继

    // Step 1: 任务说明
    result.push({
      nodes: arr.map((n, i) => ({ ...n, status: i === qIdx ? 'delete' : 'normal' })),
      arrows: normalArrows(),
      pointer: -1, line: 0, 
      desc: `📋 【删除任务】要删除位置 ${pos} 的节点（值=${delVal}）
💡 核心思想：找到前驱p，让 p.next 跳过q，直接指向 q.next`
    });

    // Step 2: 初始化 p = L
    result.push({
      nodes: arr.map((n, i) => ({ ...n, status: i === 0 ? 'highlight' : i === qIdx ? 'delete' : 'normal' })),
      arrows: normalArrows(),
      pointer: 0, line: 1, 
      desc: `🚀 初始化指针 p = L（指向头结点）
🎯 目标：找到位置 ${pIdx} 的节点（待删节点的前驱）`
    });

    // Step 3: 移动 p 找到前驱
    let currentPos = 0;
    for (let j = 0; j < pIdx && currentPos < arr.length - 1; j++) {
      currentPos++;
      result.push({
        nodes: arr.map((n, i) => ({ 
          ...n, 
          status: i === currentPos ? 'highlight' : i === qIdx ? 'delete' : i < currentPos ? 'found' : 'normal' 
        })),
        arrows: normalArrows(),
        pointer: currentPos, line: 2, 
        desc: `👉 p = p->next，p 移动到位置 ${currentPos}（值=${arr[currentPos].value}）
📍 还需移动 ${pIdx - currentPos} 步`
      });
    }

    // Step 4: 找到前驱 p
    result.push({
      nodes: arr.map((n, i) => ({ 
        ...n, 
        status: i === currentPos ? 'highlight' : i === qIdx ? 'delete' : 'normal' 
      })),
      arrows: arr.slice(0, -1).map((_, i) => ({ 
        from: i, to: i + 1, 
        type: i === currentPos ? 'highlight' as const : 'normal' as const,
        label: i === currentPos ? 'p.next' : undefined
      })),
      pointer: currentPos, line: 3, 
      desc: `✅ 找到前驱！p 指向位置 ${currentPos}（值=${arr[currentPos].value}）
🔗 p.next 当前指向位置 ${qIdx}（待删节点）`
    });

    // Step 5: q = p->next（用q指向待删节点）
    result.push({
      nodes: arr.map((n, i) => ({ 
        ...n, 
        status: i === currentPos ? 'highlight' : i === qIdx ? 'delete' : 'normal' 
      })),
      arrows: arr.slice(0, -1).map((_, i) => ({ 
        from: i, to: i + 1, 
        type: i === currentPos ? 'highlight' as const : i === qIdx ? 'highlight' as const : 'normal' as const,
        label: i === currentPos ? 'p.next→q' : i === qIdx && hasNext ? 'q.next' : undefined
      })),
      pointer: currentPos, pointer2: qIdx, line: 4, 
      desc: `🎯 q = p->next：用指针 q 指向待删除节点
📌 p 指向位置 ${currentPos}，q 指向位置 ${qIdx}（值=${delVal}）`
    });

    // Step 6: 分析当前指针状态
    result.push({
      nodes: arr.map((n, i) => ({ 
        ...n, 
        status: i === currentPos ? 'highlight' : i === qIdx ? 'delete' : hasNext && i === qIdx + 1 ? 'new' : 'normal' 
      })),
      arrows: arr.slice(0, -1).map((_, i) => ({ 
        from: i, to: i + 1, 
        type: i === currentPos ? 'breaking' as const : i === qIdx ? 'highlight' as const : 'normal' as const,
        label: i === currentPos ? '❌即将断开' : i === qIdx && hasNext ? 'q.next' : undefined
      })),
      pointer: currentPos, pointer2: qIdx, line: 5, 
      desc: `🔍 【关键分析】当前状态：
• p.next 指向 q（位置${qIdx}）—— 这条链接要断开
• q.next 指向 ${hasNext ? `位置${qIdx+1}（值=${arr[qIdx+1].value}）` : 'NULL'} —— p.next 要改指向这里`
    });

    // Step 7: 核心操作 p->next = q->next（带动画）
    result.push({
      nodes: arr.map((n, i) => ({ 
        ...n, 
        status: i === currentPos ? 'highlight' : i === qIdx ? 'delete' : hasNext && i === qIdx + 1 ? 'new' : 'normal' 
      })),
      arrows: [
        // 正常的箭头（排除p->q和q->next）
        ...arr.slice(0, -1).filter((_, i) => i !== currentPos && i !== qIdx).map((_, i) => ({ 
          from: i < currentPos ? i : i < qIdx ? i : i + 1, 
          to: i < currentPos ? i + 1 : i < qIdx ? i + 1 : i + 2, 
          type: 'normal' as const 
        })),
        // p->q 断开中（用红色虚线表示）
        { from: currentPos, to: qIdx, type: 'breaking' as const, label: '断开!' },
        // q->next 高亮
        ...(hasNext ? [{ from: qIdx, to: qIdx + 1, type: 'highlight' as const, label: 'q.next' }] : []),
        // 新的 p->next（绿色，跳过q）
        ...(hasNext ? [{ from: currentPos, to: qIdx + 1, type: 'new' as const, label: '✓ p.next=q.next' }] : []),
      ],
      pointer: currentPos, pointer2: qIdx, line: 6, 
      desc: `🔗 【核心操作】p.next = q.next
✂️ 断开 p → q 的连接
✅ 建立 p → ${hasNext ? `位置${qIdx+1}` : 'NULL'} 的新连接
💡 这样就"跳过"了 q 节点！`
    });

    // Step 8: 显示跳过效果
    result.push({
      nodes: arr.map((n, i) => ({ 
        ...n, 
        status: i === currentPos ? 'highlight' : i === qIdx ? 'delete' : 'normal' 
      })),
      arrows: [
        ...arr.slice(0, currentPos).map((_, i) => ({ from: i, to: i + 1, type: 'normal' as const })),
        // p 直接跳到 q.next
        ...(hasNext ? [{ from: currentPos, to: qIdx + 1, type: 'new' as const, label: 'p.next (已修改)' }] : []),
        // q 已被孤立
        ...(hasNext ? [{ from: qIdx, to: qIdx + 1, type: 'breaking' as const, label: '即将删除' }] : []),
        ...arr.slice(qIdx + 2, -1).map((_, i) => ({ from: qIdx + 1 + i, to: qIdx + 2 + i, type: 'normal' as const })),
      ],
      pointer: currentPos, pointer2: qIdx, line: 6, 
      desc: `✅ 指针修改完成！现在 p.next 直接指向 ${hasNext ? `位置${qIdx+1}` : 'NULL'}
🔴 节点 q（值=${delVal}）已被"孤立"，不在链表中了`
    });

    // Step 9: delete q / free(q)
    result.push({
      nodes: arr.map((n, i) => ({ 
        ...n, 
        status: i === qIdx ? 'delete' : 'normal' 
      })),
      arrows: [
        ...arr.slice(0, currentPos).map((_, i) => ({ from: i, to: i + 1, type: 'normal' as const })),
        ...(hasNext ? [{ from: currentPos, to: qIdx + 1, type: 'normal' as const }] : []),
        ...arr.slice(qIdx + 2, -1).map((_, i) => ({ from: qIdx + 1 + i, to: qIdx + 2 + i, type: 'normal' as const })),
      ],
      pointer: -1, pointer2: qIdx, line: 7, 
      desc: `🗑️ delete q / free(q)：释放节点 q 的内存空间
⚠️ 如果不释放，会造成内存泄漏！`
    });

    // Step 10: 完成
    const finalNodes = [...arr.slice(0, qIdx), ...arr.slice(qIdx + 1)];
    result.push({
      nodes: finalNodes.map(n => ({ ...n, status: 'normal' })),
      arrows: finalNodes.slice(0, -1).map((_, i) => ({ from: i, to: i + 1, type: 'normal' as const })),
      pointer: -1, line: 8, 
      desc: `🎉 删除成功！节点 ${delVal} 已从链表中移除
📊 链表长度: ${arr.length} → ${finalNodes.length}`,
      finalNodes: finalNodes.map(n => ({ ...n, status: 'normal' }))
    });

    return result;
  }, [nodes, inputPos, cloneNodes]);

  const generateSearchSteps = useCallback(() => {
    const val = parseInt(inputVal) || 25;
    const arr = cloneNodes(nodes);
    const result: Step[] = [];

    if (arr.length <= 1) {
      result.push({
        nodes: arr,
        pointer: -1, line: 5, desc: `❌ 链表为空，没有数据可查找！`
      });
      return result;
    }

    // 开始说明
    result.push({
      nodes: arr,
      pointer: -1, line: 0, desc: `📋 任务：在链表中查找值为 ${val} 的节点。需要从头开始逐个比较`
    });

    // p = L->next (首元结点)
    result.push({
      nodes: arr.map((n, i) => ({ ...n, status: i === 1 ? 'highlight' : i === 0 ? 'found' : 'normal' })),
      pointer: 1, line: 1, desc: `🚀 跳过头结点，p 指向首元结点(位置1，值=${arr[1].value})`
    });

    let found = false;
    for (let i = 1; i < arr.length; i++) {
      // if 条件检查
      const isMatch = arr[i].value === val;
      result.push({
        nodes: arr.map((n, idx) => ({ 
          ...n, 
          status: idx === i ? 'highlight' : idx < i && idx > 0 ? 'found' : 'normal' 
        })),
        pointer: i, line: 3, 
        desc: `👀 比较: 当前值 ${arr[i].value} ${isMatch ? '==' : '!='} 目标值 ${val} → ${isMatch ? '✅ 匹配！' : '❌ 不匹配'}`
      });

      if (isMatch) {
        result.push({
          nodes: arr.map((n, idx) => ({ ...n, status: idx === i ? 'found' : 'normal' })),
          pointer: i, line: 3, desc: `🎉 找到了！值 ${val} 在位置 ${i}，返回该节点`
        });
        found = true;
        break;
      } else if (i < arr.length - 1) {
        result.push({
          nodes: arr.map((n, idx) => ({ ...n, status: idx === i + 1 ? 'highlight' : idx <= i && idx > 0 ? 'found' : 'normal' })),
          pointer: i + 1, line: 4, desc: `👉 移动到下一个节点(位置${i+1}，值=${arr[i+1].value})`
        });
      }
    }

    if (!found) {
      result.push({
        nodes: arr.map((n, i) => ({ ...n, status: i > 0 ? 'found' : 'normal' })),
        pointer: -1, line: 2, desc: `🔚 已到达链表末尾 (p == NULL)`
      });
      result.push({
        nodes: arr.map(n => ({ ...n, status: 'normal' })),
        pointer: -1, line: 5, desc: `😔 查找完成，链表中不存在值为 ${val} 的节点，返回 NULL`
      });
    }

    return result;
  }, [nodes, inputVal, cloneNodes]);

  const startAnimation = useCallback(() => {
    setPlaying(false);
    setStepIdx(-1);
    
    let result: Step[] = [];
    if (operation === 'insert') result = generateInsertSteps();
    else if (operation === 'delete') result = generateDeleteSteps();
    else result = generateSearchSteps();

    setSteps(result);
    setTimeout(() => {
      setStepIdx(0);
      setPlaying(true);
    }, 50);
  }, [operation, generateInsertSteps, generateDeleteSteps, generateSearchSteps]);

  const stepForward = () => {
    if (stepIdx < steps.length - 1) {
      setStepIdx(stepIdx + 1);
    }
  };

  const stepBackward = () => {
    if (stepIdx > 0) {
      setStepIdx(stepIdx - 1);
    }
  };

  const reset = () => {
    setNodes([
      { id: 1, value: 0, status: 'normal' },
      { id: 2, value: 12, status: 'normal' },
      { id: 3, value: 25, status: 'normal' },
      { id: 4, value: 37, status: 'normal' },
      { id: 5, value: 48, status: 'normal' },
    ]);
    setSteps([]);
    setStepIdx(-1);
    setPlaying(false);
  };

  useEffect(() => {
    if (!playing || stepIdx < 0 || steps.length === 0) return;
    
    if (stepIdx >= steps.length - 1) {
      setPlaying(false);
      const lastStep = steps[steps.length - 1];
      if (lastStep?.finalNodes) {
        setNodes(lastStep.finalNodes);
      }
      return;
    }
    
    const timer = setTimeout(() => {
      setStepIdx(prev => prev + 1);
    }, speed);
    
    return () => clearTimeout(timer);
  }, [playing, stepIdx, steps, speed]);

  const currentCode = CODE[operation][lang];

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            {(['insert', 'delete', 'search'] as Operation[]).map(op => (
              <button key={op} onClick={() => { setOperation(op); setSteps([]); setStepIdx(-1); }}
                disabled={playing}
                className={'px-3 py-1.5 rounded-md text-xs font-medium transition-all ' +
                  (operation === op ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-300')}>
                {OP_NAMES[op]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">{operation === 'search' ? '值:' : '位置:'}</span>
            <input type="number" value={operation === 'search' ? inputVal : inputPos}
              onChange={e => operation === 'search' ? setInputVal(e.target.value) : setInputPos(e.target.value)}
              className="w-14 px-2 py-1 border border-slate-200 dark:border-slate-600 rounded-lg text-center text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white" disabled={playing} />
          </div>
          {operation === 'insert' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">值:</span>
              <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)}
                className="w-14 px-2 py-1 border border-slate-200 dark:border-slate-600 rounded-lg text-center text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white" disabled={playing} />
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">🐢</span>
            <input type="range" min="200" max="2000" step="100" value={2200 - speed} onChange={e => setSpeed(2200 - Number(e.target.value))} className="w-24" />
            <span className="text-xs text-slate-400">🐇</span>
          </div>
          {!playing ? (
            <button onClick={startAnimation} className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              {OP_NAMES[operation]}
            </button>
          ) : (
            <button onClick={() => setPlaying(false)} className="px-4 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium">暂停</button>
          )}
          {steps.length > 0 && (
            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-600 pl-3">
              <button onClick={stepBackward} disabled={stepIdx <= 0 || playing} className="px-3 py-1.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-300 dark:hover:bg-slate-500">
                ◀ 上一步
              </button>
              <span className="text-xs text-slate-500 dark:text-slate-400 min-w-[60px] text-center">{stepIdx + 1} / {steps.length}</span>
              <button onClick={stepForward} disabled={stepIdx >= steps.length - 1 || playing} className="px-3 py-1.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-300 dark:hover:bg-slate-500">
                下一步 ▶
              </button>
              {!playing ? (
                <button onClick={() => setPlaying(true)} disabled={stepIdx >= steps.length - 1} className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                  ▶ 自动
                </button>
              ) : (
                <button onClick={() => setPlaying(false)} className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium">
                  ⏸ 暂停
                </button>
              )}
            </div>
          )}
          <button onClick={reset} className="px-4 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600">重置</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-slate-800 rounded-xl p-6 min-h-[360px]">
          <div className="mb-4 px-4 py-3 bg-slate-700/50 rounded-lg">
            <p className="text-white text-sm leading-relaxed">{step?.desc || '选择操作并点击执行'}</p>
          </div>
          
          {/* 链表可视化区域 */}
          <div className="relative flex items-center justify-start overflow-x-auto py-10">
            {/* head 指针 */}
            <div className="flex flex-col items-center mr-4">
              <span className="text-slate-400 text-xs mb-2">head</span>
              <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
              <div className="w-0.5 h-4 bg-indigo-400"></div>
            </div>
            
            {/* 节点和箭头 */}
            {displayNodes.map((node, i) => {
              // 找到从当前节点出发的箭头
              const arrow = step?.arrows?.find(a => a.from === i);
              const isNewNode = step?.newNodePos === 'above' && node.status === 'new';
              
              return (
                <div key={node.id} className="flex items-center">
                  <div className={`relative ${isNewNode ? '-mt-16' : ''}`}>
                    {/* p 指针 */}
                    {step?.pointer === i && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                        <span className="text-amber-400 text-xs font-bold bg-slate-800 px-1 rounded">p</span>
                        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent border-t-amber-400"></div>
                      </div>
                    )}
                    {/* q 指针 */}
                    {step?.pointer2 === i && (
                      <div className="absolute -top-10 left-1/2 translate-x-3 flex flex-col items-center z-10">
                        <span className="text-rose-400 text-xs font-bold bg-slate-800 px-1 rounded">q</span>
                        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent border-t-rose-400"></div>
                      </div>
                    )}
                    {/* s 指针（新节点） */}
                    {node.status === 'new' && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                        <span className="text-pink-400 text-xs font-bold bg-slate-800 px-1 rounded">s</span>
                        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent border-t-pink-400"></div>
                      </div>
                    )}
                    
                    {/* 节点 */}
                    <div className={'w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white transition-all duration-300 border-2 ' +
                      (node.status === 'highlight' ? 'bg-amber-500 border-amber-400 scale-110 shadow-lg shadow-amber-500/30' :
                       node.status === 'found' ? 'bg-emerald-500 border-emerald-400 scale-110 shadow-lg shadow-emerald-500/30' :
                       node.status === 'new' ? 'bg-pink-500 border-pink-400 scale-110 shadow-lg shadow-pink-500/30 animate-pulse' :
                       node.status === 'delete' ? 'bg-rose-500 border-rose-400 scale-110 opacity-60' : 'bg-indigo-500 border-indigo-400')}>
                      {i === 0 ? <span className="text-xs font-medium">HEAD</span> : <><span className="text-[10px] opacity-60">data</span><span className="font-bold">{node.value}</span></>}
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-slate-500 text-xs">[{i}]</div>
                  </div>
                  
                  {/* 箭头 */}
                  {arrow && arrow.to < displayNodes.length && (
                    <div className="relative mx-1">
                      <svg width="50" height={isNewNode || step?.newNodePos === 'above' ? '50' : '30'} className="overflow-visible">
                        {/* 根据箭头类型和位置绘制 */}
                        {arrow.type === 'new' ? (
                          // 新建的连接 - 绿色动画
                          <>
                            <defs>
                              <marker id={`arrow-new-${i}`} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                                <polygon points="0,0 8,4 0,8" fill="#10b981" />
                              </marker>
                            </defs>
                            <line x1="5" y1={isNewNode ? '10' : '15'} x2="40" y2="15" 
                              stroke="#10b981" strokeWidth="3" 
                              markerEnd={`url(#arrow-new-${i})`}
                              className="animate-pulse" />
                            {arrow.label && (
                              <text x="22" y={isNewNode ? '0' : '8'} fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="middle">
                                {arrow.label}
                              </text>
                            )}
                          </>
                        ) : arrow.type === 'highlight' ? (
                          // 高亮的连接 - 黄色
                          <>
                            <defs>
                              <marker id={`arrow-hl-${i}`} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                                <polygon points="0,0 8,4 0,8" fill="#f59e0b" />
                              </marker>
                            </defs>
                            <line x1="5" y1="15" x2="40" y2="15" 
                              stroke="#f59e0b" strokeWidth="3" 
                              markerEnd={`url(#arrow-hl-${i})`} />
                            {arrow.label && (
                              <text x="22" y="8" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">
                                {arrow.label}
                              </text>
                            )}
                          </>
                        ) : arrow.type === 'breaking' ? (
                          // 断开的连接 - 红色虚线
                          <>
                            <line x1="5" y1="15" x2="40" y2="15" 
                              stroke="#ef4444" strokeWidth="2" strokeDasharray="4,4" />
                          </>
                        ) : (
                          // 普通连接
                          <>
                            <defs>
                              <marker id={`arrow-${i}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                <polygon points="0,0 6,3 0,6" fill="#818cf8" />
                              </marker>
                            </defs>
                            <line x1="5" y1="15" x2="40" y2="15" 
                              stroke="#818cf8" strokeWidth="2" 
                              markerEnd={`url(#arrow-${i})`} />
                          </>
                        )}
                      </svg>
                    </div>
                  )}
                  
                  {/* 最后一个节点指向 NULL */}
                  {i === displayNodes.length - 1 && (
                    <div className="flex items-center ml-2">
                      <svg width="30" height="20">
                        <line x1="0" y1="10" x2="20" y2="10" stroke="#64748b" strokeWidth="2" />
                      </svg>
                      <span className="text-slate-500 text-sm">NULL</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* 图例 */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-700">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-indigo-500 border border-indigo-400"></div><span className="text-slate-400 text-xs">普通节点</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-amber-500 border border-amber-400"></div><span className="text-slate-400 text-xs">当前指针p</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-pink-500 border border-pink-400"></div><span className="text-slate-400 text-xs">新节点s</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-emerald-500 border border-emerald-400"></div><span className="text-slate-400 text-xs">已完成</span></div>
            <div className="flex items-center gap-2">
              <svg width="20" height="10"><line x1="0" y1="5" x2="15" y2="5" stroke="#10b981" strokeWidth="2" /><polygon points="15,5 10,2 10,8" fill="#10b981" /></svg>
              <span className="text-slate-400 text-xs">新建指针</span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 bg-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-300 font-medium text-sm">{OP_NAMES[operation]}操作</span>
            <div className="flex bg-slate-700 rounded p-0.5">
              {(['cpp', 'java', 'python'] as Lang[]).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className={'px-2 py-0.5 rounded text-xs transition-all ' + (lang === l ? 'bg-slate-600 text-white' : 'text-slate-400')}>
                  {LANG_NAMES[l]}
                </button>
              ))}
            </div>
          </div>
          <div className="font-mono text-xs space-y-0.5 max-h-[250px] overflow-y-auto">
            {currentCode.map((item: { text: string; indent: number }, i: number) => (
              <div key={i}
                className={'py-0.5 px-2 rounded transition-all duration-200 ' + (step?.line === i ? 'bg-amber-500/30 text-amber-200' : 'text-slate-400')}
                style={{ paddingLeft: (item.indent * 12 + 8) + 'px' }}>
                <span className="text-slate-600 select-none w-4 inline-block text-right mr-2">{i + 1}</span>
                {item.text}
              </div>
            ))}
          </div>
          {steps.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="flex justify-between text-xs text-slate-500 mb-2">
                <span>步骤 {stepIdx + 1} / {steps.length}</span>
                {playing && <span className="text-emerald-400">播放中...</span>}
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all" style={{ width: ((stepIdx + 1) / steps.length * 100) + '%' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
