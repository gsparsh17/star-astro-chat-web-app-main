import React, { useState, useEffect, useRef } from "react"
import Message from "@/components/Message"
import { aiKundliQue } from "@/constants/aiKundliQue"
import Image from "@/components/Image"
import axios from "axios"
import Question from "@/components/Question"
import Answer from "@/components/Answer"
import Chat from "@/components/Chat"
import { toast } from "react-hot-toast"
import Link from "next/link"
import { useRouter } from "next/router"
import HighTrafficMessage from "@/components/HighTrafficMessage"
import Menu from "@/components/Menu"
import { navigation } from "@/constants/navigation"
import { usePathname } from "next/navigation"
import Modal from "@/components/Modal"
import Settings from "@/components/Settings"
import { additionalSettings, settings } from "@/constants/settings"
import { useForm, SubmitHandler } from "react-hook-form";
import TodayHoroscope from "@/components/TodaysHoroscope";
import { twMerge } from "tailwind-merge";
import Autocomplete from "@/components/AutoComplete"; // Make sure this path is correct

interface TopicType {
  count: number
  data: {
    _id: string
  }
}

interface PartnerInputs {
  partner_fname: string;
  partner_lname: string;
  partner_gender: string;
  partner_day: string;
  partner_month: string;
  partner_year: string;
  partner_hour: string;
  partner_minute: string;
  partner_location: string;
  partner_period: string;
}

interface PartnerAddress {
  label: string;
  longitude: number;
  latitude: number;
  value?: string;
}

interface ChatType {
  _id: string
  title: string
  chats: Array<{
    role: string
    text: string
    createdAt?: string
  }>
  createdAt: string
}

type MainProps = {}

const styleButton: string =
  "h-12 ml-3 px-4 bg-n-3 rounded-md caption1 txt-n-3 transition-colors hover:text-primary-1 dark:bg-n-7"

const questionButton: string =
  "font-medium text-lg md:text-xl break-words py-2 px-4"

const AiKundli = ({}: MainProps) => {
  const [message, setMessage] = useState<string>("")
  const [lastMessage, setLastMessage] = useState<string>("")
  const [topic, setTopic] = useState<TopicType | undefined>()
  // const [responseContent, setResponseContent] = useState<string[]>([])
  // const [messageArray, setMessageArray] = useState<string[]>([])
  const [showPricingContent, setShowPricingContent] = useState(false)
  const [showDiv, setShowDiv] = useState(true)
  const [loading, setLoading] = useState(false)
  const [responseReceived, setResponseReceived] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [partnerFormVisible, setPartnerFormVisible] = useState(false);
const [partnerAddress, setPartnerAddress] = useState<PartnerAddress | null>(null);
const [flagPartnerAddress, setFlagPartnerAddress] = useState(false);
  const [chatData, setChatData] = useState<ChatType | null>(null)
  // Update the cacheRef type definition
const cacheRef = useRef<{
  prvScrollValue: number | null;
  preventAutoScroll: boolean;
  startChecking: boolean;
}>({
  prvScrollValue: null,
  preventAutoScroll: false,
  startChecking: false,
});
  const [userGender, setUserGender] = useState<string | null>(null)
  const [userPlan, setUserPlan] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [userPob, setUserPob] = useState<string | null>(null)
  const [userDob, setUserDob] = useState<string | null>(null)
  const [userProfilePic, setUserProfilePic] = useState<string | null>(null)
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [visibleSettings, setVisibleSettings] = useState(false)

  const router = useRouter()
  console.log(router.query)
  const { chatid } = router.query
  const pathname = usePathname()

  const [hasDismissedProfileDialog, setHasDismissedProfileDialog] = useState(false)

  // Add a loading state
const [isCheckingProfile, setIsCheckingProfile] = useState(true);

const {
  register: registerPartner,
  handleSubmit: handlePartnerSubmit,
  formState: { errors: partnerErrors },
  reset: resetPartnerForm,
} = useForm<PartnerInputs>();

// Add the partner autocomplete
const {
  bindInput: bindPartnerInput,
  bindOptions: bindPartnerOptions,
  bindOption: bindPartnerOption,
  isBusy: isPartnerBusy,
  suggestions: partnerSuggestions,
  selectedIndex: partnerSelectedIndex,
  selectOption: selectPartnerOption,
} = Autocomplete({
  onChange: (value: PartnerAddress) => handlePartnerSelect(value),
  delay: 1000,
  source: async (search: any) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${process.env.GEOCODER_URL}/places/search?q=${search}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data.data?.map((item: any) => ({
        value: item._id,
        label: item.display_name,
        longitude: item.lon || item.address?.lon || 0,
        latitude: item.lat || item.address?.lat || 0,
      })) || [];
    } catch (e) {
      console.error("Location search error:", e);
      return [];
    }
  },
});

