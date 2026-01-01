import { describe, it, expect } from 'vitest'
import {
  bgnToEur,
  eurToBgn,
  toEur,
  toBgn,
  calculateChange,
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

