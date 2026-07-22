"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type CommentFormProps = {
  onSubmit: (text: string) => Promise<void> | void;
  loading?: boolean;
  error?: string | null;
};

export function CommentForm({ onSubmit, loading, error }: CommentFormProps) {
  const [text, setText] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    await onSubmit(trimmed);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={text}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
        placeholder="Écrire un commentaire..."
        disabled={loading}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={loading || !text.trim()}>
        {loading ? "Envoi..." : "Envoyer"}
      </Button>
    </form>
  );
}
