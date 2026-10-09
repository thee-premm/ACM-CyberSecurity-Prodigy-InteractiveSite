import React from 'react';
import { Shield, Award, Zap, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import type { UserProgress } from '../../types';
import { soundFx } from '../../utils/audio';
import { calculateRank } from '../../utils/storage';
import { BADGES } from '../../utils/constants';

interface HeaderProps {
  progress: UserProgress;
  onResetClick: () => void;
  onSoundToggle: () => void;
  onInstructorToggle: () => void;
  onNavigateHome: () => void;
  currentView?: string;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  onResetClick,
  onSoundToggle,
  onInstructorToggle,
  onNavigateHome,
}) => {
  const { rank, level, nextLevelXp } = calculateRank(progress.xp);

  return (
    <header className="sticky top-0 z-40 w-full bg-cyber-dark/90 backdrop-blur-md border-b border-cyber-cyan/20 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => {
            soundFx.playClick();
            onNavigateHome();
          }}
          className="flex items-center gap-3 cursor-pointer group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') onNavigateHome(); }}
        >
          <div className="relative w-10 h-10 rounded-lg bg-cyber-surface border border-cyber-cyan/50 flex items-center justify-center group-hover:border-cyber-cyan group-hover:shadow-neon-cyan transition-all">
            <Shield className="w-5 h-5 text-cyber-cyan animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyber-green animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-xl tracking-wider text-white group-hover:text-glow-cyan transition-all">
                CYBER<span className="text-cyber-cyan">QUEST</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan">
                OPS-v2.4
              </span>
            </div>
            <p className="text-[11px] font-mono text-cyber-muted hidden sm:block">
              TRACE SIGNAL // DEFEND THE SYSTEM
            </p>
          </div>
        </div>

        {/* HUD Progress & Stats */}
        <div className="flex items-center gap-4 md:gap-6">
          
          {/* XP & Rank HUD */}
          <div className="flex items-center gap-3 bg-cyber-surface/80 border border-slate-800 rounded-lg px-3 py-1.5">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyber-cyan font-bold">
                  {rank}
                </span>
                <span className="text-[10px] font-mono text-cyber-muted">
                  LVL {level}
                </span>
              </div>
              <div className="w-24 md:w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-green transition-all duration-500"
                  style={{ width: `${(progress.xp % nextLevelXp) / nextLevelXp * 100}%` }}
                />
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono font-bold text-cyber-yellow text-glow-yellow">
                {progress.xp} <span className="text-[10px] text-cyber-muted">XP</span>
              </div>
            </div>
          </div>

          {/* Badges Count */}
          <div 
            title="Earned Badges"
            className="flex items-center gap-1.5 bg-cyber-surface/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono"
          >
            <Award className="w-4 h-4 text-cyber-yellow" />
            <span className="text-white font-bold">{progress.badges.length}</span>
            <span className="text-cyber-muted">/ {BADGES.length}</span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5">
            
            {/* Audio Toggle */}
            <button
              onClick={() => {
                soundFx.playClick();
                onSoundToggle();
              }}
              title={progress.soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
              className="p-2 rounded-lg bg-cyber-surface border border-slate-800 hover:border-cyber-cyan/50 text-cyber-muted hover:text-cyber-cyan transition-all"
              aria-label="Toggle Sound"
            >
              {progress.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyber-cyan" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* Instructor / Admin Protocol Zero Trigger */}
            <button
              onClick={() => {
                soundFx.playGlitch();
                onInstructorToggle();
              }}
              title="Instructor Console / Protocol Zero Control"
              className={`p-2 rounded-lg border transition-all ${
                progress.protocolZeroUnlocked 
                  ? 'bg-cyber-magenta/20 border-cyber-magenta text-cyber-magenta shadow-neon-magenta animate-pulse' 
                  : 'bg-cyber-surface border-slate-800 hover:border-cyber-magenta/50 text-cyber-muted hover:text-cyber-magenta'
              }`}
              aria-label="Instructor Protocol Control"
            >
              <Zap className="w-4 h-4" />
            </button>

            {/* Reset Progress */}
            <button
              onClick={() => {
                soundFx.playClick();
                onResetClick();
              }}
              title="Reset All Progress"
              className="p-2 rounded-lg bg-cyber-surface border border-slate-800 hover:border-cyber-magenta/40 text-cyber-muted hover:text-cyber-magenta transition-all"
              aria-label="Reset Progress"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
