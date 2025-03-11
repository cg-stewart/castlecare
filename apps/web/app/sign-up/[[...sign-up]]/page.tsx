"use client";

import { useEffect, useState } from "react";
import { SignUp } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const [initialValues, setInitialValues] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url");

  useEffect(() => {
    // Get the saved form data from localStorage
    const savedFormData = localStorage.getItem("hiringFormData");
    
    if (savedFormData) {
      try {
        const formData = JSON.parse(savedFormData);
        const contact = formData.contact || {};
        
        // Set initial values for Clerk SignUp form
        setInitialValues({
          firstName: contact.firstName || "",
          lastName: contact.lastName || "",
          emailAddress: contact.email || "",
          username: contact.username || ""
        });
      } catch (error) {
        console.error("Error parsing saved form data:", error);
      }
    }
  }, []);

  // Use effect to check if user is already signed in
  useEffect(() => {
    // Check if the user is already signed in and redirect if needed
    const isSignedUp = localStorage.getItem('clerk-signed-up');
    
    if (isSignedUp === 'true') {
      // Clear the form data from localStorage since signup is complete
      localStorage.removeItem('hiringFormData');
      localStorage.removeItem('hiringCurrentStep');
      localStorage.removeItem('clerk-signed-up');
      
      // Redirect to the dashboard or specified redirect URL
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push("/drive/dashboard");
      }
    }
  }, [redirectUrl, router]);

  return (
    <div className="max-w-md mx-auto p-4">
      <SignUp 
        initialValues={initialValues}
        redirectUrl={redirectUrl || "/drive/dashboard"}
        appearance={{
          elements: {
            formButtonPrimary: "bg-lime-500 hover:bg-lime-600",
            card: "shadow-md rounded-lg",
            headerTitle: "text-2xl font-bold text-gray-800",
            headerSubtitle: "text-gray-600"
          }
        }}
      />
    </div>
  );
}
