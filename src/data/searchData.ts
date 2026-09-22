import {
  PipelineStep,
  EngineConcept,
  SearchOperator,
  KeywordType,
  EngineComparison,
  SearchStep,
  SmartTechnique,
  GlossaryTerm
} from '../types';

export const pipelineSteps: PipelineStep[] = [
  {
    stepNumber: 1,
    id: 'usuario',
    title: 'Usuario',
    subtitle: 'Origen de la necesidad',
    description: 'Una persona experimenta una necesidad de información, duda técnica, compra o navegación y formula un pensamiento en su mente.',
    technicalDetails: 'El usuario interactúa a través de dispositivos móviles, navegadores web o comandos de voz.',
    iconName: 'User',
    metrics: 'Más de 8.500 millones de consultas diarias en el mundo',
    color: 'from-blue-500 to-cyan-400'
  },
  {
    stepNumber: 2,
    id: 'consulta',
    title: 'Consulta (Query)',
    subtitle: 'Formulación y envío',
    description: 'El usuario traduce su pensamiento a una cadena de texto o voz. El motor procesa la consulta corrigiendo ortografía y expandiendo sinónimos.',
    technicalDetails: 'Tokenización de la cadena, lematización, análisis sintáctico y extracción de entidades semánticas mediante NLP.',
    iconName: 'Search',
    metrics: 'Tiempo de procesamiento: < 15 milisegundos',
    color: 'from-cyan-400 to-teal-400'
  },
  {
    stepNumber: 3,
    id: 'rastreo',
    title: 'Rastreo (Crawling)',
    subtitle: 'Exploración de la web',
    description: 'Bots automáticos (spiders o crawlers) recorren miles de millones de páginas públicas en Internet siguiendo hipervínculos de forma continua.',
    technicalDetails: 'Googlebot, Bingbot u otros spiders analizan código HTML, respetan directivas de robots.txt y descubren nuevo contenido.',
    iconName: 'Network',
    metrics: 'Miles de millones de URLs rastreadas cada 24 horas',
    color: 'from-teal-400 to-emerald-400'
  },
  {
    stepNumber: 4,
    id: 'indice',
    title: 'Índice (Indexing)',
    subtitle: 'Biblioteca organizada',
    description: 'El motor descarga, renderiza y clasifica el contenido en una gigantesca base de datos estructurada organizada como un índice inverso masivo.',
    technicalDetails: 'Se extrae texto, metadatos, etiquetas semánticas, canonicals e imágenes, descartando duplicados y calculando embeddings vectoriales.',
    iconName: 'Database',
    metrics: 'Índice superior a 100 millones de Gigabytes',
    color: 'from-emerald-400 to-violet-400'
  },
  {
    stepNumber: 5,
    id: 'algoritmos',
    title: 'Algoritmos y Ranking',
    subtitle: 'Evaluación de relevancia',
    description: 'Cientos de algoritmos y redes neuronales evalúan la consulta contra el índice analizando relevancia semántica, autoridad, frescura y contexto.',
    technicalDetails: 'Modelos de lenguaje (como RankBrain, BERT, MUM), PageRank para autoridad de enlaces, señales de experiencia de página (Core Web Vitals).',
    iconName: 'Cpu',
    metrics: 'Más de 200 factores evaluados en ~0.2 segundos',
    color: 'from-violet-400 to-purple-500'
  },
  {
    stepNumber: 6,
    id: 'resultados',
    title: 'Resultados (SERP)',
    subtitle: 'Presentación al usuario',
    description: 'El motor genera y presenta la Página de Resultados del Motor de Búsqueda ordenada jerárquicamente, con fragmentos enriquecidos y respuestas directas.',
    technicalDetails: 'Fragmentos destacados (snippets), paneles de conocimiento, enlaces orgánicos, resultados patrocinados e imágenes integradas.',
    iconName: 'Layout',
    metrics: 'Entrega final completa en menos de 0.40 segundos',
    color: 'from-purple-500 to-pink-500'
  }
];

