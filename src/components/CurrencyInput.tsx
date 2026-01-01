import { useId, useRef, useEffect, type ChangeEvent } from 'react'
import {
  CURRENCY_SYMBOLS,
  CURRENCY_NAMES,
  Currency,
  type CurrencyType,
} from '../constants/exchange'
import { SwapIcon } from './icons'

const AMOUNT_PATTERN = /^[0-9]*[.,]?[0-9]*$/

export interface CurrencyInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  currency: CurrencyType
  onCurrencyToggle: () => void
  placeholder?: string
  autoFocus?: boolean
  testId?: string
}

export function CurrencyInput({
  label,
  value,
  onChange,
  currency,
  onCurrencyToggle,
  placeholder = '0.00',
  autoFocus = false,
  testId,
}: CurrencyInputProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus()
    }
  }, [autoFocus])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (newValue === '' || AMOUNT_PATTERN.test(newValue)) {
      onChange(newValue)
    }
  }

  const symbol = CURRENCY_SYMBOLS[currency]
  const currencyName = CURRENCY_NAMES[currency]
  const otherCurrency = currency === Currency.EUR ? Currency.BGN : Currency.EUR
  const otherName = CURRENCY_NAMES[otherCurrency]

  return (
    <div className="w-full" data-testid={testId}>
      <label
        htmlFor={inputId}
        className="block text-sm sm:text-base font-medium text-text-secondary mb-1.5"
      >
        {label}
      </label>

      <div className="relative flex items-stretch">
        <div className="flex items-center justify-center w-11 sm:w-14 shrink-0 bg-border rounded-l-xl border-2 border-r-0 border-border">
          <span className="text-lg sm:text-xl font-semibold text-text-primary">
            {symbol}
          </span>
        </div>

        <input
          ref={inputRef}
          id={inputId}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 min-w-0 w-full px-3 sm:px-4 py-3 sm:py-4 text-xl sm:text-2xl font-medium text-text-primary 
                     bg-bg-card border-2 border-border
                     focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-border-focus/20
                     placeholder:text-text-secondary/40"
          aria-label={`${label} в ${currencyName}`}
          data-testid={testId ? `${testId}-input` : undefined}
        />

        <button
          type="button"
          onClick={onCurrencyToggle}
          className="flex items-center justify-center gap-0.5 px-2.5 sm:px-4 shrink-0 bg-bg-card border-2 border-l-0 border-border rounded-r-xl
                     hover:bg-border/50 focus:outline-none focus:ring-2 focus:ring-border-focus/20 focus:border-border-focus
                     active:scale-95 transition-all duration-150"
          aria-label={`Смени на ${otherName}`}
          title={`Смени на ${otherName}`}
          data-testid={testId ? `${testId}-toggle` : undefined}
        >
          <span className="text-xs sm:text-sm font-bold text-lev-green tracking-wide whitespace-nowrap">
            {currencyName.toUpperCase()}
          </span>
          <SwapIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-text-secondary shrink-0" />
        </button>
      </div>
    </div>
  )
}
