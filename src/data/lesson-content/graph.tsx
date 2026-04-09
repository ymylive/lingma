import type { LessonContent } from './types';
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
  FillInBlank,
} from '../../components/tutorials/TutorialPanel';

/* eslint-disable no-irregular-whitespace */

export const graphLessons: Record<string, LessonContent> = {
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
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 p-6 dark:from-blue-950/40 dark:to-cyan-950/30 dark:border-blue-800/60">
              <h4 className="text-lg font-bold text-blue-800 mb-3 dark:text-blue-200">📱 想象你的微信好友关系...</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900/70 rounded-lg p-4">
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
                <div className="bg-white dark:bg-slate-900/70 rounded-lg p-4">
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
              <KnowledgeCard title="📊 度 = 有几个好友" color="klein">
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
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4">
                  <span className="px-3 py-1 bg-indigo-100 rounded">A</span>
                  <span>→</span>
                  <span className="px-3 py-1 bg-emerald-100 rounded">B</span>
                  <span className="px-3 py-1 bg-emerald-100 rounded">C</span>
                </div>
                <div className="mb-2 text-amber-600 font-bold">第2层：距离=2</div>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                  <span className="px-3 py-1 bg-amber-100 rounded">D</span>
                  <span className="px-3 py-1 bg-amber-100 rounded">E</span>
                  <span className="px-3 py-1 bg-amber-100 rounded">F</span>
                </div>
              </div>
            </Diagram>
            <KnowledgeCard title="🌊 核心思想" color="klein">
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
              <KnowledgeCard title="🗺️ 最短路径问题" color="klein">
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
              <KnowledgeCard title="🏗️ 应用场景" color="klein">
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
};

