import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Export & Fret Maritime Mondial | ABH Company — Huile d'Olive Tunisie",
  description: "Logistique maritime internationale pour l'exportation d'huile d'olive en vrac : Flexitanks 24 000L, Incoterms FOB/CIF, départs réguliers depuis Radès, Sousse et Bizerte.",
};

export default function ExportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
