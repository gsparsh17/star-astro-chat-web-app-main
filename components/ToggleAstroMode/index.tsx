import React, { useState } from "react"

type ToggleAstroModeProps = {
  visible?: boolean
  astroMode: string | null
  setAstroMode: React.Dispatch<React.SetStateAction<string | null>>
}

const ToggleAstroMode = ({
  visible,
  astroMode,
  setAstroMode,
}: ToggleAstroModeProps) => {
  const items = [
    {
      title: "Vedic",
      active: astroMode === "vedic",
      onClick: () => setAstroMode("vedic"),
    },
    {
      title: "Western",
      active: astroMode === "western",
      onClick: () => setAstroMode("western"),
    },
  ]

  return (
    <div
      className={`${
        !visible &&
        `relative flex w-full p-1 bg-n-6 rounded-xl before:absolute before:left-1 before:top-1 before:bottom-1 before:w-[calc(50%-0.25rem)] before:bg-n-7 before:rounded-[0.625rem] before:transition-all ${
          astroMode === "western" && "before:translate-x-full"
        }`
      }`}
    >
      {items.map((item, index) => (
        <div
          className={`relative z-1 group flex justify-center items-center cursor-pointer ${
            visible
              ? `flex w-full h-16 rounded-xl bg-n-6 md:w-8 md:h-8 md:mx-auto ${
                  item.active && "hidden"
                }`
              : `h-10 basis-1/2 base2 font-semibold text-n-4 transition-colors hover:text-n-1 ${
                  item.active && "text-n-1"
                }`
          }`}
          key={index}
          onClick={item.onClick}
        >
          {!visible && item.title}
        </div>
      ))}
    </div>
  )
}

export default ToggleAstroMode
