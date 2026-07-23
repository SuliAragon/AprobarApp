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
const simulationSourceDir = resolve(officialSourceDir, "Simulacros");
const simulationPublicDir = resolve(projectRoot, "public", "simulacros");
const simulationManifestFile = resolve(projectRoot, "src", "data", "generated", "simulacros.json");

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
    .replace(/\s+\d+$/g, "")
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
    .replace(/\s+\d+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function writeJsonFile(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

mkdirSync(publicDir, { recursive: true });
mkdirSync(podcastPublicDir, { recursive: true });
mkdirSync(dirname(manifestFile), { recursive: true });
mkdirSync(officialPublicDir, { recursive: true });
mkdirSync(dirname(officialManifestFile), { recursive: true });
mkdirSync(dirname(officialTestsFile), { recursive: true });
mkdirSync(simulationPublicDir, { recursive: true });
mkdirSync(dirname(simulationManifestFile), { recursive: true });

if (!existsSync(sourceDir)) {
  writeJsonFile(manifestFile, []);
  console.warn("[sync-temario] No existe la carpeta Temario. Se genera un manifest vacío.");
} else {
  const temarioFiles = collectFilesRecursively(sourceDir)
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
  .filter((file) => [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg", ".sql"].includes(extname(file).toLowerCase()))
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

const simulationFiles = existsSync(simulationSourceDir)
  ? collectFilesRecursively(simulationSourceDir)
      .filter((file) => [".pdf", ".doc", ".docx"].includes(extname(file).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, "es"))
  : [];

const simulationsManifest = simulationFiles.map((filePath) => {
  const relativePath = relative(simulationSourceDir, filePath);
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
