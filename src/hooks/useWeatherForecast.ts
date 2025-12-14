import { useState, useCallback } from 'react';
import type { Location, Forecast, DailyForecast } from '@/types/weather';

const FORECAST_API = 'https://api.open-meteo.com/v1/forecast';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function calculateBestDayIndex(daily: DailyForecast[]): number {
  let bestIndex = 0;
  let bestScore = -Infinity;

  daily.forEach((day, index) => {
    // Score = high temp - precip probability (lower precip is better)
    const score = day.tempHigh - day.precipProbability;
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  return bestIndex;
}

export function useWeatherForecast() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchForecast = useCallback(async (location: Location): Promise<Forecast | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${FORECAST_API}?latitude=${location.lat}&longitude=${location.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=${encodeURIComponent(location.timezone)}&forecast_days=7`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();

      const daily: DailyForecast[] = data.daily.time.map((dateStr: string, index: number) => {
        const date = new Date(dateStr);
        return {
          date,
          dayLabel: DAY_LABELS[date.getDay()],
          weatherCode: data.daily.weather_code[index],
          tempHigh: Math.round(data.daily.temperature_2m_max[index]),
          tempLow: Math.round(data.daily.temperature_2m_min[index]),
          precipProbability: data.daily.precipitation_probability_max[index] ?? 0,
        };
      });

      const bestDayIndex = calculateBestDayIndex(daily);

      return {
        location,
        daily,
        bestDayIndex,
      };
    } catch (err) {
      setError('Unable to load weather data. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetchForecast, isLoading, error, clearError: () => setError(null) };
}
