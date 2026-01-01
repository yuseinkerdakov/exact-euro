import { TrashIcon } from './icons'

interface ResetButtonProps {
  onClick: () => void
}

export function ResetButton({ onClick }: ResetButtonProps) {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={onClick}
        className="text-xs sm:text-sm text-text-secondary hover:text-error 
                   flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-error/10
                   active:scale-95 transition-all"
        aria-label="Изчисти всичко"
      >
        <TrashIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        Изчисти
      </button>
    </div>
  )
}


