import { useState, useEffect } from "react"
import Logo from "@/components/Logo"
import Icon from "@/components/Icon"
import Modal from "@/components/Modal"
import Search from "@/components/Search"
import Settings from "@/components/Settings"
import Navigation from "./Navigation"
import ChatList from "./ChatList"
import Profile from "./Profile"
import ToggleTheme from "./ToggleTheme"
import { chatList } from "@/mocks/chatList"
import { resultSearch } from "@/mocks/resultSearch"
import { settings, additionalSettings } from "@/constants/settings"
import { twMerge } from "tailwind-merge"

type LeftSidebarProps = {
  value: boolean
  setValue?: any
  smallSidebar?: boolean
  visibleRightSidebar?: boolean
}

const LeftSidebar = ({
  value,
  setValue,
  smallSidebar,
  visibleRightSidebar,
}: LeftSidebarProps) => {
  const [visibleSearch, setVisibleSearch] = useState<boolean>(false)
  const [visibleSettings, setVisibleSettings] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint in Tailwind
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    
    window.addEventListener("keydown", handleWindowKeyDown)
    const user = localStorage.getItem("user")
    if (user) {
      const json = JSON.parse(user)
      if (!json.gender) {
        setVisibleSettings(true)
      }
    }
    return () => {
      window.removeEventListener('resize', checkIfMobile)
      window.removeEventListener("keydown", handleWindowKeyDown)
    }
  }, [])

  const handleWindowKeyDown = (event: any) => {
    if (event.metaKey && event.key === "f") {
      event.preventDefault()
      setVisibleSearch(true)
    }
  }

  const navigation = [
    {
      title: "Home",
      icon: "chat",
      color: "fill-accent-2",
      url: "/",
    },
    {
      title: "Pricing",
      icon: "card",
      color: "fill-accent-4",
      url: "/pricing",
    },
    {
      title: "Settings",
      icon: "settings",
      color: "fill-accent-3",
      onClick: () => setVisibleSettings(true),
    },
  ]

  const handleClick = () => {
    setValue(!value)
  }

  return (
    <>
    {isMobile && (<button className="group tap-highlight-color" onClick={handleClick}>
            <Icon
              className={twMerge("fill-n-4 transition-colors group-hover:fill-n-3",
                isMobile && "absolute z-20 top-8 left-6",
              )}
              name={value ? "toggle-on" : "toggle-off"}
            />
          </button>)}
      <div
        className={twMerge(
          `fixed z-20 top-0 left-0 bottom-0 flex flex-col w-80 md:w-60 lg:w-24 justify-start items-center px-4 dark:bg-n-7 bg-n-2 transition-all duration-300 ease-in-out`,
          value && "w-18 md:w-16 md:pl-0 px-0 pl-2",
          visibleRightSidebar && "md:block",
          isMobile && value && "bg-transparent -z-1"
        )}
      >
        <div
          className={`w-full flex items-center h-28 md:h-20 pl-2 ${
            value ? "justify-center" : "justify-between"
          }`}
        >
          {!value && <Logo />}
          <button className="group tap-highlight-color" onClick={handleClick}>
            <Icon
              className={twMerge("fill-n-4 transition-colors group-hover:fill-n-3"
              )}
              name={value ? "toggle-on" : "toggle-off"}
            />
          </button>
        </div>
        <div className="w-full h-2 grow overflow-y-auto scroll-smooth scrollbar-none">
          <Navigation visible={value} items={navigation} />
          <div
            className={`my-4 h-0.25 bg-n-6 ${
              value ? "-mx-4 md:mx-0" : "-mx-2 md:mx-0"
            }`}
          ></div>
          <ChatList visible={value} items={chatList} />
        </div>
        <div className="pb-6 px-4 w-full dark:bg-n-7 bg-n-2 md:px-3">
          <Profile visible={value} />
          <ToggleTheme visible={value} />
        </div>
      </div>
      <Modal
        className="md:!p-0"
        classWrap="md:min-h-screen-ios md:rounded-none dark:shadow-[inset_0_0_0_0.0625rem_#232627,0_2rem_4rem_-1rem_rgba(0,0,0,0.33)] dark:md:shadow-none"
        classButtonClose="hidden md:flex md:absolute md:top-6 md:left-6 dark:fill-n-1"
        classOverlay="md:bg-n-1"
        visible={visibleSearch}
        onClose={() => setVisibleSearch(false)}
      >
        <Search items={resultSearch} />
      </Modal>
      <Modal
        className="md:!p-0"
        classWrap="max-w-[48rem] md:min-h-screen-ios md:rounded-none"
        classButtonClose="hidden md:block md:absolute md:top-5 md:right-5 dark:fill-n-4"
        classOverlay="md:bg-n-1"
        visible={visibleSettings}
        onClose={() => {
          setVisibleSettings(false)
        }}
      >
        <Settings items={settings} additionalItem={additionalSettings} setVisibleSettings={setVisibleSettings}/>
      </Modal>
    </>
  )
}

export default LeftSidebar