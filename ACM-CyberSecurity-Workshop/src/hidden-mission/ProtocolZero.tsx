import React, { useState } from 'react';
import { 
  Zap, ShieldAlert, CheckCircle2, 
  Radio, Key 
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import type { LogEntry } from '../types';
import { HintDrawer } from '../components/common/HintDrawer';
import { TerminalLog } from '../components/common/TerminalLog';

interface ProtocolZeroProps {
  onComplete: (xp: number, badgeId: string) => void;
  onBackToDashboard: () => void;
  isCompleted?: boolean;
}

export const ProtocolZero: React.FC<ProtocolZeroProps> = ({
  onComplete,
  onBackToDashboard,
}) => {
  const [nodePuzzles, setNodePuzzles] = useState({
    node1: false, // Port Firewall
    node2: false, // Decrypt Killswitch Key
    node3: false, // Isolate Rogue Subnet
  });

  const [cipherInput, setCipherInput] = useState('');
  const [selectedSubnet, setSelectedSubnet] = useState<string>('');

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'danger',
      message: '[CLASSIFIED] PROTOCOL ZERO BROADCAST RECEIVED ACROSS OPERATIONS CENTER!',
    },
    {
      id: '2',
      timestamp: new Date().toLocaleTimeString(),
      type: 'warning',
      message: '[THREAT_DEFCON_1] Autonomous rogue botnet spreading through node matrix.',
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

  const handleSolveNode1 = () => {
    soundFx.playSuccess();
    setNodePuzzles(prev => ({ ...prev, node1: true }));
    addLog('[FIREWALL DEPLOYED] Port 4444 rogue backdoor listener closed.', 'success');
  };

  const handleSolveNode2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (cipherInput.trim().toUpperCase() === 'ZERO' || cipherInput.trim().toUpperCase() === 'DEFEND') {
      soundFx.playSuccess();
      setNodePuzzles(prev => ({ ...prev, node2: true }));
      addLog('[KILLSWITCH KEY ACCEPTED] Cryptographic shutdown hash verified.', 'success');
    } else {
      soundFx.playError();
      addLog('[ERROR] Invalid key. Hint: Decrypt "CHUR" with Caesar Shift=3 (C->Z, H->E, U->R, R->O)', 'danger');
    }
  };

  const handleSolveNode3 = (subnet: string) => {
    setSelectedSubnet(subnet);
    if (subnet === '192.168.4.0/24') {
      soundFx.playSuccess();
      setNodePuzzles(prev => ({ ...prev, node3: true }));
      addLog('[SUBNET ISOLATED] Rogue segment 192.168.4.0/24 quarantined!', 'success');
    } else {
      soundFx.playError();
      addLog(`[INCORRECT SUBNET] Segment ${subnet} is a critical legitimate server infrastructure!`, 'danger');
    }
  };

  const isAllNodesSecured = nodePuzzles.node1 && nodePuzzles.node2 && nodePuzzles.node3;

  const handleFinish = () => {
    soundFx.playBadgeUnlock();
    onComplete(500, 'badge_protocol_zero');
  };

  const hints = [
    'Node 1: Click "SEAL INTRUSION PORT" to terminate the unauthorized listening socket.',
    'Node 2: Decrypt the Caesar ciphertext "CHUR" with shift=3 to find the 4-letter killswitch codeword (Z-E-R-O).',
    'Node 3: Isolate the anomalous subnet segment (192.168.4.0/24) marked with high unauthorized broadcast activity.',
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fadeIn">
      
      {/* HUD Header */}
      <div className="bg-cyber-surface border-2 border-cyber-magenta rounded-xl p-6 shadow-neon-magenta relative overflow-hidden animate-pulse-glow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyber-magenta text-white font-bold animate-ping">
                ● EMERGENCY
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyber-magenta/20 border border-cyber-magenta text-cyber-magenta font-bold">
                CLASSIFIED INSTRUCTOR PROTOCOL // BONUS 15 MIN
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-black text-white text-glow-magenta">
              PROTOCOL ZERO: NETWORK CONTAINMENT
            </h1>
            <p className="text-xs sm:text-sm font-mono text-slate-300 mt-1">
              Classroom bonus scenario: Neutralize an active autonomous botnet threat by sealing ports, cracking the master emergency killswitch, and isolating rogue subnets.
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
        
        {/* Left Column: 3 Security Nodes */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Node 1: Port Firewall */}
          <div className={`p-6 rounded-xl border transition-all ${
            nodePuzzles.node1
              ? 'bg-cyber-green/10 border-cyber-green shadow-neon-green'
              : 'bg-cyber-surface border-slate-800 shadow-panel'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className={`w-5 h-5 ${nodePuzzles.node1 ? 'text-cyber-green' : 'text-cyber-magenta'}`} />
                <h3 className="font-display font-bold text-white text-sm">
                  NODE 1: SEAL ROGUE BACKDOOR LISTENER
                </h3>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                nodePuzzles.node1 ? 'bg-cyber-green/20 text-cyber-green' : 'bg-cyber-magenta/20 text-cyber-magenta'
              }`}>
                {nodePuzzles.node1 ? 'PORT SEALED ✓' : 'PORT 4444 OPEN'}
              </span>
            </div>

            <p className="text-xs font-mono text-slate-300 mb-4">
              A rogue reverse-shell listener was established on TCP Port 4444. Deploy an immediate firewall packet drop rule to cut off command-and-control communication.
            </p>

            <button
              onClick={handleSolveNode1}
              disabled={nodePuzzles.node1}
              className={`px-5 py-2.5 rounded-lg font-mono text-xs font-bold uppercase transition-all ${
                nodePuzzles.node1
                  ? 'bg-slate-800 text-cyber-green cursor-not-allowed'
                  : 'bg-cyber-magenta hover:bg-magenta-600 text-white shadow-neon-magenta'
              }`}
            >
              {nodePuzzles.node1 ? 'FIREWALL ACTIVE (BLOCKED)' : 'DEPLOY PACKET DROP RULE (SEAL PORT 4444)'}
            </button>
          </div>

          {/* Node 2: Cryptographic Killswitch */}
          <div className={`p-6 rounded-xl border transition-all ${
            nodePuzzles.node2
              ? 'bg-cyber-green/10 border-cyber-green shadow-neon-green'
              : 'bg-cyber-surface border-slate-800 shadow-panel'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Key className={`w-5 h-5 ${nodePuzzles.node2 ? 'text-cyber-green' : 'text-cyber-yellow'}`} />
                <h3 className="font-display font-bold text-white text-sm">
                  NODE 2: DECRYPT MASTER EMERGENCY KILLSWITCH KEY
                </h3>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                nodePuzzles.node2 ? 'bg-cyber-green/20 text-cyber-green' : 'bg-cyber-yellow/20 text-cyber-yellow'
              }`}>
                {nodePuzzles.node2 ? 'UNLOCKED ✓' : 'LOCKED'}
              </span>
            </div>

            <p className="text-xs font-mono text-slate-300 mb-3">
              The emergency broadcast system ciphertext is: <strong className="text-cyber-yellow text-sm">"CHUR"</strong> (Caesar Shift = 3). Decrypt it to reveal the 4-letter authorization word.
            </p>

            <form onSubmit={handleSolveNode2} className="flex gap-2">
              <input
                type="text"
                value={cipherInput}
                onChange={(e) => setCipherInput(e.target.value)}
                disabled={nodePuzzles.node2}
                placeholder="Enter decrypted word..."
                className="flex-1 bg-black/70 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white uppercase tracking-widest focus:border-cyber-cyan focus:outline-none"
              />
              <button
                type="submit"
                disabled={nodePuzzles.node2}
                className="px-5 py-2 bg-cyber-yellow text-black font-display font-bold text-xs uppercase tracking-wider rounded-lg hover:shadow-neon-yellow transition-all disabled:opacity-40"
              >
                SUBMIT KEY
              </button>
            </form>
          </div>

          {/* Node 3: Rogue Subnet Isolation */}
          <div className={`p-6 rounded-xl border transition-all ${
            nodePuzzles.node3
              ? 'bg-cyber-green/10 border-cyber-green shadow-neon-green'
              : 'bg-cyber-surface border-slate-800 shadow-panel'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Radio className={`w-5 h-5 ${nodePuzzles.node3 ? 'text-cyber-green' : 'text-cyber-cyan'}`} />
                <h3 className="font-display font-bold text-white text-sm">
                  NODE 3: QUARANTINE ANOMALOUS SUBNET
                </h3>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                nodePuzzles.node3 ? 'bg-cyber-green/20 text-cyber-green' : 'bg-cyber-cyan/20 text-cyber-cyan'
              }`}>
                {nodePuzzles.node3 ? 'ISOLATED ✓' : 'SCANNING'}
              </span>
            </div>

            <p className="text-xs font-mono text-slate-300 mb-3">
              Select the compromised subnet segment emitting rogue packet storms:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: '10.0.1.0/24', label: '10.0.1.0/24 (Gateway DNS)', safe: true },
                { id: '192.168.4.0/24', label: '192.168.4.0/24 (Compromised Lab)', safe: false },
                { id: '172.16.0.0/24', label: '172.16.0.0/24 (Teacher Server)', safe: true },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleSolveNode3(sub.id)}
                  disabled={nodePuzzles.node3}
                  className={`p-3 rounded-lg border font-mono text-xs text-left transition-all ${
                    selectedSubnet === sub.id
                      ? !sub.safe
                        ? 'bg-cyber-green/20 border-cyber-green text-cyber-green font-bold'
                        : 'bg-cyber-magenta/20 border-cyber-magenta text-cyber-magenta'
                      : 'bg-black/50 border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="font-bold">{sub.id}</div>
                  <div className="text-[10px] text-slate-400">{sub.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Completion Trigger */}
          {isAllNodesSecured && (
            <div className="p-6 rounded-xl bg-cyber-green/15 border-2 border-cyber-green text-center space-y-4 shadow-neon-green animate-fadeIn">
              <CheckCircle2 className="w-12 h-12 text-cyber-green mx-auto animate-bounce" />
              <h3 className="font-display font-black text-xl text-white text-glow-green">
                PROTOCOL ZERO CONTAINED & RESOLVED!
              </h3>
              <p className="text-xs font-mono text-slate-200 max-w-md mx-auto">
                All three security nodes are locked down. You have neutralized the secret emergency threat vector!
              </p>
              <button
                onClick={handleFinish}
                className="px-6 py-3 rounded-xl bg-cyber-green text-black font-display font-black text-xs uppercase tracking-wider hover:shadow-neon-green transition-all inline-flex items-center gap-2"
              >
                CLAIM BONUS BADGE & RETURN TO DASHBOARD
              </button>
            </div>
          )}

        </div>

        {/* Right Column: Mission Status & Logs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-cyber-surface border border-slate-800 rounded-xl p-5 shadow-panel space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyber-magenta" />
              PROTOCOL ZERO DEFCON GAUGE
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Node 1 (Firewall):</span>
                <span className={nodePuzzles.node1 ? 'text-cyber-green font-bold' : 'text-cyber-magenta'}>
                  {nodePuzzles.node1 ? 'RESOLVED' : 'ACTIVE THREAT'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Node 2 (Killswitch Key):</span>
                <span className={nodePuzzles.node2 ? 'text-cyber-green font-bold' : 'text-cyber-yellow'}>
                  {nodePuzzles.node2 ? 'RESOLVED' : 'LOCKED'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Node 3 (Subnet Quarantine):</span>
                <span className={nodePuzzles.node3 ? 'text-cyber-green font-bold' : 'text-cyber-cyan'}>
                  {nodePuzzles.node3 ? 'RESOLVED' : 'UNISOLATED'}
                </span>
              </div>
            </div>
          </div>

          <HintDrawer hints={hints} />
          <TerminalLog logs={logs} title="PROTOCOL_ZERO // ANOMALY_FEED" maxHeight="max-h-60" />
        </div>

      </div>

    </div>
  );
};
