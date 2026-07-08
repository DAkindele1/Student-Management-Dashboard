import { useToast } from '../hooks/useToast';

export const ToastHost = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed right-4 top-4 z-50 flex w-[min(100vw-2rem,24rem)] flex-col gap-3">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          className={`rounded-2xl border px-4 py-3 text-left transition hover:-translate-y-0.5 ${
            toast.tone === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : toast.tone === 'error'
                ? 'border-red-200 bg-red-50 text-red-800'
                : 'border-sky-200 bg-sky-50 text-sky-800'
          }`}
          onClick={() => removeToast(toast.id)}
        >
          <div className="font-semibold">{toast.title}</div>
          {toast.description ? <div className="mt-1 text-sm opacity-90">{toast.description}</div> : null}
        </button>
      ))}
    </div>
  );
};