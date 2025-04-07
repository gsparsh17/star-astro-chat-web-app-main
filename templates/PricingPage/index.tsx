import Layout from "@/components/Layout"
import Main from "./Main"
import Faq from "./Faq"
import Checkout from "pages/checkout"

const PricingPage = () => {
  return (
    <Layout smallSidebar hideRightSidebar>
      <Main />
      {/* <Checkout/> */}
      <Faq />
    </Layout>
  )
}

export default PricingPage
