import { CartProvider } from "@/components/cart/cart-context";
import type { Metadata } from "next";
import DriverHero from "@/components/drive/driver-hero";
import ServiceOptions from "@/components/drive/service-options";
import BenefitsSection from "@/components/drive/benefits-section";
import RequirementsSection from "@/components/drive/requirements-section";
import EarningsCalculator from "@/components/drive/earnings-calculator";
import FutureRoles from "@/components/drive/future-roles";
import DriverFAQ from "@/components/drive/driver-faq";
import AppPreview from "@/components/drive/app-preview";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Drive with CastleCare | Earn on Your Schedule",
  description:
    "Join CastleCare as a service provider. Flexible hours, competitive pay, and opportunities for growth in lawncare, laundry, and lighting services.",
};

export default function DrivePage() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <DriverHero />
          <div className="text-center py-8">
            <Link href="/drive/get-hired">
              <Button className="bg-lime-500 hover:bg-lime-600 text-white text-lg px-8 py-3">
                Start Your Application
              </Button>
            </Link>
          </div>
          <ServiceOptions />
          <BenefitsSection />
          <RequirementsSection />
          <EarningsCalculator />
          <FutureRoles />
          <DriverFAQ />
          <AppPreview />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
