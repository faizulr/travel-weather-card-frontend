import { Skeleton } from '@/components/ui/skeleton';

export function WeatherCardSkeleton() {
  return (
    <div className="w-full max-w-[400px] mx-auto bg-card rounded-2xl border border-border overflow-hidden">
      {/* Header skeleton */}
      <div className="weather-card-gradient px-6 py-5">
        <Skeleton className="h-6 w-48 bg-white/20" />
        <Skeleton className="h-4 w-32 mt-2 bg-white/20" />
      </div>

      {/* Forecast rows skeleton */}
      <div className="divide-y divide-border">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between px-6 py-3.5">
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-10" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="flex items-center gap-6">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Best day badge skeleton */}
      <div className="px-6 py-4 bg-accent/30 border-t border-border">
        <Skeleton className="h-5 w-48 mx-auto" />
      </div>

      {/* Attribution skeleton */}
      <div className="px-6 py-3 border-t border-border bg-muted/30">
        <Skeleton className="h-3 w-32 mx-auto" />
      </div>
    </div>
  );
}