export const engineConcepts: EngineConcept[] = [
  {
    id: 'crawling',
    title: 'Crawling (Rastreo Web)',
    shortDesc: 'Descubrimiento sistemático de páginas mediante rastreadores web autónomos.',
    fullDesc: 'Proceso automatizado mediante el cual programas llamados bots, arañas o crawlers (como Googlebot o Bingbot) navegan por Internet siguiendo enlaces de una página a otra para descubrir contenido nuevo o modificado. Respetan el archivo robots.txt y los encabezados HTTP para no sobrecargar los servidores.',
    iconName: 'Compass',
    tags: ['Robots.txt', 'Spiders', 'Sitemaps'],
    example: 'Googlebot encuentra un nuevo artículo publicado en tu blog siguiendo el enlace colocado en la portada o a través del sitemap XML.'
  },
  {
    id: 'indexacion',
    title: 'Indexación (Indexing)',
    shortDesc: 'Organización y almacenamiento de contenido en una inmensa biblioteca digital.',
    fullDesc: 'Una vez rastreada una página, el motor analiza el código HTML, el texto, las imágenes y el significado conceptual para guardarla en su índice. Funciona de manera análoga al índice alfabético de un libro extenso: permite que cuando alguien busque una palabra clave, el motor la localice instantáneamente sin tener que escanear toda la web desde cero.',
    iconName: 'FileText',
    tags: ['Índice Inverso', 'Embeddings', 'Metadatos'],
    example: 'El motor asocia la URL de una receta con los términos "tarta de manzana", "postre casero" y "canela" en su base de datos indexada.'
  },
  {
    id: 'algoritmos',
    title: 'Algoritmos de Búsqueda',
    shortDesc: 'Modelos matemáticos y neuronales que deciden qué páginas son las más relevantes.',
    fullDesc: 'Sistemas informáticos altamente complejos que interpretan la intención detrás de cada consulta del usuario. Utilizan procesamiento de lenguaje natural (como BERT y MUM de Google) para comprender si una búsqueda es una pregunta, un deseo de compra o una navegación hacia una marca concreta.',
    iconName: 'Binary',
    tags: ['NLP', 'BERT', 'Machine Learning'],
    example: 'Comprender que en "banco para sentarse en parque" la palabra "banco" refiere a mobiliario urbano y no a una entidad financiera.'
  },
  {
    id: 'ranking',
    title: 'Ranking (Posicionamiento)',
    shortDesc: 'El orden de jerarquía en el que aparecen los resultados en la pantalla.',
    fullDesc: 'El algoritmo clasifica las páginas candidatas de mayor a menor puntuación según cientos de factores de calidad: autoridad del dominio, calidad de los enlaces entrantes (backlinks), velocidad de carga (Core Web Vitals), adaptación móvil y seguridad HTTPS.',
    iconName: 'BarChart3',
    tags: ['PageRank', 'SEO', 'Core Web Vitals'],
    example: 'Una página con contenido original, rápido y respaldado por sitios educativos (.edu) obtiene un ranking superior al de un sitio lento con texto copiado.'
  },
  {
    id: 'serp',
    title: 'SERP (Search Engine Results Page)',
    shortDesc: 'Página web final que contiene los enlaces y respuestas a la consulta formulada.',
    fullDesc: 'Acrónimo de Search Engine Results Page. Es la interfaz visible que recibe el usuario tras presionar Enter. La SERP moderna incluye anuncios pagados, enlaces orgánicos, fragmentos enriquecidos (rich snippets), carruseles de vídeo, paneles informativos de la Wikipedia y sugerencias de búsquedas relacionadas.',
    iconName: 'Monitor',
    tags: ['Snippets', 'Orgánico', 'Knowledge Graph'],
    example: 'La pantalla que ves con diez enlaces azules, un mapa local con tiendas cercanas y una caja con el clima actual.'
  },
  {
    id: 'relevancia',
    title: 'Relevancia',
    shortDesc: 'Nivel de ajuste entre lo que el usuario necesita y el contenido de la página.',
    fullDesc: 'La medida en que una página web responde con precisión, profundidad y veracidad a la consulta formulada. Los motores valoran el tiempo de permanencia del usuario, si la página resuelve la duda sin obligarlo a regresar atrás (dwell time) y la actualidad de la información.',
    iconName: 'Target',
    tags: ['Semántica', 'Calidad', 'Utilidad'],
    example: 'Si buscas "reparar grifo que gotea", una guía con fotos paso a paso tiene mucha mayor relevancia que una tienda general de fontanería.'
  },
  {
    id: 'intencion',
    title: 'Intención de Búsqueda (Search Intent)',
    shortDesc: 'El objetivo o propósito real y subyacente que tiene la persona al buscar.',
    fullDesc: 'Clasificada comúnmente en cuatro vertientes fundamentales: Informativa (desea aprender algo), Navegacional (quiere ir a una web específica), Transaccional (quiere comprar o contratar algo ya) y Comercial/Investigación (compara modelos antes de comprar).',
    iconName: 'Lightbulb',
    tags: ['User Intent', 'Comportamiento', 'Conversión'],
    example: 'La búsqueda "iPhone 16 opiniones" tiene intención comercial comparativa, mientras que "comprar iPhone 16 barato" es netamente transaccional.'
  },
  {
    id: 'organicos-patrocinados',
    title: 'Resultados Orgánicos vs. Patrocinados',
    shortDesc: 'La diferencia esencial entre enlaces ganados por mérito y enlaces pagados.',
    fullDesc: 'Los resultados orgánicos son elegidos exclusivamente por el algoritmo debido a su calidad y relevancia, sin que nadie pague por estar ahí (área de trabajo del SEO). Los resultados patrocinados (SEM/PPC) son anuncios pagados por anunciantes que pujan por palabras clave y se etiquetan claramente como "Patrocinado" o "Anuncio".',
    iconName: 'BadgePercent',
    tags: ['SEO', 'SEM', 'Google Ads'],
    example: 'Los primeros 2 resultados con la etiqueta "Patrocinado" son de una tienda que pagó por el clic; los siguientes 10 son resultados orgánicos seleccionados por su mérito.'
  },
  {
    id: 'fragmentos-destacados',
    title: 'Fragmentos Destacados (Featured Snippets)',
    shortDesc: 'Respuestas directas extraídas de una web que se muestran en la "posición cero".',
    fullDesc: 'Cajas especiales que aparecen en la parte más alta de la SERP con una respuesta concisa a preguntas directas ("qué es...", "cómo hacer...", "cuándo nació..."). Pueden presentarse en forma de párrafo, lista numerada, viñetas o tabla resumen con el enlace a la fuente original.',
    iconName: 'Sparkles',
    tags: ['Posición Cero', 'Quick Answer', 'Zero-Click'],
    example: 'Buscar "temperatura ebullición del agua" y obtener una tarjeta grande con "100 °C" sin necesidad de hacer clic en ningún enlace.'
  }
];

