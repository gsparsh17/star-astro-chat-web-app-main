import React, { useState, useEffect, useRef } from "react"
import Image from "@/components/Image"
import Loading from "./Loading"
import { useColorMode } from "@chakra-ui/color-mode"
import Notify from "@/components/Notify"
import { toast } from "react-hot-toast"

type AnswerProps = {
  children?: React.ReactNode
  chatid?: string
  loading?: boolean
  time?: string
  scrollToBottom?: () => void
  cacheRef?: any
  onTypingComplete?: () => void
}

const Answer = ({
  chatid,
  loading,
  time,
  children,
  scrollToBottom,
  cacheRef,
  onTypingComplete,
}: AnswerProps) => {
  const [displayedText, setDisplayedText] = useState<React.ReactNode[]>([])
  const [wordIndex, setWordIndex] = useState(0)
  const { colorMode } = useColorMode()
  const [copied, setCopied] = useState<boolean>(false)

  const onCopy = () => {
    // Copy the displayedText to the clipboard
    const copiedText = displayedText.map((item) =>
      typeof item === "string" ? item : "\n",
    )
    navigator.clipboard.writeText(copiedText.join(" ")).then(() => {
      setCopied(true)
      toast((t) => (
        <Notify iconCheck>
          <div className="ml-3 h6">&#x2713; Text copied!</div>
        </Notify>
      ))
      // Reset the copied state after displaying the message
      setTimeout(() => {
        setCopied(false)
      }, 2000) // Reset after 2 seconds (adjust as needed)
    })
  }

  const imageSrc =
    colorMode === "dark" ? "/images/star-light.png" : "/images/star-dark.png"

  useEffect(() => {
    if (!loading && typeof children === "string") {
      const text = children as string
      if (text) {
        const paragraphs = text.split("\n")
        const formattedText: React.ReactNode[] = []

        paragraphs.forEach((paragraph, index) => {
          if (index !== 0) {
            // Add a line break between paragraphs
            formattedText.push(<br key={`br-${index}`} />)
          }

          const words = paragraph.split(" ")
          words.forEach((word, wordIndex) => {
            if (wordIndex !== 0) {
              // Add a space between words
              formattedText.push(" ")
            }

            formattedText.push(word)
          })
        })

        setDisplayedText(formattedText)
        
        // If chatid exists, skip typing animation and show full text immediately
        if (chatid) {
          setWordIndex(formattedText.length)
          if (onTypingComplete) onTypingComplete()
          if (scrollToBottom) scrollToBottom()
        }
      }
    }
  }, [loading, children, chatid])

  useEffect(() => {
    // Skip typing animation if chatid exists
    if (chatid) return;

    if (!loading && displayedText.length > 0) {
      if (cacheRef?.current) cacheRef.current.startChecking = true
      const interval = setInterval(() => {
        if (wordIndex < displayedText.length) {
          setWordIndex((prevIndex) => prevIndex + 1)
          if (
            scrollToBottom &&
            (!cacheRef || !cacheRef?.current?.preventAutoScroll)
          )
            scrollToBottom()
        } else {
          clearInterval(interval)
          if (onTypingComplete) onTypingComplete() 
        }
      }, 100)

      return () => clearInterval(interval)
    }
  }, [loading, displayedText, wordIndex, chatid])

  return (
    <div className="max-w-full md:max-w-[50rem]">
      <div className="pt-6 px-6 pb-16 space-y-4 bg-n-2 rounded-[1.25rem] md:p-5 md:pb-14 dark:bg-n-7">
        {loading ? <Loading /> : displayedText.slice(0, wordIndex)}
      </div>
      <div className="-mt-8 flex items-end pl-6">
        <div
          className={`relative shrink-0 w-16 h-16 mr-auto rounded-2xl overflow-hidden`}
        >
          <Image
            className="object-cover rounded-2xl"
            src={imageSrc}
            fill
            alt="Star Astro"
          />
        </div>
        <button
          className="group flex items-center ml-3 px-2 py-0.5 bg-n-3 rounded-md caption1 txt-n-6 transition-colors hover:text-primary-1 dark:bg-n-7 dark:text-n-3 dark:hover:text-primary-1"
          onClick={onCopy}
          disabled={loading || copied}
        >
          {copied ? "Text Copied" : "Copy Text"}
        </button>
      </div>
    </div>
  )
}

export default Answer