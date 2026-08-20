// app/api/callback/utils/helpers.ts

/**
 * Calculate delivery fee based on order total amount
 * @param totalAmount - Total order amount in KES
 * @returns Delivery fee in KES
 */
export function calculateDeliveryFee(totalAmount: number): number {
  if (totalAmount < 500) return 100;
  if (totalAmount < 1000) return 150;
  if (totalAmount < 2000) return 200;
  if (totalAmount < 5000) return 300;
  return 400;
}

/**
 * Generate a unique reference number
 * @param prefix - Prefix for the reference (e.g., 'SAV', 'MEM')
 * @param length - Length of random string (default: 5)
 * @returns Formatted reference number
 */
export function generateReference(prefix: string, length: number = 5): string {
  const randomStr = Math.random()
    .toString(36)
    .substring(2, length + 2)
    .toUpperCase();
  return `${prefix}-${Date.now()}-${randomStr}`;
}

/**
 * Extract metadata from STK callback
 * @param callbackMetadata - M-Pesa callback metadata
 * @returns Object with extracted values
 */
export function extractStkMetadata(callbackMetadata: any): Record<string, any> {
  const metadataMap: Record<string, any> = {};
  
  if (callbackMetadata?.Item) {
    callbackMetadata.Item.forEach((item: any) => {
      metadataMap[item.Name] = item.Value;
    });
  }
  
  return metadataMap;
}

/**
 * Calculate subscription end date based on billing cycle
 * @param billingCycle - 'monthly', 'quarterly', or 'yearly'
 * @param startDate - Subscription start date (defaults to now)
 * @returns End date of subscription
 */
export function calculateSubscriptionEndDate(
  billingCycle: string,
  startDate: Date = new Date()
): Date {
  const endDate = new Date(startDate);
  
  switch (billingCycle) {
    case 'monthly':
      endDate.setMonth(endDate.getMonth() + 1);
      break;
    case 'quarterly':
      endDate.setMonth(endDate.getMonth() + 3);
      break;
    case 'yearly':
      endDate.setFullYear(endDate.getFullYear() + 1);
      break;
    default:
      endDate.setMonth(endDate.getMonth() + 1);
  }
  
  return endDate;
}

/**
 * Format phone number to standard format
 * @param phoneNumber - Raw phone number
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove any non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // If starts with 0, replace with 254
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.slice(1);
  }
  
  // If starts with 7, prepend 254
  if (cleaned.startsWith('7') && cleaned.length === 9) {
    cleaned = '254' + cleaned;
  }
  
  return cleaned;
}