"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { ArrowRight, Castle } from "lucide-react";

export default function DriverHero() {
  const [activeTab, setActiveTab] = useState("signup");

  return (
    <section className="relative bg-white dark:bg-[#0f172a] overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat"></div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400 px-4 py-1.5 rounded-full text-sm font-medium">
              <Castle className="h-4 w-4" />
              <span>Join the CastleCare Team</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Provide Royal Service,
              <span className="text-lime-500 block">Earn Like Royalty</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl">
              Join CastleCare as a service provider and earn on your own
              schedule. Choose from lawncare, laundry, or lighting installation
              services.
            </p>

            <Tabs
              defaultValue="signup"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full max-w-md"
            >
              <TabsList className="grid grid-cols-2 w-full bg-gray-100 dark:bg-gray-800">
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-lime-500 data-[state=active]:text-[#0f172a]"
                >
                  New Provider
                </TabsTrigger>
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-lime-500 data-[state=active]:text-[#0f172a]"
                >
                  Existing Provider
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signup" className="mt-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="bg-[#0f172a] hover:bg-[#1e293b] border border-lime-500 text-white flex-1"
                    onClick={() =>
                      document
                        .getElementById("service-options")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-lime-500 text-[#0f172a] dark:text-white hover:bg-lime-500/10 flex-1"
                    onClick={() =>
                      document
                        .getElementById("earnings-calculator")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Calculate Earnings
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="login" className="mt-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="bg-[#0f172a] hover:bg-[#1e293b] border border-lime-500 text-white flex-1"
                  >
                    Provider Login
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-lime-500 text-[#0f172a] dark:text-white hover:bg-lime-500/10 flex-1"
                  >
                    Download App
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-xl">
            <Image
              src="/placeholder.svg?height=500&width=600"
              alt="CastleCare Service Provider"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 text-white">
                <p className="text-2xl font-bold">
                  "I set my own hours and earn great income"
                </p>
                <p className="mt-2">James K. - Lawncare Provider since 2023</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
