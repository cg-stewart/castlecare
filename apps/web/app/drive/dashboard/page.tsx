"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

type Application = {
  account: { type: string };
  contact: { firstName: string; lastName: string; email: string; phone: string };
  roles: { onDemand: string[]; warehouse: string[] };
};

export default function DriverDashboard() {
  const { userId } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchApplication() {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/applications/${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          setApplication(data);
          console.log("Application data loaded:", data);
        } else if (response.status === 404) {
          // Application not found is a normal state, not an error
          console.log("No application found for user");
          setApplication(null);
        } else {
          // Handle other error states
          try {
            const errorData = await response.json();
            console.error("Error response:", errorData);
            setError(errorData.error || 'Failed to load application data');
          } catch (jsonError) {
            console.error("Error parsing response:", jsonError);
            setError(`Server error: ${response.status}`);
          }
        }
      } catch (error) {
        console.error("Error fetching application:", error);
        setError('Network error. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    // Reset states when userId changes
    setLoading(true);
    setError(null);
    fetchApplication();
  }, [userId]);

  return (
    <div className="container mx-auto px-4 py-8">
      {userLoaded && user && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user.firstName || 'Driver'}!</h1>
            <p className="text-gray-600">Here's your application status and next steps</p>
          </div>
          {user.imageUrl && (
            <img 
              src={user.imageUrl} 
              alt="Profile" 
              className="h-12 w-12 rounded-full border-2 border-lime-500"
            />
          )}
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
