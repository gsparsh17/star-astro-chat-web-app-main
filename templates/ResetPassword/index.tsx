import { useState } from "react"
import { useRouter } from "next/router"
import Icon from "@/components/Icon"
import Field from "@/components/Field"
import Image from "@/components/Image"
import axios from "axios"
import { toast } from "react-hot-toast"
import { NextPageWithAuth } from 'next'

type ResetPasswordProps = {
  userId: string
  token: string
  onSuccess?: () => void
}

const ResetPassword: NextPageWithAuth<ResetPasswordProps> = ({ userId, token, onSuccess }) => {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
  
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match")
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(
        `${process.env.BACKEND_URL}/auth/reset-password/${userId}/${token}`,
        { new_password: newPassword },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.status === 200) {
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-green-500 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="mt-1 text-base text-white text-center">
                    Password reset successfully! Please sign in to begin your journey. 🚀🌠
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))
        onSuccess?.()
        router.push("/sign-in")
      }
    } catch (error: any) {
      console.error("Reset password error:", error)
      
      if (error.response) {
        setError(error.response.data?.message || "Failed to reset password")
      } else {
        setError("Network error. Please try again.")
      }
      
      toast.error(error.response?.data?.message || "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  ResetPassword.auth = {
    public: true // This page is accessible without authentication
  }

  return (
    <div className="relative flex min-h-screen min-h-screen-ios lg:p-6 md:px-6 md:pt-16 md:pb-10">
      <div className="relative shrink-0 w-[40rem] p-20 overflow-hidden 2xl:w-[37.5rem] xl:w-[30rem] xl:p-10 lg:hidden">
        <div className="max-w-[28.4rem]">
          <div className="mb-5 h3 text-n-1">Discover the Future with AI-Powered Astrology</div>
          <div className="text-[1.3rem] text-n-3">
          Chat with Brahma AI—Your 24/7 Astrologer for Accurate Insights and Guidance
          </div>
        </div>
        <div className="absolute top-52 left-5 right-5 h-[50rem] xl:top-24">
          <Image
            className="object-contain"
            src="/images/create-pic.png"
            fill
            sizes="(max-width: 1180px) 50vw, 33vw"
            alt=""
          />
        </div>
      </div>
      <div className="flex grow my-6 mr-6 p-10 bg-n-1 rounded-[1.25rem] lg:m-0 md:p-0 dark:bg-n-6">
        <div className="w-full max-w-[31.5rem] m-auto">
          <button 
            className="group flex items-center mb-8 h5" 
            onClick={() => router.push("/sign-in")}
          >
            <Icon
              className="mr-4 transition-transform group-hover:-translate-x-1 dark:fill-n-1"
              name="arrow-prev"
            />
            Back to Sign In
          </button>
          <form onSubmit={handleSubmit}>
            <Field
              className="mb-4"
              classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
              placeholder="New Password"
              icon="lock"
              type="password"
              value={newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
            <Field
              className="mb-6"
              classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
              placeholder="Confirm New Password"
              icon="lock"
              type="password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button 
              className="btn-blue btn-large w-full mb-6" 
              type="submit"
              disabled={loading}
            >
              {loading ? "Resetting password..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword