import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';
import useLowMotionMode from '../hooks/useLowMotionMode';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  variant = 'default',
  hover = true,
  padding = 'md',
  className = '',
  ...props
}: CardProps) {
  const lowMotion = useLowMotionMode();

  const variantClasses = {
    default: 'bg-white/55 backdrop-blur-md dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/40 shadow-sm',
    elevated: 'bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50',
    outlined: 'bg-transparent border-2 border-slate-300 dark:border-slate-600',
    glass: 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/80 shadow-sm',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClasses = hover
    ? 'transition-all duration-300 hover:shadow-md hover:shadow-slate-200/60 dark:hover:shadow-slate-900/60 hover:-translate-y-0.5'
    : '';

  return (
    <motion.div
      initial={lowMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={lowMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
      className={`rounded-2xl ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3 className={`text-xl font-bold text-slate-900 dark:text-white ${className}`}>
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return (
    <p className={`text-sm text-slate-600 dark:text-slate-400 ${className}`}>
      {children}
    </p>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 ${className}`}>
      {children}
    </div>
  );
}
