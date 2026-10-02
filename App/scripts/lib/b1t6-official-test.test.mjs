import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseOfficialTestText } from "./official-tests-parser.mjs";

const pdf = new URL("../../../Temario/Bloque%201/Tema%206/B1T6Test_Fuentes_del_derecho.pdf", import.meta.url);

test("B1T6 importa las 40 soluciones originales y explica sus matices constitucionales", () => {
  const extraction = spawnSync("pdftotext", ["-layout", fileURLToPath(pdf), "-"], { encoding: "utf8" });
  assert.equal(extraction.status, 0, extraction.stderr);
  const parsed = parseOfficialTestText(extraction.stdout, { code: "B1T6", slug: "b1t6-test-oficial-fuentes-del-derecho" });
  assert.equal(parsed.questions.length, 40);
  assert.deepEqual(parsed.questions.map((q) => q.correctOption), [
    "a", "c", "b", "c", "b", "d", "b", "d", "a", "d",
    "a", "c", "c", "d", "b", "d", "a", "c", "a", "b",
    "a", "b", "b", "a", "b", "b", "b", "c", "a", "b",
    "d", "d", "b", "c", "d", "a", "b", "b", "c", "a",
  ]);
  assert.equal(new Set(parsed.questions.map((q) => q.explanation.split("La respuesta correcta es")[0])).size, 40);
  for (const question of parsed.questions) {
    assert.match(question.explanation, /Referencia del temario: B1T6/);
    assert.doesNotMatch(question.options.map((option) => option.label).join(" "), /FUENTES DEL DERECHO|PABLO ARELLANO|Página \d/);
    assert.doesNotMatch(question.explanation, /La pista decisiva|SQL|definición o regla que plantea/);
  }
  assert.match(parsed.questions[0].explanation, /150\.2/);
  assert.match(parsed.questions[26].explanation, /82\.2/);
  assert.match(parsed.questions[30].explanation, /origen.*(imprecis|ampli|general)|imprecis.*origen/i);
  assert.match(parsed.questions[38].explanation, /m[áa]ximo de tres/);
});
