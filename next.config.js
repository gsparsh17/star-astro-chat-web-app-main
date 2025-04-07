/** @type {import('next').NextConfig} */

const dotenv = require("dotenv")
dotenv.config()

const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ["lh3.googleusercontent.com","www.gravatar.com"]
     // to allow google oauth user profilePic
  },
  env: {
    ENV: process.env.ENV,
    LANDING_PAGE: process.env.LANDING_PAGE,
    IS_MAINTENANCE: process.env.IS_MAINTENANCE,
    BACKEND_URL: process.env.BACKEND_URL,
    GEOCODER_URL:process.env.GEOCODER_URL,
    BACKEND_PLANS_URL: process.env.BACKEND_PLANS_URL,
    RAZOR_PAY_KEY_ID:process.env.RAZOR_PAY_KEY_ID,
    RAZOR_PAY_KEY_SECRET:process.env.RAZOR_PAY_KEY_SECRET,
    REDIRECT_URL: process.env.REDIRECT_URL,
    GOOGLE_ANALYTICS_TRACKING_ID: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
    ADSENSE_CLIENT_ID: process.env.ADSENSE_CLIENT_ID
  }
}

module.exports = nextConfig
