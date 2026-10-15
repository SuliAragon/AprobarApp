import test from "node:test";
import assert from "node:assert/strict";
import { practiceQuestionExtensionsByCode } from "./practice-question-extensions.mjs";
import { b3t6PracticeGroups } from "./b3t6-config.mjs";
import { buildGroupedPracticePresets } from "./practice-test-presets.mjs";
import { buildTopicTests } from "./question-bank.ts";

test("B3T6 tiene 300 preguntas y 50 tests completos aislados por documento", () => {
  const bank = practiceQuestionExtensionsByCode.B3T6 ?? [];
  assert.equal(bank.length, 300);
  assert.equal(new Set(bank.map((q) => q.id)).size, 300);
  assert.equal(new Set(bank.map((q) => `${q.prompt}\n${q.code ?? ""}`)).size, 300);
  for (const question of bank) {
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((o) => o.label)).size, 4, question.id);
    assert.ok(question.options.some((o) => o.id === question.correctOption), question.id);
    assert.match(question.explanation, /Referencia del temario: B3T6/);
    assert.ok(question.explanation.length > 120, question.id);
  }
  const tests = buildTopicTests("B3T6", bank, buildGroupedPracticePresets(b3t6PracticeGroups));
  assert.equal(tests.length, 50);
  for (const group of b3t6PracticeGroups) {
    const groupBank = bank.filter((q) => q.section.startsWith(`${group.slug}-`));
    assert.equal(groupBank.length, 60, group.slug);
    const groupTests = tests.filter((t) => t.slug.startsWith(`${group.slug}-`));
    assert.equal(groupTests.length, 10);
    assert.ok(new Set(groupTests.map((t) => t.questions.map((q) => q.id).sort().join(","))).size >= 5);
    for (const section of group.testPresets.flatMap((p) => p.focusSections)) {
      assert.equal(groupBank.filter((q) => q.section === section).length, 12, section);
    }
    for (const groupTest of groupTests) {
      assert.equal(groupTest.questions.length, 50);
      assert.equal(new Set(groupTest.questions.map((q) => q.id)).size, 50);
      assert.ok(groupTest.questions.every((q) => q.section.startsWith(`${group.slug}-`)));
    }
  }
  assert.ok(bank.filter((q) => q.code).length >= 80);
});
