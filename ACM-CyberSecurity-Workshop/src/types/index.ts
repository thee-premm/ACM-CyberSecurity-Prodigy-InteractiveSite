export type MissionId = 'm1_footprint' | 'm2_browser' | 'm3_access' | 'm4_cipher' | 'm5_phishing';

export interface Badge {
  id: string;
  missionId: MissionId | 'blackout' | 'protocol_zero';
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
}

export interface UserProgress {
  xp: number;
  completedMissions: MissionId[];
  badges: string[]; // badge IDs
  finalChallengeCompleted: boolean;
  protocolZeroCompleted: boolean;
  protocolZeroUnlocked: boolean;
  discoveredClues: string[];
  missionScores: Record<string, number>;
  soundEnabled: boolean;
}

export interface MissionMeta {
  id: MissionId;
  number: string;
  title: string;
  tagline: string;
  concept: string;
  estimatedDuration: string;
  difficulty: 'RECRUIT' | 'OPERATIVE' | 'VETERAN' | 'SPECIALIST';
  badgeTitle: string;
  badgeDesc: string;
  icon: string;
  xpReward: number;
  narrativeBriefing: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'danger' | 'system';
  message: string;
}

export interface SocialClue {
  id: string;
  targetType: 'post' | 'photo' | 'timestamp' | 'location' | 'comment';
  title: string;
  detail: string;
  riskCategory: 'Location' | 'Schedule' | 'Identity' | 'Event';
  found: boolean;
}

export interface NetworkLogItem {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  status: number;
  statusText: string;
  timestamp: string;
  requestHeaders: Record<string, string>;
  requestBody?: any;
  responseHeaders: Record<string, string>;
  responseBody: any;
  hasVulnerability?: boolean;
}

export interface PhishingMessage {
  id: string;
  senderName: string;
  senderHandle: string;
  senderEmailOrPhone: string;
  avatar: string;
  timestamp: string;
  subject?: string;
  body: string;
  linkUrl?: string;
  hasAttachment?: boolean;
  isPhishing: boolean;
  redFlags: string[];
  explanation: string;
  technique: string;
  verifiedSenderInfo?: string;
}
