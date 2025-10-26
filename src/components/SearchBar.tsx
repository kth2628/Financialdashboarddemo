import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface SearchBarProps {
  onSearch: (ticker: string) => void;
  disabled?: boolean;
  selectedTickers: string[];
}

const popularTickers = ['NVDA', 'TSLA', 'AAPL', 'MSFT', 'GOOGL'];

// Helper function to calculate similarity score for typo tolerance
function getSimilarityScore(search: string, ticker: string): number {
  const searchLower = search.toLowerCase();
  const tickerLower = ticker.toLowerCase();
  
  // Exact match
  if (searchLower === tickerLower) return 100;
  
  // Starts with
  if (tickerLower.startsWith(searchLower)) return 90;
  
  // Contains
  if (tickerLower.includes(searchLower)) return 70;
  
  // Check for typos (Levenshtein-like simple check)
  let matches = 0;
  for (let i = 0; i < searchLower.length; i++) {
    if (tickerLower.includes(searchLower[i])) matches++;
  }
  const typoScore = (matches / searchLower.length) * 50;
  
  return typoScore;
}

export function SearchBar({ onSearch, disabled, selectedTickers }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Get filtered suggestions based on search value
  const suggestions = searchValue.trim() 
    ? popularTickers
        .map(ticker => ({ ticker, score: getSimilarityScore(searchValue, ticker) }))
        .filter(({ score }) => score > 30)
        .sort((a, b) => b.score - a.score)
        .map(({ ticker }) => ticker)
    : [];

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
      setSearchValue('');
      setShowSuggestions(false);
    }
  };

  const handleQuickSearch = (ticker: string) => {
    onSearch(ticker);
  };

  const handleSuggestionClick = (ticker: string) => {
    onSearch(ticker);
    setSearchValue('');
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setSearchValue(value);
    setShowSuggestions(value.trim().length > 0);
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="relative" ref={wrapperRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search ticker..."
            value={searchValue}
            onChange={handleInputChange}
            onFocus={() => searchValue.trim().length > 0 && setShowSuggestions(true)}
            disabled={disabled}
            className="pl-10 pr-3 py-2 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:ring-gray-900 text-sm"
          />
        </div>
        
        {/* Autocomplete Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 overflow-hidden">
            {suggestions.map((ticker) => {
              const isSelected = selectedTickers.includes(ticker);
              return (
                <button
                  key={ticker}
                  type="button"
                  onClick={() => handleSuggestionClick(ticker)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center justify-between ${
                    isSelected ? 'bg-gray-50' : ''
                  }`}
                >
                  <span className="text-gray-900">{ticker}</span>
                  {isSelected && (
                    <span className="text-xs text-gray-500">Selected</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </form>

      <div className="flex items-center gap-2 flex-wrap">
        {popularTickers.map(ticker => {
          const isSelected = selectedTickers.includes(ticker);
          return (
            <Badge
              key={ticker}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-colors text-xs ${
                isSelected 
                  ? 'bg-gray-900 hover:bg-gray-800 text-white border-gray-900' 
                  : 'hover:bg-gray-100 border-gray-300 text-gray-700'
              }`}
              onClick={() => !disabled && handleQuickSearch(ticker)}
            >
              {ticker}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
