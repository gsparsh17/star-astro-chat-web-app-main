import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import Radio from "@/components/Radio";
import axios from "axios";
import { featuresPrice } from "@/mocks/price";
import Features from "../Features";
import { toast } from "react-hot-toast";

type ApiPlan = {
  name: string;
  price_inr: number;
  price_usd: number;
  no_of_credit: number;
};

type Plan = {
  id: string;
  title: string;
  popular?: boolean;
  currentPlan?: boolean;
  description: string;
  usdPriceMonth: number;
  usdDiscountPrice: number;
  inrPriceMonth: number;
  inrDiscountPrice: number;
  priceYear: number;
  details: string[];
  planKey?: string;
  colorTitle?: string;
  subDetail?: string;
  priceDetails?: string;
};

const MainIndia = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  // const [countryName, setCountryName] = useState<string | null>(null);
  const [visibleSettings, setVisibleSettings] = useState<boolean>(false);
  const [currentPlan, setCurrentPlan] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<number>(1);
  const [vpaVal, setVpaVal] = useState<string | null>(null);
  const [promoVal, setPromoVal] = useState<string>("");
  const [planType, setPlanType] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

useEffect(() => {
  setAccessToken(localStorage.getItem("accessToken"));
}, []);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL1}/plans`);
        const apiPlans: ApiPlan[] = response.data.data;
        
        // Filter out plans with names containing "sub_"
        const filteredPlans = apiPlans.filter(plan => !plan.name.includes("sub_"));
        
        // Transform API data to match our Plan type
        const transformedPlans: Plan[] = filteredPlans.map((plan, index) => ({
          id: `plan-${index}`,
          title: plan.name.charAt(0).toUpperCase() + plan.name.slice(1),
          popular: index === 1, // Make second plan popular for example
          description: `${plan.no_of_credit} credits per month`,
          usdPriceMonth: plan.price_usd,
          usdDiscountPrice: plan.price_usd * 0.9, // 10% discount for yearly
          inrPriceMonth: plan.price_inr,
          inrDiscountPrice: plan.price_inr * 0.9, // 10% discount for yearly
          priceYear: plan.price_inr * 10, // 10 months price for yearly
          details: [
            `${plan.no_of_credit} credits per month`,
            "24/7 customer support",
            "Basic astrology reports",
            "Daily horoscope updates"
          ],
          planKey: plan.name,
          colorTitle: index === 1 ? "#FF97E8" : "#3B82F6",
          subDetail: `${plan.no_of_credit} credits`,
          priceDetails: "Billed monthly, cancel anytime"
        }));
        
        setPlans(transformedPlans);
        console.log("Plans:", transformedPlans);

      } catch (error) {
        console.error("Error fetching plans:", error);
        toast.error("Failed to load plans. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // const getCountry = async () => {
    //   try {
    //     const res = await axios.get(`${process.env.BACKEND_URL}/ip2location`);
    //     setCountryName(res.data.country_short);
    //     if (process.env.NODE_ENV === "development") {
    //       setCountryName("IN");
    //     }
    //   } catch (error) {
    //     console.error("Error fetching country:", error);
    //   }
    // };

    fetchPlans();
    // getCountry();
  }, []);

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
      console.log("Razorpay script loaded");
    });
  };

  const gotoStripeCheckout = async (planKey: string) => {
    try {
      // 1. Create Stripe order
      const res = await axios.post(
        `${process.env.BACKEND_URL}/payment/stripe/order`,
        {
          plan: "basic", // Use the actual plan key instead of hardcoded "basic"
          promo_code: promoVal,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Stripe order response:", res.data);
      const { order_id, stripe_url } = res.data.data;
  
      // 2. Open Stripe Checkout
      if (stripe_url) {
        // Open Stripe checkout in new window
        const stripeWindow = window.open(stripe_url, "_blank");
        
        // Poll for payment completion
        const checkPaymentStatus = async () => {
          try {
            const statusRes = await axios.get(
              `${process.env.BACKEND_URL}/payment/verify/${order_id}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
  
            console.log("Payment status:", statusRes.data);
  
            if (statusRes.data.status === "success") {
              toast.success("Payment successful! 🚀🌌");
              window.location.href = "./pricing?payment=success";
              return true;
            } else if (statusRes.data.status === "failed") {
              toast.error("Payment failed. Please try again.");
              window.location.href = "./pricing?payment=failed";
              return true;
            }
            return false;
          } catch (error) {
            console.error("Status check error:", error);
            return false;
          }
        };
  
        // Check every 3 seconds for 2 minutes
        const interval = setInterval(async () => {
          if (stripeWindow?.closed || await checkPaymentStatus()) {
            clearInterval(interval);
          }
        }, 3000);
  
        // Final check after 2 minutes
        setTimeout(() => {
          clearInterval(interval);
          if (!stripeWindow?.closed) {
            stripeWindow?.close();
            toast.success("Payment verification timeout. Please check your email for confirmation.");
          }
        }, 120000);
      }
    } catch (error) {
      console.error("Stripe payment error:", error);
      toast.error("Oops! Celestial glitch detected. Retry in a cosmic minute. 🌌🔧");
    }
  };

  const handleRazorpayPayment = async (planKey: string) => {
    try {
      // 1. Verify Razorpay script loaded
      const isRazorpayLoaded = await initializeRazorpay();
      if (!isRazorpayLoaded) {
        toast.error("Failed to load payment processor");
        return;
      }
  
      // 2. Verify Razorpay key exists
      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY) {
        toast.error("Payment configuration error");
        console.error("Razorpay key missing");
        return;
      }
  
      // 3. Create order
      // const accessToken = localStorage.getItem("accessToken");
      const res = await axios.post(
        `${process.env.BACKEND_URL}/payment/razorpay/order`,
        {
          plan: "basic",
          promo_code: promoVal,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Razorpay order response:", res.data);
      const { order_id } = res.data.data;
  
      // 4. Setup payment options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY, // Use public-facing key
        order_id: order_id,
        name: "Star Astro",
        description: `${planKey.charAt(0).toUpperCase() + planKey.slice(1)} Plan`,
        image: "https://www.chat.starastrogpt.com/_next/image?url=%2Fimages%2Fstar-dark.png&w=1920&q=75",
        handler: async function(response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
          try {
            const verifyRes = await axios.get(
              `${process.env.BACKEND_URL}/payment/verify/${order_id}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
              }
            );
            console.log("Payment verification response:", verifyRes.data);
            if (verifyRes.data.status === "success") {
              toast.success("Payment successful! 🚀🌌");
              window.location.href = "./pricing?payment=success";
            }
            if (verifyRes.data.status === "error") {
              const errorMessage =
                    "Payment is pending. We'll confirm your payment shortly. 🚀🌠"
        
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
            }
            if (verifyRes.data.status === "fail") {
              toast.error("Payment failed. Please try again.");
              window.location.href = "./pricing?payment=failed";
            }
          } catch (error) {
            toast.error("");
            const errorMessage =
                    "Verification error. We'll confirm your payment shortly. 🚀🌠"
        
                  toast.custom((t) => (
                    <div
                      className={`${
                        t.visible ? "animate-enter" : "animate-leave"
                      } max-w-md w-full bg-red-500 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 `}
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
            console.error("Verification error:", error);
          }
        },
        modal: {
          ondismiss: function() {
            toast("");
            const errorMessage =
                    "Payment is pending. Payment window closed"
        
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
          }
        },
        notes: {
          plan: planKey,
          userId: accessToken?.split(".")?.[1] || "unknown" // Just for example
        }
      };
  
      console.log("Razorpay options:", options);
      
      // 5. Open payment modal
      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
  
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    }
  };

  const handleSubscribe = async () => {
    if (paymentMethod === 1) {
      await gotoStripeCheckout(currentPlan);
    } else if (paymentMethod === 3) {
        await handleRazorpayPayment(currentPlan);
    }
  };

  if (loading) {
    return (
      <div className="py-32 px-20 bg-n-2 rounded-t-[1.25rem] 2xl:py-20 2xl:px-40 xl:px-8 md:rounded-none dark:bg-n-6">
        <div className="max-w-[75.25rem] mx-auto text-center">
          <div className="h4">Loading plans...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-32 px-20 bg-n-2 rounded-t-[1.25rem] 2xl:py-20 2xl:px-20 xl:px-8 md:rounded-none dark:bg-n-6">
      <div className="max-w-[75.25rem] mx-auto">
        <div className="mb-20 text-center 2xl:mb-16 lg:mb-10">
          <div className="mb-4 h3 lg:h3">Choose Your Plan</div>
          <div className="body1 text-n-4 2xl:text-lg text-sm">
            Unlock the Stars: Where Ancient Indian Vedic Astrology Meets NASA's Space Intelligence for Perfect Predictions!
          </div>
        </div>
        <div className="flex mb-20 py-4 2xl:block 2xl:py-0 lg:mb-0">
          <div className="flex grow lg:grid lg:scroll-smooth lg:scrollbar-none lg:py-6 lg:m-2 lg:gap-4 ">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`flex basis-1/3 border-r-2 border-n-3 p-8 bg-n-1 first:rounded-l-3xl last:rounded-r-3xl last:border-none 2xl:px-6 lg:shrink-0 lg:basis-[18.5rem] md:basis-[20rem] sm:!basis-full sm:border-r-0 sm:border-b-2 sm:rounded-xl sm:last:border-b-0 dark:bg-n-7 dark:border-n-6 ${
                  plan.popular &&
                  "relative text-n-1 before:absolute before:-top-4 before:left-0 before:right-0 before:-bottom-4 before:bg-n-6 before:rounded-3xl sm:before:-top-2 sm:before:-bottom-2 dark:text-n-7 dark:before:bg-n-2"
                }`}
              >
                <div className="relative flex flex-col grow z-2">
                  <div className="flex justify-between items-center mb-1 sm:mb-2">
                    <div className="h4 sm:text-xl" style={{ color: plan.colorTitle }}>
                      {plan.title}
                    </div>
                    {plan.popular && (
                      <div className="shrink-0 ml-4 px-3 py-0.5 bg-[#FF97E8] rounded caption1 font-semibold text-n-7 sm:ml-2 sm:px-2 sm:text-xs">
                        Popular
                      </div>
                    )}
                  </div>
                  <div className="mb-6 base1 font-semibold sm:mb-4 sm:text-base">{plan.description}</div>
                  <div className="mb-2 sm:mb-3">
                    { plan.inrDiscountPrice && (
                      <span className="mr-2 h3 sm:text-2xl">
                        {plan.inrDiscountPrice > plan.inrPriceMonth && (
                          <del className="h4 sm:text-lg">₹{plan.inrDiscountPrice}</del>
                        )}{" "}
                        ₹{planType ? plan.priceYear : plan.inrPriceMonth}
                      </span>
                    )}
                    {/* {countryName !== "IN" && (
                      <span className="mr-2 h2 sm:text-2xl">
                        ${planType ? plan.usdDiscountPrice : plan.usdPriceMonth}
                      </span>
                    )} */}
                    <span className={`h5 text-n-4/50 sm:text-lg ${plan.popular && "text-n-4"}`}>
                      /{planType ? "year" : "mo"}
                    </span>
                  </div>
                  {plan.subDetail && <strong className="h6 sm:text-base">{plan.subDetail}</strong>}
                  {plan.priceDetails && (
                    <div className="base1 text-n-4 sm:text-sm">{plan.priceDetails}</div>
                  )}
                  <div
                    className={`grow space-y-4 mt-6 pt-6 border-t border-n-3 sm:mt-4 sm:pt-4 sm:space-y-3 dark:border-n-6 ${
                      plan.popular && "border-n-5 dark:border-n-4/25"
                    }`}
                  >
                    {plan.details.map((detail, index) => (
                      <div className="flex base2 sm:text-sm" key={index}>
                        <div
                          className={`mr-3 fill-n-4/50 sm:mr-2 ${
                            plan.popular ? "text-emerald-400" : "text-blue-500"
                          }`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    className={`${plan.currentPlan && "opacity-50 pointer-events-none"} ${
                      plan.popular ? "btn-blue" : "btn-stroke-light"
                    } w-full mt-8 sm:mt-6 sm:py-3`}
                    onClick={() => {
                      setVisibleSettings(true);
                      setCurrentPlan(plan.planKey || "");
                    }}
                  >
                    {plan.currentPlan ? "Current Plan" : "Get Started"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        className="md:!p-0 px-10 py-10 sm:px-5 sm:py-8"
        classWrap="max-w-[48rem] md:min-h-screen-ios md:rounded-none"
        classButtonClose="block absolute top-5 right-5 dark:fill-n-4 px-10 py-5 sm:px-5 sm:py-2"
        classOverlay="md:bg-n-1"
        visible={visibleSettings}
        onClose={() => {
          setVisibleSettings(false);
        }}
      >
        <div className="px-5 md:px-10 py-5 md:py-10 sm:px-3 sm:py-5">
          <div className="mb-4 h4 md:mb-6 sm:mb-4">
            <div className="base1 font-semibold sm:text-lg">Payment Method</div>
          </div>

          <div className="flex flex-col mb-4 md:mb-1">
            <Radio
              className="mb-2 md:mb-0 sm:mb-3"
              content="Credit/Debit Card"
              value="1"
              checked={paymentMethod === 1}
              name="payment_method"
              onChange={() => {
                setPaymentMethod(1);
              }}
            />
            <Radio
              className="mb-2 md:mb-0 mt-2 sm:mt-3"
              content="UPI X RazorPay"
              value="3"
              checked={paymentMethod === 3}
              name="payment_method"
              onChange={() => {
                setPaymentMethod(3);
              }}
            />
          </div>

          <div className="flex flex-col mb-4 md:mb-1">
            <div className="flex mb-2 base2 font-semibold mt-2 sm:mt-3">
              Promo Code - <em className="text-n-4">Optional</em>
            </div>
            <input
              type="text"
              placeholder="Enter Promo Code"
              defaultValue={promoVal}
              className="w-full md:w-72 h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent sm:h-12 sm:text-sm"
              id="promoVpa"
              onChange={(e) => {
                setPromoVal(e.target.value);
              }}
            />
          </div>

          <button className="btn-blue w-full md:w-auto mt-5 sm:mt-6 sm:w-full sm:py-3" onClick={handleSubscribe}>
            Subscribe Now
          </button>
        </div>
      </Modal>
      {/* <Features items={featuresPrice} /> */}
    </div>
  );
};

export default MainIndia;