import { useEffect, useState } from "react"
import Link from "next/link"
import { twMerge } from "tailwind-merge"
import { toast } from "react-hot-toast"
import Icon from "@/components/Icon"
import ModalShareChat from "@/components/ModalShareChat"
import Notify from "@/components/Notify"
import Notifications from "./Notifications"
import Profile from "./Profile"
import ChatItem from "./ChatItem"
import ChatEmpty from "./ChatEmpty"
import { notifications } from "@/mocks/notifications"
import { Features } from "@/mocks/chatHistory"
import axios from "axios"

type RightSidebarProps = {
  className?: string
  visible?: boolean
}

type ChatTitle = {
  _id: string
  title: string
  updatedAt: string
}

const RightSidebar = ({ className, visible }: RightSidebarProps) => {
  const [clean, setClean] = useState<boolean>(false)
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [userGender, setUserGender] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [userProfilePic, setUserProfilePic] = useState<string | null>(null)
  const [chatTitles, setChatTitles] = useState<ChatTitle[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const handleClickClear = (t: any) => {
    setClean(true)
    toast.dismiss(t.id)
  }

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      const json = JSON.parse(user)
      if (json.gender) {
        setUserGender(json.gender)
        setUserName(json.name)
        setUserProfilePic(json.profile_image)
      }
    }

    const fetchChatTitles = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const response = await axios.get(`${process.env.BACKEND_URL}/chat`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        console.log(response.data.data);
        setChatTitles(response.data?.data || [])
      } catch (error) {
        console.error("Error fetching chat titles:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChatTitles()
  }, [])

  const avatarImagePath =
    userProfilePic ||
    (userGender === "male" ? "/images/Male.png" : "/images/Female.png")

  return (
    <>
      <div
        className={twMerge(
          `flex flex-col lg:w-0 w-[22.5rem] pt-[6rem] bg-n-1 rounded-r-[1.25rem] border-l border-n-3 shadow-[inset_0_1.5rem_3.75rem_rgba(0,0,0,0.1)] 2xl:w-80 lg:rounded-[1.25rem] lg:invisible lg:opacity-0 lg:transition-opacity lg:z-20 lg:border-l-0 lg:shadow-2xl md:fixed md:w-[calc(100%-4rem)] md:border-l md:rounded-none dark:bg-n-6 dark:border-n-5 ${
            visible && "lg:visible lg:opacity-100"
          } ${className}`,
        )}
      >
        <div className="absolute top-0 left-0 right-0 flex justify-end items-center h-18 px-9 border-b border-n-3 lg:pr-18 md:pr-16 dark:border-n-5">
          <Notifications items={notifications} />
          <Profile />
          <button
            className="btn-dark btn-medium"
            onClick={() => setVisibleModal(true)}
          >
            Share
          </button>
        </div>
        
        {/* Chat History Section */}
        <div className="flex items-center px-9 md:px-6">
          <div className="base2 text-n-4/75">Chat history</div>
          <div className="ml-3 px-2 bg-n-3 rounded-lg caption1 text-n-4 dark:bg-n-5/50">
            {clean ? "0" : `${chatTitles.length}/100`}
          </div>
          {!clean && chatTitles.length > 0 && (
            <button
              className="group relative ml-auto text-0"
              onClick={() =>
                toast((t) => (
                  <Notify
                    className="md:flex-col md:items-center md:px-10"
                    iconDelete
                  >
                    <div className="ml-3 mr-6 h6 md:mx-0 md:my-2">
                      Clear all chat history?
                    </div>
                    <div className="flex justify-center">
                      <button
                        className="btn-stroke-light btn-medium md:min-w-[6rem]"
                        onClick={() => toast.dismiss(t.id)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn-blue btn-medium ml-3 md:min-w-[6rem]"
                        onClick={() => handleClickClear(t)}
                      >
                        Yes
                      </button>
                    </div>
                  </Notify>
                ))
              }
            >
              <Icon
                className="w-5 h-5 fill-n-4 transition-colors group-hover:fill-accent-1"
                name="trash"
              />
              <div className="absolute min-w-[8rem] top-1/2 -translate-y-1/2 right-full mr-2 px-2 py-1 rounded-lg bg-n-7 caption1 text-n-1 invisible opacity-0 transition-opacity pointer-events-none lg:hidden after:absolute after:top-1/2 after:left-full after:-translate-y-1/2 after:w-0 after:h-0 after:border-t-4 after:border-l-4 after:border-b-4 after:border-r-4 after:border-r-transparent after:border-l-n-7 after:border-t-transparent after:border-b-transparent group-hover:opacity-100 group-hover:visible">
                Clear chat history
              </div>
            </button>
          )}
        </div>
        
        {/* Scrollable Chat History Container */}
        <div className="grow overflow-y-auto scroll-smooth md:overflow-y-auto md:scroll-smooth px-6 md:px-3 border-b border-n-3 dark:border-n-5">
          {clean ? (
            <ChatEmpty />
          ) : loading ? (
            <div className="flex justify-center py-4">
              <Icon className="w-6 h-6 animate-spin" name="loading" />
            </div>
          ) : chatTitles.length > 0 ? (
            <div className="py-3">
              {chatTitles.map((chat) => (
                <Link 
                  href={`/chat/${chat._id}`} 
                  key={chat._id}
                  className="flex items-center p-3 mb-2 rounded-lg hover:bg-n-2 dark:hover:bg-n-5 transition-colors"
                >
                  <Icon className="w-5 h-5 mr-3 fill-n-4" name="message" />
                  <div className="flex-1 truncate">
                    <div className="base2 font-medium text-n-6 dark:text-n-1 truncate">
                      {chat.title || "Untitled chat"}
                    </div>
                    <div className="caption1 text-n-4">
                      {new Date(chat.updatedAt).toLocaleString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-n-4">
              No chat history yet
            </div>
          )}
        </div>
        
        {/* Features Section Header */}
        <div className="flex items-center px-9 md:px-6 pt-4">
          <div className="base2 text-n-4/75">Features</div>
        </div>
        
        {/* Scrollable Features Container */}
        <div className="overflow-y-auto scroll-smooth px-6 md:px-3 pb-6" style={{ maxHeight: '40vh' }}>
          <div className="space-y-3 py-3">
            {Features.map((feature) => (
              <ChatItem item={feature} key={feature.id} />
            ))}
          </div>
        </div>
        
        <div className="p-6 border-t border-n-3 dark:border-n-5">
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