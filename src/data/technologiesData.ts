import { DigitalTech } from '../types';

export const technologiesData: DigitalTech[] = [
  {
    id: 'ia',
    name: 'Inteligencia Artificial (IA)',
    category: 'ia-datos',
    categoryLabel: 'IA y Datos',
    iconName: 'Brain',
    definition: 'Disciplina de las ciencias de la computación dedicada a crear sistemas capaces de realizar tareas que tradicionalmente requerían inteligencia humana, como el razonamiento, la percepción visual y la toma de decisiones.',
    practicalExample: 'Un asistente virtual que comprende preguntas en lenguaje natural y resume documentos extensos en segundos.',
    currentApplications: [
      'Diagnóstico asistido por imágenes médicas',
      'Motores de búsqueda semántica y generativa',
      'Traducción simultánea multilingüe',
      'Vehículos autónomos y navegación predictiva'
    ],
    keyBenefit: 'Automatización de procesos cognitivos complejos a gran velocidad.'
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning (Aprendizaje Automático)',
    category: 'ia-datos',
    categoryLabel: 'IA y Datos',
    iconName: 'Cpu',
    definition: 'Subcampo de la inteligencia artificial que desarrolla algoritmos capaces de aprender patrones a partir de datos históricos y mejorar su precisión de forma autónoma sin ser explícitamente reprogramados.',
    practicalExample: 'Un filtro de correo que aprende a clasificar spam analizando miles de mensajes marcados previamente por los usuarios.',
    currentApplications: [
      'Sistemas de recomendación en plataformas de streaming (Netflix, Spotify)',
      'Detección de fraudes en transacciones bancarias en tiempo real',
      'Modelos climáticos y meteorológicos predictivos',
      'Visión por computadora para control de calidad industrial'
    ],
    keyBenefit: 'Descubrimiento de patrones ocultos en conjuntos de datos masivos.'
  },
  {
    id: 'cloud-computing',
    name: 'Computación en la Nube (Cloud Computing)',
    category: 'infraestructura-redes',
    categoryLabel: 'Infraestructura y Redes',
    iconName: 'Cloud',
    definition: 'Entrega bajo demanda de recursos informáticos (almacenamiento, servidores, bases de datos, redes y software) a través de Internet con un modelo de pago por uso flexible.',
    practicalExample: 'Editar una hoja de cálculo colaborativa simultáneamente con colegas de diferentes países sin almacenar el archivo en tu disco local.',
    currentApplications: [
      'Servicios de almacenamiento y sincronización (Google Drive, Dropbox)',
      'Plataformas de computación elástica (AWS, Google Cloud, Azure)',
      'Software como Servicio (SaaS) para gestión empresarial (CRM, ERP)',
      'Copias de seguridad y recuperación ante desastres automatizadas'
    ],
    keyBenefit: 'Escalabilidad instantánea y reducción drástica de costos de infraestructura física.'
  },
  {
    id: 'big-data',
    name: 'Big Data',
    category: 'ia-datos',
    categoryLabel: 'IA y Datos',
    iconName: 'Database',
    definition: 'Conjuntos de datos cuyo volumen, velocidad de generación y variedad superan la capacidad de las herramientas de software de bases de datos tradicionales para capturar, gestionar y procesar.',
    practicalExample: 'Analizar millones de registros de telemetría por minuto de una flota de aviones para predecir fallos mecánicos antes del despegue.',
    currentApplications: [
      'Monitoreo epidemiológico y salud pública a nivel global',
      'Optimización de rutas logísticas y cadenas de suministro',
      'Análisis de sentimientos en redes sociales durante campañas',
      'Personalización masiva en comercio electrónico'
    ],
    keyBenefit: 'Toma de decisiones fundamentada en evidencia estadística rigurosa.'
  },
  {
    id: 'iot',
    name: 'Internet de las Cosas (IoT)',
    category: 'infraestructura-redes',
    categoryLabel: 'Infraestructura y Redes',
    iconName: 'Wifi',
    definition: 'Red de objetos físicos cotidianos equipados con sensores, software y conectividad que recopilan e intercambian datos entre sí y con sistemas centrales a través de Internet.',
    practicalExample: 'Un termostato inteligente que ajusta la temperatura de casa basándose en tu ubicación GPS y las previsiones meteorológicas.',
    currentApplications: [
      'Ciudades inteligentes con alumbrado público adaptativo y gestión de residuos',
      'Monitoreo remoto de pacientes mediante biosensores continuos',
      'Agricultura de precisión con sensores de humedad en suelo',
      'Mantenimiento predictivo en maquinaria industrial'
    ],
    keyBenefit: 'Puente continuo entre el mundo físico y los sistemas digitales.'
  },
  {
    id: 'blockchain',
    name: 'Blockchain (Cadena de Bloques)',
    category: 'infraestructura-redes',
    categoryLabel: 'Infraestructura y Redes',
    iconName: 'Link',
    definition: 'Estructura de datos descentralizada y criptográficamente segura que registra transacciones en un libro de contabilidad distribuido e inmutable compartido entre nodos de una red.',
    practicalExample: 'Rastrear el origen exacto de un lote de alimentos desde la granja de cultivo hasta el supermercado sin intermediarios manipulables.',
    currentApplications: [
      'Criptoactivos y finanzas descentralizadas (DeFi)',
      'Contratos inteligentes autoejecutables para acuerdos comerciales',
      'Gestión de identidad digital soberana y credenciales académicas',
      'Trazabilidad en aduanas y cadenas de suministro globales'
    ],
    keyBenefit: 'Confianza y verificación sin necesidad de una autoridad centralizada.'
  },
  {
    id: 'ciberseguridad',
    name: 'Ciberseguridad',
    category: 'infraestructura-redes',
    categoryLabel: 'Infraestructura y Redes',
    iconName: 'ShieldCheck',
    definition: 'Práctica de proteger sistemas informáticos, redes, dispositivos y datos confidenciales contra ataques digitales maliciosos, accesos no autorizados o daños.',
    practicalExample: 'La autenticación de dos factores (2FA) que solicita un código temporal en tu teléfono además de tu contraseña para acceder a tu banco.',
    currentApplications: [
      'Cifrado de extremo a extremo en mensajería y pagos',
      'Sistemas de prevención y detección de intrusiones (IDS/IPS)',
      'Arquitecturas de seguridad Zero Trust (confianza cero)',
      'Gestión y respuesta a incidentes de ransomware'
    ],
    keyBenefit: 'Preservación de la confidencialidad, integridad y disponibilidad digital.'
  },
  {
    id: 'realidad-virtual',
    name: 'Realidad Virtual (VR)',
    category: 'automatizacion-inmersion',
    categoryLabel: 'Automatización e Inmersión',
    iconName: 'Glasses',
    definition: 'Tecnología informática que genera un entorno tridimensional interactivo y completamente inmersivo que sustituye la percepción del mundo real mediante visores sensoriales.',
    practicalExample: 'Un estudiante de medicina practicando una compleja cirugía cerebral en un simulador virtual antes de intervenir a un paciente real.',
    currentApplications: [
      'Entrenamiento de pilotos de aviación y misiones espaciales',
      'Educación médica y visualización anatómica interactiva',
      'Visualización arquitectónica de edificios antes de construirlos',
      'Videojuegos y experiencias artísticas inmersivas'
    ],
    keyBenefit: 'Simulación de situaciones de alto riesgo sin peligro real ni costo de materiales.'
  },
  {
    id: 'realidad-aumentada',
    name: 'Realidad Aumentada (AR)',
    category: 'automatizacion-inmersion',
    categoryLabel: 'Automatización e Inmersión',
    iconName: 'Layers',
    definition: 'Tecnología que superpone elementos digitales computarizados (gráficos, textos, modelos 3D o audio) directamente sobre la visión del entorno real en tiempo real.',
    practicalExample: 'Apuntar la cámara de tu teléfono a una calle desconocida y ver flotando flechas de dirección y calificaciones de comercios sobre el asfalto.',
    currentApplications: [
      'Aplicaciones de navegación peatonal guiada por cámara',
      'Visualización de muebles en tu salón antes de comprarlos (IKEA)',
      'Asistencia remota a técnicos de mantenimiento en fábricas',
      'Traducción visual instantánea de carteles y menús'
    ],
    keyBenefit: 'Enriquecimiento contextual de la realidad sin desconectar al usuario de su entorno.'
  },
  {
    id: 'automatizacion',
    name: 'Automatización Digital (RPA)',
    category: 'automatizacion-inmersion',
    categoryLabel: 'Automatización e Inmersión',
    iconName: 'Workflow',
    definition: 'Uso de software, secuencias de comandos y robots lógicos para ejecutar tareas repetitivas y estructuradas con mínima o nula intervención humana directa.',
    practicalExample: 'Un bot que descarga facturas de correos electrónicos, extrae los importes con OCR y las registra automáticamente en el sistema contable.',
    currentApplications: [
      'Automatización Robótica de Procesos (RPA) en oficinas y bancos',
      'Canalizaciones de integración y despliegue continuo de software (CI/CD)',
      'Respuestas automáticas inteligentes en servicio al cliente',
      'Gestión automatizada de inventario y pedidos'
    ],
    keyBenefit: 'Eliminación del error humano y liberación de tiempo para tareas de alto valor.'
  },
  {
    id: 'robotica',
    name: 'Robótica Avanzada',
    category: 'automatizacion-inmersion',
    categoryLabel: 'Automatización e Inmersión',
    iconName: 'Bot',
    definition: 'Rama de la ingeniería que combina mecánica, electrónica y computación para diseñar y construir máquinas físicas autónomas o semiautónomas capaces de interactuar con el entorno.',
    practicalExample: 'Robots móviles autónomos que clasifican y transportan paquetes en almacenes logísticos coordinados por algoritmos centrales.',
    currentApplications: [
      'Brazos robóticos en líneas de ensamblaje automotriz de alta precisión',
      'Cirugía asistida de precisión milimétrica (Sistema Da Vinci)',
      'Exploración de terrenos extremos (rovers en Marte, fondos oceánicos)',
      'Robots colaborativos (cobots) que trabajan junto a humanos en fábricas'
    ],
    keyBenefit: 'Ejecución de trabajos físicos de extrema precisión, fuerza o peligro.'
  },
  {
    id: 'redes-5g',
    name: 'Redes 5G',
    category: 'infraestructura-redes',
    categoryLabel: 'Infraestructura y Redes',
    iconName: 'Radio',
    definition: 'Quinta generación de tecnología de comunicación inalámbrica celular, caracterizada por velocidades de transmisión gigabit, latencia ultrabaja (menor a 5 ms) y masiva densidad de conexión.',
    practicalExample: 'La comunicación instantánea entre dos vehículos que circulan a 120 km/h para evitar una colisión antes de que los conductores puedan reaccionar.',
    currentApplications: [
      'Cirugías remotas transmitidas en tiempo real sin desfase',
      'Redes masivas de sensores IoT en metrópolis inteligentes',
      'Transmisión de vídeo 8K y streaming de juegos en la nube sin retardo',
      'Control remoto de maquinaria pesada en minería a cielo abierto'
    ],
    keyBenefit: 'Conectividad casi instantánea con capacidad para conectar millones de dispositivos por km².'
  },
  {
    id: 'edge-computing',
    name: 'Edge Computing (Computación en el Borde)',
    category: 'infraestructura-redes',
    categoryLabel: 'Infraestructura y Redes',
    iconName: 'HardDrive',
    definition: 'Paradigma de computación distribuida que procesa los datos lo más cerca posible del lugar físico donde se generan (el "borde" de la red), en lugar de enviarlos a un centro de datos lejano.',
    practicalExample: 'Una cámara de tráfico que detecta peatones y activa frenos mediante un procesador interno en milisegundos sin esperar respuesta de la nube.',
    currentApplications: [
      'Sistemas de seguridad en vehículos autónomos de respuesta crítica',
      'Cámaras industriales con visión artificial integrada',
      'Dispositivos médicos portátiles de alerta cardiovascular inmediata',
      'Estaciones de energía inteligentes que regulan voltaje localmente'
    ],
    keyBenefit: 'Latencia mínima, menor consumo de ancho de banda y funcionamiento continuo sin conexión.'
  }
];
