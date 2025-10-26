import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface SearchBarProps {
  onSearch: (ticker: string) => void;
  disabled?: boolean;
  selectedTickers: string[];
}

const popularTickers = ['NVDA', 'TSLA', 'AAPL', 'MSFT', 'GOOGL'];

export function SearchBar({ onSearch, disabled, selectedTickers }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
      setSearchValue('');
    }
  };

  const handleQuickSearch = (ticker: string) => {
    onSearch(ticker);
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search ticker..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value.toUpperCase())}
            disabled={disabled}
            className="pl-10 pr-3 py-2 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:ring-gray-900 text-sm"
          />
        </div>
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
