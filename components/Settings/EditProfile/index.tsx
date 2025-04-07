// import {
//   useState,
//   useEffect,
//   useRef,
//   SetStateAction,
//   JSXElementConstructor,
//   PromiseLikeOfReactNode,
//   ReactElement,
//   ReactNode,
//   ReactPortal,
// } from "react"

// import { twMerge } from "tailwind-merge"
// import Image from "@/components/Image"
// import Icon from "@/components/Icon"
// import { useForm, SubmitHandler } from "react-hook-form"
// import { toast } from "react-hot-toast"
// import axios from "axios"
// import { useRouter } from "next/router"
// import ToggleAstroMode from "@/components/ToggleAstroMode"
// import Autocomplete from "@/components/AutoComplete"
// // import GeoTZ from "browser-geo-tz"
// interface Address {
//   label: string;
//   longitude: number;
//   latitude: number;
//   value?: string; // Optional, if your address object includes a `value` property
// }

// type Inputs = {
//   fname: string
//   lname: string
//   gender: string
//   day: string
//   month: string
//   year: string
//   hour: string
//   minute: string
//   location: string
//   period: string
// }

// type EditProfileProps = {
//   setVisibleSettings: any
// }
// type ValuePiece = Date | null

// type Value = ValuePiece | [ValuePiece, ValuePiece]

// const EditProfile = ({ setVisibleSettings }: EditProfileProps) => {
//   const userStr = localStorage.getItem("user")
//   const router = useRouter()

//   // const temp = async () => {
//   //   console.log(await GeoTZ.find(37.3861, -122.0839))
//   // }

//   // useEffect(() => {
//   //   temp()
//   // }, [])

//   const onCancelClick = () => {
//     console.log(userStr?.toString())
//     json = JSON.parse(userStr!)
//     setVisibleSettings(false)
//   }

//   const { bindInput, bindOptions, bindOption, isBusy, suggestions, selectedIndex, selectOption } = Autocomplete({
//     onChange: (value: string) => handleSelect(value),
//     delay: 1000,
//     source: async (search: string) => {
//       try {
//         const accessToken = localStorage.getItem("accessToken");
//         const response = await axios.get(`${process.env.GEOCODER_URL}/places/search?q=${search}`, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });
  
//         return response.data.data.map((item: any) => ({
//           label: item.display_name,
//           longitude: item.lon,
//           latitude: item.lat,
//           value: item._id,
//         }));
//       } catch (e) {
//         return [];
//       }
//     },
//   });

//   let json
//   if (userStr) {
//     json = JSON.parse(userStr)
//     json.period = json.hour < 12 ? "AM" : "PM"
//     json.hour = json.hour > 12 ? json.hour - 12 : json.hour
//     const name = json?.first_name?.split(" ")
//     json.fname = name?.[0]
//     json.lname = name?.[1]
//   }
//   const [objectURL, setObjectURL] = useState<any>("/images/Male.png")
//   const [user, setUser] = useState(json || {})
//   const [name, setName] = useState<string>(json?.first_name || "")

//   const [day, setDay] = useState<string>("")
//   const [month, setMonth] = useState<string>("")
//   const [year, setYear] = useState<string>("")

//   const [hour, setHour] = useState<string>("")
//   const [minute, setMinute] = useState<string>("")

//   const [search, setSearch] = useState<String>("")
//   const [location, setLocation] = useState<string>("")

//   const [gender, setGender] = useState<string>("")
//   const genderOptions = ["male", "female"]
//   const [astroMode, setAstroMode] = useState<string | null>(null) // Initial mode is null

//   const [value, onChange] = useState<Value>(new Date())
//   const [loading, setLoading] = useState(false)
//   const [errorMsg, setErrorMsg] = useState("")

//   const [isOpen, setIsOpen] = useState(true)
//   const [isSuccess, setIsSuccess] = useState(false)
//   const REDIRECT_URL = process.env.REDIRECT_URL ?? " "
//   // const [RedirectURL, setRedirectURL] = useState<string | null>(REDIRECT_URL)
//   const [userGender, setUserGender] = useState<string | null>(null)
//   const [userName, setUserName] = useState<string | null>(null)
//   const [userProfilePic, setUserProfilePic] = useState<string | null>(null)
//   const [address, setAddress] = useState<Address | null>(null);
//   const [flagAddress, setFlagAddress] = useState(false)

