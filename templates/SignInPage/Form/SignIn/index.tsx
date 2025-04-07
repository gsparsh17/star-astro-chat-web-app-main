import { useState } from "react"
import axios from "axios"
import Field from "@/components/Field"
import { useRouter } from "next/router"
import { toast } from "react-hot-toast"

type SignInProps = {
  onForgotPassword: () => void
}

const SignIn = ({ onForgotPassword }: SignInProps) => {
  const [name, setName] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await axios.post(
        `${process.env.BACKEND_URL}/auth/signin`,
        {
          email: name,
          password,
        },
      )

      if (response.data.status === "success") {
        const { accessToken } = response.data.data
        localStorage.setItem("accessToken", accessToken)
        await fetchUserData(accessToken)
        const errorMessage =
                    "Welcome back, celestial traveler! Your cosmic journey continues. 🌟✨"
        
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
        router.push("/")
      }
    } catch (error: any) {
      console.error("Sign-in error:", error)
      if(error.response.status === 404){
        setError("User not found. Please check your credentials.")
        const errorMessage =
                    "Celestial traveler not found in our galaxy. Please check your credentials. 🔭🌌"
        
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
      } else {
      setError("Failed to sign in. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const fetchUserData = async (token: string) => {
    try {
      const userResponse = await axios.get(`${process.env.BACKEND_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (userResponse.data.status === "success") {
        const userData = userResponse.data.data

        const minimalUserData = {
          email: userData.email,
          wallet: JSON.stringify(userData.wallet),
          profile_image:userData.profile_image,
          mobile: userData.mobile,
          date_of_birth: userData.date_of_birth,
          first_name: userData.first_name,
          last_name: userData.last_name,
          latitude:userData.latitude.toString(),
          longitude:userData.longitude.toString(),
          place_of_birth:userData.place_of_birth,
          time_of_birth:userData.time_of_birth,
          preferred_astrology:userData.preferred_astrology,
          timezone:userData.timezone.toString(),
          gender:userData.gender.toString()
        };
  
        localStorage.setItem("user", JSON.stringify(minimalUserData));
      }
    } catch (error: any) {
      console.error("Error fetching user data:", error)
      setError("Failed to retrieve user data.")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field
        className="mb-4"
        classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
        placeholder="Username or email"
        icon="email"
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setName(e.target.value)
        }
        required
      />
      <Field
        className="mb-2"
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
      {error && <p className="text-red-500">{error}</p>}
      <button
  className="mb-6 base2 text-primary-1 transition-colors hover:text-primary-1/90"
  type="button"
  onClick={onForgotPassword}
>
  Forgot password?
</button>
      <button className="btn-blue btn-large w-full" type="submit">
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  )
}

export default SignIn
