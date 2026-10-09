import React, { useState } from 'react';
import { 
  Shield, AlertTriangle, CheckCircle2, Eye, MapPin, 
  Clock, Image, User, BookOpen, 
  Layers, Sliders, ChevronRight 
} from 'lucide-react';
import { soundFx } from '../../utils/audio';
import type { LogEntry, SocialClue } from '../../types';
import { HintDrawer } from '../../components/common/HintDrawer';
import { ConceptModal } from '../../components/common/ConceptModal';
import { TerminalLog } from '../../components/common/TerminalLog';

interface Mission01Props {
  onComplete: (xp: number, badgeId: string) => void;
  onBackToDashboard: () => void;
  isCompleted?: boolean;
}

const INITIAL_CLUES: SocialClue[] = [
  {
    id: 'clue_location_cafe',
    targetType: 'location',
    title: 'Geo-Tag: "CyberBytes Cafe (Oak St)"',
    detail: 'Explicit GPS check-in reveals Alex is at this specific coffee shop every Friday at 4:30 PM.',
    riskCategory: 'Location',
    found: false,
  },
  {
    id: 'clue_photo_school',
    targetType: 'photo',
    title: 'Photo: Robotics Team Hoodie with School Badge',
    detail: 'Hoodie embroidery clearly shows "Westbridge STEM Academy - Class of 2027".',
    riskCategory: 'Identity',
    found: false,
  },
  {
    id: 'clue_time_routine',
    targetType: 'timestamp',
    title: 'Timestamp Aggregation: Daily 3:45 PM Bus Route',
    detail: 'Recurring posts from the same bus stop at 3:45 PM reveal exact transit route and timing.',
    riskCategory: 'Schedule',
    found: false,
  },
  {
    id: 'clue_comment_event',
    targetType: 'comment',
    title: 'Friend Comment: "See you at the Hackathon this Saturday 10 AM!"',
    detail: 'Reveals Alex will be away from home at an unmonitored public expo venue this weekend.',
    riskCategory: 'Event',
    found: false,
  },
];

