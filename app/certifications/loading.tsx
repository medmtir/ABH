export default function CertificationsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-28 sm:px-6 lg:px-8 animate-pulse">
      <div className="h-10 bg-abh-sand/40 rounded w-1/3 mx-auto mb-4" />
      <div className="h-4 bg-abh-sand/30 rounded w-1/2 mx-auto mb-12" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-abh-sand/30" />
        ))}
      </div>
    </div>
  );
}
