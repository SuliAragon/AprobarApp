import test from "node:test";
import assert from "node:assert/strict";

import { rebalanceQuestionsForTest } from "../../src/data/test-option-balancer.ts";

test("rebalanceQuestionsForTest reparte las respuestas correctas y conserva la opción buena", () => {
  const questions = Array.from({ length: 50 }, (_, index) => ({
    id: `q-${index + 1}`,
    prompt: `Pregunta ${index + 1}`,
    section: "demo",
    options: [
      { id: "a", label: `Correcta ${index + 1}` },
      { id: "b", label: `Distractor B ${index + 1}` },
      { id: "c", label: `Distractor C ${index + 1}` },
      { id: "d", label: `Distractor D ${index + 1}` },
    ],
    correctOption: "a",
    explanation: "Demo",
  }));

  const balanced = rebalanceQuestionsForTest(questions, "B1T1-fundamentos-y-estructura");
  const counts = balanced.reduce(
    (accumulator, question) => {
      accumulator[question.correctOption] += 1;
      return accumulator;
    },
    { a: 0, b: 0, c: 0, d: 0 },
  );

  assert.deepEqual(Object.values(counts).sort((left, right) => left - right), [12, 12, 13, 13]);

  for (const [index, question] of balanced.entries()) {
    const correctLabel = question.options.find((option) => option.id === question.correctOption)?.label;
    assert.equal(correctLabel, `Correcta ${index + 1}`);
  }
});

test("rebalanceQuestionsForTest elimina las letras antiguas de las explicaciones", () => {
  const [question] = rebalanceQuestionsForTest(
    [
      {
        id: "q-1",
        options: [
          { id: "a", label: "Respuesta valida" },
          { id: "b", label: "Distractor B" },
          { id: "c", label: "Distractor C" },
          { id: "d", label: "Distractor D" },
        ],
        correctOption: "a",
        explanation:
          "Por qué: Explicacion concreta. En este caso, la opción A (Respuesta valida.) es la que se ajusta al criterio preguntado. Referencia del temario: B2T4 · Demo.",
      },
    ],
    "test-con-respuesta-reubicada",
  );

  assert.match(question.explanation, /La respuesta correcta es «Respuesta valida»/);
  assert.doesNotMatch(question.explanation, /opción A/i);
  assert.match(question.explanation, /Referencia del temario: B2T4/i);
});
