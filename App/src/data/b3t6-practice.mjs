import { b3t6Documents } from "./b3t6-config.mjs";
import { platformRows } from "./b3t6-platforms.mjs";
import { cRows } from "./b3t6-c.mjs";
import { csharpRows } from "./b3t6-csharp.mjs";
import { cppRows } from "./b3t6-cpp.mjs";
import { javaRows } from "./b3t6-java.mjs";
import { buildLanguageTraces } from "./b3t6-code-questions.mjs";

const rowsByDocument = { plataformas: platformRows, c: cRows, csharp: csharpRows, cpp: cppRows, java: javaRows };

export const b3t6QuestionBank = b3t6Documents.flatMap((doc) => {
  const rows = [...rowsByDocument[doc.slug], ...buildLanguageTraces(doc.slug)];
  return rows.map(([section, prompt, labels, reason, code], index) => {
    const offset = index % 4;
    const rotated = [...labels.slice(offset), ...labels.slice(0, offset)];
    const sectionTitle = doc.sections.find(([slug]) => slug === section)?.[1];
    if (!sectionTitle) throw new Error(`Seccion no definida: ${doc.slug}/${section}`);
    return {
      id: `b3t6-${doc.slug}-${String(index + 1).padStart(2, "0")}`,
      section: `${doc.slug}-${section}`,
      prompt,
      options: rotated.map((label, i) => ({ id: "abcd"[i], label })),
      correctOption: "abcd"[(4 - offset) % 4],
      explanation: `${reason} Referencia del temario: B3T6 · ${doc.title} · ${sectionTitle}.`,
      ...(code ? { code, codeLanguage: doc.title } : {}),
    };
  });
});
