import { useState } from "react"
import Icon from "@/components/Icon"
import Field from "@/components/Field"
import axios from "axios"
import { toast } from "react-hot-toast"

type ForgotPasswordProps = {
  onClick: () => void
}

const ForgotPassword = ({ onClick }: ForgotPasswordProps) => {
  const [email, setEmail] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
  
    try {
      const response = await axios.post(
        `${process.env.BACKEND_URL}/auth/forgot-password`, // Ensure this matches your backend route
        { email },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      console.log("Response data:", response.data)
  
      if (response.status === 200) {
        const errorMessage =
                    "Password reset link sent successfully! Please sign in to begin your journey. 🚀🌠"
        
                  toast.custom((t) => (
                    <div
                      className={`${
                        t.visible ? "animate-enter" : "animate-leave"
                      } max-w-md w-full bg-green-500 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 `}
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
        onClick() // Close the modal
      }
    } catch (error: any) {
      console.error("Full error:", error)
      
      // Improved error handling
      if (error.response) {
        // Backend responded with error status
        console.error("Backend error data:", error.response.data)
        console.error("Backend error status:", error.response.status)
        
        const errorMessage = error.response.data?.message || 
          error.response.data?.error ||
          `Server error (${error.response.status})`
        setError(errorMessage)
      } else if (error.request) {
        // Request was made but no response
        setError("No response from server. Please try again.")
      } else {
        // Other errors
        setError(error.message || "Failed to send reset link")
      }
      
      toast.error(error.message || "Password reset failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button className="group flex items-center mb-8 h5" onClick={onClick}>
        <Icon
          className="mr-4 transition-transform group-hover:-translate-x-1 dark:fill-n-1"
          name="arrow-prev"
        />
        Reset your password
      </button>
      <form onSubmit={handleSubmit}>
        <Field
          className="mb-6"
          classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
          placeholder="Email"
          icon="email"
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button 
          className="btn-blue btn-large w-full mb-6" 
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending reset link..." : "Reset password"}
        </button>
      </form>
    </>
  )
}

export default ForgotPassword