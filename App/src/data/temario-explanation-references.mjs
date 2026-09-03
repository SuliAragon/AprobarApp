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
  B1T4: {
    fallback: "Gobierno Abierto, Ley de Transparencia, buen gobierno y Agenda 2030",
    rules: [[/publicidad activa|Portal de Transparencia|organigrama|contrato|sociedades mercantiles|informaci.n econ.mica|informaci.n de relevancia jur.dica/i, "Ley 19/2013 · Publicidad activa"], [/acceso|solicitud|l.mite|tercero|reelaboraci.n|informaci.n p.blica|datos personales/i, "Ley 19/2013 · Derecho de acceso a la información pública"], [/Consejo de Transparencia|alto cargo|buen gobierno|reclamaci.n|abstenci.n/i, "Buen gobierno y Consejo de Transparencia y Buen Gobierno"], [/Agenda 2030|ODS|Objetivo de Desarrollo Sostenible|Naciones Unidas|desarrollo sostenible/i, "Agenda 2030 y Objetivos de Desarrollo Sostenible"], [/Gobierno Abierto|OGP|participaci|colaboraci|rendici.n de cuentas/i, "Gobierno Abierto y principios informadores"]],
  },
  B1T5: {
    fallback: "Texto Refundido del Estatuto Basico del Empleado Publico (TREBEP)",
    rules: [
      [/Constituci.n|art.culo 103|art.culo 23|art.culo 105|art.culo 106|principio/i, "Marco constitucional y principios de la Administracion publica"],
      [/mbito|ambito|empleado p.blico|funcionario de carrera|interino|laboral|eventual|directivo/i, "Ambito de aplicacion y clases de empleados publicos"],
      [/derecho|negociaci.n|sindica|huelga|jornada|permiso|vacaciones|teletrabajo|c.digo de conducta|deber/i, "Derechos, negociacion colectiva, jornada y codigo de conducta"],
      [/acceso|selecci.n|oposici.n|concurso-oposici.n|nombramiento|p.rdida de la condici.n|oferta de empleo|RPT|clasificaci.n/i, "Acceso, adquisicion de la condicion y estructuracion del empleo publico"],
      [/carrera|promoci.n interna|evaluaci.n del desempe.o|retribuci.n|sueldo|trienio|complement/i, "Carrera profesional, evaluacion y retribuciones"],
      [/provisi.n|libre designaci.n|servicio activo|servicios especiales|excedencia|suspensi.n|incompatibil/i, "Provision de puestos, situaciones administrativas e incompatibilidades"],
      [/disciplin|infracci.n|sanci.n/i, "Regimen disciplinario"],
    ],
  },
  B2T1: {
    fallback: "Informática básica, representación de la información y arquitectura de ordenadores",
    rules: [[/SRAM|DRAM|ROM|PROM|EPROM|EEPROM|FLASH|memoria interna|cach.|localidad|asociativa|LRU|FIFO|LFU|condensador/i, "Componentes internos · Memoria interna y caché"], [/ASCII|Unicode|UTF-?8|UTF-?16|UTF-?32|codificaci.n/i, "Unicode y codificación de textos"], [/bit|byte|palabra|nibble|KiB|MiB|GiB|capacidad|FLOPS|hercio/i, "Informática básica y unidades de información"], [/binario|octal|decimal|hexadecimal|base numérica|conversión/i, "Sistemas de numeración"], [/puerta|\bAND\b|\bNAND\b|\bOR\b|\bNOR\b|\bXOR\b|\bXNOR\b|lógica/i, "Funciones lógicas básicas"], [/sistema de informaci.n|operacional|táctico|tactico|estratégico|estrategico|dato e informaci.n/i, "Elementos y niveles de los sistemas de información"], [/contador de programa|\bPC\b|registro de instrucci.n|\bIR\b|\bMAR\b|\bMBR\b|\bMDR\b|ciclo de instrucci.n|direccionamiento|ALU|unidad de control|pipelining|segmentaci.n/i, "Organización del procesador · Registros y ciclo de instrucción"], [/Von Neumann|Harvard|Flynn|SISD|SIMD|MISD|MIMD|RISC|CISC/i, "Arquitecturas de ordenadores"], [/placa base|bus de datos|bus de direcciones|chipset|Northbridge|Southbridge|socket|PGA|LGA|microprocesador|GPU/i, "Componentes internos · Placa base y microprocesadores"], [/BIOS|UEFI|POST|arranque|boot/i, "Componentes internos · Proceso de arranque"]],
  },
  B2T3: {
    fallback: "Tipos abstractos y estructuras de datos",
    rules: [[/array|vector|registro|lista enlazada/i, "Tipos abstractos y estructuras de datos · Arrays, registros y listas"], [/pila|stack|cola|FIFO|LIFO|hash|diccionario|mapa/i, "Tipos abstractos y estructuras de datos · Pilas, colas, mapas y tablas hash"], [/árbol|arbol|inorden|preorden|posorden|AVL/i, "Tipos abstractos y estructuras de datos · Árboles"], [/grafo|Kruskal|Floyd|Dijkstra/i, "Tipos abstractos y estructuras de datos · Grafos y algoritmos de teoría de grafos"], [/búsqueda|ordenación|burbuja|complejidad|recursiv/i, "Algoritmos"], [/fichero|JSON|SVG|JPEG|imagen|audio|vídeo|video|documento/i, "Formatos de información y ficheros"]],
  },
  B2T4: {
    fallback: "Sistemas operativos: características y elementos constitutivos",
    rules: [[/proceso|thread|planific|Round Robin|SJF|FCFS|daemon|zombie|concurrencia/i, "Administración de procesos y planificación"], [/paginación|paginacion|segmentación|segmentacion|memoria|reemplazo de páginas|fallo de página/i, "Administración de la memoria"], [/fichero|archivo|i-nodo|inode|ext4|NTFS|APFS|JFS|Reiser|partici/i, "Administración de archivos y sistemas de ficheros"], [/Windows|Active Directory|registro|Azure|App-V|Insider/i, "Sistemas Windows"], [/UNIX|Linux|chmod|umask|Samba|\/(etc|bin|sbin|var)|redirecci|distribución|distribucion/i, "Sistemas UNIX y Linux"], [/Android|iOS|Firefox OS|Cocoa Touch|Gonk|móvil|movil/i, "Sistemas operativos para dispositivos móviles"], [/microkernel|monolít|monolit|máquina virtual|maquina virtual|sistema operativo|kernel/i, "Definición, estructura y componentes del sistema operativo"]],
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
