import { basename, dirname, extname } from "node:path";

const audioExtensions = new Set([".m4a", ".mp3", ".aac", ".wav", ".ogg", ".oga", ".m4b"]);

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

function prettifyPdfFilename(filename) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/_/g, " ")
    .replace(/\bsubrayado\b/gi, "")
    .replace(/\s+\d+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function prettifyPodcastFilename(filename) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/_/g, " ")
    .replace(/\s+\d+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildTemarioCatalog(relativeFiles) {
  const filesByDirectory = new Map();

  for (const relativeFile of relativeFiles) {
    const extension = extname(relativeFile).toLowerCase();
    const rawDirectoryKey = dirname(relativeFile);
    const directoryKey =
      (rawDirectoryKey === "." || rawDirectoryKey === "") && extension === ".pdf"
        ? `__root__/${basename(relativeFile)}`
        : rawDirectoryKey;
    const entry = filesByDirectory.get(directoryKey) ?? [];
    entry.push(relativeFile);
    filesByDirectory.set(directoryKey, entry);
  }

  return [...filesByDirectory.entries()]
    .sort(([left], [right]) => left.localeCompare(right, "es"))
    .flatMap(([, files]) => {
      const sortedFiles = [...files].sort((left, right) => left.localeCompare(right, "es"));
      const pdfFile = sortedFiles.find((file) => extname(file).toLowerCase() === ".pdf");

      if (!pdfFile) {
        return [];
      }

      const sourceFilename = pdfFile;
      const code = deriveCode(basename(pdfFile));
      const title = prettifyPdfFilename(basename(pdfFile));
      const slug = slugify(title);
      const podcasts = sortedFiles
        .filter((file) => audioExtensions.has(extname(file).toLowerCase()))
        .map((file) => ({
          sourceFilename: file,
          title: prettifyPodcastFilename(basename(file)),
          slug: slugify(prettifyPodcastFilename(basename(file))),
          extension: extname(file).toLowerCase(),
        }));

      return [
        {
          code,
          slug,
          title,
          sourceFilename,
          podcasts,
        },
      ];
    });
}

export function isSupportedTemarioFile(filePath) {
  const extension = extname(filePath).toLowerCase();
  return extension === ".pdf" || audioExtensions.has(extension);
}
