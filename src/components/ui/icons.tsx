import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function sharedProps({ size = 16, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
    ...rest,
  };
}

// Star rating — used for difficulty (1/2/3 filled stars)
// Self-drawn (not emoji) so typography stays consistent across platforms.
export function StarRating({
  level,
  size = 12,
  className = '',
}: {
  level: 1 | 2 | 3;
  size?: number;
  className?: string;
}) {
  const stars = Array.from({ length: 3 }, (_, i) => i < level);
  return (
    <span
      className={`inline-flex items-center gap-0.5 align-middle ${className}`}
      aria-hidden
    >
      {stars.map((filled, idx) => (
        <svg
          key={idx}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={filled ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={filled ? 0 : 1.5}
          strokeLinejoin="round"
          className={filled ? 'opacity-100' : 'opacity-35'}
        >
          <path d="M12 3.2l2.62 5.31 5.86.85-4.24 4.13 1 5.84L12 16.77l-5.24 2.56 1-5.84L3.52 9.36l5.86-.85L12 3.2z" />
        </svg>
      ))}
    </span>
  );
}

export function TipIcon(props: IconProps) {
  return (
    <svg {...sharedProps(props)}>
      <path d="M9.5 18h5" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.86c.6.44.97 1.13.97 1.88V16h5v-.26c0-.75.37-1.44.97-1.88A6 6 0 0 0 12 3z" />
    </svg>
  );
}

export function WarningIcon(props: IconProps) {
  return (
    <svg {...sharedProps(props)}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.72 3h16.92a2 2 0 0 0 1.72-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ImportantIcon(props: IconProps) {
  return (
    <svg {...sharedProps(props)}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="7.5" x2="12" y2="13" />
      <circle cx="12" cy="16.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BookOpenIcon(props: IconProps) {
  return (
    <svg {...sharedProps(props)}>
      <path d="M3 5.5a1.5 1.5 0 0 1 1.5-1.5H10a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4.5A1.5 1.5 0 0 1 3 15.5v-10z" />
      <path d="M21 5.5a1.5 1.5 0 0 0-1.5-1.5H14a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h5.5a1.5 1.5 0 0 0 1.5-1.5v-10z" />
    </svg>
  );
}

export function DiagramIcon(props: IconProps) {
  return (
    <svg {...sharedProps(props)}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="8.5" y="14" width="7" height="7" rx="1.5" />
      <path d="M6.5 10v2a2 2 0 0 0 2 2h.5" />
      <path d="M17.5 10v2a2 2 0 0 1-2 2H15" />
    </svg>
  );
}

export function PlayMediaIcon(props: IconProps) {
  return (
    <svg {...sharedProps(props)}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M10.5 9.5v5l4-2.5-4-2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}
