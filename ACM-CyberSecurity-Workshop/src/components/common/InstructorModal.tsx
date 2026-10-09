import React, { useState } from 'react';
import { Zap, Lock, Unlock, Key, X } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface InstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
  protocolZeroUnlocked: boolean;
  onToggleProtocolZero: () => void;
  onUnlockAllMissions: () => void;
  onGrantXP: (amount: number) => void;
}

export const InstructorModal: React.FC<InstructorModalProps> = ({
  isOpen,
  onClose,
  protocolZeroUnlocked,
  onToggleProtocolZero,
  onUnlockAllMissions,
  onGrantXP,
}) => {
  const [accessCode, setAccessCode] = useState('');

  if (!isOpen) return null;

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.trim().toUpperCase() === 'PROTO-000' || accessCode.trim().toUpperCase() === 'ADMIN' || accessCode.trim().toUpperCase() === 'CYBER') {
      soundFx.playSuccess();
      if (!protocolZeroUnlocked) {
        onToggleProtocolZero();
      }
    } else {
      soundFx.playError();
      alert('INVALID ACCESS CODE. Hint for workshop instructor: Use code "PROTO-000" or toggle directly below.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-cyber-surface border-2 border-cyber-magenta rounded-xl p-6 shadow-neon-magenta relative">
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
            <Zap className="w-5 h-5 text-cyber-magenta" />
          </div>
          <div>
            <h3 className="font-display font-black text-lg text-white">
              INSTRUCTOR OPERATIONS CONSOLE
            </h3>
            <p className="text-xs font-mono text-cyber-magenta">
              WORKSHOP CONTROLS & PROTOCOL ZERO REVEAL
            </p>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-cyber-dark/80 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 mb-5 leading-relaxed">
          This control panel allows teachers & workshop coordinators to trigger classroom-wide events, reveal the secret bonus mission, or adjust operative telemetry for demonstrations.
        </div>

        {/* Fast Code Input */}
        <form onSubmit={handleCodeSubmit} className="mb-5 space-y-2">
          <label className="text-[11px] font-mono text-cyber-cyan uppercase font-bold flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5" />
            Direct Keycode Activation
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Enter PROTO-000..."
              className="flex-1 bg-black/60 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-cyber-cyan focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-cyber-cyan text-black font-display font-bold text-xs rounded-lg hover:shadow-neon-cyan transition-all uppercase"
            >
              EXECUTE
            </button>
          </div>
        </form>

        {/* Quick Toggles */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-dark border border-slate-800">
            <div>
              <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                <span>PROTOCOL ZERO (HIDDEN MISSION)</span>
                {protocolZeroUnlocked ? (
                  <span className="text-[10px] text-cyber-green bg-cyber-green/10 px-1.5 py-0.5 rounded border border-cyber-green/30">
                    ACTIVE
                  </span>
                ) : (
                  <span className="text-[10px] text-cyber-muted bg-slate-800 px-1.5 py-0.5 rounded">
                    LOCKED
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-cyber-muted">
                Unlocks the classified 6th bonus incident for the classroom.
              </div>
            </div>
            <button
              onClick={() => {
                soundFx.playGlitch();
                onToggleProtocolZero();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1 ${
                protocolZeroUnlocked 
                  ? 'bg-cyber-magenta text-white shadow-neon-magenta' 
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {protocolZeroUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              {protocolZeroUnlocked ? 'LOCK' : 'REVEAL'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-dark border border-slate-800">
            <div>
              <div className="text-xs font-mono font-bold text-white">
                DEMO ACCELERATOR: UNLOCK ALL MISSIONS
              </div>
              <div className="text-[11px] font-mono text-cyber-muted">
                Complete and unlock all 5 missions & final incident instantly.
              </div>
            </div>
            <button
              onClick={() => {
                soundFx.playSuccess();
                onUnlockAllMissions();
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase bg-cyber-green/20 text-cyber-green border border-cyber-green/40 hover:bg-cyber-green hover:text-black transition-all"
            >
              UNLOCK ALL
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-dark border border-slate-800">
            <div>
              <div className="text-xs font-mono font-bold text-white">
                GRANT BONUS OPERATIVE XP
              </div>
              <div className="text-[11px] font-mono text-cyber-muted">
                Add +500 XP to student progress for live participation.
              </div>
            </div>
            <button
              onClick={() => {
                soundFx.playSuccess();
                onGrantXP(500);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase bg-cyber-yellow/20 text-cyber-yellow border border-cyber-yellow/40 hover:bg-cyber-yellow hover:text-black transition-all"
            >
              +500 XP
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
