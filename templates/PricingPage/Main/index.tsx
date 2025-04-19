import React, { useEffect, useState } from "react";
import axios from "axios";
import MainIndia from "./India";
import MainUS from "./US";
import { useRouter } from "next/router";
import Modal from "@/components/Modal";
import { toast } from "react-hot-toast";

const Main = () => {
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed" | null>(null);
  const router = useRouter();

  // Check for payment status in URL when component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const status = params.get("payment");
      
      if (status === "success" || status === "failed") {
        setPaymentStatus(status);
      }
    }
  }, []);

  // Fetch country code
  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const response = await axios.get(`${process.env.BACKEND_URL}/ip2location`);
        if (response.data.status === "success") {
          setCountryCode(response.data.data.countryCode);
          // setCountryCode("IN"); // For testing purposes
        }
      } catch (error) {
        console.error("Error fetching country code:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountryCode();
  }, []);

  const handleModalClose = () => {
    setPaymentStatus(null);
    if (paymentStatus === "success") {
      router.push("/"); // Navigate to homepage on success
    } else {
      // Clear the payment parameter from URL
      router.replace("/pricing", undefined, { shallow: true });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {countryCode === "IN" ? <MainIndia /> : <MainUS />}
      
      {/* Payment Status Modal */}
      <Modal
        visible={!!paymentStatus}
        onClose={handleModalClose}
        classWrap="max-w-[30rem]"
        classButtonClose="hidden"
      >
        <div className="p-8 text-center">
          {paymentStatus === "success" ? (
            <>
              <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="h4 mb-2">Payment Successful!</h3>
              <p className="body1 text-n-4 mb-6">
                Thank you for your purchase. Your subscription is now active.
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="h4 mb-2">Payment Failed</h3>
              <p className="h5 text-n-4 mb-6">
                We couldn't process your payment. Please try again.
              </p>
            </>
          )}
          <button
            className="btn-blue w-full"
            onClick={handleModalClose}
          >
            {paymentStatus === "success" ? "Go to Homepage" : "Try Again"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Main;