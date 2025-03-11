import { getApplication } from "@/lib/redis";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

export default async function DriverDashboard() {
  const { userId } = useAuth();
  const application = userId ? await getApplication(userId) : null;

  return (
    <div className="container mx-auto px-4 py-8">
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
            {application ? (
              <>
                <p>Account Type: {application.account.type}</p>
                <p>
                  Name: {application.contact.firstName}{" "}
                  {application.contact.lastName}
                </p>
                <p>Email: {application.contact.email}</p>
                <p>Phone: {application.contact.phone}</p>
                <p>On-Demand Roles: {application.roles.onDemand.join(", ")}</p>
                <p>Warehouse Roles: {application.roles.warehouse.join(", ")}</p>
                <p>Status: Under Review</p>
              </>
            ) : (
              <p>
                No application found. Please complete the application process.
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              Complete these steps to start working
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>Complete background check</li>
              <li>Upload required documents</li>
              <li>Schedule orientation</li>
              <li>Set up payment information</li>
            </ul>
            <Button className="mt-4">Start Onboarding</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
