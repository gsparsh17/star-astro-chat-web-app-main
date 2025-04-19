import Layout from "@/components/Layout"
import Main from "./Main"
import Faq from "./Faq"
import Checkout from "pages/checkout"
import Credits from "@/components/Settings/Credit"

const PricingPage = () => {
  return (
    <Layout smallSidebar hideRightSidebar>
      <div className="pt-5 flex justify-center items-center"><Credits /></div>
      <Main />
      {/* <Checkout/> */}
      <Faq />
    </Layout>
  )
}

export default PricingPage
