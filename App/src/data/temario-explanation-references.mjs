const references = {
  B1T1: {
    fallback: "Constitución Española: estructura, Título Preliminar, Título I, garantías y Corona",
    rules: [[/nacionalidad|extranjeros|españoles/i, "Título I · Capítulo I: Españoles y extranjeros"], [/amparo|garantía|suspensi|Defensor del Pueblo/i, "Garantía y suspensión"], [/Rey|Corona|Regencia|refrendo|sucesión/i, "La Corona y funciones constitucionales del Rey"], [/derecho|libertad|igualdad|huelga|asociaci|domicilio|detención|habeas/i, "Título I · Derechos y deberes fundamentales"]],
  },
  B1T2: {
    fallback: "Cortes Generales, Tribunal Constitucional y Defensor del Pueblo",
    rules: [[/Congreso|Diputados/i, "El Congreso de los Diputados"], [/Senado|senadores/i, "El Senado"], [/ley orgánica|ley ordinaria|decreto-ley|delegación|iniciativa|referéndum/i, "Elaboración de las leyes"], [/tratado|convenio internacional/i, "Tratados internacionales"], [/Tribunal Constitucional|recurso de inconstitucionalidad|conflicto/i, "El Tribunal Constitucional"], [/Defensor del Pueblo/i, "El Defensor del Pueblo"]],
  },
  B1T3: {
    fallback: "El Gobierno: composición, funciones y relaciones con las Cortes Generales",
    rules: [[/Consejo de Ministros|Vicepresidente|Ministro|Secretario de Estado|composición/i, "Composición del Gobierno y órganos de colaboración y apoyo"], [/investidura|nombramiento|cese|Gobierno en funciones/i, "Nombramiento y cese"], [/moción de censura|cuestión de confianza|Cortes|alarma|excepción|sitio/i, "Relaciones entre el Gobierno y las Cortes Generales"], [/potestad reglamentaria|función ejecutiva|Presidente del Gobierno/i, "Las funciones del Gobierno"]],
  },
  B2T3: {
    fallback: "Tipos abstractos y estructuras de datos",
    rules: [[/array|vector|registro|lista enlazada/i, "Tipos abstractos y estructuras de datos · Arrays, registros y listas"], [/pila|stack|cola|FIFO|LIFO|hash|diccionario|mapa/i, "Tipos abstractos y estructuras de datos · Pilas, colas, mapas y tablas hash"], [/árbol|arbol|inorden|preorden|posorden|AVL/i, "Tipos abstractos y estructuras de datos · Árboles"], [/grafo|Kruskal|Floyd|Dijkstra/i, "Tipos abstractos y estructuras de datos · Grafos y algoritmos de teoría de grafos"], [/búsqueda|ordenación|burbuja|complejidad|recursiv/i, "Algoritmos"], [/fichero|JSON|SVG|JPEG|imagen|audio|vídeo|video|documento/i, "Formatos de información y ficheros"]],
  },
  B2T4: {
    fallback: "Sistemas operativos: características y elementos constitutivos",
    rules: [[/proceso|thread|planific|Round Robin|SJF|FCFS|daemon|zombie|concurrencia/i, "Administración de procesos y planificación"], [/paginación|paginacion|segmentación|segmentacion|memoria|reemplazo de páginas|fallo de página/i, "Administración de la memoria"], [/fichero|archivo|i-nodo|inode|ext4|NTFS|APFS|JFS|Reiser|partici/i, "Administración de archivos y sistemas de ficheros"], [/Windows|Active Directory|registro|Azure|App-V|Insider/i, "Sistemas Windows"], [/UNIX|Linux|chmod|umask|Samba|\/(etc|bin|sbin|var)|redirecci|distribución|distribucion/i, "Sistemas UNIX y Linux"], [/Android|iOS|Firefox OS|Cocoa Touch|Gonk|ART|móvil|movil/i, "Sistemas operativos para dispositivos móviles"], [/microkernel|monolít|monolit|máquina virtual|maquina virtual|sistema operativo|kernel/i, "Definición, estructura y componentes del sistema operativo"]],
  },
  B2T5: {
    fallback: "Sistemas de gestión de bases de datos",
    rules: [[/transacción|ACID|consistencia|aislamiento|serializable/i, "Sistemas de gestión de bases de datos (SGBD)"], [/Oracle|PostgreSQL|MySQL|MariaDB|SQLite|SQL Server|relacional|Codd/i, "SGBD relacionales"], [/orientado a objetos|Zope|Object DB|OID/i, "SGBD orientado a objetos"], [/NoSQL|MongoDB|Redis|Cassandra|Neo4j|Bigtable|HBase|BASE/i, "SGBD NoSQL"], [/serie temporal|geoespacial|multimedia/i, "Otros tipos de bases de datos"]],
  },
  B3T1: {
    fallback: "Modelo Entidad-Relación extendido y validación del modelo ER",
    rules: [[/entidad|atributo|relación|relacion|dominio|cardinalidad|correspondencia/i, "Modelo Entidad-Relación extendido"], [/jerarquía|jerarquia|generalización|generalizacion|especialización|especializacion|supertipo|subtipo/i, "Extensiones del modelo Entidad-Relación"], [/construcción|construccion|validación|validacion|verificaci/i, "Construcción y validación del modelo ER"]],
  },
  B3T2: {
    fallback: "Diseño de bases de datos y normalización",
    rules: [[/diseño lógico|diseño logico|transformación|transformacion|modelo conceptual/i, "Diseño lógico"], [/diseño físico|diseño fisico|índice|indice|organización de ficheros|optimización/i, "Diseño físico"], [/clave|integridad|tupla|relación|relacion|dominio|álgebra|algebra/i, "El modelo lógico relacional"], [/forma normal|1FN|2FN|3FN|FNBC|dependencia funcional|normalización/i, "Normalización"]],
  },
  B3T4: {
    fallback: "Lenguajes de interrogación de bases de datos",
    rules: [[/DDL|CREATE|ALTER|DROP|TRUNCATE|vista|dominio|esquema/i, "Estándar ANSI SQL · Lenguaje de definición de datos (DDL)"], [/SELECT|INSERT|UPDATE|DELETE|JOIN|GROUP BY|HAVING|consulta/i, "Estándar ANSI SQL · Lenguaje de manipulación de datos (DML)"], [/GRANT|REVOKE|COMMIT|ROLLBACK|SAVEPOINT|privilegio/i, "Estándar ANSI SQL · Lenguaje de control de datos (DCL)"], [/procedimiento almacenado|PL\/SQL|parámetro|parametro/i, "Procedimientos almacenados"], [/trigger|disparador|evento/i, "Eventos y disparadores"], [/ODBC|JDBC|driver/i, "Estándares de conectividad: ODBC y JDBC"]],
  },
};

export function resolveTemarioReference(code, prompt, correctLabel = "") {
  const reference = references[code];

  if (!reference) {
    return "Referencia del temario: apartado correspondiente del tema.";
  }

  const section = reference.rules.find(([pattern]) => pattern.test(`${prompt} ${correctLabel}`))?.[1] ?? reference.fallback;
  return `Referencia del temario: ${code} · ${section}.`;
}

export function withTemarioReference(question, code) {
  if (question.explanation?.includes("Referencia del temario:")) {
    return question;
  }

  const correctLabel = question.options?.find((option) => option.id === question.correctOption)?.label ?? "";
  return {
    ...question,
    explanation: `${question.explanation?.trim() ?? ""} ${resolveTemarioReference(code, question.prompt ?? "", correctLabel)}`.trim(),
  };
}
