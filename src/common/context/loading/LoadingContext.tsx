import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type LoadingContextValue = {
  isLoading: boolean;
  message: string;
  show: (message?: string) => void;
  hide: () => void;
};

const LoadingContext = createContext<LoadingContextValue | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loadingCounter, setLoadingCounter] = useState(0);
  const [message, setMessage] = useState('');

  const show = useCallback((nextMessage: string = 'Cargando...') => {
    setMessage(nextMessage);
    setLoadingCounter((current) => current + 1);
  }, []);

  const hide = useCallback(() => {
    setLoadingCounter((current) => {
      const next = Math.max(0, current - 1);
      if (next === 0) {
        setMessage('');
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      isLoading: loadingCounter > 0,
      message,
      show,
      hide,
    }),
    [hide, loadingCounter, message, show],
  );

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }

  return context;
};

export const LoadingOverlay = () => {
  const { isLoading, message } = useLoading();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="text-center">
        <div
          className="mx-auto h-14 w-14 animate-spin rounded-full"
          style={{
            background:
              'conic-gradient(#ff0000, #ff7a00, #ffee00, #00d084, #00c2ff, #7a5cff, #ff4fd8, #ff0000)',
            WebkitMask:
              'radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 4px))',
            mask:
              'radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 4px))',
          }}
        />
        {message ? <p className="mt-4 text-base font-medium text-white">{message}</p> : null}
      </div>
    </div>
  );
};