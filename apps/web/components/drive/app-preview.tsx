"use client";

import Image from "next/image";

const appFeatures = [
  {
    title: "Track Earnings",
    description: "View your earnings in real-time, including tips and bonuses.",
  },
  {
    title: "Manage Schedule",
    description: "Set your availability and manage your work schedule.",
  },
  {
    title: "Accept Jobs",
    description: "View and accept service requests in your area.",
  },
  {
    title: "Navigation",
    description: "Get directions to job locations with integrated maps.",
  },
  {
    title: "Customer Communication",
    description: "Message customers securely through the app.",
  },
  {
    title: "Service Tracking",
    description: "Track your service history and performance metrics.",
  },
];

export default function AppPreview() {
  return (
    <section className="py-16 bg-white dark:bg-[#0f172a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">CastleCare Provider App</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Download the app to manage your schedule, view earnings, and receive
            job requests.
          </p>
        </div>

        <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-xl mx-auto max-w-xl">
          <Image
            src="/placeholder.svg?height=500&width=600"
            alt="CastleCare Provider App"
            fill
            className="object-cover"
          />
        </div>
        {/* <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid grid-cols-2 w-full bg-gray-100 dark:bg-gray-800">
                <TabsTrigger 
                  value="features"
                  className="data-[state=active]:bg-lime-500 data-[state=active]:text-[#0f172a]"
                >
                  App Features
                </TabsTrigger>
                <TabsTrigger 
                  value="dashboard"
                  className="data-[state=active]:bg-lime-500 data-[state=active]:text-[#0f172a]"
                >
                  Provider Dashboard
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="features" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {appFeatures.map((feature, index) => (
                    <Card key={index} className="border-lime-500/20">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-[#0f172a] hover:bg-[#1e293b] border border-lime-500 text-white">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.5227 7.39069C17.2717 7.64171 16.9405 7.79003 16.588 7.82088C16.2355 7.85173 15.8846 7.76324 15.5935 7.56763C15.3023 7.37202 15.0867 7.08014 14.9766 6.74113C14.8665 6.40212 14.8679 6.03456 14.9805 5.69648C14.4463 5.90004 13.9217 6.14696 13.4102 6.43569C12.7283 6.81663 12.1094 7.29379 11.5742 7.85148C10.5079 8.91773 9.89228 10.3461 9.85938 11.8398C9.85938 11.8594 9.85938 11.8789 9.85938 11.8984C9.85938 14.4609 11.9414 16.5469 14.5039 16.5469C17.0664 16.5469 19.1484 14.4609 19.1484 11.8984C19.1484 11.8789 19.1484 11.8594 19.1484 11.8398C19.1342 10.9289 18.8955 10.0379 18.4531 9.24998C18.1641 8.71873 17.8281 8.22263 17.4336 7.79685C17.4609 7.65623 17.4922 7.52341 17.5227 7.39069Z"/>
                      <path d="M20.5781 0H3.42188C2.51631 0 1.64781 0.359597 1.00427 0.999553C0.360727 1.63951 0 2.50424 0 3.40569V20.5943C0 21.4958 0.360727 22.3605 1.00427 23.0004C1.64781 23.6404 2.51631 24 3.42188 24H20.5781C21.4837 24 22.3522 23.6404 22.9957 23.0004C23.6393 22.3605 24 21.4958 24 20.5943V3.40569C24 2.50424 23.6393 1.63951 22.9957 0.999553C22.3522 0.359597 21.4837 0 20.5781 0ZM14.5039 18.0469C11.1133 18.0469 8.35938 15.2891 8.35938 11.8984C8.35938 11.8984 8.35938 8.4077 11.7214 8.4077C15.0834 8.4077 18.4454 11.1655 18.4454 11.8984C18.4454 15.2891 15.6914 18.0469 14.5039 18.0469Z"/>
                    </svg>
                    Download on the App Store
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="dashboard" className="mt-6">
                <p>Provider Dashboard Content will go here</p>
              </TabsContent>
            </Tabs>
          </div>
          <div className="order-1 md:order-2">
            <Image
              src="/images/app-preview.png"
              alt="App Preview"
              width={500}
              height={800}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div> */}
      </div>
    </section>
  );
}
