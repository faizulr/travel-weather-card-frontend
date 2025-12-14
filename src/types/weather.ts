export interface Location {
  name: string;
  lat: number;
  lon: number;
  country: string;
  admin?: string;
  timezone: string;
}

export interface DailyForecast {
  date: Date;
  dayLabel: string;
  weatherCode: number;
  tempHigh: number;
  tempLow: number;
  precipProbability: number;
}

export interface Forecast {
  location: Location;
  daily: DailyForecast[];
  bestDayIndex: number;
}

export type AppState = 
  | { type: 'empty' }
  | { type: 'autocomplete-loading' }
  | { type: 'autocomplete-results'; suggestions: Location[] }
  | { type: 'autocomplete-no-results' }
  | { type: 'location-selected'; location: Location }
  | { type: 'forecast-loading'; location: Location }
  | { type: 'success'; forecast: Forecast }
  | { type: 'geocode-error'; message: string }
  | { type: 'forecast-error'; location: Location; message: string };
