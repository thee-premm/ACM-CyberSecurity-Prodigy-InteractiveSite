import React, { useState } from 'react';
import { 
  Award, Shield, Layers, 
  Terminal, Crosshair, Check 
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import type { LogEntry } from '../types';
import { HintDrawer } from '../components/common/HintDrawer';
import { TerminalLog } from '../components/common/TerminalLog';

interface OperationBlackoutProps {
  onComplete: (xp: number, badgeId: string) => void;
  onBackToDashboard: () => void;
  isCompleted?: boolean;
}

interface IncidentEvidence {
  id: string;
  sourceMission: string;
  title: string;
  summary: string;
  vector: string;
}

const EVIDENCE_CARDS: IncidentEvidence[] = [
  {
    id: 'ev_1',
    sourceMission: 'Mission 01: Footprint',
    title: 'Leaked Tech Club Server IP & Location Tag',
    summary: 'Public social media check-in at the robotics lab exposed internal subnet address and lab working hours.',
    vector: 'Reconnaissance & Footprinting',
  },
  {
    id: 'ev_2',
    sourceMission: 'Mission 02: API Traffic',
    title: 'Exposed Admin Recovery PIN in JSON Payload',
    summary: 'Internal profile API endpoint returned unredacted recovery tokens in public browser response.',
    vector: 'Information Disclosure',
  },
  {
    id: 'ev_3',
    sourceMission: 'Mission 03: Broken Access',
    title: 'Insecure Direct Object Reference (IDOR) on Server Config',
    summary: 'Portal allowed unprivileged student accounts to fetch club server configs by changing ID in URL.',
    vector: 'Broken Authorization',
  },
  {
    id: 'ev_4',
    sourceMission: 'Mission 04: Intercepted Cipher',
    title: 'Decrypted Exfiltration Command: "PROJECT BLACKOUT"',
    summary: 'Caesar cipher key=3 decrypted the attacker\'s synchronized exfiltration timestamp and code name.',
    vector: 'Cryptographic Intel',
  },
  {
    id: 'ev_5',
    sourceMission: 'Mission 05: Phishing SMS',
    title: 'Spear-Phishing SMS Spoofing IT Support',
    summary: 'Club president received an urgent fake maintenance SMS prompting them to approve a 2FA prompt.',
    vector: 'Social Engineering & 2FA Bypass',
  }
];

export const OperationBlackout: React.FC<OperationBlackoutProps> = ({
  onComplete,
  onBackToDashboard,
}) => {
  const [timelineOrder, setTimelineOrder] = useState<string[]>([]);
  const [selectedCountermeasures, setSelectedCountermeasures] = useState<string[]>([]);
  const [incidentSolved, setIncidentSolved] = useState(false);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'danger',
      message: '[ALERT] OPERATION BLACKOUT: School Technology Club security incident active!',
    },
    {
      id: '2',
      timestamp: new Date().toLocaleTimeString(),
      type: 'warning',
      message: '[INCIDENT_RESPONSE] Correlate evidence across all 5 operational vectors.',
    }
  ]);

  const addLog = (message: string, type: LogEntry['type']) => {
    setLogs(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        type,
        message,
      }
    ]);
  };

  const handleCardClick = (id: string) => {
    soundFx.playClick();
    if (timelineOrder.includes(id)) {
      setTimelineOrder(prev => prev.filter(item => item !== id));
    } else {
      setTimelineOrder(prev => [...prev, id]);
    }
  };

  const toggleCountermeasure = (cmId: string) => {
    soundFx.playClick();
    setSelectedCountermeasures(prev =>
      prev.includes(cmId) ? prev.filter(c => c !== cmId) : [...prev, cmId]
    );
  };

  const handleSubmitInvestigation = () => {
    if (timelineOrder.length < 5) {
      soundFx.playError();
      addLog('[INCOMPLETE TIMELINE] Select and order all 5 pieces of cyber evidence into the incident chain.', 'warning');
      return;
    }

    if (selectedCountermeasures.length < 3) {
      soundFx.playError();
      addLog('[DEFENSE INCOMPLETE] Select at least 3 comprehensive defense countermeasures.', 'warning');
      return;
    }

    soundFx.playSuccess();
    setIncidentSolved(true);
    addLog('[OPERATION ACCOMPLISHED] Full breach kill chain reconstructed & neutralized! Master rank achieved!', 'success');
  };

  const handleFinish = () => {
    soundFx.playBadgeUnlock();
    onComplete(600, 'badge_blackout');
  };

  const hints = [
    'Add evidence cards to the Incident Timeline in logical cyber kill chain order (Reconnaissance ➔ Phishing ➔ API Disclosure ➔ Broken Access ➔ Decoded Cipher).',
    'Select all valid defensive mitigations in the Countermeasures console.',
    'Submit your final incident reconstruction to earn the CYBERQUEST MASTER OPERATIVE title.',
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fadeIn">
      
      {/* Mission HUD Header */}
      <div className="bg-cyber-surface border-2 border-cyber-magenta rounded-xl p-6 shadow-neon-magenta relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyber-magenta/20 border border-cyber-magenta text-cyber-magenta font-bold animate-pulse">
                FINAL TACTICAL CHALLENGE // COMBINED INCIDENT
              </span>
              <span className="text-xs font-mono text-cyber-yellow bg-cyber-yellow/10 px-2 py-0.5 rounded border border-cyber-yellow/30 font-bold">
                MASTER LEVEL (+600 XP)
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-display font-black text-white text-glow-magenta">
              OPERATION BLACKOUT: TRACE THE BREACH
            </h1>
            <p className="text-xs sm:text-sm font-mono text-slate-300 mt-1">
              The School Technology Club network was infiltrated! Piece together clues across all 5 completed missions to reconstruct the breach timeline and deploy countermeasures.
            </p>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onBackToDashboard();
            }}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-all self-start md:self-auto"
          >
            DASHBOARD
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Evidence Pinboard & Timeline Assembly */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Evidence Dossier */}
          <div className="bg-cyber-surface border border-slate-800 rounded-xl p-6 shadow-panel space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyber-cyan" />
                <h3 className="font-display font-bold text-white text-sm">
                  INCIDENT EVIDENCE REPOSITORY (CLICK CARDS TO ADD TO TIMELINE)
                </h3>
              </div>
              <span className="text-xs font-mono text-cyber-cyan">
                {timelineOrder.length} / 5 Selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EVIDENCE_CARDS.map((ev) => {
                const isSelected = timelineOrder.includes(ev.id);
                const orderIndex = timelineOrder.indexOf(ev.id);

                return (
                  <div
                    key={ev.id}
                    onClick={() => handleCardClick(ev.id)}
                    className={`p-4 rounded-xl border text-xs font-mono transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-cyber-magenta/20 border-cyber-magenta text-white shadow-neon-magenta'
                        : 'bg-black/50 border-slate-800 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-cyber-magenta text-white text-[11px] font-bold flex items-center justify-center">
                        #{orderIndex + 1}
                      </span>
                    )}
                    <span className="text-[10px] text-cyber-cyan font-bold uppercase block mb-1">
                      {ev.sourceMission}
                    </span>
                    <h4 className="font-bold text-white mb-1.5 pr-6">{ev.title}</h4>
                    <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">{ev.summary}</p>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      VECTOR: {ev.vector}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Incident Timeline Reconstructed */}
          <div className="bg-cyber-surface border border-cyber-cyan/30 rounded-xl p-6 shadow-neon-cyan space-y-4">
            <h3 className="font-display font-bold text-white text-sm flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyber-cyan" />
              RECONSTRUCTED CYBER KILL CHAIN SEQUENCE
            </h3>

            {timelineOrder.length === 0 ? (
              <div className="p-6 rounded-lg bg-black/40 border border-dashed border-slate-800 text-center text-xs font-mono text-cyber-muted">
                Select evidence cards above to construct the chronological breach progression.
              </div>
            ) : (
              <div className="space-y-2">
                {timelineOrder.map((evId, idx) => {
                  const ev = EVIDENCE_CARDS.find(e => e.id === evId);
                  if (!ev) return null;
                  return (
                    <div
                      key={evId}
                      className="p-3 bg-black/70 rounded-lg border border-cyber-cyan/40 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded bg-cyber-cyan text-black font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-white">{ev.title}</div>
                          <div className="text-[10px] text-cyber-cyan">{ev.vector}</div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(evId);
                        }}
                        className="text-[10px] text-cyber-magenta hover:underline"
                      >
                        REMOVE
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Unified Countermeasures Selection */}
          <div className="bg-cyber-surface border border-cyber-green/40 rounded-xl p-6 shadow-neon-green space-y-4">
            <h3 className="font-display font-bold text-white text-sm flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyber-green" />
              SELECT UNIFIED INCIDENT DEFENSIVE COUNTERMEASURES
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'cm_1', title: '1. Enforce Server-Side AuthZ Checks on API', desc: 'Prevent unauthorized student parameter manipulation.' },
                { id: 'cm_2', title: '2. Scrub Sensitive DTO Fields in JSON', desc: 'Ensure recovery keys and internal tokens are never serialized.' },
                { id: 'cm_3', title: '3. Mandate Hardware/App-based 2FA & FIDO2', desc: 'Eliminate SMS OTP phishing interception risks.' },
                { id: 'cm_4', title: '4. Privacy Awareness & Geo-tag Hardening', desc: 'Train team to avoid leaking internal IPs on public social posts.' },
              ].map((cm) => {
                const isSelected = selectedCountermeasures.includes(cm.id);
                return (
                  <div
                    key={cm.id}
                    onClick={() => toggleCountermeasure(cm.id)}
                    className={`p-3 rounded-lg border text-xs font-mono cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyber-green/20 border-cyber-green text-white shadow-neon-green'
                        : 'bg-black/50 border-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-bold text-white mb-1 flex items-center justify-between">
                      <span>{cm.title}</span>
                      {isSelected && <Check className="w-4 h-4 text-cyber-green" />}
                    </div>
                    <p className="text-[11px] text-slate-400">{cm.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={handleSubmitInvestigation}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-cyber-magenta hover:bg-magenta-600 text-white font-display font-black text-xs uppercase tracking-wider transition-all shadow-neon-magenta flex items-center justify-center gap-2"
              >
                <Crosshair className="w-4 h-4" />
                EXECUTE INCIDENT RESPONSE SUBMISSION
              </button>
            </div>
          </div>

          {/* Final Accomplished Banner */}
          {incidentSolved && (
            <div className="p-6 rounded-xl bg-gradient-to-r from-cyber-cyan/20 via-cyber-green/20 to-cyber-yellow/20 border-2 border-cyber-green text-center space-y-4 animate-fadeIn shadow-neon-green">
              <div className="w-16 h-16 rounded-2xl bg-cyber-green/20 border-2 border-cyber-green mx-auto flex items-center justify-center shadow-neon-green">
                <Award className="w-10 h-10 text-cyber-green animate-bounce" />
              </div>

              <h2 className="text-2xl font-display font-black text-white text-glow-green">
                CYBER INCIDENT NEUTRALIZED!
              </h2>

              <p className="text-xs font-mono text-slate-200 max-w-lg mx-auto leading-relaxed">
                You successfully connected all five operational vectors (Privacy, API Disclosure, Access Control, Cryptography, and Social Engineering) to defend the school technology club.
              </p>

              <button
                onClick={handleFinish}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-green text-black font-display font-black text-sm uppercase tracking-wider hover:shadow-neon-cyan transition-all inline-flex items-center gap-2 animate-pulse"
              >
                <Award className="w-4 h-4" />
                CLAIM MASTER TITLE & RETURN TO HQ
              </button>
            </div>
          )}

        </div>

        {/* Right Column: Narrative Intel & Logs */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-cyber-surface border border-slate-800 rounded-xl p-5 shadow-panel space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyber-yellow" />
              MISSION BRIEFING RECAP
            </h4>
            <p className="text-xs font-mono text-slate-300 leading-relaxed">
              Real cyber breaches rarely involve a single Hollywood movie exploit. Instead, adversaries chain minor flaws across privacy, APIs, access controls, ciphers, and phishing into a devastating attack pathway.
            </p>
          </div>

          <HintDrawer hints={hints} />
          <TerminalLog logs={logs} title="INCIDENT_RESPONSE // KILL_CHAIN" maxHeight="max-h-60" />

        </div>

      </div>

    </div>
  );
};
