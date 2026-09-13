// Web Audio API Sound Synthesizer & High-Fidelity Voice Engine for Paçoca English

class SoundController {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playSuccess() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0, this.ctx!.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.25, this.ctx!.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + idx * 0.08);
        osc.stop(this.ctx!.currentTime + idx * 0.08 + 0.36);
      });
    } catch {}
  }

  playError() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.28);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.32);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 0.33);
    } catch {}
  }

  playClick() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(280, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {}
  }

  playVictory() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const sequence = [
        { f: 523.25, t: 0.0, d: 0.12 },
        { f: 659.25, t: 0.14, d: 0.12 },
        { f: 783.99, t: 0.28, d: 0.14 },
        { f: 1046.5, t: 0.44, d: 0.4 },
      ];

      sequence.forEach((item) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, this.ctx!.currentTime + item.t);

        gain.gain.setValueAtTime(0, this.ctx!.currentTime + item.t);
        gain.gain.linearRampToValueAtTime(0.28, this.ctx!.currentTime + item.t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + item.t + item.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + item.t);
        osc.stop(this.ctx!.currentTime + item.t + item.d + 0.01);
      });
    } catch {}
  }
}

export const sound = new SoundController();

// Voice Management & Preloading
let cachedVoices: SpeechSynthesisVoice[] = [];

const updateVoiceCache = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
};

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  updateVoiceCache();
  window.speechSynthesis.onvoiceschanged = updateVoiceCache;
}

export type PreferredVoiceStyle = 'female-natural' | 'male-british' | 'google-natural';

export function getSavedVoicePreference(): PreferredVoiceStyle {
  if (typeof window === 'undefined') return 'female-natural';
  return (localStorage.getItem('pacoca_voice_style') as PreferredVoiceStyle) || 'female-natural';
}

export function setSavedVoicePreference(style: PreferredVoiceStyle) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('pacoca_voice_style', style);
}

/**
 * Selects a high-quality human/natural voice.
 * BAN the ancient Microsoft David robot voice!
 */
export function selectBestVoice(preference?: PreferredVoiceStyle): SpeechSynthesisVoice | null {
  const voices = cachedVoices.length > 0 ? cachedVoices : (typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : []);
  if (!voices || voices.length === 0) return null;

  // Filter English voices only, AND BAN DAVID!
  const englishVoices = voices.filter(
    (v) => v.lang.startsWith('en') && !v.name.toLowerCase().includes('david')
  );

  if (englishVoices.length === 0) {
    // If only David existed, pick any english voice as absolute last resort
    return voices.find((v) => v.lang.startsWith('en')) || null;
  }

  const pref = preference || getSavedVoicePreference();

  // Option 1: Female Natural (Microsoft Zira or Google US English Female or Jenny)
  if (pref === 'female-natural') {
    const femaleVoice = englishVoices.find(
      (v) =>
        v.name.includes('Zira') ||
        v.name.includes('Jenny') ||
        v.name.includes('Google US English') ||
        v.name.includes('Samantha') ||
        v.name.includes('Aria')
    );
    if (femaleVoice) return femaleVoice;
  }

  // Option 2: British English (Microsoft Daniel or George)
  if (pref === 'male-british') {
    const britishVoice = englishVoices.find(
      (v) =>
        v.name.includes('Daniel') ||
        v.name.includes('George') ||
        v.lang === 'en-GB'
    );
    if (britishVoice) return britishVoice;
  }

  // Option 3: Google US English
  const googleVoice = englishVoices.find((v) => v.name.includes('Google'));
  if (googleVoice) return googleVoice;

  // Option 4: Microsoft Zira (Female)
  const zira = englishVoices.find((v) => v.name.includes('Zira'));
  if (zira) return zira;

  return englishVoices[0];
}

import audioManifest from '../data/audioManifest.json';

let currentAudio: HTMLAudioElement | null = null;

function textToSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Speaks English phrase using Studio AI Neural Voice (Microsoft Edge Neural Aria/Jenny).
 * Falls back to browser synthesis if audio file is not available.
 */
export function speakEnglish(text: string, slow: boolean = false) {
  if (typeof window === 'undefined') return;

  // Stop any currently playing audio or speech
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {}
    currentAudio = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  const cleanText = text.replace(/["'?!.,]/g, '').trim().toLowerCase();
  const slug = textToSlug(text);

  const manifestMap = audioManifest as Record<string, string>;
  const audioUrl = manifestMap[cleanText] || manifestMap[slug] || `/audio/${slug}.mp3`;

  // Try playing the authentic studio AI Neural MP3 first
  const audio = new Audio(audioUrl);
  audio.playbackRate = slow ? 0.75 : 1.0;
  currentAudio = audio;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Audio file not found or couldn't play: Fallback to high-quality browser SpeechSynthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = slow ? 0.75 : 0.95;
        utterance.pitch = 1.05;

        const chosenVoice = selectBestVoice();
        if (chosenVoice) {
          utterance.voice = chosenVoice;
        }
        window.speechSynthesis.speak(utterance);
      }
    });
  }
}

