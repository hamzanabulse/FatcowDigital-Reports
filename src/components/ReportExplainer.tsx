'use client';

import { useState } from 'react';

interface Tooltip {
  term: string;
  definition: string;
  example: string;
  icon: string;
}

const seoTooltips: Tooltip[] = [
  {
    term: 'Clicks',
    definition: 'Number of times people clicked on your website link in Google search results',
    example: 'If 100 people clicked your link from Google, you have 100 clicks',
    icon: '🖱️',
  },
  {
    term: 'Impressions',
    definition: 'How many times your website appeared in Google search results',
    example: 'If your site showed up 1,000 times in searches, you have 1,000 impressions',
    icon: '👁️',
  },
  {
    term: 'CTR (Click-Through Rate)',
    definition: 'Percentage of people who saw your link and clicked it',
    example: 'If 100 people saw your link and 5 clicked, your CTR is 5%',
    icon: '📈',
  },
  {
    term: 'Average Position',
    definition: 'Your average ranking position in Google search results (lower number is better)',
    example: 'Position 3 means you typically show up as the 3rd result on Google',
    icon: '🎯',
  },
  {
    term: 'Month-over-Month (MoM)',
    definition: 'Comparison with last month\'s performance',
    example: '+10% MoM means you improved by 10% compared to last month',
    icon: '📅',
  },
  {
    term: 'Year-over-Year (YoY)',
    definition: 'Comparison with the same month last year',
    example: '+25% YoY means you\'re 25% better than the same time last year',
    icon: '📆',
  },
];

export default function ReportExplainer() {
  const [selectedTooltip, setSelectedTooltip] = useState<Tooltip | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-fatcow p-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-fatcow-blue to-fatcow-purple p-3 rounded-lg">
            <span className="text-2xl">📚</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-fatcow-navy">
              Understanding Your Report
            </h3>
            <p className="text-sm text-gray-600">
              Click any term below to learn what it means
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-white hover:bg-gray-50 px-4 py-2 rounded-lg font-medium text-fatcow-blue transition-all duration-300 transform hover:scale-105"
        >
          {isExpanded ? '▼ Show Less' : '▶ Show All'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        {seoTooltips.map((tooltip, index) => (
          <button
            key={tooltip.term}
            onClick={() => setSelectedTooltip(tooltip)}
            className={`
              p-4 rounded-lg text-center transition-all duration-300 transform hover:scale-105
              ${selectedTooltip?.term === tooltip.term
                ? 'bg-gradient-to-br from-fatcow-blue to-fatcow-purple text-white shadow-fatcow'
                : 'bg-white hover:bg-gray-50 text-fatcow-navy'
              }
            `}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="text-2xl mb-2">{tooltip.icon}</div>
            <div className="text-xs font-semibold">{tooltip.term}</div>
          </button>
        ))}
      </div>

      {selectedTooltip && (
        <div className="bg-white rounded-lg p-6 shadow-lg animate-scale-in">
          <div className="flex items-start gap-4">
            <div className="text-4xl">{selectedTooltip.icon}</div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-fatcow-navy mb-2">
                {selectedTooltip.term}
              </h4>
              <p className="text-gray-700 mb-3 leading-relaxed">
                {selectedTooltip.definition}
              </p>
              <div className="bg-green-50 border-l-4 border-fatcow-green p-4 rounded">
                <div className="flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <div>
                    <p className="text-sm font-semibold text-fatcow-green mb-1">
                      Example:
                    </p>
                    <p className="text-sm text-gray-700">
                      {selectedTooltip.example}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isExpanded && !selectedTooltip && (
        <div className="space-y-4 animate-fade-in">
          {seoTooltips.map((tooltip, index) => (
            <div 
              key={tooltip.term} 
              className="bg-white rounded-lg p-5 shadow hover:shadow-lg transition-shadow duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{tooltip.icon}</div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-fatcow-navy mb-2">
                    {tooltip.term}
                  </h4>
                  <p className="text-gray-700 text-sm mb-2">
                    {tooltip.definition}
                  </p>
                  <p className="text-xs text-gray-600 italic">
                    Example: {tooltip.example}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
