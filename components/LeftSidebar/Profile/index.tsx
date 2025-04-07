import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "@/components/Image";
import axios from "axios";
import Modal from "@/components/Modal";
import Settings from "@/components/Settings";
import { additionalSettings, settings } from "@/constants/settings";

type ProfileProps = {
  visible?: boolean;
};

const Profile = ({ visible }: ProfileProps) => {
  const [userGender, setUserGender] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userProfilePic, setUserProfilePic] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [userDob, setUserDob] = useState<string | null>(null);
  const [userPob, setUserPob] = useState<string | null>(null);
  const [visibleSettings, setVisibleSettings] = useState(false);

  // Check if any required profile field is missing
  useEffect(() => {
    if (!userName || !userGender || !userProfilePic || !userDob || !userPob) {
      setIsProfileComplete(false);
    } else {
      setIsProfileComplete(true);
    }
  }, [userName, userGender, userProfilePic, userDob, userPob]);

  // Fetch user data from the API
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

        if (userData.gender) {
          setUserGender(userData.gender);
          setUserName(userData.first_name);
        }
        if (userData.profile_image) {
          setUserProfilePic(userData.profile_image);
        }
        if (userData.date_of_birth) {
          setUserDob(userData.date_of_birth);
        }
        if (userData.place_of_birth) {
          setUserPob(userData.place_of_birth);
        }
        if (userData.plan) {
          setUserPlan(userData.plan);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const avatarImagePath =
    userProfilePic ||
    (userGender === "male" ? "/images/Male.png" : "/images/Female.png");

  const handleManagePlan = async () => {
    try {
      const res = await axios.post(
        `${process.env.BACKEND_URL}/payment/create-portal-session`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const { session_url } = res.data;
      if (session_url) {
        window.open(session_url, "_self", "noreferrer");
      }
    } catch (error) {
      console.error("Error managing plan:", error);
    }
  };

  const handleImageClick = () => {
    if (!isProfileComplete) {
      setVisibleSettings(true);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <>
      <div
        className={`${
          visible
            ? "mb-6"
            : "mb-3 dark:shadow-[0_1.25rem_1.5rem_0_rgba(0,0,0,0.5)] shadow-sm"
        }`}
      >
        <div className={`${!visible && "p-2.5 dark:bg-n-6 bg-n-3 rounded-xl"} `}>
          <div
            className={`flex items-center ${
              visible ? "justify-center" : "px-0.5 py-2"
            }`}
          >
            <div 
              className={`relative w-8 h-8 cursor-pointer${
              visible ? "" : "w-8 h-8"}`}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={handleImageClick}
            >
              <Image
                className="rounded-full object-cover"
                src={avatarImagePath}
                fill
                alt="Avatar"
              />
              {!isProfileComplete && (
                <>
                  <div className="absolute -right-1 top-6 z-10 w-4.5 h-4.5 bg-red-500 rounded-full border-4 border-n-6 animate-pulse"></div>
                  {showTooltip && (
                    <div className="absolute z-10 w-40 px-2 py-2 text-sm text-white bg-red-500 rounded-lg shadow-lg top-full left-full transform -translate-x-1/2 mt-2">
                      Complete your profile
                    </div>
                  )}
                </>
              )}
              {isProfileComplete && (
                <div className="absolute -right-0.75 -bottom-0.75 w-4.5 h-4.5 bg-primary-2 rounded-full border-4 border-n-6"></div>
              )}
            </div>
            {!visible && (
              <>
                <div className="ml-4 mr-4">
                  <div className="base2 font-semibold text-n-4">{userName}</div>
                </div>
                <div className="shrnik-0 ml-auto self-start px-3 bg-primary-2 rounded-lg caption1 font-bold text-n-5">
                  {userPlan || "Free"}
                </div>
              </>
            )}
          </div>
          {!visible && (
            <>
              {!userPlan || userPlan === "free" ? (
                <Link
                  className="btn-white w-full mt-2 text-sm h-10"
                  href="/pricing"
                >
                  Subscribe Now
                </Link>
              ) : (
                <button
                  className="btn-stroke-dark w-full mt-2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleManagePlan();
                  }}
                >
                  Manage Plan
                </button>
              )}
            </>
          )}
        </div>
      </div>

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
        />
      </Modal>
    </>
  );
};

export default Profile;