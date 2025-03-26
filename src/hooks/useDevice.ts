import { useState, useEffect } from 'react';

const breakpoints = [
  { name: 'miniphone', min: 0, max: 320 },
  { name: 'phone', min: 320, max: 640 },
  { name: 'tablet', min: 640, max: 1080 },
  { name: 'desktop', min: 1080, max: Infinity },
];

const useDevice = () => {
  const [deviceType, setDeviceType] = useState<string>('desktop');

  const getWindowWidth = () => {
    return window.innerWidth;
  };

  const calculateDeviceType = (width: number) => {
    for (const breakpoint of breakpoints) {
      if (width >= breakpoint.min && width < breakpoint.max) {
        return breakpoint.name;
      }
    }
    return 'desktop'; // Default to desktop if no match is found
  };

  useEffect(() => {
    const handleResize = () => {
      const width = getWindowWidth();
      const newDeviceType = calculateDeviceType(width);
      setDeviceType(newDeviceType);
    };

    handleResize(); // Initial calculation

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return deviceType;
};

export default useDevice;
