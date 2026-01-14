import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type ToastType = 'info' | 'success' | 'error' | 'warning';

export interface ToastItem {
    id: string;
    type: ToastType;
    title?: string;
    message: string;
    timeout?: number;
}

const ToastContext = createContext<{
    push: (t: Omit<ToastItem, 'id'>) => string;
    remove: (id: string) => void;
} | null>(null);

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    const { push, remove } = ctx;
    return {
        push,
        remove,
        info: (message: string, title?: string, timeout?: number) => push({ type: 'info', message, title, timeout }),
        success: (message: string, title?: string, timeout?: number) => push({ type: 'success', message, title, timeout }),
        error: (message: string, title?: string, timeout?: number) => push({ type: 'error', message, title, timeout }),
        warning: (message: string, title?: string, timeout?: number) => push({ type: 'warning', message, title, timeout }),
    };
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const push = useCallback((t: Omit<ToastItem, 'id'>) => {
        const id = Math.random().toString(36).slice(2, 9);
        const item: ToastItem = { id, timeout: 5000, ...t };
        setToasts(prev => [...prev, item]);
        return id;
    }, []);

    const remove = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    useEffect(() => {
        const timers: Array<{ id: string; timer: any }> = [];
        toasts.forEach(t => {
            if (t.timeout && t.timeout > 0) {
                const timer = setTimeout(() => remove(t.id), t.timeout);
                timers.push({ id: t.id, timer });
            }
        });
        return () => timers.forEach(x => clearTimeout(x.timer));
    }, [toasts, remove]);

    useEffect(() => {
        const handler = (e: Event) => {
            try {
                // @ts-ignore
                const d = (e as CustomEvent).detail || {};
                const message = String(d.message || '');
                const type = d.type || 'info';
                push({ message, type: type as ToastType });
            } catch (err) {
                // ignore
            }
        };
        window.addEventListener('app-toast', handler as EventListener);
        return () => window.removeEventListener('app-toast', handler as EventListener);
    }, [push]);

    return (
        <ToastContext.Provider value={{ push, remove }}>
            {children}
            <div aria-live="polite" className="fixed right-4 bottom-4 z-50 flex flex-col-reverse items-end gap-3">
                {toasts.map(t => (
                    <div key={t.id} className={`max-w-sm w-full text-sm rounded shadow-lg overflow-hidden border ${t.type === 'success' ? 'bg-white border-green-100' : t.type === 'error' ? 'bg-white border-red-100' : 'bg-white border-gray-100'}`}>
                        <div className="p-3 flex items-start gap-3">
                            <div className="flex-1">
                                {t.title && <div className="font-semibold text-gray-800">{t.title}</div>}
                                <div className="text-gray-700">{t.message}</div>
                            </div>
                            <div className="ml-2 flex-shrink-0">
                                <button onClick={() => remove(t.id)} className="text-gray-400 hover:text-gray-600">✕</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
