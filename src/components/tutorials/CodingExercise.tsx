import { useState } from 'react';
import { runTestCases, quickRun, type TestResult } from '../../services/judgeService';
import { useUser } from '../../contexts/UserContext';

type Lang = 'c' | 'cpp' | 'java' | 'python';
type LangTemplates = { cpp: string; java: string; python: string; c?: string };

interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
}

interface CodingExerciseProps {
  exerciseId?: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string;
  templates: LangTemplates;
  solutions: LangTemplates;
  testCases: TestCase[];
  hints?: string[];
  explanation?: string;
}

const LANG_NAMES: Record<Lang, string> = { c: 'C', cpp: 'C++', java: 'Java', python: 'Python' };
const LANG_ICONS: Record<Lang, string> = { c: '🔧', cpp: '⚙️', java: '☕', python: '🐍' };

const DIFFICULTY_CONFIG = {
  easy: { text: '简单', color: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300', stars: '⭐' },
  medium: { text: '中等', color: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300', stars: '⭐⭐' },
  hard: { text: '困难', color: 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300', stars: '⭐⭐⭐' },
};

export default function CodingExercise({
  exerciseId,
  title,
  description,
  difficulty,
  category,
  templates: _templates,
  solutions,
  testCases,
  hints = [],
  explanation,
}: CodingExerciseProps) {
  const { recordExerciseComplete } = useUser();
  const availableLangs = (['c', 'cpp', 'java', 'python'] as Lang[]).filter(l => solutions[l]); // 支持c/cpp/java/python
  const [lang, setLang] = useState<Lang>(availableLangs[0] || 'c');
  const [code, setCode] = useState('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [runOutput, setRunOutput] = useState<string | null>(null);

  const handleLangChange = (newLang: Lang) => {
    if (!solutions[newLang]) return;
    if (!code.trim() || confirm('切换语言将清空代码，确定吗？')) {
      setLang(newLang);
      setCode('');
      setResults([]);
      setSubmitted(false);
      setRunOutput(null);
    }
  };

  // 真实判题
  const validateCode = async () => {
    if (!code.trim()) {
      alert('请先编写代码');
      return;
    }
    
    setIsRunning(true);
    setSubmitted(false);
    setResults([]);
    setRunOutput(null);

    try {
      const testResults = await runTestCases(code, lang, testCases);
      setResults(testResults);
      setSubmitted(true);
      
      // 如果全部通过，记录做题完成
      const allPassed = testResults.every(r => r.passed);
      if (allPassed && exerciseId) {
        recordExerciseComplete(exerciseId, title, category || '', true);
      }
    } catch (error) {
      alert(`判题失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsRunning(false);
    }
  };

  // 快速运行
  const handleQuickRun = async () => {
    if (!code.trim()) {
      alert('请先编写代码');
      return;
    }

    setIsRunning(true);
    setRunOutput(null);

    try {
      const result = await quickRun(code, lang, testCases[0]?.input || '');
      if (result.error) {
        setRunOutput(`❌ 错误:\n${result.error}`);
      } else {
        setRunOutput(`✅ 输出:\n${result.output}\n\n⏱️ 运行时间: ${result.time || 0}ms`);
      }
    } catch (error) {
      setRunOutput(`❌ 运行失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode('');
    setResults([]);
    setSubmitted(false);
    setShowSolution(false);
    setRunOutput(null);
  };

  const allPassed = results.length > 0 && results.every(r => r.passed);
  const dc = DIFFICULTY_CONFIG[difficulty];

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
      {/* 题目头部 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💻</span>
            <div>
              <h3 className="text-white font-bold text-lg">{title}</h3>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${dc.color}`}>
                {dc.stars} {dc.text}
              </span>
            </div>
          </div>
          {/* 语言选择 - 只显示有模板的语言 */}
          <div className="flex flex-wrap gap-2">
            {availableLangs.map(l => (
              <button
                key={l}
                onClick={() => handleLangChange(l)}
                className={`min-h-[44px] cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  lang === l
                    ? 'bg-white text-indigo-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {LANG_ICONS[l]} {LANG_NAMES[l]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 题目描述 */}
      <div className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-6">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">📋 题目描述</h4>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">{description}</p>
        
        {/* 测试用例 */}
        <div className="mt-4">
          <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">测试用例：</h5>
          <div className="space-y-2">
            {testCases.slice(0, 2).map((tc, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700 text-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">输入：</span>
                    <code className="ml-2 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-indigo-600 dark:text-indigo-400">{tc.input}</code>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">输出：</span>
                    <code className="ml-2 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-emerald-600 dark:text-emerald-400">{tc.expectedOutput}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 代码编辑器 */}
      <div className="p-4 sm:p-6">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h4 className="font-medium text-slate-800 dark:text-slate-200">✏️ 编写代码 ({LANG_NAMES[lang]})</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={resetCode}
              className="min-h-[44px] cursor-pointer rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            >
              🔄 重置
            </button>
            {hints.length > 0 && (
              <button
                onClick={() => setShowHints(!showHints)}
                className="min-h-[44px] cursor-pointer rounded-lg bg-amber-100 px-3 py-1.5 text-sm text-amber-700 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:hover:bg-amber-800"
              >
                💡 提示
              </button>
            )}
          </div>
        </div>

        {/* 提示 */}
        {showHints && hints.length > 0 && (
          <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <h5 className="font-medium text-amber-800 dark:text-amber-200 mb-2">💡 提示：</h5>
            <ul className="list-disc list-inside text-sm text-amber-700 dark:text-amber-300 space-y-1">
              {hints.map((hint, i) => (
                <li key={i}>{hint}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 代码输入 */}
        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          className="w-full h-64 p-4 bg-slate-900 text-slate-100 font-mono text-sm rounded-lg border-2 border-slate-700 focus:border-indigo-500 focus:outline-none resize-none"
          spellCheck={false}
        />

        {/* 操作按钮 */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleQuickRun}
            disabled={isRunning}
            className="min-h-[44px] cursor-pointer rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {isRunning ? '⏳' : '▶️'} 运行
          </button>
          <button
            onClick={validateCode}
            disabled={isRunning}
            className="min-h-[44px] flex-1 cursor-pointer rounded-lg bg-indigo-600 py-3 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            {isRunning ? '⏳ 判题中...' : '📤 提交判题'}
          </button>
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="min-h-[44px] cursor-pointer rounded-lg bg-slate-100 px-4 py-3 font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
          >
            👀 答案
          </button>
        </div>

        {/* 运行输出 */}
        {runOutput && (
          <div className="mt-4 p-4 bg-slate-900 rounded-lg">
            <pre className="text-sm text-slate-100 whitespace-pre-wrap font-mono">{runOutput}</pre>
          </div>
        )}

        {/* 判题结果 */}
        {submitted && results.length > 0 && (
          <div className={`mt-4 p-4 rounded-lg ${allPassed ? 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800'}`}>
            <h5 className={`font-medium mb-3 ${allPassed ? 'text-emerald-800 dark:text-emerald-200' : 'text-rose-800 dark:text-rose-200'}`}>
              {allPassed ? '🎉 全部通过！' : `❌ 通过 ${results.filter(r => r.passed).length}/${results.length}`}
            </h5>
            <div className="space-y-2">
              {results.map((r, i) => (
                <div key={i} className={`p-2 rounded ${r.passed ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-rose-100 dark:bg-rose-900/50'}`}>
                  <div className={`text-sm font-medium ${r.passed ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
                    {r.passed ? '✅' : '❌'} 测试 {i + 1}: {r.status}
                    {r.time && <span className="ml-2 opacity-70">({r.time}ms)</span>}
                  </div>
                  {!r.passed && (
                    <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                      <div>输入: <code className="bg-black/10 px-1 rounded">{r.input || '(空)'}</code></div>
                      <div>期望: <code className="bg-black/10 px-1 rounded">{r.expectedOutput || '(空)'}</code></div>
                      <div>实际: <code className="bg-black/10 px-1 rounded">{r.actualOutput || '(空)'}</code></div>
                      {r.error && <div className="text-rose-600">错误: {r.error}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 参考答案 */}
        {showSolution && (
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
            <h5 className="font-medium text-slate-800 dark:text-slate-200 mb-2">📝 参考答案 ({LANG_NAMES[lang]})：</h5>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              {solutions[lang]}
            </pre>
            {explanation && (
              <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <h6 className="font-medium text-indigo-800 dark:text-indigo-200 mb-1">💬 解题思路：</h6>
                <p className="text-sm text-indigo-700 dark:text-indigo-300">{explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 填空题组件
interface BlankItem {
  id: string;
  answer: string;
  hint?: string;
}

interface FillInBlankProps {
  exerciseId?: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string;
  codeTemplate: LangTemplates;  // 用 ___BLANK_ID___ 表示填空位置
  blanks: BlankItem[];
  explanation?: string;
}

export function FillInBlank({
  exerciseId,
  title,
  description,
  difficulty,
  category,
  codeTemplate,
  blanks,
  explanation,
}: FillInBlankProps) {
  const { recordExerciseComplete } = useUser();
  // 获取可用语言列表
  const availableLangs = (['c', 'cpp', 'java', 'python'] as Lang[]).filter(l => codeTemplate[l]);
  const [lang, setLang] = useState<Lang>(availableLangs[0] || 'cpp');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    setSubmitted(false);
  };

  const checkAnswers = () => {
    const newResults: Record<string, boolean> = {};
    blanks.forEach(blank => {
      const userAnswer = (answers[blank.id] || '').trim().replace(/\s+/g, '');
      const correctAnswer = blank.answer.trim().replace(/\s+/g, '');
      // 支持多个正确答案（用 | 分隔）
      const correctOptions = correctAnswer.split('|').map(s => s.trim());
      newResults[blank.id] = correctOptions.some(opt => 
        userAnswer.toLowerCase() === opt.toLowerCase()
      );
    });
    setResults(newResults);
    setSubmitted(true);
    
    // 如果全部正确，记录做题完成
    const allCorrect = blanks.every(b => newResults[b.id]);
    if (allCorrect && exerciseId) {
      recordExerciseComplete(exerciseId, title, category || '', true);
    }
  };

  const resetAll = () => {
    setAnswers({});
    setResults({});
    setSubmitted(false);
  };

  const allCorrect = submitted && blanks.every(b => results[b.id]);
  const dc = DIFFICULTY_CONFIG[difficulty];

  // 渲染带填空的代码
  const renderCodeWithBlanks = () => {
    const code = codeTemplate[lang] || '';
    const lines = code.split('\n');
    
    return lines.map((line, lineIdx) => {
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      const regex = /___(\w+)___/g;
      let match;
      
      while ((match = regex.exec(line)) !== null) {
        // 添加匹配前的文本
        if (match.index > lastIndex) {
          parts.push(
            <span key={`text-${lineIdx}-${lastIndex}`} className="text-slate-300">
              {line.slice(lastIndex, match.index)}
            </span>
          );
        }
        
        const blankId = match[1];
        const blank = blanks.find(b => b.id === blankId);
        const isCorrect = results[blankId];
        const hasSubmitted = submitted && blankId in results;
        
        // 根据答案长度或提示长度动态计算宽度（中文字符算2个宽度）
        const getTextWidth = (text: string) => {
          let width = 0;
          for (const char of text || '') {
            width += /[\u4e00-\u9fa5]/.test(char) ? 2 : 1;
          }
          return width;
        };
        const answerWidth = getTextWidth(blank?.answer || '');
        const hintWidth = getTextWidth(blank?.hint || '');
        const inputWidth_calc = getTextWidth(answers[blankId] || '');
        const maxChars = Math.max(answerWidth, hintWidth, inputWidth_calc, 10);
        const inputWidth = Math.min(Math.max(maxChars * 9, 120), 400);
        
        parts.push(
          <span key={`blank-${lineIdx}-${blankId}`} className="inline-flex items-center mx-1">
            <input
              type="text"
              value={answers[blankId] || ''}
              onChange={e => handleAnswerChange(blankId, e.target.value)}
              placeholder={blank?.hint || '填写代码'}
              style={{ width: `${inputWidth}px` }}
              className={`px-2 py-1 rounded text-sm font-mono border-2 transition-all ${
                hasSubmitted
                  ? isCorrect
                    ? 'bg-emerald-900/50 border-emerald-500 text-emerald-300'
                    : 'bg-rose-900/50 border-rose-500 text-rose-300'
                  : 'bg-slate-700 border-slate-500 text-white focus:border-indigo-400'
              }`}
              disabled={submitted && isCorrect}
            />
            {hasSubmitted && (
              <span className="ml-1">
                {isCorrect ? '✅' : '❌'}
              </span>
            )}
          </span>
        );
        
        lastIndex = match.index + match[0].length;
      }
      
      // 添加剩余文本
      if (lastIndex < line.length) {
        parts.push(
          <span key={`text-${lineIdx}-end`} className="text-slate-300">
            {line.slice(lastIndex)}
          </span>
        );
      }
      
      return (
        <div key={lineIdx} className="py-0.5 flex items-center">
          <span className="text-slate-600 w-8 text-right mr-3 select-none text-xs">{lineIdx + 1}</span>
          <span className="flex-1 flex items-center flex-wrap">{parts.length > 0 ? parts : <span className="text-slate-300">{line || ' '}</span>}</span>
        </div>
      );
    });
  };

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✏️</span>
            <div>
              <h3 className="text-white font-bold text-lg">{title}</h3>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${dc.color}`}>
                {dc.stars} {dc.text} · 填空题
              </span>
            </div>
          </div>
          {/* 语言选择 - 只显示有模板的语言 */}
          <div className="flex flex-wrap gap-2">
            {availableLangs.map(l => (
              <button
                key={l}
                onClick={() => { setLang(l); resetAll(); }}
                className={`min-h-[44px] cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  lang === l
                    ? 'bg-white text-emerald-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {LANG_ICONS[l]} {LANG_NAMES[l]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 题目描述 */}
      <div className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-6">
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
      </div>

      {/* 代码填空区 */}
      <div className="p-4 sm:p-6">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3">📝 填写空白处的代码：</h4>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          {renderCodeWithBlanks()}
        </div>

        {/* 操作按钮 */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={checkAnswers}
            disabled={Object.keys(answers).length === 0}
            className="min-h-[44px] flex-1 cursor-pointer rounded-lg bg-emerald-600 py-3 font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            ✓ 检查答案
          </button>
          <button
            onClick={resetAll}
            className="min-h-[44px] cursor-pointer rounded-lg bg-slate-100 px-6 py-3 font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
          >
            🔄 重置
          </button>
        </div>

        {/* 结果 */}
        {submitted && (
          <div className={`mt-4 p-4 rounded-lg ${allCorrect ? 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800'}`}>
            {allCorrect ? (
              <div className="text-emerald-800 dark:text-emerald-200">
                <span className="font-bold">🎉 完全正确！</span>
                <p className="text-sm mt-1">你已经掌握了这个知识点！</p>
              </div>
            ) : (
              <div className="text-amber-800 dark:text-amber-200">
                <span className="font-bold">💪 继续加油！</span>
                <p className="text-sm mt-1">
                  正确 {blanks.filter(b => results[b.id]).length} / {blanks.length} 个空
                </p>
              </div>
            )}
          </div>
        )}

        {/* 解释 */}
        {submitted && explanation && (
          <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h5 className="font-medium text-indigo-800 dark:text-indigo-200 mb-1">💬 解析：</h5>
            <p className="text-sm text-indigo-700 dark:text-indigo-300 whitespace-pre-line">{explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
