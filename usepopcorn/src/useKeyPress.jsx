import { useEffect } from "react";

export function useKeyPress(key, callback) {
  function handleKey(e) {
    console.log(e);
    if (e.key === key) callback;
  }

  useEffect(() => {
    document.addEventListener("keypress", handleKey);

    return () => {
      document.removeEventListener("keypress", handleKey);
    };
  }, []);
}
