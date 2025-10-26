import { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { SentimentCard } from './components/SentimentCard';
import { CrawlingAnimation } from './components/CrawlingAnimation';
import { TrendingUp, Activity } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';

interface StockData {
  ticker: string;
  sentiment: number; // -100 to 100
  sentimentLabel: string;
  summary: string;
  headlines: Array<{
    title: string;
    source: string;
    url: string;
    timestamp: string;
  }>;
  lastUpdated: string;
}

const mockData: Record<string, StockData> = {
  NVDA: {
    ticker: 'NVDA',
    sentiment: 78,
    sentimentLabel: 'Bullish',
    summary: 'Strong positive sentiment driven by AI chip demand and recent earnings beat expectations.',
    headlines: [
      {
        title: 'NVIDIA Crushes Q4 Earnings, AI Demand Surges',
        source: 'Bloomberg',
        url: '#',
        timestamp: '2 hours ago'
      },
      {
        title: 'Major Cloud Providers Increase NVIDIA Orders',
        source: 'Reuters',
        url: '#',
        timestamp: '5 hours ago'
      },
      {
        title: 'Analysts Raise Price Targets Following Strong Guidance',
        source: 'CNBC',
        url: '#',
        timestamp: '8 hours ago'
      }
    ],
    lastUpdated: 'Just now'
  },
  TSLA: {
    ticker: 'TSLA',
    sentiment: -32,
    sentimentLabel: 'Bearish',
    summary: 'Mixed sentiment due to production concerns and competitive pressure in EV market.',
    headlines: [
      {
        title: 'Tesla Faces Growing Competition in China Market',
        source: 'Wall Street Journal',
        url: '#',
        timestamp: '1 hour ago'
      },
      {
        title: 'Production Delays Reported at Berlin Gigafactory',
        source: 'Financial Times',
        url: '#',
        timestamp: '4 hours ago'
      },
      {
        title: 'Analysts Express Concerns Over Q1 Delivery Numbers',
        source: 'MarketWatch',
        url: '#',
        timestamp: '6 hours ago'
      }
    ],
    lastUpdated: 'Just now'
  },
  AAPL: {
    ticker: 'AAPL',
    sentiment: 45,
    sentimentLabel: 'Neutral-Positive',
    summary: 'Moderate positive sentiment with anticipation around new product launches and services growth.',
    headlines: [
      {
        title: 'Apple Services Revenue Shows Strong Growth',
        source: 'Bloomberg',
        url: '#',
        timestamp: '3 hours ago'
      },
      {
        title: 'iPhone 16 Pre-Orders Exceed Expectations',
        source: 'TechCrunch',
        url: '#',
        timestamp: '7 hours ago'
      },
      {
        title: 'Apple Invests Heavily in AI Research',
        source: 'The Verge',
        url: '#',
        timestamp: '9 hours ago'
      }
    ],
    lastUpdated: 'Just now'
  },
  MSFT: {
    ticker: 'MSFT',
    sentiment: 82,
    sentimentLabel: 'Very Bullish',
    summary: 'Exceptional sentiment driven by Azure growth and successful AI integration across products.',
    headlines: [
      {
        title: 'Microsoft Azure Gains Market Share in Cloud Computing',
        source: 'Forbes',
        url: '#',
        timestamp: '1 hour ago'
      },
      {
        title: 'Copilot AI Tools Drive Enterprise Adoption',
        source: 'Reuters',
        url: '#',
        timestamp: '4 hours ago'
      },
      {
        title: 'Microsoft Announces Record Cloud Revenue',
        source: 'CNBC',
        url: '#',
        timestamp: '7 hours ago'
      }
    ],
    lastUpdated: 'Just now'
  },
  GOOGL: {
    ticker: 'GOOGL',
    sentiment: 12,
    sentimentLabel: 'Neutral',
    summary: 'Cautious sentiment amid AI competition concerns and regulatory challenges in multiple markets.',
    headlines: [
      {
        title: 'Google Faces New Antitrust Challenges in EU',
        source: 'Financial Times',
        url: '#',
        timestamp: '2 hours ago'
      },
      {
        title: 'Search Ad Revenue Stabilizes After Recent Declines',
        source: 'Bloomberg',
        url: '#',
        timestamp: '5 hours ago'
      },
      {
        title: 'Gemini AI Shows Promise in Early Enterprise Tests',
        source: 'TechCrunch',
        url: '#',
        timestamp: '8 hours ago'
      }
    ],
    lastUpdated: 'Just now'
  }
};

export default function App() {
  const [selectedTickers, setSelectedTickers] = useState<string[]>(['NVDA', 'TSLA']);
  const [isCrawling, setIsCrawling] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleSearch = (ticker: string) => {
    const upperTicker = ticker.toUpperCase();
    if (ticker) {
      if (selectedTickers.includes(upperTicker)) {
        // Remove ticker if already selected
        setSelectedTickers(selectedTickers.filter(t => t !== upperTicker));
      } else {
        // Check if ticker exists in mockData
        if (!mockData[upperTicker]) {
          toast.error(`Ticker "${upperTicker}" not found`, {
            description: 'Please try one of the available tickers: NVDA, TSLA, AAPL, MSFT, GOOGL'
          });
          return;
        }
        // Add ticker if not selected
        setIsCrawling(true);
        setTimeout(() => {
          setSelectedTickers([...selectedTickers, upperTicker]);
          setIsCrawling(false);
        }, 2000);
      }
    }
  };

  const handleRemoveTicker = (ticker: string) => {
    setSelectedTickers(selectedTickers.filter(t => t !== ticker));
  };

  const handleRefresh = () => {
    const popularTickers = ['NVDA', 'TSLA', 'AAPL', 'MSFT', 'GOOGL'];
    setSelectedTickers(popularTickers);
    setIsCrawling(true);
    setTimeout(() => {
      setLastRefresh(new Date());
      setIsCrawling(false);
    }, 2000);
  };

  // Auto-refresh every 5 minutes (stretch goal)
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-900 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">Sentiment AI</h1>
                <p className="text-gray-500 text-xs">Real-time market intelligence</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isCrawling}
              className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md transition-colors text-sm"
            >
              Refresh
            </button>
          </div>

          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} disabled={isCrawling} selectedTickers={selectedTickers} />
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* Crawling Animation */}
        {isCrawling && (
          <div className="mb-4">
            <CrawlingAnimation />
          </div>
        )}

        {/* Sentiment Cards - Vertical Stack */}
        <div className="space-y-4">
          {selectedTickers.map(ticker => {
            const data = mockData[ticker];
            if (!data) return null;
            
            return (
              <SentimentCard
                key={ticker}
                data={data}
                onRemove={() => handleRemoveTicker(ticker)}
              />
            );
          })}
        </div>

        {/* Empty State */}
        {selectedTickers.length === 0 && !isCrawling && (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-gray-900 mb-1">No tickers selected</h3>
            <p className="text-gray-500 text-sm">Search for a ticker to get started</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
        <p className="text-gray-500 text-xs text-center">
          Powered by AI • Last updated {lastRefresh.toLocaleTimeString()}
        </p>
      </div>
    </div>
    </>
  );
}