export const searchOperators: SearchOperator[] = [
  {
    id: 'comillas',
    operator: '"frase exacta"',
    syntax: '"palabra o frase"',
    name: 'Búsqueda por Frase Exacta',
    description: 'Obliga al motor de búsqueda a devolver resultados que contengan exactamente esas palabras en el mismo orden y consecutivamente, sin variaciones morfológicas ni omisiones.',
    example: '"inteligencia artificial generativa"',
    targetEngines: ['Google', 'Bing', 'DuckDuckGo', 'Brave', 'Ecosia'],
    category: 'contenido',
    notes: 'Ideal para encontrar citas exactas, mensajes de error de software o títulos de libros.'
  },
  {
    id: 'site',
    operator: 'site:',
    syntax: 'site:dominio.com término',
    name: 'Restricción por Sitio o Dominio',
    description: 'Limita los resultados exclusivamente a un sitio web específico o a un dominio de nivel superior (como .edu, .gob, .org o .es).',
    example: 'site:edu tecnología digital',
    targetEngines: ['Google', 'Bing', 'DuckDuckGo', 'Brave', 'Ecosia'],
    category: 'filtros',
    notes: 'Permite buscar dentro de páginas que no tienen su propio buscador interno o filtrar por fuentes académicas.'
  },
  {
    id: 'filetype',
    operator: 'filetype:',
    syntax: 'filetype:extension término',
    name: 'Filtro por Tipo de Archivo',
    description: 'Restringe la búsqueda a documentos que tengan un formato de archivo descargable determinado, como PDF, DOCX, PPTX, XLSX o CSV.',
    example: 'filetype:pdf inteligencia artificial',
    targetEngines: ['Google', 'Bing', 'DuckDuckGo', 'Brave', 'Ecosia'],
    category: 'filtros',
    notes: 'En algunos motores como DuckDuckGo o Bing también funciona el sinónimo ext: (ej. ext:pdf).'
  },
  {
    id: 'menos',
    operator: '-',
    syntax: 'término -palabraExcluida',
    name: 'Exclusión de Términos (NOT)',
    description: 'Excluye de los resultados cualquier página web que contenga la palabra especificada inmediatamente después del signo menos (sin espacio entre el guión y la palabra).',
    example: 'tecnología -móviles',
    targetEngines: ['Google', 'Bing', 'DuckDuckGo', 'Brave', 'Ecosia'],
    category: 'logica',
    notes: 'Fundamental para desambiguar términos con múltiples significados (ej: jaguar -coche -animal).'
  },
  {
    id: 'or',
    operator: 'OR',
    syntax: 'término1 OR término2',
    name: 'Operador Lógico Disyuntivo (OR)',
    description: 'Permite buscar páginas que contengan cualquiera de los términos indicados o ambos simultáneamente. Debe escribirse siempre en MAYÚSCULAS para que no sea interpretado como una palabra común.',
    example: 'IA OR "inteligencia artificial"',
    targetEngines: ['Google', 'Bing', 'DuckDuckGo', 'Brave', 'Ecosia'],
    category: 'logica',
    notes: 'También puede utilizarse el símbolo de barra vertical (|) como equivalente en Google.'
  },
  {
    id: 'intitle',
    operator: 'intitle:',
    syntax: 'intitle:palabra término',
    name: 'Búsqueda en el Título',
    description: 'Encuentra páginas web que contengan obligatoriamente la palabra especificada dentro de su etiqueta <title> HTML.',
    example: 'intitle:algoritmos "machine learning"',
    targetEngines: ['Google', 'Bing', 'DuckDuckGo', 'Brave'],
    category: 'contenido',
    notes: 'El título es la señal de relevancia temática más fuerte de una página web.'
  },
  {
    id: 'inurl',
    operator: 'inurl:',
    syntax: 'inurl:texto término',
    name: 'Búsqueda dentro de la URL',
    description: 'Restringe los resultados a páginas que contengan el fragmento de texto indicado dentro de su dirección web o URL.',
    example: 'inurl:tutoriales python',
    targetEngines: ['Google', 'Bing', 'DuckDuckGo', 'Brave'],
    category: 'contenido',
    notes: 'Muy útil para localizar subdirectorios específicos de blogs, foros o documentación.'
  },
  {
    id: 'before',
    operator: 'before:',
    syntax: 'before:AAAA-MM-DD término',
    name: 'Límite Temporal Anterior',
    description: 'Muestra únicamente páginas publicadas o indexadas antes de la fecha especificada en formato AAAA-MM-DD o solo año AAAA.',
    example: 'before:2020 "computación cuántica"',
    targetEngines: ['Google', 'DuckDuckGo'],
    category: 'temporal',
    notes: 'Excelente para investigaciones históricas o para evitar información desactualizada.'
  },
  {
    id: 'after',
    operator: 'after:',
    syntax: 'after:AAAA-MM-DD término',
    name: 'Límite Temporal Posterior',
    description: 'Muestra únicamente páginas publicadas o actualizadas con posterioridad a la fecha especificada.',
    example: 'after:2024-01-01 ciberseguridad tendencias',
    targetEngines: ['Google', 'DuckDuckGo'],
    category: 'temporal',
    notes: 'Crucial para encontrar noticias de última hora o avances tecnológicos recientes.'
  },
  {
    id: 'related',
    operator: 'related:',
    syntax: 'related:sitio.com',
    name: 'Sitios Web Similares',
    description: 'Encuentra páginas y plataformas que tengan una temática, estructura de enlaces o propósito similar a la URL indicada.',
    example: 'related:wikipedia.org',
    targetEngines: ['Google'],
    category: 'filtros',
    notes: 'Muy útil para descubrir competidores, fuentes alternativas o portales complementarios.'
  },
  {
    id: 'define',
    operator: 'define:',
    syntax: 'define:concepto',
    name: 'Definición de Diccionario',
    description: 'Muestra de forma prioritaria la definición lingüística o enciclopédica del término consultado.',
    example: 'define:blockchain',
    targetEngines: ['Google', 'Bing', 'DuckDuckGo'],
    category: 'contenido',
    notes: 'Evita artículos de opinión y va directo al significado formal de la palabra.'
  },
  {
    id: 'around',
    operator: 'AROUND(n)',
    syntax: 'término1 AROUND(n) término2',
    name: 'Proximidad de Palabras',
    description: 'Busca páginas donde dos términos aparezcan separados como máximo por un número "n" de palabras entre ellos.',
    example: 'criptografía AROUND(4) seguridad',
    targetEngines: ['Google'],
    category: 'contenido',
    notes: 'Permite encontrar relaciones estrechas entre conceptos sin exigir una frase idéntica.'
  }
];

export const keywordTypes: KeywordType[] = [
  {
    id: 'generales',
    name: 'Palabras Clave Generales (Head / Short-tail)',
    description: 'Términos amplios compuestos por 1 o 2 palabras con un volumen masivo de búsquedas pero con alta ambigüedad e intención poco definida.',
    characteristics: ['Volumen de búsqueda altísimo', 'Competencia feroz', 'Intención de búsqueda difusa'],
    exampleQuery: 'programación',
    intent: 'informativa',
    searchVolume: 'Alto',
    conversionRate: 'Baja'
  },
  {
    id: 'especificas',
    name: 'Palabras Clave Específicas (Medium-tail)',
    description: 'Consultas de 2 a 3 palabras que acotan mejor la temática y reducen la ambigüedad respecto a la necesidad del usuario.',
    characteristics: ['Volumen moderado', 'Mayor precisión', 'Intención más clara'],
    exampleQuery: 'curso de python online',
    intent: 'comercial',
    searchVolume: 'Medio',
    conversionRate: 'Media'
  },
  {
    id: 'long-tail',
    name: 'Palabras Clave de Cola Larga (Long-tail)',
    description: 'Consultas detalladas de 4 o más palabras formuladas como frases completas o preguntas. Tienen menor volumen individual pero una intención ultraprecisa.',
    characteristics: ['Bajo volumen individual', 'Suma acumulada del 70% de la web', 'Tasa de satisfacción y conversión muy alta'],
    exampleQuery: 'cómo aprender programación desde cero gratis para principiantes',
    intent: 'informativa',
    searchVolume: 'Bajo',
    conversionRate: 'Alta'
  },
  {
    id: 'informativas',
    name: 'Palabras Clave Informativas',
    description: 'Utilizadas cuando el usuario desea adquirir conocimiento, resolver una duda o comprender un concepto.',
    characteristics: ['Suelen empezar por "qué", "cómo", "cuándo", "guía"', 'Tráfico masivo de aprendizaje'],
    exampleQuery: 'cómo funciona el algoritmo de Google',
    intent: 'informativa',
    searchVolume: 'Alto',
    conversionRate: 'Baja'
  },
  {
    id: 'navegacionales',
    name: 'Palabras Clave Navegacionales',
    description: 'El usuario ya conoce la web, marca o herramienta a la que desea acceder y utiliza el buscador como atajo directo a la barra de direcciones.',
    characteristics: ['Nombres de marcas o servicios concretos', 'Un solo resultado dominante'],
    exampleQuery: 'github login',
    intent: 'navegacional',
    searchVolume: 'Alto',
    conversionRate: 'Media'
  },
  {
    id: 'transaccionales',
    name: 'Palabras Clave Transaccionales',
    description: 'Expresan una intención decidida de compra, descarga, registro o contratación en ese momento exacto.',
    characteristics: ['Incluyen palabras como "comprar", "precio", "descargar", "descuento"', 'Máximo valor comercial'],
    exampleQuery: 'comprar suscripción chatgpt plus españa',
    intent: 'transaccional',
    searchVolume: 'Medio',
    conversionRate: 'Alta'
  }
];

