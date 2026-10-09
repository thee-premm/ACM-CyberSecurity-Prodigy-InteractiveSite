import React, { useState, useEffect } from 'react';
import { Terminal, Shield, ChevronRight, Play } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  '[SYS] INITIALIZING CYBERQUEST SIMULATION KERNEL v2.40...',
  '[SYS] LOADING SECURE VIRTUALIZED SANDBOX ENVIRONMENT...',
  '[NET] ESTABLISHING ENCRYPTED HUD CHANNELS: 127.0.0.1:8080',
  '[SEC] 5 CLASSIFIED THREAT VECTORS LOADED INTO MEMORY.',
  '[AUTH] BIOMETRIC RECRUIT AUTHENTICATED: LEVEL 1 OPERATIVE.',
  '[SYS] READY FOR DEPLOYMENT. WELCOME, CYBER OPERATIVE.',
];

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (currentLineIdx < BOOT_LOGS.length) {
      const timer = setTimeout(() => {
        soundFx.playKeyBlip();
        setDisplayedLogs(prev => [...prev, BOOT_LOGS[currentLineIdx]]);
        setCurrentLineIdx(prev => prev + 1);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      const readyTimer = setTimeout(() => {
        soundFx.playSuccess();
        setIsReady(true);
      }, 400);
      return () => clearTimeout(readyTimer);
    }
  }, [currentLineIdx]);

  const handleSkip = () => {
    soundFx.playClick();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-cyber-bg flex flex-col items-center justify-center p-4">
      {/* Background glow & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.12)_0,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-2xl bg-cyber-surface/90 border border-cyber-cyan/40 rounded-xl p-6 shadow-neon-cyan relative overflow-hidden backdrop-blur-xl">
        
        {/* Top Terminal Bar */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-cyber-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyber-magenta/80" />
            <div className="w-3 h-3 rounded-full bg-cyber-yellow/80" />
            <div className="w-3 h-3 rounded-full bg-cyber-green/80" />
            <span className="text-xs font-mono text-cyber-muted ml-2 flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
              CYBERQUEST_INIT.EXE
            </span>
          </div>

          <button
            onClick={handleSkip}
            className="text-xs font-mono text-cyber-cyan hover:text-white px-3 py-1 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 hover:border-cyber-cyan hover:bg-cyber-cyan/20 transition-all flex items-center gap-1"
          >
            SKIP_INIT [ESC]
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Central Graphic */}
        <div className="flex items-center justify-center my-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-2 border-cyber-cyan/30 border-t-cyber-cyan animate-spin flex items-center justify-center" />
            <Shield className="w-10 h-10 text-cyber-cyan absolute inset-0 m-auto animate-pulse" />
          </div>
        </div>

        {/* Terminal Text Logs */}
        <div className="bg-black/60 rounded-lg p-4 font-mono text-xs sm:text-sm text-cyber-cyan space-y-2 min-h-[160px] border border-cyber-border">
          {displayedLogs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-cyber-green select-none">&gt;</span>
              <span className={idx === displayedLogs.length - 1 ? 'text-white font-semibold' : 'text-cyber-cyan/90'}>
                {log}
              </span>
            </div>
          ))}
          {!isReady && (
            <div className="text-cyber-cyan terminal-cursor">_</div>
          )}
        </div>

        {/* Enter Mission Button */}
        <div className="mt-6 flex justify-end">
          {isReady ? (
            <button
              onClick={() => {
                soundFx.playSuccess();
                onComplete();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-cyber-cyan to-cyber-green text-black font-display font-black text-sm tracking-wider uppercase hover:shadow-neon-cyan transition-all flex items-center justify-center gap-2 animate-bounce"
            >
              <Play className="w-4 h-4 fill-current" />
              ENTER OPERATIONS CENTER
            </button>
          ) : (
            <div className="text-xs font-mono text-cyber-muted animate-pulse">
              [ESTABLISHING NEURAL LINK...]
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
