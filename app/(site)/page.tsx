import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <Container className="py-16">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Foundation prête
        </h1>
        <p className="mt-4 max-w-xl text-lg text-zinc-600">
          L&apos;architecture de base est en place. Vous pouvez maintenant ajouter les fonctionnalités métier.
        </p>
        <div className="mt-8 flex gap-4">
          <Button variant="default">Commencer</Button>
          <Button variant="secondary">Documentation</Button>
        </div>
      </div>
    </Container>
  );
}
