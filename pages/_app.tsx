import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { Toaster, resolveValue } from "react-hot-toast"
import { Inter, Karla } from "next/font/google"
import { ColorModeScript, ColorModeProvider } from "@chakra-ui/color-mode"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import axios from "axios"
import Maintenance from "@/components/Maintenance"
import { NextPageWithAuth } from "next"

const inter = Inter({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  display: "block",
  variable: "--font-inter",
})

const karla = Karla({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "block",
  variable: "--font-karla",
})

type AppPropsWithAuth = AppProps & {
  Component: NextPageWithAuth
}

export default function App({ Component, pageProps }: AppPropsWithAuth) {
  const router = useRouter()
  axios.defaults.baseURL = process.env.BACKEND_URL

  useEffect(() => {
    if (!router.isReady) return

    const token = localStorage.getItem("accessToken")

    // Skip auth check for public pages
    if (Component.auth?.public) return

    if (!token) {
      router.push(`/sign-in?redirect=${encodeURIComponent(router.asPath)}`)
    } else {
      fetchUserData(token)
    }
  }, [router.isReady, router.pathname, Component.auth])

  const fetchUserData = async (token: string) => {
    try {
      const userResponse = await axios.get(`${process.env.BACKEND_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Redirect authenticated users away from auth pages
      if (Component.auth?.redirectAuthenticated) {
        router.push(Component.auth.redirectAuthenticated)
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken")
        router.push(`/sign-in?redirect=${encodeURIComponent(router.asPath)}`)
      }
    }
  }

  const isUnderMaintenance = process.env.IS_MAINTENANCE === "true"

  if (isUnderMaintenance) {
    return <Maintenance />
  }

  return (
    <main className={`${karla.variable} ${inter.variable} font-sans`}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <style jsx global>{`
        html {
          font-family: ${karla.style.fontFamily};
        }
        #headlessui-portal-root {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <ColorModeProvider>
        <ColorModeScript
          initialColorMode="system"
          key="chakra-ui-no-flash"
          storageKey="chakra-ui-color-mode"
        />
        <Component {...pageProps} />
        <Toaster
          containerStyle={{
            bottom: 40,
            left: 20,
            right: 20,
          }}
          position="top-center"
          gutter={10}
          toastOptions={{
            duration: 5000,
          }}
        >
          {(t) => (
            <div
              style={{
                opacity: t.visible ? 1 : 0,
                transform: t.visible
                  ? "translatey(0)"
                  : "translatey(0.75rem)",
                transition: "all .2s",
              }}
            >
              {resolveValue(t.message, t)}
            </div>
          )}
        </Toaster>
      </ColorModeProvider>
    </main>
  )
}