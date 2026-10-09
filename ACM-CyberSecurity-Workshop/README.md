# CYBERQUEST // CYBERSECURITY OPERATIONS HUB

> **Tagline:** *TRACE THE SIGNAL. BREAK THE PATTERN. DEFEND THE SYSTEM.*

CYBERQUEST is an immersive cyberpunk-themed cybersecurity operations simulator and interactive learning platform built for school students and junior operatives. Rather than passively reading about cybersecurity, students enter a futuristic cyber operations room, intercept live payloads, analyze digital footprints, break flawed access controls, decode ciphers, and outsmart social engineers.

---

## ⚡ Highlights & Key Features

- **Futuristic Cyberpunk Aesthetic:** Deep midnight blue surfaces, neon cyan and magenta HUD overlays, angular polygon cutouts, subtle scanlines, and real-time reactive telemetry logs.
- **Client-Side Audio Synthesizer:** 100% offline Web Audio API sound generator delivering authentic terminal keystrokes, radar scans, access-granted fanfares, security buzzes, and glitch effects (with mute toggle).
- **5 Full Interactive Missions:**
  1. **Mission 01: The Invisible Internet** — Digital footprints, metadata extraction (EXIF, geo-tags, recurring timestamps, social comments), inference pinboard, and Privacy Defender mode with exposure risk scoring.
  2. **Mission 02: Eavesdrop on Your Browser** — Client-server HTTP traffic sniffer, JSON payload analysis, discovery of unredacted recovery PINs in API responses, and live backend DTO patch verification.
  3. **Mission 03: Break It. Fix It.** — Insecure Direct Object References (IDOR) & Broken Access Control in a school portal. Exploit flawed cross-user record reading (200 OK) then enforce server-side authorization (403 Forbidden).
  4. **Mission 04: Crack the Secret** — Cryptography terminal with dynamic shift slider, dual alphabet transformation wheel, sample radio intercepts (`KHOOR` ➔ `HELLO`), custom message encryptor/decryptor, and brute-force keyspace matrix.
  5. **Mission 05: Outsmart the Human Hacker** — Cyber mobile phone inbox with 5 realistic messages (gaming account suspension threat, classmate chat, OTP scholarship trap, IT maintenance notice, package fee smishing), sender header inspection, and evidence-based decision feedback.
- **Final Master Challenge (Operation Blackout):** A combined multi-vector incident response room connecting all 5 concepts to assemble a chronological kill chain and deploy countermeasures.
- **Classroom Instructor Console (Protocol Zero):** A built-in presentation control panel allowing instructors to trigger room-wide alerts, reveal the classified 6th bonus mission (`PROTO-000`), or adjust XP.
- **Gamification & Persistence:** Level & Clearance progression, XP tallying, 7 distinct neon badges with confetti celebration modals, and persistent state backed by `localStorage` with confirmation reset.

---

## 🛠️ Technology Stack

- **Framework:** React 19 + TypeScript
- **Bundler & Dev Server:** Vite 8
- **Styling:** Tailwind CSS + Custom Neon Cyberpunk Design Tokens + Scanline Shader
- **Icons:** Lucide React
- **Audio Engine:** Pure Web Audio API Sound Synthesizer (Zero external audio files required)
- **Effects:** Canvas-Confetti for badge award celebrations
- **Test Runner:** Vitest + Testing Library

---

## 🚀 Getting Started

### 1. Installation

Clone or open the repository, then install dependencies:

```bash
npm install
```

### 2. Run the Development Server

Start the local CyberQuest operations center:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Automated Tests

Execute the Vitest suite verifying cryptography transformations, IDOR access control enforcement, footprint exposure calculation, and ranking logic:

```bash
npm test
```

### 4. Build for Production

Compile optimized static production bundles:

```bash
npm run build
```

---

## 🎮 Instructor & Workshop Guide

During live classroom workshops:
- Click the **⚡ Zap Icon** in the top navigation bar to open the **Instructor Operations Console**.
- Enter activation keycode **`PROTO-000`** (or click **REVEAL**) to trigger the **Protocol Zero** classroom bonus incident.
- Use **Demo Accelerator: Unlock All Missions** to quickly navigate through any stage of the curriculum during demonstrations.
