"use client";

import { ContactForm } from "@/components/contact/ContactForm";
import { Newsletter } from "@/components/newsletter/Newsletter";
import { SiteLayout } from "@/components/layouts/SiteLayout";
import { Section } from "@/components/ui/section";

export default function ContactPage() {
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
