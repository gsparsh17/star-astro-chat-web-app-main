import { useState, useEffect } from "react"
import { Menu, Transition } from "@headlessui/react"
import Image from "@/components/Image"
import Icon from "@/components/Icon"
import Modal from "@/components/Modal"
import Settings from "@/components/Settings"
import { additionalSettings, settings } from "@/constants/settings"
import { toast } from "react-hot-toast"
import { useRouter } from "next/router"

type ProfileProps = {}

const Profile = ({}: ProfileProps) => {
  const router = useRouter()
  const [visibleSettings, setVisibleSettings] = useState<boolean>(false)
  const [userGender, setUserGender] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [userProfilePic, setUserProfilePic] = useState<string | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isProfileComplete, setIsProfileComplete] = useState(true)
  const [userPob, setUserPob] = useState<string | null>(null)
  const [userDob, setUserDob] = useState<string | null>(null)

  useEffect(() => {
    if (!userName || !userGender || !userDob || !userPob) {
      setIsProfileComplete(false)
    } else {
      setIsProfileComplete(true)
    }
  }, [userName, userGender, userProfilePic])

  const menu = [
    {
      title: "New version available",
      icon: "arrow-down-circle",
      onClick: () => console.log("New version available"),
    },
    {
      title: "Edit Profile",
      icon: "settings-fill",
      onClick: () => setVisibleSettings(true),
    },
    {
      title: "Delete Account",
      icon: "profile",
      onClick: () => router.push("/delete-user"), // Navigate to /delete-user
    },
    {
      title: "Log out",
      icon: "logout",
      onClick: () => handleLogout(),
    },
  ]

  useEffect(() => {
    const user = localStorage.getItem("user")
    console.log("Right Side Bar User data:", user)
    if (user) {
      const json = JSON.parse(user)
      if (json.gender) {
        setUserGender(json.gender)
        setUserName(json.first_name)
        setUserProfilePic(json.profile_image)
        setUserPob(json.place_of_birth)
        setUserDob(json.date_of_birth)
      }
    }
  }, [])

  const avatarImagePath =
    userProfilePic ||
    (userGender === "male" ? "/images/Male.png" : "/images/Female.png")

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("accessToken")

    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-green-600 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="ml-3 flex-1">
              <p className="mt-1 text-base text-white font-semibold mb-4">
                Logout success! Celestial departure complete. 🌌🚀
              </p>
            </div>
          </div>
        </div>
      </div>
    ))

    // window.open(`${process.env.LANDING_PAGE}/login`, "_self")
    router.push(`${process.env.LANDING_PAGE}/sign-in`)
  }

  return (
    <>
      <div className="relative z-[1000] mr-6 lg:mr-4 md:static" style={{
        isolation: 'isolate',
        position: 'relative' // Ensure this is relative
        }}>
        <Menu>
          <Menu.Button 
            className="group relative w-10 h-10 rounded-full transition-shadow ui-open:shadow-[0_0_0_0.25rem_#0084FF]"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div className="relative w-full h-full">
              <Image
                className="rounded-full object-cover"
                src={avatarImagePath}
                fill
                alt="Avatar"
              />
              {!isProfileComplete && (
              <>
                <div className="absolute -right-1 top-6 z-10 w-4.5 h-4.5 bg-red-500 rounded-full border-4 border-n-6 animate-pulse"></div>
                {showTooltip && (
                  <div className="absolute z-10 w-40 px-2 py-2 text-sm text-white bg-red-500 rounded-lg shadow-lg top-full left-full transform -translate-x-1/2 mt-2">
                    Complete your profile
                  </div>
                )}
              </>
            )}
            {isProfileComplete && (
            <div className="absolute -right-0.75 -bottom-0.75 w-4.5 h-4.5 bg-primary-2 rounded-full border-4 border-n-6"></div>)}
          </div>
          </Menu.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100 z-[999]"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Menu.Items 
  className="fixed top-full -right-5 w-[19.88rem] mt-[0.9375rem] p-4 bg-n-1 border border-n-2 rounded-2xl shadow-[0px_48px_64px_-16px_rgba(0,0,0,0.25)] md:-right-38 z-[1001] md:w-[calc(100vw-4rem)] dark:bg-n-7 dark:border-n-5"
  style={{
    position: 'fixed',
    marginTop: '0.9375rem',
    zIndex: 9999,
    willChange: 'transform', // Helps with rendering performance
    transform: 'translateZ(0)' // Creates new stacking context
  }}
>
              <div className="flex items-center mb-3">
                <div className="relative w-15 h-15">
                  <Image
                    className="rounded-full object-cover"
                    src={avatarImagePath}
                    fill
                    alt="Avatar"
                  />
                  <div className="absolute right-0 bottom-0 w-4.5 h-4.5 bg-primary-2 rounded-full border-4 border-n-1 dark:border-n-7"></div>
                </div>
                <div className="pl-4">
                  <div className="h6">{userName}</div>
                  {/* <div className="caption1 text-n-4">
                    Lead visual designer at Star Astro
                  </div> */}
                </div>
              </div>
              <div className="px-4 bg-n-2 rounded-xl dark:bg-n-6">
                {menu.map((item, index) => (
                  <Menu.Item key={index}>
                    <button
                      className="group flex items-center w-full h-12 base2 font-semibold transition-colors hover:text-primary-1"
                      onClick={item.onClick}
                    >
                      <Icon
                        className="mr-4 fill-n-4 transition-colors group-hover:fill-primary-1"
                        name={item.icon}
                      />
                      {item.title}
                    </button>
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <Modal
        className="md:!p-0 "
        classWrap="max-w-[48rem] md:min-h-screen-ios md:rounded-none"
        classButtonClose="hidden md:block md:absolute md:top-5 md:right-5 dark:fill-n-4"
        classOverlay="md:bg-n-1"
        visible={visibleSettings}
        onClose={() => setVisibleSettings(false)}
      >
        <Settings
          items={settings}
          additionalItem={additionalSettings}
          setVisibleSettings={setVisibleSettings}
        />
      </Modal>
    </>
  )
}

export default Profile
