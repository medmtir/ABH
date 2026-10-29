import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Certifications Internationales & Conformité Qualité',
  description:
    "Certifications BRC, IFS, ISO 22000, BIO UE, USDA Organic, Halal & Kosher. Analyses physico-chimiques complètes attestant de l'excellence de nos huiles d'olive exportées.",
  openGraph: {
    title: 'Certifications & Qualité Oléicole | ABH Company',
    description:
      "Garantie totale de traçabilité, de pureté biologique et de conformité aux normes internationales les plus exigeantes.",
  },
};

export default function CertificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
