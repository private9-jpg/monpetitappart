import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

type Author = {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
};

interface AuthorCardProps {
  author: Author;
  className?: string;
}

export function AuthorCard({ author, className }: AuthorCardProps) {
  const links = [
    ...(author.socials?.twitter ? [{ label: "Twitter", href: author.socials.twitter }] : []),
    ...(author.socials?.linkedin ? [{ label: "LinkedIn", href: author.socials.linkedin }] : []),
    ...(author.socials?.website ? [{ label: "Site web", href: author.socials.website }] : []),
  ];

  return (
    <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 rounded-2xl border border-surface-200 bg-white p-5 sm:p-6 shadow-sm dark:border-surface-800 dark:bg-surface-900 ${className ?? ""}`}>
      <div className="relative size-16 sm:size-20 shrink-0 overflow-hidden rounded-full bg-surface-100">
        <Image src={author.avatar} alt={author.name} fill className="object-cover" sizes="80px" />
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold text-surface-900 dark:text-surface-50">{author.name}</h3>
          <Badge variant="outline" className="w-fit text-xs">{author.role}</Badge>
        </div>
        <p className="text-sm leading-relaxed text-surface-600 dark:text-surface-400">{author.bio}</p>
        {links.length > 0 && (
          <div className="flex items-center gap-2">
            {links.map((link) => (
              <Button key={link.label} variant="ghost" size="icon" asChild className="text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50">
                <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
