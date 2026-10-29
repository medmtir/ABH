import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Export & Fret Maritime International',
  description:
    "Logistique maritime internationale pour l'exportation d'huile d'olive en vrac : Flexitanks 24 000L, Incoterms FOB/CIF, départs réguliers depuis les ports tunisiens (Radès, Sousse, Bizerte).",
  openGraph: {
    title: 'Export & Logistique Maritime | ABH Company',
    description:
      "Expertise maritime : Flexitanks certifiés COA, suivi de température et conformité douanière internationale.",
  },
};

export default function ExportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
