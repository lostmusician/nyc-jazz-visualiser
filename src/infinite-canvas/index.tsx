import React, { Suspense } from 'react';
import type { InfiniteCanvasProps } from './types';

const LazyScene = React.lazy(() => import('./scene').then((module) => ({ default: module.InfiniteCanvasScene })));

const supportsWebGL = () => {
  try {
    if (new URLSearchParams(window.location.search).get('webgl') === 'off') return false;
    const canvas = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
  } catch {
    return false;
  }
};

export function InfiniteCanvas(props: InfiniteCanvasProps) {
  const available = React.useMemo(supportsWebGL, []);
  const textureProgressCallback = props.onTextureProgress;
  React.useEffect(() => {
    if (!available) textureProgressCallback?.(100);
  }, [available, textureProgressCallback]);
  if (!available) return <div className="canvas-loading" role="status">WebGL unavailable — use the club index to explore the archive.</div>;
  return <Suspense fallback={<div className="canvas-loading">Loading the night archive…</div>}><LazyScene {...props} /></Suspense>;
}
