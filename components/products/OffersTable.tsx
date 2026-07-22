"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Offer = {
  id: string;
  merchant: string;
  price: number;
  availability: string;
  bestPrice?: boolean;
};

type OffersTableProps = {
  offers: Offer[];
  onView?: (offer: Offer) => void;
};

export function OffersTable({ offers, onView }: OffersTableProps) {
  const handleView = (offer: Offer) => {
    onView?.(offer);
  };

  return (
    <div className={cn("space-y-4")}>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Offres des marchands</h2>

      <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Marchand</th>
              <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Prix</th>
              <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Disponibilité</th>
              <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400"></th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer.id} className="border-b border-gray-100 last:border-b-0 dark:border-gray-800/60">
                <td className="px-4 py-4 font-medium text-gray-900 dark:text-gray-100">{offer.merchant}</td>
                <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
                  {offer.price.toFixed(2)} €
                  {offer.bestPrice && (
                    <span className="ml-2 inline-flex">
                      <Badge variant="secondary">Meilleur prix</Badge>
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{offer.availability}</td>
                <td className="px-4 py-4 text-right">
                  <Button size="sm" onClick={() => handleView(offer)}>
                    Voir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-3">
        {offers.map((offer) => (
          <Card key={offer.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {offer.merchant}
              </CardTitle>
              {offer.bestPrice && <Badge variant="secondary">Meilleur prix</Badge>}
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {offer.price.toFixed(2)} €
              </div>
              <div className="text-gray-600 dark:text-gray-300">{offer.availability}</div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="sm" onClick={() => handleView(offer)}>
                Voir l’offre
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export const mockOffers: Offer[] = [
  { id: "1", merchant: "MaisonClair Store", price: 149.0, availability: "En stock", bestPrice: true },
  { id: "2", merchant: "DécoDiscount", price: 159.9, availability: "En stock", bestPrice: false },
  { id: "3", merchant: "UrbanHome", price: 169.0, availability: "Livraison sous 5 jours", bestPrice: false },
  { id: "4", merchant: "MaisonClair Store", price: 149.0, availability: "En stock", bestPrice: true },
];
