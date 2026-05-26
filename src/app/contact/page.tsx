import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with our concierge team. We answer most inquiries within a few hours.",
};

export default function ContactPage() {
  return (
    <div className="container grid gap-12 py-16 md:grid-cols-2 md:py-24">
      <div>
        <span className="chip">Contact</span>
        <h1 className="mt-3 text-4xl">We&apos;d love to hear from you.</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-brand-800">
          Whether you&apos;re planning a stay, listing your own villa, or just
          want to say hello, our team is here to help. Most messages get a
          reply within a few hours.
        </p>
        <dl className="mt-8 space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-brand-900">Email</dt>
            <dd className="text-brand-700">hello@maisonazure.example</dd>
          </div>
          <div>
            <dt className="font-semibold text-brand-900">Phone</dt>
            <dd className="text-brand-700">+1 (555) 010-1234</dd>
          </div>
          <div>
            <dt className="font-semibold text-brand-900">Concierge hours</dt>
            <dd className="text-brand-700">24/7 for booked guests · 9am–9pm CET otherwise</dd>
          </div>
        </dl>
      </div>
      <ContactForm />
    </div>
  );
}
