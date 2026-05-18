import { Inter, Space_Grotesk } from 'next/font/google'
import "./globals.css"
import ToastProvider from "@/components/ToastProvider";

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading' })

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-noise">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}