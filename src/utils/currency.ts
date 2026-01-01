import {
  EXCHANGE_RATE,
  type CurrencyType,
  Currency,
} from "../constants/exchange";

/**
 * Converts Bulgarian Lev (BGN) to Euro (EUR)
 * Uses the official fixed exchange rate: 1 EUR = 1.95583 BGN
 *
 * @param bgn - Amount in Bulgarian Lev
 * @returns Amount in Euro, rounded to 2 decimal places
 */
export function bgnToEur(bgn: number): number {
  if (!isFinite(bgn) || isNaN(bgn)) {
    return 0;
  }
  return Math.round((bgn / EXCHANGE_RATE) * 100) / 100;
}

/**
 * Converts Euro (EUR) to Bulgarian Lev (BGN)
 * Uses the official fixed exchange rate: 1 EUR = 1.95583 BGN
 *
 * @param eur - Amount in Euro
 * @returns Amount in Bulgarian Lev, rounded to 2 decimal places
 */
export function eurToBgn(eur: number): number {
  if (!isFinite(eur) || isNaN(eur)) {
    return 0;
  }
  return Math.round(eur * EXCHANGE_RATE * 100) / 100;
}

/**
 * Converts an amount to Euro based on its current currency
 *
 * @param amount - The amount to convert
 * @param fromCurrency - The currency of the amount
 * @returns Amount in Euro
 */
export function toEur(amount: number, fromCurrency: CurrencyType): number {
  if (fromCurrency === Currency.EUR) {
    return Math.round(amount * 100) / 100;
  }
  return bgnToEur(amount);
}

/**
 * Converts an amount to Bulgarian Lev based on its current currency
 *
 * @param amount - The amount to convert
 * @param fromCurrency - The currency of the amount
 * @returns Amount in Bulgarian Lev
 */
export function toBgn(amount: number, fromCurrency: CurrencyType): number {
  if (fromCurrency === Currency.BGN) {
    return Math.round(amount * 100) / 100;
  }
  return eurToBgn(amount);
}

/**
 * Calculates the change to be returned
 *
 * @param priceInEur - The total price in Euro
 * @param paidInEur - The amount paid in Euro
 * @returns Object with change in both currencies, or null if payment is insufficient
 */
export function calculateChange(
  priceInEur: number,
  paidInEur: number
): { eur: number; bgn: number } | null {
  const changeInEur = Math.round((paidInEur - priceInEur) * 100) / 100;

  if (changeInEur < 0) {
    return null;
  }

  return {
    eur: changeInEur,
    bgn: eurToBgn(changeInEur),
  };
}

/**
 * Formats a number as currency with proper decimal places
 *
 * @param amount - The amount to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string
 */
export function formatAmount(amount: number, decimals: number = 2): string {
  if (!isFinite(amount) || isNaN(amount)) {
    return "0.00";
  }
  return amount.toFixed(decimals);
}

/**
 * Parses a string input to a number, handling edge cases
 *
 * @param input - The string to parse
 * @returns Parsed number or 0 if invalid
 */
export function parseAmount(input: string): number {
  if (!input || input.trim() === "") {
    return 0;
  }

  // Replace comma with dot for European format support
  const normalized = input.replace(",", ".");
  const parsed = parseFloat(normalized);

  if (isNaN(parsed) || !isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, parsed);
}

