import React from "react"
import Link from "next/link"
import Icon from "@/components/Icon"
import Image from "next/image"

type MenuType = {
  title: string
  icon: string
  color: string
  img: string
  url: string
  comingSoon?: boolean
  premium?: boolean
}

type MenuProps = {
  className?: string
  items: MenuType[]
}

const Menu = ({ className, items }: MenuProps) => {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <Link
          className={`group flex justify-between items-center mb-5 p-3 border rounded-xl h-16 transition-all 
            hover:border-transparent hover:shadow-[0_0_1rem_0.25rem_rgba(0,0,0,0.04),0px_2rem_1.5rem_-1rem_rgba(0,0,0,0.12)] 
            last:mb-0 
            ${item.premium ? 'border-[#33C2CF]' : 'border-n-3 dark:border-n-5 dark:hover:border-n-7 dark:hover:bg-n-7'}`}
          href={item.url}
          key={index}
        >
          <div className="mr-3">
            <Image src={item.img} alt="image" height={40} width={40} />
          </div>
          <div className="flex items-center justify-between w-[calc(100%-30px)] gap-1">
            <span className="group-hover:text-blue-500 text-sm">{item.title}</span>
            {item.premium && (
              <div className="px-2 text-[10px] leading-normal rounded-lg text-black font-semibold py-1 flex items-center justify-center bg-[#3FDD78]">
                Premium Feature
              </div>
            )}
          </div>
          <Icon
            className="ml-auto fill-n-4 transition-colors group-hover:fill-n-7 dark:group-hover:fill-n-4"
            name="arrow-next"
          />
        </Link>
      ))}
    </div>
  )
}

export default Menu
