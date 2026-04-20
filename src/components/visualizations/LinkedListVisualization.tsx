import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAlgorithmPlayer } from '../../hooks/useAlgorithmPlayer';
import useLowMotionMode from '../../hooks/useLowMotionMode';
import { PlayerControls } from './_shared/PlayerControls';
import { StepNarration } from './_shared/StepNarration';
import { ArrowMarkerDefs } from './_shared/ArrowMarker';
import { arrowUrl, ARROW_COLORS } from './_shared/arrowColors';

interface ListNode {
  id: number;
  value: number;
  status: 'normal' | 'highlight' | 'found' | 'new' | 'delete';
}

interface Arrow {
  from: number;
  to: number;
  type: 'normal' | 'new' | 'breaking' | 'highlight';
  label?: string;
}

interface Step {
  nodes: ListNode[];
  pointer: number;
  pointer2?: number;
  line: number;
  description: string;
  finalNodes?: ListNode[];
  arrows?: Arrow[];
  newNodePos?: 'above' | 'inline';
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

function cloneNodes(arr: ListNode[]): ListNode[] {
  return arr.map((n) => ({ ...n }));
}

function defaultArrowsOf(arr: ListNode[]): Arrow[] {
  return arr.slice(0, -1).map((_, i) => ({ from: i, to: i + 1, type: 'normal' as const }));
}

// ----- Step generators -----

interface GenerateResult {
  steps: Step[];
  error?: string;
}

function generateInsertSteps(
  currentList: ListNode[],
  pos: number,
  val: number,
): GenerateResult {
  if (pos < 1) {
    return { steps: [], error: `❌ 插入位置必须 >= 1，收到 ${pos}` };
  }
  if (pos > currentList.length) {
    return {
      steps: [],
      error: `❌ 位置 ${pos} 超出范围，链表有效插入位置为 1 ~ ${currentList.length}`,
    };
  }

  const arr = cloneNodes(currentList);
  const result: Step[] = [];

  result.push({
    nodes: arr,
    pointer: -1,
    line: 0,
    description: `📋 任务：在位置 ${pos} 插入值 ${val}。需要先找到位置 ${pos - 1} 的节点（即插入点的前一个）`,
    arrows: defaultArrowsOf(arr),
  });

  result.push({
    nodes: arr.map((n, i) => ({ ...n, status: i === 0 ? 'highlight' : 'normal' })),
    pointer: 0,
    line: 1,
    description: `🚀 初始化指针 p 指向头结点(位置0)，计数器 j=0。目标：找到位置 ${pos - 1}`,
    arrows: defaultArrowsOf(arr),
  });

  let currentPos = 0;
  for (let j = 0; j < pos - 1 && currentPos < arr.length - 1; j++) {
    currentPos++;
    result.push({
      nodes: arr.map((n, i) => ({
        ...n,
        status: i === currentPos ? 'highlight' : i < currentPos ? 'found' : 'normal',
      })),
      pointer: currentPos,
      line: 2,
      description: `👉 p 向后移动一步，现在指向位置 ${currentPos}（值=${arr[currentPos].value}），j=${j + 1}`,
      arrows: defaultArrowsOf(arr),
    });
  }

  const pNextArrows = defaultArrowsOf(arr).map((a, i) =>
    i === currentPos ? { ...a, type: 'highlight' as const, label: 'p→next' } : a,
  );
  result.push({
    nodes: arr.map((n, i) => ({
      ...n,
      status:
        i === currentPos ? 'highlight' : i === currentPos + 1 ? 'new' : 'normal',
    })),
    pointer: currentPos,
    line: 3,
    description: `✅ 找到了！p 指向位置 ${currentPos}。注意 p→next 指向位置 ${currentPos + 1}`,
    arrows: pNextArrows,
  });

  nodeIdCounter++;
  const newNode: ListNode = { id: nodeIdCounter, value: val, status: 'new' };
  const nodesWithNew = [...arr.slice(0, currentPos + 1), newNode, ...arr.slice(currentPos + 1)];

  result.push({
    nodes: nodesWithNew.map((n, i) => ({
      ...n,
      status:
        i === currentPos ? 'highlight' : i === currentPos + 1 ? 'new' : 'normal',
    })),
    pointer: currentPos,
    line: 4,
    description: `📦 创建新节点 s，设置 s.data = ${val}。新节点暂时悬空，还没连接`,
    arrows: arr.slice(0, -1).map((_, i) => ({
      from: i >= currentPos + 1 ? i + 1 : i,
      to: i >= currentPos ? i + 2 : i + 1,
      type: 'normal' as const,
    })),
    newNodePos: 'above',
  });

  const step1Arrows: Arrow[] = [
    ...arr.slice(0, currentPos).map((_, i) => ({
      from: i,
      to: i + 1,
      type: 'normal' as const,
    })),
    { from: currentPos, to: currentPos + 2, type: 'normal' as const, label: 'p→next' },
    { from: currentPos + 1, to: currentPos + 2, type: 'new' as const, label: '① s→next' },
    ...arr.slice(currentPos + 2).map((_, i) => ({
      from: currentPos + 2 + i,
      to: currentPos + 3 + i,
      type: 'normal' as const,
    })),
  ];

  result.push({
    nodes: nodesWithNew.map((n, i) => ({
      ...n,
      status:
        i === currentPos
          ? 'highlight'
          : i === currentPos + 1
          ? 'new'
          : i === currentPos + 2
          ? 'found'
          : 'normal',
    })),
    pointer: currentPos,
    line: 5,
    description: `🔗 【关键步骤1】s.next = p.next：新节点 s 的 next 指针指向原来 p 的后继节点！`,
    arrows: step1Arrows,
    newNodePos: 'above',
  });

  const step2Arrows: Arrow[] = [
    ...arr.slice(0, currentPos).map((_, i) => ({
      from: i,
      to: i + 1,
      type: 'normal' as const,
    })),
    { from: currentPos, to: currentPos + 1, type: 'new' as const, label: '② p→next' },
    { from: currentPos + 1, to: currentPos + 2, type: 'highlight' as const, label: 's→next' },
    ...arr.slice(currentPos + 2).map((_, i) => ({
      from: currentPos + 2 + i,
      to: currentPos + 3 + i,
      type: 'normal' as const,
    })),
  ];

  result.push({
    nodes: nodesWithNew.map((n, i) => ({
      ...n,
      status:
        i === currentPos ? 'highlight' : i === currentPos + 1 ? 'found' : 'normal',
    })),
    pointer: currentPos,
    line: 6,
    description: `🔗 【关键步骤2】p.next = s：前驱节点 p 的 next 指针指向新节点 s！插入完成！`,
    arrows: step2Arrows,
    newNodePos: 'inline',
  });

  const finalArrows = nodesWithNew.slice(0, -1).map((_, i) => ({
    from: i,
    to: i + 1,
    type: 'normal' as const,
  }));
  result.push({
    nodes: nodesWithNew.map((n) => ({ ...n, status: 'normal' })),
    pointer: -1,
    line: 7,
    description: `🎉 成功！值 ${val} 已插入到位置 ${pos}。链表长度: ${arr.length} → ${nodesWithNew.length}`,
    arrows: finalArrows,
    finalNodes: nodesWithNew.map((n) => ({ ...n, status: 'normal' })),
  });

  return { steps: result };
}

function generateDeleteSteps(currentList: ListNode[], pos: number): GenerateResult {
  if (pos < 1) {
    return {
      steps: [],
      error: `❌ 删除位置必须 >= 1，收到 ${pos}`,
    };
  }
  const arr = cloneNodes(currentList);
  const result: Step[] = [];

  const normalArrows = (): Arrow[] =>
    arr.slice(0, -1).map((_, i) => ({ from: i, to: i + 1, type: 'normal' as const }));

  if (pos >= arr.length) {
    return {
      steps: [],
      error: `❌ 位置 ${pos} 超出范围，链表有效删除位置为 1 ~ ${arr.length - 1}`,
    };
  }

  const pIdx = pos - 1;
  const qIdx = pos;
  const delVal = arr[qIdx].value;
  const hasNext = qIdx < arr.length - 1;

  result.push({
    nodes: arr.map((n, i) => ({ ...n, status: i === qIdx ? 'delete' : 'normal' })),
    arrows: normalArrows(),
    pointer: -1,
    line: 0,
    description: `📋 【删除任务】要删除位置 ${pos} 的节点（值=${delVal}）\n💡 核心思想：找到前驱p，让 p.next 跳过q，直接指向 q.next`,
  });

  result.push({
    nodes: arr.map((n, i) => ({
      ...n,
      status: i === 0 ? 'highlight' : i === qIdx ? 'delete' : 'normal',
    })),
    arrows: normalArrows(),
    pointer: 0,
    line: 1,
    description: `🚀 初始化指针 p = L（指向头结点）\n🎯 目标：找到位置 ${pIdx} 的节点（待删节点的前驱）`,
  });

  let currentPos = 0;
  for (let j = 0; j < pIdx && currentPos < arr.length - 1; j++) {
    currentPos++;
    result.push({
      nodes: arr.map((n, i) => ({
        ...n,
        status:
          i === currentPos
            ? 'highlight'
            : i === qIdx
            ? 'delete'
            : i < currentPos
            ? 'found'
            : 'normal',
      })),
      arrows: normalArrows(),
      pointer: currentPos,
      line: 2,
      description: `👉 p = p->next，p 移动到位置 ${currentPos}（值=${arr[currentPos].value}）\n📍 还需移动 ${pIdx - currentPos} 步`,
    });
  }

  result.push({
    nodes: arr.map((n, i) => ({
      ...n,
      status: i === currentPos ? 'highlight' : i === qIdx ? 'delete' : 'normal',
    })),
    arrows: arr.slice(0, -1).map((_, i) => ({
      from: i,
      to: i + 1,
      type: i === currentPos ? ('highlight' as const) : ('normal' as const),
      label: i === currentPos ? 'p.next' : undefined,
    })),
    pointer: currentPos,
    line: 3,
    description: `✅ 找到前驱！p 指向位置 ${currentPos}（值=${arr[currentPos].value}）\n🔗 p.next 当前指向位置 ${qIdx}（待删节点）`,
  });

  result.push({
    nodes: arr.map((n, i) => ({
      ...n,
      status: i === currentPos ? 'highlight' : i === qIdx ? 'delete' : 'normal',
    })),
    arrows: arr.slice(0, -1).map((_, i) => ({
      from: i,
      to: i + 1,
      type:
        i === currentPos
          ? ('highlight' as const)
          : i === qIdx
          ? ('highlight' as const)
          : ('normal' as const),
      label: i === currentPos ? 'p.next→q' : i === qIdx && hasNext ? 'q.next' : undefined,
    })),
    pointer: currentPos,
    pointer2: qIdx,
    line: 4,
    description: `🎯 q = p->next：用指针 q 指向待删除节点\n📌 p 指向位置 ${currentPos}，q 指向位置 ${qIdx}（值=${delVal}）`,
  });

  result.push({
    nodes: arr.map((n, i) => ({
      ...n,
      status:
        i === currentPos
          ? 'highlight'
          : i === qIdx
          ? 'delete'
          : hasNext && i === qIdx + 1
          ? 'new'
          : 'normal',
    })),
    arrows: arr.slice(0, -1).map((_, i) => ({
      from: i,
      to: i + 1,
      type:
        i === currentPos
          ? ('breaking' as const)
          : i === qIdx
          ? ('highlight' as const)
          : ('normal' as const),
      label:
        i === currentPos ? '❌即将断开' : i === qIdx && hasNext ? 'q.next' : undefined,
    })),
    pointer: currentPos,
    pointer2: qIdx,
    line: 5,
    description: `🔍 【关键分析】当前状态：\n• p.next 指向 q（位置${qIdx}）—— 这条链接要断开\n• q.next 指向 ${hasNext ? `位置${qIdx + 1}（值=${arr[qIdx + 1].value}）` : 'NULL'} —— p.next 要改指向这里`,
  });

  result.push({
    nodes: arr.map((n, i) => ({
      ...n,
      status:
        i === currentPos
          ? 'highlight'
          : i === qIdx
          ? 'delete'
          : hasNext && i === qIdx + 1
          ? 'new'
          : 'normal',
    })),
    arrows: [
      ...arr
        .slice(0, -1)
        .filter((_, i) => i !== currentPos && i !== qIdx)
        .map((_, i) => ({
          from: i < currentPos ? i : i < qIdx ? i : i + 1,
          to: i < currentPos ? i + 1 : i < qIdx ? i + 1 : i + 2,
          type: 'normal' as const,
        })),
      { from: currentPos, to: qIdx, type: 'breaking' as const, label: '断开!' },
      ...(hasNext
        ? [{ from: qIdx, to: qIdx + 1, type: 'highlight' as const, label: 'q.next' }]
        : []),
      ...(hasNext
        ? [{ from: currentPos, to: qIdx + 1, type: 'new' as const, label: '✓ p.next=q.next' }]
        : []),
    ],
    pointer: currentPos,
    pointer2: qIdx,
    line: 6,
    description: `🔗 【核心操作】p.next = q.next\n✂️ 断开 p → q 的连接\n✅ 建立 p → ${hasNext ? `位置${qIdx + 1}` : 'NULL'} 的新连接\n💡 这样就"跳过"了 q 节点！`,
  });

  result.push({
    nodes: arr.map((n, i) => ({
      ...n,
      status: i === currentPos ? 'highlight' : i === qIdx ? 'delete' : 'normal',
    })),
    arrows: [
      ...arr.slice(0, currentPos).map((_, i) => ({
        from: i,
        to: i + 1,
        type: 'normal' as const,
      })),
      ...(hasNext
        ? [{ from: currentPos, to: qIdx + 1, type: 'new' as const, label: 'p.next (已修改)' }]
        : []),
      ...(hasNext
        ? [{ from: qIdx, to: qIdx + 1, type: 'breaking' as const, label: '即将删除' }]
        : []),
      ...arr.slice(qIdx + 2, -1).map((_, i) => ({
        from: qIdx + 1 + i,
        to: qIdx + 2 + i,
        type: 'normal' as const,
      })),
    ],
    pointer: currentPos,
    pointer2: qIdx,
    line: 6,
    description: `✅ 指针修改完成！现在 p.next 直接指向 ${hasNext ? `位置${qIdx + 1}` : 'NULL'}\n🔴 节点 q（值=${delVal}）已被"孤立"，不在链表中了`,
  });

  result.push({
    nodes: arr.map((n, i) => ({ ...n, status: i === qIdx ? 'delete' : 'normal' })),
    arrows: [
      ...arr.slice(0, currentPos).map((_, i) => ({
        from: i,
        to: i + 1,
        type: 'normal' as const,
      })),
      ...(hasNext ? [{ from: currentPos, to: qIdx + 1, type: 'normal' as const }] : []),
      ...arr.slice(qIdx + 2, -1).map((_, i) => ({
        from: qIdx + 1 + i,
        to: qIdx + 2 + i,
        type: 'normal' as const,
      })),
    ],
    pointer: -1,
    pointer2: qIdx,
    line: 7,
    description: `🗑️ delete q / free(q)：释放节点 q 的内存空间\n⚠️ 如果不释放，会造成内存泄漏！`,
  });

  const finalNodes = [...arr.slice(0, qIdx), ...arr.slice(qIdx + 1)];
  result.push({
    nodes: finalNodes.map((n) => ({ ...n, status: 'normal' })),
    arrows: finalNodes.slice(0, -1).map((_, i) => ({
      from: i,
      to: i + 1,
      type: 'normal' as const,
    })),
    pointer: -1,
    line: 8,
    description: `🎉 删除成功！节点 ${delVal} 已从链表中移除\n📊 链表长度: ${arr.length} → ${finalNodes.length}`,
    finalNodes: finalNodes.map((n) => ({ ...n, status: 'normal' })),
  });

  return { steps: result };
}

function generateSearchSteps(currentList: ListNode[], val: number): GenerateResult {
  const arr = cloneNodes(currentList);
  const result: Step[] = [];

  if (arr.length <= 1) {
    result.push({
      nodes: arr,
      arrows: [],
      pointer: -1,
      line: 5,
      description: `❌ 链表为空，没有数据可查找！`,
    });
    return { steps: result };
  }

  const baseArrows = (): Arrow[] =>
    arr.slice(0, -1).map((_, i) => ({ from: i, to: i + 1, type: 'normal' as const }));

  result.push({
    nodes: arr,
    arrows: baseArrows(),
    pointer: -1,
    line: 0,
    description: `📋 任务：在链表中查找值为 ${val} 的节点。需要从头开始逐个比较`,
  });

  result.push({
    nodes: arr.map((n, i) => ({
      ...n,
      status: i === 1 ? 'highlight' : i === 0 ? 'found' : 'normal',
    })),
    arrows: baseArrows(),
    pointer: 1,
    line: 1,
    description: `🚀 跳过头结点，p 指向首元结点(位置1，值=${arr[1].value})`,
  });

  let found = false;
  for (let i = 1; i < arr.length; i++) {
    const isMatch = arr[i].value === val;
    result.push({
      nodes: arr.map((n, idx) => ({
        ...n,
        status: idx === i ? 'highlight' : idx < i && idx > 0 ? 'found' : 'normal',
      })),
      arrows: baseArrows(),
      pointer: i,
      line: 3,
      description: `👀 比较: 当前值 ${arr[i].value} ${isMatch ? '==' : '!='} 目标值 ${val} → ${isMatch ? '✅ 匹配！' : '❌ 不匹配'}`,
    });

    if (isMatch) {
      result.push({
        nodes: arr.map((n, idx) => ({ ...n, status: idx === i ? 'found' : 'normal' })),
        arrows: baseArrows(),
        pointer: i,
        line: 3,
        description: `🎉 找到了！值 ${val} 在位置 ${i}，返回该节点`,
      });
      found = true;
      break;
    } else if (i < arr.length - 1) {
      result.push({
        nodes: arr.map((n, idx) => ({
          ...n,
          status: idx === i + 1 ? 'highlight' : idx <= i && idx > 0 ? 'found' : 'normal',
        })),
        arrows: baseArrows(),
        pointer: i + 1,
        line: 4,
        description: `👉 移动到下一个节点(位置${i + 1}，值=${arr[i + 1].value})`,
      });
    }
  }

  if (!found) {
    result.push({
      nodes: arr.map((n, i) => ({ ...n, status: i > 0 ? 'found' : 'normal' })),
      arrows: baseArrows(),
      pointer: -1,
      line: 2,
      description: `🔚 已到达链表末尾 (p == NULL)`,
    });
    result.push({
      nodes: arr.map((n) => ({ ...n, status: 'normal' })),
      arrows: baseArrows(),
      pointer: -1,
      line: 5,
      description: `😔 查找完成，链表中不存在值为 ${val} 的节点，返回 NULL`,
    });
  }

  return { steps: result };
}

const INITIAL_NODES: ListNode[] = [
  { id: 1, value: 0, status: 'normal' },
  { id: 2, value: 12, status: 'normal' },
  { id: 3, value: 25, status: 'normal' },
  { id: 4, value: 37, status: 'normal' },
  { id: 5, value: 48, status: 'normal' },
];

// ----- Geometry constants (shared by layout + rendering) -----
const DATA_W = 48;
const NEXT_W = 32;
const NODE_W = DATA_W + NEXT_W; // 80
const NODE_H = 48;
const NODE_GAP = 44;
const PADDING_LEFT = 56;
const CENTER_Y = 96;
const ABOVE_Y = 12;

function nodeLeftX(i: number): number {
  return PADDING_LEFT + i * (NODE_W + NODE_GAP);
}

export default function LinkedListVisualization() {
  const [nodes, setNodes] = useState<ListNode[]>(INITIAL_NODES);
  const [inputPos, setInputPos] = useState('3');
  const [inputVal, setInputVal] = useState('99');
  const [operation, setOperation] = useState<Operation>('insert');
  const [lang, setLang] = useState<Lang>('cpp');
  const [steps, setSteps] = useState<Step[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const lowMotion = useLowMotionMode();

  const player = useAlgorithmPlayer<Step>({
    steps,
    stepDurationMs: 900,
    autoPlay: false,
    onComplete: () => {
      if (steps.length === 0) return;
      const last = steps[steps.length - 1];
      if (last.finalNodes) setNodes(last.finalNodes);
    },
  });

  const step = player.currentStep;
  const displayNodes = step?.nodes || nodes;
  const currentCode = CODE[operation][lang];

  const startAnimation = useCallback(() => {
    setErrorMessage(null);
    let out: GenerateResult = { steps: [] };
    if (operation === 'insert') {
      const pos = parseInt(inputPos);
      const val = parseInt(inputVal);
      if (Number.isNaN(pos) || Number.isNaN(val)) {
        setErrorMessage('❌ 请输入有效数字');
        setSteps([]);
        return;
      }
      out = generateInsertSteps(nodes, pos, val);
    } else if (operation === 'delete') {
      const pos = parseInt(inputPos);
      if (Number.isNaN(pos)) {
        setErrorMessage('❌ 请输入有效数字');
        setSteps([]);
        return;
      }
      out = generateDeleteSteps(nodes, pos);
    } else {
      const val = parseInt(inputVal);
      if (Number.isNaN(val)) {
        setErrorMessage('❌ 请输入有效数字');
        setSteps([]);
        return;
      }
      out = generateSearchSteps(nodes, val);
    }

    if (out.error) {
      setErrorMessage(out.error);
      setSteps([]);
      return;
    }
    setSteps(out.steps);
  }, [operation, nodes, inputPos, inputVal]);

  const resetAll = () => {
    setNodes(INITIAL_NODES);
    setSteps([]);
    setErrorMessage(null);
  };

  const svgWidth = useMemo(
    () => PADDING_LEFT + displayNodes.length * (NODE_W + NODE_GAP) + 60,
    [displayNodes.length],
  );

  const tailIndex = displayNodes.length - 1;

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            {(['insert', 'delete', 'search'] as Operation[]).map((op) => (
              <button
                key={op}
                onClick={() => {
                  setOperation(op);
                  setSteps([]);
                  setErrorMessage(null);
                }}
                disabled={player.playing}
                className={
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-all ' +
                  (operation === op
                    ? 'bg-white dark:bg-slate-600 text-klein-600 dark:text-klein-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300')
                }
              >
                {OP_NAMES[op]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {operation === 'search' ? '值:' : '位置:'}
            </span>
            <input
              type="number"
              value={operation === 'search' ? inputVal : inputPos}
              onChange={(e) =>
                operation === 'search' ? setInputVal(e.target.value) : setInputPos(e.target.value)
              }
              className="w-14 px-2 py-1 border border-slate-200 dark:border-slate-600 rounded-lg text-center text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              disabled={player.playing}
            />
          </div>
          {operation === 'insert' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">值:</span>
              <input
                type="number"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-14 px-2 py-1 border border-slate-200 dark:border-slate-600 rounded-lg text-center text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                disabled={player.playing}
              />
            </div>
          )}
          <button
            onClick={startAnimation}
            className="cursor-pointer rounded-lg bg-klein-500 px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-klein-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60"
          >
            {OP_NAMES[operation]}
          </button>
          <button
            onClick={resetAll}
            className="px-4 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600"
          >
            重置
          </button>
        </div>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1.5 text-sm font-medium text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
        >
          {errorMessage}
        </div>
      )}

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
            description={step?.description ?? '选择操作并点击执行'}
            totalSteps={steps.length}
            currentIndex={player.index}
          />
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-slate-900 rounded-xl p-6 min-h-[340px] border border-slate-800 overflow-x-auto">
          <div className="relative" style={{ width: svgWidth, minHeight: 220 }}>
            <svg
              width={svgWidth}
              height={220}
              className="overflow-visible"
            >
              <ArrowMarkerDefs prefix="ll" />

              {/* "head" pointer label + arrow down to node 0 */}
              <g>
                <rect
                  x={nodeLeftX(0) + DATA_W / 2 - 22}
                  y={CENTER_Y - 68}
                  width={44}
                  height={18}
                  rx={4}
                  fill="#002FA7"
                />
                <text
                  x={nodeLeftX(0) + DATA_W / 2}
                  y={CENTER_Y - 55}
                  fontFamily="monospace"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="#ffffff"
                >
                  head
                </text>
                <line
                  x1={nodeLeftX(0) + DATA_W / 2}
                  x2={nodeLeftX(0) + DATA_W / 2}
                  y1={CENTER_Y - 50}
                  y2={CENTER_Y - NODE_H / 2 - 2}
                  stroke={ARROW_COLORS.default}
                  strokeWidth={2}
                  markerEnd={arrowUrl('ll', 'default')}
                />
              </g>

              {/* "tail" pointer label over last real node */}
              {displayNodes.length > 1 && (
                <g>
                  <rect
                    x={nodeLeftX(tailIndex) + DATA_W / 2 - 18}
                    y={CENTER_Y - 68}
                    width={36}
                    height={18}
                    rx={4}
                    fill="#334155"
                  />
                  <text
                    x={nodeLeftX(tailIndex) + DATA_W / 2}
                    y={CENTER_Y - 55}
                    fontFamily="monospace"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    fill="#e2e8f0"
                  >
                    tail
                  </text>
                  <line
                    x1={nodeLeftX(tailIndex) + DATA_W / 2}
                    x2={nodeLeftX(tailIndex) + DATA_W / 2}
                    y1={CENTER_Y - 50}
                    y2={CENTER_Y - NODE_H / 2 - 2}
                    stroke="#64748b"
                    strokeWidth={1.5}
                    markerEnd={arrowUrl('ll', 'muted')}
                  />
                </g>
              )}

              {/* Arrows from each node's pointer-cell to the next node's data-cell */}
              {(step?.arrows ?? defaultArrowsOf(displayNodes)).map((a, idx) => {
                const fromLeft = nodeLeftX(a.from);
                const toLeft = nodeLeftX(a.to);
                if (fromLeft === undefined || toLeft === undefined) return null;

                const variant =
                  a.type === 'new'
                    ? 'accent'
                    : a.type === 'highlight'
                    ? 'highlight'
                    : a.type === 'breaking'
                    ? 'danger'
                    : 'default';
                const color = ARROW_COLORS[variant];

                // Start at the center of the source node's pointer cell
                const startX = fromLeft + DATA_W + NEXT_W / 2;
                const startY = CENTER_Y;

                // Target: above-new-node OR normal inline target
                const isAboveTarget =
                  step?.newNodePos === 'above' &&
                  displayNodes[a.to]?.status === 'new';
                const endX = toLeft;
                const endY = isAboveTarget ? ABOVE_Y + NODE_H / 2 : CENTER_Y;

                const isSkip = Math.abs(a.to - a.from) > 1 && !isAboveTarget;
                const strokeDash = a.type === 'breaking' ? '5,4' : undefined;
                const strokeWidth = a.type === 'new' || a.type === 'highlight' ? 2.4 : 2;
                const markerEnd =
                  a.type === 'breaking' ? undefined : arrowUrl('ll', variant);

                let d: string;
                if (isAboveTarget) {
                  // Curve up to the new node's left-middle
                  const cx1 = startX + 20;
                  const cy1 = startY - 30;
                  const cx2 = endX - 20;
                  const cy2 = endY;
                  d = `M ${startX} ${startY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${endX} ${endY}`;
                } else if (isSkip) {
                  const arcHeight = 28 + Math.abs(a.to - a.from) * 4;
                  d = `M ${startX} ${startY} C ${startX + 20} ${startY - arcHeight}, ${endX - 20} ${startY - arcHeight}, ${endX} ${endY}`;
                } else {
                  d = `M ${startX} ${startY} L ${endX} ${endY}`;
                }

                return (
                  <g key={`arrow-${idx}`}>
                    <path
                      d={d}
                      stroke={color}
                      strokeWidth={strokeWidth}
                      strokeDasharray={strokeDash}
                      fill="none"
                      markerEnd={markerEnd}
                    />
                    {/* Breaking arrows get a red X mark near their midpoint */}
                    {a.type === 'breaking' && (
                      <g>
                        <line
                          x1={(startX + endX) / 2 - 5}
                          y1={(startY + endY) / 2 - 5}
                          x2={(startX + endX) / 2 + 5}
                          y2={(startY + endY) / 2 + 5}
                          stroke={ARROW_COLORS.danger}
                          strokeWidth={2}
                        />
                        <line
                          x1={(startX + endX) / 2 - 5}
                          y1={(startY + endY) / 2 + 5}
                          x2={(startX + endX) / 2 + 5}
                          y2={(startY + endY) / 2 - 5}
                          stroke={ARROW_COLORS.danger}
                          strokeWidth={2}
                        />
                      </g>
                    )}
                    {a.label && (
                      <text
                        x={(startX + endX) / 2}
                        y={isSkip ? startY - 30 : isAboveTarget ? startY - 26 : startY - 8}
                        fill={color}
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {a.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Trailing NULL terminator arrow from last real node's pointer cell */}
              {displayNodes.length > 0 && (() => {
                const last = displayNodes.length - 1;
                const startX = nodeLeftX(last) + DATA_W + NEXT_W / 2;
                const endX = nodeLeftX(last) + NODE_W + 20;
                // Only draw this if no explicit arrow already extends beyond the tail.
                const arrows = step?.arrows ?? defaultArrowsOf(displayNodes);
                const alreadyHasBeyondTail = arrows.some((a) => a.from === last);
                if (alreadyHasBeyondTail) return null;
                return (
                  <g>
                    <line
                      x1={startX}
                      y1={CENTER_Y}
                      x2={endX}
                      y2={CENTER_Y}
                      stroke="#64748b"
                      strokeWidth={1.8}
                      markerEnd={arrowUrl('ll', 'muted')}
                    />
                  </g>
                );
              })()}
            </svg>

            {/* Node boxes overlaid as HTML for easier styling & layout animation */}
            {displayNodes.map((node, i) => {
              const left = nodeLeftX(i);
              const isNewAbove = step?.newNodePos === 'above' && node.status === 'new';
              const top = isNewAbove ? ABOVE_Y : CENTER_Y - NODE_H / 2;
              const isPrevPointer = step?.pointer === i;
              const isQPointer = step?.pointer2 === i;
              const isTailPrev =
                displayNodes.length > 1 && i === displayNodes.length - 1;

              return (
                <motion.div
                  key={node.id}
                  layout={!lowMotion}
                  initial={
                    node.status === 'new'
                      ? { opacity: 0, scale: 0.6 }
                      : { opacity: 1, scale: 1 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 26,
                    mass: 0.8,
                  }}
                  className="absolute"
                  style={{ left, top, width: NODE_W, height: NODE_H }}
                >
                  {/* Pointer label chips */}
                  {isPrevPointer && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
                      style={{ top: -30 }}
                    >
                      <span className="rounded-md bg-klein-500 px-1.5 py-0.5 text-[10px] font-mono font-bold text-white shadow">
                        p
                      </span>
                      <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-transparent border-t-klein-500" />
                    </div>
                  )}
                  {isQPointer && (
                    <div
                      className="absolute left-1/2 translate-x-4 flex flex-col items-center"
                      style={{ top: -30 }}
                    >
                      <span className="rounded-md bg-rose-500 px-1.5 py-0.5 text-[10px] font-mono font-bold text-white shadow">
                        q
                      </span>
                      <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-transparent border-t-rose-500" />
                    </div>
                  )}
                  {node.status === 'new' && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
                      style={{ top: -30 }}
                    >
                      <span className="rounded-md bg-pine-500 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-900 shadow">
                        s
                      </span>
                      <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-transparent border-t-pine-500" />
                    </div>
                  )}

                  {/* Two-cell node: data | next */}
                  <div
                    className={
                      'flex h-full w-full rounded-lg overflow-hidden border-2 transition-all duration-200 ' +
                      (node.status === 'highlight'
                        ? 'border-klein-300 shadow-md shadow-klein-500/30'
                        : node.status === 'found'
                        ? 'border-emerald-400 shadow-md shadow-emerald-500/30'
                        : node.status === 'new'
                        ? 'border-pine-400 shadow-md shadow-pine-500/40'
                        : node.status === 'delete'
                        ? 'border-rose-400 opacity-60'
                        : 'border-slate-600')
                    }
                  >
                    {/* Data cell */}
                    <div
                      className={
                        'flex flex-col items-center justify-center border-r-2 ' +
                        (node.status === 'highlight'
                          ? 'bg-klein-500 text-white border-r-klein-700'
                          : node.status === 'found'
                          ? 'bg-emerald-500 text-white border-r-emerald-700'
                          : node.status === 'new'
                          ? 'bg-pine-500 text-slate-900 border-r-pine-700'
                          : node.status === 'delete'
                          ? 'bg-rose-500/70 text-white border-r-rose-700'
                          : 'bg-klein-500/85 text-white border-r-klein-700')
                      }
                      style={{ width: DATA_W }}
                    >
                      {i === 0 ? (
                        <span className="text-[10px] font-mono opacity-80">HEAD</span>
                      ) : (
                        <>
                          <span className="text-[9px] font-mono opacity-70 leading-none">data</span>
                          <span className="font-mono text-sm font-bold leading-tight">
                            {node.value}
                          </span>
                        </>
                      )}
                    </div>
                    {/* Next/pointer cell */}
                    <div
                      className={
                        'relative flex items-center justify-center ' +
                        (isTailPrev
                          ? 'bg-slate-800'
                          : node.status === 'delete'
                          ? 'bg-rose-500/40'
                          : 'bg-slate-800')
                      }
                      style={{ width: NEXT_W }}
                    >
                      {isTailPrev ? (
                        <>
                          {/* NULL indicator with diagonal slash */}
                          <svg
                            width={NEXT_W}
                            height={NODE_H - 4}
                            className="absolute inset-0"
                          >
                            <line
                              x1={2}
                              y1={NODE_H - 6}
                              x2={NEXT_W - 2}
                              y2={2}
                              stroke="#64748b"
                              strokeWidth={1.2}
                            />
                          </svg>
                          <span className="relative text-[9px] font-mono text-slate-400">
                            NULL
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400">next</span>
                      )}
                    </div>
                  </div>

                  {/* Index label below */}
                  <div className="absolute left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-500"
                       style={{ bottom: -20 }}>
                    [{i}]
                  </div>
                </motion.div>
              );
            })}

            {/* AnimatePresence wraps for exit animations. Since we iterate in-place,
                we can also provide an empty AnimatePresence at top-level to keep
                framer happy if needed. */}
            <AnimatePresence />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
            <LegendChip color="bg-klein-500" label="普通节点" />
            <LegendChip color="bg-klein-400" label="当前指针 p" />
            <LegendChip color="bg-rose-500" label="辅助指针 q" />
            <LegendChip color="bg-pine-500" label="新节点 s" />
            <LegendChip color="bg-emerald-500" label="已访问" />
            <LegendChip color="border-slate-400" label="NULL 终结" outline />
          </div>
        </div>
        <div className="lg:col-span-2 bg-slate-900 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-300 font-medium text-sm">{OP_NAMES[operation]}操作</span>
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
          <div className="font-mono text-xs space-y-0.5 max-h-[260px] overflow-y-auto">
            {currentCode.map((item: { text: string; indent: number }, i: number) => (
              <div
                key={i}
                className={
                  'py-0.5 px-2 rounded transition-all duration-200 ' +
                  (step?.line === i
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
    <div className="flex items-center gap-1.5">
      <div
        className={
          'w-3 h-3 rounded-sm ' +
          (outline ? 'border-2 border-dashed bg-transparent ' : '') +
          color
        }
      />
      <span>{label}</span>
    </div>
  );
}
