import { useState } from "react"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/router"
import Field from "@/components/Field"
import { toast } from "react-hot-toast"
import { Tab } from "@headlessui/react"

type CreateAccountProps = {
  onSuccess?: () => void // Callback to switch tabs
}

const CreateAccount = ({ onSuccess }: CreateAccountProps) => {
  const [email, setEmail] = useState<string>("")
  const [code, setCode] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await axios.post(
        `${process.env.BACKEND_URL}/auth/signup`,
        { email, password, referralCode: code },
      )

      if (response.data.status === "success") {
        // Show success toast
        const errorMessage =
                    "New cosmic identity created successfully! Please sign in to begin your journey. 🚀🌠"
        
                  toast.custom((t) => (
                    <div
                      className={`${
                        t.visible ? "animate-enter" : "animate-leave"
                      } max-w-md w-full bg-green-600 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 `}
                    >
                      <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                          <div className="ml-3 flex-1">
                            <p className="mt-1 text-base text-white text-center">{errorMessage}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))

        // Switch to sign-in tab if callback provided
        if (onSuccess) {
          onSuccess()
        } else {
          // Fallback to router push
          router.push("/sign-in")
        }
      }
    } catch (error: any) {
      console.error("Sign-up error:", error)
      if(error.message === "Request failed with status code 400") {
        setError("Account already exists. Please sign in.")
        const errorMessage =
                    "Stellar identity already exists in our cosmos. Please sign in instead. 🌠✨"
        
                  toast.custom((t) => (
                    <div
                      className={`${
                        t.visible ? "animate-enter" : "animate-leave"
                      } max-w-md w-full bg-red-500 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 `}
                    >
                      <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                          <div className="ml-3 flex-1">
                            <p className="mt-1 text-base text-white text-center">{errorMessage}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
      }
      else {
        setError("Failed to create account. Please try again.")
        const errorMessage =
                    "Cosmic interference detected! Account creation failed. Please try again. 🌪️🔥"
        
                  toast.custom((t) => (
                    <div
                      className={`${
                        t.visible ? "animate-enter" : "animate-leave"
                      } max-w-md w-full bg-red-500 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 `}
                    >
                      <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                          <div className="ml-3 flex-1">
                            <p className="mt-1 text-base text-white text-center">{errorMessage}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field
        className="mb-4"
        classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
        placeholder="Email"
        icon="email"
        type="email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
        required
      />
      <Field
        className="mb-6"
        classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
        placeholder="Password"
        icon="lock"
        type="password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
        required
      />
      <Field
        className="mb-4"
        classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
        placeholder="Referral Code (Optional)"
        icon="link"
        type="text"
        value={code}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setCode(e.target.value)
        }
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        className="btn-blue btn-large w-full mb-6"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </button>
      <div className="text-center caption1 text-n-4">
        By creating an account, you agree to our{" "}
        <Link
          className="text-n-5 transition-colors hover:text-n-7 dark:text-n-3 dark:hover:text-n-1"
          href="https://www.starastrogpt.com/terms-of-service"
          target="_blank"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          className="text-n-5 transition-colors hover:text-n-7 dark:text-n-3 dark:hover:text-n-1"
          href="https://www.starastrogpt.com/privacy-policy"
          target="_blank"
        >
          Privacy Policy
        </Link>
        .
      </div>
    </form>
  )
}

export default CreateAccount