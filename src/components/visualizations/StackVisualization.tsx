import { useState, useEffect } from 'react';

interface StackItem {
  value: number;
  status: 'normal' | 'pushing' | 'popping' | 'top';
}

interface Step {
  stack: StackItem[];
  line: number;
  desc: string;
  op: 'push' | 'pop' | 'none';
}

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

export default function StackVisualization() {
  const [stack, setStack] = useState<StackItem[]>([
    { value: 15, status: 'normal' },
    { value: 28, status: 'normal' },
    { value: 42, status: 'normal' },
  ]);
  const [input, setInput] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [operation, setOperation] = useState<'push' | 'pop'>('push');
  const max = 8;

  const step = steps[stepIdx];
  const displayStack = step?.stack || stack;
  const CODE = operation === 'push' ? PUSH_CODE : POP_CODE;

  const doPush = () => {
    const v = parseInt(input);
    if (isNaN(v)) return;
    if (stack.length >= max) return;
    
    setOperation('push');
    const result: Step[] = [];
    const arr = stack.map(s => ({ ...s, status: 'normal' as const }));

    // 检查栈满
    result.push({
      stack: arr,
      line: 1,
      desc: `检查栈满: top(${arr.length - 1}) == MAXSIZE-1(${max - 1}) ? → ${arr.length >= max ? '是' : '否'}`,
      op: 'push'
    });

    // top++
    result.push({
      stack: arr,
      line: 3,
      desc: `执行 s->top++，top: ${arr.length - 1} → ${arr.length}`,
      op: 'push'
    });

    // 存入数据
    const newItem: StackItem = { value: v, status: 'pushing' };
    result.push({
      stack: [...arr, newItem],
      line: 4,
      desc: `执行 s->data[${arr.length}] = ${v}，将 ${v} 存入栈顶`,
      op: 'push'
    });

    // 完成
    result.push({
      stack: [...arr, { ...newItem, status: 'top' }],
      line: 5,
      desc: `✓ 入栈成功！元素 ${v} 已入栈，当前 top = ${arr.length}`,
      op: 'push'
    });

    setSteps(result);
    setStepIdx(0);
    setPlaying(true);
    setInput('');
  };

  const doPop = () => {
    if (stack.length === 0) return;
    
    setOperation('pop');
    const result: Step[] = [];
    const arr = stack.map(s => ({ ...s, status: 'normal' as const }));
    const popVal = arr[arr.length - 1].value;

    // 检查栈空
    result.push({
      stack: arr,
      line: 1,
      desc: `检查栈空: top(${arr.length - 1}) == -1 ? → 否`,
      op: 'pop'
    });

    // 取出数据
    result.push({
      stack: arr.map((s, i) => i === arr.length - 1 ? { ...s, status: 'popping' as const } : s),
      line: 3,
      desc: `执行 *x = s->data[${arr.length - 1}]，取出栈顶元素 ${popVal}`,
      op: 'pop'
    });

    // top--
    result.push({
      stack: arr.slice(0, -1),
      line: 4,
      desc: `执行 s->top--，top: ${arr.length - 1} → ${arr.length - 2}`,
      op: 'pop'
    });

    // 完成
    const remainingStack = arr.slice(0, -1);
    result.push({
      stack: remainingStack.length > 0 
        ? remainingStack.map((s, i, a) => i === a.length - 1 ? { ...s, status: 'top' as const } : s)
        : [],
      line: 5,
      desc: remainingStack.length > 0 
        ? `✓ 出栈成功！元素 ${popVal} 已出栈，当前 top = ${arr.length - 2}`
        : `✓ 出栈成功！元素 ${popVal} 已出栈，栈已空`,
      op: 'pop'
    });

    setSteps(result);
    setStepIdx(0);
    setPlaying(true);
  };

  const reset = () => {
    setStack([
      { value: 15, status: 'normal' },
      { value: 28, status: 'normal' },
      { value: 42, status: 'normal' },
    ]);
    setSteps([]);
    setStepIdx(-1);
    setPlaying(false);
  };

  useEffect(() => {
    if (!playing || stepIdx < 0) return;
    if (stepIdx >= steps.length - 1) {
      setPlaying(false);
      setStack(steps[steps.length - 1].stack.map(s => ({ ...s, status: 'normal' })));
      return;
    }
    const t = setTimeout(() => setStepIdx(i => i + 1), 1200);  // 较慢速度便于学习
    return () => clearTimeout(t);
  }, [playing, stepIdx, steps]);

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <input type="number" value={input} onChange={e => setInput(e.target.value)} placeholder="输入值"
            onKeyDown={e => e.key === 'Enter' && doPush()}
            className="w-24 px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white" disabled={playing || steps.length > 0} />
          <button onClick={doPush} disabled={playing || stack.length >= max || steps.length > 0}
            className="px-4 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 disabled:opacity-50">入栈 Push</button>
          <button onClick={doPop} disabled={playing || stack.length === 0 || steps.length > 0}
            className="px-4 py-1.5 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 disabled:opacity-50">出栈 Pop</button>
          
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
                  className="px-3 py-1.5 bg-indigo-500 text-white rounded-lg text-sm font-medium disabled:opacity-50">
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
          
          <button onClick={reset} className="px-4 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600">重置</button>
          <span className="ml-auto text-sm text-slate-500 dark:text-slate-400">容量: {displayStack.length}/{max}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-xl p-6 min-h-[400px]">
          {step && <div className="mb-4 px-4 py-2 bg-slate-700/50 rounded-lg text-white text-sm">{step.desc}</div>}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-36 min-h-[300px] border-l-4 border-r-4 border-b-4 border-slate-500 rounded-b-xl p-2 flex flex-col-reverse gap-1">
                {displayStack.map((item, i) => (
                  <div key={i} className={'h-11 rounded-lg flex items-center justify-center text-white font-bold transition-all duration-300 ' +
                    (item.status === 'pushing' ? 'bg-emerald-500 scale-105 animate-pulse' :
                     item.status === 'popping' ? 'bg-rose-500 opacity-60 translate-y-[-20px]' :
                     item.status === 'top' ? 'bg-amber-500' : 'bg-indigo-500')}>
                    <span className="text-xs text-white/60 mr-2">[{i}]</span>
                    {item.value}
                  </div>
                ))}
                {Array.from({ length: max - displayStack.length }).map((_, i) => (
                  <div key={'e' + i} className="h-11 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center">
                    <span className="text-slate-600 text-xs">[{displayStack.length + i}]</span>
                  </div>
                ))}
              </div>
              {displayStack.length > 0 && (
                <div className="absolute -right-20 flex items-center transition-all duration-300" 
                  style={{ bottom: (displayStack.length - 1) * 48 + 12 }}>
                  <div className="w-6 h-0.5 bg-amber-400"></div>
                  <span className="text-amber-400 text-xs font-mono ml-1">top={displayStack.length - 1}</span>
                </div>
              )}
              <div className="absolute -left-12 bottom-2 text-slate-500 text-xs">base</div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-slate-700">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-indigo-500"></div><span className="text-slate-400 text-xs">普通</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-amber-500"></div><span className="text-slate-400 text-xs">栈顶</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-emerald-500"></div><span className="text-slate-400 text-xs">入栈</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-rose-500"></div><span className="text-slate-400 text-xs">出栈</span></div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-300 font-medium text-sm">{operation === 'push' ? '入栈' : '出栈'}代码</span>
            <span className="text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded">C</span>
          </div>
          <div className="font-mono text-xs space-y-0.5">
            {CODE.map((item, i) => (
              <div key={i}
                className={'py-1 px-2 rounded transition-all duration-200 ' + (step?.line === i ? 'bg-amber-500/30 text-amber-200 font-medium' : 'text-slate-400')}
                style={{ paddingLeft: (item.indent * 16 + 8) + 'px' }}>
                <span className="text-slate-600 select-none w-5 inline-block text-right mr-2">{i + 1}</span>
                {item.text}
              </div>
            ))}
          </div>
          {steps.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="flex justify-between text-xs text-slate-500 mb-2"><span>步骤</span><span>{stepIdx + 1}/{steps.length}</span></div>
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
