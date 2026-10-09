import React, { useState } from 'react';
import { 
  Crosshair, AlertTriangle, CheckCircle2, Smartphone, 
  Search, AlertOctagon 
} from 'lucide-react';
import { soundFx } from '../../utils/audio';
import type { LogEntry, PhishingMessage } from '../../types';
import { HintDrawer } from '../../components/common/HintDrawer';
import { ConceptModal } from '../../components/common/ConceptModal';
import { TerminalLog } from '../../components/common/TerminalLog';

interface Mission05Props {
  onComplete: (xp: number, badgeId: string) => void;
  onBackToDashboard: () => void;
  isCompleted?: boolean;
}

const MESSAGES_DATA: PhishingMessage[] = [
  {
    id: 'msg_1',
    senderName: 'Steam Security Support',
    senderHandle: 'no-reply@steamcomnunity-auth.xyz',
    senderEmailOrPhone: 'support@steamcomnunity-auth.xyz',
    avatar: '🎮',
    timestamp: '14:22 PM',
    subject: 'URGENT: Your Gaming Inventory Will Be Banned in 15 Minutes!',
    body: 'We detected suspicious activity on your account. Your rare inventory will be permanently deleted unless you verify your credentials immediately.',
    linkUrl: 'https://steamcomnunity-auth.xyz/login?ref=ban_prevention',
    isPhishing: true,
    redFlags: [
      'Artificial Panic / Extreme Urgency ("Banned in 15 minutes")',
      'Deceptive Typosquatted Domain ("steamcomnunity" with an \'n\' instead of \'m\')',
      'Generic greeting without your actual username',
    ],
    technique: 'Urgency + Domain Typosquatting',
    explanation: 'Attackers create fake look-alike domains to steal passwords by making victims panic.',
    verifiedSenderInfo: 'Steam never uses .xyz domains and never threatens deletion in 15 minutes.',
  },
  {
    id: 'msg_2',
    senderName: 'Sam Vance (Classmate)',
    senderHandle: '@sam_codez',
    senderEmailOrPhone: '+1 (555) 019-2831',
    avatar: '🤖',
    timestamp: '15:10 PM',
    body: 'Hey Alex! Did you finish question 4 on the physics lab worksheet? Let me know if you want to compare answers before tomorrow morning.',
    isPhishing: false,
    redFlags: [],
    technique: 'Normal Peer Communication',
    explanation: 'Legitimate message from a known classmate. No links, no requests for credentials, no panic.',
    verifiedSenderInfo: 'Phone number matches Sam’s contact in your phone.',
  },
  {
    id: 'msg_3',
    senderName: 'National Merit Scholarship Trust',
    senderHandle: 'awards@scholarship-cash-direct.info',
    senderEmailOrPhone: 'awards@scholarship-cash-direct.info',
    avatar: '🎓',
    timestamp: '16:05 PM',
    subject: 'Congratulations! You Won a $2,500 STEM Grant',
    body: 'To deposit your $2,500 scholarship reward, please reply to this SMS with the 6-digit One-Time Passcode (OTP) we just sent to your phone number.',
    isPhishing: true,
    redFlags: [
      'Requesting a 2FA One-Time Passcode (OTP)',
      'Unsolicited monetary prize / Too good to be true',
      'Suspicious .info sender address',
    ],
    technique: '2FA / OTP Interception Scam',
    explanation: 'The attacker triggered a password reset on your real account and wants you to give them your login code!',
    verifiedSenderInfo: 'Legitimate organizations never ask for your 2FA verification codes.',
  },
  {
    id: 'msg_4',
    senderName: 'Westbridge IT Administration',
    senderHandle: 'it-support@westbridge-stem.edu',
    senderEmailOrPhone: 'it-support@westbridge-stem.edu',
    avatar: '🏫',
    timestamp: '17:30 PM',
    subject: 'Scheduled Maintenance Notice for School Wifi',
    body: 'The campus wifi network will undergo scheduled maintenance tonight between 11 PM and 2 AM. No action is required on your part.',
    isPhishing: false,
    redFlags: [],
    technique: 'Official Administrative Broadcast',
    explanation: 'Authentic school domain (@westbridge-stem.edu). Informational only with no credentials requested.',
    verifiedSenderInfo: 'Verified official school domain.',
  },
  {
    id: 'msg_5',
    senderName: 'Express Parcel Delivery',
    senderHandle: 'tracking@post-track-verify.top',
    senderEmailOrPhone: '+1 (800) 555-0199',
    avatar: '📦',
    timestamp: '18:45 PM',
    body: 'Your package #US-8819 could not be delivered due to an unpaid $1.50 customs fee. Update your billing address immediately to avoid return.',
    linkUrl: 'https://post-track-verify.top/pay-fee?id=8819',
    isPhishing: true,
    redFlags: [
      'Vague package number without recipient name',
      'Small unexpected payment fee trap to steal credit card numbers',
      'Unknown .top domain URL',
    ],
    technique: 'Smishing / Credit Card Harvester',
    explanation: 'Classic delivery smishing (SMS phishing) designed to capture credit card numbers.',
    verifiedSenderInfo: 'No official postal carrier uses post-track-verify.top.',
  }
];

