import Link from "next/link"
import Image from "@/components/Image"
import Icon from "@/components/Icon"
import DeleteUserForm from "./Form"
import Form from "./Form"

const DeleteUserPage = () => {
  return (
    <div className="relative flex min-h-screen lg:p-6 md:px-6 md:pt-16 md:pb-10">
      {/* Left Image and Text Section */}
      <div className="relative shrink-0 w-[40rem] p-20 overflow-hidden 2xl:w-[37.5rem] xl:w-[30rem] xl:p-10 lg:hidden">
        <div className="max-w-[25.4rem]">
          <div className="mb-4 h2 text-n-1">Sorry to See You Go</div>
          <div className="body1 text-n-3">
            We're sad to see you leave. Please confirm if you'd like to delete
            your account. This action is permanent and cannot be undone.
          </div>
        </div>
        <div className="absolute top-52 left-5 right-5 h-[50rem] xl:top-24">
          <Image
            className="object-contain"
            src="/images/create-pic.png"
            fill
            sizes="(max-width: 1180px) 50vw, 33vw"
            alt=""
          />
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex grow items-center justify-center my-6 mr-6 p-10 bg-n-1 rounded-[1.25rem] lg:m-0 md:p-6 dark:bg-n-6">
        <Form />
      </div>

      {/* Close Button */}
      <Link
        className="group absolute top-12 right-12 flex justify-center items-center w-10 h-10 bg-n-2 rounded-full text-0 transition-colors hover:bg-primary-1 md:top-6 md:right-6"
        href="/"
      >
        <Icon
          className="fill-n-7 transition-colors group-hover:fill-n-1"
          name="close"
        />
      </Link>
    </div>
  )
}

export default DeleteUserPage
