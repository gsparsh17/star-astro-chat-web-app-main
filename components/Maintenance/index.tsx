import React from "react"

const Maintenance: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-red-500 mb-4 text-center">
        🛠️ Under Maintenance 🛠️
      </h1>
      <p className="text-base md:text-lg lg:text-xl text-gray-700 mb-8 text-center">
        We are currently undergoing maintenance. Please check back later. 🕒
      </p>
    </div>
  )
}

export default Maintenance
