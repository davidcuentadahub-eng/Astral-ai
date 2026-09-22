import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  X,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Wand2,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Sliders,
  AlertCircle,
  Globe,
  MapPin,
  Mic,
  MicOff,
  Volume2,
  RefreshCw,
  Search
} from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadQueryIntoBuilder: (query: string) => void;
  initialPrompt?: string;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
  groundingMetadata?: any;
}

interface OptimizedResult {
  optimizedQuery: string;
  detectedIntent: string;
  mainTopic: string;
  explanation: string;
  operatorsUsed: { operator: string; purpose: string }[];
  alternativeQueries: string[];
  searchTips: string[];
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onLoadQueryIntoBuilder,
  initialPrompt = ''
}) => {
  const [activeTab, setActiveTab] = useState<'optimizer' | 'chat'>('optimizer');

  // Optimizer state
  const [optimizerInput, setOptimizerInput] = useState(
    initialPrompt || 'Quiero encontrar papers académicos de universidades sobre algoritmos de aprendizaje automático en PDF'
  );
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedResult, setOptimizedResult] = useState<OptimizedResult | null>(null);
  const [optimizerError, setOptimizerError] = useState<string | null>(null);
  const [copiedQuery, setCopiedQuery] = useState(false);

  // Chat state
  const [selectedModel, setSelectedModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite'>('gemini-3.5-flash');
  const [selectedRole, setSelectedRole] = useState<'tutor' | 'investigador' | 'seguridad' | 'rapido'>('tutor');
  const [useSearchGrounding, setUseSearchGrounding] = useState(true);
  const [useMapsGrounding, setUseMapsGrounding] = useState(false);

  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: '¡Hola! Soy **TechSearch AI**, tu tutor interactivo de tecnologías digitales y búsqueda avanzada respaldado por modelos Gemini. Puedo consultar Google Search en tiempo real, ayudarte a evaluar fuentes fiables o formular comandos booleanos ultraprecisos. ¿Qué tema deseas investigar hoy?'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Mic recording for chat input
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [isTranscribingMic, setIsTranscribingMic] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Speech output state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!isOpen) return null;

  // Preset ideas for optimizer
  const presets = [
    {
      label: 'Tesis de IA en Universidades',
      text: 'Quiero encontrar tesis doctorales o artículos de investigación sobre redes neuronales de universidades en formato PDF evitando páginas de cursos o anuncios'
    },
    {
      label: 'Informes Oficiales de Ciberseguridad',
      text: 'Quiero buscar documentos gubernamentales oficiales sobre normativas de ciberseguridad nacional en PDF'
    },
    {
      label: 'Código Limpio en GitHub',
      text: 'Buscar repositorios con implementaciones del algoritmo Dijkstra en Python en GitHub sin tutoriales básicos'
    }
  ];

  // Preset questions for chat
  const chatPresets = [
    '¿Qué novedades hay en motores de búsqueda este año con IA?',
    '¿Cómo buscar información científica sin toparme con paywalls?',
    '¿Qué diferencia hay entre site: e inurl:?',
    '¿Dónde están los principales centros de supercómputo en España o Latinoamérica?'
  ];

  const handleOptimize = async () => {
    if (!optimizerInput.trim()) return;
    setIsOptimizing(true);
    setOptimizerError(null);

    try {
      const response = await fetch('/api/ai/optimize-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt: optimizerInput })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al conectar con la IA de Gemini');
      }

      const data = await response.json();
      setOptimizedResult(data);
    } catch (err: any) {
      console.error(err);
      setOptimizerError(
        err.message || 'No se pudo conectar con el servicio de IA. Verifica la conexión o API Key.'
      );
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim() || isChatLoading) return;

    const newMessages: Message[] = [...chatMessages, { role: 'user', text: textToSend.trim() }];
    setChatMessages(newMessages);
    if (!customText) setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            text: m.text
          })),
          model: selectedModel,
          role: selectedRole,
          useSearchGrounding,
          useMapsGrounding
        })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Error al recibir respuesta del tutor IA');
      }

      const data = await response.json();
      setChatMessages([
        ...newMessages,
        {
          role: 'assistant',
          text: data.reply,
          groundingMetadata: data.groundingMetadata
        }
      ]);
    } catch (err: any) {
      setChatMessages([
        ...newMessages,
        {
          role: 'assistant',
          text: `Disculpa, ocurrió un error: ${err.message || 'Error de conexión con Gemini'}. Reintenta formular tu consulta.`
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  // Mic dictation to chatInput
  const toggleMicRecording = async () => {
    if (isRecordingMic) {
      // Stop and transcribe
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecordingMic(false);
      }
    } else {
      try {
        audioChunksRef.current = [];
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          stream.getTracks().forEach((t) => t.stop());
          setIsTranscribingMic(true);

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
                // Extract clean transcription line
                const clean = data.transcription.split('\n')[0].replace(/^"|"$/g, '');
                setChatInput((prev) => (prev ? `${prev} ${clean}` : clean));
              }
            };
            reader.readAsDataURL(blob);
          } catch (e) {
            console.error('Error transcribing mic input:', e);
          } finally {
            setIsTranscribingMic(false);
          }
        };

        mediaRecorder.start();
        setIsRecordingMic(true);
      } catch (err) {
        alert('No se pudo acceder al micrófono. Por favor permite el acceso.');
      }
    }
  };

  // Text-to-speech for model answers
  const speakAnswer = async (text: string) => {
    try {
      setIsSpeaking(true);
      const res = await fetch('/api/ai/voice/talk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 300), voice: 'Kore' })
      });
      const data = await res.json();
      if (data.audioBase64) {
        const binary = atob(data.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: 'audio/wav' });
        const audio = new Audio(URL.createObjectURL(blob));
        audio.play();
      }
    } catch {
      // Ignored
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-7 shadow-2xl relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">TechSearch AI Studio</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  {activeTab === 'chat' ? selectedModel : 'Gemini 3.8 Flash'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tutor multi-turno con búsqueda Google en tiempo real y optimizador booleano
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
            aria-label="Cerrar modal de asistente IA"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-slate-950 p-1 my-4 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('optimizer')}
            className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'optimizer'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>Optimizador de Consultas</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chatbot Educativo Multi-Turno</span>
          </button>
        </div>

        {/* TAB 1: OPTIMIZER */}
        {activeTab === 'optimizer' && (
          <div className="flex-1 overflow-y-auto space-y-5 pr-1 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ¿Qué deseas encontrar en Internet? (Escribe en lenguaje natural)
              </label>
              <textarea
                value={optimizerInput}
                onChange={(e) => setOptimizerInput(e.target.value)}
                placeholder="Ej. Necesito papers académicos recientes sobre criptografía post-cuántica en PDF de universidades..."
                rows={3}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 leading-relaxed"
              />
            </div>

            {/* Presets */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                Plantillas y ejemplos listos para optimizar:
              </span>
              <div className="flex flex-wrap gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setOptimizerInput(p.text)}
                    className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-[11px] text-slate-300 hover:text-cyan-300 transition-colors text-left"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                onClick={handleOptimize}
                disabled={isOptimizing || !optimizerInput.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
              >
                {isOptimizing ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Analizando con Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Optimizar con IA</span>
                  </>
                )}
              </button>
            </div>

            {optimizerError && (
              <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{optimizerError}</span>
              </div>
            )}

            {/* Result Display */}
            {optimizedResult && (
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 animate-fade-in">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Consulta Sintáctica Optimizada
                  </span>
                  <span className="text-[10px] px-2.5 py-1 bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 rounded-full font-mono">
                    Intención: {optimizedResult.detectedIntent}
                  </span>
                </div>

                {/* The Query Box */}
                <div className="p-3.5 bg-slate-900 border border-cyan-500/40 rounded-xl flex items-center justify-between gap-3">
                  <span className="text-xs sm:text-sm font-mono text-cyan-300 font-semibold break-all selection:bg-cyan-500 selection:text-slate-950">
                    {optimizedResult.optimizedQuery}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleCopy(optimizedResult.optimizedQuery)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                      title="Copiar consulta"
                    >
                      {copiedQuery ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(optimizedResult.optimizedQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg transition-colors font-bold text-xs flex items-center gap-1"
                      title="Buscar en Google"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Explanation */}
                <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                  <p className="font-semibold text-slate-200 mb-1">Estrategia aplicada:</p>
                  <p>{optimizedResult.explanation}</p>
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      onLoadQueryIntoBuilder(optimizedResult.optimizedQuery);
                      onClose();
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors border border-slate-700"
                  >
                    <span>Cargar en el Constructor Manual</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MULTI-TURN CHATBOT WITH GROUNDING */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0 animate-fade-in">
            {/* Control Bar: Model, Role, Grounding Toggles */}
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-2xl mb-3 space-y-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Model Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 font-medium">Modelo:</span>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-cyan-300 focus:outline-none"
                  >
                    <option value="gemini-3.5-flash">Gemini 3.5 Flash (General / Equilibrado)</option>
                    <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Tareas Complejas)</option>
                    <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash-Lite (Ultrarrápido)</option>
                  </select>
                </div>

                {/* Role Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 font-medium">Rol:</span>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-purple-300 focus:outline-none"
                  >
                    <option value="tutor">Tutor Pedagógico</option>
                    <option value="investigador">Investigador Académico</option>
                    <option value="seguridad">Experto Ciberseguridad & OSINT</option>
                    <option value="rapido">Asistente Rápido</option>
                  </select>
                </div>
              </div>

              {/* Grounding Toggles */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => {
                    setUseSearchGrounding(!useSearchGrounding);
                    if (!useSearchGrounding) setUseMapsGrounding(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors ${
                    useSearchGrounding
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Google Search Data (Tiempo Real)</span>
                  {useSearchGrounding && <Check className="w-3 h-3 text-cyan-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUseMapsGrounding(!useMapsGrounding);
                    if (!useMapsGrounding) setUseSearchGrounding(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors ${
                    useMapsGrounding
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Google Maps Data</span>
                  {useMapsGrounding && <Check className="w-3 h-3 text-emerald-400" />}
                </button>
              </div>
            </div>

            {/* Scrollable Message Thread */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 mb-3 max-h-[42vh]">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-xl bg-purple-600 flex items-center justify-center text-white flex-shrink-0 mt-1 shadow">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-cyan-600 text-slate-950 font-medium rounded-tr-none'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>

                    {/* Grounding Web Citations if returned */}
                    {msg.groundingMetadata?.groundingChunks && (
                      <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-cyan-400 flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          Fuentes verificadas en Google Search:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.groundingMetadata.groundingChunks.map((chunk: any, i: number) => {
                            if (chunk.web?.uri) {
                              return (
                                <a
                                  key={i}
                                  href={chunk.web.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-0.5 bg-slate-900 hover:bg-slate-850 text-cyan-300 border border-slate-700 rounded text-[10px] truncate max-w-[200px]"
                                >
                                  {chunk.web.title || chunk.web.uri}
                                </a>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    )}

                    {/* Voice audio synthesis button for assistant responses */}
                    {msg.role === 'assistant' && (
                      <div className="mt-2 pt-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => speakAnswer(msg.text)}
                          disabled={isSpeaking}
                          className="text-[10px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Escuchar con voz</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex gap-3 justify-start items-center text-xs text-cyan-400 bg-slate-950 p-3 rounded-2xl border border-slate-800 w-fit">
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Consultando con {selectedModel}...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Preset quick pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2">
              {chatPresets.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  disabled={isChatLoading}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] text-slate-400 hover:text-cyan-300 whitespace-nowrap transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar with Microphone & Send */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={
                    isRecordingMic
                      ? '🎙️ Grabando audio... Habla ahora'
                      : isTranscribingMic
                      ? 'Procesando transcripción de audio...'
                      : 'Pregunta sobre algoritmos, operadores o pide una consulta...'
                  }
                  className="w-full pl-4 pr-12 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-400"
                />

                {/* Mic dictation button */}
                <button
                  type="button"
                  onClick={toggleMicRecording}
                  title="Dictar por micrófono (gemini-3.5-transcribe)"
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                    isRecordingMic
                      ? 'bg-rose-600 text-white animate-pulse'
                      : isTranscribingMic
                      ? 'bg-amber-500 text-slate-950 animate-spin'
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800'
                  }`}
                >
                  {isRecordingMic ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                onClick={() => handleSendMessage()}
                disabled={isChatLoading || !chatInput.trim()}
                className="p-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl transition-all shadow-md active:scale-95"
                title="Enviar mensaje"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
