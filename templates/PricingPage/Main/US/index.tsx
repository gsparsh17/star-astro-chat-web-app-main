import { useState, useEffect } from "react";
import Radio from "@/components/Radio";
import axios from "axios";
import { featuresPrice } from "@/mocks/price";
import Package from "../Package";
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

type MainProps = {};

const MainUS = ({}: MainProps) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [planType, setPlanType] = useState(false);
  const [countryName, setCountryName] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL1}/plans`);
        const apiPlans: ApiPlan[] = response.data.data;
        
        // Filter out plans with names containing "sub_"
        const filteredPlans = apiPlans.filter(plan => plan.name.includes("sub_")|| plan.name.includes("basic"));
        
        // Transform API data to match our Plan type
        const transformedPlans: Plan[] = filteredPlans.map((plan, index) => ({
          id: `plan-${index}`,
          title: (plan.name!=="basic"?plan.name.slice(4).charAt(0).toUpperCase() + plan.name.slice(5): plan.name.charAt(0).toUpperCase() + plan.name.slice(1)),
          popular: index === 1, // Make second plan popular for example
          description: `${plan.no_of_credit} credits per month`,
          usdPriceMonth: plan.price_usd,
          usdDiscountPrice: plan.price_usd * 0.9, // 10% discount for yearly
          inrPriceMonth: plan.price_inr,
          inrDiscountPrice: plan.price_inr * 0.9, // 10% discount for yearly
          priceYear: plan.price_usd * 10, // 10 months price for yearly
          details:(plan.name==="sub_premium"?[
            "Standard Features",
            "Relationship AI",
            "Perfect Matchmaking",
          ]:[
            "Brahma AI",
            "Career Insights",
            "Numerology AI",
          ]),
          planKey: plan.name,
          colorTitle: index === 1 ? "#FF97E8" : "#3B82F6",
          subDetail: `${plan.no_of_credit} credits`,
          priceDetails: "Billed monthly, cancel anytime"
        }));
        
        setPlans(transformedPlans);
      } catch (error) {
        console.error("Error fetching plans:", error);
        toast.error("Failed to load plans. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const getCountry = async () => {
      try {
        const res = await axios.get(`${process.env.BACKEND_URL}/ip2location`);
        setCountryName(res.data.country_short);
        if (process.env.NODE_ENV === "development") {
          setCountryName("US"); // Default to US for this component
        }
      } catch (error) {
        console.error("Error fetching country:", error);
      }
    };

    fetchPlans();
    getCountry();
  }, []);

  if (loading) {
    return (
      <div className="py-32 px-15 bg-n-2 rounded-t-[1.25rem] 2xl:py-20 2xl:px-10 xl:px-8 md:rounded-none dark:bg-n-6">
        <div className="max-w-[75.25rem] mx-auto text-center">
          <div className="h4">Loading plans...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-32 px-15 bg-n-2 rounded-t-[1.25rem] 2xl:py-20 2xl:px-40 xl:px-8 md:rounded-none dark:bg-n-6">
      <div className="max-w-[75.25rem] mx-auto">
        <div className="mb-20 text-center 2xl:mb-16 lg:mb-10">
          <div className="mb-4 h2 lg:h4">AI chat made affordable</div>
          <div className="body1 lg:text-lg text-n-4">Pricing Plans for every budget</div>
        </div>
        <div className="flex mb-20 py-4 2xl:block 2xl:py-0 lg:mb-0">
          {/* <div className="w-[14.875rem] pt-8 pr-6 2xl:w-full 2xl:mb-20 2xl:pt-0 2xl:pr-0 lg:mb-10">
            <div className="mb-6 h4 2xl:mb-5 2xl:text-center">Choose plan</div>
            <div className="2xl:flex 2xl:justify-center">
              <Radio
                className="mb-4 2xl:mb-0 2xl:mr-4"
                name="plan"
                value={true}
                checked={planType}
                onChange={() => setPlanType(true)}
                content="Yearly billing"
              />
              <Radio
                name="plan"
                value={false}
                checked={!planType}
                onChange={() => setPlanType(false)}
                content="Monthly billing"
              />
            </div>
          </div> */}
          <div className="flex grow lg:grid lg:scroll-smooth lg:scrollbar-none lg:py-6 lg:gap-4 lg:before:shrink-0 lg:before:w-8 lg:after:shrink-0 lg:after:w-8">
            {plans.map((item) => (
              <Package 
                item={item} 
                plan={planType} 
                key={item.id} 
                countryName={countryName}
              />
            ))}
          </div>
        </div>
        <Features items={featuresPrice} />
      </div>
    </div>
  );
};

export default MainUS;