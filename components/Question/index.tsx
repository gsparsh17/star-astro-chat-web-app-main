import React, { useEffect, useState } from "react"
import Image from "@/components/Image"
import Document from "./Document"

type QuestionProps = {
  content: any
  image?: string
  document?: string
  time: string
}

const Question = ({ content, image, document, time }: QuestionProps) => {
  const [userGender, setUserGender] = useState<string | null>(null) // State to store user's gender
  const [userProfilePic, setUserProfilePic] = useState<string | null>(null) // State to store user's profile picture

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      const json = JSON.parse(user)
      if (json.gender) {
        setUserGender(json.gender)
      }
      if (json.profilePic) {
        setUserProfilePic(json.profilePic)
      }
    }
  }, [])

  return (
    <div className="max-w-[50rem] ml-auto">
      <div className="space-y-6 pt-6 px-6 pb-16 border-3 border-n-2 rounded-[1.25rem] md:p-5 md:pb-14 dark:border-transparent dark:bg-n-5/50">
        {document && <Document value={document} />}
        <div className="">{content}</div>
        {image && (
          <div className="relative w-[11.25rem] h-[11.25rem]">
            <Image
              className="rounded-xl object-cover"
              src={image}
              fill
              alt="Avatar"
            />
          </div>
        )}
      </div>
      <div className="-mt-8 flex items-end pr-6 mb-2">
        <div className="pb-0.5 caption1 text-n-4/50 dark:text-n-4">{time}</div>
        <div className="relative w-16 h-16 ml-auto rounded-2xl overflow-hidden ">
          {userProfilePic ? (
            <Image
              className="object-cover"
              src={userProfilePic}
              fill
              alt="Avatar"
            />
          ) : userGender === "male" ? (
            <Image
              className="object-cover"
              src="/images/Male.png"
              fill
              alt="Avatar"
            />
          ) : (
            <Image
              className="object-cover"
              src="/images/Female.png"
              fill
              alt="Avatar"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Question
