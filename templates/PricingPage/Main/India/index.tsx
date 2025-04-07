import React, { useState } from "react";
import Image from "next/image";
import PaymentPopup from "@/components/PaymentPopup";
import { alternativePrice } from "@/mocks/price";

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
};

const MainIndia = () => {
  const [plans] = useState<Plan[]>(alternativePrice);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const handleOpenPopup = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header Section */}
      <div className="max-w-3xl mx-auto text-center mb-8 md:mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:text-4xl md:text-5xl">
          Choose Your Plan
        </h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6">
          Unlock the Stars: Where Ancient Indian Vedic Astrology Meets NASA's
          Space Intelligence for Perfect Predictions!
        </p>
        <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto"></div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-1 lg:grid-cols-1 gap-6 md:gap-2">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-blue-900/20 ${
              plan.popular
                ? "transform hover:-translate-y-1 md:hover:-translate-y-2 border-2 border-emerald-400 dark:border-emerald-500"
                : "border border-gray-200 dark:border-gray-700"
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 transform rotate-12 translate-x-2 -translate-y-1 z-10">
                POPULAR
              </div>
            )}

            <div
              className={`p-1 h-full ${
                plan.popular
                  ? "bg-gradient-to-br from-emerald-400 to-blue-500 dark:from-emerald-500 dark:to-blue-600"
                  : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700"
              }`}
            >
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 md:p-6 h-full flex flex-col transition-colors duration-300">
                {/* Plan Header */}
                <div className="flex justify-between items-start mb-4 md:mb-6">
                  <div className="flex items-center">
                    <div
                      className={`p-2 md:p-3 rounded-lg ${
                        plan.popular
                          ? "bg-emerald-100 dark:bg-emerald-900/50"
                          : "bg-blue-100 dark:bg-blue-900/50"
                      }`}
                    >
                      <Image
                        src="/images/spark.svg"
                        alt="spark"
                        width={20}
                        height={20}
                        className="w-4 h-4 md:w-5 md:h-5"
                      />
                    </div>
                    <h3
                      className="ml-3 text-lg md:text-lg font-bold"
                      style={{ color: plan.colorTitle }}
                    >
                      {plan.title}
                    </h3>
                  </div>
                  <Image
                    src="/images/arrow.svg"
                    alt="arrow"
                    width={16}
                    height={16}
                    className="w-4 h-4 md:w-1 md:h-1 dark:invert"
                  />
                </div>

                {/* Price */}
                <div className="mb-4 md:mb-6">
                  <div className="flex items-end">
                    <span className="text-3xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      ₹{plan.inrPriceMonth}
                    </span>
                    <span className="text-base md:text-lg text-gray-500 dark:text-gray-400 ml-1">
                      /month
                    </span>
                  </div>
                  {plan.inrDiscountPrice > plan.inrPriceMonth && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                      ₹{plan.inrDiscountPrice}
                    </p>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4 md:mb-6">
                  {plan.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8 flex-grow">
                  {plan.details.map((detail, i) => (
                    <li key={i} className="flex items-start">
                      <svg
                        className={`h-4 w-4 md:h-5 md:w-5 mr-2 mt-0.5 flex-shrink-0 ${
                          plan.popular
                            ? "text-emerald-500 dark:text-emerald-400"
                            : "text-blue-500 dark:text-blue-400"
                        }`}
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
                      <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                        {detail}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  onClick={() => handleOpenPopup(plan)}
                  className={`w-full py-2 md:py-3 px-4 md:px-6 rounded-lg font-medium transition-colors text-sm md:text-base ${
                    plan.popular
                      ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  }`}
                >
                  {plan.currentPlan ? "Current Plan" : "Get Started"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Popup */}
      <PaymentPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        plan={selectedPlan ? selectedPlan.title : ""}
      >
        {selectedPlan && (
          <div className="max-w-md mx-auto p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl">
            <div className="text-center mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedPlan.title} Plan
              </h3>
              <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
              <div className="flex justify-between items-center mb-1 md:mb-2">
                <span className="text-gray-700 dark:text-gray-300">Monthly Price:</span>
                <span className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                  ₹{selectedPlan.inrPriceMonth}
                </span>
              </div>
              {selectedPlan.inrDiscountPrice > selectedPlan.inrPriceMonth && (
                <div className="flex justify-between items-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  <span>Original Price:</span>
                  <span className="line-through">₹{selectedPlan.inrDiscountPrice}</span>
                </div>
              )}
            </div>

            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4 md:mb-6">
              {selectedPlan.description}
            </p>

            <h4 className="font-medium text-gray-900 dark:text-white mb-2 md:mb-3">
              Plan Includes:
            </h4>
            <ul className="space-y-1 md:space-y-2 mb-4 md:mb-6">
              {selectedPlan.details.map((detail, i) => (
                <li key={i} className="flex items-start">
                  <svg
                    className="h-4 w-4 md:h-5 md:w-5 mr-2 text-green-500 dark:text-green-400 flex-shrink-0"
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
                  <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                    {detail}
                  </span>
                </li>
              ))}
            </ul>

            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-colors text-sm md:text-base">
              Proceed to Payment
            </button>
          </div>
        )}
      </PaymentPopup>
    </div>
  );
};

export default MainIndia;