import Image from "next/image";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Castle, Users, Sparkles, Heart } from "lucide-react";

const values = [
  {
    icon: Castle,
    title: "Royal Treatment",
    description:
      "We treat every home like a castle, providing services fit for royalty.",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "Building stronger communities through reliable, trustworthy home services.",
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description:
      "Constantly improving our services with cutting-edge technology and methods.",
  },
  {
    icon: Heart,
    title: "Passion",
    description:
      "We're passionate about making home care effortless and enjoyable for everyone.",
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About CastleCare</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Transforming home services with a touch of royalty
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Founded in 2023, CastleCare was born from a simple idea: everyone's
            home deserves the royal treatment. We saw a gap in the market for
            reliable, high-quality home services that truly cared about the
            customer experience.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Starting with just a handful of dedicated professionals, we've grown
            into a network of trusted service providers, all committed to
            treating your home like a castle.
          </p>
          <Button className="bg-[#0f172a] hover:bg-[#1e293b] border border-lime-500 text-white">
            Join Our Team
          </Button>
        </div>
        <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="CastleCare Team"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="border-lime-500/20">
              <CardHeader>
                <value.icon className="h-8 w-8 text-lime-500 mb-2" />
                <CardTitle>{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{value.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Experience the Royal Treatment?
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Join thousands of satisfied customers who have made CastleCare their
          go-to for all home services.
        </p>
        <Button className="bg-lime-500 hover:bg-lime-600 text-[#0f172a] font-medium text-lg px-8 py-3">
          Get Started
        </Button>
      </div>
    </div>
  );
}