export const searchEngineComparisons: EngineComparison[] = [
  {
    id: 'google',
    name: 'Google',
    tagline: 'Líder global indiscutible en volumen, personalización y comprensión semántica.',
    logoColor: 'text-blue-400',
    privacyRating: 'Estándar (Uso de telemetría y perfiles de publicidad)',
    resultQuality: 'Sobresaliente. Líder en comprensión contextual y relevancia instantánea.',
    features: [
      'Modelos de IA integrados (Gemini / AI Overviews)',
      'Ecosistema conectado (Maps, Scholar, YouTube, Noticias)',
      'Soporte exhaustivo para casi todos los operadores avanzados',
      'Fragmentos destacados ricos y gráficos de conocimiento gigantescos'
    ],
    privacyPolicy: 'Personaliza los resultados rastreando historial, ubicación e interacciones para segmentación de anuncios.',
    highlightFunction: 'Knowledge Graph e IA multimodal capaz de interpretar preguntas complejas en lenguaje natural.',
    bestUseCases: [
      'Búsquedas cotidianas de máxima rapidez y precisión',
      'Consultas locales inmediatas con horarios y direcciones',
      'Investigación con operadores avanzados y Google Académico'
    ],
    indexingSource: 'Índice propio masivo (Googlebot)',
    officialUrl: 'https://www.google.com'
  },
  {
    id: 'bing',
    name: 'Microsoft Bing',
    tagline: 'Fuerte integración con Microsoft Copilot y destacada búsqueda visual y de multimedia.',
    logoColor: 'text-teal-400',
    privacyRating: 'Estándar (Personalización y publicidad de Microsoft Network)',
    resultQuality: 'Muy buena, especialmente sólida en idioma inglés, multimedia y documentos.',
    features: [
      'Asistente Copilot basado en modelos GPT integrados',
      'Búsqueda visual inversa y extracción de texto de imágenes',
      'Premios y programa Microsoft Rewards',
      'Integración profunda con Windows y el navegador Edge'
    ],
    privacyPolicy: 'Utiliza cookies y telemetría de cuenta Microsoft para optimizar resultados y publicidad dirigida.',
    highlightFunction: 'Respuestas conversacionales enriquecidas por IA generativa en paralelo a los resultados clásicos.',
    bestUseCases: [
      'Búsqueda multimedia (imágenes de alta resolución y vídeos filtrables)',
      'Consultas que se benefician de resúmenes generativos inmediatos',
      'Usuarios del ecosistema de Microsoft 365 y Windows'
    ],
    indexingSource: 'Índice propio (Bingbot)',
    officialUrl: 'https://www.bing.com'
  },
  {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    tagline: 'Pionero en la privacidad absoluta: búsquedas anónimas sin rastreadores ni burbujas de filtro.',
    logoColor: 'text-orange-400',
    privacyRating: 'Excelente (Cero almacenamiento de direcciones IP ni historial de búsqueda)',
    resultQuality: 'Buena a notable. Resultados limpios e idénticos para todos los usuarios.',
    features: [
      'Comandos !bangs para buscar directamente en más de 13.000 sitios web',
      'Sin burbuja de filtro (todos ven los mismos resultados)',
      'Protección contra rastreo y redirección segura',
      'Bloqueo de publicidad rastreadora intrusiva'
    ],
    privacyPolicy: 'No guarda ninguna información personal identificable. Los anuncios se basan únicamente en la palabra clave buscada en ese instante.',
    highlightFunction: '!Bangs (por ejemplo: escribir "!w tecnología" para buscar directamente dentro de Wikipedia).',
    bestUseCases: [
      'Usuarios preocupados por su privacidad y anonimato digital',
      'Investigaciones neutrales libres de sesgo algorítmico personalizado',
      'Navegación ágil mediante comandos !bang'
    ],
    indexingSource: 'Híbrido (rastreador propio DuckDuckBot + alianzas con Bing y fuentes abiertas)',
    officialUrl: 'https://duckduckgo.com'
  },
  {
    id: 'brave-search',
    name: 'Brave Search',
    tagline: 'Motor de búsqueda independiente con índice propio, 100% privado y sin sesgos de grandes tecnológicas.',
    logoColor: 'text-purple-400',
    privacyRating: 'Excelente (Cero perfiles de usuario, telemetría cifrada)',
    resultQuality: 'Muy alta y en constante crecimiento con su propio índice web independiente.',
    features: [
      'Índice completamente independiente (no depende de Google ni de Bing)',
      'Respuesta con IA (Answer with AI) privada',
      'Brave Goggles para aplicar filtros comunitarios personalizados a los resultados',
      'Transparencia algorítmica y sin censura comercial'
    ],
    privacyPolicy: 'No recopila consultas ni direcciones IP. El código y las fuentes del índice priorizan la soberanía del usuario.',
    highlightFunction: 'Brave Goggles: permite a los usuarios crear y aplicar reglas personalizadas para clasificar la web.',
    bestUseCases: [
      'Quienes buscan una alternativa real e independiente a los monopolios',
      'Desarrolladores y entusiastas de la tecnología de código abierto',
      'Consultas privadas con resúmenes inteligentes'
    ],
    indexingSource: 'Índice 100% propio e independiente (Brave Web Crawler)',
    officialUrl: 'https://search.brave.com'
  },
  {
    id: 'ecosia',
    name: 'Ecosia',
    tagline: 'El buscador ecológico que utiliza el 100% de sus beneficios para plantar árboles en el planeta.',
    logoColor: 'text-emerald-400',
    privacyRating: 'Muy buena (No vende datos a anunciantes y anonimiza búsquedas tras 7 días)',
    resultQuality: 'Notable. Resultados impulsados por el motor de Bing y algoritmos complementarios.',
    features: [
      'Más de 200 millones de árboles plantados en zonas deforestadas',
      'Servidores alimentados por energía 100% solar propia',
      'Informes mensuales de transparencia financiera abiertos al público',
      'Insignias verdes para organizaciones y empresas sostenibles'
    ],
    privacyPolicy: 'No crea perfiles personales permanentes de usuario y anonimiza las direcciones IP en un plazo de una semana.',
    highlightFunction: 'Contador de árboles personal e impacto ambiental medible con cada consulta realizada.',
    bestUseCases: [
      'Usuarios con conciencia ecológica que quieren generar impacto positivo mientras navegan',
      'Búsquedas cotidianas de información y ocio con resultados fiables',
      'Entornos escolares y oficinas con políticas de sostenibilidad'
    ],
    indexingSource: 'Resultados principales de Bing combinados con algoritmos de mejora de Ecosia',
    officialUrl: 'https://www.ecosia.org'
  }
];

