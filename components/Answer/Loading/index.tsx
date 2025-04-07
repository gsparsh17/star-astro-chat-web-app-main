type LoadingProps = {}

const Loading = ({}: LoadingProps) => (
  <div className="">
    <div className="flex items-center space-x-1.5 h-1">
      <p className="mr-1 pt-5">AI astrologer looking through your cosmic chart</p>
      <div className="flex mt-6 gap-1">
      <div className="w-2 h-2 rounded-full bg-n-7 animate-[loaderDots_0.6s_0s_infinite_alternate] dark:bg-n-1"></div>
      <div className="w-2 h-2 rounded-full bg-n-7 animate-[loaderDots_0.6s_0.3s_infinite_alternate] dark:bg-n-1"></div>
      <div className="w-2 h-2 rounded-full bg-n-7 animate-[loaderDots_0.6s_0.6s_infinite_alternate] dark:bg-n-1"></div>
      </div>
    </div>
  </div>
)

export default Loading
