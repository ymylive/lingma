import { Link } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';

export default function Footer() {
  const { isEnglish } = useI18n();

  return (
    <footer className="relative z-10 border-t border-slate-200/30 bg-white/40 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/40">
      {/* Subtle brand accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-klein-500/20 to-transparent dark:via-klein-400/15" />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid gap-10 text-center sm:grid-cols-3 sm:text-left">
          {/* Brand */}
          <div>
            <div className="flex items-center justify-center gap-2.5 sm:justify-start">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-klein-500 to-klein-600 text-[10px] font-bold text-white">
                DS
              </div>
              <span className="text-base font-bold text-slate-800 dark:text-white">
                Tumafang
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {isEnglish
                ? 'Interactive data structure & algorithm learning platform with visualizations, tutorials, and AI-powered practice.'
                : '交互式数据结构与算法学习平台，提供可视化演示、系统教程和 AI 智能练习。'}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              {isEnglish ? 'Quick Links' : '快捷导航'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/algorithms', label: isEnglish ? 'Algorithms' : '算法演示' },
                { to: '/book', label: isEnglish ? 'Tutorials' : '教程' },
                { to: '/practice', label: isEnglish ? 'AI Practice' : 'AI练习' },
                { to: '/mindmap', label: 'MindMap' },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-slate-500 transition-colors hover:text-klein-500 dark:text-slate-400 dark:hover:text-pine-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              {isEnglish ? 'Built With' : '技术栈'}
            </h4>
            <div className="flex flex-wrap justify-center gap-1.5 sm:justify-start">
              {['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Framer Motion'].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-slate-200/80 bg-slate-50/80 px-2.5 py-1 text-xs text-slate-500 dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-slate-200/40 pt-6 text-center text-xs text-slate-400 dark:border-slate-800/60 dark:text-slate-500">
          &copy; {new Date().getFullYear()} Tumafang. {isEnglish ? 'All rights reserved.' : '保留所有权利。'}
        </div>
      </div>
    </footer>
  );
}
