import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type ProductSpecification = {
  label: string;
  value: string;
};

type ProductSpecificationsProps = {
  specs: ProductSpecification[];
};

export function ProductSpecifications({ specs }: ProductSpecificationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Caractéristiques produit</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="divide-y divide-gray-200 dark:divide-gray-700">
          {specs.map((spec) => (
            <div key={spec.label} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-4">
              <dt className="min-w-0 text-sm font-medium text-gray-900 sm:w-40 sm:flex-shrink-0 dark:text-gray-100">
                {spec.label}
              </dt>
              <dd className="text-sm text-gray-600 dark:text-gray-300">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

export const mockSpecifications: ProductSpecification[] = [
  { label: "Dimensions", value: "40 x 30 x 25 cm" },
  { label: "Poids", value: "8,5 kg" },
  { label: "Marque", value: "MaisonClair" },
  { label: "Matériaux", value: "Métal laqué, verre trempé" },
  { label: "Couleur", value: "Noir mat / Doré" },
  { label: "Garantie", value: "2 ans" },
];
