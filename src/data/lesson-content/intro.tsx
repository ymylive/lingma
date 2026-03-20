import type { LessonContent } from './types';
import {
  KnowledgeCard,
  StepList,
  CompareTable,
  CodeExample,
  TipBox,
} from '../../components/tutorials/TutorialPanel';

/* eslint-disable no-irregular-whitespace */

export const introLessons: Record<string, LessonContent> = {
  'intro/what-is-ds': {
    title: '什么是数据结构',
    category: '绑论',
    duration: '15分钟',
    demoLink: '/algorithms/sequence',
    sections: [
      {
        title: '用生活例子理解数据结构',
        content: (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
              <h4 className="text-lg font-bold text-indigo-800 mb-3">🏠 想象你要整理房间...</h4>
              <p className="text-slate-600 leading-relaxed mb-4">
                假设你有100本书要存放，你会怎么做？
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl mb-2">📚</div>
                  <p className="font-medium text-slate-800">方案A：随便堆</p>
                  <p className="text-slate-500 mt-1">找书时要翻遍所有书，很慢！</p>
                  <p className="text-rose-600 mt-2 text-xs">❌ 效率：O(n)</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl mb-2">🗂️</div>
                  <p className="font-medium text-slate-800">方案B：按字母排序</p>
                  <p className="text-slate-500 mt-1">二分查找，很快找到！</p>
                  <p className="text-emerald-600 mt-2 text-xs">✓ 效率：O(log n)</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl mb-2">🏷️</div>
                  <p className="font-medium text-slate-800">方案C：建索引目录</p>
                  <p className="text-slate-500 mt-1">直接查目录，瞬间找到！</p>
                  <p className="text-emerald-600 mt-2 text-xs">✓ 效率：O(1)</p>
                </div>
              </div>
            </div>
            <TipBox type="tip">
              <strong>这就是数据结构的意义！</strong><br/>
              同样的数据，不同的组织方式，带来天壤之别的效率。<br/>
              <strong>数据结构 = 数据的"收纳术"</strong>
            </TipBox>
          </div>
        ),
      },
      {
        title: '四种基本结构（配生活例子）',
        content: (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <KnowledgeCard title="� 线性结构" color="indigo">
                <p className="mb-2"><strong>生活例子：</strong>排队买奶茶</p>
                <p className="text-sm text-slate-500">每个人只有一个"前面的人"和一个"后面的人"</p>
                <div className="mt-2 flex items-center gap-1 text-lg">
                  <span>🧑</span><span>→</span><span>👨</span><span>→</span><span>👩</span><span>→</span><span>🧓</span>
                </div>
                <p className="text-xs text-indigo-600 mt-2">代表：数组、链表、栈、队列</p>
              </KnowledgeCard>
              <KnowledgeCard title="🌳 树形结构" color="emerald">
                <p className="mb-2"><strong>生活例子：</strong>公司组织架构</p>
                <p className="text-sm text-slate-500">一个老板管多个经理，经理管多个员工</p>
                <div className="mt-2 text-center text-lg">
                  <div>👔</div>
                  <div>╱  ╲</div>
                  <div>👨‍💼   👩‍💼</div>
                </div>
                <p className="text-xs text-emerald-600 mt-2">代表：二叉树、B树、堆</p>
              </KnowledgeCard>
              <KnowledgeCard title="🕸️ 图结构" color="amber">
                <p className="mb-2"><strong>生活例子：</strong>微信好友关系</p>
                <p className="text-sm text-slate-500">你的好友可能也是你其他好友的好友（多对多）</p>
                <div className="mt-2 text-center text-lg">
                  <span>👤</span><span>━━</span><span>👤</span><br/>
                  <span> ╲ </span><span>　</span><span>╱ </span><br/>
                  <span>　</span><span>👤</span><span>　</span>
                </div>
                <p className="text-xs text-amber-600 mt-2">代表：邻接矩阵、邻接表</p>
              </KnowledgeCard>
              <KnowledgeCard title="📦 集合结构" color="rose">
                <p className="mb-2"><strong>生活例子：</strong>一袋弹珠</p>
                <p className="text-sm text-slate-500">弹珠之间没有特定关系，只是放在一起</p>
                <div className="mt-2 flex items-center justify-center gap-1 text-lg">
                  <span>🔴</span><span>🔵</span><span>🟢</span><span>🟡</span>
                </div>
                <p className="text-xs text-rose-600 mt-2">代表：哈希表、并查集</p>
              </KnowledgeCard>
            </div>
          </div>
        ),
      },
      {
        title: '为什么程序员必须学数据结构',
        content: (
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-xl p-6 text-white">
              <h4 className="text-lg font-bold mb-4">🎯 一个真实的面试题</h4>
              <p className="text-slate-300 mb-4">
                "给你10亿个手机号码，如何快速判断一个号码是否存在？"
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-rose-900/30 rounded-lg p-4">
                  <p className="font-medium text-rose-300">❌ 错误答案：遍历查找</p>
                  <p className="text-slate-400 mt-1">10亿次比较，等到天荒地老</p>
                </div>
                <div className="bg-emerald-900/30 rounded-lg p-4">
                  <p className="font-medium text-emerald-300">✓ 正确答案：布隆过滤器/哈希</p>
                  <p className="text-slate-400 mt-1">O(1)常数时间，瞬间返回</p>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <KnowledgeCard title="🚀 性能提升1000倍" color="indigo">
                <p>选对数据结构，从等1小时变成等1秒</p>
              </KnowledgeCard>
              <KnowledgeCard title="� 大厂面试必考" color="emerald">
                <p>BAT、字节、美团面试必问数据结构</p>
              </KnowledgeCard>
              <KnowledgeCard title="🧠 编程思维基础" color="amber">
                <p>是算法的基石，学会后刷题事半功倍</p>
              </KnowledgeCard>
            </div>
            <TipBox type="important">
              <strong>程序 = 数据结构 + 算法</strong><br/>
              数据结构决定了"数据怎么存"，算法决定了"数据怎么算"。<br/>
              两者缺一不可，这是所有编程的底层逻辑！
            </TipBox>
          </div>
        ),
      },
    ],
  },
  'intro/algorithm': {
    title: '算法与算法分析',
    category: '绑论',
    duration: '20分钟',
    demoLink: '/algorithms/sort-bubble',
    sections: [
      {
        title: '什么是算法',
        content: (
          <div className="space-y-4">
            <KnowledgeCard title="📋 算法的定义" color="indigo">
              <p className="mb-2">算法是解决特定问题的<strong>有限步骤</strong>的精确描述。</p>
              <p className="text-sm text-slate-500">就像做菜的菜谱、组装家具的说明书一样，算法告诉计算机"怎么做"。</p>
            </KnowledgeCard>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-6 dark:from-emerald-950/40 dark:to-teal-950/30 dark:border-emerald-800/60">
              <h4 className="text-lg font-bold text-emerald-800 mb-3 dark:text-emerald-200">🍳 用"炒鸡蛋"理解算法</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white dark:bg-slate-900/70 rounded-lg p-4">
                  <p className="font-medium text-slate-800 mb-2">炒鸡蛋的"算法"：</p>
                  <ol className="list-decimal list-inside text-slate-600 dark:text-slate-300 space-y-1">
                    <li>打鸡蛋到碗里</li>
                    <li>加盐搅拌均匀</li>
                    <li>热锅加油</li>
                    <li>倒入蛋液翻炒</li>
                    <li>出锅装盘</li>
                  </ol>
                </div>
                <div className="bg-white dark:bg-slate-900/70 rounded-lg p-4">
                  <p className="font-medium text-slate-800 mb-2">这就是算法！</p>
                  <ul className="text-slate-600 dark:text-slate-300 space-y-1 text-sm">
                    <li>✓ 有限步骤（5步）</li>
                    <li>✓ 每步明确（不含糊）</li>
                    <li>✓ 有输入（鸡蛋、盐、油）</li>
                    <li>✓ 有输出（炒鸡蛋）</li>
                    <li>✓ 可行的（能实际执行）</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: '算法的五大特性',
        content: (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <KnowledgeCard title="1️⃣ 有穷性" color="indigo">
                <p className="text-sm">算法必须在有限步骤后结束</p>
                <p className="text-xs text-slate-500 mt-2">❌ 反例：while(true) 死循环</p>
              </KnowledgeCard>
              <KnowledgeCard title="2️⃣ 确定性" color="emerald">
                <p className="text-sm">每一步都有明确含义，无歧义</p>
                <p className="text-xs text-slate-500 mt-2">❌ 反例：加"适量"的盐</p>
              </KnowledgeCard>
              <KnowledgeCard title="3️⃣ 可行性" color="amber">
                <p className="text-sm">每步都能实际执行</p>
                <p className="text-xs text-slate-500 mt-2">❌ 反例：把大象装冰箱</p>
              </KnowledgeCard>
              <KnowledgeCard title="4️⃣ 输入" color="rose">
                <p className="text-sm">有零个或多个输入</p>
                <p className="text-xs text-slate-500 mt-2">可以没有输入（如打印Hello）</p>
              </KnowledgeCard>
              <KnowledgeCard title="5️⃣ 输出" color="indigo">
                <p className="text-sm">有一个或多个输出</p>
                <p className="text-xs text-slate-500 mt-2">必须有输出，否则没意义</p>
              </KnowledgeCard>
            </div>
            <TipBox type="tip">
              <strong>记忆口诀：</strong>有穷确定可行性，输入输出要分明！
            </TipBox>
          </div>
        ),
      },
      {
        title: '好算法的标准',
        content: (
          <div className="space-y-4">
            <CompareTable
              headers={['评价标准', '含义', '重要程度']}
              rows={[
                ['正确性', '算法能正确解决问题', '⭐⭐⭐⭐⭐ 必须'],
                ['可读性', '代码易于理解和维护', '⭐⭐⭐⭐ 很重要'],
                ['健壮性', '能处理异常输入不崩溃', '⭐⭐⭐⭐ 很重要'],
                ['时间效率', '运行速度快', '⭐⭐⭐ 重要'],
                ['空间效率', '占用内存少', '⭐⭐⭐ 重要'],
              ]}
            />
            <div className="bg-slate-800 rounded-xl p-6 text-white">
              <h4 className="text-lg font-bold mb-3">💡 算法设计的权衡</h4>
              <p className="text-slate-300 text-sm mb-3">时间和空间往往不能兼得：</p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-700 rounded-lg p-3">
                  <p className="text-emerald-400 font-medium">空间换时间</p>
                  <p className="text-slate-400">哈希表、缓存、动态规划</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-3">
                  <p className="text-amber-400 font-medium">时间换空间</p>
                  <p className="text-slate-400">原地排序、流式处理</p>
                </div>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
  'intro/time-complexity': {
    title: '时间复杂度',
    category: '绑论',
    duration: '30分钟',
    demoLink: '/algorithms/sort-bubble',
    sections: [
      {
        title: '用"找人"的例子理解时间复杂度',
        content: (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 p-6 dark:from-amber-950/40 dark:to-orange-950/30 dark:border-amber-800/60">
              <h4 className="text-lg font-bold text-amber-800 mb-3 dark:text-amber-200">🏫 假设你要在学校里找一个人...</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white dark:bg-slate-900/70 rounded-lg p-4">
                  <div className="text-2xl mb-2">🔍 方法A：挨个问</div>
                  <p className="text-slate-600">从第1个人问到第n个人</p>
                  <p className="text-slate-500 mt-2">学校有1000人 → 最多问1000次</p>
                  <p className="text-indigo-600 font-medium mt-2">时间复杂度：O(n)</p>
                </div>
                <div className="bg-white dark:bg-slate-900/70 rounded-lg p-4">
                  <div className="text-2xl mb-2">📋 方法B：查花名册</div>
                  <p className="text-slate-600">按名字排序，二分查找</p>
                  <p className="text-slate-500 mt-2">学校有1000人 → 最多问10次</p>
                  <p className="text-emerald-600 font-medium mt-2">时间复杂度：O(log n)</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-indigo-100 rounded-lg">
                <p className="text-indigo-800">
                  <strong>💡 时间复杂度的本质：</strong><br/>
                  不是计算具体要多少秒，而是研究"当数据量翻倍时，时间会怎么变"
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: '常见复杂度的"速度感"',
        content: (
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-xl p-6 text-white">
              <h4 className="font-bold mb-4">⏱️ 假设电脑每秒执行1亿次操作，处理n=10亿数据需要多久？</h4>
              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="bg-emerald-900/40 rounded-lg p-4">
                  <p className="text-emerald-300 font-bold text-lg">O(1)</p>
                  <p className="text-emerald-200">0.00000001秒</p>
                  <p className="text-slate-400 mt-1">眨眼都嫌慢 ⚡</p>
                </div>
                <div className="bg-emerald-900/40 rounded-lg p-4">
                  <p className="text-emerald-300 font-bold text-lg">O(log n)</p>
                  <p className="text-emerald-200">0.0000003秒</p>
                  <p className="text-slate-400 mt-1">闪电般快 ⚡</p>
                </div>
                <div className="bg-blue-900/40 rounded-lg p-4">
                  <p className="text-blue-300 font-bold text-lg">O(n)</p>
                  <p className="text-blue-200">10秒</p>
                  <p className="text-slate-400 mt-1">喝口水的功夫 ☕</p>
                </div>
                <div className="bg-amber-900/40 rounded-lg p-4">
                  <p className="text-amber-300 font-bold text-lg">O(n log n)</p>
                  <p className="text-amber-200">5分钟</p>
                  <p className="text-slate-400 mt-1">泡杯茶 🍵</p>
                </div>
                <div className="bg-rose-900/40 rounded-lg p-4">
                  <p className="text-rose-300 font-bold text-lg">O(n²)</p>
                  <p className="text-rose-200">317年</p>
                  <p className="text-slate-400 mt-1">等不起！💀</p>
                </div>
                <div className="bg-rose-900/40 rounded-lg p-4">
                  <p className="text-rose-300 font-bold text-lg">O(2ⁿ)</p>
                  <p className="text-rose-200">宇宙毁灭×N</p>
                  <p className="text-slate-400 mt-1">不可能完成 🌌</p>
                </div>
              </div>
            </div>
            <TipBox type="important">
              <strong>记住这个排序（从快到慢）：</strong><br/>
              O(1) → O(log n) → O(n) → O(n log n) → O(n²) → O(2ⁿ)<br/>
              面试常考！选择算法时优先选复杂度低的！
            </TipBox>
          </div>
        ),
      },
      {
        title: '三步学会计算时间复杂度',
        content: (
          <div className="space-y-4">
            <StepList steps={[
              { title: '第1步：找循环', desc: '看代码有几层循环，循环几次' },
              { title: '第2步：算次数', desc: '把循环次数用n表示出来' },
              { title: '第3步：只留最大', desc: '去掉常数和小项，只留最高次' },
            ]} />
            <div className="bg-slate-50 rounded-xl p-6">
              <h4 className="font-bold text-slate-800 mb-4">📝 举例说明</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="font-medium text-emerald-600 mb-2">O(1) - 没有循环</p>
                  <pre className="overflow-x-auto rounded bg-slate-100 p-3 text-xs leading-6 sm:text-sm">{'int x = arr[5];  // 直接访问'}</pre>
                  <p className="text-xs text-slate-500 mt-2">不管数组多大，都只执行1次</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="font-medium text-blue-600 mb-2">O(n) - 一层循环</p>
                  <pre className="overflow-x-auto rounded bg-slate-100 p-3 text-xs leading-6 sm:text-sm">{'for(i=0; i<n; i++)\n  sum += arr[i];'}</pre>
                  <p className="text-xs text-slate-500 mt-2">数组有n个元素，循环n次</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="font-medium text-amber-600 mb-2">O(n²) - 两层循环</p>
                  <pre className="overflow-x-auto rounded bg-slate-100 p-3 text-xs leading-6 sm:text-sm">{'for(i=0; i<n; i++)\n  for(j=0; j<n; j++)\n    count++;'}</pre>
                  <p className="text-xs text-slate-500 mt-2">外层n次×内层n次 = n²次</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="font-medium text-purple-600 mb-2">O(log n) - 每次减半</p>
                  <pre className="overflow-x-auto rounded bg-slate-100 p-3 text-xs leading-6 sm:text-sm">{'while(n > 1)\n  n = n / 2;'}</pre>
                  <p className="text-xs text-slate-500 mt-2">1024→512→256→...→1，共10次</p>
                </div>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
  'intro/space-complexity': {
    title: '空间复杂度',
    category: '绑论',
    duration: '20分钟',
    demoLink: '/algorithms/stack-sequence',
    sections: [
      {
        title: '什么是空间复杂度',
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              空间复杂度是衡量算法运行过程中<strong>额外占用存储空间</strong>随输入规模增长的变化趋势。
              同样用大O表示法。
            </p>
            <KnowledgeCard title="📦 空间开销组成" color="indigo">
              <ul className="list-disc list-inside space-y-1">
                <li><strong>输入数据</strong>：存储输入本身的空间（通常不计入）</li>
                <li><strong>程序本身</strong>：存储代码的空间（通常不计入）</li>
                <li><strong>辅助空间</strong>：算法运行中额外开辟的空间（计入！）</li>
              </ul>
            </KnowledgeCard>
          </div>
        ),
      },
      {
        title: '常见空间复杂度',
        content: (
          <div className="space-y-4">
            <CompareTable
              headers={['复杂度', '说明', '示例']}
              rows={[
                ['O(1)', '原地算法，只用常数个变量', '冒泡排序、选择排序'],
                ['O(n)', '需要与n成正比的额外空间', '归并排序、哈希表'],
                ['O(log n)', '递归调用栈深度', '快速排序（平均）'],
                ['O(n²)', '需要n×n的二维数组', '邻接矩阵存图'],
              ]}
            />
            <CodeExample lang="cpp" code={`// O(1) 空间
void swap(int &a, int &b) {
    int temp = a;  // 只用1个变量
    a = b;
    b = temp;
}

// O(n) 空间
int* copy = new int[n];  // 额外开辟n个空间

// O(log n) 空间（递归栈）
void quickSort(int a[], int l, int r) {
    if (l < r) {
        int p = partition(a, l, r);
        quickSort(a, l, p-1);   // 递归
        quickSort(a, p+1, r);   // 栈深度log n
    }
}`} />
          </div>
        ),
      },
      {
        title: '时间与空间的权衡',
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              很多时候，可以用空间换时间，或用时间换空间。需要根据实际情况做出权衡。
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <KnowledgeCard title="🚀 空间换时间" color="emerald">
                <p><strong>哈希表</strong>：用O(n)空间，换取O(1)查找</p>
                <p><strong>缓存</strong>：存储计算结果，避免重复计算</p>
                <p><strong>动态规划</strong>：用表格存储子问题答案</p>
              </KnowledgeCard>
              <KnowledgeCard title="💾 时间换空间" color="amber">
                <p><strong>压缩算法</strong>：花时间压缩，节省存储</p>
                <p><strong>外部排序</strong>：内存不够时分批处理</p>
                <p><strong>流式处理</strong>：不存储全部数据</p>
              </KnowledgeCard>
            </div>
            <TipBox type="important">
              现代计算机内存相对充足，通常优先考虑时间复杂度。但处理大数据时，空间复杂度同样重要。
            </TipBox>
          </div>
        ),
      },
    ],
  },
};

