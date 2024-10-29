/**
 * Truncates a number to a specific number of decimal places without rounding.
 * 
 * @param num - The number to truncate.
 * @param decimals - The number of decimal places to keep.
 * @returns The truncated number.
 */
export function truncateNumber(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.floor(num * factor) / factor;
}

export function calculatePoints(streakDays: number): number {
  switch (streakDays) {
    case 0:
      return 0;
    case 1:
      return 5;
    case 2:
      return 10;
    case 3:
      return 15;
    case 4:
      return 20;
    case 5:
      return 30;
    case 6:
      return 40;
    case 7:
      return 50;
    default:
      return 100;
  }
}