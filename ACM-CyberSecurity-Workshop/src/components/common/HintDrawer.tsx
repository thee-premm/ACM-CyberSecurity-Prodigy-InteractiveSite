import React, { useState } from 'react';
import { HelpCircle, ChevronRight, ChevronDown, Sparkles } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface HintDrawerProps {
  hints: string[];
}

export const HintDrawer: React.FC<HintDrawerProps> = ({ hints }) => {
  const [revealedCount, setRevealedCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleRevealNext = () => {
    if (revealedCount < hints.length) {
      soundFx.playScan();
      setRevealedCount(prev => prev + 1);
    }
  };

  return (
    <div className="bg-cyber-surface/90 border border-slate-800 rounded-lg overflow-hidden">
      <button
        onClick={() => {
          soundFx.playClick();
          setIsOpen(!isOpen);
        }}
        className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyber-yellow" />
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            TACTICAL HINT SYSTEM ({revealedCount}/{hints.length} UNLOCKED)
          </span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-cyber-muted" />
        ) : (
          <ChevronRight className="w-4 h-4 text-cyber-muted" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 border-t border-slate-800 space-y-3 bg-black/40">
          {hints.slice(0, revealedCount).map((hint, idx) => (
            <div 
              key={idx} 
              className="p-3 rounded bg-cyber-dark/80 border border-cyber-yellow/20 text-xs font-mono text-cyber-yellow/90 flex items-start gap-2 animate-fadeIn"
            >
              <Sparkles className="w-4 h-4 text-cyber-yellow shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white uppercase">HINT #{idx + 1}: </span>
                <span>{hint}</span>
              </div>
            </div>
          ))}

          {revealedCount < hints.length ? (
            <button
              onClick={handleRevealNext}
              className="w-full py-2 px-3 rounded bg-cyber-yellow/10 border border-cyber-yellow/30 text-cyber-yellow hover:bg-cyber-yellow/20 text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              REVEAL HINT #{revealedCount + 1}
            </button>
          ) : (
            <div className="text-[11px] font-mono text-center text-cyber-muted italic">
              All tactical hints for this mission have been accessed.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
