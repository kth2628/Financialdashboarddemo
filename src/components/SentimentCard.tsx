import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ExternalLink, X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { SentimentGauge } from './SentimentGauge';

interface StockData {
  ticker: string;
  sentiment: number;
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

interface SentimentCardProps {
  data: StockData;
  onRemove: () => void;
}

export function SentimentCard({ data, onRemove }: SentimentCardProps) {
  const getSentimentIcon = (sentiment: number) => {
    if (sentiment > 20) return <TrendingUp className="w-3 h-3" />;
    if (sentiment < -20) return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getSentimentBadgeColor = (sentiment: number) => {
    if (sentiment > 50) return 'bg-green-50 text-green-700 border-green-200';
    if (sentiment > 0) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (sentiment > -50) return 'bg-orange-50 text-orange-700 border-orange-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  return (
    <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-900 rounded-md">
              <span className="text-white text-sm">{data.ticker}</span>
            </div>
            <Badge variant="outline" className={`${getSentimentBadgeColor(data.sentiment)} text-xs`}>
              {getSentimentIcon(data.sentiment)}
              <span className="ml-1">{data.sentimentLabel}</span>
            </Badge>
          </div>
          <button
            onClick={onRemove}
            className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sentiment Gauge */}
        <div className="mb-4">
          <SentimentGauge sentiment={data.sentiment} />
        </div>

        {/* Summary */}
        <div className="mb-4">
          <h4 className="text-xs text-gray-500 mb-1">AI Summary</h4>
          <p className="text-gray-900 text-sm">{data.summary}</p>
        </div>

        {/* Headlines */}
        <div>
          <h4 className="text-xs text-gray-500 mb-2">Top Headlines</h4>
          <div className="space-y-2">
            {data.headlines.map((headline, index) => (
              <div
                key={index}
                className="p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border border-gray-100"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-900 mb-1 line-clamp-2">{headline.title}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span>{headline.source}</span>
                      <span>•</span>
                      <span>{headline.timestamp}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="shrink-0 text-gray-500 hover:text-gray-700 hover:bg-gray-200 h-6 w-6 p-0"
                    onClick={() => window.open(headline.url, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
