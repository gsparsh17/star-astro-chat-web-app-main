import { useState } from "react"
import { Disclosure, Transition } from "@headlessui/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { twMerge } from "tailwind-merge"
import Icon from "@/components/Icon"
import Modal from "@/components/Modal"
import AddChatList from "@/components/AddChatList"
import Image from "next/image"

type ChatListType = {
  id: string
  title: string
  img: string
  color: string
  url: string
}

type ChatListProps = {
  visible?: boolean
  items: ChatListType[]
}

const ChatList = ({ visible, items }: ChatListProps) => {
  const [visibleModal, setVisibleModal] = useState<boolean>(false)

  const router = useRouter()

  return (
    <>
      <div className="mb-auto pb-6">
        <Disclosure defaultOpen={true}>
          <Disclosure.Button
            className={`flex items-center w-full h-12 text-left base2 dark:text-n-4/75 text-n-4 transition-colors dark:hover:text-n-3 hover:text-n-7 ${
              visible ? "justify-center px-3" : "px-5"
            }`}
          >
            <Icon
              className="fill-n-4 transition-transform ui-open:rotate-180"
              name="arrow-down"
            />
            {!visible && <div className="ml-5">How to Ask</div>}
          </Disclosure.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className={`${visible && "px-2"}`}>
              {items.map((item) => (
                <Link
                  className={twMerge(
                    `flex items-center w-full h-12 rounded-lg dark:text-n-3/75 text-n-4 base2 font-semibold transition-colors dark:hover:text-n-1 hover:text-n-6 ${
                      visible ? "px-3" : "px-5"
                    } ${
                      router.pathname === item.url &&
                      "text-n-4 dark:text-n-1 bg-n-3 dark:bg-[#323337] shadow-[inset_0px_0.0625rem_0_rgba(255,255,255,0.05),0_0.25rem_0.5rem_0_rgba(0,0,0,0.1)] "
                    }`,
                  )}
                  key={item.id}
                  href={item.url}
                >
                  <div className="flex justify-center items-center w-6 h-6 ">
                    <div className="">
                      <Image
                        src={item.img}
                        alt="image"
                        height={40}
                        width={40}
                      />
                    </div>
                  </div>
                  {!visible && (
                    <>
                      <div className="ml-5">{item.title}</div>
                      <div className="ml-auto px-1 dark:bg-n-6 bg-n-3 rounded-lg base2 font-semibold text-n-4">
                        <Icon
                          className="ml-auto fill-n-4 transition-colors group-hover:fill-n-7 dark:group-hover:fill-n-4"
                          name="arrow-next"
                        />
                      </div>
                    </>
                  )}
                </Link>
              ))}
            </Disclosure.Panel>
          </Transition>
        </Disclosure>
        {/* <button
          className={`group flex items-center w-full h-12 text-left base2 text-n-3/75 transition-colors hover:text-n-3 ${
            visible ? "justify-center px-3" : "px-5"
          }`}
          onClick={() => setVisibleModal(true)}
        >
          <Icon
            className="fill-n-4 transition-colors group-hover:fill-n-3"
            name="plus-circle"
          />
          {!visible && <div className="ml-5">New list</div>}
        </button> */}
      </div>
      <Modal
        className="md:!p-0"
        classWrap="max-w-[40rem] md:min-h-screen-ios md:rounded-none md:pb-8"
        classButtonClose="absolute top-6 right-6 w-10 h-10 rounded-full bg-n-2 md:right-5 dark:bg-n-4/25 dark:fill-n-4 dark:hover:fill-n-1"
        visible={visibleModal}
        onClose={() => setVisibleModal(false)}
      >
        <AddChatList onCancel={() => setVisibleModal(false)} />
      </Modal>
    </>
  )
}

export default ChatList
