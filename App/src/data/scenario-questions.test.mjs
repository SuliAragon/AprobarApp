import test from "node:test";
import assert from "node:assert/strict";
import { scenarioQuestions } from "./scenario-questions.mjs";
import { practiceQuestionExtensionsByCode } from "./practice-question-extensions.mjs";

test("los 54 supuestos nuevos son originales, tienen cuatro alternativas y no alteran bancos oficiales", () => {
  assert.equal(scenarioQuestions.length, 54);
  assert.equal(new Set(scenarioQuestions.map((q) => q.id)).size, 54);
  assert.equal(new Set(scenarioQuestions.map((q) => q.prompt)).size, 54);
  for (const q of scenarioQuestions) {
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map((o) => o.label)).size, 4);
    assert.ok(q.options.some((o) => o.id === q.correctOption));
    assert.ok(q.explanation.length > 100);
    assert.match(q.explanation, new RegExp(`Referencia del temario: ${q.topicCode}`));
    assert.ok(!(practiceQuestionExtensionsByCode[q.topicCode] ?? []).some((old) => old.id === q.id || old.prompt === q.prompt));
  }
  assert.equal(scenarioQuestions.filter((q) => q.topicCode === "B3T6").length, 10);
});
