// Accurate Speech Recognition & Audio Evaluation Engine for Paçoca English

export interface SpeechEvaluationResult {
  transcript: string;
  isMatch: boolean;
  score: number; // 0 - 100%
  feedback: string;
}

export function cleanSpokenText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshteinDistance(s1: string, s2: string): number {
  const len1 = s1.length;
  const len2 = s2.length;
  const d: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    d[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    d[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,      // deletion
        d[i][j - 1] + 1,      // insertion
        d[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return d[len1][len2];
}

/**
 * Strict evaluation between expected phrase and what user actually spoke.
 * Rejects silence, random words, partial words, or gibberish.
 */
export function evaluateSpokenMatch(expectedPhrase: string, spokenText: string): { isMatch: boolean; score: number; feedback: string } {
  const cleanExpected = cleanSpokenText(expectedPhrase);
  const cleanSpoken = cleanSpokenText(spokenText);

  if (!cleanSpoken || cleanSpoken.length < 2) {
    return {
      isMatch: false,
      score: 0,
      feedback: 'Nenhuma fala audível detectada. Toque no microfone e pronuncie com clareza.',
    };
  }

  // Exact match
  if (cleanSpoken === cleanExpected) {
    return { isMatch: true, score: 100, feedback: `Pronúncia perfeita! Você disse exatamente "${expectedPhrase}".` };
  }

  const expectedWords = cleanExpected.split(' ').filter(Boolean);
  const spokenWords = cleanSpoken.split(' ').filter(Boolean);

  // If user said far too few words (e.g. 1 word when expected 4)
  if (spokenWords.length === 0) {
    return {
      isMatch: false,
      score: 0,
      feedback: `Você não disse a frase esperada. Tente falar "${expectedPhrase}".`,
    };
  }

  // Strict word-by-word evaluation using Levenshtein distance
  let matchedWordScores: number[] = [];
  const usedSpokenIndices = new Set<number>();

  for (const exp of expectedWords) {
    let bestScore = 0;
    let bestIdx = -1;

    for (let i = 0; i < spokenWords.length; i++) {
      if (usedSpokenIndices.has(i)) continue;
      const spk = spokenWords[i];

      if (spk === exp) {
        bestScore = 1.0;
        bestIdx = i;
        break;
      }

      // Allow 1 typo for words of length >= 4, or 2 typos for words of length >= 7
      const dist = levenshteinDistance(exp, spk);
      const maxAllowedDist = exp.length >= 7 ? 2 : exp.length >= 4 ? 1 : 0;

      if (dist <= maxAllowedDist) {
        const similarity = 1 - (dist / Math.max(exp.length, spk.length));
        if (similarity > bestScore) {
          bestScore = similarity;
          bestIdx = i;
        }
      }
    }

    if (bestIdx >= 0 && bestScore >= 0.75) {
      usedSpokenIndices.add(bestIdx);
      matchedWordScores.push(bestScore);
    } else {
      matchedWordScores.push(0);
    }
  }

  const totalMatchedScore = matchedWordScores.reduce((acc, s) => acc + s, 0);
  const recall = totalMatchedScore / expectedWords.length;
  const precision = totalMatchedScore / spokenWords.length;

  // Harmonic mean (F1 score)
  const f1 = (precision + recall > 0) ? (2 * precision * recall) / (precision + recall) : 0;
  const finalScore = Math.round(f1 * 100);

  // Stricter threshold: must have matched at least 70% of expected words AND not babble unrelated words
  if (finalScore >= 70 && recall >= 0.70) {
    return {
      isMatch: true,
      score: finalScore,
      feedback: `Muito bom! Compreendido: "${spokenText}" (${finalScore}% de precisão).`,
    };
  }

  // Incorrect pronunciation or wrong phrase
  return {
    isMatch: false,
    score: finalScore,
    feedback: `Você disse "${spokenText}", mas a frase correta é "${expectedPhrase}".`,
  };
}

export interface SpeechSession {
  stop: () => void;
}

/**
 * Starts Web Speech recognition with continuous listening.
 * NEVER emits a failing onResult on silence or microphone errors (never causes accidental heart loss).
 */
export function startAccurateSpeechRecognition(
  expectedPhrase: string,
  onInterimText: (text: string) => void,
  onStatusChange: (status: 'listening' | 'evaluating' | 'error' | 'no-speech' | 'done', message?: string) => void,
  onResult: (result: SpeechEvaluationResult) => void
): SpeechSession {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onStatusChange('error', 'Seu navegador não suporta reconhecimento de voz direto.');
    return { stop: () => {} };
  }

  let recognition: any = null;
  let finalTranscript = '';
  let stoppedManually = false;
  let hasTranscribedSpeech = false;
  let resultEmitted = false;
  let autoSilenceTimeout: any = null;

  try {
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    // Continuous = true keeps the mic alive so it doesn't immediately drop out on brief silence!
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      onStatusChange('listening');

      // Safety timeout: if after 8 seconds no speech at all was captured, stop gracefully without penalty
      autoSilenceTimeout = setTimeout(() => {
        if (!hasTranscribedSpeech && !stoppedManually) {
          stoppedManually = true;
          try {
            recognition.stop();
          } catch {}
          onStatusChange('no-speech', 'Nenhum som detectado. Toque no microfone e tente falar novamente.');
        }
      }, 8000);
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const trans = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += ' ' + trans;
        } else {
          interim += trans;
        }
      }

      const currentText = (finalTranscript + ' ' + interim).trim();
      if (currentText) {
        hasTranscribedSpeech = true;
        onInterimText(currentText);

        // If user spoke the phrase, evaluate automatically after a short pause!
        const evalCheck = evaluateSpokenMatch(expectedPhrase, currentText);
        if (evalCheck.isMatch && !resultEmitted) {
          resultEmitted = true;
          stoppedManually = true;
          try {
            recognition.stop();
          } catch {}
          clearTimeout(autoSilenceTimeout);
          onStatusChange('done');
          onResult({
            transcript: currentText,
            isMatch: true,
            score: evalCheck.score,
            feedback: evalCheck.feedback,
          });
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition notice:', event.error);
      clearTimeout(autoSilenceTimeout);

      if (event.error === 'no-speech') {
        // Just silence: do not emit failure or take hearts!
        onStatusChange('no-speech', 'Nenhum som de voz detectado. Fale com firmeza perto do microfone.');
      } else if (event.error === 'not-allowed') {
        onStatusChange('error', 'Permissão do microfone bloqueada no navegador. Clique no cadeado na barra de endereços para permitir.');
      } else if (event.error !== 'aborted') {
        onStatusChange('error', `Aviso do microfone: ${event.error}. Toque para tentar novamente.`);
      }
    };

    recognition.onend = () => {
      clearTimeout(autoSilenceTimeout);
      if (resultEmitted) return;

      const trimmed = finalTranscript.trim();
      if (!trimmed) {
        // No speech was detected: DO NOT PENALIZE THE USER!
        onStatusChange('no-speech', 'Não ouvimos nenhum som. Toque no microfone e pronuncie a frase!');
        return;
      }

      // Actual speech was captured: Evaluate rigorously
      resultEmitted = true;
      onStatusChange('evaluating');
      const evaluation = evaluateSpokenMatch(expectedPhrase, trimmed);
      onStatusChange('done');
      onResult({
        transcript: trimmed,
        isMatch: evaluation.isMatch,
        score: evaluation.score,
        feedback: evaluation.feedback,
      });
    };

    recognition.start();
  } catch (err) {
    console.warn('Recognition start error:', err);
    onStatusChange('error', 'Não foi possível iniciar o microfone. Verifique se o microfone está conectado.');
  }

  return {
    stop: () => {
      stoppedManually = true;
      clearTimeout(autoSilenceTimeout);
      if (recognition) {
        try {
          recognition.stop();
        } catch {}
      }
    },
  };
}
