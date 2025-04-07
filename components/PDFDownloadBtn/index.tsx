import React, { useState } from "react"
import Icon from "@/components/Icon"
import axios from "axios"
import { useRouter } from "next/router"
import { toast } from "react-hot-toast"

const westernChatPdfs = [
  {
    title: "Life Forecast PDF",
    pdfType: "life_forecast",
  },
  {
    title: "Natal Horoscope PDF",
    pdfType: "natal_horoscope",
  },
]

const vedicChatPdf = [
  {
    title: "Basic Horoscope PDF",
    pdfType: "basic_horoscope",
  },
]

const vedicMatchMakingPdf = [
  { title: "Match Making PDF", pdfType: "match_making" },
]
const westernMatchMakingPdf = [
  {
    title: "Synastry Couple PDF",
    pdfType: "synastry_couple",
  },
]

const getPDFBtnsData = (isChat: boolean, type: string) => {
  if (isChat) return type === "vedic" ? vedicChatPdf : westernChatPdfs
  return type === "vedic" ? vedicMatchMakingPdf : westernMatchMakingPdf
}

const getPartnerData = () => {
  const data = localStorage.getItem("partnerData")
  return data ? JSON.parse(data) : null
}

const ToastMessage = ({ t }: any) => (
  <div
    className={`${
      t.visible ? "animate-enter" : "animate-leave"
    } max-w-md w-full bg-red-600 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 `}
  >
    <div className="flex-1 w-0 p-4">
      <div className="flex items-start">
        <div className="ml-3 flex-1">
          <p className="mt-1 text-base text-white font-semibold mb-4">
            Oops! Celestial glitch detected. Retry in a cosmic minute. 🌌🔧
          </p>
        </div>
      </div>
    </div>
  </div>
)

const PDFDownloadBtn = ({ type }: { type: string }) => {
  const router = useRouter()
  const [data] = useState(
    getPDFBtnsData(router.pathname !== "/matchmaking", type),
  )
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null)

  const handlePDFDownload = async (pdfType: string, index: number) => {
    const isChat = router.pathname !== "/matchmaking"
    let url = `${process.env.BACKEND_URL}/pdf/${pdfType}`

    try {
      console.log("Testing URL : ", url)
      let response = null
      if (isChat) {
        setLoadingIndex(index)
        response = await axios.get(url)
      } else {
        const data = getPartnerData()
        if (data) {
          const payloadData = {
            partner_name: data.name,
            partner_day: data.day,
            partner_month: data.month,
            partner_year: data.year,
            partner_hour: data.hour,
            partner_min: data.min,
            partner_tzone: data.tzone,
            partner_location: data.location,
          }
          setLoadingIndex(index)
          response = await axios.post(url, payloadData)
        }
      }
      if (response?.data?.data?.response) {
        window.open(
          response.data.data.response,
          "_blank",
          "noopener,noreferrer",
        )
      }
      setLoadingIndex(null)
    } catch (error) {
      setLoadingIndex(null)
      toast.custom((t) => <ToastMessage t={t} />)
    }
  }

  return data.map((item, index) => {
    return (
      <button
        key={item.title}
        className="group flex items-center mb-5 p-3.5 border border-n-3 rounded-xl h-20 w-64 transition-all hover:border-transparent hover:shadow-[0_0_1rem_0.25rem_rgba(0,0,0,0.04),0px_2rem_1.5rem_-1rem_rgba(0,0,0,0.12)] last:mb-0 2xl:p-2.5 lg:p-3.5 dark:border-n-5 dark:hover:border-n-7 dark:hover:bg-n-7 disabled:cursor-not-allowed  disabled:opacity-50"
        onClick={() => {
          console.log("Start Downloading")
          handlePDFDownload(item.pdfType, index)
        }}
        disabled={loadingIndex === index}
      >
        <span className="group-hover:text-blue-500">
          {loadingIndex === index ? "Downloading..." : item.title}
        </span>
        <Icon
          className="ml-auto fill-n-4 transition-colors group-hover:fill-n-7 dark:group-hover:fill-n-4"
          name="download"
        />
      </button>
    )
  })
}

export default PDFDownloadBtn
