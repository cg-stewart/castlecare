"use client";

import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { useCart } from "@/components/cart/cart-context";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Badge } from "@workspace/ui/components/badge";

// Service data
const servicesData = [
  {
    id: "lawncare",
    name: "Lawncare",
    description:
      "Keep your castle grounds immaculate with our professional lawncare service.",
    icon: ({ className }: { className?: string }) => (
      <div className={cn("p-1 bg-green-100 rounded-full", className)}>
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21 14h-2V8h2v6Zm-4 7h-2V8h2v13Zm-8 0H7V3h2v18Zm-4 0H3v-6h2v6Z" />
        </svg>
      </div>
    ),
    serviceName: "Groundskeeper service",
    tabs: ["0-0.5 acres", "0.6-1 acre", "1+ acres"],
    pricingOptions: [
      {
        id: "groundskeeper-one-time",
        name: "Groundskeeper",
        subtitle: "One-time service for lots up to 0.5 acres",
        price: 75,
        billingPeriod: "one-time",
        features: [
          "Eco-friendly lawn mowing",
          "Edge trimming",
          "Debris removal",
        ],
        isPopular: false,
        type: "lawncare",
      },
      {
        id: "groundskeeper-bi-weekly",
        name: "Bi-Weekly",
        subtitle: "Bi-weekly service for lots up to 0.5 acres",
        price: 125,
        billingPeriod: "month",
        features: [
          "Eco-friendly lawn mowing",
          "Edge trimming",
          "Debris removal",
        ],
        isPopular: true,
        type: "lawncare",
      },
      {
        id: "groundskeeper-one-time-medium",
        name: "Groundskeeper Medium",
        subtitle: "One-time service for lots up to 1 acre",
        price: 120,
        billingPeriod: "one-time",
        features: [
          "Eco-friendly lawn mowing",
          "Edge trimming",
          "Debris removal",
          "Fertilization",
        ],
        isPopular: false,
        type: "lawncare",
      },
      {
        id: "groundskeeper-bi-weekly-medium",
        name: "Bi-Weekly Medium",
        subtitle: "Bi-weekly service for lots up to 1 acre",
        price: 200,
        billingPeriod: "month",
        features: [
          "Eco-friendly lawn mowing",
          "Edge trimming",
          "Debris removal",
          "Fertilization",
        ],
        isPopular: false,
        type: "lawncare",
      },
      {
        id: "groundskeeper-commercial",
        name: "Commercial",
        subtitle: "Professional service for 1+ acres",
        price: 250,
        billingPeriod: "one-time",
        features: [
          "Eco-friendly lawn mowing",
          "Edge trimming",
          "Debris removal",
          "Fertilization",
          "Commercial grade equipment",
        ],
        isPopular: false,
        type: "lawncare",
      },
    ],
  },
  {
    id: "laundry",
    name: "Laundry",
    description:
      "Experience the luxury of freshly laundered garments fit for royalty.",
    icon: ({ className }: { className?: string }) => (
      <div className={cn("p-1 bg-blue-100 rounded-full", className)}>
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 4c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1m11 15-4-4v-2a2 2 0 1 0-4 0v6H6v-6a6 6 0 0 1 6-6c.68 0 1.34.12 1.95.34l-1.5 1.5A3.94 3.94 0 0 0 12 9c-2.2 0-4 1.8-4 4v2l-4 4h14Z" />
        </svg>
      </div>
    ),
    serviceName: "Royal Wash service",
    tabs: ["One-Time Services", "Monthly Subscription"],
    pricingOptions: [
      {
        id: "royal-wash-basic",
        name: "Royal Wash Basic",
        subtitle: "Perfect for regular clothes cleaning",
        price: 35,
        billingPeriod: "per service",
        features: [
          "Wash and fold service",
          "Gentle cycle for delicates",
          "Stain treatment",
        ],
        isPopular: false,
        type: "laundry",
      },
      {
        id: "royal-wash-deluxe",
        name: "Royal Wash Deluxe",
        subtitle: "Comprehensive cleaning including bedding",
        price: 60,
        billingPeriod: "per service",
        features: [
          "Wash and fold service",
          "Gentle cycle for delicates",
          "Stain treatment",
          "Bedding and linens",
          "Priority service",
        ],
        isPopular: false,
        type: "laundry",
      },
      {
        id: "royal-wash-supreme",
        name: "Royal Wash Supreme",
        subtitle: "Premium monthly laundry subscription",
        price: 250,
        billingPeriod: "month",
        features: [
          "Weekly pickup and delivery",
          "Unlimited loads (up to 5 per week)",
          "Premium detergents",
          "Stain treatment",
          "Bedding and linens included",
        ],
        isPopular: true,
        type: "laundry",
      },
    ],
  },
  {
    id: "lighting",
    name: "Lighting",
    description:
      "Brighten your castle with our expert seasonal lighting solutions.",
    icon: ({ className }: { className?: string }) => (
      <div className={cn("p-1 bg-yellow-100 rounded-full", className)}>
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7M9 21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z" />
        </svg>
      </div>
    ),
    serviceName: "Illuminate service",
    tabs: ["Up to 1300 sq ft", "1350-2449 sq ft", "2450+ sq ft"],
    pricingOptions: [
      {
        id: "illuminate-essentials",
        name: "Illuminate Essentials",
        subtitle: "For homes up to 1300 sq ft",
        price: 750,
        billingPeriod: "3 months",
        features: [
          "3 month lease with 3 designs",
          "Choice of red and/or white bulbs",
          "Professional installation",
        ],
        isPopular: false,
        type: "lighting",
      },
      {
        id: "illuminate-plus",
        name: "Illuminate Plus",
        subtitle: "For medium homes up to 2449 sq ft",
        price: 1250,
        billingPeriod: "3 months",
        features: [
          "3 month lease with 4 designs",
          "Full color spectrum",
          "Professional installation",
          "Smart home integration",
        ],
        isPopular: true,
        type: "lighting",
      },
      {
        id: "illuminate-luxury",
        name: "Illuminate Luxury",
        subtitle: "For large homes 2450+ sq ft",
        price: 2000,
        billingPeriod: "3 months",
        features: [
          "3 month lease with 5 designs",
          "Custom programming",
          "Professional installation",
          "Smart home integration",
          "Dedicated account manager",
        ],
        isPopular: false,
        type: "lighting",
      },
    ],
  },
  {
    id: "car-detailing",
    name: "Car Detailing",
    description: "Give your carriage the royal treatment it deserves.",
    icon: ({ className }: { className?: string }) => (
      <div className={cn("p-1 bg-red-100 rounded-full", className)}>
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
        </svg>
      </div>
    ),
    serviceName: "Royal Shine service",
    tabs: ["Car", "Truck", "SUV"],
    pricingOptions: [
      {
        id: "royal-shine-car",
        name: "Royal Shine",
        subtitle: "Professional detailing for standard cars",
        price: 80,
        billingPeriod: "per service",
        features: [
          "Exterior wash and wax",
          "Interior vacuum and wipe-down",
          "Tire shine",
        ],
        isPopular: false,
        type: "car-detailing",
        isComing: true,
      },
      {
        id: "royal-shine-truck",
        name: "Royal Shine Truck",
        subtitle: "Professional detailing for trucks",
        price: 110,
        billingPeriod: "per service",
        features: [
          "Exterior wash and wax",
          "Interior vacuum and wipe-down",
          "Tire shine",
          "Bed cleaning",
        ],
        isPopular: false,
        type: "car-detailing",
        isComing: true,
      },
      {
        id: "royal-shine-suv",
        name: "Royal Shine SUV",
        subtitle: "Professional detailing for SUVs",
        price: 140,
        billingPeriod: "per service",
        features: [
          "Exterior wash and wax",
          "Interior vacuum and wipe-down",
          "Tire shine",
          "Third row cleaning",
        ],
        isPopular: false,
        type: "car-detailing",
        isComing: true,
      },
    ],
  },
];

