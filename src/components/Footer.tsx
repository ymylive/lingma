import { Link } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';

export default function Footer() {
  const { isEnglish } = useI18n();

  return (
    <footer className="relative z-10 border-t border-slate-200/50 bg-white/60 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-klein-500 to-klein-600 text-xs font-bold text-white">
                DS
              </div>
              <span className="text-lg font-bold text-slate-800 dark:text-white">
                Tumafang
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {isEnglish
                ? 'Interactive data structure & algorithm learning platform with visualizations, tutorials, and AI-powered practice.'
                : '交互式数据结构与算法学习平台，提供可视化演示、系统教程和 AI 智能练习。'}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
              {isEnglish ? 'Quick Links' : '快捷导航'}
            </h4>
            <ul className="space-y-2 text-sm">
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
            <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
              {isEnglish ? 'Built With' : '技术栈'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Framer Motion'].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-slate-200/50 pt-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          &copy; {new Date().getFullYear()} Tumafang. {isEnglish ? 'All rights reserved.' : '保留所有权利。'}
        </div>
      </div>
    </footer>
  );
}