"use client";

import { useState } from "react";
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
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { Slider } from "@workspace/ui/components/slider";
import { DollarSign } from "lucide-react";

const serviceRates = {
  lawncare: {
    baseRate: 25,
    hoursPerJob: 1.5,
    jobsPerWeek: {
      min: 5,
      max: 30,
      default: 15,
    },
  },
  laundry: {
    baseRate: 20,
    hoursPerJob: 1,
    jobsPerWeek: {
      min: 10,
      max: 40,
      default: 20,
    },
  },
  lighting: {
    baseRate: 35,
    hoursPerJob: 2,
    jobsPerWeek: {
      min: 3,
      max: 15,
      default: 8,
    },
  },
};

export default function EarningsCalculator() {
  const [serviceType, setServiceType] = useState("lawncare");
  const [jobsPerWeek, setJobsPerWeek] = useState(
    serviceRates.lawncare.jobsPerWeek.default
  );

  const currentService = serviceRates[serviceType as keyof typeof serviceRates];

  const calculateWeeklyEarnings = () => {
    return jobsPerWeek * currentService.baseRate * currentService.hoursPerJob;
  };

  const calculateMonthlyEarnings = () => {
    return calculateWeeklyEarnings() * 4;
  };

  const handleServiceChange = (value: string) => {
    setServiceType(value);
    setJobsPerWeek(
      serviceRates[value as keyof typeof serviceRates].jobsPerWeek.default
    );
  };

  return (
    <section
      id="earnings-calculator"
      className="py-16 bg-white dark:bg-[#0f172a]"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Earnings Calculator</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Estimate your potential earnings as a CastleCare service provider.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-lime-500/20">
            <CardHeader>
              <CardTitle>Calculate Your Earnings</CardTitle>
              <CardDescription>
                Adjust the parameters below to see your potential earnings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Service Type</Label>
                <RadioGroup
                  value={serviceType}
                  onValueChange={handleServiceChange}
                  className="grid grid-cols-1 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="lawncare"
                      id="lawncare"
                      className="text-lime-500 focus:ring-lime-500"
                    />
                    <Label htmlFor="lawncare" className="cursor-pointer">
                      Lawncare (${currentService.baseRate}/hr)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="laundry"
                      id="laundry"
                      className="text-lime-500 focus:ring-lime-500"
                    />
                    <Label htmlFor="laundry" className="cursor-pointer">
                      Laundry (${serviceRates.laundry.baseRate}/hr)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="lighting"
                      id="lighting"
                      className="text-lime-500 focus:ring-lime-500"
                    />
                    <Label htmlFor="lighting" className="cursor-pointer">
                      Lighting (${serviceRates.lighting.baseRate}/hr)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Jobs Per Week</Label>
                  <span className="text-sm font-medium">
                    {jobsPerWeek} jobs
                  </span>
                </div>
                <Slider
                  value={[jobsPerWeek]}
                  min={currentService.jobsPerWeek.min}
                  max={currentService.jobsPerWeek.max}
                  step={1}
                  onValueChange={(value) => setJobsPerWeek(value[0] || currentService.jobsPerWeek.min)}
                  className="[&>span]:bg-lime-500"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{currentService.jobsPerWeek.min} jobs</span>
                  <span>{currentService.jobsPerWeek.max} jobs</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hours-per-job">Hours Per Job</Label>
                  <Input
                    id="hours-per-job"
                    value={currentService.hoursPerJob}
                    readOnly
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourly-rate">Hourly Rate</Label>
                  <Input
                    id="hourly-rate"
                    value={`$${currentService.baseRate}`}
                    readOnly
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
              </div>

              <Button
                className="w-full bg-[#0f172a] hover:bg-[#1e293b] border border-lime-500 text-white"
                onClick={() =>
                  document
                    .getElementById("service-options")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Apply Now
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-lime-500 bg-lime-50 dark:bg-lime-900/20">
              <CardHeader>
                <CardTitle className="text-center">Weekly Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <DollarSign className="h-8 w-8 text-lime-600 dark:text-lime-400" />
                  <span className="text-4xl font-bold text-lime-600 dark:text-lime-400">
                    {calculateWeeklyEarnings().toLocaleString()}
                  </span>
                </div>
                <p className="text-center text-sm text-lime-700 dark:text-lime-300 mt-2">
                  Based on {jobsPerWeek} jobs per week
                </p>
              </CardContent>
            </Card>

            <Card className="border-lime-500/50">
              <CardHeader>
                <CardTitle className="text-center">Monthly Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <DollarSign className="h-8 w-8 text-lime-600 dark:text-lime-400" />
                  <span className="text-4xl font-bold text-lime-600 dark:text-lime-400">
                    {calculateMonthlyEarnings().toLocaleString()}
                  </span>
                </div>
                <p className="text-center text-sm text-lime-700 dark:text-lime-300 mt-2">
                  Based on 4 weeks per month
                </p>
              </CardContent>
            </Card>

            <div className="bg-[#0f172a] p-4 rounded-lg text-white">
              <h4 className="font-medium mb-2">Earnings Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Rate:</span>
                  <span>${currentService.baseRate}/hour</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Job Duration:</span>
                  <span>{currentService.hoursPerJob} hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Jobs Per Week:</span>
                  <span>{jobsPerWeek}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hours Per Week:</span>
                  <span>{jobsPerWeek * currentService.hoursPerJob} hours</span>
                </div>
                <div className="border-t border-gray-700 my-2 pt-2 flex justify-between font-medium">
                  <span>Weekly Total:</span>
                  <span>${calculateWeeklyEarnings().toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Monthly Total:</span>
                  <span>${calculateMonthlyEarnings().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
