import { motion } from 'motion/react';
import { Globe, Database, Brain } from 'lucide-react';
import { Card } from './ui/card';

const steps = [
  { icon: Globe, label: 'Crawling web sources', color: 'text-blue-600' },
  { icon: Database, label: 'Analyzing data', color: 'text-gray-700' },
  { icon: Brain, label: 'Generating insights', color: 'text-green-600' }
];

export function CrawlingAnimation() {
  return (
    <Card className="bg-gray-50 border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Globe className="w-5 h-5 text-gray-900" />
          </motion.div>
          <div>
            <h3 className="text-gray-900 text-sm">AI Agent Active</h3>
            <p className="text-xs text-gray-500">Gathering market intelligence...</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="space-y-2">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2, duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.2 + 0.1, duration: 0.2 }}
                className={`${step.color}`}
              >
                <step.icon className="w-4 h-4" />
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-700">{step.label}</span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.2 + 0.3 }}
                  >
                    <LoadingDots />
                  </motion.span>
                </div>
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ delay: index * 0.2, duration: 0.5, ease: 'easeOut' }}
                    className="h-full bg-gray-900"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function LoadingDots() {
  return (
    <span className="inline-flex gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          className="w-1 h-1 bg-gray-400 rounded-full"
        />
      ))}
    </span>
  );
}
