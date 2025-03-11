"use client"

import type React from "react"

import { useState } from "react"
import { format, addDays } from "date-fns"
import { MapPin, Calendar, Clock } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { Calendar as CalendarComponent } from "@workspace/ui/components/calendar"
import ServiceAvailability from "@/components/service-availability"
import { useCart } from "@/components/cart/cart-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@workspace/ui/components/dialog"
import { cn } from "@workspace/ui/lib/utils"


const services = [
  {
    name: "Lawncare",
    icon: ({ className }: { className?: string }) => (
      <div className={cn("p-1 bg-green-100 rounded-full", className)}>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 14h-2V8h2v6Zm-4 7h-2V8h2v13Zm-8 0H7V3h2v18Zm-4 0H3v-6h2v6Z" />
        </svg>
      </div>
    ),
  },
  {
    name: "Laundry",
    icon: ({ className }: { className?: string }) => (
      <div className={cn("p-1 bg-blue-100 rounded-full", className)}>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 4c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1m11 15-4-4v-2a2 2 0 1 0-4 0v6H6v-6a6 6 0 0 1 6-6c.68 0 1.34.12 1.95.34l-1.5 1.5A3.94 3.94 0 0 0 12 9c-2.2 0-4 1.8-4 4v2l-4 4h14Z" />
        </svg>
      </div>
    ),
  },
  {
    name: "Lighting",
    icon: ({ className }: { className?: string }) => (
      <div className={cn("p-1 bg-yellow-100 rounded-full", className)}>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7M9 21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z" />
        </svg>
      </div>
    ),
  },
]

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 || 12
  const amPm = i < 12 ? "AM" : "PM"
  return `${hour}:00 ${amPm}`
})

export default function HeroSection() {
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set())
  const [address, setAddress] = useState("")
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 1))
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(timeSlots[6]) // Default to 6:00 AM
  const { addToCart } = useCart()

  const handleServiceToggle = (serviceName: string) => {
    setSelectedServices((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(serviceName)) {
        newSet.delete(serviceName)
      } else {
        newSet.add(serviceName)
      }
      return newSet
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedServices.size === 0) {
      alert("Please select at least one service")
      return
    }

    if (!address) {
      alert("Please enter your address")
      return
    }

    if (!date) {
      alert("Please select a date")
      return
    }

    // Add services to cart
    selectedServices.forEach((service) => {
      addToCart({
        id: `${service}-${Date.now()}`,
        name: service,
        description: `${service} service on ${format(date, "PPP")} at ${selectedTimeSlot}`,
        price: service === "Lawncare" ? 75 : service === "Laundry" ? 35 : 750,
        type: service,
      })
    })

    // Show confirmation or navigate
    alert("Services added to cart!")
  }

  return (
    <section className="w-full bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side content */}
          <div className="md:w-1/2 space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f172a] leading-tight">
              We're ready to help, what can we do for you?
            </h1>
            <p className="text-lg text-gray-700">
              Select your services and experience prompt, professional care tailored to your needs.
            </p>
            <div className="hidden md:block">
              <ServiceAvailability />
            </div>
          </div>

          {/* Right side form */}
          <div className="md:w-1/2">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5"
            >
              {/* Service selection */}
              <div>
                <Label htmlFor="services" className="text-sm font-semibold mb-2 block">
                  Services
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {services.map((service) => (
                    <button
                      key={service.name}
                      type="button"
                      onClick={() => handleServiceToggle(service.name)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors
                        ${
                          selectedServices.has(service.name)
                            ? "bg-lime-500 text-[#0f172a] border-lime-600 font-semibold"
                            : "bg-muted/30 text-foreground border-gray-200 hover:border-lime-500"
                        }`}
                    >
                      <service.icon
                        className={`w-8 h-8 mb-2 ${selectedServices.has(service.name) ? "text-[#0f172a]" : ""}`}
                      />
                      <span className="text-xs font-medium">{service.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-semibold block">
                  Address
                </Label>
                <div className="relative">
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your address"
                    className="pl-9"
                  />
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>

              {/* Date picker */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-semibold block">
                  Date
                </Label>
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal pl-9">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      {date ? format(date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={(date) => {
                        setDate(date)
                        setIsDatePickerOpen(false)
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time picker */}
              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-semibold block">
                  Time
                </Label>
                <Popover open={isTimePickerOpen} onOpenChange={setIsTimePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal pl-9">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      {selectedTimeSlot}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start">
                    <div className="max-h-[300px] overflow-auto p-1">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            selectedTimeSlot === time && "bg-muted",
                          )}
                          onClick={() => {
                            setSelectedTimeSlot(time)
                            setIsTimePickerOpen(false)
                          }}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Submit button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    type="submit"
                    className="w-full bg-[#0f172a] hover:bg-[#1e293b] border border-lime-500 text-white"
                  >
                    Request Service
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Service Request Summary</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Selected Services:</h4>
                      <ul className="list-disc list-inside">
                        {Array.from(selectedServices).map((service) => (
                          <li key={service}>{service}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Address:</h4>
                      <p>{address || "Not specified"}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Date & Time:</h4>
                      <p>
                        {date ? format(date, "PPP") : "Not specified"} at {selectedTimeSlot}
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </form>

            {/* Mobile service availability */}
            <div className="md:hidden mt-6">
              <ServiceAvailability />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

