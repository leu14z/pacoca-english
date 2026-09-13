// Robust Speech Recognition & Microphone Utility for Paçoca English

export interface SpeechRecognitionResult {
  transcript: string;
  isMatch: boolean;
  confidence: number;
}

export function cleanSpokenText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isSpeechSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  );
}

/**
 * Start listening without abruptly killing audio tracks.
 * Uses continuous mode and interim results to ensure the browser doesn't close prematurely.
 */
export function listenForPhrase(
  expectedPhrase: string,
  onInterimText: (text: string) => void,
  onStatusChange: (status: 'listening' | 'processing' | 'error' | 'done', message?: string) => void,
  onResult: (result: SpeechRecognitionResult) => void
): () => void {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onStatusChange('error', 'Seu navegador não suporta reconhecimento de voz direto.');
    return () => {};
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = true;       // Keep alive while speaking!
  recognition.interimResults = true;   // Show live speech!
  recognition.maxAlternatives = 3;

  let stoppedManually = false;
  let hasMatched = false;
  let finalResultSent = false;
  let speechTimeout: any = null;

  const checkMatch = (spoken: string) => {
    const cleanExpected = cleanSpokenText(expectedPhrase);
    const cleanSpoken = cleanSpokenText(spoken);

    if (cleanSpoken === cleanExpected || cleanSpoken.includes(cleanExpected) || cleanExpected.includes(cleanSpoken)) {
      return true;
    }

    // Keyword match tolerance: 60% of expected words present
    const expectedWords = cleanExpected.split(' ').filter(Boolean);
    const spokenWords = cleanSpoken.split(' ').filter(Boolean);
    const matches = expectedWords.filter((w) => spokenWords.includes(w));
    if (expectedWords.length > 0 && matches.length / expectedWords.length >= 0.6) {
      return true;
    }

    return false;
  };

  recognition.onstart = () => {
    onStatusChange('listening');
    // Safety auto-stop after 10 seconds if nothing spoken
    speechTimeout = setTimeout(() => {
      if (!stoppedManually && !hasMatched) {
        try {
          recognition.stop();
        } catch {}
      }
    }, 10000);
  };

  recognition.onresult = (event: any) => {
    let currentInterim = '';
    let currentFinal = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const trans = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        currentFinal += trans;
      } else {
        currentInterim += trans;
      }
    }

    const liveText = (currentFinal || currentInterim).trim();
    if (liveText) {
      onInterimText(liveText);

      // Check if match achieved live
      if (checkMatch(liveText) && !hasMatched) {
        hasMatched = true;
        finalResultSent = true;
        clearTimeout(speechTimeout);
        try {
          recognition.stop();
        } catch {}
        onStatusChange('done');
        onResult({
          transcript: liveText,
          isMatch: true,
          confidence: 0.95,
        });
      }
    }
  };

  recognition.onerror = (event: any) => {
    console.warn('Speech recognition event error:', event.error);
    clearTimeout(speechTimeout);
    if (event.error === 'not-allowed') {
      onStatusChange('error', 'Permissão de microfone negada. Clique no ícone de cadeado na barra de endereço do navegador e permita o microfone.');
    } else if (event.error === 'no-speech') {
      onStatusChange('error', 'Nenhuma fala detectada. Toque no microfone e fale com firmeza.');
    } else if (event.error !== 'aborted') {
      onStatusChange('error', `Aviso de áudio: ${event.error}. Tente novamente.`);
    }
  };

  recognition.onend = () => {
    clearTimeout(speechTimeout);
    if (!finalResultSent && !stoppedManually) {
      onStatusChange('done');
    }
  };

  try {
    recognition.start();
  } catch (err) {
    console.warn('Recognition start exception:', err);
    onStatusChange('error', 'Não foi possível iniciar o microfone no momento.');
  }

  // Abort / Stop function
  return () => {
    stoppedManually = true;
    clearTimeout(speechTimeout);
    try {
      recognition.abort();
    } catch {}
  };
}
