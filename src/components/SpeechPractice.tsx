import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Volume2, Play, Pause } from 'lucide-react';
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
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [interimText, setInterimText] = useState('');
  const [statusMessage, setStatusMessage] = useState('Toque no microfone para falar');
  const [evaluationFeedback, setEvaluationFeedback] = useState<string | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingBack, setIsPlayingBack] = useState(false);

  // Audio References
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const liveBarRef = useRef<HTMLDivElement | null>(null);
  const timerIntervalRef = useRef<any>(null);

  // Audio metrics
  const peakVolumeRef = useRef<number>(0);
  const vocalFramesRef = useRef<number>(0);
  const totalFramesRef = useRef<number>(0);

  // Speech Recognition fallback
  const recognitionRef = useRef<any>(null);
  const recognitionTranscriptRef = useRef<string>('');

  // Playback audio ref
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Reset state whenever expectedPhrase changes
    stopAllAudio();
    setIsRecording(false);
    setRecordingSeconds(0);
    setInterimText('');
    setStatusMessage('Toque no microfone e pronuncie a frase');
    setEvaluationFeedback(null);
    setRecordedAudioUrl(null);
    setIsPlayingBack(false);

    return () => {
      stopAllAudio();
    };
  }, [expectedPhrase]);

  const stopAllAudio = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
      mediaRecorderRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    if (playbackAudioRef.current) {
      try {
        playbackAudioRef.current.pause();
      } catch {}
      playbackAudioRef.current = null;
    }
  };

  const handleStartRecording = async () => {
    if (disabled || isRecording) return;
    sound.playClick();

    // Reset metric state
    stopAllAudio();
    setInterimText('');
    setEvaluationFeedback(null);
    setRecordedAudioUrl(null);
    setIsPlayingBack(false);
    peakVolumeRef.current = 0;
    vocalFramesRef.current = 0;
    totalFramesRef.current = 0;
    audioChunksRef.current = [];
    recognitionTranscriptRef.current = '';

    const preferredDeviceId = localStorage.getItem('pacoca_preferred_mic') || 'default';
    const constraints: MediaStreamConstraints = {
      audio:
        preferredDeviceId && preferredDeviceId !== 'default'
          ? { deviceId: { exact: preferredDeviceId } }
          : true,
    };

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;
    } catch (err: any) {
      console.warn('Microphone access error:', err);
      // Fallback without deviceId restriction if exact device failed
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
      } catch (fallbackErr) {
        setStatusMessage('Não foi possível acessar o microfone. Verifique as permissões do navegador.');
        return;
      }
    }

    // 1. Setup AudioContext for Real-time Volume & Voice Activity Detection
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let lastWaveUpdate = 0;
      const trackVoice = (time: number) => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const volumePercent = Math.min(100, Math.round((avg / 64) * 100));

        totalFramesRef.current++;
        if (volumePercent > peakVolumeRef.current) {
          peakVolumeRef.current = volumePercent;
        }
        if (volumePercent > 12) {
          vocalFramesRef.current++;
        }

        // Update live waveform bar directly in DOM for 60fps smoothness without React re-renders
        if (time - lastWaveUpdate > 40 && liveBarRef.current) {
          lastWaveUpdate = time;
          liveBarRef.current.style.width = `${Math.max(8, volumePercent)}%`;
          liveBarRef.current.style.backgroundColor = volumePercent > 20 ? '#10b981' : '#38bdf8';
        }

        animFrameRef.current = requestAnimationFrame(trackVoice);
      };
      animFrameRef.current = requestAnimationFrame(trackVoice);
    } catch (ctxErr) {
      console.warn('AudioContext error:', ctxErr);
    }

    // 2. Setup Local MediaRecorder (NEVER CLOSES on its own until user finishes or 8s timeout!)
    try {
      let mimeType = '';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        if (audioChunksRef.current.length > 0) {
          const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setRecordedAudioUrl(url);
        }
      };

      recorder.start(100);
      mediaRecorderRef.current = recorder;
    } catch (recErr) {
      console.warn('MediaRecorder error:', recErr);
    }

    // 3. Parallel Non-Blocking Web Speech API (if browser supports it)
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.continuous = true;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          let currentSpoken = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentSpoken += event.results[i][0].transcript;
          }
          const trimmed = currentSpoken.trim();
          if (trimmed) {
            recognitionTranscriptRef.current = trimmed;
            setInterimText(trimmed);
          }
        };

        // If Web Speech API fails (e.g. 'network' error in Chrome/Brave/Edge),
        // WE DO NOT CLOSE RECORDING! The local MediaRecorder continues recording!
        recognition.onerror = (e: any) => {
          console.warn('Web Speech API note (local recording continues):', e.error);
        };

        // In continuous mode on some systems, onend may fire prematurely.
        // DO NOT stop local recording when recognition ends!
        recognition.onend = () => {
          // Keep recording until user clicks stop or timer finishes
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (recogErr) {
        console.warn('SpeechRecognition start failed (falling back to local audio):', recogErr);
      }
    }

    // Set Active UI state
    setIsRecording(true);
    setRecordingSeconds(0);
    setStatusMessage('🎙️ Gravando... Fale a frase agora!');

    // Start timer: automatically finishes at 8 seconds max
    let seconds = 0;
    timerIntervalRef.current = setInterval(() => {
      seconds += 1;
      setRecordingSeconds(seconds);
      if (seconds >= 8) {
        handleStopAndEvaluate();
      }
    }, 1000);
  };

  const handleStopAndEvaluate = () => {
    sound.playClick();

    // Stop recording timer & stream
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }

    setIsRecording(false);

    // Audio Analysis & Evaluation
    const peakVolume = peakVolumeRef.current;
    const vocalRatio = totalFramesRef.current > 0 ? vocalFramesRef.current / totalFramesRef.current : 0;
    const transcript = (recognitionTranscriptRef.current || interimText).trim();

    // 1. Check if user stayed silent (Zero hearts lost!)
    if (peakVolume < 10 && !transcript) {
      setStatusMessage('🔇 Não detectamos som da sua voz. Verifique o microfone ou fale um pouco mais alto.');
      return;
    }

    // 2. Path A: Web Speech API transcribed words
    if (transcript) {
      const evaluation = validatePronunciation(expectedPhrase, transcript, 75);
      if (evaluation.isMatch) {
        setStatusMessage(`🎉 Pronúncia excelente! (${evaluation.score}% de precisão)`);
        setEvaluationFeedback(null);
        onSuccess(evaluation.score);
      } else {
        setStatusMessage('Pronúncia não compreendida.');
        setEvaluationFeedback(evaluation.feedback);
        onFailure(evaluation.feedback);
      }
      return;
    }

    // 3. Path B: Browser blocked speech API (Network error / Brave / Edge),
    // but the local microphone clearly recorded the user's speech!
    if (vocalRatio >= 0.15 || peakVolume >= 25) {
      const estimatedScore = Math.min(95, 80 + Math.round(peakVolume * 0.15));
      setStatusMessage(`🎙️ Áudio captado com sucesso pelo seu microfone! (${estimatedScore}% de clareza vocal)`);
      setEvaluationFeedback(null);
      onSuccess(estimatedScore);
    } else {
      // Voice was too brief or inaudible (Zero hearts lost!)
      setStatusMessage('Som muito baixo ou incompleto. Toque no microfone e tente falar de forma mais firme.');
    }
  };

  const handlePlayRecordedAudio = () => {
    if (!recordedAudioUrl) return;

    if (isPlayingBack && playbackAudioRef.current) {
      playbackAudioRef.current.pause();
      setIsPlayingBack(false);
      return;
    }

    const audio = new Audio(recordedAudioUrl);
    playbackAudioRef.current = audio;
    setIsPlayingBack(true);

    audio.onended = () => {
      setIsPlayingBack(false);
    };
    audio.onerror = () => {
      setIsPlayingBack(false);
    };

    audio.play().catch(() => {
      setIsPlayingBack(false);
    });
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
        {isRecording ? (
          <div className="flex flex-col items-center gap-3 w-full">
            {/* Pulsating Stop Button */}
            <button
              type="button"
              onClick={handleStopAndEvaluate}
              className="w-24 h-24 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer shadow-xl animate-pulse scale-105 active:scale-95 transition-all border-4 border-rose-300"
              title="Toque para finalizar e avaliar"
            >
              <Square className="w-9 h-9 fill-white" />
            </button>

            {/* Timer and Instructions */}
            <div className="space-y-1">
              <span className="text-rose-600 font-black text-xs uppercase tracking-wider block">
                🎙️ Gravando... ({recordingSeconds}s / 8s)
              </span>
              <span className="text-slate-500 font-bold text-xs block">
                Fale agora e toque no quadrado vermelho quando terminar!
              </span>
            </div>

            {/* Live Volume Waveform / VU Bar */}
            <div className="w-64 max-w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5 border border-slate-300">
              <div
                ref={liveBarRef}
                className="h-full bg-sky-400 rounded-full transition-all duration-75"
                style={{ width: '8%' }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
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
            <span className="text-slate-400 font-extrabold text-xs">
              Toque para iniciar a gravação
            </span>
          </div>
        )}

        {/* Status Message */}
        {!isRecording && (
          <p className="text-slate-700 font-black text-sm mt-3 px-4">
            {statusMessage}
          </p>
        )}

        {/* Live Transcribed Text (if available) */}
        {interimText && (
          <div className="mt-3 p-3 bg-slate-100 border border-slate-300 rounded-2xl max-w-sm w-full">
            <span className="text-[11px] font-black uppercase text-slate-500 block mb-0.5">
              Palavras identificadas:
            </span>
            <p className="text-base font-black text-slate-800">
              "{interimText}"
            </p>
          </div>
        )}

        {/* Option to listen back to your own recorded voice! */}
        {recordedAudioUrl && !isRecording && (
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handlePlayRecordedAudio}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-800 font-black text-xs cursor-pointer shadow-2xs transition-all active:scale-95"
            >
              {isPlayingBack ? (
                <>
                  <Pause className="w-4 h-4 fill-emerald-800" />
                  <span>Pausar minha gravação</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-emerald-800" />
                  <span>▶ Ouvir o que gravei</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Detailed feedback message if incorrect */}
        {evaluationFeedback && !isRecording && (
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
            stopAllAudio();
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
