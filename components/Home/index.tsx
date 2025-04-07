import React, { useEffect, useState } from "react"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/router"

const AstrologyDashboard = () => {
  const router = useRouter()
  const [name, setName] = useState("")

  const captureToken = () => {
    const url = new URL(window.location.href)
    const token = url.searchParams.get("accessToken")

    if (token) {
      localStorage.setItem("accessToken", token)
      router.replace("/")
    }
  }
  useEffect(() => {
    captureToken()
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const firstName = user.first_name
    if (firstName) {
      setName(firstName)
    }
  }, [])

  const handleClick = (chatLink: string) => {
    if (chatLink) {
      router.push(chatLink)
    } else {
      alert("Please enter a valid chat link.")
    }
  }
  return (
    <div className="min-h-screen rounded-tl-2xl rounded-bl-2xl text-gray-100 overflow-auto">
      <header className="mb-8 items-end mt-6">
        <div className="flex sm:flex-col">
          <h1 className="text-[1.50rem] font-bold flex items-center gap-2 ml-8 sm:ml-4">
            Hello {name},
          </h1>
          <h1 className="text-n-4 text-[1.40rem] font-semibold ml-2 sm:ml-4 sm:mt-2">
            Welcome to Star Astro
          </h1>
        </div>
        <div className="sm:invisible w-full h-[1px] mt-6 sm:mt-0 bg-n-5 "></div>
      </header>
      <section className="m-8 sm:m-4">
        <h2 className="text-[1.40rem] text-n-4 font-semibold mb-4">
          AI Astrologer
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 grid-cols-4 ">
          <div
            className="w-[90%] h-[90%] rounded-xl cursor-pointer"
            onClick={() => {
              handleClick("brahma-ai")
            }}
          >
            <Image
              src="/images/brahmaAi.svg"
              alt="Astro Image 1"
              height={100}
              width={100}
              className="w-full h-full rounded-md"
            />
            <div className="text-n-1 text-xl">Brahma AI</div>
          </div>
          <div className="w-[90%] h-[90%]">
            <Image
              src="/images/careerAi.svg"
              alt="Astro Image 2"
              height={100}
              width={100}
              className="w-full h-full rounded-md"
            />
            <div className="text-n-1 text-xl">Career AI</div>
          </div>
          <div className="w-[90%] h-[90%]">
            <Image
              src="/images/numerologyAi.svg"
              alt="Astro Image 4"
              height={100}
              width={100}
              className="w-full h-full rounded-lg"
            />
            <div className="text-n-1 text-xl">Numerology AI</div>
          </div>
          <div className="w-[90%] h-[90%]">
            <Image
              src="/images/relationshipAi.svg"
              alt="Astro Image 3"
              height={100}
              width={100}
              className="w-full h-full rounded-md"
            />
            <div className="text-n-1 text-xl">Relationship AI</div>
          </div>
        </div>
      </section>
      <section className=" m-8 sm:m-4">
        <h2 className="text-[1.40rem] text-n-4 font-semibold mb-4">
          Horoscope
        </h2>
        <div className=" max-w-sm sm:max-w-max h-40 bg-gradient-to-b from-[#33cfff58] via-[#bb74cb1f] to-[#67407024] p-[2px] rounded-xl">
          <div className="w-full h-full bg-n-7 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-900 inline-flex rounded-md p-2 ">
                <Image
                  src="/images/moon.svg"
                  alt="Astro Image 3"
                  height={100}
                  width={100}
                  className="w-6 h-6  rounded-md"
                />
              </div>

              <h1 className="text-n-1 font-semibold text-xl">
                Today's Horoscope
              </h1>
            </div>
            <p className="mt-2 text-n-4 ">
              Vedic astrology interprets planets to guide life events and
              destiny.
            </p>
            <div className="flex mt-2 items-center">
              <p className="font-semibold text-sm">EXPLORE MORE</p>
              <ChevronRight className="ml-2" />
            </div>
          </div>
        </div>
      </section>
      <section className=" m-8 sm:m-4">
        <h2 className="text-[1.40rem] text-n-4 font-semibold mb-4">
          Cosmic Report
        </h2>
        <div className=" max-w-sm sm:max-w-max h-40 bg-gradient-to-b from-[#33cfff58] via-[#bb74cb1f] to-[#67407024] p-[2px] rounded-xl">
          <div className="w-full h-full bg-n-7 rounded-xl p-4 flex">
            <div>
              <p className=" text-n-4 ">
                Get your AI-generated cosmic report now
              </p>
              {/* <h1 className="font-extrabold text-xl">$9.99</h1> */}
              <div className="mt-2 items-center bg-n-5 inline-flex rounded-md">
                <p className="font-semibold text-xs py-1 px-2">DOWNLOAD NOW</p>
              </div>
            </div>
            <Image
              src="/images/cosmic.svg"
              alt="Image"
              width={100}
              height={100}
              className="w-32 h-32"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default AstrologyDashboard
