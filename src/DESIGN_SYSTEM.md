# Tumafang 设计语言规范

## 品牌色

| Token | 值 | 用途 |
|-------|------|------|
| `klein-500` | `#002FA7` | 主色 (IKB 克莱因蓝) |
| `pine-500` | `#FFE135` | 强调色 (松花黄) |

## 暗色模式

| 层级 | Light | Dark |
|------|-------|------|
| 全局背景 (App aurora) | `slate-50` (#f8fafc) | `#020617` (slate-950) |
| 页面内容区 | 透明 (继承极光) | 透明 (继承极光) |
| Header 滚动态 | `white/70` | `slate-950/70` |
| Footer | `white/60` | `slate-950/60` |
| 卡片 | `white` | `slate-800` |

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
