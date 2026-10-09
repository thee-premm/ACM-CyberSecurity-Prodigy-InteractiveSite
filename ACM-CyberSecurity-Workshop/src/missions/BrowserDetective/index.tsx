import React, { useState } from 'react';
import { 
  Radio, Send, Server, Monitor, AlertTriangle, CheckCircle2, 
  Code, BookOpen, Check 
} from 'lucide-react';
import { soundFx } from '../../utils/audio';
import type { LogEntry, NetworkLogItem } from '../../types';
import { HintDrawer } from '../../components/common/HintDrawer';
import { ConceptModal } from '../../components/common/ConceptModal';
import { TerminalLog } from '../../components/common/TerminalLog';

interface Mission02Props {
  onComplete: (xp: number, badgeId: string) => void;
  onBackToDashboard: () => void;
  isCompleted?: boolean;
}

export const BrowserDetectiveMission: React.FC<Mission02Props> = ({
  onComplete,
  onBackToDashboard,
}) => {
  // App State
  const [username, setUsername] = useState('alex_matrix');
  const [bio, setBio] = useState('Robotics engineer & cybersecurity recruit.');
  const [avatar, setAvatar] = useState<'cyan' | 'green' | 'magenta' | 'yellow'>('cyan');
  
  // Security Simulation State
  const [backendFixApplied, setBackendFixApplied] = useState(false);
  const [selectedTrafficId, setSelectedTrafficId] = useState<string>('req_1');
  const [identifiedLeak, setIdentifiedLeak] = useState(false);
  const [explanationChosen, setExplanationChosen] = useState<number | null>(null);
  const [verifiedFixedRequest, setVerifiedFixedRequest] = useState(false);
  const [showConcept, setShowConcept] = useState(false);

  // Simulated Network Traffic Log
  const [trafficLogs, setTrafficLogs] = useState<NetworkLogItem[]>([
    {
      id: 'req_1',
      method: 'GET',
      url: '/api/v1/user/profile',
      status: 200,
      statusText: 'OK',
      timestamp: '10:42:01.210',
      requestHeaders: {
        'Host': 'school-portal.internal.net',
        'User-Agent': 'CyberQuestBrowser/2.4 (X11; CyberOS)',
        'Accept': 'application/json',
      },
      responseHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        'Server': 'Kestrel/8.0 (Unix)',
        'Cache-Control': 'no-store',
      },
      responseBody: {
        id: 'usr_9021',
        username: 'alex_matrix',
        avatar: 'cyan',
        role: 'student',
        bio: 'Robotics engineer & cybersecurity recruit.',
        internalNote: 'CONFIDENTIAL: Emergency recovery PIN: 9812 - Do not expose to client!',
        serverClusterNode: 'node-us-east-04.corp',
      },
      hasVulnerability: true,
    }
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'info',
      message: '[NET_INSPECTOR] Virtual HTTP Packet sniffer initialized.',
    },
    {
      id: '2',
      timestamp: new Date().toLocaleTimeString(),
      type: 'warning',
      message: '[WARNING] Unencrypted internal fields discovered in payload stream.',
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

  const handleSaveProfile = () => {
    soundFx.playScan();
    const newId = `req_${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString() + '.' + Math.floor(Math.random() * 900 + 100);

    const newRequest: NetworkLogItem = {
      id: newId,
      method: 'POST',
      url: '/api/v1/user/profile',
      status: 200,
      statusText: 'OK',
      timestamp,
      requestHeaders: {
        'Host': 'school-portal.internal.net',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      requestBody: {
        username,
        avatar,
        bio,
      },
      responseHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        'Server': 'Kestrel/8.0',
      },
      responseBody: backendFixApplied
        ? {
            id: 'usr_9021',
            username,
            avatar,
            bio,
            role: 'student',
            updatedAt: new Date().toISOString(),
          }
        : {
            id: 'usr_9021',
            username,
            avatar,
            bio,
            role: 'student',
            internalNote: 'CONFIDENTIAL: Emergency recovery PIN: 9812 - Do not expose to client!',
            serverClusterNode: 'node-us-east-04.corp',
            updatedAt: new Date().toISOString(),
          },
      hasVulnerability: !backendFixApplied,
    };

    setTrafficLogs(prev => [newRequest, ...prev]);
    setSelectedTrafficId(newId);

    if (backendFixApplied) {
      soundFx.playSuccess();
      setVerifiedFixedRequest(true);
      addLog(`[HTTP 200 OK] POST /api/v1/user/profile response returned CLEAN payload.`, 'success');
    } else {
      soundFx.playError();
      addLog(`[HTTP 200 OK] POST /api/v1/user/profile leaked internal field 'internalNote'.`, 'danger');
    }
  };

  const handleSelectField = (key: string) => {
    if (key === 'internalNote') {
      soundFx.playSuccess();
      setIdentifiedLeak(true);
      addLog(`[VULNERABILITY IDENTIFIED] Target identified sensitive field 'internalNote'.`, 'success');
    } else {
      soundFx.playClick();
      addLog(`[INSPECT] Field '${key}' is benign public profile telemetry.`, 'info');
    }
  };

  const selectedItem = trafficLogs.find(t => t.id === selectedTrafficId) || trafficLogs[0];

  const missionCompleted = identifiedLeak && explanationChosen === 1 && verifiedFixedRequest;

  const handleFinish = () => {
    if (!missionCompleted) {
      soundFx.playError();
      addLog('[INCOMPLETE] Complete all 3 security diagnosis & fix objectives first!', 'warning');
      return;
    }
    soundFx.playSuccess();
    onComplete(350, 'badge_m2');
  };

  const hints = [
    'Edit the profile and click "SEND HTTP POST REQUEST" to generate live HTTP traffic.',
    'Click on the requests in the Network Traffic Inspector to view their headers and response JSON.',
    'Look at the response JSON keys—one of them contains a confidential recovery PIN that ordinary users shouldn’t see.',
    'Enable the Backend Security Filter and click Send again to test the sanitized response.',
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fadeIn">
      
      {/* Mission HUD Header */}
      <div className="bg-cyber-surface border border-cyber-cyan/30 rounded-xl p-6 shadow-neon-cyan relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan font-bold">
                MISSION 02 // 15 MIN
              </span>
              <span className="text-xs font-mono text-cyber-cyan bg-cyber-cyan/10 px-2 py-0.5 rounded border border-cyber-cyan/30">
                OPERATIVE LEVEL
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-black text-white text-glow-cyan">
              EAVESDROP ON YOUR BROWSER
            </h1>
            <p className="text-xs sm:text-sm font-mono text-slate-300 mt-1">
              Inspect behind-the-scenes HTTP requests and JSON payloads to find and patch server data disclosure leaks.
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
        
        {/* Left Column: Mini Profile App + Backend Fix Console */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Simulated Web App Card */}
          <div className="bg-cyber-surface border border-slate-800 rounded-xl p-5 shadow-panel">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-cyber-cyan" />
                <h3 className="font-display font-bold text-white text-sm">
                  CLIENT APPLICATION: PROFILE EDITOR
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30">
                HTTP CLIENT
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-mono text-slate-300 mb-1 block">
                  USERNAME
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/60 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-cyber-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-300 mb-1 block">
                  BIO / MOTTO
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  className="w-full bg-black/60 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-cyber-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-300 mb-1.5 block">
                  AVATAR THEME COLOR
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['cyan', 'green', 'magenta', 'yellow'] as const).map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setAvatar(color);
                      }}
                      className={`py-2 rounded-lg text-xs font-mono font-bold capitalize transition-all border ${
                        avatar === color
                          ? `bg-cyber-${color}/20 text-white border-cyber-${color} shadow-neon-${color}`
                          : 'bg-black/40 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                className="w-full py-2.5 rounded-lg bg-cyber-cyan hover:bg-cyan-400 text-black font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-neon-cyan"
              >
                <Send className="w-3.5 h-3.5" />
                SEND HTTP POST REQUEST
              </button>
            </div>
          </div>

          {/* Backend Fix Controller */}
          <div className="bg-cyber-surface border border-cyber-green/40 rounded-xl p-5 shadow-neon-green">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-cyber-green" />
                <h3 className="font-display font-bold text-white text-sm">
                  SERVER-SIDE API CONTROLLER
                </h3>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                backendFixApplied ? 'bg-cyber-green/20 text-cyber-green' : 'bg-cyber-magenta/20 text-cyber-magenta'
              }`}>
                {backendFixApplied ? 'SANITIZED' : 'LEAKING'}
              </span>
            </div>

            <p className="text-xs font-mono text-slate-300 mb-4 leading-relaxed">
              When enabled, the backend server scrubs confidential fields (such as recovery codes, SSN hashes, and internal memos) before serializing JSON responses.
            </p>

            <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-slate-800">
              <div className="text-xs font-mono font-bold text-white">
                APPLY BACKEND DATA SANITIZER
              </div>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setBackendFixApplied(b => !b);
                  addLog(`[SERVER CONFIG] Backend DTO sanitizer ${!backendFixApplied ? 'ENABLED' : 'DISABLED'}`, 'info');
                }}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold uppercase transition-all ${
                  backendFixApplied
                    ? 'bg-cyber-green text-black shadow-neon-green'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {backendFixApplied ? 'PATCHED ✓' : 'ENABLE PATCH'}
              </button>
            </div>
          </div>

          {/* Diagnosis Challenge */}
          {identifiedLeak && (
            <div className="bg-cyber-surface border border-cyber-yellow/40 rounded-xl p-5 shadow-neon-yellow animate-fadeIn">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-cyber-yellow" />
                SECURITY DIAGNOSIS: WHY IS THIS DANGEROUS?
              </h4>
              <p className="text-[11px] font-mono text-slate-300 mb-3">
                Select the correct cybersecurity reason:
              </p>

              <div className="space-y-2">
                {[
                  {
                    id: 0,
                    text: 'It is fine as long as the webpage UI does not show the text on screen.',
                    correct: false,
                  },
                  {
                    id: 1,
                    text: 'Anyone opening DevTools/Network inspector can read raw JSON regardless of what the UI displays.',
                    correct: true,
                  },
                  {
                    id: 2,
                    text: 'JSON cannot be read by hackers because HTTP is completely encrypted.',
                    correct: false,
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      if (opt.correct) {
                        soundFx.playSuccess();
                        setExplanationChosen(1);
                        addLog('[CORRECT DIAGNOSIS] Client-side hiding is not security; server must restrict data.', 'success');
                      } else {
                        soundFx.playError();
                        addLog('[INCORRECT] Remember: DevTools exposes all data sent over the wire!', 'danger');
                      }
                    }}
                    className={`w-full p-2.5 rounded-lg text-left text-xs font-mono transition-all border ${
                      explanationChosen === opt.id
                        ? opt.correct
                          ? 'bg-cyber-green/20 border-cyber-green text-cyber-green font-bold'
                          : 'bg-cyber-magenta/20 border-cyber-magenta text-cyber-magenta'
                        : 'bg-black/40 border-slate-800 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-bold">{String.fromCharCode(65 + opt.id)}.</span>
                      <span>{opt.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Live Network Inspector (Headers & JSON Viewer) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-cyber-surface border border-slate-800 rounded-xl overflow-hidden shadow-panel flex flex-col">
            
            {/* Inspector Top Bar */}
            <div className="bg-cyber-dark px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyber-cyan animate-pulse" />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  NETWORK TRAFFIC INSPECTOR (HUD DEVTOOLS)
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyber-muted">
                {trafficLogs.length} EVENTS RECORDED
              </span>
            </div>

            {/* Request Timeline Strip */}
            <div className="bg-black/60 p-2 border-b border-slate-800 flex gap-2 overflow-x-auto">
              {trafficLogs.map((req) => (
                <button
                  key={req.id}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedTrafficId(req.id);
                  }}
                  className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-2 whitespace-nowrap transition-all border ${
                    selectedTrafficId === req.id
                      ? 'bg-cyber-cyan/20 border-cyber-cyan text-white shadow-neon-cyan'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className={`px-1 rounded text-[10px] font-bold ${
                    req.method === 'GET' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {req.method}
                  </span>
                  <span>{req.url}</span>
                  <span className="text-cyber-green text-[10px]">200 OK</span>
                  {req.hasVulnerability && (
                    <span className="w-2 h-2 rounded-full bg-cyber-magenta animate-ping" />
                  )}
                </button>
              ))}
            </div>

            {/* Request & Response Details View */}
            <div className="p-4 space-y-4 font-mono text-xs max-h-[460px] overflow-y-auto">
              
              {/* Endpoint Overview */}
              <div className="bg-black/50 p-3 rounded-lg border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold text-[10px]">
                      {selectedItem.method}
                    </span>
                    <span className="text-white font-bold">{selectedItem.url}</span>
                  </div>
                  <span className="text-cyber-green font-bold bg-cyber-green/10 px-2 py-0.5 rounded border border-cyber-green/30">
                    HTTP 200 OK
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Transmitted at: {selectedItem.timestamp} | Host: school-portal.internal.net
                </div>
              </div>

              {/* Request Payload (if POST) */}
              {selectedItem.requestBody && (
                <div>
                  <div className="text-[11px] font-bold text-cyber-cyan mb-1 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5" />
                    REQUEST BODY (JSON sent from Browser to Server)
                  </div>
                  <pre className="bg-black/80 p-3 rounded-lg border border-slate-800 text-[11px] text-cyan-200 overflow-x-auto">
                    {JSON.stringify(selectedItem.requestBody, null, 2)}
                  </pre>
                </div>
              )}

              {/* Response Payload */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[11px] font-bold text-cyber-green flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5" />
                    RESPONSE BODY (JSON received from Server)
                  </div>
                  <span className="text-[10px] text-cyber-yellow">
                    CLICK A FIELD KEY TO INVESTIGATE FOR LEAKS
                  </span>
                </div>

                <div className="bg-black/80 p-3 rounded-lg border border-slate-800 space-y-1 text-[11px]">
                  <span className="text-slate-500">&#123;</span>
                  {Object.entries(selectedItem.responseBody).map(([k, v]) => {
                    const isLeakingKey = k === 'internalNote';
                    return (
                      <div
                        key={k}
                        onClick={() => handleSelectField(k)}
                        className={`pl-4 py-1 rounded cursor-pointer transition-all flex flex-wrap items-center gap-2 ${
                          isLeakingKey
                            ? 'bg-cyber-magenta/20 border border-cyber-magenta text-cyber-magenta font-bold animate-pulse'
                            : 'hover:bg-slate-800/50 text-slate-300'
                        }`}
                      >
                        <span className="text-cyan-300">"{k}":</span>
                        <span className={typeof v === 'string' ? 'text-amber-300' : 'text-purple-300'}>
                          {JSON.stringify(v)}
                        </span>
                        {isLeakingKey && (
                          <span className="text-[9px] bg-cyber-magenta text-white px-1.5 py-0.2 rounded uppercase ml-auto">
                            LEAK DETECTED! CLICK TO ANALYZE
                          </span>
                        )}
                      </div>
                    );
                  })}
                  <span className="text-slate-500">&#125;</span>
                </div>
              </div>

            </div>

            {/* Mission Completion Trigger */}
            <div className="p-4 bg-cyber-dark border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs font-mono">
                {missionCompleted ? (
                  <span className="text-cyber-green font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> ALL SECURITY OBJECTIVES SATISFIED!
                  </span>
                ) : (
                  <span className="text-cyber-muted">
                    1. Identify leaked field ➔ 2. Select diagnosis ➔ 3. Enable patch & Send POST request.
                  </span>
                )}
              </div>

              <button
                onClick={handleFinish}
                disabled={!missionCompleted}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyber-cyan to-cyber-green text-black font-display font-black text-xs uppercase tracking-wider hover:shadow-neon-green transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                COMPLETE MISSION 02
              </button>
            </div>

          </div>

          {/* Tactical Hints & Logs */}
          <HintDrawer hints={hints} />
          <TerminalLog logs={logs} title="MISSION_02 // PACKET_SNIFFER" maxHeight="max-h-48" />

        </div>

      </div>

      {/* Concept Theory Modal */}
      <ConceptModal
        isOpen={showConcept}
        onClose={() => setShowConcept(false)}
        title="HTTP PROTOCOL & EXCESSIVE DATA EXPOSURE"
        conceptName="Client-Server Architecture & API Information Disclosure"
        points={[
          {
            title: "What Happens During an HTTP Request?",
            desc: "The browser sends a method (GET, POST, PUT, DELETE) and URL. The server processes the request and responds with a Status Code (e.g., 200 OK, 404 Not Found, 403 Forbidden) and a payload (usually JSON).",
          },
          {
            title: "JSON Is Open Text to the Client",
            desc: "Any data returned by an API reaches the browser memory. Just because HTML doesn't display an internal note doesn't mean a curious user or attacker can't open DevTools and read it.",
          },
          {
            title: "Server-Side Sanitization Is Mandatory",
            desc: "Servers must strictly filter (Data Transfer Object / DTO mapping) what properties are returned to the user based on their authorization level.",
          }
        ]}
        takeaway="Never rely on the frontend UI to hide sensitive fields. If the client shouldn't see it, the server shouldn't send it."
      />

    </div>
  );
};
