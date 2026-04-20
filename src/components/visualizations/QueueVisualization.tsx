import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAlgorithmPlayer } from '../../hooks/useAlgorithmPlayer';
import useLowMotionMode from '../../hooks/useLowMotionMode';
import { PlayerControls } from './_shared/PlayerControls';
import { StepNarration } from './_shared/StepNarration';

interface QueueItem {
  value: number;
  status: 'normal' | 'enqueue' | 'dequeue' | 'front' | 'rear';
}

type Step =
  | {
      kind: 'snapshot';
      queue: QueueItem[];
      front: number;
      rear: number;
      line: number;
      description: string;
      op: 'enqueue' | 'dequeue' | 'none';
      wrapped?: boolean;
    };

type Operation = 'enqueue' | 'dequeue';
type Lang = 'cpp' | 'java' | 'python';
type ViewMode = 'linear' | 'ring';

const MAX_CAPACITY = 8;

const CODE: Record<Operation, Record<Lang, { text: string; indent: number }[]>> = {
  enqueue: {
    cpp: [
      { text: 'bool EnQueue(Queue &Q, int x) {', indent: 0 },
      { text: 'if ((Q.rear + 1) % MAXSIZE == Q.front)', indent: 1 },
      { text: 'return false;  // 队满', indent: 2 },
      { text: 'Q.data[Q.rear] = x;', indent: 1 },
      { text: 'Q.rear = (Q.rear + 1) % MAXSIZE;', indent: 1 },
      { text: 'return true;', indent: 1 },
      { text: '}', indent: 0 },
    ],
    java: [
      { text: 'boolean enQueue(int x) {', indent: 0 },
      { text: 'if ((rear + 1) % MAXSIZE == front)', indent: 1 },
      { text: 'return false;  // 队满', indent: 2 },
      { text: 'data[rear] = x;', indent: 1 },
      { text: 'rear = (rear + 1) % MAXSIZE;', indent: 1 },
      { text: 'return true;', indent: 1 },
      { text: '}', indent: 0 },
    ],
    python: [
      { text: 'def enqueue(self, x):', indent: 0 },
      { text: 'if (self.rear + 1) % MAXSIZE == self.front:', indent: 1 },
      { text: 'return False  # 队满', indent: 2 },
      { text: 'self.data[self.rear] = x', indent: 1 },
      { text: 'self.rear = (self.rear + 1) % MAXSIZE', indent: 1 },
      { text: 'return True', indent: 1 },
    ],
  },
  dequeue: {
    cpp: [
      { text: 'bool DeQueue(Queue &Q, int &x) {', indent: 0 },
      { text: 'if (Q.front == Q.rear)', indent: 1 },
      { text: 'return false;  // 队空', indent: 2 },
      { text: 'x = Q.data[Q.front];', indent: 1 },
      { text: 'Q.front = (Q.front + 1) % MAXSIZE;', indent: 1 },
      { text: 'return true;', indent: 1 },
      { text: '}', indent: 0 },
    ],
    java: [
      { text: 'int deQueue() {', indent: 0 },
      { text: 'if (front == rear)', indent: 1 },
      { text: 'return -1;  // 队空', indent: 2 },
      { text: 'int x = data[front];', indent: 1 },
      { text: 'front = (front + 1) % MAXSIZE;', indent: 1 },
      { text: 'return x;', indent: 1 },
      { text: '}', indent: 0 },
    ],
    python: [
      { text: 'def dequeue(self):', indent: 0 },
      { text: 'if self.front == self.rear:', indent: 1 },
      { text: 'return None  # 队空', indent: 2 },
      { text: 'x = self.data[self.front]', indent: 1 },
      { text: 'self.front = (self.front + 1) % MAXSIZE', indent: 1 },
      { text: 'return x', indent: 1 },
    ],
  },
};

