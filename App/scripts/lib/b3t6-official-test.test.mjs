import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseOfficialTestText } from "./official-tests-parser.mjs";

test("B3T6 importa las 70 respuestas exactas de la plantilla, sin alterar las preguntas", () => {
  const file = fileURLToPath(new URL("../../../Temario/Bloque%203/Tema%206/B3T6Test_Java_.NET.pdf", import.meta.url));
  const source = spawnSync("pdftotext", ["-layout", file, "-"], { encoding: "utf8" });
  assert.equal(source.status, 0, source.stderr);
  const parsed = parseOfficialTestText(source.stdout, { code: "B3T6", slug: "b3t6-test-oficial-java-net" });
  const expected = [
    "c", "a", "a", "d", "c", "b", "b", "a", "c", "a",
    "a", "c", "d", "d", "d", "b", "c", "d", "b", "a",
    "a", "c", "d", "c", "a", "c", "b", "b", "d", "b",
    "c", "c", "a", "d", "b", "d", "b", "c", "d", "b",
    "a", "a", "d", "d", "c", "b", "a", "c", "b", "b",
    "c", "d", "c", "c", "a", "d", "b", "c", "d", "c",
    "d", "b", "b", "c", "b", "c", "a", "b", "a", "d",
  ];
  assert.equal(parsed.questions.length, 70);
  assert.deepEqual(parsed.questions.map((q) => q.correctOption), expected);
  for (const question of parsed.questions) {
    assert.equal(question.options.length, 4);
    assert.match(question.explanation, /Referencia del temario: B3T6/);
    assert.doesNotMatch(question.prompt + question.options.map((o) => o.label).join(" "), /JAKARTA EE Y \.NET|PABLO ARELLANO|Página \d/);
    assert.doesNotMatch(question.explanation, /se corrige|plantilla.*incorrecta|La pista decisiva/);
  }
});
