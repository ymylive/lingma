import type { LucideIcon } from 'lucide-react';
import {
  BrainCircuit,
  GitBranch,
  MessageSquareQuote,
  ScrollText,
  Sparkles,
  TerminalSquare,
} from 'lucide-react';

export interface KnowledgePoint {
  title: string;
  detail: string;
  example?: string;
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
}

export const methodologyUnits: MethodologyUnit[] = [
  {
    id: 'core-loop',
    icon: BrainCircuit,
    title: '专业闭环',
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
      },
      {
        title: 'Gather：先定位再读取',
        detail:
          '不要盲目读文件。先用 rg --files 或 grep 定位相关代码，只读必要文件。这样既节省上下文窗口，又能快速建立对代码结构的理解。',
        example: 'rg "moduleCards" src/ → 定位到 VibeCodingLab.tsx:112\n只读该文件的 112-140 行，而非整个文件。',
      },
      {
        title: 'Implement：小步实现，最小 diff',
        detail:
          '每次只改一小步，保持 diff 可审查、可回滚。不要一次性重构整个文件。如果改动超过 200 行或 5 个文件，先拆分再实施。',
        example: '第一步：新建数据文件 methodologyUnits.ts\n第二步：新建 MethodologyGuide 组件\n第三步：替换 VibeCodingLab 中的渲染\n每步独立可验证。',
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
      },
    ],
    practice:
      '练习：选一个你最近完成的编码任务，回顾它是否经过了完整的 D-G-I-V-D 五步。找出你跳过了哪一步，思考如果补上会有什么不同。',
    pitfalls: [
      '跳过 Define 直接写代码，导致方向偏移后大量返工。',
      'Gather 阶段读太多无关文件，浪费上下文窗口。',
      '一次性提交大量改动，出问题时无法定位是哪一步引入的。',
      '验证只跑 happy path，忽略边界和异常场景。',
    ],
  },
  {
    id: 'skills',
    icon: Sparkles,
    title: 'Skills',
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
    ],
    practice:
      '练习：拿你最近写的一个 prompt，用四要素框架重写它。对比重写前后，AI 的输出质量有什么变化？',
    pitfalls: [
      '只写目标不写边界，AI 过度发挥引入不需要的改动。',
      '验证标准模糊（"应该没问题"），无法判断是否真的完成。',
      '追求华丽措辞而忽略结构化表达，本末倒置。',
      '不指定输出格式，每次交付物结构不一致。',
    ],
  },
  {
    id: 'swarm',
    icon: GitBranch,
    title: 'AI 蜂群',
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
    ],
    practice:
      '练习：选一个你认为"太大"的功能需求，尝试把它拆成 3-5 个互不重叠的子任务。检查：每个子任务能否独立验证？是否有文件重叠？',
    pitfalls: [
      '多个 agent 同时修改同一个文件，导致合并冲突。',
      '子任务之间有隐式依赖，一个完成前另一个无法开始。',
      '对简单任务使用蜂群，协调成本远超收益。',
      '不做质量门控就合并，引入回归 bug。',
    ],
  },
  {
    id: 'writing',
    icon: ScrollText,
    title: '写作规范',
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
    ],
    practice:
      '练习：找一段你之前写的技术说明或 PR 描述，用"结论先行"原则重写第一段。对比重写前后，信息传达效率提升了多少？',
    pitfalls: [
      '长篇铺垫后才给结论，读者早已失去耐心。',
      '引用代码不给文件路径和行号，读者无法定位。',
      '把推测当事实陈述，误导读者做出错误决策。',
      '交付物格式每次不同，审查者需要重新适应。',
    ],
  },
];
