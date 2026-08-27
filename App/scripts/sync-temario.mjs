import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseOfficialTestText } from "./lib/official-tests-parser.mjs";
import { buildTemarioCatalog, isSupportedTemarioFile } from "./lib/temario-catalog.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = resolve(projectRoot, "..", "Temario");
const publicDir = resolve(projectRoot, "public", "temario");
const podcastPublicDir = resolve(projectRoot, "public", "podcast");
const manifestFile = resolve(projectRoot, "src", "data", "generated", "temarios.json");
const officialSourceDir = resolve(projectRoot, "..", "Test");
const officialPublicDir = resolve(projectRoot, "public", "test-oficial");
const officialManifestFile = resolve(projectRoot, "src", "data", "generated", "official-materials.json");
const officialTestsFile = resolve(projectRoot, "src", "data", "generated", "official-tests.json");
const simulationSourceDirs = [resolve(officialSourceDir, "Simulacros"), resolve(sourceDir, "Simulacros")];
const simulationPublicDir = resolve(projectRoot, "public", "simulacros");
const simulationManifestFile = resolve(projectRoot, "src", "data", "generated", "simulacros.json");
const interactiveSimulationsFile = resolve(projectRoot, "src", "data", "generated", "interactive-simulacros.json");

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function deriveCode(filename) {
  const match = filename.match(/^([A-Za-z0-9]+)/);
  return match ? match[1].toUpperCase() : "";
}

function prettifyOfficialFilename(filename, code) {
  const baseName = filename.replace(/\.[^.]+$/, "");
  let normalized = baseName.replace(new RegExp(`^${code}`, "i"), "");

  normalized = normalized
    .replace(/_/g, " ")
    .replace(/\s+\d+$/, "")
    .replace(/\s+/g, " ")
    .trim();

  if (/^test/i.test(normalized)) {
    return normalized.replace(/^test/i, "Test oficial").trim();
  }

  if (/^ejercicios?/i.test(normalized)) {
    return normalized.replace(/^ejercicios?/i, "Ejercicios").trim();
  }

  return normalized || baseName;
}

function deriveOfficialKind(filename) {
  if (/ejercicios?/i.test(filename)) {
    return "exercise";
  }

  if (/test/i.test(filename)) {
    return "official-test";
  }

  return "resource";
}

function collectFilesRecursively(directory) {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }

    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectFilesRecursively(fullPath));
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

