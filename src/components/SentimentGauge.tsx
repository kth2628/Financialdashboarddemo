import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface SentimentGaugeProps {
  sentiment: number; // -100 to 100
}

export function SentimentGauge({ sentiment }: SentimentGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(sentiment);
    }, 100);
    return () => clearTimeout(timer);
  }, [sentiment]);

  const getColor = (value: number) => {
    if (value > 50) return '#16a34a'; // green-600
    if (value > 0) return '#2563eb'; // blue-600
    if (value > -50) return '#ea580c'; // orange-600
    return '#dc2626'; // red-600
  };

  const getTextColor = (value: number) => {
    if (value > 50) return 'text-green-600';
    if (value > 0) return 'text-blue-600';
    if (value > -50) return 'text-orange-600';
    return 'text-red-600';
  };

  // Convert sentiment (-100 to 100) to angle (0 to 180 degrees for half circle)
  const percentage = ((animatedValue + 100) / 200) * 100;
  const angle = (percentage / 100) * 180;
  
  // Calculate position on arc
  const radius = 70;
  const centerX = 100;
  const centerY = 100;
  const angleInRadians = ((180 - angle) * Math.PI) / 180;
  const indicatorX = centerX + radius * Math.cos(angleInRadians);
  const indicatorY = centerY - radius * Math.sin(angleInRadians);

  return (
    <div className="py-2">
      <div className="relative w-full max-w-xs mx-auto">
        {/* SVG Half Circle Gauge */}
        <svg className="w-full" viewBox="0 0 200 110" style={{ overflow: 'visible' }}>
          {/* Background arc - gradient */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#dc2626', stopOpacity: 0.25 }} />
              <stop offset="33%" style={{ stopColor: '#ea580c', stopOpacity: 0.25 }} />
              <stop offset="66%" style={{ stopColor: '#2563eb', stopOpacity: 0.25 }} />
              <stop offset="100%" style={{ stopColor: '#16a34a', stopOpacity: 0.25 }} />
            </linearGradient>
          </defs>
          
          {/* Background arc */}
          <path
            d="M 30 100 A 70 70 0 0 1 170 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          
          {/* Animated progress arc */}
          <motion.path
            d="M 30 100 A 70 70 0 0 1 170 100"
            fill="none"
            stroke={getColor(animatedValue)}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="220"
            initial={{ strokeDashoffset: 220 }}
            animate={{ strokeDashoffset: 220 - (220 * percentage / 100) }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
          
          {/* Indicator circle on arc */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.circle
              cx={indicatorX}
              cy={indicatorY}
              r="8"
              fill={getColor(animatedValue)}
              initial={{ cx: 30, cy: 100 }}
              animate={{ cx: indicatorX, cy: indicatorY }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
            <motion.circle
              cx={indicatorX}
              cy={indicatorY}
              r="4"
              fill="white"
              initial={{ cx: 30, cy: 100 }}
              animate={{ cx: indicatorX, cy: indicatorY }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </motion.g>
        </svg>
        
        {/* Center value display */}
        <div className="absolute inset-0 flex items-end justify-center" style={{ paddingBottom: '18%' }}>
          <motion.div
            className={`text-3xl ${getTextColor(animatedValue)}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {animatedValue > 0 ? '+' : ''}{animatedValue}
          </motion.div>
        </div>
      </div>

      {/* Labels */}
      <div className="relative h-4 mt-1">
        <span className="absolute text-xs text-gray-500" style={{ left: '33%', transform: 'translateX(-50%)' }}>Bearish</span>
        <span className="absolute left-1/2 -translate-x-1/2 text-xs text-gray-500">Neutral</span>
        <span className="absolute text-xs text-gray-500" style={{ left: '67%', transform: 'translateX(-50%)' }}>Bullish</span>
      </div>
    </div>
  );
}
