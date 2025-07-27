import { TFunction } from 'i18next';
import { ValidationError } from './types';
import { ErrorFactory } from './factory';

export interface ValidationRule<T = any> {
  validate: (value: T) => boolean;
  message: string;
  max?: number;
  min?: number;
}

export interface FieldValidation {
  required?: boolean;
  rules?: ValidationRule[];
}

export interface FormValidation {
  [field: string]: FieldValidation;
}

export class FormValidator {
  private readonly t: TFunction;
  private readonly validation: FormValidation;

  constructor(t: TFunction, validation: FormValidation) {
    this.t = t;
    this.validation = validation;
  }

  validateField(field: string, value: any): ValidationError | null {
    const fieldValidation = this.validation[field];
    if (!fieldValidation) return null;

    // Check required
    if (fieldValidation.required && (!value || value.toString().trim() === '')) {
      return ErrorFactory.createValidationError(
        this.t('validation.required', { field: this.t(`fields.${field}`) }),
        field,
        value
      );
    }

    // Check custom rules
    if (fieldValidation.rules && value) {
      for (const rule of fieldValidation.rules) {
        if (!rule.validate(value)) {
          return ErrorFactory.createValidationError(
            this.t(rule.message, { field: this.t(`fields.${field}`), value, max: rule.max, min: rule.min }),
            field,
            value
          );
        }
      }
    }

    return null;
  }

  validateForm(data: Record<string, any>): Record<string, ValidationError> {
    const errors: Record<string, ValidationError> = {};

    for (const field in this.validation) {
      const error = this.validateField(field, data[field]);
      if (error) {
        errors[field] = error;
      }
    }

    return errors;
  }

  isValid(data: Record<string, any>): boolean {
    return Object.keys(this.validateForm(data)).length === 0;
  }
}

// Common validation rules
export const ValidationRules = {
  email: (t: TFunction): ValidationRule => ({
    validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'validation.invalidEmail'
  }),

  minLength: (min: number, t: TFunction): ValidationRule => ({
    validate: (value: string) => value.length >= min,
    message: 'validation.minLength',
    min
  }),

  maxLength: (max: number, t: TFunction): ValidationRule => ({
    validate: (value: string) => value.length <= max,
    message: 'validation.maxLength',
    max
  }),

  password: (t: TFunction): ValidationRule => ({
    validate: (value: string) => value.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value),
    message: 'validation.invalidPassword'
  }),

  futureDate: (t: TFunction): ValidationRule => ({
    validate: (value: string) => new Date(value) > new Date(),
    message: 'validation.futureDateRequired'
  })
};