import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Clock, DollarSign, Calendar, Shield } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Flexible Schedule",
    description:
      "Work when you want. Set your own hours and take jobs that fit your schedule.",
  },
  {
    icon: DollarSign,
    title: "Competitive Pay",
    description:
      "Earn competitive rates with transparent pricing. Get paid weekly or daily with instant cashout options.",
  },
  {
    icon: Calendar,
    title: "Consistent Work",
    description:
      "Access a steady stream of service requests in your area with our growing customer base.",
  },
  {
    icon: Shield,
    title: "Insurance Coverage",
    description:
      "Enjoy peace of mind with our liability insurance coverage while performing services.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-16 bg-white dark:bg-[#0f172a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Why Provide Services with CastleCare?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join our team of service providers and enjoy these benefits while
            building your career.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-lime-500/20">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-lime-600 dark:text-lime-400" />
                </div>
                <CardTitle>{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {benefit.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-[#0f172a] to-[#1e293b] rounded-xl p-8 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                Earn More with Referrals
              </h3>
              <p className="mb-4">
                Refer friends to join CastleCare as service providers and earn a
                $200 bonus for each successful referral after they complete 20
                services.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-lime-500 mt-0.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>No limit on referrals</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-lime-500 mt-0.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Easy tracking in your provider dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-lime-500 mt-0.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Bonus paid directly to your account</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <div className="text-center">
                <p className="text-sm uppercase tracking-wider mb-1">
                  Referral Bonus
                </p>
                <p className="text-5xl font-bold text-lime-500 mb-2">$200</p>
                <p className="text-sm text-gray-300">per successful referral</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
