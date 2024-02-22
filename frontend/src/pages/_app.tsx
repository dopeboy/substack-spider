import RootLayout from "@/components/Layout";

export default function MyApp({ Component, pageProps }: { Component: React.ElementType, pageProps: any }) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  )
}