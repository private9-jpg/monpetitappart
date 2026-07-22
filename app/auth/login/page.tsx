"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/ui/container";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, twoFactorCode: twoFactorRequired ? twoFactorCode : undefined }),
    });

    const data = await response.json();
    if (!response.ok) {
      if (data.twoFactorRequired) {
        setTwoFactorRequired(true);
        setError("Code 2FA requis");
        return;
      }
      setError(data.error || "Échec de connexion");
      return;
    }

    router.push("/admin/overview");
  }

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-md rounded-3xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Connexion admin</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Email</label>
            <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Mot de passe</label>
            <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
          </div>
          {twoFactorRequired ? (
            <div>
              <label className="block text-sm font-medium text-zinc-700">Code 2FA</label>
              <Input value={twoFactorCode} onChange={(event) => setTwoFactorCode(event.target.value)} type="text" required />
            </div>
          ) : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit">Se connecter</Button>
        </form>
      </div>
    </Container>
  );
}
