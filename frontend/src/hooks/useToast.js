import { useCallback, useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const pushToast = useCallback((type, message) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);

    window.setTimeout(() => {
      removeToast(id);
    }, 3400);
  }, [removeToast]);

  return {
    toasts,
    removeToast,
    success: (message) => pushToast("success", message),
    error: (message) => pushToast("error", message),
    info: (message) => pushToast("info", message)
  };
}
