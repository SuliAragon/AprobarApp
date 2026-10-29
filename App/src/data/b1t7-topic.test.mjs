import test from "node:test";
import assert from "node:assert/strict";
import { practiceQuestionExtensionsByCode } from "./practice-question-extensions.mjs";
import { buildTopicTests } from "./question-bank.ts";
import { buildExtendedPracticePresets } from "./practice-test-presets.mjs";

test("B1T7 ofrece 100 preguntas originales, cinco bloques y diez tests distintos de 50", () => {
  const bank = practiceQuestionExtensionsByCode.B1T7 ?? [];
  assert.equal(bank.length, 100);
  assert.equal(new Set(bank.map((q) => q.id)).size, 100);
  assert.equal(new Set(bank.map((q) => q.prompt)).size, 100);
  const sections = new Map();
  const answers = { a: 0, b: 0, c: 0, d: 0 };
  for (const q of bank) {
    assert.equal(q.options.length, 4, q.id);
    assert.equal(new Set(q.options.map((o) => o.label)).size, 4, q.id);
    assert.ok(q.options.some((o) => o.id === q.correctOption), q.id);
    assert.ok(q.explanation.length > 140, q.id);
    assert.match(q.explanation, /Referencia del temario: B1T7 · .+p\./);
    sections.set(q.section, (sections.get(q.section) ?? 0) + 1);
    answers[q.correctOption]++;
  }
  assert.deepEqual([...sections.values()], [20, 20, 20, 20, 20]);
  assert.deepEqual(Object.values(answers), [25, 25, 25, 25]);
  const presets = [...sections.keys()].map((section) => ({ slug: section, title: section, description: section, focusSections: [section] }));
  const tests = buildTopicTests("B1T7", bank, buildExtendedPracticePresets(presets));
  assert.equal(tests.length, 10);
  assert.equal(new Set(tests.map((t) => t.questions.map((q) => q.id).sort().join(","))).size, 10);
  for (const t of tests) {
    assert.equal(t.questions.length, 50);
    assert.equal(new Set(t.questions.map((q) => q.id)).size, 50);
  }
  for (const keyword of [/15\/2022/, /4\/2023/, /IV Plan/, /10\/2022/, /Estambul/]) {
    assert.ok(bank.some((q) => keyword.test(q.prompt + q.explanation)), String(keyword));
  }
});
