import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResultDisplay } from './ResultDisplay'

describe('ResultDisplay', () => {
  describe('when no valid inputs', () => {
    it('shows instruction message', () => {
      render(<ResultDisplay result={null} hasValidInputs={false} />)
      expect(
        screen.getByText('Въведете цена и платена сума, за да видите ресто')
      ).toBeInTheDocument()
    })
  })

  describe('when payment is insufficient', () => {
    it('shows insufficient payment message', () => {
      render(<ResultDisplay result={null} hasValidInputs={true} />)
      expect(screen.getByText('Недостатъчно платено!')).toBeInTheDocument()
      expect(
        screen.getByText('Платената сума е по-малка от цената')
      ).toBeInTheDocument()
    })
  })

  describe('when exact payment', () => {
    it('shows exact payment message', () => {
      render(
        <ResultDisplay result={{ eur: 0, bgn: 0 }} hasValidInputs={true} />
      )
      expect(screen.getByText('Точно платено!')).toBeInTheDocument()
      expect(screen.getByText('Няма нужда от ресто')).toBeInTheDocument()
    })
  })

  describe('when there is change', () => {
    it('displays change in EUR', () => {
      render(
        <ResultDisplay result={{ eur: 2.5, bgn: 4.89 }} hasValidInputs={true} />
      )
      expect(screen.getByText('2.50')).toBeInTheDocument()
      expect(screen.getByText('€')).toBeInTheDocument()
    })

    it('displays change in BGN', () => {
      render(
        <ResultDisplay result={{ eur: 2.5, bgn: 4.89 }} hasValidInputs={true} />
      )
      expect(screen.getByText('4.89')).toBeInTheDocument()
      expect(screen.getByText('лв')).toBeInTheDocument()
    })

    it('shows "your change is" message', () => {
      render(
        <ResultDisplay result={{ eur: 5, bgn: 9.78 }} hasValidInputs={true} />
      )
      expect(screen.getByText('Вашето ресто е:')).toBeInTheDocument()
    })

    it('shows Euro as the amount you will receive', () => {
      render(
        <ResultDisplay result={{ eur: 5, bgn: 9.78 }} hasValidInputs={true} />
      )
      expect(screen.getByText('Евро (ще получите)')).toBeInTheDocument()
    })

    it('shows BGN as reference', () => {
      render(
        <ResultDisplay result={{ eur: 5, bgn: 9.78 }} hasValidInputs={true} />
      )
      expect(screen.getByText('Лева (за справка)')).toBeInTheDocument()
    })
  })

  describe('testId', () => {
    it('renders with testId when provided', () => {
      render(
        <ResultDisplay
          result={{ eur: 2, bgn: 3.91 }}
          hasValidInputs={true}
          testId="result"
        />
      )
      expect(screen.getByTestId('result')).toBeInTheDocument()
      expect(screen.getByTestId('result-eur')).toBeInTheDocument()
      expect(screen.getByTestId('result-bgn')).toBeInTheDocument()
    })
  })
})


