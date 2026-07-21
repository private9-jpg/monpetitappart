import { type ReactNode } from "react";

interface NewsletterFormProps {
  children?: ReactNode;
}

export function NewsletterForm({ children }: NewsletterFormProps) {
  return (
    <form className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
      <h3 className="text-xl font-semibold">Newsletter</h3>
      {children}
    </form>
  );
}
