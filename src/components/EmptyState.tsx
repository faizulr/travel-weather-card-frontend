import { MapPin, Sun, Cloud, Umbrella } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="w-full max-w-[400px] mx-auto">
      <div className="relative bg-muted/50 rounded-2xl border-2 border-dashed border-border p-12 text-center">
        {/* Decorative weather icons */}
        <div className="absolute top-6 left-6 text-muted-foreground/30">
          <Sun className="h-8 w-8" />
        </div>
        <div className="absolute top-8 right-8 text-muted-foreground/30">
          <Cloud className="h-6 w-6" />
        </div>
        <div className="absolute bottom-8 left-10 text-muted-foreground/30">
          <Umbrella className="h-5 w-5" />
        </div>

        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-primary/10">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Search for a destination
        </h3>
        <p className="text-sm text-muted-foreground max-w-[240px] mx-auto">
          Enter any city to generate a beautiful 7-day weather card you can share
        </p>
      </div>
    </div>
  );
}
