import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('renders the app title', () => {
    render(<App />)
    expect(screen.getByText('Ресто Калкулатор')).toBeInTheDocument()
  })

  it('shows the exchange rate info', () => {
    render(<App />)
    expect(screen.getByText(/€1 = 1.95583 лв/)).toBeInTheDocument()
  })

  it('renders price and paid inputs', () => {
    render(<App />)
    expect(screen.getByTestId('price')).toBeInTheDocument()
    expect(screen.getByTestId('paid')).toBeInTheDocument()
  })

  it('shows result area', () => {
    render(<App />)
    expect(screen.getByTestId('result')).toBeInTheDocument()
  })

  it('shows welcome message in footer', () => {
    render(<App />)
    expect(screen.getByText('Добре дошли в Еврозоната! 🎉')).toBeInTheDocument()
  })
})

describe('App Integration', () => {
  it('calculates change when entering price and paid amount', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Enter price: 8 EUR
    const priceInput = screen.getByTestId('price-input')
    await user.type(priceInput, '8')

    // Enter paid: 20 BGN (approximately 10.23 EUR)
    const paidInput = screen.getByTestId('paid-input')
    await user.type(paidInput, '20')

    // Should show change in EUR
    expect(screen.getByText('Вашето ресто е:')).toBeInTheDocument()
    expect(screen.getByText('2.23')).toBeInTheDocument() // 10.23 - 8 = 2.23 EUR
  })

  it('shows insufficient payment warning when paid < price', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Enter price: 10 EUR
    const priceInput = screen.getByTestId('price-input')
    await user.type(priceInput, '10')

    // Enter paid: 5 BGN (approximately 2.56 EUR - less than price)
    const paidInput = screen.getByTestId('paid-input')
    await user.type(paidInput, '5')

    // Should show insufficient payment warning
    expect(screen.getByText('Недостатъчно платено!')).toBeInTheDocument()
  })

  it('shows exact payment message when amounts are equal', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Enter price: 10 EUR
    const priceInput = screen.getByTestId('price-input')
    await user.type(priceInput, '10')

    // Toggle paid to EUR
    const paidToggle = screen.getByTestId('paid-toggle')
    await user.click(paidToggle)

    // Enter paid: 10 EUR
    const paidInput = screen.getByTestId('paid-input')
    await user.type(paidInput, '10')

    // Should show exact payment message
    expect(screen.getByText('Точно платено!')).toBeInTheDocument()
  })

  it('toggles price currency between EUR and BGN', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Initially EUR
    expect(screen.getByTestId('price-toggle')).toHaveTextContent('ЕВРО')

    // Click to toggle
    await user.click(screen.getByTestId('price-toggle'))

    // Now BGN
    expect(screen.getByTestId('price-toggle')).toHaveTextContent('ЛЕВА')
  })

  it('toggles paid currency between BGN and EUR', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Initially BGN (paid default)
    expect(screen.getByTestId('paid-toggle')).toHaveTextContent('ЛЕВА')

    // Click to toggle
    await user.click(screen.getByTestId('paid-toggle'))

    // Now EUR
    expect(screen.getByTestId('paid-toggle')).toHaveTextContent('ЕВРО')
  })

  it('resets all fields when clicking reset button', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Enter values
    const priceInput = screen.getByTestId('price-input')
    const paidInput = screen.getByTestId('paid-input')
    await user.type(priceInput, '10')
    await user.type(paidInput, '20')

    // Reset button should appear
    const resetButton = screen.getByRole('button', { name: /изчисти/i })
    await user.click(resetButton)

    // Inputs should be cleared
    expect(priceInput).toHaveValue('')
    expect(paidInput).toHaveValue('')
  })

  it('handles decimal input correctly', async () => {
    const user = userEvent.setup()
    render(<App />)

    const priceInput = screen.getByTestId('price-input')
    await user.type(priceInput, '7.55')

    expect(priceInput).toHaveValue('7.55')
  })

  it('handles European comma format', async () => {
    const user = userEvent.setup()
    render(<App />)

    const priceInput = screen.getByTestId('price-input')
    await user.type(priceInput, '7,55')

    expect(priceInput).toHaveValue('7,55')
  })
})

describe('App Accessibility', () => {
  it('has accessible input labels', () => {
    render(<App />)
    
    expect(screen.getByLabelText(/цена/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/платена/i)).toBeInTheDocument()
  })

  it('has accessible currency toggle buttons', () => {
    render(<App />)
    
    const toggleButtons = screen.getAllByRole('button', { name: /смени на/i })
    expect(toggleButtons).toHaveLength(2)
  })
})

describe('Real-world scenarios', () => {
  it('Scenario: Coffee purchase - 2 EUR, pay with 5 leva', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByTestId('price-input'), '2')
    await user.type(screen.getByTestId('paid-input'), '5')

    // 5 BGN = 2.56 EUR, change = 0.56 EUR
    expect(screen.getByText('0.56')).toBeInTheDocument()
  })

  it('Scenario: Grocery shopping - 15.50 EUR, pay with 40 leva', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByTestId('price-input'), '15.50')
    await user.type(screen.getByTestId('paid-input'), '40')

    // 40 BGN = 20.45 EUR, change = 4.95 EUR
    expect(screen.getByText('4.95')).toBeInTheDocument()
  })

  it('Scenario: Restaurant bill - 25 EUR, pay with 50 leva', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByTestId('price-input'), '25')
    await user.type(screen.getByTestId('paid-input'), '50')

    // 50 BGN = 25.56 EUR, change = 0.56 EUR
    expect(screen.getByText('0.56')).toBeInTheDocument()
  })
})


