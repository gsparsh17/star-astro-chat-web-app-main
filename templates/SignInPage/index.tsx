import Link from "next/link";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import Form from "./Form";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { useRouter } from "next/router";

const SignInPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Check for access token on client side only
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        const errorMessage = "You are already logged in. Redirecting to homepage...";
                  toast.custom((t) => (
                    <div
                      className={`${
                        t.visible ? "animate-enter" : "animate-leave"
                      } max-w-md w-full bg-green-600 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 `}
                    >
                      <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                          <div className="ml-3 flex-1">
                            <p className="mt-1 text-base text-white text-center">{errorMessage}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
        router.push("/"); // Redirect to homepage if token exists
      }
    }
  }, [router]);

  return (
    <div className="relative flex min-h-screen min-h-screen-ios lg:p-6 md:px-6 md:pt-16 md:pb-10">
      <div className="relative shrink-0 w-[40rem] p-20 overflow-hidden 2xl:w-[37.5rem] xl:w-[30rem] xl:p-10 lg:hidden">
        <div className="max-w-[28.4rem]">
          <div className="mb-5 h3 text-n-1">Discover the Future with AI-Powered Astrology</div>
          <div className="text-[1.3rem] text-n-3">
            Chat with Brahma AI—Your 24/7 Astrologer for Accurate Insights and Guidance
          </div>
        </div>
        <div className="absolute top-52 left-5 right-5 h-[50rem] xl:top-24">
          <Image
            className="object-contain"
            src="/images/create-pic.png"
            fill
            sizes="(max-width: 1180px) 50vw, 33vw"
            alt=""
          />
        </div>
      </div>
      <div className="flex grow my-6 mr-6 p-10 bg-n-1 rounded-[1.25rem] lg:m-0 md:p-0 dark:bg-n-6">
        <Form />
      </div>
    </div>
  );
};

export default SignInPage;