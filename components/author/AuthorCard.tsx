import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const FAKE_AUTHORS = [
  {
    id: 1,
    name: "Marie Dubois",
    role: "Rédactrice en chef",
    bio: "Experte en immobilier depuis 12 ans, Marie décrypte les tendances du marché et accompagne les futurs acquéreurs avec pédagogie.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    articles: 86,
    followers: "12,4k",
  },
  {
    id: 2,
    name: "Thomas Leroy",
    role: "Consultant juridique",
    bio: "Ancien notaire, Thomas vulgarise le droit immobilier pour rendre la location accessible à tous.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    articles: 54,
    followers: "8,7k",
  },
  {
    id: 3,
    name: "Sophie Martin",
    role: "Architecte d'intérieur",
    bio: "Sophie explore les liens entre espace, bien-être et design minimaliste.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    articles: 42,
    followers: "15,1k",
  },
];

interface AuthorCardProps {
  author?: typeof FAKE_AUTHORS[number];
  className?: string;
}

export function AuthorCard({ author = FAKE_AUTHORS[0], className }: AuthorCardProps) {
  return (
    <div className={`flex flex-col items-center text-center rounded-2xl border border-surface-200 bg-white p-6 shadow-sm sm:flex-row sm:text-left sm:p-8 dark:border-surface-800 dark:bg-surface-900 ${className ?? ""}`}>
      <Avatar className="size-20 sm:size-24">
        <AvatarImage src={author.avatar} alt={author.name} />
        <AvatarFallback className="text-2xl">{author.name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="mt-4 sm:ml-6 sm:mt-0 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-surface-900 dark:text-surface-50">
              {author.name}
            </h3>
            <Badge variant="secondary" className="mt-1">{author.role}</Badge>
          </div>
          <div className="mt-3 flex items-center gap-4 sm:mt-0">
            <div className="text-center">
              <div className="text-sm font-semibold text-surface-900 dark:text-surface-50">{author.articles}</div>
              <div className="text-xs text-surface-500">Articles</div>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="text-center">
              <div className="text-sm font-semibold text-surface-900 dark:text-surface-50">{author.followers}</div>
              <div className="text-xs text-surface-500">Abonnés</div>
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm text-surface-600 line-clamp-2 sm:line-clamp-3 dark:text-surface-400">
          {author.bio}
        </p>

        <div className="mt-4 flex gap-2 sm:justify-start">
          <Button size="sm" variant="default" className="h-8">S'abonner</Button>
          <Button size="sm" variant="outline" className="h-8">Profil</Button>
        </div>
      </div>
    </div>
  );
}

export function AuthorCardGrid({ authors = FAKE_AUTHORS }: { authors?: typeof FAKE_AUTHORS }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {authors.map((author) => (
        <AuthorCard key={author.id} author={author} />
      ))}
    </div>
  );
}
