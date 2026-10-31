export default function ShopLoading() {
  return (
    <div className="bg-ink pb-12 pt-40" aria-busy>
      <div className="mx-auto max-w-7xl px-5">
        <div className="h-12 w-2/3 animate-pulse bg-white/10" />
        <div className="mt-12 grid gap-6 bg-white p-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse bg-neutral-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
