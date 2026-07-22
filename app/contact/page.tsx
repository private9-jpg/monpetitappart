"use client";

import { ContactForm } from "@/components/contact/ContactForm";
import { Newsletter } from "@/components/newsletter/Newsletter";
import { SiteLayout } from "@/components/layouts/SiteLayout";
import { Section } from "@/components/ui/section";
import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const body = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      honey: formData.get("honey"),
    };

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Erreur lors de l'envoi");
      return;
    }

    setStatus(data.message || "Message envoyé");
    event.currentTarget.reset();
  }

  return (
    <SiteLayout>
      <div className="flex flex-col">
        <Section className="pt-8">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="font-display text-4xl font-semibold tracking-tight text-surface-900 sm:text-5xl dark:text-surface-50">
                Contact
              </h1>
              <p className="text-lg text-surface-600 dark:text-surface-400">
                Une question, une suggestion ou une demande de partenariat ? Écrivez-nous.
              </p>
            </div>
          </div>
        </Section>

        <Section>
          <div className="mx-auto max-w-3xl">
            <ContactForm />
          </div>
        </Section>

        <Section>
          <Newsletter />
        </Section>
      </div>
    </SiteLayout>
  );
}
function setError(arg0: null) {
  throw new Error("Function not implemented.");
}