export const searchStepsGuide: SearchStep[] = [
  {
    step: 1,
    title: 'Define qué información necesitas con exactitud',
    description: 'Antes de tocar el teclado, reflexiona sobre tu objetivo real: ¿buscas un dato puntual (ej. una fecha), un tutorial procedimental, una opinión crítica o un documento científico oficial?',
    actionableTip: 'Escribe tu duda en una frase mental completa antes de resumirla en palabras clave.',
    example: 'En lugar de pensar vagamente en "baterías", concreta: "necesito saber la vida útil promedio de una batería de litio en un smartphone".',
    category: 'preparacion'
  },
  {
    step: 2,
    title: 'Identifica las palabras clave principales',
    description: 'Elimina palabras vacías (artículos, preposiciones y fórmulas de cortesía como "hola", "por favor", "de", "los") que añaden ruido semántico innecesario.',
    actionableTip: 'Quédate solo con los sustantivos, verbos de acción y adjetivos técnicos fundamentales.',
    example: 'De "¿Cómo puedo arreglar un grifo que gotea en la cocina?" pasa a: "reparar grifo goteo cocina".',
    category: 'preparacion'
  },
  {
    step: 3,
    title: 'Determina la intención de búsqueda',
    description: 'Comprende si necesitas aprender (intención informativa), ir a una web concreta (navegacional) o realizar una acción/descarga (transaccional).',
    actionableTip: 'Adapta tus términos a la etapa en la que te encuentras.',
    example: 'Para aprender conceptos teóricos usa "guía", "qué es", "fundamentos". Para solucionar un problema usa "solución", "error", "paso a paso".',
    category: 'preparacion'
  },
  {
    step: 4,
    title: 'Utiliza palabras específicas y vocabulario técnico',
    description: 'Cuanto más preciso sea el léxico que utilices, más especializados y autoritarios serán los resultados que el algoritmo te devolverá.',
    actionableTip: 'Sustituye términos coloquiales por terminología profesional o científica del área.',
    example: 'En lugar de "hacer que la página cargue rápido", busca "optimizar Core Web Vitals rendimiento frontend".',
    category: 'ejecucion'
  },
  {
    step: 5,
    title: 'Utiliza operadores cuando sea necesario',
    description: 'No te limites a la búsqueda simple. Emplea comillas para frases exactas, site: para acotar dominios y filetype: para documentos limpios.',
    actionableTip: 'Los operadores ahorran decenas de minutos eliminando páginas irrelevantes de un solo golpe.',
    example: '"algoritmo de ordenamiento" site:edu filetype:pdf',
    category: 'ejecucion'
  },
  {
    step: 6,
    title: 'Compara diferentes fuentes',
    description: 'Nunca des por sentada la primera respuesta ni el fragmento destacado de la SERP. Revisa un mínimo de 3 fuentes con diferentes puntos de vista.',
    actionableTip: 'Abre pestañas en paralelo y busca si existe consenso entre los expertos del sector.',
    example: 'Si un blog afirma que cierta tecnología está obsoleta, contrasta con la documentación oficial y foros de ingeniería.',
    category: 'evaluacion'
  },
  {
    step: 7,
    title: 'Comprueba la fecha de publicación y frescura',
    description: 'En el sector tecnológico y médico, un artículo con más de dos años puede contener información desfasada, librerías deprecadas o normas obsoletas.',
    actionableTip: 'Utiliza el operador after: o el filtro temporal de herramientas para ver contenido del último año.',
    example: 'after:2024 "react server components" tutorial',
    category: 'evaluacion'
  },
  {
    step: 8,
    title: 'Evalúa la credibilidad y reputación de la fuente',
    description: 'Examina quién escribe: ¿es una universidad (.edu), un organismo gubernamental (.gob), un autor con biografía verificable o una granja de contenido anónima?',
    actionableTip: 'Aplica el método CRAAP: Currency (actualidad), Relevance (relevancia), Authority (autoridad), Accuracy (exactitud) y Purpose (propósito).',
    example: 'Prioriza un informe del IEEE, W3C o Mozilla Developer Network sobre un portal con anuncios intrusivos.',
    category: 'evaluacion'
  },
  {
    step: 9,
    title: 'Contrasta información importante (Lectura Lateral)',
    description: 'No te quedes dentro de la propia página para juzgar su fiabilidad. Abre otra pestaña y busca qué dicen otras fuentes reconocidas sobre ese autor o web.',
    actionableTip: 'Busca el nombre del sitio o autor entre comillas seguido de "crítica" o "controversia".',
    example: '"NombreDelSitio" calidad fiabilidad opiniones',
    category: 'evaluacion'
  },
  {
    step: 10,
    title: 'Guarda, etiqueta y organiza las fuentes útiles',
    description: 'El conocimiento encontrado pierde su utilidad si no puedes recuperarlo cuando vayas a redactar tu trabajo, informe o código.',
    actionableTip: 'Usa marcadores ordenados por carpetas, gestores de referencias (como Zotero o Notion) o guarda la consulta en tu panel de usuario.',
    example: 'Registra la URL, autor, fecha de consulta y una cita textual relevante con su página correspondiente.',
    category: 'evaluacion'
  }
];

