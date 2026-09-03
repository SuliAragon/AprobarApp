import test from "node:test";
import assert from "node:assert/strict";

import { b1t5EmpleoPublicoQuestionBank } from "./b1t5-empleo-publico.ts";

test("los tests de repaso B1T5 usan 50 preguntas originales y explicaciones concretas", () => {
  assert.equal(b1t5EmpleoPublicoQuestionBank.length, 50);
  assert.ok(b1t5EmpleoPublicoQuestionBank.every((question) => question.id.startsWith("b1t5-practice-")));
  assert.ok(b1t5EmpleoPublicoQuestionBank.every((question) => question.options.length === 4));
  assert.ok(b1t5EmpleoPublicoQuestionBank.every((question) => question.explanation.length >= 110));
  assert.ok(new Set(b1t5EmpleoPublicoQuestionBank.map((question) => question.explanation)).size >= 48);
  assert.ok(b1t5EmpleoPublicoQuestionBank.every((question) => !/aplica el concepto preciso|se ajusta al criterio preguntado|apartado correspondiente/i.test(question.explanation)));
});

test("B1T5 mantiene equilibrada la posicion de las respuestas correctas", () => {
  const correctCounts = Object.fromEntries(["a", "b", "c", "d"].map((option) => [option, 0]));
  b1t5EmpleoPublicoQuestionBank.forEach((question) => {
    correctCounts[question.correctOption] += 1;
  });

  const values = Object.values(correctCounts);
  assert.ok(Math.max(...values) - Math.min(...values) <= 1);
});
