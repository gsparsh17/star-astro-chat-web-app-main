import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import Icon from "@/components/Icon";
import Modal from "@/components/Modal";
import Radio from "@/components/Radio";
import axios from "axios";
import { toast } from "react-hot-toast";

type PackageProps = {
  plan?: boolean;
  item: any;
};

const Package = ({ plan, item }: PackageProps) => {
  console.log("item", item);
  const [countryName, setCountryName] = useState<string | null>(null);
  const [visibleSettings, setVisibleSettings] = useState<boolean>(false);
  const [visibleCodeInput, setVisibleCodeInput] = useState<boolean>(false);
  const [currentPlan, setCurrentPlan] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<number>(1);
  const [vpaVal, setVpaVal] = useState<string | null>(null);
  const [promoVal, setPromoVal] = useState<string>("");

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
    });
  };

  const gotoStripeCheckout = async (planKey: string) => {
    try {
      console.log("planKey", planKey);
      const accessToken = localStorage.getItem("accessToken")
      const res = await axios.post(`${process.env.BACKEND_URL}/payment/stripe/order`, {
        plan: "basic",
        promo_code: promoVal,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const { stripe_url } = res.data.data;
      if (stripe_url) {
        window.open(stripe_url, "_self", "noreferrer");
      }
    } catch (error) {
      toast.error("Oops! Celestial glitch detected. Retry in a cosmic minute. 🌌🔧");
    }
  };

  const handleRazorpayPayment = async (planKey: string) => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      const res = await axios.post(`${process.env.BACKEND_URL}/payment/razorpay/order`, {
        plan: "basic",
        promo_code: promoVal,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const { order_id } = res.data.data;

      await initializeRazorpay();

      const options = {
        key: process.env.RAZORPAY_KEY,
        order_id: order_id,
        name: "Star Astro",
        description: `${planKey.charAt(0).toUpperCase() + planKey.slice(1)} Plan`,
        image: "https://www.chat.starastrogpt.com/_next/image?url=%2Fimages%2Fstar-dark.png&w=1920&q=75",
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          // Verify payment
          const verifyRes = await axios.get(`${process.env.BACKEND_URL}/payment/verify/${order_id}`);
          if (verifyRes.data.data.status === "paid") {
            toast.success("Payment successful! 🚀🌌");
            window.location.href = "./pricing?payment=success";
          } else {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (error) {
      toast.error("Oops! Celestial glitch detected. Retry in a cosmic minute. 🌌🔧");
    }
  };

  const handleSubscribe = async () => {
    if (paymentMethod === 1) {
      await gotoStripeCheckout(currentPlan);
    } else if (paymentMethod === 3) {
      if (!vpaVal) {
        toast.error("Unlock the cosmos! Kindly enter your UPI address. 🔒🌌");
      } else {
        try {
          const res = await axios.post(`${process.env.BACKEND_URL}/payment/verify-vpa`, {
            vpa: vpaVal,
          });
          const { vpaValid } = res.data;

          if (vpaValid === "Y") {
            await handleRazorpayPayment(currentPlan);
          } else {
            toast.error("Oops! UPI address lost in the cosmic void. Double-check and try again. 🌌🚫");
          }
        } catch (error) {
          toast.error("Oops! Celestial glitch detected. Retry in a cosmic minute. 🌌🔧");
        }
      }
    }
  };

  useEffect(() => {
    const getCountry = async () => {
      try {
        const res = await axios.get(`${process.env.BACKEND_URL}/payment/country`);
        setCountryName(res.data.country_short);
        if (process.env.NODE_ENV === "development") {
          setCountryName("IN");
        }
      } catch (error) {
        console.error("Error fetching country:", error);
      }
    };
    getCountry();
  }, []);

  return (
    <div
  className={`flex basis-1/3 border-r-2 border-n-3 p-8 bg-n-1 first:rounded-l-3xl last:rounded-r-3xl last:border-none 2xl:px-6 lg:shrink-0 lg:basis-[18.5rem] md:basis-[20rem] sm:!basis-full sm:border-r-0 sm:border-b-2 sm:rounded-none sm:first:rounded-t-3xl sm:last:rounded-b-3xl sm:last:border-b-0 dark:bg-n-7 dark:border-n-6 ${
    item.popular &&
    "relative text-n-1 before:absolute before:-top-4 before:left-0 before:right-0 before:-bottom-4 before:bg-n-6 before:rounded-3xl sm:before:-top-2 sm:before:-bottom-2 dark:text-n-7 dark:before:bg-n-2"
  }`}
>
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

      {paymentMethod === 3 && (
        <div className="mb-6 sm:mb-4">
          <div className="flex mb-2 base2 font-semibold mt-5 sm:mt-3">UPI Address</div>
          <div className="relative">
            <input
              type="text"
              placeholder="yourname@bankname"
              defaultValue={vpaVal || undefined}
              className={twMerge(
                "w-full md:w-72 h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent sm:h-12 sm:text-sm"
              )}
              id="upiVpa"
              onChange={(e) => {
                setVpaVal(e.target.value);
              }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col mb-4 md:mb-1">
        <div className="flex mb-2 base2 font-semibold mt-2 sm:mt-3">Promo Code - <em className="text-n-4">Optional</em></div>
        <input
          type="text"
          placeholder="Enter Promo Code"
          defaultValue={promoVal}
          className={twMerge(
            "w-full md:w-72 h-13 px-3.5 bg-n-2 border-2 border-n-2 rounded-xl base2 text-n-7 outline-none transition-colors placeholder:text-n-4/50 focus:bg-transparent dark:bg-n-6 dark:border-n-6 dark:text-n-3 dark:focus:bg-transparent sm:h-12 sm:text-sm"
          )}
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

  <div className="relative flex flex-col grow z-2">
    <div className="flex justify-between items-center mb-1 sm:mb-2">
      <div className="h4 sm:text-xl" style={{ color: item.colorTitle }}>
        {item.title}
      </div>
      {item.popular && (
        <div className="shrink-0 ml-4 px-3 py-0.5 bg-[#FF97E8] rounded caption1 font-semibold text-n-7 sm:ml-2 sm:px-2 sm:text-xs">
          Popular
        </div>
      )}
    </div>
    <div className="mb-6 base1 font-semibold sm:mb-4 sm:text-base">{item.description}</div>
    <div className="mb-2 sm:mb-3">
      {countryName === "IN" && item.inrDiscountPrice && (
        <span className="mr-2 h2 sm:text-2xl">
          <del className="h4 sm:text-lg">₹{item.inrDiscountPrice}</del> ₹{item.inrPriceMonth}
        </span>
      )}
      {countryName !== "IN" && <span className="mr-2 h2 sm:text-2xl">${item.usdPriceMonth}</span>}
      <span className={twMerge(`h4 text-n-4/50 sm:text-lg ${item.popular && "text-n-4"}`)}>
        /{plan ? "year" : "mo"}
      </span>
    </div>
    <strong className="h6 sm:text-base">{item.subDetail}</strong>
    <div className="base1 text-n-4 sm:text-sm">{item.priceDetails}</div>
    <div
      className={`grow space-y-4 mt-6 pt-6 border-t border-n-3 sm:mt-4 sm:pt-4 sm:space-y-3 dark:border-n-6 ${
        item.popular && "border-n-5 dark:border-n-4/25"
      }`}
    >
      {item.details.map((x: any, index: number) => (
        <div className="flex base2 sm:text-sm" key={index}>
          <Icon
            className={twMerge(`mr-3 fill-n-4/50 sm:mr-2 ${item.popular && "fill-n-4"}`)}
            name="check-circle"
          />
          {x}
        </div>
      ))}
    </div>
    <button
      className={`${item.currentPlan && "opacity-50 pointer-events-none"} ${
        item.popular ? "btn-blue" : "btn-stroke-light"
      } w-full mt-8 sm:mt-6 sm:py-3`}
      onClick={async (e) => {
        e.preventDefault();
        setVisibleSettings(true);
        setCurrentPlan(item.planKey);
      }}
    >
      {item.currentPlan ? "Current Plan" : "Upgrade"}
    </button>
  </div>
</div>
  );
};

export default Package;