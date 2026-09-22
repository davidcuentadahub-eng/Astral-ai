import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Music,
  Video,
  Image as ImageIcon,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Upload,
  Download,
  X,
  RefreshCw,
  Sliders,
  Check,
  AlertCircle,
  Wand2,
  Radio,
  FileAudio,
  Film
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { VIP_EMAIL } from '../lib/premium';

interface MultimodalStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertQueryToSearch?: (query: string) => void;
}

export const MultimodalStudioModal: React.FC<MultimodalStudioModalProps> = ({
  isOpen,
  onClose,
  onInsertQueryToSearch
}) => {
  const { user, isVIP, loginAsVIP } = useAuth();
  const [activeTab, setActiveTab] = useState<'music' | 'image' | 'video' | 'transcribe' | 'voice'>('music');

  // MUSIC STATE (Lyria 3)
  const [musicPrompt, setMusicPrompt] = useState(
    'Música electrónica futurista ambient para concentración mientras investigo algoritmos de indexación y ciberseguridad'
  );
  const [musicMode, setMusicMode] = useState<'clip' | 'pro'>('clip');
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [musicAudioUrl, setMusicAudioUrl] = useState<string | null>(null);
  const [musicLyrics, setMusicLyrics] = useState<string | null>(null);
  const [musicError, setMusicError] = useState<string | null>(null);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // IMAGE STATE (Gemini 3.1 Flash Image)
  const [imagePrompt, setImagePrompt] = useState(
    'Infografía conceptual y futurista en 3D que muestra cómo un rastreador web (web crawler) indexa nodos de información interconectados en Internet'
  );
  const [imageAspectRatio, setImageAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('16:9');
  const [uploadedBase64Image, setUploadedBase64Image] = useState<string | null>(null);
  const [uploadedMimeType, setUploadedMimeType] = useState<string>('image/png');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imageDescription, setImageDescription] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // VIDEO STATE (Veo 3)
  const [videoPrompt, setVideoPrompt] = useState(
    'Vuelo cinematográfico a través de un centro de datos de fibra óptica con haces de luz de datos digitales pulsando a alta velocidad'
  );
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [uploadedVideoBase64, setUploadedVideoBase64] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoStatusMessage, setVideoStatusMessage] = useState<string | null>(null);
  const [generatedVideoUri, setGeneratedVideoUri] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);

  // TRANSCRIBE STATE (gemini-3.5-transcribe)
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<string | null>(null);
  const [transcribeError, setTranscribeError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // VOICE CONVERSATION STATE (gemini-3.8-live / TTS Voice Tutor)
  const [voiceInputText, setVoiceInputText] = useState(
    '¿Cuál es la diferencia pedagógica entre un operador booleano OR y las comillas exactas?'
  );
  const [voiceType, setVoiceType] = useState<'Kore' | 'Puck' | 'Zephyr' | 'Fenrir'>('Kore');
  const [isVoiceTalking, setIsVoiceTalking] = useState(false);
  const [voiceAudioUrl, setVoiceAudioUrl] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);

  if (!isOpen) return null;

  // 1. GENERATE MUSIC (Lyria 3)
  const handleGenerateMusic = async () => {
    if (!musicPrompt.trim()) return;
    setIsGeneratingMusic(true);
    setMusicError(null);
    setMusicAudioUrl(null);
    setMusicLyrics(null);

    try {
      const res = await fetch('/api/ai/music/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: musicPrompt, mode: musicMode })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al generar música');

      if (data.audioBase64) {
        const binary = atob(data.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setMusicAudioUrl(url);
        setMusicLyrics(data.lyrics || null);
      }
    } catch (err: any) {
      setMusicError(err.message || 'Error con el modelo Lyria 3. Verifica el acceso a modelos de música en AI Studio.');
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  // 2. GENERATE / EDIT IMAGE (Gemini 3.1 Flash Image)
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    setImageError(null);
    setGeneratedImageUrl(null);

    try {
      const res = await fetch('/api/ai/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          imageBase64: uploadedBase64Image,
          mimeType: uploadedMimeType,
          aspectRatio: imageAspectRatio
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al procesar la imagen');

      setGeneratedImageUrl(data.imageUrl);
      setImageDescription(data.description || null);
    } catch (err: any) {
      setImageError(err.message || 'Error al generar imagen con Gemini.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedMimeType(file.type || 'image/png');
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      const base64 = res.split(',')[1];
      setUploadedBase64Image(base64);
    };
    reader.readAsDataURL(file);
  };

  // 3. GENERATE VIDEO (Veo 3)
  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim() && !uploadedVideoBase64) return;
    setIsGeneratingVideo(true);
    setVideoError(null);
    setGeneratedVideoUri(null);
    setVideoStatusMessage('Iniciando renderizado con Veo 3...');

    try {
      const res = await fetch('/api/ai/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt,
          imageBase64: uploadedVideoBase64,
          aspectRatio: videoAspectRatio
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al iniciar generación con Veo');

      setVideoStatusMessage('Procesando simulación neuronal de video... Puede tardar 1-2 minutos.');

      // Poll operation
      const opName = data.operationName;
      if (opName) {
        let attempts = 0;
        const interval = setInterval(async () => {
          attempts++;
          try {
            const pollRes = await fetch(`/api/ai/video/status?name=${encodeURIComponent(opName)}`);
            const pollData = await pollRes.json();

            if (pollData.done) {
              clearInterval(interval);
              setIsGeneratingVideo(false);
              setVideoStatusMessage(null);
              if (pollData.videoUri) {
                try {
                  const dlRes = await fetch('/api/ai/video/download', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ videoUri: pollData.videoUri })
                  });
                  if (dlRes.ok) {
                    const blob = await dlRes.blob();
                    setGeneratedVideoUri(URL.createObjectURL(blob));
                  } else {
                    setGeneratedVideoUri(pollData.videoUri);
                  }
                } catch {
                  setGeneratedVideoUri(pollData.videoUri);
                }
              }
            } else if (attempts > 30) {
              clearInterval(interval);
              setIsGeneratingVideo(false);
              setVideoStatusMessage('La generación continúa en segundo plano en los servidores de Veo.');
            }
          } catch {
            // keep polling
          }
        }, 8000);
      } else {
        setIsGeneratingVideo(false);
        setVideoStatusMessage('Generación encolada correctamente.');
      }
    } catch (err: any) {
      setIsGeneratingVideo(false);
      setVideoError(err.message || 'Error con el modelo Veo.');
    }
  };

  const handleVideoImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      const base64 = res.split(',')[1];
      setUploadedVideoBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  // 4. TRANSCRIBE AUDIO (gemini-3.5-transcribe)
  const startRecording = async () => {
    setTranscribeError(null);
    setTranscriptionResult(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedAudioBlob(audioBlob);
        setRecordedAudioUrl(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      setTranscribeError('No se pudo acceder al micrófono. Por favor permite los permisos de audio.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscribeAudio = async () => {
    if (!recordedAudioBlob) return;
    setIsTranscribing(true);
    setTranscribeError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];

        const res = await fetch('/api/ai/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64,
            mimeType: 'audio/webm'
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al transcribir');

        setTranscriptionResult(data.transcription);
      };
      reader.readAsDataURL(recordedAudioBlob);
    } catch (err: any) {
      setTranscribeError(err.message || 'Error en la transcripción con gemini-3.5-transcribe.');
    } finally {
      setIsTranscribing(false);
    }
  };

  // 5. VOICE TUTOR (gemini-3.8-live / TTS)
  const handleVoiceTalk = async () => {
    if (!voiceInputText.trim()) return;
    setIsVoiceTalking(true);
    setVoiceError(null);
    setVoiceAudioUrl(null);

    try {
      const res = await fetch('/api/ai/voice/talk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: voiceInputText,
          voice: voiceType
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al sintetizar voz');

      if (data.audioBase64) {
        const binary = atob(data.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setVoiceAudioUrl(url);
      }
    } catch (err: any) {
      setVoiceError(err.message || 'Error al generar la respuesta de voz.');
    } finally {
      setIsVoiceTalking(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                TechSearch AI Multimodal Studio
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Google Gemini & Lyria & Veo
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Genera música de estudio, crea imágenes pedagógicas, anima videos con Veo y transcribe por voz.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
            aria-label="Cerrar modal de estudio multimodal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* VIP Status Header Bar */}
        {isVIP ? (
          <div className="px-5 py-2 bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-500/15 border-b border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span className="font-bold">Suscripción Astral Ultra VIP Activa</span>
              <span className="text-slate-500">•</span>
              <span className="font-mono text-amber-200">{VIP_EMAIL}</span>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 font-bold text-[10px] uppercase tracking-wider">
              Acceso Total Desbloqueado
            </span>
          </div>
        ) : (
          <div className="px-5 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Funciones generativas avanzadas reservadas para cuenta VIP ({VIP_EMAIL})</span>
            </div>
            <button
              type="button"
              onClick={() => loginAsVIP()}
              className="px-3 py-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 rounded-lg text-[11px] font-bold transition-all"
            >
              Activar VIP
            </button>
          </div>
        )}

        {!isVIP ? (
          /* VIP GATING SCREEN */
          <div className="flex-1 overflow-y-auto p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-6 animate-fade-in">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-[2px] mx-auto shadow-2xl shadow-amber-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-amber-400 animate-pulse" />
              </div>
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
                👑 Versión Premium Exclusiva
              </span>
              <h3 className="text-2xl font-bold text-white mt-3">
                Astral Ultra Creative Studio
              </h3>
              <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                Has solicitado la suite de IA multimodal de última generación. Por configuración de seguridad, el acceso a la creación de video cinematográfico con <strong className="text-pink-300">Veo 3.1</strong>, música con <strong className="text-cyan-300">Lyria 3</strong>, edición de imágenes con <strong className="text-indigo-300">Gemini 3.1 Flash Image</strong> y voz interactiva con <strong className="text-amber-300">Gemini 3.8 Live</strong> está reservado exclusivamente para tu correo:
              </p>
              <div className="mt-4 py-2.5 px-5 bg-slate-950 border border-amber-400/40 rounded-2xl text-amber-300 font-mono text-sm font-bold inline-block shadow-inner">
                {VIP_EMAIL}
              </div>
            </div>

            {user && (
              <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl text-xs text-slate-400 w-full">
                Sesión actual: <span className="text-white font-mono font-semibold">{user.email}</span> (Plan Básico).
              </div>
            )}

            <div className="w-full space-y-3 pt-2">
              <button
                type="button"
                onClick={() => loginAsVIP()}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:via-rose-400 hover:to-purple-500 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-2.5"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Desbloquear como Propietario VIP ({VIP_EMAIL})</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white rounded-xl text-xs font-medium transition-colors"
              >
                Volver al Chat
              </button>
            </div>
          </div>
        ) : (
          /* VIP UNLOCKED STUDIO INTERFACE */
          <>
            {/* Studio Navigation Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('music')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'music'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Music className="w-4 h-4" />
                <span>Música (Lyria 3)</span>
              </button>

              <button
                onClick={() => setActiveTab('image')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'image'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Crear y Editar Imágenes</span>
              </button>

              <button
                onClick={() => setActiveTab('video')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'video'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md shadow-pink-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Video & Animación (Veo 3)</span>
              </button>

              <button
                onClick={() => setActiveTab('transcribe')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'transcribe'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>Transcribir Voz (Gemini 3.5)</span>
              </button>

              <button
                onClick={() => setActiveTab('voice')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'voice'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>Conversación por Voz</span>
              </button>
            </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* TAB 1: MUSIC GENERATION (Lyria 3) */}
          {activeTab === 'music' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-2xl flex items-start gap-3">
                <Music className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Generación de Música con Lyria 3</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Crea clips musicales de hasta 30 segundos (con <code className="text-cyan-300">lyria-3-clip-preview</code>) o pistas completas (con <code className="text-cyan-300">lyria-3-pro-preview</code>) diseñadas para la concentración durante tus sesiones de búsqueda e investigación.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Descripción o Estilo Musical (Prompt)
                </label>
                <textarea
                  value={musicPrompt}
                  onChange={(e) => setMusicPrompt(e.target.value)}
                  rows={3}
                  placeholder="Ej. Banda sonora ambiental techno con sintetizadores analógicos y ritmo suave para estudiar..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Modo:</span>
                  <button
                    type="button"
                    onClick={() => setMusicMode('clip')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      musicMode === 'clip'
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Clip Corto (30s)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMusicMode('pro')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      musicMode === 'pro'
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Pista Completa (Pro)
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateMusic}
                  disabled={isGeneratingMusic || !musicPrompt.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
                >
                  {isGeneratingMusic ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Componiendo con Lyria 3...</span>
                    </>
                  ) : (
                    <>
                      <Music className="w-4 h-4" />
                      <span>Generar Música</span>
                    </>
                  )}
                </button>
              </div>

              {musicError && (
                <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{musicError}</span>
                </div>
              )}

              {musicAudioUrl && (
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      Audio Generado Exitosamente por Lyria 3
                    </span>
                    <a
                      href={musicAudioUrl}
                      download="lyria-track.wav"
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Descargar WAV
                    </a>
                  </div>
                  <audio ref={musicAudioRef} src={musicAudioUrl} controls className="w-full mt-2" />
                  {musicLyrics && (
                    <div className="mt-3 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
                      <span className="font-semibold text-slate-400 block mb-1">Estructura / Letra:</span>
                      <p className="whitespace-pre-line">{musicLyrics}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CREATE & EDIT IMAGES (Gemini 3.1 Flash Image) */}
          {activeTab === 'image' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-2xl flex items-start gap-3">
                <ImageIcon className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Crear y Editar Imágenes con Gemini 3.1 Flash Image</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Crea esquemas tecnológicos pedagógicos, infografías sobre algoritmos o sube una imagen existente para solicitar modificaciones precisas.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Instrucción o Prompt para la Imagen
                </label>
                <textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  rows={3}
                  placeholder="Describe la imagen técnica o infografía que deseas generar..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Relación de Aspecto (Aspect Ratio)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['1:1', '16:9', '9:16', '4:3'] as const).map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setImageAspectRatio(ratio)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                          imageAspectRatio === ratio
                            ? 'bg-indigo-600 border-indigo-400 text-white shadow'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Subir Imagen para Editar (Opcional)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-2 px-3 bg-slate-950 border border-slate-700 hover:border-indigo-400 rounded-xl text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Upload className="w-4 h-4 text-indigo-400" />
                      <span>{uploadedBase64Image ? 'Cambiar Foto' : 'Cargar Imagen'}</span>
                    </button>
                    {uploadedBase64Image && (
                      <button
                        type="button"
                        onClick={() => setUploadedBase64Image(null)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl"
                        title="Quitar imagen"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {uploadedBase64Image && (
                    <span className="text-[10px] text-emerald-400 block mt-1">
                      ✓ Imagen cargada para edición multimodal
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage || !imagePrompt.trim()}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                >
                  {isGeneratingImage ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Renderizando con Gemini 3.1...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{uploadedBase64Image ? 'Editar Imagen' : 'Generar Imagen'}</span>
                    </>
                  )}
                </button>
              </div>

              {imageError && (
                <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{imageError}</span>
                </div>
              )}

              {generatedImageUrl && (
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300 flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      Imagen Generada por Gemini 3.1 Flash Image
                    </span>
                    <a
                      href={generatedImageUrl}
                      download="gemini-illustration.png"
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Descargar PNG
                    </a>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-slate-800 max-h-96 flex items-center justify-center bg-slate-900">
                    <img
                      src={generatedImageUrl}
                      alt="Generado por Gemini"
                      className="max-h-96 object-contain w-full"
                    />
                  </div>
                  {imageDescription && (
                    <p className="text-xs text-slate-300 italic">{imageDescription}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VIDEO & ANIMATION (Veo 3) */}
          {activeTab === 'video' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 bg-pink-950/30 border border-pink-500/30 rounded-2xl flex items-start gap-3">
                <Film className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Generación y Animación de Video con Veo 3</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Crea videos educativos a partir de texto o sube una foto para animarla con el modelo <code className="text-pink-300">veo-3.1-fast-generate-preview</code> en formato panorámico (16:9) o vertical (9:16).
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Descripción Cinemática del Video (Prompt)
                </label>
                <textarea
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  rows={3}
                  placeholder="Describe la animación o escena tecnológica que deseas generar..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-pink-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Formato de Pantalla (Aspect Ratio)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setVideoAspectRatio('16:9')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                        videoAspectRatio === '16:9'
                          ? 'bg-pink-600 border-pink-400 text-white shadow'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      16:9 (Horizontal / PC)
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoAspectRatio('9:16')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                        videoAspectRatio === '9:16'
                          ? 'bg-pink-600 border-pink-400 text-white shadow'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      9:16 (Vertical / Móvil)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Animar Foto en Video (Opcional)
                  </label>
                  <input
                    ref={videoFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleVideoImageUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => videoFileInputRef.current?.click()}
                      className="flex-1 py-2 px-3 bg-slate-950 border border-slate-700 hover:border-pink-400 rounded-xl text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Upload className="w-4 h-4 text-pink-400" />
                      <span>{uploadedVideoBase64 ? 'Cambiar Foto Inicial' : 'Subir Foto para Animar'}</span>
                    </button>
                    {uploadedVideoBase64 && (
                      <button
                        type="button"
                        onClick={() => setUploadedVideoBase64(null)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {uploadedVideoBase64 && (
                    <span className="text-[10px] text-pink-400 block mt-1">
                      ✓ Foto lista para ser animada con Veo 3
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleGenerateVideo}
                  disabled={isGeneratingVideo || (!videoPrompt.trim() && !uploadedVideoBase64)}
                  className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-pink-500/20 transition-all active:scale-95"
                >
                  {isGeneratingVideo ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Procesando con Veo 3...</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4" />
                      <span>{uploadedVideoBase64 ? 'Animar Foto en Video' : 'Generar Video'}</span>
                    </>
                  )}
                </button>
              </div>

              {videoStatusMessage && (
                <div className="p-4 bg-slate-950 border border-pink-500/30 rounded-2xl text-xs text-pink-300 flex items-center gap-3">
                  <RefreshCw className="w-4 h-4 animate-spin text-pink-400" />
                  <span>{videoStatusMessage}</span>
                </div>
              )}

              {videoError && (
                <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{videoError}</span>
                </div>
              )}

              {generatedVideoUri && (
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-pink-300 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Video Veo 3 Generado
                  </span>
                  <video src={generatedVideoUri} controls autoPlay loop className="w-full rounded-xl border border-slate-800" />
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AUDIO TRANSCRIPTION (gemini-3.5-transcribe) */}
          {activeTab === 'transcribe' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl flex items-start gap-3">
                <Mic className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Transcripción de Voz con Gemini 3.5 Transcribe</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Habla a través de tu micrófono para dictar tus preguntas de investigación. Gemini transcribirá tu voz y extraerá automáticamente las palabras clave y operadores booleanos sugeridos.
                  </p>
                </div>
              </div>

              {/* Microphone Controller */}
              <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all shadow-xl active:scale-95 ${
                    isRecording
                      ? 'bg-rose-600 hover:bg-rose-500 animate-pulse shadow-rose-600/30'
                      : 'bg-gradient-to-tr from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-emerald-500/30'
                  }`}
                >
                  {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>

                <div>
                  <span className="text-sm font-bold text-white block">
                    {isRecording ? 'Grabando audio de tu micrófono...' : 'Haz clic para empezar a hablar'}
                  </span>
                  <span className="text-xs text-slate-400 mt-1 block">
                    {isRecording
                      ? 'Presiona de nuevo para detener y procesar la transcripción.'
                      : 'Formula en voz alta lo que necesitas investigar en Internet.'}
                  </span>
                </div>

                {recordedAudioUrl && (
                  <div className="w-full max-w-md pt-2">
                    <audio src={recordedAudioUrl} controls className="w-full" />
                    <button
                      type="button"
                      onClick={handleTranscribeAudio}
                      disabled={isTranscribing}
                      className="mt-3 w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      {isTranscribing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Transcribiendo con gemini-3.5-transcribe...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4" />
                          <span>Transcribir y Analizar Búsqueda</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {transcribeError && (
                <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{transcribeError}</span>
                </div>
              )}

              {transcriptionResult && (
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Transcripción Completada
                    </span>
                    {onInsertQueryToSearch && (
                      <button
                        onClick={() => {
                          onInsertQueryToSearch(transcriptionResult);
                          onClose();
                        }}
                        className="px-3 py-1 bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-cyan-400"
                      >
                        Llevar al Constructor
                      </button>
                    )}
                  </div>
                  <div className="p-4 bg-slate-900 rounded-xl text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-line border border-slate-800">
                    {transcriptionResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: VOICE CONVERSATION (gemini-3.8-live / TTS) */}
          {activeTab === 'voice' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-2xl flex items-start gap-3">
                <Radio className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Conversación por Voz con Gemini Live</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Interactúa mediante voz interactiva en tiempo real con el tutor educativo. Escucha explicaciones pedagógicas con síntesis neuronal de alta fidelidad.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Pregunta o Tema para el Tutor de Voz
                </label>
                <textarea
                  value={voiceInputText}
                  onChange={(e) => setVoiceInputText(e.target.value)}
                  rows={3}
                  placeholder="Formula una duda sobre operadores o tecnologías..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Voz:</span>
                  {(['Kore', 'Puck', 'Zephyr', 'Fenrir'] as const).map((voice) => (
                    <button
                      key={voice}
                      type="button"
                      onClick={() => setVoiceType(voice)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        voiceType === voice
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {voice}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleVoiceTalk}
                  disabled={isVoiceTalking || !voiceInputText.trim()}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                >
                  {isVoiceTalking ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sintetizando voz en vivo...</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>Hablar con el Tutor</span>
                    </>
                  )}
                </button>
              </div>

              {voiceError && (
                <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{voiceError}</span>
                </div>
              )}

              {voiceAudioUrl && (
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Respuesta de Voz Lista para Escuchar
                  </span>
                  <audio ref={voiceAudioRef} src={voiceAudioUrl} controls autoPlay className="w-full" />
                </div>
              )}
            </div>
          )}
        </div>
          </>
        )}
      </div>
    </div>
  );
};
