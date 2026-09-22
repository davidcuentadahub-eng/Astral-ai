import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Modality, LiveServerMessage, GenerateVideosOperation } from '@google/genai';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const app = express();

app.use(express.json({ limit: '50mb' }));

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// 1. Endpoint: AI Search Query Optimizer
app.post('/api/ai/optimize-query', async (req, res) => {
  try {
    const { userPrompt, targetEngine = 'google' } = req.body;

    if (!userPrompt || typeof userPrompt !== 'string') {
      res.status(400).json({ error: 'Debes proporcionar una descripción de búsqueda válida.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({
        error: 'La clave GEMINI_API_KEY no está configurada.'
      });
      return;
    }

    const ai = getAI();

    const systemPrompt = `Eres el Asistente Experto en Búsquedas Avanzadas de "TechSearch Edu".
Tu misión es transformar lo que el usuario quiere encontrar en lenguaje natural en la consulta de búsqueda más precisa, limpia y profesional posible usando operadores booleanos y comandos de búsqueda estándar (Google, Bing, DuckDuckGo).
Operadores válidos que debes usar según corresponda:
- "frase exacta" para nombres propios, términos técnicos clave o citas textuales
- site:dominio (ej. site:edu, site:gob.es, site:github.com, site:arxiv.org)
- filetype:extension (ej. filetype:pdf, filetype:docx, filetype:pptx)
- -palabra para excluir anuncios, ventas, tutoriales irrelevantes, etc.
- OR para alternativas válidas
- intitle: o inurl: para términos estructurales obligatorios
- after:AAAA o before:AAAA si el usuario pide cosas recientes o de una época

Debes responder ÚNICAMENTE con un objeto JSON válido con la siguiente estructura exacta:
{
  "optimizedQuery": "cadena con la consulta exacta lista para pegar en el buscador",
  "detectedIntent": "Informativa / Académica / Técnica / Transaccional / etc.",
  "mainTopic": "tema central detectado",
  "explanation": "explicación clara de por qué elegiste esta sintaxis y operadores",
  "operatorsUsed": [
    { "operator": "site:edu", "purpose": "restringe a universidades" }
  ],
  "alternativeQueries": [
    "variación 1",
    "variación 2"
  ],
  "searchTips": [
    "consejo práctico 1",
    "consejo práctico 2"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Petición del usuario: "${userPrompt}"\nMotor objetivo: ${targetEngine}\nGenera la consulta optimizada en JSON.`
            }
          ]
        }
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const responseText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      parsedData = {
        optimizedQuery: userPrompt,
        detectedIntent: 'Informativa',
        mainTopic: userPrompt,
        explanation: 'Consulta procesada por Gemini.',
        operatorsUsed: [],
        alternativeQueries: [],
        searchTips: []
      };
    }

    res.json(parsedData);
  } catch (error: any) {
    console.error('Error en /api/ai/optimize-query:', error);
    res.status(500).json({
      error: 'Error al optimizar la consulta con IA.',
      message: error?.message || 'Error desconocido'
    });
  }
});

