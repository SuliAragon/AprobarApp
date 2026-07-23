const optionIds = ["a", "b", "c", "d"];
const officialAnswerOverrides = {
  "b1t1-test-oficial-ce-2:5": "d",
};

const noisePatterns = [
  /^PABLO ARELLANO$/i,
  /^www\.theglobeformacion\.com$/i,
  /^P[aá]gina \d+$/i,
  /^TAI$/i,
  /^[A-Z0-9]+\s+test\d*$/i,
  /^CONSTITUCI[ÓO]N ESPAÑOLA$/i,
  /^ESTRUCTURAS DE DATOS$/i,
  /^EL GOBIERNO$/i,
  /^PREPARACI[ÓO]N OPOSICIONES$/i,
  /^T[ÉE]CNICOS AUXILIARES DE INFORM[ÁA]TICA$/i,
  /^\d{4}-\d{4}$/i,
  /^Bloque \d+ - Tema \d+$/i,
];

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function isNoiseLine(value) {
  return noisePatterns.some((pattern) => pattern.test(value));
}

function extractSolutions(value) {
  const answers = new Map();

  for (const match of value.matchAll(/(\d+)\.\s*([A-D])/g)) {
    const questionNumber = Number.parseInt(match[1], 10);
    const optionIndex = optionIds.indexOf(match[2].toLowerCase());

    if (optionIndex >= 0) {
      answers.set(questionNumber, optionIds[optionIndex]);
    }
  }

  return answers;
}

function splitQuestionBlocks(value) {
  const lines = value
    .replace(/\r/g, "\n")
    .replace(/\f/g, "\n")
    .split("\n")
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean)
    .filter((line) => !isNoiseLine(line));

  const blocks = [];
  let currentBlock = [];

  for (const line of lines) {
    if (/^\d+\.\s+/.test(line)) {
      if (currentBlock.length > 0) {
        blocks.push(currentBlock.join("\n"));
      }

      currentBlock = [line];
      continue;
    }

    if (currentBlock.length > 0) {
      currentBlock.push(line);
    }
  }

  if (currentBlock.length > 0) {
    blocks.push(currentBlock.join("\n"));
  }

  return blocks;
}

function extractOptions(block) {
  const markers = [...block.matchAll(/(?:^|\n)([a-d])\)\s*/gm)];

  if (markers.length !== 4) {
    return null;
  }

  const questionNumberMatch = block.match(/^(\d+)\.\s+/);

  if (!questionNumberMatch) {
    return null;
  }

  const questionNumber = Number.parseInt(questionNumberMatch[1], 10);
  const prompt = normalizeWhitespace(block.slice(questionNumberMatch[0].length, markers[0].index));
  const options = markers.map((marker, index) => {
    const start = marker.index + marker[0].length;
    const end = markers[index + 1]?.index ?? block.length;
    return {
      id: optionIds[index],
      label: normalizeWhitespace(block.slice(start, end)),
    };
  });

  return { questionNumber, prompt, options };
}

