import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAlgorithmPlayer } from '../../hooks/useAlgorithmPlayer';
import useLowMotionMode from '../../hooks/useLowMotionMode';
import { PlayerControls } from './_shared/PlayerControls';
import { StepNarration } from './_shared/StepNarration';

type BarStatus = 'normal' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'merge';

interface Step {
  snapshot: number[];
  statuses: BarStatus[];
  line: number;
  description: string;
  stats: { comparisons: number; swaps: number; moves: number };
  phase?: string;
  variables?: Record<string, string>;
  // Extension fields for richer textbook-style rendering.
  sortedFrom?: number; // inclusive index where the sorted suffix/prefix starts
  sortedTo?: number;   // inclusive index where the sorted region ends
  sortedSide?: 'left' | 'right'; // which side the sorted region anchors to
  pivotIndex?: number; // for quicksort
  partitionStart?: number; // inclusive
  partitionEnd?: number;   // inclusive
  insertionCursor?: number; // for insertion sort
  mergeRange?: { left: number; mid: number; right: number; targetK?: number; pickFrom?: 'L' | 'R' };
  heapSize?: number; // for heap sort — how many elements form the active heap
}

type Algorithm =
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'quick'
  | 'merge'
  | 'heap'
  | 'shell';
type Lang = 'cpp' | 'java' | 'python';

const ALGORITHMS: Record<
  Algorithm,
  { name: string; time: string; space: string; stable: string }
> = {
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
    steps: [
      '1. 从头开始，比较相邻元素',
      '2. 如果前>后，交换它们',
      '3. 每轮把最大的移到末尾',
      '4. 重复n-1轮',
    ],
  },
  selection: {
    idea: '每次从未排序部分找最小值，放到已排序部分的末尾',
    steps: [
      '1. 假设当前位置是最小值',
      '2. 在后面找更小的元素',
      '3. 找到后与当前位置交换',
      '4. 向后移动，重复',
    ],
  },
  insertion: {
    idea: '像打扑克牌一样，把新牌插入到已排好序的手牌中',
    steps: [
      '1. 取出当前元素作为key',
      '2. 在前面已排序部分找位置',
      '3. 大于key的元素后移',
      '4. 把key插入空位',
    ],
  },
  shell: {
    idea: '先让间隔较远的元素有序，逐步缩小间隔，最后全局有序',
    steps: [
      '1. 设置初始间隔gap=n/2',
      '2. 对间隔gap的元素插入排序',
      '3. 缩小gap为原来一半',
      '4. 直到gap=1完成排序',
    ],
  },
  quick: {
    idea: '选一个基准，小的放左边，大的放右边，递归排序',
    steps: [
      '1. 选择最后一个元素为pivot',
      '2. 遍历把小于pivot的移左边',
      '3. 把pivot放到正确位置',
      '4. 递归排序左右两部分',
    ],
  },
  merge: {
    idea: '先分割成小块，再两两合并成有序序列',
    steps: [
      '1. 递归分割数组为两半',
      '2. 分到单个元素时开始合并',
      '3. 合并时比较两边元素',
      '4. 较小的先放入结果',
    ],
  },
  heap: {
    idea: '利用堆的性质，每次取出最大值放到末尾',
    steps: [
      '1. 建立大顶堆(父>子)',
      '2. 堆顶(最大值)与末尾交换',
      '3. 堆大小减1，重新调整堆',
      '4. 重复直到堆为空',
    ],
  },
};

// ----- Step generators -----

interface Emitter {
  steps: Step[];
  stats: { comparisons: number; swaps: number; moves: number };
  arr: number[];
  finalStatuses?: BarStatus[];
}

function makeEmitter(initial: number[]): Emitter {
  return {
    steps: [],
    stats: { comparisons: 0, swaps: 0, moves: 0 },
    arr: initial.slice(),
  };
}

function emit(
  e: Emitter,
  statuses: BarStatus[],
  line: number,
  description: string,
  extra?: {
    phase?: string;
    variables?: Record<string, string>;
    sortedFrom?: number;
    sortedTo?: number;
    sortedSide?: 'left' | 'right';
    pivotIndex?: number;
    partitionStart?: number;
    partitionEnd?: number;
    insertionCursor?: number;
    mergeRange?: Step['mergeRange'];
    heapSize?: number;
  },
) {
  e.steps.push({
    snapshot: e.arr.slice(),
    statuses: statuses.slice(),
    line,
    description,
    stats: { ...e.stats },
    phase: extra?.phase,
    variables: extra?.variables,
    sortedFrom: extra?.sortedFrom,
    sortedTo: extra?.sortedTo,
    sortedSide: extra?.sortedSide,
    pivotIndex: extra?.pivotIndex,
    partitionStart: extra?.partitionStart,
    partitionEnd: extra?.partitionEnd,
    insertionCursor: extra?.insertionCursor,
    mergeRange: extra?.mergeRange,
    heapSize: extra?.heapSize,
  });
}

