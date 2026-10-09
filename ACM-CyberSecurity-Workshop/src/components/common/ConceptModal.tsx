import React from 'react';
import { BookOpen, X, CheckCircle2, Lightbulb } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface ConceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  conceptName: string;
  points: { title: string; desc: string }[];
  takeaway: string;
}

export const ConceptModal: React.FC<ConceptModalProps> = ({
  isOpen,
  onClose,
  title,
  conceptName,
  points,
  takeaway,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-cyber-surface border border-cyber-cyan/50 rounded-xl p-6 shadow-neon-cyan relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-cyber-muted hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-cyber-cyan/20 border border-cyber-cyan flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-cyber-cyan" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyber-cyan font-bold">
              CYBER ARCHIVE // INTEL BRIEFING
            </span>
            <h3 className="font-display font-black text-xl text-white">
              {title}
            </h3>
          </div>
        </div>

        <div className="bg-cyber-dark/80 border border-cyber-border rounded-lg p-3 mb-4 text-xs font-mono text-cyber-cyan">
          <strong>CORE PRINCIPLE:</strong> {conceptName}
        </div>

        <div className="space-y-3 mb-6">
          {points.map((pt, idx) => (
            <div key={idx} className="bg-black/40 border border-slate-800 rounded-lg p-3">
              <div className="font-display font-bold text-sm text-white flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-cyber-green shrink-0" />
                {pt.title}
              </div>
              <p className="text-xs font-mono text-slate-300 pl-6 leading-relaxed">
                {pt.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Big Takeaway */}
        <div className="bg-gradient-to-r from-cyber-cyan/10 to-cyber-green/10 border border-cyber-cyan/30 rounded-lg p-3.5 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-cyber-yellow shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              OPERATIVE TAKEAWAY
            </div>
            <div className="text-xs font-mono text-slate-200 mt-0.5 leading-relaxed">
              {takeaway}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-cyber-cyan text-black font-display font-bold text-xs uppercase tracking-wider hover:shadow-neon-cyan transition-all"
          >
            DISMISS INTEL
          </button>
        </div>

      </div>
    </div>
  );
};
