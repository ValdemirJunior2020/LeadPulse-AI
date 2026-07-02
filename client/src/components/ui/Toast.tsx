import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type Toast = { id: string; title: string; message?: string };
type ToastContextValue = { pushToast: (toast: Omit<Toast, 'id'>) => void };

const ToastContext = createContext<ToastContextValue>({ pushToast: () => undefined });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const pushToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { ...toast, id }]);
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 3500);
  }, []);
  const value = useMemo(() => ({ pushToast }), [pushToast]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-3">
        {toasts.map((toast) => (
          <div key={toast.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
            <p className="font-semibold text-slate-950">{toast.title}</p>
            {toast.message ? <p className="mt-1 text-sm text-slate-500">{toast.message}</p> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
