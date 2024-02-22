import "./globals.css"
import Navbar from "@/components/Navbar";

import { Inter } from 'next/font/google'
 
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})
 
export default function RootLayout({ children }) {
  return (
    <div className={inter.className}>
      <Navbar />
      <main className="p-4 md:px-16">{children}</main>
    </div>
  )
}