import React, { useState } from "react"

const ReferAndEarn = () => {
  const [referralCode, setReferralCode] = useState<string>("STARASTRO25") // Prefilled referral code

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode)
      alert("Referral code copied to clipboard!")
    } catch (error) {
      alert("Failed to copy the referral code. Please try again.")
    }
  }

  return (
    <div className="flex flex-col p-6 sm:p-8 md:p-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
        Invite your friends and earn rewards!
      </h1>
      <p className="text-gray-600 mb-6 sm:text-lg">
        Share your referral code with friends and enjoy exclusive benefits.
      </p>
      <div className="flex items-center w-full shadow rounded mt-6 sm:mt-10 pr-10 sm:pr-0">
        <input
          type="text"
          onChange={(e) => setReferralCode(e.target.value)}
          value={referralCode}
          className="flex-grow border-none focus:ring-0 text-white font-medium bg-n-5 px-4 py-2 rounded-l sm:rounded-l-md sm:h-12"
        />
        <button
          onClick={handleCopy}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r sm:rounded-r-md sm:h-12 sm:ml-4 mt-0"
        >
          Copy
        </button>
      </div>
    </div>
  )
}

export default ReferAndEarn
