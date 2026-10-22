export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 animate-pulse">
      <div className="h-10 bg-abh-sand/40 rounded-xl w-1/3 mx-auto mb-4" />
      <div className="h-4 bg-abh-sand/30 rounded-xl w-1/2 mx-auto mb-12" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-80 bg-abh-sand/30 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
