import { isEnglishRuntimeLocale, localizeRuntimeText, pickRuntimeText } from '../utils/runtimeLocale';
import { getConfiguredModelOverride } from './aiService';

const DEFAULT_PROXY_ORIGIN =
  typeof window !== 'undefined' && window.location ? window.location.origin : 'https://lingma.cornna.xyz';

const AI_PROXY_URL = import.meta.env.DEV
  ? 'http://localhost:3001/api/ai'
  : (import.meta.env.VITE_AI_PROXY_URL || `${DEFAULT_PROXY_ORIGIN}/api/ai`);

export interface MindMapNode {
  id: string;
  title: string;
  note?: string;
  collapsed?: boolean;
  children: MindMapNode[];
}

export interface MindMapData {
  id: string;
  title: string;
  source: {
    type: 'topic' | 'url' | 'file';
    value: string;
    title?: string;
  };
  nodes: MindMapNode[];
  createdAt: string;
  updatedAt: string;
}

export type MindMapGenerateMode = 'full' | 'explore';

interface MindMapPromptInput {
  title: string;
  sourceType: 'topic' | 'url' | 'file';
  sourceText: string;
  sourceTitle?: string;
  personalContext?: string;
  existingMap?: MindMapData | null;
  generationMode?: MindMapGenerateMode;
}

interface ExpandNodeNoteInput {
  mapTitle: string;
  nodeTitle: string;
  existingNote?: string;
  parentTitle?: string;
  siblingTitles?: string[];
  childTitles?: string[];
  mode?: 'replace' | 'append';
}

function getMindMapOutputLanguageLabel() {
  return isEnglishRuntimeLocale() ? 'English' : '中文';
}

function getMindMapOutputInstruction() {
  return isEnglishRuntimeLocale()
    ? 'All user-facing fields must be written in English.'
    : '所有用户可见字段都必须使用中文。';
}

function getMindMapDefaultTitle() {
  return pickRuntimeText('学习主题', 'Study Topic');
}

function extractJson(text: string) {
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first === -1 || last === -1 || last <= first) {
    throw new Error(pickRuntimeText('AI 未返回有效 JSON', 'AI did not return valid JSON'));
  }
  const jsonText = text.slice(first, last + 1);
  return JSON.parse(jsonText);
}

function buildSystemPrompt() {
  if (isEnglishRuntimeLocale()) {
    return [
      'You are a professional knowledge architect and mind-map editor.',
      'Turn the source material into a clear, well-structured, editable mind map.',
      'Output must be strict JSON only, with no markdown or extra explanation.',
      `Output language: ${getMindMapOutputLanguageLabel()}. ${getMindMapOutputInstruction()}`,
    ].join(' ');
  }

  return [
    '你是一位专业的知识架构师与思维导图编辑专家。',
    '任务是把材料整理成结构清晰、层级合理、可编辑的思维导图。',
    '输出必须是严格 JSON，不要包含任何解释性文字或 Markdown。',
    `输出语言：${getMindMapOutputLanguageLabel()}。${getMindMapOutputInstruction()}`,
  ].join('');
}

