import React, { useState, useEffect, useRef } from "react";
import Message from "@/components/Message";
import { matchmakingQue } from "@/constants/matchmakingQue";
import { twMerge } from "tailwind-merge";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import Modal from "@/components/Modal";
import Question from "@/components/Question";
import Answer from "@/components/Answer";
import Chat from "@/components/Chat";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import Autocomplete from "@/components/AutoComplete";
import HighTrafficMessage from "@/components/HighTrafficMessage";

// Type definitions
type Inputs = {
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
};

interface Address {
  label: string;
  longitude: number;
  latitude: number;
  value?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatResponse {
  status?: string;
  message?: string;
  chats?: ChatMessage[];
  data?: any;
  error?: {
    message: string;
  };
}

type MainProps = {};

const styleButton: string =
  "h-12 ml-3 px-4 bg-n-3 rounded-md caption1 txt-n-3 transition-colors hover:text-primary-1 dark:bg-n-7";

const questionButton: string = "font-medium text-lg md:text-xl break-words ";

const Matchmaking = ({}: MainProps) => {
  const router = useRouter();

  // Form and chat state
  const [partnerData, setPartnerData] = useState({
    partner_fname: "",
    partner_lname: "",
    partner_gender: "",
    partner_day: "",
    partner_hour: "",
    partner_year: "",
    partner_month: "",
    partner_minute: "",
    partner_period: "",
    partner_location: "",
  });

  // Chat state
  const [message, setMessage] = useState<string>("");
  const [lastMessage, setLastMessage] = useState<string>("");
  const [responseContent, setResponseContent] = useState<string[]>([]);
  const [messageArray, setMessageArray] = useState<string[]>([]);
  const [showDiv, setShowDiv] = useState(true);
  const [loading, setLoading] = useState(false);
  const [responseReceived, setResponseReceived] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const cacheRef = useRef({
    prvScrollValue: null,
    preventAutoScroll: false,
    startChecking: false,
  });

  // User data
  const [userGender, setUserGender] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userProfilePic, setUserProfilePic] = useState<string | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [flagAddress, setFlagAddress] = useState(false);

