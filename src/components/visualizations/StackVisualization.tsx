import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAlgorithmPlayer } from '../../hooks/useAlgorithmPlayer';
import useLowMotionMode from '../../hooks/useLowMotionMode';
import { PlayerControls } from './_shared/PlayerControls';
import { StepNarration } from './_shared/StepNarration';

interface StackItem {
  value: number;
  status: 'normal' | 'pushing' | 'popping' | 'top';
  // Stable key to keep framer-motion exit animations correct.
  key?: number;
}

interface Step {
  stack: StackItem[];
  line: number;
  description: string;
  op: 'push' | 'pop' | 'none';
}

const MAX_CAPACITY = 8;

const PUSH_CODE = [
  { text: 'bool Push(Stack *s, int x) {', indent: 0 },
  { text: 'if (s->top == MAXSIZE-1)', indent: 1 },
  { text: 'return false;  // 栈满', indent: 2 },
  { text: 's->top++;', indent: 1 },
  { text: 's->data[s->top] = x;', indent: 1 },
  { text: 'return true;', indent: 1 },
  { text: '}', indent: 0 },
];

const POP_CODE = [
  { text: 'bool Pop(Stack *s, int *x) {', indent: 0 },
  { text: 'if (s->top == -1)', indent: 1 },
  { text: 'return false;  // 栈空', indent: 2 },
  { text: '*x = s->data[s->top];', indent: 1 },
  { text: 's->top--;', indent: 1 },
  { text: 'return true;', indent: 1 },
  { text: '}', indent: 0 },
];

let itemKey = 1000;
function withKeys(items: StackItem[]): StackItem[] {
  return items.map((s) => ({ ...s, key: s.key ?? ++itemKey }));
}

function buildPushSteps(current: StackItem[], v: number): Step[] {
  const result: Step[] = [];
  const arr = current.map<StackItem>((s) => ({ value: s.value, status: 'normal', key: s.key }));

  result.push({
    stack: arr,
    line: 1,
    description: `检查栈满: top(${arr.length - 1}) == MAXSIZE-1(${MAX_CAPACITY - 1}) ? → ${arr.length >= MAX_CAPACITY ? '是' : '否'}`,
    op: 'push',
  });

  result.push({
    stack: arr,
    line: 3,
    description: `执行 s->top++，top: ${arr.length - 1} → ${arr.length}`,
    op: 'push',
  });

  const newItem: StackItem = { value: v, status: 'pushing', key: ++itemKey };
  result.push({
    stack: [...arr, newItem],
    line: 4,
    description: `执行 s->data[${arr.length}] = ${v}，将 ${v} 存入栈顶`,
    op: 'push',
  });

  result.push({
    stack: [...arr, { ...newItem, status: 'top' }],
    line: 5,
    description: `✓ 入栈成功！元素 ${v} 已入栈，当前 top = ${arr.length}`,
    op: 'push',
  });

  return result;
}

function buildPopSteps(current: StackItem[]): Step[] {
  const result: Step[] = [];
  const arr = current.map<StackItem>((s) => ({ value: s.value, status: 'normal', key: s.key }));
  const popVal = arr[arr.length - 1].value;

  result.push({
    stack: arr,
    line: 1,
    description: `检查栈空: top(${arr.length - 1}) == -1 ? → 否`,
    op: 'pop',
  });

  result.push({
    stack: arr.map<StackItem>((s, i) =>
      i === arr.length - 1 ? { value: s.value, status: 'popping', key: s.key } : s,
    ),
    line: 3,
    description: `执行 *x = s->data[${arr.length - 1}]，取出栈顶元素 ${popVal}`,
    op: 'pop',
  });

  const afterPop = arr.slice(0, -1);
  result.push({
    stack: afterPop,
    line: 4,
    description: `执行 s->top--，top: ${arr.length - 1} → ${arr.length - 2}`,
    op: 'pop',
  });

  const finalStack: StackItem[] =
    afterPop.length > 0
      ? afterPop.map<StackItem>((s, i, a) =>
          i === a.length - 1 ? { value: s.value, status: 'top', key: s.key } : s,
        )
      : [];

  result.push({
    stack: finalStack,
    line: 5,
    description:
      finalStack.length > 0
        ? `✓ 出栈成功！元素 ${popVal} 已出栈，当前 top = ${arr.length - 2}`
        : `✓ 出栈成功！元素 ${popVal} 已出栈，栈已空`,
    op: 'pop',
  });

  return result;
}

