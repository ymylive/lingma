import type { LessonContent } from './types';
import {
  KnowledgeCard,
  StepList,
  CompareTable,
  CodeExample,
  TipBox,
} from '../../components/tutorials/TutorialPanel';

/* eslint-disable no-irregular-whitespace */

export const searchLessons: Record<string, LessonContent> = {
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
            <KnowledgeCard title="🔍 顺序查找 = 从头到尾逐个比较" color="klein">
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
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-6 dark:from-emerald-950/40 dark:to-teal-950/30 dark:border-emerald-800/60">
              <h4 className="text-lg font-bold text-emerald-800 mb-3 dark:text-emerald-200">📞 生活例子：通讯录</h4>
              <p className="text-slate-600 text-sm mb-3 dark:text-slate-300">按姓氏首字母分组查找联系人：</p>
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
              <KnowledgeCard title="🔗 链地址法" color="klein">
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
};

