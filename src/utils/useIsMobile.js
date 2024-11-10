// utils/useIsMobile.js
import { useMediaQuery } from '@mui/material';
//import { useState, useEffect } from 'react';

const useIsMobile = () => {
    const isMobile = useMediaQuery('(max-width:768px)');
/*    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
*/
    return isMobile;
};

export default useIsMobile;
