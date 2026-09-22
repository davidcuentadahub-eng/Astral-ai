export type TechCategory = 'ia-datos' | 'infraestructura-redes' | 'automatizacion-inmersion';

export interface DigitalTech {
  id: string;
  name: string;
  category: TechCategory;
  categoryLabel: string;
  iconName: string;
  definition: string;
  practicalExample: string;
  currentApplications: string[];
  keyBenefit: string;
}

export interface PipelineStep {
  stepNumber: number;
  id: string;
  title: string;
  subtitle: string;
  description: string;
  technicalDetails: string;
  iconName: string;
  metrics: string;
  color: string;
}

export interface EngineConcept {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  tags: string[];
  example: string;
}

export interface SearchOperator {
  id: string;
  operator: string;
  syntax: string;
  name: string;
  description: string;
  example: string;
  targetEngines: string[];
  notes?: string;
  category: 'filtros' | 'contenido' | 'logica' | 'temporal';
}

export interface KeywordType {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  exampleQuery: string;
  intent: 'informativa' | 'navegacional' | 'transaccional' | 'comercial';
  searchVolume: 'Alto' | 'Medio' | 'Bajo';
  conversionRate: 'Alta' | 'Media' | 'Baja';
}

export interface EngineComparison {
  id: string;
  name: string;
  tagline: string;
  logoColor: string;
  privacyRating: string;
  resultQuality: string;
  features: string[];
  privacyPolicy: string;
  highlightFunction: string;
  bestUseCases: string[];
  indexingSource: string;
  officialUrl: string;
}

export interface SearchStep {
  step: number;
  title: string;
  description: string;
  actionableTip: string;
  example: string;
  category: 'preparacion' | 'ejecucion' | 'evaluacion';
}

export interface SmartTechnique {
  id: string;
  title: string;
  category: string;
  summary: string;
  deepDive: string;
  formula: string;
  iconName: string;
  tags: string[];
}

export interface GlossaryTerm {
  id: string;
  term: string;
  acronym?: string;
  category: 'web-protocolos' | 'datos-ia' | 'busqueda-seo' | 'seguridad-redes';
  categoryLabel: string;
  definition: string;
  technicalDetails: string;
  relatedTerms: string[];
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  notes?: string;
  createdAt: string;
  targetEngine?: 'google' | 'duckduckgo' | 'bing';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'estudiante' | 'docente' | 'investigador';
  avatarColor: string;
  joinDate: string;
}

export interface UserProgress {
  completedGuideSteps: number[];
  favoriteTechIds: string[];
  favoriteOperatorIds: string[];
  savedSearches: SavedSearch[];
  customGlossaryTerms: GlossaryTerm[];
}

export interface CuratedQuery {
  id: string;
  title: string;
  description: string;
  category: string;
  query: string;
  engine?: 'google' | 'duckduckgo' | 'bing';
}