export const InvisibleInternetMission: React.FC<Mission01Props> = ({
  onComplete,
  onBackToDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<'investigate' | 'defender'>('investigate');
  const [clues, setClues] = useState<SocialClue[]>(INITIAL_CLUES);
  const [selectedClueIds, setSelectedClueIds] = useState<string[]>([]);
  const [inferenceRevealed, setInferenceRevealed] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  
  // Defender Mode Toggles
  const [privacySettings, setPrivacySettings] = useState({
    stripGeoTags: false,
    privateAudience: false,
    blurIdentityMarkers: false,
    sanitizeComments: false,
  });

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'info',
      message: '[M1_INIT] Profile telemetry loaded for target @alex_matrix24.',
    },
    {
      id: '2',
      timestamp: new Date().toLocaleTimeString(),
      type: 'warning',
      message: '[ANALYSIS] High volume of unredacted metadata detected on public social feed.',
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

  const handleClueClick = (clueId: string) => {
    setClues(prev =>
      prev.map(c => {
        if (c.id === clueId && !c.found) {
          soundFx.playScan();
          addLog(`[CLUE DISCOVERED] Metadata extracted: ${c.title}`, 'info');
          return { ...c, found: true };
        }
        return c;
      })
    );
  };

  const togglePinboardSelection = (clueId: string) => {
    soundFx.playClick();
    setSelectedClueIds(prev =>
      prev.includes(clueId) ? prev.filter(id => id !== clueId) : [...prev, clueId]
    );
  };

  const handleSynthesizeInference = () => {
    const foundCount = clues.filter(c => c.found).length;
    if (foundCount < 3) {
      soundFx.playError();
      addLog('[ERROR] Insufficient clues discovered. Uncover at least 3 metadata clues first.', 'danger');
      return;
    }
    soundFx.playSuccess();
    setInferenceRevealed(true);
    addLog('[SUCCESS] INFERENCE REVEALED: Alex\'s exact weekly schedule & school identity synthesized!', 'success');
  };

  // Calculate Exposure Score
  const calculateExposure = () => {
    let score = 90;
    if (privacySettings.stripGeoTags) score -= 25;
    if (privacySettings.privateAudience) score -= 30;
    if (privacySettings.blurIdentityMarkers) score -= 20;
    if (privacySettings.sanitizeComments) score -= 15;
    return score;
  };

  const exposureScore = calculateExposure();
  const defenderComplete = exposureScore <= 15;

  const handleFinishMission = () => {
    if (!defenderComplete) {
      soundFx.playError();
      addLog('[DEFENSE INCOMPLETE] Harden all privacy toggles to reduce exposure below 20%!', 'warning');
      return;
    }
    soundFx.playSuccess();
    onComplete(300, 'badge_m1');
  };

  const hints = [
    'Inspect the blue location badges, photo badges, and post timestamps directly on Alex’s profile cards.',
    'Once clues are discovered in the profile, open the Investigation Board to connect them into a synthesized pattern.',
    'Switch to DEFENDER MODE and toggle on all privacy hardening measures to reduce Alex’s digital footprint.',
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fadeIn">
      
      {/* Mission HUD Header */}
      <div className="bg-cyber-surface border border-cyber-cyan/30 rounded-xl p-6 shadow-neon-cyan relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan font-bold">
                MISSION 01 // 10 MIN
              </span>
              <span className="text-xs font-mono text-cyber-green bg-cyber-green/10 px-2 py-0.5 rounded border border-cyber-green/30">
                RECRUIT LEVEL
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-black text-white text-glow-cyan">
              THE INVISIBLE INTERNET
            </h1>
            <p className="text-xs sm:text-sm font-mono text-slate-300 mt-1">
              Investigate the public profile of @alex_matrix24, piece together leaked metadata, and scrub the digital footprint.
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

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-cyber-border mt-6 pt-2 gap-4">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('investigate');
            }}
            className={`pb-3 px-2 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'investigate'
                ? 'border-cyber-cyan text-cyber-cyan text-glow-cyan'
                : 'border-transparent text-cyber-muted hover:text-slate-300'
            }`}
          >
            <Eye className="w-4 h-4" />
            PHASE 1: INVESTIGATION & CLUES ({clues.filter(c => c.found).length}/4)
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('defender');
            }}
            className={`pb-3 px-2 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'defender'
                ? 'border-cyber-green text-cyber-green text-glow-green'
                : 'border-transparent text-cyber-muted hover:text-slate-300'
            }`}
          >
            <Shield className="w-4 h-4" />
            PHASE 2: PRIVACY DEFENDER MODE ({100 - exposureScore}% SECURED)
          </button>
        </div>
      </div>

      {/* Main Mission Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Simulation Interface */}
        <div className="lg:col-span-8 space-y-6">
          
          {activeTab === 'investigate' ? (
            /* PHASE 1: SOCIAL PROFILE INVESTIGATION */
            <div className="space-y-6">
              
              {/* Profile Card */}
              <div className="bg-cyber-surface border border-slate-800 rounded-xl overflow-hidden">
                
                {/* Profile Banner */}
                <div className="h-28 bg-gradient-to-r from-blue-900 via-indigo-950 to-purple-950 p-4 flex items-end justify-between relative">
                  <div className="absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-cyber-cyan border border-cyber-cyan/30">
                    PUBLIC FEED // SIMULATION
                  </div>
                </div>

                {/* Profile Header */}
                <div className="px-6 pb-6 pt-2 relative">
                  <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-12 mb-4 gap-3">
                    <div className="flex items-end gap-3">
                      <div className="w-20 h-20 rounded-2xl bg-cyber-dark border-2 border-cyber-cyan p-1 shadow-neon-cyan flex items-center justify-center">
                        <User className="w-10 h-10 text-cyber-cyan" />
                      </div>
                      <div>
                        <h2 className="font-display font-bold text-lg text-white">
                          Alex Rivera
                        </h2>
                        <p className="text-xs font-mono text-cyber-muted">@alex_matrix24</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyber-magenta/10 border border-cyber-magenta/30 text-cyber-magenta font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      EXPOSURE RISK: CRITICAL
                    </span>
                  </div>

                  <p className="text-xs font-mono text-slate-300 leading-relaxed bg-black/40 p-3 rounded-lg border border-slate-800">
                    🤖 High school robotics builder | Coffee addict ☕ | Catch me at CyberBytes Cafe every Friday!
                  </p>
                </div>

                {/* Feed Posts */}
                <div className="p-6 border-t border-slate-800 space-y-4">
                  <div className="text-xs font-mono text-cyber-muted uppercase tracking-wider">
                    CLICK HIGHLIGHTED POST ELEMENTS TO EXTRACT METADATA CLUES:
                  </div>

                  {/* Post 1: Cafe Check-in */}
                  <div className="bg-black/40 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-cyber-cyan/40 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white">Alex Rivera</span>
                      <button
                        onClick={() => handleClueClick('clue_location_cafe')}
                        className={`text-[11px] font-mono px-2.5 py-1 rounded flex items-center gap-1 transition-all ${
                          clues.find(c => c.id === 'clue_location_cafe')?.found
                            ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/40'
                            : 'bg-cyber-cyan/10 hover:bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 animate-pulse'
                        }`}
                      >
                        <MapPin className="w-3 h-3" />
                        CyberBytes Cafe (Oak St) [CLICK TO SCAN]
                      </button>
                    </div>

                    <p className="text-xs font-mono text-slate-200">
                      Friday study grind with the iced mocha! 💻✨ Best place to work before the weekend.
                    </p>

                    <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" /> Friday 4:32 PM
                      </span>
                    </div>
                  </div>

                  {/* Post 2: Robotics Hoodie */}
                  <div className="bg-black/40 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-cyber-cyan/40 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white">Alex Rivera</span>
                      <span className="text-[11px] font-mono text-slate-500">2 days ago</span>
                    </div>

                    <p className="text-xs font-mono text-slate-200">
                      So proud of our team! We took 1st place in the regionals! 🏆
                    </p>

                    <button
                      onClick={() => handleClueClick('clue_photo_school')}
                      className={`w-full p-4 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all ${
                        clues.find(c => c.id === 'clue_photo_school')?.found
                          ? 'bg-cyber-green/10 border-cyber-green/40 text-cyber-green'
                          : 'bg-slate-900 border-dashed border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan/10'
                      }`}
                    >
                      <Image className="w-8 h-8" />
                      <div className="text-xs font-mono font-bold">
                        [PHOTO PREVIEW: Alex wearing "Westbridge STEM Academy" hoodie]
                      </div>
                      <span className="text-[10px] uppercase underline">
                        {clues.find(c => c.id === 'clue_photo_school')?.found ? '✓ METADATA EXTRACTED' : 'CLICK TO EXTRACT EXIF & EMBROIDERY METADATA'}
                      </span>
                    </button>
                  </div>

                  {/* Post 3: Transit Schedule & Comment */}
                  <div className="bg-black/40 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-cyber-cyan/40 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white">Alex Rivera</span>
                      <button
                        onClick={() => handleClueClick('clue_time_routine')}
                        className={`text-[11px] font-mono px-2 py-0.5 rounded flex items-center gap-1 ${
                          clues.find(c => c.id === 'clue_time_routine')?.found
                            ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/40'
                            : 'bg-cyber-cyan/10 hover:bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 animate-pulse'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        Daily 3:45 PM [SCAN TIMESTAMP]
                      </button>
                    </div>

                    <p className="text-xs font-mono text-slate-200">
                      Route 42 bus is delayed again today 🚌 Miss the stop every single Tuesday and Thursday!
                    </p>

                    {/* Friend Comment */}
                    <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-mono font-bold text-cyber-cyan">@sam_codez</span>
                        <button
                          onClick={() => handleClueClick('clue_comment_event')}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            clues.find(c => c.id === 'clue_comment_event')?.found
                              ? 'bg-cyber-green/20 text-cyber-green'
                              : 'bg-cyber-yellow/20 text-cyber-yellow hover:bg-cyber-yellow/30'
                          }`}
                        >
                          SCAN COMMENT
                        </button>
                      </div>
                      <p className="text-xs font-mono text-slate-300">
                        See you at the Hackathon this Saturday 10 AM at the Downtown Convention Center! Don’t be late!
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Clue Synthesizer / Pinboard */}
              <div className="bg-cyber-surface border border-cyber-cyan/30 rounded-xl p-6 shadow-panel">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-cyber-cyan" />
                    <h3 className="font-display font-bold text-white text-sm">
                      INVESTIGATION PINBOARD: CORRELATE FOOTPRINT CLUES
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-cyber-cyan">
                    {clues.filter(c => c.found).length} / 4 Discovered
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {clues.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => c.found && togglePinboardSelection(c.id)}
                      className={`p-3 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                        !c.found
                          ? 'border-slate-800 bg-black/30 text-slate-600 cursor-not-allowed'
                          : selectedClueIds.includes(c.id)
                          ? 'border-cyber-cyan bg-cyber-cyan/15 text-white shadow-neon-cyan'
                          : 'border-slate-700 bg-cyber-dark text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold">{c.found ? c.title : '[UNKNOWN METADATA ITEM]'}</span>
                        {c.found && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyber-cyan/20 text-cyber-cyan">
                            {c.riskCategory}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {c.found ? c.detail : 'Click on profile elements above to scan and unlock.'}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Synthesis Action */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
                  <div className="text-xs font-mono text-slate-400">
                    Select 3+ discovered clues to synthesize the stalker/adversary inference.
                  </div>
                  <button
                    onClick={handleSynthesizeInference}
                    disabled={clues.filter(c => c.found).length < 3}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-cyber-cyan hover:bg-cyan-400 text-black font-display font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-neon-cyan"
                  >
                    SYNTHESIZE INFERENCE
                  </button>
                </div>

                {/* Inferred Result */}
                {inferenceRevealed && (
                  <div className="mt-4 p-4 rounded-lg bg-cyber-magenta/15 border border-cyber-magenta text-xs font-mono space-y-2 animate-fadeIn">
                    <div className="font-bold text-cyber-magenta flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      CRITICAL ADVERSARY INFERENCE REVEALED:
                    </div>
                    <p className="text-slate-200 leading-relaxed">
                      "Target Alex attends <strong>Westbridge STEM Academy</strong>, leaves daily via Route 42 Bus at 3:45 PM, sits predictably at <strong>CyberBytes Cafe every Friday at 4:30 PM</strong>, and will be unattended at the Downtown Expo this Saturday."
                    </p>
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setActiveTab('defender');
                        }}
                        className="px-3 py-1.5 rounded bg-cyber-green text-black font-display text-xs font-bold uppercase flex items-center gap-1 shadow-neon-green"
                      >
                        SWITCH TO PRIVACY DEFENDER MODE
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </div>
          ) : (
            /* PHASE 2: PRIVACY DEFENDER MODE */
            <div className="space-y-6">
              <div className="bg-cyber-surface border border-cyber-green/40 rounded-xl p-6 shadow-neon-green">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-cyber-green" />
                    <h3 className="font-display font-bold text-white text-base">
                      DEFENDER CONSOLE: SCRUB ALEX'S DIGITAL FOOTPRINT
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">EXPOSURE LEVEL:</span>
                    <span className={`text-sm font-mono font-bold ${exposureScore > 30 ? 'text-cyber-magenta' : 'text-cyber-green'}`}>
                      {exposureScore}%
                    </span>
                  </div>
                </div>

                {/* Exposure Progress Bar */}
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden mb-6 border border-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      exposureScore > 50
                        ? 'bg-cyber-magenta'
                        : exposureScore > 20
                        ? 'bg-cyber-yellow'
                        : 'bg-cyber-green'
                    }`}
                    style={{ width: `${exposureScore}%` }}
                  />
                </div>

                {/* Interactive Privacy Controls */}
                <div className="space-y-4">
                  
                  {/* Control 1 */}
                  <div className="flex items-center justify-between p-3.5 bg-black/40 rounded-lg border border-slate-800">
                    <div className="space-y-0.5">
                      <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                        <span>1. STRIP GPS METADATA & GEO-TAGS</span>
                        {privacySettings.stripGeoTags && (
                          <span className="text-[10px] text-cyber-green bg-cyber-green/10 px-1.5 py-0.2 rounded">
                            -25% EXPOSURE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-slate-400">
                        Removes exact coordinates from cafe posts and prevents automated location logging.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setPrivacySettings(s => ({ ...s, stripGeoTags: !s.stripGeoTags }));
                        addLog(`[PRIVACY] Geo-tagging ${!privacySettings.stripGeoTags ? 'DISABLED' : 'ENABLED'}`, 'info');
                      }}
                      className={`px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase transition-all ${
                        privacySettings.stripGeoTags
                          ? 'bg-cyber-green text-black shadow-neon-green'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {privacySettings.stripGeoTags ? 'PROTECTED' : 'DISABLE GPS'}
                    </button>
                  </div>

                  {/* Control 2 */}
                  <div className="flex items-center justify-between p-3.5 bg-black/40 rounded-lg border border-slate-800">
                    <div className="space-y-0.5">
                      <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                        <span>2. RESTRICT AUDIENCE TO VERIFIED CIRCLES</span>
                        {privacySettings.privateAudience && (
                          <span className="text-[10px] text-cyber-green bg-cyber-green/10 px-1.5 py-0.2 rounded">
                            -30% EXPOSURE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-slate-400">
                        Switches profile from public broadcast to approved contacts only.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setPrivacySettings(s => ({ ...s, privateAudience: !s.privateAudience }));
                        addLog(`[PRIVACY] Audience restricted to ${!privacySettings.privateAudience ? 'FRIENDS ONLY' : 'PUBLIC'}`, 'info');
                      }}
                      className={`px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase transition-all ${
                        privacySettings.privateAudience
                          ? 'bg-cyber-green text-black shadow-neon-green'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {privacySettings.privateAudience ? 'PRIVATE' : 'MAKE PRIVATE'}
                    </button>
                  </div>

                  {/* Control 3 */}
                  <div className="flex items-center justify-between p-3.5 bg-black/40 rounded-lg border border-slate-800">
                    <div className="space-y-0.5">
                      <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                        <span>3. OBFUSCATE ROUTINES & SCHOOL BADGES</span>
                        {privacySettings.blurIdentityMarkers && (
                          <span className="text-[10px] text-cyber-green bg-cyber-green/10 px-1.5 py-0.2 rounded">
                            -20% EXPOSURE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-slate-400">
                        Blur school logos on team hoodies and randomize recurring transit timestamp posts.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setPrivacySettings(s => ({ ...s, blurIdentityMarkers: !s.blurIdentityMarkers }));
                        addLog(`[PRIVACY] Identity markers ${!privacySettings.blurIdentityMarkers ? 'BLURRED' : 'UNBLURRED'}`, 'info');
                      }}
                      className={`px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase transition-all ${
                        privacySettings.blurIdentityMarkers
                          ? 'bg-cyber-green text-black shadow-neon-green'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {privacySettings.blurIdentityMarkers ? 'OBFUSCATED' : 'SANITIZE BIO'}
                    </button>
                  </div>

                  {/* Control 4 */}
                  <div className="flex items-center justify-between p-3.5 bg-black/40 rounded-lg border border-slate-800">
                    <div className="space-y-0.5">
                      <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                        <span>4. MODERATE PUBLIC COMMENTS & UPCOMING EVENTS</span>
                        {privacySettings.sanitizeComments && (
                          <span className="text-[10px] text-cyber-green bg-cyber-green/10 px-1.5 py-0.2 rounded">
                            -15% EXPOSURE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-slate-400">
                        Filter out friend comments exposing weekend itineraries and sensitive plans.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setPrivacySettings(s => ({ ...s, sanitizeComments: !s.sanitizeComments }));
                        addLog(`[PRIVACY] Comment filter ${!privacySettings.sanitizeComments ? 'ACTIVATED' : 'DEACTIVATED'}`, 'info');
                      }}
                      className={`px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase transition-all ${
                        privacySettings.sanitizeComments
                          ? 'bg-cyber-green text-black shadow-neon-green'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {privacySettings.sanitizeComments ? 'FILTERED' : 'FILTER COMMENTS'}
                    </button>
                  </div>

                </div>

                {/* Finish Mission Action */}
                <div className="mt-8 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    {defenderComplete ? (
                      <div className="flex items-center gap-2 text-cyber-green font-mono text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        PROFILE HARDENED. EXPOSURE REDUCED TO {exposureScore}%.
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-cyber-yellow font-mono text-xs">
                        <AlertTriangle className="w-4 h-4" />
                        Activate all 4 privacy controls to unlock mission completion.
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleFinishMission}
                    disabled={!defenderComplete}
                    className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-cyber-cyan to-cyber-green text-black font-display font-black text-xs uppercase tracking-wider hover:shadow-neon-green transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    COMPLETE MISSION & CLAIM BADGE
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Right Column: Mission Telemetry, Hints, Terminal */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Mission Objectives Card */}
          <div className="bg-cyber-surface border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyber-cyan" />
              OPERATIVE OBJECTIVES
            </h4>
            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <span className={clues.filter(c => c.found).length === 4 ? 'text-cyber-green' : 'text-cyber-muted'}>
                  {clues.filter(c => c.found).length === 4 ? '✓' : '○'}
                </span>
                <span>Scan and uncover 4 metadata clues ({clues.filter(c => c.found).length}/4)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={inferenceRevealed ? 'text-cyber-green' : 'text-cyber-muted'}>
                  {inferenceRevealed ? '✓' : '○'}
                </span>
                <span>Synthesize adversary timeline inference</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={defenderComplete ? 'text-cyber-green' : 'text-cyber-muted'}>
                  {defenderComplete ? '✓' : '○'}
                </span>
                <span>Harden privacy toggles (Exposure &le; 15%)</span>
              </div>
            </div>
          </div>

          {/* Tactical Hints */}
          <HintDrawer hints={hints} />

          {/* Live Reactive Terminal */}
          <TerminalLog logs={logs} title="MISSION_01 // SEC_LOG" maxHeight="max-h-60" />

        </div>

      </div>

      {/* Educational Concept Modal */}
      <ConceptModal
        isOpen={showConcept}
        onClose={() => setShowConcept(false)}
        title="DIGITAL FOOTPRINTS & METADATA AGGREGATION"
        conceptName="Information Aggregation / The Mosaic Effect"
        points={[
          {
            title: "Metadata Is Data About Data",
            desc: "A photo isn't just an image; it often contains GPS coordinates, device identifiers, and timestamps. Even if you don't say where you are, your file metadata might.",
          },
          {
            title: "The Mosaic Theory",
            desc: "Individual pieces of public data (a cafe check-in, a school hoodie, a bus delay comment) seem innocent. But when an attacker pieces them together like mosaic tiles, a complete picture of your life emerges.",
          },
          {
            title: "Defense in Depth for Privacy",
            desc: "Privacy settings help minimize exposure, but true safety comes from being mindful of what you upload in the first place. You cannot un-share what was once public.",
          }
        ]}
        takeaway="Assume that anything posted online can be correlated by adversaries. Minimize specific routines, remove location tags, and keep personal details in private channels."
      />

    </div>
  );
};
