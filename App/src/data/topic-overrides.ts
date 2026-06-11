import type { TestPreset } from "./question-bank";

export interface TopicOverride {
  title: string;
  shortTitle: string;
  description: string;
  summary: string[];
  sections: string[];
  accent: "emerald" | "amber" | "coral" | "azure";
  testPresets: TestPreset[];
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
};
