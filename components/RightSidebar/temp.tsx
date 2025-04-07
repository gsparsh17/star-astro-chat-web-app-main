import { useState } from "react"
import Link from "next/link"
import { twMerge } from "tailwind-merge"
import { toast } from "react-hot-toast"
import Icon from "@/components/Icon"
import ModalShareChat from "@/components/ModalShareChat"
import Notifications from "./Notifications"
import Profile from "./Profile"
import { navigation } from "@/constants/navigation"
import Menu from "@/components/Menu"
import { notifications } from "@/mocks/notifications"

type RightSidebarProps = {
  className?: string
  visible?: boolean
}

const RightSidebar = ({ className, visible }: RightSidebarProps) => {
  const [clean, setClean] = useState<boolean>(false)
  const [visibleModal, setVisibleModal] = useState<boolean>(false)

  const handleClickClear = (t: any) => {
    setClean(true)
    toast.dismiss(t.id)
  }

  return (
    <>
      <div
        className={twMerge(
          ` flex flex-col justify-start items-center h-full w-[28%] md:w-[0%] z-20 bg-n-1 rounded-r-[1.25rem] border-l border-n-3 shadow-[inset_0_1.5rem_3.75rem_rgba(0,0,0,0.1)]  lg:rounded-[1.25rem] lg:invisible lg:opacity-0 lg:transition-opacity lg:border-l-0 lg:shadow-2xl md:border-l md:rounded-none dark:bg-n-6 dark:border-n-5 ${
            visible && "lg:visible lg:opacity-100 md:w-[calc(100vw-4rem)]"
          } ${className}`,
        )}
      >
        <div className=" flex justify-center mb-6 items-center h-18 w-[90%] border-b border-n-3 lg:pr-18 md:pr-16 dark:border-n-5">
          <Notifications items={notifications} />
          <Profile />
          <button
            className="btn-dark btn-medium"
            onClick={() => setVisibleModal(true)}
          >
            Share
          </button>
        </div>
        <div className="w-full grow overflow-y-auto scroll-smooth scrollbar-none">
          <Menu className="w-full px-6" items={navigation} />
        </div>

        <div className=" w-full p-6">
          <Link className="btn-blue w-full" href="/">
            <Icon name="plus" />
            <span>New chat</span>
          </Link>
        </div>
      </div>
      <ModalShareChat
        visible={visibleModal}
        onClose={() => setVisibleModal(false)}
      />
    </>
  )
}

export default RightSidebar