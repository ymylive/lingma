import { useId } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import useLowMotionMode from '../../hooks/useLowMotionMode';

const LAYOUT_SPRING = { type: 'spring', stiffness: 380, damping: 30, mass: 0.6 } as const;

export type TabsVariant = 'pill' | 'underline';
export type TabsSize = 'sm' | 'md';

export interface TabItem<T extends string = string> {
  id: T;
  label: ReactNode;
  icon?: ReactNode;
}

export interface TabsProps<T extends string = string> {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  className?: string;
  ariaLabel?: string;
}

export function Tabs<T extends string = string>({
  items,
  value,
  onChange,
  variant = 'pill',
  size = 'md',
  className,
  ariaLabel,
}: TabsProps<T>) {
  // Each Tabs instance needs its own unique layoutId, otherwise multiple
  // instances on the same page will share (and fight over) the active pill.
  const pillLayoutId = `tab-pill-${useId()}`;
  const underlineLayoutId = `tab-underline-${useId()}`;
  const lowMotion = useLowMotionMode();
  const whileTap = lowMotion ? undefined : { scale: 0.96 };

  const sizeClasses =
    size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-sm';

  if (variant === 'pill') {
    return (
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={`inline-flex rounded-2xl border border-slate-200/60 bg-slate-100/50 p-1 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/50 ${className ?? ''}`}
      >
        {items.map((item) => {
          const isActive = item.id === value;
          return (
            <motion.button
              type="button"
              key={item.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(item.id)}
              whileTap={whileTap}
              className={`relative inline-flex items-center gap-2 rounded-xl font-medium transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 ${sizeClasses} ${
                isActive
                  ? 'text-klein-600 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {isActive ? (
                <motion.div
                  layoutId={pillLayoutId}
                  className="absolute inset-0 rounded-xl bg-white shadow-sm dark:bg-klein-600"
                  transition={LAYOUT_SPRING}
                  style={{ zIndex: 0 }}
                />
              ) : null}
              <span className="relative z-10 inline-flex items-center gap-2">
                {item.icon}
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    );
  }

  // Underline variant
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`inline-flex gap-1 border-b border-slate-200/60 dark:border-slate-700/60 ${className ?? ''}`}
    >
      {items.map((item) => {
        const isActive = item.id === value;
        return (
          <motion.button
            type="button"
            key={item.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            whileTap={whileTap}
            className={`relative inline-flex items-center gap-2 ${sizeClasses} font-medium transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 ${
              isActive
                ? 'text-klein-600 dark:text-klein-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              {item.icon}
              {item.label}
            </span>
            {isActive ? (
              <motion.div
                layoutId={underlineLayoutId}
                className="absolute left-2 right-2 -bottom-px h-0.5 rounded-full bg-klein-500 dark:bg-klein-400"
                transition={LAYOUT_SPRING}
              />
            ) : null}
          </motion.button>
        );
      })}
    </div>
  );
}
