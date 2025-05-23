import { useRouter } from "next/router"
import Link from "next/link"
import { twMerge } from "tailwind-merge"
import Icon from "@/components/Icon"

type NavigationType = {
  title: string
  icon: string
  color: string
  url?: string
  onClick?: () => void
}

type NavigationProps = {
  visible?: boolean
  items: NavigationType[]
}

const Navigation = ({ visible, items }: NavigationProps) => {
  const router = useRouter()

  return (
    <div className={`${visible && "px-2"}`}>
      {items.map((item, index) =>
        item.url ? (
          <Link
            className={twMerge(
              `flex items-center h-11 base2 font-semibold dark:text-n-3/75 text-n-4 rounded-lg transition-colors dark:hover:text-n-1 hover:text-n-5 ${
                router.pathname === item.url &&
                "dark:text-n-1 text-n-4 bg-n-3 dark:bg-[#323337] shadow-[inset_0px_0.0625rem_0_rgba(255,255,255,0.05),0_0.25rem_0.5rem_0_rgba(0,0,0,0.1)]"
              } ${visible ? "px-3" : "px-5"}`,
            )}
            href={item.url}
            key={index}
          >
            <Icon className={item.color} name={item.icon} />
            {!visible && <div className="ml-5 text-sm">{item.title}</div>}
          </Link>
        ) : (
          <button
            className={`flex items-center w-full h-12 base2 font-semibold dark:text-n-3/75 text-n-4 rounded-lg transition-colors dark:hover:text-n-1 hover:text-n-5 ${
              visible ? "px-3" : "px-5"
            }`}
            key={index}
            onClick={item.onClick}
          >
            <Icon className={item.color} name={item.icon} />
            {!visible && <div className="ml-5">{item.title}</div>}
            {item.title === "Search" && !visible && (
              <div className="ml-auto px-2 rounded-md bg-n-4/50 caption1 font-semibold text-n-3">
                ⌘ F
              </div>
            )}
          </button>
        ),
      )}
    </div>
  )
}

export default Navigation
