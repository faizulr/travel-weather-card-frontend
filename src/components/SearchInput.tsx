import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Loader2, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { useGeocoding } from '@/hooks/useGeocoding';
import type { Location } from '@/types/weather';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  onLocationSelect: (location: Location) => void;
  selectedLocation: Location | null;
  onClearSelection: () => void;
}

export function SearchInput({ onLocationSelect, selectedLocation, onClearSelection }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [hasSearched, setHasSearched] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);
  const { searchLocations, isLoading } = useGeocoding();

  // Update input when location is selected externally
  useEffect(() => {
    if (selectedLocation) {
      setQuery(`${selectedLocation.name}, ${selectedLocation.country}`);
      setIsOpen(false);
    }
  }, [selectedLocation]);

  // Search when debounced query changes
  useEffect(() => {
    const search = async () => {
      if (debouncedQuery.length >= 2 && !selectedLocation) {
        const results = await searchLocations(debouncedQuery);
        setSuggestions(results);
        setHasSearched(true);
        setIsOpen(true);
        setHighlightedIndex(-1);
      } else {
        setSuggestions([]);
        setHasSearched(false);
      }
    };
    search();
  }, [debouncedQuery, searchLocations, selectedLocation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // If user edits after selection, clear the selection
    if (selectedLocation) {
      onClearSelection();
    }
  };

  const handleSelect = useCallback((location: Location) => {
    onLocationSelect(location);
    setQuery(`${location.name}, ${location.country}`);
    setSuggestions([]);
    setIsOpen(false);
    setHasSearched(false);
  }, [onLocationSelect]);

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setHasSearched(false);
    onClearSelection();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  const showNoResults = hasSearched && suggestions.length === 0 && !isLoading && query.length >= 2;

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder="Search any city or destination..."
          className="pl-12 pr-12 h-14 text-base rounded-xl border-2 border-border bg-card shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-label="Search location"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-popover border border-border rounded-xl shadow-lg overflow-hidden">
          {isLoading && (
            <div className="flex items-center gap-3 px-4 py-3 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Searching...</span>
            </div>
          )}

          {showNoResults && (
            <div className="px-4 py-4 text-center">
              <p className="text-sm text-muted-foreground">No locations found.</p>
              <p className="text-xs text-muted-foreground mt-1">Try "City, Country"</p>
            </div>
          )}

          {suggestions.length > 0 && (
            <ul 
              ref={listRef}
              role="listbox" 
              className="max-h-[280px] overflow-y-auto"
            >
              {suggestions.map((location, index) => (
                <li
                  key={`${location.lat}-${location.lon}`}
                  role="option"
                  aria-selected={index === highlightedIndex}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors",
                    index === highlightedIndex ? "bg-accent" : "hover:bg-muted"
                  )}
                  onClick={() => handleSelect(location)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{location.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {location.admin ? `${location.admin}, ` : ''}{location.country}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
