import { describe, it, expect } from 'vitest'
import {
  bgnToEur,
  eurToBgn,
  toEur,
  toBgn,
  calculateChange,
  calculateChangeWithCurrencies,
  formatAmount,
  parseAmount,
} from './currency'
import { EXCHANGE_RATE, Currency } from '../constants/exchange'

describe('Currency Conversion Utilities', () => {
  describe('bgnToEur', () => {
    it('converts BGN to EUR using the fixed exchange rate', () => {
      // 1.95583 BGN = 1 EUR
      expect(bgnToEur(1.95583)).toBe(1)
      expect(bgnToEur(EXCHANGE_RATE)).toBe(1)
    })

    it('correctly converts common amounts', () => {
      expect(bgnToEur(10)).toBe(5.11)
      expect(bgnToEur(19.56)).toBe(10)
      expect(bgnToEur(100)).toBe(51.13)
    })

    it('handles zero', () => {
      expect(bgnToEur(0)).toBe(0)
    })

    it('handles edge cases', () => {
      expect(bgnToEur(NaN)).toBe(0)
      expect(bgnToEur(Infinity)).toBe(0)
      expect(bgnToEur(-Infinity)).toBe(0)
    })

    it('handles small amounts correctly', () => {
      expect(bgnToEur(0.01)).toBe(0.01)
      expect(bgnToEur(0.02)).toBe(0.01)
    })
  })

  describe('eurToBgn', () => {
    it('converts EUR to BGN using the fixed exchange rate', () => {
      expect(eurToBgn(1)).toBe(1.96)
      expect(eurToBgn(1)).toBeCloseTo(EXCHANGE_RATE, 1)
    })

    it('correctly converts common amounts', () => {
      expect(eurToBgn(5)).toBe(9.78)
      expect(eurToBgn(10)).toBe(19.56)
      expect(eurToBgn(50)).toBe(97.79)
    })

    it('handles zero', () => {
      expect(eurToBgn(0)).toBe(0)
    })

    it('handles edge cases', () => {
      expect(eurToBgn(NaN)).toBe(0)
      expect(eurToBgn(Infinity)).toBe(0)
      expect(eurToBgn(-Infinity)).toBe(0)
    })
  })

  describe('toEur', () => {
    it('returns the same amount when already in EUR', () => {
      expect(toEur(10, Currency.EUR)).toBe(10)
      expect(toEur(5.55, Currency.EUR)).toBe(5.55)
    })

    it('converts BGN to EUR when currency is BGN', () => {
      expect(toEur(EXCHANGE_RATE, Currency.BGN)).toBe(1)
      expect(toEur(10, Currency.BGN)).toBe(5.11)
    })

    it('rounds EUR amounts to 2 decimal places', () => {
      expect(toEur(10.999, Currency.EUR)).toBe(11)
      expect(toEur(10.001, Currency.EUR)).toBe(10)
    })
  })

  describe('toBgn', () => {
    it('returns the same amount when already in BGN', () => {
      expect(toBgn(10, Currency.BGN)).toBe(10)
      expect(toBgn(5.55, Currency.BGN)).toBe(5.55)
    })

    it('converts EUR to BGN when currency is EUR', () => {
      expect(toBgn(1, Currency.EUR)).toBe(1.96)
      expect(toBgn(10, Currency.EUR)).toBe(19.56)
    })

    it('rounds BGN amounts to 2 decimal places', () => {
      expect(toBgn(10.999, Currency.BGN)).toBe(11)
    })
  })

  describe('calculateChange', () => {
    it('calculates correct change in both currencies', () => {
      const result = calculateChange(8, 10)
      expect(result).not.toBeNull()
      expect(result!.eur).toBe(2)
      expect(result!.bgn).toBe(3.91)
    })

    it('returns zero change when exact payment', () => {
      const result = calculateChange(10, 10)
      expect(result).not.toBeNull()
      expect(result!.eur).toBe(0)
      expect(result!.bgn).toBe(0)
    })

    it('returns null when payment is insufficient', () => {
      expect(calculateChange(10, 5)).toBeNull()
      expect(calculateChange(10, 9.99)).toBeNull()
    })

    it('handles decimal prices correctly', () => {
      const result = calculateChange(7.55, 10)
      expect(result).not.toBeNull()
      expect(result!.eur).toBe(2.45)
    })

    it('handles large amounts', () => {
      const result = calculateChange(50, 100)
      expect(result).not.toBeNull()
      expect(result!.eur).toBe(50)
      expect(result!.bgn).toBe(97.79)
    })
  })

  describe('formatAmount', () => {
    it('formats numbers with 2 decimal places by default', () => {
      expect(formatAmount(10)).toBe('10.00')
      expect(formatAmount(10.5)).toBe('10.50')
      expect(formatAmount(10.556)).toBe('10.56')
    })

    it('supports custom decimal places', () => {
      expect(formatAmount(10.12345, 3)).toBe('10.123')
      expect(formatAmount(10, 0)).toBe('10')
    })

    it('handles edge cases', () => {
      expect(formatAmount(NaN)).toBe('0.00')
      expect(formatAmount(Infinity)).toBe('0.00')
    })
  })

  describe('parseAmount', () => {
    it('parses valid number strings', () => {
      expect(parseAmount('10')).toBe(10)
      expect(parseAmount('10.50')).toBe(10.5)
      expect(parseAmount('0.01')).toBe(0.01)
    })

    it('handles European comma format', () => {
      expect(parseAmount('10,50')).toBe(10.5)
      expect(parseAmount('5,99')).toBe(5.99)
    })

    it('returns 0 for empty or invalid input', () => {
      expect(parseAmount('')).toBe(0)
      expect(parseAmount('   ')).toBe(0)
      expect(parseAmount('abc')).toBe(0)
    })

    it('handles whitespace', () => {
      expect(parseAmount(' 10 ')).toBe(10)
    })

    it('returns 0 for negative numbers (no negative prices)', () => {
      expect(parseAmount('-10')).toBe(0)
    })
  })
})

