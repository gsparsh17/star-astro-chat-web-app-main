import React, { useEffect, useState } from "react";
import axios from "axios";
import MainIndia from "./India";
import MainUS from "./US";

const Main = () => {
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const response = await axios.get(`${process.env.BACKEND_URL}/ip2location`);
        console.log("response", response);
        if (response.data.status === "success") {
          setCountryCode(response.data.data.countryCode);
          // setCountryCode("IN"); // For testing purposes, set to "IN"
        }
      } catch (error) {
        console.error("Error fetching country code:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountryCode();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return countryCode === "IN" ? <MainIndia /> : <MainUS />;
};

export default Main;
