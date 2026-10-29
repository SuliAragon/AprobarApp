import test from "node:test";
import assert from "node:assert/strict";
import * as backup from "./progress-backup.mjs";
import { emptyStudyState, startAttempt, saveAnswer, STUDY_KEY } from "./study-state.mjs";

function memory(entries = {}) {
  const map = new Map(Object.entries(entries));
  return { get length() { return map.size; }, key: (i) => [...map.keys()][i], getItem: (k) => map.get(k) ?? null, setItem: (k, v) => map.set(k, v), removeItem: (k) => map.delete(k) };
}

test("la copia global transporta calendario, intentos y ajustes sin incluir datos de otras aplicaciones", () => {
  assert.equal(typeof backup.exportProgress, "function");
  const source = memory({ "aprobarapp:calendar:v2": '{"entries":[]}', [STUDY_KEY]: JSON.stringify(emptyStudyState()), "aprobarapp:theme": "dark", unrelated: "privado" });
  const exported = backup.exportProgress(source, 1000);
  assert.equal(Object.keys(exported.entries).length, 3);
  const target = memory({ unrelated: "conservar" });
  backup.restoreProgress(target, JSON.stringify(exported));
  assert.equal(target.getItem("aprobarapp:calendar:v2"), '{"entries":[]}');
  assert.equal(target.getItem("aprobarapp:theme"), "dark");
  assert.equal(target.getItem("unrelated"), "conservar");
});

test("al combinar métricas compactas con un fallo de otro dispositivo se conserva el enunciado del cuaderno", () => {
  const q = { id: "q1", prompt: "P", section: "s", options: [{ id: "a", label: "A" }, { id: "b", label: "B" }], correctOption: "a", explanation: "E" };
  const cfg = { key: "test", title: "Test", href: "/test/", questions: [q] };
  let old = startAttempt(emptyStudyState(), { ...cfg, id: "old" }, 1000);
  old = saveAnswer(old, "old", "q1", "b", 2000);
  let recent = startAttempt(emptyStudyState(), { ...cfg, id: "new" }, 3000);
  recent = saveAnswer(recent, "new", "q1", "a", 4000);
  const merged = backup.mergeStudyStates(recent, old);
  assert.equal(merged.records.q1.question.prompt, "P");
});

test("dos dispositivos pueden responder preguntas diferentes del mismo intento sin perder ninguna al combinar", () => {
  const q = { id: "q1", prompt: "P", section: "s", options: [{ id: "a", label: "A" }, { id: "b", label: "B" }], correctOption: "a", explanation: "E" };
  const initial = startAttempt(emptyStudyState(), { id: "same", key: "test", title: "Test", href: "/test/", questions: [q, { ...q, id: "q2" }], mode: "exam" }, 1000);
  const local = saveAnswer(initial, "same", "q1", "a", 2000);
  const remote = saveAnswer(initial, "same", "q2", "b", 3000);
  const merged = backup.mergeStudyStates(local, remote);
  assert.equal(merged.attempts[0].answers.q1.option, "a");
  assert.equal(merged.attempts[0].answers.q2.option, "b");
});

test("se rechazan intentos con enlaces externos o respuestas ajenas antes de tocar el almacenamiento", () => {
  const local = memory({ "aprobarapp:theme": "light" });
  const q = { id: "q1", prompt: "P", section: "s", options: [{ id: "a", label: "A" }, { id: "b", label: "B" }], correctOption: "a", explanation: "E" };
  const state = startAttempt(emptyStudyState(), { id: "one", key: "test", title: "Test", href: "/test/", questions: [q] }, 1000);
  state.attempts[0].href = "javascript:alert(1)";
  const data = { app: "AprobarApp", version: 1, entries: { [STUDY_KEY]: JSON.stringify(state) } };
  assert.throws(() => backup.restoreProgress(local, JSON.stringify(data)));
  assert.equal(local.getItem(STUDY_KEY), null);
  state.attempts[0].href = "/test/";
  state.attempts[0].questions[0].correctOption = "z";
  data.entries[STUDY_KEY] = JSON.stringify(state);
  assert.throws(() => backup.restoreProgress(local, JSON.stringify(data)));
});

test("importar combina dispositivos sin duplicar intentos ni olvidar respuestas o tareas actuales", () => {
  const q = { id: "q1", prompt: "P", section: "s", options: [{ id: "a", label: "A" }, { id: "b", label: "B" }], correctOption: "a", explanation: "E" };
  const config = { id: "shared", key: "test", title: "Test", href: "/test/", kind: "practice", questions: [q] };
  const initial = startAttempt(emptyStudyState(), config, 1000);
  const current = saveAnswer(initial, "shared", "q1", "a", 3000);
  const remote = startAttempt(initial, { ...config, id: "remote" }, 4000);
  const localStorage = memory({ [STUDY_KEY]: JSON.stringify(current), "aprobarapp:calendar:v2": '{"entries":[{"id":"local","title":"Local","dayKey":"2026-10-29"}]}' });
  const remoteStorage = memory({ [STUDY_KEY]: JSON.stringify(remote), "aprobarapp:calendar:v2": '{"entries":[{"id":"remote","title":"Remoto","dayKey":"2026-10-30"}]}' });
  const json = JSON.stringify(backup.exportProgress(remoteStorage));
  backup.restoreProgress(localStorage, json);
  backup.restoreProgress(localStorage, json);
  const merged = JSON.parse(localStorage.getItem(STUDY_KEY));
  assert.equal(merged.attempts.length, 2);
  assert.equal(merged.attempts.find((a) => a.id === "shared").answers.q1.option, "a");
  assert.equal(Object.keys(merged.records.q1.events).length, 1);
  assert.equal(JSON.parse(localStorage.getItem("aprobarapp:calendar:v2")).entries.length, 2);
});

test("una importación inválida o sin espacio no cambia ningún dato previo", () => {
  const storage = memory({ "aprobarapp:theme": "light", unrelated: "conservar" });
  const bad = { app: "AprobarApp", version: 1, entries: { "aprobarapp:theme": "dark", unrelated: "sobrescribir" } };
  assert.throws(() => backup.restoreProgress(storage, JSON.stringify(bad)));
  assert.equal(storage.getItem("aprobarapp:theme"), "light");
  const valid = { ...bad, entries: { "aprobarapp:theme": "dark", "aprobarapp:calendar:v2": '{"entries":[]}' } };
  const set = storage.setItem;
  storage.setItem = (key, value) => { if (key.includes("calendar")) throw new Error("QuotaExceededError"); set(key, value); };
  assert.throws(() => backup.restoreProgress(storage, JSON.stringify(valid)));
  assert.equal(storage.getItem("aprobarapp:theme"), "light");
  assert.equal(storage.getItem("unrelated"), "conservar");
});

test("una copia con tareas de calendario malformadas se rechaza sin sobrescribir datos", () => {
  const storage = memory({ "aprobarapp:theme": "light" });
  for (const task of [null, { id: "one", title: "Tarea", dayKey: "fecha" }, { id: "one", title: 4, dayKey: "2026-10-29" }]) {
    const data = { app: "AprobarApp", version: 1, entries: { "aprobarapp:theme": "dark", "aprobarapp:calendar:v2": JSON.stringify({ entries: [task] }) } };
    assert.throws(() => backup.restoreProgress(storage, JSON.stringify(data)));
    assert.equal(storage.getItem("aprobarapp:theme"), "light");
  }
});