function bubbleSortSteps(initial: number[]): Step[] {
  const e = makeEmitter(initial);
  const n = e.arr.length;
  const statuses: BarStatus[] = new Array(n).fill('normal');
  emit(e, statuses, 0, '冒泡排序：每轮把最大的"冒泡"到末尾', {
    phase: '冒泡排序',
  });

  for (let i = 0; i < n - 1; i++) {
    emit(e, statuses, 1, `【第${i + 1}轮】将未排序部分的最大值移到位置 ${n - 1 - i}`, {
      phase: '冒泡排序',
      variables: { 外层循环i: String(i), 本轮范围: `a[0] ~ a[${n - 1 - i}]`, 已排好: `${i}个` },
      sortedFrom: n - i,
      sortedTo: n - 1,
      sortedSide: 'right',
    });

    for (let j = 0; j < n - 1 - i; j++) {
      statuses[j] = 'comparing';
      statuses[j + 1] = 'comparing';
      e.stats.comparisons++;
      emit(e, statuses, 3, `👀 比较 a[${j}]=${e.arr[j]} 和 a[${j + 1}]=${e.arr[j + 1]}`, {
        variables: { 外层i: String(i), 内层j: String(j), 比较: `a[${j}] vs a[${j + 1}]` },
        sortedFrom: n - i,
        sortedTo: n - 1,
        sortedSide: 'right',
      });

      if (e.arr[j] > e.arr[j + 1]) {
        statuses[j] = 'swapping';
        statuses[j + 1] = 'swapping';
        emit(e, statuses, 4, `🔄 ${e.arr[j]} > ${e.arr[j + 1]}，需要交换位置！`, {
          sortedFrom: n - i,
          sortedTo: n - 1,
          sortedSide: 'right',
        });
        const tmp = e.arr[j];
        e.arr[j] = e.arr[j + 1];
        e.arr[j + 1] = tmp;
        e.stats.swaps++;
        emit(e, statuses, 4, `✓ 交换完成: ${e.arr[j]} ← → ${e.arr[j + 1]}`, {
          sortedFrom: n - i,
          sortedTo: n - 1,
          sortedSide: 'right',
        });
      } else {
        emit(e, statuses, 3, `✓ ${e.arr[j]} ≤ ${e.arr[j + 1]}，顺序正确，不交换`, {
          sortedFrom: n - i,
          sortedTo: n - 1,
          sortedSide: 'right',
        });
      }
      statuses[j] = 'normal';
      statuses[j + 1] = 'normal';
    }

    statuses[n - 1 - i] = 'sorted';
    emit(
      e,
      statuses,
      1,
      `🎉 第${i + 1}轮完成！a[${n - 1 - i}]=${e.arr[n - 1 - i]} 是未排序部分最大值，已归位`,
      { sortedFrom: n - 1 - i, sortedTo: n - 1, sortedSide: 'right' },
    );
  }
  for (let i = 0; i < n; i++) statuses[i] = 'sorted';
  emit(e, statuses, -1, '✓ 排序完成！', { sortedFrom: 0, sortedTo: n - 1, sortedSide: 'left' });
  return e.steps;
}

function selectionSortSteps(initial: number[]): Step[] {
  const e = makeEmitter(initial);
  const n = e.arr.length;
  const statuses: BarStatus[] = new Array(n).fill('normal');
  emit(e, statuses, 0, '选择排序：每次找最小值放到前面', { phase: '选择排序' });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    statuses[i] = 'pivot';
    emit(e, statuses, 2, `【第${i + 1}轮】假设 a[${i}]=${e.arr[i]} 是未排序部分的最小值`, {
      variables: { 轮次: `第${i + 1}轮`, 当前位置i: String(i), 假设最小值位置: String(minIdx) },
      sortedFrom: 0,
      sortedTo: i - 1,
      sortedSide: 'left',
    });
    for (let j = i + 1; j < n; j++) {
      statuses[j] = 'comparing';
      e.stats.comparisons++;
      emit(e, statuses, 4, `比较: a[${j}]=${e.arr[j]} < a[${minIdx}]=${e.arr[minIdx]}?`, {
        sortedFrom: 0,
        sortedTo: i - 1,
        sortedSide: 'left',
      });

      if (e.arr[j] < e.arr[minIdx]) {
        if (minIdx !== i) statuses[minIdx] = 'normal';
        minIdx = j;
        statuses[j] = 'pivot';
      } else {
        statuses[j] = 'normal';
      }
    }

    if (minIdx !== i) {
      statuses[i] = 'swapping';
      statuses[minIdx] = 'swapping';
      emit(e, statuses, 5, `交换: a[${i}] ↔ a[${minIdx}]`, {
        sortedFrom: 0,
        sortedTo: i - 1,
        sortedSide: 'left',
      });
      const tmp = e.arr[i];
      e.arr[i] = e.arr[minIdx];
      e.arr[minIdx] = tmp;
      e.stats.swaps++;
    }
    statuses[i] = 'sorted';
    if (minIdx !== i) statuses[minIdx] = 'normal';
    emit(e, statuses, 5, `✓ 位置 ${i} 已就位，值=${e.arr[i]}`, {
      sortedFrom: 0,
      sortedTo: i,
      sortedSide: 'left',
    });
  }
  statuses[n - 1] = 'sorted';
  emit(e, statuses, -1, '✓ 排序完成！', { sortedFrom: 0, sortedTo: n - 1, sortedSide: 'left' });
  return e.steps;
}