//   const handleSelect = (selectedAddress: Address) => {
//     setAddress(selectedAddress);
//     setFlagAddress(true);
//   };

//   // Check if a new user has logged in and initialize their data
//   useEffect(() => {
//     const user = localStorage.getItem("user")
//     if (user) {
//       const json = JSON.parse(user)
//       if (json.location && json.placeId) {
//         setAddress({ label: json.location, value: json.placeId })
//         setFlagAddress(true)
//         if (suggestions.length === 0) {
//           suggestions.push({ label: json.location, value: json.placeId })
//           selectOption(0)
//         }
//       }
//       if (json.gender) {
//         setUserGender(json.gender)
//         setUserName(json.first_name)
//         setUserProfilePic(json.profile_image)
//       }
//       setAstroMode(json?.type || "western")
//     }
//   }, [])

//   const avatarImagePath =
//     userProfilePic ||
//     (userGender === "male" ? "/images/Male.png" : "/images/Female.png")

//   // useEffect(() => {
//   //   if (isSuccess && REDIRECT_URL) {
//   //     const timer = setTimeout(() => {
//   //       setIsOpen(false)
//   //       router.push(REDIRECT_URL)
//   //     }, 3000)

//   //     toast.custom((t) => (
//   //       <div
//   //         className={`${
//   //           t.visible ? "animate-enter" : "animate-leave"
//   //         } max-w-md w-full bg-green-600 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 `}
//   //       >
//   //         <div className="flex-1 w-0 p-4">
//   //           <div className="flex items-start">
//   //             <div className="ml-3 flex-1">
//   //               <p className="mt-1 text-sm text-white">
//   //                 Astro-data for {userName} securely encoded into our celestial
//   //                 vault! 🌌✨"
//   //               </p>
//   //             </div>
//   //           </div>
//   //         </div>
//   //       </div>
//   //     ))

//   //     return () => clearTimeout(timer)
//   //   }
//   // }, [isSuccess, REDIRECT_URL, setIsOpen, router, userName])

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<Inputs>()

//   const handleUpload = (e: any) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0]
//       setObjectURL(URL.createObjectURL(file))
//     }
//   }

//   const onSubmit: SubmitHandler<Inputs> = async (formData) => {
//     if (!address) {
//       toast.error("Please select a valid address.");
//       return;
//     }
  
//     const token = localStorage.getItem("accessToken");
//     console.log("Token:", token); // Debug: Log the token
  
//     if (!token) {
//       toast.error("You are not authenticated. Please log in.");
//       return;
//     }
  
//     let hour = parseInt(formData.hour, 10);
//     if (formData.period === "AM" && hour === 12) {
//       hour = 0;
//     } else if (formData.period === "PM" && hour < 12) {
//       hour = hour + 12;
//     }
  
//     if (!loading && flagAddress) {
//       setLoading(true);
  
//       const data = {
//         first_name: formData.fname || "",
//         last_name: formData.lname || "",
//         gender: formData.gender,
//         timezone: (new Date().getTimezoneOffset() * -1) / 60,
//         date_of_birth: `${formData.year}-${formData.month.padStart(2, "0")}-${formData.day.padStart(2, "0")}`,
//         time_of_birth: `${hour.toString().padStart(2, "0")}:${formData.minute.padStart(2, "0")}:00`,
//         place_of_birth: address?.label || "Kanpur, Kanpur Nagar, Uttar Pradesh, 208012, India",
//         longitude: address?.longitude || 80.3319, // Fake longitude for Kanpur
//         latitude: address?.latitude || 26.4499, // Fake latitude for Kanpur
//         preferred_astrology: astroMode || "vedic", // Default to "vedic" if not set
//       };
//       console.log("User Data:");
//       console.log("Data:", data); // Debug: Log the data
  
