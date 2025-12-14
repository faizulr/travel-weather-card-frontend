import { useState, useRef, useCallback } from 'react';
import { Plane, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/SearchInput';
import { WeatherCard } from '@/components/WeatherCard';
import { WeatherCardSkeleton } from '@/components/WeatherCardSkeleton';
import { ActionButtons } from '@/components/ActionButtons';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useWeatherForecast } from '@/hooks/useWeatherForecast';
import type { Location, Forecast } from '@/types/weather';

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { fetchForecast, isLoading, error, clearError } = useWeatherForecast();

  const handleLocationSelect = useCallback((location: Location) => {
    setSelectedLocation(location);
    setForecast(null);
    clearError();
  }, [clearError]);

  const handleClearSelection = useCallback(() => {
    setSelectedLocation(null);
    setForecast(null);
    clearError();
  }, [clearError]);

  const handleGenerate = async () => {
    if (!selectedLocation) return;
    
    const result = await fetchForecast(selectedLocation);
    if (result) {
      setForecast(result);
    }
  };

  const handleRetry = () => {
    clearError();
    handleGenerate();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="w-10" />
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Plane className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Travel Weather Card</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Search Section */}
        <section className="mb-8 md:mb-12">
          <SearchInput
            selectedLocation={selectedLocation}
            onLocationSelect={handleLocationSelect}
            onClearSelection={handleClearSelection}
          />

          {/* Generate Button */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleGenerate}
              disabled={!selectedLocation || isLoading}
              size="lg"
              className="px-8 gap-2"
              aria-label={selectedLocation ? `Generate weather card for ${selectedLocation.name}` : 'Generate Weather Card'}
            >
              {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
              {isLoading ? 'Generating...' : 'Generate Weather Card'}
            </Button>
          </div>
        </section>

        {/* Weather Card Section */}
        <section className="mb-8">
          {/* Loading State */}
          {isLoading && <WeatherCardSkeleton />}

          {/* Error State */}
          {error && !isLoading && (
            <ErrorState message={error} onRetry={handleRetry} />
          )}

          {/* Success State */}
          {forecast && !isLoading && !error && (
            <>
              <WeatherCard ref={cardRef} forecast={forecast} />
              <ActionButtons forecast={forecast} cardRef={cardRef} />
            </>
          )}

          {/* Empty State */}
          {!forecast && !isLoading && !error && <EmptyState />}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            No account needed · We don't store your searches
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
