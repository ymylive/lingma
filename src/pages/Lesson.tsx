import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { getAdjacentTopics, curriculum } from '../data/curriculum';
import { allExercises } from '../data/exercises';
import { 
  KnowledgeCard, 
  StepList, 
  CompareTable, 
  CodeExample, 
  TipBox, 
  MultiLangCode, 
  DemoLink,
  Diagram,
  DifficultyBadge,
  CodingExercise,
  FillInBlank
} from '../components/tutorials/TutorialPanel';

interface LessonContent {
  title: string;
  category: string;
  duration: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  demoLink?: string;
  sections: {
    title: string;
    content: React.ReactNode;
  }[];
}

const lessons: Record<string, LessonContent> = {
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
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
              <h4 className="text-lg font-bold text-emerald-800 mb-3">🍳 用"炒鸡蛋"理解算法</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded-lg p-4">
                  <p className="font-medium text-slate-800 mb-2">炒鸡蛋的"算法"：</p>
                  <ol className="list-decimal list-inside text-slate-600 space-y-1">
                    <li>打鸡蛋到碗里</li>
                    <li>加盐搅拌均匀</li>
                    <li>热锅加油</li>
                    <li>倒入蛋液翻炒</li>
                    <li>出锅装盘</li>
                  </ol>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="font-medium text-slate-800 mb-2">这就是算法！</p>
                  <ul className="text-slate-600 space-y-1 text-sm">
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
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
              <h4 className="text-lg font-bold text-amber-800 mb-3">🏫 假设你要在学校里找一个人...</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl mb-2">🔍 方法A：挨个问</div>
                  <p className="text-slate-600">从第1个人问到第n个人</p>
                  <p className="text-slate-500 mt-2">学校有1000人 → 最多问1000次</p>
                  <p className="text-indigo-600 font-medium mt-2">时间复杂度：O(n)</p>
                </div>
                <div className="bg-white rounded-lg p-4">
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
                  <pre className="text-sm bg-slate-100 p-3 rounded">{'int x = arr[5];  // 直接访问'}</pre>
                  <p className="text-xs text-slate-500 mt-2">不管数组多大，都只执行1次</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="font-medium text-blue-600 mb-2">O(n) - 一层循环</p>
                  <pre className="text-sm bg-slate-100 p-3 rounded">{'for(i=0; i<n; i++)\n  sum += arr[i];'}</pre>
                  <p className="text-xs text-slate-500 mt-2">数组有n个元素，循环n次</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="font-medium text-amber-600 mb-2">O(n²) - 两层循环</p>
                  <pre className="text-sm bg-slate-100 p-3 rounded">{'for(i=0; i<n; i++)\n  for(j=0; j<n; j++)\n    count++;'}</pre>
                  <p className="text-xs text-slate-500 mt-2">外层n次×内层n次 = n²次</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="font-medium text-purple-600 mb-2">O(log n) - 每次减半</p>
                  <pre className="text-sm bg-slate-100 p-3 rounded">{'while(n > 1)\n  n = n / 2;'}</pre>
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
  'search/binary': {
    title: '二分查找',
    category: '查找',
    duration: '25分钟',
    demoLink: '/algorithms/bst',
    sections: [
      {
        title: '算法原理',
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              二分查找是一种在<strong>有序数组</strong>中查找目标值的高效算法。
              每次比较中间元素，将搜索范围缩小一半，时间复杂度 O(log n)。
            </p>
            <StepList steps={[
              { title: '初始化', desc: '设置 left=0, right=n-1' },
              { title: '计算中点', desc: 'mid = (left + right) / 2' },
              { title: '比较', desc: '目标 < 中间值：right=mid-1；目标 > 中间值：left=mid+1' },
              { title: '重复', desc: '直到找到目标或 left > right' },
            ]} />
          </div>
        ),
      },
      {
        title: '代码实现',
        content: (
          <div className="space-y-4">
            <CodeExample lang="cpp" code={`int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;  // 防止溢出
        
        if (arr[mid] == target)
            return mid;           // 找到了
        else if (arr[mid] < target)
            left = mid + 1;       // 目标在右半边
        else
            right = mid - 1;      // 目标在左半边
    }
    
    return -1;  // 未找到
}`} />
            <TipBox type="warning">
              <strong>注意事项：</strong>
              1. 数组必须有序！
              2. mid = left + (right-left)/2 可防止整数溢出
              3. 循环条件是 left &lt;= right（等号很重要）
            </TipBox>
          </div>
        ),
      },
      {
        title: '复杂度分析',
        content: (
          <div className="space-y-4">
            <CompareTable
              headers={['指标', '二分查找', '顺序查找']}
              rows={[
                ['时间复杂度', 'O(log n)', 'O(n)'],
                ['空间复杂度', 'O(1)', 'O(1)'],
                ['前提条件', '有序', '无'],
                ['n=1000000', '~20次比较', '~500000次'],
              ]}
            />
            <TipBox type="tip">
              当 n = 10亿 时，二分查找最多只需要 30 次比较就能找到目标！
            </TipBox>
          </div>
        ),
      },
    ],
  },
  // ========== 图 ==========
  'graph/basics': {
    title: '图的基本概念',
    category: '图',
    duration: '25分钟',
    demoLink: '/algorithms/bfs',
    sections: [
      {
        title: '用社交网络理解"图"',
        content: (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
              <h4 className="text-lg font-bold text-blue-800 mb-3">📱 想象你的微信好友关系...</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-center mb-4">
                    <span className="text-3xl">👤</span>
                    <span className="text-slate-400 mx-2">━━━</span>
                    <span className="text-3xl">👤</span>
                    <span className="text-slate-400 mx-2">━━━</span>
                    <span className="text-3xl">👤</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    <strong>你</strong>有10个好友，<strong>你的好友A</strong>有20个好友，
                    其中5个也是<strong>你的好友</strong>...
                  </p>
                  <p className="text-sm text-blue-600 mt-2">这种"多对多"的复杂关系，就是图！</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="font-medium text-slate-800 mb-2">🔍 图的组成</p>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li>👤 <strong>顶点(Vertex)</strong> = 每个人</li>
                    <li>━━ <strong>边(Edge)</strong> = 好友关系</li>
                    <li>🌐 <strong>图(Graph)</strong> = 整个社交网络</li>
                  </ul>
                </div>
              </div>
            </div>
            <TipBox type="tip">
              <strong>图的威力：</strong>微信用图存储10亿用户的好友关系，抖音用图推荐你可能认识的人，
              高德用图计算最短路线。图是现实世界"关系"的最佳抽象！
            </TipBox>
          </div>
        ),
      },
      {
        title: '有向图 vs 无向图（用生活例子区分）',
        content: (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                <h4 className="font-bold text-emerald-800 mb-3">🤝 无向图：双向关系</h4>
                <div className="text-center my-4">
                  <span className="text-2xl">�</span>
                  <span className="text-emerald-500 mx-2">━━━</span>
                  <span className="text-2xl">👤</span>
                </div>
                <p className="text-sm text-slate-600 mb-2"><strong>例子：微信好友</strong></p>
                <p className="text-sm text-slate-500">你加我，我也有你。我们互为好友，关系是双向的。</p>
                <p className="text-xs text-emerald-600 mt-2">A是B的好友 ⟺ B是A的好友</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                <h4 className="font-bold text-amber-800 mb-3">👉 有向图：单向关系</h4>
                <div className="text-center my-4">
                  <span className="text-2xl">👤</span>
                  <span className="text-amber-500 mx-2">━━→</span>
                  <span className="text-2xl">👤</span>
                </div>
                <p className="text-sm text-slate-600 mb-2"><strong>例子：微博关注</strong></p>
                <p className="text-sm text-slate-500">你关注明星，但明星不一定关注你。关系是单向的。</p>
                <p className="text-xs text-amber-600 mt-2">A关注B ≠ B关注A</p>
              </div>
            </div>
            <div className="bg-slate-100 rounded-xl p-5">
              <h4 className="font-bold text-slate-800 mb-3">🗺️ 更多例子</h4>
              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <p className="font-medium">🚗 双向车道</p>
                  <p className="text-slate-500">无向图</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="font-medium">🚦 单行道</p>
                  <p className="text-slate-500">有向图</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="font-medium">📧 邮件</p>
                  <p className="text-slate-500">有向图（发给谁）</p>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: '度、路径、连通（图解说明）',
        content: (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <KnowledgeCard title="📊 度 = 有几个好友" color="indigo">
                <p className="mb-2">一个顶点连接的边数</p>
                <div className="bg-indigo-50 rounded p-3 text-sm">
                  <p>你有10个微信好友 → 你的度=10</p>
                  <p className="text-slate-500 mt-1">有向图分：入度（被关注）+ 出度（关注别人）</p>
                </div>
              </KnowledgeCard>
              <KnowledgeCard title="🛤️ 路径 = 怎么找到TA" color="emerald">
                <p className="mb-2">从一点到另一点经过的边</p>
                <div className="bg-emerald-50 rounded p-3 text-sm">
                  <p>你→张三→李四→王五</p>
                  <p className="text-slate-500 mt-1">这是一条从你到王五的路径，长度=3</p>
                </div>
              </KnowledgeCard>
              <KnowledgeCard title="🔄 环 = 绕一圈回来" color="amber">
                <p className="mb-2">起点和终点相同的路径</p>
                <div className="bg-amber-50 rounded p-3 text-sm">
                  <p>你→张三→李四→你</p>
                  <p className="text-slate-500 mt-1">这是一个环（回到自己）</p>
                </div>
              </KnowledgeCard>
              <KnowledgeCard title="🌐 连通 = 都能联系上" color="rose">
                <p className="mb-2">任意两点之间都有路径</p>
                <div className="bg-rose-50 rounded p-3 text-sm">
                  <p>六度分隔理论：任何两个人之间</p>
                  <p className="text-slate-500 mt-1">最多通过6个人就能认识</p>
                </div>
              </KnowledgeCard>
            </div>
          </div>
        ),
      },
    ],
  },
  'graph/storage': {
    title: '图的存储结构',
    category: '图',
    duration: '35分钟',
    demoLink: '/algorithms/dfs',
    sections: [
      {
        title: '邻接矩阵',
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              用一个二维数组来表示图。若顶点i和j之间有边，则A[i][j]=1（或边的权值），否则为0或∞。
            </p>
            <CodeExample lang="cpp" code={`// 邻接矩阵存储
#define MaxV 100
int graph[MaxV][MaxV];  // 邻接矩阵
int n;  // 顶点数

// 初始化
void init() {
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            graph[i][j] = (i == j) ? 0 : INF;
}

// 添加边 (无向图)
void addEdge(int u, int v, int w) {
    graph[u][v] = w;
    graph[v][u] = w;  // 无向图对称
}`} />
            <div className="grid md:grid-cols-2 gap-4">
              <KnowledgeCard title="✅ 优点" color="emerald">
                <ul className="list-disc list-inside space-y-1">
                  <li>判断两点是否相邻：O(1)</li>
                  <li>实现简单直观</li>
                  <li>适合稠密图</li>
                </ul>
              </KnowledgeCard>
              <KnowledgeCard title="❌ 缺点" color="rose">
                <ul className="list-disc list-inside space-y-1">
                  <li>空间复杂度 O(n²)</li>
                  <li>遍历所有边 O(n²)</li>
                  <li>稀疏图浪费空间</li>
                </ul>
              </KnowledgeCard>
            </div>
          </div>
        ),
      },
      {
        title: '邻接表',
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              为每个顶点建立一个单链表，存储所有与该顶点相邻的顶点。
            </p>
            <CodeExample lang="cpp" code={`// 邻接表存储
#include <vector>
using namespace std;

struct Edge {
    int to;      // 目标顶点
    int weight;  // 权值
};

vector<Edge> adj[MaxV];  // 邻接表

// 添加边
void addEdge(int u, int v, int w) {
    adj[u].push_back({v, w});
    adj[v].push_back({u, w});  // 无向图
}

// 遍历顶点u的所有邻居
for (auto& e : adj[u]) {
    int v = e.to;
    int w = e.weight;
    // 处理边 (u, v)
}`} />
            <div className="grid md:grid-cols-2 gap-4">
              <KnowledgeCard title="✅ 优点" color="emerald">
                <ul className="list-disc list-inside space-y-1">
                  <li>空间复杂度 O(V+E)</li>
                  <li>遍历邻居快</li>
                  <li>适合稀疏图</li>
                </ul>
              </KnowledgeCard>
              <KnowledgeCard title="❌ 缺点" color="rose">
                <ul className="list-disc list-inside space-y-1">
                  <li>判断两点相邻 O(度数)</li>
                  <li>需要额外指针空间</li>
                </ul>
              </KnowledgeCard>
            </div>
          </div>
        ),
      },
      {
        title: '如何选择',
        content: (
          <div className="space-y-4">
            <CompareTable
              headers={['操作', '邻接矩阵', '邻接表']}
              rows={[
                ['空间', 'O(V²)', 'O(V+E)'],
                ['判断(u,v)相邻', 'O(1)', 'O(度数)'],
                ['遍历所有边', 'O(V²)', 'O(V+E)'],
                ['添加边', 'O(1)', 'O(1)'],
                ['适用场景', '稠密图', '稀疏图'],
              ]}
            />
            <TipBox type="important">
              实际应用中，大部分图都是稀疏图（边数远小于V²），所以<strong>邻接表更常用</strong>。
              但如果需要频繁判断两点是否相邻，邻接矩阵更高效。
            </TipBox>
          </div>
        ),
      },
    ],
  },
  'graph/bfs': {
    title: '广度优先搜索 BFS',
    category: '图',
    duration: '40分钟',
    difficulty: 'medium',
    demoLink: '/algorithms/bfs',
    sections: [
      {
        title: '什么是BFS？从生活例子理解',
        content: (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <DifficultyBadge level="medium" />
              <DemoLink to="/algorithms/bfs" text="查看动画演示" />
            </div>
            <p className="text-slate-600 leading-relaxed text-base">
              想象你在一个房间里找钥匙。<strong>BFS的思路</strong>是：先检查离你最近的地方（桌子上、口袋里），
              都没有再检查稍远的地方（抽屉里、柜子上），然后更远的地方...
            </p>
            <Diagram title="BFS搜索过程示意">
              <div className="text-center font-mono text-sm">
                <div className="mb-2 text-indigo-600 font-bold">第1层：距离=1</div>
                <div className="flex justify-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-indigo-100 rounded">A</span>
                  <span>→</span>
                  <span className="px-3 py-1 bg-emerald-100 rounded">B</span>
                  <span className="px-3 py-1 bg-emerald-100 rounded">C</span>
                </div>
                <div className="mb-2 text-amber-600 font-bold">第2层：距离=2</div>
                <div className="flex justify-center gap-4">
                  <span className="px-3 py-1 bg-amber-100 rounded">D</span>
                  <span className="px-3 py-1 bg-amber-100 rounded">E</span>
                  <span className="px-3 py-1 bg-amber-100 rounded">F</span>
                </div>
              </div>
            </Diagram>
            <KnowledgeCard title="🌊 核心思想" color="indigo">
              <p className="text-base"><strong>一圈一圈向外扩展</strong>，就像往水里扔石头，波纹一层层向外扩散。</p>
              <p className="mt-2">先访问距离为1的所有节点，再访问距离为2的所有节点...</p>
            </KnowledgeCard>
          </div>
        ),
      },
      {
        title: 'BFS算法步骤详解',
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              BFS使用<strong>队列</strong>来记住"待访问"的节点。为什么用队列？因为队列是先进先出(FIFO)，
              保证了先发现的节点先被访问，从而实现"一层一层"的效果。
            </p>
            <StepList steps={[
              { title: '第1步：准备工作', desc: '创建一个队列，把起点放进去。创建一个visited数组，标记起点为"已访问"' },
              { title: '第2步：取出队首', desc: '从队列前面取出一个节点（这是当前要处理的节点）' },
              { title: '第3步：处理邻居', desc: '找到这个节点的所有邻居，如果邻居没被访问过，就标记并加入队列' },
              { title: '第4步：重复', desc: '回到第2步，直到队列变空，说明所有能到达的节点都访问完了' },
            ]} />
            <TipBox type="warning">
              <strong>为什么要标记"已访问"？</strong> 防止重复访问同一个节点，否则会陷入死循环！
              比如 A→B→A→B... 无限循环。
            </TipBox>
            <TipBox type="tip">
              <strong>BFS特点：</strong>在无权图中，BFS找到的路径一定是最短的！因为它按距离从近到远搜索。
            </TipBox>
          </div>
        ),
      },
      {
        title: '代码实现（三种语言）',
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 mb-4">
              下面是BFS的完整代码，点击切换不同编程语言：
            </p>
            <MultiLangCode 
              title="BFS广度优先搜索"
              codes={{
                cpp: `#include <queue>
#include <vector>
using namespace std;

const int MaxV = 100;
vector<int> adj[MaxV];  // 邻接表：adj[u]存储u的所有邻居
bool visited[MaxV];     // visited[u]=true表示u已被访问

void BFS(int start) {
    queue<int> q;           // 创建队列
    q.push(start);          // 起点入队
    visited[start] = true;  // 标记起点已访问
    
    while (!q.empty()) {    // 队列不空就继续
        int u = q.front();  // 取出队首节点
        q.pop();            // 出队
        
        cout << u << " ";   // 访问（打印）这个节点
        
        // 遍历u的所有邻居
        for (int v : adj[u]) {
            if (!visited[v]) {      // 如果邻居v没被访问过
                visited[v] = true;  // 标记为已访问
                q.push(v);          // 加入队列
            }
        }
    }
}`,
                java: `import java.util.*;

public class BFS {
    static List<Integer>[] adj;  // 邻接表
    static boolean[] visited;    // 访问标记
    
    static void bfs(int start) {
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(start);       // 起点入队
        visited[start] = true;    // 标记起点
        
        while (!queue.isEmpty()) {
            int u = queue.poll(); // 取出队首
            System.out.print(u + " ");
            
            // 遍历所有邻居
            for (int v : adj[u]) {
                if (!visited[v]) {
                    visited[v] = true;
                    queue.offer(v);
                }
            }
        }
    }
}`,
                python: `from collections import deque

def bfs(adj, start):
    """
    adj: 邻接表，adj[u]是u的邻居列表
    start: 起点
    """
    n = len(adj)
    visited = [False] * n  # 访问标记
    queue = deque()        # 创建队列
    
    queue.append(start)    # 起点入队
    visited[start] = True  # 标记起点
    
    result = []
    while queue:           # 队列不空就继续
        u = queue.popleft()  # 取出队首
        result.append(u)     # 访问这个节点
        
        for v in adj[u]:     # 遍历邻居
            if not visited[v]:
                visited[v] = True
                queue.append(v)
    
    return result`
              }}
            />
            <TipBox type="tip">
              <strong>代码逐行解读：</strong><br/>
              1. <code>queue.push(start)</code> - 把起点放入队列<br/>
              2. <code>while (!q.empty())</code> - 只要队列不空就继续<br/>
              3. <code>q.front()</code> 取队首，<code>q.pop()</code> 删除队首<br/>
              4. <code>for (v : adj[u])</code> - 遍历u的每个邻居v
            </TipBox>
          </div>
        ),
      },
      {
        title: 'BFS的应用场景',
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 mb-4">
              BFS在实际中有很多应用，最核心的是<strong>找最短路径</strong>：
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <KnowledgeCard title="🗺️ 最短路径问题" color="indigo">
                <p><strong>无权图</strong>中，BFS找到的路径一定是最短的！</p>
                <p className="mt-2 text-sm">例：社交网络中找两人最短关系链</p>
              </KnowledgeCard>
              <KnowledgeCard title="🎮 迷宫问题" color="emerald">
                <p>从起点到终点的最少步数</p>
                <p className="mt-2 text-sm">例：走迷宫、推箱子游戏</p>
              </KnowledgeCard>
              <KnowledgeCard title="🌳 层序遍历" color="amber">
                <p>按层访问树的所有节点</p>
                <p className="mt-2 text-sm">例：二叉树的层序遍历</p>
              </KnowledgeCard>
              <KnowledgeCard title="🔗 连通性判断" color="rose">
                <p>判断两个节点是否连通</p>
                <p className="mt-2 text-sm">例：网络故障检测</p>
              </KnowledgeCard>
            </div>
            <CompareTable
              headers={['特性', '说明']}
              rows={[
                ['时间复杂度', 'O(V + E)，V是顶点数，E是边数'],
                ['空间复杂度', 'O(V)，需要队列和visited数组'],
                ['使用的数据结构', '队列 Queue（先进先出）'],
                ['核心特点', '按距离从近到远搜索，找最短路径'],
              ]}
            />
            <div className="mt-4">
              <DemoLink to="/algorithms/bfs" text="去看BFS动画演示 →" icon="🎬" />
            </div>
          </div>
        ),
      },
      {
        title: '编程练习',
        content: (
          <div className="space-y-6">
            {/* 填空题 */}
            <FillInBlank
              title="BFS遍历填空"
              description="补全BFS广度优先搜索的关键代码，使程序能正确遍历图的所有顶点。"
              difficulty="easy"
              codeTemplate={{
                cpp: `void BFS(int start) {
    queue<int> q;
    q.push(___push___);
    visited[start] = ___visited___;
    
    while (!q.___empty___()) {
        int u = q.front();
        q.___pop___();
        
        for (int v : adj[u]) {
            if (!___check___) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}`,
                java: `void bfs(int start) {
    Queue<Integer> q = new LinkedList<>();
    q.offer(___push___);
    visited[start] = ___visited___;
    
    while (!q.___empty___()) {
        int u = q.poll();
        
        for (int v : adj[u]) {
            if (!___check___) {
                visited[v] = true;
                q.offer(v);
            }
        }
    }
}`,
                python: `def bfs(start):
    q = deque()
    q.append(___push___)
    visited[start] = ___visited___
    
    while ___empty___:
        u = q.popleft()
        
        for v in adj[u]:
            if not ___check___:
                visited[v] = True
                q.append(v)`
              }}
              blanks={[
                { id: 'push', answer: 'start', hint: '起点' },
                { id: 'visited', answer: 'true|True', hint: '标记' },
                { id: 'empty', answer: 'empty|isEmpty|q', hint: '判空' },
                { id: 'pop', answer: 'pop', hint: '出队' },
                { id: 'check', answer: 'visited[v]', hint: '检查访问' },
              ]}
              explanation="BFS的核心是使用队列实现层次遍历：1.起点入队并标记 2.循环取出队首 3.将未访问的邻居入队并标记"
            />

            {/* 编程题 */}
            <CodingExercise
              title="实现图的BFS遍历"
              description={`给定一个无向图，实现BFS广度优先搜索算法。
要求：
1. 从顶点0开始遍历
2. 按访问顺序输出所有顶点
3. 用空格分隔输出

图的邻接表表示：
0 -> [1, 2]
1 -> [0, 3, 4]
2 -> [0, 4]
3 -> [1, 5]
4 -> [1, 2, 5]
5 -> [3, 4]`}
              difficulty="medium"
              templates={{
                cpp: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

vector<int> adj[6];
bool visited[6];

void BFS(int start) {
    // 在这里实现BFS
    
}

int main() {
    // 构建图
    adj[0] = {1, 2};
    adj[1] = {0, 3, 4};
    adj[2] = {0, 4};
    adj[3] = {1, 5};
    adj[4] = {1, 2, 5};
    adj[5] = {3, 4};
    
    BFS(0);
    return 0;
}`,
                java: `import java.util.*;

public class Solution {
    static List<Integer>[] adj = new ArrayList[6];
    static boolean[] visited = new boolean[6];
    
    static void bfs(int start) {
        // 在这里实现BFS
        
    }
    
    public static void main(String[] args) {
        for (int i = 0; i < 6; i++) adj[i] = new ArrayList<>();
        adj[0].addAll(Arrays.asList(1, 2));
        adj[1].addAll(Arrays.asList(0, 3, 4));
        adj[2].addAll(Arrays.asList(0, 4));
        adj[3].addAll(Arrays.asList(1, 5));
        adj[4].addAll(Arrays.asList(1, 2, 5));
        adj[5].addAll(Arrays.asList(3, 4));
        
        bfs(0);
    }
}`,
                python: `from collections import deque

adj = {
    0: [1, 2],
    1: [0, 3, 4],
    2: [0, 4],
    3: [1, 5],
    4: [1, 2, 5],
    5: [3, 4]
}
visited = [False] * 6

def bfs(start):
    # 在这里实现BFS
    pass

bfs(0)`
              }}
              solutions={{
                cpp: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

vector<int> adj[6];
bool visited[6];

void BFS(int start) {
    queue<int> q;
    q.push(start);
    visited[start] = true;
    
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        cout << u << " ";
        
        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}

int main() {
    adj[0] = {1, 2};
    adj[1] = {0, 3, 4};
    adj[2] = {0, 4};
    adj[3] = {1, 5};
    adj[4] = {1, 2, 5};
    adj[5] = {3, 4};
    
    BFS(0);
    return 0;
}`,
                java: `import java.util.*;

public class Solution {
    static List<Integer>[] adj = new ArrayList[6];
    static boolean[] visited = new boolean[6];
    
    static void bfs(int start) {
        Queue<Integer> q = new LinkedList<>();
        q.offer(start);
        visited[start] = true;
        
        while (!q.isEmpty()) {
            int u = q.poll();
            System.out.print(u + " ");
            
            for (int v : adj[u]) {
                if (!visited[v]) {
                    visited[v] = true;
                    q.offer(v);
                }
            }
        }
    }
    
    public static void main(String[] args) {
        for (int i = 0; i < 6; i++) adj[i] = new ArrayList<>();
        adj[0].addAll(Arrays.asList(1, 2));
        adj[1].addAll(Arrays.asList(0, 3, 4));
        adj[2].addAll(Arrays.asList(0, 4));
        adj[3].addAll(Arrays.asList(1, 5));
        adj[4].addAll(Arrays.asList(1, 2, 5));
        adj[5].addAll(Arrays.asList(3, 4));
        
        bfs(0);
    }
}`,
                python: `from collections import deque

adj = {
    0: [1, 2],
    1: [0, 3, 4],
    2: [0, 4],
    3: [1, 5],
    4: [1, 2, 5],
    5: [3, 4]
}
visited = [False] * 6

def bfs(start):
    q = deque([start])
    visited[start] = True
    
    while q:
        u = q.popleft()
        print(u, end=' ')
        
        for v in adj[u]:
            if not visited[v]:
                visited[v] = True
                q.append(v)

bfs(0)`
              }}
              testCases={[
                { input: '从顶点0开始', expectedOutput: '0 1 2 3 4 5', description: '基本BFS遍历' },
                { input: '检查访问标记', expectedOutput: '每个顶点只访问一次', description: '避免重复访问' },
              ]}
              hints={[
                '使用队列(queue)存储待访问的顶点',
                '入队时立即标记为已访问，避免重复入队',
                '用while循环处理队列，直到队列为空',
              ]}
              explanation="BFS从起点开始，先访问所有距离为1的顶点，再访问距离为2的顶点，以此类推。使用队列保证先入先出的访问顺序。"
            />
          </div>
        ),
      },
    ],
  },
  'graph/dfs': {
    title: '深度优先搜索 DFS',
    category: '图',
    duration: '40分钟',
    demoLink: '/algorithms/dfs',
    sections: [
      {
        title: 'DFS 原理',
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              <strong>深度优先搜索（DFS）</strong>从起点开始，沿着一条路径尽可能深入，
              直到无法继续，再回溯到上一个分叉点继续探索。使用<strong>栈</strong>（或递归）实现。
            </p>
            <StepList steps={[
              { title: '访问当前顶点', desc: '标记为已访问' },
              { title: '深入探索', desc: '选择一个未访问的邻居，递归访问' },
              { title: '回溯', desc: '当前顶点所有邻居都访问过，返回上一层' },
              { title: '重复', desc: '直到所有可达顶点都被访问' },
            ]} />
            <TipBox type="tip">
              DFS 就像走迷宫，一条路走到黑，走不通再回头换路。适合<strong>遍历所有可能</strong>。
            </TipBox>
          </div>
        ),
      },
      {
        title: '代码实现',
        content: (
          <div className="space-y-4">
            <CodeExample lang="cpp" code={`// 递归实现（推荐）
vector<int> adj[MaxV];
bool visited[MaxV];

void DFS(int u) {
    visited[u] = true;
    cout << u << " ";  // 访问顶点
    
    for (int v : adj[u]) {
        if (!visited[v]) {
            DFS(v);  // 递归访问
        }
    }
}

// 非递归实现（使用栈）
void DFS_iterative(int start) {
    stack<int> s;
    s.push(start);
    
    while (!s.empty()) {
        int u = s.top();
        s.pop();
        
        if (visited[u]) continue;
        visited[u] = true;
        cout << u << " ";
        
        for (int v : adj[u]) {
            if (!visited[v]) {
                s.push(v);
            }
        }
    }
}`} />
          </div>
        ),
      },
      {
        title: 'BFS vs DFS',
        content: (
          <div className="space-y-4">
            <CompareTable
              headers={['对比项', 'BFS', 'DFS']}
              rows={[
                ['数据结构', '队列 Queue', '栈 Stack / 递归'],
                ['搜索顺序', '按层扩展', '深入到底再回溯'],
                ['空间复杂度', 'O(V) 可能很大', 'O(h) 递归深度'],
                ['最短路径', '✅ 能找到（无权）', '❌ 不保证'],
                ['适用场景', '最短路、层序', '遍历、拓扑、连通分量'],
              ]}
            />
            <TipBox type="important">
              <strong>选择建议：</strong>
              找最短路径用BFS；遍历所有情况、检测环、拓扑排序用DFS。
            </TipBox>
          </div>
        ),
      },
    ],
  },
  'graph/shortest-path': {
    title: '最短路径算法',
    category: '图',
    duration: '60分钟',
    demoLink: '/algorithms/bfs',
    sections: [
      {
        title: 'Dijkstra 算法',
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              <strong>Dijkstra算法</strong>用于求单源最短路径（一个起点到所有其他点的最短距离），
              要求<strong>边权非负</strong>。
            </p>
            <StepList steps={[
              { title: '初始化', desc: '起点距离为0，其他为∞' },
              { title: '选择最近点', desc: '从未确定的点中选距离最小的' },
              { title: '松弛操作', desc: '更新该点邻居的距离' },
              { title: '重复', desc: '直到所有点都确定' },
            ]} />
            <CodeExample lang="cpp" code={`// Dijkstra 算法（优先队列优化）
#include <queue>
using namespace std;
typedef pair<int,int> pii;

int dist[MaxV];
vector<pii> adj[MaxV];  // {邻居, 权值}

void dijkstra(int start) {
    fill(dist, dist + n, INF);
    dist[start] = 0;
    
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    pq.push({0, start});  // {距离, 顶点}
    
    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        
        if (d > dist[u]) continue;  // 跳过旧记录
        
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;  // 松弛
                pq.push({dist[v], v});
            }
        }
    }
}`} />
          </div>
        ),
      },
      {
        title: 'Floyd 算法',
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              <strong>Floyd算法</strong>求所有点对之间的最短路径，使用动态规划思想，
              可以处理负权边（但不能有负环）。
            </p>
            <CodeExample lang="cpp" code={`// Floyd 算法
int dist[MaxV][MaxV];  // dist[i][j] = i到j的最短距离

void floyd() {
    // 初始化：邻接矩阵
    
    // 核心：三重循环
    for (int k = 0; k < n; k++) {        // 中转点
        for (int i = 0; i < n; i++) {    // 起点
            for (int j = 0; j < n; j++) { // 终点
                // 经过k是否更短？
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
}`} />
            <TipBox type="warning">
              Floyd 的时间复杂度是 O(V³)，只适合顶点数较少的图（V &lt; 500）。
            </TipBox>
          </div>
        ),
      },
      {
        title: '算法对比',
        content: (
          <div className="space-y-4">
            <CompareTable
              headers={['算法', '时间复杂度', '适用场景', '负权边']}
              rows={[
                ['BFS', 'O(V+E)', '无权图', '-'],
                ['Dijkstra', 'O((V+E)logV)', '单源、非负权', '❌'],
                ['Bellman-Ford', 'O(VE)', '单源、可负权', '✅'],
                ['Floyd', 'O(V³)', '全源、点少', '✅'],
                ['SPFA', 'O(kE) 平均', '单源、可负权', '✅'],
              ]}
            />
            <TipBox type="tip">
              <strong>常用选择：</strong>
              无权图用BFS；正权图用Dijkstra；需要全源用Floyd；有负权用SPFA/Bellman-Ford。
            </TipBox>
          </div>
        ),
      },
    ],
  },
  'graph/mst': {
    title: '最小生成树',
    category: '图',
    duration: '50分钟',
    demoLink: '/algorithms/bfs',
    sections: [
      {
        title: '什么是最小生成树',
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              <strong>生成树</strong>：连通图的一个子图，包含所有顶点和n-1条边，且无环。<br/>
              <strong>最小生成树（MST）</strong>：边权和最小的生成树。
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <KnowledgeCard title="🏗️ 应用场景" color="indigo">
                <ul className="list-disc list-inside space-y-1">
                  <li>网络布线（最小成本连接）</li>
                  <li>城市道路规划</li>
                  <li>电路设计</li>
                  <li>聚类算法</li>
                </ul>
              </KnowledgeCard>
              <KnowledgeCard title="⚠️ 前提条件" color="amber">
                <ul className="list-disc list-inside space-y-1">
                  <li>图必须是连通的</li>
                  <li>边必须有权值</li>
                  <li>MST不唯一（边权相同时）</li>
                </ul>
              </KnowledgeCard>
            </div>
          </div>
        ),
      },
      {
        title: 'Prim 算法',
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              从一个顶点开始，每次选择连接已选顶点和未选顶点的<strong>最小边</strong>，逐步扩展。
            </p>
            <StepList steps={[
              { title: '选择起点', desc: '任选一个顶点加入MST' },
              { title: '找最小边', desc: '找连接MST和非MST的最小边' },
              { title: '加入MST', desc: '将该边和新顶点加入MST' },
              { title: '重复', desc: '直到所有顶点都在MST中' },
            ]} />
            <CodeExample lang="cpp" code={`// Prim 算法（优先队列）
int prim() {
    int ans = 0;
    bool inMST[MaxV] = {false};
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    
    pq.push({0, 0});  // {边权, 顶点}
    
    while (!pq.empty()) {
        auto [w, u] = pq.top();
        pq.pop();
        
        if (inMST[u]) continue;
        inMST[u] = true;
        ans += w;  // 加入MST
        
        for (auto [v, weight] : adj[u]) {
            if (!inMST[v]) {
                pq.push({weight, v});
            }
        }
    }
    return ans;
}`} />
          </div>
        ),
      },
      {
        title: 'Kruskal 算法',
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              将所有边按权值排序，依次选择最小边，如果不形成环就加入MST，使用<strong>并查集</strong>检测环。
            </p>
            <CodeExample lang="cpp" code={`// Kruskal 算法
struct Edge { int u, v, w; };
vector<Edge> edges;
int parent[MaxV];

int find(int x) {
    return parent[x] == x ? x : parent[x] = find(parent[x]);
}

int kruskal() {
    // 初始化并查集
    for (int i = 0; i < n; i++) parent[i] = i;
    
    // 按边权排序
    sort(edges.begin(), edges.end(), 
         [](Edge& a, Edge& b) { return a.w < b.w; });
    
    int ans = 0, cnt = 0;
    for (auto& e : edges) {
        int pu = find(e.u), pv = find(e.v);
        if (pu != pv) {  // 不在同一集合（不成环）
            parent[pu] = pv;  // 合并
            ans += e.w;
            cnt++;
            if (cnt == n - 1) break;  // 已有n-1条边
        }
    }
    return ans;
}`} />
            <CompareTable
              headers={['算法', '时间复杂度', '适用场景']}
              rows={[
                ['Prim', 'O((V+E)logV)', '稠密图'],
                ['Kruskal', 'O(ElogE)', '稀疏图'],
              ]}
            />
          </div>
        ),
      },
    ],
  },
  // ========== 树（补充） ==========
  'tree/basics': {
    title: '树的基本概念',
    category: '树',
    duration: '20分钟',
    demoLink: '/algorithms/binary-tree',
    sections: [
      {
        title: '什么是树',
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              <strong>树</strong>是n个节点的有限集合，当n=0时为空树。非空树满足：
              有且仅有一个<strong>根节点</strong>，其余节点可分为若干互不相交的子树。
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <KnowledgeCard title="🌳 树的特点" color="indigo">
                <ul className="list-disc list-inside space-y-1">
                  <li>n个节点有n-1条边</li>
                  <li>任意两节点间只有一条路径</li>
                  <li>没有回路（环）</li>
                </ul>
              </KnowledgeCard>
              <KnowledgeCard title="📝 基本术语" color="emerald">
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>根</strong>：没有父节点的节点</li>
                  <li><strong>叶子</strong>：没有子节点的节点</li>
                  <li><strong>深度</strong>：从根到该节点的层数</li>
                </ul>
              </KnowledgeCard>
            </div>
          </div>
        ),
      },
      {
        title: '二叉树',
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              <strong>二叉树</strong>是每个节点最多有两个子节点的树，分别称为左子树和右子树。
            </p>
            <CompareTable
              headers={['类型', '定义', '性质']}
              rows={[
                ['满二叉树', '每层都是满的', '深度h有 2^h-1 个节点'],
                ['完全二叉树', '除最后一层外都满，最后一层左对齐', '堆的基础'],
                ['二叉搜索树', '左子树 < 根 < 右子树', '中序遍历有序'],
                ['平衡二叉树', '左右子树高度差≤1', 'AVL树、红黑树'],
              ]}
            />
            <TipBox type="tip">
              二叉树的第i层最多有 2^(i-1) 个节点；深度为h的二叉树最多有 2^h-1 个节点。
            </TipBox>
          </div>
        ),
      },
    ],
  },
  'tree/traversal': {
    title: '二叉树遍历',
    category: '树',
    duration: '30分钟',
    demoLink: '/algorithms/binary-tree',
    sections: [
      {
        title: '四种遍历方式',
        content: (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <KnowledgeCard title="🔄 前序遍历 (根-左-右)" color="indigo">
                <p className="text-sm">先访问根，再左子树，最后右子树</p>
                <p className="text-xs text-slate-500 mt-2">应用：复制二叉树、前缀表达式</p>
              </KnowledgeCard>
              <KnowledgeCard title="🔄 中序遍历 (左-根-右)" color="emerald">
                <p className="text-sm">先左子树，再根，最后右子树</p>
                <p className="text-xs text-slate-500 mt-2">应用：BST得到有序序列</p>
              </KnowledgeCard>
              <KnowledgeCard title="🔄 后序遍历 (左-右-根)" color="amber">
                <p className="text-sm">先左子树，再右子树，最后根</p>
                <p className="text-xs text-slate-500 mt-2">应用：计算目录大小、后缀表达式</p>
              </KnowledgeCard>
              <KnowledgeCard title="🔄 层序遍历 (BFS)" color="rose">
                <p className="text-sm">从上到下，从左到右逐层访问</p>
                <p className="text-xs text-slate-500 mt-2">应用：寻找最短路径、层级打印</p>
              </KnowledgeCard>
            </div>
            <TipBox type="tip">
              <strong>记忆口诀：</strong>前中后说的是"根"的位置！<br/>
              前序=根在前，中序=根在中，后序=根在后
            </TipBox>
          </div>
        ),
      },
      {
        title: '递归实现',
        content: (
          <div className="space-y-4">
            <CodeExample lang="cpp" code={`// 前序遍历
void preOrder(TreeNode* root) {
    if (root == NULL) return;
    visit(root);              // 访问根节点
    preOrder(root->left);     // 递归左子树
    preOrder(root->right);    // 递归右子树
}

// 中序遍历
void inOrder(TreeNode* root) {
    if (root == NULL) return;
    inOrder(root->left);      // 递归左子树
    visit(root);              // 访问根节点
    inOrder(root->right);     // 递归右子树
}

// 后序遍历
void postOrder(TreeNode* root) {
    if (root == NULL) return;
    postOrder(root->left);    // 递归左子树
    postOrder(root->right);   // 递归右子树
    visit(root);              // 访问根节点
}

// 层序遍历（用队列）
void levelOrder(TreeNode* root) {
    if (root == NULL) return;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front(); q.pop();
        visit(node);
        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
}`} />
          </div>
        ),
      },
    ],
  },
  'tree/bst': {
    title: '二叉搜索树',
    category: '树',
    duration: '35分钟',
    demoLink: '/algorithms/bst',
    sections: [
      {
        title: 'BST的特性',
        content: (
          <div className="space-y-4">
            <KnowledgeCard title="🔍 二叉搜索树 (BST)" color="indigo">
              <p><strong>左子树</strong>所有节点的值 &lt; <strong>根节点</strong>的值 &lt; <strong>右子树</strong>所有节点的值</p>
              <p className="text-sm text-slate-500 mt-2">中序遍历BST得到有序序列！</p>
            </KnowledgeCard>
            <div className="flex justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 mb-2">50</div>
                <div className="flex justify-center gap-16">
                  <div className="text-center">
                    <div className="text-xl font-bold text-emerald-600">30</div>
                    <div className="flex gap-4">
                      <span className="text-lg">20</span>
                      <span className="text-lg">40</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-amber-600">70</div>
                    <div className="flex gap-4">
                      <span className="text-lg">60</span>
                      <span className="text-lg">80</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CompareTable
              headers={['操作', '平均时间', '最坏时间']}
              rows={[
                ['查找', 'O(log n)', 'O(n) 退化为链表'],
                ['插入', 'O(log n)', 'O(n)'],
                ['删除', 'O(log n)', 'O(n)'],
              ]}
            />
          </div>
        ),
      },
      {
        title: '基本操作',
        content: (
          <div className="space-y-4">
            <CodeExample lang="cpp" code={`// BST查找
TreeNode* search(TreeNode* root, int key) {
    if (root == NULL || root->val == key) 
        return root;
    if (key < root->val)
        return search(root->left, key);   // 在左子树找
    else
        return search(root->right, key);  // 在右子树找
}

// BST插入
TreeNode* insert(TreeNode* root, int key) {
    if (root == NULL) return new TreeNode(key);
    if (key < root->val)
        root->left = insert(root->left, key);
    else
        root->right = insert(root->right, key);
    return root;
}

// BST删除（三种情况）
// 1. 叶子节点：直接删除
// 2. 只有一个子节点：用子节点替代
// 3. 有两个子节点：用右子树最小值替代`} />
            <TipBox type="important">
              <strong>BST可能退化成链表！</strong>当按顺序插入1,2,3,4,5时，会变成一条链。<br/>
              解决方案：AVL树、红黑树等自平衡BST。
            </TipBox>
          </div>
        ),
      },
    ],
  },
  'tree/heap': {
    title: '堆',
    category: '树',
    duration: '30分钟',
    demoLink: '/algorithms/binary-tree',
    sections: [
      {
        title: '堆的概念',
        content: (
          <div className="space-y-4">
            <KnowledgeCard title="📊 堆 = 完全二叉树 + 堆序性" color="rose">
              <p><strong>大顶堆</strong>：每个节点 ≥ 其子节点（根是最大值）</p>
              <p><strong>小顶堆</strong>：每个节点 ≤ 其子节点（根是最小值）</p>
            </KnowledgeCard>
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-100">
              <h4 className="text-lg font-bold text-rose-800 mb-3">🏆 生活例子：公司层级</h4>
              <p className="text-slate-600 text-sm">大顶堆就像公司：老板(根)工资最高，每个上级工资都比下属高。</p>
            </div>
            <CompareTable
              headers={['操作', '时间复杂度', '说明']}
              rows={[
                ['获取最值', 'O(1)', '直接返回根节点'],
                ['插入', 'O(log n)', '上浮调整'],
                ['删除最值', 'O(log n)', '下沉调整'],
                ['建堆', 'O(n)', '从最后一个非叶节点开始调整'],
              ]}
            />
          </div>
        ),
      },
      {
        title: '堆的应用',
        content: (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <KnowledgeCard title="📊 堆排序" color="indigo">
                <p className="text-sm">1. 建大顶堆</p>
                <p className="text-sm">2. 取堆顶放末尾</p>
                <p className="text-sm">3. 调整堆，重复</p>
                <p className="text-xs text-slate-500 mt-2">时间O(nlogn)，空间O(1)</p>
              </KnowledgeCard>
              <KnowledgeCard title="🏆 优先队列" color="emerald">
                <p className="text-sm">用堆实现，每次取优先级最高的元素</p>
                <p className="text-xs text-slate-500 mt-2">应用：任务调度、Dijkstra算法</p>
              </KnowledgeCard>
              <KnowledgeCard title="🔢 Top-K问题" color="amber">
                <p className="text-sm">找最大的K个数：用小顶堆</p>
                <p className="text-sm">找最小的K个数：用大顶堆</p>
              </KnowledgeCard>
              <KnowledgeCard title="📈 合并K个有序链表" color="rose">
                <p className="text-sm">用小顶堆维护每个链表的当前最小值</p>
              </KnowledgeCard>
            </div>
            <TipBox type="tip">
              <strong>堆用数组存储：</strong>父节点i的左孩子是2i+1，右孩子是2i+2，父节点是(i-1)/2
            </TipBox>
          </div>
        ),
      },
    ],
  },
  // ========== 查找（补充） ==========
  'search/sequential': {
    title: '顺序查找',
    category: '查找',
    duration: '15分钟',
    demoLink: '/algorithms/sequence',
    sections: [
      {
        title: '顺序查找',
        content: (
          <div className="space-y-4">
            <KnowledgeCard title="🔍 顺序查找 = 从头到尾逐个比较" color="indigo">
              <p>适用于<strong>无序</strong>或<strong>链式存储</strong>的线性表</p>
              <p className="text-sm text-slate-500 mt-2">时间复杂度：O(n)</p>
            </KnowledgeCard>
            <CodeExample lang="cpp" code={`// 顺序查找
int seqSearch(int arr[], int n, int key) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == key)
            return i;  // 找到，返回下标
    }
    return -1;  // 未找到
}

// 带哨兵的顺序查找（优化）
int seqSearchWithGuard(int arr[], int n, int key) {
    arr[0] = key;  // 哨兵放在0位置
    int i = n;
    while (arr[i] != key)
        i--;
    return i;  // i=0表示未找到
}`} />
            <TipBox type="tip">
              <strong>哨兵优化：</strong>把查找值放在边界位置，省去每次循环的边界判断。
            </TipBox>
          </div>
        ),
      },
    ],
  },
  'search/hash': {
    title: '哈希查找',
    category: '查找',
    duration: '35分钟',
    demoLink: '/algorithms/sequence',
    sections: [
      {
        title: '哈希表原理',
        content: (
          <div className="space-y-4">
            <KnowledgeCard title="# 哈希表 = 直接定位" color="emerald">
              <p>通过<strong>哈希函数</strong>将key映射到数组下标，实现O(1)查找</p>
              <p className="text-sm text-slate-500 mt-2">就像字典按拼音查字，不用从头翻</p>
            </KnowledgeCard>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
              <h4 className="text-lg font-bold text-emerald-800 mb-3">📞 生活例子：通讯录</h4>
              <p className="text-slate-600 text-sm mb-3">按姓氏首字母分组查找联系人：</p>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-white px-2 py-1 rounded text-sm">A → 阿明</span>
                <span className="bg-white px-2 py-1 rounded text-sm">B → 小白</span>
                <span className="bg-white px-2 py-1 rounded text-sm">C → 小陈</span>
                <span className="text-slate-400">...</span>
              </div>
            </div>
            <CompareTable
              headers={['查找方式', '时间复杂度', '适用场景']}
              rows={[
                ['顺序查找', 'O(n)', '无序表'],
                ['二分查找', 'O(log n)', '有序表'],
                ['哈希查找', 'O(1)', '任意表（需建哈希表）'],
              ]}
            />
          </div>
        ),
      },
      {
        title: '冲突处理',
        content: (
          <div className="space-y-4">
            <TipBox type="important">
              <strong>哈希冲突：</strong>不同的key映射到相同的位置。必须处理！
            </TipBox>
            <div className="grid md:grid-cols-2 gap-4">
              <KnowledgeCard title="🔗 链地址法" color="indigo">
                <p className="text-sm">每个位置是一个链表</p>
                <p className="text-sm">冲突元素挂在同一链表</p>
                <p className="text-xs text-slate-500 mt-2">Java HashMap采用此法</p>
              </KnowledgeCard>
              <KnowledgeCard title="📍 开放定址法" color="amber">
                <p className="text-sm">冲突时寻找下一个空位</p>
                <p className="text-sm">线性探测/二次探测</p>
                <p className="text-xs text-slate-500 mt-2">可能产生聚集</p>
              </KnowledgeCard>
            </div>
            <CodeExample lang="cpp" code={`// 简单哈希函数
int hash(int key, int size) {
    return key % size;  // 除留余数法
}

// 链地址法实现
struct HashNode {
    int key, value;
    HashNode* next;
};

class HashTable {
    HashNode** table;
    int size;
public:
    void insert(int key, int value) {
        int idx = hash(key, size);
        // 头插法插入链表
        HashNode* node = new HashNode{key, value, table[idx]};
        table[idx] = node;
    }
    
    int search(int key) {
        int idx = hash(key, size);
        HashNode* p = table[idx];
        while (p) {
            if (p->key == key) return p->value;
            p = p->next;
        }
        return -1;  // 未找到
    }
};`} />
          </div>
        ),
      },
    ],
  },
  // ========== 排序 ==========
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
            <KnowledgeCard title="🫧 冒泡排序 = 相邻比较，大的往后冒" color="indigo">
              <p>反复遍历数组，每次比较相邻元素，如果顺序错误就交换。</p>
              <p className="text-sm text-slate-500 mt-2">像气泡一样，大的元素慢慢"冒"到后面。</p>
            </KnowledgeCard>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h4 className="text-lg font-bold text-blue-800 mb-3">🎯 排序过程演示</h4>
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
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
              <h4 className="text-lg font-bold text-emerald-800 mb-3">🎯 排序过程演示</h4>
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
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
              <h4 className="text-lg font-bold text-amber-800 mb-3">🎯 排序过程演示</h4>
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
  'linear/array': {
    title: '顺序表',
    category: '线性表',
    duration: '25分钟',
    demoLink: '/algorithms/sequence',
    sections: [
      {
        title: '顺序表的概念',
        content: (
          <div className="space-y-4">
            <KnowledgeCard title="📚 顺序表 = 数组实现的线性表" color="indigo">
              <p>用一段<strong>连续的存储单元</strong>依次存储线性表的数据元素。</p>
              <p className="text-sm text-slate-500 mt-2">就像书架上的书，一本挨着一本，位置固定。</p>
            </KnowledgeCard>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h4 className="text-lg font-bold text-blue-800 mb-3">🏠 生活例子：电影院座位</h4>
              <p className="text-slate-600 text-sm mb-3">电影院的座位就像顺序表：</p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• 座位号连续（1号、2号、3号...）</li>
                <li>• 知道座位号就能直接找到位置（随机访问O(1)）</li>
                <li>• 中间插人要让后面所有人挪位（插入O(n)）</li>
              </ul>
            </div>
            <CompareTable
              headers={['操作', '时间复杂度', '说明']}
              rows={[
                ['随机访问', 'O(1)', '直接用下标访问'],
                ['头部插入', 'O(n)', '所有元素后移'],
                ['尾部插入', 'O(1)', '直接追加'],
                ['中间插入', 'O(n)', '后面元素后移'],
                ['删除', 'O(n)', '后面元素前移'],
              ]}
            />
          </div>
        ),
      },
      {
        title: '代码实现',
        content: (
          <div className="space-y-4">
            <CodeExample lang="cpp" code={`// 顺序表的结构定义
#define MaxSize 100
typedef struct {
    int data[MaxSize];  // 存储数据的数组
    int length;         // 当前长度
} SqList;

// 插入操作（在位置i插入元素e）
bool ListInsert(SqList &L, int i, int e) {
    if (i < 1 || i > L.length + 1) return false;  // 位置不合法
    if (L.length >= MaxSize) return false;        // 已满
    
    // 后移元素（从后往前移）
    for (int j = L.length; j >= i; j--)
        L.data[j] = L.data[j-1];
    
    L.data[i-1] = e;  // 插入新元素
    L.length++;
    return true;
}

// 删除操作（删除位置i的元素）
bool ListDelete(SqList &L, int i, int &e) {
    if (i < 1 || i > L.length) return false;
    e = L.data[i-1];  // 保存被删除元素
    
    // 前移元素
    for (int j = i; j < L.length; j++)
        L.data[j-1] = L.data[j];
    
    L.length--;
    return true;
}`} />
            <TipBox type="tip">
              <strong>插入：从后往前移</strong>（避免覆盖）<br/>
              <strong>删除：从前往后移</strong>（填补空位）
            </TipBox>
          </div>
        ),
      },
    ],
  },
  'linear/linkedlist': {
    title: '单链表',
    category: '线性表',
    duration: '30分钟',
    demoLink: '/algorithms/link-head-node',
    sections: [
      {
        title: '单链表的概念',
        content: (
          <div className="space-y-4">
            <KnowledgeCard title="🔗 单链表 = 节点通过指针连接" color="emerald">
              <p>每个节点包含<strong>数据域</strong>和<strong>指针域</strong>（指向下一个节点）。</p>
              <p className="text-sm text-slate-500 mt-2">就像寻宝游戏，每个地点都有下一个地点的线索。</p>
            </KnowledgeCard>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
              <h4 className="text-lg font-bold text-emerald-800 mb-3">🚂 生活例子：火车车厢</h4>
              <div className="flex items-center justify-center gap-2 text-2xl my-4">
                <span>🚃</span><span>→</span><span>🚃</span><span>→</span><span>🚃</span><span>→</span><span>🚃</span><span>→</span><span className="text-slate-400">NULL</span>
              </div>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• 每节车厢只知道下一节在哪（单向）</li>
                <li>• 要找第n节车厢，必须从头数（O(n)）</li>
                <li>• 插入/删除只需改挂钩，不用移动车厢（O(1)）</li>
              </ul>
            </div>
            <CompareTable
              headers={['操作', '顺序表', '链表']}
              rows={[
                ['随机访问', 'O(1) ✓', 'O(n) ✗'],
                ['插入/删除', 'O(n) ✗', 'O(1) ✓'],
                ['空间', '固定大小', '动态分配'],
              ]}
            />
          </div>
        ),
      },
      {
        title: '核心操作：插入与删除',
        content: (
          <div className="space-y-4">
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
              <h4 className="text-lg font-bold text-amber-800 mb-3">⚠️ 插入操作（关键！）</h4>
              <p className="text-slate-600 mb-3">在p节点后插入新节点s：</p>
              <div className="bg-white rounded-lg p-4 font-mono text-sm">
                <p className="text-emerald-600">s-&gt;next = p-&gt;next;  // 第1步：新节点指向p的后继</p>
                <p className="text-rose-600">p-&gt;next = s;         // 第2步：p指向新节点</p>
              </div>
              <TipBox type="important">
                <strong>顺序不能反！</strong>如果先执行p-&gt;next=s，就丢失了原来p的后继节点！
              </TipBox>
            </div>
            <div className="bg-rose-50 rounded-xl p-6 border border-rose-200">
              <h4 className="text-lg font-bold text-rose-800 mb-3">🗑️ 删除操作</h4>
              <p className="text-slate-600 mb-3">删除p节点的后继节点q：</p>
              <div className="bg-white rounded-lg p-4 font-mono text-sm">
                <p>q = p-&gt;next;         // 找到要删除的节点</p>
                <p className="text-rose-600">p-&gt;next = q-&gt;next;  // 跳过q，直接连到q的后继</p>
                <p>free(q);             // 释放q的内存</p>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
  'linear/doubly': {
    title: '双向链表',
    category: '线性表',
    duration: '20分钟',
    demoLink: '/algorithms/link-double',
    sections: [
      {
        title: '双向链表的概念',
        content: (
          <div className="space-y-4">
            <KnowledgeCard title="↔️ 双向链表 = 可以双向遍历" color="amber">
              <p>每个节点有<strong>两个指针</strong>：prior指向前驱，next指向后继。</p>
            </KnowledgeCard>
            <div className="flex items-center justify-center gap-1 text-lg my-4 font-mono">
              <span className="text-slate-400">NULL</span>
              <span>←</span>
              <span className="bg-blue-100 px-2 py-1 rounded">A</span>
              <span>⇄</span>
              <span className="bg-blue-100 px-2 py-1 rounded">B</span>
              <span>⇄</span>
              <span className="bg-blue-100 px-2 py-1 rounded">C</span>
              <span>→</span>
              <span className="text-slate-400">NULL</span>
            </div>
            <CompareTable
              headers={['特性', '单链表', '双向链表']}
              rows={[
                ['指针数', '1个(next)', '2个(prior+next)'],
                ['访问前驱', 'O(n)', 'O(1) ✓'],
                ['删除本节点', '需要知道前驱', '直接删除 ✓'],
                ['空间开销', '小', '大'],
              ]}
            />
          </div>
        ),
      },
      {
        title: '插入与删除',
        content: (
          <div className="space-y-4">
            <CodeExample lang="cpp" code={`// 双向链表节点
struct DNode {
    int data;
    DNode *prior, *next;
};

// 在p节点后插入s
s->next = p->next;       // ① s的后继 = p的后继
if (p->next != NULL)
    p->next->prior = s;  // ② p后继的前驱 = s
s->prior = p;            // ③ s的前驱 = p
p->next = s;             // ④ p的后继 = s

// 删除p节点的后继节点q
q = p->next;
if (q->next != NULL)
    q->next->prior = p;  // q后继的前驱指向p
p->next = q->next;       // p的后继指向q的后继
free(q);`} />
            <TipBox type="tip">
              双向链表的插入需要修改<strong>4个指针</strong>，删除需要修改<strong>2个指针</strong>。
            </TipBox>
          </div>
        ),
      },
    ],
  },
  'linear/stack': {
    title: '栈',
    category: '线性表',
    duration: '25分钟',
    demoLink: '/algorithms/stack-sequence',
    sections: [
      {
        title: '栈的概念',
        content: (
          <div className="space-y-4">
            <KnowledgeCard title="📚 栈 = 后进先出 (LIFO)" color="rose">
              <p>只能在一端（栈顶）进行插入和删除操作。</p>
              <p className="text-sm text-slate-500 mt-2">就像一摞盘子，只能从最上面拿。</p>
            </KnowledgeCard>
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-100">
              <h4 className="text-lg font-bold text-rose-800 mb-3">🍽️ 生活例子</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🍽️</div>
                  <p className="font-medium">一摞盘子</p>
                  <p className="text-slate-500">最后放的先拿</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">↩️</div>
                  <p className="font-medium">浏览器后退</p>
                  <p className="text-slate-500">最近访问的先返回</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">📝</div>
                  <p className="font-medium">撤销操作</p>
                  <p className="text-slate-500">最后操作先撤销</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="border-2 border-slate-300 rounded-lg p-4 w-32">
                <div className="text-center text-slate-400 mb-2">栈顶 ↓</div>
                <div className="space-y-1">
                  <div className="bg-rose-500 text-white text-center py-1 rounded">3 ← 后进</div>
                  <div className="bg-rose-400 text-white text-center py-1 rounded">2</div>
                  <div className="bg-rose-300 text-white text-center py-1 rounded">1 ← 先进</div>
                </div>
                <div className="text-center text-slate-400 mt-2">栈底</div>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: '栈的应用',
        content: (
          <div className="space-y-4">
            <CompareTable
              headers={['应用场景', '说明']}
              rows={[
                ['括号匹配', '左括号入栈，右括号出栈匹配'],
                ['表达式求值', '操作数栈 + 运算符栈'],
                ['函数调用', '递归调用时保存现场'],
                ['DFS遍历', '深度优先搜索用栈实现'],
                ['浏览器历史', '后退功能'],
              ]}
            />
            <CodeExample lang="cpp" code={`// 顺序栈
#define MaxSize 100
typedef struct {
    int data[MaxSize];
    int top;  // 栈顶指针（-1表示空栈）
} SqStack;

// 入栈
bool Push(SqStack &S, int e) {
    if (S.top == MaxSize - 1) return false;  // 栈满
    S.data[++S.top] = e;  // 先移动指针，再存入
    return true;
}

// 出栈
bool Pop(SqStack &S, int &e) {
    if (S.top == -1) return false;  // 栈空
    e = S.data[S.top--];  // 先取出，再移动指针
    return true;
}`} />
          </div>
        ),
      },
    ],
  },
  'linear/queue': {
    title: '队列',
    category: '线性表',
    duration: '25分钟',
    demoLink: '/algorithms/queue-sequence',
    sections: [
      {
        title: '队列的概念',
        content: (
          <div className="space-y-4">
            <KnowledgeCard title="🚶 队列 = 先进先出 (FIFO)" color="emerald">
              <p>只能在队尾插入，队头删除。</p>
              <p className="text-sm text-slate-500 mt-2">就像排队买东西，先来先服务。</p>
            </KnowledgeCard>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
              <h4 className="text-lg font-bold text-emerald-800 mb-3">🎢 生活例子</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🧑‍🤝‍🧑</div>
                  <p className="font-medium">排队</p>
                  <p className="text-slate-500">先来先服务</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🖨️</div>
                  <p className="font-medium">打印任务</p>
                  <p className="text-slate-500">先提交先打印</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">📬</div>
                  <p className="font-medium">消息队列</p>
                  <p className="text-slate-500">按顺序处理</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="text-slate-500">出队 ←</div>
              <div className="flex border-2 border-slate-300 rounded-lg p-2">
                <div className="bg-emerald-300 text-white px-3 py-1 rounded mx-1">1</div>
                <div className="bg-emerald-400 text-white px-3 py-1 rounded mx-1">2</div>
                <div className="bg-emerald-500 text-white px-3 py-1 rounded mx-1">3</div>
              </div>
              <div className="text-slate-500">← 入队</div>
            </div>
          </div>
        ),
      },
      {
        title: '循环队列',
        content: (
          <div className="space-y-4">
            <TipBox type="important">
              <strong>为什么需要循环队列？</strong><br/>
              普通队列出队后前面的空间浪费了。循环队列让指针"循环"使用空间。
            </TipBox>
            <CodeExample lang="cpp" code={`// 循环队列
#define MaxSize 100
typedef struct {
    int data[MaxSize];
    int front, rear;  // 队头、队尾指针
} SqQueue;

// 判断队空
bool isEmpty(SqQueue Q) {
    return Q.front == Q.rear;
}

// 判断队满（牺牲一个单元）
bool isFull(SqQueue Q) {
    return (Q.rear + 1) % MaxSize == Q.front;
}

// 入队
bool EnQueue(SqQueue &Q, int e) {
    if (isFull(Q)) return false;
    Q.data[Q.rear] = e;
    Q.rear = (Q.rear + 1) % MaxSize;  // 循环
    return true;
}

// 出队
bool DeQueue(SqQueue &Q, int &e) {
    if (isEmpty(Q)) return false;
    e = Q.data[Q.front];
    Q.front = (Q.front + 1) % MaxSize;  // 循环
    return true;
}

// 队列长度
int Length(SqQueue Q) {
    return (Q.rear - Q.front + MaxSize) % MaxSize;
}`} />
            <TipBox type="tip">
              <strong>循环队列公式记忆：</strong><br/>
              队空：front == rear<br/>
              队满：(rear+1) % MaxSize == front<br/>
              长度：(rear - front + MaxSize) % MaxSize
            </TipBox>
          </div>
        ),
      },
    ],
  },
  'linear/circular': {
    title: '循环链表',
    category: '线性表',
    duration: '20分钟',
    demoLink: '/algorithms/link-head-node',
    sections: [
      {
        title: '循环链表的概念',
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              <strong>循环链表</strong>是一种特殊的链表，其最后一个节点的指针不是NULL，
              而是指向头节点，形成一个"环"。
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <KnowledgeCard title="🔄 循环单链表" color="indigo">
                <p>最后节点的next指向头节点</p>
                <p className="mt-2">可从任意节点遍历整个链表</p>
              </KnowledgeCard>
              <KnowledgeCard title="🔁 循环双链表" color="emerald">
                <p>头节点的prior指向尾节点</p>
                <p>尾节点的next指向头节点</p>
              </KnowledgeCard>
            </div>
          </div>
        ),
      },
      {
        title: '代码实现',
        content: (
          <div className="space-y-4">
            <CodeExample lang="cpp" code={`// 循环单链表
struct Node {
    int data;
    Node* next;
};

// 判断是否为空（带头节点）
bool isEmpty(Node* head) {
    return head->next == head;  // 头节点指向自己
}

// 判断是否是尾节点
bool isTail(Node* head, Node* p) {
    return p->next == head;
}

// 遍历循环链表
void traverse(Node* head) {
    Node* p = head->next;
    while (p != head) {
        cout << p->data << " ";
        p = p->next;
    }
}`} />
            <TipBox type="tip">
              循环链表常用于实现<strong>约瑟夫环</strong>问题、循环队列等场景。
            </TipBox>
          </div>
        ),
      },
    ],
  },
};

export default function Lesson() {
  const { '*': path } = useParams();
  const lesson = path ? lessons[path] : null;
  const { recordLessonVisit, isLessonCompleted, isLoggedIn } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // 记录学习进度
  useEffect(() => {
    if (path && lesson) {
      recordLessonVisit(path, lesson.title, lesson.category);
    }
  }, [path, lesson, recordLessonVisit]);

  // 滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsSidebarOpen(false);
  }, [path]);

  if (!lesson) {
    return (
      <div className="min-h-screen pt-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">课程不存在</h1>
          <Link to="/book" className="text-indigo-600 hover:underline">返回教程目录</Link>
        </div>
      </div>
    );
  }

  const completed = path ? isLessonCompleted(path) : false;
  const currentLink = `/book/${path}`;
  const { prev, next } = getAdjacentTopics(currentLink);
  
  // 查找相关练习
  const relatedExercises = allExercises.filter(ex => 
    ex.category === lesson.category && ex.difficulty === 'easy'
  ).slice(0, 3);

  return (
    <div key={path} className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16 transition-colors duration-300">
      <div className="flex max-w-7xl mx-auto">
        {/* 侧边栏导航 (桌面端) */}
        <aside className="hidden lg:block w-72 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 z-10">
          <div className="mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">📚 课程目录</h3>
            <Link to="/book" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">返回总目录</Link>
          </div>
          <div className="space-y-6">
            {curriculum.map(chapter => (
              <div key={chapter.id}>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                  {chapter.name}
                </h4>
                <ul className="space-y-1">
                  {chapter.topics.map(topic => {
                    const isActive = topic.link === currentLink;
                    return (
                      <li key={topic.link}>
                        <a
                          href={topic.link}
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = topic.link;
                          }}
                          className={`block px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {topic.name}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* 移动端目录按钮 */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 w-12 h-12 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-indigo-700 transition-colors"
        >
          <span className="text-xl">☰</span>
        </button>

        {/* 移动端侧边栏 */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-3/4 max-w-xs bg-white dark:bg-slate-800 shadow-2xl overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">课程目录</h3>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-6">
                {curriculum.map(chapter => (
                  <div key={chapter.id}>
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                      {chapter.name}
                    </h4>
                    <ul className="space-y-1">
                      {chapter.topics.map(topic => {
                        const isActive = topic.link === currentLink;
                        return (
                          <li key={topic.link}>
                            <Link
                              to={topic.link}
                              onClick={() => setIsSidebarOpen(false)}
                              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                isActive
                                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
                                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                              }`}
                            >
                              {topic.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 主内容区域 */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-8 lg:py-12">
          <div className="max-w-3xl mx-auto">
            {/* 面包屑 */}
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6 overflow-x-auto whitespace-nowrap pb-2">
              <Link to="/book" className="hover:text-indigo-600 dark:hover:text-indigo-400">教程</Link>
              <span>/</span>
              <span className="text-indigo-600 dark:text-indigo-400">{lesson.category}</span>
              <span>/</span>
              <span className="text-slate-900 dark:text-white font-medium">{lesson.title}</span>
            </div>

            {/* 标题区域 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 mb-8 shadow-sm">
              <div className="flex items-center flex-wrap gap-3 mb-4">
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-full">
                  {lesson.category}
                </span>
                {lesson.difficulty && <DifficultyBadge level={lesson.difficulty} />}
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full">
                  ⏱️ {lesson.duration}
                </span>
                {completed && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-100 dark:border-emerald-900/50">
                    <span>✓</span> 已学习
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">{lesson.title}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                {lesson.demoLink && (
                  <DemoLink to={lesson.demoLink} text="查看动画演示" icon="🎬" />
                )}
                {!isLoggedIn && (
                  <Link
                    to="/auth"
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
                  >
                    <span>🔒</span> 登录以保存进度
                  </Link>
                )}
              </div>
            </div>

            {/* 课程内容 */}
            <div className="space-y-8">
              {lesson.sections.map((section, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
                    <span className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-sm">
                      {i + 1}
                    </span>
                    {section.title}
                  </h2>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            {/* 底部导航 */}
            <div className="mt-12 grid sm:grid-cols-2 gap-4">
              {prev ? (
                <Link
                  to={prev.link}
                  className="group p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md transition-all"
                >
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">← 上一节</div>
                  <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">{prev.name}</div>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  to={next.link}
                  className="group p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md transition-all text-right"
                >
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">下一节 →</div>
                  <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">{next.name}</div>
                </Link>
              ) : (
                <div />
              )}
            </div>

            {/* 相关练习推荐 */}
            {relatedExercises.length > 0 && (
              <div className="mt-12">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>📝</span> 课后练习
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {relatedExercises.map(ex => (
                    <div
                      key={ex.id}
                      onClick={() => navigate('/practice')}
                      className="cursor-pointer p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/50 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-sm transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 px-2 py-1 rounded">
                          {ex.type === 'coding' ? '编程题' : '填空题'}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">简单</span>
                      </div>
                      <div className="font-medium text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                        {ex.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
