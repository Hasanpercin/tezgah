
/**
 * Utility functions for payment card validation
 */

/**
 * Validates payment form data
 */
export const isFormValid = (formData: {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}): boolean => {
  return (
    formData.cardholderName.trim().length > 0 &&
    formData.cardNumber.replace(/\s/g, "").length === 16 &&
    formData.expiryDate.length === 5 &&
    formData.cvv.length === 3
  );
};
