import { Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import Providers from "@/components/providers"
import { CartProvider } from "@/components/cart/cart-context"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "@workspace/ui/components/sonner"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import ClerkRedirectHandler from "@/components/clerk-redirect-handler"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
        >
          <Providers>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
            <ClerkRedirectHandler />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
