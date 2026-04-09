import type { LessonContent } from './types';
import {
  KnowledgeCard,
  StepList,
  CompareTable,
  CodeExample,
  TipBox,
} from '../../components/tutorials/TutorialPanel';

/* eslint-disable no-irregular-whitespace */

export const sortLessons: Record<string, LessonContent> = {
  'sort/bubble': {
    title: '冒泡排序',
    category: '排序',
    duration: '20分钟',
    demoLink: '/algorithms/sort-bubble',
    sections: [
      {
        title: '冒泡排序原理',
        content: (
          <div className="space-y-4">
            <KnowledgeCard title="🫧 冒泡排序 = 相邻比较，大的往后冒" color="klein">
              <p>反复遍历数组，每次比较相邻元素，如果顺序错误就交换。</p>
              <p className="text-sm text-slate-500 mt-2">像气泡一样，大的元素慢慢"冒"到后面。</p>
            </KnowledgeCard>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6 dark:from-blue-950/40 dark:to-indigo-950/30 dark:border-blue-800/60">
              <h4 className="text-lg font-bold text-blue-800 mb-3 dark:text-blue-200">🎯 排序过程演示</h4>
              <div className="space-y-2 font-mono text-sm">
                <p>原数组：[5, 3, 8, 1, 2]</p>
                <p>第1轮：[3, 5, 1, 2, <span className="text-rose-600 font-bold">8</span>] ← 8冒到最后</p>
                <p>第2轮：[3, 1, 2, <span className="text-rose-600 font-bold">5</span>, 8] ← 5冒到倒数第二</p>
                <p>第3轮：[1, 2, <span className="text-rose-600 font-bold">3</span>, 5, 8]</p>
                <p>第4轮：[1, <span className="text-rose-600 font-bold">2</span>, 3, 5, 8] ✓ 完成</p>
              </div>
            </div>
            <CompareTable
              headers={['复杂度', '值', '说明']}
              rows={[
                ['时间(最好)', 'O(n)', '已有序，只需一轮'],
                ['时间(平均/最坏)', 'O(n²)', '需要n轮，每轮比较n次'],
                ['空间', 'O(1)', '原地排序'],
                ['稳定性', '稳定', '相等元素不会交换'],
              ]}
            />
          </div>
        ),
      },
      {
        title: '代码实现',
        content: (
          <div className="space-y-4">
            <CodeExample lang="cpp" code={`// 冒泡排序
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {       // n-1轮
        bool swapped = false;                // 优化：标记是否发生交换
        for (int j = 0; j < n - 1 - i; j++) { // 每轮少比较一个
            if (arr[j] > arr[j + 1]) {       // 相邻比较
                swap(arr[j], arr[j + 1]);    // 交换
                swapped = true;
            }
        }
        if (!swapped) break;  // 没有交换说明已有序
    }
}`} />
            <TipBox type="tip">
              <strong>优化：</strong>如果某一轮没有发生交换，说明已经有序，可以提前结束！
            </TipBox>
          </div>
        ),
      },
    ],
  },
  'sort/select': {
    title: '选择排序',
    category: '排序',
    duration: '20分钟',
    demoLink: '/algorithms/sort-select',
    sections: [
      {
        title: '选择排序原理',
        content: (
          <div className="space-y-4">
            <KnowledgeCard title="👆 选择排序 = 每次选最小的放前面" color="emerald">
              <p>每轮从未排序部分选出最小元素，放到已排序部分的末尾。</p>
            </KnowledgeCard>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-6 dark:from-emerald-950/40 dark:to-teal-950/30 dark:border-emerald-800/60">
              <h4 className="text-lg font-bold text-emerald-800 mb-3 dark:text-emerald-200">🎯 排序过程演示</h4>
              <div className="space-y-2 font-mono text-sm">
                <p>原数组：[5, 3, 8, 1, 2]</p>
                <p>第1轮：[<span className="text-emerald-600 font-bold">1</span>, 3, 8, 5, 2] ← 选出1放第一</p>
                <p>第2轮：[1, <span className="text-emerald-600 font-bold">2</span>, 8, 5, 3] ← 选出2放第二</p>
                <p>第3轮：[1, 2, <span className="text-emerald-600 font-bold">3</span>, 5, 8]</p>
                <p>第4轮：[1, 2, 3, <span className="text-emerald-600 font-bold">5</span>, 8] ✓ 完成</p>
              </div>
            </div>
            <CompareTable
              headers={['复杂度', '值', '说明']}
              rows={[
                ['时间', 'O(n²)', '任何情况都是n²'],
                ['空间', 'O(1)', '原地排序'],
                ['稳定性', '不稳定', '可能打乱相等元素顺序'],
              ]}
            />
          </div>
        ),
      },
      {
        title: '代码实现',
        content: (
          <div className="space-y-4">
            <CodeExample lang="cpp" code={`// 选择排序
void selectSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;  // 假设当前位置最小
        // 在未排序部分找最小值
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx])
                minIdx = j;
        }
        // 把最小值交换到当前位置
        if (minIdx != i)
            swap(arr[i], arr[minIdx]);
    }
}`} />
            <TipBox type="important">
              <strong>选择排序不稳定！</strong>例如：[5, 5, 3]，第一个5会和3交换，跑到第二个5后面。
            </TipBox>
          </div>
        ),
      },
    ],
  },
  'sort/insert': {
    title: '插入排序',
    category: '排序',
    duration: '25分钟',
    demoLink: '/algorithms/sort-insert',
    sections: [
      {
        title: '插入排序原理',
        content: (
          <div className="space-y-4">
            <KnowledgeCard title="🃏 插入排序 = 像打扑克牌一样" color="amber">
              <p>把每个元素插入到前面已排序序列的正确位置。</p>
              <p className="text-sm text-slate-500 mt-2">就像整理手中的扑克牌，每抓一张就插到合适位置。</p>
            </KnowledgeCard>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 p-6 dark:from-amber-950/40 dark:to-orange-950/30 dark:border-amber-800/60">
              <h4 className="text-lg font-bold text-amber-800 mb-3 dark:text-amber-200">🎯 排序过程演示</h4>
              <div className="space-y-2 font-mono text-sm">
                <p>原数组：[5, 3, 8, 1, 2]</p>
                <p>插入3：[<span className="text-amber-600 font-bold">3, 5</span>, 8, 1, 2] ← 3插到5前面</p>
                <p>插入8：[3, 5, <span className="text-amber-600 font-bold">8</span>, 1, 2] ← 8已在正确位置</p>
                <p>插入1：[<span className="text-amber-600 font-bold">1</span>, 3, 5, 8, 2] ← 1插到最前</p>
                <p>插入2：[1, <span className="text-amber-600 font-bold">2</span>, 3, 5, 8] ✓ 完成</p>
              </div>
            </div>
            <CompareTable
              headers={['复杂度', '值', '说明']}
              rows={[
                ['时间(最好)', 'O(n)', '已有序'],
                ['时间(平均/最坏)', 'O(n²)', '逆序'],
                ['空间', 'O(1)', '原地排序'],
                ['稳定性', '稳定', '相等元素不会交换'],
              ]}
            />
          </div>
        ),
      },
      {
        title: '代码实现',
        content: (
          <div className="space-y-4">
            <CodeExample lang="cpp" code={`// 插入排序
void insertSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];  // 待插入的元素
        int j = i - 1;
        // 将比key大的元素后移
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;  // 插入到正确位置
    }
}`} />
            <TipBox type="tip">
              <strong>适用场景：</strong>数据量小、基本有序时效率很高！
            </TipBox>
          </div>
        ),
      },
    ],
  },
  'sort/quick': {
    title: '快速排序',
    category: '排序',
    duration: '40分钟',
    demoLink: '/algorithms/sort-quick',
    sections: [
      {
        title: '快速排序原理',
        content: (
          <div className="space-y-4">
            <KnowledgeCard title="⚡ 快速排序 = 分治思想" color="rose">
              <p>选择一个<strong>基准元素</strong>，将数组分成两部分：小于基准的在左，大于基准的在右，然后递归排序。</p>
            </KnowledgeCard>
            <StepList steps={[
              { title: '选择基准', desc: '通常是第一个或中间元素' },
              { title: '分区操作', desc: '小于基准的放左边，大于基准的放右边' },
              { title: '递归排序', desc: '对左右两部分进行快速排序' },
              { title: '完成', desc: '原地完成，不需要额外合并操作' },
            ]} />
            <CompareTable
              headers={['复杂度', '值', '说明']}
              rows={[
                ['时间(平均)', 'O(n log n)', '每次分成两半'],
                ['时间(最坏)', 'O(n²)', '已有序时退化'],
                ['空间', 'O(log n)', '递归栈深度'],
                ['稳定性', '不稳定', '分区时可能打乱顺序'],
              ]}
            />
          </div>
        ),
      },
      {
        title: '代码实现',
        content: (
          <div className="space-y-4">
            <CodeExample lang="cpp" code={`// 快速排序
void quickSort(int arr[], int low, int high) {
    if (low >= high) return;
    
    // 分区
    int pivot = arr[low];  // 选择第一个作为基准
    int i = low, j = high;
    while (i < j) {
        while (i < j && arr[j] >= pivot) j--;  // 从右找小于基准的
        arr[i] = arr[j];
        while (i < j && arr[i] <= pivot) i++;  // 从左找大于基准的
        arr[j] = arr[i];
    }
    arr[i] = pivot;  // 基准放到最终位置
    
    // 递归排序左右两部分
    quickSort(arr, low, i - 1);
    quickSort(arr, i + 1, high);
}`} />
            <TipBox type="important">
              <strong>优化技巧：</strong><br/>
              1. 三数取中法选基准，避免最坏情况<br/>
              2. 小数组时切换到插入排序<br/>
              3. 尾递归优化减少栈深度
            </TipBox>
          </div>
        ),
      },
    ],
  },
  // ========== 线性表 ==========
};

