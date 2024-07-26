import { useEffect, useState } from "react";

export function useLocalStorage(initState, key) {
  const [value, setValue] = useState(() => {
    const storedItems = localStorage.getItem(key);
    return storedItems ? JSON.parse(storedItems) : initState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}