// 2. Endpoint: Multi-Turn Chat with Grounding (Google Search / Google Maps) and Model Selection
app.post('/api/ai/chat', async (req, res) => {
  try {
    const {
      messages,
      model = 'gemini-3.8-flash',
      role = 'general',
      useSearchGrounding = false,
      customSystemPrompt
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Debes enviar un historial de mensajes válido.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({
        error: 'La clave GEMINI_API_KEY no está configurada en los Secretos del proyecto.'
      });
      return;
    }

    const ai = getAI();

    // Map role to system prompt
    let roleDescription = 'Eres Astral.ai, un agente de Inteligencia Artificial independiente de última generación inspirado en la potencia y versatilidad de Google Gemini.';
    if (role === 'coder') {
      roleDescription = 'Eres Astral.ai en modo Ingeniero de Software Senior y Arquitecto de Sistemas. Especialista en escribir código limpio, tipado, modular, robusto y eficiente en TypeScript, Python, Rust, Go, JavaScript, SQL y tecnologías web modernas.';
    } else if (role === 'researcher') {
      roleDescription = 'Eres Astral.ai en modo Investigador Científico y Analista de Datos. Riguroso, analítico, deductivo, contrastas hechos, citas fuentes y formulas hipótesis bien fundamentadas.';
    } else if (role === 'creative') {
      roleDescription = 'Eres Astral.ai en modo Creativo y Narrativo. Imaginas soluciones innovadoras, metáforas conceptuales cósmicas, redacción fluida y diseño de experiencias únicas.';
    }

    const systemPrompt = customSystemPrompt || `${roleDescription}
Tu objetivo es asistir al usuario con máxima inteligencia, amabilidad, precisión y excelencia técnica.
- Usa formato Markdown sofisticado (encabezados, negritas, listas estructuradas, tablas cuando aporte valor).
- En bloques de código, especifica siempre el lenguaje y escribe código completo y funcional sin marcadores ficticios.
- Si dispones de datos de búsqueda de Google, cita y referencia las fuentes de forma natural.
- Responde siempre en el idioma en que el usuario te hable (por defecto español).`;

    // Select valid model based on prompt
    const validModels = ['gemini-3.8-flash', 'gemini-3.1-pro-preview', 'gemini-3.1-flash-lite', 'gemini-3.5-flash'];
    let selectedModel = validModels.includes(model) ? model : 'gemini-3.8-flash';

    const { useMapsGrounding = false, userLocation } = req.body;

    // Configure tools: Search Grounding or Maps Grounding
    const tools: any[] = [];
    let toolConfig: any = undefined;

    if (useSearchGrounding) {
      selectedModel = 'gemini-3.5-flash';
      tools.push({ googleSearch: {} });
    } else if (useMapsGrounding) {
      selectedModel = 'gemini-3.5-flash';
      tools.push({ googleMaps: {} });
      if (userLocation?.latitude && userLocation?.longitude) {
        toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: Number(userLocation.latitude),
              longitude: Number(userLocation.longitude)
            }
          }
        };
      }
    }

    // Convert messages format for Gemini with vision/image support
    const contents = messages.map((m: any) => {
      const parts: any[] = [];
      if (m.text) {
        parts.push({ text: m.text });
      }
      if (m.imageBase64) {
        parts.push({
          inlineData: {
            mimeType: m.imageMime || 'image/jpeg',
            data: m.imageBase64
          }
        });
      }
      if (parts.length === 0) {
        parts.push({ text: ' ' });
      }
      return {
        role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
        parts
      };
    });

    const baseConfig: any = {
      systemInstruction: systemPrompt,
      temperature: role === 'creative' ? 0.7 : 0.3,
      ...(toolConfig ? { toolConfig } : {})
    };

    let response: any = null;
    let effectiveModel = selectedModel;
    let usedSearchGrounding = useSearchGrounding;
    let searchNotice = '';

    // First attempt: with user selected model and requested tools (if any)
    try {
      if (tools.length > 0) {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Grounding tool timeout')), 5000)
        );
        const searchPromise = ai.models.generateContent({
          model: selectedModel,
          contents,
          config: {
            ...baseConfig,
            tools
          }
        });
        response = await Promise.race([searchPromise, timeoutPromise]);
      } else {
        response = await ai.models.generateContent({
          model: selectedModel,
          contents,
          config: baseConfig
        });
      }
    } catch (primaryErr: any) {
      console.warn('Aviso en generateContent principal:', primaryErr?.message || primaryErr);

      // If search tools caused a quota or grounding error, retry without tools
      if (tools.length > 0) {
        try {
          usedSearchGrounding = false;
          response = await ai.models.generateContent({
            model: selectedModel,
            contents,
            config: baseConfig
          });
        } catch (noToolsErr: any) {
          console.warn('Aviso en reintento sin herramientas:', noToolsErr?.message || noToolsErr);
        }
      }

      // If still no response (e.g. selected model requires paid tier or hit quota), fallback to gemini-3.8-flash then gemini-3.1-flash-lite
      if (!response) {
        try {
          effectiveModel = 'gemini-3.8-flash';
          response = await ai.models.generateContent({
            model: effectiveModel,
            contents,
            config: baseConfig
          });
        } catch (flashErr: any) {
          console.warn('Aviso en fallback gemini-3.8-flash, probando lite:', flashErr?.message || flashErr);
          effectiveModel = 'gemini-3.1-flash-lite';
          response = await ai.models.generateContent({
            model: effectiveModel,
            contents,
            config: baseConfig
          });
        }
      }
    }

    if (!response) {
      throw new Error('No se pudo generar respuesta tras múltiples intentos');
    }

    // Extract grounding citations if available
    const groundingMetadata = usedSearchGrounding ? (response.candidates?.[0]?.groundingMetadata || null) : null;
    const replyText = response.text ? (response.text + searchNotice) : 'Hola, recibí tu mensaje. ¿En qué te puedo colaborar?';

    res.json({
      reply: replyText,
      groundingMetadata,
      modelUsed: effectiveModel
    });
  } catch (error: any) {
    console.error('Error en /api/ai/chat:', error);
    res.status(500).json({
      error: 'Error en el chat de IA.',
      message: error?.message || 'Error interno'
    });
  }
});