describe('Exchange Rate Consistency', () => {
  it('uses the official fixed exchange rate', () => {
    expect(EXCHANGE_RATE).toBe(1.95583)
  })

  it('round-trip conversion is consistent', () => {
    const originalEur = 100
    const inBgn = eurToBgn(originalEur)
    const backToEur = bgnToEur(inBgn)
    // Allow for small rounding differences (max 1 cent)
    expect(Math.abs(backToEur - originalEur)).toBeLessThanOrEqual(0.01)
  })

  it('maintains precision for typical transaction amounts', () => {
    // Test realistic grocery store scenarios
    const testCases = [
      { bgn: 5.0, expectedEur: 2.56 },
      { bgn: 10.0, expectedEur: 5.11 },
      { bgn: 20.0, expectedEur: 10.23 },
      { bgn: 50.0, expectedEur: 25.56 },
    ]

    testCases.forEach(({ bgn, expectedEur }) => {
      expect(bgnToEur(bgn)).toBe(expectedEur)
    })
  })
})

describe('Decimal Precision Tests', () => {
  describe('calculateChangeWithCurrencies - same currency (no conversion errors)', () => {
    it('calculates EXACT change when both amounts are in EUR', () => {
      // 100 - 10 = 90.00 exactly - no conversion needed
      const result = calculateChangeWithCurrencies(10, Currency.EUR, 100, Currency.EUR)

      expect(result).not.toBeNull()
      expect(result!.eur).toBe(90)
      expect(result!.bgn).toBe(176.02) // 90 * 1.95583 = 176.0247, rounded to 176.02
    })

    it('calculates EXACT change when both amounts are in BGN', () => {
      // THIS IS THE FIX: 100 BGN - 10 BGN = 90 BGN exactly
      // No conversion round-trip needed when both currencies match
      const result = calculateChangeWithCurrencies(10, Currency.BGN, 100, Currency.BGN)

      expect(result).not.toBeNull()
      expect(result!.bgn).toBe(90) // Exact! No floating-point error
      expect(result!.eur).toBe(46.02) // 90 / 1.95583 = 46.0194, rounded to 46.02
    })

    it('handles exact payment in same currency (EUR)', () => {
      const result = calculateChangeWithCurrencies(50, Currency.EUR, 50, Currency.EUR)

      expect(result).not.toBeNull()
      expect(result!.eur).toBe(0)
      expect(result!.bgn).toBe(0)
    })

    it('handles exact payment in same currency (BGN)', () => {
      const result = calculateChangeWithCurrencies(50, Currency.BGN, 50, Currency.BGN)

      expect(result).not.toBeNull()
      expect(result!.eur).toBe(0)
      expect(result!.bgn).toBe(0)
    })

    it('handles decimal amounts in same currency (BGN)', () => {
      // 50.50 BGN - 10.25 BGN = 40.25 BGN exactly
      const result = calculateChangeWithCurrencies(10.25, Currency.BGN, 50.50, Currency.BGN)

      expect(result).not.toBeNull()
      expect(result!.bgn).toBe(40.25) // Exact!
    })

    it('handles decimal amounts in same currency (EUR)', () => {
      // 99.99 EUR - 49.99 EUR = 50.00 EUR exactly
      const result = calculateChangeWithCurrencies(49.99, Currency.EUR, 99.99, Currency.EUR)

      expect(result).not.toBeNull()
      expect(result!.eur).toBe(50) // Exact!
    })
  })

  describe('calculateChangeWithCurrencies - mixed currencies', () => {
    it('handles price in EUR, paid in BGN', () => {
      // Price: 10 EUR, Paid: 25 BGN (≈ 12.78 EUR)
      const result = calculateChangeWithCurrencies(10, Currency.EUR, 25, Currency.BGN)

      expect(result).not.toBeNull()
      expect(result!.eur).toBe(2.78) // 25/1.95583 - 10 = 2.78
    })

    it('handles price in BGN, paid in EUR', () => {
      // Price: 10 BGN (≈ 5.11 EUR), Paid: 10 EUR
      const result = calculateChangeWithCurrencies(10, Currency.BGN, 10, Currency.EUR)

      expect(result).not.toBeNull()
      expect(result!.eur).toBe(4.89) // 10 - 10/1.95583 = 4.89
    })

    it('returns null when mixed currency payment is insufficient', () => {
      // Price: 100 EUR, Paid: 100 BGN (≈ 51.13 EUR)
      const result = calculateChangeWithCurrencies(100, Currency.EUR, 100, Currency.BGN)
      expect(result).toBeNull()
    })
  })

  describe('legacy calculateChange function still works', () => {
    it('calculates change when both amounts are in EUR', () => {
      const priceInEur = toEur(10, Currency.EUR)
      const paidInEur = toEur(100, Currency.EUR)
      const result = calculateChange(priceInEur, paidInEur)

      expect(result).not.toBeNull()
      expect(result!.eur).toBe(90)
    })

    it('handles exact payment', () => {
      const result = calculateChange(50, 50)
      expect(result).not.toBeNull()
      expect(result!.eur).toBe(0)
      expect(result!.bgn).toBe(0)
    })
  })

  describe('floating-point edge cases', () => {
    it('handles 0.1 + 0.2 type precision issues', () => {
      // Classic JS floating-point problem: 0.1 + 0.2 !== 0.3
      const price = toEur(0.1, Currency.EUR)
      const paid = toEur(0.4, Currency.EUR)
      const result = calculateChange(price, paid)

      expect(result).not.toBeNull()
      expect(result!.eur).toBe(0.3) // Should be exactly 0.30, not 0.30000000000000004
    })

    it('handles subtraction precision issues', () => {
      // 10.00 - 9.99 should be exactly 0.01
      const result = calculateChange(9.99, 10)

      expect(result).not.toBeNull()
      expect(result!.eur).toBe(0.01)
    })

    it('handles multiplication precision in BGN conversion', () => {
      // 1 EUR * 1.95583 = 1.96 BGN (rounded)
      expect(eurToBgn(1)).toBe(1.96)

      // 100 EUR * 1.95583 = 195.583 = 195.58 BGN (rounded)
      expect(eurToBgn(100)).toBe(195.58)
    })

    it('handles division precision in EUR conversion', () => {
      // 1 BGN / 1.95583 = 0.5112... = 0.51 EUR (rounded)
      expect(bgnToEur(1)).toBe(0.51)

      // 100 BGN / 1.95583 = 51.1291... = 51.13 EUR (rounded)
      expect(bgnToEur(100)).toBe(51.13)
    })
  })

  describe('real-world transaction scenarios', () => {
    it('handles typical grocery transaction', () => {
      // Price: 7.89 EUR, paid with 20 BGN note
      const priceInEur = toEur(7.89, Currency.EUR)
      const paidInEur = toEur(20, Currency.BGN) // 20 BGN = 10.23 EUR

      const result = calculateChange(priceInEur, paidInEur)

      expect(result).not.toBeNull()
      expect(result!.eur).toBe(2.34) // 10.23 - 7.89 = 2.34
    })

    it('handles coffee shop scenario', () => {
      // Coffee: 3.50 EUR, paid with 10 BGN
      const priceInEur = toEur(3.5, Currency.EUR)
      const paidInEur = toEur(10, Currency.BGN) // 10 BGN = 5.11 EUR

      const result = calculateChange(priceInEur, paidInEur)

      expect(result).not.toBeNull()
      expect(result!.eur).toBe(1.61) // 5.11 - 3.50 = 1.61
    })

    it('handles restaurant bill scenario', () => {
      // Bill: 45.80 EUR, paid with 100 BGN
      const priceInEur = toEur(45.8, Currency.EUR)
      const paidInEur = toEur(100, Currency.BGN) // 100 BGN = 51.13 EUR

      const result = calculateChange(priceInEur, paidInEur)

      expect(result).not.toBeNull()
      expect(result!.eur).toBe(5.33) // 51.13 - 45.80 = 5.33
    })

    it('handles mixed currency payment (price in BGN, paid in EUR)', () => {
      // Price: 15 BGN, paid with 10 EUR
      const priceInEur = toEur(15, Currency.BGN) // 15 BGN = 7.67 EUR
      const paidInEur = toEur(10, Currency.EUR)

      const result = calculateChange(priceInEur, paidInEur)

      expect(result).not.toBeNull()
      expect(result!.eur).toBe(2.33) // 10 - 7.67 = 2.33
    })

    it('handles small change correctly', () => {
      // Price: 4.99 EUR, paid with 5 EUR
      const priceInEur = toEur(4.99, Currency.EUR)
      const paidInEur = toEur(5, Currency.EUR)

      const result = calculateChange(priceInEur, paidInEur)

      expect(result).not.toBeNull()
      expect(result!.eur).toBe(0.01)
      expect(result!.bgn).toBe(0.02) // 0.01 * 1.95583 = 0.0195... = 0.02
    })

    it('handles large transaction', () => {
      // Price: 999.99 EUR, paid with 2000 BGN
      const priceInEur = toEur(999.99, Currency.EUR)
      const paidInEur = toEur(2000, Currency.BGN) // 2000 BGN = 1022.58 EUR

      const result = calculateChange(priceInEur, paidInEur)

      expect(result).not.toBeNull()
      expect(result!.eur).toBe(22.59) // 1022.58 - 999.99 = 22.59
    })
  })

  describe('boundary and edge cases', () => {
    it('handles very small amounts', () => {
      expect(toEur(0.01, Currency.EUR)).toBe(0.01)
      expect(toEur(0.01, Currency.BGN)).toBe(0.01) // 0.01 BGN = 0.005... = 0.01 EUR
    })

    it('handles zero correctly', () => {
      expect(toEur(0, Currency.EUR)).toBe(0)
      expect(toEur(0, Currency.BGN)).toBe(0)
      expect(eurToBgn(0)).toBe(0)
      expect(bgnToEur(0)).toBe(0)

      const result = calculateChange(0, 10)
      expect(result).not.toBeNull()
      expect(result!.eur).toBe(10)
    })

    it('handles numbers with many decimal places', () => {
      // Should round properly
      expect(toEur(10.12345, Currency.EUR)).toBe(10.12)
      expect(toEur(10.129, Currency.EUR)).toBe(10.13)
      expect(toEur(10.125, Currency.EUR)).toBe(10.13) // ROUND_HALF_UP
    })

    it('handles exact exchange rate amount', () => {
      // 1.95583 BGN should convert to exactly 1 EUR
      expect(bgnToEur(1.95583)).toBe(1)

      // 1 EUR should convert to 1.96 BGN (1.95583 rounded)
      expect(eurToBgn(1)).toBe(1.96)
    })
  })
})
