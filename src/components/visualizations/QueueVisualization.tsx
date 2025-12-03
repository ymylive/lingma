import { useState, useEffect } from 'react';

interface QueueItem {
  value: number;
  status: 'normal' | 'enqueue' | 'dequeue' | 'front' | 'rear';
}

interface Step {
  queue: QueueItem[];
  front: number;
  rear: number;
  line: number;
  desc: string;
  op: 'enqueue' | 'dequeue' | 'none';
}

type Lang = 'cpp' | 'java' | 'python';

const CODE = {
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
  idea: '队列是一种先进先出(FIFO)的线性结构，只能在队尾插入、队头删除',
  steps: [
    '入队：在队尾rear位置存入元素，rear后移',
    '出队：取出队头front位置元素，front后移',
    '循环队列：用取模运算实现首尾相连',
    '判满/判空：(rear+1)%size==front 为满，front==rear 为空',
  ],
};

export default function QueueVisualization() {
  const [queue, setQueue] = useState<QueueItem[]>([
    { value: 15, status: 'front' },
    { value: 28, status: 'normal' },
    { value: 42, status: 'rear' },
  ]);
  const [front, setFront] = useState(0);
  const [rear, setRear] = useState(3);
  const [input, setInput] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [operation, setOperation] = useState<'enqueue' | 'dequeue'>('enqueue');
  const [lang, setLang] = useState<Lang>('cpp');
  const max = 8;

  const step = steps[stepIdx];
  const displayQueue = step?.queue || queue;
  const displayFront = step?.front ?? front;
  const displayRear = step?.rear ?? rear;
  const currentCode = CODE[operation][lang];

  const doEnqueue = () => {
    const v = parseInt(input);
    if (isNaN(v)) return;
    if (queue.length >= max - 1) return; // 循环队列留一个空位
    
    setOperation('enqueue');
    const result: Step[] = [];
    const arr: QueueItem[] = queue.map(s => ({ value: s.value, status: 'normal' }));

    // 标记队头队尾
    if (arr.length > 0) arr[0] = { value: arr[0].value, status: 'front' };
    if (arr.length > 0) arr[arr.length - 1] = { value: arr[arr.length - 1].value, status: 'rear' };

    result.push({
      queue: arr,
      front, rear,
      line: 0,
      desc: `📋 入队操作：将元素 ${v} 加入队尾`,
      op: 'enqueue'
    });

    // 检查队满
    result.push({
      queue: arr,
      front, rear,
      line: 1,
      desc: `🔍 检查队满: (rear+1)%MAXSIZE = (${rear}+1)%${max} = ${(rear+1)%max}, front = ${front} → ${(rear+1)%max === front ? '队满!' : '未满'}`,
      op: 'enqueue'
    });

    // 存入数据
    const newItem: QueueItem = { value: v, status: 'enqueue' };
    const newArr: QueueItem[] = arr.map(s => ({ value: s.value, status: 'normal' }));
    
    result.push({
      queue: [...newArr, newItem],
      front, rear,
      line: 3,
      desc: `📥 存入数据: Q.data[${rear}] = ${v}`,
      op: 'enqueue'
    });

    // rear后移
    const newRear = (rear + 1) % max;
    result.push({
      queue: [...newArr, { value: v, status: 'rear' }],
      front, rear: newRear,
      line: 4,
      desc: `👉 rear后移: rear = (${rear}+1)%${max} = ${newRear}`,
      op: 'enqueue'
    });

    // 完成
    const finalArr: QueueItem[] = [...newArr, { value: v, status: 'rear' }];
    if (finalArr.length > 0) finalArr[0] = { value: finalArr[0].value, status: 'front' };
    result.push({
      queue: finalArr,
      front, rear: newRear,
      line: 5,
      desc: `🎉 入队成功！元素 ${v} 已加入队尾，队列长度: ${arr.length} → ${finalArr.length}`,
      op: 'enqueue'
    });

    setSteps(result);
    setStepIdx(0);
    setPlaying(true);
    setInput('');
  };

  const doDequeue = () => {
    if (queue.length === 0) return;
    
    setOperation('dequeue');
    const result: Step[] = [];
    const arr: QueueItem[] = queue.map(s => ({ value: s.value, status: 'normal' }));
    if (arr.length > 0) arr[0] = { value: arr[0].value, status: 'front' };
    if (arr.length > 0) arr[arr.length - 1] = { value: arr[arr.length - 1].value, status: 'rear' };

    const dequeueVal = arr[0].value;

    result.push({
      queue: arr,
      front, rear,
      line: 0,
      desc: `📋 出队操作：从队头取出元素`,
      op: 'dequeue'
    });

    // 检查队空
    result.push({
      queue: arr,
      front, rear,
      line: 1,
      desc: `🔍 检查队空: front(${front}) == rear(${rear}) ? → ${front === rear ? '队空!' : '不为空'}`,
      op: 'dequeue'
    });

    // 取出数据
    const arrWithDequeue: QueueItem[] = arr.map((s, i) => i === 0 ? { value: s.value, status: 'dequeue' } : s);
    result.push({
      queue: arrWithDequeue,
      front, rear,
      line: 3,
      desc: `📤 取出数据: x = Q.data[${front}] = ${dequeueVal}`,
      op: 'dequeue'
    });

    // front后移
    const newFront = (front + 1) % max;
    const newArr: QueueItem[] = arr.slice(1).map(s => ({ value: s.value, status: 'normal' }));
    if (newArr.length > 0) newArr[0] = { value: newArr[0].value, status: 'front' };
    if (newArr.length > 0) newArr[newArr.length - 1] = { value: newArr[newArr.length - 1].value, status: 'rear' };
    
    result.push({
      queue: newArr,
      front: newFront, rear,
      line: 4,
      desc: `👉 front后移: front = (${front}+1)%${max} = ${newFront}`,
      op: 'dequeue'
    });

    // 完成
    result.push({
      queue: newArr,
      front: newFront, rear,
      line: 5,
      desc: `🎉 出队成功！元素 ${dequeueVal} 已出队，队列长度: ${arr.length} → ${newArr.length}`,
      op: 'dequeue'
    });

    setSteps(result);
    setStepIdx(0);
    setPlaying(true);
  };

  useEffect(() => {
    if (!playing || stepIdx < 0) return;
    if (stepIdx >= steps.length - 1) {
      const lastStep = steps[steps.length - 1];
      setQueue(lastStep.queue);
      setFront(lastStep.front);
      setRear(lastStep.rear);
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setStepIdx(i => i + 1), 1200);  // 较慢速度便于学习
    return () => clearTimeout(timer);
  }, [playing, stepIdx, steps]);

  const getItemStyle = (status: string) => {
    switch (status) {
      case 'front': return 'bg-emerald-500 text-white border-emerald-600';
      case 'rear': return 'bg-amber-500 text-white border-amber-600';
      case 'enqueue': return 'bg-indigo-500 text-white border-indigo-600 animate-pulse';
      case 'dequeue': return 'bg-rose-500 text-white border-rose-600 animate-pulse';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* 算法说明 */}
      <div className="bg-gradient-to-r from-cyan-50 to-emerald-50 dark:from-cyan-900/30 dark:to-emerald-900/30 p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">{ALGO_DESC.idea}</h3>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-2 grid md:grid-cols-2 gap-1">
              {ALGO_DESC.steps.map((s, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="w-5 h-5 bg-cyan-100 text-cyan-700 rounded text-xs flex items-center justify-center">{i+1}</span>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2">
        {/* 左侧：队列可视化 */}
        <div className="p-6 border-r border-slate-200 dark:border-slate-700">
          {/* 控制面板 */}
          <div className="flex flex-wrap gap-2 mb-4">
            <input
              type="number"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="输入数值"
              className="w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              disabled={steps.length > 0}
            />
            <button
              onClick={doEnqueue}
              disabled={playing || !input || queue.length >= max - 1 || steps.length > 0}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
            >
              入队 EnQueue
            </button>
            <button
              onClick={doDequeue}
              disabled={playing || queue.length === 0 || steps.length > 0}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 disabled:opacity-50"
            >
              出队 DeQueue
            </button>
            <button
              onClick={() => { setSteps([]); setStepIdx(-1); setPlaying(false); }}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-500"
            >
              重置
            </button>
          </div>
          
          {/* 步进控制 */}
          {steps.length > 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <button onClick={() => setStepIdx(i => Math.max(0, i - 1))} disabled={stepIdx <= 0}
                className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200">
                ◀ 上一步
              </button>
              <div className="flex-1 text-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">步骤 {stepIdx + 1} / {steps.length}</span>
              </div>
              <button onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))} disabled={stepIdx >= steps.length - 1}
                className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200">
                下一步 ▶
              </button>
              {!playing ? (
                <button onClick={() => setPlaying(true)} disabled={stepIdx >= steps.length - 1}
                  className="px-3 py-1.5 bg-indigo-500 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                  ▶ 自动播放
                </button>
              ) : (
                <button onClick={() => setPlaying(false)}
                  className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium">
                  ⏸ 暂停
                </button>
              )}
            </div>
          )}

          {/* 队列可视化 */}
          <div className="bg-slate-50 rounded-xl p-6 min-h-[200px]">
            <div className="flex items-center justify-center gap-1 mb-4">
              <div className="text-xs text-slate-500 mr-2">front={displayFront}</div>
              
              {/* 队头标记 */}
              <div className="flex flex-col items-center">
                <div className="text-xs text-emerald-600 mb-1">队头</div>
                <div className="text-emerald-600">▼</div>
              </div>
              
              {/* 队列元素 */}
              <div className="flex gap-1">
                {displayQueue.length === 0 ? (
                  <div className="w-16 h-16 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400">
                    空
                  </div>
                ) : (
                  displayQueue.map((item, i) => (
                    <div
                      key={i}
                      className={`w-14 h-14 border-2 rounded-lg flex flex-col items-center justify-center transition-all ${getItemStyle(item.status)}`}
                    >
                      <span className="font-bold">{item.value}</span>
                      <span className="text-[10px] opacity-75">[{displayFront + i}]</span>
                    </div>
                  ))
                )}
              </div>
              
              {/* 队尾标记 */}
              <div className="flex flex-col items-center">
                <div className="text-xs text-amber-600 mb-1">队尾</div>
                <div className="text-amber-600">▼</div>
              </div>
              
              <div className="text-xs text-slate-500 ml-2">rear={displayRear}</div>
            </div>

            {/* 图例 */}
            <div className="flex justify-center gap-4 text-xs mt-4">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                <span>队头front</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-amber-500 rounded"></div>
                <span>队尾rear</span>
              </div>
            </div>
          </div>

          {/* 状态描述 */}
          <div className="mt-4 p-3 bg-slate-100 rounded-lg min-h-[50px]">
            <p className="text-sm text-slate-700">
              {step?.desc || '👆 点击"入队"或"出队"按钮开始演示'}
            </p>
          </div>

          {/* 队列信息 */}
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 rounded-lg p-2">
              <div className="text-lg font-bold text-slate-800">{displayQueue.length}</div>
              <div className="text-xs text-slate-500">队列长度</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-2">
              <div className="text-lg font-bold text-emerald-600">{displayFront}</div>
              <div className="text-xs text-slate-500">front指针</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-2">
              <div className="text-lg font-bold text-amber-600">{displayRear}</div>
              <div className="text-xs text-slate-500">rear指针</div>
            </div>
          </div>
        </div>

        {/* 右侧：代码 */}
        <div className="p-6 bg-slate-900">
          {/* 语言选择 */}
          <div className="flex gap-2 mb-4">
            {(['cpp', 'java', 'python'] as Lang[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  lang === l ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {l === 'cpp' ? 'C++' : l === 'java' ? 'Java' : 'Python'}
              </button>
            ))}
          </div>

          {/* 操作选择 */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setOperation('enqueue')}
              className={`px-3 py-1 rounded text-sm ${
                operation === 'enqueue' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
              }`}
            >
              入队代码
            </button>
            <button
              onClick={() => setOperation('dequeue')}
              className={`px-3 py-1 rounded text-sm ${
                operation === 'dequeue' ? 'bg-rose-600 text-white' : 'bg-slate-700 text-slate-300'
              }`}
            >
              出队代码
            </button>
          </div>

          {/* 代码显示 */}
          <div className="font-mono text-sm space-y-1">
            {currentCode.map((item: { text: string; indent: number }, i: number) => (
              <div
                key={i}
                className={`py-1 px-2 rounded transition-all ${
                  step?.line === i ? 'bg-amber-500/30 text-amber-200' : 'text-slate-400'
                }`}
                style={{ paddingLeft: (item.indent * 16 + 8) + 'px' }}
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