export const smartTechniques: SmartTechnique[] = [
  {
    id: 'frases-exactas',
    title: 'Búsqueda Quirúrgica por Frases Exactas',
    category: 'Precisión',
    summary: 'Localización de códigos de error exactos, citas bibliográficas y nombres de funciones sin ambigüedad.',
    deepDive: 'Al envolver términos entre comillas dobles ("..."), desactivas el stemming o lematización que los buscadores aplican automáticamente. Es la técnica más rápida para diagnosticar fallos de programación o encontrar la atribución real de una frase célebre.',
    formula: '"TypeError: Cannot read properties of undefined (reading \'map\')"',
    iconName: 'Code',
    tags: ['Programación', 'Citas', 'Diagnóstico']
  },
  {
    id: 'dominios-institucionales',
    title: 'Filtrado por Dominios Gubernamentales y Académicos',
    category: 'Autoridad',
    summary: 'Extracción de datos oficiales sin ruido comercial ni opiniones no verificadas.',
    deepDive: 'Muchos países asignan dominios de primer nivel estrictamente controlados (.edu, .gob, .gov, .ac.uk). Al restringir la búsqueda a estos dominios mediante site:, te aseguras de acceder a publicaciones revisadas por pares o decretos legales vigentes.',
    formula: 'site:gob.es OR site:edu "energías renovables" estadísticas',
    iconName: 'Building',
    tags: ['Académico', 'Gobierno', 'Investigación']
  },
  {
    id: 'documentos-directos',
    title: 'Búsqueda Directa de Documentos y Libros Blancos',
    category: 'Recursos',
    summary: 'Omisión de páginas web superficiales para descargar directamente manuales, informes y tesis.',
    deepDive: 'La inmensa mayoría de informes de consultoras (Gartner, McKinsey), manuales técnicos y papers científicos están alojados en archivos PDF o presentaciones PPTX. Con filetype:pdf te saltas millones de artículos de blog creados con fines publicitarios.',
    formula: '"machine learning in healthcare" filetype:pdf site:edu',
    iconName: 'FileDown',
    tags: ['PDF', 'Papers', 'Manuales']
  },
  {
    id: 'filtrado-temporal',
    title: 'Restricción Cronológica Estricta',
    category: 'Frescura',
    summary: 'Control total sobre la antigüedad de la información mediante operadores de fecha.',
    deepDive: 'Con after:AAAA-MM-DD y before:AAAA-MM-DD puedes reconstruir la cobertura mediática de un evento tecnológico en el momento exacto en que ocurrió, o forzar al buscador a ignorar cualquier contenido previo al año actual.',
    formula: '"inteligencia artificial" after:2024-01-01 before:2024-12-31',
    iconName: 'Calendar',
    tags: ['Temporalidad', 'Tendencias', 'Historia']
  },
  {
    id: 'exclusion-ruido',
    title: 'Exclusión Quirúrgica de Términos Comerciales',
    category: 'Limpieza',
    summary: 'Eliminación sistemática de tiendas, precios y ofertas cuando solo buscas teoría.',
    deepDive: 'Si deseas investigar un dispositivo electrónico o software pero los resultados solo te muestran tiendas online intentando venderte el producto, añade operadores de resta para limpiar la SERP de ruido transaccional.',
    formula: 'python programación -curso -comprar -precio -oferta',
    iconName: 'FilterX',
    tags: ['Desambiguación', 'Filtro', 'Enfoque']
  },
  {
    id: 'combinacion-booleana',
    title: 'Combinación Compleja de Operadores Booleanos',
    category: 'Estructura',
    summary: 'Creación de consultas compuestas con paréntesis, OR lógico y anidamiento.',
    deepDive: 'Puedes estructurar consultas utilizando paréntesis para agrupar conceptos alternativos junto con filtros de sitio y tipo de archivo, igual que en una expresión algebraica lógica.',
    formula: '("ciberseguridad" OR "seguridad informática") (site:edu OR site:org) filetype:pdf',
    iconName: 'Layers',
    tags: ['Booleano', 'Álgebra', 'Lógica']
  },
  {
    id: 'academica-repositorios',
    title: 'Búsqueda en Repositorios Científicos y de Código',
    category: 'Especialización',
    summary: 'Aprovechamiento de motores especializados como Google Scholar, arXiv, PubMed y GitHub.',
    deepDive: 'Para investigaciones serias, los buscadores genéricos no indexan la profundidad de las bases de datos académicas (la llamada Deep Web académica). Acudir a scholar.google.com o utilizar operadores directos sobre arxiv.org garantiza acceso a fuentes primarias.',
    formula: 'site:arxiv.org/abs "quantum computing" OR "transformer architecture"',
    iconName: 'GraduationCap',
    tags: ['arXiv', 'Scholar', 'GitHub']
  },
  {
    id: 'verificacion-fuentes',
    title: 'Verificación de Fuentes y Lectura Lateral',
    category: 'Alfabetización',
    summary: 'Estrategias de fact-checking para identificar desinformación y sesgos informativos.',
    deepDive: 'La lectura lateral (usada por verificadores profesionales) consiste en salir de la página que estás leyendo para investigar en pestañas separadas quién es el autor, quién financia la organización y qué credenciales ostenta antes de aceptar cualquier afirmación.',
    formula: '"NombreDeLaOrganización" financiación controversia intereses',
    iconName: 'ShieldAlert',
    tags: ['Fact-Checking', 'CRAAP', 'Veracidad']
  }
];