// Add partner select handler
const handlePartnerSelect = (selectedAddress: PartnerAddress) => {
  setPartnerAddress(selectedAddress);
  setFlagPartnerAddress(true);
};

// Add partner form submit handler
const onSubmitPartner: SubmitHandler<PartnerInputs> = async (formData) => {
  if (!partnerAddress) {
    toast.error("Please select a valid address.");
    return;
  }

  try {
    setLoading(true);
    
    // Format date/time
    const day = parseInt(formData.partner_day, 10);
    const month = parseInt(formData.partner_month, 10);
    const year = parseInt(formData.partner_year, 10);
    
    let hour = parseInt(formData.partner_hour, 10);
    if (formData.partner_period === "PM" && hour < 12) hour += 12;
    if (formData.partner_period === "AM" && hour === 12) hour = 0;

    const partnerData = {
      first_name: formData.partner_fname.trim(),
      last_name: formData.partner_lname.trim(),
      gender: formData.partner_gender,
      date_of_birth: `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`,
      time_of_birth: `${hour.toString().padStart(2, "0")}:${formData.partner_minute.padStart(2, "0")}:00`,
      place_of_birth: partnerAddress.label,
      longitude: partnerAddress.longitude,
      latitude: partnerAddress.latitude,
      timezone: 5.5
    };

    console.log(partnerData)

    // Save partner data to user profile
    const token = localStorage.getItem("accessToken");
    // const response = await axios.put(
    //   `${process.env.BACKEND_URL}/user/partner`,
    //   partnerData,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       'Content-Type': 'application/json'
    //     }
    //   }
    // );
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const updatedUser = {
      ...user,
      partner: partnerData
    };
    console.log(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  const errorMessage =
                    "Partner profile saved successfully!";
              
                  toast.custom((t) => (
                    <div
                      className={`${
                        t.visible ? "animate-enter" : "animate-leave"
                      } max-w-md w-full bg-green-600 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 `}
                    >
                      <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                          <div className="ml-3 flex-1">
                            <p className="mt-1 text-sm text-white">{errorMessage}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ));
    setPartnerFormVisible(false);
  } catch (error) {
    console.error("Error saving partner details:", error);
    toast.error("Failed to save partner details. Please try again.");
  } finally {
    setLoading(false);
  }
};

// Update the user data loading effect
useEffect(() => {
  const user = localStorage.getItem("user");
  if (user) {
    const json = JSON.parse(user);
    console.log("User data loaded:", json);
    
    // Set all values at once
    setUserGender(json.gender || null);
    setUserName(json.first_name || null);
    setUserProfilePic(json.profile_image || null);
    setUserPob(json.place_of_birth||null)
    setUserDob(json.date_of_birth||null)
  }
  setIsCheckingProfile(false); // Mark loading as complete
}, []);

// Fetch chat data when chatid changes
useEffect(() => {
  const fetchChatData = async () => {
    if (!chatid) return
    
    try {
      setLoading(true)
      const token = localStorage.getItem("accessToken")
      const response = await axios.get(
        `${process.env.BACKEND_URL}/chat/${chatid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      console.log("selected chat",JSON.stringify(response.data))
      setChatData(response.data.data)
    } catch (error) {
      console.error("Error fetching chat:", error)
      toast.error("Failed to load chat")
    } finally {
      setLoading(false)
    }
  }

  fetchChatData()
}, [chatid])
// Update the profile completion check
useEffect(() => {
  // Don't show anything while still loading
  if (isCheckingProfile) return;

  const isProfileComplete = userName && userGender && userDob && userPob;
  
  if (!hasDismissedProfileDialog && !isProfileComplete) {
    setShowProfileDialog(true);
  } else {
    setShowProfileDialog(false);
  }
}, [userName, userGender, userProfilePic, hasDismissedProfileDialog, isCheckingProfile, userPob, userDob]);

  const handleDismissDialog = () => {
    setShowProfileDialog(false)
    setHasDismissedProfileDialog(true)
  }

  const handleProfileSaved = (updatedUserData: { gender: string; first_name: string; profile_image: string }) => {
    setUserGender(updatedUserData.gender)
    setUserName(updatedUserData.first_name)
    setUserProfilePic(updatedUserData.profile_image)
    setVisibleSettings(false)
    setShowProfileDialog(false)
  }

  const avatarImagePath =
    userProfilePic ||
    (userGender === "male" ? "/images/Male.png" : "/images/Female.png")

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight

      chatContainerRef.current.scrollTo({
        top: scrollHeight,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    if (
      pathname === "/brahma-ai" ||
      pathname === "/career-ai" ||
      pathname === "/numerology-ai" ||
      pathname === "/relationship-ai" ||
      pathname === "/todays-horoscope"||
      pathname === "/matchmaking"
    ) {
      setShowDiv(false);
    }
  }, [pathname]);

  const handleQuestionClick = (question: string) => {
    setMessage(question)
  }

  // Remove these state declarations:
// const [responseContent, setResponseContent] = useState<string[]>([])
// const [messageArray, setMessageArray] = useState<string[]>([])

// Update the fetchData useEffect to modify chatData directly:
useEffect(() => {
  const fetchData = async () => {
    if (topic) {
      setLoading(true)
      setLastMessage(message)
      const payloadMessage = message
      setMessage("")
      try {
        const token = localStorage.getItem("accessToken")
        const response = await axios.post(
          `${process.env.BACKEND_URL}/chat/${topic["data"]["_id"]}`,
          {
            question: payloadMessage,
            ai_type: pathname == "/brahma-ai" ? "brahma" : 
                    pathname == "/career-ai" ? "career" :
                    pathname == "/numerology-ai" ? "numerology" :
                    pathname == "/relationship-ai" ? "relationship" : ""
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        )
        setShowDiv(false)
        
        // Update chatData directly instead of using responseContent
        setChatData(prev => {
          const newChats = [
            ...(prev?.chats || []),
            { 
              role: "user" as const, 
              text: payloadMessage, 
              createdAt: new Date().toISOString() 
            },
            { 
              role: "assistant" as const, 
              text: response.data.data.chats.slice(-1)[0].text, 
              createdAt: new Date().toISOString() 
            }
          ];
        
          // Handle case where prev is null (new chat)
          if (!prev) {
            return {
              _id: response.data.data._id || '', // Provide default empty string
              title: 'New Chat', // Provide default title
              chats: newChats,
              createdAt: new Date().toISOString() // Current time as default
            };
          }
        
          // Case where prev exists (existing chat)
          return {
            ...prev,
            chats: newChats
          };
        });
        
        setLoading(false)
        setResponseReceived(true)
        scrollToBottom()
      } catch (error: any) {
        // Error handling remains the same
      }
    }
  }

  fetchData()
}, [topic])

  // useEffect(() => {
  //   if (responseContent.length > 0) {
  //     setShowDiv(false)
  //     scrollToBottom()
  //   }
  // }, [message])

  useEffect(() => {
    scrollToBottom()
  }, [chatData])

  useEffect(() => {
    const handleScroll = () => {
      if (!cacheRef.current.startChecking) return
      const currentScrollPosition = chatContainerRef.current?.scrollTop as any
      const prvScroll = cacheRef.current?.prvScrollValue as any
      if (currentScrollPosition > prvScroll) {
      } else if (currentScrollPosition < prvScroll) {
        cacheRef.current.preventAutoScroll = true
      }
      cacheRef.current.prvScrollValue = currentScrollPosition
    }
    if (chatContainerRef.current) {
      chatContainerRef.current.addEventListener("scroll", handleScroll)
    }
    return () => {
      if (chatContainerRef.current)
        chatContainerRef.current.removeEventListener("scroll", handleScroll)
    }
  }, [showDiv])
    // Update the useEffect for partner form visibility
useEffect(() => {
  if (pathname !== "/relationship-ai") return;
  
  const user = localStorage.getItem("user");
  if (user) {
    const json = JSON.parse(user);
    setPartnerFormVisible(!json.partner);
  }
}, [pathname]);

// Update handleSendClick to include partner details
const handleSendClick = async () => {
  if (message.trim() === "" || loading || isTyping) return;

  setIsTyping(true);
  cacheRef.current.preventAutoScroll = false;
  cacheRef.current.startChecking = false;

  try {
    setLoading(true);
    setResponseReceived(false);
    const token = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const requestData: any = {
      question: message,
      ai_type: pathname === "/relationship-ai" ? "relationship" : 
               pathname === "/brahma-ai" ? "brahma" :
               pathname === "/career-ai" ? "career" :
               pathname === "/numerology-ai" ? "numerology" : ""
    };

    // Add partner details if needed
    if (pathname === "/relationship-ai" && user.partner) {
      requestData.partner_details = {
        gender: user.partner.gender,
        date_of_birth: user.partner.date_of_birth,
        time_of_birth: user.partner.time_of_birth,
        longitude: user.partner.longitude || 0,
        latitude: user.partner.latitude || 0,
        timezone: user.partner.timezone || 5.5
      };
    }

    const endpoint = topic 
      ? `${process.env.BACKEND_URL}/chat/${topic["data"]["_id"]}`
      : `${process.env.BACKEND_URL}/chat/new`;

    const response = await axios.post(
      endpoint,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    setShowDiv(false);
    
    // Update chatData with the new response
    if (response.data.data?.chats) {
      setChatData(prev => {
        if (!prev) {
          // If there's no previous chat data, create a new one
          return {
            _id: response.data.data._id,
            title: response.data.data.title || "New Chat",
            chats: response.data.data.chats,
            createdAt: response.data.data.createdAt || new Date().toISOString()
          };
        } else {
          // If there is previous chat data, update it
          return {
            ...prev,
            _id: response.data.data._id || prev._id,
            chats: response.data.data.chats,
            createdAt: response.data.data.createdAt || prev.createdAt
          };
        }
      });
    }

    if (!topic && response.data.data?._id) {
      setTopic({
        count: 0,
        data: { _id: response.data.data._id }
      });
    }

    scrollToBottom();
  } catch (error: any) {
    // Error handling remains the same
  } finally {
    setLoading(false);
    setIsTyping(false);
  }
};

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!loading) handleSendClick()
    }
  }

  const pricing = async () => {
    router.push(`/pricing`)
  }

  return (
    <>
      {userPlan === "free" ? (
        <>
          <HighTrafficMessage pricing={pricing} />
        </>
      ) : (
        <>
        {pathname === "/todays-horoscope" ? (
          // Render Today's Horoscope component in the middle of the page
          
            <TodayHoroscope />
          
        ) : (
        <>
          <Chat
  title={
    pathname === "/brahma-ai"
      ? "Brahma AI"
      : pathname === "/career-ai"
      ? "Career AI"
      : pathname === "/numerology-ai"
      ? "Numerology AI"
      : pathname === "/relationship-ai"
      ? "Relationship AI"
      : ""
  }
>
  <div
    className="py-5 overflow-y-auto scroll-smooth scrollbar-none"
    style={{ maxHeight: "70vh" }}
    ref={chatContainerRef}
  >
    {showDiv && !chatData && !loading ? (
      <div className="questions-list grid gap-4">
        <div className="mb-10 text-center">
          <div className="h3 leading-[4rem] 2xl:mb-2 2xl:h4">
            Welcome to Star Astro
          </div>
          <div className="body1 text-n-4 2xl:body1S">
            Chat with the smartest AI - Experience the power of AI with us
          </div>
        </div>
        <Menu
          className="w-full max-w-[30.75rem] sm:max-w-[40.75rem] md:max-w-[50rem] lg:max-w-[60rem] mx-auto"
          items={navigation}
        />
      </div>
    ) : loading && !chatData ? (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-1"></div>
      </div>
    ) : chatData?.chats?.length ? (
      <>
        {chatData.chats.map((chat, index) => (
          <div key={index} className="mt-10">
            {chat.role === "user" ? (
              <Question 
                content={chat.text} 
                time={new Date(chat.createdAt || Date.now()).toLocaleTimeString()} 
              />
            ) : (
              <Answer 
                time={new Date(chat.createdAt || Date.now()).toLocaleTimeString()}
              >
                {chat.text}
              </Answer>
            )}
          </div>
        ))}
        {loading && (
          <div className="mt-10">
            <Answer
              loading
              scrollToBottom={scrollToBottom}
              cacheRef={cacheRef}
              onTypingComplete={() => setIsTyping(false)}
            />
          </div>
        )}
      </>
    ) : (
      <div className="py-2 text-center text-n-4">
        {chatid ? "No messages in this chat yet" : "Select a chat to view messages"}
      </div>
    )}
  </div>
</Chat>
          <div className="flex items-center overflow-x-auto scrollbar-hide px-8 py-4 sm:px-2 md:px-2 lg:px-4 xl:px-12">
            <div className="flex flex-nowrap gap-4 px-4">
              {aiKundliQue.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleQuestionClick(item.question)}
                  className="px-4 py-1 bg-n-5 text-white font-medium rounded-full shadow-md hover:bg-n-7 transition-all cursor-pointer shrink-0"
                >
                  {item.question}
                </div>
              ))}
            </div>
          </div>
          <Message
            value={message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setMessage(e.target.value)
            }
            onSendClick={handleSendClick}
            isSending={loading}
            onKeyPress={handleKeyPress}
            // disabled={loading}
          />{" "}
        </>
        )}
      </>
    )}
    {/* Profile Completion Dialog */}
    {showProfileDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-red-500 p-6 shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="h4">Complete Your Profile</h3>
              <button 
                onClick={handleDismissDialog}
                className="text-white hover:text-n-6 dark:hover:text-n-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mb-6">
              <p className="body1 text-n-4 dark:text-n-3">
                To get the best experience, please complete your profile information.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDismissDialog}
                className="btn-large mx-5 font-semibold"
              >
                Later
              </button>
              <button
                onClick={() => {
                  setShowProfileDialog(false)
                  setVisibleSettings(true)
                }}
                className="btn-stroke-light"
              >
                Complete Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <Modal
        className="md:!p-0"
        classWrap="max-w-[48rem] md:min-h-screen-ios md:rounded-none"
        classButtonClose="hidden md:block md:absolute md:top-5 md:right-5 dark:fill-n-4"
        classOverlay="md:bg-n-1"
        visible={visibleSettings}
        onClose={() => setVisibleSettings(false)}
      >
        <Settings
          items={settings}
          additionalItem={additionalSettings}
          setVisibleSettings={setVisibleSettings}
          onProfileSaved={handleProfileSaved}
        />
      </Modal>

      {/* Add this modal near your other modals */}
<Modal
  className="md:!p-0"
  classWrap="max-w-[48rem] md:min-h-screen-ios md:rounded-none"
  classButtonClose="hidden md:block md:absolute md:top-5 md:right-5 dark:fill-n-4 px-10 py-5"
  classOverlay="md:bg-n-1"
  visible={partnerFormVisible}
  onClose={() => {}}
>
  <form onSubmit={handlePartnerSubmit(onSubmitPartner)} className="px-10 py-10">
    <div className="mb-8 h4 md:mb-6">Partner's Profile Details</div>
    
    {/* First Name */}
    <div className="mb-6">
      <div className="flex mb-2 base2 font-semibold">First Name</div>
      <input
        className={twMerge(
          "w-full h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
          partnerErrors.partner_fname && "border-red-500"
        )}
        type="text"
        placeholder="First Name"
        {...registerPartner("partner_fname", { 
          required: "Required",
          pattern: { value: /^[A-Za-z]+$/, message: "Letters only" }
        })}
      />
      {partnerErrors.partner_fname && (
        <small className="text-red-500">{partnerErrors.partner_fname.message}</small>
      )}
    </div>

    {/* Last Name */}
    <div className="mb-6">
      <div className="flex mb-2 base2 font-semibold">Last Name</div>
      <input
        className={twMerge(
          "w-full h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
          partnerErrors.partner_lname && "border-red-500"
        )}
        type="text"
        placeholder="Last Name"
        {...registerPartner("partner_lname", { 
          required: "Required",
          pattern: { value: /^[A-Za-z]+$/, message: "Letters only" }
        })}
      />
      {partnerErrors.partner_lname && (
        <small className="text-red-500">{partnerErrors.partner_lname.message}</small>
      )}
    </div>

    {/* Gender */}
    <div className="mb-6">
      <div className="flex mb-2 base2 font-semibold">Gender</div>
      <select
        className={twMerge(
          "w-full h-13 px-4 bg-n-1 dark:bg-n-5 border-2 border-n-3 dark:border-n-5 rounded-xl base2 text-n-7 dark:text-n-1 outline-none appearance-none",
          partnerErrors.partner_gender && "border-red-500"
        )}
        {...registerPartner("partner_gender", { required: "Required" })}
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      {partnerErrors.partner_gender && (
        <small className="text-red-500">{partnerErrors.partner_gender.message}</small>
      )}
    </div>

    {/* Date of Birth */}
    <div className="mb-6">
      <div className="flex mb-2 base2 font-semibold">Date of Birth</div>
      <div className="flex space-x-4">
        {/* Day */}
        <div className="flex-1">
          <input
            className={twMerge(
              "w-full h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
              partnerErrors.partner_day && "border-red-500"
            )}
            type="text"
            placeholder="DD"
            {...registerPartner("partner_day", { 
              required: "Required",
              pattern: { value: /^(0?[1-9]|[12][0-9]|3[01])$/, message: "Invalid" }
            })}
          />
          {partnerErrors.partner_day && (
            <small className="text-red-500">{partnerErrors.partner_day.message}</small>
          )}
        </div>
        
        {/* Month */}
        <div className="flex-1">
          <input
            className={twMerge(
              "w-full h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
              partnerErrors.partner_month && "border-red-500"
            )}
            type="text"
            placeholder="MM"
            {...registerPartner("partner_month", { 
              required: "Required",
              pattern: { value: /^(0?[1-9]|1[0-2])$/, message: "Invalid" }
            })}
          />
          {partnerErrors.partner_month && (
            <small className="text-red-500">{partnerErrors.partner_month.message}</small>
          )}
        </div>
        
        {/* Year */}
        <div className="flex-1">
          <input
            className={twMerge(
              "w-full h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
              partnerErrors.partner_year && "border-red-500"
            )}
            type="text"
            placeholder="YYYY"
            {...registerPartner("partner_year", { 
              required: "Required",
              pattern: { value: /^(19|20)\d{2}$/, message: "Invalid" }
            })}
          />
          {partnerErrors.partner_year && (
            <small className="text-red-500">{partnerErrors.partner_year.message}</small>
          )}
        </div>
      </div>
    </div>

    {/* Time of Birth */}
    <div className="mb-6">
      <div className="flex mb-2 base2 font-semibold">Time of Birth</div>
      <div className="flex space-x-4">
        {/* Hour */}
        <div className="flex-1">
          <input
            className={twMerge(
              "w-full h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
              partnerErrors.partner_hour && "border-red-500"
            )}
            type="text"
            placeholder="HH"
            {...registerPartner("partner_hour", { 
              required: "Required",
              pattern: { value: /^(0?[1-9]|1[0-2])$/, message: "Invalid" }
            })}
          />
          {partnerErrors.partner_hour && (
            <small className="text-red-500">{partnerErrors.partner_hour.message}</small>
          )}
        </div>
        
        {/* Minute */}
        <div className="flex-1">
          <input
            className={twMerge(
              "w-full h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
              partnerErrors.partner_minute && "border-red-500"
            )}
            type="text"
            placeholder="MM"
            {...registerPartner("partner_minute", { 
              required: "Required",
              pattern: { value: /^[0-5][0-9]$/, message: "Invalid" }
            })}
          />
          {partnerErrors.partner_minute && (
            <small className="text-red-500">{partnerErrors.partner_minute.message}</small>
          )}
        </div>
        
        {/* AM/PM */}
        <div className="flex-1">
        <select
        className={twMerge(
          "w-full h-13 px-4 bg-n-1 dark:bg-n-5 border-2 border-n-3 dark:border-n-5 rounded-xl base2 text-n-7 dark:text-n-1 outline-none appearance-none",
          partnerErrors.partner_period && "border-red-500"
            )}
            {...registerPartner("partner_period", { required: "Required" })}
          >
            <option value="">--</option>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
          {partnerErrors.partner_period && (
            <small className="text-red-500">{partnerErrors.partner_period.message}</small>
          )}
        </div>
      </div>
    </div>

    {/* Birth Location */}
    <div className="mb-6">
      <div className="flex mb-2 base2 font-semibold">Birth Location</div>
      <div className="relative">
        <div className="flex items-center w-full">
          <input
            placeholder="Search for birth location"
            className={twMerge(
              "w-full h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
              !flagPartnerAddress && "border-red-500"
            )}
            {...bindPartnerInput}
          />
          {isPartnerBusy && (
            <div className="w-4 h-4 border-2 border-dashed rounded-full border-slate-500 animate-spin ml-2"></div>
          )}
        </div>
        {partnerSuggestions.length > 0 && (
          <ul
            {...bindPartnerOptions}
            className="absolute w-full z-10 mt-1 overflow-y-auto max-h-60 divide-gray-100 rounded-md dark:bg-n-5 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            {partnerSuggestions.map((suggestion, index) => (
              <li
                className={twMerge(
                  "px-4 py-2 text-sm text-gray-700 dark:text-gray-300 dark:hover:bg-n-4 hover:bg-gray-100 cursor-pointer",
                  partnerSelectedIndex === index && "bg-slate-300 dark:bg-n-4"
                )}
                key={index}
                {...bindPartnerOption}
              >
                {suggestion.label}
              </li>
            ))}
          </ul>
        )}
        {!flagPartnerAddress && (
          <small className="text-red-500">Please select a valid address</small>
        )}
      </div>
    </div>

    <div className="flex space-x-4">
      <button
        type="submit"
        className="btn-blue flex-1"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Partner Details"}
      </button>
      {/* <button
        type="button"
        className="btn-red flex-1"
        onClick={() => setPartnerFormVisible(false)}
        disabled={loading}
      >
        Cancel
      </button> */}
    </div>
  </form>
</Modal>
    </>
  )
}

export default AiKundli
