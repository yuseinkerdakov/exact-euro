import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CurrencyInput } from './CurrencyInput'
import { Currency } from '../constants/exchange'

describe('CurrencyInput', () => {
  const defaultProps = {
    label: 'Test Label',
    value: '',
    onChange: vi.fn(),
    currency: Currency.EUR,
    onCurrencyToggle: vi.fn(),
  }

  it('renders with the correct label', () => {
    render(<CurrencyInput {...defaultProps} />)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('displays the correct currency symbol for EUR', () => {
    render(<CurrencyInput {...defaultProps} currency={Currency.EUR} />)
    expect(screen.getByText('€')).toBeInTheDocument()
  })

  it('displays the correct currency symbol for BGN', () => {
    render(<CurrencyInput {...defaultProps} currency={Currency.BGN} />)
    expect(screen.getByText('лв')).toBeInTheDocument()
  })

  it('shows the current currency name on the toggle button', () => {
    render(<CurrencyInput {...defaultProps} currency={Currency.EUR} />)
    expect(screen.getByText('ЕВРО')).toBeInTheDocument()
  })

  it('calls onChange when typing valid numbers', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<CurrencyInput {...defaultProps} onChange={onChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, '10.50')

    expect(onChange).toHaveBeenCalledWith('1')
    expect(onChange).toHaveBeenCalledWith('0')
    expect(onChange).toHaveBeenCalledWith('.')
    expect(onChange).toHaveBeenCalledWith('5')
    expect(onChange).toHaveBeenCalledWith('0')
  })

  it('calls onCurrencyToggle when clicking the toggle button', async () => {
    const user = userEvent.setup()
    const onCurrencyToggle = vi.fn()
    render(<CurrencyInput {...defaultProps} onCurrencyToggle={onCurrencyToggle} />)

    const toggleButton = screen.getByRole('button')
    await user.click(toggleButton)

    expect(onCurrencyToggle).toHaveBeenCalledTimes(1)
  })

  it('displays the input value', () => {
    render(<CurrencyInput {...defaultProps} value="25.50" />)
    expect(screen.getByDisplayValue('25.50')).toBeInTheDocument()
  })

  it('has correct placeholder', () => {
    render(<CurrencyInput {...defaultProps} placeholder="Enter amount" />)
    expect(screen.getByPlaceholderText('Enter amount')).toBeInTheDocument()
  })

  it('uses inputMode decimal for mobile keyboards', () => {
    render(<CurrencyInput {...defaultProps} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('inputMode', 'decimal')
  })

  it('has accessible label', () => {
    render(<CurrencyInput {...defaultProps} label="Цена" currency={Currency.EUR} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAccessibleName('Цена в Евро')
  })

  it('renders with testId when provided', () => {
    render(<CurrencyInput {...defaultProps} testId="price" />)
    expect(screen.getByTestId('price')).toBeInTheDocument()
    expect(screen.getByTestId('price-input')).toBeInTheDocument()
    expect(screen.getByTestId('price-toggle')).toBeInTheDocument()
  })
})