function insertionSortSteps(initial: number[]): Step[] {
  const e = makeEmitter(initial);
  const n = e.arr.length;
  const statuses: BarStatus[] = new Array(n).fill('normal');
  if (n > 0) statuses[0] = 'sorted';
  emit(e, statuses, 0, '插入排序：将新元素插入到已排序部分', {
    phase: '插入排序',
    sortedFrom: 0,
    sortedTo: 0,
    sortedSide: 'left',
  });

  for (let i = 1; i < n; i++) {
    const key = e.arr[i];
    statuses[i] = 'pivot';
    emit(e, statuses, 2, `取出 key = ${key}`, {
      sortedFrom: 0,
      sortedTo: i - 1,
      sortedSide: 'left',
      insertionCursor: i,
    });

    let j = i - 1;
    while (j >= 0) {
      statuses[j] = 'comparing';
      e.stats.comparisons++;
      emit(e, statuses, 3, `比较 a[${j}]=${e.arr[j]} 与 key=${key}`, {
        sortedFrom: 0,
        sortedTo: i - 1,
        sortedSide: 'left',
        insertionCursor: i,
      });

      if (e.arr[j] > key) {
        e.arr[j + 1] = e.arr[j];
        e.stats.moves++;
        statuses[j + 1] = 'swapping';
        statuses[j] = 'sorted';
        emit(e, statuses, 4, `${e.arr[j]} > ${key}，将 a[${j}] 右移到 a[${j + 1}]`, {
          sortedFrom: 0,
          sortedTo: i - 1,
          sortedSide: 'left',
          insertionCursor: i,
        });
        j--;
      } else {
        statuses[j] = 'sorted';
        emit(e, statuses, 3, `${e.arr[j]} ≤ ${key}，停止`, {
          sortedFrom: 0,
          sortedTo: i - 1,
          sortedSide: 'left',
          insertionCursor: i,
        });
        break;
      }
    }
    e.arr[j + 1] = key;
    e.stats.moves++;
    statuses[j + 1] = 'sorted';
    emit(e, statuses, 6, `插入 ${key} 到位置 ${j + 1}`, {
      sortedFrom: 0,
      sortedTo: i,
      sortedSide: 'left',
    });
  }
  for (let i = 0; i < n; i++) statuses[i] = 'sorted';
  emit(e, statuses, -1, '✓ 排序完成！', { sortedFrom: 0, sortedTo: n - 1, sortedSide: 'left' });
  return e.steps;
}

function shellSortSteps(initial: number[]): Step[] {
  const e = makeEmitter(initial);
  const n = e.arr.length;
  const statuses: BarStatus[] = new Array(n).fill('normal');
  emit(e, statuses, 0, '希尔排序：先让间隔大的元素有序，再缩小间隔', { phase: '希尔排序' });

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    emit(e, statuses, 1, `gap = ${gap}`, { variables: { gap: String(gap) } });

    for (let i = gap; i < n; i++) {
      const temp = e.arr[i];
      statuses[i] = 'pivot';
      emit(e, statuses, 3, `取出 temp = a[${i}] = ${temp}`);

      let j = i;
      while (j >= gap) {
        statuses[j - gap] = 'comparing';
        e.stats.comparisons++;
        emit(e, statuses, 4, `比较 a[${j - gap}]=${e.arr[j - gap]} 与 temp=${temp}`);
        if (e.arr[j - gap] > temp) {
          e.arr[j] = e.arr[j - gap];
          e.stats.moves++;
          statuses[j] = 'swapping';
          statuses[j - gap] = 'normal';
          emit(e, statuses, 5, `a[${j}] = a[${j - gap}]，j -= gap`);
          j -= gap;
        } else {
          statuses[j - gap] = 'normal';
          emit(e, statuses, 4, '停止内层循环');
          break;
        }
      }
      e.arr[j] = temp;
      e.stats.moves++;
      statuses[j] = 'normal';
      statuses[i] = 'normal';
      emit(e, statuses, 7, `a[${j}] = temp = ${temp}`);
    }
  }
  for (let i = 0; i < n; i++) statuses[i] = 'sorted';
  emit(e, statuses, -1, '✓ 排序完成！', { sortedFrom: 0, sortedTo: n - 1, sortedSide: 'left' });
  return e.steps;
}

function quickSortSteps(initial: number[]): Step[] {
  const e = makeEmitter(initial);
  const n = e.arr.length;
  const statuses: BarStatus[] = new Array(n).fill('normal');
  emit(e, statuses, 0, '快速排序：分治法，基于 pivot 划分', { phase: '快速排序' });

  const sort = (l: number, r: number) => {
    if (l >= r) return;

    const pivotVal = e.arr[r];
    statuses[r] = 'pivot';
    emit(e, statuses, 2, `pivot = a[${r}] = ${pivotVal}`, {
      pivotIndex: r,
      partitionStart: l,
      partitionEnd: r,
    });

    let i = l;
    for (let j = l; j < r; j++) {
      statuses[j] = 'comparing';
      e.stats.comparisons++;
      emit(e, statuses, 4, `比较: a[${j}]=${e.arr[j]} < pivot=${pivotVal}?`, {
        pivotIndex: r,
        partitionStart: l,
        partitionEnd: r,
      });

      if (e.arr[j] < pivotVal) {
        if (i !== j) {
          statuses[i] = 'swapping';
          statuses[j] = 'swapping';
          emit(e, statuses, 4, `交换 a[${i}] 与 a[${j}]`, {
            pivotIndex: r,
            partitionStart: l,
            partitionEnd: r,
          });
          const tmp = e.arr[i];
          e.arr[i] = e.arr[j];
          e.arr[j] = tmp;
          e.stats.swaps++;
        }
        statuses[i] = 'normal';
        i++;
      }
      statuses[j] = 'normal';
    }

    statuses[i] = 'swapping';
    statuses[r] = 'swapping';
    emit(e, statuses, 5, `交换 pivot 到位置 ${i}`, {
      pivotIndex: r,
      partitionStart: l,
      partitionEnd: r,
    });
    const tmp = e.arr[i];
    e.arr[i] = e.arr[r];
    e.arr[r] = tmp;
    e.stats.swaps++;
    statuses[i] = 'sorted';
    statuses[r] = 'normal';
    emit(e, statuses, 5, `pivot ${pivotVal} 已就位`);

    sort(l, i - 1);
    sort(i + 1, r);
  };

  sort(0, n - 1);
  for (let i = 0; i < n; i++) statuses[i] = 'sorted';
  emit(e, statuses, -1, '✓ 排序完成！', { sortedFrom: 0, sortedTo: n - 1, sortedSide: 'left' });
  return e.steps;
}

