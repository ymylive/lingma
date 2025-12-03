import { useState, useEffect, useRef } from 'react';

interface Bar {
  value: number;
  status: 'normal' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'merge';
}

type Algorithm = 'bubble' | 'selection' | 'insertion' | 'quick' | 'merge' | 'heap' | 'shell';
type Lang = 'cpp' | 'java' | 'python';

const ALGORITHMS: Record<Algorithm, { name: string; time: string; space: string; stable: string }> = {
  bubble: { name: '冒泡排序', time: 'O(n²)', space: 'O(1)', stable: '稳定' },
  selection: { name: '选择排序', time: 'O(n²)', space: 'O(1)', stable: '不稳定' },
  insertion: { name: '插入排序', time: 'O(n²)', space: 'O(1)', stable: '稳定' },
  shell: { name: '希尔排序', time: 'O(n^1.3)', space: 'O(1)', stable: '不稳定' },
  merge: { name: '归并排序', time: 'O(n log n)', space: 'O(n)', stable: '稳定' },
  quick: { name: '快速排序', time: 'O(n log n)', space: 'O(log n)', stable: '不稳定' },
  heap: { name: '堆排序', time: 'O(n log n)', space: 'O(1)', stable: '不稳定' },
};

const CODE: Record<Algorithm, Record<Lang, { text: string; indent: number }[]>> = {
  bubble: {
    cpp: [
      { text: 'void bubbleSort(int a[], int n) {', indent: 0 },
      { text: 'for (int i = 0; i < n-1; i++)', indent: 1 },
      { text: 'for (int j = 0; j < n-1-i; j++)', indent: 2 },
      { text: 'if (a[j] > a[j+1])', indent: 3 },
      { text: 'swap(a[j], a[j+1]);', indent: 4 },
      { text: '}', indent: 0 },
    ],
    java: [
      { text: 'void bubbleSort(int[] a) {', indent: 0 },
      { text: 'for (int i = 0; i < a.length-1; i++)', indent: 1 },
      { text: 'for (int j = 0; j < a.length-1-i; j++)', indent: 2 },
      { text: 'if (a[j] > a[j+1]) {', indent: 3 },
      { text: 'int t = a[j]; a[j] = a[j+1]; a[j+1] = t;', indent: 4 },
      { text: '}}', indent: 0 },
    ],
    python: [
      { text: 'def bubble_sort(a):', indent: 0 },
      { text: 'for i in range(len(a)-1):', indent: 1 },
      { text: 'for j in range(len(a)-1-i):', indent: 2 },
      { text: 'if a[j] > a[j+1]:', indent: 3 },
      { text: 'a[j], a[j+1] = a[j+1], a[j]', indent: 4 },
    ],
  },
  selection: {
    cpp: [
      { text: 'void selectionSort(int a[], int n) {', indent: 0 },
      { text: 'for (int i = 0; i < n-1; i++) {', indent: 1 },
      { text: 'int min = i;', indent: 2 },
      { text: 'for (int j = i+1; j < n; j++)', indent: 2 },
      { text: 'if (a[j] < a[min]) min = j;', indent: 3 },
      { text: 'swap(a[i], a[min]);', indent: 2 },
      { text: '}}', indent: 0 },
    ],
    java: [
      { text: 'void selectionSort(int[] a) {', indent: 0 },
      { text: 'for (int i = 0; i < a.length-1; i++) {', indent: 1 },
      { text: 'int min = i;', indent: 2 },
      { text: 'for (int j = i+1; j < a.length; j++)', indent: 2 },
      { text: 'if (a[j] < a[min]) min = j;', indent: 3 },
      { text: 'int t = a[i]; a[i] = a[min]; a[min] = t;', indent: 2 },
      { text: '}}', indent: 0 },
    ],
    python: [
      { text: 'def selection_sort(a):', indent: 0 },
      { text: 'for i in range(len(a)-1):', indent: 1 },
      { text: 'min_idx = i', indent: 2 },
      { text: 'for j in range(i+1, len(a)):', indent: 2 },
      { text: 'if a[j] < a[min_idx]: min_idx = j', indent: 3 },
      { text: 'a[i], a[min_idx] = a[min_idx], a[i]', indent: 2 },
    ],
  },
  insertion: {
    cpp: [
      { text: 'void insertionSort(int a[], int n) {', indent: 0 },
      { text: 'for (int i = 1; i < n; i++) {', indent: 1 },
      { text: 'int key = a[i], j = i-1;', indent: 2 },
      { text: 'while (j >= 0 && a[j] > key) {', indent: 2 },
      { text: 'a[j+1] = a[j]; j--;', indent: 3 },
      { text: '}', indent: 2 },
      { text: 'a[j+1] = key;', indent: 2 },
      { text: '}}', indent: 0 },
    ],
    java: [
      { text: 'void insertionSort(int[] a) {', indent: 0 },
      { text: 'for (int i = 1; i < a.length; i++) {', indent: 1 },
      { text: 'int key = a[i], j = i-1;', indent: 2 },
      { text: 'while (j >= 0 && a[j] > key) {', indent: 2 },
      { text: 'a[j+1] = a[j]; j--;', indent: 3 },
      { text: '}', indent: 2 },
      { text: 'a[j+1] = key;', indent: 2 },
      { text: '}}', indent: 0 },
    ],
    python: [
      { text: 'def insertion_sort(a):', indent: 0 },
      { text: 'for i in range(1, len(a)):', indent: 1 },
      { text: 'key, j = a[i], i-1', indent: 2 },
      { text: 'while j >= 0 and a[j] > key:', indent: 2 },
      { text: 'a[j+1] = a[j]; j -= 1', indent: 3 },
      { text: 'a[j+1] = key', indent: 2 },
    ],
  },
  shell: {
    cpp: [
      { text: 'void shellSort(int a[], int n) {', indent: 0 },
      { text: 'for (int gap = n/2; gap > 0; gap /= 2)', indent: 1 },
      { text: 'for (int i = gap; i < n; i++) {', indent: 2 },
      { text: 'int temp = a[i], j = i;', indent: 3 },
      { text: 'while (j >= gap && a[j-gap] > temp) {', indent: 3 },
      { text: 'a[j] = a[j-gap]; j -= gap;', indent: 4 },
      { text: '}', indent: 3 },
      { text: 'a[j] = temp;', indent: 3 },
      { text: '}}', indent: 0 },
    ],
    java: [
      { text: 'void shellSort(int[] a) {', indent: 0 },
      { text: 'for (int gap = a.length/2; gap > 0; gap /= 2)', indent: 1 },
      { text: 'for (int i = gap; i < a.length; i++) {', indent: 2 },
      { text: 'int temp = a[i], j = i;', indent: 3 },
      { text: 'while (j >= gap && a[j-gap] > temp) {', indent: 3 },
      { text: 'a[j] = a[j-gap]; j -= gap;', indent: 4 },
      { text: '}', indent: 3 },
      { text: 'a[j] = temp;', indent: 3 },
      { text: '}}', indent: 0 },
    ],
    python: [
      { text: 'def shell_sort(a):', indent: 0 },
      { text: 'gap = len(a) // 2', indent: 1 },
      { text: 'while gap > 0:', indent: 1 },
      { text: 'for i in range(gap, len(a)):', indent: 2 },
      { text: 'temp, j = a[i], i', indent: 3 },
      { text: 'while j >= gap and a[j-gap] > temp:', indent: 3 },
      { text: 'a[j] = a[j-gap]; j -= gap', indent: 4 },
      { text: 'a[j] = temp', indent: 3 },
      { text: 'gap //= 2', indent: 2 },
    ],
  },
  quick: {
    cpp: [
      { text: 'void quickSort(int a[], int l, int r) {', indent: 0 },
      { text: 'if (l >= r) return;', indent: 1 },
      { text: 'int pivot = a[r], i = l;', indent: 1 },
      { text: 'for (int j = l; j < r; j++)', indent: 1 },
      { text: 'if (a[j] < pivot) swap(a[i++], a[j]);', indent: 2 },
      { text: 'swap(a[i], a[r]);', indent: 1 },
      { text: 'quickSort(a, l, i-1);', indent: 1 },
      { text: 'quickSort(a, i+1, r);', indent: 1 },
      { text: '}', indent: 0 },
    ],
    java: [
      { text: 'void quickSort(int[] a, int l, int r) {', indent: 0 },
      { text: 'if (l >= r) return;', indent: 1 },
      { text: 'int pivot = a[r], i = l;', indent: 1 },
      { text: 'for (int j = l; j < r; j++)', indent: 1 },
      { text: 'if (a[j] < pivot) { int t=a[i];a[i]=a[j];a[j]=t;i++; }', indent: 2 },
      { text: 'int t=a[i];a[i]=a[r];a[r]=t;', indent: 1 },
      { text: 'quickSort(a, l, i-1);', indent: 1 },
      { text: 'quickSort(a, i+1, r);', indent: 1 },
      { text: '}', indent: 0 },
    ],
    python: [
      { text: 'def quick_sort(a, l, r):', indent: 0 },
      { text: 'if l >= r: return', indent: 1 },
      { text: 'pivot, i = a[r], l', indent: 1 },
      { text: 'for j in range(l, r):', indent: 1 },
      { text: 'if a[j] < pivot: a[i],a[j]=a[j],a[i]; i+=1', indent: 2 },
      { text: 'a[i], a[r] = a[r], a[i]', indent: 1 },
      { text: 'quick_sort(a, l, i-1)', indent: 1 },
      { text: 'quick_sort(a, i+1, r)', indent: 1 },
    ],
  },
  merge: {
    cpp: [
      { text: 'void merge(int a[], int l, int m, int r) {', indent: 0 },
      { text: 'vector<int> L(a+l, a+m+1), R(a+m+1, a+r+1);', indent: 1 },
      { text: 'int i=0, j=0, k=l;', indent: 1 },
      { text: 'while (i < L.size() && j < R.size())', indent: 1 },
      { text: 'a[k++] = L[i]<R[j] ? L[i++] : R[j++];', indent: 2 },
      { text: 'while (i < L.size()) a[k++] = L[i++];', indent: 1 },
      { text: 'while (j < R.size()) a[k++] = R[j++];', indent: 1 },
      { text: '}', indent: 0 },
      { text: 'void mergeSort(int a[], int l, int r) {', indent: 0 },
      { text: 'if (l < r) {', indent: 1 },
      { text: 'int m = (l+r)/2;', indent: 2 },
      { text: 'mergeSort(a, l, m);', indent: 2 },
      { text: 'mergeSort(a, m+1, r);', indent: 2 },
      { text: 'merge(a, l, m, r);', indent: 2 },
      { text: '}}', indent: 0 },
    ],
    java: [
      { text: 'void merge(int[] a, int l, int m, int r) {', indent: 0 },
      { text: 'int[] L = Arrays.copyOfRange(a, l, m+1);', indent: 1 },
      { text: 'int[] R = Arrays.copyOfRange(a, m+1, r+1);', indent: 1 },
      { text: 'int i=0, j=0, k=l;', indent: 1 },
      { text: 'while (i<L.length && j<R.length)', indent: 1 },
      { text: 'a[k++] = L[i]<R[j] ? L[i++] : R[j++];', indent: 2 },
      { text: 'while (i<L.length) a[k++] = L[i++];', indent: 1 },
      { text: 'while (j<R.length) a[k++] = R[j++];', indent: 1 },
      { text: '}', indent: 0 },
    ],
    python: [
      { text: 'def merge_sort(a):', indent: 0 },
      { text: 'if len(a) <= 1: return a', indent: 1 },
      { text: 'm = len(a) // 2', indent: 1 },
      { text: 'L = merge_sort(a[:m])', indent: 1 },
      { text: 'R = merge_sort(a[m:])', indent: 1 },
      { text: 'result = []', indent: 1 },
      { text: 'while L and R:', indent: 1 },
      { text: 'result.append(L.pop(0) if L[0]<R[0] else R.pop(0))', indent: 2 },
      { text: 'return result + L + R', indent: 1 },
    ],
  },
  heap: {
    cpp: [
      { text: 'void heapify(int a[], int n, int i) {', indent: 0 },
      { text: 'int max = i, l = 2*i+1, r = 2*i+2;', indent: 1 },
      { text: 'if (l < n && a[l] > a[max]) max = l;', indent: 1 },
      { text: 'if (r < n && a[r] > a[max]) max = r;', indent: 1 },
      { text: 'if (max != i) { swap(a[i],a[max]); heapify(a,n,max); }', indent: 1 },
      { text: '}', indent: 0 },
      { text: 'void heapSort(int a[], int n) {', indent: 0 },
      { text: 'for (int i = n/2-1; i >= 0; i--) heapify(a,n,i);', indent: 1 },
      { text: 'for (int i = n-1; i > 0; i--) {', indent: 1 },
      { text: 'swap(a[0], a[i]);', indent: 2 },
      { text: 'heapify(a, i, 0);', indent: 2 },
      { text: '}}', indent: 0 },
    ],
    java: [
      { text: 'void heapify(int[] a, int n, int i) {', indent: 0 },
      { text: 'int max=i, l=2*i+1, r=2*i+2;', indent: 1 },
      { text: 'if (l<n && a[l]>a[max]) max=l;', indent: 1 },
      { text: 'if (r<n && a[r]>a[max]) max=r;', indent: 1 },
      { text: 'if (max!=i) { int t=a[i];a[i]=a[max];a[max]=t; heapify(a,n,max); }', indent: 1 },
      { text: '}', indent: 0 },
      { text: 'void heapSort(int[] a) {', indent: 0 },
      { text: 'for (int i=a.length/2-1; i>=0; i--) heapify(a,a.length,i);', indent: 1 },
      { text: 'for (int i=a.length-1; i>0; i--) {', indent: 1 },
      { text: 'int t=a[0];a[0]=a[i];a[i]=t; heapify(a,i,0);', indent: 2 },
      { text: '}}', indent: 0 },
    ],
    python: [
      { text: 'def heapify(a, n, i):', indent: 0 },
      { text: 'largest, l, r = i, 2*i+1, 2*i+2', indent: 1 },
      { text: 'if l < n and a[l] > a[largest]: largest = l', indent: 1 },
      { text: 'if r < n and a[r] > a[largest]: largest = r', indent: 1 },
      { text: 'if largest != i:', indent: 1 },
      { text: 'a[i], a[largest] = a[largest], a[i]', indent: 2 },
      { text: 'heapify(a, n, largest)', indent: 2 },
      { text: 'def heap_sort(a):', indent: 0 },
      { text: 'for i in range(len(a)//2-1, -1, -1): heapify(a,len(a),i)', indent: 1 },
      { text: 'for i in range(len(a)-1, 0, -1):', indent: 1 },
      { text: 'a[0], a[i] = a[i], a[0]; heapify(a, i, 0)', indent: 2 },
    ],
  },
};

