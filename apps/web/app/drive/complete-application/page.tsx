"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

export default function CompleteApplication() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    // Redirect if not signed in
    if (isLoaded && !isSignedIn) {
      router.push("/drive/get-hired");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const completeApplication = async () => {
      if (!isLoaded || !isSignedIn || isComplete) return;

      try {
        setIsSubmitting(true);

        // Get the stored form data from localStorage
        const storedData = localStorage.getItem("hiringFormData");
        if (!storedData) {
          toast.error("Application data not found. Please try again.");
          router.push("/drive/get-hired");
          return;
        }

        const formData = JSON.parse(storedData);

        // Submit the application data along with the user's Clerk ID
        const response = await fetch("/api/submit-application", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.id,
            account: formData.account,
            contact: formData.contact,
            roles: formData.roles,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit application");
        }

        // Clear the stored form data
        localStorage.removeItem("hiringFormData");

        setIsComplete(true);
        toast.success("Your application has been successfully submitted!");
      } catch (error) {
        console.error("Error completing application:", error);
        toast.error(
          "There was a problem completing your application. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    completeApplication();
  }, [isLoaded, isSignedIn, user, router, isComplete]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-12">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Application Submitted</CardTitle>
          <CardDescription>
            Thank you for applying to join the CastleCare team!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 pt-6">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <div className="text-center space-y-4">
            <h3 className="text-xl font-medium">
              Your application has been received
            </h3>
            <p className="text-muted-foreground">
              Our team will review your application and get back to you within
              2-3 business days.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pt-6">
          <Button onClick={() => router.push("/drive/dashboard")}>
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
