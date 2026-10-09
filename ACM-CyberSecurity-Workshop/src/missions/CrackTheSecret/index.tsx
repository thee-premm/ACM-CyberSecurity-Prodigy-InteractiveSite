import React, { useState, useMemo } from 'react';
import { 
  KeyRound, Lock, Unlock, Cpu, CheckCircle2, 
  BookOpen 
} from 'lucide-react';
import { soundFx } from '../../utils/audio';
import type { LogEntry } from '../../types';
import { HintDrawer } from '../../components/common/HintDrawer';
import { ConceptModal } from '../../components/common/ConceptModal';
import { TerminalLog } from '../../components/common/TerminalLog';

interface Mission04Props {
  onComplete: (xp: number, badgeId: string) => void;
  onBackToDashboard: () => void;
  isCompleted?: boolean;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const CrackTheSecretMission: React.FC<Mission04Props> = ({
  onComplete,
  onBackToDashboard,
}) => {
  const [inputText, setInputText] = useState('KHOOR');
  const [mode, setMode] = useState<'decrypt' | 'encrypt'>('decrypt');
  const [shift, setShift] = useState(3);
  const [showBruteForce, setShowBruteForce] = useState(false);
  const [targetSolved, setTargetSolved] = useState(false);
  const [customTested, setCustomTested] = useState(false);
  const [showConcept, setShowConcept] = useState(false);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'info',
      message: '[RADIO_INTERCEPT] Raw encrypted packet "KHOOR" received on frequency 433MHz.',
    },
    {
      id: '2',
      timestamp: new Date().toLocaleTimeString(),
      type: 'warning',
      message: '[CIPHER] Shift substitution signature detected.',
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

  // Perform Caesar Transformation
  const transformText = (text: string, shiftVal: number, opMode: 'encrypt' | 'decrypt'): string => {
    const effectiveShift = opMode === 'encrypt' ? shiftVal : (26 - (shiftVal % 26)) % 26;
    return text.split('').map(char => {
      const code = char.charCodeAt(0);
      // Uppercase A-Z (65-90)
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + effectiveShift) % 26) + 65);
      }
      // Lowercase a-z (97-122)
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + effectiveShift) % 26) + 97);
      }
      // Keep spaces and punctuation unchanged
      return char;
    }).join('');
  };

  const outputText = useMemo(() => {
    return transformText(inputText, shift, mode);
  }, [inputText, shift, mode]);

  // Check Target Solve
  const handleShiftChange = (newShift: number) => {
    soundFx.playKeyBlip();
    setShift(newShift);

    if (inputText.trim().toUpperCase() === 'KHOOR' && mode === 'decrypt' && newShift === 3) {
      if (!targetSolved) {
        soundFx.playSuccess();
        setTargetSolved(true);
        addLog('[CIPHER DECODED] "KHOOR" successfully decrypted to "HELLO" with Key=3!', 'success');
      }
    }
    if (inputText.trim().toUpperCase() === 'SURMHFW EODFNRXW' && mode === 'decrypt' && newShift === 3) {
      soundFx.playSuccess();
      addLog('[BONUS INTEL] "SURMHFW EODFNRXW" decoded to "PROJECT BLACKOUT"!', 'success');
    }
  };

  const handleCustomInput = (val: string) => {
    setInputText(val);
    if (val.trim().length > 0 && val !== 'KHOOR' && val !== 'SURMHFW EODFNRXW') {
      setCustomTested(true);
    }
  };

  // Generate Brute Force Table (all 26 shifts)
  const bruteForceResults = useMemo(() => {
    if (!showBruteForce) return [];
    return Array.from({ length: 26 }, (_, i) => ({
      shift: i,
      result: transformText(inputText, i, 'decrypt'),
    }));
  }, [inputText, showBruteForce]);

  const missionCompleted = targetSolved && (showBruteForce || customTested);

  const handleFinish = () => {
    if (!missionCompleted) {
      soundFx.playError();
      addLog('[INCOMPLETE] Decode the target ciphertext "KHOOR" using shift=3 and test brute-force exploration.', 'warning');
      return;
    }
    soundFx.playSuccess();
    onComplete(350, 'badge_m4');
  };

  const hints = [
    'Ensure Mode is set to "DECRYPT" and the input contains "KHOOR".',
    'Slide the SHIFT KEY slider to 3. Notice how K becomes H, H becomes E, O becomes L, and R becomes O!',
    'Try clicking the "LOAD BONUS CIPHER" button to decrypt "SURMHFW EODFNRXW".',
    'Open the Brute-Force Matrix to see how an attacker can test all 26 keys in milliseconds.',
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fadeIn">
      
      {/* Mission HUD Header */}
      <div className="bg-cyber-surface border border-cyber-cyan/30 rounded-xl p-6 shadow-neon-cyan relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan font-bold">
                MISSION 04 // 10 MIN
              </span>
              <span className="text-xs font-mono text-cyber-cyan bg-cyber-cyan/10 px-2 py-0.5 rounded border border-cyber-cyan/30">
                OPERATIVE LEVEL
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-black text-white text-glow-cyan">
              CRACK THE SECRET
            </h1>
            <p className="text-xs sm:text-sm font-mono text-slate-300 mt-1">
              Analyze cryptographic substitution ciphers, decode intercepted radio intercepts, and break small keyspaces.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                soundFx.playClick();
                setShowConcept(true);
              }}
              className="px-3 py-2 rounded-lg bg-cyber-dark border border-slate-700 hover:border-cyber-cyan/50 text-xs font-mono text-cyber-cyan flex items-center gap-1.5 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              THEORY BRIEFING
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                onBackToDashboard();
              }}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-all"
            >
              DASHBOARD
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Cipher Engine */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-cyber-surface border border-slate-800 rounded-xl p-6 shadow-panel space-y-6">
            
            {/* Mode & Quick Load */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 bg-black/60 p-1 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setMode('decrypt');
                  }}
                  className={`px-4 py-1.5 rounded text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
                    mode === 'decrypt'
                      ? 'bg-cyber-cyan text-black shadow-neon-cyan'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Unlock className="w-3.5 h-3.5" />
                  DECRYPT (REVERSE)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setMode('encrypt');
                  }}
                  className={`px-4 py-1.5 rounded text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
                    mode === 'encrypt'
                      ? 'bg-cyber-magenta text-white shadow-neon-magenta'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  ENCRYPT (FORWARD)
                </button>
              </div>

              {/* Sample Preset Loaders */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setInputText('KHOOR');
                    setMode('decrypt');
                    setShift(3);
                    setTargetSolved(true);
                  }}
                  className="text-[10px] font-mono px-2.5 py-1.5 rounded bg-cyber-dark border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/20"
                >
                  LOAD "KHOOR"
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setInputText('SURMHFW EODFNRXW');
                    setMode('decrypt');
                    setShift(3);
                  }}
                  className="text-[10px] font-mono px-2.5 py-1.5 rounded bg-cyber-dark border border-cyber-magenta/30 text-cyber-magenta hover:bg-cyber-magenta/20"
                >
                  LOAD BONUS
                </button>
              </div>
            </div>

            {/* Input & Output Fields */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-300 mb-1 flex items-center justify-between">
                  <span>INPUT TEXT (Ciphertext / Plaintext)</span>
                  <span className="text-[10px] text-cyber-muted">Type any text below</span>
                </label>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => handleCustomInput(e.target.value)}
                  placeholder="Enter message to transform..."
                  className="w-full bg-black/70 border border-slate-700 rounded-lg px-4 py-2.5 text-sm font-mono text-cyber-cyan uppercase tracking-wider focus:border-cyber-cyan focus:outline-none"
                />
              </div>

              {/* Shift Slider */}
              <div className="bg-black/50 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-cyber-yellow" />
                    KEY VALUE (SHIFT NUMBER: {shift})
                  </span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-cyber-yellow/20 text-cyber-yellow font-bold border border-cyber-yellow/30">
                    KEY = {shift}
                  </span>
                </div>

                <input
                  type="range"
                  min={0}
                  max={25}
                  value={shift}
                  onChange={(e) => handleShiftChange(parseInt(e.target.value, 10))}
                  className="w-full accent-cyber-yellow cursor-pointer"
                />

                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>0 (No Shift)</span>
                  <span>3 (Caesar Classic)</span>
                  <span>13 (ROT13)</span>
                  <span>25 (Max)</span>
                </div>
              </div>

              {/* Output Result */}
              <div>
                <label className="text-xs font-mono text-cyber-green font-bold mb-1 block">
                  TRANSFORMED RESULT (Live Decoded / Encoded)
                </label>
                <div className="w-full bg-black/90 border-2 border-cyber-green/50 rounded-lg px-4 py-3 text-lg font-mono font-bold text-white tracking-widest shadow-neon-green flex items-center justify-between">
                  <span className="text-glow-green">{outputText || '[EMPTY]'}</span>
                  {outputText === 'HELLO' && (
                    <span className="text-xs font-mono text-cyber-green bg-cyber-green/20 px-2 py-0.5 rounded border border-cyber-green animate-pulse">
                      TARGET DECRYPTED ✓
                    </span>
                  )}
                  {outputText === 'PROJECT BLACKOUT' && (
                    <span className="text-xs font-mono text-cyber-magenta bg-cyber-magenta/20 px-2 py-0.5 rounded border border-cyber-magenta animate-pulse">
                      OPERATION INTEL UNLOCKED ✓
                    </span>
                  )}
                </div>
              </div>

            </div>

            {/* Dual Alphabet Visual Wheel */}
            <div className="pt-2">
              <div className="text-xs font-mono text-slate-400 mb-2 font-bold uppercase">
                ALPHABET TRANSFORMATION MAP:
              </div>
              <div className="bg-black/60 p-3 rounded-lg border border-slate-800 overflow-x-auto space-y-1.5 font-mono text-xs">
                <div className="flex gap-1 text-slate-400 select-none">
                  <span className="w-12 text-[10px] text-cyber-cyan font-bold">BASE:</span>
                  {ALPHABET.split('').map((char) => (
                    <span key={char} className="w-5 text-center font-bold">{char}</span>
                  ))}
                </div>
                <div className="flex gap-1 text-cyber-yellow select-none">
                  <span className="w-12 text-[10px] text-cyber-yellow font-bold">KEY {shift}:</span>
                  {ALPHABET.split('').map((char) => {
                    const mapped = transformText(char, shift, mode);
                    return (
                      <span key={char} className="w-5 text-center font-bold bg-slate-900 rounded">
                        {mapped}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Brute-Force Demo, Theory, Complete */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Brute Force Keyspace Demonstration */}
          <div className="bg-cyber-surface border border-slate-800 rounded-xl p-5 shadow-panel space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyber-magenta" />
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  BRUTE-FORCE KEYSPACE SCANNER
                </h4>
              </div>
              <button
                onClick={() => {
                  soundFx.playScan();
                  setShowBruteForce(b => !b);
                  addLog('[BRUTE_FORCE] Matrix calculated all 26 substitution variations.', 'info');
                }}
                className="text-[10px] font-mono px-2.5 py-1 rounded bg-cyber-magenta/20 text-cyber-magenta border border-cyber-magenta/40 hover:bg-cyber-magenta/30 transition-all font-bold"
              >
                {showBruteForce ? 'HIDE MATRIX' : 'TEST ALL 26 SHIFTS'}
              </button>
            </div>

            <p className="text-[11px] font-mono text-slate-300 leading-relaxed">
              Because a Caesar cipher only has 25 possible keys, a computer can test every key simultaneously in less than 1 millisecond.
            </p>

            {showBruteForce && (
              <div className="max-h-48 overflow-y-auto bg-black/80 rounded-lg p-2 border border-slate-800 font-mono text-xs space-y-1">
                {bruteForceResults.map((row) => (
                  <div
                    key={row.shift}
                    className={`flex items-center justify-between px-2 py-0.5 rounded ${
                      row.result === 'HELLO' || row.result === 'PROJECT BLACKOUT'
                        ? 'bg-cyber-green/20 text-cyber-green font-bold border border-cyber-green'
                        : 'text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <span className="text-[10px]">KEY #{row.shift}:</span>
                    <span className="font-bold">{row.result}</span>
                    {row.result === 'HELLO' && (
                      <span className="text-[9px] bg-cyber-green text-black px-1 rounded font-bold">MATCH</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Checklist */}
            <div className="space-y-2 pt-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className={targetSolved ? 'text-cyber-green' : 'text-cyber-muted'}>
                  {targetSolved ? '✓' : '○'}
                </span>
                <span>Decrypt "KHOOR" to "HELLO" using Key=3</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={showBruteForce || customTested ? 'text-cyber-green' : 'text-cyber-muted'}>
                  {showBruteForce || customTested ? '✓' : '○'}
                </span>
                <span>Explore Brute-Force keyspace / Test custom message</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              disabled={!missionCompleted}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyber-cyan to-cyber-green text-black font-display font-black text-xs uppercase tracking-wider hover:shadow-neon-green transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              <CheckCircle2 className="w-4 h-4" />
              COMPLETE MISSION 04 & CLAIM BADGE
            </button>
          </div>

          {/* Tactical Hints & Logs */}
          <HintDrawer hints={hints} />
          <TerminalLog logs={logs} title="MISSION_04 // CIPHER_TELEMETRY" maxHeight="max-h-48" />

        </div>

      </div>

      {/* Theory Concept Modal */}
      <ConceptModal
        isOpen={showConcept}
        onClose={() => setShowConcept(false)}
        title="CRYPTOGRAPHY: CIPHERS, KEYS & KEYSPACE LIMITS"
        conceptName="Symmetric Substitution & Small Keyspace Vulnerability"
        points={[
          {
            title: "Plaintext vs Ciphertext",
            desc: "Plaintext is the readable original secret. Ciphertext is the scrambled data output produced by an encryption algorithm and key.",
          },
          {
            title: "Why Is the Caesar Cipher Insecure?",
            desc: "A cipher's security relies on the number of possible keys (its 'Keyspace'). The Caesar cipher only has 25 keys, which takes less than 1 millisecond for a computer to brute force.",
          },
          {
            title: "Modern Cryptography (AES, RSA)",
            desc: "Modern encryption uses keyspaces with 2^256 combinations (more possibilities than all the atoms in the observable universe), making brute-force mathematically impossible with current computers.",
          }
        ]}
        takeaway="Never invent your own cipher or rely on simple substitution for real passwords. Modern security requires standard, battle-tested algorithms with massive keyspaces."
      />

    </div>
  );
};
