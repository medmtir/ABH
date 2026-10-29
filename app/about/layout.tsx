import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À Propos & Notre Histoire | Authentic Bio Huile Company',
  description:
    "Découvrez l'histoire d'Authentic Bio Huile Company (ABH) à Bouhajla (Kairouan). Notre vision moderne de l'exportation oléicole tunisienne, notre terroir et notre engagement pour la pureté.",
  openGraph: {
    title: 'À Propos & Notre Histoire | ABH Company',
    description:
      "De la plaine oléicole de Bouhajla jusqu'aux grands terminaux maritimes mondiaux : découvrez l'histoire et les valeurs d'ABH Company.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
