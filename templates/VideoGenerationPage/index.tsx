import { useState, useRef } from "react"
import Layout from "@/components/Layout"
import Chat from "@/components/Chat"
import Message from "@/components/Message"
import Question from "@/components/Question"
import Answer from "@/components/Answer"
import Video from "@/components/Video"

const VideoGenerationPage = () => {
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
    <Layout>
      <Chat title="Talking avatar video">
        <Question
          content={
            <>
              <p>Create a talking avatar for this script:</p>
              <br></br>
              <p>
                Create a talking avatar for this script: &quot;Welcome to our
                new product, the Talking Avatar Video Creator. With this
                powerful tool, you can easily create engaging videos featuring a
                virtual spokesperson that delivers your message in a
                personalized and natural way. Whether you&apos;re promoting a
                product, sharing information about your business, or delivering
                a training session, our AI-powered technology makes it easy to
                create professional-looking videos that grab attention and drive
                results. Try it out today and see the difference for
                yourself!&quot;
              </p>
            </>
          }
          time="Just now"
          image="/images/video-pic.jpg"
        />
        <Answer scrollToBottom={scrollToBottom} loading />
        <Answer scrollToBottom={scrollToBottom} time="Just now">
          <Video />
        </Answer>
      </Chat>
      <Message
        value={message}
        onChange={(e: any) => setMessage(e.target.value)}
        onSendClick={emptyFunction} // Use the empty function
        // image="/images/photo.jpg"
        onKeyPress={emptyFunction}
      />
    </Layout>
  )
}

export default VideoGenerationPage
