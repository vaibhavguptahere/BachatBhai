'use client';

import { useEffect, useState, useRef } from 'react';

export function useScrollVisibility(offset = 100) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const inView = rect.top + offset < window.innerHeight && rect.bottom - offset > 0;

      setIsVisible(inView);
    };

    handleScroll(); // check once on mount
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset]);

  return [ref, isVisible];
}