//       try {
//         const response = await axios.put(`${process.env.BACKEND_URL}/user`, data, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
  
//         localStorage.setItem("user", JSON.stringify({ ...user, ...data }));
//         toast.success("User data updated successfully!");
//         setIsOpen(false);
//         router.push(REDIRECT_URL.toString());
//       } catch (error) {
//         console.error("Error updating user data:", error); // Debug: Log the error
//         toast.error("Failed to update user data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="mb-8 mt-8 h5 md:mb-6">Edit profile</div>

//         <div className="flex items-center mb-6">
//           <div className="relative flex justify-center items-center shrink-0 w-28 h-28 mr-4 rounded-full overflow-hidden bg-n-2 dark:bg-n-6">
//             {objectURL !== null ? (
//               <Image
//                 className="object-cover rounded-full"
//                 src={userProfilePic ?? ""}
//                 fill
//                 alt="Avatar"
//               />
//             ) : (
//               <Icon className="w-8 h-8 dark:fill-n-1" name="profile" />
//             )}
//           </div>
//         </div>
//         <div className="mb-6">
//           <div className="flex mb-2 base2 font-semibold">Astrology</div>
//           <ToggleAstroMode astroMode={astroMode} setAstroMode={setAstroMode} />
//         </div>

//         <div className="mb-6">
//           <div className="flex mb-2 base2 font-semibold">First Name</div>
//           <div className="relative">
//             <input
//               defaultValue={user.first_name}
//               className={twMerge(
//                 "w-full h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
//               )}
//               type="text"
//               id="fname"
//               placeholder="First Name"
//               {...register("fname", {
//                 required: true,
//                 pattern: /^[A-Za-z]+$/, // Regular expression for alphabetic characters only
//               })}
//             />
//             {errors.fname?.type === "required" && (
//               <small className="text-red-500">This field is required</small>
//             )}
//             {errors.fname?.type === "pattern" && (
//               <small className="text-red-500">
//                 Only alphabetic characters are allowed
//               </small>
//             )}
//           </div>
//         </div>

