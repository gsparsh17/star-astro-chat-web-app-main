import { useState, useEffect } from "react"
import AiKundli from "@/templates/AiKundliPage/AiKundli"
import AstrologyDashboard from "@/components/Home"

type MainProps = {}

const Main = ({}: MainProps) => {
  const [userName, setUserName] = useState<string | null>(null)
  const [userGender, setUserGender] = useState<string | null>(null)
  const [userProfilePic, setUserProfilePic] = useState<string | null>(null)

  // Check if a new user has logged in and initialize their data
  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      const json = JSON.parse(user)
      if (json.gender) {
        setUserGender(json.gender)
        setUserName(json.first_name)
      }
      if (json.profilePic) {
        setUserProfilePic(json.profilePic)
      }
    }
  }, [])

  const avatarImagePath =
    userProfilePic ||
    (userGender === "male" ? "/images/Male.png" : "/images/Female.png")

  return (
    <>
      <AiKundli />
      {/* <AstrologyDashboard/> */}
    </>
  )
}

export default Main
