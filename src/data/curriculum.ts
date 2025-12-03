export interface Topic {
  name: string;
  link: string;
  desc: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
}

export interface Chapter {
  id: string;
  name: string;
  icon: string;
  desc: string;
  color: string;
  topics: Topic[];
}

export const curriculum: Chapter[] = [
  {
    id: 'intro',
    name: '绑论',
    icon: '📚',
    desc: '了解数据结构的基本概念和复杂度分析',
    color: 'indigo',
    topics: [
      { name: '什么是数据结构', link: '/book/intro/what-is-ds', desc: '数据结构的定义、分类和重要性', difficulty: 'easy', duration: '15分钟' },
      { name: '算法与算法分析', link: '/book/intro/algorithm', desc: '算法的特性、设计要求', difficulty: 'easy', duration: '20分钟' },
      { name: '时间复杂度', link: '/book/intro/time-complexity', desc: 'O表示法、常见复杂度分析', difficulty: 'medium', duration: '30分钟' },
      { name: '空间复杂度', link: '/book/intro/space-complexity', desc: '内存使用分析、空间换时间', difficulty: 'medium', duration: '20分钟' },
    ]
  },
  {
    id: 'linear',
    name: '线性表',
    icon: '📋',
    desc: '学习最基础的线性数据结构',
    color: 'emerald',
    topics: [
      { name: '顺序表', link: '/algorithms/sequence', desc: '数组实现的线性表，支持随机访问', difficulty: 'easy', duration: '25分钟' },
      { name: '单链表', link: '/algorithms/link-head-node', desc: '链式存储，动态内存分配', difficulty: 'medium', duration: '40分钟' },
      { name: '双链表', link: '/algorithms/link-double', desc: '双向指针，支持双向遍历', difficulty: 'medium', duration: '30分钟' },
      { name: '循环链表', link: '/book/linear/circular', desc: '首尾相连的特殊链表', difficulty: 'medium', duration: '20分钟' },
      { name: '栈', link: '/algorithms/stack-sequence', desc: '后进先出(LIFO)的线性结构', difficulty: 'easy', duration: '30分钟' },
      { name: '队列', link: '/algorithms/queue-sequence', desc: '先进先出(FIFO)的线性结构', difficulty: 'easy', duration: '30分钟' },
    ]
  },
  {
    id: 'tree',
    name: '树',
    icon: '🌳',
    desc: '掌握层次结构的树形数据结构',
    color: 'amber',
    topics: [
      { name: '树的基本概念', link: '/book/tree/basics', desc: '树的定义、术语、性质', difficulty: 'easy', duration: '20分钟' },
      { name: '二叉树', link: '/algorithms/binary-tree', desc: '二叉树的定义和性质', difficulty: 'medium', duration: '35分钟' },
      { name: '二叉树遍历', link: '/algorithms/binary-tree', desc: '先序、中序、后序、层序遍历', difficulty: 'medium', duration: '45分钟' },
      { name: '二叉搜索树', link: '/algorithms/bst', desc: '有序二叉树，支持高效查找', difficulty: 'medium', duration: '40分钟' },
      { name: '平衡二叉树', link: '/book/tree/avl', desc: 'AVL树、红黑树简介', difficulty: 'hard', duration: '50分钟' },
      { name: '哈夫曼树', link: '/book/tree/huffman', desc: '最优二叉树与哈夫曼编码', difficulty: 'hard', duration: '40分钟' },
    ]
  },
  {
    id: 'graph',
    name: '图',
    icon: '🕸️',
    desc: '理解复杂的网状数据结构',
    color: 'rose',
    topics: [
      { name: '图的基本概念', link: '/book/graph/basics', desc: '图的定义、术语、分类', difficulty: 'easy', duration: '25分钟' },
      { name: '图的存储结构', link: '/book/graph/storage', desc: '邻接矩阵、邻接表', difficulty: 'medium', duration: '35分钟' },
      { name: '广度优先搜索 BFS', link: '/algorithms/bfs', desc: '层次遍历思想', difficulty: 'medium', duration: '40分钟' },
      { name: '深度优先搜索 DFS', link: '/algorithms/dfs', desc: '递归遍历思想', difficulty: 'medium', duration: '40分钟' },
      { name: '最短路径', link: '/book/graph/shortest-path', desc: 'Dijkstra、Floyd算法', difficulty: 'hard', duration: '60分钟' },
      { name: '最小生成树', link: '/book/graph/mst', desc: 'Prim、Kruskal算法', difficulty: 'hard', duration: '50分钟' },
    ]
  },
  {
    id: 'search',
    name: '查找',
    icon: '🔍',
    desc: '学习高效的数据检索方法',
    color: 'cyan',
    topics: [
      { name: '顺序查找', link: '/book/search/sequential', desc: '最简单的查找方法', difficulty: 'easy', duration: '15分钟' },
      { name: '二分查找', link: '/book/search/binary', desc: '有序表的高效查找', difficulty: 'easy', duration: '25分钟' },
      { name: '二叉搜索树查找', link: '/algorithms/bst', desc: '树形结构的查找', difficulty: 'medium', duration: '30分钟' },
      { name: '哈希表', link: '/book/search/hash', desc: 'O(1)时间复杂度的查找', difficulty: 'medium', duration: '45分钟' },
      { name: '哈希冲突处理', link: '/book/search/hash-collision', desc: '开放定址法、链地址法', difficulty: 'medium', duration: '35分钟' },
    ]
  },
  {
    id: 'sort',
    name: '排序',
    icon: '📊',
    desc: '掌握经典的排序算法',
    color: 'purple',
    topics: [
      { name: '冒泡排序', link: '/algorithms/sort-bubble', desc: '相邻元素比较交换', difficulty: 'easy', duration: '20分钟' },
      { name: '选择排序', link: '/algorithms/sort-select', desc: '每次选择最小元素', difficulty: 'easy', duration: '20分钟' },
      { name: '插入排序', link: '/algorithms/sort-insert', desc: '插入到已排序序列', difficulty: 'easy', duration: '25分钟' },
      { name: '希尔排序', link: '/algorithms/sort-quick', desc: '改进的插入排序', difficulty: 'medium', duration: '30分钟' },
      { name: '快速排序', link: '/algorithms/sort-quick', desc: '分治思想，平均最快', difficulty: 'medium', duration: '45分钟' },
      { name: '归并排序', link: '/algorithms/sort-quick', desc: '分治+合并，稳定排序', difficulty: 'medium', duration: '40分钟' },
      { name: '堆排序', link: '/algorithms/sort-quick', desc: '利用堆结构排序', difficulty: 'hard', duration: '45分钟' },
      { name: '排序算法对比', link: '/algorithms/sort-quick', desc: '复杂度、稳定性总结', difficulty: 'medium', duration: '20分钟' },
    ]
  },
];

// 获取所有课程列表（扁平化）
export const getAllTopics = () => {
  return curriculum.flatMap(chapter => chapter.topics);
};

// 获取相邻课程
export const getAdjacentTopics = (currentLink: string) => {
  const allTopics = getAllTopics();
  const currentIndex = allTopics.findIndex(t => 
    // 处理路径匹配逻辑，因为 link 可能是 /book/... 或 /algorithms/...
    t.link === currentLink || 
    (currentLink.startsWith('/book/') && t.link === currentLink) ||
    (currentLink.startsWith('/algorithms/') && t.link === currentLink)
  );

  if (currentIndex === -1) return { prev: null, next: null };

  return {
    prev: currentIndex > 0 ? allTopics[currentIndex - 1] : null,
    next: currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null
  };
};
