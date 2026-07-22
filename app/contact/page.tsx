"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export default function ContactPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    <Section>
      <Container className="max-w-2xl">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-surface-900 sm:text-4xl dark:text-surface-50">
            Contact
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-surface-600 dark:text-surface-400">
            Une question ou une suggestion ? Écrivez-nous.
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Nom</label>
            <Input name="name" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Email</label>
            <Input name="email" type="email" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Sujet</label>
            <Input name="subject" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Message</label>
            <textarea name="message" required className="mt-1 w-full rounded-lg border border-zinc-300 p-3 text-sm" rows={5} />
          </div>
          <input type="text" name="honey" className="hidden" tabIndex={-1} autoComplete="off" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          {status && <p className="text-sm text-green-700">{status}</p>}
          <Button type="submit">Envoyer</Button>
        </form>
      </Container>
    </Section>
  );
}
