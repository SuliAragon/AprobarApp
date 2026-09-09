import test from "node:test";
import assert from "node:assert/strict";

import { b3t3LenguajesProgramacionQuestionBank } from "./b3t3-lenguajes-programacion.ts";

test("los tests de repaso B3T3 cubren el tema con preguntas originales y explicaciones concretas", () => {
  assert.equal(b3t3LenguajesProgramacionQuestionBank.length, 50);
  assert.ok(b3t3LenguajesProgramacionQuestionBank.every((question) => question.id.startsWith("b3t3-practice-")));
  assert.ok(b3t3LenguajesProgramacionQuestionBank.every((question) => question.options.length === 4));
  assert.ok(b3t3LenguajesProgramacionQuestionBank.every((question) => question.explanation.length >= 110));
  assert.ok(new Set(b3t3LenguajesProgramacionQuestionBank.map((question) => question.explanation)).size >= 48);
  assert.ok(b3t3LenguajesProgramacionQuestionBank.every((question) => !/aplica el concepto preciso|se ajusta al criterio preguntado|apartado correspondiente/i.test(question.explanation)));
});

test("B3T3 mantiene equilibrada la posicion de las respuestas correctas", () => {
  const correctCounts = Object.fromEntries(["a", "b", "c", "d"].map((option) => [option, 0]));
  b3t3LenguajesProgramacionQuestionBank.forEach((question) => {
    correctCounts[question.correctOption] += 1;
  });

  const values = Object.values(correctCounts);
  assert.ok(Math.max(...values) - Math.min(...values) <= 1);
});
