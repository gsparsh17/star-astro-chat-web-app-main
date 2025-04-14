import { useState, useEffect } from "react"
import ModalShareChat from "@/components/ModalShareChat"

type ChatProps = {
  title: string
  children: React.ReactNode
}

const Chat = ({ title, children }: ChatProps) => {
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [userPlan, setUserPlan] = useState<string>("")

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      const json = JSON.parse(user)
      if (json.plan) {
        setUserPlan(json.plan)
      }
    }
  }, [])

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[4.5rem] px-10 py-3 border-b border-n-3 z-1 shadow-[0_0.75rem_2.5rem_-0.75rem_rgba(0,0,0,0.06)] 2xl:px-6 lg:-mt-18 lg:pr-20 md:pl-5 md:pr-18 dark:border-n-5 dark:shadow-[0_0.75rem_2.5rem_-0.75rem_rgba(0,0,0,0.15)]">
        <div className="h5 md:text-base text-center ">{title}</div>

        {userPlan === "free" && (
          <div className="text-sm text-center">Free 1 Questions per Day</div>
        )}
      </div>

      <div className="grow pb-20 space-y-10 p-6 2xl:p-6 md:p-5" style={{
    position: 'relative',
    zIndex: -1,
    overflow: 'visible' // Ensure no clipping
  }}>
        {children}
      </div>
      <ModalShareChat
        visible={visibleModal}
        onClose={() => setVisibleModal(false)}
      />
    </>
  )
}

export default Chat
