import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Paperclip,
  Image as ImageIcon,
  Mic,
  MicOff,
  Globe,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  Trash2,
  Menu,
  ChevronDown,
  ExternalLink,
  Code,
  Search,
  Palette,
  X,
  Zap,
  Brain,
  Feather,
  AlertCircle
} from 'lucide-react';
import {
  ChatMessage,
  ChatSession,
  ASTRAL_MODELS,
  AstralModelOption,
  ASTRAL_PERSONAS
} from '../../types/astral';
import { AstralMessageRenderer } from './AstralMessageRenderer';

interface AstralChatAreaProps {
  session: ChatSession | null;
  onSendMessage: (text: string, imageBase64?: string, imageMime?: string) => Promise<void>;
  isLoading: boolean;
  onClearSession: () => void;
  onToggleSidebar: () => void;
  onChangeModel: (model: 'gemini-3.8-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite') => void;
  onToggleSearchGrounding: () => void;
  isSidebarOpen: boolean;
}

export const AstralChatArea: React.FC<AstralChatAreaProps> = ({
  session,
  onSendMessage,
  isLoading,
  onClearSession,
  onToggleSidebar,
  onChangeModel,
  onToggleSearchGrounding,
  isSidebarOpen
}) => {
  const [inputText, setInputText] = useState('');
  const [attachedImageBase64, setAttachedImageBase64] = useState<string | null>(null);
  const [attachedImageMime, setAttachedImageMime] = useState<string>('image/jpeg');
  const [attachedImageName, setAttachedImageName] = useState<string | null>(null);

  // Model dropdown state
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  // Audio voice dictation state (gemini-3.5-transcribe)
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Speech player state
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [isSynthesizingVoice, setIsSynthesizingVoice] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // UI helpers
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeModel = ASTRAL_MODELS.find((m) => m.id === (session?.model || 'gemini-3.8-flash')) || ASTRAL_MODELS[0];
  const activePersonaObj = ASTRAL_PERSONAS.find((p) => p.id === (session?.persona || 'general')) || ASTRAL_PERSONAS[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages, isLoading]);

  // Adjust textarea height dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [inputText]);

  const handleSend = async () => {
    if ((!inputText.trim() && !attachedImageBase64) || isLoading) return;

    const text = inputText.trim();
    const imgBase64 = attachedImageBase64 || undefined;
    const imgMime = attachedImageMime || undefined;

    setInputText('');
    setAttachedImageBase64(null);
    setAttachedImageName(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await onSendMessage(text, imgBase64, imgMime);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachedImageName(file.name);
    setAttachedImageMime(file.type || 'image/jpeg');

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setAttachedImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  // Mic dictation
  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    } else {
      try {
        audioChunksRef.current = [];
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        recorder.onstop = async () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          stream.getTracks().forEach((t) => t.stop());
          setIsTranscribing(true);

          try {
            const reader = new FileReader();
            reader.onloadend = async () => {
              const base64 = (reader.result as string).split(',')[1];
              const res = await fetch('/api/ai/transcribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audioBase64: base64, mimeType: 'audio/webm' })
              });
              const data = await res.json();
              if (data.transcription) {
                const clean = data.transcription.split('\n')[0].replace(/^"|"$/g, '');
                setInputText((prev) => (prev ? `${prev} ${clean}` : clean));
              }
            };
            reader.readAsDataURL(blob);
          } catch (err) {
            console.error('Error dictating audio:', err);
          } finally {
            setIsTranscribing(false);
          }
        };

        recorder.start();
        setIsRecording(true);
      } catch {
        alert('Por favor autoriza el permiso de micrófono en tu navegador para dictar.');
      }
    }
  };

  // Text-To-Speech
  const handleSpeakMessage = async (msgId: string, text: string) => {
    if (currentlyPlayingId === msgId) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        setCurrentlyPlayingId(null);
      }
      return;
    }

    try {
      setIsSynthesizingVoice(true);
      const res = await fetch('/api/ai/voice/talk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.replace(/[#*`_\[\]]/g, '').slice(0, 400),
          voice: 'Kore'
        })
      });

      const data = await res.json();
      if (data.audioBase64) {
        const binary = atob(data.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);

        if (audioPlayerRef.current) {
          audioPlayerRef.current.src = url;
          audioPlayerRef.current.play();
          setCurrentlyPlayingId(msgId);
          audioPlayerRef.current.onended = () => setCurrentlyPlayingId(null);
        }
      }
    } catch (err) {
      console.error('Voice playback error:', err);
    } finally {
      setIsSynthesizingVoice(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const presetSuggestions = [
    {
      title: 'Programación Avanzada',
      prompt: 'Crea una función en TypeScript para balancear un árbol AVL con tipos genéricos y pruebas unitarias.',
      icon: Code,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Investigación en Tiempo Real',
      prompt: '¿Cuáles son los últimos descubrimientos y aplicaciones prácticas de la computación cuántica?',
      icon: Search,
      color: 'from-cyan-500 to-blue-600'
    },
    {
      title: 'Generación Conceptual',
      prompt: 'Describe la arquitectura para una red neuronal distribuida resiliente a particiones de red.',
      icon: Palette,
      color: 'from-purple-500 to-indigo-600'
    },
    {
      title: 'Razonamiento Profundo',
      prompt: 'Explica paso a paso cómo funciona el algoritmo de consenso Raft comparado con Paxos.',
      icon: Brain,
      color: 'from-amber-500 to-orange-600'
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 relative overflow-hidden">
      {/* Hidden Audio Player */}
      <audio ref={audioPlayerRef} className="hidden" />

      {/* Top Navbar */}
      <header className="h-14 sm:h-16 border-b border-slate-850 px-4 sm:px-6 flex items-center justify-between bg-slate-950/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            title="Mostrar / Ocultar barra lateral"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Model Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors"
            >
              {activeModel.iconName === 'zap' && <Zap className="w-3.5 h-3.5 text-cyan-400" />}
              {activeModel.iconName === 'brain' && <Brain className="w-3.5 h-3.5 text-purple-400" />}
              {activeModel.iconName === 'feather' && <Feather className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{activeModel.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {modelDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
                  Modelos de Inteligencia Artificial
                </div>
                {ASTRAL_MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onChangeModel(m.id);
                      setModelDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-start gap-2.5 ${
                      m.id === activeModel.id
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="mt-0.5">
                      {m.iconName === 'zap' && <Zap className="w-4 h-4 text-cyan-400" />}
                      {m.iconName === 'brain' && <Brain className="w-4 h-4 text-purple-400" />}
                      {m.iconName === 'feather' && <Feather className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{m.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {m.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{m.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Persona indicator */}
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-medium text-slate-400">
            <span>Modo:</span>
            <span className="text-cyan-300 font-semibold">{activePersonaObj.name}</span>
          </span>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          {/* Web search grounding toggle */}
          <button
            onClick={onToggleSearchGrounding}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              session?.useSearchGrounding !== false
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
            title="Alternar búsqueda web en vivo con Google Search Grounding"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Búsqueda Web</span>
            <span className={`w-1.5 h-1.5 rounded-full ${session?.useSearchGrounding !== false ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
          </button>

          {session && session.messages.length > 0 && (
            <button
              onClick={onClearSession}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
              title="Limpiar conversación actual"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">
        {(!session || session.messages.length === 0) ? (
          /* EMPTY STATE / WELCOME SCREEN */
          <div className="max-w-3xl mx-auto h-full flex flex-col justify-center py-8 sm:py-12 animate-fade-in">
            <div className="text-center space-y-4 mb-8 sm:mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 p-[2px] shadow-2xl shadow-cyan-500/20 animate-pulse">
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-cyan-300" />
                </div>
              </div>

              <div>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                  Hola, soy <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">Astral.ai</span>
                </h1>
                <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-lg mx-auto">
                  Tu agente de inteligencia artificial independiente. Pregunta, programa, investiga en tiempo real o analiza ideas complejas.
                </p>
              </div>
            </div>

            {/* Suggestions Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto w-full">
              {presetSuggestions.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(item.prompt);
                      textareaRef.current?.focus();
                    }}
                    className="group p-4 bg-slate-900/70 hover:bg-slate-900 border border-slate-800/90 hover:border-cyan-500/40 rounded-2xl text-left transition-all hover:scale-[1.01] active:scale-95 shadow-md flex items-start gap-3.5"
                  >
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white flex-shrink-0 shadow-md group-hover:rotate-6 transition-transform`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </span>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                        {item.prompt}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* MESSAGES THREAD */
          <div className="max-w-3xl mx-auto space-y-6">
            {session.messages.map((msg) => {
              const isUser = msg.role === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Assistant Avatar */}
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 p-[1px] flex-shrink-0 shadow-md mt-1">
                      <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-cyan-300" />
                      </div>
                    </div>
                  )}

                  <div className={`flex flex-col max-w-[88%] sm:max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                    {/* User message bubble */}
                    {isUser ? (
                      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-3xl rounded-tr-sm px-5 py-3.5 text-sm shadow-md leading-relaxed font-medium">
                        {msg.imageBase64 && (
                          <div className="mb-2 rounded-xl overflow-hidden max-h-60 border border-white/20">
                            <img
                              src={`data:${msg.imageMime || 'image/jpeg'};base64,${msg.imageBase64}`}
                              alt="Archivo adjunto"
                              className="max-h-60 object-contain w-full"
                            />
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    ) : (
                      /* Astral response bubble */
                      <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-3xl rounded-tl-sm p-5 shadow-xl text-slate-200">
                        {/* Model Tag */}
                        {msg.modelUsed && (
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400/80 mb-2">
                            <Zap className="w-3 h-3 text-cyan-400" />
                            <span>{msg.modelUsed}</span>
                          </div>
                        )}

                        {/* Markdown Formatted Body */}
                        <AstralMessageRenderer content={msg.text} />

                        {/* Grounding Sources (Google Search Citations) */}
                        {msg.groundingMetadata?.groundingChunks && msg.groundingMetadata.groundingChunks.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                            <span className="text-[10px] uppercase font-bold text-cyan-400 flex items-center gap-1.5">
                              <Globe className="w-3 h-3" />
                              Fuentes web verificadas por Google Search:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {msg.groundingMetadata.groundingChunks.map((chunk, idx) => {
                                if (chunk.web?.uri) {
                                  return (
                                    <a
                                      key={idx}
                                      href={chunk.web.uri}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 rounded-lg text-[11px] flex items-center gap-1 max-w-[240px] truncate transition-colors"
                                    >
                                      <span className="truncate">{chunk.web.title || chunk.web.uri}</span>
                                      <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                                    </a>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          </div>
                        )}

                        {/* Message Action Toolbar */}
                        <div className="flex items-center justify-end gap-2 mt-4 pt-2 border-t border-slate-800/60 text-slate-400">
                          <button
                            onClick={() => copyToClipboard(msg.text)}
                            className="p-1.5 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                            title="Copiar texto completo"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleSpeakMessage(msg.id, msg.text)}
                            className={`p-1.5 rounded-lg hover:bg-slate-800 transition-colors ${
                              currentlyPlayingId === msg.id ? 'text-cyan-300 bg-slate-800' : 'hover:text-white'
                            }`}
                            title="Escuchar respuesta con voz (TTS)"
                          >
                            {currentlyPlayingId === msg.id ? (
                              <VolumeX className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3.5 items-start animate-fade-in">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 p-[1px] flex-shrink-0 shadow-md">
                  <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-cyan-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Astral está pensando y formulando la respuesta...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Floating Gemini-Style Input Dock */}
      <div className="p-3 sm:p-5 max-w-3xl mx-auto w-full z-20">
        <div className="bg-slate-900/95 border border-slate-750 focus-within:border-cyan-500/60 rounded-3xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-xl transition-all">
          {/* Image Attachment Preview */}
          {attachedImageBase64 && (
            <div className="mb-2 p-2 bg-slate-950 rounded-2xl flex items-center justify-between border border-slate-800">
              <div className="flex items-center gap-2.5 truncate">
                <img
                  src={`data:${attachedImageMime};base64,${attachedImageBase64}`}
                  alt="Vista previa"
                  className="w-10 h-10 object-cover rounded-xl border border-slate-700"
                />
                <span className="text-xs text-slate-300 truncate max-w-[200px]">
                  {attachedImageName || 'Imagen adjunta para análisis visual'}
                </span>
              </div>
              <button
                onClick={() => {
                  setAttachedImageBase64(null);
                  setAttachedImageName(null);
                }}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
            className="hidden"
          />

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isRecording
                ? '🎙️ Grabando audio... Habla ahora'
                : isTranscribing
                ? 'Transcribiendo audio con Gemini...'
                : 'Pregúntale a Astral.ai, pide código, análisis o adjunta imágenes...'
            }
            rows={1}
            className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 text-sm px-2.5 py-1 focus:outline-none resize-none max-h-44 leading-relaxed"
          />

          {/* Bottom Dock Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-850 mt-1">
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Attach Image Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-xl transition-colors"
                title="Adjuntar imagen para análisis visual multimodal"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              {/* Dictate / Record Voice Button */}
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2 rounded-xl transition-colors ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : isTranscribing
                    ? 'bg-amber-500 text-slate-950 animate-spin'
                    : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800'
                }`}
                title="Dictar consulta con micrófono (gemini-3.5-transcribe)"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Search Grounding toggle indicator */}
              <button
                type="button"
                onClick={onToggleSearchGrounding}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  session?.useSearchGrounding !== false
                    ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/30'
                    : 'text-slate-500 hover:text-slate-400'
                }`}
                title="Google Search Grounding"
              >
                <Globe className="w-3 h-3" />
                <span className="hidden sm:inline">Web</span>
              </button>
            </div>

            {/* Send Button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={isLoading || (!inputText.trim() && !attachedImageBase64)}
              className="p-2.5 bg-gradient-to-tr from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 disabled:opacity-40 disabled:hover:from-cyan-400 text-slate-950 rounded-2xl shadow-lg shadow-cyan-500/25 transition-all active:scale-95"
              title="Enviar mensaje (Enter)"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-2">
          Astral.ai puede cometer errores. Verifica la información importante.
        </p>
      </div>
    </div>
  );
};
