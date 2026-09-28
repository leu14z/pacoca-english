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
  const [errorMsg, setErrorMsg] = useState('');

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const meterBarRef = useRef<HTMLDivElement | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // Enumerate devices without locking audio stream
  const loadDevices = async () => {
    try {
      setErrorMsg('');
      if (!navigator.mediaDevices?.enumerateDevices) {
        setErrorMsg('Navegador não suporta busca de microfones.');
        return;
      }

      // Quick enumeration
      let allDevices = await navigator.mediaDevices.enumerateDevices();
      let audioInputs = allDevices.filter((d) => d.kind === 'audioinput');

      // If labels are empty, request brief permission once
      if (audioInputs.length > 0 && !audioInputs[0].label) {
        try {
          const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          tempStream.getTracks().forEach((t) => t.stop());
          allDevices = await navigator.mediaDevices.enumerateDevices();
          audioInputs = allDevices.filter((d) => d.kind === 'audioinput');
        } catch {
          // Ignore if user cancels
        }
      }

      const formatted = audioInputs.map((d, index) => ({
        deviceId: d.deviceId,
        label: d.label || `Microfone ${index + 1}`,
      }));

      setDevices(formatted);

      if (formatted.length > 0) {
        const exists = formatted.some((d) => d.deviceId === selectedDeviceId);
        const activeId = exists ? selectedDeviceId : formatted[0].deviceId;
        setSelectedDeviceId(activeId);
        localStorage.setItem('pacoca_preferred_mic', activeId);
        if (onDeviceChange) onDeviceChange(activeId);
      }
    } catch (err: any) {
      setErrorMsg('Permissão de microfone negada ou indisponível.');
    }
  };

  // Only start live audio visualizer when the test dropdown is OPEN
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
      analyser.fftSize = 64; // Low FFT size for extreme performance
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = (timestamp: number) => {
        // Throttle updates to ~20fps (every 50ms) to ensure ZERO page lag
        if (timestamp - lastUpdateRef.current >= 50) {
          lastUpdateRef.current = timestamp;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          const percent = Math.min(100, Math.round((avg / 64) * 100));

          // Direct DOM style update = ZERO React re-render overhead!
          if (meterBarRef.current) {
            meterBarRef.current.style.width = `${percent}%`;
            meterBarRef.current.style.backgroundColor = percent > 60 ? '#10b981' : '#0284c7';
          }
        }

        animFrameRef.current = requestAnimationFrame(updateLevel);
      };

      animFrameRef.current = requestAnimationFrame(updateLevel);
    } catch {
      // Audio stream failed or cancelled
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
    if (meterBarRef.current) {
      meterBarRef.current.style.width = '0%';
    }
  };

  useEffect(() => {
    loadDevices();
    return () => {
      stopVolumeMeter();
    };
  }, []);

  // When dropdown opens, start meter. When closed, stop meter immediately to save 100% CPU!
  useEffect(() => {
    if (isOpen) {
      startVolumeMeter(selectedDeviceId);
    } else {
      stopVolumeMeter();
    }
  }, [isOpen, selectedDeviceId]);

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
              Microfone Ativo:
            </span>
            <p className="text-xs font-black text-slate-800 truncate max-w-[200px]" title={currentDeviceLabel}>
              {currentDeviceLabel}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen && devices.length === 0) loadDevices();
          }}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
        >
          {isOpen ? 'Fechar' : 'Trocar / Testar'}
        </button>
      </div>

      {/* Dropdown / Device list (Only runs VU meter when open) */}
      {isOpen && (
        <div className="mt-2 p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-xl space-y-3 text-left z-20">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-black uppercase text-slate-700">
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

          {/* Direct DOM Volume Meter Bar (0% React re-render lag) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>Teste de voz (fale agora):</span>
              <span className="text-sky-600">Ao vivo</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                ref={meterBarRef}
                className="h-full rounded-full transition-all duration-75"
                style={{ width: '0%', backgroundColor: '#0284c7' }}
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="max-h-48 overflow-y-auto space-y-1 pt-1">
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
        </div>
      )}
    </div>
  );
};
