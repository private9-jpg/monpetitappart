"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Mail } from "lucide-react";

const PLACEHOLDER_ILLUSTRATION = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' fill='none'%3E%3Crect width='600' height='400' fill='%23f5f5f4'/%3E%3Crect x='140' y='80' width='320' height='240' rx='8' fill='%23e7e5e4'/%3E%3Ccircle cx='300' cy='190' r='60' fill='%23d6d3d1'/%3E%3Crect x='220' y='160' width='160' height='20' rx='4' fill='%23a8a29e'/%3E%3Crect x='240' y='200' width='120' height='12' rx='4' fill='%23a8a29e'/%3E%3C/svg%3E";

type NewsletterState = "idle" | "loading" | "success" | "error";

interface NewsletterProps {
  title?: string;
  description?: string;
  illustrationSrc?: string;
  illustrationAlt?: string;
  ctaLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  className?: string;
}

export function Newsletter({
  title = "Restez informé",
  description = "Recevez chaque semaine nos meilleurs conseils, guides et bons plans pour votre logement.",
  illustrationSrc = PLACEHOLDER_ILLUSTRATION,
  illustrationAlt = "Illustration newsletter",
  ctaLabel = "S'abonner",
  successMessage = "Merci ! Vous êtes bien inscrit à notre newsletter.",
  errorMessage = "Une erreur est survenue. Merci de réessayer.",
  className,
}: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<NewsletterState>("idle");

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setState("error");
      return;
    }

    setState("loading");

    setTimeout(() => {
      const shouldSucceed = true;
      setState(shouldSucceed ? "success" : "error");
      if (shouldSucceed) {
        setEmail("");
      }
    }, 1500);
  };

  return (
    <section className={`w-full overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900 ${className ?? ""}`}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-surface-900 dark:text-surface-50">
              <Mail className="size-5" />
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
            </div>
            <p className="text-base text-surface-600 dark:text-surface-400">{description}</p>
          </div>

          <div className="mt-8">
            {state === "success" ? (
              <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100">
                <CheckCircle2 className="size-4" />
                <AlertTitle>Inscription confirmée</AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            ) : state === "error" ? (
              <Alert variant="destructive">
                <XCircle className="size-4" />
                <AlertTitle>Échec de l'inscription</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : (
              <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" className="h-10" disabled={state === "loading"}>
                  {state === "loading" && <Spinner size="sm" className="mr-2" />}
                  {ctaLabel}
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute inset-0">
            <Image
              src={illustrationSrc}
              alt={illustrationAlt}
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
