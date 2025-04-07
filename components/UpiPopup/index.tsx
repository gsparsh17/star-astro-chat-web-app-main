import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import Script from "next/script";

type UpiPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  plan: string;
  children?: React.ReactNode;
};

const UpiPaymentPopup = ({ isOpen, onClose, plan }: UpiPopupProps) => {
  const accessToken = localStorage.getItem("accessToken");

  const createRazorpayOrder = async () => {
    try {
      const response = await axios.post(
        `${process.env.BACKEND_URL}/payment/razorpay/order`,
        { plan: plan },
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

  const createStripeOrder = async () => {
    try {
      const response = await axios.post(
        `${process.env.BACKEND_URL}/payment/stripe/order`,
        { plan: plan },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );
      console.log(response.data.data.order_id);
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
        { plan: plan },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );
      console.log(response.data.data.order_id);
      await openPaypalCheckout(response.data.data.paypal_url);
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      throw error;
    }
  };

  const openStripeCheckout = async (stripe_url: string) => {
    window.location.href = stripe_url;
  };

  const openRazorpayCheckout = async (order_id: string) => {
    const options = {
      key: process.env.RAZOR_PAY_KEY_ID,
      amount: 49,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => console.log("Razorpay SDK loaded")}
      />
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-30">
          <div
            className="fixed w-full h-full bg-black bg-opacity-30 z-10"
            onClick={onClose}
          />

          <div className="bg-n-7 p-10 sm:p-4 sm:w-[80%] rounded-2xl gap-4 flex justify-around shadow-xl shadow-black shadow:opacity-5 z-40">
            <div className="flex flex-col items-center">
              <div
                className="bg-gradient-to-b from-[#f0a500] to-[#f08d3d] p-[2px] rounded-xl cursor-pointer"
                onClick={createRazorpayOrder}
              >
                <div className="h-24 w-24 bg-n-7 rounded-xl items-center flex justify-center">
                  <Image
                    src="/images/razorpay.svg"
                    alt="Razorpay Icon"
                    className="p-2"
                    height={70}
                    width={70}
                  />
                </div>
              </div>
              <span className="text-white text-sm mt-4">Razorpay</span>
            </div>

            <div className="flex flex-col items-center">
              <div
                className="bg-gradient-to-b from-[#0080ff] to-[#0059b3] p-[2px] rounded-xl cursor-pointer"
                onClick={createStripeOrder}
              >
                <div className="h-24 w-24 bg-n-7 rounded-xl items-center flex justify-center">
                  <Image
                    src="/images/stripe.svg"
                    alt="Stripe Icon"
                    className="p-2"
                    height={70}
                    width={70}
                  />
                </div>
              </div>
              <span className="text-white text-sm mt-4">Stripe</span>
            </div>

            <div className="flex flex-col items-center">
              <div
                className="bg-gradient-to-b from-[#f0a500] to-[#f08d3d] p-[2px] rounded-xl cursor-pointer"
                onClick={createPaypalOrder}
              >
                <div className="h-24 w-24 bg-n-7 rounded-xl items-center flex justify-center">
                  <Image
                    src="/images/paypal.svg"
                    alt="PayPal Icon"
                    className="p-2"
                    height={70}
                    width={70}
                  />
                </div>
              </div>
              <span className="text-white text-sm mt-4">PayPal</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpiPaymentPopup;