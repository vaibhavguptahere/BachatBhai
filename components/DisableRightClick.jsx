'use client';

import { useEffect } from 'react';

export default function DisableRightClick({ children }) {
    useEffect(() => {
        const handleContextMenu = (e) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    return <>{children}</>;
}
