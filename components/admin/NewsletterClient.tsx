"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Subscriber = {
  id: string;
  email: string;
  isSubscribed: boolean;
  subscribedAt: string | null;
  unsubscribedAt: string | null;
  createdAt: string;
};

type Stats = { total: number; subscribed: number };

type NewsletterClientProps = {
  initialSubscribers: Subscriber[];
  stats: Stats;
};

export default function NewsletterClient({ initialSubscribers, stats }: NewsletterClientProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
  const [loading, setLoading] = useState(false);

  async function loadSubscribers() {
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter");
      const data = await res.json();
      if (Array.isArray(data)) {
        setSubscribers(data);
      }
    } catch {
      // keep existing
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubscribers();
  }, []);

  return (
    <Container className="py-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-zinc-500">Total inscriptions</p>
          <p className="mt-2 text-3xl font-semibold">{stats.total}</p>
        </div>
        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-zinc-500">Actifs</p>
          <p className="mt-2 text-3xl font-semibold text-green-700">{stats.subscribed}</p>
        </div>
        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-zinc-500">Désabonnés</p>
          <p className="mt-2 text-3xl font-semibold text-red-700">{stats.total - stats.subscribed}</p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Inscrit le</TableHead>
              <TableHead>Désinscrit le</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell>{subscriber.email}</TableCell>
                <TableCell>{subscriber.isSubscribed ? "Actif" : "En attente / Désabonné"}</TableCell>
                <TableCell>{subscriber.subscribedAt ? new Date(subscriber.subscribedAt).toISOString().slice(0, 10) : "—"}</TableCell>
                <TableCell>{subscriber.unsubscribedAt ? new Date(subscriber.unsubscribedAt).toISOString().slice(0, 10) : "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}
