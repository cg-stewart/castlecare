"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useHiringStore, formSchema } from "@/store/useHiringStore";
import { z } from "zod";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp, useUser } from "@clerk/nextjs";
import { toast } from "sonner";

const steps = ["Account Type", "Contact Info", "Roles", "Sign Up"];

export default function HiringProcessForm() {
  const {
    currentStep,
    setCurrentStep,
    updateAccount,
    updateContact,
    updateRoles,
    reset,
  } = useHiringStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      updateAccount(data.account);
      updateContact(data.contact);
      updateRoles(data.roles);

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        if (!isLoaded) {
          throw new Error("Authentication is not loaded");
        }

        // Store form data in localStorage to retrieve after Clerk signup
        localStorage.setItem('hiringFormData', JSON.stringify({
          account: data.account,
          contact: data.contact,
          roles: data.roles,
        }));
        
        // Start the Clerk signup process
        await signUp.create({
          firstName: data.contact.firstName,
          lastName: data.contact.lastName,
          emailAddress: data.contact.email,
          password: data.password,
        });
        
        // Redirect to Clerk's hosted UI for completing the signup
        // This will handle email verification and other Clerk processes
        const signUpUrl = `${window.location.origin}/sign-up?redirect_url=${encodeURIComponent('/drive/complete-application')}`;
        router.push(signUpUrl);
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("There was a problem processing your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <Label>Account Type</Label>
            <RadioGroup defaultValue="individual" className="flex">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="individual"
                  id="r1"
                  {...register("account.type")}
                />
                <Label htmlFor="r1">Individual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="business"
                  id="r2"
                  {...register("account.type")}
                />
                <Label htmlFor="r2">Business</Label>
              </div>
            </RadioGroup>
          </div>
        );
      case 1:
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...register("contact.firstName")}
                  required
                />
                {errors.contact?.firstName && (
                  <p className="text-red-500">
                    {errors.contact.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...register("contact.lastName")}
                  required
                />
                {errors.contact?.lastName && (
                  <p className="text-red-500">
                    {errors.contact.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                {...register("contact.phone")}
                required
              />
              {errors.contact?.phone && (
                <p className="text-red-500">{errors.contact.phone.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("contact.email")}
                required
              />
              {errors.contact?.email && (
                <p className="text-red-500">{errors.contact.email.message}</p>
              )}
            </div>
          </>
        );
      case 2:
        return (
          <div>
            <Label>Roles Interested In</Label>
            <div className="space-y-2">
              {["Lawncare", "Laundry", "Lighting"].map((role) => (
                <div key={role} className="flex items-center">
                  <Checkbox
                    id={role}
                    {...register("roles")}
                    value={role}
                    className="mr-2"
                  />
                  <Label htmlFor={role}>{role}</Label>
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <Label htmlFor="password">Create Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              required
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep
                    ? "bg-lime-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-sm mt-1">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep]}</CardTitle>
          <CardDescription>
            Please provide the following information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {renderStep()}
            <Button disabled={isLoading} className="w-full">
              {isLoading
                ? "Loading..."
                : currentStep === steps.length - 1
                  ? "Create Account"
                  : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
