import { useState, useRef } from "react"
import Layout from "@/components/Layout"
import Chat from "@/components/Chat"
import Question from "@/components/Question"
import Answer from "@/components/Answer"

const HowtoAskMatchmakingPage = () => {
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
  return (
    <Layout>
      <Chat title="How to Ask Your AI Matchmaking">
        <Question
          content="Is the couple's match recommended for marriage?"
          time="Just now"
        />

        <Answer scrollToBottom={scrollToBottom} time="Just now">
          Yes, according to the astrology, the match between the prospective
          bride and groom is recommended for marriage. Marriage between the
          prospective bride and groom is highly recommended. The couple would
          have a long-lasting relationship, which would be filled with happiness
          and affluence. Therefore, it is suggested that the couple is
          well-matched and suitable for marriage.
        </Answer>

        <Question
          content="Are there any doshas present in the match?"
          time="Just now"
        />

        <Answer scrollToBottom={scrollToBottom} time="Just now">
          there are no negative astrological factors present in the match. So,
          there are no issues like Manglik dosha, Rajju dosha, or Vedha dosha
          that could potentially affect the compatibility of the couple.
        </Answer>

        <Question
          content="Are there any recommendations or predictions for the couple's long-lasting relationship?"
          time="Just now"
        />

        <Answer scrollToBottom={scrollToBottom} time="Just now">
          it is predicted that the couple's relationship will be filled with
          happiness and affluence. This suggests that they will experience joy
          and prosperity together. The recommendation for marriage indicates
          that their compatibility is strong and they are well-suited for each
          other. This prediction suggests that the couple has a good chance of
          building a long-lasting and harmonious relationship.
        </Answer>
      </Chat>
    </Layout>
  )
}

export default HowtoAskMatchmakingPage
