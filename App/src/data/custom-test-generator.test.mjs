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

test("el generador prioriza preguntas no vistas y puede limitarse a ellas sin inventar ni repetir", () => {
  const sources = [{ code: "B1T3", questions: [0, 1, 2, 3, 4, 5].map((n) => question("B1T3", n)) }];
  const seen = { "B1T3-0": 8, "B1T3-1": 2, "B1T3-2": 1, "B1T3-3": 1 };
  const fresh = buildCustomTest(sources, { size: 6, seed: "variedad", seen, unseenOnly: true });
  assert.deepEqual(fresh.questions.map((q) => q.id).sort(), ["B1T3-4", "B1T3-5"]);
  const mixed = buildCustomTest(sources, { size: 3, seed: "variedad", seen });
  assert.ok(["B1T3-4", "B1T3-5"].every((id) => mixed.questions.some((q) => q.id === id)));
  assert.equal(sources[0].questions[0].options[0].label, "A");
});