const explanationRules = [
  {
    match: /árbol.*equilibrado/i,
    text: "Un árbol equilibrado exige que, en cada nodo, la diferencia de altura entre sus dos subárboles no sea superior a una unidad. Contar nodos no sustituye ese criterio de altura.",
  },
  {
    match: /árbol recubridor mínimo|kruskal/i,
    text: "Kruskal construye un árbol recubridor mínimo eligiendo aristas de menor peso que no formen ciclos, por lo que se aplica a grafos conexos y ponderados.",
  },
  {
    match: /gráficos vectoriales|\bSVG\b/i,
    text: "SVG describe gráficos mediante elementos vectoriales y no como una matriz fija de píxeles; por eso puede escalar sin la pérdida propia de una imagen ráster.",
  },
  {
    match: /nacionalidad española|español de origen/i,
    text: "La Constitución regula la nacionalidad en el artículo 11 y protege de forma reforzada a los españoles de origen: no pueden ser privados de su nacionalidad.",
  },
  {
    match: /moción de censura/i,
    text: "La moción de censura española es constructiva: debe ser propuesta al menos por una décima parte del Congreso e incluir un candidato a la Presidencia del Gobierno.",
  },
  {
    match: /cuestión de confianza/i,
    text: "La cuestión de confianza la plantea el Presidente del Gobierno ante el Congreso y se entiende otorgada con mayoría simple, tras deliberación del Consejo de Ministros.",
  },
  {
    match: /integridad referencial|claves foráneas/i,
    text: "La integridad referencial evita referencias huérfanas: una clave ajena debe corresponder a una clave existente en la tabla referenciada, salvo el valor nulo cuando esté permitido.",
  },
  {
    match: /primera forma normal|\b1FN\b/i,
    text: "La primera forma normal exige valores atómicos y ausencia de grupos repetitivos. Las dependencias parciales y transitivas se tratan en formas normales posteriores.",
  },
  {
    match: /segunda forma normal|\b2FN\b/i,
    text: "La segunda forma normal parte de la 1FN y elimina dependencias parciales de atributos no clave respecto de una parte de una clave compuesta.",
  },
  {
    match: /tercera forma normal|\b3FN\b/i,
    text: "La tercera forma normal exige estar en 2FN y evitar dependencias transitivas de atributos no clave respecto de una clave candidata.",
  },
  {
    match: /modelo Entidad-Relación|diagrama Entidad/i,
    text: "El modelo Entidad-Relación describe entidades, atributos y relaciones del dominio antes de decidir las tablas físicas; la cardinalidad y la participación expresan sus reglas de negocio.",
  },
  {
    match: /dominio/i,
    text: "En el modelo relacional y en E/R, el dominio es el conjunto de valores válidos que puede tomar un atributo, no una fila, una relación ni una clave.",
  },
  {
    match: /transacción|Atomicidad|ACID/i,
    text: "Las propiedades ACID garantizan que una transacción se ejecute de forma fiable: atomicidad, consistencia, aislamiento y durabilidad describen aspectos distintos y complementarios.",
  },
  {
    match: /NoSQL|BASE|escalabilidad/i,
    text: "Los sistemas NoSQL suelen priorizar distribución y escalado horizontal. Según el modelo concreto, pueden trabajar con consistencia eventual en lugar de exigir todas las garantías ACID de una transacción relacional.",
  },
  {
    match: /orientado a objetos|Object DB|Zope/i,
    text: "Una base de datos orientada a objetos almacena objetos con identidad, estado y comportamiento, y normalmente admite conceptos como clases, encapsulación y herencia.",
  },
  {
    match: /\bDDL\b|CREATE|ALTER|TRUNCATE|DROP/i,
    text: "DDL define o modifica la estructura de la base de datos: esquemas, tablas, columnas, vistas y restricciones. No se usa para consultar o manipular filas concretas.",
  },
  {
    match: /\bDML\b|SELECT|INSERT|UPDATE|DELETE/i,
    text: "DML se ocupa de consultar o manipular los datos almacenados. SELECT consulta, INSERT añade filas, UPDATE las modifica y DELETE las elimina.",
  },
  {
    match: /\bJOIN\b|combinación/i,
    text: "Un JOIN combina filas relacionadas. INNER JOIN conserva coincidencias; LEFT, RIGHT y FULL OUTER JOIN incluyen además las filas sin pareja del lado que corresponda, rellenando con NULL.",
  },
  {
    match: /GROUP BY|HAVING|agregación/i,
    text: "GROUP BY forma grupos y HAVING filtra esos grupos tras aplicar agregaciones. WHERE actúa antes de agrupar y se aplica a las filas individuales.",
  },
  {
    match: /ROLLBACK|COMMIT|SAVEPOINT/i,
    text: "COMMIT confirma los cambios de una transacción; ROLLBACK los deshace, total o parcialmente si se usa junto a un punto de guardado, mientras la transacción no se haya confirmado.",
  },
  {
    match: /clave primaria|PRIMARY KEY/i,
    text: "Una clave primaria identifica de forma única cada fila y no admite valores nulos. Una clave ajena, en cambio, establece una referencia hacia otra tabla.",
  },
  {
    match: /referéndum|Cortes Generales|Congreso|Senado|Tribunal Constitucional|Defensor del Pueblo/i,
    text: "La respuesta se obtiene aplicando el precepto constitucional que regula la institución consultada. Es importante distinguir las funciones de las Cortes, el Congreso, el Senado, el Tribunal Constitucional y el Defensor del Pueblo.",
  },
  {
    match: /Rey|Corona|Regencia|refrendo/i,
    text: "La Corona se regula en el Título II de la Constitución. Los actos del Rey requieren refrendo salvo las excepciones expresamente previstas, y la responsabilidad recae en quien refrenda.",
  },
];

