import { STUDY_KEY, validateStudyState, recordStats } from "./study-state.mjs";

function storedEntries(storage) {
  return Object.fromEntries(Array.from({ length: storage.length }, (_, i) => storage.key(i)).filter((key) => key?.startsWith("aprobarapp:")).map((key) => [key, storage.getItem(key)]));
}

export function mergeStudyStates(local, incoming) {
  const attempts = new Map(local.attempts.map((attempt) => [attempt.id, attempt]));
  for (const attempt of incoming.attempts) {
    const previous = attempts.get(attempt.id);
    if (previous?.status === "active" && attempt.status === "active" && JSON.stringify(previous.questions) === JSON.stringify(attempt.questions)) {
      const newest = attempt.updatedAt > previous.updatedAt ? attempt : previous;
      const answers = { ...previous.answers };
      for (const [id, answer] of Object.entries(attempt.answers)) {
        const old = answers[id];
        if (!old || (answer.changedAt ?? answer.at ?? attempt.updatedAt) > (old.changedAt ?? old.at ?? previous.updatedAt)) answers[id] = answer;
      }
      attempts.set(attempt.id, { ...structuredClone(newest), answers });
    } else if (!previous || (previous.status !== "completed" && attempt.status === "completed") || (previous.status === attempt.status && attempt.updatedAt > previous.updatedAt)) attempts.set(attempt.id, attempt);
  }
  const records = structuredClone(local.records);
  for (const [id, record] of Object.entries(incoming.records)) {
    const previous = records[id];
    if (!previous) records[id] = structuredClone(record);
    else {
      const newest = record.updatedAt > previous.updatedAt ? record : previous;
      const events = { ...previous.events };
      for (const [attemptId, event] of Object.entries(record.events)) {
        if (!events[attemptId] || (event.updatedAt ?? event.at) > (events[attemptId].updatedAt ?? events[attemptId].at)) events[attemptId] = event;
      }
      records[id] = { ...structuredClone(newest), events };
      const stats = recordStats(records[id]);
      if ((stats.wrong + stats.blank > 0 && stats.streak < 3) || records[id].doubtful) records[id].question ??= structuredClone(record.question ?? previous.question);
    }
  }
  return { version: 1, attempts: [...attempts.values()], records, legacyResults: { ...incoming.legacyResults, ...local.legacyResults } };
}

function mergeValue(key, current, incoming) {
  if (!current || key === "aprobarapp:theme") return incoming;
  const local = JSON.parse(current);
  const remote = JSON.parse(incoming);
  if (key === STUDY_KEY) return JSON.stringify(mergeStudyStates(local, remote));
  if (key === "aprobarapp:calendar:v2") {
    const entries = new Map(remote.entries.map((entry) => [entry.id, entry]));
    for (const entry of local.entries) entries.set(entry.id, { ...entry, completed: Boolean(entry.completed || entries.get(entry.id)?.completed) });
    return JSON.stringify({ entries: [...entries.values()] });
  }
  if (local?.completedAt && remote?.completedAt && new Date(local.completedAt) > new Date(remote.completedAt)) return current;
  return incoming;
}

export function exportProgress(storage, now = Date.now()) {
  return { app: "AprobarApp", version: 1, exportedAt: new Date(now).toISOString(), entries: storedEntries(storage) };
}

export function parseProgressBackup(text) {
  if (typeof text !== "string" || text.length > 20 * 1024 * 1024) throw new Error("La copia supera el tamaño admitido (20 MB).");
  const data = JSON.parse(text);
  if (data?.app !== "AprobarApp" || data.version !== 1 || !data.entries || Array.isArray(data.entries)) throw new Error("El archivo no es una copia global de AprobarApp.");
  if (Object.keys(data.entries).length > 3000) throw new Error("Demasiadas entradas en la copia.");
  for (const [key, value] of Object.entries(data.entries)) {
    if (!/^aprobarapp:[\w:./-]{1,400}$/.test(key) || typeof value !== "string") throw new Error("La copia contiene entradas no permitidas.");
    if (key === "aprobarapp:theme") {
      if (!["dark", "light"].includes(value)) throw new Error("Tema visual no válido.");
    } else {
      const parsed = JSON.parse(value);
      if (key === STUDY_KEY) validateStudyState(parsed);
      if (key === "aprobarapp:calendar:v2") {
        const validDay = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T12:00:00Z`)) && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
        if (!Array.isArray(parsed?.entries) || !parsed.entries.every((entry) => entry && typeof entry.id === "string" && typeof entry.title === "string" && validDay(entry.dayKey) && ["topic", "notes", "createdAt"].every((field) => entry[field] == null || typeof entry[field] === "string") && (entry.completed == null || typeof entry.completed === "boolean"))) throw new Error("El calendario de la copia no es válido.");
        if (new Set(parsed.entries.map((entry) => entry.id)).size !== parsed.entries.length) throw new Error("La copia contiene tareas duplicadas.");
      }
    }
  }
  return data;
}

export function restoreProgress(storage, text) {
  const data = parseProgressBackup(text);
  const before = new Map(Object.keys(data.entries).map((key) => [key, storage.getItem(key)]));
  const merged = Object.entries(data.entries).map(([key, value]) => [key, mergeValue(key, before.get(key), value)]);
  const written = [];
  try {
    for (const [key, value] of merged) {
      storage.setItem(key, value);
      written.push(key);
    }
  } catch (error) {
    for (const key of written.reverse()) {
      const previous = before.get(key);
      if (previous === null) storage.removeItem(key);
      else storage.setItem(key, previous);
    }
    throw error;
  }
  return Object.keys(data.entries).length;
}