// 3. Endpoint: Audio Transcription (gemini-3.5-transcribe)
app.post('/api/ai/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;

    if (!audioBase64) {
      res.status(400).json({ error: 'Debes proporcionar audio en base64 para transcribir.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({ error: 'GEMINI_API_KEY no configurada.' });
      return;
    }

    const ai = getAI();

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: audioBase64
            }
          },
          {
            text: 'Transcribe este audio con máxima exactitud en español. En una segunda línea etiquetada con "PALABRAS CLAVE:", extrae las 3-5 palabras clave más relevantes para buscar esta información en Internet.'
          }
        ]
      }
    });

    res.json({
      transcription: response.text || 'No se pudo transcribir el audio.'
    });
  } catch (error: any) {
    console.error('Error en /api/ai/transcribe:', error);
    res.status(500).json({
      error: 'Error al transcribir audio con gemini-3.5-transcribe.',
      message: error?.message || 'Error interno'
    });
  }
});

// 4. Endpoint: Create & Edit Images (gemini-3.1-flash-image)
app.post('/api/ai/image/generate', async (req, res) => {
  try {
    const {
      prompt,
      imageBase64,
      mimeType = 'image/png',
      aspectRatio = '1:1'
    } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'El prompt de imagen es obligatorio.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({ error: 'GEMINI_API_KEY no configurada.' });
      return;
    }

    const ai = getAI();

    const parts: any[] = [];
    if (imageBase64) {
      // Edit image flow
      parts.push({
        inlineData: {
          data: imageBase64,
          mimeType
        }
      });
    }
    parts.push({ text: prompt });

    let response: any = null;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: (aspectRatio as any) || '1:1',
            imageSize: '1K'
          }
        }
      });
    } catch (previewErr: any) {
      console.warn('Fallback a gemini-3.1-flash-image:', previewErr?.message);
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: (aspectRatio as any) || '1:1',
            imageSize: '1K'
          }
        }
      });
    }

    let imageUrl: string | null = null;
    let textResponse = '';

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
          break;
        } else if (part.text) {
          textResponse += part.text;
        }
      }
    }

    if (!imageUrl) {
      res.status(500).json({
        error: 'No se pudo generar la imagen.',
        details: textResponse || 'El modelo no devolvió datos de imagen.'
      });
      return;
    }

    res.json({
      imageUrl,
      description: textResponse
    });
  } catch (error: any) {
    console.error('Error en /api/ai/image/generate:', error);
    res.status(500).json({
      error: 'Error al generar o editar imagen con Gemini.',
      message: error?.message || 'Error interno'
    });
  }
});

