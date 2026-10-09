import React, { useState } from 'react';
import { 
  ShieldAlert, Lock, UserCheck, AlertOctagon, CheckCircle2, 
  Server, Shield, BookOpen 
} from 'lucide-react';
import { soundFx } from '../../utils/audio';
import type { LogEntry } from '../../types';
import { HintDrawer } from '../../components/common/HintDrawer';
import { ConceptModal } from '../../components/common/ConceptModal';
import { TerminalLog } from '../../components/common/TerminalLog';

interface Mission03Props {
  onComplete: (xp: number, badgeId: string) => void;
  onBackToDashboard: () => void;
  isCompleted?: boolean;
}

interface StudentRecord {
  id: string;
  name: string;
  gradeAverage: string;
  disciplinaryRemarks: string;
  medicalNote: string;
  lockerCombo: string;
}

const STUDENT_RECORDS: Record<string, StudentRecord> = {
  usr_1042: {
    id: 'usr_1042',
    name: 'Alex Rivera',
    gradeAverage: '94% (Grade A)',
    disciplinaryRemarks: 'Clean record. Excellent robotics team leader.',
    medicalNote: 'Mild peanut allergy. Epipen in Nurse Office.',
    lockerCombo: '24-11-09',
  },
  usr_2099: {
    id: 'usr_2099',
    name: 'Sam Vance',
    gradeAverage: '88% (Grade B+)',
    disciplinaryRemarks: 'Late slip on Oct 4. Makeup quiz completed.',
    medicalNote: 'Asthma inhaler kept in backpack.',
    lockerCombo: '17-43-02',
  },
};

