import assert from "node:assert/strict";
import test from "node:test";

import { buildCustomTest } from "./custom-test-generator.mjs";

function question(topicCode, number, correctOption = "a") {
  return {
    id: `${topicCode}-${number}`,
    section: "repaso",
    prompt: `Pregunta ${number} de ${topicCode}`,
    options: ["A", "B", "C", "D"].map((label, index) => ({
      id: ["a", "b", "c", "d"][index],
      label,
    })),
    correctOption,
    explanation: "Explicación disponible.",
  };
}

test("buildCustomTest mezcla temas sin repetir preguntas y equilibra las respuestas", () => {
  const test = buildCustomTest(
    [
      { code: "B1T3", questions: Array.from({ length: 8 }, (_, index) => question("B1T3", index, "a")) },
      { code: "B3T1", questions: Array.from({ length: 8 }, (_, index) => question("B3T1", index, "b")) },
      { code: "B3T2", questions: Array.from({ length: 8 }, (_, index) => question("B3T2", index, "c")) },
    ],
    { size: 20, seed: "repaso-b1t3-b3t1-b3t2" },
  );

  assert.equal(test.questions.length, 20);
  assert.equal(new Set(test.questions.map((item) => item.id)).size, 20);

  const perTopic = Object.values(
    test.questions.reduce((counts, item) => {
      counts[item.topicCode] = (counts[item.topicCode] ?? 0) + 1;
      return counts;
    }, {}),
  );
  assert.ok(Math.max(...perTopic) - Math.min(...perTopic) <= 1);

  const answerCounts = test.questions.reduce(
    (counts, item) => {
      counts[item.correctOption] += 1;
      return counts;
    },
    { a: 0, b: 0, c: 0, d: 0 },
  );
  const counts = Object.values(answerCounts);
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 1);
});