function mergeSortSteps(initial: number[]): Step[] {
  const e = makeEmitter(initial);
  const n = e.arr.length;
  const statuses: BarStatus[] = new Array(n).fill('normal');
  emit(e, statuses, 8, '归并排序：分治法，递归拆分后合并', { phase: '归并排序' });

  const sort = (l: number, r: number) => {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    emit(e, statuses, 10, `分治: [${l}..${m}] 和 [${m + 1}..${r}]`, {
      mergeRange: { left: l, mid: m, right: r },
    });
    sort(l, m);
    sort(m + 1, r);

    const L = e.arr.slice(l, m + 1);
    const R = e.arr.slice(m + 1, r + 1);
    let i = 0;
    let j = 0;
    let k = l;
    emit(e, statuses, 3, `合并: [${l}..${m}] + [${m + 1}..${r}]`, {
      mergeRange: { left: l, mid: m, right: r, targetK: k },
    });

    while (i < L.length && j < R.length) {
      statuses[k] = 'merge';
      e.stats.comparisons++;
      const pickFrom: 'L' | 'R' = L[i] <= R[j] ? 'L' : 'R';
      emit(e, statuses, 3, `比较 L[${i}]=${L[i]} 与 R[${j}]=${R[j]}`, {
        mergeRange: { left: l, mid: m, right: r, targetK: k, pickFrom },
      });
      if (L[i] <= R[j]) {
        e.arr[k] = L[i++];
      } else {
        e.arr[k] = R[j++];
      }
      e.stats.moves++;
      statuses[k] = 'normal';
      k++;
    }
    while (i < L.length) {
      e.arr[k] = L[i++];
      e.stats.moves++;
      statuses[k] = 'normal';
      k++;
    }
    while (j < R.length) {
      e.arr[k] = R[j++];
      e.stats.moves++;
      statuses[k] = 'normal';
      k++;
    }
    emit(e, statuses, 4, `区间 [${l}..${r}] 合并完成`, {
      mergeRange: { left: l, mid: m, right: r },
    });
  };

  sort(0, n - 1);
  for (let i = 0; i < n; i++) statuses[i] = 'sorted';
  emit(e, statuses, -1, '✓ 排序完成！', { sortedFrom: 0, sortedTo: n - 1, sortedSide: 'left' });
  return e.steps;
}

function heapSortSteps(initial: number[]): Step[] {
  const e = makeEmitter(initial);
  const n = e.arr.length;
  const statuses: BarStatus[] = new Array(n).fill('normal');
  emit(e, statuses, 7, '堆排序：建大顶堆，然后反复取堆顶', { phase: '堆排序', heapSize: n });

  const siftDown = (size: number, i: number) => {
    let cur = i;
    while (true) {
      let largest = cur;
      const l = 2 * cur + 1;
      const r = 2 * cur + 2;
      if (l < size) {
        statuses[l] = 'comparing';
        e.stats.comparisons++;
        emit(e, statuses, 2, `比较 a[${l}]=${e.arr[l]} 与 a[${largest}]=${e.arr[largest]}`, {
          heapSize: size,
        });
        if (e.arr[l] > e.arr[largest]) largest = l;
        statuses[l] = 'normal';
      }
      if (r < size) {
        statuses[r] = 'comparing';
        e.stats.comparisons++;
        emit(e, statuses, 3, `比较 a[${r}]=${e.arr[r]} 与 a[${largest}]=${e.arr[largest]}`, {
          heapSize: size,
        });
        if (e.arr[r] > e.arr[largest]) largest = r;
        statuses[r] = 'normal';
      }
      if (largest !== cur) {
        statuses[cur] = 'swapping';
        statuses[largest] = 'swapping';
        emit(e, statuses, 4, `交换 a[${cur}] ↔ a[${largest}]`, { heapSize: size });
        const tmp = e.arr[cur];
        e.arr[cur] = e.arr[largest];
        e.arr[largest] = tmp;
        e.stats.swaps++;
        statuses[cur] = 'normal';
        statuses[largest] = 'normal';
        cur = largest;
      } else {
        break;
      }
    }
  };

  emit(e, statuses, 7, '建堆开始', { heapSize: n });
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(n, i);
  emit(e, statuses, 7, '建堆完成', { heapSize: n });

  for (let i = n - 1; i > 0; i--) {
    statuses[0] = 'swapping';
    statuses[i] = 'swapping';
    emit(e, statuses, 9, `交换堆顶 a[0]=${e.arr[0]} 与 a[${i}]=${e.arr[i]}`, { heapSize: i + 1 });
    const tmp = e.arr[0];
    e.arr[0] = e.arr[i];
    e.arr[i] = tmp;
    e.stats.swaps++;
    statuses[i] = 'sorted';
    statuses[0] = 'normal';
    emit(e, statuses, 10, `a[${i}] 已就位`, {
      heapSize: i,
      sortedFrom: i,
      sortedTo: n - 1,
      sortedSide: 'right',
    });
    siftDown(i, 0);
  }
  if (n > 0) statuses[0] = 'sorted';
  emit(e, statuses, -1, '✓ 排序完成！', {
    sortedFrom: 0,
    sortedTo: n - 1,
    sortedSide: 'left',
    heapSize: 0,
  });
  return e.steps;
}

