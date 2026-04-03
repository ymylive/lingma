import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import useLowMotionMode from '../hooks/useLowMotionMode';

interface GridProps {
  children: ReactNode;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Grid({
  children,
  cols = { default: 1, sm: 2, lg: 3 },
  gap = 'md',
  className = ''
}: GridProps) {
  const lowMotion = useLowMotionMode();

  const colsClasses = [
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ].filter(Boolean).join(' ');

  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
  };

  return (
    <motion.div
      initial={lowMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={lowMotion ? { duration: 0 } : {
        duration: 0.4,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }}
      className={`grid ${colsClasses} ${gapClasses[gap]} ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface GridItemProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function GridItem({ children, delay = 0, className = '' }: GridItemProps) {
  const lowMotion = useLowMotionMode();

  return (
    <motion.div
      initial={lowMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={lowMotion ? { duration: 0 } : {
        duration: 0.4,
        delay,
        ease: 'easeOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
