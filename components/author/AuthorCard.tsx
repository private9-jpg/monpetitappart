import type { AuthorCard } from "@/types/Author";
import { AUTHORS } from "@/lib/mocks/authors";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface AuthorCardProps {
  author?: AuthorCard;
  className?: string;
}

export function AuthorCard({ author, className }: AuthorCardProps) {
  const data = author ?? AUTHORS[0];
  return (
    <div className={`flex flex-col items-center text-center rounded-2xl border border-surface-200 bg-white p-6 shadow-sm sm:flex-row sm:text-left sm:p-8 dark:border-surface-800 dark:bg-surface-900 ${className ?? ""}`}>
      <div className="relative size-20 overflow-hidden rounded-full sm:size-24 shrink-0 bg-surface-100">
        <Image src={data.avatar} alt={data.name} fill className="object-cover" sizes="96px" />
      </div>

      <div className="mt-4 sm:ml-6 sm:mt-0 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-surface-900 dark:text-surface-50">
              {data.name}
            </h3>
            <Badge variant="secondary" className="mt-1">{data.role}</Badge>
          </div>
        </div>

        <p className="mt-3 text-sm text-surface-600 line-clamp-2 sm:line-clamp-3 dark:text-surface-400">
          {data.bio}
        </p>

        <div className="mt-4 flex gap-2 sm:justify-start">
          <Button size="sm" variant="default" className="h-8">S'abonner</Button>
          <Button size="sm" variant="outline" className="h-8">Profil</Button>
        </div>
      </div>
    </div>
  );
}
