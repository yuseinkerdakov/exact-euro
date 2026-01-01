/**
 * Official fixed exchange rate for Bulgaria's Euro adoption
 * 1 EUR = 1.95583 BGN (Bulgarian Lev)
 * 
 * This rate was set by the European Council and is irrevocable.
 * Source: https://ec.europa.eu/info/business-economy-euro/euro-area/enlargement-euro-area/bulgaria_en
 */
export const EXCHANGE_RATE = 1.95583

/**
 * Currency codes used in the application
 */
export const Currency = {
  EUR: 'EUR',
  BGN: 'BGN',
} as const

export type CurrencyType = (typeof Currency)[keyof typeof Currency]

/**
 * Currency display symbols
 */
export const CURRENCY_SYMBOLS: Record<CurrencyType, string> = {
  EUR: '€',
  BGN: 'лв',
}

/**
 * Currency display names in Bulgarian
 */
export const CURRENCY_NAMES: Record<CurrencyType, string> = {
  EUR: 'Евро',
  BGN: 'Лева',
}

