"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { CartProvider } from "./cart/cart-context"
import AuthProvider from "@/contexts/auth-context"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      enableColorScheme
    >
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </NextThemesProvider>
  )
}
