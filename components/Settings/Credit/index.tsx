import axios from "axios"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"

const Credits = () => {
  const router = useRouter()
  const [walletBalance, setWalletBalance] = useState<number | null>(null) // State for wallet balance
  const [expirationDate, setExpirationDate] = useState<string>("")
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(localStorage.getItem('accessToken'))
  }, [])
  const fetchUserData = async () => {
    try {
      const userResponse = await axios.get(`${process.env.BACKEND_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })


      if (userResponse.status == 401) {
        router.push("/sign-in")
      }

      if (userResponse.data.status === "success") {
        const userData = userResponse.data.data
        const walletBalance = userData?.wallet?.balance || 0
        const expiresOn = userData?.wallet?.expiresOn || ""

        setWalletBalance(walletBalance)
        setExpirationDate(formatDateTime(expiresOn))
        const minimalUserData = {
          wallet: JSON.stringify(userData.wallet),
        }

        // localStorage.setItem("user", JSON.stringify(minimalUserData))
      }
    } catch (error: any) {
      console.error("Error fetching user data:", error)
    }
  }

  const formatDateTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      // hour: "2-digit",
      // minute: "2-digit",
      // second: "2-digit",
      // timeZoneName: "short",
    });
  };

  useEffect(()=>{
    fetchUserData()
  },[])

  return (
    <div className="flex flex-col">
      <div className="text-center">
        <span className="text-6xl font-bold text-n-3">{walletBalance}</span>{" "}
        <span className="text-lg text-gray-600">credits</span>
      </div>
      <p className="mt-4 text-gray-500 text-sm">
        Your credits will expire by{" "}
        <span className="font-semibold">{expirationDate}</span>.
      </p>
    </div>
  )
}

export default Credits
