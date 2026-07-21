"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Label } from "@/components/ui/label";
import { useState } from "react";

function DesignSystemShowcase() {
  const [selectValue, setSelectValue] = useState("apple");
  const [radioValue, setRadioValue] = useState("1");
  const [checkboxChecked, setCheckboxChecked] = useState<boolean | "indeterminate">(false);

  return (
    <Container className="py-12">
      <Section>
        <div className="mb-10">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-surface-900 dark:text-surface-50">
            Design System
          </h1>
          <p className="mt-2 text-lg text-surface-600 dark:text-surface-400">
            Bibliothèque de composants réutilisables pour monpetitappart.fr
          </p>
        </div>

        <div className="flex flex-col gap-16">
          <ComponentSection title="Button" description="Boutons avec variantes de style et de taille.">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <span className="sr-only">Icon</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </Button>
            </div>
          </ComponentSection>

          <ComponentSection title="Input" description="Champs de saisie texte.">
            <div className="flex max-w-md flex-col gap-4">
              <Input placeholder="Entrez votre email" />
              <Input type="password" placeholder="Mot de passe" />
              <Input disabled placeholder="Désactivé" />
            </div>
          </ComponentSection>

          <ComponentSection title="Textarea" description="Zone de texte multi-lignes.">
            <Textarea placeholder="Écrivez votre message..." className="max-w-md" />
          </ComponentSection>

          <ComponentSection title="Select" description="Liste déroulante avec sélection unique.">
            <Select value={selectValue} onValueChange={setSelectValue}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Choisir un fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Pomme</SelectItem>
                <SelectItem value="banana">Banane</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
              </SelectContent>
            </Select>
          </ComponentSection>

          <ComponentSection title="Checkbox" description="Case à cocher binaire.">
            <div className="flex items-center gap-3">
              <Checkbox
                id="demo-checkbox"
                checked={checkboxChecked}
                onCheckedChange={setCheckboxChecked}
              />
              <Label htmlFor="demo-checkbox" className="text-sm font-medium">
                J&apos;accepte les conditions
              </Label>
            </div>
          </ComponentSection>

          <ComponentSection title="RadioGroup" description="Sélection exclusive parmi plusieurs options.">
            <RadioGroup value={radioValue} onValueChange={setRadioValue} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="1" id="r1" />
                <Label htmlFor="r1" className="text-sm font-medium">Option 1</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="2" id="r2" />
                <Label htmlFor="r2" className="text-sm font-medium">Option 2</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="3" id="r3" />
                <Label htmlFor="r3" className="text-sm font-medium">Option 3</Label>
              </div>
            </RadioGroup>
          </ComponentSection>

          <ComponentSection title="Badge" description="Étiquettes de statut ou de catégorie.">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </ComponentSection>

          <ComponentSection title="Card" description="Conteneur de contenu avec en-tête, corps et pied.">
            <Card className="max-w-sm">
              <CardHeader>
                <CardTitle>Title</CardTitle>
                <CardDescription>Description du contenu</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-surface-600 dark:text-surface-400">
                  Contenu principal de la carte. Peut contenir texte, médias ou formulaires.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Action</Button>
              </CardFooter>
            </Card>
          </ComponentSection>

          <ComponentSection title="Avatar" description="Image de profil avec fallback.">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">AB</AvatarFallback>
              </Avatar>
            </div>
          </ComponentSection>

          <ComponentSection title="Separator" description="Séparateur visuel horizontal ou vertical.">
            <div className="w-full max-w-md">
              <div className="space-y-3">
                <div className="text-sm font-medium">Section 1</div>
                <Separator />
                <div className="text-sm font-medium">Section 2</div>
              </div>
            </div>
          </ComponentSection>

          <ComponentSection title="Tabs" description="Navigation par onglets.">
            <Tabs defaultValue="tab1" className="w-full max-w-md">
              <TabsList>
                <TabsTrigger value="tab1">Onglet 1</TabsTrigger>
                <TabsTrigger value="tab2">Onglet 2</TabsTrigger>
                <TabsTrigger value="tab3">Onglet 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="mt-4">
                <p className="text-sm text-surface-600 dark:text-surface-400">Contenu de l&apos;onglet 1</p>
              </TabsContent>
              <TabsContent value="tab2" className="mt-4">
                <p className="text-sm text-surface-600 dark:text-surface-400">Contenu de l&apos;onglet 2</p>
              </TabsContent>
              <TabsContent value="tab3" className="mt-4">
                <p className="text-sm text-surface-600 dark:text-surface-400">Contenu de l&apos;onglet 3</p>
              </TabsContent>
            </Tabs>
          </ComponentSection>

          <ComponentSection title="Accordion" description="Liste pliable / dépliable.">
            <Accordion type="single" collapsible className="w-full max-w-md">
              <AccordionItem value="item-1">
                <AccordionTrigger>Section 1</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-surface-600 dark:text-surface-400">
                    Contenu pliable de la première section.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Section 2</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-surface-600 dark:text-surface-400">
                    Contenu pliable de la deuxième section.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ComponentSection>

          <ComponentSection title="Alert" description="Message d&apos;alerte informatif.">
            <Alert className="max-w-md">
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                Ceci est un message d&apos;alerte informatif pour l&apos;utilisateur.
              </AlertDescription>
            </Alert>
          </ComponentSection>

          <ComponentSection title="Skeleton" description="Placeholder animé pour les états de chargement.">
            <div className="flex max-w-md flex-col gap-4">
              <div className="flex items-center gap-4">
                <Skeleton className="size-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
              <Skeleton className="h-40 w-full" />
            </div>
          </ComponentSection>

          <ComponentSection title="Spinner" description="Indicateur de chargement circulaire.">
            <div className="flex items-center gap-6">
              <Spinner size="sm" />
              <Spinner size="default" />
              <Spinner size="lg" />
            </div>
          </ComponentSection>

          <ComponentSection title="Container" description="Conteneur de largeur maximale avec marges responsives.">
            <Container className="border border-dashed border-surface-300 p-6 dark:border-surface-700">
              <p className="text-sm text-surface-600 dark:text-surface-400">
                Contenu dans un Container centré.
              </p>
            </Container>
          </ComponentSection>

          <ComponentSection title="Section" description="Section verticale avec espacement standardisé.">
            <Section className="border border-dashed border-surface-300 dark:border-surface-700">
              <p className="text-sm text-surface-600 dark:text-surface-400">
                Contenu dans une Section avec padding vertical standard.
              </p>
            </Section>
          </ComponentSection>
        </div>
      </Section>
    </Container>
  );
}

function ComponentSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-surface-900 dark:text-surface-50">
          {title}
        </h2>
        <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">{description}</p>
      </div>
      <div className="flex flex-col gap-4 rounded-xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900">
        {children}
      </div>
      <Separator />
    </div>
  );
}

export { DesignSystemShowcase };
