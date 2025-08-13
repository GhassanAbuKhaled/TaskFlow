import { useTranslation } from 'react-i18next';

/**
 * Hook to determine if the current language is RTL
 * @returns {boolean} true if current language is RTL (Arabic)
 */
export const useRTL = (): boolean => {
  const { i18n } = useTranslation();
  return i18n.language === 'ar';
};

/**
 * Hook to get RTL-aware class names
 * @returns object with RTL-aware utility functions
 */
export const useRTLClasses = () => {
  const isRTL = useRTL();

  return {
    isRTL,
    // Spacing utilities
    spaceX: (size: string) => isRTL ? `space-x-reverse ${size}` : size,
    // Margin utilities  
    marginStart: (size: string) => isRTL ? `ml-${size}` : `mr-${size}`,
    marginEnd: (size: string) => isRTL ? `mr-${size}` : `ml-${size}`,
    // Padding utilities
    paddingStart: (size: string) => isRTL ? `pl-${size}` : `pr-${size}`,
    paddingEnd: (size: string) => isRTL ? `pr-${size}` : `pl-${size}`,
    // Text alignment
    textStart: isRTL ? 'text-right' : 'text-left',
    textEnd: isRTL ? 'text-left' : 'text-right',
    // Flex direction
    flexRowReverse: isRTL ? 'flex-row-reverse' : 'flex-row',
    // Border utilities
    borderStart: (size: string) => isRTL ? `border-r-${size}` : `border-l-${size}`,
    borderEnd: (size: string) => isRTL ? `border-l-${size}` : `border-r-${size}`,
  };
};