const topicFallbacks = {
  B1T1: "La cuestión se resuelve por la literalidad de la Constitución Española, especialmente de los Títulos Preliminar, I y II. La alternativa correcta es la única que respeta el derecho, garantía u órgano que establece el precepto aplicable.",
  B1T2: "La cuestión se resuelve aplicando la regulación constitucional de las Cortes Generales, el Tribunal Constitucional o el Defensor del Pueblo. Hay que contrastar competencias, mayorías y procedimientos sin trasladarlos de una institución a otra.",
  B1T3: "La cuestión se resuelve con los artículos constitucionales sobre el Gobierno y sus relaciones con las Cortes, junto con la Ley del Gobierno. Conviene diferenciar composición, investidura, funciones y control parlamentario.",
  B2T3: "La respuesta correcta aplica la definición técnica exacta de la estructura, algoritmo o formato preguntado. Las alternativas restantes cambian el criterio esencial, el ámbito de aplicación o la propiedad que se está evaluando.",
  B2T5: "La respuesta correcta distingue la arquitectura y las propiedades propias de cada familia de SGBD. No deben confundirse los conceptos relacionales, orientados a objetos y NoSQL ni las garantías de una transacción.",
  B3T1: "La respuesta correcta se deduce de la semántica del modelo Entidad-Relación y de la transformación o validación del diseño conceptual. La clave está en respetar cardinalidades, atributos, entidades y restricciones del modelo.",
  B3T2: "La respuesta correcta aplica las reglas del modelo relacional y de normalización. Para descartar las demás hay que comprobar dependencias funcionales, claves, integridad y el nivel de diseño al que se refiere el enunciado.",
  B3T4: "La respuesta correcta distingue con precisión entre definición de estructura, manipulación de datos, control de transacciones y privilegios, además de la semántica de consultas y uniones SQL.",
};

const temarioReferences = {
  B1T1: {
    fallback: "Constitución Española: estructura, Título Preliminar, Título I, garantías y Corona",
    rules: [
      [/nacionalidad|extranjeros|españoles/i, "Título I · Capítulo I: Españoles y extranjeros"],
      [/amparo|garantía|suspensi|Defensor del Pueblo/i, "Garantía y suspensión"],
      [/Rey|Corona|Regencia|refrendo|sucesión/i, "La Corona y funciones constitucionales del Rey"],
      [/derecho|libertad|igualdad|huelga|asociaci|domicilio|detención|habeas/i, "Título I · Derechos y deberes fundamentales"],
    ],
  },
  B1T2: {
    fallback: "Cortes Generales, Tribunal Constitucional y Defensor del Pueblo",
    rules: [
      [/Congreso|Diputados/i, "El Congreso de los Diputados"],
      [/Senado|senadores/i, "El Senado"],
      [/ley orgánica|ley ordinaria|decreto-ley|delegación|iniciativa|referéndum/i, "Elaboración de las leyes"],
      [/tratado|convenio internacional/i, "Tratados internacionales"],
      [/Tribunal Constitucional|recurso de inconstitucionalidad|conflicto/i, "El Tribunal Constitucional"],
      [/Defensor del Pueblo/i, "El Defensor del Pueblo"],
    ],
  },
  B1T3: {
    fallback: "El Gobierno: composición, funciones y relaciones con las Cortes Generales",
    rules: [
      [/Consejo de Ministros|Vicepresidente|Ministro|Secretario de Estado|composición/i, "Composición del Gobierno y órganos de colaboración y apoyo"],
      [/investidura|nombramiento|cese|Gobierno en funciones/i, "Nombramiento y cese"],
      [/moción de censura|cuestión de confianza|Cortes|alarma|excepción|sitio/i, "Relaciones entre el Gobierno y las Cortes Generales"],
      [/potestad reglamentaria|función ejecutiva|Presidente del Gobierno/i, "Las funciones del Gobierno"],
    ],
  },
  B2T3: {
    fallback: "Tipos abstractos y estructuras de datos",
    rules: [
      [/array|vector|registro|lista enlazada/i, "Tipos abstractos y estructuras de datos · Arrays, registros y listas"],
      [/pila|stack|cola|FIFO|LIFO|hash|diccionario|mapa/i, "Tipos abstractos y estructuras de datos · Pilas, colas, mapas y tablas hash"],
      [/árbol|arbol|inorden|preorden|posorden|AVL/i, "Tipos abstractos y estructuras de datos · Árboles"],
      [/grafo|Kruskal|Floyd|Dijkstra/i, "Tipos abstractos y estructuras de datos · Grafos y algoritmos de teoría de grafos"],
      [/búsqueda|ordenación|burbuja|complejidad|recursiv/i, "Algoritmos"],
      [/fichero|JSON|SVG|JPEG|imagen|audio|vídeo|video|documento/i, "Formatos de información y ficheros"],
    ],
  },
  B2T5: {
    fallback: "Sistemas de gestión de bases de datos",
    rules: [
      [/transacción|ACID|consistencia|aislamiento|serializable/i, "Sistemas de gestión de bases de datos (SGBD)"],
      [/Oracle|PostgreSQL|MySQL|MariaDB|SQLite|SQL Server|relacional|Codd/i, "SGBD relacionales"],
      [/orientado a objetos|Zope|Object DB|OID/i, "SGBD orientado a objetos"],
      [/NoSQL|MongoDB|Redis|Cassandra|Neo4j|Bigtable|HBase|BASE/i, "SGBD NoSQL"],
      [/serie temporal|geoespacial|multimedia/i, "Otros tipos de bases de datos"],
    ],
  },
  B3T1: {
    fallback: "Modelo Entidad-Relación extendido y validación del modelo ER",
    rules: [
      [/entidad|atributo|relación|relacion|dominio|cardinalidad|correspondencia/i, "Modelo Entidad-Relación extendido"],
      [/jerarquía|jerarquia|generalización|generalizacion|especialización|especializacion|supertipo|subtipo/i, "Extensiones del modelo Entidad-Relación"],
      [/construcción|construccion|validación|validacion|verificaci/i, "Construcción y validación del modelo ER"],
    ],
  },
  B3T2: {
    fallback: "Diseño de bases de datos y normalización",
    rules: [
      [/diseño lógico|diseño logico|transformación|transformacion|modelo conceptual/i, "Diseño lógico"],
      [/diseño físico|diseño fisico|índice|indice|organización de ficheros|optimización/i, "Diseño físico"],
      [/clave|integridad|tupla|relación|relacion|dominio|álgebra|algebra/i, "El modelo lógico relacional"],
      [/forma normal|1FN|2FN|3FN|FNBC|dependencia funcional|normalización/i, "Normalización"],
    ],
  },
  B3T4: {
    fallback: "Lenguajes de interrogación de bases de datos",
    rules: [
      [/DDL|CREATE|ALTER|DROP|TRUNCATE|vista|dominio|esquema/i, "Estándar ANSI SQL · Lenguaje de definición de datos (DDL)"],
      [/SELECT|INSERT|UPDATE|DELETE|JOIN|GROUP BY|HAVING|consulta/i, "Estándar ANSI SQL · Lenguaje de manipulación de datos (DML)"],
      [/GRANT|REVOKE|COMMIT|ROLLBACK|SAVEPOINT|privilegio/i, "Estándar ANSI SQL · Lenguaje de control de datos (DCL)"],
      [/procedimiento almacenado|PL\/SQL|parámetro|parametro/i, "Procedimientos almacenados"],
      [/trigger|disparador|evento/i, "Eventos y disparadores"],
      [/ODBC|JDBC|driver/i, "Estándares de conectividad: ODBC y JDBC"],
    ],
  },
};

