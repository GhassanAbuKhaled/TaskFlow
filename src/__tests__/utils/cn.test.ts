import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility function', () => {
  it('combines class names correctly', () => {
    const result = cn('class1', 'class2');
    expect(result).toBe('class1 class2');
  });

  it('handles conditional classes', () => {
    const result = cn('base', true && 'conditional', false && 'hidden');
    expect(result).toBe('base conditional');
  });

  it('handles undefined and null values', () => {
    const result = cn('base', undefined, null, 'valid');
    expect(result).toBe('base valid');
  });

  it('merges conflicting Tailwind classes', () => {
    const result = cn('p-4', 'p-2');
    expect(result).toBe('p-2');
  });
});