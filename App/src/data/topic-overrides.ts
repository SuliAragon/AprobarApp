import type { TestPreset } from "./question-bank";

export interface TopicVisualScheme {
  title: string;
  description: string;
  assetPath: string;
  sourceFilename: string;
}

export interface TopicOverride {
  title: string;
  shortTitle: string;
  description: string;
  summary: string[];
  sections: string[];
  accent: "emerald" | "amber" | "coral" | "azure";
  testPresets: TestPreset[];
  visualScheme?: TopicVisualScheme;
}

export const topicOverrides: Record<string, TopicOverride> = {
  B1T1: {
    title: "La Constitución Española de 1978, derechos y deberes, garantías y Corona",
    shortTitle: "Constitución Española",
    description:
      "Tema específico del bloque constitucional con estructura de la CE, Título Preliminar, Título I, garantías, suspensión de derechos y funciones del Rey.",
    summary: [
      "Fechas clave de la Constitución de 1978: aprobación, referéndum, sanción, publicación y entrada en vigor.",
      "Estructura interna y material de la CE: Título Preliminar, Título I y títulos orgánicos.",
      "Derechos fundamentales, derechos y deberes de los ciudadanos y principios rectores.",
      "Garantías del artículo 53, Defensor del Pueblo y suspensión del artículo 55.",
      "Corona, sucesión, Regencia, tutela del Rey y funciones constitucionales del monarca.",
    ],
    sections: [
      "Introducción y características",
      "Estructura y Título Preliminar",
      "Derechos fundamentales y libertades públicas",
      "Derechos y deberes de los ciudadanos",
      "Principios rectores",
      "Garantías, suspensión y tutela",
      "Corona y funciones del Rey",
    ],
    accent: "emerald",
    testPresets: [
      {
        slug: "fundamentos-y-estructura",
        title: "Test 1 · Fundamentos y estructura",
        description: "Refuerza fechas clave, características de la Constitución y organización del Título Preliminar.",
        focusSections: ["introduccion", "caracteristicas", "estructura", "titulo-preliminar"],
      },
      {
        slug: "derechos-fundamentales",
        title: "Test 2 · Derechos fundamentales",
        description: "Entrena artículos 14 a 29, libertades públicas y tutela judicial efectiva.",
        focusSections: ["derechos-fundamentales"],
      },
      {
        slug: "ciudadania-y-principios",
        title: "Test 3 · Ciudadanía y principios rectores",
        description: "Combina artículos 30 a 52 con enfoque en deberes, trabajo, vivienda y consumo.",
        focusSections: ["derechos-ciudadanos", "principios-rectores"],
      },
      {
        slug: "garantias-y-suspension",
        title: "Test 4 · Garantías y suspensión",
        description: "Se centra en artículo 53, Defensor del Pueblo y suspensión de derechos.",
        focusSections: ["garantias-suspension"],
      },
      {
        slug: "corona-y-rey",
        title: "Test 5 · Corona y funciones del Rey",
        description: "Repasa sucesión, Regencia, tutela y funciones constitucionales del monarca.",
        focusSections: ["corona"],
      },
    ],
  },
  B1T2: {
    title: "Las Cortes Generales, el Tribunal Constitucional y el Defensor del Pueblo",
    shortTitle: "Cortes Generales",
    description:
      "Tema del bloque constitucional centrado en Congreso y Senado, elaboración de las leyes, tratados internacionales, Tribunal Constitucional y Defensor del Pueblo.",
    summary: [
      "Estructura y funciones de las Cortes Generales, con reglas sobre sesiones, órganos, inmunidad parlamentaria y adopción de acuerdos.",
      "Composición, sistema electoral y atribuciones generales del Congreso de los Diputados y del Senado.",
      "Producción normativa: leyes orgánicas, ordinarias, delegación legislativa, decretos-leyes, iniciativa legislativa y referéndum.",
      "Marco constitucional de los tratados internacionales y control de su compatibilidad con la Constitución.",
      "Composición, atribuciones y legitimación del Tribunal Constitucional, junto con la regulación básica del Defensor del Pueblo.",
    ],
    sections: [
      "Cortes Generales: estructura, funcionamiento y garantías",
      "Congreso de los Diputados",
      "Senado y representación territorial",
      "Elaboración de las leyes y referéndum",
      "Tratados internacionales",
      "Tribunal Constitucional",
      "Defensor del Pueblo",
    ],
    accent: "emerald",
    testPresets: [
      {
        slug: "fundamentos-y-camaras",
        title: "Test 1 · Fundamentos y Cámaras",
        description: "Repasa estructura constitucional de las Cortes, funcionamiento parlamentario y claves del Congreso.",
        focusSections: ["cortes-generales", "congreso"],
      },
      {
        slug: "congreso-y-senado",
        title: "Test 2 · Congreso y Senado",
        description: "Entrena composición, sistema electoral y diferencias entre Cámara Baja y Cámara Alta.",
        focusSections: ["congreso", "senado"],
      },
      {
        slug: "procedimiento-legislativo",
        title: "Test 3 · Procedimiento legislativo",
        description: "Se centra en leyes orgánicas, leyes ordinarias, delegación legislativa, decretos-leyes, iniciativa y referéndum.",
        focusSections: ["elaboracion-leyes"],
      },
      {
        slug: "tribunal-constitucional",
        title: "Test 4 · Tribunal Constitucional",
        description: "Refuerza composición, incompatibilidades, competencias, legitimación y efectos de las sentencias del TC.",
        focusSections: ["tribunal-constitucional"],
      },
      {
        slug: "defensor-y-garantias",
        title: "Test 5 · Defensor y garantías institucionales",
        description: "Combina Defensor del Pueblo, recursos constitucionales y protección institucional de los derechos.",
        focusSections: ["defensor-del-pueblo", "tribunal-constitucional"],
      },
    ],
  },
  B1T3: {
    title: "El Gobierno: composición, nombramiento y cese, funciones y relaciones con las Cortes Generales",
    shortTitle: "El Gobierno",
    description:
      "Tema del bloque constitucional centrado en el Gobierno, sus miembros, órganos de apoyo, investidura, cese, funciones constitucionales y control parlamentario.",
    summary: [
      "Marco constitucional y legal del Gobierno a partir de los Títulos IV y V de la Constitución, junto con la Ley del Gobierno y la Ley 40/2015.",
      "Composición del Gobierno, distinción entre órganos unipersonales y colegiados, y papel del Presidente, Vicepresidentes y Ministros.",
      "Órganos de colaboración y apoyo, estatuto jurídico, incompatibilidades y responsabilidad de los miembros del Gobierno y Secretarios de Estado.",
      "Nombramiento, investidura, cese y régimen del Gobierno en funciones, con especial atención a la disolución de las Cámaras y a la continuidad del Ejecutivo.",
      "Funciones del Gobierno y relaciones con las Cortes Generales: confianza, moción de censura, presupuestos, referéndum y estados de alarma, excepción y sitio.",
    ],
    sections: [
      "Marco constitucional y composición",
      "Órganos de apoyo y estatuto",
      "Nombramiento, investidura y cese",
      "Funciones del Gobierno",
      "Relaciones con las Cortes Generales",
    ],
    accent: "emerald",
    testPresets: [
      {
        slug: "fundamentos-y-composicion",
        title: "Test 1 · Fundamentos y composición",
        description: "Repasa artículos básicos, miembros del Gobierno, órganos colegiados y estructura general del Ejecutivo.",
        focusSections: ["marco-constitucional-y-composicion"],
      },
      {
        slug: "organos-y-estatuto",
        title: "Test 2 · Órganos y estatuto",
        description: "Se centra en Comisión General, Secretaría del Consejo, Consejo de Estado, Secretarios de Estado y responsabilidad jurídica.",
        focusSections: ["organos-de-apoyo-y-estatuto"],
      },
      {
        slug: "nombramiento-investidura-y-cese",
        title: "Test 3 · Nombramiento, investidura y cese",
        description: "Trabaja propuesta de candidato, votaciones de investidura, cese, disolución de Cámaras y Gobierno en funciones.",
        focusSections: ["nombramiento-investidura-y-cese"],
      },
      {
        slug: "funciones-del-gobierno",
        title: "Test 4 · Funciones del Gobierno",
        description: "Refuerza potestad reglamentaria, función ejecutiva, iniciativa legislativa y atribuciones del Presidente y del Consejo de Ministros.",
        focusSections: ["funciones-del-gobierno"],
      },
      {
        slug: "relaciones-con-las-cortes",
        title: "Test 5 · Relaciones con las Cortes",
        description: "Entrena cuestión de confianza, moción de censura, control parlamentario, presupuestos, referéndum y estados excepcionales.",
        focusSections: ["relaciones-con-las-cortes"],
      },
    ],
  },
  B1T4: {
    title: "Gobierno Abierto, transparencia, acceso a la informacion publica, buen gobierno y Agenda 2030",
    shortTitle: "Transparencia y Agenda 2030",
    description:
      "Tema del bloque constitucional sobre Gobierno Abierto, la Ley 19/2013, publicidad activa, derecho de acceso, buen gobierno, Consejo de Transparencia y Objetivos de Desarrollo Sostenible.",
    summary: [
      "Principios de Gobierno Abierto: transparencia, participacion, colaboracion, innovacion y rendicion de cuentas, junto con el papel de la OGP.",
      "Ambito y obligaciones de la Ley 19/2013, con especial atencion a publicidad activa, Portal de Transparencia e informacion institucional, juridica y economica.",
      "Derecho de acceso a la informacion publica: solicitud, limites, proteccion de datos, acceso parcial, inadmisiones, plazos y reclamacion.",
      "Principios de buen gobierno y funciones del Consejo de Transparencia y Buen Gobierno en el control de las obligaciones legales.",
      "Agenda 2030, las cinco P y los 17 Objetivos de Desarrollo Sostenible como marco integrado de desarrollo sostenible.",
    ],
    sections: [
      "Gobierno Abierto y principios informadores",
      "Ley 19/2013: publicidad activa",
      "Derecho de acceso a la informacion publica",
      "Buen gobierno y Consejo de Transparencia",
      "Agenda 2030 y Objetivos de Desarrollo Sostenible",
    ],
    accent: "emerald",
    testPresets: [
      {
        slug: "gobierno-abierto",
        title: "Test 1 · Gobierno Abierto",
        description: "Repasa transparencia, participacion, colaboracion, rendicion de cuentas, OGP y planes de accion.",
        focusSections: ["gobierno-abierto"],
      },
      {
        slug: "publicidad-activa",
        title: "Test 2 · Publicidad activa",
        description: "Entrena ambito subjetivo, informacion institucional, juridica y economica, Portal y principios tecnicos.",
        focusSections: ["publicidad-activa"],
      },
      {
        slug: "derecho-acceso",
        title: "Test 3 · Derecho de acceso",
        description: "Trabaja informacion publica, limites, datos personales, terceros, inadmisiones, acceso parcial y plazos.",
        focusSections: ["derecho-acceso"],
      },
      {
        slug: "buen-gobierno-y-consejo",
        title: "Test 4 · Buen gobierno y Consejo",
        description: "Refuerza altos cargos, principios de actuacion, infracciones y funciones del Consejo de Transparencia.",
        focusSections: ["buen-gobierno-y-consejo"],
      },
      {
        slug: "agenda-2030-y-ods",
        title: "Test 5 · Agenda 2030 y ODS",
        description: "Repasa las cinco P, los 17 ODS, sus metas, universalidad y los objetivos mas preguntables.",
        focusSections: ["agenda-2030-y-ods"],
      },
    ],
  },
  B2T3: {
    title: "Tipos abstractos y estructuras de datos, algoritmos, ficheros y formatos",
    shortTitle: "Estructuras de datos",
    description:
      "Tema específico del bloque técnico con TAD, arrays, listas, pilas, colas, árboles, grafos, algoritmos, organizaciones de ficheros y formatos.",
    summary: [
      "Distinción entre tipo de dato, TAD y estructura de datos, con sus clasificaciones principales.",
      "Estructuras lineales y no lineales: arrays, listas, pilas, colas, árboles y grafos.",
      "Búsquedas, ordenación, recursividad y algoritmos clásicos de grafos.",
      "Organización secuencial, directa y en montículos para ficheros.",
      "Formatos de imagen, documento, intercambio de datos, audio y vídeo.",
    ],
    sections: [
      "Conceptos base y clasificaciones",
      "Arrays, registros y listas",
      "Pilas, colas, conjuntos, mapas y hash",
      "Árboles y grafos",
      "Algoritmos de búsqueda y ordenación",
      "Organización de ficheros",
      "Formatos de información y ficheros",
    ],
    accent: "azure",
    testPresets: [
      {
        slug: "fundamentos-y-lineales",
        title: "Test 1 · Fundamentos y estructuras lineales",
        description: "Trabaja TAD, clasificaciones, arrays, registros, listas, pilas y colas.",
        focusSections: ["fundamentos", "arrays-registros", "listas-pilas-colas"],
      },
      {
        slug: "hash-y-relaciones",
        title: "Test 2 · Mapas, diccionarios y hash",
        description: "Profundiza en conjuntos, mapas, diccionarios, tablas hash y colisiones.",
        focusSections: ["conjuntos-mapas-hash"],
      },
      {
        slug: "arboles-y-grafos",
        title: "Test 3 · Árboles y grafos",
        description: "Enfocado a recorridos, ABB, AVL, árboles B y algoritmos sobre grafos.",
        focusSections: ["arboles-grafos"],
      },
      {
        slug: "algoritmos",
        title: "Test 4 · Búsqueda y ordenación",
        description: "Repasa complejidades, recursividad, búsqueda binaria e interpolación, y ordenación.",
        focusSections: ["algoritmos"],
      },
      {
        slug: "ficheros-y-formatos",
        title: "Test 5 · Ficheros y formatos",
        description: "Cubre organización de ficheros y formatos de documentos, datos, audio e imagen.",
        focusSections: ["ficheros-formatos"],
      },
    ],
  },
  B2T4: {
    title: "Sistemas operativos: características, Windows, UNIX/Linux y dispositivos móviles",
    shortTitle: "Sistemas operativos",
    description:
      "Tema técnico sobre arquitectura y funciones de los sistemas operativos, gestión de procesos, memoria, almacenamiento, Windows, UNIX/Linux y plataformas móviles.",
    summary: [
      "Definición, estructuras y componentes de un sistema operativo: núcleos monolíticos, capas, microkernel y máquinas virtuales.",
      "Administración de procesos: estados, planificación, concurrencia, interbloqueos y planificación apropiativa o no apropiativa.",
      "Gestión de memoria, paginación, segmentación, memoria virtual, entrada/salida y administración de archivos.",
      "Sistemas de ficheros, permisos, directorios y comandos relevantes en UNIX y Linux.",
      "Ecosistema Windows: Active Directory, registro, aplicaciones virtuales y servicios cloud; junto con Android, iOS y otros sistemas móviles.",
    ],
    sections: [
      "Definición, estructura y componentes",
      "Procesos, concurrencia y planificación",
      "Memoria, entrada/salida y memoria virtual",
      "Archivos, permisos y sistemas de ficheros",
      "Sistemas Windows y servicios cloud",
      "Sistemas UNIX, Linux y comandos",
      "Sistemas operativos para dispositivos móviles",
    ],
    accent: "azure",
    testPresets: [
      {
        slug: "arquitectura-y-procesos",
        title: "Test 1 · Arquitectura y procesos",
        description: "Repasa tipos de núcleo, componentes del sistema, procesos, estados, concurrencia y planificación.",
        focusSections: ["arquitectura-y-componentes", "procesos-y-planificacion"],
      },
      {
        slug: "memoria-y-ficheros",
        title: "Test 2 · Memoria, E/S y ficheros",
        description: "Trabaja paginación, reemplazo, memoria virtual, discos, permisos y sistemas de ficheros.",
        focusSections: ["memoria-entrada-salida", "ficheros-y-almacenamiento"],
      },
      {
        slug: "windows-y-cloud",
        title: "Test 3 · Windows y servicios cloud",
        description: "Entrena Active Directory, registro, aplicaciones de Windows y los servicios cloud del tema.",
        focusSections: ["windows-y-servicios-cloud"],
      },
      {
        slug: "unix-linux-y-comandos",
        title: "Test 4 · UNIX, Linux y comandos",
        description: "Cubre permisos, procesos, directorios, distribuciones, redirecciones y comandos de administración.",
        focusSections: ["unix-linux-y-comandos"],
      },
      {
        slug: "moviles-y-repaso",
        title: "Test 5 · Móviles y repaso de plataforma",
        description: "Refuerza Android, iOS y Firefox OS junto con las bases de arquitectura de sistemas operativos.",
        focusSections: ["moviles-y-plataformas", "arquitectura-y-componentes"],
      },
    ],
  },
  B2T5: {
    title: "Sistemas de gestión de bases de datos relacionales, orientados a objetos y NoSQL",
    shortTitle: "SGBD",
    description:
      "Tema del bloque técnico centrado en arquitectura de un SGBD, transacciones ACID, reglas de Codd, Oracle, motores relacionales, bases orientadas a objetos y familias NoSQL.",
    summary: [
      "Qué es un sistema de gestión de bases de datos, cuáles son sus componentes básicos y cómo se organiza la información a nivel lógico y físico.",
      "Transacciones, propiedades ACID, niveles de consistencia y papel del control de concurrencia dentro de un SGBD.",
      "Panorámica de los SGBD relacionales, con foco en reglas de Codd, Oracle, MySQL, SQL Server y conceptos como instancia, tablespace o vistas materializadas.",
      "Bases de datos orientadas a objetos: objetivos, rasgos obligatorios y ejemplos habituales en oposición como GemStone, ObjectDB o Zope Object DB.",
      "Ecosistema NoSQL: documentos, clave-valor, familias de columnas, grafos, BASE, escalado horizontal y productos como MongoDB, Redis, Cassandra, Neo4j o Bigtable.",
    ],
    sections: [
      "Fundamentos y arquitectura de un SGBD",
      "Transacciones, ACID y consistencia",
      "Modelo relacional y reglas de Codd",
      "Oracle y motores relacionales",
      "Bases orientadas a objetos",
      "NoSQL: documentos, clave-valor, columnas y grafos",
    ],
    accent: "amber",
    testPresets: [
      {
        slug: "fundamentos-y-arquitectura",
        title: "Test 1 · Fundamentos y arquitectura",
        description: "Refuerza conceptos base de SGBD, componentes de proceso, transacciones y arquitectura general.",
        focusSections: ["fundamentos-y-acid", "oracle-y-motores-relacionales"],
        size: 36,
      },
      {
        slug: "modelo-relacional-y-codd",
        title: "Test 2 · Modelo relacional y Codd",
        description: "Se centra en reglas de Codd, acceso garantizado, integridad e independencia de los datos.",
        focusSections: ["relacional-y-codd"],
        size: 36,
      },
      {
        slug: "transacciones-y-consistencia",
        title: "Test 3 · Transacciones y consistencia",
        description: "Practica ACID, BASE, consistencia y preguntas de soporte sobre funcionamiento general del gestor.",
        focusSections: ["fundamentos-y-acid", "relacional-y-codd"],
        size: 36,
      },
      {
        slug: "nosql-y-escalabilidad",
        title: "Test 4 · NoSQL y escalabilidad",
        description: "Trabaja tipos NoSQL, escalado horizontal, productos concretos y diferencias frente al modelo SQL.",
        focusSections: ["nosql-y-escalabilidad", "nosql-productos-y-casos"],
        size: 36,
      },
      {
        slug: "oracle-y-motores-concretos",
        title: "Test 5 · Oracle y motores concretos",
        description: "Repasa Oracle, InnoDB, SQL Server, vistas materializadas, instancia, tablespaces y motores especializados.",
        focusSections: ["oracle-y-motores-relacionales", "objetos-y-bd-especializadas"],
        size: 36,
      },
    ],
  },
  B3T1: {
    title: "Modelo entidad-relación y diseño conceptual de bases de datos",
    shortTitle: "Modelo entidad-relación",
    description:
      "Tema del bloque de bases de datos centrado en el modelo entidad-relación, con test del profesor y ejercicios de apoyo dentro del propio tema.",
    summary: [
      "Temario principal del modelo entidad-relación sincronizado desde la carpeta del bloque 3.",
      "Material complementario del profesor disponible en el propio tema: test y ejercicios.",
      "Estructura preparada para añadir más adelante simulacros específicos interactivos.",
    ],
    sections: [
      "Modelo entidad-relación",
      "Cardinalidades y restricciones",
      "Ejercicios propuestos",
      "Test de repaso del profesor",
    ],
    accent: "coral",
    testPresets: [
      {
        slug: "fundamentos-er",
        title: "Test 1 · Fundamentos del modelo ER",
        description: "Repasa entidades, atributos, dominios, esquema conceptual y bases del modelo entidad-relación.",
        focusSections: ["fundamentos-er"],
        size: 30,
      },
      {
        slug: "relaciones-y-cardinalidad",
        title: "Test 2 · Relaciones y cardinalidad",
        description: "Se centra en relaciones, tipo de correspondencia, cardinalidades, roles y entidades débiles.",
        focusSections: ["relaciones-y-cardinalidad"],
        size: 30,
      },
      {
        slug: "modelo-conceptual",
        title: "Test 3 · Modelo conceptual",
        description: "Trabaja objetivos del modelo conceptual, técnicas de modelado y representación de relaciones.",
        focusSections: ["modelo-conceptual"],
        size: 30,
      },
      {
        slug: "jerarquias-y-abstraccion",
        title: "Test 4 · Jerarquías y abstracción",
        description: "Entrena generalización, especialización, agregación y jerarquías totales, parciales o solapadas.",
        focusSections: ["jerarquias-y-abstraccion"],
        size: 30,
      },
      {
        slug: "metricav3-y-diseno",
        title: "Test 5 · Métrica v3 y diseño",
        description: "Refuerza nomenclatura de Métrica v3, diseño conceptual y preguntas de cierre del tema.",
        focusSections: ["metricav3-y-diseno"],
        size: 30,
      },
    ],
  },
  B3T2: {
    title: "Diseño de bases de datos, modelo relacional y normalización",
    shortTitle: "Diseño de bases de datos",
    description:
      "Tema del bloque de bases de datos centrado en diseño relacional, normalización, álgebra relacional, integridad y transformaciones desde el modelo E/R.",
    summary: [
      "Temario principal de diseño de bases de datos sincronizado desde la carpeta del bloque 3.",
      "Material complementario del profesor disponible en el propio tema: test y ejercicios.",
      "Cinco simulacros específicos construidos a partir del banco real del tema para practicar modelo relacional y normalización.",
    ],
    sections: [
      "Fundamentos del modelo relacional",
      "Normalización y dependencias",
      "Transformación E/R a relacional",
      "Arquitectura ANSI/SPARC y diseño",
      "Integridad y modelo lógico",
    ],
    accent: "amber",
    testPresets: [
      {
        slug: "fundamentos-relacional",
        title: "Test 1 · Fundamentos del modelo relacional",
        description: "Refuerza Codd, niveles de abstracción, operadores básicos y conceptos esenciales del modelo relacional.",
        focusSections: ["fundamentos-relacional"],
      },
      {
        slug: "normalizacion",
        title: "Test 2 · Normalización y dependencias",
        description: "Se centra en formas normales, dependencias funcionales y anomalías de diseño.",
        focusSections: ["normalizacion"],
      },
      {
        slug: "transformacion-er",
        title: "Test 3 · Transformación E/R a relacional",
        description: "Practica el paso de diagramas E/R al modelo relacional y el tratamiento de relaciones y jerarquías.",
        focusSections: ["transformacion-er"],
      },
      {
        slug: "arquitectura-y-diseno",
        title: "Test 4 · Arquitectura y diseño",
        description: "Repasa arquitectura ANSI/SPARC, esquemas, diseño conceptual, lógico y físico.",
        focusSections: ["arquitectura-y-diseno"],
      },
      {
        slug: "integridad-y-modelo-logico",
        title: "Test 5 · Integridad y modelo lógico",
        description: "Combina reglas de integridad, claves, dominios, cardinalidad y propiedades del modelo lógico relacional.",
        focusSections: ["integridad-y-modelo-logico"],
      },
    ],
  },
  B3T4: {
    title: "Lenguajes de bases de datos SQL, procedimientos almacenados y disparadores",
    shortTitle: "SQL",
    description:
      "Tema del bloque de bases de datos centrado en ANSI SQL, DDL, DML, DCL, procedimientos almacenados, eventos, disparadores y conectividad ODBC/JDBC.",
    summary: [
      "Panorámica del estándar ANSI SQL y su evolución histórica, con las sentencias base de definición, manipulación y control de datos.",
      "Trabajo sobre DDL, DML y DCL: CREATE, ALTER, DROP, SELECT, INSERT, UPDATE, DELETE, COMMIT, ROLLBACK, GRANT y REVOKE.",
      "Consultas SQL con filtros, joins, agrupaciones, vistas, restricciones, integridad y tratamiento práctico de esquemas relacionales.",
      "Procedimientos almacenados, eventos y disparadores en distintos motores, junto con su papel en la automatización de lógica de base de datos.",
      "Material complementario del profesor incorporado dentro del tema: test oficial, ejercicios resueltos y scripts `.sql` descargables.",
    ],
    sections: [
      "Estándar ANSI SQL",
      "DDL: esquemas, tablas, restricciones y vistas",
      "DML, DCL y consultas SQL",
      "Procedimientos almacenados",
      "Eventos y disparadores",
      "Conectividad ODBC y JDBC",
      "Ejercicios y casos prácticos",
    ],
    accent: "azure",
    testPresets: [
      {
        slug: "ansi-sql-y-ddl",
        title: "Test 1 · ANSI SQL y DDL",
        description: "Refuerza evolución del estándar SQL, sentencias DDL, tipos de datos, esquemas, tablas y restricciones.",
        focusSections: ["ansi-sql-y-ddl"],
      },
      {
        slug: "dml-dcl-y-consultas",
        title: "Test 2 · DML, DCL y consultas",
        description: "Trabaja SELECT, INSERT, UPDATE, DELETE, GRANT, REVOKE, transacciones y sintaxis general de consulta.",
        focusSections: ["dml-dcl-y-consultas"],
      },
      {
        slug: "joins-agrupaciones-y-vistas",
        title: "Test 3 · Joins, agrupaciones y vistas",
        description: "Entrena joins ANSI, GROUP BY, HAVING, ORDER BY, funciones de agregación y creación o borrado de vistas.",
        focusSections: ["joins-agrupaciones-y-vistas"],
      },
      {
        slug: "procedimientos-eventos-y-disparadores",
        title: "Test 4 · Procedimientos y disparadores",
        description: "Se centra en procedimientos almacenados, eventos, triggers y automatización en motores de bases de datos.",
        focusSections: ["procedimientos-eventos-y-disparadores"],
      },
      {
        slug: "conectividad-y-casos-practicos",
        title: "Test 5 · Conectividad y casos prácticos",
        description: "Combina ODBC, JDBC y ejercicios de consultas reales con joins y agregaciones sobre escenarios administrativos.",
        focusSections: ["conectividad-y-casos-practicos"],
      },
    ],
  },
};
