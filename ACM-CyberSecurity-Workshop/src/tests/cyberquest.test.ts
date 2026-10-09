import { describe, it, expect } from 'vitest';
import { calculateRank } from '../utils/storage';
import { MISSIONS, BADGES } from '../utils/constants';

describe('CYBERQUEST Core Logic & Mission Verifications', () => {
  
  // Test 1: Caesar Cipher Mathematical Transformation
  describe('Mission 04: Cryptography & Caesar Cipher Transformations', () => {
    const transformText = (text: string, shiftVal: number, opMode: 'encrypt' | 'decrypt'): string => {
      const effectiveShift = opMode === 'encrypt' ? shiftVal : (26 - (shiftVal % 26)) % 26;
      return text.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 + effectiveShift) % 26) + 65);
        }
        if (code >= 97 && code <= 122) {
          return String.fromCharCode(((code - 97 + effectiveShift) % 26) + 97);
        }
        return char;
      }).join('');
    };

    it('decrypts "KHOOR" to "HELLO" using Key=3', () => {
      const decrypted = transformText('KHOOR', 3, 'decrypt');
      expect(decrypted).toBe('HELLO');
    });

    it('encrypts "HELLO" to "KHOOR" using Key=3', () => {
      const encrypted = transformText('HELLO', 3, 'encrypt');
      expect(encrypted).toBe('KHOOR');
    });

    it('decrypts "SURMHFW EODFNRXW" to "PROJECT BLACKOUT" using Key=3', () => {
      const decrypted = transformText('SURMHFW EODFNRXW', 3, 'decrypt');
      expect(decrypted).toBe('PROJECT BLACKOUT');
    });

    it('preserves casing, punctuation, and whitespace correctly', () => {
      const input = 'CyberQuest: Defend The System! (2026)';
      const encrypted = transformText(input, 5, 'encrypt');
      const decrypted = transformText(encrypted, 5, 'decrypt');
      expect(decrypted).toBe(input);
    });

    it('handles wrap-around across all 26 shift values', () => {
      for (let s = 0; s < 26; s++) {
        const enc = transformText('AZaz', s, 'encrypt');
        const dec = transformText(enc, s, 'decrypt');
        expect(dec).toBe('AZaz');
      }
    });
  });

  // Test 2: Access Control & Authorization (IDOR) Logic
  describe('Mission 03: Authentication vs Authorization (IDOR)', () => {
    const simulateAccessControl = (
      authenticatedUserId: string,
      requestedResourceId: string,
      isAuthzRuleActive: boolean
    ) => {
      if (!isAuthzRuleActive) {
        // Vulnerable mode: Always returns 200 OK regardless of who is authenticated
        return { status: 200, access: 'GRANTED_VULNERABLE' };
      }

      // Secure mode: Must verify ownership
      if (authenticatedUserId === requestedResourceId) {
        return { status: 200, access: 'GRANTED_AUTHORIZED' };
      }

      return { status: 403, access: 'BLOCKED_FORBIDDEN' };
    };

    it('demonstrates vulnerability when Alex accesses Sam in flawed mode (200 OK)', () => {
      const response = simulateAccessControl('usr_1042', 'usr_2099', false);
      expect(response.status).toBe(200);
      expect(response.access).toBe('GRANTED_VULNERABLE');
    });

    it('enforces 403 Forbidden when Alex attempts to access Sam in secure mode', () => {
      const response = simulateAccessControl('usr_1042', 'usr_2099', true);
      expect(response.status).toBe(403);
      expect(response.access).toBe('BLOCKED_FORBIDDEN');
    });

    it('allows Alex to view their own record in secure mode (200 OK)', () => {
      const response = simulateAccessControl('usr_1042', 'usr_1042', true);
      expect(response.status).toBe(200);
      expect(response.access).toBe('GRANTED_AUTHORIZED');
    });
  });

  // Test 3: Exposure Risk Calculation (Mission 01)
  describe('Mission 01: Digital Footprint Exposure Scrubber', () => {
    const calculateExposure = (settings: {
      stripGeoTags: boolean;
      privateAudience: boolean;
      blurIdentityMarkers: boolean;
      sanitizeComments: boolean;
    }) => {
      let score = 90;
      if (settings.stripGeoTags) score -= 25;
      if (settings.privateAudience) score -= 30;
      if (settings.blurIdentityMarkers) score -= 20;
      if (settings.sanitizeComments) score -= 15;
      return score;
    };

    it('starts with high initial exposure (90%)', () => {
      const initial = calculateExposure({
        stripGeoTags: false,
        privateAudience: false,
        blurIdentityMarkers: false,
        sanitizeComments: false,
      });
      expect(initial).toBe(90);
    });

    it('drops exposure to 0% when all privacy defenses are enabled', () => {
      const hardened = calculateExposure({
        stripGeoTags: true,
        privateAudience: true,
        blurIdentityMarkers: true,
        sanitizeComments: true,
      });
      expect(hardened).toBe(0);
    });
  });

  // Test 4: XP & Rank Progression System
  describe('Gamification: XP & Operative Ranking', () => {
    it('accurately ranks recruits at initial XP', () => {
      const rankInfo = calculateRank(0);
      expect(rankInfo.rank).toBe('CYBER RECRUIT');
      expect(rankInfo.level).toBe(1);
    });

    it('progresses to Field Agent after first completed mission', () => {
      const rankInfo = calculateRank(350);
      expect(rankInfo.rank).toBe('FIELD AGENT');
      expect(rankInfo.level).toBe(2);
    });

    it('reaches CYBERQUEST MASTER at 2500+ XP', () => {
      const rankInfo = calculateRank(2600);
      expect(rankInfo.rank).toBe('CYBERQUEST MASTER');
      expect(rankInfo.level).toBe(6);
    });
  });

  // Test 5: Metadata Integrity
  describe('Mission & Badge Registry Integrity', () => {
    it('contains all 5 primary missions plus bonus operations', () => {
      expect(MISSIONS).toHaveLength(5);
      const missionIds = MISSIONS.map(m => m.id);
      expect(missionIds).toContain('m1_footprint');
      expect(missionIds).toContain('m2_browser');
      expect(missionIds).toContain('m3_access');
      expect(missionIds).toContain('m4_cipher');
      expect(missionIds).toContain('m5_phishing');
    });

    it('has valid badges configured for all missions', () => {
      expect(BADGES.length).toBeGreaterThanOrEqual(7);
      const badgeIds = BADGES.map(b => b.id);
      expect(badgeIds).toContain('badge_m1');
      expect(badgeIds).toContain('badge_m2');
      expect(badgeIds).toContain('badge_m3');
      expect(badgeIds).toContain('badge_m4');
      expect(badgeIds).toContain('badge_m5');
      expect(badgeIds).toContain('badge_blackout');
      expect(badgeIds).toContain('badge_protocol_zero');
    });
  });
});
