import test from "node:test";
import assert from "node:assert/strict";
import { practiceQuestionExtensionsByCode } from "./practice-question-extensions.mjs";
import { withTemarioReference } from "./temario-explanation-references.mjs";

test("B1T6 ofrece 50 preguntas propias, equilibradas y repartidas por todo el tema", () => {
  const questions = (practiceQuestionExtensionsByCode.B1T6 ?? []).map((q) => withTemarioReference(q, "B1T6"));
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
    assert.match(question.explanation, /Referencia del temario: B1T6/);
    assert.match(question.id, /^b1t6-practice-\d{2}$/);
    sections.set(question.section, (sections.get(question.section) ?? 0) + 1);
    answers[question.correctOption] += 1;
  }
  assert.deepEqual([...sections.values()], [10, 10, 10, 10, 10]);
  assert.ok(Math.max(...Object.values(answers)) - Math.min(...Object.values(answers)) <= 1);
  const correctLabel = (number) => questions[number - 1].options.find((o) => o.id === questions[number - 1].correctOption).label;
  assert.match(correctLabel(7), /149\.3/);
  assert.match(correctLabel(12), /Congreso.*conjunto/);
  assert.match(correctLabel(22), /Ley de bases/);
  assert.match(correctLabel(42), /reiterada.*Tribunal Supremo/);
});
