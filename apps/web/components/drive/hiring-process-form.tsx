"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHiringStore, formSchema } from "@/store/useHiringStore";
import { z } from "zod";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { CheckCircle, ArrowRight, ArrowLeft, Github, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp, useUser, useSignIn } from "@clerk/nextjs";
import { toast } from "sonner";

// List of US states for the dropdown
const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

const steps = ["Choose Plan", "Contact Info", "Roles", "Sign Up"];

export default function HiringProcessForm() {
  const {
    currentStep,
    setCurrentStep,
    account,
    contact,
    roles,
    updateAccount,
    updateContact,
    updateRoles,
    reset,
  } = useHiringStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isLoaded: isSignInLoaded, signIn } = useSignIn();
  const { user } = useUser();
  
  // Load saved form data and current step from localStorage on initial render
  useEffect(() => {
    const savedStep = localStorage.getItem('hiringCurrentStep');
    const savedFormData = localStorage.getItem('hiringFormData');
    
    if (savedStep) {
      setCurrentStep(parseInt(savedStep, 10));
    }
    
    if (savedFormData) {
      const formData = JSON.parse(savedFormData);
      if (formData.account) updateAccount(formData.account);
      if (formData.contact) updateContact(formData.contact);
      if (formData.roles) updateRoles(formData.roles);
    }
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      account: account || { plan: "free" },
      contact: contact || { 
        username: "", 
        firstName: "", 
        lastName: "", 
        city: "",
        state: "",
        zip: "",
        email: "", 
        phone: "",
        dateOfBirth: ""
      },
      roles: roles || { onDemand: [], warehouse: [] },
      password: ""
    }
  });

  // Function to handle next button click
  const handleNext = async () => {
    let canProceed = false;
    
    // Validate the current step
    if (currentStep === 0) {
      canProceed = await trigger("account.plan");
      if (canProceed) {
        const formData = watch();
        updateAccount(formData.account);
        saveFormData(formData, currentStep + 1);
      }
    } else if (currentStep === 1) {
      canProceed = await trigger([
        "contact.username",
        "contact.firstName", 
        "contact.lastName", 
        "contact.city",
        "contact.state",
        "contact.zip",
        "contact.email", 
        "contact.phone",
        "contact.dateOfBirth"
      ]);
      if (canProceed) {
        const formData = watch();
        updateContact(formData.contact);
        saveFormData(formData, currentStep + 1);
      }
    } else if (currentStep === 2) {
      // For roles, we don't require selection, so just proceed
      canProceed = true;
      const formData = watch();
      updateRoles(formData.roles);
      saveFormData(formData, currentStep + 1);
    } else if (currentStep === 3) {
      canProceed = await trigger("password");
      if (canProceed) {
        const formData = watch();
        saveFormData(formData, currentStep + 1);
      }
    }
    
    if (canProceed) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Function to save form data and current step to localStorage
  const saveFormData = (formData, step) => {
    localStorage.setItem('hiringFormData', JSON.stringify({
      account: formData.account,
      contact: formData.contact,
      roles: formData.roles
    }));
    localStorage.setItem('hiringCurrentStep', step.toString());
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Update the store based on current step
      if (currentStep === 0) {
        updateAccount(data.account);
        handleNext();
      } else if (currentStep === 1) {
        updateContact(data.contact);
        handleNext();
      } else if (currentStep === 2) {
        updateRoles(data.roles);
        handleNext();
      } else {
        // For the final step, we'll redirect to the Clerk signup page
        // Save the form data to localStorage before redirecting
        localStorage.setItem(
          "hiringFormData",
          JSON.stringify({
            account: data.account,
            contact: data.contact,
            roles: data.roles,
          })
        );
        
        // Redirect to the Clerk signup page
        router.push('/sign-up?redirect_url=/drive/dashboard');
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error(
        "There was a problem processing your request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <p className="text-muted-foreground">Select a plan that works for you</p>
            </div>
            <RadioGroup value={watch("account.plan")} onValueChange={(value) => {
              // We need to manually update the form value since we're using a controlled RadioGroup
              const event = {
                target: {
                  name: "account.plan",
                  value: value
                }
              };
              register("account.plan").onChange(event);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Card className={`h-full transition-all ${watch("account.plan") === "free" ? "border-lime-500 ring-1 ring-lime-500" : "border-gray-200"}`}>
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem 
                          id="free-plan" 
                          value="free" 
                        />
                        <CardTitle>
                          <Label htmlFor="free-plan" className="cursor-pointer">Free Account</Label>
                        </CardTitle>
                      </div>
                      <CardDescription>Get started with no upfront costs</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <span className="text-3xl font-bold">$0</span>
                      </div>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-lime-500 mr-2" />
                          <span>Access to job listings</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-lime-500 mr-2" />
                          <span>Basic profile</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-lime-500 mr-2" />
                          <span>Standard support</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className={`h-full transition-all ${watch("account.plan") === "preferred" ? "border-lime-500 ring-1 ring-lime-500" : "border-gray-200"}`}>
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem 
                          id="preferred-plan" 
                          value="preferred" 
                        />
                        <CardTitle>
                          <Label htmlFor="preferred-plan" className="cursor-pointer">Preferred</Label>
                        </CardTitle>
                      </div>
                      <CardDescription>Expedited onboarding process</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <span className="text-3xl font-bold">$50</span>
                        <span className="text-gray-500 ml-2">one-time fee</span>
                      </div>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-lime-500 mr-2" />
                          <span>Priority job access</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-lime-500 mr-2" />
                          <span>Background check included</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-lime-500 mr-2" />
                          <span>Enhanced profile</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-lime-500 mr-2" />
                          <span>Dedicated support</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </RadioGroup>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...register("contact.username")}
                  required
                />
                {errors.contact?.username && (
                  <p className="text-red-500 text-sm">
                    {errors.contact.username.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...register("contact.firstName")}
                    required
                  />
                  {errors.contact?.firstName && (
                    <p className="text-red-500 text-sm">
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
                    <p className="text-red-500 text-sm">
                      {errors.contact.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...register("contact.city")}
                  required
                />
                {errors.contact?.city && (
                  <p className="text-red-500 text-sm">{errors.contact.city.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select 
                    onValueChange={(value: string) => setValue("contact.state", value)}
                    defaultValue={watch("contact.state")}
                  >
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.contact?.state && (
                    <p className="text-red-500 text-sm">{errors.contact.state.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    {...register("contact.zip")}
                    required
                  />
                  {errors.contact?.zip && (
                    <p className="text-red-500 text-sm">{errors.contact.zip.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("contact.email")}
                    required
                  />
                  {errors.contact?.email && (
                    <p className="text-red-500 text-sm">{errors.contact.email.message}</p>
                  )}
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
                    <p className="text-red-500 text-sm">{errors.contact.phone.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth (must be 18+)</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register("contact.dateOfBirth")}
                  required
                />
                {errors.contact?.dateOfBirth && (
                  <p className="text-red-500 text-sm">{errors.contact.dateOfBirth.message}</p>
                )}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">On-Demand Services</h3>
              <p className="text-sm text-muted-foreground mb-4">Select the services you'd like to provide</p>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="lawncare" value="lawncare" {...register("roles.onDemand")} />
                  <Label htmlFor="lawncare" className="font-normal">Lawncare</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="laundry" value="laundry" {...register("roles.onDemand")} />
                  <Label htmlFor="laundry" className="font-normal">Laundry</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="lighting" value="lighting" {...register("roles.onDemand")} />
                  <Label htmlFor="lighting" className="font-normal">Lighting</Label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Warehouse Positions</h3>
              <p className="text-sm text-muted-foreground mb-4">Select any warehouse positions you're interested in</p>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="plumbing" value="plumbing" {...register("roles.warehouse")} />
                  <Label htmlFor="plumbing" className="font-normal">Plumbing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="electrical" value="electrical" {...register("roles.warehouse")} />
                  <Label htmlFor="electrical" className="font-normal">Electrical</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="carpentry" value="carpentry" {...register("roles.warehouse")} />
                  <Label htmlFor="carpentry" className="font-normal">Carpentry</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="general" value="general" {...register("roles.warehouse")} />
                  <Label htmlFor="general" className="font-normal">General Warehouse</Label>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-medium text-lg mb-4">Complete Your Registration</h3>
              <p className="text-sm text-muted-foreground mb-6">
                You've completed the initial steps! Now, let's create your account.
                Click the button below to proceed to our secure signup page.
              </p>
              
              <div className="flex items-start space-x-2 mb-6">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="font-normal text-sm">
                  I agree to the{" "}
                  <a href="/terms" className="text-lime-500 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-lime-500 hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  type="button" 
                  className="w-full bg-lime-500 hover:bg-lime-600" 
                  onClick={() => {
                    // Save form data to localStorage before redirecting
                    const formData = watch();
                    localStorage.setItem('hiringFormData', JSON.stringify({
                      account: formData.account,
                      contact: formData.contact,
                      roles: formData.roles
                    }));
                    
                    // Redirect to the Clerk signup page
                    router.push('/sign-up?redirect_url=/drive/dashboard');
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Continue with Email
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    // Save form data to localStorage before redirecting
                    const formData = watch();
                    localStorage.setItem('hiringFormData', JSON.stringify({
                      account: formData.account,
                      contact: formData.contact,
                      roles: formData.roles
                    }));
                    
                    if (isSignInLoaded) {
                      signIn.authenticateWithRedirect({
                        strategy: "oauth_github",
                        redirectUrl: "/drive/dashboard",
                        redirectUrlComplete: "/drive/dashboard"
                      });
                    }
                  }}
                >
                  <Github className="mr-2 h-4 w-4" />
                  Continue with GitHub
                </Button>
              </div>
            </div>
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
            <div className="flex justify-between mt-6">
              {currentStep > 0 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={isLoading}
                >
                  Back
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={isLoading}
                className={`${currentStep === 0 ? 'w-full' : 'ml-auto'} bg-lime-500 hover:bg-lime-600`}
                onClick={(e) => {
                  if (currentStep < steps.length - 1) {
                    e.preventDefault();
                    handleNext();
                  }
                }}
              >
                {isLoading
                  ? "Loading..."
                  : currentStep === steps.length - 1
                    ? "Create Account"
                    : "Continue"}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
