import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, X } from "lucide-react";

const FAKE_COMPARISONS = [
  {
    id: 1,
    title: "Assurance loyer impayé : quelle formule choisir ?",
    items: [
      {
        name: "Essentiel",
        price: "7,50 €/mois",
        rating: 3,
        features: {
          "Couverture loyers": "80%",
          "Protection juridique": "Non",
          "Assistance 24/7": "Non",
          "Dégradations": "Non",
        },
        recommended: false,
      },
      {
        name: "Premium",
        price: "12,90 €/mois",
        rating: 4,
        features: {
          "Couverture loyers": "100%",
          "Protection juridique": "Oui",
          "Assistance 24/7": "Oui",
          "Dégradations": "Non",
        },
        recommended: true,
      },
      {
        name: "Pack Gestionnaire",
        price: "24,90 €/mois",
        rating: 5,
        features: {
          "Couverture loyers": "100%",
          "Protection juridique": "Oui",
          "Assistance 24/7": "Oui",
          "Dégradations": "Oui",
        },
        recommended: false,
      },
    ],
  },
];

type FeatureValue = string | boolean;

interface ComparisonCardProps {
  comparison?: typeof FAKE_COMPARISONS[number];
  className?: string;
}

export function ComparisonCard({ comparison = FAKE_COMPARISONS[0], className }: ComparisonCardProps) {
  const features = Object.keys(comparison.items[0].features);

  return (
    <div className={`w-full overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900 ${className ?? ""}`}>
      <div className="border-b border-surface-200 p-5 sm:p-6 dark:border-surface-800">
        <h3 className="text-lg font-semibold tracking-tight text-surface-900 dark:text-surface-50">
          {comparison.title}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-4 gap-4 border-b border-surface-200 p-5 sm:p-6 dark:border-surface-800">
            <div className="text-sm font-medium text-surface-500 dark:text-surface-400">Caractéristiques</div>
            {comparison.items.map((item) => (
              <div key={item.name} className="text-center">
                <div className="text-base font-semibold text-surface-900 dark:text-surface-50">{item.name}</div>
                <div className="mt-1 text-sm font-medium text-accent-600 dark:text-accent-400">{item.price}</div>
                {item.recommended && (
                  <Badge variant="default" className="mt-2 text-xs">Recommandé</Badge>
                )}
              </div>
            ))}
          </div>

          {features.map((feature) => (
            <div
              key={feature}
              className="grid grid-cols-4 gap-4 border-b border-surface-100 p-5 sm:p-6 last:border-b-0 dark:border-surface-800"
            >
              <div className="text-sm text-surface-700 dark:text-surface-300">{feature}</div>
              {comparison.items.map((item) => {
                const value = item.features[feature as keyof typeof item.features] as FeatureValue;
                return (
                  <div key={item.name} className="flex justify-center">
                    {typeof value === "boolean" ? (
                      value ? (
                        <Check className="size-5 text-emerald-600" />
                      ) : (
                        <X className="size-5 text-surface-300" />
                      )
                    ) : (
                      <span className="text-sm font-medium text-surface-900 dark:text-surface-50">{value}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-surface-200 p-5 sm:p-6 dark:border-surface-800">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          {comparison.items.map((item) => (
            <Button
              key={item.name}
              variant={item.recommended ? "default" : "outline"}
              size="sm"
              className="h-9"
            >
              Choisir {item.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ComparisonCardGrid({ comparisons = FAKE_COMPARISONS }: { comparisons?: typeof FAKE_COMPARISONS }) {
  return (
    <div className="flex flex-col gap-8">
      {comparisons.map((comparison) => (
        <ComparisonCard key={comparison.id} comparison={comparison} />
      ))}
    </div>
  );
}
