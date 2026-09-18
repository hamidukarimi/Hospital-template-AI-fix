import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextValue {
  pushToast: (toast: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const pushToast = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { ...toast, id }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3800);
  }, []);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl ring-1 ring-slate-100 backdrop-blur-sm"
          >
            <div
              className={[
                "mt-0.5 flex h-8 w-8 items-center justify-center rounded-full",
                toast.type === "success" && "bg-emerald-100 text-emerald-600",
                toast.type === "error" && "bg-red-100 text-red-600",
                toast.type === "info" && "bg-amber-100 text-amber-600",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {toast.type === "success" && <CheckCircle2 className="h-4 w-4" />}
              {toast.type === "error" && <CircleAlert className="h-4 w-4" />}
              {toast.type === "info" && <Info className="h-4 w-4" />}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">
                {toast.title}
              </p>
              {toast.description && (
                <p className="mt-1 text-xs text-slate-600">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              type="button"
              aria-label="Close notification"
              onClick={() =>
                setToasts((current) =>
                  current.filter((item) => item.id !== toast.id),
                )
              }
              className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};
