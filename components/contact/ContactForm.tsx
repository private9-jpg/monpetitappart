"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";

type ContactStatus = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<ContactStatus>("idle");

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !isValidEmail(email) || !subject.trim() || !message.trim()) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {status === "success" && (
        <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100">
          <CheckCircle2 className="size-4" />
          <AlertTitle>Message envoyé</AlertTitle>
          <AlertDescription>Merci, nous vous répondrons dans les plus brefs délais.</AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert variant="destructive">
          <XCircle className="size-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>Veuillez remplir tous les champs avec une adresse email valide.</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-name" className="text-sm font-medium text-surface-900 dark:text-surface-50">
            Nom
          </label>
          <Input
            id="contact-name"
            type="text"
            placeholder="Votre nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-email" className="text-sm font-medium text-surface-900 dark:text-surface-50">
            Email
          </label>
          <Input
            id="contact-email"
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-subject" className="text-sm font-medium text-surface-900 dark:text-surface-50">
          Sujet
        </label>
        <Input
          id="contact-subject"
          type="text"
          placeholder="Sujet de votre message"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className="text-sm font-medium text-surface-900 dark:text-surface-50">
          Message
        </label>
        <Textarea
          id="contact-message"
          placeholder="Votre message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          required
        />
      </div>

      <Button type="submit" className="h-10 w-full sm:w-auto" disabled={status === "loading"}>
        {status === "loading" ? "Envoi..." : "Envoyer"}
      </Button>
    </form>
  );
}
