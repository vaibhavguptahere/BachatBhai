'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect } from 'react';

export default function ScrollProgressBar() {
    const { scrollYProgress } = useScroll();

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    // Optional: force update on mount in case of Lenis/Next hydration
    useEffect(() => {
        scrollYProgress.set(window.scrollY / (document.body.scrollHeight - window.innerHeight));
    }, [scrollYProgress]);

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 origin-left z-[9999]"
            style={{ scaleX }}
        />
    );
}
