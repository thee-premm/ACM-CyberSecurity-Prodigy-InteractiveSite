import React from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-cyber-surface border border-cyber-magenta/60 rounded-xl p-6 shadow-neon-magenta relative">
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
          <div className="w-10 h-10 rounded-lg bg-cyber-magenta/20 border border-cyber-magenta flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-cyber-magenta" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">
              WIPE MISSION DATA?
            </h3>
            <p className="text-xs font-mono text-cyber-magenta">
              SYSTEM MEMORY OVERWRITE
            </p>
          </div>
        </div>

        <p className="text-xs font-mono text-slate-300 mb-6 leading-relaxed">
          This will reset all accumulated XP, unlocked badges, discovered clues, and mission states. This action cannot be undone. Are you sure you wish to restart as a fresh recruit?
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="w-1/2 py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-all"
          >
            CANCEL
          </button>
          <button
            onClick={() => {
              soundFx.playGlitch();
              onConfirm();
            }}
            className="w-1/2 py-2.5 px-4 rounded-lg bg-cyber-magenta hover:bg-magenta-600 text-white font-display text-xs font-bold uppercase tracking-wider shadow-neon-magenta transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            WIPE & RESET
          </button>
        </div>
      </div>
    </div>
  );
};
