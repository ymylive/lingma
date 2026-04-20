import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useLowMotionMode from '../../hooks/useLowMotionMode';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'gradient';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type IconPosition = 'left' | 'right';

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  // Dropped because framer-motion's motion.button overrides these with its
  // own incompatible signatures (drag / animation lifecycle events).
  | 'children'
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
>;

export interface ButtonProps extends NativeButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  loading?: boolean;
  fullWidth?: boolean;
  /** If present, the button renders as a react-router <Link to={to}>. */
  to?: string;
  children?: ReactNode;
}

const BASE =
  'group inline-flex items-center justify-center gap-2.5 font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 transition-[box-shadow] disabled:opacity-60 disabled:pointer-events-none';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-klein-600 text-white shadow-lg shadow-klein-600/20 hover:bg-klein-700 hover:shadow-klein-600/40 hover:-translate-y-0.5',
  secondary:
    'border border-slate-200/80 bg-white/70 backdrop-blur-sm text-slate-700 hover:border-klein-300 hover:text-klein-600 dark:border-slate-700/80 dark:bg-slate-800/70 dark:text-slate-200',
  ghost:
    'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60',
  gradient:
    'bg-gradient-to-r from-klein-500 via-klein-600 to-klein-700 text-white shadow-lg shadow-klein-600/25 hover:shadow-klein-600/40',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'min-h-[40px] px-4 py-2 text-sm rounded-xl',
  md: 'min-h-[52px] px-6 py-3 text-base rounded-2xl',
  lg: 'min-h-[60px] px-8 py-4 text-lg rounded-2xl',
};

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

const MotionLink = motion.create(Link);

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  to,
  className,
  children,
  disabled,
  type,
  ...rest
}: ButtonProps) {
  const lowMotion = useLowMotionMode();
  const classes = [
    BASE,
    VARIANTS[variant],
    SIZES[size],
    fullWidth ? 'w-full' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const trailingWrapClass =
    'inline-flex transition-transform duration-200 ease-out group-hover:translate-x-0.5';

  const leading = loading ? <Spinner /> : iconPosition === 'left' ? icon : null;
  const trailing =
    !loading && iconPosition === 'right' && icon ? (
      <span className={trailingWrapClass}>{icon}</span>
    ) : null;

  const content = (
    <>
      {leading}
      {children}
      {trailing}
    </>
  );

  const inert = disabled || loading;
  const enableMotion = !lowMotion && !inert;

  const whileHover = enableMotion && variant === 'primary'
    ? { y: -2, transition: { duration: 0.18, ease: 'easeOut' as const } }
    : undefined;
  const whileTap = enableMotion
    ? { scale: 0.97, transition: { duration: 0.1, ease: 'easeOut' as const } }
    : undefined;

  if (to) {
    // When rendering as a Link we still want to honour `disabled`/`loading`
    // visually — Link has no intrinsic disabled state so the opacity utility
    // classes (`disabled:opacity-60 disabled:pointer-events-none`) do nothing
    // here; apply equivalents manually.
    const linkClasses = inert
      ? `${classes} opacity-60 pointer-events-none`
      : classes;
    return (
      <MotionLink
        to={to}
        className={linkClasses}
        aria-disabled={inert || undefined}
        whileHover={whileHover}
        whileTap={whileTap}
      >
        {content}
      </MotionLink>
    );
  }

  return (
    <motion.button
      type={type ?? 'button'}
      className={classes}
      disabled={inert}
      whileHover={whileHover}
      whileTap={whileTap}
      {...rest}
    >
      {content}
    </motion.button>
  );
}
