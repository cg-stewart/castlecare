"use client";

import { useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { configureWorkerAuth, getAuthenticatedWorker, formatWorkerApplicationFromCognito, type AuthenticatedWorker, type WorkerApplication } from "@/lib/worker-auth";

type Application = {
  account: { type: string };
  contact: { firstName: string; lastName: string; email: string; phone: string };
  roles: { onDemand: string[]; warehouse: string[] };
};

export default function DriverDashboard() {
  const [worker, setWorker] = useState<AuthenticatedWorker | null>(null);
  const [workerLoaded, setWorkerLoaded] = useState(false);
  const [application, setApplication] = useState<WorkerApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Configure worker auth when component mounts
    configureWorkerAuth();
    
    async function loadWorkerData() {
      setLoading(true);
      setError(null);
      
      try {
        // Get worker data from Cognito
        const workerData = await getAuthenticatedWorker();
        
        if (workerData) {
          setWorker(workerData);
          setWorkerLoaded(true);
          
          // Check for application data in localStorage first
          const savedData = localStorage.getItem("workerApplicationData");
          if (savedData) {
            try {
              const parsedData = JSON.parse(savedData);
              setApplication(parsedData);
              console.log("Application data loaded from localStorage:", parsedData);
            } catch (parseError) {
              console.error("Error parsing saved application data:", parseError);
            }
          } else {
            // Format application data from Cognito attributes
            const formattedData = formatWorkerApplicationFromCognito(workerData.attributes);
            setApplication(formattedData);
            
            // Also save to localStorage for future use
            localStorage.setItem("workerApplicationData", JSON.stringify(formattedData));
            console.log("Application data formatted from Cognito:", formattedData);
          }
        } else {
          // No authenticated worker found
          console.log("No authenticated worker found");
          setApplication(null);
        }
      } catch (error) {
        console.error("Error loading worker data:", error);
        setError('Authentication error. Please sign in again.');
      } finally {
        setLoading(false);
      }
    }
    
    loadWorkerData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {workerLoaded && worker && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {worker.attributes?.given_name || 'Driver'}!</h1>
            <p className="text-gray-600">Here's your application status and next steps</p>
          </div>
          <div className="h-12 w-12 rounded-full border-2 border-lime-500 bg-lime-100 flex items-center justify-center text-lime-700 font-bold text-lg">
            {worker.attributes?.given_name ? worker.attributes.given_name.charAt(0) : 'D'}
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6">Driver Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>
              Your current application information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-lime-500"></div>
                <span className="ml-2">Loading application data...</span>
              </div>
            ) : error ? (
              <div className="py-4 px-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{error}</p>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="mt-3"
                >
                  Try Again
                </Button>
              </div>
            ) : application ? (
              <div className="space-y-2">
                <p><span className="font-medium">Account Type:</span> {application.account.type}</p>
                <p>
                  <span className="font-medium">Name:</span> {application.contact.firstName}{" "}
                  {application.contact.lastName}
                </p>
                <p><span className="font-medium">Email:</span> {application.contact.email}</p>
                <p><span className="font-medium">Phone:</span> {application.contact.phone}</p>
                <p><span className="font-medium">On-Demand Roles:</span> {application.roles.onDemand.length > 0 ? application.roles.onDemand.join(", ") : "None"}</p>
                <p><span className="font-medium">Warehouse Roles:</span> {application.roles.warehouse.length > 0 ? application.roles.warehouse.join(", ") : "None"}</p>
                
                {application.account.type === "free" ? (
                  <div className="mt-4">
                    <div className="py-2 px-3 mb-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-yellow-800"><span className="font-medium">Status:</span> Free Account</p>
                      <p className="text-sm mt-1">Upgrade to Preferred for priority access to jobs and higher pay rates.</p>
                    </div>
                    <Button 
                      className="w-full bg-lime-500 hover:bg-lime-600"
                      onClick={() => {
                        // In a real app, this would navigate to an upgrade page
                        alert("This would navigate to the upgrade page in production");
                      }}
                    >
                      Upgrade to Preferred
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4">
                    <div className="py-2 px-3 mb-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-yellow-800"><span className="font-medium">Status:</span> Preferred Account</p>
                      <p className="text-sm mt-1">Complete your background check to start receiving job offers.</p>
                    </div>
                    <Button 
                      className="w-full bg-lime-500 hover:bg-lime-600"
                      onClick={() => {
                        // In a real app, this would navigate to the payment page
                        alert("This would navigate to the payment page for background check in production");
                      }}
                    >
                      Pay for Background Check ($24.99)
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4">
                <p className="text-gray-600 mb-4">
                  No application found. Please complete the application process to get started.
                </p>
                <Button 
                  onClick={() => window.location.href = "/drive/get-hired"}
                  className="bg-lime-500 hover:bg-lime-600"
                >
                  Start Application
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              What to expect in the hiring process
            </CardDescription>
          </CardHeader>
          <CardContent>
            {application ? (
              <div>
                <ol className="space-y-3 py-1">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-lime-100 border border-lime-500 flex items-center justify-center mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-lime-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lime-700 font-medium">Application Submitted</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-yellow-100 border border-yellow-500 flex items-center justify-center mr-2 mt-0.5">
                      <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    </div>
                    <span className="font-medium">Application Review (1-2 business days)</span>
                  </li>
                  <li className="flex items-start">
                    <div className={`flex-shrink-0 h-5 w-5 rounded-full ${application.account.type === "preferred" ? "bg-yellow-100 border border-yellow-500" : "bg-gray-100 border border-gray-300"} flex items-center justify-center mr-2 mt-0.5`}>
                      {application.account.type === "preferred" ? (
                        <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                      ) : (
                        <span className="text-xs text-gray-500 font-medium">3</span>
                      )}
                    </div>
                    <span className={application.account.type === "preferred" ? "font-medium" : "text-gray-500"}>
                      Background Check {application.account.type === "preferred" ? "(Ready to start)" : ""}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs text-gray-500 font-medium">4</span>
                    </div>
                    <span className="text-gray-500">Vehicle Inspection (if applicable)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs text-gray-500 font-medium">5</span>
                    </div>
                    <span className="text-gray-500">Onboarding Session</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs text-gray-500 font-medium">6</span>
                    </div>
                    <span className="text-gray-500">Start Earning!</span>
                  </li>
                </ol>
                <div className="mt-6">
                  {/* Additional content for users without applications */}
                </div>
              </div>
            ) : (
              <div>
                <ol className="space-y-3 py-1">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-yellow-100 border border-yellow-500 flex items-center justify-center mr-2 mt-0.5">
                      <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    </div>
                    <span className="font-medium">Application Submission</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs text-gray-500 font-medium">2</span>
                    </div>
                    <span className="text-gray-500">Application Review (1-2 business days)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs text-gray-500 font-medium">3</span>
                    </div>
                    <span className="text-gray-500">Background Check</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs text-gray-500 font-medium">4</span>
                    </div>
                    <span className="text-gray-500">Vehicle Inspection (if applicable)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs text-gray-500 font-medium">5</span>
                    </div>
                    <span className="text-gray-500">Onboarding Session</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs text-gray-500 font-medium">6</span>
                    </div>
                    <span className="text-gray-500">Start Earning!</span>
                  </li>
                </ol>
                <div className="mt-6">
                  {/* Additional content for users without applications */}
                </div>
              </div>
            )}
            <div className="mt-6">
              <Button 
                className="w-full bg-lime-500 hover:bg-lime-600"
                onClick={() => window.location.href = "/drive/support"}
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-red-500 mt-1">Please refresh the page or contact support if this issue persists.</p>
        </div>
      )}
    </div>
  );
}
