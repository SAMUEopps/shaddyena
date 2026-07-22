export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `SHAD-${timestamp}-${random}`;
}

export function formatCurrency(amount: number): string {
  return `KSh ${amount.toFixed(2)}`;
}

export function validatePhoneNumber(phone: string): boolean {
  // Kenyan phone number format: 254XXXXXXXXX
  return /^254\d{9}$/.test(phone);
}

export function calculateCommission(amount: number, rate: number = 0.1): number {
  return amount * rate;
}