//         <div className="mb-6">
//           <div className="flex mb-2 base2 font-semibold">Last Name</div>
//           <div className="relative">
//             <input
//               defaultValue={user.last_name}
//               className={twMerge(
//                 "w-full h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
//               )}
//               type="text"
//               id="lname"
//               placeholder="Last Name"
//               {...register("lname", {
//                 required: true,
//                 pattern: /^[A-Za-z]+$/, // Regular expression for alphabetic characters only
//               })}
//             />
//             {errors.lname?.type === "required" && (
//               <small className="text-red-500">This field is required</small>
//             )}
//             {errors.lname?.type === "pattern" && (
//               <small className="text-red-500">
//                 Only alphabetic characters are allowed
//               </small>
//             )}
//           </div>
//         </div>
//         <div>
//           <div className="mb-6">
//             <div className="flex mb-2 base2 font-semibold">Gender</div>
//             <div className="relative">
//               <select
//                 defaultValue={user?.gender?.toLowerCase()}
//                 className={twMerge(
//                   "h-13 px-3.5 bg-gray-50   text-n-7 text-sm rounded-lg block w-full p-2.5 dark:bg-n-6  dark:placeholder-gray-400 dark:text-white",
//                 )}
//                 {...register("gender", { required: true })}
//               >
//                 <option value="">Select Gender</option>
//                 {genderOptions.map((option) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
//               {errors.gender?.type === "required" && (
//                 <small className="text-red-500">This field is required</small>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="mb-6">
//           <div className="flex mb-2 base2 font-semibold">Date of Birth</div>
//           <div className="flex space-x-4">
//             <div className="relative">
//               <input
//                 defaultValue={
//                   user.date_of_birth
//                     ? String(new Date(user.date_of_birth).getDate()).padStart(
//                         2,
//                         "0",
//                       )
//                     : ""
//                 }
//                 className={twMerge(
//                   "w-20 h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
//                 )}
//                 type="text"
//                 placeholder="DD"
//                 {...register("day", {
//                   required: true,
//                   pattern: /^(0?[1-9]|[12][0-9]|3[01])$/,
//                   validate: (value) => {
//                     const day = parseInt(value, 10)
//                     if (day <= 31) {
//                       return true
//                     }
//                     return "Day cannot be greater than 31"
//                   },
//                 })}
//               />
//               {errors.day?.type === "required" && (
//                 <small className="text-red-500">This field is required</small>
//               )}
//               {errors.day?.type === "pattern" && (
//                 <small className="text-red-500">Invalid Date</small>
//               )}
//             </div>
//             <div className="relative">
//               <input
//                 defaultValue={
//                   user.date_of_birth
//                     ? String(
//                         new Date(user.date_of_birth).getMonth() + 1,
//                       ).padStart(2, "0")
//                     : ""
//                 }
//                 className={twMerge(
//                   "w-24 h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
//                 )}
//                 type="text"
//                 placeholder="MM"
//                 {...register("month", {
//                   required: true,
//                   pattern: /^(0?[1-9]|1[0-2])$/,
//                   validate: (value) => {
//                     const month = parseInt(value, 10)
//                     if (month <= 12) {
//                       return true
//                     }
//                     return "month cannot be greater than 12"
//                   },
//                 })}
//               />
//               {errors.month?.type === "required" && (
//                 <small className="text-red-500">This field is required</small>
//               )}
//               {errors.month?.type === "pattern" && (
//                 <small className="text-red-500">Invalid Month</small>
//               )}
//             </div>
//             <div className="relative">
//               <input
//                 defaultValue={
//                   user.date_of_birth
//                     ? new Date(user.date_of_birth).getFullYear()
//                     : ""
//                 }
//                 className={twMerge(
//                   "w-28 h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
//                 )}
//                 type="text"
//                 placeholder="YYYY"
//                 {...register("year", {
//                   required: true,
//                   pattern: /^(19|20)\d{2}$/,
//                 })}
//               />
//               {errors.year?.type === "required" && (
//                 <small className="text-red-500">This field is required</small>
//               )}
//               {errors.year?.type === "pattern" && (
//                 <small className="text-red-500">Invalid year</small>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="mb-6">
//           <div className="flex mb-2 base2 font-semibold">Time</div>
//           <div className="flex space-x-4">
//             <div className="relative">
//               <input
//                 defaultValue={
//                   user.time_of_birth
//                     ? user.time_of_birth.split(":")[0].padStart(2, "0")
//                     : ""
//                 }
//                 className={twMerge(
//                   "w-16 h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
//                 )}
//                 type="text"
//                 placeholder="HH"
//                 {...register("hour", {
//                   required: true,
//                   pattern: /^(0?[1-9]|1[0-2])$/, // Valid hour format (0-23)
//                 })}
//               />
//               {errors.hour?.type === "required" && (
//                 <small className="text-red-500">This field is required</small>
//               )}
//               {errors.hour?.type === "pattern" && (
//                 <small className="text-red-500">Invalid hour</small>
//               )}
//             </div>
//             <div className="relative">
//               <input
//                 defaultValue={
//                   user.time_of_birth
//                     ? user.time_of_birth.split(":")[1].padStart(2, "0")
//                     : ""
//                 }
//                 className={twMerge(
//                   "w-16 h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
//                 )}
//                 type="text"
//                 placeholder="MM"
//                 {...register("minute", {
//                   required: true,
//                   pattern: /^(0[0-9]|[1-9]|[1-5][0-9])$/, // Valid minute format (00-59)
//                 })}
//               />
//               {errors.minute?.type === "required" && (
//                 <small className="text-red-500">This field is required</small>
//               )}
//               {errors.minute?.type === "pattern" && (
//                 <small className="text-red-500">Invalid minute</small>
//               )}
//             </div>
//             <div className="relative">
//               <select
//                 defaultValue={user.period}
//                 className={twMerge(
//                   "h-13 px-3.5 bg-gray-50   text-n-7 text-sm rounded-lg block w-full p-2.5 dark:bg-n-6  dark:placeholder-gray-400 dark:text-white",
//                 )}
//                 {...register("period", { required: true })}
//               >
//                 <option value="AM">AM</option>
//                 <option value="PM">PM</option>
//               </select>
//               {errors.period?.type === "required" && (
//                 <small className="text-red-500">This field is required</small>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="mb-6">
//           <div className="flex mb-2 base2 font-semibold">Location</div>
//           <div className="relative">
//             <div>
//               <div className="flex items-center w-full">
//                 {/* 
// // @ts-ignore */}