// 5. Endpoint: Veo Video Generation (Text to Video & Image to Video)
app.post('/api/ai/video/generate', async (req, res) => {
  try {
    const {
      prompt,
      imageBase64,
      mimeType = 'image/png',
      aspectRatio = '16:9'
    } = req.body;

    if (!prompt && !imageBase64) {
      res.status(400).json({ error: 'Se requiere un prompt de texto o una imagen para generar el video.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({ error: 'GEMINI_API_KEY no configurada.' });
      return;
    }

    const ai = getAI();

    const videoConfig: any = {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9'
    };

    const payload: any = {
      model: 'veo-3.1-fast-generate-preview',
      config: videoConfig
    };

    if (prompt) {
      payload.prompt = prompt;
    }

    if (imageBase64) {
      payload.image = {
        imageBytes: imageBase64,
        mimeType
      };
    }

    const operation = await ai.models.generateVideos(payload);

    res.json({
      operationName: operation.name,
      done: operation.done || false
    });
  } catch (error: any) {
    console.error('Error en /api/ai/video/generate:', error);
    res.status(500).json({
      error: 'Error al iniciar generación de video con Veo.',
      message: error?.message || 'Error interno'
    });
  }
});

// 5b. Polling Endpoint for Veo Video
app.get('/api/ai/video/status', async (req, res) => {
  try {
    const operationName = req.query.name as string;
    if (!operationName) {
      res.status(400).json({ error: 'Falta el nombre de la operación de video.' });
      return;
    }

    const ai = getAI();
    const operation = await (ai.operations as any).getVideosOperation({ operation: { name: operationName } });

    if (!operation.done) {
      res.json({ done: false, status: 'processing' });
      return;
    }

    const videoResult = operation.response?.generatedVideos?.[0];
    res.json({
      done: true,
      videoUri: videoResult?.video?.uri || null
    });
  } catch (error: any) {
    console.error('Error en /api/ai/video/status:', error);
    res.status(500).json({
      error: 'Error al consultar estado de video Veo.',
      message: error?.message || 'Error interno'
    });
  }
});

// 5c. Endpoint: Video Download Proxy (Protege la API key y evita CORS)
app.post('/api/ai/video/download', async (req, res) => {
  try {
    const { videoUri } = req.body;
    if (!videoUri) {
      res.status(400).json({ error: 'Falta videoUri' });
      return;
    }
    const apiKey = process.env.GEMINI_API_KEY;
    const videoRes = await fetch(videoUri, {
      headers: { 'x-goog-api-key': apiKey || '' }
    });
    res.setHeader('Content-Type', 'video/mp4');
    const buffer = await videoRes.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error: any) {
    console.error('Error al descargar video Veo:', error);
    res.status(500).json({ error: 'Error al descargar video' });
  }
});

// 6. Endpoint: Music Generation (Lyria 3)
app.post('/api/ai/music/generate', async (req, res) => {
  try {
    const {
      prompt,
      mode = 'clip' // 'clip' (up to 30s) or 'pro' (full tracks)
    } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Se requiere una descripción de música para Lyria.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({ error: 'GEMINI_API_KEY no configurada.' });
      return;
    }

    const ai = getAI();
    const model = mode === 'pro' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';

    const response = await ai.models.generateContentStream({
      model,
      contents: prompt,
      config: {
        responseModalities: [Modality.AUDIO]
      }
    });

    let audioBase64 = '';
    let lyrics = '';
    let mimeType = 'audio/wav';

    for await (const chunk of response) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    if (!audioBase64) {
      res.status(500).json({
        error: 'No se recibieron datos de audio de Lyria.',
        details: 'Verifica cuotas o permisos de Lyria en AI Studio.'
      });
      return;
    }

    res.json({
      audioBase64,
      mimeType,
      lyrics
    });
  } catch (error: any) {
    console.error('Error en /api/ai/music/generate:', error);
    res.status(500).json({
      error: 'Error al generar música con Lyria 3.',
      message: error?.message || 'Error interno'
    });
  }
});

// 7. Endpoint: Real-Time Voice Conversation Tutor (gemini-3.8-live / TTS)
app.post('/api/ai/voice/talk', async (req, res) => {
  try {
    const { text, voice = 'Kore' } = req.body;

    if (!text) {
      res.status(400).json({ error: 'Se requiere texto para sintetizar.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({ error: 'GEMINI_API_KEY no configurada.' });
      return;
    }

    const ai = getAI();

    // Use gemini-3.1-flash-tts-preview or generate speech
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Kore' }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    res.json({
      audioBase64: base64Audio || null
    });
  } catch (error: any) {
    console.error('Error en /api/ai/voice/talk:', error);
    res.status(500).json({
      error: 'Error al generar voz interactiva.',
      message: error?.message || 'Error interno'
    });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = http.createServer(app);
  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', async (clientWs) => {
    console.log('Cliente conectado a /live WebSocket');
    try {
      if (!process.env.GEMINI_API_KEY) {
        clientWs.send(JSON.stringify({ error: 'GEMINI_API_KEY no configurada' }));
        clientWs.close();
        return;
      }
      const ai = getAI();
      const session = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          systemInstruction: 'Eres Astral.ai, un asistente conversacional avanzado. Responde en español con naturalidad, empatía y claridad.'
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ audio }));
            }
            if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
          onclose: () => {
            try { clientWs.close(); } catch {}
          },
          onerror: (err) => {
            console.error('Live session callback error:', err);
          }
        }
      });

      clientWs.on('message', (data) => {
        try {
          const parsed = JSON.parse(data.toString());
          if (parsed.audio) {
            session.sendRealtimeInput({
              audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' }
            });
          }
        } catch (e) {
          console.warn('Live websocket payload error:', e);
        }
      });

      clientWs.on('close', () => {
        try { session.close(); } catch {}
      });
    } catch (liveErr: any) {
      console.error('Error al inicializar sesión Live API:', liveErr);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({ error: liveErr?.message || 'Error al conectar con Gemini 3.8 Live API' }));
      }
    }
  });

  server.on('upgrade', (request, socket, head) => {
    const url = request.url || '';
    if (url.startsWith('/live')) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Astral.ai Full-Stack Server (HTTP + Live WS) running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