const GENERATORS: Record<Algorithm, (arr: number[]) => Step[]> = {
  bubble: bubbleSortSteps,
  selection: selectionSortSteps,
  insertion: insertionSortSteps,
  shell: shellSortSteps,
  quick: quickSortSteps,
  merge: mergeSortSteps,
  heap: heapSortSteps,
};

function generateInitialArray(): number[] {
  return Array.from({ length: 10 }, () => Math.floor(Math.random() * 80) + 20);
}

// ----- Presentation helpers -----

interface BarStyle {
  fill: string;
  outline: string;
  textClass: string;
}

function barStyleFor(status: BarStatus, isPivot: boolean, inSorted: boolean): BarStyle {
  if (isPivot) {
    // Quicksort pivot — amber outline (the bar itself keeps its status color).
    return {
      fill:
        status === 'swapping'
          ? 'bg-pine-500'
          : status === 'sorted'
          ? 'bg-emerald-500'
          : 'bg-amber-400',
      outline: 'ring-2 ring-amber-300 ring-offset-1 ring-offset-slate-900',
      textClass: 'text-slate-900',
    };
  }
  if (status === 'swapping') {
    return {
      fill: 'bg-pine-500',
      outline: 'ring-2 ring-pine-300/70 ring-offset-1 ring-offset-slate-900',
      textClass: 'text-slate-900',
    };
  }
  if (status === 'comparing') {
    return {
      fill: 'bg-klein-400',
      outline: 'ring-2 ring-klein-200/80 ring-offset-1 ring-offset-slate-900',
      textClass: 'text-white',
    };
  }
  if (status === 'sorted' || inSorted) {
    return {
      fill: 'bg-emerald-500',
      outline: '',
      textClass: 'text-white',
    };
  }
  if (status === 'merge') {
    return {
      fill: 'bg-cyan-500',
      outline: 'ring-2 ring-cyan-300/70 ring-offset-1 ring-offset-slate-900',
      textClass: 'text-white',
    };
  }
  if (status === 'pivot') {
    return {
      fill: 'bg-amber-400',
      outline: 'ring-2 ring-amber-300 ring-offset-1 ring-offset-slate-900',
      textClass: 'text-slate-900',
    };
  }
  return {
    fill: 'bg-klein-500',
    outline: '',
    textClass: 'text-white',
  };
}

