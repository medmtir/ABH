import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Catalogue Produits & Huiles d'Olive en Vrac",
  description:
    "Découvrez notre catalogue B2B d'huiles d'olive extra vierges, biologiques, raffinées et de grignons disponibles en vrac maritime (Flexitanks 24 000L, Cuves IBC 1 000L, Fûts 208L).",
  openGraph: {
    title: "Catalogue Produits & Huiles d'Olive en Vrac | ABH Company",
    description:
      "Huiles d'olive extra vierges et biologiques de Tunisie certifiées pour le négoce international et l'embouteillage.",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
