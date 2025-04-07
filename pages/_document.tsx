import { Html, Head, Main, NextScript } from "next/document"
import Script from "next/script"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#da532c" />

        <meta
          name="google-adsense-account"
          content="ca-pub-2506553757507867"
        ></meta>

        {/* Add your SEO meta tags here */}
        <meta
          name="description"
          content="Unlock the Stars: Where Ancient Indian Vedic Astrology Meets NASA's Space Intelligence for Perfect Predictions! Star Astro"
        />
        <meta
          name="keywords"
          content="astrology, Advanced, predictions, Star Astro"
        />
        <meta name="author" content="Rajiv Ishrani" />

        {/* Open Graph and Twitter Card meta tags */}
        <meta property="og:title" content="Star Astro" />
        <meta
          property="og:description"
          content="Unlock the Stars: Where Ancient Indian Vedic Astrology Meets NASA's Space Intelligence for Perfect Predictions! Star Astro"
        />
        <meta
          property="og:image"
          content="https://starastrogpt.com/images/starastro-og.png"
        />
        <meta property="og:url" content="https://starastrogpt.com" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="Star Astro" />
        <meta name="twitter:site" content="@star_astro1" />
        <meta name="twitter:title" content="Star Astro" />
        <meta
          name="twitter:description"
          content="Unlock the Stars: Where Ancient Indian Vedic Astrology  Meets  NASA's Space Intelligence for Perfect Predictions!"
        />
        <meta
          name="twitter:image"
          content="https://starastrogpt.com/images/starastro-og.png"
        />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        {/* <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places`}
        ></script> */}
      </Head>
      <body>
        <Main />
        <NextScript />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.GOOGLE_ANALYTICS_TRACKING_ID}');
          `}
        </Script>
        {/* <Script
          id="Adsense-id"
          strategy="beforeInteractive"
          data-ad-client={process.env.ADSENSE_CLIENT_ID}
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        /> */}
      </body>
    </Html>
  )
}
