import React from 'react';
import { 
  Shield, Footprints, Radio, ShieldAlert, KeyRound, Crosshair, 
  Zap, CheckCircle2, Lock, ArrowRight, Play, 
  Clock, Activity 
} from 'lucide-react';
import type { UserProgress, MissionId } from '../types';
import { soundFx } from '../utils/audio';
import { MISSIONS } from '../utils/constants';
import { calculateRank } from '../utils/storage';
import { TerminalLog } from './common/TerminalLog';

interface DashboardProps {
  progress: UserProgress;
  onSelectMission: (missionId: MissionId | 'blackout' | 'protocol_zero') => void;
  onOpenInstructor: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  progress,
  onSelectMission,
}) => {
  const { rank, level } = calculateRank(progress.xp);
  const completedCount = progress.completedMissions.length;
  const isFinalUnlocked = completedCount >= 5;

  const getMissionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints':
        return <Footprints className="w-6 h-6" />;
      case 'Radio':
        return <Radio className="w-6 h-6" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6" />;
      case 'KeyRound':
        return <KeyRound className="w-6 h-6" />;
      case 'Crosshair':
      case 'FishHook':
        return <Crosshair className="w-6 h-6" />;
      default:
        return <Shield className="w-6 h-6" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-fadeIn">
      
      {/* Hero Operative Welcome Banner */}
      <div className="bg-cyber-surface border border-cyber-cyan/40 rounded-2xl p-6 sm:p-8 shadow-neon-cyan relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-cyber-cyan/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-cyber-magenta/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan font-bold uppercase tracking-wider">
                OPERATIONS HQ // SECTOR 7
              </span>
              <span className="text-xs font-mono text-cyber-green flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyber-green animate-ping" />
                SIMULATION LIVE
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-wide text-glow-cyan">
              WELCOME, JUNIOR OPERATIVE
            </h1>

            <p className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed">
              You are assigned to investigate five real-world cyber threat vectors: 
              <strong> Digital Footprints</strong>, <strong>API Leaks</strong>, <strong>Broken Access Control</strong>, <strong>Ciphers</strong>, and <strong>Social Engineering</strong>. Complete all operations to unlock the final school breach investigation.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-black/60 border border-slate-800 rounded-xl p-3.5 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">MISSIONS COMPLETED</div>
              <div className="text-2xl font-mono font-bold text-cyber-cyan text-glow-cyan">
                {completedCount} <span className="text-xs text-slate-500">/ 5</span>
              </div>
            </div>

            <div className="bg-black/60 border border-slate-800 rounded-xl p-3.5 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">ACCUMULATED XP</div>
              <div className="text-2xl font-mono font-bold text-cyber-yellow text-glow-yellow">
                {progress.xp}
              </div>
            </div>

            <div className="bg-black/60 border border-slate-800 rounded-xl p-3.5 text-center col-span-2 sm:col-span-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase">CLEARANCE RANK</div>
              <div className="text-xs font-mono font-bold text-cyber-green mt-2 truncate">
                {rank}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Tactical Missions Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyber-cyan" />
            <h2 className="font-display font-black text-xl text-white tracking-wider">
              PRIMARY TACTICAL MISSIONS
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            CHOOSE AN OPERATION TO BEGIN INVESTIGATION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MISSIONS.map((m) => {
            const isCompleted = progress.completedMissions.includes(m.id);

            return (
              <div
                key={m.id}
                className={`cyber-card rounded-xl p-5 flex flex-col justify-between transition-all ${
                  isCompleted
                    ? 'border-cyber-green/40 shadow-neon-green'
                    : 'border-slate-800 hover:border-cyber-cyan/50 hover:shadow-neon-cyan'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                    <span className="text-xs font-mono font-bold text-cyber-cyan">
                      OPERATION #{m.number}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {m.estimatedDuration}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-green/20 text-cyber-green border border-cyber-green/40 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> DONE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-3 rounded-xl border shrink-0 ${
                      isCompleted 
                        ? 'bg-cyber-green/10 border-cyber-green text-cyber-green' 
                        : 'bg-cyber-dark border-cyber-cyan/30 text-cyber-cyan'
                    }`}>
                      {getMissionIcon(m.icon)}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-white hover:text-cyber-cyan transition-colors">
                        {m.title}
                      </h3>
                      <div className="text-[11px] font-mono text-cyber-cyan mt-0.5">
                        {m.concept}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-mono text-slate-300 leading-relaxed mb-4">
                    {m.tagline}
                  </p>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-cyber-yellow">
                    +{m.xpReward} XP
                  </span>

                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onSelectMission(m.id);
                    }}
                    className={`px-4 py-2 rounded-lg font-display text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                      isCompleted
                        ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                        : 'bg-cyber-cyan text-black hover:shadow-neon-cyan'
                    }`}
                  >
                    {isCompleted ? 'REVIEW' : 'LAUNCH'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Special Final Incident: OPERATION BLACKOUT */}
      <div className={`rounded-2xl p-6 sm:p-8 border-2 transition-all ${
        isFinalUnlocked
          ? 'bg-gradient-to-r from-cyber-dark via-purple-950/30 to-cyber-dark border-cyber-magenta shadow-neon-magenta animate-pulse-glow'
          : 'bg-cyber-surface/60 border-slate-800 opacity-80'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono px-2.5 py-0.5 rounded font-bold uppercase ${
                isFinalUnlocked ? 'bg-cyber-magenta text-white animate-pulse' : 'bg-slate-800 text-slate-500'
              }`}>
                {isFinalUnlocked ? '★ OPERATION UNLOCKED' : 'LOCKED — COMPLETE 5 MISSIONS'}
              </span>
              <span className="text-xs font-mono text-cyber-yellow">
                FINAL CHALLENGE // +600 XP
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-black text-white text-glow-magenta">
              OPERATION BLACKOUT: TRACE THE BREACH
            </h2>

            <p className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed">
              A comprehensive live cyber incident connecting all 5 missions! Trace the breach, piece together the kill chain from digital footprints to SMS phishing, and deploy unified countermeasures.
            </p>
          </div>

          <div>
            {isFinalUnlocked ? (
              <button
                onClick={() => {
                  soundFx.playSuccess();
                  onSelectMission('blackout');
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyber-magenta to-purple-600 text-white font-display font-black text-sm uppercase tracking-wider shadow-neon-magenta hover:brightness-110 transition-all flex items-center justify-center gap-2 animate-bounce"
              >
                <Play className="w-4 h-4 fill-current" />
                ENTER OPERATION BLACKOUT
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-black/60 border border-slate-800 text-center text-xs font-mono text-slate-400 flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyber-muted" />
                <span>Complete all 5 primary operations to unlock ({completedCount}/5).</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Classified Hidden Bonus: PROTOCOL ZERO */}
      {progress.protocolZeroUnlocked && (
        <div className="rounded-2xl p-6 border-2 border-cyber-magenta bg-cyber-magenta/10 shadow-neon-magenta animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyber-magenta" />
                <span className="text-xs font-mono text-cyber-magenta font-bold uppercase tracking-wider">
                  CLASSIFIED INSTRUCTOR EVENT // ACTIVE
                </span>
              </div>
              <h3 className="text-xl font-display font-black text-white text-glow-magenta">
                PROTOCOL ZERO: EMERGENCY THREAT CONTAINMENT
              </h3>
              <p className="text-xs font-mono text-slate-300">
                Bonus classroom operation! Contain an autonomous botnet threat, seal backdoor ports, and quarantine rogue subnets.
              </p>
            </div>

            <button
              onClick={() => {
                soundFx.playGlitch();
                onSelectMission('protocol_zero');
              }}
              className="px-6 py-3 rounded-xl bg-cyber-magenta text-white font-display font-bold text-xs uppercase tracking-wider shadow-neon-magenta hover:bg-magenta-600 transition-all flex items-center gap-2 self-start md:self-auto"
            >
              LAUNCH PROTOCOL ZERO
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Live Telemetry Stream */}
      <TerminalLog
        logs={[
          { id: '1', timestamp: new Date().toLocaleTimeString(), type: 'system', message: '[CYBERQUEST_CORE] Cyber Range operations center online and monitoring.' },
          { id: '2', timestamp: new Date().toLocaleTimeString(), type: 'info', message: `[OPERATIVE_STATUS] Current Clearance: ${rank} (Level ${level}) with ${progress.xp} total XP.` },
        ]}
        title="OPERATIONS_HQ // CENTRAL_TELEMETRY"
        maxHeight="max-h-36"
      />

    </div>
  );
};
