const TYPE_LABELS = {
  wrong_answer: { zh: '答案错误', en: 'Wrong Answer' },
  runtime_error: { zh: '运行错误', en: 'Runtime Error' },
  compile_error: { zh: '编译错误', en: 'Compile Error' },
  time_limit_exceeded: { zh: '超时', en: 'Time Limit Exceeded' },
  output_limit_exceeded: { zh: '输出超限', en: 'Output Limit Exceeded' },
} as const;

const LABELS = {
  zh: {
    checkpoint: '检查点',
    issue: '问题',
    input: '输入',
    expectedOutput: '期望输出',
    actualOutput: '实际输出',
    type: '问题类型',
  },
  en: {
    checkpoint: 'Checkpoint',
    issue: 'Issue',
    input: 'Input',
    expectedOutput: 'Expected Output',
    actualOutput: 'Actual Output',
    type: 'Type',
  },
} as const;

function unescapeReviewText(value?: string): string {
  return String(value || '')
    .replace(/\\r/g, '')
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .trim();
}

function readQuotedToken(source: string, start: number) {
  const quote = source[start];
  if (quote !== '"' && quote !== '\'') {
    return null;
  }

  let index = start + 1;
  let value = '';
  let escaped = false;

  while (index < source.length) {
    const char = source[index];
    if (escaped) {
      value += char;
      escaped = false;
      index += 1;
      continue;
    }
    if (char === '\\') {
      escaped = true;
      index += 1;
      continue;
    }
    if (char === quote) {
      return { value, next: index + 1 };
    }
    value += char;
    index += 1;
  }

  return null;
}

function readBareToken(source: string, start: number, delimiters: string[]) {
  let index = start;
  while (index < source.length && !delimiters.includes(source[index])) {
    index += 1;
  }
  const value = source.slice(start, index).trim();
  if (!value) {
    return null;
  }
  return { value, next: index };
}

function skipWhitespace(source: string, start: number) {
  let index = start;
  while (index < source.length && /\s/.test(source[index])) {
    index += 1;
  }
  return index;
}

function parseLooseObject(raw: string): Record<string, string> | null {
  const source = raw.trim();
  if (!source.startsWith('{') || !source.endsWith('}')) {
    return null;
  }

  const result: Record<string, string> = {};
  let index = 1;

  while (index < source.length - 1) {
    index = skipWhitespace(source, index);
    if (source[index] === ',') {
      index += 1;
      continue;
    }
    if (source[index] === '}') {
      break;
    }

    const keyToken =
      readQuotedToken(source, index) ||
      readBareToken(source, index, [':']);
    if (!keyToken) {
      return null;
    }
    index = skipWhitespace(source, keyToken.next);
    if (source[index] !== ':') {
      return null;
    }

    index = skipWhitespace(source, index + 1);
    const valueToken =
      readQuotedToken(source, index) ||
      readBareToken(source, index, [',', '}']);
    if (!valueToken) {
      return null;
    }

    result[keyToken.value.trim()] = unescapeReviewText(valueToken.value);
    index = valueToken.next;
  }

  return Object.keys(result).length > 0 ? result : null;
}

function splitCompositeReviewItem(item?: string): string[] {
  const source = unescapeReviewText(item);
  if (!source) {
    return [];
  }

  if (!/^\s*-\s*\{/.test(source) && !/\n\s*-\s*\{/.test(source)) {
    return [source.replace(/^\s*-\s+/, '').trim()];
  }

  return source
    .split(/\n\s*-\s*(?=\{)/)
    .map((part, index) => (index === 0 ? part.replace(/^\s*-\s+/, '') : part).trim())
    .filter(Boolean);
}

function pickStructuredValue(record: Record<string, string>, ...keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (value) {
      return value;
    }
  }
  return '';
}

function formatLabeledLine(label: string, value: string, isEnglish = false) {
  return isEnglish ? `${label}: ${value}` : `${label}：${value}`;
}

function formatLabeledBlock(label: string, value: string, isEnglish = false) {
  return isEnglish ? `${label}:\n${value}` : `${label}：\n${value}`;
}

function formatStructuredReviewItem(record: Record<string, string>, isEnglish = false): string {
  const labels = isEnglish ? LABELS.en : LABELS.zh;
  const checkpoint = pickStructuredValue(record, 'checkpoint', 'checkpointTitle', 'description');
  const message = pickStructuredValue(record, 'message', 'feedbackMessage', 'feedbackHint');
  const input = pickStructuredValue(record, 'input');
  const expectedOutput = pickStructuredValue(record, 'expectedOutput', 'expected_output');
  const actualOutput = pickStructuredValue(record, 'actualOutput', 'actual_output');
  const typeKey = pickStructuredValue(record, 'type').toLowerCase();
  const typeLabel =
    typeKey && typeKey in TYPE_LABELS
      ? TYPE_LABELS[typeKey as keyof typeof TYPE_LABELS][isEnglish ? 'en' : 'zh']
      : pickStructuredValue(record, 'type');

  const lines: string[] = [];
  if (checkpoint) {
    lines.push(formatLabeledLine(labels.checkpoint, checkpoint, isEnglish));
  } else if (typeLabel) {
    lines.push(formatLabeledLine(labels.type, typeLabel, isEnglish));
  }
  if (message) {
    lines.push(formatLabeledLine(labels.issue, message, isEnglish));
  }
  if (input) {
    lines.push(formatLabeledBlock(labels.input, input, isEnglish));
  }
  if (expectedOutput) {
    lines.push(formatLabeledBlock(labels.expectedOutput, expectedOutput, isEnglish));
  }
  if (actualOutput) {
    lines.push(formatLabeledBlock(labels.actualOutput, actualOutput, isEnglish));
  }

  return lines.join('\n').trim();
}

function formatSingleReviewItem(item?: string, isEnglish = false): string {
  const source = unescapeReviewText(item);
  if (!source) {
    return '';
  }

  const parsed = parseLooseObject(source);
  if (!parsed) {
    return source.replace(/^\s*-\s+/, '').trim();
  }

  return formatStructuredReviewItem(parsed, isEnglish) || source.replace(/^\s*-\s+/, '').trim();
}

export function formatAiReviewItem(item?: string, isEnglish = false): string {
  const [firstItem] = splitCompositeReviewItem(item);
  return formatSingleReviewItem(firstItem, isEnglish);
}

export function formatAiReviewItems(items: string[] = [], isEnglish = false): string[] {
  return items
    .flatMap((item) => splitCompositeReviewItem(item))
    .map((item) => formatSingleReviewItem(item, isEnglish))
    .filter(Boolean);
}
