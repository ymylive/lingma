import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { quickRun, runTestCases, type JudgeResponse, type SupportedJudgeLanguage, type TestCase } from '../../services/judgeService';
import { useUser } from '../../contexts/UserContext';
import { useI18n } from '../../contexts/I18nContext';
import type { ExerciseDifficulty } from '../../data/exercises';

type Lang = SupportedJudgeLanguage;
type LangTemplates = Partial<Record<Lang, string>>;

interface CodingExerciseProps {
  exerciseId?: string;
  title: string;
  description: string;
  difficulty: ExerciseDifficulty;
  category?: string;
  templates: LangTemplates;
  solutions: LangTemplates;
  testCases: TestCase[];
  hints?: string[];
  explanation?: string;
  commonMistakes?: string[];
}

interface BlankItem { id: string; answer: string; hint?: string }
interface FillInBlankProps {
  exerciseId?: string;
  title: string;
  description: string;
  difficulty: ExerciseDifficulty;
  category?: string;
  codeTemplate: LangTemplates;
  blanks: BlankItem[];
  explanation?: string;
}

const SUPPORTED_LANGS: Lang[] = ['c', 'cpp', 'java', 'csharp', 'python'];
const LANG_NAMES: Record<Lang, string> = { c: 'C', cpp: 'C++', java: 'Java', csharp: 'C#', python: 'Python' };
const DEFAULT_TEMPLATES: Record<Lang, string> = {
  c: '#include <stdio.h>\n\nint main(void) {\n    return 0;\n}\n',
  cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    return 0;\n}\n',
  java: 'import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n    }\n}\n',
  csharp: 'using System;\nusing System.Linq;\n\npublic class Program {\n    public static void Main() {\n    }\n}\n',
  python: 'import sys\n\ndef solve():\n    pass\n\nif __name__ == "__main__":\n    solve()\n',
};
const DIFFICULTY_CONFIG: Record<ExerciseDifficulty, { text: string; color: string }> = {
  easy: { text: '简单', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  medium: { text: '中等', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  hard: { text: '困难', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' },
};

function draftKey(exerciseId: string | undefined, title: string, lang: Lang) {
  return `coding-draft:${exerciseId || title}:${lang}`;
}

function starterCode(exerciseId: string | undefined, title: string, lang: Lang, templates: LangTemplates, solutions: LangTemplates) {
  if (typeof window !== 'undefined') {
    const saved = window.localStorage.getItem(draftKey(exerciseId, title, lang));
    if (saved !== null) return saved;
  }
  return templates[lang] || solutions[lang] || DEFAULT_TEMPLATES[lang];
}

function badgeClass(level?: string) {
  if (level === 'excellent' || level === 'pass') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
  if (level === 'blocker') return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300';
  if (level === 'warning') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
  return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200';
}

function verdictText(verdict?: string) {
  if (!verdict) return '待判定';
  if (verdict === 'AC' || verdict === 'Accepted') return '通过';
  if (verdict === 'WA' || verdict === 'Wrong Answer') return '答案错误';
  if (verdict === 'CE' || verdict === 'Compilation Error') return '编译错误';
  if (verdict === 'RE' || verdict === 'Runtime Error') return '运行错误';
  if (verdict === 'TLE') return '超时';
  if (verdict === 'OLE') return '输出超限';
  return verdict;
}

function feedbackLevelText(level?: string) {
  if (level === 'excellent') return '优秀';
  if (level === 'pass') return '通过';
  if (level === 'warning') return '待优化';
  if (level === 'blocker') return '阻塞';
  if (level === 'review') return '待复盘';
  return level || '待判定';
}

export default function CodingExercise({
  exerciseId, title, description, difficulty, category, templates, solutions, testCases, hints = [], explanation, commonMistakes = [],
}: CodingExerciseProps) {
  const { recordExerciseComplete, user } = useUser();
  const { isEnglish, t } = useI18n();
  const [lang, setLang] = useState<Lang>('cpp');
  const [code, setCode] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [runOutput, setRunOutput] = useState<string | null>(null);
  const [judge, setJudge] = useState<JudgeResponse | null>(null);

  useEffect(() => {
    const preferredTarget = user?.targetLanguage;
    const preferred = preferredTarget && (templates[preferredTarget] || solutions[preferredTarget])
      ? preferredTarget
      : (SUPPORTED_LANGS.find((item) => templates[item] || solutions[item]) || 'cpp');
    setLang(preferred);
  }, [solutions, templates, user?.targetLanguage]);

  useEffect(() => {
    setCode(starterCode(exerciseId, title, lang, templates, solutions));
    setJudge(null);
    setRunOutput(null);
  }, [exerciseId, title, lang, templates, solutions]);

  useEffect(() => {
    if (typeof window !== 'undefined') window.localStorage.setItem(draftKey(exerciseId, title, lang), code);
  }, [code, exerciseId, lang, title]);

  const summary = judge?.summary;
  const groupedResults = useMemo(() => {
    const groups = new Map<string, JudgeResponse['results']>();
    for (const result of judge?.results || []) {
      const key = result.checkpointTitle || result.description || `测试 ${result.testCase ?? 0}`;
      const bucket = groups.get(key) || [];
      bucket.push(result);
      groups.set(key, bucket);
    }
    return Array.from(groups.entries());
  }, [judge]);

  const onQuickRun = async () => {
    if (!code.trim()) return alert(t('请先编写代码'));
    setIsRunning(true);
    setRunOutput(null);
    try {
      const result = await quickRun(code, lang, testCases[0]?.input || '');
      setRunOutput(result.error ? `${t('运行失败')}\n${result.error}` : `${t('输出')}\n${result.output || ''}\n\n${t(`运行时间: ${result.time || 0} ms`)}`);
    } catch (error) {
      setRunOutput(`${t('运行失败')}\n${error instanceof Error ? error.message : t('未知错误')}`);
    } finally {
      setIsRunning(false);
    }
  };

  const onJudge = async () => {
    if (!code.trim()) return alert(t('请先编写代码'));
    setIsRunning(true);
    setJudge(null);
    setRunOutput(null);
    try {
      const result = await runTestCases(code, lang, testCases);
      setJudge(result);
      if (exerciseId) {
        recordExerciseComplete(exerciseId, title, category || '', result.allPassed, {
          score: result.summary.score,
          passRate: result.summary.passRate,
          verdict: result.summary.verdict,
          feedbackLevel: result.summary.feedbackLevel,
          runtimeMs: result.summary.runtime.maxMs,
          checkpointsPassed: result.summary.passedCheckpoints,
          checkpointsTotal: result.summary.totalCheckpoints,
        });
      }
    } catch (error) {
      alert(`${t('判题失败')}: ${error instanceof Error ? error.message : t('未知错误')}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.14),_transparent_45%),linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(241,245,249,0.78))] px-4 py-5 dark:border-slate-700 dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.2),_transparent_42%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(30,41,59,0.94))] sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${DIFFICULTY_CONFIG[difficulty].color}`}>{t(DIFFICULTY_CONFIG[difficulty].text)}</span>
              {category && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-200">{t(category)}</span>}
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">{t('专业判题')}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SUPPORTED_LANGS.map((item) => (
              <button
                key={item}
                onClick={() => setLang(item)}
                className={`min-h-[44px] rounded-2xl border px-3 py-2 text-sm font-medium transition-all ${lang === item ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'}`}
              >
                {LANG_NAMES[item]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-4 dark:border-slate-700 dark:bg-slate-900/80 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-3">
            {testCases.slice(0, 2).map((item, index) => (
              <div key={`${item.description || item.checkpoint || 'sample'}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">{item.checkpoint || item.description || `${t('样例')} ${index + 1}`}</div>
                <div className="grid gap-2 text-xs sm:grid-cols-2">
                  <pre className="rounded-xl bg-slate-50 p-3 whitespace-pre-wrap font-mono text-slate-700 dark:bg-slate-900 dark:text-slate-200">{item.input}</pre>
                  <pre className="rounded-xl bg-slate-50 p-3 whitespace-pre-wrap font-mono text-emerald-700 dark:bg-slate-900 dark:text-emerald-300">{item.expectedOutput}</pre>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {isEnglish
                ? `Current language: ${LANG_NAMES[lang]}. If this exercise does not provide a template for it, the editor falls back to a standard stdin/stdout starter. C# is supported too.`
                : `当前语言: ${LANG_NAMES[lang]}。若题目未提供该语言模板，编辑器会自动回退到标准输入输出骨架，C# 也可直接开始练习。`}
            </div>
            {hints.length > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200">{t('解题提示')}</h4>
                  <button onClick={() => setShowHints((value) => !value)} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/60 dark:text-amber-200">{showHints ? t('收起') : t('展开')}</button>
                </div>
                {showHints && <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-200">{hints.map((hint, index) => <li key={`${hint}-${index}`}>- {hint}</li>)}</ul>}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap justify-between gap-2">
          <h4 className="text-base font-semibold text-slate-900 dark:text-white">{t('代码编辑器')}</h4>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { setCode(templates[lang] || solutions[lang] || DEFAULT_TEMPLATES[lang]); setJudge(null); setRunOutput(null); }} className="min-h-[44px] rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100">{t('重置为模板')}</button>
            <button onClick={() => setShowSolution((value) => !value)} className="min-h-[44px] rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">{t(showSolution ? '隐藏参考' : '查看参考')}</button>
          </div>
        </div>
        <textarea value={code} onChange={(event) => setCode(event.target.value)} spellCheck={false} className="h-72 w-full rounded-3xl border border-slate-800 bg-slate-950 p-4 font-mono text-sm text-slate-100 outline-none focus:border-indigo-500" />
        <div className="mt-4 grid gap-3 lg:grid-cols-[auto_auto_1fr]">
          <button onClick={onQuickRun} disabled={isRunning} className="min-h-[44px] rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">{isRunning ? t('运行中...') : t('快速运行')}</button>
          <button onClick={onJudge} disabled={isRunning} className="min-h-[44px] rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">{isRunning ? t('判题中...') : t('提交判题')}</button>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">{t('草稿会按题目和语言自动保存，切换语言不再清空代码。')}</div>
        </div>
        {runOutput && <div className="mt-4 rounded-3xl border border-slate-800 bg-slate-950 p-4"><pre className="whitespace-pre-wrap text-sm text-slate-100">{runOutput}</pre></div>}

        {summary && (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900">{t(verdictText(summary.verdict))}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(summary.feedbackLevel)}`}>{t(feedbackLevelText(summary.feedbackLevel))}</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{t(`得分 ${summary.score} / 100`)}</h4>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{summary.feedbackMessage}</p>
                  {summary.nextAction && <p className="mt-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{t('下一步')}: {summary.nextAction}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"><div className="text-xs text-slate-500 dark:text-slate-400">{t('通过率')}</div><div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{summary.passRate}%</div></div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"><div className="text-xs text-slate-500 dark:text-slate-400">{t('测试通过')}</div><div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{summary.passed}/{summary.total}</div></div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"><div className="text-xs text-slate-500 dark:text-slate-400">{t('检查点')}</div><div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{summary.passedCheckpoints}/{summary.totalCheckpoints}</div></div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"><div className="text-xs text-slate-500 dark:text-slate-400">{t('最大耗时')}</div><div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{summary.runtime.maxMs} ms</div></div>
              </div>
            </div>

            {judge?.checkpoints?.length ? (
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {judge.checkpoints.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t(item.group)}</div>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass(item.feedbackLevel)}`}>{t(item.passed ? '已通过' : '待修复')}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                      <span>{t(`${item.passedCount}/${item.total} 通过`)}</span>
                      <span>{isEnglish ? `${item.score}/${item.maxScore} pts` : `${item.score}/${item.maxScore} 分`}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.feedbackMessage}</p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-5 space-y-3">
              {groupedResults.map(([groupName, results]) => (
                <div key={groupName} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{groupName.startsWith('测试 ') ? t(groupName) : groupName}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{t(`${results.filter((item) => item.passed).length}/${results.length} 通过`)}</div>
                  </div>
                  <div className="space-y-3">
                    {results.map((item) => (
                      <div key={`${groupName}-${item.testCase}-${item.status}`} className={`rounded-2xl border p-3 ${item.passed ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20' : 'border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-900/20'}`}>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">{t(`测试 ${item.testCase}`)}</span>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass(item.feedbackLevel)}`}>{item.status}</span>
                          {typeof item.time === 'number' && <span className="text-xs text-slate-500 dark:text-slate-400">{item.time} ms</span>}
                        </div>
                        {!item.passed && (
                          <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                            <div className="rounded-xl bg-white/70 p-3 dark:bg-slate-900/60">{item.feedbackMessage || item.feedbackHint || t('请对照失败用例重新检查。')}</div>
                            <div className="grid gap-2 lg:grid-cols-3">
                              <pre className="rounded-xl bg-white/70 p-3 whitespace-pre-wrap font-mono text-xs dark:bg-slate-900/60">{item.input || '(空)'}</pre>
                              <pre className="rounded-xl bg-white/70 p-3 whitespace-pre-wrap font-mono text-xs dark:bg-slate-900/60">{item.expectedOutput || '(空)'}</pre>
                              <pre className="rounded-xl bg-white/70 p-3 whitespace-pre-wrap font-mono text-xs dark:bg-slate-900/60">{item.actualOutput || '(空)'}</pre>
                            </div>
                            {item.error && <div className="rounded-xl bg-rose-100 p-3 text-xs text-rose-700 dark:bg-rose-950/50 dark:text-rose-200">{item.error}</div>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {judge?.allPassed === false && commonMistakes.length > 0 && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <h4 className="mb-2 text-sm font-semibold text-amber-800 dark:text-amber-200">{t('常见错误')}</h4>
                <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-200">{commonMistakes.map((item, index) => <li key={`${item}-${index}`}>- {item}</li>)}</ul>
              </div>
            )}
          </div>
        )}

        {showSolution && (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h4 className="text-base font-semibold text-slate-900 dark:text-white">{t('参考答案')}</h4>
              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-100">{LANG_NAMES[lang]}</span>
            </div>
            {solutions[lang] ? (
              <pre className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-100">{solutions[lang]}</pre>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">{t('当前语言暂无预置参考答案，可以继续使用模板自行完成。')}</div>
            )}
            {explanation && (
              <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-900/20">
                <h5 className="mb-2 text-sm font-semibold text-indigo-800 dark:text-indigo-200">{t('题解思路')}</h5>
                <p className="whitespace-pre-line text-sm text-indigo-700 dark:text-indigo-200">{explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function FillInBlank({ exerciseId, title, description, difficulty, category, codeTemplate, blanks, explanation }: FillInBlankProps) {
  const { recordExerciseComplete, user } = useUser();
  const { t } = useI18n();
  const availableLangs = useMemo(() => SUPPORTED_LANGS.filter((item) => codeTemplate[item]), [codeTemplate]);
  const [lang, setLang] = useState<Lang>(
    (user?.targetLanguage && availableLangs.includes(user.targetLanguage) ? user.targetLanguage : availableLangs[0]) || 'cpp'
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const preferred = user?.targetLanguage && availableLangs.includes(user.targetLanguage)
      ? user.targetLanguage
      : availableLangs[0];
    setLang(preferred || 'cpp');
  }, [availableLangs, user?.targetLanguage]);

  const checkAnswers = () => {
    const next: Record<string, boolean> = {};
    for (const blank of blanks) {
      const input = (answers[blank.id] || '').trim().replace(/\s+/g, '').toLowerCase();
      const options = blank.answer.split('|').map((item) => item.trim().replace(/\s+/g, '').toLowerCase()).filter(Boolean);
      next[blank.id] = options.some((item) => item === input);
    }
    setResults(next);
    setSubmitted(true);
    const correctCount = blanks.filter((blank) => next[blank.id]).length;
    const allCorrect = correctCount === blanks.length;
    if (exerciseId) recordExerciseComplete(exerciseId, title, category || '', allCorrect, { score: blanks.length ? Math.round((correctCount / blanks.length) * 100) : 0, passRate: blanks.length ? Math.round((correctCount / blanks.length) * 100) : 0, verdict: allCorrect ? 'Accepted' : 'Review', feedbackLevel: allCorrect ? 'excellent' : 'review' });
  };

  const renderCode = () => (codeTemplate[lang] || '').split('\n').map((line, lineIndex) => {
    const parts: ReactNode[] = [];
    let lastIndex = 0;
    const regex = /___(\w+)___/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) parts.push(<span key={`text-${lineIndex}-${lastIndex}`} className="text-slate-300">{line.slice(lastIndex, match.index)}</span>);
      const blankId = match[1];
      const ok = results[blankId];
      parts.push(<input key={`blank-${lineIndex}-${blankId}`} type="text" value={answers[blankId] || ''} onChange={(event) => { setAnswers((prev) => ({ ...prev, [blankId]: event.target.value })); setSubmitted(false); }} placeholder={blanks.find((item) => item.id === blankId)?.hint || t('填写代码')} disabled={submitted && Boolean(ok)} className={`mx-1 min-h-[40px] rounded-xl border px-3 py-2 font-mono text-sm ${submitted ? ok ? 'border-emerald-500 bg-emerald-900/50 text-emerald-200' : 'border-rose-500 bg-rose-900/50 text-rose-200' : 'border-slate-500 bg-slate-700 text-white focus:border-indigo-400 focus:outline-none'}`} />);
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < line.length) parts.push(<span key={`tail-${lineIndex}`} className="text-slate-300">{line.slice(lastIndex)}</span>);
    return <div key={lineIndex} className="flex items-start gap-3 py-0.5"><span className="w-7 text-right text-xs text-slate-500">{lineIndex + 1}</span><span className="flex flex-1 flex-wrap items-center">{parts.length ? parts : <span className="text-slate-300">{line || ' '}</span>}</span></div>;
  });

  const correctCount = blanks.filter((blank) => results[blank.id]).length;
  const allCorrect = submitted && correctCount === blanks.length;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_45%),linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(240,253,250,0.82))] px-4 py-5 dark:border-slate-700 dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.2),_transparent_42%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(30,41,59,0.94))] sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${DIFFICULTY_CONFIG[difficulty].color}`}>{t(DIFFICULTY_CONFIG[difficulty].text)}</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">{t('填空练习')}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {availableLangs.map((item) => (
              <button key={item} onClick={() => { setLang(item); setAnswers({}); setResults({}); setSubmitted(false); }} className={`min-h-[44px] rounded-2xl border px-3 py-2 text-sm font-medium ${lang === item ? 'border-emerald-500 bg-emerald-600 text-white' : 'border-slate-200 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200'}`}>{LANG_NAMES[item]}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4 font-mono text-sm">{renderCode()}</div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button onClick={checkAnswers} disabled={Object.keys(answers).length === 0} className="min-h-[44px] rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">{t('检查答案')}</button>
          <button onClick={() => { setAnswers({}); setResults({}); setSubmitted(false); }} className="min-h-[44px] rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100">{t('重置')}</button>
        </div>
        {submitted && (
          <div className={`mt-5 rounded-3xl border p-4 ${allCorrect ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20' : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20'}`}>
            <div className="text-base font-semibold text-slate-900 dark:text-white">{allCorrect ? t('全部正确，可以继续下一题。') : t(`当前正确 ${correctCount} / ${blanks.length}`)}</div>
          </div>
        )}
        {submitted && explanation && (
          <div className="mt-5 rounded-3xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-900/20">
            <h4 className="mb-2 text-sm font-semibold text-indigo-800 dark:text-indigo-200">{t('解析')}</h4>
            <p className="whitespace-pre-line text-sm text-indigo-700 dark:text-indigo-200">{explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
