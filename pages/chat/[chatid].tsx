import type { NextPage } from "next"
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamic import with no SSR for better performance
const AiKundliPage = dynamic(
  () => import('@/templates/AiKundliPage'),
  { 
    ssr: false,
    loading: () => <div className="flex justify-center items-center h-screen">Loading...</div>
  }
)

const ChatPage: NextPage = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading chat...</div>}>
      <AiKundliPage />
    </Suspense>
  )
}

export default ChatPage