// Web Audio API Sound Synthesizer & High-Quality AI Voice Engine for Paçoca English

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

  // Duolingo-style crisp success chord (C5 -> E5 -> G5 -> C6 chime)
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
    } catch {
      // ignore
    }
  }

  // Friendly soft error bonk
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
    } catch {
      // ignore
    }
  }

  // Gentle UI tap / word select sound
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
    } catch {
      // ignore
    }
  }

  // Triumphant Fanfare for lesson complete
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
    } catch {
      // ignore
    }
  }
}

export const sound = new SoundController();

// Preload and Cache Available Voices to avoid the empty array bug on page load
let cachedVoices: SpeechSynthesisVoice[] = [];

const loadVoices = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
};

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
}

/**
 * Finds the highest quality Natural / Neural / AI human voice available in the browser.
 * Filters out legacy robotic voices like Microsoft David.
 */
export function getBestNaturalVoice(): SpeechSynthesisVoice | null {
  const voices = cachedVoices.length > 0 ? cachedVoices : (typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : []);
  if (!voices || voices.length === 0) return null;

  const englishVoices = voices.filter((v) => v.lang.startsWith('en'));
  if (englishVoices.length === 0) return null;

  // 1. Highest priority: Microsoft Natural / Azure Neural AI Voices (Jenny, Aria, Guy, Ryan, Sonia)
  const naturalVoices = englishVoices.filter(
    (v) =>
      v.name.includes('Natural') ||
      v.name.includes('Online (Natural)') ||
      v.name.includes('Neural') ||
      v.name.includes('Jenny') ||
      v.name.includes('Aria') ||
      v.name.includes('Guy')
  );
  if (naturalVoices.length > 0) {
    return naturalVoices[0];
  }

  // 2. Google High Quality US/UK English
  const googleVoices = englishVoices.filter((v) => v.name.includes('Google') && (v.lang === 'en-US' || v.lang === 'en-GB'));
  if (googleVoices.length > 0) {
    return googleVoices[0];
  }

  // 3. Apple High Quality voices (Samantha, Daniel, Victoria, Ava)
  const appleVoices = englishVoices.filter(
    (v) => v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Ava')
  );
  if (appleVoices.length > 0) {
    return appleVoices[0];
  }

  // 4. Any en-US voice that is not the ancient 'David'
  const nonDavid = englishVoices.filter((v) => v.lang === 'en-US' && !v.name.includes('David'));
  if (nonDavid.length > 0) return nonDavid[0];

  return englishVoices[0];
}

/**
 * Text to Speech with Natural Human/AI Voice Engine
 */
export function speakEnglish(text: string, slow: boolean = false) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  window.speechSynthesis.cancel(); // Stop any pending audio

  const cleanText = text.replace(/["'?!.,]/g, '').trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'en-US';
  utterance.rate = slow ? 0.72 : 0.96;
  utterance.pitch = 1.0;

  const bestVoice = getBestNaturalVoice();
  if (bestVoice) {
    utterance.voice = bestVoice;
  }

  window.speechSynthesis.speak(utterance);
}
