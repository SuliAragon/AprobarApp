import test from "node:test";
import assert from "node:assert/strict";

import { b3t5ProgramacionOrientadaObjetosQuestionBank } from "./b3t5-programacion-orientada-objetos.ts";

test("los tests de repaso B3T5 cubren POO con preguntas originales y explicaciones concretas", () => {
  assert.equal(b3t5ProgramacionOrientadaObjetosQuestionBank.length, 50);
  assert.ok(b3t5ProgramacionOrientadaObjetosQuestionBank.every((question) => question.id.startsWith("b3t5-practice-")));
  assert.ok(b3t5ProgramacionOrientadaObjetosQuestionBank.every((question) => question.options.length === 4));
  assert.ok(b3t5ProgramacionOrientadaObjetosQuestionBank.every((question) => question.explanation.length >= 110));
  assert.ok(new Set(b3t5ProgramacionOrientadaObjetosQuestionBank.map((question) => question.explanation)).size >= 48);
});

test("B3T5 mantiene equilibrada la posicion de las respuestas correctas", () => {
  const correctCounts = Object.fromEntries(["a", "b", "c", "d"].map((option) => [option, 0]));
  b3t5ProgramacionOrientadaObjetosQuestionBank.forEach((question) => {
    correctCounts[question.correctOption] += 1;
  });

  const values = Object.values(correctCounts);
  assert.ok(Math.max(...values) - Math.min(...values) <= 1);
});
