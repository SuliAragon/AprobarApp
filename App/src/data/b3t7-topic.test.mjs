import test from "node:test";
import assert from "node:assert/strict";
import { practiceQuestionExtensionsByCode } from "./practice-question-extensions.mjs";
import { withTemarioReference } from "./temario-explanation-references.mjs";

test("B3T7 ofrece 50 preguntas propias sobre arquitecturas, protocolos y seguridad", () => {
  const questions = (practiceQuestionExtensionsByCode.B3T7 ?? []).map((q) => withTemarioReference(q, "B3T7"));
  assert.equal(questions.length, 50);
  assert.equal(new Set(questions.map((q) => q.id)).size, 50);
  assert.equal(new Set(questions.map((q) => q.prompt)).size, 50);
  const sections = new Map();
  const answers = { a: 0, b: 0, c: 0, d: 0 };
  for (const question of questions) {
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((o) => o.label)).size, 4);
    assert.ok(question.options.some((o) => o.id === question.correctOption));
    assert.ok(question.explanation.length > 110);
    assert.match(question.explanation, /Referencia del temario: B3T7/);
    assert.match(question.id, /^b3t7-practice-\d{2}$/);
    sections.set(question.section, (sections.get(question.section) ?? 0) + 1);
    answers[question.correctOption] += 1;
  }
  assert.deepEqual([...sections.values()], [10, 10, 10, 10, 10]);
  assert.ok(Math.max(...Object.values(answers)) - Math.min(...Object.values(answers)) <= 1);
  const correctLabel = (number) => questions[number - 1].options.find((o) => o.id === questions[number - 1].correctOption).label;
  assert.match(correctLabel(2), /logica.*despliegue fisico/);
  assert.match(correctLabel(24), /binding/);
  assert.match(correctLabel(32), /opcional/);
  assert.match(correctLabel(39), /Autorizacion/);
  assert.match(correctLabel(40), /Base64url.*no cifra/);
  assert.match(correctLabel(44), /puertos y adaptadores/);
});
