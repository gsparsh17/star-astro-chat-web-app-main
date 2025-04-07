import Layout from "@/components/Layout"
import Main from "./Main"
import EditProfile from "@/components/Settings/EditProfile"
const HomePage = () => {
  let datapresent = true
  return (
    <Layout>
      {datapresent ? (
        <Main />
      ) : (
        <>
          <div
            className="fixed inset-0 bg-n-7/75 dark:bg-n-6/90 md:bg-n-1 opacity-100 z-[100]"
            aria-hidden="true"
          ></div>
          <div
            className="relative z-10 w-full m-auto bg-n-1 rounded-3xl dark:bg-n-7 undefined max-w-[48rem] md:min-h-screen-ios md:rounded-none opacity-100 scale-100"
            data-headlessui-state="open"
          >
            <div className="p-12 lg:px-8 md:pt-16 md:px-5 md:pb-8">
              <div className="flex md:block">
                <div className="grow pl-12 md:pl-0">
                  <EditProfile />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  )
}

export default HomePage