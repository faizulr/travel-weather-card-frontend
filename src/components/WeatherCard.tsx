import { forwardRef } from 'react';
import type { Forecast } from '@/types/weather';
import { getWeatherEmoji } from '@/lib/weatherIcons';
import { formatDateRange, getFullDayName } from '@/lib/formatDate';
import { MapPin, Sparkles } from 'lucide-react';

interface WeatherCardProps {
  forecast: Forecast;
}

export const WeatherCard = forwardRef<HTMLDivElement, WeatherCardProps>(
  ({ forecast }, ref) => {
    const { location, daily, bestDayIndex } = forecast;
    const startDate = daily[0]?.date;
    const endDate = daily[daily.length - 1]?.date;
    const bestDay = daily[bestDayIndex];

    return (
      <div
        ref={ref}
        className="w-full max-w-[400px] mx-auto bg-card rounded-2xl border border-border overflow-hidden"
        style={{ boxShadow: '0 4px 24px hsla(220, 70%, 50%, 0.08)' }}
      >
        {/* Header */}
        <div className="weather-card-gradient px-6 py-5 text-white">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-5 w-5" />
            <h2 className="text-lg font-semibold">
              {location.name}, {location.country}
            </h2>
          </div>
          {startDate && endDate && (
            <p className="text-white/80 text-sm pl-7">
              {formatDateRange(startDate, endDate)}
            </p>
          )}
        </div>

        {/* Forecast Grid */}
        <div className="divide-y divide-border">
          {daily.map((day, index) => (
            <div
              key={day.date.toISOString()}
              className={`flex items-center justify-between px-6 py-3.5 ${
                index === bestDayIndex ? 'bg-accent/50' : ''
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="w-10 font-medium text-foreground">{day.dayLabel}</span>
                <span className="text-2xl" role="img" aria-label="weather">
                  {getWeatherEmoji(day.weatherCode)}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-foreground font-medium w-20 text-right">
                  {day.tempHigh}° / {day.tempLow}°
                </span>
                <span className="text-muted-foreground text-sm w-16 text-right">
                  Rain: {day.precipProbability}%
                </span>
                {index === bestDayIndex && (
                  <Sparkles className="h-4 w-4 text-amber-500" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Best Day Badge */}
        <div className="px-6 py-4 bg-accent/30 border-t border-border">
          <div className="flex items-center justify-center gap-2 text-accent-foreground">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <span className="font-medium">
              Best day to visit: {getFullDayName(bestDay.dayLabel)}
            </span>
          </div>
        </div>

        {/* Attribution */}
        <div className="px-6 py-3 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            Weather data by Open-Meteo
          </p>
        </div>
      </div>
    );
  }
);

WeatherCard.displayName = 'WeatherCard';