export default function ServicesSection() {
  const [activeTab, setActiveTab] = useState<Record<string, string>>(() => {
    return servicesData.reduce(
      (acc, service) => {
        if (service.tabs && service.tabs.length > 0) {
          acc[service.id] = service.tabs[0];
        }
        return acc;
      },
      {} as Record<string, string>
    );
  });
  const { addToCart } = useCart();

  const handleAddToCart = (option: any) => {
    addToCart({
      id: option.id,
      name: option.name,
      description: option.subtitle,
      price: option.price,
      type: option.type,
    });
  };

  const getFilteredOptions = (
    service: (typeof servicesData)[0],
    tabIndex: number
  ) => {
    switch (service.id) {
      case "lawncare":
        return tabIndex === 2
          ? [service.pricingOptions[4]] // Show only commercial option for last tab
          : service.pricingOptions.slice(tabIndex * 2, tabIndex * 2 + 2); // Show two cards for first two tabs
      case "laundry":
        return tabIndex === 0
          ? service.pricingOptions.slice(0, 2) // Show first two options for "One-Time Services"
          : [service.pricingOptions[2]]; // Show only the supreme option for "Monthly Subscription"
      default:
        return [service.pricingOptions[tabIndex]]; // For Car Detailing and Lighting, show one per tab
    }
  };

  return (
    <section
      id="services"
      className="w-full py-16 bg-gray-50 dark:bg-[#0f172a]/50"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Our Royal Services</h2>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            Experience fast, affordable, and premium quality home services.
            <span className="block mt-2">
              Your castle deserves nothing but the best.
            </span>
          </p>
        </div>

        <div className="space-y-24">
          {servicesData.map((service, index) => (
            <div
              key={service.id}
              className={`relative ${index % 2 === 1 ? "lg:ml-12" : "lg:mr-12"}`}
            >
              {/* Lime accent background */}
              <div className="absolute inset-0 bg-lime-500/10 rounded-3xl -m-6 z-0"></div>

              <div className="bg-white dark:bg-[#0f172a] rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800 relative z-10">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-lime-500/20 p-3 rounded-lg">
                        {typeof service.icon === "function" ? (
                          <service.icon className="w-8 h-8" />
                        ) : (
                          <img
                            src={service.icon || "/placeholder.svg"}
                            alt={service.name}
                            className="w-8 h-8"
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{service.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {service.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-lime-600 dark:text-lime-500">
                        {service.serviceName}
                      </span>
                    </div>
                  </div>

                  <Tabs
                    defaultValue={activeTab[service.id]}
                    onValueChange={(value) => {
                      setActiveTab((prev) => ({
                        ...prev,
                        [service.id]: value,
                      }));
                    }}
                    className="space-y-4"
                  >
                    <TabsList className="grid grid-cols-3 w-full md:w-auto bg-gray-100 dark:bg-gray-800">
                      {service.tabs.map((tab) => (
                        <TabsTrigger
                          key={tab}
                          value={tab}
                          className="data-[state=active]:bg-lime-500 data-[state=active]:text-[#0f172a] text-[#0f172a] dark:text-white"
                        >
                          {tab}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {service.tabs.map((tab, tabIndex) => (
                      <TabsContent key={tab} value={tab} className="space-y-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {getFilteredOptions(service, tabIndex).map(
                            (option) => (
                              <Card
                                key={option.id}
                                className={`border-2 flex flex-col h-full ${option.isPopular ? "border-lime-500" : "border-gray-200 dark:border-gray-700"}`}
                              >
                                <CardHeader className="pb-3">
                                  {option.isPopular && (
                                    <Badge className="w-fit mb-2 bg-lime-500 text-[#0f172a] hover:bg-lime-600">
                                      Most Popular
                                    </Badge>
                                  )}
                                  <div className="flex items-center gap-2 mb-1">
                                    {service.id === "lawncare" && (
                                      <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded-full">
                                        <svg
                                          className="w-4 h-4"
                                          fill="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path d="M21 14h-2V8h2v6Zm-4 7h-2V8h2v13Zm-8 0H7V3h2v18Zm-4 0H3v-6h2v6Z" />
                                        </svg>
                                      </div>
                                    )}
                                    {service.id === "laundry" && (
                                      <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                                        <svg
                                          className="w-4 h-4"
                                          fill="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path d="M7 4c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1m11 15-4-4v-2a2 2 0 1 0-4 0v6H6v-6a6 6 0 0 1 6-6c.68 0 1.34.12 1.95.34l-1.5 1.5A3.94 3.94 0 0 0 12 9c-2.2 0-4 1.8-4 4v2l-4 4h14Z" />
                                        </svg>
                                      </div>
                                    )}
                                    {service.id === "lighting" && (
                                      <div className="p-1 bg-yellow-100 dark:bg-yellow-900/50 rounded-full">
                                        <svg
                                          className="w-4 h-4"
                                          fill="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7M9 21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z" />
                                        </svg>
                                      </div>
                                    )}
                                    {service.id === "car-detailing" && (
                                      <div className="p-1 bg-red-100 dark:bg-red-900/50 rounded-full">
                                        <svg
                                          className="w-4 h-4"
                                          fill="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                                        </svg>
                                      </div>
                                    )}
                                    <CardTitle>{option.name}</CardTitle>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {option.subtitle}
                                  </p>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                  <div className="text-3xl font-bold mb-4">
                                    ${option.price}
                                    <span className="text-sm font-normal text-muted-foreground">
                                      /{option.billingPeriod}
                                    </span>
                                  </div>
                                  <div className="space-y-2 text-sm">
                                    <p className="font-medium">
                                      This includes:
                                    </p>
                                    <ul className="space-y-2">
                                      {option.features.map((feature, i) => (
                                        <li
                                          key={i}
                                          className="flex items-start gap-2"
                                        >
                                          <Check className="h-4 w-4 text-lime-500 shrink-0 mt-0.5" />
                                          <span>{feature}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </CardContent>
                                <CardFooter>
                                  {option.isComing ? (
                                    <div className="w-full">
                                      <p className="text-sm text-center mb-2">
                                        Coming Soon
                                      </p>
                                      <div className="flex flex-col space-y-2">
                                        <Input
                                          type="email"
                                          placeholder="Enter your email"
                                          className="flex-1 border-lime-500/50 focus-visible:ring-lime-500"
                                        />
                                        <Button className="w-full bg-[#0f172a] hover:bg-[#1e293b] border border-lime-500 text-white">
                                          Notify Me
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <Button
                                      className="w-full bg-[#0f172a] hover:bg-[#1e293b] border border-lime-500 text-white"
                                      onClick={() => handleAddToCart(option)}
                                    >
                                      {option.billingPeriod === "month" ||
                                      option.billingPeriod === "3 months"
                                        ? "Subscribe"
                                        : "Add to Order"}
                                    </Button>
                                  )}
                                </CardFooter>
                              </Card>
                            )
                          )}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
