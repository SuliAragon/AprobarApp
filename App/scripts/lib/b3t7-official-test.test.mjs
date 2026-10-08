import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseOfficialTestText } from "./official-tests-parser.mjs";

test("B3T7 importa 63 preguntas limpias y advierte las erratas de la plantilla", () => {
  const pdf = new URL("../../../Temario/Bloque%203/Tema%207/B3T7Test_Arquitectura_logica_y_WS.pdf", import.meta.url);
  const result = spawnSync("pdftotext", ["-layout", fileURLToPath(pdf), "-"], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  const parsed = parseOfficialTestText(result.stdout, { code: "B3T7", slug: "b3t7-test-oficial-arquitectura-logica-y-ws" });
  const originalAnswers = [
    "c", "c", "c", "d", "b", "d", "a", "c", "a", "a",
    "c", "c", "b", "d", "a", "b", "d", "b", "b", "d",
    "b", "a", "d", "a", "d", "c", "d", "a", "d", "d",
    "c", "b", "b", "d", "a", "b", "b", "a", "c", "c",
    "d", "b", "d", "b", "d", "a", "d", "c", "c", "a",
    "b", "a", "c", "a", "b", "c", "b", "b", "d", "a",
    "b", "b", "a",
  ];
  const expectedAnswers = originalAnswers.map((answer, index) => index === 36 || index === 37 ? "c" : answer);
  assert.equal(parsed.questions.length, 63);
  assert.deepEqual(parsed.questions.map((q) => q.correctOption), expectedAnswers);
  for (const question of parsed.questions) {
    assert.equal(question.options.length, 4);
    assert.match(question.explanation, /Referencia del temario: B3T7/);
    assert.doesNotMatch(question.explanation, /definición o regla que plantea|La pista decisiva/);
    assert.doesNotMatch(question.prompt + question.options.map((o) => o.label).join(" "), /ARQUITECTURAS Y SERVICIOS WEB|PABLO ARELLANO|Página \d/);
  }
  assert.ok(new Set(parsed.questions.map((q) => q.explanation.split("La respuesta correcta es")[0])).size >= 60);
  assert.match(parsed.questions[6].explanation, /IETF/);
  assert.match(parsed.questions[22].explanation, /ambig/i);
  assert.match(parsed.questions[33].explanation, /W3C/);
  assert.match(parsed.questions[35].explanation, /ambig/i);
  assert.match(parsed.questions[36].explanation, /plantilla.*b.*corrige.*c/i);
  assert.match(parsed.questions[37].explanation, /opcional.*ambig|ambig.*opcional/i);
  assert.match(parsed.questions[39].explanation, /formato.*(token|claims)/i);
});
