import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { BootSequence } from './components/common/BootSequence';
import { Dashboard } from './components/Dashboard';
import { InvisibleInternetMission } from './missions/InvisibleInternet';
import { BrowserDetectiveMission } from './missions/BrowserDetective';
import { BreakItFixItMission } from './missions/BreakItFixIt';
import { CrackTheSecretMission } from './missions/CrackTheSecret';
import { PhishingDetectiveMission } from './missions/PhishingDetective';
import { OperationBlackout } from './final-challenge/OperationBlackout';
import { ProtocolZero } from './hidden-mission/ProtocolZero';
import { BadgeModal } from './components/common/BadgeModal';
import { ResetModal } from './components/common/ResetModal';
import { InstructorModal } from './components/common/InstructorModal';
import type { UserProgress, MissionId, Badge } from './types';
import { loadProgress, saveProgress, resetProgress } from './utils/storage';
import { BADGES } from './utils/constants';
import { soundFx } from './utils/audio';

export const App: React.FC = () => {
  const [hasBooted, setHasBooted] = useState(false);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [progress, setProgress] = useState<UserProgress>(loadProgress());
  
  // Modals state
  const [activeBadge, setActiveBadge] = useState<{ badge: Badge; xpEarned: number } | null>(null);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isInstructorOpen, setIsInstructorOpen] = useState(false);

  // Sync progress changes to LocalStorage
  useEffect(() => {
    saveProgress(progress);
    soundFx.setEnabled(progress.soundEnabled);
  }, [progress]);

  const handleMissionComplete = (missionId: MissionId | 'blackout' | 'protocol_zero', xpReward: number, badgeId: string) => {
    const isNewCompletion = !progress.completedMissions.includes(missionId as MissionId) && !progress.badges.includes(badgeId);
    
    const targetBadge = BADGES.find(b => b.id === badgeId);

    setProgress(prev => {
      const updatedMissions = (missionId !== 'blackout' && missionId !== 'protocol_zero' && !prev.completedMissions.includes(missionId as MissionId))
        ? [...prev.completedMissions, missionId as MissionId]
        : prev.completedMissions;

      const updatedBadges = !prev.badges.includes(badgeId)
        ? [...prev.badges, badgeId]
        : prev.badges;

      return {
        ...prev,
        xp: isNewCompletion ? prev.xp + xpReward : prev.xp,
        completedMissions: updatedMissions,
        badges: updatedBadges,
        finalChallengeCompleted: missionId === 'blackout' ? true : prev.finalChallengeCompleted,
        protocolZeroCompleted: missionId === 'protocol_zero' ? true : prev.protocolZeroCompleted,
      };
    });

    if (targetBadge) {
      setActiveBadge({ badge: targetBadge, xpEarned: isNewCompletion ? xpReward : 0 });
    }
  };

  const handleNextMission = () => {
    const missionOrder: MissionId[] = ['m1_footprint', 'm2_browser', 'm3_access', 'm4_cipher', 'm5_phishing'];
    const currentIdx = missionOrder.indexOf(currentView as MissionId);
    
    if (currentIdx >= 0 && currentIdx < missionOrder.length - 1) {
      setCurrentView(missionOrder[currentIdx + 1]);
    } else if (currentIdx === missionOrder.length - 1) {
      setCurrentView('blackout');
    } else {
      setCurrentView('dashboard');
    }
    setActiveBadge(null);
  };

  const handleSoundToggle = () => {
    setProgress(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const handleResetConfirm = () => {
    const fresh = resetProgress();
    setProgress(fresh);
    setIsResetOpen(false);
    setCurrentView('dashboard');
  };

  const handleToggleProtocolZero = () => {
    setProgress(prev => ({
      ...prev,
      protocolZeroUnlocked: !prev.protocolZeroUnlocked,
    }));
  };

  const handleUnlockAll = () => {
    setProgress(prev => ({
      ...prev,
      xp: 2500,
      completedMissions: ['m1_footprint', 'm2_browser', 'm3_access', 'm4_cipher', 'm5_phishing'],
      badges: BADGES.map(b => b.id),
      finalChallengeCompleted: true,
      protocolZeroUnlocked: true,
    }));
  };

  const handleGrantXP = (amount: number) => {
    setProgress(prev => ({ ...prev, xp: prev.xp + amount }));
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text relative flex flex-col justify-between selection:bg-cyber-cyan selection:text-black">
      
      {/* Subtle Scanlines Overlay */}
      <div className="fixed inset-0 scanlines opacity-30 pointer-events-none z-30" />

      {/* Boot Sequence for first launch */}
      {!hasBooted && (
        <BootSequence onComplete={() => setHasBooted(true)} />
      )}

      {/* Persistent HUD Navigation Header */}
      <Header
        progress={progress}
        onResetClick={() => setIsResetOpen(true)}
        onSoundToggle={handleSoundToggle}
        onInstructorToggle={() => setIsInstructorOpen(true)}
        onNavigateHome={() => setCurrentView('dashboard')}
        currentView={currentView}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {currentView === 'dashboard' && (
          <Dashboard
            progress={progress}
            onSelectMission={(mid) => setCurrentView(mid)}
            onOpenInstructor={() => setIsInstructorOpen(true)}
          />
        )}

        {currentView === 'm1_footprint' && (
          <InvisibleInternetMission
            onComplete={(xp, bId) => handleMissionComplete('m1_footprint', xp, bId)}
            onBackToDashboard={() => setCurrentView('dashboard')}
            isCompleted={progress.completedMissions.includes('m1_footprint')}
          />
        )}

        {currentView === 'm2_browser' && (
          <BrowserDetectiveMission
            onComplete={(xp, bId) => handleMissionComplete('m2_browser', xp, bId)}
            onBackToDashboard={() => setCurrentView('dashboard')}
            isCompleted={progress.completedMissions.includes('m2_browser')}
          />
        )}

        {currentView === 'm3_access' && (
          <BreakItFixItMission
            onComplete={(xp, bId) => handleMissionComplete('m3_access', xp, bId)}
            onBackToDashboard={() => setCurrentView('dashboard')}
            isCompleted={progress.completedMissions.includes('m3_access')}
          />
        )}

        {currentView === 'm4_cipher' && (
          <CrackTheSecretMission
            onComplete={(xp, bId) => handleMissionComplete('m4_cipher', xp, bId)}
            onBackToDashboard={() => setCurrentView('dashboard')}
            isCompleted={progress.completedMissions.includes('m4_cipher')}
          />
        )}

        {currentView === 'm5_phishing' && (
          <PhishingDetectiveMission
            onComplete={(xp, bId) => handleMissionComplete('m5_phishing', xp, bId)}
            onBackToDashboard={() => setCurrentView('dashboard')}
            isCompleted={progress.completedMissions.includes('m5_phishing')}
          />
        )}

        {currentView === 'blackout' && (
          <OperationBlackout
            onComplete={(xp, bId) => handleMissionComplete('blackout', xp, bId)}
            onBackToDashboard={() => setCurrentView('dashboard')}
            isCompleted={progress.finalChallengeCompleted}
          />
        )}

        {currentView === 'protocol_zero' && (
          <ProtocolZero
            onComplete={(xp, bId) => handleMissionComplete('protocol_zero', xp, bId)}
            onBackToDashboard={() => setCurrentView('dashboard')}
            isCompleted={progress.protocolZeroCompleted}
          />
        )}
      </main>

      {/* Cyber Operations Footer */}
      <footer className="w-full bg-cyber-dark/80 border-t border-slate-900 px-4 py-4 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            CYBERQUEST // 2026 CYBER RANGE SIMULATION &bull; ACM CYBERSECURITY WORKSHOP
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>ISOLATED CLIENT ENVIRONMENT</span>
            <span>&bull;</span>
            <span className="text-cyber-cyan">ZERO EXTERNAL EXPLOITS</span>
          </div>
        </div>
      </footer>

      {/* Badge Award Modal */}
      <BadgeModal
        badge={activeBadge?.badge || null}
        xpEarned={activeBadge?.xpEarned || 0}
        onClose={() => {
          setActiveBadge(null);
          setCurrentView('dashboard');
        }}
        onNextMission={handleNextMission}
        hasNextMission={['m1_footprint', 'm2_browser', 'm3_access', 'm4_cipher'].includes(currentView as MissionId)}
      />

      {/* Reset Confirmation Modal */}
      <ResetModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleResetConfirm}
      />

      {/* Instructor Console Modal */}
      <InstructorModal
        isOpen={isInstructorOpen}
        onClose={() => setIsInstructorOpen(false)}
        protocolZeroUnlocked={progress.protocolZeroUnlocked}
        onToggleProtocolZero={handleToggleProtocolZero}
        onUnlockAllMissions={handleUnlockAll}
        onGrantXP={handleGrantXP}
      />

    </div>
  );
};

export default App;
