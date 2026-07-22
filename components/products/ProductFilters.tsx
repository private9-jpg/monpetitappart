"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal } from "lucide-react";

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function ProductFilters({ searchQuery, onSearchChange }: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-surface-200 bg-white p-4 shadow-sm dark:border-surface-800 dark:bg-surface-900 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-surface-500" />
        <Input
          type="search"
          placeholder="Rechercher un produit..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
          aria-label="Rechercher un produit"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2" aria-label="Ouvrir les filtres">
          <SlidersHorizontal className="size-4" />
          Filtres
        </Button>

        <Button variant="secondary" size="sm">Catégorie</Button>
        <Button variant="secondary" size="sm">Prix</Button>
        <Button variant="secondary" size="sm">Marque</Button>
        <Button variant="secondary" size="sm">Note</Button>
        <Button variant="secondary" size="sm">Disponibilité</Button>

        <Badge variant="outline" className="text-xs">6 résultats</Badge>
      </div>
    </div>
  );
}
