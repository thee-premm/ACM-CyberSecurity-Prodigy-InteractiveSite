import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, ArrowRight, Zap } from 'lucide-react';
import type { Badge } from '../../types';
import { soundFx } from '../../utils/audio';

interface BadgeModalProps {
  badge: Badge | null;
  xpEarned: number;
  onClose: () => void;
  onNextMission?: () => void;
  hasNextMission?: boolean;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({
  badge,
  xpEarned,
  onClose,
  onNextMission,
  hasNextMission = false,
}) => {
  useEffect(() => {
    if (badge) {
      soundFx.playBadgeUnlock();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#00ff66', '#ff0055', '#ffe600'],
        });
      } catch (err) {
        // Fallback safely if canvas not available
      }
    }
  }, [badge]);

  if (!badge) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-cyber-surface border-2 border-cyber-yellow/60 rounded-xl p-6 shadow-neon-yellow relative overflow-hidden animate-pulse-glow">
        
        {/* Background glow */}
        <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-cyber-yellow/10 blur-2xl" />
        <div className="absolute -left-12 -bottom-12 w-36 h-36 rounded-full bg-cyber-cyan/10 blur-2xl" />

        <div className="relative text-center">
          
          {/* Badge Icon Graphic */}
          <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-cyber-yellow/10 border-2 border-cyber-yellow flex items-center justify-center shadow-neon-yellow mb-4">
            <Award className="w-10 h-10 text-cyber-yellow animate-bounce" />
          </div>

          <span className="text-[11px] font-mono tracking-widest uppercase text-cyber-yellow font-bold px-2 py-0.5 rounded bg-cyber-yellow/10 border border-cyber-yellow/30">
            ★ MISSION ACCOMPLISHED ★
          </span>

          <h2 className="text-2xl font-display font-black text-white mt-3 mb-1 text-glow-yellow">
            {badge.title}
          </h2>

          <p className="text-xs font-mono text-slate-300 leading-relaxed max-w-sm mx-auto mb-4">
            {badge.description}
          </p>

          {/* XP Reward Chip */}
          <div className="inline-flex items-center gap-2 bg-cyber-dark border border-cyber-green/40 px-4 py-2 rounded-lg mb-6 shadow-neon-green">
            <Zap className="w-4 h-4 text-cyber-green" />
            <span className="font-mono text-sm font-bold text-white">
              +{xpEarned} XP AWARDED
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="w-full sm:w-1/2 py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold uppercase transition-all"
            >
              RETURN TO DASHBOARD
            </button>

            {hasNextMission && onNextMission && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onNextMission();
                }}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyber-cyan to-cyber-green text-black font-display text-xs font-black uppercase tracking-wider hover:shadow-neon-cyan transition-all flex items-center justify-center gap-1"
              >
                NEXT MISSION
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
