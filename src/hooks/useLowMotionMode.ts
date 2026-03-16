import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const LOW_MOTION_MEDIA_QUERY = '(max-width: 768px), (hover: none), (pointer: coarse)';

export default function useLowMotionMode() {
  const prefersReducedMotion = useReducedMotion();
  const [isLowMotionViewport, setIsLowMotionViewport] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(LOW_MOTION_MEDIA_QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueryList = window.matchMedia(LOW_MOTION_MEDIA_QUERY);
    const updateViewportMode = () => setIsLowMotionViewport(mediaQueryList.matches);

    updateViewportMode();

    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', updateViewportMode);
      return () => mediaQueryList.removeEventListener('change', updateViewportMode);
    }

    mediaQueryList.addListener(updateViewportMode);
    return () => mediaQueryList.removeListener(updateViewportMode);
  }, []);

  return prefersReducedMotion || isLowMotionViewport;
}
