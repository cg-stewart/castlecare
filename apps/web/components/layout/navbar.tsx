"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, ShoppingCart, Castle } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { useCart } from "@/components/cart/cart-context"
import { Sheet, SheetContent, SheetTrigger } from "@workspace/ui/components/sheet"

const navLinks = [
  { name: "Services", href: "#services" },
  { name: "Homes", href: "#homes" },
  { name: "Drive", href: "/drive" },
  { name: "About", href: "/about" },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cart, totalItems } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0f172a] text-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Castle className="h-8 w-8 text-lime-500" />
            <span className="hidden text-xl font-bold sm:inline-block">CASTLECARE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-lime-500"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2">
            {/* Cart */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5 text-white" />
                  {totalItems > 0 && (
                    <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-lime-500 text-xs font-bold">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-md sm:max-w-lg">
                <div className="flex h-full flex-col">
                  <div className="flex-1 overflow-auto py-4">
                    <h3 className="text-lg font-semibold">Your Cart</h3>
                    {cart.length === 0 ? (
                      <div className="flex h-full items-center justify-center">
                        <p className="text-muted-foreground">Your cart is empty</p>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-3 flex-1">
                              {item.type === "lawncare" && (
                                <div className="p-1 bg-green-100 dark:bg-green-900 rounded-full">
                                  <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M21 14h-2V8h2v6Zm-4 7h-2V8h2v13Zm-8 0H7V3h2v18Zm-4 0H3v-6h2v6Z" />
                                  </svg>
                                </div>
                              )}
                              {item.type === "laundry" && (
                                <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded-full">
                                  <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M7 4c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1m11 15-4-4v-2a2 2 0 1 0-4 0v6H6v-6a6 6 0 0 1 6-6c.68 0 1.34.12 1.95.34l-1.5 1.5A3.94 3.94 0 0 0 12 9c-2.2 0-4 1.8-4 4v2l-4 4h14Z" />
                                  </svg>
                                </div>
                              )}
                              {item.type === "lighting" && (
                                <div className="p-1 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                                  <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7M9 21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z" />
                                  </svg>
                                </div>
                              )}
                              {item.type === "car-detailing" && (
                                <div className="p-1 bg-red-100 dark:bg-red-900 rounded-full">
                                  <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                                  </svg>
                                </div>
                              )}
                              <div>
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                              </div>
                            </div>
                            <p className="font-medium">${item.price}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="border-t pt-4">
                    <Button className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white">
                      Checkout (${cart.reduce((total, item) => total + item.price, 0)})
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Auth buttons */}
            <div className="hidden items-center space-x-2 md:flex">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:text-lime-500">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-[#0f172a] border border-lime-500 hover:bg-[#1e293b] text-white">Sign Up</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="flex flex-col space-y-3 border-t border-blue-800 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-2">
                <Link href="/login">
                  <Button variant="outline" className="w-full justify-start border-blue-700 text-white">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full justify-start bg-[#0f172a] border border-lime-500 hover:bg-[#1e293b] text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

