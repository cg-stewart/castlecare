"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"

const services = [
  {
    id: "lawncare",
    name: "Lawncare",
    description: "Provide professional lawn maintenance services",
    icon: ({ className }: { className?: string }) => (
      <div className={cn("p-1 bg-green-100 rounded-full", className)}>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 14h-2V8h2v6Zm-4 7h-2V8h2v13Zm-8 0H7V3h2v18Zm-4 0H3v-6h2v6Z" />
        </svg>
      </div>
    ),
    earnings: "$20-35/hr",
    requirements: ["Valid driver's license", "Own vehicle", "Lawn equipment", "Background check"],
    perks: ["Flexible schedule", "Keep 80% of service fee", "Weekly payouts", "Equipment subsidies available"],
  },
  {
    id: "laundry",
    name: "Laundry",
    description: "Provide wash & fold laundry services",
    icon: ({ className }: { className?: string }) => (
      <div className={cn("p-1 bg-blue-100 rounded-full", className)}>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 4c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1m11 15-4-4v-2a2 2 0 1 0-4 0v6H6v-6a6 6 0 0 1 6-6c.68 0 1.34.12 1.95.34l-1.5 1.5A3.94 3.94 0 0 0 12 9c-2.2 0-4 1.8-4 4v2l-4 4h14Z" />
        </svg>
      </div>
    ),
    earnings: "$18-30/hr",
    requirements: ["Valid driver's license", "Own vehicle", "Background check", "Access to washer/dryer"],
    perks: ["Flexible schedule", "Keep 75% of service fee", "Daily payouts available", "Laundry supplies provided"],
  },
  {
    id: "lighting",
    name: "Lighting",
    description: "Install and maintain decorative lighting",
    icon: ({ className }: { className?: string }) => (
      <div className={cn("p-1 bg-yellow-100 rounded-full", className)}>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7M9 21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z" />
        </svg>
      </div>
    ),
    earnings: "$25-40/hr",
    requirements: [
      "Valid driver's license",
      "Own vehicle",
      "Background check",
      "Basic electrical knowledge",
      "Comfortable with heights",
    ],
    perks: [
      "Seasonal work (high demand)",
      "Keep 70% of service fee",
      "Weekly payouts",
      "All equipment provided",
      "Training available",
    ],
  },
]

export default function ServiceOptions() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, this would submit the form data to a server
    setFormSubmitted(true)
  }

  return (
    <section id="service-options" className="py-16 bg-gray-50 dark:bg-[#0f172a]/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Service Area</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Select the service you'd like to provide and start earning. You can choose one or multiple service areas
            based on your skills and preferences.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {services.map((service) => (
            <Card
              key={service.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md border-2",
                selectedService === service.id
                  ? "border-lime-500 dark:border-lime-500"
                  : "border-gray-200 dark:border-gray-700",
              )}
              onClick={() => setSelectedService(service.id)}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {typeof service.icon === "function" ? <service.icon className="w-8 h-8" /> : null}
                  <CardTitle>{service.name}</CardTitle>
                </div>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Potential Earnings</p>
                  <p className="text-2xl font-bold text-lime-600 dark:text-lime-500">{service.earnings}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Requirements</p>
                  <ul className="text-sm list-disc pl-5 space-y-1">
                    {service.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Perks</p>
                  <ul className="text-sm list-disc pl-5 space-y-1">
                    {service.perks.map((perk, i) => (
                      <li key={i}>{perk}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className={cn(
                    "w-full",
                    selectedService === service.id
                      ? "bg-lime-500 hover:bg-lime-600 text-[#0f172a]"
                      : "bg-[#0f172a] hover:bg-[#1e293b] border border-lime-500 text-white",
                  )}
                  onClick={() => setSelectedService(service.id)}
                >
                  {selectedService === service.id ? "Selected" : "Select"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Application Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-lime-500/20">
            <CardHeader>
              <CardTitle>Apply to Become a Service Provider</CardTitle>
              <CardDescription>
                Fill out the form below to start your application process. We'll contact you within 1-2 business days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-lime-100 dark:bg-lime-900/30 text-lime-600 dark:text-lime-400 mb-4">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Application Submitted!</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Thank you for your interest in becoming a CastleCare service provider. We'll review your application
                    and contact you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" required />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" required />
                  </div>

                  <div className="space-y-2">
                    <Label>Service Preference</Label>
                    <RadioGroup defaultValue={selectedService || undefined} required>
                      {services.map((service) => (
                        <div key={service.id} className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={service.id}
                            id={service.id}
                            checked={selectedService === service.id}
                            onChange={() => setSelectedService(service.id)}
                            className="text-lime-500 focus:ring-lime-500"
                          />
                          <Label htmlFor={service.id} className="cursor-pointer">
                            {service.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Relevant Experience</Label>
                    <Textarea
                      id="experience"
                      placeholder="Tell us about any relevant experience you have in this service area"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability</Label>
                    <Textarea
                      id="availability"
                      placeholder="What days and hours are you typically available to work?"
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#0f172a] hover:bg-[#1e293b] border border-lime-500 text-white"
                  >
                    Submit Application
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

