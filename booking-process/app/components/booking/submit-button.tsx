"use client"
import { useTranslation } from "react-i18next"

interface SubmitButtonProps {
  onClick: () => void
  disabled: boolean
  isLoading: boolean
}

export default function SubmitButton({ onClick, disabled, isLoading }: SubmitButtonProps) {
  const { t } = useTranslation()

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-4 sm:px-6 py-2 rounded-lg transition-colors flex items-center justify-center min-w-[120px] ${
        disabled ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-[#C8A97E] text-black hover:bg-[#D4B68C]"
      }`}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {t("booking.submitting", "Wird gesendet...")}
        </>
      ) : (
        t("booking.submit", "Absenden")
      )}
    </button>
  )
}

