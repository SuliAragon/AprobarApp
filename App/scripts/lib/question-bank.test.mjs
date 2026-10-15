import test from "node:test";
import assert from "node:assert/strict";

import { buildTopicTests } from "../../src/data/question-bank.ts";

test("un test con banco acotado nunca se rellena con preguntas de otro documento", () => {
  const bank = ["c-tipos", "java-tipos", "c-punteros", "java-clases"].map((section, i) => ({
    id: `isolated-${i}`, section, prompt: section,
    options: "abcd".split("").map((id) => ({ id, label: id })),
    correctOption: "a", explanation: "Prueba de aislamiento",
  }));
  const [result] = buildTopicTests("B3T6", bank, [{
    slug: "solo-c", title: "C", description: "Solo C", focusSections: ["c-tipos"],
    poolSections: ["c-tipos", "c-punteros"], size: 50,
  }]);
  assert.equal(result.questions.length, 2);
  assert.ok(result.questions.every((q) => q.section.startsWith("c-")));
});

test("buildTopicTests respeta el tamaño configurado en cada preset", () => {
  const bank = Array.from({ length: 8 }, (_, index) => ({
    id: `q-${index + 1}`,
    section: index < 4 ? "focus" : "other",
    prompt: `Pregunta ${index + 1}`,
    options: [
      { id: "a", label: "A" },
      { id: "b", label: "B" },
      { id: "c", label: "C" },
      { id: "d", label: "D" },
    ],
    correctOption: "a",
    explanation: "Demo",
  }));

  const [testPreset] = buildTopicTests(
    "B3T1",
    bank,
    [
      {
        slug: "demo",
        title: "Demo",
        description: "Demo",
        focusSections: ["focus"],
        size: 5,
      },
    ],
  );

  assert.equal(testPreset.questions.length, 5);
});
