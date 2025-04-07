import { useColorMode } from "@chakra-ui/color-mode"
import { twMerge } from "tailwind-merge"
import Icon from "@/components/Icon"

type ToggleThemeProps = {
  visible?: boolean
}

const ToggleTheme = ({ visible }: ToggleThemeProps) => {
  const { colorMode, setColorMode } = useColorMode()

  const items = [
    {
      title: "Light",
      icon: "sun",
      active: colorMode === "light",
      onClick: () => setColorMode("light"),
    },
    {
      title: "Dark",
      icon: "moon",
      active: colorMode === "dark",
      onClick: () => setColorMode("dark"),
    },
  ]

  return (
    <div
      className={`${
        !visible &&
        `relative flex w-full p-1 dark:bg-n-6 bg-n-1 rounded-xl before:absolute before:left-1 before:top-1 before:bottom-1 before:w-[calc(50%-0.25rem)] dark:before:bg-n-7 before:bg-n-3 before:rounded-[0.625rem] before:transition-all ${
          colorMode === "dark" && "before:translate-x-full"
        }`
      }`}
    >
      {items.map((item, index) => (
        <button
          className={twMerge(
            `relative z-1 group flex justify-center items-center ${
              visible
                ? `flex w-full h-8 rounded-[30%] dark:bg-n-6 bg-n-5 md:w-8 md:h-8 md:mx-auto ${
                    item.active && "hidden dark:text-n-1"
                  }`
                : `h-10 basis-1/2 base2 font-semibold dark:text-n-4  text-n-4 transition-colors hover:text-n-6 ${
                    item.active && "dark:text-n-1 hover:text-n-2"
                  }`
            }`,
          )}
          key={index}
          onClick={item.onClick}
        >
          <Icon
            className={`fill-n-4 transition-colors dark:group-hover:fill-n-1 group-hover:fill-n-6 ${
              !visible && "mr-3"
            } ${item.active && "group-hover:fill-n-2"} ${
              item.active && !visible && "fill-n-4"
            }`}
            name={item.icon}
          />
          {!visible && item.title}
        </button>
      ))}
    </div>
  )
}

export default ToggleTheme
