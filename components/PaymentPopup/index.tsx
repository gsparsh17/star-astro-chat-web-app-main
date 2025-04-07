"use client";
import Image from "next/image";
import React, { useState } from "react";
import UpiPaymentPopup from "../UpiPopup";
import axios from "axios";
import Script from "next/script";

type PopupProps = {
  isOpen: boolean;
  onClose: () => void;
  plan: any;
  children: React.ReactNode;
};

const PaymentPopup = ({ isOpen, onClose, plan, children }: PopupProps) => {
  if (!isOpen) return null;
  const [isUpiPopupOpen, setIsUpiPopupOpen] = useState(false);
  const handleOpenUpiPopup = () => setIsUpiPopupOpen(true);
  const handleCloseUpiPopup = () => setIsUpiPopupOpen(false);
  const [hasPromoCode, setHasPromoCode] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  const accessToken = localStorage.getItem("accessToken");

  const createRazorpayOrder = async () => {
    try {
      const response = await axios.post(
        `${process.env.BACKEND_URL}/payment/razorpay/order`,
        { plan: "basic" },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );
      await openRazorpayCheckout(response.data.data.order_id);
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      throw error;
    }
  };

  const openRazorpayCheckout = async (order_id: string) => {
    const options = {
      key: process.env.RAZOR_PAY_KEY_ID,
      amount: plan.price_inr,
      currency: "INR",
      name: "StarAstro",
      description: "Purchase Plan",
      order_id: order_id,
      handler: async function (response: any) {
        await verifyPayment(response.razorpay_order_id);
      },
      theme: {
        color: "#F37254",
      },
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const createStripeOrder = async () => {
    try {
      const response = await axios.post(
        `${process.env.BACKEND_URL}/payment/stripe/order?redirect=web`,
        { plan: "basic" },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );
      await openStripeCheckout(response.data.data.stripe_url);
    } catch (error) {
      console.error("Error creating Stripe order:", error);
      throw error;
    }
  };

  const createPaypalOrder = async () => {
    try {
      const response = await axios.post(
        `${process.env.BACKEND_URL}/payment/paypal/order`,
        { plan: "basic" },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );
      await openPaypalCheckout(response.data.data.paypal_url);
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      throw error;
    }
  };

  const openStripeCheckout = async (stripe_url: string) => {
    window.location.href = stripe_url;
  };

  const openPaypalCheckout = async (paypal_url: string) => {
    window.location.href = paypal_url;
  };

  const verifyPayment = async (orderId: string) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${process.env.BACKEND_URL}/payment/verify/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.status === "success") {
        console.log("Payment verified successfully:", response.data);
      } else {
        console.error("Payment verification failed:", response.data);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => console.log("Razorpay SDK loaded")}
      />
      <div
        className="fixed w-full h-full bg-black bg-opacity-30 z-10"
        onClick={onClose}
      />
      <div className="bg-n-7 p-8 rounded-2xl shadow-xl shadow-black/50 z-20 w-full max-w-md mx-4 sm:mx-2 sm:p-6">
        <div className="text-center">
          <h1 className="font-semibold text-n-3 mb-6 text-xl sm:text-lg">PAYMENT MODE</h1>
          <div className="flex gap-4 justify-center sm:gap-3">
            {/* UPI Payment Option */}
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-b from-[#33cfff] via-[#aa67ba72] to-[#403c4136] p-[2px] rounded-xl">
                <div
                  className="h-20 w-20 sm:h-16 sm:w-16 bg-n-7 rounded-xl items-center flex justify-center cursor-pointer hover:bg-n-6 transition-colors"
                  onClick={createRazorpayOrder}
                >
                  <Image
                    src="/images/upi.svg"
                    alt="UPI-Icon"
                    className="p-2"
                    height={56}
                    width={56}
                  />
                </div>
              </div>
              <span className="text-white text-sm mt-3 sm:mt-2">UPI</span>
            </div>

            {/* Card Payment Option */}
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-b from-[#33cfff] via-[#aa67ba72] to-[#403c4136] p-[2px] rounded-xl">
                <div
                  className="h-20 w-20 sm:h-16 sm:w-16 bg-n-7 rounded-xl items-center flex justify-center cursor-pointer hover:bg-n-6 transition-colors"
                  onClick={createStripeOrder}
                >
                  <Image
                    src="/images/card.svg"
                    alt="Card-Icon"
                    className="p-2"
                    height={56}
                    width={56}
                  />
                </div>
              </div>
              <span className="text-white text-sm mt-3 sm:mt-2">Card</span>
            </div>

            {/* PayPal Payment Option */}
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-b from-[#33cfff] via-[#aa67ba72] to-[#403c4136] p-[2px] rounded-xl">
                <div
                  className="h-20 w-20 sm:h-16 sm:w-16 bg-n-7 rounded-xl items-center flex justify-center cursor-pointer hover:bg-n-6 transition-colors"
                  onClick={createPaypalOrder}
                >
                  <Image
                    src="/images/paypal.svg"
                    alt="PayPal Icon"
                    className="p-2"
                    height={56}
                    width={56}
                  />
                </div>
              </div>
              <span className="text-white text-sm mt-3 sm:mt-2">PayPal</span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-n-4 text-sm sm:text-xs">* SELECT ONE</p>

        {/* Promo Code Section */}
        <div className="mt-6 sm:mt-4">
          <span
            className="text-blue-400 text-base sm:text-sm cursor-pointer hover:underline"
            onClick={() => setHasPromoCode(!hasPromoCode)}
          >
            Have a promo code?
          </span>
          {hasPromoCode && (
            <div className="mt-2 flex items-center gap-2 sm:flex-col sm:items-stretch">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="p-2 w-full border border-n-5 rounded-md bg-n-8 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              />
              <button
                onClick={() => {}}
                className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors sm:w-full sm:py-2"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        <UpiPaymentPopup
          isOpen={isUpiPopupOpen}
          onClose={handleCloseUpiPopup}
          plan={plan}
        />
      </div>
    </div>
  );
};

export default PaymentPopup;