import { Scissors, Shirt, Lightbulb } from "lucide-react"

const services = [
  { name: "Lawn", icon: Scissors, hours: "6am-8pm", days: "Monday-Sunday" },
  { name: "Laundry", icon: Shirt, hours: "24/7", days: "Monday-Sunday" },
  {
    name: "Lighting",
    icon: Lightbulb,
    hours: "6am-8pm",
    days: "Monday-Sunday",
  },
]

export default function ServiceAvailability() {
  const currentHour = new Date().getHours()
  const isOpen = (service: (typeof services)[0]) => {
    if (service.name === "Laundry") return true
    return currentHour >= 6 && currentHour < 20
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3 text-foreground">Service Availability:</h3>
      <div className="grid grid-cols-2 gap-4">
        {services.map((service) => (
          <div key={service.name} className="flex items-center space-x-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isOpen(service) ? "bg-green-500" : "bg-red-500"}`}></div>
            <service.icon className="w-4 h-4 text-foreground" />
            <span className="text-foreground font-medium">{service.name}</span>
            <span className="text-muted-foreground text-sm">{service.hours}</span>
          </div>
        ))}
      </div>
    </div>
  )
}