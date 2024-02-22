import RootLayout from "@/components/Layout";
import "./globals.css"
import Head from "next/head";

export default function MyApp({ Component, pageProps }: { Component: React.ElementType, pageProps: any }) {
  return (
    <RootLayout>
      <Head>
        <title>Substack Spider</title>
      </Head>
      <Component {...pageProps} />
    </RootLayout>
  )
}