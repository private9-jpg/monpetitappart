"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";

type Comment = {
  id: string;
  content: string;
  targetType: string;
  targetId: string;
  isPublished: boolean;
  spamScore: number;
  createdAt: string;
  author?: { id: string; email: string };
};

type ModerationState = {
  pending: Comment[];
  published: Comment[];
  rejected: Comment[];
};

export default function ModerationClient() {
  const [comments, setComments] = useState<ModerationState>({ pending: [], published: [], rejected: [] });
  const [loading, setLoading] = useState(false);
  const [gdprAction, setGdprAction] = useState<string | null>(null);

  async function loadComments(status?: string) {
    setLoading(true);
    try {
      const url = status ? `/api/comments?status=${status}` : "/api/comments";
      const res = await fetch(url);
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setComments({
        pending: list.filter((c: Comment) => !c.isPublished),
        published: list.filter((c: Comment) => c.isPublished && c.spamScore < 50),
        rejected: list.filter((c: Comment) => c.spamScore >= 50),
      });
    } catch {
      setComments({ pending: [], published: [], rejected: [] });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComments();
  }, []);

  async function moderate(id: string, status: "PUBLISHED" | "REJECTED" | "PENDING") {
    setLoading(true);
    try {
      await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await loadComments();
    } catch {
      alert("Erreur lors de la modération");
    } finally {
      setLoading(false);
    }
  }

  async function deleteComment(id: string) {
    setLoading(true);
    try {
      await fetch(`/api/comments/${id}`, { method: "DELETE" });
      await loadComments();
    } catch {
      alert("Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  }

  async function handleGdpr(action: string) {
    setGdprAction(action);
    try {
      if (action === "cleanup") {
        await fetch("/api/gdpr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "cleanup", retentionDays: 365 }),
        });
        alert("Nettoyage RGPD effectué");
      }
    } catch {
      alert("Erreur RGPD");
    } finally {
      setGdprAction(null);
    }
  }

  const renderTable = (title: string, items: Comment[], showModerate = false) => (
    <div className="mt-6">
      <h2 className="text-lg font-semibold">{title} ({items.length})</h2>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-zinc-500">Aucun élément.</p>
      ) : (
        <div className="mt-2 overflow-hidden rounded-2xl border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Contenu</TableHead>
                <TableHead>Cible</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Date</TableHead>
                {showModerate && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="font-mono text-xs">{comment.id}</TableCell>
                  <TableCell className="max-w-md truncate">{comment.content}</TableCell>
                  <TableCell>
                    {comment.targetType} <span className="text-zinc-500">{comment.targetId}</span>
                  </TableCell>
                  <TableCell>{comment.spamScore}</TableCell>
                  <TableCell>{new Date(comment.createdAt).toISOString().slice(0, 10)}</TableCell>
                  {showModerate && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="default" onClick={() => moderate(comment.id, "PUBLISHED")} disabled={loading}>
                          Publier
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => moderate(comment.id, "REJECTED")} disabled={loading}>
                          Rejeter
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deleteComment(comment.id)} disabled={loading}>
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );

  return (
    <Container className="py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Modération</h1>
          <p className="mt-2 text-zinc-600">Commentaires et signalements.</p>
        </div>
        <Button variant="outline" onClick={() => loadComments()} disabled={loading}>
          Actualiser
        </Button>
      </div>

      {renderTable("En attente", comments.pending, true)}
      {renderTable("Publiés", comments.published)}
      {renderTable("Rejetés / Spam", comments.rejected)}

      <div className="mt-8 rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-semibold">Conformité RGPD</h2>
        <p className="mt-1 text-sm text-zinc-600">Actions de conformité : export, anonymisation, suppression, nettoyage.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => handleGdpr("cleanup")} disabled={gdprAction === "cleanup"}>
            {gdprAction === "cleanup" ? "Nettoyage..." : "Nettoyage auto (>365j)"}
          </Button>
        </div>
      </div>
    </Container>
  );
}
