import { useState, useCallback } from 'react';

interface ConfirmationOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

export function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions | null>(null);
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions(options);
      setResolvePromise(() => resolve);
      setIsOpen(true);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    resolvePromise?.(true);
    setResolvePromise(null);
  }, [resolvePromise]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    resolvePromise?.(false);
    setResolvePromise(null);
  }, [resolvePromise]);

  return {
    isOpen,
    options,
    confirm,
    handleConfirm,
    handleCancel,
  };
}