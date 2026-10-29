import test from "node:test";
import assert from "node:assert/strict";
import * as study from "./study-state.mjs";

const question = { id: "oficial-37", topicCode: "B3T7", section: "test-oficial", prompt: "Pregunta", options: [{ id: "a", label: "A" }, { id: "b", label: "B" }, { id: "c", label: "C" }, { id: "d", label: "D" }], correctOption: "b", explanation: "Plantilla original" };
const config = { id: "attempt-1", key: "official:test", title: "Oficial", href: "/AprobarApp/temarios/oficial/", kind: "official", questions: [question], topicCodes: ["B3T7"], mode: "study" };

test("cada respuesta puede restaurarse sin modificar la plantilla ni el orden oficial", () => {
  assert.equal(typeof study.startAttempt, "function");
  let state = study.startAttempt(study.emptyStudyState(), config, 1000);
  state = study.saveAnswer(state, "attempt-1", question.id, "b", 2000);
  const restored = JSON.parse(JSON.stringify(state));
  assert.equal(restored.attempts[0].answers[question.id].option, "b");
  assert.deepEqual(restored.attempts[0].questions, [question]);
  assert.equal(restored.attempts[0].status, "active");
  assert.equal(restored.records[question.id].events["attempt-1"].correct, true);
  assert.equal(state.attempts[0].updatedAt, 2000);
});

test("compactar entregas conserva el historial y no descarta intentos abiertos", () => {
  let state = study.startAttempt(study.emptyStudyState(), { ...config, id: "open" }, 1000);
  for (let i = 0; i < 12; i++) {
    const id = `finished-${i}`;
    state = study.startAttempt(state, { ...config, id }, 2000 + i * 100);
    state = study.saveAnswer(state, id, question.id, "b", 2010 + i * 100);
    state = study.finishAttempt(state, id, 2020 + i * 100);
  }
  assert.equal(state.attempts.length, 13);
  assert.equal(state.attempts.filter((a) => a.status === "completed" && a.questions).length, 10);
  assert.ok(state.attempts.find((a) => a.id === "open").questions);
  assert.equal(state.attempts.find((a) => a.id === "finished-0").result.correct, 1);
  assert.equal(study.validateStudyState(state), state);
});

test("un examen caducado no admite respuestas tardías y su entrega es idempotente", () => {
  let state = study.startAttempt(study.emptyStudyState(), { ...config, mode: "exam", minutes: 1 }, 1000);
  assert.deepEqual(study.saveAnswer(state, "attempt-1", question.id, "b", 61000), state);
  state = study.finishAttempt(state, "attempt-1", 62000, "time");
  assert.equal(state.attempts[0].result.blank, 1);
  assert.equal(state.attempts[0].endReason, "time");
  assert.deepEqual(study.finishAttempt(state, "attempt-1", 63000, "time"), state);
});

test("una pregunta en blanco sigue disponible como no respondida", () => {
  let state = study.startAttempt(study.emptyStudyState(), config, 1000);
  state = study.finishAttempt(state, "attempt-1", 2000);
  assert.equal(study.recordStats(state.records[question.id]).answered, 0);
  state = study.startAttempt(state, { ...config, id: "second" }, 3000);
  state = study.saveAnswer(state, "second", question.id, "b", 4000);
  assert.equal(study.recordStats(state.records[question.id]).answered, 1);
});

test("el progreso compacto conserva métricas y recupera el enunciado cuando se marca una duda", () => {
  let state = study.startAttempt(study.emptyStudyState(), config, 1000);
  state = study.saveAnswer(state, "attempt-1", question.id, "b", 2000);
  assert.equal(state.records[question.id].question, null);
  assert.equal(state.records[question.id].topicCode, "B3T7");
  assert.equal(study.recordStats(state.records[question.id]).seen, 1);
  state = study.setDoubt(state, "attempt-1", question.id, true, 3000);
  assert.deepEqual(study.reviewRecords(state)[0].question, question);
  state = study.setDoubt(state, "attempt-1", question.id, false, 4000);
  assert.equal(state.records[question.id].question, null);
});

test("las dudas no duplican respuestas y el cuaderno programa repasos según los aciertos posteriores", () => {
  assert.equal(typeof study.setDoubt, "function");
  let state = study.startAttempt(study.emptyStudyState(), config, 1000);
  state = study.setDoubt(state, "attempt-1", question.id, true, 1500);
  assert.equal(study.reviewRecords(state, { filter: "doubt" }).length, 1);
  state = study.saveAnswer(state, "attempt-1", question.id, "a", 2000);
  state = study.setDoubt(state, "attempt-1", question.id, false, 3000);
  assert.equal(study.recordStats(state.records[question.id]).seen, 1);
  assert.equal(study.reviewRecords(state, { filter: "wrong" }).length, 1);
  for (let i = 2; i <= 4; i++) {
    state = study.startAttempt(state, { ...config, id: `attempt-${i}` }, i * 86400000);
    state = study.saveAnswer(state, `attempt-${i}`, question.id, "b", i * 86400000 + 1000);
  }
  assert.equal(study.recordStats(state.records[question.id]).streak, 3);
  assert.equal(study.reviewRecords(state).length, 0);
});

test("el modo examen conserva cambios, no incorpora fallos antes de entregar y calcula blancos y penalización", () => {
  const questions = [question, { ...question, id: "q2" }, { ...question, id: "q3" }];
  let state = study.startAttempt(study.emptyStudyState(), { ...config, questions, mode: "exam", minutes: 5, penalty: 1 / 3 }, 1000);
  state = study.saveAnswer(state, "attempt-1", question.id, "a", 2000);
  state = study.saveAnswer(state, "attempt-1", question.id, "b", 3000);
  state = study.saveAnswer(state, "attempt-1", "q2", "a", 4000);
  assert.deepEqual(state.records, {});
  assert.equal(state.attempts[0].deadline, 301000);
  assert.equal(typeof study.finishAttempt, "function");
  state = study.finishAttempt(state, "attempt-1", 5000);
  const result = state.attempts[0].result;
  assert.equal(result.correct, 1);
  assert.equal(result.wrong, 1);
  assert.equal(result.blank, 1);
  assert.ok(Math.abs(result.net - 2 / 3) < 0.00001);
  assert.equal(state.records.q3.events["attempt-1"].blank, true);
  assert.deepEqual(study.finishAttempt(state, "attempt-1", 6000), state);
});
