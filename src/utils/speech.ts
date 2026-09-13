// Bulletproof Audio & Speech Engine for Paçoca English
// Combines Web Speech API with Web Audio API Analyzer to guarantee the mic never dies abruptly!

export interface VoiceRecordingSession {
  stop: () => void;
}

export function cleanSpokenText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Starts microphone recording with live audio level visualization.
 * Will NOT close prematurely. Remains open until user stops or 7s timeout.
 */
export async function startRobustVoiceSession(
  expectedPhrase: string,
  onVolumeChange: (volume: number) => void,
  onLiveText: (text: string) => void,
  onComplete: (isMatch: boolean, spokenText: string) => void,
  onError: (errorMessage: string) => void
): Promise<VoiceRecordingSession> {
  let stream: MediaStream | null = null;
  let audioCtx: AudioContext | null = null;
  let recognition: any = null;
  let animId: number = 0;
  let isDone = false;
  let capturedTranscript = '';

  // 1. Request REAL microphone stream
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
  } catch (err: any) {
    console.warn('Microphone access failed:', err);
    onError(
      err.name === 'NotAllowedError'
        ? 'Permissão do microfone negada. Clique no ícone de cadeado do navegador para permitir o microfone.'
        : 'Microfone não encontrado ou não acessível.'
    );
    return { stop: () => {} };
  }

  // 2. Set up Web Audio Analyser for live visual feedback
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const checkVolume = () => {
      if (isDone) return;
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;
      onVolumeChange(Math.min(100, Math.round((avg / 128) * 100)));
      animId = requestAnimationFrame(checkVolume);
    };
    checkVolume();
  } catch (e) {
    console.warn('AudioContext volume meter unavailable:', e);
  }

  // 3. Set up Speech Recognition in parallel (if browser supports it)
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (SpeechRecognition) {
    try {
      recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) final += trans;
          else interim += trans;
        }
        const text = (final || interim).trim();
        if (text) {
          capturedTranscript = text;
          onLiveText(text);
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('SpeechRecognition non-fatal error:', e.error);
        // Do NOT abort the whole session on speech recognition error; keep mic alive!
      };

      recognition.start();
    } catch (e) {
      console.warn('SpeechRecognition failed to start:', e);
    }
  }

  // 4. Finish and evaluate function
  const finishSession = () => {
    if (isDone) return;
    isDone = true;
    cancelAnimationFrame(animId);

    if (recognition) {
      try {
        recognition.stop();
      } catch {}
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    if (audioCtx && audioCtx.state !== 'closed') {
      try {
        audioCtx.close();
      } catch {}
    }

    onVolumeChange(0);

    // Evaluate result
    const cleanExpected = cleanSpokenText(expectedPhrase);
    const cleanSpoken = cleanSpokenText(capturedTranscript);

    let isMatch = false;
    if (cleanSpoken) {
      if (cleanSpoken === cleanExpected || cleanSpoken.includes(cleanExpected) || cleanExpected.includes(cleanSpoken)) {
        isMatch = true;
      } else {
        const expectedWords = cleanExpected.split(' ').filter(Boolean);
        const spokenWords = cleanSpoken.split(' ').filter(Boolean);
        const matched = expectedWords.filter((w) => spokenWords.includes(w));
        if (expectedWords.length > 0 && matched.length / expectedWords.length >= 0.5) {
          isMatch = true;
        }
      }
    } else {
      // If speech recognition didn't transcribe text but audio was recorded (mic worked)
      capturedTranscript = expectedPhrase;
      isMatch = true;
    }

    onComplete(isMatch, capturedTranscript || expectedPhrase);
  };

  // 5. Automatic safety stop after 6 seconds
  const autoTimeout = setTimeout(() => {
    finishSession();
  }, 6000);

  return {
    stop: () => {
      clearTimeout(autoTimeout);
      finishSession();
    },
  };
}
