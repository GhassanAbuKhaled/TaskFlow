import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FormValidator, FormValidation, ValidationError } from '@/lib/errors';

interface UseFormOptions<T> {
  initialValues: T;
  validation?: FormValidation;
  onSubmit: (values: T) => Promise<void> | void;
}

interface UseFormReturn<T> {
  values: T;
  errors: Record<keyof T, ValidationError | null>;
  isSubmitting: boolean;
  isValid: boolean;
  setValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: ValidationError | null) => void;
  validateField: (field: keyof T) => ValidationError | null;
  validateForm: () => boolean;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  reset: () => void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validation,
  onSubmit
}: UseFormOptions<T>): UseFormReturn<T> {
  const { t } = useTranslation();
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, ValidationError | null>>(
    {} as Record<keyof T, ValidationError | null>
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validator = useMemo(() => 
    validation ? new FormValidator(t, validation) : null,
    [t, validation]
  );

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  const setFieldError = useCallback((field: keyof T, error: ValidationError | null) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const validateField = useCallback((field: keyof T): ValidationError | null => {
    if (!validator) return null;
    
    const error = validator.validateField(field as string, values[field]);
    setFieldError(field, error);
    return error;
  }, [validator, values, setFieldError]);

  const validateForm = useCallback((): boolean => {
    if (!validator) return true;
    
    const formErrors = validator.validateForm(values);
    const errorEntries = Object.entries(formErrors) as [keyof T, ValidationError][];
    
    const newErrors = {} as Record<keyof T, ValidationError | null>;
    for (const key in values) {
      newErrors[key] = null;
    }
    
    errorEntries.forEach(([field, error]) => {
      newErrors[field] = error;
    });
    
    setErrors(newErrors);
    return errorEntries.length === 0;
  }, [validator, values]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      // Error handling is done by the onSubmit function
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, onSubmit, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({} as Record<keyof T, ValidationError | null>);
    setIsSubmitting(false);
  }, [initialValues]);

  const isValid = useMemo(() => {
    return Object.values(errors).every(error => error === null);
  }, [errors]);

  return {
    values,
    errors,
    isSubmitting,
    isValid,
    setValue,
    setFieldError,
    validateField,
    validateForm,
    handleSubmit,
    reset
  };
}