const ALGO_DESC = {
  idea: '循环队列：FIFO 结构 + 取模实现首尾相连，巧妙利用固定容量数组',
  steps: [
    '入队：Q.data[rear]=x；rear = (rear+1) % MAXSIZE',
    '出队：front = (front+1) % MAXSIZE',
    '判满：(rear+1)%MAXSIZE == front',
    '判空：front == rear',
  ],
};

interface QueueState {
  queue: QueueItem[];
  front: number;
  rear: number;
}

function markFrontRear(items: QueueItem[]): QueueItem[] {
  const base: QueueItem[] = items.map((s) => ({ value: s.value, status: 'normal' }));
  if (base.length > 0) base[0] = { value: base[0].value, status: 'front' };
  if (base.length > 0) {
    base[base.length - 1] = { value: base[base.length - 1].value, status: 'rear' };
  }
  return base;
}

function buildEnqueueSteps(state: QueueState, v: number): Step[] {
  const { queue, front, rear } = state;
  const result: Step[] = [];
  const base = markFrontRear(queue);

  result.push({
    kind: 'snapshot',
    queue: base,
    front,
    rear,
    line: 0,
    description: `📋 入队操作：将元素 ${v} 加入队尾`,
    op: 'enqueue',
  });

  const nextRear = (rear + 1) % MAX_CAPACITY;
  const full = nextRear === front && queue.length > 0;
  const wrapping = rear === MAX_CAPACITY - 1 && nextRear === 0;

  result.push({
    kind: 'snapshot',
    queue: base,
    front,
    rear,
    line: 1,
    description: `🔍 检查队满: (rear+1)%MAXSIZE = (${rear}+1)%${MAX_CAPACITY} = ${nextRear}, front = ${front} → ${full ? '队满!' : '未满'}`,
    op: 'enqueue',
  });

  const normalized: QueueItem[] = base.map((s) => ({ value: s.value, status: 'normal' }));
  const incoming: QueueItem = { value: v, status: 'enqueue' };

  result.push({
    kind: 'snapshot',
    queue: [...normalized, incoming],
    front,
    rear,
    line: 3,
    description: `📥 存入数据: Q.data[${rear}] = ${v}`,
    op: 'enqueue',
  });

  result.push({
    kind: 'snapshot',
    queue: [...normalized, { value: v, status: 'rear' }],
    front,
    rear: nextRear,
    line: 4,
    description: wrapping
      ? `🔁 【环绕】rear 从 ${rear} 经过取模回到 ${nextRear}  —— 这就是"循环队列"的奥秘`
      : `👉 rear后移: rear = (${rear}+1)%${MAX_CAPACITY} = ${nextRear}`,
    op: 'enqueue',
    wrapped: wrapping,
  });

  const finalArr: QueueItem[] = [...normalized, { value: v, status: 'rear' }];
  if (finalArr.length > 0) {
    finalArr[0] = { value: finalArr[0].value, status: 'front' };
  }

  result.push({
    kind: 'snapshot',
    queue: finalArr,
    front,
    rear: nextRear,
    line: 5,
    description: `🎉 入队成功！元素 ${v} 已加入队尾，队列长度: ${queue.length} → ${finalArr.length}`,
    op: 'enqueue',
  });

  return result;
}

