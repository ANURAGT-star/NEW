import React from 'react';
import { Explanation } from '../../../types';

interface ExplanationHighlightProps {
  explanation: Explanation;
  verdict: string;
}

const ExplanationHighlight: React.FC<ExplanationHighlightProps> = ({ explanation, verdict }) => {
  const getColor = (weight: number) => {
    const baseColor = verdict === 'Fake' ? 'rgba(255, 221, 51' : 'rgba(0, 255, 255';
    const intensity = 0.5 + 0.5 * Math.min(Math.abs(weight), 1);
    return `${baseColor}, ${intensity})`;
  };

  return (
    <div className="mt-3">
      <strong className="text-lg text-blue-700 dark:text-blue-300">Why this result?</strong>
      <div className="flex flex-wrap gap-2 mt-2">
        {explanation.filter(item => item.weight > 0).map((item, idx) => (
          <span
            key={`pos-${idx}`}
            title={`Positive influence: ${item.weight.toFixed(3)}`}
            style={{
              background: getColor(item.weight),
              color: '#111',
              border: '2px solid #222',
              borderRadius: '6px',
              padding: '2px 8px',
              fontWeight: 700,
              fontSize: '1em',
              boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
            }}
          >
            {item.word}
          </span>
        ))}
        {explanation.filter(item => item.weight < 0).map((item, idx) => (
          <span
            key={`neg-${idx}`}
            title={`Negative influence: ${item.weight.toFixed(3)}`}
            style={{
              background: getColor(item.weight),
              color: '#111',
              border: '2px solid #222',
              borderRadius: '6px',
              padding: '2px 8px',
              fontWeight: 700,
              fontSize: '1em',
              boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
            }}
          >
            {item.word}
          </span>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {verdict === 'Fake' ? 'Yellow' : 'Cyan'}: supports verdict, opposite color: contradicts
      </div>
    </div>
  );
};

export default ExplanationHighlight;
