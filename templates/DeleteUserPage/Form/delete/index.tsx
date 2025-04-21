import { useState } from "react"
import Field from "@/components/Field"
import axios from "axios"
import { useRouter } from "next/router"
import { toast } from "react-hot-toast"

const DeleteUserForm = () => {
  const [confirmationText, setConfirmationText] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem("accessToken")

    if (confirmationText !== "delete-user") {
      setErrorMessage("The text does not match 'delete-user'. Please try again.")
      return
    }

    try {
      setLoading(true)
      setErrorMessage("")

      const response = await axios.delete(
        `${process.env.BACKEND_URL}/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 200) {
        // toast.success("")
        const errorMessage =
                    "Your cosmic identity has been erased from our galaxy. Farewell, celestial traveler. 🌌🚀"
        
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
        
        // Clear user data from local storage
        localStorage.removeItem("user")
        localStorage.removeItem("accessToken")
        // Redirect to home page or login page
        router.push("/sign-in")
      } else {
        throw new Error("Failed to delete account")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      setErrorMessage("An error occurred while deleting your account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setConfirmationText(e.target.value)
    if (errorMessage) setErrorMessage("")
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Please type <strong>'delete-user'</strong> below to confirm account
        deletion. This action cannot be undone.
      </p>
      <Field
        className="mb-4"
        classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
        placeholder="Type 'delete-user' to confirm"
        icon="lock"
        value={confirmationText}
        onChange={handleInputChange}
        required
      />
      {errorMessage && (
        <p className="mb-4 text-red-600 dark:text-red-400">{errorMessage}</p>
      )}
      <button
        className={`btn-red btn-large w-full ${
          confirmationText !== "delete-user" ? "opacity-50 cursor-not-allowed" : ""
        }`}
        type="submit"
        disabled={confirmationText !== "delete-user" || loading}
      >
        {loading ? "Deleting..." : "Permanently Delete Account"}
      </button>
    </form>
  )
}

export default DeleteUserForm