function buildUserPrompt(input: MindMapPromptInput) {
  const sourceLabel = input.sourceType === 'topic'
    ? pickRuntimeText('主题', 'Topic')
    : input.sourceType === 'url'
      ? pickRuntimeText('网页资料', 'Web Source')
      : pickRuntimeText('上传文件', 'Uploaded File');

  const personalization = input.personalContext
    ? isEnglishRuntimeLocale()
      ? `\n\n[Learner Profile]\n${input.personalContext}\nReflect what is already mastered vs. what still needs work through node titles or notes.`
      : `\n\n【学习者画像】\n${input.personalContext}\n请在导图中体现“已掌握/待学习”的脉络（可通过节点标题或 note 提示）。`
    : '';
  const generationMode = input.generationMode || 'full';
  const modePrompt =
    generationMode === 'explore'
      ? pickRuntimeText(
        '生成模式：探索模式。请只给结构和关键标题，不要写具体知识点内容；每个节点 note 必须留空字符串。',
        'Generation mode: explore. Return only structure and key titles; do not write detailed knowledge points, and keep every node note as an empty string.',
      )
      : pickRuntimeText(
        '生成模式：完整模式。可提供简洁实用的 note 说明。',
        'Generation mode: full. Short practical notes are allowed.',
      );

  if (input.existingMap) {
    if (isEnglishRuntimeLocale()) {
      return [
        'Update the existing mind map using the new material.',
        'Preserve existing node id, title, and note whenever reasonable; add required nodes, merge duplicates, and remove irrelevant content.',
        'Keep the structure clear with depth 2-4 and about 20-60 nodes depending on the material.',
        'Each node must include id, title, children, and note. Keep children as an empty array when there are no child nodes.',
        '',
        `[Existing Mind Map JSON]\n${JSON.stringify(input.existingMap)}`,
        '',
        `[${sourceLabel}]\n${input.sourceText.slice(0, 20000)}`,
        personalization,
        modePrompt,
        `Output language requirement: ${getMindMapOutputInstruction()}`,
        '',
        'Return only the full updated JSON:',
        '{ "title": "...", "nodes": [ { "id": "...", "title": "...", "note": "", "children": [] } ] }',
      ].join('\n');
    }

    return [
      '请基于新材料更新已有思维导图。',
      '要求尽量保留原有节点的 id、title、note；新增必要节点，合并重复，删除无关内容。',
      '保持结构清晰，层级深度 2~4，节点总数 20~60（根据材料调整）。',
      '每个节点必须包含 id、title、children、note 字段，children 为空数组也要保留。',
      '',
      `【已有导图 JSON】\n${JSON.stringify(input.existingMap)}`,
      '',
      `【${sourceLabel}】\n${input.sourceText.slice(0, 20000)}`,
      personalization,
      modePrompt,
      `输出语言要求：${getMindMapOutputInstruction()}`,
      '',
      '请仅输出更新后的完整 JSON：',
      '{ "title": "...", "nodes": [ { "id": "...", "title": "...", "note": "", "children": [] } ] }'
    ].join('\n');
  }

  if (isEnglishRuntimeLocale()) {
    return [
      'Generate a mind map from the source material.',
      'Requirements: structure depth 2-4, around 20-60 nodes depending on the material, and concise but information-dense titles.',
      'Each node must include id, title, children, and note. Keep children as an empty array when there are no child nodes.',
      'Use short unique alphanumeric ids.',
      '',
      `[Mind Map Title] ${input.title || input.sourceTitle || getMindMapDefaultTitle()}`,
      `[${sourceLabel}]\n${input.sourceText.slice(0, 20000)}`,
      personalization,
      modePrompt,
      `Output language requirement: ${getMindMapOutputInstruction()}`,
      '',
      'Return JSON only:',
      '{ "title": "...", "nodes": [ { "id": "...", "title": "...", "note": "", "children": [] } ] }',
    ].join('\n');
  }

  return [
    '请根据材料生成思维导图。',
    '要求：层级深度 2~4；节点总数 20~60（根据材料调整）；标题简洁有信息密度。',
    '每个节点必须包含 id、title、children、note 字段，children 为空数组也要保留。',
    'id 使用短小字母数字组合，保持唯一。',
    '',
    `【导图标题】${input.title || input.sourceTitle || getMindMapDefaultTitle()}`,
    `【${sourceLabel}】\n${input.sourceText.slice(0, 20000)}`,
    personalization,
    modePrompt,
    `输出语言要求：${getMindMapOutputInstruction()}`,
    '',
    '请仅输出 JSON：',
    '{ "title": "...", "nodes": [ { "id": "...", "title": "...", "note": "", "children": [] } ] }'
  ].join('\n');
}

