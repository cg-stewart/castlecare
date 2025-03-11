import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Check, X } from "lucide-react"

const serviceRequirements = {
  lawncare: {
    title: "Lawncare Provider",
    requirements: [
      { name: "Valid driver's license", required: true },
      { name: "Own vehicle", required: true },
      { name: "Lawn equipment", required: true },
      { name: "Background check", required: true },
      { name: "18+ years of age", required: true },
      { name: "Smartphone with data plan", required: true },
      { name: "Prior lawn care experience", required: false },
      { name: "Landscaping certification", required: false },
    ],
  },
  laundry: {
    title: "Laundry Provider",
    requirements: [
      { name: "Valid driver's license", required: true },
      { name: "Own vehicle", required: true },
      { name: "Background check", required: true },
      { name: "Access to washer/dryer", required: true },
      { name: "18+ years of age", required: true },
      { name: "Smartphone with data plan", required: true },
      { name: "Prior laundry service experience", required: false },
      { name: "Commercial laundry experience", required: false },
    ],
  },
  lighting: {
    title: "Lighting Installer",
    requirements: [
      { name: "Valid driver's license", required: true },
      { name: "Own vehicle", required: true },
      { name: "Background check", required: true },
      { name: "Basic electrical knowledge", required: true },
      { name: "Comfortable with heights", required: true },
      { name: "18+ years of age", required: true },
      { name: "Smartphone with data plan", required: true },
      { name: "Prior lighting installation experience", required: false },
      { name: "Electrical certification", required: false },
    ],
  },
}

export default function RequirementsSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-[#0f172a]/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Service Provider Requirements</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Review the requirements for each service area to ensure you qualify before applying.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="lawncare" className="w-full">
            <TabsList className="grid grid-cols-3 w-full bg-gray-100 dark:bg-gray-800">
              <TabsTrigger
                value="lawncare"
                className="data-[state=active]:bg-lime-500 data-[state=active]:text-[#0f172a]"
              >
                Lawncare
              </TabsTrigger>
              <TabsTrigger
                value="laundry"
                className="data-[state=active]:bg-lime-500 data-[state=active]:text-[#0f172a]"
              >
                Laundry
              </TabsTrigger>
              <TabsTrigger
                value="lighting"
                className="data-[state=active]:bg-lime-500 data-[state=active]:text-[#0f172a]"
              >
                Lighting
              </TabsTrigger>
            </TabsList>

            {Object.entries(serviceRequirements).map(([key, service]) => (
              <TabsContent key={key} value={key} className="mt-6">
                <div className="bg-white dark:bg-[#0f172a] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold">{service.title} Requirements</h3>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {service.requirements.map((req, index) => (
                      <div key={index} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {req.required ? (
                            <div className="w-6 h-6 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center">
                              <Check className="h-4 w-4 text-lime-600 dark:text-lime-400" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                              <X className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                          <span>{req.name}</span>
                        </div>
                        <span
                          className={`text-sm font-medium ${req.required ? "text-lime-600 dark:text-lime-400" : "text-gray-500"}`}
                        >
                          {req.required ? "Required" : "Preferred"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-yellow-500 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h4 className="text-base font-medium text-yellow-800 dark:text-yellow-200">Important Note</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  All service providers must pass a background check and provide proof of eligibility to work in the
                  United States. Equipment subsidies and training programs are available for qualified applicants.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

