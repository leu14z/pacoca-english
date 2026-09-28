import React, { useState, useEffect, useRef } from 'react';
import { Mic, Check, AlertCircle, RefreshCw } from 'lucide-react';

interface MicrophoneDevice {
  deviceId: string;
  label: string;
}

interface MicrophoneSelectorProps {
  onDeviceChange?: (deviceId: string) => void;
}

export const MicrophoneSelector: React.FC<MicrophoneSelectorProps> = ({
  onDeviceChange,
}) => {
  const [devices, setDevices] = useState<MicrophoneDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(() => {
    return localStorage.getItem('pacoca_preferred_mic') || 'default';
  });
  const [isOpen, setIsOpen] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Enumerate audio input devices
  const loadDevices = async () => {
    try {
      setErrorMsg('');
      // Request temporary stream to unlock device labels if needed
      const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionGranted(true);

      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = allDevices
        .filter((d) => d.kind === 'audioinput')
        .map((d, index) => ({
          deviceId: d.deviceId,
          label: d.label || `Microfone ${index + 1}`,
        }));

      setDevices(audioInputs);

      // Clean up temp stream
      tempStream.getTracks().forEach((t) => t.stop());

      // If no device was previously chosen or the chosen one is gone, select first
      if (audioInputs.length > 0) {
        const exists = audioInputs.some((d) => d.deviceId === selectedDeviceId);
        const activeId = exists ? selectedDeviceId : audioInputs[0].deviceId;
        setSelectedDeviceId(activeId);
        localStorage.setItem('pacoca_preferred_mic', activeId);
        if (onDeviceChange) onDeviceChange(activeId);
        startVolumeMeter(activeId);
      }
    } catch (err: any) {
      console.warn('Microphone permission or enumeration error:', err);
      setPermissionGranted(false);
      setErrorMsg('Permissão de microfone negada. Clique no cadeado na barra de endereços para permitir.');
    }
  };

  // Start live VU Volume Meter for chosen device
  const startVolumeMeter = async (deviceId: string) => {
    stopVolumeMeter();

    try {
      const constraints: MediaStreamConstraints = {
        audio: deviceId && deviceId !== 'default' ? { deviceId: { exact: deviceId } } : true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        // Normalize to 0 - 100
        const normalized = Math.min(100, Math.round((avg / 64) * 100));
        setAudioLevel(normalized);

        animFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (err) {
      console.warn('Could not start live volume meter for device:', err);
    }
  };

  const stopVolumeMeter = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  };

  useEffect(() => {
    loadDevices();
    return () => {
      stopVolumeMeter();
    };
  }, []);

  const handleSelectDevice = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    localStorage.setItem('pacoca_preferred_mic', deviceId);
    if (onDeviceChange) onDeviceChange(deviceId);
    startVolumeMeter(deviceId);
    setIsOpen(false);
  };

  const currentDeviceLabel =
    devices.find((d) => d.deviceId === selectedDeviceId)?.label ||
    (devices.length > 0 ? devices[0].label : 'Microfone Padrão');

  return (
    <div className="w-full">
      {/* Mic Bar / Selector Button */}
      <div className="flex items-center justify-between gap-3 p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <Mic className="w-4 h-4" />
          </div>
          <div className="min-w-0 text-left">
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">
              Dispositivo Selecionado:
            </span>
            <p className="text-xs font-black text-slate-800 truncate" title={currentDeviceLabel}>
              {currentDeviceLabel}
            </p>
          </div>
        </div>

        {/* Live Audio Level VU Meter */}
        <div className="flex items-center gap-2">
          <div className="flex items-end gap-0.5 h-5 w-12 bg-slate-100 p-1 rounded-lg">
            {[20, 40, 60, 80, 100].map((threshold, idx) => (
              <div
                key={idx}
                className={`flex-1 rounded-xs transition-all duration-75 ${
                  audioLevel >= threshold
                    ? audioLevel > 75
                      ? 'bg-emerald-500 h-full'
                      : 'bg-sky-500 h-full'
                    : 'bg-slate-300 h-1'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOpen(!isOpen);
              if (!permissionGranted) loadDevices();
            }}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
          >
            {isOpen ? 'Fechar' : 'Trocar'}
          </button>
        </div>
      </div>

      {/* Dropdown / Device list */}
      {isOpen && (
        <div className="mt-2 p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-lg space-y-2 text-left z-20">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-black uppercase text-slate-600">
              Escolha seu microfone:
            </span>
            <button
              type="button"
              onClick={loadDevices}
              className="text-[11px] font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Recarregar
            </button>
          </div>

          {errorMsg && (
            <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="max-h-48 overflow-y-auto space-y-1">
            {devices.map((device) => {
              const isSelected = device.deviceId === selectedDeviceId;
              return (
                <button
                  key={device.deviceId}
                  type="button"
                  onClick={() => handleSelectDevice(device.deviceId)}
                  className={`w-full p-2.5 text-left rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="truncate pr-2">{device.label}</span>
                  {isSelected && <Check className="w-4 h-4 shrink-0 text-white" />}
                </button>
              );
            })}
          </div>

          <p className="text-[10px] text-slate-400 font-medium pt-1">
            Fale alto e observe as barrinhas verdes se movimentando para testar o som.
          </p>
        </div>
      )}
    </div>
  );
};
