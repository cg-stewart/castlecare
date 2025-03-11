"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { CartProvider } from "./cart/cart-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    ><CartProvider>
      {children}
    </CartProvider>
      
    </NextThemesProvider>
  )
}
