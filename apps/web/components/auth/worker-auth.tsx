"use client";

import { useEffect, useState } from "react";
import { configureWorkerAuth, getAuthenticatedWorker, formatWorkerApplicationFromCognito, type WorkerApplication } from "@/lib/worker-auth";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter } from "next/navigation";

type WorkerAuthProps = {
  onAuthSuccess?: (userData: WorkerApplication) => void;
  redirectPath?: string;
};

export default function WorkerAuth({ onAuthSuccess, redirectPath = "/drive/dashboard" }: WorkerAuthProps) {
  const router = useRouter();
  const [isConfigured, setIsConfigured] = useState(false);

  // Configure worker auth when component mounts
  useEffect(() => {
    configureWorkerAuth();
    setIsConfigured(true);
  }, []);

  if (!isConfigured) {
    return <div className="p-8 text-center">Loading authentication...</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <Authenticator
        signUpAttributes={[
          'email',
          'given_name',
          'family_name',
          'phone_number',
          'birthdate',
          'address'
        ]}
        formFields={{
          signUp: {
            email: {
              label: 'Email',
              placeholder: 'Enter your email',
              isRequired: true,
            },
            given_name: {
              label: 'First Name',
              placeholder: 'Enter your first name',
              isRequired: true,
            },
            family_name: {
              label: 'Last Name',
              placeholder: 'Enter your last name',
              isRequired: true,
            },
            phone_number: {
              label: 'Phone Number',
              placeholder: '+1 (555) 555-5555',
              isRequired: true,
            },
            birthdate: {
              label: 'Date of Birth',
              placeholder: 'MM/DD/YYYY',
              isRequired: true,
            },
            address: {
              label: 'Address',
              placeholder: 'Enter your address',
              isRequired: true,
            },
            password: {
              label: 'Password',
              placeholder: 'Create a password',
              isRequired: true,
            },
          },
        }}
      >
        {({ signOut, user }) => {
          // Handle successful authentication
          useEffect(() => {
            const handleAuthSuccess = async () => {
              if (user) {
                try {
                  const workerData = await getAuthenticatedWorker();
                  
                  if (workerData && onAuthSuccess) {
                    // Format the data for the application
                    const formattedData = formatWorkerApplicationFromCognito(workerData.attributes);
                    
                    // Save application data to localStorage
                    localStorage.setItem("workerApplicationData", JSON.stringify(formattedData));
                    
                    // Call the success callback
                    onAuthSuccess(formattedData);
                  }
                  
                  // Redirect if path is provided
                  if (redirectPath) {
                    router.push(redirectPath);
                  }
                } catch (error) {
                  console.error("Error handling auth success:", error);
                }
              }
            };
            
            handleAuthSuccess();
          }, [user]);
          
          return (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Welcome, {user?.username || 'Worker'}!
              </h2>
              <p className="mb-4">You're now signed in. Redirecting to your dashboard...</p>
              <button 
                onClick={signOut}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Sign out
              </button>
            </div>
          );
        }}
      </Authenticator>
    </div>
  );
}
