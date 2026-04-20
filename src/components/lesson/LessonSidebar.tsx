import { Link } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';
import { curriculum } from '../../data/curriculum';

type LessonSidebarProps = {
  currentLink: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

type LessonNavigationListProps = {
  currentLink: string;
  onNavigate?: () => void;
};

function LessonNavigationList({ currentLink, onNavigate }: LessonNavigationListProps) {
  return (
    <div className="space-y-6">
      {curriculum.map((chapter) => (
        <div key={chapter.id}>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {chapter.name}
          </h4>
          <ul className="space-y-1">
            {chapter.topics.map((topic) => {
              const isActive = topic.link === currentLink;
              return (
                <li key={topic.link}>
                  <Link
                    to={topic.link}
                    onClick={onNavigate}
                    className={`block cursor-pointer rounded-xl px-3 py-2 text-sm transition-colors duration-200 ${
                      isActive
                        ? 'bg-klein-50 font-medium text-klein-700 dark:bg-klein-900/30 dark:text-klein-300'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-white'
                    } ${onNavigate ? 'min-h-11 py-3 leading-5' : ''}`}
                  >
                    {topic.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function LessonSidebar({ currentLink, isOpen, onOpen, onClose }: LessonSidebarProps) {
  return (
    <>
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 overflow-y-auto border-r border-slate-200/60 bg-white/55 backdrop-blur-md p-6 z-10 dark:border-slate-700/40 dark:bg-slate-900/50 lg:block">
        <div className="mb-6">
          <h3 className="mb-2 flex items-center gap-2 font-bold tracking-tight text-slate-900 dark:text-white">
            <BookOpen className="h-5 w-5 text-klein-500" strokeWidth={1.75} aria-hidden />
            课程目录
          </h3>
          <Link to="/book" className="text-sm text-klein-600 hover:underline dark:text-klein-400">
            返回总目录
          </Link>
        </div>
        <LessonNavigationList currentLink={currentLink} />
      </aside>

      <button
        type="button"
        onClick={onOpen}
        aria-label="Open course navigation"
        className="fixed bottom-5 right-5 z-40 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-klein-600 text-white shadow-lg shadow-klein-500/30 transition-all duration-200 hover:bg-klein-700 hover:scale-105 active:scale-95 lg:hidden"
      >
        <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[min(86vw,20rem)] overflow-y-auto bg-white/75 backdrop-blur-xl p-6 shadow-lg dark:bg-slate-900/70">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                <BookOpen className="h-5 w-5 text-klein-500" strokeWidth={1.75} aria-hidden />
                课程目录
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close course navigation"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </button>
            </div>
            <LessonNavigationList currentLink={currentLink} onNavigate={onClose} />
          </div>
        </div>
      )}
    </>
  );
}
