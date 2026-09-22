export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  imageBase64?: string;
  imageMime?: string;
  groundingMetadata?: {
    groundingChunks?: Array<{
      web?: {
        uri: string;
        title: string;
      };
      maps?: {
        uri: string;
        title: string;
        placeAnswerSources?: {
          reviewSnippets?: Array<{
            content: string;
          }>;
        };
      };
    }>;
    searchQueries?: string[];
  };
  modelUsed?: string;
  isError?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  model: 'gemini-3.8-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite' | 'gemini-3.5-flash';
  persona: 'general' | 'coder' | 'researcher' | 'creative';
  useSearchGrounding: boolean;
  useMapsGrounding?: boolean;
}

export interface AstralModelOption {
  id: 'gemini-3.8-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite';
  name: string;
  subtitle: string;
  badge: string;
  iconName: 'zap' | 'brain' | 'feather';
}

export const ASTRAL_MODELS: AstralModelOption[] = [
  {
    id: 'gemini-3.8-flash',
    name: 'Astral 3.8 Flash',
    subtitle: 'Rápido, versátil e inteligente para el día a día',
    badge: 'Recomendado',
    iconName: 'zap'
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Astral 3.1 Pro (Thinking)',
    subtitle: 'Razonamiento profundo, código avanzado y STEM',
    badge: 'Alta Potencia',
    iconName: 'brain'
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Astral Flash-Lite',
    subtitle: 'Respuestas ultrarrápidas y máxima ligereza',
    badge: 'Velocidad',
    iconName: 'feather'
  }
];

export interface AstralPersonaOption {
  id: 'general' | 'coder' | 'researcher' | 'creative';
  name: string;
  description: string;
  iconName: 'sparkles' | 'code' | 'search' | 'palette';
}

export const ASTRAL_PERSONAS: AstralPersonaOption[] = [
  {
    id: 'general',
    name: 'Astral General',
    description: 'Agente equilibrado para todo tipo de preguntas y tareas',
    iconName: 'sparkles'
  },
  {
    id: 'coder',
    name: 'Arquitecto de Código',
    description: 'Especialista en TypeScript, Python, DevOps y depuración',
    iconName: 'code'
  },
  {
    id: 'researcher',
    name: 'Investigador Científico',
    description: 'Análisis crítico, contraste de datos y metodología rigurosa',
    iconName: 'search'
  },
  {
    id: 'creative',
    name: 'Genio Creativo',
    description: 'Escritura inspirada, metáforas conceptuales y diseño de ideas',
    iconName: 'palette'
  }
];
