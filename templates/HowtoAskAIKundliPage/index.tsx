import { useState, useRef } from "react"
import Layout from "@/components/Layout"
import Chat from "@/components/Chat"
import Question from "@/components/Question"
import Answer from "@/components/Answer"

const HowtoAskAIKundliPage = () => {
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
      <Chat title="How to Ask AI Kundli for Astrological Insights?">
        <Question content="How will I perform in academics?" time="Just now" />
        <Answer scrollToBottom={scrollToBottom} time="Just now">
          Based on your Vedic astrology details, it is mentioned that
          individuals with Vishakha nakshatra like you tend to be intelligent
          and have a quick mind. You are blessed with powerful speech, which can
          make you a good orator. These traits indicate that you have the
          potential to perform well in academics.
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

        <Question
          content="Will I have a successful marriage & family life?"
          time="Just now"
        />
        <Answer scrollToBottom={scrollToBottom} time="Just now">
          Based on the provided information, you have Vishakha Nakshatra, which
          indicates that you have a happy married life and tremendous love for
          your spouse and children. It suggests that you value your relationship
          and are likely to have a strong bond with your family.
        </Answer>
      </Chat>
    </Layout>
  )
}

export default HowtoAskAIKundliPage
