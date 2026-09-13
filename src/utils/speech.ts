// Browser Speech Recognition & Audio Input Helper with Permission Handling

export interface SpeechRecognitionResult {
  transcript: string;
  isMatch: boolean;
  confidence: number;
}

// Clean and normalize strings for robust accent/speech matching
export function cleanSpokenText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Check if browser supports Speech Recognition
export function isSpeechSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  );
}

// Request explicit microphone permissions
export async function requestMicrophonePermission(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return false;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Stop tracks immediately after getting permission
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch (err) {
    console.warn('Microphone permission denied or not available:', err);
    return false;
  }
}

// Start listening and compare with expected phrase
export function listenForPhrase(
  expectedPhrase: string,
  onStatusChange: (status: 'listening' | 'processing' | 'error' | 'done', message?: string) => void,
  onResult: (result: SpeechRecognitionResult) => void
): () => void {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onStatusChange('error', 'Seu navegador não suporta reconhecimento de voz nativo.');
    return () => {};
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;

  let hasEnded = false;

  recognition.onstart = () => {
    onStatusChange('listening');
  };

  recognition.onresult = (event: any) => {
    hasEnded = true;
    onStatusChange('processing');

    const results = event.results[0];
    let bestTranscript = results[0]?.transcript || '';
    let highestConfidence = results[0]?.confidence || 0;

    const cleanExpected = cleanSpokenText(expectedPhrase);
    let isMatch = false;

    // Check all alternatives
    for (let i = 0; i < results.length; i++) {
      const alt = cleanSpokenText(results[i].transcript);
      if (alt === cleanExpected || alt.includes(cleanExpected) || cleanExpected.includes(alt)) {
        isMatch = true;
        bestTranscript = results[i].transcript;
        highestConfidence = results[i].confidence || 0.9;
        break;
      }
    }

    // Levenshtein / loose tolerance check: if 70% of words match
    if (!isMatch) {
      const expectedWords = cleanExpected.split(' ');
      const spokenWords = cleanSpokenText(bestTranscript).split(' ');
      const matchedWords = expectedWords.filter((w) => spokenWords.includes(w));
      if (matchedWords.length / expectedWords.length >= 0.6) {
        isMatch = true;
      }
    }

    onStatusChange('done');
    onResult({
      transcript: bestTranscript,
      isMatch,
      confidence: highestConfidence,
    });
  };

  recognition.onerror = (event: any) => {
    if (hasEnded) return;
    console.warn('Speech recognition error:', event.error);
    if (event.error === 'not-allowed') {
      onStatusChange('error', 'Permissão do microfone negada. Clique no ícone de cadeado do navegador para permitir o microfone.');
    } else if (event.error === 'no-speech') {
      onStatusChange('error', 'Nenhum som detectado. Tente falar um pouco mais perto do microfone.');
    } else {
      onStatusChange('error', `Erro ao ouvir (${event.error}). Tente novamente.`);
    }
  };

  recognition.onend = () => {
    if (!hasEnded) {
      onStatusChange('done');
    }
  };

  try {
    recognition.start();
  } catch (err) {
    onStatusChange('error', 'Não foi possível iniciar o microfone.');
  }

  // Return abort / stop function
  return () => {
    try {
      recognition.abort();
    } catch {
      // ignore
    }
  };
}
