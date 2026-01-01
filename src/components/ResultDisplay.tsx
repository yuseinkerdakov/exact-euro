import { CURRENCY_SYMBOLS, Currency } from '../constants/exchange'
import { formatAmount } from '../utils/currency'
import { WarningIcon, CheckCircleIcon } from './icons'
import type { ChangeResult } from '../hooks/useChangeCalculator'

export interface ResultDisplayProps {
  result: ChangeResult | null
  hasValidInputs: boolean
  testId?: string
}

function EmptyState({ testId }: { testId?: string }) {
  return (
    <div
      className="mt-6 p-4 sm:p-6 bg-border/30 rounded-2xl text-center"
      data-testid={testId}
    >
      <p className="text-base sm:text-lg text-text-secondary">
        Въведете цена и платена сума, за да видите ресто
      </p>
    </div>
  )
}

function InsufficientPayment({ testId }: { testId?: string }) {
  return (
    <div
      className="mt-6 p-4 sm:p-6 bg-error/10 border-2 border-error/30 rounded-2xl text-center"
      data-testid={testId}
    >
      <div className="flex items-center justify-center gap-2 mb-1.5">
        <WarningIcon className="w-5 h-5 sm:w-6 sm:h-6 text-error shrink-0" />
        <span className="text-base sm:text-lg font-semibold text-error">
          Недостатъчно платено!
        </span>
      </div>
      <p className="text-sm sm:text-base text-text-secondary">
        Платената сума е по-малка от цената
      </p>
    </div>
  )
}

function ExactPayment({ testId }: { testId?: string }) {
  return (
    <div
      className="mt-6 p-4 sm:p-6 bg-success/10 border-2 border-success/30 rounded-2xl text-center"
      data-testid={testId}
    >
      <div className="flex items-center justify-center gap-2">
        <CheckCircleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-success shrink-0" />
        <span className="text-xl sm:text-2xl font-bold text-success">
          Точно платено!
        </span>
      </div>
      <p className="mt-1.5 text-sm sm:text-base text-text-secondary">
        Няма нужда от ресто
      </p>
    </div>
  )
}

function ChangeDisplay({
  result,
  testId,
}: {
  result: ChangeResult
  testId?: string
}) {
  return (
    <div
      className="mt-6 p-4 sm:p-6 bg-gradient-to-br from-euro-gold/20 via-bg-card to-lev-green/20 
                 border-2 border-euro-gold/40 rounded-2xl shadow-lg overflow-hidden"
      data-testid={testId}
    >
      <h2 className="text-center text-base sm:text-lg font-medium text-text-secondary mb-3 sm:mb-4">
        Вашето ресто е:
      </h2>

      <div className="text-center mb-4 sm:mb-6">
        <div
          className="inline-flex items-baseline gap-1 sm:gap-2 bg-bg-card/80 px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-sm max-w-full"
          data-testid={testId ? `${testId}-eur` : undefined}
        >
          <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-lev-green font-display tracking-tight truncate">
            {formatAmount(result.eur)}
          </span>
          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-lev-green shrink-0">
            {CURRENCY_SYMBOLS[Currency.EUR]}
          </span>
        </div>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-text-secondary font-medium">
          Евро (ще получите)
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 my-3 sm:my-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs sm:text-sm text-text-secondary whitespace-nowrap">
          или равностойно на
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="text-center">
        <div
          className="inline-flex items-baseline gap-1 sm:gap-2 max-w-full"
          data-testid={testId ? `${testId}-bgn` : undefined}
        >
          <span className="text-2xl sm:text-3xl md:text-4xl font-semibold text-euro-gold-dark font-display truncate">
            {formatAmount(result.bgn)}
          </span>
          <span className="text-lg sm:text-xl md:text-2xl font-semibold text-euro-gold-dark shrink-0">
            {CURRENCY_SYMBOLS[Currency.BGN]}
          </span>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-text-secondary">
          Лева (за справка)
        </p>
      </div>
    </div>
  )
}

export function ResultDisplay({
  result,
  hasValidInputs,
  testId,
}: ResultDisplayProps) {
  if (!hasValidInputs) {
    return <EmptyState testId={testId} />
  }

  if (result === null) {
    return <InsufficientPayment testId={testId} />
  }

  if (result.eur === 0) {
    return <ExactPayment testId={testId} />
  }

  return <ChangeDisplay result={result} testId={testId} />
}
