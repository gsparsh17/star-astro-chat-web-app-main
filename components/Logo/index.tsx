import Link from "next/link"
import Image from "@/components/Image"

type TestProps = {
  className?: string
  dark?: boolean
}

const Test = ({ className, dark }: TestProps) => (
  <Link className={`flex w-[11rem] ${className} `} href="/">
    <Image
      className="w-full h-auto dark:fill-black"
      src={dark ? "/images/startastrogpt-dark.svg" : "/images/logo.svg"}
      width={160}
      height={36}
      alt="Star Astro"
    />
  </Link>
)

export default Test
