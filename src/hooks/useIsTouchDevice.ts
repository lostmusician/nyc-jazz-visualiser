/**
 * Adapted from Codrops Infinite Canvas at commit
 * 4e710decd0a99b2e312c594668dd2ccc834764ee (MIT).
 */
import * as React from 'react';

const detectTouchDevice = () =>
  'ontouchstart' in window
  || navigator.maxTouchPoints > 0
  || (window.matchMedia?.('(pointer: coarse)').matches ?? false);

export function useIsTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = React.useState(detectTouchDevice);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const update = () => setIsTouchDevice(detectTouchDevice());
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return isTouchDevice;
}
