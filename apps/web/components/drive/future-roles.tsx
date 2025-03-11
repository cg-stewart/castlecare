import { HiringProcessForm } from "@/components/drive/hiring-process-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

export default function HiringProcess() {
  return (
    <div className="max-w-2xl mx-auto">
      <HiringProcessForm />
      <PricingSection />
    </div>
  );
}

function PricingSection() {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Plan</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Free Account</CardTitle>
            <CardDescription>Get started with no upfront costs</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>Access to job listings</li>
              <li>Basic profile</li>
              <li>Standard support</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Sign Up Free</Button>
          </CardFooter>
        </Card>
        <Card className="border-lime-500">
          <CardHeader>
            <CardTitle>CastleCare Preferred</CardTitle>
            <CardDescription>
              Unlock premium features and opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-3xl font-bold">$35</span>
              <span className="text-gray-500 ml-2">one-time fee</span>
            </div>
            <ul className="list-disc list-inside space-y-2">
              <li>Priority job access</li>
              <li>Background check included</li>
              <li>Driver check included</li>
              <li>Enhanced profile visibility</li>
              <li>Premium support</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-lime-500 hover:bg-lime-600 text-white">
              Become Preferred
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
