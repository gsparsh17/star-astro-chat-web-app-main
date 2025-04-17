import { useRef, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { toast } from "react-hot-toast"
import Modal from "@/components/Modal"
import Field from "@/components/Field"
import MultiSelect from "@/components/MultiSelect"
import Notify from "@/components/Notify"

const ReferAndEarn = () => {
  const [referralCode, setReferralCode] = useState<string>("STARASTRO25")
  const [baseLink, setBaseLink] = useState<string>("https://starastrogpt.com/")
  const [link, setLink] = useState<string>("https://starastrogpt.com/sign-in?ref=STARASTRO25")
  const [selectedOptions, setSelectedOptions] = useState([])
  const [copied, setCopied] = useState<boolean>(false)

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
    <div className="flex flex-col p-6 sm:p-8 md:p-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
        Invite your friends and earn rewards!
      </h1>
      <p className="text-gray-600 mb-6 sm:text-lg">
        Share your referral code or URL with friends and enjoy exclusive benefits.
      </p>

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
    </div>
  )
}

export default ReferAndEarn