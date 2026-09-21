import type { CSSProperties } from 'react';
import type { WindowMotifState } from '../types';

interface WindowMotifProps extends Partial<WindowMotifState> {
  className?: string;
}

export function WindowMotif({
  section = 'address',
  progress = 0,
  opacity = 0.22,
  tone = 'dark',
  className = '',
}: WindowMotifProps) {
  return (
    <div
      className={`window-motif window-motif-${tone} ${className}`.trim()}
      data-window-section={section}
      aria-hidden="true"
      style={{
        '--window-progress': Math.max(0, Math.min(1, progress)),
        '--window-opacity': opacity,
      } as CSSProperties}
    >
      {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
    </div>
  );
}
