import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Tab } from "@headlessui/react"
import { useColorMode } from "@chakra-ui/color-mode"
import Logo from "@/components/Logo"
import Image from "@/components/Image"
import SignIn from "./SignIn"
import CreateAccount from "./CreateAccount"
import ForgotPassword from "./ForgotPassword"
import ResetPassword from "../../ResetPassword"

const tabNav = ["Sign in", "Create account"]

type FormProps = {}

const Form = ({}: FormProps) => {
  const router = useRouter()
  const [forgot, setForgot] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { colorMode } = useColorMode()
  const isLightMode = colorMode === "light"
  const [isResetPasswordPage, setIsResetPasswordPage] = useState(false)

  useEffect(() => {
    if (router.isReady) {
      const { ref } = router.query
      if (ref && typeof ref === 'string') {
        setSelectedIndex(1)
      }
    }
  }, [router.isReady, router.query])

  useEffect(() => {
    // Check if URL matches reset password pattern
    const path = router.asPath
    const resetPasswordPattern = /^\/reset-password\/[^/]+\/[^/]+$/
    setIsResetPasswordPage(resetPasswordPattern.test(path.split('?')[0])) // Ignore query params
  }, [router.asPath])

  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google?device=web`
  }

  const handleAccountCreated = () => {
    setSelectedIndex(0) // Switch to Sign In tab
  }

  if (isResetPasswordPage) {
    // Extract userId and token from URL
    const pathParts = router.asPath.split('/')
    const userId = pathParts[2]
    const token = pathParts[3].split('?')[0] // Remove query params if any
    
    return (
      <div className="w-full max-w-[31.5rem] m-auto">
        <ResetPassword 
          userId={userId} 
          token={token} 
          onSuccess={() => router.push("/signin")}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-[31.5rem] m-auto">
      {forgot ? (
        <ForgotPassword onClick={() => setForgot(false)} />
      ) : (
        <>
          <Logo className="max-w-[11.875rem] mx-auto mb-8" dark={isLightMode} />
          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <Tab.List className="flex mb-8 p-1 bg-n-2 rounded-xl dark:bg-n-7">
              {tabNav.map((button, index) => (
                <Tab
                  className="basis-1/2 h-10 rounded-[0.625rem] base2 font-semibold text-n-4 transition-colors outline-none hover:text-n-7 ui-selected:bg-n-1 ui-selected:text-n-7 ui-selected:shadow-[0_0.125rem_0.125rem_rgba(0,0,0,0.07),inset_0_0.25rem_0.125rem_#FFFFFF] tap-highlight-color dark:hover:text-n-1 dark:ui-selected:bg-n-6 dark:ui-selected:text-n-1 dark:ui-selected:shadow-[0_0.125rem_0.125rem_rgba(0,0,0,0.07),inset_0_0.0625rem_0.125rem_rgba(255,255,255,0.02)]"
                  key={index}
                >
                  {button}
                </Tab>
              ))}
            </Tab.List>
            <button
              className="btn-stroke-light btn-large w-full mb-3"
              onClick={handleGoogleSignIn}
            >
              <Image src="/images/google.svg" width={24} height={24} alt="" />
              <span className="ml-4">Continue with Google</span>
            </button>
            <button className="btn-stroke-light btn-large w-full">
              <Image src="/images/apple.svg" width={24} height={24} alt="" />
              <span className="ml-4">Continue with Apple</span>
            </button>
            <div className="flex items-center my-8 md:my-4">
              <span className="grow h-0.25 bg-n-4/50"></span>
              <span className="shrink-0 mx-5 text-n-4/50">OR</span>
              <span className="grow h-0.25 bg-n-4/50"></span>
            </div>
            <Tab.Panels>
              <Tab.Panel>
                <SignIn onForgotPassword={() => setForgot(true)} />
              </Tab.Panel>
              <Tab.Panel>
                <CreateAccount onSuccess={handleAccountCreated} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </>
      )}
    </div>
  )
}

export default Form