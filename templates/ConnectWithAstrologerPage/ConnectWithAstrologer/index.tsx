import { useState, useRef } from "react"
import Chat from "@/components/Chat"
import Question from "@/components/Question"
import Answer from "@/components/Answer"
import Image from "@/components/Image"
import Message from "@/components/Message"

const ConnectWithAstrologer = () => {
  const [message, setMessage] = useState<string>("")
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight

      chatContainerRef.current.scrollTo({
        top: scrollHeight,
        behavior: "smooth",
      })
    }
  }

  const emptyFunction = () => {}
  return (
    <>
      <Chat title="Personal Astrologer">
        <div className="max-w-[50rem]">
          <div className="pt-6 px-6 pb-16 space-y-4 bg-n-2 rounded-[1.25rem] md:p-5 md:pb-14 dark:bg-n-7">
            <Image
              src="/images/kundli-mock.svg"
              alt="Kundli Mock"
              width="1000" // Set width to 100% to fill the parent container
              height="1000" // Set height to auto to maintain aspect ratio
              className="corner-edge-svg"
            />
            <div className="content-wrapper">Your Kundli</div>
          </div>

          <div className="-mt-8 flex items-end pl-6">
            <div className="relative shrink-0 w-16 h-16 mr-auto rounded-2xl overflow-hidden shadow-[0_0_0_0.25rem_#FEFEFE] dark:shadow-[0_0_0_0.25rem_#232627]">
              <img
                className="object-cover rounded-2xl"
                src="/images/star-light.png"
                alt="Star Astro"
              />
            </div>
            <button className="group flex items-center ml-3 px-2 py-0.5 bg-n-3 rounded-md caption1 txt-n-6 transition-colors hover:text-primary-1 dark:bg-n-7 dark:text-n-3 dark:hover:text-primary-1">
              Copy Text
            </button>
          </div>
        </div>

        <Question content="Hello" time="Just now" />
        <Answer scrollToBottom={scrollToBottom} time="Just now">
          namaste 🙏
        </Answer>

        <Question content="How is my work life going to be?" time="Just now" />
        <Answer scrollToBottom={scrollToBottom} time="Just now">
          Based on your astrological details, you have the potential for a
          successful work life. You are intelligent and highly energetic, with a
          great enthusiasm towards life. You have a powerful personality and are
          very appealing. Your nakshatra, Vishakha, blesses you with powerful
          speech and makes you a quick thinker. You are a good orator and have
          the capacity to attract crowds. You are fit for doing independent
          business, jobs involving high responsibility, banking, religious
          professions, mathematics, teaching, or printing. Words are your
          weapons, and they make a great impact on the minds of others. You have
          the ability to shoulder major responsibilities with efficiency and
          sincerity.
        </Answer>
      </Chat>
      <Message
        value={message}
        onChange={(e: any) => setMessage(e.target.value)}
        onSendClick={emptyFunction} // Use the empty function
        // image="/images/photo.jpg"
        onKeyPress={emptyFunction}
      />
    </>
  )
}

export default ConnectWithAstrologer
