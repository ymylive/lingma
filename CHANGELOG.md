# 更新日志

本文件记录项目的重要变更。

## 2026-03-20

### 新增

- 新增通用 AI 文本逐字展示 hook，统一支持字符串、字符串数组和嵌套对象字段的渐进式渲染
- AI 出题页面接入逐字展示，覆盖题目标题、题面、样例说明、提示、题解、填空题说明与代码模板
- Vibe Coding 训练场接入逐字展示，覆盖 challenge 场景、要求、限制、成功标准，以及评分后的优点、问题点和改写示范
- 专业判题中的 AI Review 接入逐字展示，覆盖总体诊断、错误点、修改建议、优化建议和下一步

### 修复

- 修复共享 AI 代理响应在错误声明编码下出现中文乱码的问题，统一改为 UTF-8 优先解码
- 修复 AI 出题流式 SSE 在错误声明编码下仍然出现中文乱码的问题，统一按 UTF-8 解析 delta
- 修复 AI 出题页此前只在最终 JSON 完整后才开始展示的问题，改为生成过程中实时显示流式文本预览
- Vibe Coding 训练场改为真实流式生成与评分，生成过程中实时显示 AI 原始输出预览，结束后再落成结构化卡片
- 专业判题改为“确定性判题先返回 + AI Review 单独流式生成”，不再等待完整 AI 复盘后才展示内容
- 修复逐字展示过程中列表项空白占位和重复 key 风险，保证训练场与判题 AI 列表渲染稳定

## 2026-03-15 (v2)

### 新增

- 新增独立的 `/methodology` 方法论文档阅读页面
  - 桌面端：sticky 侧边栏 TOC + IntersectionObserver 滚动高亮
  - 移动端：FAB 按钮唤出 slide-up TOC overlay
  - 6 个章节完整渲染，含知识点卡片、实战练习、常见误区
- 数据模型扩展：`KnowledgePoint` 新增可选 `tips` 字段（进阶提示）
- 为 7 个核心知识点补充 tips 内容
- Header 导航栏新增"方法论"入口
- VibeCodingLab 方法论模块新增"阅读完整文档"快捷链接
- i18n 补充方法论页面相关英文翻译

## 2026-03-15

### 新增

- 新增全局 Footer 组件（品牌信息、快捷导航、技术栈、版权行）
- Header 新增移动端汉堡菜单，点击展开/收起导航面板
- Tailwind 扩展完整品牌色阶：klein-50~900、pine-50~900

### 调整

- 统一品牌色：全站 CTA 按钮、渐变、激活态从 indigo/purple 替换为 Klein Blue
- 统一容器宽度：Hero/Stats/Algorithms/Book 内容区统一为 max-w-6xl
- 统一按钮圆角：Dashboard 继续学习按钮从 rounded-lg 升级为 rounded-xl
- Home CTA banner 渐变从 indigo→purple 改为 klein-500→klein-600
- Book 学习路径提示 banner 渐变统一为 klein
- Dashboard 用户卡片渐变、偏好选中态统一为 klein
- Practice 所有 tab/筛选按钮激活态、搜索框 focus 环统一为 klein
- 部署脚本 docker-deploy.py 修正为 docker-compose（连字符版本）
- 重写 README.md，更新项目结构、部署方式和关键目录说明

### 删除

- 移除 index.css 中重复的 @tailwind 指令和 @layer base 块
- 移除 index.css 中约 80 行 !important 暗色模式覆盖 hack

## 2026-03-14

### 新增

- 在 `Vibe Coding Lab` 中新增 `Prompt Arena` 训练场
- 新增 AI 自动生成 prompt 练习题
- 新增五条训练赛道：前端、后端、调试、重构、审查
- 新增 prompt 质量评分、维度分、优点、问题点与改写示范
- 新增账号级 Prompt Arena 历史记录与自适应难度接口
- 新增 Prompt Arena 后端 pytest 测试覆盖

### 调整

- 将 `VibeCodingLab` 从静态方法论面板升级为可交互训练界面
- 新增独立的前端类型与服务层，收口 Prompt Arena 请求逻辑
- 重写 `README.md`，同步当前产品结构、验证命令与部署方式

### 修复

- 修复练习相关页面的多处深浅色主题适配问题
- 修复 AI 出题下拉层级问题与题目标题英文缺失问题

### 安全

- 收口未鉴权的 AI 代理与判题入口
- 增加 judge 内部 token 校验与更严格的部署隔离配置