const LANG_NAMES: Record<Lang, string> = { cpp: 'C++', java: 'Java', python: 'Python' };

const ALGO_DESC: Record<Algorithm, { idea: string; steps: string[] }> = {
  bubble: {
    idea: '相邻元素两两比较，大的往后移，像气泡一样浮到末尾',
    steps: ['1. 从头开始，比较相邻元素', '2. 如果前>后，交换它们', '3. 每轮把最大的移到末尾', '4. 重复n-1轮']
  },
  selection: {
    idea: '每次从未排序部分找最小值，放到已排序部分的末尾',
    steps: ['1. 假设当前位置是最小值', '2. 在后面找更小的元素', '3. 找到后与当前位置交换', '4. 向后移动，重复']
  },
  insertion: {
    idea: '像打扑克牌一样，把新牌插入到已排好序的手牌中',
    steps: ['1. 取出当前元素作为key', '2. 在前面已排序部分找位置', '3. 大于key的元素后移', '4. 把key插入空位']
  },
  shell: {
    idea: '先让间隔较远的元素有序，逐步缩小间隔，最后全局有序',
    steps: ['1. 设置初始间隔gap=n/2', '2. 对间隔gap的元素插入排序', '3. 缩小gap为原来一半', '4. 直到gap=1完成排序']
  },
  quick: {
    idea: '选一个基准，小的放左边，大的放右边，递归排序',
    steps: ['1. 选择最后一个元素为pivot', '2. 遍历把小于pivot的移左边', '3. 把pivot放到正确位置', '4. 递归排序左右两部分']
  },
  merge: {
    idea: '先分割成小块，再两两合并成有序序列',
    steps: ['1. 递归分割数组为两半', '2. 分到单个元素时开始合并', '3. 合并时比较两边元素', '4. 较小的先放入结果']
  },
  heap: {
    idea: '利用堆的性质，每次取出最大值放到末尾',
    steps: ['1. 建立大顶堆(父>子)', '2. 堆顶(最大值)与末尾交换', '3. 堆大小减1，重新调整堆', '4. 重复直到堆为空']
  },
};

