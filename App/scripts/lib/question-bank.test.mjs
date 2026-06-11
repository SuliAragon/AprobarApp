import test from "node:test";
import assert from "node:assert/strict";

import { buildTopicTests } from "../../src/data/question-bank.ts";

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