export const glossaryTerms: GlossaryTerm[] = [
  {
    id: 'api',
    term: 'API (Interfaz de Programación de Aplicaciones)',
    acronym: 'API',
    category: 'web-protocolos',
    categoryLabel: 'Web y Protocolos',
    definition: 'Conjunto estructurado de reglas, especificaciones y protocolos que permite que dos aplicaciones de software independientes se comuniquen e intercambien datos entre sí.',
    technicalDetails: 'Arquitecturas comunes incluyen REST (JSON sobre HTTP), GraphQL y gRPC. Los buscadores ofrecen APIs para integrar resultados en aplicaciones externas.',
    relatedTerms: ['HTTP', 'Backend', 'JSON', 'Endpoints']
  },
  {
    id: 'ia',
    term: 'IA (Inteligencia Artificial)',
    acronym: 'IA',
    category: 'datos-ia',
    categoryLabel: 'Datos e IA',
    definition: 'Campo de la informática centrado en la creación de máquinas y programas capaces de simular procesos de inteligencia humana, como el aprendizaje, el razonamiento y la autocorrección.',
    technicalDetails: 'En los motores de búsqueda actuales, la IA se aplica para entender lenguaje coloquial, indexar contenido visual y generar respuestas sintetizadas en la SERP.',
    relatedTerms: ['Machine Learning', 'Algoritmo', 'BERT', 'NLP']
  },
  {
    id: 'algoritmo',
    term: 'Algoritmo',
    acronym: 'Algoritmo',
    category: 'datos-ia',
    categoryLabel: 'Datos e IA',
    definition: 'Secuencia finita, ordenada e inequívoca de instrucciones matemáticas y lógicas que toma unos datos de entrada, los procesa y produce un resultado o solución a un problema.',
    technicalDetails: 'Los motores de búsqueda emplean conjuntos de algoritmos (PageRank, RankBrain, HITS) que analizan cientos de variables en milisegundos para ordenar los resultados.',
    relatedTerms: ['Ranking', 'Machine Learning', 'Lógica']
  },
  {
    id: 'backend',
    term: 'Backend',
    acronym: 'Backend',
    category: 'web-protocolos',
    categoryLabel: 'Web y Protocolos',
    definition: 'Capa lógica y estructural de una aplicación web que se ejecuta en el servidor. Gestiona la lógica de negocio, autenticación, cálculos y conexión con bases de datos.',
    technicalDetails: 'Desarrollado en lenguajes como Node.js, Python, Go o Java. El backend es el encargado de responder a las peticiones del crawler enviando el código HTML renderizado.',
    relatedTerms: ['Frontend', 'Base de Datos', 'API', 'Servidor']
  },
  {
    id: 'frontend',
    term: 'Frontend',
    acronym: 'Frontend',
    category: 'web-protocolos',
    categoryLabel: 'Web y Protocolos',
    definition: 'Parte visual e interactiva de un sitio web que se ejecuta en el navegador del usuario final, compuesta por HTML para la estructura, CSS para el diseño y JavaScript para el dinamismo.',
    technicalDetails: 'La accesibilidad del frontend y el rendimiento del renderizado en navegadores (Core Web Vitals) son factores críticos de posicionamiento en buscadores.',
    relatedTerms: ['Backend', 'HTML', 'CSS', 'JavaScript']
  },
  {
    id: 'base-datos',
    term: 'Base de Datos (Database)',
    acronym: 'DB',
    category: 'datos-ia',
    categoryLabel: 'Datos e IA',
    definition: 'Sistema organizado y estructurado para almacenar, gestionar, consultar y recuperar grandes volúmenes de datos de forma rápida, eficiente y persistente.',
    technicalDetails: 'Pueden ser relacionales (SQL como PostgreSQL) o no relacionales (NoSQL como MongoDB o Firestore). Los motores de búsqueda emplean bases de datos distribuidas colosales.',
    relatedTerms: ['Big Data', 'Índice', 'Backend', 'Cloud Computing']
  },
  {
    id: 'cloud-computing',
    term: 'Cloud Computing (Computación en la Nube)',
    acronym: 'Cloud',
    category: 'web-protocolos',
    categoryLabel: 'Web y Protocolos',
    definition: 'Suministro de servicios informáticos (servidores, redes, analítica de datos e inteligencia artificial) a través de Internet sin necesidad de poseer infraestructura física propia.',
    technicalDetails: 'Modelos de servicio: IaaS (Infraestructura), PaaS (Plataforma) y SaaS (Software). Proveedores principales: Google Cloud Platform, AWS y Microsoft Azure.',
    relatedTerms: ['Edge Computing', 'Servidor', 'Big Data']
  },
  {
    id: 'cookie',
    term: 'Cookie',
    acronym: 'Cookie',
    category: 'seguridad-redes',
    categoryLabel: 'Seguridad y Redes',
    definition: 'Pequeño archivo de texto que un sitio web almacena en el navegador del usuario para recordar información de sesión, preferencias, carritos de compra o historial de navegación.',
    technicalDetails: 'Las cookies de origen gestionan sesiones; las cookies de terceros han sido ampliamente utilizadas para publicidad programática y están siendo reemplazadas por normativas de privacidad.',
    relatedTerms: ['HTTPS', 'Privacidad', 'Sesión', 'Metadata']
  },
  {
    id: 'dns',
    term: 'DNS (Sistema de Nombres de Dominio)',
    acronym: 'DNS',
    category: 'web-protocolos',
    categoryLabel: 'Web y Protocolos',
    definition: 'La "agenda telefónica" de Internet. Sistema jerárquico descentralizado que traduce nombres de dominio legibles por humanos (ej. google.com) en direcciones IP numéricas que las máquinas comprenden.',
    technicalDetails: 'Funciona mediante servidores raíz, servidores TLD y resolvedores recursivos que responden mediante consultas UDP/TCP en el puerto 53.',
    relatedTerms: ['IP', 'URL', 'HTTP']
  },
  {
    id: 'http',
    term: 'HTTP (Protocolo de Transferencia de Hipertexto)',
    acronym: 'HTTP',
    category: 'web-protocolos',
    categoryLabel: 'Web y Protocolos',
    definition: 'Protocolo de comunicación de la capa de aplicación que define el formato y la transmisión de mensajes entre navegadores web y servidores.',
    technicalDetails: 'Opera sin estado (stateless) sobre TCP/IP utilizando verbos como GET, POST, PUT, DELETE. Los datos viajan en texto plano sin cifrar.',
    relatedTerms: ['HTTPS', 'DNS', 'URL', 'API']
  },
  {
    id: 'https',
    term: 'HTTPS (HTTP Seguro)',
    acronym: 'HTTPS',
    category: 'seguridad-redes',
    categoryLabel: 'Seguridad y Redes',
    definition: 'Versión segura y cifrada del protocolo HTTP que utiliza certificados TLS/SSL para garantizar la autenticidad del servidor y la confidencialidad de la información transmitida.',
    technicalDetails: 'Protege contra ataques de intermediario (Man-in-the-Middle) e intercepción de datos. Los motores de búsqueda penalizan los sitios que no utilizan HTTPS.',
    relatedTerms: ['HTTP', 'Ciberseguridad', 'TLS/SSL']
  },
  {
    id: 'ip',
    term: 'Dirección IP (Protocolo de Internet)',
    acronym: 'IP',
    category: 'seguridad-redes',
    categoryLabel: 'Seguridad y Redes',
    definition: 'Etiqueta numérica única asignada a cada dispositivo conectado a una red informática que utiliza el Protocolo de Internet para su identificación y enrutamiento.',
    technicalDetails: 'IPv4 utiliza direcciones de 32 bits (ej. 192.168.1.1, ~4.300 millones en total); IPv6 utiliza 128 bits (ej. 2001:0db8::) proporcionando trillones de combinaciones.',
    relatedTerms: ['DNS', 'VPN', 'Redes 5G']
  },
  {
    id: 'machine-learning',
    term: 'Machine Learning',
    acronym: 'ML',
    category: 'datos-ia',
    categoryLabel: 'Datos e IA',
    definition: 'Rama de la inteligencia artificial enfocada en la creación de programas que aprenden automáticamente de la experiencia y mejoran su rendimiento mediante entrenamiento sobre datos.',
    technicalDetails: 'Se divide en aprendizaje supervisado, no supervisado y por refuerzo. En los buscadores se usa para detectar intención, eliminar spam y personalizar rankings.',
    relatedTerms: ['IA', 'Algoritmo', 'Big Data']
  },
  {
    id: 'metadata',
    term: 'Metadatos (Metadata)',
    acronym: 'Metadata',
    category: 'busqueda-seo',
    categoryLabel: 'Búsqueda y SEO',
    definition: 'Datos que proporcionan información y descripción sobre otros datos. En la web, son etiquetas que resumen el contenido de una página para navegadores y motores de búsqueda.',
    technicalDetails: 'Incluye meta-etiquetas como title, description, viewport, robots y Open Graph tags para redes sociales. Clave para la indexación limpia.',
    relatedTerms: ['SEO', 'SERP', 'Indexación']
  },
  {
    id: 'seo',
    term: 'SEO (Optimización para Motores de Búsqueda)',
    acronym: 'SEO',
    category: 'busqueda-seo',
    categoryLabel: 'Búsqueda y SEO',
    definition: 'Conjunto de técnicas, estrategias y optimizaciones técnicas aplicadas a un sitio web para mejorar su visibilidad y ranking en los resultados orgánicos de los buscadores.',
    technicalDetails: 'Abarca SEO On-page (contenido, palabras clave, arquitectura), SEO Técnico (velocidad, sitemaps, datos estructurados) y SEO Off-page (enlaces de autoridad o backlinks).',
    relatedTerms: ['SERP', 'Palabras Clave', 'Crawling', 'Ranking']
  },
  {
    id: 'serp',
    term: 'SERP (Página de Resultados del Motor de Búsqueda)',
    acronym: 'SERP',
    category: 'busqueda-seo',
    categoryLabel: 'Búsqueda y SEO',
    definition: 'Página web generada dinámicamente por un motor de búsqueda que muestra la lista ordenada de resultados correspondientes a la consulta ingresada por el usuario.',
    technicalDetails: 'Incluye enlaces orgánicos, carruseles de imágenes, respuestas generadas por IA, tarjetas locales y bloques publicitarios.',
    relatedTerms: ['SEO', 'Ranking', 'Snippet']
  },
  {
    id: 'url',
    term: 'URL (Localizador Uniforme de Recursos)',
    acronym: 'URL',
    category: 'web-protocolos',
    categoryLabel: 'Web y Protocolos',
    definition: 'Dirección global y única asignada a un recurso específico en Internet, que especifica tanto su ubicación como el mecanismo utilizado para recuperarlo.',
    technicalDetails: 'Estructura estándar: protocolo (https://) + subdominio (www.) + dominio (ejemplo.com) + ruta (/directorio/pagina.html) + parámetros (?query=valor).',
    relatedTerms: ['HTTP', 'DNS', 'IP']
  },
  {
    id: 'vpn',
    term: 'VPN (Red Privada Virtual)',
    acronym: 'VPN',
    category: 'seguridad-redes',
    categoryLabel: 'Seguridad y Redes',
    definition: 'Tecnología de red que crea una conexión cifrada y segura a través de una red pública como Internet, ocultando la dirección IP real del usuario y protegiendo su tráfico.',
    technicalDetails: 'Canaliza los paquetes mediante túneles cifrados (usando protocolos como WireGuard u OpenVPN), lo que permite navegar simulando una ubicación geográfica diferente.',
    relatedTerms: ['IP', 'Ciberseguridad', 'HTTPS']
  },
  {
    id: 'web-crawler',
    term: 'Web Crawler (Rastreador Web / Spider)',
    acronym: 'Crawler',
    category: 'busqueda-seo',
    categoryLabel: 'Búsqueda y SEO',
    definition: 'Bot o programa informático automatizado que recorre metódica y continuamente la World Wide Web para recopilar información de páginas y alimentar el índice de un buscador.',
    technicalDetails: 'Sigue hipervínculos, respeta directivas del archivo robots.txt (crawl-delay, disallow) y gestiona un presupuesto de rastreo (crawl budget) por servidor.',
    relatedTerms: ['Crawling', 'Indexación', 'SEO', 'Robots.txt']
  }
];

export const sampleCuratedQueries: { [key: string]: { query: string; description: string; site?: string; filetype?: string; exact?: string } } = {
  academico: {
    query: '"inteligencia artificial" site:edu filetype:pdf',
    description: 'Investigación académica y papers científicos sobre IA publicados en universidades.',
    site: 'edu',
    filetype: 'pdf',
    exact: 'inteligencia artificial'
  },
  gobierno: {
    query: '"ciberseguridad" site:gob.es OR site:gov filetype:pdf -noticias',
    description: 'Informes y leyes oficiales sobre ciberseguridad excluyendo notas de prensa.',
    site: 'gob.es',
    filetype: 'pdf',
    exact: 'ciberseguridad'
  },
  codigo: {
    query: 'site:github.com "machine learning" -tutorial "MIT License"',
    description: 'Repositorios reales de código abierto con licencia MIT excluyendo cursos básicos.',
    site: 'github.com',
    exact: 'MIT License'
  },
  manuales: {
    query: '"edge computing" filetype:pdf intitle:manual OR intitle:guide',
    description: 'Manuales y guías técnicas en formato PDF sobre computación en el borde.',
    filetype: 'pdf',
    exact: 'edge computing'
  }
};
