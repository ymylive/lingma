import type { LucideIcon } from 'lucide-react';
import {
  BrainCircuit,
  Bug,
  FolderOpen,
  GitBranch,
  MessageSquareQuote,
  ScrollText,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Wrench,
} from 'lucide-react';
import type { VibeTrack } from '../types/vibeCoding';

export interface KnowledgePoint {
  title: string;
  detail: string;
  example?: string;
  tips?: string;
}

export interface MethodologyUnit {
  id: string;
  icon: LucideIcon;
  title: string;
  summary: string;
  overview: string;
  points: KnowledgePoint[];
  practice: string;
  pitfalls: string[];
  relatedTrack?: VibeTrack;
}

export const methodologyUnits: MethodologyUnit[] = [
  {
    id: 'core-loop',
    icon: BrainCircuit,
    title: '专业闭环',
    relatedTrack: 'frontend',
    summary: 'Define -> Gather -> Implement -> Verify -> Deliver。',
    overview:
      '专业闭环是 Vibe Coding 的核心工作流。每次任务都必须经过五个阶段，确保交付可验证、改动可回滚。跳过任何一步都会导致返工或质量下降。',
    points: [
      {
        title: 'Define：用 2-4 行复述目标',
        detail:
          '开始编码前，先用 2-4 行文字复述任务的目标、范围、约束和完成标准。这一步迫使你在动手前想清楚"做什么"和"不做什么"，避免方向偏移。',
        example:
          '目标：为 VibeCodingLab 添加代码预览功能。\n范围：仅前端 track，iframe sandbox 渲染。\n约束：不改后端 API。\n完成标准：用户可实时预览 HTML/CSS/JS 输出。',
        tips: '把 Define 写在 prompt 的最前面，AI 会优先锁定方向，后续输出偏移率降低 60% 以上。',
      },
      {
        title: 'Gather：先定位再读取',
        detail:
          '不要盲目读文件。先用 rg --files 或 grep 定位相关代码，只读必要文件。这样既节省上下文窗口，又能快速建立对代码结构的理解。',
        example: 'rg "moduleCards" src/ → 定位到 VibeCodingLab.tsx:112\n只读该文件的 112-140 行，而非整个文件。',
        tips: '养成"先搜后读"的习惯。上下文窗口是稀缺资源，每多读一行无关代码，有效信息密度就下降一分。',
      },
      {
        title: 'Implement：小步实现，最小 diff',
        detail:
          '每次只改一小步，保持 diff 可审查、可回滚。不要一次性重构整个文件。如果改动超过 200 行或 5 个文件，先拆分再实施。',
        example: '第一步：新建数据文件 methodologyUnits.ts\n第二步：新建 MethodologyGuide 组件\n第三步：替换 VibeCodingLab 中的渲染\n每步独立可验证。',
        tips: '每完成一小步就 git commit，这样出问题时可以精确回滚到上一个正确状态。',
      },
      {
        title: 'Verify：先跑最小相关测试',
        detail:
          '改完代码后，先跑最小范围的相关测试（类型检查、单元测试），确认不破坏现有功能。失败时优先修根因，不做表层补丁。再逐步扩大验证范围。',
        example: 'npx tsc --noEmit → 类型检查通过\nnpx vite build → 构建成功\ncurl 健康检查 → API 正常',
      },
      {
        title: 'Deliver：质量门禁交付',
        detail:
          '交付前检查：边界条件是否覆盖？异常路径是否处理？改动是否幂等？是否向后兼容？所有断言都要有证据支撑，禁止"先改后补证据"。',
        example: 'Summary: 新增方法论文档页面\nChanges: 3 files added, 2 modified\nValidation: tsc 0 errors, vite build success\nNext: 添加单元测试覆盖',
        tips: '用 Summary/Changes/Validation/Next 四段式交付，审查者 30 秒内就能了解全貌。',
      },
      {
        title: 'Checkpoint Commit 与 Prompt 日志',
        detail:
          '把每个稳定的中间状态当作检查点提交（checkpoint commit），这样出问题时可以精确回滚。同时维护一份 prompt 日志，记录每次给 AI 的指令和产出结果，形成可追溯的决策链。这是专业 Vibe Coding 和"随便试试"的分水岭。',
        example: 'git commit -m "checkpoint: data layer done"\ngit commit -m "checkpoint: component renders correctly"\n\nprompt-log.md:\n- Round 1: 要求生成数据结构 → 产出 methodologyUnits.ts\n- Round 2: 要求生成渲染组件 → 产出 MethodologyGuide.tsx',
        tips: '当 AI 开始偏离原始意图时，回滚到最近的 checkpoint 并用新的证据重新构造 prompt，比在错误方向上继续修补高效得多。',
      },
      {
        title: 'Vibe Check：行为验证优先于代码审查',
        detail:
          '在审查 diff 之前，先运行应用观察实际行为。核心流程是否端到端可用？UI 间距、文案、状态是否合理？控制台有无报错？错误状态是否清晰？行为、UX 和测试信号三者收敛时才算通过，不能只看"代码看起来对"。',
        example: '✅ Vibe Check 清单：\n1. 核心流程端到端可用\n2. UI 间距和文案感觉对\n3. 无控制台错误或断链\n4. 错误状态清晰且有帮助',
      },
    ],
    practice:
      '练习：选一个你最近完成的编码任务，回顾它是否经过了完整的 D-G-I-V-D 五步。找出你跳过了哪一步，思考如果补上会有什么不同。额外挑战：为你的下一个任务维护一份 prompt 日志，记录每轮对话的输入和产出。',
    pitfalls: [
      '跳过 Define 直接写代码，导致方向偏移后大量返工。',
      'Gather 阶段读太多无关文件，浪费上下文窗口。',
      '一次性提交大量改动，出问题时无法定位是哪一步引入的。',
      '验证只跑 happy path，忽略边界和异常场景。',
      '不做 checkpoint commit，出问题时只能从头来过。',
      '只看代码不跑应用，错过行为层面的 bug。',
    ],
  },
  {
    id: 'skills',
    icon: Sparkles,
    title: 'Skills',
    relatedTrack: 'frontend',
    summary: '先流程型，再领域型；组合最小化。',
    overview:
      'Skills 是 AI 编码助手的能力模块，分为流程型（控制工作流程）和领域型（提供专业知识）。正确组合 skills 能大幅提升效率，但过度叠加反而增加复杂度和 token 消耗。',
    points: [
      {
        title: '流程型 vs 领域型 Skill',
        detail:
          '流程型 skill 控制"怎么做"（如 professional-delivery、test-driven-development），领域型 skill 提供"做什么的知识"（如 ui-ux-pro-max、systematic-debugging）。先选流程型确定工作节奏，再按需加领域型。',
        example: '多模块开发 → professional-delivery（流程）+ ui-ux-pro-max（领域）\n调试 → systematic-debugging（流程+领域合一）',
      },
      {
        title: '最小组合原则',
        detail:
          '默认组合上限：1 个流程型 + 1 个领域型或 agent + 1 个验证型。若无明确收益，不要叠加更多。每多一个 skill 都会增加上下文消耗和协调成本。',
        tips: '如果你发现自己在一个任务中启用了 3 个以上 skill，停下来重新评估——大概率是任务本身需要拆分。',
      },
      {
        title: '何时用 Skill vs 直接编码',
        detail:
          '简单的单文件修改、明确的 bug 修复不需要 skill。当任务涉及多步骤流程、需要特定领域知识、或需要质量保证时才启用 skill。',
        example: '修一个 typo → 直接改\n新增完整功能模块 → professional-delivery\n排查诡异 bug → systematic-debugging',
      },
      {
        title: '复用优先，不重复造轮子',
        detail:
          '优先复用项目中已有的 scripts/、模板和 assets。检查是否有现成的工具函数、组件或配置可以直接使用，避免重新实现已有功能。',
        tips: '动手写新代码前，先 rg 搜一下项目里是否已有类似实现。重复代码是技术债的最大来源之一。',
      },
    ],
    practice:
      '练习：列出你最近一个项目中使用的所有 skills/工具。哪些是必要的？哪些可以去掉？尝试用最小组合重新规划。',
    pitfalls: [
      '叠加过多 skill 导致 token 消耗暴增，响应变慢。',
      '对简单任务使用重型流程 skill，杀鸡用牛刀。',
      '忽略已有的 scripts 和模板，重复实现相同功能。',
      '混淆流程型和领域型，选错 skill 类型。',
    ],
  },
  {
    id: 'mcp',
    icon: TerminalSquare,
    title: 'MCP',
    relatedTrack: 'backend',
    summary: '实时事实交给工具，模型只负责判断。',
    overview:
      'MCP（Model Context Protocol）是 AI 调用外部工具的统一协议。核心理念：模型擅长推理和判断，但不擅长记忆实时事实。把"查事实"交给工具，把"做判断"留给模型，各司其职。',
    points: [
      {
        title: 'MCP 是什么',
        detail:
          'MCP 是一个统一的工具调用入口，让 AI 可以访问 GitHub、浏览器、搜索引擎、数据库等外部能力。它解决了"AI 知识有截止日期"的问题——需要实时信息时，通过 MCP 工具获取，而非依赖模型记忆。',
        example: '需要查最新的 React 19 API → mcp-router 搜索\n需要查 npm 包版本 → resolve-library-id + get-library-docs\n需要看页面 DOM → chrome-devtools',
      },
      {
        title: '先读后写原则',
        detail:
          '使用 MCP 工具时，先用最小范围探查（读），确认信息准确后再执行变更（写）。单次调用只聚焦一个目标，避免一次做太多事。',
        example: '先 get_file_contents 查看文件 → 确认内容 → 再 create_or_update_file 修改',
      },
      {
        title: '路由策略：选对工具',
        detail:
          '不同场景用不同工具：需要实时信息→搜索引擎；API 签名不确定→查官方文档（context7）；前端页面问题→先 DevTools 取证再改代码；GitHub 操作→mcp-router。优先本地资源，避免不必要的外部查询。',
      },
      {
        title: '保留证据链',
        detail:
          '关键的 MCP 调用结果要保留作为验证依据。命令输出、API 响应、页面截图都是证据。这样在交付时可以证明"我验证过了"，而不是"我觉得没问题"。',
        tips: '在 Validation 段落中直接粘贴命令输出，比"已验证"三个字有说服力 10 倍。',
      },
    ],
    practice:
      '练习：下次遇到不确定的 API 用法时，先用 MCP 查官方文档，对比你的记忆和实际文档的差异。记录你发现了几处记忆偏差。',
    pitfalls: [
      '依赖模型记忆回答实时性问题（如"最新版本号是多少"）。',
      '一次 MCP 调用试图完成多个目标，结果都做不好。',
      '不保留工具调用的证据，交付时无法证明验证过。',
      '对本地就能解决的问题发起不必要的外部查询，浪费时间。',
    ],
  },
  {
    id: 'prompting',
    icon: MessageSquareQuote,
    title: '专业提示词',
    relatedTrack: 'frontend',
    summary: '目标、范围、验证、交付格式都要写明。',
    overview:
      '专业提示词不是"用高级词汇"，而是结构化地表达需求。一个好的 prompt 包含四个要素：目标（做什么）、范围（做到哪里）、验证（怎么算完成）、格式（交付物长什么样）。评分低分最常见的原因不是措辞不够好，而是缺少边界和验证。',
    points: [
      {
        title: '四要素框架：Goal / Scope / Verification / Format',
        detail:
          'Goal：一句话说清要达成什么。Scope：明确包含和不包含什么。Verification：列出可测试的验收标准。Format：指定输出的结构和格式。四个要素缺一不可。',
        example:
          'Goal：为方法论模块添加交互式学习文档。\nScope：6 个单元，每个含知识点和练习，不改后端。\nVerification：tsc 通过，vite build 成功，部署后可访问。\nFormat：accordion 展开式 UI，数据与组件分离。',
      },
      {
        title: '边界约束的重要性',
        detail:
          '大多数低分 prompt 的问题不在于"说得不够好"，而在于"没说不做什么"。明确的边界约束能防止 AI 过度发挥：不改哪些文件、不引入哪些依赖、不超过多少行代码。',
        example: '约束：不修改后端 API，不引入新的 npm 依赖，改动控制在 5 个文件以内，新增代码 < 200 行。',
      },
      {
        title: '验证设计：可测试的验收标准',
        detail:
          '好的验证标准是具体的、可执行的、有明确的通过/失败判定。避免模糊的"应该能工作"，改为"执行 X 命令，输出包含 Y"。',
        example: '❌ "确保功能正常"\n✅ "npx tsc --noEmit 零错误，npx vite build 成功产出 dist/，curl localhost:18081 返回 200"',
      },
      {
        title: '输出格式规范',
        detail:
          '指定交付物的格式：Summary（结论）/ Changes（改了什么）/ Validation（验证证据）/ Next（下一步建议）。文件引用用 file:line 格式，不贴大段代码，只列关键改动点。',
      },
      {
        title: 'Prompt DNA 六要素',
        detail:
          '进阶版 prompt 结构包含六个 DNA 组件：Goal（用户成果和成功标准）、Constraints（技术栈、库、模式、不可妥协项）、Context（相关文件、API、数据结构）、Inputs/Outputs（数据流和预期行为）、Acceptance（合并前必须通过的检查）、Non-goals（明确不做什么）。这个框架来自专业 AI 开发社区的最佳实践。',
        example: 'Role: 你在维护这个仓库。\nGoal: 用户能实时预览 HTML 输出。\nConstraints: React + Tailwind，不引入新依赖。\nContext: src/components/Editor.tsx, src/types/.\nInputs/Outputs: 用户输入代码 → iframe 渲染结果。\nAcceptance: tsc 通过，无 XSS 风险。\nNon-goals: 不改后端，不加保存功能。',
        tips: '先让 AI 输出计划再写代码——要求它列出将要修改的文件和方法，确认后再动手。这能把返工率降低一半以上。',
      },
      {
        title: '场景化 Prompt 模板',
        detail:
          '不同任务类型需要不同的 prompt 结构。功能实现：约束技术栈 + 定义验收标准 + 指定可改文件。Bug 修复：提供精确复现步骤 + 预期 vs 实际输出 + 约束修复范围。安全重构：要求小 diff + 保持行为不变 + 附带解释。测试先行：先定义测试用例再写实现。UX 打磨：聚焦微观布局和文案，提供 before/after 对比。',
        example: '【Bug 修复模板】\n复现：点击"提交"按钮后页面白屏。\n预期：显示成功提示。\n实际：控制台报 TypeError: Cannot read property \'id\' of undefined。\n约束：只改 src/components/SubmitForm.tsx，不改 API。\n验收：点击提交后显示成功提示，无控制台错误。',
      },
    ],
    practice:
      '练习：拿你最近写的一个 prompt，用四要素框架重写它。对比重写前后，AI 的输出质量有什么变化？进阶：尝试用 Prompt DNA 六要素重写同一个 prompt，观察 AI 是否更精准地理解了你的意图。',
    pitfalls: [
      '只写目标不写边界，AI 过度发挥引入不需要的改动。',
      '验证标准模糊（"应该没问题"），无法判断是否真的完成。',
      '追求华丽措辞而忽略结构化表达，本末倒置。',
      '不指定输出格式，每次交付物结构不一致。',
      '所有任务用同一个 prompt 模板，忽略场景差异。',
      '不要求 AI 先出计划就直接让它写代码，失去纠偏机会。',
    ],
  },
  {
    id: 'swarm',
    icon: GitBranch,
    title: 'AI 蜂群',
    relatedTrack: 'backend',
    summary: '按最小可交付单元拆任务，不让多人同时改一文件。',
    overview:
      'AI 蜂群（Swarm）是多个 AI agent 并行协作的模式。核心思想：把大任务拆成互不重叠的小单元，每个 agent 独立完成一个单元，最后合并。关键约束是避免多个 agent 同时修改同一个文件。',
    points: [
      {
        title: '何时用蜂群 vs 单 Agent',
        detail:
          '蜂群适合：涉及 5+ 文件变更的大功能、全栈开发（前端+后端+测试）、代码重构项目。单 agent 适合：简单 bug 修复、单文件修改、快速原型验证、token 预算有限时。',
        example: '单 agent：修一个 CSS 样式\n蜂群：同时开发用户认证模块的前端组件、后端 API、数据库迁移和测试用例',
      },
      {
        title: '任务拆分：最小可交付单元',
        detail:
          '每个子任务必须是独立可交付的：有明确的输入输出、可以独立验证、不依赖其他子任务的中间状态。拆分时按文件/模块边界划分，确保不同 agent 的工作范围不重叠。',
        example: 'Agent A：src/data/methodologyUnits.ts（数据）\nAgent B：src/components/MethodologyGuide.tsx（组件）\nAgent C：src/i18n/translations.ts（翻译）\n三者互不干扰，最后集成。',
      },
      {
        title: 'Git Worktree 隔离',
        detail:
          '每个 agent 在独立的 Git Worktree 中工作，拥有自己的代码副本。这从根本上避免了文件冲突。只有测试通过后才合并到主分支，保证主分支始终稳定。',
      },
      {
        title: '质量门控与合并策略',
        detail:
          '每个 agent 完成后必须通过质量门控：类型检查、测试通过、无冲突。Leader agent 负责审查和合并，确保各部分集成后整体仍然正确。',
      },
      {
        title: '团队角色分工：Product Lead / Builder / Reviewer',
        detail:
          '专业蜂群协作中有三个核心角色。Product Lead：拥有需求和验收标准，保持范围对齐用户成果，签署最终行为验收。Builder：指挥 AI 模型，运行 Vibe Loop，保持 diff 小，记录决策和遗留问题。Reviewer：审查 diff，测试结果，发现风险，验证性能和安全，给出明确的通过/拒绝反馈。角色分离确保没有人既当运动员又当裁判。',
        example: 'Product Lead：定义"用户能在 3 秒内完成注册"\nBuilder：拆分为表单组件 + API + 验证逻辑，逐步实现\nReviewer：审查 diff，跑安全扫描，验证 3 秒性能指标',
        tips: '即使是个人项目，也建议在不同阶段切换角色心态：写代码时是 Builder，提交前切换为 Reviewer 心态重新审视。',
      },
    ],
    practice:
      '练习：选一个你认为"太大"的功能需求，尝试把它拆成 3-5 个互不重叠的子任务。检查：每个子任务能否独立验证？是否有文件重叠？进阶：为每个子任务指定角色（Builder/Reviewer），模拟一次完整的蜂群协作流程。',
    pitfalls: [
      '多个 agent 同时修改同一个文件，导致合并冲突。',
      '子任务之间有隐式依赖，一个完成前另一个无法开始。',
      '对简单任务使用蜂群，协调成本远超收益。',
      '不做质量门控就合并，引入回归 bug。',
      '角色不分离，Builder 自己审查自己的代码，失去客观性。',
    ],
  },
  {
    id: 'writing',
    icon: ScrollText,
    title: '写作规范',
    relatedTrack: 'review',
    summary: '结论先行，证据具体，未验证要明说。',
    overview:
      '技术写作的核心原则：读者的时间比你的更宝贵。先给结论让读者快速判断是否需要深入，再给证据支撑结论，最后诚实标注哪些是未验证的推测。这个原则适用于代码注释、PR 描述、技术文档和 AI 交付物。',
    points: [
      {
        title: '结论先行模式',
        detail:
          '每段文字的第一句就是结论。读者看完第一句就知道这段在说什么，决定是否继续读。不要铺垫、不要悬念、不要"首先让我解释一下背景"。',
        example: '❌ "经过分析，我发现有几个文件需要修改，首先是...最终结论是需要重构 UserService。"\n✅ "UserService 需要重构。原因：职责过重（3 个理由）。改动范围：2 个文件。"',
      },
      {
        title: '证据具体化',
        detail:
          '引用代码时用 file_path:line_number 格式，让读者可以直接跳转。不贴大段代码，只列关键改动点。数据要有来源，命令要有输出。',
        example: '问题在 src/services/auth.ts:42，token 过期检查缺少时区处理。\n验证：npx tsc --noEmit 输出 0 errors。',
      },
      {
        title: '诚实标注未验证内容',
        detail:
          '如果某个结论是推测而非验证过的事实，必须明确标注。"我认为"和"我验证过"是完全不同的可信度。宁可说"未验证"，也不要让读者误以为你确认过。',
        example: '✅ "根据文档，这个 API 应该支持批量操作（未实测）。"\n❌ "这个 API 支持批量操作。"（实际上你只是看了文档没试过）',
      },
      {
        title: 'Summary / Changes / Validation / Next 格式',
        detail:
          '标准交付格式：Summary（一句话结论）→ Changes（改了哪些文件的哪些地方）→ Validation（验证命令和输出）→ Next（最有价值的下一步建议）。这个格式让审查者在 30 秒内了解全貌。',
      },
      {
        title: '决策记录与知识沉淀',
        detail:
          '每个重要的技术决策都应该记录"为什么选择 A 而不是 B"。这些决策记录（ADR）是团队知识的沉淀，新成员可以快速理解项目的演进逻辑。格式：问题 → 备选方案 → 选择 → 理由 → 影响。同样，调试过程中发现的模式也应该沉淀为可复用的知识。',
        example: '决策记录：\n问题：状态管理方案选型\n备选：Redux / Zustand / Context\n选择：Zustand\n理由：项目规模中等，Zustand 学习成本低，bundle 小\n影响：所有状态逻辑集中在 src/stores/',
        tips: '维护一个 lessons-learned 文档，记录每次踩坑的问题、解决方案、影响范围和可复用模式。这是团队最有价值的资产之一。',
      },
      {
        title: '交接文档格式',
        detail:
          '当任务需要交接给其他人（或未来的自己）时，使用标准交接格式：Context（目标简述）→ Changes（改了哪些文件及原因）→ Checks（跑了哪些测试或命令）→ Open Issues（遗留问题）→ Next Prompt（推荐的下一步指令）。这个格式确保接手者能在 5 分钟内进入状态。',
        example: 'Context: 为方法论页面添加搜索功能\nChanges: Methodology.tsx（添加搜索栏）, methodologyUnits.ts（添加关键词索引）\nChecks: tsc 通过, vite build 成功\nOpen Issues: 搜索性能未优化，大数据量可能卡顿\nNext Prompt: 为搜索添加 debounce 和结果高亮',
      },
    ],
    practice:
      '练习：找一段你之前写的技术说明或 PR 描述，用"结论先行"原则重写第一段。对比重写前后，信息传达效率提升了多少？进阶：为你最近的一个技术决策写一份 ADR，包含问题、备选方案、选择和理由。',
    pitfalls: [
      '长篇铺垫后才给结论，读者早已失去耐心。',
      '引用代码不给文件路径和行号，读者无法定位。',
      '把推测当事实陈述，误导读者做出错误决策。',
      '交付物格式每次不同，审查者需要重新适应。',
      '不记录技术决策的理由，三个月后连自己都忘了为什么这么选。',
      '交接文档缺少 Open Issues，接手者踩同样的坑。',
    ],
  },
  {
    id: 'context',
    icon: FolderOpen,
    title: '上下文管理',
    relatedTrack: 'frontend',
    summary: '上下文窗口是稀缺战略资源，用 Plan 文档外化项目知识。',
    overview:
      '上下文窗口（Context Window）是 AI 能同时"看到"的信息总量，它是有限的战略资源。专业 Vibe Coding 的核心技巧之一是管理好这个窗口：把项目知识外化到持久化的 Plan 文档中，每次会话只加载必要的上下文，避免信息过载导致 AI 输出质量下降。研究表明，上下文中每多一行无关信息，有效信息密度就下降一分。',
    points: [
      {
        title: 'Plan 文档：外化项目知识',
        detail:
          '将项目的目标、当前状态、架构决策和实现笔记写入持久化的 Plan 文档（如 plans/feature-name.md）。新会话开始时只需说"读 plan 文件，从第 3 步继续"，而不是重新解释所有背景。这能把数小时的讨论和发现压缩成几百字。',
        example: 'plans/auth-module.md\n├── Goal: 实现 JWT 认证\n├── Current Status: 第 2 步完成，API 路由已定义\n├── Architecture Decisions: 选择 jose 库而非 jsonwebtoken\n└── Implementation Notes: token 过期时间 15min，refresh 7d',
        tips: 'Plan 文档是活文档，随着发现新信息持续更新。它不是一次性的需求文档，而是项目的"工作记忆"。',
      },
      {
        title: '信息密度原则',
        detail:
          '前置关键信息，引用外部文档而非复制粘贴，渐进式暴露复杂度。给 AI 的上下文应该像好的 API 文档一样：最重要的信息在最前面，细节按需展开。避免把整个文件丢给 AI，只提供相关的代码片段。',
        example: '❌ 把 500 行文件全部粘贴给 AI\n✅ "src/auth.ts:42-58 的 validateToken 函数有 bug，token 过期检查缺少时区处理。相关类型定义在 src/types/auth.ts:12。"',
      },
      {
        title: '会话管理：何时重置上下文',
        detail:
          '当 AI 开始"忘记"之前的约束、重复犯同样的错误、或输出质量明显下降时，说明上下文已经被污染或过载。此时应该开启新会话，用干净的摘要重新开始。不要在一个无限长的对话中试图修复所有问题。',
        tips: '每个会话聚焦一个明确的目标。如果发现自己在同一个会话中切换了 3 个以上不相关的话题，是时候开新会话了。',
      },
      {
        title: '渐进式上下文加载',
        detail:
          '不要一开始就把所有相关文件都加载进来。先加载核心文件，让 AI 理解结构，然后按需逐步加载更多上下文。这就像人类阅读代码一样——先看入口文件，再顺着调用链深入。',
        example: '第 1 轮：加载 src/App.tsx 了解路由结构\n第 2 轮：加载目标组件 src/pages/Dashboard.tsx\n第 3 轮：按需加载相关的 hook 和 service',
      },
    ],
    practice:
      '练习：为你当前正在开发的功能创建一份 Plan 文档。包含目标、当前状态、架构决策和实现笔记。下次开新会话时，用这份文档作为起点，观察 AI 是否能更快进入状态。',
    pitfalls: [
      '把整个代码库丢给 AI，导致上下文过载，输出质量暴跌。',
      '不维护 Plan 文档，每次新会话都要从头解释背景。',
      '在一个超长会话中做所有事情，上下文污染后 AI 开始犯低级错误。',
      '不做渐进式加载，一开始就加载 20 个文件，大部分都用不上。',
    ],
  },
  {
    id: 'security',
    icon: ShieldCheck,
    title: '安全与质量门禁',
    relatedTrack: 'review',
    summary: '三层质量门禁 + 信任边界分析，确保 AI 生成的代码可上线。',
    overview:
      'AI 生成的代码经常"看起来能用"但隐藏安全漏洞。Veracode 研究发现 AI 生成的代码在 45% 的测试中引入了高风险安全缺陷，斯坦福研究发现使用 AI 助手的开发者写出了更不安全的代码，同时对安全性更自信。解决方案不是不用 AI，而是建立系统化的质量门禁：把"能运行"提升到"可上线"。',
    points: [
      {
        title: '三层质量门禁',
        detail:
          '第一层 Vibe Check（生成时）：核心流程端到端可用，UI 状态合理，无控制台错误。第二层 Objective Check（提交前）：审查 diff 确认无意外改动，跑测试和类型检查，验证性能敏感路径，确认依赖真实存在。第三层 Release Ready（上线前）：文档和交接笔记更新，回滚方案就绪，监控和日志到位，后续任务已记录。最低标准：diff 审查 + 本地运行 + 一个边界用例检查。',
        example: '第一层：npm run dev → 页面正常渲染，点击流程通畅\n第二层：git diff → 无意外文件改动，npx tsc -b → 0 errors\n第三层：回滚方案 = git revert HEAD，监控 = curl health check',
      },
      {
        title: '信任边界与威胁建模',
        detail:
          '每次涉及用户输入、认证、权限的代码变更，都要做信任边界分析。识别：入口点（路由、webhook、上传）、角色（匿名/用户/管理员/服务账号）、资产（数据、API 密钥、特权操作）、滥用场景和缓解措施。如果 AI 无法清晰追踪从不可信输入到敏感操作的路径，那就需要人工审查。',
        example: '入口点：/api/user/update（PUT）\n角色：已认证用户\n资产：用户个人信息\n滥用场景：修改其他用户的信息（IDOR）\n缓解：服务端校验 req.user.id === params.userId',
        tips: '让 AI 列出代码中的所有假设（输入总是存在、请求按顺序到达、外部 API 总是快速响应），然后逐一验证哪些假设是未经测试的。',
      },
      {
        title: '认证与授权审查',
        detail:
          '标记每个路由的认证（你是谁？）和授权（你能做什么？）规则。任何缺少服务端强制执行的路由都是潜在漏洞。认证和授权是 demo 级代码变成数据泄露事件的第一大原因。Apiiro 研究发现 AI 辅助的代码变更会增加权限提升路径等深层问题。',
        example: '路由审查清单：\n/api/public/* → 无需认证 ✅\n/api/user/* → 需要 JWT token ✅\n/api/admin/* → 需要 admin 角色 ✅\n/api/internal/* → ⚠️ 缺少认证中间件！',
      },
      {
        title: '敏感数据追踪',
        detail:
          '识别代码中收集、存储、返回和记录的所有敏感数据。关注密码、token、API 密钥、PII（邮箱、手机号、地址）。原则：收集最少、存储最少、日志几乎不记录。特别注意数据是否流向了日志、分析服务、错误追踪器或第三方服务。',
        tips: '未来的事故报告中最常见的发现之一是"在日志中发现了意外的敏感数据"。部署前 grep 一下日志输出中是否包含 password、token、secret 等关键词。',
      },
      {
        title: '上线前五问速查',
        detail:
          '快速心理检查清单：1. 我理解这段代码吗？2. 它能被滥用吗？3. 在真实条件下会崩溃吗？4. 能承受负载吗？5. 能安全运维吗？如果任何一个问题的答案是"不确定"，就需要进一步调查。记住：能运行 ≠ 已审查。',
      },
    ],
    practice:
      '练习：对你最近用 AI 生成的一段代码做信任边界分析。列出所有入口点、角色、资产和滥用场景。你发现了几个之前没注意到的潜在问题？',
    pitfalls: [
      'AI 代码"能跑"就直接上线，跳过安全审查。',
      '只测 happy path，不测恶意输入和边界条件。',
      '信任 AI 生成的依赖名称，不验证包是否真实存在（供应链攻击）。',
      '日志中泄露敏感数据（token、密码、PII）。',
      '前端做了权限检查但后端没有，攻击者绕过前端直接调 API。',
      '对安全性过度自信——研究表明用 AI 的开发者更自信但代码更不安全。',
    ],
  },
  {
    id: 'debugging',
    icon: Bug,
    title: '调试与恢复',
    relatedTrack: 'debugging',
    summary: '五步分诊法 + 回滚优先策略，不在错误方向上堆砌修补。',
    overview:
      'AI 辅助开发中的调试与传统调试有本质区别：你不仅要修 bug，还要判断 bug 是你的逻辑错误还是 AI 的幻觉。核心原则是"回滚并重新构造 prompt"优于"在错误方向上继续修补"。CodeRabbit 对 470 个开源 PR 的分析发现，AI 生成的 PR 平均有 1.7 倍的问题数量，主要集中在异常处理薄弱和边界条件遗漏。',
    points: [
      {
        title: '五步分诊法',
        detail:
          '1. 用最小用例复现问题。2. 读 diff，隔离回归点——是哪次改动引入的？3. 添加轻量级日志或断言，缩小范围。4. 带约束地请求定向修复（不是"帮我修这个 bug"，而是"src/auth.ts:42 的 validateToken 在 UTC+8 时区下返回 false，只改这个函数"）。5. 如果修复循环超过 3 轮，回滚到最近的 checkpoint 并用新证据重新构造 prompt。',
        example: '第 1 步：点击"提交"→ 白屏（复现成功）\n第 2 步：git log --oneline -5 → 最近改了 SubmitForm.tsx\n第 3 步：console.log(formData) → id 字段为 undefined\n第 4 步：prompt: "SubmitForm.tsx:28 的 formData.id 为 undefined，原因是表单初始化时没有设置默认值。只改 initFormData 函数。"\n第 5 步：（如果还没修好）git checkout HEAD~1 -- src/components/SubmitForm.tsx',
        tips: '调试时最重要的信息是"什么时候还是好的"。找到最后一个正常工作的 commit，diff 就是你的线索。',
      },
      {
        title: 'AI 常见失败模式',
        detail:
          '幻觉依赖：引用不存在的 npm 包或 API。意图漂移：逐渐偏离原始需求，越改越远。大规模重写：用整文件替换掩盖回归。过度 prompt：逻辑越来越纠缠，不如重来。静默破坏：边界条件和错误状态悄悄失效。识别这些模式是高效调试的前提。',
        example: '幻觉依赖：AI 建议 import { useAuth } from \'next-auth/react-hooks\'（这个路径不存在）\n意图漂移：要求修一个按钮样式，AI 顺手重构了整个表单组件\n静默破坏：主流程正常，但空数据时不再显示 empty state',
      },
      {
        title: '回滚优先策略',
        detail:
          '当修复尝试超过 3 轮仍未解决时，停止在当前方向上继续。回滚到最近的稳定 checkpoint，用新收集的证据（错误日志、堆栈跟踪、行为观察）重新构造 prompt。这比在错误方向上堆砌修补高效得多。关键心态转变：回滚不是失败，而是用更好的信息重新开始。',
        tips: '每次回滚时记录"为什么这个方向不行"，这些信息是下一轮 prompt 的宝贵约束。',
      },
      {
        title: '失败行为验证',
        detail:
          'AI 生成的代码倾向于"happy path 英雄主义"——主流程完美但异常处理薄弱。必须验证：超时是否显式设置？重试是否有退避策略（而非重试风暴）？写操作和任务是否幂等（可安全重放）？错误消息是否泄露了敏感信息？依赖服务挂掉时会发生什么？',
        example: '验证清单：\n✅ API 调用设置了 5s 超时\n✅ 重试使用指数退避（1s, 2s, 4s）\n❌ 支付接口不是幂等的——重复提交会重复扣款！\n❌ 错误响应包含了数据库连接字符串',
      },
    ],
    practice:
      '练习：找一个你最近用 AI 修复的 bug，回顾整个过程。你花了几轮才修好？如果用五步分诊法，能否更快定位？如果在第 3 轮就回滚重来，是否能节省时间？',
    pitfalls: [
      '不复现就开始修，修的可能不是真正的问题。',
      '在错误方向上反复尝试，5 轮以上还不回滚。',
      '让 AI "帮我修这个 bug" 而不提供约束，导致大规模重写。',
      '只验证主流程，不测异常路径和边界条件。',
      '把 AI 的幻觉当成真实的 API 或依赖，浪费时间排查不存在的东西。',
      '添加 fallback 掩盖根因，制造技术债。',
    ],
  },
  {
    id: 'tooling',
    icon: Wrench,
    title: '工具链与环境',
    relatedTrack: 'refactoring',
    summary: '选对工具比写好 prompt 更重要，不同阶段用不同工具。',
    overview:
      'Vibe Coding 的工具生态在 2025-2026 年爆发式增长。工具选择直接决定了开发效率的上限。核心原则：用快速模型起草，用强模型审查，用测试验证一切。偏向能直接操作你将要发布的文件的工具——避免只能总结但不能修改文件的工具。2026 年 92% 的美国开发者每天使用 AI 编码工具，Collins 词典将 Vibe Coding 评为年度词汇。',
    points: [
      {
        title: '工具分类与选择',
        detail:
          'AI IDE（深度仓库感知）：Cursor、Windsurf、VS Code + Claude/Copilot——适合日常开发，能理解整个项目结构。CLI Agent（终端文件访问）：Claude Code、自定义脚本——适合自动化和批量操作。浏览器构建器（快速原型）：Bolt、Lovable、Replit Agent——适合 MVP 和概念验证。选择标准：工具能否直接操作你将要发布的代码文件？',
        example: '日常功能开发 → Cursor / VS Code + Claude\n快速原型验证 → Bolt / Replit Agent\n批量重构 / 自动化 → Claude Code CLI\n前端调试 → Chrome DevTools + AI 分析',
      },
      {
        title: '模型策略：快模型起草，强模型审查',
        detail:
          '不同任务用不同模型。快速模型（如 Haiku、GPT-4o-mini）适合代码补全、简单修改、格式化。强模型（如 Opus、GPT-4）适合架构设计、复杂调试、安全审查、代码评审。所有模型的输出都必须用测试验证——不要因为用了"最强模型"就跳过验证。',
        tips: '把模型当作不同级别的同事：初级同事（快模型）写初稿，高级同事（强模型）做审查，但最终决策权在你手里。',
      },
      {
        title: '开发环境配置',
        detail:
          '高效的 Vibe Coding 环境需要：版本控制（Git，频繁 commit）、代码搜索（rg/ripgrep，快速定位）、类型检查（TypeScript/mypy，即时反馈）、自动格式化（Prettier/Black，减少噪音 diff）、AI 配置文件（CLAUDE.md / .cursorrules，持久化项目约束）。这些工具的组合比任何单一 AI 工具都重要。',
        example: '最小环境清单：\n✅ Git + 频繁 checkpoint commit\n✅ ripgrep (rg) 代码搜索\n✅ TypeScript strict mode\n✅ Prettier 自动格式化\n✅ CLAUDE.md 项目约束文件\n✅ .env.example 环境变量模板',
      },
      {
        title: '何时用 AI vs 何时手写',
        detail:
          'AI 擅长：脚手架代码、CRUD 操作、样板文件、测试用例生成、文档起草、正则表达式、数据转换。人类擅长：架构决策、业务逻辑判断、安全审查、性能优化、用户体验设计、需求澄清。混合模式最高效：AI 生成初稿，人类审查和精炼。',
        example: 'AI 生成 → 人类审查：\n✅ React 组件脚手架 → 审查 props 设计\n✅ API 路由模板 → 审查认证和授权\n✅ 测试用例 → 审查边界条件覆盖\n✅ CSS 布局 → 审查响应式和可访问性',
      },
      {
        title: '流态保持：减少认知切换',
        detail:
          '研究表明上下文切换平均需要 23 分钟恢复，69% 的开发者每周因低效切换损失 8 小时以上。AI 工具通过自动导入管理、上下文感知补全、即时文档查询和模式识别来减少认知负载，帮助开发者保持心流状态。关键是让工具适应你的工作流，而不是反过来。',
        tips: '配置好 AI 的项目约束文件（如 CLAUDE.md），让它记住你的技术栈、代码风格和项目约定，避免每次都重复说明。',
      },
    ],
    practice:
      '练习：审视你当前的开发环境，列出你使用的所有工具。哪些工具之间有功能重叠？哪些环节缺少工具支持？尝试用本章的分类框架重新组织你的工具链。',
    pitfalls: [
      '用一个工具做所有事情，忽略不同工具的专长。',
      '追逐最新工具而不评估是否真的提升了效率。',
      '不配置项目约束文件，每次会话都要重复说明技术栈和约定。',
      '因为用了"最强模型"就跳过测试验证。',
      '工具链过于复杂，配置和维护成本超过了收益。',
      '忽略版本控制，AI 改坏了代码却无法回滚。',
    ],
  },
];