const INITIAL_STACK: StackItem[] = withKeys([
  { value: 15, status: 'normal' },
  { value: 28, status: 'normal' },
  { value: 42, status: 'normal' },
]);

// ----- Geometry constants -----
const SLOT_H = 44;
const SLOT_GAP = 6;
const SLOT_PITCH = SLOT_H + SLOT_GAP;
const SLOT_W = 128;

export default function StackVisualization() {
  const [committed, setCommitted] = useState<StackItem[]>(INITIAL_STACK);
  const [input, setInput] = useState('');
  const [operation, setOperation] = useState<'push' | 'pop'>('push');
  const [pendingSteps, setPendingSteps] = useState<Step[]>([]);
  const lowMotion = useLowMotionMode();

  const steps = pendingSteps;
  const CODE = operation === 'push' ? PUSH_CODE : POP_CODE;

  const player = useAlgorithmPlayer<Step>({
    steps,
    stepDurationMs: 900,
    autoPlay: false,
    onComplete: () => {
      if (steps.length === 0) return;
      const last = steps[steps.length - 1];
      setCommitted(last.stack.map<StackItem>((s) => ({ value: s.value, status: 'normal', key: s.key })));
    },
  });

  const current = player.currentStep;
  const displayStack = current?.stack ?? committed;
  const activeLine = current?.line ?? -1;

  const startPush = () => {
    const v = parseInt(input);
    if (isNaN(v)) return;
    if (committed.length >= MAX_CAPACITY) return;
    setOperation('push');
    setPendingSteps(buildPushSteps(committed, v));
    setInput('');
  };

  const startPop = () => {
    if (committed.length === 0) return;
    setOperation('pop');
    setPendingSteps(buildPopSteps(committed));
  };

  const resetAll = () => {
    setCommitted(INITIAL_STACK);
    setPendingSteps([]);
    setInput('');
  };

  const narrationDescription = current?.description ?? '点击"入栈"或"出栈"按钮开始演示';

  // Frame geometry: TOP is at idx MAX_CAPACITY-1 (top of box); BOTTOM at idx 0.
  // Items stack upward from the base.
  const frameHeight = MAX_CAPACITY * SLOT_PITCH + 12;

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入值"
            onKeyDown={(e) => e.key === 'Enter' && startPush()}
            className="w-24 px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            disabled={steps.length > 0}
          />
          <button
            onClick={startPush}
            disabled={committed.length >= MAX_CAPACITY || steps.length > 0}
            className="px-4 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 disabled:opacity-50"
          >
            入栈 Push
          </button>
          <button
            onClick={startPop}
            disabled={committed.length === 0 || steps.length > 0}
            className="px-4 py-1.5 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 disabled:opacity-50"
          >
            出栈 Pop
          </button>
          <button
            onClick={resetAll}
            className="px-4 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600"
          >
            重置
          </button>
          <span className="ml-auto text-sm text-slate-500 dark:text-slate-400">
            容量:{' '}
            <span className="font-mono tabular-nums text-slate-700 dark:text-slate-200">
              {displayStack.length}/{MAX_CAPACITY}
            </span>
          </span>
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

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-slate-900 rounded-xl p-6 min-h-[480px] border border-slate-800 flex items-start justify-center">
          <div
            className="relative"
            style={{ width: SLOT_W + 128, height: frameHeight + 64 }}
          >
            {/* Top label */}
            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ top: 0 }}>
              <span className="rounded-md bg-klein-500 text-white px-2 py-0.5 text-[10px] font-mono font-bold shadow">
                TOP ▼
              </span>
            </div>

            {/* Stack frame: open top, thick bottom, side walls */}
            <div
              className="absolute border-l-2 border-r-2 border-b-[6px] border-slate-500 rounded-b-xl bg-slate-900/30"
              style={{
                width: SLOT_W + 16,
                height: frameHeight,
                left: '50%',
                transform: 'translateX(-50%)',
                top: 24,
              }}
            >
              {/* Empty-state placeholder */}
              {displayStack.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs italic">
                  Stack is empty
                </div>
              )}

              {/* Empty slot placeholders (to make the container feel "sized") */}
              {Array.from({ length: MAX_CAPACITY }).map((_, i) => (
                <div
                  key={`slot-${i}`}
                  className="absolute left-1/2 -translate-x-1/2 w-[92%] border border-dashed border-slate-700/50 rounded-md"
                  style={{
                    height: SLOT_H,
                    bottom: 8 + i * SLOT_PITCH,
                  }}
                />
              ))}

              {/* Items */}
              <AnimatePresence initial={false}>
                {displayStack.map((item, i) => {
                  const isTop = i === displayStack.length - 1;
                  return (
                    <motion.div
                      key={item.key ?? i}
                      layout={!lowMotion}
                      initial={{ y: -40, opacity: 0, scale: 0.92 }}
                      animate={{
                        y: 0,
                        opacity: item.status === 'popping' ? 0.7 : 1,
                        scale: item.status === 'pushing' ? [1, 1.06, 1] : 1,
                      }}
                      exit={{ y: -32, opacity: 0, scale: 0.92 }}
                      transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 24,
                        mass: 0.8,
                      }}
                      className={
                        'absolute left-1/2 -translate-x-1/2 w-[92%] rounded-md flex items-center justify-between px-3 border-2 font-mono font-bold text-sm ' +
                        (item.status === 'pushing'
                          ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/30'
                          : item.status === 'popping'
                          ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/30'
                          : isTop
                          ? 'bg-pine-500 text-slate-900 border-pine-400 shadow-md shadow-pine-500/40'
                          : 'bg-klein-500 text-white border-klein-600')
                      }
                      style={{
                        height: SLOT_H,
                        bottom: 8 + i * SLOT_PITCH,
                      }}
                    >
                      <span className="text-[10px] font-mono opacity-70">[{i}]</span>
                      <span className="tabular-nums">{item.value}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* top= indicator pointer (right of box) */}
            {displayStack.length > 0 && (
              <motion.div
                layout={!lowMotion}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                className="absolute flex items-center gap-1.5"
                style={{
                  left: '50%',
                  transform: `translateX(${SLOT_W / 2 + 20}px)`,
                  bottom: 8 + (displayStack.length - 1) * SLOT_PITCH + SLOT_H / 2 - 10,
                }}
              >
                <div className="w-5 h-0.5 bg-pine-400" />
                <span className="text-[11px] font-mono font-bold text-pine-400 whitespace-nowrap">
                  top={displayStack.length - 1}
                </span>
              </motion.div>
            )}

            {/* BOTTOM base label */}
            <div
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
              style={{ top: 24 + frameHeight + 6 }}
            >
              <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-transparent border-t-slate-500" />
              <span className="text-[10px] font-mono text-slate-400 tracking-widest">
                BOTTOM / base
              </span>
            </div>
          </div>

          <div className="absolute flex flex-wrap justify-center gap-4 mt-4 pt-4 text-[11px] text-slate-400" style={{ display: 'none' }}>
            {/* legend below */}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-300 font-medium text-sm">
                {operation === 'push' ? '入栈 Push' : '出栈 Pop'} 代码
              </span>
              <span className="text-xs text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded font-mono">
                C
              </span>
            </div>
            <div className="font-mono text-xs space-y-0.5">
              {CODE.map((item, i) => (
                <div
                  key={i}
                  className={
                    'py-1 px-2 rounded transition-all duration-200 ' +
                    (activeLine === i
                      ? 'bg-pine-500/25 text-pine-100 border-l-2 border-pine-400'
                      : 'text-slate-400 border-l-2 border-transparent')
                  }
                  style={{ paddingLeft: item.indent * 16 + 8 + 'px' }}
                >
                  <span className="text-slate-600 select-none w-5 inline-block text-right mr-2">
                    {i + 1}
                  </span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-2">图例</div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <LegendRow color="bg-klein-500" label="普通元素" />
              <LegendRow color="bg-pine-500" label="栈顶 TOP" />
              <LegendRow color="bg-emerald-500" label="入栈 (Push)" />
              <LegendRow color="bg-rose-500" label="出栈 (Pop)" />
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-500 leading-relaxed">
              栈是 LIFO（后进先出）结构：只能从顶部操作。top 指针始终指向最上方的元素的索引。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendRow({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={'w-3 h-3 rounded ' + color} />
      <span>{label}</span>
    </div>
  );
}
