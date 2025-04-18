import { useState, useRef } from "react"
import Layout from "@/components/Layout"
import Chat from "@/components/Chat"
import Message from "@/components/Message"
import Question from "@/components/Question"
import Answer from "@/components/Answer"
import Services from "@/components/Services"
import Audio from "@/components/Audio"

const AudioGenerationPage = () => {
  const [message, setMessage] = useState<string>("")
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const emptyFunction = () => {}

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight

      chatContainerRef.current.scrollTo({
        top: scrollHeight,
        behavior: "smooth",
      })
    }
  }

  return (
    <Layout>
      <Chat title="Hello">
        <Question content="Hello 🙂" time="Just now" />
        <Answer scrollToBottom={scrollToBottom}>
          Hello! How can I help you today?
        </Answer>
        <Question content="Show me what you can do" time="Just now" />
        <Answer scrollToBottom={scrollToBottom} loading />
        <Answer scrollToBottom={scrollToBottom} time="Just now">
          <Services />
        </Answer>
        <Question
          content={
            <>
              <p>Text to speech voice:</p>
              <p>
                Introducing &quot;Star Astro&quot;, an AI-powered product that
                can turn any written script into high-quality audio. Using
                advanced natural language processing and text-to-speech
                technology, Speechify can generate realistic and
                natural-sounding voices in multiple languages, allowing you to
                create audiobooks, podcasts, and other audio content with ease.
                Additionally, Speechify offers a wide range of customization
                options, including different voices, speaking styles, and even
                emotions, so you can create audio that perfectly matches your
                brand or project. With Speechify, creating audio content has
                never been easier.
              </p>
            </>
          }
          time="Just now"
        />
        <Answer scrollToBottom={scrollToBottom} time="Just now">
          <Audio />
        </Answer>
      </Chat>
      <Message
        value={message}
        onChange={(e: any) => setMessage(e.target.value)}
        onSendClick={emptyFunction} // No action will be taken on Send button click
        onKeyPress={emptyFunction}
      />
    </Layout>
  )
}

export default AudioGenerationPage
