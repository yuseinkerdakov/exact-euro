import { useState, useMemo, useCallback } from 'react'
import { Currency, type CurrencyType } from '../constants/exchange'
import { toEur, calculateChange, parseAmount } from '../utils/currency'

export interface ChangeCalculatorState {
  /** Raw input value for the price field */
  priceInput: string
  /** Currency of the price (EUR or BGN) */
  priceCurrency: CurrencyType
  /** Raw input value for the paid amount field */
  paidInput: string
  /** Currency of the paid amount (EUR or BGN) */
  paidCurrency: CurrencyType
}

export interface ChangeResult {
  /** Change in Euro */
  eur: number
  /** Change in Bulgarian Lev */
  bgn: number
}

export interface UseChangeCalculatorReturn {
  /** Current state of all inputs */
  state: ChangeCalculatorState
  /** Parsed price value */
  priceValue: number
  /** Parsed paid amount value */
  paidValue: number
  /** Price converted to EUR */
  priceInEur: number
  /** Paid amount converted to EUR */
  paidInEur: number
  /** Calculated change result, or null if insufficient payment */
  changeResult: ChangeResult | null
  /** Whether the payment is sufficient */
  isPaymentSufficient: boolean
  /** Whether there are valid inputs to calculate */
  hasValidInputs: boolean
  /** Update the price input value */
  setPriceInput: (value: string) => void
  /** Toggle the price currency between EUR and BGN */
  togglePriceCurrency: () => void
  /** Set the price currency directly */
  setPriceCurrency: (currency: CurrencyType) => void
  /** Update the paid amount input value */
  setPaidInput: (value: string) => void
  /** Toggle the paid amount currency between EUR and BGN */
  togglePaidCurrency: () => void
  /** Set the paid amount currency directly */
  setPaidCurrency: (currency: CurrencyType) => void
  /** Reset all fields to their initial state */
  reset: () => void
}

const initialState: ChangeCalculatorState = {
  priceInput: '',
  priceCurrency: Currency.EUR,
  paidInput: '',
  paidCurrency: Currency.BGN,
}

/**
 * Custom hook for managing the change calculator state and calculations
 *
 * Handles:
 * - Input parsing and validation
 * - Currency conversion
 * - Change calculation
 * - State management for all form fields
 */
export function useChangeCalculator(): UseChangeCalculatorReturn {
  const [state, setState] = useState<ChangeCalculatorState>(initialState)

  // Parse input values
  const priceValue = useMemo(
    () => parseAmount(state.priceInput),
    [state.priceInput]
  )

  const paidValue = useMemo(
    () => parseAmount(state.paidInput),
    [state.paidInput]
  )

  // Convert to EUR for calculations
  const priceInEur = useMemo(
    () => toEur(priceValue, state.priceCurrency),
    [priceValue, state.priceCurrency]
  )

  const paidInEur = useMemo(
    () => toEur(paidValue, state.paidCurrency),
    [paidValue, state.paidCurrency]
  )

  // Calculate change
  const changeResult = useMemo(
    () => calculateChange(priceInEur, paidInEur),
    [priceInEur, paidInEur]
  )

  // Derived states
  const isPaymentSufficient = changeResult !== null
  const hasValidInputs = priceValue > 0 && paidValue > 0

  // Action handlers
  const setPriceInput = useCallback((value: string) => {
    setState((prev) => ({ ...prev, priceInput: value }))
  }, [])

  const togglePriceCurrency = useCallback(() => {
    setState((prev) => ({
      ...prev,
      priceCurrency:
        prev.priceCurrency === Currency.EUR ? Currency.BGN : Currency.EUR,
    }))
  }, [])

  const setPriceCurrency = useCallback((currency: CurrencyType) => {
    setState((prev) => ({ ...prev, priceCurrency: currency }))
  }, [])

  const setPaidInput = useCallback((value: string) => {
    setState((prev) => ({ ...prev, paidInput: value }))
  }, [])

  const togglePaidCurrency = useCallback(() => {
    setState((prev) => ({
      ...prev,
      paidCurrency:
        prev.paidCurrency === Currency.EUR ? Currency.BGN : Currency.EUR,
    }))
  }, [])

  const setPaidCurrency = useCallback((currency: CurrencyType) => {
    setState((prev) => ({ ...prev, paidCurrency: currency }))
  }, [])

  const reset = useCallback(() => {
    setState(initialState)
  }, [])

  return {
    state,
    priceValue,
    paidValue,
    priceInEur,
    paidInEur,
    changeResult,
    isPaymentSufficient,
    hasValidInputs,
    setPriceInput,
    togglePriceCurrency,
    setPriceCurrency,
    setPaidInput,
    togglePaidCurrency,
    setPaidCurrency,
    reset,
  }
}


