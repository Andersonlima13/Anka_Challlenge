import React from 'react';

interface ToastProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ type, message, onClose }) => {
  return (
    <div
      className={`fixed top-6 right-6 z-[100] px-4 py-3 rounded shadow-lg text-white transition-all ${
        type === 'success' ? 'bg-green-600' : 'bg-red-600'
      }`}
      role="alert"
    >
      <span>{message}</span>
      <button
        className="ml-4 text-white font-bold"
        onClick={onClose}
        aria-label="Fechar"
      >
        ×
      </button>
    </div>
  );
};

// Funções utilitárias para exibir toast programaticamente
let toastTimeout: NodeJS.Timeout | null = null;
let setToastState: React.Dispatch<React.SetStateAction<ToastState | null>>;

interface ToastState {
  type: 'success' | 'error';
  message: string;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = React.useState<ToastState | null>(null);
  setToastState = setToast;

  const handleClose = () => setToast(null);

  return (
    <>
      {children}
      {toast && <Toast type={toast.type} message={toast.message} onClose={handleClose} />}
    </>
  );
}

export const toast = {
  success: (message: string) => {
    setToastState?.({ type: 'success', message });
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => setToastState?.(null), 3000);
  },
  error: (message: string) => {
    setToastState?.({ type: 'error', message });
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => setToastState?.(null), 3000);
  },
};
