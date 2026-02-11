
import React from 'react';
import { NICHES } from '../constants';
import { Niche } from '../types';

interface NicheSelectorProps {
  selectedNiche: Niche;
  onSelect: (niche: Niche) => void;
}

const NicheSelector: React.FC<NicheSelectorProps> = ({ selectedNiche, onSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {NICHES.map((niche) => (
        <button
          key={niche.id}
          onClick={() => onSelect(niche.id)}
          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
            selectedNiche === niche.id
              ? 'border-red-600 bg-red-600/10 scale-105'
              : 'border-slate-800 bg-slate-900 hover:border-slate-600'
          }`}
        >
          <span className="text-3xl">{niche.icon}</span>
          <span className="text-sm font-medium text-slate-300">{niche.label}</span>
        </button>
      ))}
    </div>
  );
};

export default NicheSelector;
