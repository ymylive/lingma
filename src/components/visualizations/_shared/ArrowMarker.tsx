/**
 * Shared SVG arrowhead marker definitions for linked-list/queue/tree arrows.
 *
 * Drop `<ArrowMarkerDefs prefix="ll" />` inside any <svg> and then reference
 * the markers via `markerEnd={arrowUrl('ll', 'default')}`.
 *
 * Color constants and the `arrowUrl` helper live in ./arrowColors.ts so this
 * file only exports components (required by react-refresh/only-export-components).
 */
import type { ArrowVariant } from './arrowColors';
import { ARROW_COLORS } from './arrowColors';

interface ArrowMarkerDefsProps {
  prefix: string;
}

export function ArrowMarkerDefs({ prefix }: ArrowMarkerDefsProps) {
  const entries: ArrowVariant[] = ['default', 'highlight', 'accent', 'danger', 'muted'];
  return (
    <defs>
      {entries.map((v) => (
        <marker
          key={v}
          id={`${prefix}-arrow-${v}`}
          markerWidth="10"
          markerHeight="10"
          refX="8.5"
          refY="5"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M 0 0 L 10 5 L 0 10 L 2.6 5 Z" fill={ARROW_COLORS[v]} />
        </marker>
      ))}
    </defs>
  );
}
