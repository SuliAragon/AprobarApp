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
  return value
    .normalize("NFC")
    .replace(/\bB\d+T\d+\s*test\b/gi, "")
    .replace(/\bSISTEMAS OPERATIVOS\b/g, "")
    .replace(/\s*PABLO ARELLANO\s+www\.theglobeformacion\.com\s+Página \d+\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
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
    if (/^\d+\.\s*/.test(line)) {
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

  const questionNumberMatch = block.match(/^(\d+)\.\s*/);

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
    match: /Ley 19\/2013|publicidad activa|Portal de Transparencia|sociedades mercantiles|información institucional|información de relevancia jurídica|información económica/i,
    text: "La Ley 19/2013 distingue las obligaciones de publicidad activa y exige difundir de oficio la información relevante. La respuesta correcta aplica el ámbito subjetivo, el tipo de información o la obligación concreta que prevé el Título I.",
  },
  {
    match: /derecho de acceso|solicitud de acceso|información pública|terceros afectados|reelaboración|reelaboraci.n|datos personales|acceso parcial|inadmisión|inadmisi.n/i,
    text: "El derecho de acceso se ejerce respecto de información pública y está sujeto a límites, protección de datos y un procedimiento concreto. Hay que distinguir entre la admisión de la solicitud, la audiencia a terceros y la resolución de acceso.",
  },
  {
    match: /Consejo de Transparencia|buen gobierno|alto cargo|reclamación|reclamaci.n|abstención|abstenci.n/i,
    text: "El régimen de buen gobierno exige actuación responsable e imparcial de los altos cargos. El Consejo de Transparencia y Buen Gobierno vela por el cumplimiento de la Ley y garantiza el derecho de acceso en su ámbito de competencia.",
  },
  {
    match: /Agenda 2030|Objetivos de Desarrollo Sostenible|\bODS\b|desarrollo sostenible/i,
    text: "La Agenda 2030 articula 17 Objetivos de Desarrollo Sostenible y 169 metas con un enfoque universal, integrado e indivisible. Las cinco P son Personas, Planeta, Prosperidad, Paz y Alianzas.",
  },
  {
    match: /Gobierno Abierto|Alianza para el Gobierno Abierto|\bOGP\b|rendición de cuentas|rendicion de cuentas/i,
    text: "El Gobierno Abierto combina transparencia, participación, colaboración y rendición de cuentas para acercar las instituciones a la ciudadanía y mejorar la acción pública.",
  },
  {
    match: /árbol.*equilibrado/i,
    text: "Un árbol equilibrado exige que, en cada nodo, la diferencia de altura entre sus dos subárboles no sea superior a una unidad. Contar nodos no sustituye ese criterio de altura.",
  },
  {
    match: /árbol recubridor mínimo|kruskal/i,
    text: "Kruskal construye un árbol recubridor mínimo eligiendo aristas de menor peso que no formen ciclos, por lo que se aplica a grafos conexos y ponderados.",
  },
  {
    match: /Round Robin|quantum|time-slice/i,
    text: "Round Robin reparte el procesador en turnos de duración limitada mediante un quantum o time-slice. Al agotarse el turno, el proceso vuelve a la cola si todavía no ha terminado.",
  },
  {
    match: /paginación|paginacion|fragmentación interna|fragmentacion interna/i,
    text: "La paginación divide memoria y procesos en bloques de tamaño fijo. Evita la fragmentación externa, pero el último marco asignado puede quedar parcialmente desaprovechado y producir fragmentación interna.",
  },
  {
    match: /chmod|umask|permisos.*UNIX/i,
    text: "En UNIX los permisos se expresan en octal para propietario, grupo y otros. Los valores 4, 2 y 1 representan lectura, escritura y ejecución, respectivamente; umask elimina permisos del valor base de creación.",
  },
  {
    match: /daemon|zombie|proceso.*ejecución|proceso.*ejecucion/i,
    text: "Un proceso es una instancia de un programa en ejecución. Los daemons prestan servicios en segundo plano y un zombie ya ha terminado, pero conserva su entrada hasta que su padre recoge su estado de salida.",
  },
  {
    match: /i-nodo|inode|ext4|NTFS|APFS|JFS|Reiser|sistema de ficheros/i,
    text: "Los sistemas de ficheros organizan datos y metadatos de forma distinta. En UNIX el i-nodo guarda la información de control del fichero, mientras que cada formato tiene sus propios límites y mecanismos, como journaling o extensiones.",
  },
  {
    match: /Active Directory|registro de Windows|Windows Insider|App-V|Windows 10|Windows 8|Azure/i,
    text: "Windows integra servicios de directorio, registro, virtualización de aplicaciones y servicios cloud con funciones diferenciadas. La opción válida identifica el componente y la función concreta que le atribuye el temario.",
  },
  {
    match: /Android|iOS|Firefox OS|Cocoa Touch|Gonk|móviles|moviles/i,
    text: "Las plataformas móviles se organizan por capas y versiones propias. Conviene distinguir el núcleo y el runtime de Android de las capas Core OS, Core Services, Media y Cocoa Touch de iOS, así como la arquitectura de Firefox OS.",
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
    match: /ROLLBACK|COMMIT|SAVEPOINT/i,
    text: "COMMIT confirma los cambios de una transacción; ROLLBACK los deshace, total o parcialmente si se usa junto a un punto de guardado, mientras la transacción no se haya confirmado.",
  },
  {
    match: /transacción|Atomicidad|ACID/i,
    text: "Las propiedades ACID garantizan que una transacción se ejecute de forma fiable: atomicidad, consistencia, aislamiento y durabilidad describen aspectos distintos y complementarios.",
  },
  {
    match: /reglas? de Codd|Codd/i,
    text: "Las reglas de Codd describen requisitos del modelo relacional. La integridad de entidad y la integridad referencial forman parte de ese marco; la denominada integridad de paridad no es una de las reglas de Codd.",
  },
  {
    match: /\b(?:NoSQL|BASE)\b|escalabilidad/i,
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
  B1T4: "La respuesta correcta aplica el apartado concreto del temario sobre Gobierno Abierto, Ley 19/2013, derecho de acceso, buen gobierno o Agenda 2030. Hay que distinguir la publicidad activa del acceso a solicitud y comprobar los plazos, órganos y límites previstos.",
  B2T1: "La cuestión se resuelve aplicando la definición concreta del temario sobre representación de la información, arquitectura del procesador, componentes internos o memoria. Las alternativas incorrectas confunden unidades, registros, arquitecturas o funciones diferentes.",
  B2T3: "La respuesta correcta aplica la definición técnica exacta de la estructura, algoritmo o formato preguntado. Las alternativas restantes cambian el criterio esencial, el ámbito de aplicación o la propiedad que se está evaluando.",
  B2T4: "La respuesta correcta aplica el concepto preciso de sistemas operativos, diferenciando la gestión de procesos, memoria, archivos, plataformas Windows, UNIX/Linux y sistemas móviles.",
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
  B1T4: {
    fallback: "Gobierno Abierto, Ley 19/2013 y Agenda 2030",
    rules: [
      [/publicidad activa|Portal de Transparencia|organigrama|contrato|informaci.n econ.mica|informaci.n de relevancia jur.dica/i, "Publicidad activa"],
      [/acceso|solicitud|l.mite|tercero|reelaboraci.n|informaci.n p.blica|datos personales/i, "Derecho de acceso a la información pública"],
      [/Consejo de Transparencia|alto cargo|buen gobierno|reclamaci.n|abstenci.n/i, "Buen gobierno y Consejo de Transparencia"],
      [/Agenda 2030|ODS|Objetivo de Desarrollo Sostenible|Naciones Unidas|desarrollo sostenible/i, "Agenda 2030 y Objetivos de Desarrollo Sostenible"],
      [/Gobierno Abierto|OGP|participaci|colaboraci|rendici.n de cuentas/i, "Gobierno Abierto y principios informadores"],
    ],
  },
  B2T1: {
    fallback: "Informática básica, representación de la información y arquitectura de ordenadores",
    rules: [
      [/SRAM|DRAM|ROM|PROM|EPROM|EEPROM|FLASH|memoria interna|cach.|localidad|asociativa|LRU|FIFO|LFU|condensador/i, "Componentes internos · Memoria interna y caché"],
      [/ASCII|Unicode|UTF-?8|UTF-?16|UTF-?32|codificaci.n/i, "Unicode y codificación de textos"],
      [/bit|byte|palabra|nibble|KiB|MiB|GiB|capacidad|FLOPS|hercio/i, "Informática básica y unidades de información"],
      [/binario|octal|decimal|hexadecimal|base numérica|conversión/i, "Sistemas de numeración"],
      [/puerta|\bAND\b|\bNAND\b|\bOR\b|\bNOR\b|\bXOR\b|\bXNOR\b|lógica/i, "Funciones lógicas básicas"],
      [/sistema de informaci.n|operacional|táctico|tactico|estratégico|estrategico|dato e informaci.n/i, "Elementos y niveles de los sistemas de información"],
      [/contador de programa|\bPC\b|registro de instrucci.n|\bIR\b|\bMAR\b|\bMBR\b|\bMDR\b|ciclo de instrucci.n|direccionamiento|ALU|unidad de control|pipelining|segmentaci.n/i, "Organización del procesador · Registros y ciclo de instrucción"],
      [/Von Neumann|Harvard|Flynn|SISD|SIMD|MISD|MIMD|RISC|CISC/i, "Arquitecturas de ordenadores"],
      [/placa base|bus de datos|bus de direcciones|chipset|Northbridge|Southbridge|socket|PGA|LGA|microprocesador|GPU/i, "Componentes internos · Placa base y microprocesadores"],
      [/BIOS|UEFI|POST|arranque|boot/i, "Componentes internos · Proceso de arranque"],
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
  B2T4: {
    fallback: "Sistemas operativos: características y elementos constitutivos",
    rules: [
      [/proceso|thread|planific|Round Robin|SJF|FCFS|daemon|zombie|concurrencia/i, "Administración de procesos y planificación"],
      [/paginación|paginacion|segmentación|segmentacion|memoria|reemplazo de páginas|fallo de página/i, "Administración de la memoria"],
      [/fichero|archivo|i-nodo|inode|ext4|NTFS|APFS|JFS|Reiser|partici/i, "Administración de archivos y sistemas de ficheros"],
      [/Windows|Active Directory|registro|Azure|App-V|Insider/i, "Sistemas Windows"],
      [/UNIX|Linux|chmod|umask|Samba|\/(etc|bin|sbin|var)|redirecci|distribución|distribucion/i, "Sistemas UNIX y Linux"],
      [/Android|iOS|Firefox OS|Cocoa Touch|Gonk|ART|móvil|movil/i, "Sistemas operativos para dispositivos móviles"],
      [/microkernel|monolít|monolit|máquina virtual|maquina virtual|sistema operativo|kernel/i, "Definición, estructura y componentes del sistema operativo"],
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

const b2t1ExplanationRules = [
  {
    match: /FLOPS|operaciones de coma flotante por segundo/i,
    text: "FLOPS significa operaciones de coma flotante por segundo y mide rendimiento de cálculo numérico. No expresa la frecuencia del reloj, los accesos a memoria ni el número general de instrucciones, que son magnitudes distintas.",
  },
  {
    match: /hexadecimal 3B/i,
    text: "En hexadecimal, 3B equivale a 3 × 16 + 11, porque B representa 11. El resultado es 59 en decimal; no basta con leer las dos cifras como si pertenecieran a base diez.",
  },
  {
    match: /2048 palabras.*16 bits/i,
    text: "La capacidad se obtiene multiplicando 2048 palabras por 16 bits: son 32768 bits. Al dividir entre 8 se obtienen 4096 bytes, es decir, 4 KiB, que el test expresa como 4 KB.",
  },
  {
    match: /SRAM|Synchronous Random-Access Memory/i,
    text: "SRAM significa Static Random-Access Memory, no Synchronous RAM. Mantiene cada bit mediante biestables mientras recibe alimentación, no necesita refresco y por su rapidez y mayor coste se emplea habitualmente como caché.",
  },
  {
    match: /UTF-?8/i,
    text: "UTF-8 es una codificación Unicode de longitud variable: usa entre uno y cuatro bytes por carácter. Los caracteres ASCII conservan su representación de un byte, por lo que un texto ASCII no ocupa necesariamente más al codificarlo en UTF-8.",
  },
  {
    match: /sistema octal corresponde al decimal 53/i,
    text: "Para pasar 53 a octal se divide sucesivamente entre 8: 53 = 6 × 8 + 5. Leyendo cociente y resto se obtiene 65 en base ocho.",
  },
  {
    match: /mayor cantidad de información/i,
    text: "Hay que convertir todas las opciones a la misma unidad. 1042 MB supera 1 GB si el ejercicio adopta 1 GB = 1000 MB, y también supera claramente 100 millones de bits y 200000 KB.",
  },
  {
    match: /forma de acceso a la memoria principal/i,
    text: "La memoria principal es de acceso aleatorio porque puede leerse o escribirse una posición directamente a partir de su dirección, sin recorrer antes todas las posiciones anteriores como ocurriría en un acceso secuencial.",
  },
  {
    match: /interpretar y ejecutar directamente.*lenguaje m[aá]quina/i,
    text: "La CPU ejecuta directamente instrucciones codificadas en su lenguaje máquina. El pseudocódigo y los lenguajes interpretados necesitan traducción o la intervención de otro programa antes de convertirse en instrucciones ejecutables por el procesador.",
  },
  {
    match: /microprocesadores multinúcleo|clúster de servidores interconectados/i,
    text: "Un sistema multinúcleo o un clúster puede mantener varios flujos de instrucciones actuando sobre varios flujos de datos, por lo que encaja en MIMD. SISD solo contempla un flujo de cada tipo y SIMD comparte una instrucción sobre múltiples datos.",
  },
  {
    match: /supervisar la transferencia de información.*unidad aritmético-lógica|indica a la unidad aritmético-lógica/i,
    text: "La unidad de control interpreta la instrucción y genera las señales que coordinan registros, memoria, entrada/salida y ALU. La ALU realiza la operación aritmética o lógica indicada, pero no dirige por sí misma el ciclo completo.",
  },
  {
    match: /de entre los siguientes números.*cuál es el menor/i,
    text: "Al convertir todos los valores a decimal se pueden comparar sin mezclar bases: 2A0₁₆ es 672, 1226₈ es 662, 690 ya está en decimal y 1010110100₂ es 692. Por tanto, 1226 en octal es el menor.",
  },
  {
    match: /procesador de dos núcleos/i,
    text: "Un procesador de dos núcleos incorpora dos unidades de ejecución capaces de trabajar concurrentemente. Los núcleos no se reparten obligatoriamente RAM, disco ni operaciones lógicas y aritméticas; cada uno puede ejecutar su propio flujo de instrucciones.",
  },
  {
    match: /puerta l[oó]gica de tipo XOR/i,
    text: "XOR, u OR exclusiva, vale 1 exactamente cuando las dos entradas son distintas. Con dos entradas esto significa que solo una de ellas vale 1; si ambas coinciden, el resultado es 0.",
  },
  {
    match: /Windows 32 bits/i,
    text: "Con direcciones de 32 bits existen 2³² posiciones direccionables. Si cada posición representa un byte, el espacio máximo teórico es de 4 GiB, aunque parte puede quedar reservada para dispositivos.",
  },
  {
    match: /CISC dispone de un número escaso de modos de direccionamiento/i,
    text: "La afirmación incorrecta es atribuir a CISC pocos modos de direccionamiento: precisamente CISC suele ofrecer instrucciones complejas y numerosos modos. RISC favorece instrucciones simples de tamaño fijo, muchos registros y control cableado.",
  },
  {
    match: /decisiones a medio y largo plazo/i,
    text: "El nivel estratégico toma decisiones de alcance global y horizonte medio o largo. El nivel táctico concreta planes para áreas de la organización y el operacional se ocupa de la actividad cotidiana.",
  },
  {
    match: /puerta l[oó]gica de tipo XNOR/i,
    text: "XNOR es la negación de XOR y actúa como comparador de igualdad: produce 1 cuando ambas entradas tienen el mismo valor, tanto 0-0 como 1-1.",
  },
  {
    match: /modos de direccionamiento.*INCORRECTA|Direccionamiento asociativo/i,
    text: "Implícito, inmediato e indirecto son modos de direccionamiento de operandos. “Asociativo” describe una técnica de búsqueda o correspondencia de memoria, especialmente en caché, y no uno de los modos de direccionamiento enumerados en el tema.",
  },
  {
    match: /contador de programa|\bPC\b.*siguiente instrucción/i,
    text: "El contador de programa, PC, almacena la dirección de la siguiente instrucción que debe buscarse en memoria. Al realizar la búsqueda se actualiza; el registro de instrucción, IR, conserva en cambio la instrucción que se está decodificando o ejecutando.",
  },
  {
    match: /¿Qué contiene el registro IR|Registro de Instrucción/i,
    text: "El registro de instrucción, IR, conserva la instrucción que acaba de leerse y se está decodificando o ejecutando. La dirección de la siguiente instrucción pertenece al contador de programa, PC, no al IR.",
  },
  {
    match: /operaciones que se realizan durante la ejecución de una instrucción/i,
    text: "Cada transferencia u operación elemental realizada dentro del ciclo de una instrucción se denomina microoperación. Una instrucción máquina se descompone en varias microoperaciones coordinadas por la unidad de control.",
  },
  {
    match: /registro almacena la ALU el resultado/i,
    text: "El acumulador es el registro asociado tradicionalmente a la ALU para guardar resultados intermedios o finales. El MBR intercambia datos con memoria y el IR contiene la instrucción en curso.",
  },
  {
    match: /muchas instrucciones complejas.*longitud variable|arquitecturas de ordenadores RISC y CISC.*correcta/i,
    text: "CISC reúne muchas instrucciones, a menudo complejas y de longitud variable. RISC reduce y regulariza el repertorio, utiliza formatos normalmente fijos y favorece operaciones simples de tipo carga/almacenamiento.",
  },
  {
    match: /no existe el campo índice|totalmente.*asociativa/i,
    text: "En una caché totalmente asociativa cualquier bloque de memoria principal puede ocupar cualquier línea. Por eso no existe un campo índice que seleccione una línea concreta y se compara la etiqueta con todas las líneas.",
  },
  {
    match: /10 elevado a 24/i,
    text: "En el sistema decimal del SI, 10²⁴ bytes corresponde al prefijo yotta. Exa representa 10¹⁸, zetta 10²¹ y peta 10¹⁵.",
  },
  {
    match: /refresco.*memoria dinámica|memoria DRAM|reescritura periódica|condensador.*descarga/i,
    text: "En DRAM cada bit se representa mediante la carga de un condensador, que se pierde gradualmente. El refresco consiste en leer y reescribir periódicamente las celdas para restaurar esa carga antes de que desaparezca la información.",
  },
  {
    match: /Northbridge/i,
    text: "En el chipset clásico, el Northbridge gestionaba los enlaces de mayor velocidad y cercanos a la CPU, como la memoria RAM y el puerto gráfico AGP. IDE, SATA, USB, audio y otros periféricos dependían normalmente del Southbridge.",
  },
  {
    match: /técnica de segmentación|tiempo de ejecución de cada instrucción/i,
    text: "La segmentación solapa etapas de instrucciones distintas y mejora el rendimiento global o throughput. No reduce necesariamente la latencia de una instrucción individual; incluso mantiene sus etapas y puede añadir costes de control.",
  },
  {
    match: /característica de diseño.*RISC|No debe emplearse la microprogramación/i,
    text: "RISC busca una unidad de control sencilla y rápida, habitualmente cableada, por lo que evita la microprogramación propia de muchos diseños CISC. También favorece un repertorio reducido y regular y abundantes registros.",
  },
  {
    match: /Ejecución continua y en parte solapada|Pipelining/i,
    text: "Pipelining divide la ejecución en etapas y permite que varias instrucciones avancen simultáneamente por etapas diferentes. El solapamiento aumenta el número de instrucciones terminadas por unidad de tiempo.",
  },
  {
    match: /categorías de ordenadores.*Flynn|\bSIMD\b/i,
    text: "SIMD es una de las cuatro categorías de Flynn: una sola secuencia de instrucciones opera sobre múltiples flujos de datos. Las siglas SIDI, SDSP y MIMP no pertenecen a la taxonomía estándar.",
  },
  {
    match: /10 elevado a 21/i,
    text: "En el sistema decimal del SI, zetta equivale a 10²¹. Exa es 10¹⁸, peta 10¹⁵ y yotta 10²⁴, por lo que la potencia del enunciado identifica el zettabyte.",
  },
  {
    match: /2 elevado a 90/i,
    text: "El prefijo binario robi representa 2⁹⁰ bytes. Es distinto de yobi, que corresponde a 2⁸⁰, y de los prefijos binarios más pequeños exbi y zebi.",
  },
  {
    match: /2 elevado a 70/i,
    text: "Zebi corresponde a 2⁷⁰ bytes dentro de los prefijos binarios IEC. No debe confundirse con zetta, que es el prefijo decimal para 10²¹ bytes.",
  },
  {
    match: /puerta l[oó]gica de tipo NOR/i,
    text: "NOR es la negación de OR. Solo devuelve 1 cuando ninguna entrada está activa, es decir, cuando las dos entradas valen 0.",
  },
  {
    match: /dos memorias, una para instrucciones y otra para datos|arquitectura Harvard/i,
    text: "Harvard mantiene separados el almacenamiento y los caminos de acceso de datos e instrucciones, permitiendo acceder a ambos en paralelo. Von Neumann utiliza una memoria y un bus compartidos para los dos tipos de contenido.",
  },
  {
    match: /CPU está compuesta por/i,
    text: "La CPU reúne la unidad aritmético-lógica, la unidad de control y el conjunto de registros internos. La memoria principal se comunica con la CPU, pero no forma parte de ella.",
  },
  {
    match: /ejecución simultánea de diferentes etapas/i,
    text: "La ejecución simultánea de etapas pertenecientes a instrucciones distintas es segmentación o pipeline. No significa que cada instrucción termine antes, sino que se solapan sus fases para aumentar el rendimiento.",
  },
  {
    match: /contenido del registro PC|Direccionamiento relativo/i,
    text: "En direccionamiento relativo, la dirección efectiva se calcula sumando un desplazamiento al contenido del PC. Es frecuente en saltos porque permite expresar el destino respecto de la siguiente instrucción.",
  },
  {
    match: /La ALU es una parte/i,
    text: "La ALU forma parte de la CPU y ejecuta operaciones aritméticas, lógicas y comparaciones. No es memoria ni un bus, aunque intercambia operandos y resultados con los registros internos.",
  },
  {
    match: /modelo CISC|microprogramación es una característica esencial/i,
    text: "Los diseños CISC han empleado tradicionalmente control microprogramado para traducir instrucciones complejas en operaciones internas más simples. El repertorio reducido y la implementación directa y regular son rasgos asociados a RISC.",
  },
  {
    match: /agrupación de 4 bits|Nibble/i,
    text: "Un nibble es un grupo de cuatro bits, exactamente la mitad de un byte de ocho bits. Además, cuatro bits permiten representar una cifra hexadecimal.",
  },
  {
    match: /categoría SISD/i,
    text: "SISD significa Single Instruction, Single Data: un único flujo de instrucciones actúa sobre un único flujo de datos. Es el modelo secuencial clásico y no implica paralelismo de múltiples instrucciones o datos.",
  },
  {
    match: /orden correcto de velocidad.*cach|RAM, L3, L2, L1/i,
    text: "Al acercarse al núcleo aumenta la velocidad y disminuye normalmente la capacidad: la RAM es más lenta que la caché L3, L3 es más lenta que L2 y L2 es más lenta que L1. Por eso el orden ascendente es RAM, L3, L2 y L1.",
  },
  {
    match: /sigla GPU/i,
    text: "GPU significa Graphics Processing Unit, unidad de procesamiento gráfico. Está especializada en ejecutar muchas operaciones en paralelo, inicialmente para gráficos y también para cargas de cálculo general adecuadas.",
  },
  {
    match: /arquitectura de Von Neumman.*componentes|modelo de diseño para computadores digitales/i,
    text: "El modelo de Von Neumann integra unidad de procesamiento, unidad de control, memoria y mecanismos de entrada/salida, con almacenamiento externo como apoyo. A diferencia de Harvard, no separa la memoria de datos de la de instrucciones.",
  },
  {
    match: /función principal de la unidad de procesamiento central/i,
    text: "La función general de la CPU es buscar, decodificar y ejecutar las instrucciones de los programas. Los cálculos y el control de entrada/salida son partes de esa actividad, pero no describen por sí solos su función completa.",
  },
  {
    match: /pines de contacto.*incorporados al procesador|\bPGA\b/i,
    text: "En PGA, Pin Grid Array, los pines sobresalen del encapsulado del procesador y encajan en el zócalo. En LGA los contactos están en el socket y la superficie del procesador presenta zonas planas de contacto.",
  },
  {
    match: /CPU del chip M4/i,
    text: "La configuración de CPU del M4 a la que se refiere el material combina cuatro núcleos de rendimiento y seis de eficiencia. Los primeros priorizan potencia y los segundos reducen consumo en tareas menos exigentes.",
  },
  {
    match: /14ª generación de procesadores Intel Core/i,
    text: "El nombre en clave asociado en el material a la 14.ª generación Intel Core de escritorio es Raptor Lake S. Alder Lake corresponde a una generación anterior y Tiger Lake y Comet Lake a familias aún previas.",
  },
  {
    match: /procesadores Intel ordenados de menor a mayor prestaciones/i,
    text: "La progresión propuesta va de Atom, orientado a bajo consumo, a Celeron, después la familia Core y finalmente Xeon para estaciones y servidores. Las otras listas colocan familias de altas prestaciones por debajo de gamas básicas.",
  },
  {
    match: /litografía hace referencia/i,
    text: "La litografía es el proceso de fabricación con el que se dibujan e integran transistores y conexiones en un circuito integrado. Núcleos e hilos influyen en concurrencia y paralelismo, pero las otras afirmaciones los intercambian o generalizan incorrectamente.",
  },
  {
    match: /número 450.*base decimal/i,
    text: "450 en decimal se convierte en binario descomponiéndolo en potencias de dos: 256 + 128 + 64 + 2, lo que produce 111000010₂. Las representaciones octales y hexadecimales propuestas equivalen a otros valores.",
  },
  {
    match: /número hexadecimal válido|DECAFE/i,
    text: "Una cifra hexadecimal solo puede usar 0-9 y las letras A-F. DECAFE cumple esa restricción, mientras que las demás palabras contienen letras como G, H, I, L, R o T, que no existen en base dieciséis.",
  },
  {
    match: /sistemas vectoriales y matriciales/i,
    text: "Los procesadores vectoriales y matriciales aplican una misma instrucción a múltiples elementos de datos, por lo que son SIMD. MIMD ejecutaría varios flujos de instrucciones independientes.",
  },
  {
    match: /NOT\(A\).*B XOR|valor habría que asignarle a D/i,
    text: "Con A=0, NOT(A)=1; con B=0, para que el AND final sea verdadero el XOR debe valer 1. Eso exige que NOT(C≤D)=1, es decir, que 1≤D sea falso; entre las opciones, solo D=0 cumple la condición.",
  },
  {
    match: /a=1 y b=1|a XNOR b/i,
    text: "Con ambas entradas a 1, XNOR devuelve 1 porque comprueba igualdad. XOR y NOR devuelven 0, y NAND también devuelve 0 al negar el resultado 1 de AND.",
  },
];

function buildB2T1Explanation(prompt, correctLabel, options = []) {
  const optionLabels = options.map((option) => option.label).join(" ");
  const primarySource = `${prompt} ${correctLabel}`;
  const specificRule = b2t1ExplanationRules.find((rule) => rule.match.test(primarySource))
    ?? b2t1ExplanationRules.find((rule) => rule.match.test(`${primarySource} ${optionLabels}`));

  return specificRule?.text
    ?? "El enunciado exige identificar la definición exacta recogida en el B2T1. La alternativa válida conserva la unidad, arquitectura, componente o función que describe el tema, mientras que las restantes la confunden con conceptos próximos.";
}

const b1t4ExplanationRules = [
  {
    match: /sociedades mercantiles.*capital social|participación.*superior al 50/i,
    text: "El artículo 2 incluye a las sociedades mercantiles cuando la participación pública, directa o indirecta, supera el 50 %. No basta con una participación minoritaria ni con que exista cualquier vínculo con una Administración.",
  },
  {
    match: /derechos o intereses de terceros.*plazo|15 días.*alegaciones/i,
    text: "El artículo 19.3 protege la audiencia del tercero afectado: la Administración debe comunicarle la solicitud y concederle quince días para formular alegaciones. Mientras tanto, se suspende el plazo para resolver.",
  },
  {
    match: /Presidente del Consejo de Transparencia.*período|5 años, no renovable/i,
    text: "El artículo 37 fija un mandato de cinco años no renovable para la Presidencia del Consejo de Transparencia y Buen Gobierno. Por ello, no cabe ni reducirlo a cuatro años ni prever una renovación.",
  },
  {
    match: /infracciones.*constitutivas de delito|Fiscal General del Estado/i,
    text: "Si los hechos pudieran constituir delito, la Administración debe ponerlos en conocimiento del Fiscal General del Estado y abstenerse de continuar el procedimiento hasta que finalice el proceso penal. No es una mera facultad ni corresponde al Consejo de Transparencia.",
  },
  {
    match: /publicar las circulares|circulares.*efectos jurídicos/i,
    text: "El artículo 7 obliga a publicar circulares, instrucciones y documentos similares cuando interpretan el Derecho o producen efectos jurídicos. Esa trascendencia jurídica, no una simple conveniencia interna, activa la obligación de publicidad.",
  },
  {
    match: /considera altos cargos|normativa en materia de conflictos de intereses/i,
    text: "A efectos del Título II, la Ley remite a la normativa de conflictos de intereses para determinar quién tiene la condición de alto cargo. La calificación no depende de una denominación informal del puesto.",
  },
  {
    match: /intervención en un procedimiento administrativo.*causas de abstención|causas de abstención legalmente señaladas/i,
    text: "Intervenir pese a existir una causa legal de abstención vulnera el deber de imparcialidad. La Ley 19/2013 tipifica expresamente esta conducta como infracción grave dentro del régimen disciplinario.",
  },
  {
    match: /control del cumplimiento.*publicidad activa|obligaciones en materia de publicidad activa/i,
    text: "El Consejo de Transparencia y Buen Gobierno tiene entre sus fines velar por el cumplimiento de las obligaciones de publicidad activa. Por eso es el órgano de control, no el Ministerio ni una unidad administrativa ordinaria.",
  },
  {
    match: /prescripción.*infracciones muy graves|plazo de prescripción de las infracciones/i,
    text: "El artículo 30 establece una escala de prescripción: cinco años para las infracciones muy graves, tres para las graves y uno para las leves. La pregunta pide aplicar esa primera cifra de la escala.",
  },
  {
    match: /datos especialmente protegidos(?![\s\S]*datos personales que revelen la ideología)|consentimiento expreso y por escrito(?![\s\S]*datos genéticos o biométricos)/i,
    text: "Cuando la solicitud afecta a datos especialmente protegidos, el acceso requiere con carácter general consentimiento expreso y por escrito de la persona afectada. Es una garantía reforzada de protección de datos.",
  },
  {
    match: /Estatuto del Consejo de Transparencia|Real Decreto del Consejo de Ministros/i,
    text: "El artículo 39.2 reserva la aprobación del Estatuto del Consejo de Transparencia y Buen Gobierno al Consejo de Ministros mediante Real Decreto. El Estatuto regula su organización, estructura y funcionamiento.",
  },
  {
    match: /Portal de Transparencia.*solicite con mayor frecuencia|información.*acceso.*mayor frecuencia/i,
    text: "El Portal no se limita al catálogo mínimo de publicidad activa: incorpora también la información de la Administración General del Estado cuyo acceso se solicita con mayor frecuencia. Así se evita repetir solicitudes sobre contenidos muy demandados.",
  },
  {
    match: /Ley 19\/2013 tiene por objeto|objeto.*Ley 19\/2013/i,
    text: "El artículo 1 reúne tres finalidades: ampliar y reforzar la transparencia y la publicidad activa, reconocer y garantizar el acceso a la información pública y fijar obligaciones de buen gobierno. Por eso una respuesta que reúne esos tres planos es la completa.",
  },
  {
    match: /España.*Alianza para el Gobierno Abierto|\bOGP\b.*2011/i,
    text: "Según el material del tema, España se incorporó a la Alianza para el Gobierno Abierto en 2011. Esa adhesión explica la elaboración periódica de planes nacionales de Gobierno Abierto.",
  },
  {
    match: /principios informadores.*NO.*Reutilización|Reutilización.*NO se encuentra/i,
    text: "En el esquema de Gobierno Abierto del tema, la reutilización se trata como principio técnico de la información publicada, no como uno de los principios informadores de Gobierno Abierto. No deben mezclarse ambos listados.",
  },
  {
    match: /Foro de Gobierno Abierto.*II Plan|Foro se crea como compromiso/i,
    text: "La afirmación es incorrecta porque el Foro de Gobierno Abierto no nace como compromiso del II Plan en los términos indicados por el temario. El ejercicio exige distinguir el origen y la composición del Foro de los compromisos concretos de cada Plan.",
  },
  {
    match: /grupo de trabajo del Foro.*Ética y Reutilización|Ética y Reutilización de Datos/i,
    text: "El Foro organiza sus grupos de trabajo conforme a las materias previstas en el temario; “Ética y Reutilización de Datos” no figura como grupo autónomo. La opción mezcla ámbitos reales de Gobierno Abierto con una denominación no incluida en esa estructura.",
  },
  {
    match: /cinco ejes|cinco P|Medio ambiente/i,
    text: "La Agenda 2030 se explica mediante las cinco P: Personas, Planeta, Prosperidad, Paz y Alianzas. “Medio ambiente” es una materia relacionada, pero no es el nombre de uno de esos cinco ejes.",
  },
  {
    match: /estructura de gobernanza.*Agenda 2030|Alto Comisionado para la Agenda 2030/i,
    text: "Conforme al esquema temporal del tema, el Alto Comisionado no forma parte de la estructura de gobernanza que se pregunta. Hay que responder con la estructura recogida en el material de estudio, no con órganos de otras etapas organizativas.",
  },
  {
    match: /17 Objetivos de Desarrollo Sostenible.*169 metas|Agenda 2030 plantea/i,
    text: "La Agenda 2030 se compone de 17 Objetivos de Desarrollo Sostenible y 169 metas. Las metas concretan los objetivos y por eso ambas cifras deben aparecer juntas.",
  },
  {
    match: /NO es un Objetivo de Desarrollo Sostenible|Trabajo digno y crecimiento económico/i,
    text: "El ODS 8 se denomina oficialmente “Trabajo decente y crecimiento económico”. La alternativa cambia “decente” por “digno”, por lo que no reproduce el título oficial del objetivo.",
  },
  {
    match: /principios técnicos.*Portal de la Transparencia|Accesibilidad, interoperabilidad y reutilización/i,
    text: "El artículo 11 exige que las prescripciones técnicas del Portal se ajusten, entre otros, a accesibilidad, interoperabilidad y reutilización. Son criterios de publicación y aprovechamiento de la información, no principios políticos de Gobierno Abierto.",
  },
  {
    match: /Comisión de Transparencia.*Ninguno forma parte|NO forma parte de la Comisión/i,
    text: "El artículo 36 enumera Presidente, Diputado, Senador y representantes del Tribunal de Cuentas, Defensor del Pueblo, Agencia de Protección de Datos, Secretaría de Estado y AIReF. Si todos los cargos listados aparecen en ese artículo, la respuesta correcta es que ninguno queda excluido.",
  },
  {
    match: /Presidente del Consejo de Transparencia.*Cesará|separación acordada por el Gobierno/i,
    text: "El artículo 37 prevé el cese por expiración del mandato, petición propia o separación acordada por el Gobierno tras el procedimiento correspondiente y por causas tasadas. La separación no es libre: requiere una de esas causas legales.",
  },
  {
    match: /NO está prevista.*infracción|autor hubiera sido sancionado por dos infracciones graves/i,
    text: "La Ley tipifica de forma cerrada las infracciones de buen gobierno. La conducta descrita no aparece como tipo autónomo en ese catálogo, por lo que no puede añadirse por analogía como infracción muy grave.",
  },
  {
    match: /reclamación ante el Consejo.*sustitutiva|uso potestativo antes de acudir/i,
    text: "La reclamación del artículo 24 es potestativa y sustituye al recurso administrativo que proceda; se plantea antes de acudir a la jurisdicción contencioso-administrativa. Por tanto, no es obligatoria ni equivale a una demanda judicial.",
  },
  {
    match: /acceso a la información.*vía electrónica|preferentemente por vía electrónica/i,
    text: "El artículo 22 establece que el acceso se formaliza preferentemente por vía electrónica. La excepción opera cuando no sea posible o cuando el solicitante haya indicado expresamente otro medio.",
  },
  {
    match: /resolución.*motivada.*oposición de un tercero|acceso parcial/i,
    text: "La resolución debe motivarse en los supuestos que restringen o condicionan el derecho, incluidos el acceso parcial y el acceso concedido pese a la oposición de un tercero. La motivación permite conocer cómo se han ponderado los intereses afectados.",
  },
  {
    match: /incumplimiento.*resolver en plazo.*reiterado|obligación de resolver.*reiterado/i,
    text: "El incumplimiento del plazo de resolución adquiere relevancia disciplinaria cuando es reiterado. Un retraso aislado no se transforma automáticamente en la infracción grave prevista por la Ley.",
  },
  {
    match: /derecho de acceso.*artículo|105\.b\) de la Constitución/i,
    text: "La Ley 19/2013 desarrolla el derecho de acceso previsto en el artículo 105.b) de la Constitución. No debe confundirse con otros preceptos constitucionales sobre participación, tutela judicial o protección de datos.",
  },
  {
    match: /NO es un principio técnico.*Transversalidad|Transversalidad/i,
    text: "“Transversalidad” no forma parte de los principios técnicos del artículo 11. El listado legal se centra en accesibilidad, interoperabilidad, calidad, reutilización e identificación y localización de la información.",
  },
  {
    match: /¿Cómo se define el Gobierno Abierto|mecanismos que contribuyen a la gobernanza/i,
    text: "El Gobierno Abierto se entiende en el tema como un conjunto de mecanismos que mejoran la gobernanza pública y el buen gobierno. No es un órgano administrativo ni una mera política de publicación de datos.",
  },
  {
    match: /pilares se basa el Gobierno Abierto|Transparencia, participación y colaboración/i,
    text: "Los tres pilares que utiliza el temario son transparencia, participación y colaboración. La rendición de cuentas es una consecuencia y valor asociado, pero no sustituye esa tríada básica.",
  },
  {
    match: /principios informadores del Gobierno Abierto|Datos públicos abiertos/i,
    text: "Los datos públicos abiertos son una herramienta para facilitar la reutilización, pero el temario no los incluye como principio informador autónomo. La pregunta distingue principios de instrumentos o resultados.",
  },
  {
    match: /Respecto a la participación|involucrar al público/i,
    text: "La participación no consiste solo en informar: exige involucrar a la ciudadanía y tener en cuenta sus aportaciones en la acción pública. Esa es la diferencia frente a la transparencia puramente informativa.",
  },
  {
    match: /mecanismo de evaluación.*compromisos|Mecanismo Independiente de Evaluación/i,
    text: "El Mecanismo Independiente de Evaluación es el instrumento que valora de forma externa el avance de los compromisos asumidos por cada gobierno en la Alianza para el Gobierno Abierto.",
  },
  {
    match: /actual Plan de Gobierno Abierto.*V Plan|V Plan/i,
    text: "Según la versión del temario y del test, el plan de referencia es el V Plan de Gobierno Abierto. Las preguntas de planes deben responderse con la numeración que utiliza el material de la convocatoria.",
  },
  {
    match: /Gobernanza digital e inteligencia artificial/i,
    text: "La gobernanza digital y la inteligencia artificial figuran entre los objetivos del Plan que maneja el temario. La opción conecta la transformación digital con una gestión pública abierta y responsable.",
  },
  {
    match: /10 compromisos|diez compromisos/i,
    text: "El Plan de Acción citado se estructura en diez compromisos. El número se refiere a los compromisos formales del Plan, no al número de ejes, organismos participantes u objetivos generales.",
  },
  {
    match: /compromiso.*Estado abierto|Estado abierto/i,
    text: "“Estado abierto” aparece como uno de los compromisos del Plan mencionado en el tema. La idea amplía el enfoque más allá del Ejecutivo y busca implicar a las distintas instituciones públicas.",
  },
  {
    match: /Planes de Gobierno Abierto.*Alianza para el Gobierno Abierto|elaboración es un compromiso adquirido/i,
    text: "La elaboración de planes nacionales responde al compromiso asumido por España al participar en la Alianza para el Gobierno Abierto. No es una iniciativa aislada ni un requisito ajeno a esa adhesión.",
  },
  {
    match: /acceso a la tecnología.*Internet.*ODS 9|ODS 9\. Industria/i,
    text: "La meta sobre acceso asequible y universal a las tecnologías de la información y las comunicaciones se integra en el ODS 9, dedicado a industria, innovación e infraestructura.",
  },
  {
    match: /40% más pobre.*ODS 10|ODS 10\. Reducción/i,
    text: "El crecimiento de los ingresos del 40 % más pobre por encima de la media nacional es una meta del ODS 10, cuyo foco es reducir las desigualdades dentro de los países y entre ellos.",
  },
  {
    match: /capacidad científica y tecnológica.*consumo y producción.*ODS 12|ODS 12\. Producción/i,
    text: "Fortalecer la capacidad científica y tecnológica para modalidades sostenibles de consumo y producción corresponde al ODS 12. El enunciado une expresamente tecnología y producción responsable.",
  },
  {
    match: /condición del solicitante.*acceder|Todas las personas tienen derecho a acceder/i,
    text: "El artículo 12 reconoce el derecho de acceso a todas las personas. No depende de que el solicitante acredite una condición especial ni de que justifique un interés particular.",
  },
  {
    match: /contenidos o documentos.*formato o soporte.*información pública|¿qué se entiende.*información pública/i,
    text: "El artículo 13 define información pública como los contenidos o documentos, en cualquier formato o soporte, que obren en poder de los sujetos obligados y hayan sido elaborados o adquiridos en el ejercicio de sus funciones.",
  },
  {
    match: /información de publicación general|Se inadmitirán a trámite/i,
    text: "El artículo 18 permite inadmitir las solicitudes referidas a información que tenga carácter general de publicidad. La lógica es dirigir al solicitante a la información ya publicada, sin tramitar de nuevo un acceso individual.",
  },
  {
    match: /tercer compromiso.*Integridad y rendición de cuentas|Integridad y rendición de cuentas/i,
    text: "En el Plan al que se refiere el test, el tercer compromiso se dedica a integridad y rendición de cuentas. Ambos conceptos persiguen prevenir malas prácticas y hacer controlable la actuación pública.",
  },
  {
    match: /han de publicarse sólo los contratos públicos|todos los contratos, públicos y privados/i,
    text: "El artículo 8 incluye la publicación de todos los contratos, con la información que detalla la Ley, y también las decisiones de desistimiento y renuncia. Por eso no se limita a los contratos públicos sometidos a una única norma de contratación.",
  },
  {
    match: /datos meramente identificativos.*organización|datos meramente informativos/i,
    text: "Los datos meramente identificativos relacionados con la organización, funcionamiento o actividad pública se conceden con carácter general. Solo se desplaza esa regla si, en el caso concreto, prevalece la protección de datos u otro derecho constitucional.",
  },
  {
    match: /derecho de acceso.*perjuicio para|Se podrá limitar el derecho.*perjuicio/i,
    text: "Los límites del artículo 14 no operan automáticamente: debe apreciarse un perjuicio para alguno de los intereses protegidos y realizarse una ponderación proporcionada. Por eso pueden ser correctos varios límites legalmente enumerados.",
  },
  {
    match: /Portal de Transparencia.*prescripciones técnicas|Todas las respuestas son correctas.*GOBIERNO ABIERTO/i,
    text: "Las prescripciones técnicas del Portal deben facilitar accesibilidad, interoperabilidad, calidad, reutilización, identificación y localización. Cuando las opciones recogen varios de esos requisitos legales, la respuesta conjunta es la correcta.",
  },
  {
    match: /información de relevancia jurídica.*Todas las respuestas anteriores/i,
    text: "El artículo 7 reúne varios documentos de relevancia jurídica: directrices e instrucciones con efectos jurídicos, proyectos normativos y otros documentos previstos en sus apartados. Si las opciones reproducen esos grupos, todas integran el deber de publicación.",
  },
  {
    match: /Administración General del Estado desarrollará.*Portal de Transparencia|Portal de la Transparencia.*Ministerio de la Presidencia/i,
    text: "La Ley prevé un Portal de Transparencia de la Administración General del Estado, dependiente del Ministerio de la Presidencia según el material del test, para centralizar el acceso a su información pública.",
  },
  {
    match: /información sujeta a las obligaciones de transparencia.*formatos reutilizables|artículo 5/i,
    text: "El artículo 5 exige publicar la información en sedes electrónicas o páginas web, de manera clara, estructurada y entendible y, preferiblemente, en formatos reutilizables. Además han de facilitarse accesibilidad, interoperabilidad y localización.",
  },
  {
    match: /resolución.*notificarse.*plazo máximo de un mes|notificación.*plazo máximo de un mes/i,
    text: "La resolución de acceso debe notificarse al solicitante y, cuando corresponda, a los terceros afectados que lo hayan solicitado, en el plazo máximo de un mes desde que la solicitud llega al órgano competente.",
  },
  {
    match: /solicitud de acceso.*cualquier medio|constancia de/i,
    text: "La solicitud puede presentarse por cualquier medio que permita dejar constancia de la identidad, de la información solicitada y de una dirección de contacto, entre otros extremos. Por eso las respuestas que agrupan esos requisitos son compatibles.",
  },
  {
    match: /Indique la respuesta INCORRECTA:.*grado de cumplimiento y resultados|grado de cumplimiento y resultados.*podrán ser objeto/i,
    text: "La formulación correcta del artículo 6.2 no deja la evaluación y publicación del cumplimiento como una posibilidad: establece que el grado de cumplimiento y los resultados serán objeto de evaluación y publicación periódica. El verbo “podrán” es el detalle que hace incorrecta la opción.",
  },
  {
    match: /respuesta correcta en relación al Consejo de Transparencia.*personalidad jurídica propia|organismo público.*disposición adicional décima/i,
    text: "Las dos afirmaciones son correctas: el Consejo se crea como organismo público adscrito al Ministerio competente y, al mismo tiempo, tiene personalidad jurídica propia, plena capacidad de obrar, autonomía e independencia funcional.",
  },
  {
    match: /Frente a toda resolución o presunta en materia de acceso|carácter potestativo y previo a su impugnación/i,
    text: "Frente a una resolución expresa o presunta de acceso puede interponerse reclamación ante el Consejo de Transparencia y Buen Gobierno. Es potestativa y previa a la vía contencioso-administrativa; “facultativa” no es la expresión legal del precepto.",
  },
  {
    match: /resoluciones del Consejo de Transparencia.*disociación de los datos|una vez se hayan notificado/i,
    text: "Las resoluciones del Consejo se publican por medios electrónicos una vez notificadas a las personas interesadas, pero previamente deben disociarse los datos personales que contengan. La publicación no autoriza a difundir esos datos identificativos.",
  },
  {
    match: /NO es un principio de buen gobierno.*obteniéndose|dedicación al servicio público.*obteniéndose/i,
    text: "La opción es incorrecta por una alteración literal relevante: el principio exige abstenerse de cualquier conducta contraria a esos principios, no “obtenerse”. Las demás opciones reproducen deberes de imparcialidad, igualdad y reserva propios del buen gobierno.",
  },
  {
    match: /ámbito de la Administración General del Estado.*unidades especializadas|unidades especializadas.*funciones/i,
    text: "Las unidades de información de la Administración General del Estado recaban y difunden la información de publicidad activa, reciben y tramitan solicitudes y realizan los trámites internos necesarios para dar acceso. Por eso las tres funciones son compatibles.",
  },
  {
    match: /la información pública es:.*contenidos o documentos|contenidos o documentos.*elaborados o adquiridos/i,
    text: "La definición del artículo 13 no restringe la información pública al formato electrónico: abarca contenidos o documentos en cualquier soporte que obren en poder de los sujetos obligados y se hayan elaborado o adquirido en el ejercicio de sus funciones.",
  },
  {
    match: /datos personales que revelen la ideología[\s\S]*datos genéticos o biométricos/i,
    text: "Las dos reglas de protección reforzada son correctas: ideología, afiliación sindical, religión o creencias requieren consentimiento expreso y por escrito salvo publicidad manifiesta previa; para origen racial, salud, vida sexual, datos genéticos o biométricos e infracciones no públicas se exige consentimiento expreso o cobertura legal.",
  },
  {
    match: /¿es necesario motivar la inadmisión a trámite|motivar la inadmisión a trámite/i,
    text: "Sí. El artículo 18 exige que la inadmisión se formalice mediante resolución motivada en todo caso. Los límites del artículo 14 son una cuestión distinta: se aplican al fondo del acceso, no sustituyen la motivación de una inadmisión.",
  },
  {
    match: /Objetivos Desarrollo del Milenio.*Transformar nuestro mundo|Transformar Nuestro Mundo.*Agenda 2030/i,
    text: "Las dos afirmaciones describen correctamente la adopción de la Agenda 2030 por los Estados miembros de Naciones Unidas en 2015 y su lema “Transformar nuestro mundo”. Por ello la respuesta que las reúne es la correcta.",
  },
  {
    match: /Se inadmitirán a trámite.*resolución motivada|artículo 18.*causa de inadmisión/i,
    text: "El artículo 18 exige que la inadmisión se acuerde mediante resolución motivada y enumera sus causas, como información en curso de elaboración, auxiliar, que requiera reelaboración o de publicidad general. No puede inadmitirse sin explicar la causa legal.",
  },
  {
    match: /Consejo de Transparencia y Buen Gobierno estará compuesto por|Comisión de Transparencia.*Presidente/i,
    text: "El artículo 35 configura dos órganos: la Comisión de Transparencia y Buen Gobierno y su Presidente, que preside también la Comisión. No se trata de una lista abierta de órganos adicionales.",
  },
  {
    match: /reclamación.*plazo de.*Un mes|reclamación.*mes a contar/i,
    text: "La reclamación ante el Consejo se presenta en un mes desde el día siguiente a la notificación del acto impugnado o desde que se producen los efectos del silencio administrativo. Es un plazo específico de este recurso potestativo.",
  },
  {
    match: /unidades especializadas.*Administración General del Estado/i,
    text: "En la Administración General del Estado existen unidades de información especializadas para recibir solicitudes, tramitar las que les correspondan y apoyar la transparencia. Si las opciones describen funciones previstas para esas unidades, la respuesta conjunta es correcta.",
  },
  {
    match: /finalidad promover la transparencia.*garantizar la observancia|¿Quién tiene por finalidad promover la transparencia/i,
    text: "La finalidad legal del Consejo de Transparencia y Buen Gobierno comprende promover transparencia, vigilar la publicidad activa, salvaguardar el acceso y garantizar la observancia del buen gobierno. Esa acumulación de funciones identifica al Consejo.",
  },
  {
    match: /¿Se concederá siempre el acceso.*datos especialmente protegidos|ponderación del interés público/i,
    text: "Que los datos no sean especialmente protegidos no convierte el acceso en automático. El artículo 15 obliga a ponderar el interés público en la divulgación frente a los derechos de las personas afectadas, especialmente la protección de datos.",
  },
  {
    match: /NO son límites.*relaciones laborales|relaciones laborales/i,
    text: "Las relaciones laborales no figuran en el catálogo de límites del artículo 14. En cambio, sí aparecen, por ejemplo, seguridad, defensa, intereses económicos, secreto profesional o tutela judicial efectiva.",
  },
  {
    match: /incumplimiento reiterado.*publicidad activa/i,
    text: "El incumplimiento reiterado de las obligaciones de publicidad activa se considera infracción grave a efectos del régimen disciplinario aplicable. La reiteración es el elemento que eleva la relevancia de la conducta.",
  },
  {
    match: /actividades sujetas a derecho privado/i,
    text: "La afirmación es incorrecta porque las instituciones enumeradas quedan sometidas al Título I respecto de sus actividades sujetas a Derecho administrativo, no a Derecho privado. Ese límite material delimita el alcance de la Ley.",
  },
  {
    match: /igualdad de las partes.*tutela judicial efectiva/i,
    text: "La igualdad de las partes en los procesos judiciales y la tutela judicial efectiva aparecen expresamente entre los límites del derecho de acceso. Se protege así el correcto desarrollo de los procedimientos judiciales.",
  },
  {
    match: /acceso parcial/i,
    text: "Cuando una parte de la información está afectada por un límite pero el resto puede divulgarse, procede conceder acceso parcial previa omisión de la parte protegida. La Ley evita denegar íntegramente más información de la necesaria.",
  },
  {
    match: /no es un criterio.*solicitantes.*investigadores|criterios.*datos no especialmente protegidos/i,
    text: "Al ponderar datos no especialmente protegidos, la Ley valora factores como la menor afectación por datos meramente identificativos, fines históricos o científicos y la protección de menores. La condición de investigador sin motivar la solicitud no se formula como el criterio indicado en la opción.",
  },
  {
    match: /obligatorio que el solicitante motive|no, pero se podrán exponer los motivos/i,
    text: "La solicitud no necesita motivación obligatoria. El interesado puede exponer los motivos y el órgano puede tenerlos en cuenta al resolver, pero no puede exigirlos como requisito de admisión.",
  },
  {
    match: /tratamiento posterior.*derecho de acceso|normativa de protección de datos.*tratamiento posterior/i,
    text: "Obtener información mediante el derecho de acceso no elimina la aplicación posterior de la normativa de protección de datos. La reutilización o tratamiento de los datos obtenidos debe respetar esa normativa.",
  },
  {
    match: /¿Cómo se inicia el procedimiento.*solicitud|deberá dirigirse al titular del órgano/i,
    text: "El procedimiento se inicia por solicitud dirigida al titular del órgano o entidad que posee la información. La clave es acudir al poseedor de la información, no a un órgano que carece de ella.",
  },
  {
    match: /régimen jurídico específico de acceso|normativa específica.*carácter supletorio/i,
    text: "Cuando una materia tiene un régimen específico de acceso, se aplica primero esa normativa sectorial y la Ley 19/2013 actúa con carácter supletorio. Es una regla de especialidad, no una exclusión total de la transparencia.",
  },
  {
    match: /Congreso de los Diputados.*plazo.*respectivos reglamentos|No establece plazo específico/i,
    text: "La Ley remite a los reglamentos de las Cámaras y asambleas para concretar su aplicación, pero no fija en ese precepto un plazo específico para que aprueben esa regulación.",
  },
  {
    match: /Sólo cabrá la interposición de recurso contencioso-administrativo/i,
    text: "Frente a las resoluciones de las Asambleas Legislativas e instituciones análogas que cita la Ley solo cabe recurso contencioso-administrativo. No se abre una nueva reclamación administrativa ante el Consejo.",
  },
  {
    match: /solicitudes de información.*Casa Real|Secretaría General de la Presidencia del Gobierno/i,
    text: "Según la disposición adicional del material, las solicitudes sobre información de la Casa Real se tramitan a través de la Secretaría General de la Presidencia del Gobierno. La respuesta identifica ese cauce específico.",
  },
  {
    match: /Consejo de Transparencia.*Agencia Española de Protección de Datos.*conjuntamente/i,
    text: "La Ley prevé que el Consejo de Transparencia y la Agencia Española de Protección de Datos adopten conjuntamente criterios de aplicación para ponderar acceso, interés público y derechos de las personas afectadas.",
  },
  {
    match: /Comunidades Autónomas.*atribuir la competencia.*convenio|sufragará los gastos/i,
    text: "Las Comunidades Autónomas pueden atribuir al Consejo la resolución de reclamaciones mediante convenio con la Administración General del Estado. Ese convenio debe regular las condiciones y la financiación de la competencia asumida.",
  },
  {
    match: /Será gratuito.*plazo máximo.*1 mes|Derecho de acceso.*gratuito/i,
    text: "El acceso es gratuito, sin perjuicio de que puedan repercutirse determinados costes de expedición de copias o cambio de formato. La resolución debe dictarse y notificarse, con carácter general, en un mes.",
  },
  {
    match: /40%.*ingresos anuales.*5\.000 euros|entidades privadas.*cumplir/i,
    text: "Las entidades privadas quedan sujetas a estas obligaciones cuando las ayudas o subvenciones públicas alcancen al menos el 40 % de sus ingresos anuales y, además, un mínimo de 5.000 euros. Deben cumplirse ambos umbrales.",
  },
  {
    match: /Agencia Estatal de la Administración del Estado|NO forma parte.*Comisión/i,
    text: "La Comisión incluye un representante de la Agencia Española de Protección de Datos, no de una supuesta Agencia Estatal de la Administración del Estado. La diferencia de organismo es la que permite descartar la opción.",
  },
  {
    match: /convocará a los representantes.*Administración Local.*Federación Española de Municipios/i,
    text: "Al menos una vez al año, la Comisión convoca a los organismos autonómicos con funciones análogas. En esa reunión puede convocarse también a un representante de la Administración Local propuesto por la FEMP.",
  },
  {
    match: /Agenda 2030.*160 metas/i,
    text: "La afirmación es incorrecta porque la Agenda 2030 contiene 169 metas, no 160. Mantiene los 17 ODS, pero falla precisamente en la cifra de metas.",
  },
  {
    match: /Poner fin al hambre.*objetivo|Hambre cero/i,
    text: "Poner fin al hambre, lograr la seguridad alimentaria, mejorar la nutrición y promover una agricultura sostenible describe el ODS 2, “Hambre cero”.",
  },
  {
    match: /Poner fin a la pobreza.*objetivo.*número|Fin de la pobreza/i,
    text: "Poner fin a la pobreza en todas sus formas y en todo el mundo es el ODS 1, “Fin de la pobreza”.",
  },
  {
    match: /igualdad entre los géneros.*mujeres y las niñas|empoderar a todas las mujeres/i,
    text: "Lograr la igualdad de género y empoderar a todas las mujeres y niñas corresponde al ODS 5, “Igualdad de género”.",
  },
];

function buildB1T4Explanation(prompt, correctLabel, options = []) {
  const optionLabels = options.map((option) => option.label).join(" ");
  const primarySource = `${prompt} ${correctLabel}`;
  // Las alternativas de descarte no deben desplazar la explicación del enunciado correcto.
  const specificRule = b1t4ExplanationRules.find((rule) => rule.match.test(primarySource))
    ?? b1t4ExplanationRules.find((rule) => rule.match.test(`${primarySource} ${optionLabels}`));

  if (specificRule) {
    return specificRule.text;
  }

  return `La pregunta se resuelve distinguiendo el supuesto concreto que plantea la Ley 19/2013 o el apartado de Gobierno Abierto y Agenda 2030 del temario. La opción válida reproduce ese requisito específico, mientras que las demás alteran el órgano, plazo, ámbito o condición aplicable.`;
}

function buildExplanation(code, prompt, _correctOptionId, correctLabel, options = []) {
  const specificReason = code === "B1T4"
    ? buildB1T4Explanation(prompt, correctLabel, options)
    : code === "B2T1"
      ? buildB2T1Explanation(prompt, correctLabel, options)
    : explanationRules.find((rule) => rule.match.test(`${prompt} ${correctLabel}`))?.text;
  const fallback = topicFallbacks[code] ?? "La respuesta correcta es la que cumple de forma exacta la definición o regla que plantea el enunciado; las demás modifican algún requisito esencial.";
  const suffix = /[.!?…]$/.test(correctLabel) ? "" : ".";

  return `Por qué: ${specificReason ?? fallback} La respuesta correcta es «${correctLabel}${suffix}». ${resolveTemarioReference(code, prompt, correctLabel)}`;
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
      explanation: buildExplanation(meta.code, parsedBlock.prompt, correctOption, correctLabel, parsedBlock.options),
    });
  }

  return {
    ...meta,
    questions,
  };
}