//                 <input
//                   placeholder="Search"
//                   className="w-full h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent"
//                   {...bindInput}
//                 />
//                 {isBusy && (
//                   <div className="w-4 h-4 border-2 border-dashed rounded-full border-slate-500 animate-spin"></div>
//                 )}
//               </div>
//               {/* 
// // @ts-ignore */}
//               <ul
//                 {...bindOptions}
//                 className="absolute w-full z-10 mt-1 overflow-hidden divide-gray-100 rounded-md dark:bg-n-5 bg-white  shadow-lg ring-1 ring-black ring-opacity-0 focus:outline-none gap-1"
//               >
//                 {suggestions.map((_, index) => (
//                   // @ts-ignore

//                   <li
//                     className={
//                       `z-10 h-8 text-gray-700 dark:text-gray-300 block px-4 py-2 text-sm dark:hover:bg-n-4  hover:bg-gray-100 cursor-pointer ` +
//                       (selectedIndex === index && "bg-slate-300")
//                     }
//                     key={index}
//                     {...bindOption}
//                   >
//                     <div className="flex items-center space-x-1">
//                       <div>{suggestions[index].label}</div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* {<ReactSearchAutocomplete
//             items={suggestions}
//             onSearch={getData}
//             onSelect={handleSelect}
//             inputDebounce={2000}
//             autoFocus
//             formatResult={formatResult}
//           />} */}
//             {!flagAddress && (
//               <small className="text-red-500">
//                 Please select valid address.
//               </small>
//             )}
//             {/* <AutoComplete value={address} suggestions={suggestions} onChange={handleChange}  /> */}

//             {/* <PlacesAutocomplete
//               value={address}
//               onChange={handleChange}
//               onSelect={handleSelect}
//             >
//               {({
//                 getInputProps,
//                 suggestions,
//                 getSuggestionItemProps,
//                 loading,
//               }) => (
//                 <div>
//                   <input
//                     {...getInputProps({
//                       placeholder: "Please choose your birth city...",
//                       className:
//                         "w-full h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
//                       type: "text",
//                     })}
//                   />
//                   <div>
//                     {loading && <div>Loading...</div>}
//                     {suggestions.map((suggestion) => {
//                       return (
//                         <div
//                           {...getSuggestionItemProps(suggestion, {
//                             className:
//                               "z-10  bg-white divide-y divide-gray-100 rounded-lg shadow  dark:bg-gray-700 dark:divide-gray-600",
//                             key: suggestion.description,
//                           })}
//                         >
//                           <div className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
//                             {suggestion.description}
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 </div>
//               )}
//             </PlacesAutocomplete> */}
//           </div>
//         </div>

//         <button type="submit" className="btn-blue w-full" disabled={loading}>
//           Save changes
//         </button>
//         <button
//           type="button"
//           className="btn-red w-full mt-2"
//           onClick={onCancelClick}
//           disabled={loading}
//         >
//           Cancel
//         </button>
//       </form>
//     </>
//   )
// }

// export default EditProfile

import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/router";
import ToggleAstroMode from "@/components/ToggleAstroMode";
import Autocomplete from "@/components/AutoComplete";

interface Address {
  label: string;
  longitude: number;
  latitude: number;
  value?: string;
}

type Inputs = {
  fname: string;
  lname: string;
  gender: string;
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  location: string;
  period: string;
};

type UserProfileData = {
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  time_of_birth: string;
  place_of_birth: string;
  longitude: number;
  latitude: number;
  preferred_astrology: string;
  profile_image?: string;
};

type EditProfileProps = {
  setVisibleSettings: (visible: boolean) => void;
  onSave?: (updatedData: UserProfileData) => void;
};

