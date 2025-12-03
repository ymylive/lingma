import TutorialPanel, { KnowledgeCard, StepList, CompareTable, CodeExample, TipBox, QuizQuestion } from './TutorialPanel';

export default function SortTutorial() {
  const sections = [
    {
      title: '排序基础',
      icon: '📖',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">什么是排序？</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              排序是将一组数据按照<strong>特定规则</strong>（如升序或降序）重新排列的过程。
              排序算法是计算机科学中最基础也是最重要的算法之一。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <KnowledgeCard title="📊 评价指标" color="indigo">
              <ul className="space-y-1">
                <li><strong>时间复杂度</strong>：执行所需时间</li>
                <li><strong>空间复杂度</strong>：额外内存使用</li>
                <li><strong>稳定性</strong>：相等元素相对位置是否改变</li>
              </ul>
            </KnowledgeCard>

            <KnowledgeCard title="⚖️ 稳定性说明" color="emerald">
              <p>稳定排序：相等元素的相对顺序保持不变</p>
              <p className="mt-2">例：排序前 [3a, 2, 3b, 1]</p>
              <p>稳定结果：[1, 2, 3a, 3b]</p>
              <p>不稳定可能：[1, 2, 3b, 3a]</p>
            </KnowledgeCard>
          </div>

          <TipBox type="tip">
            <strong>稳定性什么时候重要？</strong>
            当需要对多个字段排序时。例如先按成绩排，再按姓名排，如果第二次排序不稳定，会打乱第一次的结果。
          </TipBox>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-3">排序算法分类</h3>
          <CompareTable
            headers={['类别', '算法', '特点']}
            rows={[
              ['交换排序', '冒泡、快速', '通过交换相邻或远距离元素'],
              ['选择排序', '简单选择、堆', '每次选出最值放到正确位置'],
              ['插入排序', '直接插入、希尔', '将元素插入已排序序列'],
              ['归并排序', '二路归并', '分治思想，先分后合'],
            ]}
          />
        </div>
      ),
    },
    {
      title: '冒泡排序',
      icon: '🫧',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">冒泡排序原理</h3>
            <p className="text-slate-600 mb-4">
              重复遍历数组，每次比较相邻元素，如果顺序错误就交换。
              每轮遍历会把当前最大的元素"冒泡"到末尾。
            </p>

            <StepList steps={[
              { title: '外层循环', desc: '控制排序轮数，共需 n-1 轮' },
              { title: '内层循环', desc: '每轮从头比较相邻元素' },
              { title: '比较交换', desc: '如果前 > 后，交换两元素' },
              { title: '确定最值', desc: '每轮结束，最大值到达末尾' },
            ]} />
          </div>

          <CodeExample lang="cpp" code={`void bubbleSort(int a[], int n) {
    for (int i = 0; i < n - 1; i++) {       // n-1轮
        bool swapped = false;                // 优化：检测是否有交换
        for (int j = 0; j < n - 1 - i; j++) { // 每轮比较n-1-i次
            if (a[j] > a[j + 1]) {
                swap(a[j], a[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;  // 没有交换说明已经有序
    }
}`} />

          <div className="grid md:grid-cols-3 gap-4">
            <KnowledgeCard title="⏱️ 时间" color="indigo">
              <p>最好：O(n) 已有序</p>
              <p>最坏：O(n²) 逆序</p>
              <p>平均：O(n²)</p>
            </KnowledgeCard>
            <KnowledgeCard title="💾 空间" color="emerald">
              <p>O(1)</p>
              <p>原地排序</p>
            </KnowledgeCard>
            <KnowledgeCard title="⚖️ 稳定性" color="amber">
              <p>稳定</p>
              <p>相等元素不交换</p>
            </KnowledgeCard>
          </div>

          <TipBox type="tip">
            <strong>优化技巧：</strong>添加标志位，如果某轮没有发生交换，说明数组已有序，可以提前结束。
          </TipBox>
        </div>
      ),
    },
    {
      title: '快速排序',
      icon: '⚡',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">快速排序原理</h3>
            <p className="text-slate-600 mb-4">
              采用<strong>分治思想</strong>：选择一个基准元素(pivot)，将数组分成两部分，
              左边都小于pivot，右边都大于pivot，然后递归排序两部分。
            </p>

            <StepList steps={[
              { title: '选择基准', desc: '通常选第一个、最后一个或随机元素' },
              { title: '分区操作', desc: '小于pivot的放左边，大于的放右边' },
              { title: 'pivot归位', desc: '将pivot放到最终正确位置' },
              { title: '递归处理', desc: '对左右两部分递归执行以上步骤' },
            ]} />
          </div>

          <CodeExample lang="cpp" code={`int partition(int a[], int low, int high) {
    int pivot = a[high];  // 选最后一个为基准
    int i = low - 1;      // i指向小于pivot区域的最后
    
    for (int j = low; j < high; j++) {
        if (a[j] < pivot) {
            i++;
            swap(a[i], a[j]);  // 把小的换到左边
        }
    }
    swap(a[i + 1], a[high]);   // pivot放到正确位置
    return i + 1;               // 返回pivot位置
}

void quickSort(int a[], int low, int high) {
    if (low < high) {
        int pi = partition(a, low, high);
        quickSort(a, low, pi - 1);   // 排左边
        quickSort(a, pi + 1, high);  // 排右边
    }
}`} />

          <div className="grid md:grid-cols-3 gap-4">
            <KnowledgeCard title="⏱️ 时间" color="indigo">
              <p>最好：O(n log n)</p>
              <p>最坏：O(n²) 已有序</p>
              <p>平均：O(n log n)</p>
            </KnowledgeCard>
            <KnowledgeCard title="💾 空间" color="emerald">
              <p>O(log n)</p>
              <p>递归栈空间</p>
            </KnowledgeCard>
            <KnowledgeCard title="⚖️ 稳定性" color="rose">
              <p>不稳定</p>
              <p>分区时可能改变相对顺序</p>
            </KnowledgeCard>
          </div>

          <TipBox type="warning">
            <strong>最坏情况：</strong>当数组已经有序或基本有序时，每次partition只能减少一个元素，
            退化为O(n²)。解决方法：随机选择pivot或三数取中。
          </TipBox>
        </div>
      ),
    },
    {
      title: '算法对比',
      icon: '📊',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-800 mb-3">各排序算法对比</h3>
          
          <CompareTable
            headers={['算法', '最好', '平均', '最坏', '空间', '稳定']}
            rows={[
              ['冒泡排序', 'O(n)', 'O(n²)', 'O(n²)', 'O(1)', '✓'],
              ['选择排序', 'O(n²)', 'O(n²)', 'O(n²)', 'O(1)', '✗'],
              ['插入排序', 'O(n)', 'O(n²)', 'O(n²)', 'O(1)', '✓'],
              ['希尔排序', 'O(n log n)', 'O(n^1.3)', 'O(n²)', 'O(1)', '✗'],
              ['快速排序', 'O(n log n)', 'O(n log n)', 'O(n²)', 'O(log n)', '✗'],
              ['归并排序', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)', '✓'],
              ['堆排序', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'O(1)', '✗'],
            ]}
          />

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-3">如何选择排序算法？</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <KnowledgeCard title="📏 数据规模小 (n < 50)" color="indigo">
              <p>推荐：<strong>插入排序</strong></p>
              <p>原因：常数因子小，对小规模数据效率高</p>
            </KnowledgeCard>

            <KnowledgeCard title="📊 数据基本有序" color="emerald">
              <p>推荐：<strong>插入排序</strong>或<strong>冒泡排序</strong></p>
              <p>原因：最好情况 O(n)，能充分利用已有序性</p>
            </KnowledgeCard>

            <KnowledgeCard title="🔢 数据规模大" color="amber">
              <p>推荐：<strong>快速排序</strong>或<strong>归并排序</strong></p>
              <p>原因：平均 O(n log n)，大规模数据效率显著</p>
            </KnowledgeCard>

            <KnowledgeCard title="⚖️ 需要稳定性" color="rose">
              <p>推荐：<strong>归并排序</strong></p>
              <p>原因：O(n log n) 且稳定，但需要额外空间</p>
            </KnowledgeCard>
          </div>

          <TipBox type="important">
            <strong>实际应用：</strong>很多语言的标准库使用混合排序，如 Timsort（Python、Java）
            结合了归并排序和插入排序的优点。
          </TipBox>
        </div>
      ),
    },
    {
      title: '练习题',
      icon: '✏️',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-800 mb-3">巩固练习</h3>

          <QuizQuestion
            question="1. 对于已经基本有序的数组，哪种排序算法最高效？"
            options={[
              '快速排序',
              '插入排序',
              '选择排序',
              '堆排序',
            ]}
            answer={1}
            explanation="插入排序在基本有序的情况下接近 O(n)，因为每个元素只需要和前面少量元素比较。而快速排序可能退化到 O(n²)。"
          />

          <QuizQuestion
            question="2. 下列哪种排序算法是不稳定的？"
            options={[
              '冒泡排序',
              '插入排序',
              '归并排序',
              '快速排序',
            ]}
            answer={3}
            explanation="快速排序在分区过程中可能改变相等元素的相对位置，因此是不稳定的。冒泡、插入、归并排序都是稳定的。"
          />

          <QuizQuestion
            question="3. 快速排序的平均空间复杂度是？"
            options={[
              'O(1)',
              'O(log n)',
              'O(n)',
              'O(n log n)',
            ]}
            answer={1}
            explanation="快速排序需要递归调用栈空间，平均情况下递归深度为 log n，所以空间复杂度是 O(log n)。"
          />

          <QuizQuestion
            question="4. 对 [5, 3, 8, 3, 2] 进行一轮冒泡排序后的结果是？"
            options={[
              '[3, 5, 3, 2, 8]',
              '[3, 3, 5, 2, 8]',
              '[2, 3, 3, 5, 8]',
              '[3, 5, 8, 2, 3]',
            ]}
            answer={0}
            explanation="冒泡排序一轮：5>3交换→[3,5,8,3,2]，5<8不换，8>3交换→[3,5,3,8,2]，8>2交换→[3,5,3,2,8]。最大值8冒到末尾。"
          />
        </div>
      ),
    },
  ];

  return <TutorialPanel title="排序算法" sections={sections} />;
}
