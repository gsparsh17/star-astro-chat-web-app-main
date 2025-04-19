import { useRef, useState, useEffect } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { toast } from "react-hot-toast"
import Modal from "@/components/Modal"
import axios from "axios"
import Field from "@/components/Field"
import MultiSelect from "@/components/MultiSelect"
import Notify from "@/components/Notify"

import { people } from "@/mocks/people"

type ModalShareChatProps = {
  visible: boolean
  onClose: () => void
}

const ModalShareChat = ({ visible, onClose }: ModalShareChatProps) => {
  const [referralCode, setReferralCode] = useState<string>("STARASTRO25")
  const [baseLink, setBaseLink] = useState<string>("https://starastrogpt.com/")
  const [link, setLink] = useState<string>("https://starastrogpt.com/sign-in?ref="+referralCode)
  const [selectedOptions, setSelectedOptions] = useState([])
  const [copied, setCopied] = useState<boolean>(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No access token found. Please log in.");
        }

        const response = await axios.get(`${process.env.BACKEND_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = response.data.data;
        console.log("User data:", userData);
    if (userData.referralId) {
        setReferralCode(userData.referralId)
        setLink("https://starastrogpt.com/sign-in?ref="+userData.referralId)
      }
    }
  catch (error) {
    console.error("Error fetching user data:", error)
  }
}
    fetchUserData()
  }
, [])

  const handleReferralCodeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newCode = e.target.value
    setReferralCode(newCode)
    updateLinkWithReferral(newCode)
  }

  const updateLinkWithReferral = (code: string) => {
    const url = new URL(baseLink)
    url.searchParams.set("ref", code)
    setLink(url.toString())
  }

  const onCopy = () => {
    setCopied(true)
    toast((t) => (
      <Notify iconCheck>
        <div className="ml-3 h6">Link copied</div>
      </Notify>
    ))
  }

  let copyButtonRef = useRef(null)

  return (
    <Modal
      classWrap="max-w-[40rem]"
      classButtonClose="absolute top-6 right-6 w-10 h-10 rounded-full bg-n-2 md:top-5 md:right-5 dark:bg-n-4/25 dark:fill-n-4 dark:hover:fill-n-1"
      visible={visible}
      onClose={onClose}
      initialFocus={copyButtonRef}
    >
      <form
        className="p-12 md:p-5"
        action=""
        onSubmit={() => console.log("Submit")}
      >
        <div className="mb-8 h4">Share this App</div>
        
        {/* Referral Code Section */}
        <div className="mb-4 base2 font-semibold text-n-6 dark:text-n-3">
          Your referral code
        </div>
        <div className="relative mb-8">
          <Field
            classInput="h-14 pr-[6.25rem] bg-n-2 truncate text-[1rem] text-n-4 border-transparent focus:bg-n-2 md:base2"
            placeholder="Referral Code"
            value={referralCode}
            onChange={handleReferralCodeChange}
            required
          />
          <CopyToClipboard text={referralCode} onCopy={onCopy}>
            <button
              className="btn-dark absolute top-1 right-1"
              type="button"
            >
              Copy
            </button>
          </CopyToClipboard>
        </div>
        
        {/* Shareable Link Section */}
        <div className="mb-4 base2 font-semibold text-n-6 dark:text-n-3">
          Shareable link with your referral code
        </div>
        <div className="relative mb-8">
          <Field
            classInput="h-14 pr-[6.25rem] bg-n-2 truncate text-[1rem] text-n-4 border-transparent focus:bg-n-2 md:base2"
            placeholder="Link"
            value={link}
            readOnly
            required
            onChange={() => {}}
          />
          <CopyToClipboard text={link} onCopy={onCopy}>
            <button
              className="btn-dark absolute top-1 right-1"
              ref={copyButtonRef}
              type="button"
            >
              Copy
            </button>
          </CopyToClipboard>
        </div>
      </form>
    </Modal>
  )
}

export default ModalShareChat