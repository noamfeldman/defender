import { useState, useEffect } from 'react';

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const hasTouch = window.matchMedia('(pointer: coarse)').matches;
            const isSmall = window.innerWidth < 768;
            setIsMobile(hasTouch || isSmall);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
};

export const useOrientation = () => {
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
    );

    useEffect(() => {
        const handleResize = () => {
            setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return orientation;
};
