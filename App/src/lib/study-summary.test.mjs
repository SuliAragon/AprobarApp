import test from "node:test";
import assert from "node:assert/strict";
import * as summary from "./study-summary.mjs";
import { emptyStudyState, startAttempt, saveAnswer, finishAttempt } from "./study-state.mjs";

test("el panel cuenta respuestas reales, intentos recuperables y aciertos sin atribuir dominio a temas no practicados", () => {
  assert.equal(typeof summary.summarizeStudy, "function");
  const now = new Date(2026, 9, 29, 12).getTime();
  const q = { id: "q", topicCode: "B1T7", section: "igualdad", prompt: "P", options: [{ id: "a", label: "A" }, { id: "b", label: "B" }], correctOption: "a", explanation: "E" };
  let state = startAttempt(emptyStudyState(), { id: "one", key: "test", title: "Test", href: "/test/", questions: [q] }, now);
  state = saveAnswer(state, "one", "q", "a", now + 1000);
  state = finishAttempt(state, "one", now + 2000);
  state = startAttempt(state, { id: "two", key: "test", title: "Test", href: "/test/", questions: [q] }, now + 3000);
  const result = summary.summarizeStudy(state, now + 4000);
  assert.equal(result.answeredToday, 1);
  assert.equal(result.active.length, 1);
  assert.equal(result.completed.length, 1);
  assert.equal(result.unique, 1);
  assert.equal(result.topics.B1T7.correct, 1);
  assert.equal(result.topics.B3T6, undefined);
});

test("el último resultado de la versión anterior se conserva una sola vez y no se inventan sus respuestas", () => {
  assert.equal(typeof summary.captureLegacyResults, "function");
  const values = { "aprobarapp:test:tema:uno": JSON.stringify({ mistakes: 3, totalQuestions: 50, completedAt: "2026-10-28T10:00:00.000Z" }) };
  const storage = { length: 1, key: () => Object.keys(values)[0], getItem: (key) => values[key] };
  let state = summary.captureLegacyResults(emptyStudyState(), storage);
  state = summary.captureLegacyResults(state, storage);
  assert.equal(Object.keys(state.legacyResults).length, 1);
  const record = Object.values(state.legacyResults)[0];
  assert.equal(record.mistakes, 3);
  assert.equal(record.questions, undefined);
  assert.deepEqual(state.records, {});
});

test("los blancos alimentan el repaso pero no se cuentan como preguntas únicas respondidas", () => {
  const now = new Date(2026, 9, 29, 12).getTime();
  const question = { id: "answered", topicCode: "B1T7", section: "igualdad", prompt: "P", options: [{ id: "a", label: "A" }, { id: "b", label: "B" }], correctOption: "a", explanation: "E" };
  let state = startAttempt(emptyStudyState(), { id: "one", key: "test", title: "Test", href: "/test/", questions: [question, { ...question, id: "blank" }] }, now);
  state = saveAnswer(state, "one", "answered", "a", now + 1000);
  state = finishAttempt(state, "one", now + 2000);
  const result = summary.summarizeStudy(state, now + 3000);
  assert.equal(result.unique, 1);
  assert.equal(result.topics.B1T7.unique, 1);
  assert.equal(result.topics.B1T7.blank, 1);
  assert.equal(result.pending.length, 1);
  assert.equal(result.answeredToday, 1);
});