  // Form state
  const [visibleSettings, setVisibleSettings] = useState(true);
  const genderOptions = ["male", "female"];
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPricingContent, setShowPricingContent] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();

  // Location autocomplete
  const {
    bindInput,
    bindOptions,
    bindOption,
    isBusy,
    suggestions,
    selectedIndex,
    selectOption,
  } = Autocomplete({
    onChange: (value: Address) => handleSelect(value),
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
        
        if (response.data.data && Array.isArray(response.data.data)) {
          return response.data.data.map((item: any) => ({
            value: item._id,
            label: item.display_name,
            longitude: item.lon || item.address?.lon || 0,
            latitude: item.lat || item.address?.lat || 0,
          }));
        }
        
        return [];
      } catch (e) {
        console.error("Location search error:", e);
        return [];
      }
    },
  });

  // Helper functions
  const handleSelect = (selectedAddress: Address) => {
    setAddress(selectedAddress);
    setFlagAddress(true);
  };

  const onCancelClick = () => {
    router.push("/brahma-ai");
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight;
      chatContainerRef.current.scrollTo({
        top: scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const pricing = async () => {
    router.push(`/pricing`);
  };

  // Effects
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const json = JSON.parse(user);
      if (json.gender) {
        setUserGender(json.gender);
        setUserName(`${json.first_name} ${json.last_name}`);
      }
      if (json.profile_image) {
        setUserProfilePic(json.profile_image);
      }
      if (json.partner && json.partner.first_name) {
        setVisibleSettings(false);
        const errorMessage =
                  "Partner profile saved and chat created successfully!";
            
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
        createMatchmakingChat(json.partner);
      }
    }
  }, []);

  useEffect(() => {
    if (responseContent.length > 0) {
      setShowDiv(false);
      scrollToBottom();
    }
  }, [responseContent]);

  useEffect(() => {
    const handleScroll = () => {
      if (!cacheRef.current.startChecking) return;
      const currentScrollPosition = chatContainerRef.current?.scrollTop as any;
      const prevScroll = cacheRef.current?.prvScrollValue as any;
      if (currentScrollPosition < prevScroll) {
        cacheRef.current.preventAutoScroll = true;
      }
      cacheRef.current.prvScrollValue = currentScrollPosition;
    };
    
    if (chatContainerRef.current) {
      chatContainerRef.current.addEventListener("scroll", handleScroll);
    }
    
    return () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [showDiv]);

  // Main functions
  const createMatchmakingChat = async (partnerData: any) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("You are not authenticated. Please log in.");
      return;
    }
  
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      // Validate required fields
      if (!user.date_of_birth || !user.time_of_birth || !user.gender || 
          !user.latitude || !user.longitude || !user.preferred_astrology) {
        throw new Error("Please complete your user profile first");
      }

      const userTimezone = user.timezone !== undefined 
        ? typeof user.timezone === 'number' ? user.timezone.toString() : user.timezone
        : "5.5";
  
      // Validate partner data
      if (!partnerData.first_name || !partnerData.last_name || !partnerData.gender || 
          !partnerData.date_of_birth || !partnerData.time_of_birth || !partnerData.place_of_birth) {
        throw new Error("Missing required partner information");
      }
  
      const payload = {
        question: "Can you analyze our compatibility?",
        ai_type: "relationship",
        partner_details: {
          gender: partnerData.gender,
          date_of_birth: partnerData.date_of_birth,
          time_of_birth: partnerData.time_of_birth,
          longitude: partnerData.longitude || 0,
          latitude: partnerData.latitude || 0,
          timezone: partnerData.timezone || userTimezone,
        }
      };
  
      const chatResponse = await axios.post(
        `${process.env.BACKEND_URL}/chat/new`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );
  
      if (chatResponse.data.status === "success") {
        setChatId(chatResponse.data.data._id);
        return chatResponse.data.data;
      } else {
        throw new Error(chatResponse.data.message || "Failed to create chat");
      }
    } catch (error: any) {
      console.error("Chat creation error:", error);
      
      let errorMessage = "Failed to create matchmaking chat";
      if (error.response) {
        if (error.response.status === 400) {
          if (error.response.data?.errors) {
            errorMessage = Object.entries(error.response.data.errors)
              .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
              .join('\n');
          } else if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error.response.status === 401) {
          errorMessage = "Authentication failed. Please log in again.";
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
  
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    if (!address) {
      toast.error("Please select a valid address.");
      return;
    }
  
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("You are not authenticated. Please log in.");
      return;
    }
  
    try {
      setLoading(true);
  
      // Validate and format date/time
      const day = parseInt(formData.partner_day, 10);
      const month = parseInt(formData.partner_month, 10);
      const year = parseInt(formData.partner_year, 10);
  
      let hour = parseInt(formData.partner_hour, 10);
      if (formData.partner_period === "PM" && hour < 12) {
        hour += 12;
      } else if (formData.partner_period === "AM" && hour === 12) {
        hour = 0;
      }
  
      const partnerData = {
        first_name: formData.partner_fname.trim(),
        last_name: formData.partner_lname.trim(),
        gender: formData.partner_gender,
        date_of_birth: `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`,
        time_of_birth: `${hour.toString().padStart(2, "0")}:${formData.partner_minute.padStart(2, "0")}:00`,
        place_of_birth: address.label,
        longitude: address.longitude,
        latitude: address.latitude
      };
  
      // Update user with partner data
      const response = await axios.put(
        `${process.env.BACKEND_URL}/user/partner`,
        partnerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

  
      if (response.data.status === "success") {
        // Create matchmaking chat
        const chatResponse = await axios.post(
          `${process.env.BACKEND_URL}/chat/new`,
          {
            question: "Can you analyze our compatibility?",
            ai_type: "relationship",
            partner_details: {
              gender: formData.partner_gender,
              date_of_birth: `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`,
              time_of_birth: `${hour.toString().padStart(2, "0")}:${formData.partner_minute.padStart(2, "0")}:00`,
              longitude: address.longitude,
              latitude: address.latitude,
              timezone: 5.5
            }
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log("Chat response:", chatResponse.data);
  
        if (chatResponse.data.status === "success") {
          setIsSuccess(true);
          setVisibleSettings(false);
          setChatId(chatResponse.data.data._id);
          localStorage.setItem("user", JSON.stringify(response.data.data));
          const errorMessage =
                  "Partner profile saved and chat created successfully!";
            
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
        }
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Error:", error);
      let errorMessage = "An error occurred";
      
      if (error.response) {
        errorMessage = error.response.data?.message || 
                      error.response.statusText || 
                      "Server error occurred";
        
        if (error.response.status === 400 && error.response.data?.errors) {
          errorMessage += ": " + Object.values(error.response.data.errors).join(", ");
        }
      } else if (error.request) {
        errorMessage = "No response from server";
      } else {
        errorMessage = error.message || "Request setup error";
      }
  
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    setMessage(question);
    setResponseReceived(false);
    setLoading(false);
    setMessageArray((prev) => [...prev, question]);
  };

  const handleSendClick = async () => {
    if (message.trim() === "" || loading || !chatId) {
      return;
    }
  
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const partnerData = user.partner; // Get partner data from user object
  
      if (!partnerData) {
        toast.error("Partner data not found. Please complete partner profile first.");
        return;
      }
  
      // Convert timezone to number if needed
      const timezone = typeof partnerData.timezone === 'string' 
        ? parseFloat(partnerData.timezone) 
        : partnerData.timezone || 5.5;
  
      console.log("Sending partner details:", {
        gender: partnerData.gender,
        date_of_birth: partnerData.date_of_birth,
        time_of_birth: partnerData.time_of_birth,
        longitude: partnerData.longitude || 0,
        latitude: partnerData.latitude || 0,
        timezone: timezone
      });
  
      const payloadMessage = message;
      // 
      setLastMessage(message);
      setMessage("");

      console.log({
        question: payloadMessage,
        ai_type: "relationship",
        partner_details: {
          gender: partnerData.gender,
          date_of_birth: partnerData.date_of_birth,
          time_of_birth: partnerData.time_of_birth,
          longitude: partnerData.longitude || 28,
          latitude: partnerData.latitude || 77,
          timezone: timezone
        }
      });
      
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${process.env.BACKEND_URL}/chat/${chatId}`,
        {
          question: payloadMessage,
          ai_type: "relationship",
          partner_details: {
            gender: partnerData.gender,
            date_of_birth: partnerData.date_of_birth,
            time_of_birth: partnerData.time_of_birth,
            longitude: partnerData.longitude || 28,
            latitude: partnerData.latitude || 77,
            timezone: timezone
          }
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      console.log("Full API response:", response.data);
      
      // Handle response
      let responseText = "";
      if (response.data?.data?.chats?.length > 0) {
        const assistantMessages = response.data.data.chats.filter(
          (chat: any) => chat.role === 'assistant'
        );
        responseText = assistantMessages[assistantMessages.length - 1]?.text || 
                      "No response from assistant";
      } else {
        responseText = response.data?.message || 
                      "Unexpected response format from server";
      }
  
      setShowDiv(false);
      setResponseContent((prev) => [...prev, responseText]);
      setMessageArray((prev) => [...prev, payloadMessage]);
      scrollToBottom();
    } catch (error: any) {
      console.error("Chat error:", error);
      
      let errorMessage = "Oops! Something went wrong. Please try again.";
      if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
  
      if (error.response?.status === 422) {
        setShowPricingContent(true);
      }
  
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) handleSendClick();
    }
  };

  const avatarImagePath =
    userProfilePic ||
    (userGender === "male" ? "/images/Male.png" : "/images/Female.png");

  return (
    <>
      {showPricingContent === false ? (
        <>
          <Modal
            className="md:!p-0"
            classWrap="max-w-[48rem] md:min-h-screen-ios md:rounded-none"
            classButtonClose="hidden md:block md:absolute md:top-5 md:right-5 dark:fill-n-4 px-10 py-5"
            classOverlay="md:bg-n-1"
            visible={visibleSettings}
            onClose={() => {}}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="px-10 py-10">
              <div className="mb-8 h4 md:mb-6">Partner's profile</div>
              
              <div className="mb-6">
                <div className="flex mb-2 base2 font-semibold">
                  Partner's First Name
                </div>
                <div className="relative">
                  <input
                    className={twMerge(
                      "w-full h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
                      errors.partner_fname && "border-red-500"
                    )}
                    type="text"
                    id="partner_fname"
                    placeholder="Partner's First Name"
                    {...register("partner_fname", {
                      required: "This field is required",
                      pattern: {
                        value: /^[A-Za-z]+$/,
                        message: "Only alphabetic characters are allowed"
                      }
                    })}
                  />
                  {errors.partner_fname && (
                    <small className="text-red-500">{errors.partner_fname.message}</small>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex mb-2 base2 font-semibold">
                  Partner's Last Name
                </div>
                <div className="relative">
                  <input
                    className={twMerge(
                      "w-full h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
                      errors.partner_lname && "border-red-500"
                    )}
                    type="text"
                    id="partner_lname"
                    placeholder="Partner's Last Name"
                    {...register("partner_lname", {
                      required: "This field is required",
                      pattern: {
                        value: /^[A-Za-z]+$/,
                        message: "Only alphabetic characters are allowed"
                      }
                    })}
                  />
                  {errors.partner_lname && (
                    <small className="text-red-500">{errors.partner_lname.message}</small>
                  )}
                </div>
              </div>

              <div className="mb-6">
        <div className="flex mb-2 base2 font-semibold">Gender</div>
        <div className="relative">
          <select
            className={twMerge(
              "h-13 px-3.5 bg-gray-50 text-n-7 text-sm rounded-lg block w-full p-2.5 dark:bg-n-6 dark:placeholder-gray-400 dark:text-white",
              errors.partner_gender && "border-red-500"
            )}
            {...register("partner_gender", { required: "This field is required" })}
          >
            <option value="">Select Gender</option>
            {genderOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
          {errors.partner_gender && (
            <small className="text-red-500">{errors.partner_gender.message}</small>
          )}
        </div>
      </div>

              <div className="mb-6">
                <div className="flex mb-2 base2 font-semibold">
                  Date of Birth
                </div>
                <div className="flex space-x-4">
                  <div className="relative">
                    <input
                      className={twMerge(
                        "w-20 h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
                        errors.partner_day && "border-red-500"
                      )}
                      type="text"
                      placeholder="DD"
                      {...register("partner_day", {
                        required: "This field is required",
                        pattern: {
                          value: /^(0?[1-9]|[12][0-9]|3[01])$/,
                          message: "Invalid day"
                        },
                        validate: (value) => {
                          const day = parseInt(value, 10)
                          return day <= 31 || "Day cannot be greater than 31"
                        }
                      })}
                    />
                    {errors.partner_day && (
                      <small className="text-red-500">{errors.partner_day.message}</small>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      className={twMerge(
                        "w-24 h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
                        errors.partner_month && "border-red-500"
                      )}
                      type="text"
                      placeholder="MM"
                      {...register("partner_month", {
                        required: "This field is required",
                        pattern: {
                          value: /^(0?[1-9]|1[0-2])$/,
                          message: "Invalid month"
                        },
                        validate: (value) => {
                          const month = parseInt(value, 10)
                          return month <= 12 || "Month cannot be greater than 12"
                        }
                      })}
                    />
                    {errors.partner_month && (
                      <small className="text-red-500">{errors.partner_month.message}</small>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      className={twMerge(
                        "w-28 h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
                        errors.partner_year && "border-red-500"
                      )}
                      type="text"
                      placeholder="YYYY"
                      {...register("partner_year", {
                        required: "This field is required",
                        pattern: {
                          value: /^(19|20)\d{2}$/,
                          message: "Invalid year"
                        }
                      })}
                    />
                    {errors.partner_year && (
                      <small className="text-red-500">{errors.partner_year.message}</small>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex mb-2 base2 font-semibold">Time</div>
                <div className="flex space-x-4">
                  <div className="relative">
                    <input
                      className={twMerge(
                        "w-16 h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
                        errors.partner_hour && "border-red-500"
                      )}
                      type="text"
                      placeholder="HH"
                      {...register("partner_hour", {
                        required: "This field is required",
                        pattern: {
                          value: /^(0?[1-9]|1[0-2])$/,
                          message: "Invalid hour"
                        }
                      })}
                    />
                    {errors.partner_hour && (
                      <small className="text-red-500">{errors.partner_hour.message}</small>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      className={twMerge(
                        "w-16 h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
                        errors.partner_minute && "border-red-500"
                      )}
                      type="text"
                      placeholder="MM"
                      {...register("partner_minute", {
                        required: "This field is required",
                        pattern: {
                          value: /^(0[0-9]|[1-9]|[1-5][0-9])$/,
                          message: "Invalid minute"
                        }
                      })}
                    />
                    {errors.partner_minute && (
                      <small className="text-red-500">{errors.partner_minute.message}</small>
                    )}
                  </div>
                  <div className="relative">
                    <select
                      className={twMerge(
                        "h-13 px-3.5 bg-gray-50 text-n-7 text-sm rounded-lg block w-full p-2.5 dark:bg-n-6 dark:placeholder-gray-400 dark:text-white",
                        errors.partner_period && "border-red-500"
                      )}
                      {...register("partner_period", { 
                        required: "This field is required"
                      })}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                    {errors.partner_period && (
                      <small className="text-red-500">{errors.partner_period.message}</small>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
  <div className="flex mb-2 base2 font-semibold">Location</div>
  <div className="relative">
    <div className="flex items-center w-full">
      <input
        placeholder="Search for birth location"
        className={twMerge(
          "w-full h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
          !flagAddress && "border-red-500"
        )}
        {...bindInput}
        value={String(bindInput.value || "")}
      />
      {isBusy && (
        <div className="w-4 h-4 border-2 border-dashed rounded-full border-slate-500 animate-spin ml-2"></div>
      )}
    </div>
    {suggestions.length > 0 && (
      <ul
        {...bindOptions}
        className="absolute w-full z-10 mt-1 overflow-y-auto max-h-60 divide-gray-100 rounded-md dark:bg-n-5 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        ref={null} // Remove or replace with a compatible ref if needed
      >
        {suggestions.map((suggestion, index) => (
          <li
            className={twMerge(
              "px-4 py-2 text-sm text-gray-700 dark:text-gray-300 dark:hover:bg-n-4 hover:bg-gray-100 cursor-pointer",
              selectedIndex === index && "bg-slate-300 dark:bg-n-4"
            )}
            key={index}
            onClick={(e: React.MouseEvent<HTMLLIElement>) => {
              const target = e.target as HTMLElement;
              const closestLi = target.closest("li");
              if (closestLi) {
                selectOption(index);
              }
            }}
          >
            {suggestion.label}
          </li>
        ))}
      </ul>
    )}
    {!flagAddress && (
      <small className="text-red-500">Please select a valid address</small>
    )}
  </div>
</div>

<button
                type="submit"
                className="btn-blue w-full"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                className="btn-red w-full mt-2"
                onClick={onCancelClick}
                disabled={loading}
              >
                Cancel
              </button>
            </form>
          </Modal>
          
          <Chat title="💘 Perfect Matchmaking">
            <div
              className="py-5 overflow-y-auto scroll-smooth scrollbar-none"
              style={{ maxHeight: "70vh" }}
            >
              {showDiv && !loading ? (
                <div className="questions-list grid gap-4">
                  {matchmakingQue.map((question) => (
                    <button
                      key={question.id}
                      onClick={() => handleQuestionClick(question.question)}
                      className={`${styleButton} ${questionButton} w-auto min-w-[8em] px-4 py-2 h-auto text-base`}
                    >
                      {question.question}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {!showDiv && (
              <div
                className="overflow-y-auto h-[100%] scroll-smooth scrollbar-none"
                style={{ maxHeight: "70vh" }}
                ref={chatContainerRef}
              >
                {responseContent.map((response, index) => (
                  <div className="mt-10" key={index}>
                    <Question
                      content={messageArray[index]}
                      time="Just now"
                    />
                    <Answer
                      time="Just now"
                      scrollToBottom={scrollToBottom}
                      cacheRef={cacheRef}
                    >
                      {response}
                    </Answer>
                  </div>
                ))}

                {loading && (
                  <div className="mt-10">
                    {lastMessage && (
                      <Question content={lastMessage} time="Just now" />
                    )}
                    <Answer
                      loading
                      scrollToBottom={scrollToBottom}
                      cacheRef={cacheRef}
                    />
                  </div>
                )}
              </div>
            )}

            {showDiv && loading && (
              <div className="mt-10">
                {lastMessage && (
                  <Question content={lastMessage} time="Just now" />
                )}
                <Answer
                  loading
                  scrollToBottom={scrollToBottom}
                  cacheRef={cacheRef}
                />
              </div>
            )}
          </Chat>

          <Message
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onSendClick={handleSendClick}
            isSending={loading}
            onKeyPress={handleKeyPress}
          />
        </>
      ) : (
        <HighTrafficMessage pricing={pricing} />
      )}
    </>
  );
};

export default Matchmaking;