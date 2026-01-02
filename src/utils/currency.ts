import Decimal from "decimal.js";
import {
  EXCHANGE_RATE,
  type CurrencyType,
  Currency,
} from "../constants/exchange";

// Configure Decimal.js for currency calculations
// We use more precision internally and round to 2 decimal places for output
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

// Store exchange rate as Decimal for precise calculations
const RATE = new Decimal(EXCHANGE_RATE);

/**
 * Rounds a Decimal to 2 decimal places and returns a number
 */
function roundToCents(value: Decimal): number {
  return value.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber();
}

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
  const bgnDecimal = new Decimal(bgn);
  return roundToCents(bgnDecimal.dividedBy(RATE));
}

/**
 * Internal function to convert EUR Decimal to BGN Decimal
 * Keeps precision throughout the calculation
 */
function eurToBgnDecimal(eurDecimal: Decimal): Decimal {
  return eurDecimal.times(RATE).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
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
  const eurDecimal = new Decimal(eur);
  return eurToBgnDecimal(eurDecimal).toNumber();
}

/**
 * Converts an amount to Euro based on its current currency
 *
 * @param amount - The amount to convert
 * @param fromCurrency - The currency of the amount
 * @returns Amount in Euro
 */
export function toEur(amount: number, fromCurrency: CurrencyType): number {
  if (!isFinite(amount) || isNaN(amount)) {
    return 0;
  }
  if (fromCurrency === Currency.EUR) {
    return roundToCents(new Decimal(amount));
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
  if (!isFinite(amount) || isNaN(amount)) {
    return 0;
  }
  if (fromCurrency === Currency.BGN) {
    return roundToCents(new Decimal(amount));
  }
  return eurToBgn(amount);
}

/**
 * Calculates the change to be returned
 * Uses Decimal.js for precise arithmetic to avoid floating-point errors
 *
 * @param priceInEur - The total price in Euro
 * @param paidInEur - The amount paid in Euro
 * @returns Object with change in both currencies, or null if payment is insufficient
 */
export function calculateChange(
  priceInEur: number,
  paidInEur: number
): { eur: number; bgn: number } | null {
  const price = new Decimal(priceInEur);
  const paid = new Decimal(paidInEur);
  const changeInEur = paid.minus(price);

  if (changeInEur.isNegative()) {
    return null;
  }

  // Round EUR first, then convert to BGN - keeping everything in Decimal
  const roundedEurChange = changeInEur.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  return {
    eur: roundedEurChange.toNumber(),
    bgn: eurToBgnDecimal(roundedEurChange).toNumber(),
  };
}

/**
 * Smart change calculation that handles same-currency scenarios directly
 * This avoids unnecessary conversion round-trips that can cause precision issues
 *
 * @param price - The price amount
 * @param priceCurrency - Currency of the price
 * @param paid - The amount paid
 * @param paidCurrency - Currency of the paid amount
 * @returns Object with change in both currencies, or null if payment is insufficient
 */
export function calculateChangeWithCurrencies(
  price: number,
  priceCurrency: CurrencyType,
  paid: number,
  paidCurrency: CurrencyType
): { eur: number; bgn: number } | null {
  const priceDecimal = new Decimal(price);
  const paidDecimal = new Decimal(paid);

  // If both amounts are in the same currency, calculate directly
  if (priceCurrency === paidCurrency) {
    const change = paidDecimal.minus(priceDecimal);

    if (change.isNegative()) {
      return null;
    }

    const roundedChange = change.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

    if (priceCurrency === Currency.EUR) {
      return {
        eur: roundedChange.toNumber(),
        bgn: eurToBgnDecimal(roundedChange).toNumber(),
      };
    } else {
      // Both in BGN - calculate BGN directly, then convert to EUR
      const bgnChange = roundedChange.toNumber();
      return {
        eur: bgnToEur(bgnChange),
        bgn: bgnChange,
      };
    }
  }

  // Different currencies - convert to EUR and calculate
  const priceInEur =
    priceCurrency === Currency.EUR
      ? priceDecimal
      : priceDecimal.dividedBy(RATE);
  const paidInEur =
    paidCurrency === Currency.EUR ? paidDecimal : paidDecimal.dividedBy(RATE);

  const changeInEur = paidInEur.minus(priceInEur);

  if (changeInEur.isNegative()) {
    return null;
  }

  const roundedEurChange = changeInEur.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  return {
    eur: roundedEurChange.toNumber(),
    bgn: eurToBgnDecimal(roundedEurChange).toNumber(),
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
  return new Decimal(amount).toFixed(decimals);
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

  // Replace comma with dot for European format support and trim whitespace
  const normalized = input.trim().replace(",", ".");

  try {
    const decimal = new Decimal(normalized);
    if (!decimal.isFinite()) {
      return 0;
    }
    return Math.max(0, decimal.toNumber());
  } catch {
    return 0;
  }
}
