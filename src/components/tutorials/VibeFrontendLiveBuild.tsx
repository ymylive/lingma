import { useEffect, useState } from 'react';
import { Code2, Download, ExternalLink, LoaderCircle, Maximize2, MessageSquare, Plus, RefreshCw, Wand2, X } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import {
  appendFrontendBuildTurnStream,
  createFrontendBuildSessionStream,
  fetchFrontendBuildSessionDetail,
  fetchFrontendBuildSessions,
  getFrontendBuildDownloadUrl,
} from '../../services/vibeCodingService';
import type { VibeFrontendBuildSession, VibeFrontendBuildSessionDetail } from '../../types/vibeCoding';

const EMPTY_PREVIEW = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;padding:24px;color:#334155;background:#f8fafc"><h2 style="margin:0 0 12px">Live Build</h2><p style="margin:0">Start with a detailed frontend request to generate a preview.</p></body></html>`;

export default function VibeFrontendLiveBuild() {
  const { formatDate, locale, t } = useI18n();
  const [sessions, setSessions] = useState<VibeFrontendBuildSession[]>([]);
  const [activeSession, setActiveSession] = useState<VibeFrontendBuildSessionDetail | null>(null);
  const [draftPrompt, setDraftPrompt] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [streamingBuildPreview, setStreamingBuildPreview] = useState('');

  const loadSessions = async () => {
    setLoading(true);
    setError('');
    try {
      const items = await fetchFrontendBuildSessions();
      setSessions(items);
      if (items.length) {
        const detail = await fetchFrontendBuildSessionDetail(items[0].id);
        setActiveSession(detail);
      } else {
        setActiveSession(null);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t('加载 Live Build 失败'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSessions();
    // Initial load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isFullscreenOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFullscreenOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreenOpen]);

  const selectSession = async (sessionId: string) => {
    setLoading(true);
    setError('');
    setStreamingBuildPreview('');
    try {
      const detail = await fetchFrontendBuildSessionDetail(sessionId);
      setActiveSession(detail);
      setDraftPrompt('');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t('加载会话失败'));
    } finally {
      setLoading(false);
    }
  };

  const submitPrompt = async () => {
    if (draftPrompt.trim().length < 24) {
      setError(t('提示词至少需要 24 个字符，才能生成稳定结果。'));
      return;
    }

    setSubmitting(true);
    setError('');
    setStreamingBuildPreview('');
    try {
      const detail = activeSession
        ? await appendFrontendBuildTurnStream(activeSession.id, draftPrompt, locale, setStreamingBuildPreview)
        : await createFrontendBuildSessionStream(draftPrompt, locale, setStreamingBuildPreview);
      setActiveSession(detail);
      setDraftPrompt('');
      setSubmitting(false);
      setStreamingBuildPreview('');
      void fetchFrontendBuildSessions().then((items) => {
        setSessions(items);
      }).catch(() => {
        // Preserve the finished artifact even if the session list refresh fails.
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t('生成页面失败'));
      setSubmitting(false);
    }
  };

  const startNewSession = () => {
    setActiveSession(null);
    setDraftPrompt('');
    setError('');
    setStreamingBuildPreview('');
  };

  const artifact = activeSession?.latestArtifact ?? null;
  const previewHtml = artifact?.mergedHtml || EMPTY_PREVIEW;

  const openPreviewInNewTab = () => {
    const previewWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (!previewWindow) {
      setError(t('浏览器拦截了新窗口，请允许弹窗后重试。'));
      return;
    }

    previewWindow.document.open();
    previewWindow.document.write(previewHtml);
    previewWindow.document.close();
  };

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-700 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
            <Wand2 className="h-4 w-4 text-indigo-500" />
            {t('Frontend Live Build')}
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {t('输入真实前端需求，AI 会生成可预览页面；后续继续输入优化指令即可延续上下文。')}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={startNewSession}
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500"
          >
            <Plus className="h-4 w-4" />
            {t('新建会话')}
          </button>
          <button
            type="button"
            onClick={() => void loadSessions()}
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {t('刷新会话')}
          </button>
          {activeSession && (
            <a
              href={getFrontendBuildDownloadUrl(activeSession.id)}
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-indigo-500"
            >
              <Download className="h-4 w-4" />
              {t('下载 HTML')}
            </a>
          )}
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      <div className="mt-5 space-y-5">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)]">
          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                <MessageSquare className="h-4 w-4 text-indigo-500" />
                {t('需求与续写')}
              </div>
              <textarea
                value={draftPrompt}
                onChange={(event) => setDraftPrompt(event.target.value)}
                placeholder={t('例如：生成一个 SaaS 定价页 hero，强调主 CTA、社会证明和浅色玻璃拟态卡片风格。')}
                className="mt-3 min-h-[180px] w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm leading-8 text-slate-800 transition-colors duration-200 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span>{draftPrompt.trim().length} {t('字符')}</span>
                <span>{t('建议明确目标、风格、组件和交互。')}</span>
              </div>
              <button
                type="button"
                onClick={() => void submitPrompt()}
                disabled={submitting}
                className="mt-4 inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Code2 className="h-4 w-4" />}
                {activeSession ? t('继续优化当前页面') : t('开始生成页面')}
              </button>
            </div>

            {submitting ? (
              <div className="overflow-hidden rounded-3xl border border-emerald-500/20 bg-[linear-gradient(145deg,#0f172a,#111827)] p-4 shadow-[0_20px_60px_-36px_rgba(15,23,42,0.9)] dark:border-emerald-500/30">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      {t('AI 正在实时生成页面代码')}
                    </div>
                    <p className="mt-2 text-xs leading-6 text-slate-300">
                      {t('生成中的源码草稿会在这里逐字展开，完成后自动落到正式预览。')}
                    </p>
                  </div>
                  <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-200">
                    Stream
                  </div>
                </div>
                <pre className="mt-4 max-h-[420px] overflow-auto rounded-[24px] border border-white/5 bg-slate-950/80 p-4 text-xs leading-6 text-emerald-100">
                  {streamingBuildPreview || t('正在等待首个流式分片...')}
                  <span aria-hidden className="ml-0.5 inline-block h-4 w-2 animate-pulse rounded-sm bg-emerald-300/70 align-[-2px]" />
                </pre>
              </div>
            ) : null}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{t('最近会话')}</div>
            <div className="mt-3 space-y-3">
              {sessions.length ? sessions.map((session) => (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => void selectSession(session.id)}
                  className={`w-full cursor-pointer rounded-2xl border px-4 py-3 text-left transition-colors duration-200 ${
                    activeSession?.id === session.id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-950 dark:bg-indigo-950/30 dark:text-indigo-100'
                      : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-500'
                  }`}
                >
                  <div className="text-sm font-semibold">{session.title}</div>
                  <div className="mt-1 line-clamp-2 text-xs leading-6 text-slate-500 dark:text-slate-400">{session.summary}</div>
                  <div className="mt-2 text-[11px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                    {formatDate(session.updatedAt)}
                  </div>
                </button>
              )) : (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  {t('还没有 Live Build 会话，先生成一个页面。')}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 lg:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                {artifact?.title || t('实时预览')}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {artifact?.summary || t('生成完成后会在这里显示页面预览与版本摘要。')}
              </div>
            </div>
            {artifact && (
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {formatDate(artifact.createdAt)}
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={openPreviewInNewTab}
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500"
            >
              <ExternalLink className="h-4 w-4" />
              {t('新标签页打开')}
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreenOpen(true)}
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500"
            >
              <Maximize2 className="h-4 w-4" />
              {t('全屏预览')}
            </button>
          </div>
          <div className="mt-4 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:shadow-none">
            <iframe
              title={artifact?.title || t('页面预览')}
              srcDoc={previewHtml}
              sandbox="allow-scripts"
              className="h-[460px] w-full border-0 bg-white sm:h-[560px] lg:h-[680px] xl:h-[760px]"
            />
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{t('当前版本摘要')}</div>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {artifact?.summary || t('暂无摘要')}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{t('建议继续优化')}</div>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {(artifact?.nextSuggestions || [t('生成后这里会出现下一轮建议。')]).map((item, index) => (
                    <li key={`${item}-${index}`}>- {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{t('上下文记录')}</div>
            <div className="mt-3 space-y-3">
              {(activeSession?.turns || []).length ? activeSession!.turns.map((turn) => (
                <div key={turn.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      {turn.role === 'user' ? t('用户') : t('AI')}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500">{formatDate(turn.createdAt)}</div>
                  </div>
                  <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-200">{turn.summary || turn.promptText}</p>
                </div>
              )) : (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  {loading ? t('正在加载上下文...') : t('生成第一页后，这里会记录每一轮需求与 AI 摘要。')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isFullscreenOpen ? (
        <div
          className="fixed inset-0 z-[80] bg-slate-950/70 p-3 backdrop-blur-sm sm:p-5"
          onClick={() => setIsFullscreenOpen(false)}
        >
          <div
            className="flex h-full w-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-700 sm:px-5">
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {artifact?.title || t('实时预览')}
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t('按 Esc 或点击右上角关闭全屏预览。')}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={openPreviewInNewTab}
                  className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500"
                >
                  <ExternalLink className="h-4 w-4" />
                  {t('新标签页打开')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullscreenOpen(false)}
                  className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition-colors duration-200 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500"
                  aria-label={t('关闭全屏预览')}
                  title={t('关闭全屏预览')}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-white p-2 dark:bg-slate-950 sm:p-4">
              <iframe
                title={t('全屏页面预览')}
                srcDoc={previewHtml}
                sandbox="allow-scripts"
                className="h-full w-full rounded-[24px] border-0 bg-white"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
