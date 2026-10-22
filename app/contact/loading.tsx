export default function ContactLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-28 sm:px-6 lg:px-8 animate-pulse">
      <div className="h-10 bg-abh-sand/40 rounded w-1/3 mx-auto mb-4" />
      <div className="h-4 bg-abh-sand/30 rounded w-1/2 mx-auto mb-12" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 h-96 bg-abh-sand/30 rounded-2xl" />
        <div className="lg:col-span-7 h-96 bg-abh-sand/30 rounded-2xl" />
      </div>
    </div>
  );
}
