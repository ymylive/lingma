/**
 * Arrow color palette + url() helper for SVG marker references, split out
 * from ArrowMarker.tsx so the component file only exports components
 * (required by react-refresh/only-export-components).
 */

export type ArrowVariant = 'default' | 'highlight' | 'accent' | 'danger' | 'muted';

export const ARROW_COLORS: Record<ArrowVariant, string> = {
  default: '#002FA7',
  highlight: '#FFE135',
  accent: '#10b981',
  danger: '#f43f5e',
  muted: '#94a3b8',
};

export function arrowUrl(prefix: string, variant: ArrowVariant): string {
  return `url(#${prefix}-arrow-${variant})`;
}
