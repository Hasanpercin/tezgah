
/**
 * Utility functions for payment card formatting
 */

/**
 * Formats a credit card number with spaces after every 4 digits
 */
export const formatCardNumber = (value: string): string => {
  const formattedValue = value
    .replace(/\s/g, "") // Remove spaces
    .replace(/\D/g, "") // Remove non-digits
    .slice(0, 16); // Limit to 16 digits
  
  // Add space after every 4 digits
  return formattedValue
    .replace(/(\d{4})/g, "$1 ")
    .trim();
};

/**
 * Formats an expiry date as MM/YY
 */
export const formatExpiryDate = (value: string): string => {
  const formattedValue = value
    .replace(/\D/g, "") // Remove non-digits
    .slice(0, 4); // Limit to 4 digits
  
  if (formattedValue.length > 2) {
    return `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
  }
  
  return formattedValue;
};

/**
 * Formats a CVV (3 digits only)
 */
export const formatCVV = (value: string): string => {
  return value
    .replace(/\D/g, "") // Remove non-digits
    .slice(0, 3); // Limit to 3 digits
};

/**
 * Determines card type based on first digits
 */
export const getCardType = (cardNumber: string): string | null => {
  const cleanNumber = cardNumber.replace(/\s/g, "");
  
  if (cleanNumber.startsWith("4")) return "VISA";
  if (/^5[1-5]/.test(cleanNumber)) return "MasterCard";
  if (/^3[47]/.test(cleanNumber)) return "American Express";
  if (/^6(?:011|5)/.test(cleanNumber)) return "Discover";
  
  return null;
};
