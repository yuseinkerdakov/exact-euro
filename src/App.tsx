import { CurrencyInput, ResultDisplay } from './components'
import { useChangeCalculator } from './hooks/useChangeCalculator'
import { EXCHANGE_RATE } from './constants/exchange'
import './App.css'

function App() {
  const calculator = useChangeCalculator()

  return (
    <div className="min-h-screen min-h-dvh flex flex-col">
      {/* Header - more compact on mobile */}
      <header className="py-4 sm:py-6 px-4 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary font-display leading-tight">
            <span className="text-euro-gold-dark">🇧🇬</span>{' '}
            <span className="bg-gradient-to-r from-lev-green to-euro-gold-dark bg-clip-text text-transparent">
              Ресто Калкулатор
            </span>{' '}
            <span className="text-lev-green">🇪🇺</span>
          </h1>
          <p className="mt-1.5 sm:mt-2 text-text-secondary text-sm sm:text-base md:text-lg">
            Плащате в лева, получавате ресто в евро? Изчислете лесно!
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-3 sm:px-4 pb-4 sm:pb-8">
        <div className="max-w-md mx-auto">
          {/* Calculator Card - tighter padding on mobile */}
          <div className="bg-bg-card rounded-2xl sm:rounded-3xl shadow-xl border border-border/50 p-4 sm:p-6 md:p-8">
            {/* Price Input */}
            <div className="mb-4 sm:mb-6">
              <CurrencyInput
                label="💰 Цена на покупката"
                value={calculator.state.priceInput}
                onChange={calculator.setPriceInput}
                currency={calculator.state.priceCurrency}
                onCurrencyToggle={calculator.togglePriceCurrency}
                placeholder="0.00"
                autoFocus
                testId="price"
              />
            </div>

            {/* Paid Amount Input */}
            <div className="mb-3 sm:mb-4">
              <CurrencyInput
                label="💵 Платена сума"
                value={calculator.state.paidInput}
                onChange={calculator.setPaidInput}
                currency={calculator.state.paidCurrency}
                onCurrencyToggle={calculator.togglePaidCurrency}
                placeholder="0.00"
                testId="paid"
              />
            </div>

            {/* Reset Button - only show when there are inputs */}
            {calculator.hasValidInputs && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={calculator.reset}
                  className="text-xs sm:text-sm text-text-secondary hover:text-error 
                           flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-error/10
                           active:scale-95 transition-all"
                  aria-label="Изчисти всичко"
                >
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Изчисти
                </button>
              </div>
            )}

            {/* Result Display */}
            <ResultDisplay
              result={calculator.changeResult}
              hasValidInputs={calculator.hasValidInputs}
              testId="result"
            />
          </div>

          {/* Exchange Rate Info */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm text-text-secondary">
              Фиксиран курс: <strong className="text-text-primary">€1 = {EXCHANGE_RATE} лв</strong>
            </p>
          </div>
        </div>
      </main>

      {/* Footer - compact */}
      <footer className="py-3 sm:py-4 px-4 text-center border-t border-border/50 mt-auto">
        <div className="max-w-md mx-auto">
          <p className="text-xs sm:text-sm text-text-secondary">
            Добре дошли в Еврозоната! 🎉
          </p>
          <p className="text-[10px] sm:text-xs text-text-secondary/70 mt-0.5 sm:mt-1">
            От 1 януари 2026 г. • Ресто се връща само в евро
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
