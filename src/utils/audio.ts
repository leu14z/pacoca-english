// Web Audio API Sound Synthesizer & High-Fidelity Voice Engine for Paçoca English
import audioManifest from '../data/audioManifest.json';

class SoundController {
  public ctx: AudioContext | null = null;

  public initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Unlock Web Audio & Speech on mobile iOS / Android upon first tap
   */
  public unlockMobileAudio() {
    this.initCtx();
    if (this.ctx) {
      try {
        if (this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        // Play silent 1-sample buffer to unlock hardware audio routing
        const buffer = this.ctx.createBuffer(1, 1, 22050);
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.ctx.destination);
        source.start(0);
      } catch {}
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
      } catch {}
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

// Automatically listen for first user touch / click to unlock mobile audio pipeline
if (typeof window !== 'undefined') {
  const handleFirstInteraction = () => {
    sound.unlockMobileAudio();
    window.removeEventListener('touchstart', handleFirstInteraction);
    window.removeEventListener('touchend', handleFirstInteraction);
    window.removeEventListener('click', handleFirstInteraction);
  };
  window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
  window.addEventListener('touchend', handleFirstInteraction, { passive: true });
  window.addEventListener('click', handleFirstInteraction, { passive: true });
}

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
 */
export function selectBestVoice(preference?: PreferredVoiceStyle): SpeechSynthesisVoice | null {
  const voices =
    cachedVoices.length > 0
      ? cachedVoices
      : typeof window !== 'undefined' && 'speechSynthesis' in window
      ? window.speechSynthesis.getVoices()
      : [];
  if (!voices || voices.length === 0) return null;

  const englishVoices = voices.filter(
    (v) => v.lang.startsWith('en') && !v.name.toLowerCase().includes('david')
  );

  if (englishVoices.length === 0) {
    return voices.find((v) => v.lang.startsWith('en')) || null;
  }

  const pref = preference || getSavedVoicePreference();

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

  if (pref === 'male-british') {
    const britishVoice = englishVoices.find(
      (v) => v.name.includes('Daniel') || v.name.includes('George') || v.lang === 'en-GB'
    );
    if (britishVoice) return britishVoice;
  }

  const googleVoice = englishVoices.find((v) => v.name.includes('Google'));
  if (googleVoice) return googleVoice;

  const zira = englishVoices.find((v) => v.name.includes('Zira'));
  if (zira) return zira;

  return englishVoices[0];
}

let currentAudio: HTMLAudioElement | null = null;

function textToSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Helper to resolve audio file path properly on both localhost and subpath hosting (GitHub Pages)
 */
function resolveAudioUrl(filePath: string): string {
  const clean = filePath.replace(/^\//, '');
  const base = import.meta.env.BASE_URL || './';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${clean}`;
}

/**
 * Fallback SpeechSynthesis runner with mobile wake-up
 */
function fallbackSpeech(text: string, slow: boolean = false) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = slow ? 0.75 : 0.95;
    utterance.pitch = 1.05;

    const chosenVoice = selectBestVoice();
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis exception:', e);
  }
}

/**
 * Speaks English phrase using Studio AI Neural Voice (Microsoft Edge Neural Aria/Jenny).
 * Correctly resolves relative paths on GitHub Pages and unlocks mobile audio.
 */
export function speakEnglish(text: string, slow: boolean = false) {
  if (typeof window === 'undefined') return;

  // Unlock mobile audio context
  sound.unlockMobileAudio();

  // Stop previous playback
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
  const rawPath = manifestMap[cleanText] || manifestMap[slug];

  if (rawPath) {
    const fullAudioUrl = resolveAudioUrl(rawPath);
    const audio = new Audio(fullAudioUrl);
    audio.playbackRate = slow ? 0.75 : 1.0;
    currentAudio = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Audio play error, falling back to speech synthesis:', err);
        fallbackSpeech(text, slow);
      });
    }
  } else {
    // If not found in MP3 manifest, speak synchronously using browser synthesis
    fallbackSpeech(text, slow);
  }
}
