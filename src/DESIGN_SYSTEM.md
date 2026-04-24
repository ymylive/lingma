# Lingma · 灵码 设计语言规范

> v2 · Klein Aurora × Editorial Film 统一设计系统

## 设计哲学

**"克制的奢华"** —— Klein Blue (IKB) 的深沉秩序 + Source Serif 4 的电影化叙事 + 少量 Pine Yellow 作为品牌签名。

所有视觉元素服务于一个核心体验：**让算法被看见 (Make it visible.)**。

## 品牌

| 项 | 值 |
|-------|------|
| 产品名 | **Lingma** / 灵码 |
| 标志字 | 「灵」Source Serif 4 serif |
| 英文 slogan | *Learn data structures by seeing them think* |
| 中文 slogan | 用动画学懂数据结构与算法 |

## 色板

### 品牌色

| Token | 值 | 用途 |
|-------|------|------|
| `klein-500` | `#002FA7` | 主色 (IKB 克莱因蓝)，占 80% 视觉场景 |
| `pine-500` | `#FFE135` | 签名色 (松花黄)，只在 1 处精致使用 |
| `parchment-200` | `#ede7d8` | Editorial 暖米底，与 hero film 动画一致 |
| `ink-500` | `#3d382c` | Editorial 深墨字 |

### 辅色（tones.ts 语义分配）

| Tone | 语义 |
|------|------|
| emerald | 入门 / 成长 / 绿色路径 |
| indigo | 进阶 / 结构 / 深度 |
| amber | 算法 / 核心概念 |
| rose | 详细教程 / 提示 |
| cyan | 数据流 / 连接 |
| purple | 思维导图 / 关联 |

## 字型

| 角色 | 字族 | 用途 |
|------|------|------|
| **Display Serif** | Source Serif 4, Noto Serif SC | Hero 大标题、Editorial eyebrow、电影化叙事 |
| **Body Sans** | Plus Jakarta Sans, Inter | 正文、UI、说明文案 |
| **Mono** | JetBrains Mono | 数据、eyebrow number、编号、代码 |

## 节奏系统（CSS 变量）

| 变量 | 值 | 用途 |
|------|------|------|
| `--rhythm-xs` | 2rem (32px) | 紧凑堆叠组 |
| `--rhythm-sm` | 3.5rem (56px) | mobile section |
| `--rhythm-md` | 5rem (80px) | tablet section |
| `--rhythm-lg` | 7rem (112px) | desktop section |
| `--rhythm-hero` | 9rem (144px) | hero moment |

直接用 `.section-rhythm` 类或 `py-14 sm:py-20 lg:py-28`。

## 暗色模式

| 层级 | Light | Dark |
|------|-------|------|
| 全局背景 (App aurora) | `slate-50` (#f8fafc) | `#020617` (slate-950) |
| 页面内容区 | 透明 (继承极光) | 透明 (继承极光) |
| Header 滚动态 | `white/80` | `slate-950/80` |
| Footer | `white/60` | `slate-950/60` |
| 卡片 (soft) | `white/55` | `slate-900/50` |
| 卡片 (frosted) | `white/75` | `slate-900/70` |
| Editorial parchment | `#f2ece0 → #ede7d8` | `#1a1816 → #0f0e0c` |

## 圆角

| 元素 | 值 |
|------|------|
| 按钮 (小) | `rounded-xl` (12px) |
| 按钮 (pill) | `rounded-full` |
| 卡片 | `rounded-2xl` (16px) |
| 面板/区块 | `rounded-2xl` (16px) |
| 输入框 | `rounded-xl` (12px) |
| 徽章/标签 | `rounded-full` |

## 页面布局

| 属性 | 值 |
|------|------|
| 最大宽度 | `max-w-6xl` (72rem) |
| 水平内边距 | `px-4 sm:px-6` |
| 顶部间距 (Header 高度) | `pt-24` |
| 底部间距 | `pb-12` |
| 页面背景 | 透明 (继承全局极光) |

## 动画

| 场景 | 方案 |
|------|------|
| 页面切换 | framer-motion PageWrapper (opacity + scale) |
| 区块入场 | `whileInView` fade + slide-up |
| 列表子项 | staggerChildren: 0.08 |
| 卡片悬停 | `-translate-y-1` + shadow 增强 |
| 导航指示器 | `layoutId` spring |
| **签名下划线** | SVG draw-in 900ms ease-out（只用于 Hero 一处）|
| **Aurora halo** | Cursor 位置 CSS radial-gradient，600ms ease-out |

## 主按钮

```
bg-klein-500 text-white hover:bg-klein-600
shadow-lg shadow-klein-500/20 hover:shadow-klein-500/40
```

## 次按钮

```
border border-slate-200 bg-white text-slate-700
dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200
```

## 签名时刻（Signature Moments）

设计原则："一个细节做到 120%，其他做到 80%"。本系统的 **120% 点**：

1. **Hero Film** 段落 — 26s 电影化动画，暖米底 + Source Serif 4
2. **Pine Yellow 签名下划线** — Hero 标题下方 draw-in SVG，全站只出现 1 次
3. **Aurora cursor halo** — 跟随鼠标的柔光圈，用户感受到"背景活着"

## Editorial Eyebrow 模式

```jsx
<span className="eyebrow-editorial">01 · PRELUDE</span>
```

效果：横线 + 等宽字母 + `letter-spacing: 0.22em`，复刻 hero film 的电影开场标识。

## 移动端断点

| 断点 | 对应 |
|------|------|
| `< 640px` (默认) | iPhone / 紧凑布局 / snap scroll |
| `sm: ≥ 640px` | tablet |
| `md: ≥ 768px` | 小桌面 |
| `lg: ≥ 1024px` | 桌面标准 |
| `xl: ≥ 1280px` | 宽屏 |

移动端约束：
- 所有 3+ 列网格 `< 640px` 必须提供 horizontal snap scroll 或单列
- 所有可点击元素 `min-h-[44px]`
- section padding `py-14` 起步
