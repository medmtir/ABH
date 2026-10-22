import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Catalogue Produits en Vrac | ABH Company — Huile d'Olive Tunisie",
  description: "Découvrez notre catalogue B2B d'huiles d'olive extra vierges, biologiques, raffinées et de grignons disponibles en vrac maritime (Flexitanks, IBC, Fûts).",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
