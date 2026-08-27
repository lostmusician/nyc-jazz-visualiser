import { useEffect, useState, useRef, useCallback } from 'react';

export function useScrollObserver(
  itemIds: string[]
): [string, (id: string) => void] {
  const [activeId, setActiveId] = useState<string>(itemIds[0] || '');
  const manualOverrideRef = useRef<boolean>(false);
  const overrideTimerRef = useRef<number | null>(null);

  // Allow manual override (e.g. when clicking sidebar anchor)
  const setChapterManually = useCallback((id: string) => {
    setActiveId(id);
    manualOverrideRef.current = true;
    if (overrideTimerRef.current) {
      window.clearTimeout(overrideTimerRef.current);
    }
    // Release manual override after scroll animation settles (800ms)
    overrideTimerRef.current = window.setTimeout(() => {
      manualOverrideRef.current = false;
    }, 800);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Viewport-center based scroll calculator (most reliable for tall scrollytelling cards)
    const handleScroll = () => {
      if (manualOverrideRef.current) return;

      const viewportCenter = window.innerHeight * 0.45;
      let closestId = itemIds[0] || '';
      let minDistance = Infinity;

      itemIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        const rect = el.getBoundingClientRect();
        // Check element's distance from target viewport focus line
        const elCenter = rect.top + rect.height * 0.35;
        const distance = Math.abs(elCenter - viewportCenter);

        // Element must be at least partially visible
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          if (distance < minDistance) {
            minDistance = distance;
            closestId = id;
          }
        }
      });

      if (closestId && closestId !== activeId) {
        setActiveId(closestId);
      }
    };

    let rafId: number;
    const onScrollThrottled = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScrollThrottled, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScrollThrottled);
      cancelAnimationFrame(rafId);
      if (overrideTimerRef.current) {
        window.clearTimeout(overrideTimerRef.current);
      }
    };
  }, [itemIds, activeId]);

  return [activeId, setChapterManually];
}
