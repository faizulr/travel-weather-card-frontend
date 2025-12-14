import { useState, useCallback } from 'react';
import type { Location } from '@/types/weather';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';

export function useGeocoding() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchLocations = useCallback(async (query: string): Promise<Location[]> => {
    if (query.length < 2) {
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${GEOCODING_API}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
      );

      if (!response.ok) {
        throw new Error('Failed to search locations');
      }

      const data = await response.json();

      if (!data.results) {
        return [];
      }

      return data.results.map((result: any) => ({
        name: result.name,
        lat: result.latitude,
        lon: result.longitude,
        country: result.country,
        admin: result.admin1,
        timezone: result.timezone,
      }));
    } catch (err) {
      setError('Couldn\'t find that location. Please try a different search.');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { searchLocations, isLoading, error };
}
