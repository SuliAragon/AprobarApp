import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseOfficialTestText } from "./lib/official-tests-parser.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = resolve(projectRoot, "..", "Temario");
const publicDir = resolve(projectRoot, "public", "temario");
const manifestFile = resolve(projectRoot, "src", "data", "generated", "temarios.json");
const officialSourceDir = resolve(projectRoot, "..", "Test");
const officialPublicDir = resolve(projectRoot, "public", "test-oficial");
const officialManifestFile = resolve(projectRoot, "src", "data", "generated", "official-materials.json");
const officialTestsFile = resolve(projectRoot, "src", "data", "generated", "official-tests.json");

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

function prettifyFilename(filename) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/_/g, " ")
    .replace(/\bsubrayado\b/gi, "")
    .replace(/\s+\d+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
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

function writeJsonFile(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

mkdirSync(publicDir, { recursive: true });
mkdirSync(dirname(manifestFile), { recursive: true });
mkdirSync(officialPublicDir, { recursive: true });
mkdirSync(dirname(officialManifestFile), { recursive: true });
mkdirSync(dirname(officialTestsFile), { recursive: true });

if (!existsSync(sourceDir)) {
  writeJsonFile(manifestFile, []);
  console.warn("[sync-temario] No existe la carpeta Temario. Se genera un manifest vacío.");
} else {
  const pdfFiles = readdirSync(sourceDir)
    .filter((file) => extname(file).toLowerCase() === ".pdf")
    .sort((a, b) => a.localeCompare(b, "es"));

  const manifest = pdfFiles.map((file) => {
    const originalName = file;
    const code = deriveCode(file);
    const title = prettifyFilename(file);
    const slug = slugify(title);
    const destinationName = `${slug}.pdf`;

    cpSync(join(sourceDir, file), join(publicDir, destinationName), { force: true });

    return {
      code,
      slug,
      sourceFilename: originalName,
      title,
      pdfPath: `/temario/${destinationName}`,
    };
  });

  writeJsonFile(manifestFile, manifest);
  console.log(`[sync-temario] Sincronizados ${manifest.length} temas.`);
}

if (!existsSync(officialSourceDir)) {
  writeJsonFile(officialManifestFile, []);
  writeJsonFile(officialTestsFile, []);
  console.warn("[sync-temario] No existe la carpeta Test. Se genera un manifest vacío de oficiales.");
  process.exit(0);
}

const officialFiles = collectFilesRecursively(officialSourceDir)
  .filter((file) => [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"].includes(extname(file).toLowerCase()))
  .sort((a, b) => a.localeCompare(b, "es"));

const officialEntries = officialFiles.map((filePath) => {
  const relativePath = relative(officialSourceDir, filePath);
  const [topicFolder = "SIN-CODIGO"] = relativePath.split("/");
  const code = topicFolder.toUpperCase();
  const originalName = relativePath;
  const extension = extname(filePath).toLowerCase();
  const kind = deriveOfficialKind(relativePath);
  const title = prettifyOfficialFilename(relativePath.split("/").at(-1) ?? relativePath, code);
  const slug = slugify(`${code}-${title}`);
  const destinationDir = join(officialPublicDir, code);
  const destinationName = `${slug}${extension}`;

  mkdirSync(destinationDir, { recursive: true });
  cpSync(filePath, join(destinationDir, destinationName), { force: true });

  return {
    absolutePath: filePath,
    code,
    slug,
    kind,
    extension,
    sourceFilename: originalName,
    title,
    assetPath: `/test-oficial/${code}/${destinationName}`,
  };
});

const officialManifest = officialEntries.map(({ absolutePath, extension, ...entry }) => entry);

writeJsonFile(officialManifestFile, officialManifest);
console.log(`[sync-temario] Sincronizados ${officialManifest.length} materiales oficiales.`);

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
  writeJsonFile(officialTestsFile, interactiveOfficialTests);
  console.log(`[sync-temario] Generados ${interactiveOfficialTests.length} tests oficiales interactivos.`);
}
