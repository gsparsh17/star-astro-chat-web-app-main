"use client"
import { twMerge } from "tailwind-merge"
import Icon from "@/components/Icon"
import { useState } from "react"

type FieldProps = {
  className?: string
  classInput?: string
  label?: string
  textarea?: boolean
  note?: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  placeholder?: string
  required?: boolean
  icon?: string
  isPassword?: boolean
  readOnly?: boolean
  maxLength?: number
}

const Field = ({
  className,
  classInput,
  label,
  textarea,
  note,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  icon,
  isPassword = false,
  readOnly = false,
  maxLength = 880,
}: FieldProps) => {
  const [showPassword, setShowPassword] = useState(false)
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    const remainingChars = maxLength - value.length
    if (remainingChars <= 0 && event.key !== "Backspace") {
      event.preventDefault()
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState)
  }

  const remainingChars = maxLength - value.length

  return (
    <div className={className}>
      <div>
        {label && (
          <div className="flex mb-2 base2 font-semibold">
            {label}
            {textarea && (
              <span className="ml-auto pl-4 text-n-4/50">
                {remainingChars}
              </span>
            )}
          </div>
        )}
        <div className="relative">
          {textarea ? (
            <textarea
              className={`w-full h-24 px-3.5 py-3 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent resize-none dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent ${
                icon && "pl-[3.125rem]"
              } ${value !== "" && "bg-transparent border-n-3/50"} ${classInput}`}
              value={value}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              required={required}
              readOnly={readOnly}
              maxLength={maxLength}
            />
          ) : (
            <input
              className={twMerge(
                `w-full h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent ${
                  icon && "pl-[3.125rem]"
                } ${
                  value !== "" && "bg-transparent border-n-3/50"
                }`,
                classInput
              )}
              type={isPassword && showPassword ? "text" : type}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              required={required}
              readOnly={readOnly}
              maxLength={maxLength}
              onKeyDown={handleKeyDown}
            />
          )}
          {icon && (
            <Icon
              className={`absolute top-3.5 left-4 fill-n-4/50 pointer-events-none transition-colors ${
                value !== "" && "fill-n-4"
              }`}
              name={icon}
            />
          )}
          {isPassword && (
            <button
              type="button"
              className="absolute top-3.5 right-4 text-n-4/50 hover:text-n-4 cursor-pointer transition-colors"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          )}
        </div>
        {note && <div className="mt-2 base2 text-n-4/50">{note}</div>}
      </div>
    </div>
  )
}

export default Field