export const PhishingDetectiveMission: React.FC<Mission05Props> = ({
  onComplete,
  onBackToDashboard,
}) => {
  const [selectedMsgId, setSelectedMsgId] = useState<string>('msg_1');
  const [inspectedSenders, setInspectedSenders] = useState<string[]>([]);
  const [userDecisions, setUserDecisions] = useState<Record<string, 'safe' | 'phishing' | 'verified'>>({});
  const [feedback, setFeedback] = useState<{ msgId: string; isCorrect: boolean; text: string } | null>(null);
  const [showConcept, setShowConcept] = useState(false);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'info',
      message: '[INBOX_SYNC] 5 incoming electronic messages queued on mobile handset.',
    },
    {
      id: '2',
      timestamp: new Date().toLocaleTimeString(),
      type: 'warning',
      message: '[SOC_ENG] Social engineering attack patterns detected.',
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

  const selectedMsg = MESSAGES_DATA.find(m => m.id === selectedMsgId) || MESSAGES_DATA[0];

  const handleInspectSender = () => {
    soundFx.playScan();
    if (!inspectedSenders.includes(selectedMsg.id)) {
      setInspectedSenders(prev => [...prev, selectedMsg.id]);
      addLog(`[HEADER_INSPECT] Origin domain analyzed: ${selectedMsg.senderEmailOrPhone}`, 'info');
    }
  };

  const handleDecision = (decision: 'safe' | 'phishing') => {
    const isCorrect = (decision === 'phishing' && selectedMsg.isPhishing) || (decision === 'safe' && !selectedMsg.isPhishing);

    setUserDecisions(prev => ({ ...prev, [selectedMsg.id]: decision }));

    if (isCorrect) {
      soundFx.playSuccess();
      setFeedback({
        msgId: selectedMsg.id,
        isCorrect: true,
        text: `EXCELLENT JUDGMENT! ${selectedMsg.explanation}`,
      });
      addLog(`[CORRECT CALL] Message #${selectedMsg.id} evaluated as ${decision.toUpperCase()}.`, 'success');
    } else {
      soundFx.playError();
      setFeedback({
        msgId: selectedMsg.id,
        isCorrect: false,
        text: selectedMsg.isPhishing
          ? `WARNING: You fell for a phishing attack! ${selectedMsg.technique} — ${selectedMsg.explanation}`
          : `CAUTION: False positive! This was a legitimate message from a verified source.`,
      });
      addLog(`[INCORRECT CALL] Message #${selectedMsg.id} misclassified.`, 'danger');
    }
  };

  const answeredCount = Object.keys(userDecisions).length;
  const correctCount = MESSAGES_DATA.filter(m => {
    const dec = userDecisions[m.id];
    return (dec === 'phishing' && m.isPhishing) || (dec === 'safe' && !m.isPhishing);
  }).length;

  const isMissionComplete = answeredCount === MESSAGES_DATA.length && correctCount >= 4;

  const handleFinish = () => {
    if (!isMissionComplete) {
      soundFx.playError();
      addLog('[INCOMPLETE] Evaluate all 5 inbox messages with at least 80% accuracy.', 'warning');
      return;
    }
    soundFx.playSuccess();
    onComplete(400, 'badge_m5');
  };

  const hints = [
    'Always click "INSPECT SENDER & ORIGIN DOMAIN" before making a decision on each message.',
    'Look closely at email domain spelling (e.g., steamcomnunity vs steamcommunity).',
    'Never share One-Time Passcodes (OTP) or click urgent threats of account deletion.',
    'Not all messages are scams—legitimate school notices and friend chats should be marked as SAFE.',
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fadeIn">
      
      {/* Mission HUD Header */}
      <div className="bg-cyber-surface border border-cyber-cyan/30 rounded-xl p-6 shadow-neon-cyan relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan font-bold">
                MISSION 05 // 10 MIN
              </span>
              <span className="text-xs font-mono text-cyber-magenta bg-cyber-magenta/10 px-2 py-0.5 rounded border border-cyber-magenta/30 font-bold">
                VETERAN LEVEL
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-black text-white text-glow-cyan">
              OUTSMART THE HUMAN HACKER
            </h1>
            <p className="text-xs sm:text-sm font-mono text-slate-300 mt-1">
              Investigate social engineering, inspect spoofed sender headers, identify urgency traps, and protect credentials.
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
              Search Intel
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
        
        {/* Left Column: Cyber Mobile Handset / Inbox */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-cyber-surface border border-slate-800 rounded-xl overflow-hidden shadow-panel">
            
            {/* Phone Top Bar */}
            <div className="bg-cyber-dark p-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-cyber-cyan" />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  CYBERPHONE INBOX // OPERATIVE HANDSET
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyber-cyan">
                {correctCount}/{MESSAGES_DATA.length} EVALUATED
              </span>
            </div>

            {/* Message Selector Tabs */}
            <div className="grid grid-cols-5 bg-black/50 border-b border-slate-800">
              {MESSAGES_DATA.map((msg, idx) => {
                const decision = userDecisions[msg.id];
                const isSelected = selectedMsgId === msg.id;

                return (
                  <button
                    key={msg.id}
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedMsgId(msg.id);
                      setFeedback(null);
                    }}
                    className={`py-3 px-2 text-center transition-all border-r border-slate-800 flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'bg-cyber-cyan/20 text-white font-bold'
                        : 'text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <span className="text-lg">{msg.avatar}</span>
                    <span className="text-[10px] font-mono">MSG #{idx + 1}</span>
                    {decision && (
                      <span className={`w-2 h-2 rounded-full ${
                        (decision === 'phishing' && msg.isPhishing) || (decision === 'safe' && !msg.isPhishing)
                          ? 'bg-cyber-green'
                          : 'bg-cyber-magenta'
                      }`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Message Viewer */}
            <div className="p-5 space-y-4">
              
              {/* Sender Details */}
              <div className="bg-black/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedMsg.avatar}</span>
                    <div>
                      <h3 className="font-display font-bold text-white text-sm">
                        {selectedMsg.senderName}
                      </h3>
                      <p className="text-[11px] font-mono text-slate-400">
                        {selectedMsg.senderHandle}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {selectedMsg.timestamp}
                  </span>
                </div>

                {/* Inspect Headers Button */}
                <button
                  onClick={handleInspectSender}
                  className="w-full py-2 px-3 rounded bg-cyber-dark border border-slate-700 hover:border-cyber-cyan/50 text-xs font-mono text-cyber-cyan flex items-center justify-center gap-2 transition-all"
                >
                  <Search className="w-3.5 h-3.5" />
                  {inspectedSenders.includes(selectedMsg.id) ? '✓ SENDER HEADERS INSPECTED' : 'INSPECT SENDER & ORIGIN DOMAIN'}
                </button>

                {/* Inspected Details Dropdown */}
                {inspectedSenders.includes(selectedMsg.id) && (
                  <div className="p-3 bg-slate-900/90 rounded-lg border border-cyber-cyan/30 text-xs font-mono space-y-1 animate-fadeIn">
                    <div className="text-cyber-cyan font-bold">TELEMETRY ANALYSIS:</div>
                    <div className="text-slate-300">
                      <strong>Sender Address:</strong> {selectedMsg.senderEmailOrPhone}
                    </div>
                    <div className="text-slate-300">
                      <strong>Security Note:</strong> {selectedMsg.verifiedSenderInfo}
                    </div>
                  </div>
                )}
              </div>

              {/* Message Body */}
              <div className="bg-black/40 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                {selectedMsg.subject && (
                  <div className="font-bold text-white text-sm pb-2 border-b border-slate-800">
                    {selectedMsg.subject}
                  </div>
                )}

                <p className="text-slate-200 leading-relaxed text-sm">
                  {selectedMsg.body}
                </p>

                {selectedMsg.linkUrl && (
                  <div className="p-3 bg-cyber-dark border border-cyber-yellow/40 rounded-lg text-cyber-yellow flex items-center justify-between">
                    <div className="truncate mr-2">
                      <span className="font-bold">LINK: </span>
                      <span>{selectedMsg.linkUrl}</span>
                    </div>
                    <span className="text-[9px] bg-cyber-yellow/20 px-2 py-0.5 rounded font-bold uppercase shrink-0">
                      UNVERIFIED URL
                    </span>
                  </div>
                )}
              </div>

              {/* Decision Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleDecision('safe')}
                  className={`py-3 px-4 rounded-lg font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                    userDecisions[selectedMsg.id] === 'safe'
                      ? 'bg-cyber-green text-black shadow-neon-green'
                      : 'bg-black/60 border border-slate-700 text-slate-300 hover:border-cyber-green hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-cyber-green" />
                  MARK AS LEGITIMATE / SAFE
                </button>

                <button
                  onClick={() => handleDecision('phishing')}
                  className={`py-3 px-4 rounded-lg font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                    userDecisions[selectedMsg.id] === 'phishing'
                      ? 'bg-cyber-magenta text-white shadow-neon-magenta'
                      : 'bg-black/60 border border-slate-700 text-slate-300 hover:border-cyber-magenta hover:text-white'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-cyber-magenta" />
                  REPORT AS PHISHING / ATTACK
                </button>
              </div>

              {/* Consequence / Feedback Banner */}
              {feedback && feedback.msgId === selectedMsg.id && (
                <div className={`p-4 rounded-xl border text-xs font-mono space-y-2 animate-fadeIn ${
                  feedback.isCorrect 
                    ? 'bg-cyber-green/15 border-cyber-green text-cyber-green' 
                    : 'bg-cyber-magenta/15 border-cyber-magenta text-cyber-magenta'
                }`}>
                  <div className="font-bold flex items-center gap-2">
                    {feedback.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <AlertOctagon className="w-4 h-4" />}
                    {feedback.isCorrect ? 'DECISION VERIFIED' : 'SECURITY BREACH DETECTED'}
                  </div>
                  <p className="text-slate-200 leading-relaxed">
                    {feedback.text}
                  </p>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Right Column: Scoreboard, Red Flags Checklist, Complete */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-cyber-surface border border-slate-800 rounded-xl p-5 shadow-panel space-y-4">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-cyber-magenta" />
              INVESTIGATION ACCURACY SCOREBOARD
            </h4>

            <div className="bg-black/50 p-4 rounded-lg border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Evaluated Messages:</span>
                <span className="text-white font-bold">{answeredCount} / {MESSAGES_DATA.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Correct Assessments:</span>
                <span className="text-cyber-green font-bold">{correctCount} / {MESSAGES_DATA.length}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2">
                <span className="text-slate-400">Accuracy Status:</span>
                <span className={correctCount >= 4 ? 'text-cyber-green font-bold' : 'text-cyber-yellow font-bold'}>
                  {answeredCount === 0 ? 'PENDING' : `${Math.round((correctCount / MESSAGES_DATA.length) * 100)}%`}
                </span>
              </div>
            </div>

            {/* Red Flags Guide */}
            <div className="space-y-1.5 pt-2 text-xs font-mono">
              <span className="text-cyber-yellow font-bold">PHISHING RED FLAGS TO SPOT:</span>
              <ul className="text-slate-400 space-y-1 list-disc pl-4 text-[11px]">
                <li>Manufactured urgency & threats ("15 min ban")</li>
                <li>Lookalike domains (steamcomnunity vs steamcommunity)</li>
                <li>Requests for OTPs or login credentials</li>
                <li>Unexpected prizes or delivery fee traps</li>
              </ul>
            </div>

            <button
              onClick={handleFinish}
              disabled={!isMissionComplete}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyber-cyan to-cyber-green text-black font-display font-black text-xs uppercase tracking-wider hover:shadow-neon-green transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              <CheckCircle2 className="w-4 h-4" />
              COMPLETE MISSION 05 & CLAIM BADGE
            </button>
          </div>

          {/* Tactical Hints & Logs */}
          <HintDrawer hints={hints} />
          <TerminalLog logs={logs} title="MISSION_05 // PHISH_DETECTOR" maxHeight="max-h-48" />

        </div>

      </div>

      {/* Theory Concept Modal */}
      <ConceptModal
        isOpen={showConcept}
        onClose={() => setShowConcept(false)}
        title="SOCIAL ENGINEERING, PHISHING & IMPERSONATION"
        conceptName="Psychological Manipulation & Domain Typosquatting"
        points={[
          {
            title: "Hacking the Human",
            desc: "Most breaches start with human error. Attackers exploit fear, urgency, greed, or authority to make you act before thinking.",
          },
          {
            title: "Never Share One-Time Passcodes (OTP)",
            desc: "2FA codes prove possession of your phone. Anyone asking for an OTP is trying to take over your account.",
          },
          {
            title: "Inspect the Root Domain",
            desc: "Always inspect the actual domain in URLs and email senders. Look for subtle character swaps (like 'rn' for 'm' or extra letters).",
          }
        ]}
        takeaway="When in doubt, pause. Navigate to the official website or contact the sender through a trusted independent channel."
      />

    </div>
  );
};
