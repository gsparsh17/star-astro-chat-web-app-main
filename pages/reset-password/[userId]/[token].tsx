// pages/reset-password/[userId]/[token].tsx
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ResetPassword from "@/templates/ResetPassword"
import { NextPageWithAuth } from "next"

const ResetPasswordPage: NextPageWithAuth = () => {
  const router = useRouter()
  const { userId, token } = router.query
  const [isReady, setIsReady] = useState(false)
  console.log("Router query:", router.query)

  useEffect(() => {
    if (router.isReady) {
      setIsReady(true)
      if (!userId || !token) {
        console.log("Missing parameters:", { userId, token })
        console.error("Missing parameters:", { userId, token })
        // router.push("/signin?error=invalid_reset_link")
      }
    }
  }, [router.isReady, userId, token])

  if (!isReady) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <ResetPassword 
        userId={userId as string}
        token={token as string}
        onSuccess={() => router.push("/signin")}
      />
    </div>
  )
}

ResetPasswordPage.auth = {
  public: true
}

export default ResetPasswordPage