function buildDequeueSteps(state: QueueState): Step[] {
  const { queue, front, rear } = state;
  const result: Step[] = [];
  const base = markFrontRear(queue);
  const dequeueVal = base.length > 0 ? base[0].value : 0;

  result.push({
    kind: 'snapshot',
    queue: base,
    front,
    rear,
    line: 0,
    description: `📋 出队操作：从队头取出元素`,
    op: 'dequeue',
  });

  result.push({
    kind: 'snapshot',
    queue: base,
    front,
    rear,
    line: 1,
    description: `🔍 检查队空: front(${front}) == rear(${rear}) ? → ${front === rear ? '队空!' : '不为空'}`,
    op: 'dequeue',
  });

  const withDequeueHighlight: QueueItem[] = base.map((s, i) =>
    i === 0 ? { value: s.value, status: 'dequeue' } : s,
  );

  result.push({
    kind: 'snapshot',
    queue: withDequeueHighlight,
    front,
    rear,
    line: 3,
    description: `📤 取出数据: x = Q.data[${front}] = ${dequeueVal}`,
    op: 'dequeue',
  });

  const nextFront = (front + 1) % MAX_CAPACITY;
  const wrapping = front === MAX_CAPACITY - 1 && nextFront === 0;
  const remaining = markFrontRear(base.slice(1));

  result.push({
    kind: 'snapshot',
    queue: remaining,
    front: nextFront,
    rear,
    line: 4,
    description: wrapping
      ? `🔁 【环绕】front 从 ${front} 经过取模回到 ${nextFront}`
      : `👉 front后移: front = (${front}+1)%${MAX_CAPACITY} = ${nextFront}`,
    op: 'dequeue',
    wrapped: wrapping,
  });

  result.push({
    kind: 'snapshot',
    queue: remaining,
    front: nextFront,
    rear,
    line: 5,
    description: `🎉 出队成功！元素 ${dequeueVal} 已出队，队列长度: ${queue.length} → ${remaining.length}`,
    op: 'dequeue',
  });

  return result;
}

const INITIAL_QUEUE: QueueItem[] = [
  { value: 15, status: 'front' },
  { value: 28, status: 'normal' },
  { value: 42, status: 'rear' },
];

// ----- Ring geometry helpers -----
const RING_R = 96;
const RING_SLOT_R = 20;

function slotAngleRad(slotIdx: number, capacity: number): number {
  // 12-o'clock is slot 0; rotate clockwise.
  return -Math.PI / 2 + (2 * Math.PI * slotIdx) / capacity;
}

function slotCenter(slotIdx: number, capacity: number, cx: number, cy: number) {
  const a = slotAngleRad(slotIdx, capacity);
  return { x: cx + Math.cos(a) * RING_R, y: cy + Math.sin(a) * RING_R };
}

