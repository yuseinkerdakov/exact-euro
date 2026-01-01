import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useChangeCalculator } from './useChangeCalculator'
import { Currency } from '../constants/exchange'

describe('useChangeCalculator', () => {
  describe('initial state', () => {
    it('starts with empty inputs', () => {
      const { result } = renderHook(() => useChangeCalculator())

      expect(result.current.state.priceInput).toBe('')
      expect(result.current.state.paidInput).toBe('')
      expect(result.current.priceValue).toBe(0)
      expect(result.current.paidValue).toBe(0)
    })

    it('defaults price currency to EUR', () => {
      const { result } = renderHook(() => useChangeCalculator())
      expect(result.current.state.priceCurrency).toBe(Currency.EUR)
    })

    it('defaults paid currency to BGN', () => {
      const { result } = renderHook(() => useChangeCalculator())
      expect(result.current.state.paidCurrency).toBe(Currency.BGN)
    })

    it('has no valid inputs initially', () => {
      const { result } = renderHook(() => useChangeCalculator())
      expect(result.current.hasValidInputs).toBe(false)
    })
  })

  describe('input handling', () => {
    it('updates price input', () => {
      const { result } = renderHook(() => useChangeCalculator())

      act(() => {
        result.current.setPriceInput('10.50')
      })

      expect(result.current.state.priceInput).toBe('10.50')
      expect(result.current.priceValue).toBe(10.5)
    })

    it('updates paid input', () => {
      const { result } = renderHook(() => useChangeCalculator())

      act(() => {
        result.current.setPaidInput('20')
      })

      expect(result.current.state.paidInput).toBe('20')
      expect(result.current.paidValue).toBe(20)
    })

    it('handles invalid inputs gracefully', () => {
      const { result } = renderHook(() => useChangeCalculator())

      act(() => {
        result.current.setPriceInput('abc')
      })

      expect(result.current.priceValue).toBe(0)
    })
  })

  describe('currency toggling', () => {
    it('toggles price currency from EUR to BGN', () => {
      const { result } = renderHook(() => useChangeCalculator())

      act(() => {
        result.current.togglePriceCurrency()
      })

      expect(result.current.state.priceCurrency).toBe(Currency.BGN)
    })

    it('toggles price currency back to EUR', () => {
      const { result } = renderHook(() => useChangeCalculator())

      act(() => {
        result.current.togglePriceCurrency()
        result.current.togglePriceCurrency()
      })

      expect(result.current.state.priceCurrency).toBe(Currency.EUR)
    })

    it('toggles paid currency from BGN to EUR', () => {
      const { result } = renderHook(() => useChangeCalculator())

      act(() => {
        result.current.togglePaidCurrency()
      })

      expect(result.current.state.paidCurrency).toBe(Currency.EUR)
    })

    it('can set currency directly', () => {
      const { result } = renderHook(() => useChangeCalculator())

      act(() => {
        result.current.setPriceCurrency(Currency.BGN)
        result.current.setPaidCurrency(Currency.EUR)
      })

      expect(result.current.state.priceCurrency).toBe(Currency.BGN)
      expect(result.current.state.paidCurrency).toBe(Currency.EUR)
    })
  })

  describe('change calculation', () => {
    it('calculates change when payment exceeds price', () => {
      const { result } = renderHook(() => useChangeCalculator())

      act(() => {
        result.current.setPriceInput('8')
        result.current.setPaidInput('19.56') // ~10 EUR in BGN
      })

      expect(result.current.hasValidInputs).toBe(true)
      expect(result.current.isPaymentSufficient).toBe(true)
      expect(result.current.changeResult).not.toBeNull()
      expect(result.current.changeResult!.eur).toBe(2)
    })

    it('returns null change when payment is insufficient', () => {
      const { result } = renderHook(() => useChangeCalculator())

      act(() => {
        result.current.setPriceInput('10')
        result.current.setPaidInput('5') // 5 BGN < 10 EUR
      })

      expect(result.current.hasValidInputs).toBe(true)
      expect(result.current.isPaymentSufficient).toBe(false)
      expect(result.current.changeResult).toBeNull()
    })

    it('converts price from EUR correctly', () => {
      const { result } = renderHook(() => useChangeCalculator())

      act(() => {
        result.current.setPriceInput('10')
        result.current.setPriceCurrency(Currency.EUR)
      })

      expect(result.current.priceInEur).toBe(10)
    })

    it('converts price from BGN correctly', () => {
      const { result } = renderHook(() => useChangeCalculator())

      act(() => {
        result.current.setPriceInput('19.56')
        result.current.setPriceCurrency(Currency.BGN)
      })

      expect(result.current.priceInEur).toBe(10)
    })

    it('handles exact payment (no change)', () => {
      const { result } = renderHook(() => useChangeCalculator())

      act(() => {
        result.current.setPriceInput('10')
        result.current.setPriceCurrency(Currency.EUR)
        result.current.setPaidInput('10')
        result.current.setPaidCurrency(Currency.EUR)
      })

      expect(result.current.changeResult).not.toBeNull()
      expect(result.current.changeResult!.eur).toBe(0)
      expect(result.current.changeResult!.bgn).toBe(0)
    })
  })

  describe('reset', () => {
    it('resets all fields to initial state', () => {
      const { result } = renderHook(() => useChangeCalculator())

      act(() => {
        result.current.setPriceInput('10')
        result.current.setPaidInput('20')
        result.current.setPriceCurrency(Currency.BGN)
        result.current.setPaidCurrency(Currency.EUR)
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.state.priceInput).toBe('')
      expect(result.current.state.paidInput).toBe('')
      expect(result.current.state.priceCurrency).toBe(Currency.EUR)
      expect(result.current.state.paidCurrency).toBe(Currency.BGN)
    })
  })

  describe('real-world scenarios', () => {
    it('handles typical grocery store scenario', () => {
      const { result } = renderHook(() => useChangeCalculator())

      // Price: 7.50 EUR, Customer pays with 20 leva note
      act(() => {
        result.current.setPriceInput('7.50')
        result.current.setPriceCurrency(Currency.EUR)
        result.current.setPaidInput('20')
        result.current.setPaidCurrency(Currency.BGN)
      })

      expect(result.current.isPaymentSufficient).toBe(true)
      expect(result.current.changeResult).not.toBeNull()
      // 20 BGN = 10.23 EUR, change = 10.23 - 7.50 = 2.73 EUR
      expect(result.current.changeResult!.eur).toBe(2.73)
    })

    it('handles small purchase with Lev payment', () => {
      const { result } = renderHook(() => useChangeCalculator())

      // Coffee: 2 EUR, Customer pays with 5 leva
      act(() => {
        result.current.setPriceInput('2')
        result.current.setPriceCurrency(Currency.EUR)
        result.current.setPaidInput('5')
        result.current.setPaidCurrency(Currency.BGN)
      })

      expect(result.current.isPaymentSufficient).toBe(true)
      // 5 BGN = 2.56 EUR, change = 2.56 - 2 = 0.56 EUR
      expect(result.current.changeResult!.eur).toBe(0.56)
    })
  })
})


