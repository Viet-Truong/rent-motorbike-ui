import { useState, useEffect } from 'react';

function useDebounce(value: string, delay: number) {
  const [debounce, setDebounce] = useState<string>(value);

  useEffect(() => {
    const result = setTimeout(() => {
      setDebounce(value);
    }, delay);

    return () => {
      clearTimeout(result);
    };
  }, [value, delay]);

  return debounce;
}

export default useDebounce;