const createNodeId = () =>
  `${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;

function parseCollapsedValue(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'off', ''].includes(normalized)) return false;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  return false;
}

const sanitizeMindMapNodes = (
  nodes: unknown,
  generationMode: MindMapGenerateMode,
  usedIds: Set<string>,
  path = 'nodes',
): MindMapNode[] => {
  if (!Array.isArray(nodes)) {
    throw new Error(pickRuntimeText(`AI 返回的导图结构无效：${path} 必须是数组`, `AI map payload is invalid: ${path} must be an array`));
  }

  return nodes.map((node, index) => {
    const raw = (node || {}) as Partial<MindMapNode>;
    const title = String(raw.title || '').trim() || pickRuntimeText(`节点 ${index + 1}`, `Node ${index + 1}`);
    let id = String(raw.id || '').trim() || createNodeId();
    if (usedIds.has(id)) {
      id = createNodeId();
    }
    usedIds.add(id);
    const children = sanitizeMindMapNodes(raw.children ?? [], generationMode, usedIds, `${path}[${index}].children`);
    const note =
      generationMode === 'explore'
        ? ''
        : typeof raw.note === 'string'
          ? raw.note.trim()
          : '';

    return {
      id,
      title,
      note,
      collapsed: parseCollapsedValue(raw.collapsed),
      children,
    };
  });
};

async function callAI(messages: { role: 'system' | 'user'; content: string }[]) {
  const modelOverride = getConfiguredModelOverride();
  const response = await fetch(AI_PROXY_URL, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(modelOverride ? { messages, model: modelOverride } : { messages }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text ? localizeRuntimeText(text) : pickRuntimeText(`AI 请求失败: ${response.status}`, `AI request failed: ${response.status}`));
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || '';
  if (!content) {
    throw new Error(pickRuntimeText('AI 返回内容为空', 'AI returned empty content'));
  }
  return content as string;
}

export async function generateMindMap(input: MindMapPromptInput) {
  const generationMode = input.generationMode || 'full';
  const messages = [
    { role: 'system' as const, content: buildSystemPrompt() },
    { role: 'user' as const, content: buildUserPrompt(input) },
  ];

  const content = await callAI(messages);
  const parsed = extractJson(content) as { title?: string; nodes?: unknown };
  const title = String(parsed?.title || input.title || input.sourceTitle || getMindMapDefaultTitle()).trim() || getMindMapDefaultTitle();
  const nodes = sanitizeMindMapNodes(parsed?.nodes, generationMode, new Set());
  if (!nodes.length) {
    throw new Error(pickRuntimeText('AI 返回的导图节点为空', 'AI map payload returned no nodes'));
  }
  return { title, nodes };
}

function buildNodeExpandPrompt(input: ExpandNodeNoteInput) {
  const siblingText = (input.siblingTitles || []).slice(0, 6).join(' / ') || '(none)';
  const childText = (input.childTitles || []).slice(0, 8).join(' / ') || '(none)';
  const currentNote = (input.existingNote || '').trim() || '(empty)';
  const parentText = (input.parentTitle || '').trim() || 'root';
  const mode = input.mode || 'replace';
  const modeRequirement =
    mode === 'append'
      ? 'Generate incremental content only. Do not repeat existing note sentences.'
      : 'Generate a full polished note that can fully replace the existing note.';

  return [
    'Task: expand one mind-map node note for learning and review.',
    '',
    `Map title: ${input.mapTitle}`,
    `Parent node: ${parentText}`,
    `Current node: ${input.nodeTitle}`,
    `Sibling nodes: ${siblingText}`,
    `Child nodes: ${childText}`,
    `Current note: ${currentNote}`,
    '',
    'Requirements:',
    `1) Output must be in ${getMindMapOutputLanguageLabel()}.`,
    '2) Keep structure clear and practical.',
    '3) Include: core idea, key points, pitfalls or practice tips.',
    isEnglishRuntimeLocale()
      ? '4) Keep the note concise, around 2-4 short lines.'
      : '4) 保持在约 90-220 个中文字符内，分成 2-4 行短句。',
    `5) ${modeRequirement}`,
    '6) No markdown title, no code block, no extra wrapper.',
    '',
    'Return JSON only: {"note":"..."}',
  ].join('\n');
}

export async function expandMindMapNodeNote(input: ExpandNodeNoteInput) {
  const messages = [
    {
      role: 'system' as const,
      content:
        'You are a rigorous learning coach. Output JSON only, no explanation. Required format: {"note":"..."}.',
    },
    { role: 'user' as const, content: buildNodeExpandPrompt(input) },
  ];

  const content = await callAI(messages);
  const parsed = extractJson(content) as { note?: string };
  const note = String(parsed?.note || '').trim();
  if (!note) {
    throw new Error(pickRuntimeText('AI 未返回有效扩写内容', 'AI did not return a valid note'));
  }
  return { note: note.slice(0, 1200) };
}
