import HeroSection from "@/components/home/hero-section"
import PropertiesSection from "@/components/home/properties-section"
import ServicesSection from "@/components/home/services-section"
import Footer from "@/components/layout/footer"
import Navbar from "@/components/layout/navbar"
import { Button } from "@workspace/ui/components/button"

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <HeroSection />
      <ServicesSection />
      <PropertiesSection />
    </main>
    <Footer />
  </div>
  )
}
