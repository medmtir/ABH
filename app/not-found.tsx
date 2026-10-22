import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-abh-pearl px-4 text-center">
      <div className="max-w-md space-y-4">
        <h2 className="text-4xl font-heading font-bold text-abh-sapphire">404</h2>
        <p className="text-sm text-abh-slate">Page introuvable / Page not found</p>
        <Link
          href="/"
          className="inline-block rounded-full bg-abh-sapphire px-6 py-2.5 text-xs font-semibold text-white hover:bg-abh-midnight transition-colors"
        >
          Retour à l accueil / Back to Home
        </Link>
      </div>
    </div>
  );
}