function resolveTemarioReference(code, prompt, correctLabel) {
  const reference = temarioReferences[code];

  if (!reference) {
    return "Referencia del temario: apartado correspondiente del tema.";
  }

  const source = `${prompt} ${correctLabel}`;
  const section = reference.rules.find(([pattern]) => pattern.test(source))?.[1] ?? reference.fallback;
  return `Referencia del temario: ${code} · ${section}.`;
}

function buildExplanation(code, prompt, correctOptionId, correctLabel) {
  const specificReason = explanationRules.find((rule) => rule.match.test(`${prompt} ${correctLabel}`))?.text;
  const fallback = topicFallbacks[code] ?? "La respuesta correcta es la que cumple de forma exacta la definición o regla que plantea el enunciado; las demás modifican algún requisito esencial.";
  const suffix = /[.!?…]$/.test(correctLabel) ? "" : ".";

  return `Por qué: ${specificReason ?? fallback} En este caso, la opción ${correctOptionId.toUpperCase()} (${correctLabel}${suffix}) es la que se ajusta al criterio preguntado. ${resolveTemarioReference(code, prompt, correctLabel)}`;
}

function splitQuestionsAndSolutions(source) {
  const solutionsHeadingMatch = source.match(/(?:^|[\n\f])\s*SOLUCIONES\s*(?:[\n\f]|$)/i);

  if (!solutionsHeadingMatch || solutionsHeadingMatch.index === undefined) {
    return [source, ""];
  }

  const headingStart = solutionsHeadingMatch.index;
  const headingEnd = headingStart + solutionsHeadingMatch[0].length;
  return [source.slice(0, headingStart), source.slice(headingEnd)];
}

export function parseOfficialTestText(source, meta) {
  const [questionsSource = "", solutionsSource = ""] = splitQuestionsAndSolutions(source);
  const solutions = extractSolutions(solutionsSource);
  const questions = [];

  for (const block of splitQuestionBlocks(questionsSource)) {
    const parsedBlock = extractOptions(block);

    if (!parsedBlock) {
      continue;
    }

    const overrideKey = `${meta.slug}:${parsedBlock.questionNumber}`;
    const correctOption = officialAnswerOverrides[overrideKey] ?? solutions.get(parsedBlock.questionNumber);

    if (!correctOption) {
      continue;
    }

    const correctLabel = parsedBlock.options.find((option) => option.id === correctOption)?.label ?? "";

    questions.push({
      id: `${meta.slug}-${parsedBlock.questionNumber}`,
      section: "test-oficial",
      prompt: parsedBlock.prompt,
      options: parsedBlock.options,
      correctOption,
      explanation: buildExplanation(meta.code, parsedBlock.prompt, correctOption, correctLabel),
    });
  }

  return {
    ...meta,
    questions,
  };
}
