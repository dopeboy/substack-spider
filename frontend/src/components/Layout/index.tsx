import Navbar from "@/components/Navbar";
import { Metadata } from "next";

import { Inter } from 'next/font/google'
 
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Substack spider",
  description: "Search substack articles",
};

 
export default function RootLayout({ children }: {children: React.ReactNode}) {
  return (
    <div className={inter.className}>
      <Navbar />
      <main className="p-4 md:px-16">{children}</main>
    </div>
  )
}