export default function SortVisualization() {
  const [baseArr, setBaseArr] = useState<number[]>(() => generateInitialArray());
  const [algo, setAlgo] = useState<Algorithm>('bubble');
  const [lang, setLang] = useState<Lang>('cpp');
  const lowMotion = useLowMotionMode();

  const steps = useMemo<Step[]>(() => GENERATORS[algo](baseArr), [algo, baseArr]);

  const player = useAlgorithmPlayer<Step>({
    steps,
    stepDurationMs: 900,
    autoPlay: false,
  });

  const current = player.currentStep;
  const displaySnapshot = current?.snapshot ?? baseArr;
  const displayStatuses: BarStatus[] =
    current?.statuses ?? new Array(baseArr.length).fill('normal');
  const activeLine = current?.line ?? -1;
  const stats = current?.stats ?? { comparisons: 0, swaps: 0, moves: 0 };
  const narrationDescription =
    current?.description ?? '选择算法，点击"开始"观看动画演示';
  const variables = current?.variables ?? {};
  const phase = current?.phase ?? '';

  const regenerate = () => {
    setBaseArr(generateInitialArray());
  };

  useEffect(() => {
    // keep dependency list stable
  }, [algo]);

  const max = Math.max(...displaySnapshot, 1);

  // Geometry for the stage — fixed per-bar width so overlays (pivot bracket,
  // partition lines, insertion cursor, sorted baseline) align precisely.
  const BAR_WIDTH = 36;
  const BAR_GAP = 6;
  const BAR_PITCH = BAR_WIDTH + BAR_GAP;
  const LEFT_PAD = 28;
  const TOP_PAD = 44; // space for top pointer labels
  const BAR_AREA_H = 168;
  const BOTTOM_PAD = 44; // space for sorted baseline + index labels
  const STAGE_W = LEFT_PAD * 2 + displaySnapshot.length * BAR_PITCH - BAR_GAP;
  const STAGE_H = TOP_PAD + BAR_AREA_H + BOTTOM_PAD;

  const barX = (i: number) => LEFT_PAD + i * BAR_PITCH;

  // Determine the continuous sorted region from the step, if any.
  const sortedFrom = current?.sortedFrom;
  const sortedTo = current?.sortedTo;
  const sortedIndices = new Set<number>();
  if (typeof sortedFrom === 'number' && typeof sortedTo === 'number' && sortedTo >= sortedFrom) {
    for (let i = sortedFrom; i <= sortedTo; i++) sortedIndices.add(i);
  }
  // Also treat any status==='sorted' bar as part of the sorted visual region.
  displayStatuses.forEach((s, i) => {
    if (s === 'sorted') sortedIndices.add(i);
  });

  const pivotIndex = current?.pivotIndex;
  const partitionStart = current?.partitionStart;
  const partitionEnd = current?.partitionEnd;
  const insertionCursor = current?.insertionCursor;
  const mergeRange = current?.mergeRange;
  const heapSize = current?.heapSize;

  // Precompute heap-tree node positions for heapsort side panel.
  const heapTreePositions: Array<{ x: number; y: number }> = [];
  if (algo === 'heap') {
    const n = displaySnapshot.length;
    for (let i = 0; i < n; i++) {
      const depth = Math.floor(Math.log2(i + 1));
      const levelSize = 2 ** depth;
      const offsetInLevel = i - (levelSize - 1);
      // Normalize x to [0,1] across the widest level that actually has nodes.
      const maxDepth = Math.floor(Math.log2(Math.max(n, 1)));
      const maxLevel = 2 ** maxDepth;
      const x = (offsetInLevel + 0.5) / Math.max(levelSize, 1);
      const xScaled = x * maxLevel;
      heapTreePositions[i] = { x: xScaled, y: depth };
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800/60 dark:to-slate-800/60 rounded-xl border border-indigo-100 dark:border-slate-700 p-4">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💡</span>
              <span className="font-bold text-indigo-800 dark:text-indigo-200">
                {ALGORITHMS[algo].name}原理
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
              {ALGO_DESC[algo].idea}
            </p>
            <div className="flex flex-wrap gap-2">
              {ALGO_DESC[algo].steps.map((s, i) => (
                <span
                  key={i}
                  className="text-xs bg-white/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full border border-slate-200 dark:border-slate-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right text-xs space-y-1">
            <div className="text-slate-500 dark:text-slate-400">
              时间:{' '}
              <span className="text-klein-600 dark:text-klein-300 font-bold font-mono">
                {ALGORITHMS[algo].time}
              </span>
            </div>
            <div className="text-slate-500 dark:text-slate-400">
              空间:{' '}
              <span className="text-klein-600 dark:text-klein-300 font-bold font-mono">
                {ALGORITHMS[algo].space}
              </span>
            </div>
            <div className="text-slate-500 dark:text-slate-400">
              稳定:{' '}
              <span
                className={
                  'font-bold ' +
                  (ALGORITHMS[algo].stable === '稳定'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400')
                }
              >
                {ALGORITHMS[algo].stable}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={algo}
            onChange={(e) => {
              setAlgo(e.target.value as Algorithm);
            }}
            className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 outline-none transition-all focus:border-klein-500 focus:ring-2 focus:ring-klein-500/20 disabled:cursor-not-allowed dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:[color-scheme:dark] dark:focus:ring-klein-400/20"
          >
            {Object.entries(ALGORITHMS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.name}
              </option>
            ))}
          </select>
          <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5">
            {(['cpp', 'java', 'python'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={
                  'cursor-pointer rounded px-2 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 ' +
                  (lang === l
                    ? 'bg-white dark:bg-slate-600 shadow-sm text-klein-600 dark:text-klein-300'
                    : 'text-slate-500 dark:text-slate-400')
                }
              >
                {LANG_NAMES[l]}
              </button>
            ))}
          </div>
          <button
            onClick={regenerate}
            className="cursor-pointer rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
          >
            🎲 随机
          </button>
          <div className="ml-auto grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                比较
              </div>
              <div className="text-sm font-mono font-bold text-klein-600 dark:text-klein-300 tabular-nums">
                {stats.comparisons}
              </div>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                交换
              </div>
              <div className="text-sm font-mono font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                {stats.swaps}
              </div>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                移动
              </div>
              <div className="text-sm font-mono font-bold text-cyan-600 dark:text-cyan-400 tabular-nums">
                {stats.moves}
              </div>
            </div>
          </div>
        </div>
      </div>

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

      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-slate-900 rounded-xl p-4 sm:p-6 border border-slate-800 shadow-inner shadow-black/20">
          {phase && (
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-klein-500/15 border border-klein-500/40 px-2.5 py-0.5 text-klein-300 text-[11px] font-mono font-medium">
              {phase}
            </div>
          )}

          {Object.keys(variables).length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {Object.entries(variables).map(([k, v]) => (
                <span
                  key={k}
                  className="text-[11px] bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-md"
                >
                  <span className="text-slate-500">{k}:</span>{' '}
                  <span className="text-pine-400 font-mono">{v}</span>
                </span>
              ))}
            </div>
          )}

          {/* Heapsort side tree */}
          {algo === 'heap' && displaySnapshot.length > 0 && (
            <div className="mb-3 rounded-lg border border-slate-800 bg-slate-950/40 p-3">
              <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-2">
                隐式堆 (array as binary tree)
                {typeof heapSize === 'number' && (
                  <span className="ml-2 font-mono text-slate-400">size={heapSize}</span>
                )}
              </div>
              <HeapTreeMini
                values={displaySnapshot}
                statuses={displayStatuses}
                positions={heapTreePositions}
                heapSize={heapSize ?? displaySnapshot.length}
              />
            </div>
          )}

          {/* Main bar stage */}
          <div className="relative" style={{ width: STAGE_W, height: STAGE_H, margin: '0 auto' }}>
            <svg
              className="absolute inset-0 pointer-events-none"
              width={STAGE_W}
              height={STAGE_H}
              viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
            >
              {/* Sorted baseline */}
              {sortedIndices.size > 0 && (() => {
                const idxs = Array.from(sortedIndices).sort((a, b) => a - b);
                // Detect contiguous runs to draw separate dashed baselines.
                const runs: Array<[number, number]> = [];
                let runStart = idxs[0];
                let prev = idxs[0];
                for (let k = 1; k < idxs.length; k++) {
                  if (idxs[k] === prev + 1) {
                    prev = idxs[k];
                  } else {
                    runs.push([runStart, prev]);
                    runStart = idxs[k];
                    prev = idxs[k];
                  }
                }
                runs.push([runStart, prev]);
                const baseY = TOP_PAD + BAR_AREA_H + 6;
                return runs.map(([s, ePos], i) => {
                  const x1 = barX(s) - 2;
                  const x2 = barX(ePos) + BAR_WIDTH + 2;
                  const midX = (x1 + x2) / 2;
                  return (
                    <g key={`sorted-run-${i}`}>
                      <line
                        x1={x1}
                        x2={x2}
                        y1={baseY}
                        y2={baseY}
                        stroke="#10b981"
                        strokeWidth={2}
                        strokeDasharray="4,3"
                        opacity={0.85}
                      />
                      <text
                        x={midX}
                        y={baseY + 14}
                        fontSize={9}
                        textAnchor="middle"
                        className="fill-emerald-400 font-mono tracking-widest"
                      >
                        SORTED
                      </text>
                    </g>
                  );
                });
              })()}

              {/* Quicksort partition boundaries */}
              {algo === 'quick' &&
                typeof partitionStart === 'number' &&
                typeof partitionEnd === 'number' && (
                  <g>
                    <line
                      x1={barX(partitionStart) - 3}
                      x2={barX(partitionStart) - 3}
                      y1={TOP_PAD - 4}
                      y2={TOP_PAD + BAR_AREA_H}
                      stroke="#60a5fa"
                      strokeWidth={1.5}
                      strokeDasharray="2,3"
                      opacity={0.7}
                    />
                    <line
                      x1={barX(partitionEnd) + BAR_WIDTH + 3}
                      x2={barX(partitionEnd) + BAR_WIDTH + 3}
                      y1={TOP_PAD - 4}
                      y2={TOP_PAD + BAR_AREA_H}
                      stroke="#60a5fa"
                      strokeWidth={1.5}
                      strokeDasharray="2,3"
                      opacity={0.7}
                    />
                  </g>
                )}

              {/* Mergesort range bracket */}
              {algo === 'merge' && mergeRange && (() => {
                const { left, mid, right } = mergeRange;
                const xLeft = barX(left) - 3;
                const xMid = barX(mid) + BAR_WIDTH + 3;
                const xRight = barX(right) + BAR_WIDTH + 3;
                const yTop = TOP_PAD - 8;
                return (
                  <g>
                    {/* Left-half bracket */}
                    <path
                      d={`M ${xLeft} ${yTop + 6} L ${xLeft} ${yTop} L ${xMid} ${yTop} L ${xMid} ${yTop + 6}`}
                      stroke="#a78bfa"
                      strokeWidth={1.5}
                      fill="none"
                    />
                    {/* Right-half bracket */}
                    <path
                      d={`M ${xMid + 2} ${yTop + 6} L ${xMid + 2} ${yTop} L ${xRight} ${yTop} L ${xRight} ${yTop + 6}`}
                      stroke="#22d3ee"
                      strokeWidth={1.5}
                      fill="none"
                    />
                  </g>
                );
              })()}

              {/* Insertion sort cursor */}
              {algo === 'insertion' && typeof insertionCursor === 'number' && (
                <line
                  x1={barX(insertionCursor) - 3}
                  x2={barX(insertionCursor) - 3}
                  y1={TOP_PAD - 4}
                  y2={TOP_PAD + BAR_AREA_H}
                  stroke="#60a5fa"
                  strokeWidth={1.5}
                  strokeDasharray="3,3"
                  opacity={0.8}
                />
              )}

              {/* Sorted-region tint (left side) */}
              {algo === 'insertion' &&
                typeof insertionCursor === 'number' &&
                insertionCursor > 0 && (
                  <rect
                    x={barX(0) - 4}
                    y={TOP_PAD - 4}
                    width={insertionCursor * BAR_PITCH + 4}
                    height={BAR_AREA_H + 4}
                    fill="url(#sort-left-tint)"
                    rx={4}
                  />
                )}
              <defs>
                <linearGradient id="sort-left-tint" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#1a47b3" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#1a47b3" stopOpacity="0.04" />
                </linearGradient>
              </defs>
            </svg>

            {/* Bars */}
            <div
              className="absolute flex items-end"
              style={{
                left: LEFT_PAD,
                top: TOP_PAD,
                height: BAR_AREA_H,
                gap: BAR_GAP,
              }}
            >
              {displaySnapshot.map((value, i) => {
                const status = displayStatuses[i] ?? 'normal';
                const isPivot = algo === 'quick' && i === pivotIndex;
                const inSorted = sortedIndices.has(i);
                const height = Math.max((value / max) * (BAR_AREA_H - 12), 6);
                const style = barStyleFor(status, isPivot, inSorted);
                const isActive = status === 'comparing' || status === 'swapping' || isPivot;

                return (
                  <div
                    key={i}
                    className="relative flex flex-col items-center"
                    style={{ width: BAR_WIDTH }}
                  >
                    {/* Status emoji above bar */}
                    {(status === 'comparing' || status === 'swapping' || isPivot) && (
                      <div
                        className={
                          'absolute text-[10px] font-mono font-bold whitespace-nowrap ' +
                          (isPivot
                            ? 'text-amber-300'
                            : status === 'swapping'
                            ? 'text-pine-300'
                            : 'text-klein-200')
                        }
                        style={{ top: -26 }}
                      >
                        {isPivot
                          ? 'pivot'
                          : status === 'comparing'
                          ? '比较'
                          : '交换'}
                      </div>
                    )}
                    <motion.div
                      layout={!lowMotion}
                      animate={
                        lowMotion
                          ? undefined
                          : {
                              scale:
                                status === 'swapping'
                                  ? [1, 1.12, 1]
                                  : status === 'comparing'
                                  ? 1.04
                                  : 1,
                            }
                      }
                      transition={
                        status === 'swapping'
                          ? { duration: 0.32, ease: 'easeOut' }
                          : { type: 'spring', stiffness: 320, damping: 24, mass: 0.7 }
                      }
                      className={
                        'w-full rounded-t-md flex items-start justify-center pt-1 transition-[background-color] duration-200 ' +
                        style.fill +
                        ' ' +
                        style.outline +
                        (isActive ? ' shadow-md shadow-klein-500/30' : '')
                      }
                      style={{ height: `${height}px` }}
                    >
                      <span className={'text-[11px] font-mono font-bold ' + style.textClass}>
                        {value}
                      </span>
                    </motion.div>
                    {/* Index label */}
                    <span className="mt-2 text-[10px] font-mono text-slate-500">[{i}]</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend — textbook color key */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            <LegendSwatch color="bg-klein-500" label="未排序" />
            <LegendSwatch color="bg-klein-400 ring-1 ring-klein-200/60" label="比较" />
            <LegendSwatch color="bg-pine-500" label="交换" />
            <LegendSwatch color="bg-amber-400 ring-1 ring-amber-300" label="pivot" />
            <LegendSwatch color="bg-cyan-500" label="归并" />
            <LegendSwatch color="bg-emerald-500" label="已就位" />
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-300 font-medium text-sm">
              📝 {ALGORITHMS[algo].name}代码
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
          <div className="font-mono text-xs space-y-0.5 max-h-[260px] overflow-y-auto">
            {CODE[algo][lang].map((item: { text: string; indent: number }, i: number) => (
              <div
                key={i}
                className={
                  'py-1 px-2 rounded transition-all duration-200 ' +
                  (activeLine === i
                    ? 'bg-pine-500/30 text-pine-100 border-l-2 border-pine-400'
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
            <p className="text-xs text-slate-500 mb-2">
              💡 高亮行 = 当前执行的代码，柱状图同步更新
            </p>
            <p className="text-xs text-slate-500">🎯 虚线 = 已排序区间；亮色环 = pivot / 当前操作</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <div className={'w-3 h-3 rounded-sm ' + color} />
      <span>{label}</span>
    </div>
  );
}

interface HeapTreeMiniProps {
  values: number[];
  statuses: BarStatus[];
  positions: Array<{ x: number; y: number }>;
  heapSize: number;
}

function HeapTreeMini({ values, statuses, positions, heapSize }: HeapTreeMiniProps) {
  if (values.length === 0) return null;
  const maxDepth = Math.max(...positions.map((p) => p.y), 0);
  const maxLevelSize = 2 ** maxDepth;
  const nodeR = 12;
  const levelH = 34;
  const pxPerUnit = 26;
  const width = maxLevelSize * pxPerUnit + nodeR * 2 + 12;
  const height = (maxDepth + 1) * levelH + nodeR * 2;
  const cx = (i: number) => positions[i].x * pxPerUnit + nodeR + 6;
  const cy = (i: number) => positions[i].y * levelH + nodeR + 4;

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="max-h-32"
    >
      {/* Edges */}
      {values.map((_, i) => {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        const active = i < heapSize;
        return (
          <g key={`he-${i}`} opacity={active ? 1 : 0.25}>
            {l < values.length && (
              <line
                x1={cx(i)}
                y1={cy(i)}
                x2={cx(l)}
                y2={cy(l)}
                stroke="#475569"
                strokeWidth={1.2}
              />
            )}
            {r < values.length && (
              <line
                x1={cx(i)}
                y1={cy(i)}
                x2={cx(r)}
                y2={cy(r)}
                stroke="#475569"
                strokeWidth={1.2}
              />
            )}
          </g>
        );
      })}
      {/* Nodes */}
      {values.map((v, i) => {
        const active = i < heapSize;
        const s = statuses[i];
        const fill =
          s === 'swapping'
            ? '#FFE135'
            : s === 'comparing'
            ? '#4d70c4'
            : s === 'sorted'
            ? '#10b981'
            : active
            ? '#1a47b3'
            : '#334155';
        const textColor = s === 'swapping' ? '#1e293b' : '#ffffff';
        return (
          <g key={`hn-${i}`} opacity={active ? 1 : 0.4}>
            <circle cx={cx(i)} cy={cy(i)} r={nodeR} fill={fill} stroke="#0f172a" strokeWidth={1} />
            <text
              x={cx(i)}
              y={cy(i) + 3}
              textAnchor="middle"
              fontSize={10}
              fontFamily="monospace"
              fill={textColor}
              fontWeight="bold"
            >
              {v}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
