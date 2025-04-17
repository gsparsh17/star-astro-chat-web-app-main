import { useState } from "react"
import { useMediaQuery } from "react-responsive"
import Select from "@/components/Select"
import Menu from "./Menu"
import EditProfile from "./EditProfile"
import Password from "./Password"
import Notifications from "./Notifications"
import ChatExport from "./ChatExport"
import Sessions from "./Sessions"
import Applications from "./Applications"
import Team from "./Team"
import Appearance from "./Appearance"
import DeleteAccount from "./DeleteAccount"
import Image from "next/image"
import Credits from "./Credit"
import ReferAndEarn from "./ReferAndEarn"

type SettingsType = {
  id: string
  title: string
  icon: string
}

type AdditionalSettingsType = {
  id: string
  title: string
  icon: string
}

type UserProfileData = {
  gender: string
  first_name: string
  profile_image: string | undefined
}

type SettingsProps = {
  items: SettingsType[]
  activeItem?: number
  additionalItem?: AdditionalSettingsType[]
  setVisibleSettings: (visible: boolean) => void
  onProfileSaved?: (updatedData: UserProfileData) => void
}

const Settings = ({ 
  items, 
  activeItem, 
  additionalItem, 
  setVisibleSettings,
  onProfileSaved 
}: SettingsProps) => {
  const [active, setActive] = useState<any>(items[activeItem || 0])
  const [showAdditionalMenu, setShowAdditionalMenu] = useState(false)
  const isMobile = useMediaQuery({
    query: "(max-width: 767px)",
  })

  const handleBackClick = () => {
    setShowAdditionalMenu(false)
    setActive(items[0])
  }

  const handleMenuChange = (newActive: any) => {
    setActive(newActive)
    setShowAdditionalMenu(newActive.id === "additional-settings")
  }

  const handleProfileSave = (updatedData: UserProfileData) => {
    if (onProfileSaved) {
      onProfileSaved(updatedData)
    }
    setVisibleSettings(false)
  }

  return (
    <div className="p-12 lg:px-8 md:pt-16 md:px-5 md:pb-8">
      <div className="flex md:block">
        {isMobile ? (
          <Select
            className="mb-6"
            classButton="dark:bg-transparent"
            classArrow="dark:fill-n-4"
            items={showAdditionalMenu ? additionalItem : items}
            value={active}
            onChange={handleMenuChange}
          />
        ) : (
          <div className="shrink-0 w-[13.25rem]">
            {showAdditionalMenu && (
              <button 
                onClick={handleBackClick} 
                className="mb-4 text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back
              </button>
            )}
            {showAdditionalMenu ? (
              <Menu
                value={active}
                setValue={handleMenuChange}
                buttons={additionalItem}
              />
            ) : (
              <Menu
                value={active}
                setValue={handleMenuChange}
                buttons={items}
              />
            )}
            <div className="flex justify-center space-x-4 p-4 gap-4">
              <a
                href="https://wa.me/your-phone-number"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <Image
                  src="/images/whatsapp.svg"
                  style={{ filter: "invert(1)" }}
                  alt="whatsapp"
                  height={20}
                  width={20}
                />
              </a>
              <a
                href="https://www.instagram.com/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Image
                  src="/images/instagram.svg"
                  alt="instagram"
                  style={{ filter: "invert(1)" }}
                  height={20}
                  width={20}
                />
              </a>
              <a
                href="https://www.facebook.com/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Image
                  src="/images/facebook.svg"
                  alt="facebook"
                  style={{ filter: "invert(1)" }}
                  height={20}
                  width={20}
                />
              </a>
              <a
                href="https://www.youtube.com/your-channel"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <Image
                  src="/images/youtube.svg"
                  alt="youtube"
                  style={{ filter: "invert(1)" }}
                  height={20}
                  width={20}
                />
              </a>
            </div>
          </div>
        )}
        <div className="grow pl-12 md:pl-0">
          {active.id === "edit-profile" && (
            <EditProfile 
              setVisibleSettings={setVisibleSettings}
              onSave={handleProfileSave}
            />
          )}
          {active.id === "credits" && <Credits />}
          {active.id === "password" && <Password />}
          {active.id === "refer-and-earn" && <ReferAndEarn />}
          {active.id === "delete-account" && <DeleteAccount />}
          {active.id === "chat-export" && <ChatExport />}
          {active.id === "sessions" && <Sessions />}
          {active.id === "applications" && <Applications />}
          {active.id === "team" && <Team />}
          {active.id === "appearance" && <Appearance />}
        </div>
      </div>
    </div>
  )
}

export default Settings