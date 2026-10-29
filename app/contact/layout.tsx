import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact B2B & Demande de Cotation RFQ',
  description:
    "Contactez Authentic Bio Huile Company (ABH) à Bouhajla (Kairouan). Demandes de cotation maritime, prix B2B au conteneur ou Flexitank, et échantillons scellés pour laboratoires.",
  openGraph: {
    title: 'Contact B2B & Devis Export | ABH Company',
    description:
      'Bureau commercial à Bouhajla (Kairouan, Tunisie). Réponses sous 24h ouvrées pour vos cotations maritimes FOB / CIF.',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
