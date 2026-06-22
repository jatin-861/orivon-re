function Block({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-foreground/10 ${className}`} />;
}

export function PageSkeleton() {
  return (
    <div className="px-6 sm:px-12 pt-28 pb-24 max-w-7xl mx-auto" aria-hidden="true">
      <Block className="h-4 w-32 mb-6" />
      <Block className="h-12 sm:h-16 w-2/3 mb-4" />
      <Block className="h-12 sm:h-16 w-1/2 mb-10" />
      <Block className="h-4 w-full max-w-xl mb-2" />
      <Block className="h-4 w-full max-w-md mb-12" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Block className="aspect-[4/3]" />
        <Block className="aspect-[4/3]" />
        <Block className="aspect-[4/3]" />
      </div>
    </div>
  );
}
