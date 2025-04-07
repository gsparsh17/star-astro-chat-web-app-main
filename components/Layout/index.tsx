import { useEffect, useState } from "react"
import Link from "next/link"
import { twMerge } from "tailwind-merge"
import Head from "next/head"
import { useMediaQuery } from "react-responsive"
import LeftSidebar from "@/components/LeftSidebar"
import RightSidebar from "@/components/RightSidebar"
import Icon from "@/components/Icon"
import Burger from "./Burger"

type LayoutProps = {
  smallSidebar?: boolean
  hideRightSidebar?: boolean
  backUrl?: string
  children: React.ReactNode
}

const Layout = ({
  smallSidebar,
  hideRightSidebar,
  backUrl,
  children,
}: LayoutProps) => {
  const [visibleSidebar, setVisibleSidebar] = useState<any>(smallSidebar || false)
  const [visibleRightSidebar, setVisibleRightSidebar] = useState<boolean>(false)

  // Corrected media query - true for mobile, false for desktop
  const isMobile = useMediaQuery({ query: "(max-width: 1179px)" })

  const handleClickOverlay = () => {
    setVisibleSidebar(true)
    setVisibleRightSidebar(false)
  }

  useEffect(() => {
    setVisibleSidebar(smallSidebar || isMobile)
    // Default to visible in desktop view
    if (!isMobile) {
      setVisibleRightSidebar(true)
    }
  }, [isMobile, smallSidebar])

  return (
    <>
      <Head>
        <title>Chat | Star Astro</title>
      </Head>
      <div
        className={`pr-6 bg-n-2 md:p-0 md:bg-n-2 dark:bg-n-7 dark:md:bg-n-6 md:overflow-hidden ${
          visibleSidebar
            ? "pl-20 md:pl-0"
            : smallSidebar
            ? "pl-24 md:pl-0"
            : "pl-80 xl:pl-24 md:pl-0"
        }`}
      >
        <LeftSidebar
          value={visibleSidebar}
          setValue={setVisibleSidebar}
          visibleRightSidebar={visibleRightSidebar}
          smallSidebar={smallSidebar}
        />
        <div
          className={`flex py-6 md:py-0 md:-mt-4 ${
            hideRightSidebar
              ? "min-h-screen min-h-screen-ios"
              : "h-screen h-screen-ios"
          }`}
        >
          <div
            className={`relative flex grow w-[100%] max-w-full bg-n-1 rounded-[1.25rem] md:rounded-none dark:bg-n-6`}
          >
            <div
              className={`relative flex flex-col grow w-[60vw] justify-between ${
                !hideRightSidebar && "md:pt-18 md:w-0"
              }`}
            >
              {!hideRightSidebar && isMobile && (
                <Burger
                  visibleRightSidebar={visibleRightSidebar}
                  onClick={() => setVisibleRightSidebar(!visibleRightSidebar)}
                />
              )}
              {hideRightSidebar && smallSidebar && (
                <Link
                  className="absolute top-6 right-6 flex justify-center items-center w-10 h-10 border-2 border-n-4/25 rounded-full text-0 transition-colors hover:border-transparent hover:bg-n-4/25"
                  href={backUrl || "/"}
                >
                  <Icon className="fill-n-4" name="close" />
                </Link>
              )}
              {children}
            </div>
            
            {!hideRightSidebar && (
              <RightSidebar
                className={twMerge(
                  
                  isMobile 
                    ? visibleRightSidebar 
                      ? 'translate-x-0 fixed right-0 top-0 h-full transition-transform duration-300 ease-in-out z-20' 
                      : 'translate-x-full'
                    : 'translate-x-0', // Always visible on desktop
                  !visibleSidebar && "md:before:absolute md:before:z-30 md:before:inset-0"
                )}
                visible={isMobile ? visibleRightSidebar : true} // Always visible on desktop
              />
            )}
          </div>
        </div>
        {isMobile && (
          <div
            className={twMerge(
              `fixed inset-0 z-10 bg-n-7/80 invisible opacity-0 transition-opacity`,
              (visibleRightSidebar && "visible opacity-100")
            )}
            onClick={handleClickOverlay}
          />
        )}
      </div>
    </>
  )
}

export default Layout