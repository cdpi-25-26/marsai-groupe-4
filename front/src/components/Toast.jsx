import { createContext, useContext, useState, useCallback } from 'react';
import { CircleCheck, CircleX, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const toastStyles = {
  success: {
    bg: 'bg-gradient-to-r from-green-600/90 to-emerald-600/90',
    border: 'border-green-400/30',
    icon: CircleCheck,
    iconColor: 'text-green-200'
  },
  error: {
    bg: 'bg-gradient-to-r from-red-600/90 to-rose-600/90',
    border: 'border-red-400/30',
    icon: CircleX,
    iconColor: 'text-red-200'
  },
  info: {
    bg: 'bg-gradient-to-r from-blue-600/90 to-cyan-600/90',
    border: 'border-blue-400/30',
    icon: Info,
    iconColor: 'text-blue-200'
  },
  warning: {
    bg: 'bg-gradient-to-r from-amber-600/90 to-yellow-600/90',
    border: 'border-amber-400/30',
    icon: AlertTriangle,
    iconColor: 'text-amber-200'
  }
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, duration);
    }
  }, []);

  const success = useCallback((message, duration) => showToast(message, 'success', duration), [showToast]);
  const error = useCallback((message, duration) => showToast(message, 'error', duration), [showToast]);
  const info = useCallback((message, duration) => showToast(message, 'info', duration), [showToast]);
  const warning = useCallback((message, duration) => showToast(message, 'warning', duration), [showToast]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => {
          const style = toastStyles[toast.type];
          const Icon = style.icon;
          
          return (
            <div
              key={toast.id}
              className={`
                ${style.bg} ${style.border}
                text-white px-6 py-4 rounded-2xl shadow-2xl 
                border backdrop-blur-md
                flex items-center gap-3 
                animate-fade-in-up
                pointer-events-auto
                min-w-[300px] max-w-[500px]
                transition-all duration-300 hover:scale-105
              `}
            >
              <Icon className={`h-6 w-6 flex-shrink-0 ${style.iconColor}`} />
              <span className="font-medium flex-1 text-sm leading-relaxed">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
