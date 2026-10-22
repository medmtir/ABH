import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact & Devis RFQ | ABH Company — Huile d'Olive Tunisie",
  description: "Contactez Authentic Bio Huile Company (ABH) à Bouhajla (Kairouan). Demandes de prix B2B, échantillons scellés et cotations maritimes en Flexitank.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