export default function SortVisualization() {
  const [arr, setArr] = useState<Bar[]>([]);
  const [sorting, setSorting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [algo, setAlgo] = useState<Algorithm>('bubble');
  const [lang, setLang] = useState<Lang>('cpp');
  const [speed, setSpeed] = useState(200);  // 默认较慢，便于学习
  const [stats, setStats] = useState({ comp: 0, swap: 0 });
  const [line, setLine] = useState(-1);
  const [desc, setDesc] = useState('选择算法，点击"开始"观看动画演示');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState('');
  const stopRef = useRef(false);
  const pauseRef = useRef(false);
  const stepOnceRef = useRef(false);

  const generate = () => {
    const newArr = Array.from({ length: 10 }, () => ({
      value: Math.floor(Math.random() * 80) + 20,
      status: 'normal' as const
    }));
    setArr(newArr);
    setStats({ comp: 0, swap: 0 });
    setLine(-1);
    setDesc('数组已生成，点击"开始"观看排序过程');
    setVariables({});
    setPhase('');
  };

  useEffect(() => { generate(); }, []);

  const waitWhilePaused = async () => {
    while (pauseRef.current && !stopRef.current) {
      if (stepOnceRef.current) {
        stepOnceRef.current = false;
        return;
      }
      await new Promise(r => setTimeout(r, 100));
    }
  };

  const stepForward = () => {
    if (paused && sorting) {
      stepOnceRef.current = true;
    }
  };

  const sleep = async (ms: number) => {
    await waitWhilePaused();
    if (!stopRef.current) await new Promise(r => setTimeout(r, ms));
  };

  const bubbleSort = async (a: Bar[]) => {
    const n = a.length;
    setPhase('冒泡排序：每轮把最大的"冒泡"到末尾');
    
    for (let i = 0; i < n - 1 && !stopRef.current; i++) {
      setVariables({ '外层循环i': String(i), '本轮范围': `a[0] ~ a[${n-1-i}]`, '已排好': `${i}个` });
      setDesc(`【第${i+1}轮】将未排序部分的最大值移到位置 ${n-1-i}`);
      await sleep(speed * 1.5);

      for (let j = 0; j < n - 1 - i && !stopRef.current; j++) {
        setVariables({ '外层i': String(i), '内层j': String(j), '比较': `a[${j}] vs a[${j+1}]` });
        
        a[j].status = 'comparing';
        a[j + 1].status = 'comparing';
        setArr([...a]);
        setLine(3);
        setDesc(`👀 比较 a[${j}]=${a[j].value} 和 a[${j+1}]=${a[j+1].value}`);
        setStats(s => ({ ...s, comp: s.comp + 1 }));
        await sleep(speed);

        if (a[j].value > a[j + 1].value) {
          a[j].status = 'swapping';
          a[j + 1].status = 'swapping';
          setArr([...a]);
          setLine(4);
          setDesc(`🔄 ${a[j].value} > ${a[j+1].value}，需要交换位置！`);
          await sleep(speed);
          
          const temp = a[j].value;
          a[j].value = a[j + 1].value;
          a[j + 1].value = temp;
          setStats(s => ({ ...s, swap: s.swap + 1 }));
          setArr([...a]);
          setDesc(`✓ 交换完成: ${a[j].value} ← → ${a[j+1].value}`);
          await sleep(speed * 0.5);
        } else {
          setDesc(`✓ ${a[j].value} ≤ ${a[j+1].value}，顺序正确，不交换`);
          await sleep(speed * 0.3);
        }
        
        a[j].status = 'normal';
        a[j + 1].status = 'normal';
        setArr([...a]);
      }
      
      a[n - 1 - i].status = 'sorted';
      setArr([...a]);
      setDesc(`🎉 第${i+1}轮完成！a[${n-1-i}]=${a[n-1-i].value} 是未排序部分最大值，已归位`);
      await sleep(speed);
    }
    
    a.forEach(x => { x.status = 'sorted'; });
    setArr([...a]);
  };

  const selectionSort = async (a: Bar[]) => {
    const n = a.length;
    setPhase('选择排序：每次找最小值放到前面');
    
    for (let i = 0; i < n - 1 && !stopRef.current; i++) {
      let minIdx = i;
      setVariables({ '轮次': `第${i+1}轮`, '当前位置i': String(i), '假设最小值位置': String(minIdx) });
      
      a[i].status = 'pivot';
      setArr([...a]);
      setLine(2);
      setDesc(`【第${i+1}轮】假设 a[${i}]=${a[i].value} 是未排序部分的最小值`);
      await sleep(speed * 1.5);

      for (let j = i + 1; j < n && !stopRef.current; j++) {
        a[j].status = 'comparing';
        setArr([...a]);
        setLine(4);
        setDesc(`比较: a[${j}]=${a[j].value} < a[${minIdx}]=${a[minIdx].value}?`);
        setStats(s => ({ ...s, comp: s.comp + 1 }));
        await sleep(speed);

        if (a[j].value < a[minIdx].value) {
          if (minIdx !== i) a[minIdx].status = 'normal';
          minIdx = j;
          a[j].status = 'pivot';
        } else {
          a[j].status = 'normal';
        }
        setArr([...a]);
      }

      if (minIdx !== i) {
        a[i].status = 'swapping';
        a[minIdx].status = 'swapping';
        setArr([...a]);
        setLine(5);
        setDesc(`交换: a[${i}] ↔ a[${minIdx}]`);
        setStats(s => ({ ...s, swap: s.swap + 1 }));
        await sleep(speed);
        [a[i], a[minIdx]] = [a[minIdx], a[i]];
      }
      a[i].status = 'sorted';
      if (minIdx !== i) a[minIdx].status = 'normal';
      setArr([...a]);
    }
    a[a.length - 1].status = 'sorted';
    setArr([...a]);
  };

  const insertionSort = async (a: Bar[]) => {
    a[0].status = 'sorted';
    setArr([...a]);
    for (let i = 1; i < a.length && !stopRef.current; i++) {
      const key = a[i].value;
      a[i].status = 'pivot';
      setArr([...a]);
      setLine(2);
      setDesc(`取出 key = ${key}`);
      await sleep(speed);

      let j = i - 1;
      while (j >= 0 && a[j].value > key && !stopRef.current) {
        a[j].status = 'comparing';
        setArr([...a]);
        setStats(s => ({ ...s, comp: s.comp + 1 }));
        await sleep(speed);
        a[j + 1].value = a[j].value;
        a[j + 1].status = 'swapping';
        a[j].status = 'sorted';
        setArr([...a]);
        setStats(s => ({ ...s, swap: s.swap + 1 }));
        await sleep(speed);
        j--;
      }
      a[j + 1].value = key;
      a[j + 1].status = 'sorted';
      setArr([...a]);
      setLine(6);
      setDesc(`插入 ${key} 到位置 ${j+1}`);
      await sleep(speed);
    }
  };

  const shellSort = async (a: Bar[]) => {
    const n = a.length;
    for (let gap = Math.floor(n / 2); gap > 0 && !stopRef.current; gap = Math.floor(gap / 2)) {
      setLine(1);
      setDesc(`gap = ${gap}`);
      await sleep(speed);
      
      for (let i = gap; i < n && !stopRef.current; i++) {
        const temp = a[i].value;
        a[i].status = 'pivot';
        setArr([...a]);
        setLine(3);
        setDesc(`取出 temp = a[${i}] = ${temp}`);
        await sleep(speed);

        let j = i;
        while (j >= gap && a[j - gap].value > temp && !stopRef.current) {
          a[j - gap].status = 'comparing';
          setArr([...a]);
          setStats(s => ({ ...s, comp: s.comp + 1 }));
          await sleep(speed);
          
          a[j].value = a[j - gap].value;
          a[j].status = 'swapping';
          a[j - gap].status = 'normal';
          setArr([...a]);
          setStats(s => ({ ...s, swap: s.swap + 1 }));
          await sleep(speed);
          j -= gap;
        }
        a[j].value = temp;
        a[j].status = 'normal';
        a[i].status = 'normal';
        setArr([...a]);
      }
    }
    a.forEach(x => x.status = 'sorted');
    setArr([...a]);
  };

  const quickSort = async (a: Bar[], l: number, r: number): Promise<void> => {
    if (l >= r || stopRef.current) return;
    
    const pivotVal = a[r].value;
    a[r].status = 'pivot';
    setArr([...a]);
    setLine(2);
    setDesc(`pivot = a[${r}] = ${pivotVal}`);
    await sleep(speed);

    let i = l;
    for (let j = l; j < r && !stopRef.current; j++) {
      a[j].status = 'comparing';
      setArr([...a]);
      setLine(4);
      setDesc(`比较: a[${j}]=${a[j].value} < pivot=${pivotVal}?`);
      setStats(s => ({ ...s, comp: s.comp + 1 }));
      await sleep(speed);

      if (a[j].value < pivotVal) {
        if (i !== j) {
          a[i].status = 'swapping';
          a[j].status = 'swapping';
          setArr([...a]);
          await sleep(speed);
          [a[i], a[j]] = [a[j], a[i]];
          setStats(s => ({ ...s, swap: s.swap + 1 }));
        }
        a[i].status = 'normal';
        i++;
      }
      a[j].status = 'normal';
      setArr([...a]);
    }

    a[i].status = 'swapping';
    a[r].status = 'swapping';
    setArr([...a]);
    setLine(5);
    setDesc(`交换 pivot 到位置 ${i}`);
    await sleep(speed);
    [a[i], a[r]] = [a[r], a[i]];
    setStats(s => ({ ...s, swap: s.swap + 1 }));
    a[i].status = 'sorted';
    a[r].status = 'normal';
    setArr([...a]);

    await quickSort(a, l, i - 1);
    await quickSort(a, i + 1, r);
  };

  const mergeSort = async (a: Bar[], l: number, r: number): Promise<void> => {
    if (l >= r || stopRef.current) return;
    
    const m = Math.floor((l + r) / 2);
    setLine(10);
    setDesc(`分治: [${l}..${m}] 和 [${m+1}..${r}]`);
    await sleep(speed);
    
    await mergeSort(a, l, m);
    await mergeSort(a, m + 1, r);
    
    // Merge
    const L = a.slice(l, m + 1).map(x => x.value);
    const R = a.slice(m + 1, r + 1).map(x => x.value);
    let i = 0, j = 0, k = l;
    
    setLine(3);
    setDesc(`合并: [${l}..${m}] + [${m+1}..${r}]`);
    
    while (i < L.length && j < R.length && !stopRef.current) {
      a[k].status = 'merge';
      setArr([...a]);
      setStats(s => ({ ...s, comp: s.comp + 1 }));
      await sleep(speed);
      
      if (L[i] <= R[j]) {
        a[k].value = L[i++];
      } else {
        a[k].value = R[j++];
        setStats(s => ({ ...s, swap: s.swap + 1 }));
      }
      a[k].status = 'normal';
      setArr([...a]);
      k++;
    }
    
    while (i < L.length) { a[k].value = L[i++]; a[k++].status = 'normal'; }
    while (j < R.length) { a[k].value = R[j++]; a[k++].status = 'normal'; }
    setArr([...a]);
  };

  const heapify = async (a: Bar[], n: number, i: number): Promise<void> => {
    if (stopRef.current) return;
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < n) {
      a[l].status = 'comparing';
      setArr([...a]);
      setStats(s => ({ ...s, comp: s.comp + 1 }));
      await sleep(speed / 2);
      if (a[l].value > a[largest].value) largest = l;
      a[l].status = 'normal';
    }
    if (r < n) {
      a[r].status = 'comparing';
      setArr([...a]);
      setStats(s => ({ ...s, comp: s.comp + 1 }));
      await sleep(speed / 2);
      if (a[r].value > a[largest].value) largest = r;
      a[r].status = 'normal';
    }

    if (largest !== i) {
      a[i].status = 'swapping';
      a[largest].status = 'swapping';
      setArr([...a]);
      setLine(4);
      setDesc(`交换 a[${i}] ↔ a[${largest}]`);
      await sleep(speed);
      [a[i], a[largest]] = [a[largest], a[i]];
      setStats(s => ({ ...s, swap: s.swap + 1 }));
      a[i].status = 'normal';
      a[largest].status = 'normal';
      setArr([...a]);
      await heapify(a, n, largest);
    }
  };

  const heapSort = async (a: Bar[]) => {
    const n = a.length;
    setLine(7);
    setDesc('建堆...');
    for (let i = Math.floor(n / 2) - 1; i >= 0 && !stopRef.current; i--) {
      await heapify(a, n, i);
    }
    
    for (let i = n - 1; i > 0 && !stopRef.current; i--) {
      a[0].status = 'swapping';
      a[i].status = 'swapping';
      setArr([...a]);
      setLine(9);
      setDesc(`交换堆顶 a[0]=${a[0].value} 与 a[${i}]=${a[i].value}`);
      await sleep(speed);
      [a[0], a[i]] = [a[i], a[0]];
      setStats(s => ({ ...s, swap: s.swap + 1 }));
      a[i].status = 'sorted';
      a[0].status = 'normal';
      setArr([...a]);
      await heapify(a, i, 0);
    }
    a[0].status = 'sorted';
    setArr([...a]);
  };

  const start = async () => {
    setSorting(true);
    stopRef.current = false;
    setStats({ comp: 0, swap: 0 });
    const a: Bar[] = arr.map(x => ({ ...x, status: 'normal' }));
    setArr(a);

    switch (algo) {
      case 'bubble': await bubbleSort(a); break;
      case 'selection': await selectionSort(a); break;
      case 'insertion': await insertionSort(a); break;
      case 'shell': await shellSort(a); break;
      case 'quick': await quickSort(a, 0, a.length - 1); a.forEach(x => { x.status = 'sorted'; }); setArr([...a]); break;
      case 'merge': await mergeSort(a, 0, a.length - 1); a.forEach(x => { x.status = 'sorted'; }); setArr([...a]); break;
      case 'heap': await heapSort(a); break;
    }

    setLine(-1);
    if (!stopRef.current) setDesc('✓ 排序完成！');
    setSorting(false);
  };

  const stop = () => { stopRef.current = true; pauseRef.current = false; setPaused(false); setDesc('已停止'); };

  const togglePause = () => {
    pauseRef.current = !pauseRef.current;
    setPaused(pauseRef.current);
  };

  const max = Math.max(...arr.map(x => x.value), 100);

  return (
    <div className="space-y-4">
      {/* 算法原理说明 */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-4">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💡</span>
              <span className="font-bold text-indigo-800">{ALGORITHMS[algo].name}原理</span>
            </div>
            <p className="text-sm text-slate-700 mb-2">{ALGO_DESC[algo].idea}</p>
            <div className="flex flex-wrap gap-2">
              {ALGO_DESC[algo].steps.map((s, i) => (
                <span key={i} className="text-xs bg-white/80 text-slate-600 px-2 py-1 rounded-full border border-slate-200">{s}</span>
              ))}
            </div>
          </div>
          <div className="text-right text-xs space-y-1">
            <div className="text-slate-500">时间: <span className="text-indigo-600 font-bold">{ALGORITHMS[algo].time}</span></div>
            <div className="text-slate-500">空间: <span className="text-indigo-600 font-bold">{ALGORITHMS[algo].space}</span></div>
            <div className="text-slate-500">稳定: <span className={'font-bold ' + (ALGORITHMS[algo].stable === '稳定' ? 'text-emerald-600' : 'text-rose-600')}>{ALGORITHMS[algo].stable}</span></div>
          </div>
        </div>
      </div>

      {/* 控制面板 */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <select value={algo} onChange={e => { setAlgo(e.target.value as Algorithm); generate(); }} disabled={sorting}
            className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
            {Object.entries(ALGORITHMS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
          </select>
          <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5">
            {(['cpp', 'java', 'python'] as Lang[]).map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={'px-2 py-1 rounded text-xs font-medium transition-all ' + (lang === l ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400')}>
                {LANG_NAMES[l]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">🐢</span>
            <input type="range" min="20" max="400" step="20" value={420 - speed} onChange={e => setSpeed(420 - Number(e.target.value))} className="w-24" />
            <span className="text-xs text-slate-400">🐇</span>
          </div>
          <button onClick={generate} disabled={sorting} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-slate-200 dark:hover:bg-slate-600">🎲 随机</button>
          {!sorting ? (
            <button onClick={start} className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">▶ 开始演示</button>
          ) : (
            <>
              <button onClick={togglePause} className={'px-3 py-1.5 rounded-lg text-sm font-medium ' + (paused ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white')}>
                {paused ? '▶ 继续' : '⏸ 暂停'}
              </button>
              {paused && (
                <button onClick={stepForward} className="px-3 py-1.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-500">
                  下一步 ▶
                </button>
              )}
              <button onClick={stop} className="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-sm font-medium">⏹ 停止</button>
            </>
          )}
          <div className="ml-auto flex gap-4 text-sm">
            <span className="text-slate-500 dark:text-slate-400">比较: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{stats.comp}</span>次</span>
            <span className="text-slate-500 dark:text-slate-400">交换: <span className="text-rose-600 dark:text-rose-400 font-bold">{stats.swap}</span>次</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* 可视化区域 */}
        <div className="lg:col-span-3 bg-slate-800 rounded-xl p-6">
          {/* 当前阶段 */}
          {phase && <div className="mb-2 text-indigo-400 text-xs font-medium">{phase}</div>}
          
          {/* 操作说明 */}
          <div className="mb-4 px-4 py-3 bg-slate-700/50 rounded-lg">
            <p className="text-white text-sm leading-relaxed">{desc}</p>
          </div>
          
          {/* 变量追踪 */}
          {Object.keys(variables).length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {Object.entries(variables).map(([k, v]) => (
                <span key={k} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                  <span className="text-slate-500">{k}:</span> <span className="text-amber-400 font-mono">{v}</span>
                </span>
              ))}
            </div>
          )}
          
          {/* 柱状图 */}
          <div className="h-48 flex items-end justify-center gap-1">
            {arr.map((bar, i) => (
              <div key={i} className="flex flex-col items-center group">
                <span className={'text-xs mb-1 transition-all ' + 
                  (bar.status === 'comparing' || bar.status === 'swapping' || bar.status === 'pivot' ? 'text-white font-bold' : 'text-slate-500')}>
                  {bar.value}
                </span>
                <div style={{ height: (bar.value / max * 160) + 'px' }}
                  className={'w-8 rounded-t transition-all duration-200 relative ' +
                    (bar.status === 'comparing' ? 'bg-amber-400 scale-110' :
                     bar.status === 'swapping' ? 'bg-rose-500 scale-110 animate-pulse' :
                     bar.status === 'sorted' ? 'bg-emerald-500' :
                     bar.status === 'merge' ? 'bg-cyan-500' :
                     bar.status === 'pivot' ? 'bg-purple-500 scale-110' : 'bg-indigo-500')}>
                  {(bar.status === 'comparing' || bar.status === 'swapping' || bar.status === 'pivot') && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap">
                      {bar.status === 'comparing' && '👀'}
                      {bar.status === 'swapping' && '🔄'}
                      {bar.status === 'pivot' && '📌'}
                    </div>
                  )}
                </div>
                <span className="text-slate-600 text-xs mt-1">[{i}]</span>
              </div>
            ))}
          </div>
          
          {/* 图例 */}
          <div className="flex flex-wrap justify-center gap-3 mt-4 pt-4 border-t border-slate-700">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-indigo-500"></div><span className="text-slate-400 text-xs">未排序</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-amber-400"></div><span className="text-slate-400 text-xs">👀比较中</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-rose-500"></div><span className="text-slate-400 text-xs">🔄交换中</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-purple-500"></div><span className="text-slate-400 text-xs">📌关键值</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-emerald-500"></div><span className="text-slate-400 text-xs">✓已排序</span></div>
          </div>
        </div>

        {/* 代码面板 */}
        <div className="lg:col-span-2 bg-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-300 font-medium text-sm">📝 {ALGORITHMS[algo].name}代码</span>
            <div className="flex bg-slate-700 rounded p-0.5">
              {(['cpp', 'java', 'python'] as Lang[]).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className={'px-2 py-0.5 rounded text-xs transition-all ' + (lang === l ? 'bg-slate-600 text-white' : 'text-slate-400')}>
                  {LANG_NAMES[l]}
                </button>
              ))}
            </div>
          </div>
          <div className="font-mono text-xs space-y-0.5 max-h-[200px] overflow-y-auto">
            {CODE[algo][lang].map((item: { text: string; indent: number }, i: number) => (
              <div key={i}
                className={'py-1 px-2 rounded transition-all duration-200 ' + 
                  (line === i ? 'bg-amber-500/40 text-amber-200 border-l-2 border-amber-400' : 'text-slate-400 border-l-2 border-transparent')}
                style={{ paddingLeft: (item.indent * 12 + 8) + 'px' }}>
                <span className="text-slate-600 select-none w-4 inline-block text-right mr-2">{i + 1}</span>
                {item.text}
              </div>
            ))}
          </div>
          
          {/* 代码说明 */}
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-500 mb-2">💡 当前执行的代码会高亮显示</p>
            <p className="text-xs text-slate-500">🎯 观察柱状图变化理解算法过程</p>
          </div>
        </div>
      </div>
    </div>
  );
}
