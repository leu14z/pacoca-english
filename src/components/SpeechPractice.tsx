import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Volume2 } from 'lucide-react';
import { validatePronunciation } from '../utils/speechValidator';
import { sound, speakEnglish } from '../utils/audio';
import { MicrophoneSelector } from './MicrophoneSelector';

interface SpeechPracticeProps {
  expectedPhrase: string;
  onSuccess: (score: number) => void;
  onFailure: (feedback: string) => void;
  onSkip: () => void;
  disabled?: boolean;
}

export const SpeechPractice: React.FC<SpeechPracticeProps> = ({
  expectedPhrase,
  onSuccess,
  onFailure,
  onSkip,
  disabled = false,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [statusMessage, setStatusMessage] = useState('Toque no microfone para falar');
  const [evaluationFeedback, setEvaluationFeedback] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const hasSpokenRef = useRef(false);
  const fullSpokenTextRef = useRef('');
  const autoSilenceTimeoutRef = useRef<any>(null);

  useEffect(() => {
    // Reset state whenever expectedPhrase changes
    setIsListening(false);
    setInterimText('');
    setStatusMessage('Toque no microfone e pronuncie a frase');
    setEvaluationFeedback(null);
    hasSpokenRef.current = false;
    fullSpokenTextRef.current = '';

    return () => {
      if (autoSilenceTimeoutRef.current) {
        clearTimeout(autoSilenceTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, [expectedPhrase]);

  const handleStartRecording = () => {
    if (disabled) return;
    sound.playClick();

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatusMessage('Seu navegador não suporta reconhecimento de voz.');
      return;
    }

    // Stop any existing session
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    // Continuous = true prevents Chrome from auto-terminating on 1 second of initial pause
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    fullSpokenTextRef.current = '';
    hasSpokenRef.current = false;
    setInterimText('');
    setEvaluationFeedback(null);

    recognition.onstart = () => {
      setIsListening(true);
      setStatusMessage('🎙️ Ouvindo... Pode falar agora!');

      // Safety timeout: 8 seconds maximum of silence before closing gracefully WITHOUT penalty
      if (autoSilenceTimeoutRef.current) clearTimeout(autoSilenceTimeoutRef.current);
      autoSilenceTimeoutRef.current = setTimeout(() => {
        if (!hasSpokenRef.current) {
          try {
            recognition.stop();
          } catch {}
          setIsListening(false);
          setStatusMessage('Não ouvimos você. Toque no microfone e tente falar de novo.');
        }
      }, 8000);
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          fullSpokenTextRef.current += ' ' + transcript;
        } else {
          interim += transcript;
        }
      }

      const activeText = (fullSpokenTextRef.current + ' ' + interim).trim();
      if (activeText) {
        hasSpokenRef.current = true;
        setInterimText(activeText);

        // Pre-validate in real-time: if student said the phrase correctly, stop immediately and validate!
        const liveCheck = validatePronunciation(expectedPhrase, activeText, 80);
        if (liveCheck.isMatch) {
          if (autoSilenceTimeoutRef.current) clearTimeout(autoSilenceTimeoutRef.current);
          try {
            recognition.stop();
          } catch {}
          setIsListening(false);
          setStatusMessage(`Pronúncia perfeita! (${liveCheck.score}%)`);
          onSuccess(liveCheck.score);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition notice:', event.error);
      if (autoSilenceTimeoutRef.current) clearTimeout(autoSilenceTimeoutRef.current);

      if (event.error === 'no-speech') {
        setStatusMessage('Nenhum som detectado. Toque para tentar novamente.');
      } else if (event.error === 'not-allowed') {
        setStatusMessage('Permissão de microfone negada. Clique no cadeado na barra de endereços para permitir.');
      } else if (event.error !== 'aborted') {
        setStatusMessage(`Aviso do microfone: ${event.error}`);
      }
    };

    recognition.onend = () => {
      if (autoSilenceTimeoutRef.current) clearTimeout(autoSilenceTimeoutRef.current);
      setIsListening(false);

      const captured = (fullSpokenTextRef.current || interimText).trim();

      // If silence or empty audio, DO NOT PENALIZE THE USER!
      if (!captured) {
        setStatusMessage('Não ouvimos nenhum som. Toque no microfone para falar!');
        return;
      }

      // If text was captured, evaluate rigorously
      const result = validatePronunciation(expectedPhrase, captured, 75);
      if (result.isMatch) {
        setStatusMessage(`Excelente! (${result.score}% de precisão)`);
        setEvaluationFeedback(null);
        onSuccess(result.score);
      } else {
        setStatusMessage('Pronúncia não compreendida.');
        setEvaluationFeedback(result.feedback);
        onFailure(result.feedback);
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      console.warn('Recognition start exception:', err);
      setStatusMessage('Erro ao iniciar microfone. Verifique as permissões.');
    }
  };

  const handleStopRecording = () => {
    sound.playClick();
    if (autoSilenceTimeoutRef.current) clearTimeout(autoSilenceTimeoutRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  return (
    <div className="text-center py-4 space-y-5 max-w-md mx-auto">
      {/* Target Phrase Box */}
      <div className="p-6 bg-sky-50 border-2 border-sky-200 rounded-3xl shadow-xs">
        <span className="text-xs font-black uppercase text-sky-600 tracking-wider block mb-2">
          Fale esta frase em voz alta:
        </span>
        <p className="text-2xl sm:text-3xl font-black text-slate-800 mb-3 tracking-tight">
          "{expectedPhrase}"
        </p>
        <button
          type="button"
          onClick={() => speakEnglish(expectedPhrase)}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-sky-300 rounded-xl text-sky-700 hover:bg-sky-100 font-bold text-xs cursor-pointer transition-colors shadow-2xs"
        >
          <Volume2 className="w-4 h-4" />
          <span>Ouvir pronúncia nativa</span>
        </button>
      </div>

      {/* Mic Button & Controls */}
      <div className="flex flex-col items-center">
        {isListening ? (
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleStopRecording}
              className="w-24 h-24 rounded-full bg-rose-500 text-white flex items-center justify-center cursor-pointer shadow-lg animate-pulse scale-110 active:scale-95 transition-all"
              title="Toque para parar e avaliar"
            >
              <Square className="w-9 h-9 fill-white" />
            </button>
            <span className="text-rose-600 font-black text-xs uppercase tracking-wider animate-bounce">
              🎙️ Gravando... Fale agora! (Toque no quadrado para finalizar)
            </span>
          </div>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={handleStartRecording}
            className={`w-24 h-24 rounded-full btn-3d-blue flex items-center justify-center cursor-pointer shadow-lg active:scale-95 transition-all ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Toque para falar"
          >
            <Mic className="w-10 h-10 text-white" />
          </button>
        )}

        {!isListening && (
          <span className="text-slate-700 font-black text-sm mt-3">
            {statusMessage}
          </span>
        )}

        {/* Live Transcribed Words */}
        {interimText && (
          <div className="mt-3 p-3 bg-slate-100 border border-slate-300 rounded-2xl max-w-sm w-full">
            <span className="text-[11px] font-black uppercase text-slate-500 block mb-0.5">
              Ouvido pelo microfone:
            </span>
            <p className="text-base font-black text-slate-800">
              "{interimText}"
            </p>
          </div>
        )}

        {/* Feedback message if incorrect */}
        {evaluationFeedback && !isListening && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-300 rounded-2xl max-w-sm w-full text-xs text-rose-900 font-bold text-center">
            {evaluationFeedback}
          </div>
        )}
      </div>

      {/* Skip button (like Duolingo) */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onSkip();
          }}
          className="text-xs text-slate-400 hover:text-slate-600 underline font-bold cursor-pointer transition-colors"
        >
          Não posso falar agora / Pular exercício
        </button>
      </div>

      {/* Microphone Device Selector & Live Volume Test */}
      <div className="pt-4 border-t border-slate-200">
        <MicrophoneSelector />
      </div>
    </div>
  );
};
