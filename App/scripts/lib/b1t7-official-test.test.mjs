import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseOfficialTestText } from "./official-tests-parser.mjs";

test("B1T7 conserva las 96 letras oficiales, el orden de opciones y elimina solo cabeceras", () => {
  const file = fileURLToPath(new URL("../../../Temario/Bloque%201/Tema%207/B1T7Test_Politicas_de_igualdad_de_genero.pdf", import.meta.url));
  const source = spawnSync("pdftotext", ["-layout", file, "-"], { encoding: "utf8" });
  assert.equal(source.status, 0, source.stderr);
  const parsed = parseOfficialTestText(source.stdout, { code: "B1T7", slug: "b1t7-test-oficial-politicas-de-igualdad-de-genero" });
  const expected = [
    "d", "b", "a", "a", "a", "a", "d", "c", "c", "d", "c", "c", "b", "a", "b", "a",
    "b", "b", "b", "c", "a", "a", "d", "b", "c", "a", "b", "d", "d", "c", "c", "d",
    "a", "b", "a", "a", "b", "a", "d", "d", "b", "b", "a", "d", "d", "a", "c", "c",
    "d", "d", "b", "d", "b", "d", "c", "b", "d", "c", "a", "d", "b", "d", "b", "b",
    "a", "c", "d", "a", "b", "d", "d", "c", "a", "a", "c", "b", "d", "c", "c", "a",
    "b", "d", "c", "b", "d", "b", "c", "b", "c", "b", "d", "b", "a", "c", "a", "b",
  ];
  assert.equal(parsed.questions.length, 96);
  assert.deepEqual(parsed.questions.map((q) => q.correctOption), expected);
  for (const q of parsed.questions) {
    assert.deepEqual(q.options.map((o) => o.id), ["a", "b", "c", "d"]);
    assert.doesNotMatch(q.prompt + q.options.map((o) => o.label).join(" "), /POLÍTICAS DE IGUALDAD DE GÉNERO|PABLO ARELLANO|Página \d|\bTAI\b/);
  }
  assert.equal(parsed.questions[0].options[0].label, "Se elaborará anualmente.");
  assert.equal(parsed.questions[21].options[0].label.includes("no quiere el apoyo permanente"), true);
});

test("B1T7 explica sin sustituir la plantilla y trata neutralmente preguntas históricas o dudosas", () => {
  const file = fileURLToPath(new URL("../../../Temario/Bloque%201/Tema%207/B1T7Test_Politicas_de_igualdad_de_genero.pdf", import.meta.url));
  const source = spawnSync("pdftotext", ["-layout", file, "-"], { encoding: "utf8" });
  assert.equal(source.status, 0, source.stderr);
  const { questions } = parseOfficialTestText(source.stdout, { code: "B1T7", slug: "b1t7-test-oficial-politicas-de-igualdad-de-genero" });
  for (const q of questions) {
    assert.match(q.explanation, /Respuesta de la plantilla oficial:/);
    assert.match(q.explanation, /Referencia del temario: B1T7 · .+p\./);
    assert.doesNotMatch(q.explanation, /se corrige|debería ser|cambiamos la respuesta|plantilla incorrecta/i);
  }
  for (const number of [2, 8, 22, 29, 31, 35, 48, 59, 60, 62, 70]) {
    assert.match(questions[number - 1].explanation, /Se conserva la opción asignada/);
  }
  assert.match(questions[79].explanation, /transparencia|interpretabilidad/i);
  assert.match(questions[90].explanation, /persona acosada/i);
});
