import { Button } from "@workspace/ui/components/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card"
import { Switch } from "@workspace/ui/components/switch"
import { Label } from "@workspace/ui/components/label"

const properties = [
  {
    id: "residential",
    name: "Residential",
    description: "Our signature 1 bed, 1 bath residential unit",
    price: 40000,
    image: "/placeholder.svg?height=300&width=500",
    floorPlan: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "commercial",
    name: "Commercial",
    description: "Versatile commercial space for small businesses",
    price: 65000,
    image: "/placeholder.svg?height=300&width=500",
    floorPlan: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "multi-unit",
    name: "Multi-Unit",
    description: "Efficient multi-family living spaces",
    price: 85000,
    image: "/placeholder.svg?height=300&width=500",
    floorPlan: "/placeholder.svg?height=300&width=300",
  },
]

const addons = [
  {
    id: "empty-container",
    name: "Empty Container",
    description: "Additional space for customization",
    price: 8000,
  },
]

const exteriorColors = [
  { id: "white", name: "Standard White", price: 0 },
  { id: "earth", name: "Earth Tone", price: 500 },
  { id: "slate", name: "Modern Slate", price: 500 },
  { id: "blue", name: "Colonial Blue", price: 700 },
]

export default function PropertiesSection() {
  return (
    <section id="homes" className="w-full py-16 bg-white dark:bg-[#0f172a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our CastleCare Properties</h2>
          <p className="text-xl text-muted-foreground">
            Choose from our selection of modular homes and commercial spaces
          </p>
        </div>

        <Tabs defaultValue="residential" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger
              value="residential"
              className="data-[state=active]:bg-lime-500 data-[state=active]:text-[#0f172a]"
            >
              Residential
            </TabsTrigger>
            <TabsTrigger
              value="commercial"
              className="data-[state=active]:bg-lime-500 data-[state=active]:text-[#0f172a]"
            >
              Commercial
            </TabsTrigger>
            <TabsTrigger
              value="multi-unit"
              className="data-[state=active]:bg-lime-500 data-[state=active]:text-[#0f172a]"
            >
              Multi-Unit
            </TabsTrigger>
          </TabsList>

          {properties.map((property) => (
            <TabsContent key={property.id} value={property.id} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Property Images */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <img
                        src={property.image || "/placeholder.svg"}
                        alt={property.name}
                        className="w-full h-auto rounded-lg object-cover"
                      />
                    </div>
                    <div>
                      <img
                        src={property.floorPlan || "/placeholder.svg"}
                        alt="Floor Plan"
                        className="w-full h-auto rounded-lg object-cover"
                      />
                      <p className="text-sm text-center mt-2 text-muted-foreground">Floor Plan</p>
                    </div>
                    <div>
                      <img
                        src="/placeholder.svg?height=200&width=200"
                        alt="Interior View"
                        className="w-full h-auto rounded-lg object-cover"
                      />
                      <p className="text-sm text-center mt-2 text-muted-foreground">Interior View</p>
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <Card className="border-lime-500/20">
                  <CardHeader>
                    <CardTitle>CastleCare {property.name}</CardTitle>
                    <CardDescription>{property.description}</CardDescription>
                    <div className="text-3xl font-bold mt-2">${property.price.toLocaleString()}</div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Add-ons */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">Available Add-ons</h3>
                      {addons.map((addon) => (
                        <div key={addon.id} className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor={addon.id} className="text-base cursor-pointer">
                              {addon.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">{addon.description}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">+${addon.price.toLocaleString()}</span>
                            <Switch id={addon.id} className="data-[state=checked]:bg-lime-500" />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Exterior Colors */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">Exterior Color</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {exteriorColors.map((color) => (
                          <label
                            key={color.id}
                            className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted transition-colors"
                          >
                            <input
                              type="radio"
                              name="exterior-color"
                              value={color.id}
                              className="rounded-full text-lime-500 focus:ring-lime-500"
                              defaultChecked={color.id === "white"}
                            />
                            <div>
                              <div className="font-medium">{color.name}</div>
                              {color.price > 0 && <div className="text-sm text-muted-foreground">+${color.price}</div>}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-[#0f172a] hover:bg-[#1e293b] border border-lime-500 text-white">
                      Pre-Order (+ $5000)
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

