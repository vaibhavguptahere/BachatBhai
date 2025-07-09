'use client';

import { motion } from 'framer-motion';
import { useScrollVisibility } from '@/hooks/useScrollVisibility'; // adjust path if needed

export default function ScrollRevealSection({ children }) {
  const [ref, isVisible] = useScrollVisibility();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
      transition={{
        duration: 1.2,           // 🕒 slower animation
        ease: [0.25, 0.1, 0.25, 1], // 🧈 smoother cubic-bezier ease
        delay: 0.1              // ⏱️ small delay for entrance feel
      }}
    >
      {children}
    </motion.div>
  );
}
