import Link from "next/link"

const items = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "How to Ask AI Kundli",
    url: "/how-to-ask-ai-kundli",
  },
  {
    title: "How to Ask Your AI Matchmaking",
    url: "/how-to-ask-ai-matchmaking",
  },
  {
    title: "Pricing",
    url: "/pricing",
  },
  {
    title: "Checkout",
    url: "/checkout",
  },
  {
    title: "Thank you",
    url: "/thanks",
  },
  {
    title: "Updates and FAQ",
    url: "/updates-and-faq",
  },
  {
    title: "Brahma AI",
    url: "/brahma-ai",
  },
  {
    title: "Matchmaking",
    url: "/matchmaking",
  },
  {
    title: "Connect With Astrologer",
    url: "/connect-with-astrologer",
  },
]

const PageListPage = () => {
  return (
    <div className="flex flex-col items-start px-12 py-8 text-xl">
      {items.map((item, index) => (
        <Link
          className="text-n-1 transition-colors hover:text-primary-1 md:text-n-7 dark:text-n-1"
          href={item.url}
          key={index}
        >
          {item.title}
        </Link>
      ))}
    </div>
  )
}

export default PageListPage
