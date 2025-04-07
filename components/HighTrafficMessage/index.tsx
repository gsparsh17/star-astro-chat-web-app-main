import React from "react"

const HighTrafficMessage = ({ pricing }: { pricing: () => void }) => {
  return (
    <div
      className="z-10 w-full m-auto bg-n-1 rounded-3xl dark:bg-n-7 max-w-[48rem] md:min-h-screen-ios opacity-100 scale-100"
      data-headlessui-state="open"
    >
      <div className="p-12 lg:px-8 md:pt-16 md:px-45 md:pb-8">
        <div className="flex md:block">
          <div className="grow pl-12 md:pl-0 text-center">
            <p className="text-lg text-center">
              🌟✨ Welcome to the future of astrology! 🌌🔮
            </p>
            <br />
            <p className="text-lg text-center">
              We're receiving a lot of visitors from all over the world. 🌍🔥
            </p>
            <br />
            <p className="text-lg text-center">
              Due to high traffic, we're currently prioritizing our standard or
              premium subscribers. Subscribe now for accurate insights powered
              by our advanced AI technology. Don't wait, unlock your future
              today. 🔒🔍
            </p>
            <br />
            <p className="text-lg text-center">
              Use code <span className="text-2xl font-bold">ASTROAI50</span> for
              a special discount!
            </p>

            <div className="mt-5">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  pricing()
                }}
                className="btn-blue mb-3 overflow-y-auto w-auto min-w-[8em] text-base"
              >
                Click here for premium access! 🌟
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HighTrafficMessage
