import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Castle } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

const footerLinks = [
  {
    title: "Services",
    links: [
      { name: "Lawncare", href: "#lawncare" },
      { name: "Laundry", href: "#laundry" },
      { name: "Lighting", href: "#lighting" },
      { name: "Car Detailing", href: "#car-detailing" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "#about" },
      { name: "Careers", href: "/drive" },
      { name: "Blog", href: "#blog" },
      { name: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Properties",
    links: [
      { name: "Residential", href: "#residential" },
      { name: "Commercial", href: "#commercial" },
      { name: "Multi-Unit", href: "#multi-unit" },
      { name: "Customization", href: "#customization" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Terms of Service", href: "#terms" },
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Cookie Policy", href: "#cookies" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Logo and contact info */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <Castle className="h-8 w-8 text-lime-500" />
              <span className="text-xl font-bold">CASTLECARE</span>
            </Link>

            <p className="text-gray-400 max-w-md">
              Experience the royal treatment for your home with our professional services. From lawn care to laundry,
              we've got you covered.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-lime-500" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-lime-500" />
                <span>support@castlecare.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-lime-500" />
                <span>123 Royal Court, Kingdom City</span>
              </div>
            </div>

            {/* Social media */}
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-lime-500 transition-colors">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-lime-500 transition-colors">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-lime-500 transition-colors">
                <Twitter className="h-6 w-6" />
              </Link>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-400 hover:text-lime-500 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">Subscribe to our newsletter</h3>
              <p className="text-gray-400">Stay updated with our latest services and offers</p>
            </div>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 focus-visible:ring-lime-500"
              />
              <Button className="bg-lime-500 hover:bg-lime-600 text-[#0f172a] font-medium">Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} CastleCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