const EditProfile = ({ setVisibleSettings, onSave }: EditProfileProps) => {
  const router = useRouter();
  const userStr = localStorage.getItem("user");
  console.log("initial data", userStr);

  // Initialize user data with defaults
  const initialUser = {
    first_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    time_of_birth: "",
    place_of_birth: "",
    location: "",
    longitude: 10,
    latitude: 10,
    preferred_astrology: "",
    profile_image: "",
    placeId: "",
    type: "vedic",
    hour: 0,
    period: "AM",
  };

  // Parse user data if it exists
  let parsedUser = initialUser;
if (userStr) {
  try {
    parsedUser = JSON.parse(userStr);
    // Remove the name splitting logic since we have separate first_name and last_name
    parsedUser = {
      ...parsedUser,
      period: parsedUser.hour < 12 ? "AM" : "PM",
      hour: parsedUser.hour > 12 ? parsedUser.hour - 12 : parsedUser.hour,
      location: parsedUser.place_of_birth || "", // Use place_of_birth instead of location
    };
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
}

  const [user, setUser] = useState(parsedUser);
  const [objectURL, setObjectURL] = useState<string | null>(null);
  const [astroMode, setAstroMode] = useState<string>(user.type || "vedic");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<Address | null>(null);
  const [flagAddress, setFlagAddress] = useState(false);
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [showDropdown, setShowDropdown] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    defaultValues: {
      fname: user.first_name,
      lname: user.last_name,
      gender: user.gender,
      day: user.date_of_birth
        ? String(new Date(user.date_of_birth).getDate()).padStart(2, "0")
        : "",
      month: user.date_of_birth
        ? String(new Date(user.date_of_birth).getMonth() + 1).padStart(2, "0")
        : "",
      year: user.date_of_birth
        ? String(new Date(user.date_of_birth).getFullYear())
        : "",
      hour: user.time_of_birth
        ? user.time_of_birth.split(":")[0].padStart(2, "0")
        : "",
      minute: user.time_of_birth
        ? user.time_of_birth.split(":")[1].padStart(2, "0")
        : "",
      period: user.period || "AM",
      location: user.place_of_birth || "",
    },
  });
  const [inputValue, setInputValue] = useState(""); // Add this state for input value

  useEffect(() => {
    if (user.place_of_birth) {
      const initialAddress = {
        label: user.place_of_birth, // Use place_of_birth instead of location
        longitude: user.longitude || 10,
        latitude: user.latitude || 10,
        value: user.placeId,
      };
      setAddress(initialAddress.label ? initialAddress : null);
      setFlagAddress(true);
      setInputValue(user.place_of_birth); // Set initial input value
    }
  }, [user]);

  const handleSelect = (selectedAddress: Address) => {
    if (!selectedAddress.label) {
      toast.error("Please select a valid address with a location name");
      return;
    }
    
    setAddress({
      label: selectedAddress.label,
      longitude: selectedAddress.longitude,
      latitude: selectedAddress.latitude
    });
    setFlagAddress(true);
    setShowDropdown(false);
  };

  const { bindInput, bindOptions, bindOption, isBusy, selectedIndex } =
    Autocomplete({
      onChange: (value: string) => {
        handleSelect(value);
        setInputValue(value); // Update input value as user types
      },
      initialValue: user.place_of_birth || "", 
      delay: 1000,
      source: async (search: string) => {
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

          const newSuggestions = response.data.data.map((item: any) => ({
            label: item.display_name,
            longitude: item.lon,
            latitude: item.lat,
            value: item._id,
          }));
          setSuggestions(newSuggestions);
          return newSuggestions;
        } catch (e) {
          console.error("Error fetching locations:", e);
          return [];
        }
      },
    });

  const onCancelClick = () => {
    setVisibleSettings(false);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setObjectURL(URL.createObjectURL(file));
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
  
    // Convert 12-hour format to 24-hour format
    let hour = parseInt(formData.hour, 10);
    if (formData.period === "AM" && hour === 12) {
      hour = 0;
    } else if (formData.period === "PM" && hour < 12) {
      hour = hour + 12;
    }
  
    const timezone = (new Date().getTimezoneOffset() * -1) / 60;
  
    const updatedData = {
      first_name: formData.fname,
      last_name: formData.lname,
      gender: formData.gender,
      date_of_birth: `${formData.year}-${formData.month.padStart(2, "0")}-${formData.day.padStart(2, "0")}`,
      time_of_birth: `${hour.toString().padStart(2, "0")}:${formData.minute.padStart(2, "0")}:00`,
      timezone,
      place_of_birth: address.label, // Send just the string label, not the whole object
      longitude: address.longitude||10,
      latitude: address.latitude||10,
      preferred_astrology: astroMode,
    };

    console.log("Updated Data:", updatedData);
  
    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.BACKEND_URL}/user`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      // Update local storage and state
      const updatedUser = { ...user, ...updatedData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success("Profile updated successfully!");
      if (onSave) onSave(updatedData);
      setVisibleSettings(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Detailed error:", error.response?.data);
        toast.error(
          error.response?.data?.message || "Failed to update profile. Please check all fields."
        );
      } else {
        console.error("Error updating profile:", error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const genderOptions = ["male", "female"];
  const avatarImagePath =
    objectURL ||
    user.profile_image ||
    (user.gender === "male" ? "/images/Male.png" : "/images/Female.png");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-8 mt-8 h5 md:mb-6">Edit profile</div>

      <div className="flex items-center mb-6">
        <div className="relative flex justify-center items-center shrink-0 w-28 h-28 mr-4 rounded-full overflow-hidden bg-n-2 dark:bg-n-6">
          {avatarImagePath ? (
            <Image
              className="object-cover rounded-full"
              src={avatarImagePath}
              fill
              alt="Avatar"
            />
          ) : (
            <Icon className="w-8 h-8 dark:fill-n-1" name="profile" />
          )}
        </div>
        <input
          type="file"
          id="profile-upload"
          className="hidden"
          onChange={handleUpload}
          accept="image/*"
        />
        <label
          htmlFor="profile-upload"
          className="btn-stroke-light cursor-pointer"
        >
          Change photo
        </label>
      </div>

      <div className="mb-6">
        <div className="flex mb-2 base2 font-semibold">Astrology</div>
        <ToggleAstroMode astroMode={astroMode} setAstroMode={setAstroMode} />
      </div>

      <div className="mb-6">
        <div className="flex mb-2 base2 font-semibold">First Name</div>
        <div className="relative">
          <input
            className={twMerge(
              "w-full h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
              errors.fname && "border-red-500"
            )}
            type="text"
            id="fname"
            placeholder="First Name"
            {...register("fname", {
              required: "This field is required",
              pattern: {
                value: /^[A-Za-z]+$/,
                message: "Only alphabetic characters are allowed",
              },
            })}
          />
          {errors.fname && (
            <small className="text-red-500">{errors.fname.message}</small>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex mb-2 base2 font-semibold">Last Name</div>
        <div className="relative">
          <input
            className={twMerge(
              "w-full h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
              errors.lname && "border-red-500"
            )}
            type="text"
            id="lname"
            placeholder="Last Name"
            {...register("lname", {
              required: "This field is required",
              pattern: {
                value: /^[A-Za-z]+$/,
                message: "Only alphabetic characters are allowed",
              },
            })}
          />
          {errors.lname && (
            <small className="text-red-500">{errors.lname.message}</small>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex mb-2 base2 font-semibold">Gender</div>
        <div className="relative">
          <select
            className={twMerge(
              "h-13 px-3.5 bg-gray-50 text-n-7 text-sm rounded-lg block w-full p-2.5 dark:bg-n-6 dark:placeholder-gray-400 dark:text-white",
              errors.gender && "border-red-500"
            )}
            {...register("gender", { required: "This field is required" })}
          >
            <option value="">Select Gender</option>
            {genderOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
          {errors.gender && (
            <small className="text-red-500">{errors.gender.message}</small>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex mb-2 base2 font-semibold">Date of Birth</div>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              className={twMerge(
                "w-20 h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
                errors.day && "border-red-500"
              )}
              type="text"
              placeholder="DD"
              {...register("day", {
                required: "This field is required",
                pattern: {
                  value: /^(0?[1-9]|[12][0-9]|3[01])$/,
                  message: "Invalid day",
                },
                validate: (value) => {
                  const day = parseInt(value, 10);
                  return day <= 31 || "Day cannot be greater than 31";
                },
              })}
            />
            {errors.day && (
              <small className="text-red-500">{errors.day.message}</small>
            )}
          </div>
          <div className="relative">
            <input
              className={twMerge(
                "w-24 h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
                errors.month && "border-red-500"
              )}
              type="text"
              placeholder="MM"
              {...register("month", {
                required: "This field is required",
                pattern: {
                  value: /^(0?[1-9]|1[0-2])$/,
                  message: "Invalid month",
                },
                validate: (value) => {
                  const month = parseInt(value, 10);
                  return month <= 12 || "Month cannot be greater than 12";
                },
              })}
            />
            {errors.month && (
              <small className="text-red-500">{errors.month.message}</small>
            )}
          </div>
          <div className="relative">
            <input
              className={twMerge(
                "w-28 h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
                errors.year && "border-red-500"
              )}
              type="text"
              placeholder="YYYY"
              {...register("year", {
                required: "This field is required",
                pattern: {
                  value: /^(19|20)\d{2}$/,
                  message: "Invalid year",
                },
              })}
            />
            {errors.year && (
              <small className="text-red-500">{errors.year.message}</small>
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
                errors.hour && "border-red-500"
              )}
              type="text"
              placeholder="HH"
              {...register("hour", {
                required: "This field is required",
                pattern: {
                  value: /^(0?[1-9]|1[0-2])$/,
                  message: "Invalid hour",
                },
              })}
            />
            {errors.hour && (
              <small className="text-red-500">{errors.hour.message}</small>
            )}
          </div>
          <div className="relative">
            <input
              className={twMerge(
                "w-16 h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
                errors.minute && "border-red-500"
              )}
              type="text"
              placeholder="MM"
              {...register("minute", {
                required: "This field is required",
                pattern: {
                  value: /^(0[0-9]|[1-9]|[1-5][0-9])$/,
                  message: "Invalid minute",
                },
              })}
            />
            {errors.minute && (
              <small className="text-red-500">{errors.minute.message}</small>
            )}
          </div>
          <div className="relative">
            <select
              className={twMerge(
                "h-13 px-3.5 bg-gray-50 text-n-7 text-sm rounded-lg block w-full p-2.5 dark:bg-n-6 dark:placeholder-gray-400 dark:text-white",
                errors.period && "border-red-500"
              )}
              {...register("period", { required: "This field is required" })}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
            {errors.period && (
              <small className="text-red-500">{errors.period.message}</small>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex mb-2 base2 font-semibold">Location</div>
        <div className="relative">
          <div className="flex items-center w-full">
            <input
              placeholder="Search for your birth location"
              className={twMerge(
                "w-full h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent",
                !flagAddress && "border-red-500"
              )}
              {...bindInput}
            />
            {isBusy && (
              <div className="w-4 h-4 border-2 border-dashed rounded-full border-slate-500 animate-spin ml-2"></div>
            )}
          </div>
          {showDropdown && suggestions.length > 0 && (
          <ul
            {...bindOptions}
            className="absolute w-full z-10 mt-1 overflow-hidden divide-gray-100 rounded-md dark:bg-n-5 bg-white shadow-lg ring-1 ring-black ring-opacity-0 focus:outline-none gap-1"
          >
            {suggestions.map((suggestion, index) => (
              <li
                className={twMerge(
                  "z-10 h-8 text-gray-700 dark:text-gray-300 block px-4 py-2 text-sm dark:hover:bg-n-4 hover:bg-gray-100 cursor-pointer",
                  selectedIndex === index && "bg-slate-300 dark:bg-n-4"
                )}
                key={index}
                {...bindOption}
              >
                <div className="flex items-center space-x-1">
                  <div>{suggestion.label}</div>
                </div>
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
  );
};

export default EditProfile;