export const BreakItFixItMission: React.FC<Mission03Props> = ({
  onComplete,
  onBackToDashboard,
}) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<'usr_1042' | 'usr_2099'>('usr_1042');
  const [requestedId, setRequestedId] = useState<string>('usr_1042');
  const [authzRuleEnabled, setAuthzRuleEnabled] = useState(false);
  const [lastResponseStatus, setLastResponseStatus] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<any>(null);
  
  // Progress milestones
  const [vulnerabilityDemonstrated, setVulnerabilityDemonstrated] = useState(false);
  const [fixedVerified, setFixedVerified] = useState(false);
  const [showConcept, setShowConcept] = useState(false);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'info',
      message: '[AC_GATEWAY] Session initiated for dummy student environment.',
    },
    {
      id: '2',
      timestamp: new Date().toLocaleTimeString(),
      type: 'warning',
      message: '[CONFIG] Insecure Direct Object Reference (IDOR) testing mode active.',
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

  const handleFetchRecord = () => {
    const isOwner = currentUser === requestedId;

    if (!authzRuleEnabled) {
      // VULNERABLE MODE: No authorization check performed!
      soundFx.playScan();
      const data = STUDENT_RECORDS[requestedId] || { error: 'Student Record Not Found' };
      setLastResponseStatus(200);
      setResponseData(data);

      if (!isOwner) {
        soundFx.playError();
        setVulnerabilityDemonstrated(true);
        addLog(`[VULNERABILITY TRIGGERED] Authenticated user ${currentUser} accessed private record ${requestedId} without authorization! (200 OK)`, 'danger');
      } else {
        addLog(`[ACCESS OK] User ${currentUser} fetched their own record ${requestedId}.`, 'info');
      }
    } else {
      // FIXED MODE: Enforce AuthZ
      if (isOwner) {
        soundFx.playSuccess();
        setLastResponseStatus(200);
        setResponseData(STUDENT_RECORDS[requestedId]);
        addLog(`[AUTHZ SUCCESS] Verified ownership for ${currentUser}. Access granted (200 OK).`, 'success');
      } else {
        soundFx.playError();
        setLastResponseStatus(403);
        setResponseData({
          error: '403 Forbidden',
          message: `Access Denied. User ${currentUser} is authenticated, but is NOT authorized to access resource ${requestedId}.`,
        });
        setFixedVerified(true);
        addLog(`[BLOCKED BY AUTHZ RULE] HTTP 403 Forbidden: Blocked ${currentUser} from viewing ${requestedId}'s private dossier!`, 'success');
      }
    }
  };

  const isMissionComplete = vulnerabilityDemonstrated && fixedVerified && authzRuleEnabled;

  const handleFinish = () => {
    if (!isMissionComplete) {
      soundFx.playError();
      addLog('[INCOMPLETE] You must test both the flawed exploit and verify the 403 authorization fix.', 'warning');
      return;
    }
    soundFx.playSuccess();
    onComplete(400, 'badge_m3');
  };

  const hints = [
    'First, stay in VULNERABLE MODE. Logged in as Alex (usr_1042), change the requested record dropdown to Sam (usr_2099) and click Fetch.',
    'Notice how you can read Sam’s private disciplinary notes and locker combo even though you are Alex!',
    'Now click "ACTIVATE SERVER-SIDE AUTHORIZATION RULE" to patch the backend.',
    'Click Fetch again on Sam’s record. You should receive an HTTP 403 Forbidden error blocking the unauthorized access.',
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fadeIn">
      
      {/* Mission HUD Header */}
      <div className="bg-cyber-surface border border-cyber-cyan/30 rounded-xl p-6 shadow-neon-cyan relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan font-bold">
                MISSION 03 // 15 MIN
              </span>
              <span className="text-xs font-mono text-cyber-cyan bg-cyber-cyan/10 px-2 py-0.5 rounded border border-cyber-cyan/30">
                OPERATIVE LEVEL
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-black text-white text-glow-cyan">
              BREAK IT. FIX IT.
            </h1>
            <p className="text-xs sm:text-sm font-mono text-slate-300 mt-1">
              Explore Broken Object Level Authorization (BOLA/IDOR), break flawed access controls, and enforce strict server-side rules.
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
        
        {/* Left Column: Interactive Portal Simulator */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Identity & Request Simulator */}
          <div className="bg-cyber-surface border border-slate-800 rounded-xl p-6 shadow-panel space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-cyber-cyan" />
                <h3 className="font-display font-bold text-white text-sm">
                  SIMULATED SCHOOL ACADEMIC DOSSIER PORTAL
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-slate-400 border border-slate-800">
                SANDBOX ISOLATED
              </span>
            </div>

            {/* Step 1: Authentication */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-cyber-cyan font-bold uppercase flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                1. AUTHENTICATION: SIGN IN AS USER (Who are you?)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setCurrentUser('usr_1042');
                    addLog('[AUTHN] Logged in as Alex Rivera (ID: usr_1042)', 'info');
                  }}
                  className={`p-3 rounded-lg border text-left font-mono text-xs transition-all ${
                    currentUser === 'usr_1042'
                      ? 'bg-cyber-cyan/20 border-cyber-cyan text-white shadow-neon-cyan'
                      : 'bg-black/40 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold text-white">Alex Rivera</div>
                  <div className="text-[10px] text-cyber-cyan">ID: usr_1042 (Student)</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setCurrentUser('usr_2099');
                    addLog('[AUTHN] Logged in as Sam Vance (ID: usr_2099)', 'info');
                  }}
                  className={`p-3 rounded-lg border text-left font-mono text-xs transition-all ${
                    currentUser === 'usr_2099'
                      ? 'bg-cyber-cyan/20 border-cyber-cyan text-white shadow-neon-cyan'
                      : 'bg-black/40 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold text-white">Sam Vance</div>
                  <div className="text-[10px] text-cyber-cyan">ID: usr_2099 (Student)</div>
                </button>
              </div>
            </div>

            {/* Step 2: Resource Request */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-cyber-yellow font-bold uppercase flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5" />
                2. RESOURCE SELECTION: REQUEST RECORD (What are you asking for?)
              </label>
              <div className="flex gap-2">
                <select
                  value={requestedId}
                  onChange={(e) => setRequestedId(e.target.value)}
                  className="flex-1 bg-black/70 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-cyber-cyan focus:outline-none"
                >
                  <option value="usr_1042">usr_1042 (Alex Rivera's Private Dossier)</option>
                  <option value="usr_2099">usr_2099 (Sam Vance's Private Dossier)</option>
                </select>

                <button
                  onClick={handleFetchRecord}
                  className="px-5 py-2 rounded-lg bg-cyber-cyan text-black font-display font-bold text-xs uppercase tracking-wider hover:shadow-neon-cyan transition-all flex items-center gap-1.5"
                >
                  FETCH RECORD
                </button>
              </div>
            </div>

            {/* Step 3: Server Access Control Status & Fix Toggle */}
            <div className={`p-4 rounded-xl border transition-all ${
              authzRuleEnabled 
                ? 'bg-cyber-green/10 border-cyber-green/50 shadow-neon-green' 
                : 'bg-cyber-magenta/10 border-cyber-magenta/50 shadow-neon-magenta'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield className={`w-4 h-4 ${authzRuleEnabled ? 'text-cyber-green' : 'text-cyber-magenta'}`} />
                  <span className="text-xs font-mono font-bold uppercase text-white">
                    SERVER-SIDE AUTHORIZATION RULE (AuthZ)
                  </span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  authzRuleEnabled ? 'bg-cyber-green/20 text-cyber-green' : 'bg-cyber-magenta/20 text-cyber-magenta'
                }`}>
                  {authzRuleEnabled ? 'ENFORCED (SECURE)' : 'BYPASSED (VULNERABLE)'}
                </span>
              </div>

              <p className="text-[11px] font-mono text-slate-300 mb-3">
                {authzRuleEnabled
                  ? 'Server verifies: req.user.id === requestedStudentId. Rejects unauthorized reads with 403 Forbidden.'
                  : 'Server only checks if user is logged in, then unconditionally returns whatever record is in the URL parameter!'}
              </p>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setAuthzRuleEnabled(r => !r);
                  addLog(`[SERVER] Authorization rule ${!authzRuleEnabled ? 'ENFORCED' : 'DISABLED'}`, 'info');
                }}
                className={`w-full py-2.5 rounded-lg font-display text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  authzRuleEnabled
                    ? 'bg-slate-800 text-slate-300 hover:text-white'
                    : 'bg-cyber-green text-black shadow-neon-green'
                }`}
              >
                {authzRuleEnabled ? 'SWITCH BACK TO VULNERABLE MODE' : 'ACTIVATE SERVER-SIDE AUTHORIZATION RULE'}
              </button>
            </div>

            {/* Server Response Display */}
            {lastResponseStatus && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-300">SERVER RESPONSE STATUS:</span>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    lastResponseStatus === 200 
                      ? currentUser !== requestedId && !authzRuleEnabled
                        ? 'bg-cyber-magenta/20 text-cyber-magenta border border-cyber-magenta'
                        : 'bg-cyber-green/20 text-cyber-green border border-cyber-green'
                      : 'bg-cyber-magenta/20 text-cyber-magenta border border-cyber-magenta'
                  }`}>
                    HTTP {lastResponseStatus} {lastResponseStatus === 200 ? 'OK' : 'FORBIDDEN'}
                  </span>
                </div>

                <div className="bg-black/90 p-4 rounded-lg border border-slate-800 font-mono text-xs space-y-2">
                  {lastResponseStatus === 200 ? (
                    <div>
                      <div className="text-cyber-green font-bold mb-2">
                        [RECORD RETRIEVED: {responseData?.name}]
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                        <div><strong className="text-cyan-400">ID:</strong> {responseData?.id}</div>
                        <div><strong className="text-cyan-400">GPA:</strong> {responseData?.gradeAverage}</div>
                        <div><strong className="text-cyan-400">Locker Pin:</strong> {responseData?.lockerCombo}</div>
                        <div><strong className="text-cyan-400">Medical:</strong> {responseData?.medicalNote}</div>
                      </div>
                      <div className="mt-2 text-[11px] text-amber-300">
                        <strong>Disciplinary:</strong> {responseData?.disciplinaryRemarks}
                      </div>
                    </div>
                  ) : (
                    <div className="text-cyber-magenta">
                      <div className="font-bold flex items-center gap-1.5 mb-1">
                        <AlertOctagon className="w-4 h-4" />
                        ACCESS DENIED (403 FORBIDDEN)
                      </div>
                      <p className="text-[11px] text-slate-300">
                        {responseData?.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Comparison Matrix & Complete Button */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Identity vs Authorization Comparison Matrix */}
          <div className="bg-cyber-surface border border-slate-800 rounded-xl p-5 shadow-panel space-y-4">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyber-cyan" />
              AUTHN VS AUTHZ TELEMETRY MATRIX
            </h4>

            <div className="bg-black/50 p-3 rounded-lg border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Authenticated Identity (AuthN):</span>
                <span className="text-cyber-cyan font-bold">{currentUser}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Resource ID:</span>
                <span className="text-cyber-yellow font-bold">{requestedId}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2">
                <span className="text-slate-400">Identity Match:</span>
                <span className={currentUser === requestedId ? 'text-cyber-green font-bold' : 'text-cyber-magenta font-bold'}>
                  {currentUser === requestedId ? 'MATCH (SELF)' : 'CROSS-ACCOUNT (TARGET)'}
                </span>
              </div>
            </div>

            {/* Milestones Checklist */}
            <div className="space-y-2 pt-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className={vulnerabilityDemonstrated ? 'text-cyber-green' : 'text-cyber-muted'}>
                  {vulnerabilityDemonstrated ? '✓' : '○'}
                </span>
                <span>Exploit IDOR: Access Sam's record as Alex in Flawed Mode</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={authzRuleEnabled ? 'text-cyber-green' : 'text-cyber-muted'}>
                  {authzRuleEnabled ? '✓' : '○'}
                </span>
                <span>Activate Server-Side Authorization Rule</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={fixedVerified ? 'text-cyber-green' : 'text-cyber-muted'}>
                  {fixedVerified ? '✓' : '○'}
                </span>
                <span>Verify HTTP 403 Forbidden blocks unauthorized view</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              disabled={!isMissionComplete}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyber-cyan to-cyber-green text-black font-display font-black text-xs uppercase tracking-wider hover:shadow-neon-green transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              <CheckCircle2 className="w-4 h-4" />
              COMPLETE MISSION 03 & CLAIM BADGE
            </button>
          </div>

          {/* Tactical Hints & Logs */}
          <HintDrawer hints={hints} />
          <TerminalLog logs={logs} title="MISSION_03 // ACCESS_GATEWAY" maxHeight="max-h-48" />

        </div>

      </div>

      {/* Theory Concept Modal */}
      <ConceptModal
        isOpen={showConcept}
        onClose={() => setShowConcept(false)}
        title="AUTHENTICATION VS AUTHORIZATION & BROKEN ACCESS CONTROL"
        conceptName="Insecure Direct Object Reference (IDOR) & Principle of Least Privilege"
        points={[
          {
            title: "Authentication (AuthN) = Identity",
            desc: "Authentication answers 'Who are you?'. Logging in with a password or token proves your identity. (Failure = 401 Unauthorized).",
          },
          {
            title: "Authorization (AuthZ) = Permission",
            desc: "Authorization answers 'What are you allowed to do?'. Even if you are logged in, you should not be able to view or edit other users' private accounts. (Failure = 403 Forbidden).",
          },
          {
            title: "The Danger of IDOR / BOLA",
            desc: "Broken Access Control is #1 on the OWASP Top 10 vulnerabilities. It occurs whenever a server trusts user-supplied IDs in URL parameters without validating whether that specific user owns the resource.",
          }
        ]}
        takeaway="Always verify authorization on every single server request. Never assume a valid login session authorizes a user to access arbitrary database IDs."
      />

    </div>
  );
};