export default function QueueVisualization() {
  const [committed, setCommitted] = useState<QueueState>({
    queue: INITIAL_QUEUE,
    front: 0,
    rear: 3,
  });
  const [input, setInput] = useState('');
  const [operation, setOperation] = useState<Operation>('enqueue');
  const [lang, setLang] = useState<Lang>('cpp');
  const [pendingSteps, setPendingSteps] = useState<Step[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('linear');
  const lowMotion = useLowMotionMode();

  const steps = pendingSteps;
  const currentCode = CODE[operation][lang];

  const player = useAlgorithmPlayer<Step>({
    steps,
    stepDurationMs: 900,
    autoPlay: false,
    onComplete: () => {
      if (steps.length === 0) return;
      const last = steps[steps.length - 1];
      setCommitted({ queue: last.queue, front: last.front, rear: last.rear });
    },
  });

  const current = player.currentStep;
  const displayQueue = current?.queue ?? committed.queue;
  const displayFront = current?.front ?? committed.front;
  const displayRear = current?.rear ?? committed.rear;
  const activeLine = current?.line ?? -1;
  const isWrapped = !!current?.wrapped;

  const canEnqueue = committed.queue.length < MAX_CAPACITY - 1;

  const startEnqueue = () => {
    const v = parseInt(input);
    if (isNaN(v)) return;
    if (!canEnqueue) return;
    setOperation('enqueue');
    setPendingSteps(buildEnqueueSteps(committed, v));
    setInput('');
  };

  const startDequeue = () => {
    if (committed.queue.length === 0) return;
    setOperation('dequeue');
    setPendingSteps(buildDequeueSteps(committed));
  };

  const resetAll = () => {
    setCommitted({ queue: INITIAL_QUEUE, front: 0, rear: 3 });
    setPendingSteps([]);
    setInput('');
  };

  const narrationDescription = useMemo(() => {
    if (current) return current.description;
    return '👆 点击"入队"或"出队"按钮开始演示';
  }, [current]);

  // Compute which physical slot indices are occupied (for ring view).
  // displayFront -> modular sequence of length displayQueue.length.
  const occupiedSlots = useMemo(() => {
    const set = new Map<number, QueueItem>();
    for (let i = 0; i < displayQueue.length; i++) {
      const slot = (displayFront + i) % MAX_CAPACITY;
      set.set(slot, displayQueue[i]);
    }
    return set;
  }, [displayQueue, displayFront]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-50 to-emerald-50 dark:from-cyan-900/30 dark:to-emerald-900/30 p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">{ALGO_DESC.idea}</h3>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-2 grid md:grid-cols-2 gap-1">
              {ALGO_DESC.steps.map((s, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="w-5 h-5 bg-cyan-100 text-cyan-700 rounded text-xs flex items-center justify-center font-mono">
                    {i + 1}
                  </span>
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div className="flex bg-white/80 dark:bg-slate-900/60 rounded-lg p-0.5 text-xs">
            {(['linear', 'ring'] as ViewMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={
                  'px-2.5 py-1 rounded transition-all ' +
                  (viewMode === m
                    ? 'bg-klein-500 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400')
                }
              >
                {m === 'linear' ? '线性视图' : '环形视图'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2">
        <div className="p-6 border-r border-slate-200 dark:border-slate-700">
          <div className="flex flex-wrap gap-2 mb-4">
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入数值"
              className="w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              disabled={steps.length > 0}
            />
            <button
              onClick={startEnqueue}
              disabled={player.playing || !input || !canEnqueue || steps.length > 0}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
            >
              入队 EnQueue
            </button>
            <button
              onClick={startDequeue}
              disabled={player.playing || committed.queue.length === 0 || steps.length > 0}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 disabled:opacity-50"
            >
              出队 DeQueue
            </button>
            <button
              onClick={resetAll}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-500"
            >
              重置
            </button>
          </div>

          {steps.length > 0 && (
            <div className="mb-4 space-y-2">
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

          {/* Visualization stage */}
          <div className="relative bg-slate-900 rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] uppercase tracking-wide text-slate-500 font-mono">
                {viewMode === 'linear' ? '环形缓冲的数组视图' : '环形示意'}
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                size: <span className="text-klein-300 font-bold">{displayQueue.length}</span>
                <span className="text-slate-600"> / </span>
                capacity:{' '}
                <span className="text-slate-300 font-bold">{MAX_CAPACITY}</span>
              </div>
            </div>

            {viewMode === 'linear' ? (
              <LinearView
                displayFront={displayFront}
                displayRear={displayRear}
                occupiedSlots={occupiedSlots}
                isWrapped={isWrapped}
                lowMotion={lowMotion}
              />
            ) : (
              <RingView
                displayFront={displayFront}
                displayRear={displayRear}
                occupiedSlots={occupiedSlots}
                isWrapped={isWrapped}
                lowMotion={lowMotion}
              />
            )}

            {/* Legend */}
            <div className="flex justify-center gap-3 text-[11px] mt-4 pt-4 border-t border-slate-800">
              <LegendChip color="bg-emerald-500" label="head / front" />
              <LegendChip color="bg-pine-500" label="tail / rear" />
              <LegendChip color="bg-klein-500" label="已占用" />
              <LegendChip outline label="空槽位" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <StatCard
              label="队列长度"
              value={String(displayQueue.length)}
              tone="slate"
            />
            <StatCard label="front 指针" value={String(displayFront)} tone="emerald" />
            <StatCard label="rear 指针" value={String(displayRear)} tone="pine" />
          </div>
        </div>

        <div className="p-6 bg-slate-900">
          <div className="flex gap-2 mb-4">
            {(['cpp', 'java', 'python'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={
                  'px-3 py-1 rounded text-sm font-medium ' +
                  (lang === l
                    ? 'bg-klein-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700')
                }
              >
                {l === 'cpp' ? 'C++' : l === 'java' ? 'Java' : 'Python'}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setOperation('enqueue')}
              className={
                'px-3 py-1 rounded text-sm ' +
                (operation === 'enqueue'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300')
              }
            >
              入队代码
            </button>
            <button
              onClick={() => setOperation('dequeue')}
              className={
                'px-3 py-1 rounded text-sm ' +
                (operation === 'dequeue'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 text-slate-300')
              }
            >
              出队代码
            </button>
          </div>

          <div className="font-mono text-sm space-y-1">
            {currentCode.map((item: { text: string; indent: number }, i: number) => (
              <div
                key={i}
                className={
                  'py-1 px-2 rounded transition-all ' +
                  (activeLine === i
                    ? 'bg-pine-500/25 text-pine-100 border-l-2 border-pine-400'
                    : 'text-slate-400 border-l-2 border-transparent')
                }
                style={{ paddingLeft: item.indent * 16 + 8 + 'px' }}
              >
                <span className="text-slate-600 w-4 inline-block mr-2">{i + 1}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ViewProps {
  displayFront: number;
  displayRear: number;
  occupiedSlots: Map<number, QueueItem>;
  isWrapped: boolean;
  lowMotion: boolean;
}

function LinearView({
  displayFront,
  displayRear,
  occupiedSlots,
  isWrapped,
  lowMotion,
}: ViewProps) {
  const SLOT_W = 52;
  const SLOT_H = 56;
  const SLOT_GAP = 6;
  const SLOT_PITCH = SLOT_W + SLOT_GAP;
  const LEFT_PAD = 18;
  const TOP_PAD = 52; // space for HEAD / TAIL pointer chips
  const width = LEFT_PAD * 2 + MAX_CAPACITY * SLOT_PITCH - SLOT_GAP;
  const height = TOP_PAD + SLOT_H + 28;

  const slotCenterX = (i: number) => LEFT_PAD + i * SLOT_PITCH + SLOT_W / 2;

  return (
    <div className="relative flex justify-center">
      <div className="relative" style={{ width, height }}>
        {/* HEAD pointer chip */}
        <motion.div
          layout={!lowMotion}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="absolute flex flex-col items-center"
          style={{
            left: slotCenterX(displayFront) - 26,
            top: 0,
            width: 52,
          }}
        >
          <span className="rounded-md bg-emerald-500 px-1.5 py-0.5 text-[10px] font-mono font-bold text-white shadow">
            HEAD
          </span>
          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-transparent border-t-emerald-500" />
          <span className="text-[10px] font-mono text-emerald-400 mt-1">
            front={displayFront}
          </span>
        </motion.div>

        {/* TAIL pointer chip */}
        <motion.div
          layout={!lowMotion}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="absolute flex flex-col items-center"
          style={{
            left: slotCenterX(displayRear) - 26,
            top: 0,
            width: 52,
          }}
        >
          <span className="rounded-md bg-pine-500 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-900 shadow">
            TAIL
          </span>
          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-transparent border-t-pine-500" />
          <span className="text-[10px] font-mono text-pine-400 mt-1">
            rear={displayRear}
          </span>
        </motion.div>

        {/* Slots */}
        <div className="absolute" style={{ top: TOP_PAD, left: LEFT_PAD }}>
          <div className="flex" style={{ gap: SLOT_GAP }}>
            {Array.from({ length: MAX_CAPACITY }).map((_, i) => {
              const occ = occupiedSlots.get(i);
              const isFront = i === displayFront && occupiedSlots.has(i);
              const isRear =
                occupiedSlots.has(i) &&
                i === (displayRear - 1 + MAX_CAPACITY) % MAX_CAPACITY;
              return (
                <div
                  key={i}
                  className="relative"
                  style={{ width: SLOT_W, height: SLOT_H }}
                >
                  <motion.div
                    layout={!lowMotion}
                    animate={
                      occ?.status === 'enqueue'
                        ? { scale: [1, 1.08, 1] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={
                      'w-full h-full rounded-lg border-2 flex flex-col items-center justify-center font-mono transition-colors duration-200 ' +
                      (!occ
                        ? 'bg-transparent border-dashed border-slate-700 text-slate-600'
                        : occ.status === 'enqueue'
                        ? 'bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-500/30'
                        : occ.status === 'dequeue'
                        ? 'bg-rose-500 border-rose-400 text-white shadow-md shadow-rose-500/30'
                        : isFront
                        ? 'bg-emerald-500/90 border-emerald-400 text-white'
                        : isRear
                        ? 'bg-pine-500/90 border-pine-400 text-slate-900'
                        : 'bg-klein-500/85 border-klein-400 text-white')
                    }
                  >
                    {occ ? (
                      <>
                        <span className="text-[9px] opacity-70">data</span>
                        <span className="text-sm font-bold tabular-nums">{occ.value}</span>
                      </>
                    ) : (
                      <span className="text-[11px] opacity-60">—</span>
                    )}
                  </motion.div>
                  {/* Index below */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-500"
                    style={{ bottom: -18 }}
                  >
                    [{i}]
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wrap-around connector: visually suggest that slot MAX-1 wraps back to slot 0 */}
        <svg
          width={width}
          height={height}
          className="absolute inset-0 pointer-events-none"
        >
          <path
            d={`M ${slotCenterX(MAX_CAPACITY - 1)} ${TOP_PAD + SLOT_H + 12}
                C ${slotCenterX(MAX_CAPACITY - 1) + 24} ${TOP_PAD + SLOT_H + 34},
                  ${slotCenterX(0) - 24} ${TOP_PAD + SLOT_H + 34},
                  ${slotCenterX(0)} ${TOP_PAD + SLOT_H + 12}`}
            stroke={isWrapped ? '#FFE135' : '#334155'}
            strokeWidth={isWrapped ? 2 : 1}
            strokeDasharray="4,4"
            fill="none"
            className="transition-[stroke,stroke-width] duration-200"
          />
          {isWrapped && (
            <text
              x={(slotCenterX(MAX_CAPACITY - 1) + slotCenterX(0)) / 2}
              y={TOP_PAD + SLOT_H + 26}
              textAnchor="middle"
              fontSize={10}
              fontFamily="monospace"
              fill="#FFE135"
            >
              wrap!
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}

function RingView({
  displayFront,
  displayRear,
  occupiedSlots,
  isWrapped,
  lowMotion,
}: ViewProps) {
  const size = RING_R * 2 + 80;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Base ring track */}
        <circle
          cx={cx}
          cy={cy}
          r={RING_R}
          fill="none"
          stroke="#1e293b"
          strokeWidth={1}
          strokeDasharray="3,4"
        />

        {/* Wrap-edge highlight (from slot N-1 back to 0) when wrapping happened */}
        {isWrapped && (
          <circle
            cx={cx}
            cy={cy}
            r={RING_R}
            fill="none"
            stroke="#FFE135"
            strokeWidth={2}
            strokeDasharray="4,6"
            opacity={0.5}
          />
        )}

        {/* Slots */}
        {Array.from({ length: MAX_CAPACITY }).map((_, i) => {
          const { x, y } = slotCenter(i, MAX_CAPACITY, cx, cy);
          const occ = occupiedSlots.get(i);
          const isFront = i === displayFront && occupiedSlots.has(i);
          const isRearOccupied =
            occupiedSlots.has(i) &&
            i === (displayRear - 1 + MAX_CAPACITY) % MAX_CAPACITY;
          const fill = !occ
            ? '#0f172a'
            : occ.status === 'enqueue'
            ? '#10b981'
            : occ.status === 'dequeue'
            ? '#f43f5e'
            : isFront
            ? '#10b981'
            : isRearOccupied
            ? '#FFE135'
            : '#002FA7';
          const stroke = !occ ? '#334155' : '#ffffff22';
          const textColor = occ?.status === 'enqueue'
            ? '#ffffff'
            : isRearOccupied
            ? '#1e293b'
            : occ
            ? '#ffffff'
            : '#475569';

          return (
            <g key={i}>
              <motion.circle
                layout={!lowMotion}
                cx={x}
                cy={y}
                r={RING_SLOT_R}
                fill={fill}
                stroke={stroke}
                strokeWidth={2}
                strokeDasharray={occ ? undefined : '3,3'}
                animate={
                  occ?.status === 'enqueue' || occ?.status === 'dequeue'
                    ? { scale: [1, 1.12, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{ transformOrigin: `${x}px ${y}px` }}
              />
              {occ ? (
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontSize={12}
                  fontWeight="bold"
                  fill={textColor}
                >
                  {occ.value}
                </text>
              ) : (
                <text
                  x={x}
                  y={y + 3}
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontSize={10}
                  fill="#475569"
                >
                  ·
                </text>
              )}
              {/* slot-index label just outside the ring */}
              <text
                x={cx + Math.cos(slotAngleRad(i, MAX_CAPACITY)) * (RING_R + 22)}
                y={cy + Math.sin(slotAngleRad(i, MAX_CAPACITY)) * (RING_R + 22) + 3}
                textAnchor="middle"
                fontFamily="monospace"
                fontSize={9}
                fill="#64748b"
              >
                [{i}]
              </text>
            </g>
          );
        })}

        {/* front pointer arrow (from center) */}
        {(() => {
          const p = slotCenter(displayFront, MAX_CAPACITY, cx, cy);
          return (
            <g>
              <line
                x1={cx}
                y1={cy}
                x2={p.x - (Math.cos(slotAngleRad(displayFront, MAX_CAPACITY)) * RING_SLOT_R)}
                y2={p.y - (Math.sin(slotAngleRad(displayFront, MAX_CAPACITY)) * RING_SLOT_R)}
                stroke="#10b981"
                strokeWidth={2}
              />
              <circle cx={cx} cy={cy} r={3} fill="#10b981" />
            </g>
          );
        })()}
        {/* rear pointer arrow */}
        {(() => {
          const p = slotCenter(displayRear, MAX_CAPACITY, cx, cy);
          return (
            <g>
              <line
                x1={cx}
                y1={cy}
                x2={p.x - (Math.cos(slotAngleRad(displayRear, MAX_CAPACITY)) * RING_SLOT_R)}
                y2={p.y - (Math.sin(slotAngleRad(displayRear, MAX_CAPACITY)) * RING_SLOT_R)}
                stroke="#FFE135"
                strokeWidth={2}
                strokeDasharray="4,3"
              />
            </g>
          );
        })()}
        {/* Center label */}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fontFamily="monospace"
          fontSize={10}
          fill="#94a3b8"
        >
          循环队列
        </text>
        <text
          x={cx}
          y={cy + 8}
          textAnchor="middle"
          fontFamily="monospace"
          fontSize={9}
          fill="#64748b"
        >
          front={displayFront}
        </text>
        <text
          x={cx}
          y={cy + 22}
          textAnchor="middle"
          fontFamily="monospace"
          fontSize={9}
          fill="#64748b"
        >
          rear={displayRear}
        </text>
      </svg>
    </div>
  );
}

function LegendChip({
  color,
  label,
  outline,
}: {
  color?: string;
  label: string;
  outline?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
      <div
        className={
          'w-3 h-3 rounded-sm ' +
          (outline
            ? 'border-2 border-dashed border-slate-500'
            : color ?? 'bg-slate-500')
        }
      />
      <span>{label}</span>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'slate' | 'emerald' | 'pine';
}) {
  const toneCls =
    tone === 'emerald'
      ? 'text-emerald-600 dark:text-emerald-400'
      : tone === 'pine'
      ? 'text-amber-600 dark:text-pine-300'
      : 'text-slate-800 dark:text-slate-200';
  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 rounded-lg p-2">
      <div className={'text-lg font-mono font-bold tabular-nums ' + toneCls}>{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
