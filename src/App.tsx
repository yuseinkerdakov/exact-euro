import {
  Header,
  Footer,
  CurrencyInput,
  ResultDisplay,
  ResetButton,
} from './components'
import { useChangeCalculator } from './hooks/useChangeCalculator'
import { EXCHANGE_RATE } from './constants/exchange'
import { Analytics } from '@vercel/analytics/react'
import './App.css'

export default function App() {
  const {
    state,
    hasValidInputs,
    changeResult,
    setPriceInput,
    togglePriceCurrency,
    setPaidInput,
    togglePaidCurrency,
    reset,
  } = useChangeCalculator()

  return (
    <div className="min-h-screen min-h-dvh flex flex-col">
      <Header />

      <main className="flex-1 px-3 sm:px-4 pb-4 sm:pb-8">
        <div className="max-w-md mx-auto">
          <div className="bg-bg-card rounded-2xl sm:rounded-3xl shadow-xl border border-border/50 p-4 sm:p-6 md:p-8">
            <div className="mb-4 sm:mb-6">
              <CurrencyInput
                label="💰 Цена на покупката"
                value={state.priceInput}
                onChange={setPriceInput}
                currency={state.priceCurrency}
                onCurrencyToggle={togglePriceCurrency}
                placeholder="0.00"
                autoFocus
                testId="price"
              />
            </div>

            <div className="mb-3 sm:mb-4">
              <CurrencyInput
                label="💵 Платена сума"
                value={state.paidInput}
                onChange={setPaidInput}
                currency={state.paidCurrency}
                onCurrencyToggle={togglePaidCurrency}
                placeholder="0.00"
                testId="paid"
              />
            </div>

            {hasValidInputs && <ResetButton onClick={reset} />}

            <ResultDisplay
              result={changeResult}
              hasValidInputs={hasValidInputs}
              testId="result"
            />
          </div>

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm text-text-secondary">
              Фиксиран курс:{' '}
              <strong className="text-text-primary">
                €1 = {EXCHANGE_RATE} лв
              </strong>
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <Analytics />
    </div>
  )
}
