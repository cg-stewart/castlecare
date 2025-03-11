"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";

const faqs = [
  {
    question: "How do I get started as a CastleCare service provider?",
    answer:
      "To get started, simply fill out the application form on this page. Once submitted, our team will review your application and contact you within 1-2 business days to discuss next steps, which typically include a background check and orientation.",
  },
  {
    question: "What equipment do I need to provide?",
    answer:
      "Equipment requirements vary by service type. Lawncare providers need their own lawn equipment (mowers, trimmers, etc.). Laundry providers need access to washer and dryer. Lighting installers will be provided with all necessary equipment. All providers need a smartphone and reliable transportation.",
  },
  {
    question: "How much can I expect to earn?",
    answer:
      "Earnings vary based on the service type, number of jobs completed, and your location. On average, lawncare providers earn $20-35/hr, laundry providers earn $18-30/hr, and lighting installers earn $25-40/hr. Use our earnings calculator on this page to estimate your potential income.",
  },
  {
    question: "How does payment work?",
    answer:
      "Providers are paid weekly via direct deposit. Payments are calculated based on completed jobs, not hourly. We offer an instant cashout option (up to 5 times per week) for a small fee if you need access to your earnings sooner.",
  },
  {
    question: "Can I choose my own schedule?",
    answer:
      "Yes! One of the biggest benefits of being a CastleCare provider is the flexibility to set your own hours. You can choose which days and times you're available to work, and you can update your availability at any time through the provider app.",
  },
  {
    question: "Do I need insurance?",
    answer:
      "CastleCare provides liability insurance coverage for all providers while they are performing services. However, you are responsible for maintaining your own auto insurance for your vehicle and any other personal insurance coverage.",
  },
  {
    question: "How are jobs assigned?",
    answer:
      "Jobs are assigned based on your location, availability, and service type. When a customer requests a service in your area during your available hours, you'll receive a notification through the app. You can choose to accept or decline the job.",
  },
  {
    question: "What if I have an issue during a job?",
    answer:
      "Our support team is available 7 days a week to assist with any issues that may arise during a job. You can contact support directly through the provider app, and we'll help resolve the issue as quickly as possible.",
  },
];

export default function DriverFAQ() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = searchQuery
    ? faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  return (
    <section className="py-16 bg-white dark:bg-[#0f172a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about becoming a CastleCare service
            provider.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-lime-500/30 focus-visible:ring-lime-500"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                onClick={() => setSearchQuery("")}
                className="shrink-0"
              >
                Clear
              </Button>
            )}
          </div>

          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-lime-500/20"
                >
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No results found for "{searchQuery}"
                </p>
                <Button
                  variant="link"
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-lime-600 dark:text-lime-400"
                >
                  Clear search
                </Button>
              </div>
            )}
          </Accordion>

          <div className="mt-8 p-6 bg-[#0f172a] text-white rounded-lg text-center">
            <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
            <p className="mb-4">
              Our team is here to help you get started as a CastleCare service
              provider.
            </p>
            <Button className="bg-lime-500 hover:bg-lime-600 text-[#0f172a] font-medium">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
