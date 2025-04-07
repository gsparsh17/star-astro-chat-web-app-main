import { ChangeEventHandler, MouseEventHandler } from "react"
import TextareaAutosize from "react-textarea-autosize"
import Icon from "@/components/Icon"
import Files from "./Files"

type MessageProps = {
  value: string
  onChange: ChangeEventHandler<HTMLTextAreaElement>
  placeholder?: string
  image?: string
  document?: any
  onSendClick: MouseEventHandler<HTMLButtonElement>
  isSending?: boolean
  onKeyPress: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

const Message = ({
  value,
  onChange,
  placeholder,
  image,
  document,
  onSendClick,
  isSending,
  onKeyPress,
}: MessageProps) => {
  // Add pointer-events-auto to ensure button is clickable
  const stylesButton = "group absolute right-3 bottom-2 w-10 h-10 pointer-events-auto"

  return (
    <div className="relative w-full pt-4">
      <div className="relative px-10 pb-6 2xl:px-6 md:px-4 md:pb-4">
        <div className="relative border-2 border-n-3 rounded-xl overflow-hidden dark:border-n-5">
          {(image || document) && <Files image={image} document={document} />}
          
          <div className="relative flex items-center min-h-[3.5rem] pr-16 pl-2">
            <TextareaAutosize
              className="w-full py-3 bg-transparent body2 text-n-7 outline-none resize-none placeholder:text-n-4/75 dark:text-n-1 dark:placeholder:text-n-4"
              maxRows={5}
              onKeyDown={onKeyPress}
              autoFocus
              value={value}
              onChange={onChange}
              placeholder={placeholder || "Ask Star Astro anything"}
            />
            
            {/* Send Button - Added more robust styling and click handling */}
            <button
              className={`${stylesButton} ${
                isSending ? 'bg-n-4 cursor-not-allowed' : 'bg-primary-1 hover:bg-primary-1/90'
              } rounded-xl transition-colors flex items-center justify-center`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isSending && value.trim()) {
                  onSendClick(e);
                }
              }}
              disabled={isSending}
              aria-label="Send message"
            >
              <Icon 
                className={`fill-n-1 transition-opacity ${
                  isSending ? 'opacity-50' : 'opacity-100'
                }`} 
                name={isSending ? "spinner" : "arrow-up"} 
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Message