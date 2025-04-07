import Icon from "@/components/Icon"

const details = [
  "An AI chatbot that can understand your queries",
  "Personalized recommendations based on your preferences",
  "Ability to explore the app and its features without any cost",
]

type DetailsProps = {}

const Details = ({}: DetailsProps) => (
  <>
    <div className="flex justify-between items-center mb-1">
      <div className="h5 text-[#139843]">Enterprise</div>
      <div className="shrink-0 ml-4 px-3 py-0.5 bg-[#FF97E8] rounded caption1 font-semibold text-n-7">
        Popular
      </div>
    </div>
    <div className="base1 font-semibold">
      <a
        className="text-n-1 hover:text-color-2"
        href="mailto:info@starastrogpt.com"
      >
        Contact us
      </a>
      {/* $399<span className="ml-4 text-n-4">Monthly Plan</span> */}
    </div>
    <div className="mt-8 pt-8 space-y-5 border-t border-n-4/25 lg:hidden">
      {details.map((x: any, index: number) => (
        <div className="flex base2" key={index}>
          <Icon className="mr-3 fill-primary-1" name="check-circle" />
          {x}
        </div>
      ))}
    </div>
  </>
)

export default Details