function prettifySimulationFilename(filename) {
  const baseName = filename.replace(/\.[^.]+$/, "");

  return baseName
    .replace(/_/g, " ")
    .replace(/\s*\(\d+\)$/, "")
    // Keep "Simulacro 2" while discarding only a trailing copy suffix.
    .replace(/(\s+\d+)\s+\d+$/, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function writeJsonFile(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

const simulationQuestionRepairs = {
  "simulacro-1": {
    74: {
      prompt: "El modelo Entidad-Relación es un:",
      options: ["Modelo conceptual.", "Modelo lógico.", "Modelo físico.", "Modelo multidimensional."],
      correctOption: "a",
      explanation: "Por qué: el modelo Entidad-Relación representa la realidad y las reglas de negocio antes de transformar el diseño a tablas o estructuras físicas; por eso pertenece al nivel conceptual.",
    },
    76: {
      prompt: "En relación al modelo Entidad-Relación, indique cuál de las siguientes afirmaciones es correcta:",
      options: ["Un tipo de entidad fuerte no puede tener una dependencia de existencia con respecto a otro tipo de entidad.", "Un atributo multivaluado se representa con un óvalo con línea discontinua.", "El discriminante o clave parcial de una entidad débil se indica con un óvalo con línea doble.", "El grado de una relación es el número de tipos de entidad que pueden intervenir en una ocurrencia de ese tipo de relación."],
      correctOption: "d",
      explanation: "Por qué: el grado de una relación se determina por el número de tipos de entidad que participan en ella. Las demás opciones confunden las notaciones de atributos y entidades débiles.",
    },
  },
  "simulacro-2": {
    49: {
      prompt: "¿A quién corresponde velar por los poderes de las Cámaras cuando éstas no estén reunidas?",
      options: ["A la Diputación Permanente de las Cortes Generales.", "A la Comisión de Vigilancia de las Cortes Generales.", "A la Diputación Permanente de cada Cámara.", "Al Consejo de Estado."],
      correctOption: "c",
      explanation: "Por qué: el artículo 78 de la Constitución prevé una Diputación Permanente en cada Cámara, encargada de velar por sus poderes cuando no están reunidas o han expirado su mandato.",
    },
    54: {
      prompt: "Indique a qué corresponden las siglas ACID refiriéndose a una transacción de base de datos:",
      options: ["Authentication, Consistency, Isolation, Durability.", "Atomicity, Consistency, Isolation, Durability.", "Availability, Consistency, Isolation, Durability.", "Availability, Correctness, Isolation, Durability."],
      correctOption: "b",
      explanation: "Por qué: ACID resume las propiedades de una transacción fiable: atomicidad, consistencia, aislamiento y durabilidad. Authentication y availability no forman parte de este acrónimo.",
    },
    69: {
      prompt: "Dada la tabla DATOS(A), con valores 15, 3, NULL y 7, ¿cuál será el resultado de ejecutar SELECT SUM(A) FROM DATOS?",
      options: ["25.", "18.", "0.", "NULL."],
      correctOption: "a",
      explanation: "Por qué: SUM ignora los valores NULL. La suma de los valores no nulos es 15 + 3 + 7, que da 25.",
    },
    70: {
      prompt: "Dada la tabla DATOS(A, B) de la pregunta anterior, ¿cuántas filas devolverá SELECT COUNT(A) FROM DATOS GROUP BY A HAVING COUNT(A) > 0?",
      options: ["1.", "2.", "3.", "4."],
      correctOption: "c",
      explanation: "Por qué: GROUP BY A forma un grupo por cada valor distinto. HAVING COUNT(A) > 0 excluye el grupo de NULL porque COUNT(A) no cuenta nulos; quedan los tres valores no nulos.",
    },
    71: {
      prompt: "Dada la tabla DATOS(A, B), ¿cuántas filas devolverá SELECT A FROM DATOS GROUP BY A HAVING A IS NOT NULL?",
      options: ["1.", "2.", "3.", "4."],
      correctOption: "c",
      explanation: "Por qué: tras agrupar por A, HAVING A IS NOT NULL descarta el grupo cuyo valor de A es NULL. Permanecen los tres grupos correspondientes a los valores no nulos.",
    },
    72: {
      prompt: "Con la tabla DATOS(A, B) anterior, ¿cuál es el resultado de ejecutar SELECT AVG(A+B) FROM DATOS?",
      options: ["15.", "13,25.", "18.", "Ninguna de las respuestas anteriores es correcta."],
      correctOption: "a",
      explanation: "Por qué: las expresiones que incluyen un NULL producen NULL y AVG ignora esos resultados. Se promedian 25, 10 y 10, por lo que el resultado es 15.",
    },
    73: {
      prompt: "En un modelo Entidad/Relación, un tipo de interrelación se caracteriza por:",
      options: ["El nombre y el tipo de correspondencia.", "El nombre y el grado.", "El nombre, el nivel y el tipo de correspondencia.", "El nombre, el grado y el tipo de correspondencia."],
      correctOption: "d",
      explanation: "Por qué: una interrelación se identifica por su nombre, por su grado (número de tipos de entidad participantes) y por el tipo de correspondencia o cardinalidad.",
    },
  },
  "simulacro-3": {
    62: {
      prompt: "¿Qué muestra el comando top en UNIX?",
      options: ["Los ficheros abiertos.", "El escritorio.", "Los procesos.", "Los puertos TCP/IP."],
      correctOption: "c",
      explanation: "Por qué: top muestra de forma dinámica los procesos en ejecución y datos de carga, CPU y memoria. No es una herramienta para listar ficheros, el escritorio o puertos de red.",
    },
    64: {
      prompt: "En el ámbito de las bases de datos Oracle, una vista materializada:",
      options: ["Es un objeto de la base de datos donde se almacena la información de todas las vistas de la BD.", "Es un objeto de la base de datos donde se almacena la definición de la tabla que materializa.", "Es un objeto de la base de datos donde se almacena el resultado de una consulta.", "Es una vista ordinaria que automáticamente se actualizará siempre que se actualicen las tablas involucradas en esa vista."],
      correctOption: "c",
      explanation: "Por qué: una vista materializada persiste el resultado de una consulta y puede actualizarse mediante mecanismos de refresco. Una vista ordinaria almacena la definición de la consulta, no sus resultados.",
    },
    82: {
      prompt: "¿Cuál de las siguientes es una regla de Codd?",
      options: ["Dependencia física de los datos.", "Dependencia lógica de los datos.", "Regla de la inversión.", "Actualización de vistas."],
      correctOption: "d",
      explanation: "Por qué: entre las reglas de Codd está la de actualización de vistas, que exige que las vistas teóricamente actualizables puedan actualizarse por el sistema. Las dependencias física y lógica contradicen la independencia de datos.",
    },
    87: {
      prompt: "Podremos almacenar un fichero de 6 GB en un dispositivo si el sistema de ficheros con el que está formateado es:",
      options: ["FAT32.", "NTFS.", "HPFS.", "ISO 9660:1988 Level 2."],
      correctOption: "b",
      explanation: "Por qué: FAT32 tiene un límite de tamaño por fichero inferior a 4 GB, mientras que NTFS admite archivos mucho mayores. Por ello un fichero de 6 GB puede almacenarse en NTFS.",
    },
  },
  "simulacro-4": {
    1: {
      prompt: "Están legitimados para interponer el recurso de amparo, según la Constitución Española:",
      options: ["El Gobierno.", "Las Comunidades Autónomas.", "El Presidente del Gobierno.", "El Ministerio Fiscal."],
      correctOption: "d",
      explanation: "Por qué: el artículo 162.1.b de la Constitución reconoce legitimación para el recurso de amparo, entre otros, al Ministerio Fiscal. El Gobierno, su Presidente y las Comunidades Autónomas no figuran como legitimados en ese precepto.",
    },
    3: {
      prompt: "De conformidad con el artículo 9 de la Constitución Española, la Constitución garantiza (señale la respuesta INCORRECTA):",
      options: ["El principio de legalidad.", "La jerarquía normativa.", "La seguridad jurídica.", "La publicidad de las leyes."],
      correctOption: "d",
      explanation: "Por qué: el artículo 9.3 garantiza la publicidad de las normas, no la publicidad de las leyes formulada de manera restrictiva. El principio de legalidad, la jerarquía normativa y la seguridad jurídica aparecen expresamente en el mismo precepto.",
    },
    4: {
      prompt: "Según la Constitución Española, los 4 miembros del Tribunal Constitucional propuestos por el Congreso son elegidos por mayoría de:",
      options: ["2/3 de los presentes.", "3/5 de los presentes.", "2/3 de sus miembros.", "3/5 de sus miembros."],
      correctOption: "d",
      explanation: "Por qué: el artículo 159.1 de la Constitución exige una mayoría de tres quintos de los miembros del Congreso para proponer cuatro magistrados del Tribunal Constitucional. No basta calcular la mayoría sobre los asistentes.",
    },
    5: {
      prompt: "Según el artículo 9 de la Constitución Española, están sujetos a la Constitución y al resto del ordenamiento jurídico:",
      options: ["Los ciudadanos y los poderes públicos.", "Los ciudadanos a excepción de los poderes públicos.", "Los ciudadanos y los poderes públicos, a excepción de las personas miembros del Congreso y Senado que gozan de inmunidad parlamentaria.", "Los ciudadanos y los poderes públicos, a excepción de la persona que ostente la presidencia del Gobierno del Estado y de las Comunidades Autónomas que no están sujetas a responsabilidad jurídica."],
      correctOption: "a",
      explanation: "Por qué: el artículo 9.1 establece literalmente que los ciudadanos y los poderes públicos están sujetos a la Constitución y al resto del ordenamiento jurídico. Las inmunidades parlamentarias no eliminan esa sujeción general ni existen las excepciones de las otras opciones.",
    },
  },
};

function repairSimulationQuestions(parsed, slug) {
  const questionsByNumber = new Map();

  for (const question of parsed.questions) {
    const number = Number.parseInt(question.id.match(/-(\d+)$/)?.[1] ?? "", 10);

    if (number >= 1 && number <= 100 && !questionsByNumber.has(number)) {
      questionsByNumber.set(number, question);
    }
  }

  for (const [number, repair] of Object.entries(simulationQuestionRepairs[slug] ?? {})) {
    const questionNumber = Number.parseInt(number, 10);
    questionsByNumber.set(questionNumber, {
      id: `${slug}-${questionNumber}`,
      section: "test-oficial",
      ...repair,
      options: repair.options.map((label, index) => ({ id: "abcd"[index], label })),
    });
  }

  return [...questionsByNumber.entries()]
    .sort(([left], [right]) => left - right)
    .map(([, question]) => question);
}

mkdirSync(publicDir, { recursive: true });
mkdirSync(podcastPublicDir, { recursive: true });
mkdirSync(dirname(manifestFile), { recursive: true });
mkdirSync(officialPublicDir, { recursive: true });
mkdirSync(dirname(officialManifestFile), { recursive: true });
mkdirSync(dirname(officialTestsFile), { recursive: true });
mkdirSync(simulationPublicDir, { recursive: true });
mkdirSync(dirname(simulationManifestFile), { recursive: true });
mkdirSync(dirname(interactiveSimulationsFile), { recursive: true });

if (!existsSync(sourceDir)) {
  writeJsonFile(manifestFile, []);
  console.warn("[sync-temario] No existe la carpeta Temario. Se genera un manifest vacío.");
} else {
  const temarioFiles = collectFilesRecursively(sourceDir)
    .filter((file) => !relative(sourceDir, file).startsWith("Simulacros/"))
    .filter((file) => isSupportedTemarioFile(file))
    .sort((left, right) => left.localeCompare(right, "es"));
  const temarioCatalog = buildTemarioCatalog(temarioFiles.map((file) => relative(sourceDir, file)));

  const manifest = temarioCatalog.map((entry) => {
    const pdfDestinationName = `${entry.slug}.pdf`;
    cpSync(join(sourceDir, entry.sourceFilename), join(publicDir, pdfDestinationName), { force: true });

    const podcasts = entry.podcasts.map((podcast) => {
      const code = entry.code || deriveCode(basename(entry.sourceFilename)) || "SIN-CODIGO";
      const destinationDir = join(podcastPublicDir, code);
      const destinationName = `${podcast.slug}${podcast.extension}`;

      mkdirSync(destinationDir, { recursive: true });
      cpSync(join(sourceDir, podcast.sourceFilename), join(destinationDir, destinationName), { force: true });

      return {
        sourceFilename: podcast.sourceFilename,
        title: podcast.title,
        assetPath: `/podcast/${code}/${destinationName}`,
      };
    });

    return {
      code: entry.code,
      slug: entry.slug,
      sourceFilename: entry.sourceFilename,
      title: entry.title,
      pdfPath: `/temario/${pdfDestinationName}`,
      podcasts,
    };
  });

  writeJsonFile(manifestFile, manifest);
  console.log(`[sync-temario] Sincronizados ${manifest.length} temas.`);
}

if (!existsSync(officialSourceDir)) {
  writeJsonFile(officialManifestFile, []);
  writeJsonFile(officialTestsFile, []);
  writeJsonFile(simulationManifestFile, []);
  console.warn("[sync-temario] No existe la carpeta Test. Se genera un manifest vacío de oficiales.");
  process.exit(0);
}

const officialFiles = collectFilesRecursively(officialSourceDir)
  .filter((file) => !relative(officialSourceDir, file).startsWith("Simulacros/"))
  .filter((file) => [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg", ".sql", ".xlsx"].includes(extname(file).toLowerCase()))
  .sort((a, b) => a.localeCompare(b, "es"));

function buildOfficialEntry(filePath, rootDirectory, { code, originalName } = {}) {
  const relativePath = originalName ?? relative(rootDirectory, filePath);
  const [topicFolder = "SIN-CODIGO"] = relativePath.split("/");
  const resolvedCode = code ?? topicFolder.toUpperCase();
  const extension = extname(filePath).toLowerCase();
  const kind = deriveOfficialKind(relativePath);
  const title = prettifyOfficialFilename(relativePath.split("/").at(-1) ?? relativePath, resolvedCode);
  const slug = slugify(`${resolvedCode}-${title}`);
  const destinationDir = join(officialPublicDir, resolvedCode);
  const destinationName = `${slug}${extension}`;

  mkdirSync(destinationDir, { recursive: true });
  cpSync(filePath, join(destinationDir, destinationName), { force: true });

  return {
    absolutePath: filePath,
    code: resolvedCode,
    slug,
    kind,
    extension,
    sourceFilename: relativePath,
    title,
    assetPath: `/test-oficial/${resolvedCode}/${destinationName}`,
  };
}

const officialEntries = officialFiles.map((filePath) => {
  const relativePath = relative(officialSourceDir, filePath);
  const [topicFolder = "SIN-CODIGO"] = relativePath.split("/");
  const code = topicFolder.toUpperCase();
  return buildOfficialEntry(filePath, officialSourceDir, { code, originalName: relativePath });
});

if (existsSync(sourceDir)) {
  const temarioFiles = collectFilesRecursively(sourceDir)
    .filter((file) => !relative(sourceDir, file).startsWith("Simulacros/"))
    .filter((file) => isSupportedTemarioFile(file))
    .sort((left, right) => left.localeCompare(right, "es"));
  const temarioCatalog = buildTemarioCatalog(temarioFiles.map((file) => relative(sourceDir, file)));

  for (const entry of temarioCatalog) {
    for (const relatedPdf of entry.relatedPdfFiles) {
      officialEntries.push(
        buildOfficialEntry(join(sourceDir, relatedPdf), sourceDir, {
          code: entry.code || deriveCode(basename(entry.sourceFilename)) || "SIN-CODIGO",
          originalName: relatedPdf,
        }),
      );
    }

    for (const relatedResource of entry.relatedResourceFiles ?? []) {
      officialEntries.push(
        buildOfficialEntry(join(sourceDir, relatedResource), sourceDir, {
          code: entry.code || deriveCode(basename(entry.sourceFilename)) || "SIN-CODIGO",
          originalName: relatedResource,
        }),
      );
    }
  }
}

const officialManifest = officialEntries.map(({ absolutePath, extension, ...entry }) => entry);

writeJsonFile(officialManifestFile, officialManifest);
console.log(`[sync-temario] Sincronizados ${officialManifest.length} materiales oficiales.`);

const simulationFiles = simulationSourceDirs.flatMap((directory) =>
  existsSync(directory)
    ? collectFilesRecursively(directory)
        .filter((file) => [".pdf", ".doc", ".docx"].includes(extname(file).toLowerCase()))
        .map((filePath) => ({ filePath, sourceDirectory: directory }))
    : [],
).sort((left, right) => left.filePath.localeCompare(right.filePath, "es"));

const simulationsManifest = simulationFiles.map(({ filePath, sourceDirectory }) => {
  const relativePath = relative(sourceDirectory, filePath);
  const extension = extname(filePath).toLowerCase();
  const title = prettifySimulationFilename(basename(relativePath));
  const slug = slugify(title);
  const destinationName = `${slug}${extension}`;

  cpSync(filePath, join(simulationPublicDir, destinationName), { force: true });

  return {
    slug,
    title,
    sourceFilename: relativePath,
    assetPath: `/simulacros/${destinationName}`,
  };
});

writeJsonFile(simulationManifestFile, simulationsManifest);
console.log(`[sync-temario] Sincronizados ${simulationsManifest.length} simulacros globales.`);

const interactiveSimulations = [];
let simulationParserUnavailable = false;

for (const simulation of simulationsManifest) {
  if (!simulation.assetPath.endsWith(".pdf")) {
    continue;
  }

  const source = simulationFiles.find(({ filePath, sourceDirectory }) =>
    relative(sourceDirectory, filePath) === simulation.sourceFilename,
  );

  if (!source) {
    continue;
  }

  // The academy simulations put answer options in side-by-side columns. Keeping
  // the PDF layout prevents pdftotext from merging those options into one line.
  const extraction = spawnSync("pdftotext", ["-layout", source.filePath, "-"], { encoding: "utf8" });

  if (extraction.status !== 0 || extraction.error) {
    if (extraction.error?.code === "ENOENT") {
      simulationParserUnavailable = true;
      break;
    }

    console.warn(`[sync-temario] No se pudo extraer el simulacro ${simulation.sourceFilename}.`);
    continue;
  }

  const parsed = parseOfficialTestText(extraction.stdout, {
    code: "SIMULACRO",
    slug: simulation.slug,
    title: simulation.title,
    description: "Simulacro global de la academia con correccion inmediata y plantilla integrada.",
  });

  const questions = repairSimulationQuestions(parsed, simulation.slug);

  if (questions.length === 100) {
    interactiveSimulations.push({ ...parsed, questions });
  } else {
    console.warn(`[sync-temario] El simulacro ${simulation.sourceFilename} no alcanza las 100 preguntas principales.`);
  }
}

if (simulationParserUnavailable && existsSync(interactiveSimulationsFile)) {
  console.warn("[sync-temario] pdftotext no disponible; se conserva el manifest de simulacros interactivos ya generado.");
} else {
  writeJsonFile(interactiveSimulationsFile, interactiveSimulations);
  console.log(`[sync-temario] Generados ${interactiveSimulations.length} simulacros interactivos.`);
}

const interactiveOfficialTests = [];
let parserUnavailable = false;

for (const entry of officialEntries) {
  if (entry.kind !== "official-test" || entry.extension !== ".pdf") {
    continue;
  }

  const extraction = spawnSync("pdftotext", [entry.absolutePath, "-"], {
    encoding: "utf8",
  });

  if (extraction.error) {
    if (extraction.error.code === "ENOENT") {
      parserUnavailable = true;
      break;
    }

    console.warn(`[sync-temario] No se pudo extraer texto de ${entry.sourceFilename}: ${extraction.error.message}`);
    continue;
  }

  if (extraction.status !== 0) {
    console.warn(`[sync-temario] pdftotext devolvió código ${extraction.status} para ${entry.sourceFilename}.`);
    continue;
  }

  const interactiveTest = parseOfficialTestText(extraction.stdout ?? "", {
    code: entry.code,
    slug: entry.slug,
    title: entry.title,
    description: "Versión interactiva del test oficial del profesor con soluciones incorporadas.",
    focusSections: ["test-oficial"],
    sourceFilename: entry.sourceFilename,
    assetPath: entry.assetPath,
  });

  if (interactiveTest.questions.length > 0) {
    interactiveOfficialTests.push(interactiveTest);
  }
}

if (parserUnavailable) {
  if (!existsSync(officialTestsFile)) {
    writeJsonFile(officialTestsFile, []);
  }

  console.warn(
    "[sync-temario] `pdftotext` no está disponible. Se conserva el JSON generado previamente para los tests oficiales interactivos.",
  );
} else {
  // Several source folders can expose the same official PDF. Keep one interactive test per slug.
  const uniqueInteractiveOfficialTests = [
    ...new Map(interactiveOfficialTests.map((test) => [test.slug, test])).values(),
  ];

  writeJsonFile(officialTestsFile, uniqueInteractiveOfficialTests);
  console.log(`[sync-temario] Generados ${uniqueInteractiveOfficialTests.length} tests oficiales interactivos.`);
}
