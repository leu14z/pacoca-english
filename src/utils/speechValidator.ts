// Speech validation and Levenshtein similarity algorithm for Paçoca English

export interface ValidationResult {
  isMatch: boolean;
  score: number; // 0 to 100%
  spokenClean: string;
  expectedClean: string;
  feedback: string;
}

/**
 * Normalizes text by removing accents, punctuation, extra whitespace and converting to lowercase.
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics / accents
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"!\\]/g, '') // remove punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates Levenshtein Distance between two strings.
 */
export function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Compares expected phrase with spoken phrase.
 * Combines token overlap and Levenshtein distance for realistic pronunciation scoring.
 * Requires threshold >= minAcceptableScore (default: 75%).
 */
export function validatePronunciation(
  expectedPhrase: string,
  spokenPhrase: string,
  minAcceptableScore: number = 75
): ValidationResult {
  const expectedClean = normalizeText(expectedPhrase);
  const spokenClean = normalizeText(spokenPhrase);

  if (!spokenClean || spokenClean.length < 2) {
    return {
      isMatch: false,
      score: 0,
      spokenClean,
      expectedClean,
      feedback: 'Nenhum som de voz nítido foi detectado. Fale com clareza próximo ao microfone.',
    };
  }

  // Exact match
  if (spokenClean === expectedClean) {
    return {
      isMatch: true,
      score: 100,
      spokenClean,
      expectedClean,
      feedback: 'Pronúncia perfeita! 100% correto!',
    };
  }

  const expectedWords = expectedClean.split(' ').filter(Boolean);
  const spokenWords = spokenClean.split(' ').filter(Boolean);

  if (spokenWords.length === 0 || expectedWords.length === 0) {
    return {
      isMatch: false,
      score: 0,
      spokenClean,
      expectedClean,
      feedback: `Você não disse a frase esperada. Tente falar "${expectedPhrase}".`,
    };
  }

  // Word-by-word evaluation
  let matchedScoreSum = 0;
  const usedSpokenIndexes = new Set<number>();

  for (const expWord of expectedWords) {
    let bestWordMatch = 0;
    let bestIndex = -1;

    for (let i = 0; i < spokenWords.length; i++) {
      if (usedSpokenIndexes.has(i)) continue;
      const spkWord = spokenWords[i];

      if (spkWord === expWord) {
        bestWordMatch = 1.0;
        bestIndex = i;
        break;
      }

      // Allow minor phonetic distance (1 typo for length >= 4, 2 for >= 7)
      const dist = levenshtein(expWord, spkWord);
      const maxAllowed = expWord.length >= 7 ? 2 : expWord.length >= 4 ? 1 : 0;

      if (dist <= maxAllowed) {
        const similarity = 1 - dist / Math.max(expWord.length, spkWord.length);
        if (similarity > bestWordMatch) {
          bestWordMatch = similarity;
          bestIndex = i;
        }
      }
    }

    if (bestIndex !== -1 && bestWordMatch >= 0.70) {
      usedSpokenIndexes.add(bestIndex);
      matchedScoreSum += bestWordMatch;
    }
  }

  // Recall (coverage of expected words) and Precision (not rambling unrelated words)
  const recall = matchedScoreSum / expectedWords.length;
  const precision = matchedScoreSum / spokenWords.length;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  const finalScore = Math.round(f1 * 100);

  const isMatch = finalScore >= minAcceptableScore && recall >= 0.70;

  return {
    isMatch,
    score: finalScore,
    spokenClean,
    expectedClean,
    feedback: isMatch
      ? `Muito bom! Compreendido com ${finalScore}% de precisão!`
      : `Você disse "${spokenPhrase}", mas a frase correta é "${expectedPhrase}".`,
  };
}
