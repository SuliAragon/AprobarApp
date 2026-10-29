import { recordStats, reviewRecords } from "./study-state.mjs";

export function localDayKey(timestamp = Date.now()) {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function captureLegacyResults(state, storage) {
  const next = structuredClone(state);
  next.legacyResults ??= {};
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (!/^aprobarapp:(test:|official:|simulacro:|custom-test:)/.test(key)) continue;
    try {
      const result = JSON.parse(storage.getItem(key));
      const finishedAt = Date.parse(result.completedAt);
      if (!Number.isFinite(finishedAt) || !Number.isFinite(result.mistakes) || !Number.isFinite(result.totalQuestions)) continue;
      if (next.attempts.some((a) => a.legacyKey === key && a.finishedAt === finishedAt)) continue;
      const id = `${key}@${result.completedAt}`;
      next.legacyResults[id] ??= { id, key, finishedAt, mistakes: result.mistakes, total: result.totalQuestions };
    } catch { /* Invalid legacy badges are ignored without deleting their source. */ }
  }
  return next;
}

export function summarizeStudy(state, now = Date.now()) {
  const topics = {};
  const sections = {};
  let answeredToday = 0;
  let unique = 0;
  for (const record of Object.values(state.records)) {
    const stats = recordStats(record);
    const hasAnswer = stats.answered > 0;
    if (hasAnswer) unique++;
    const code = record.question?.topicCode ?? record.topicCode ?? "Sin tema";
    const section = record.question?.section ?? record.section ?? "General";
    topics[code] ??= { correct: 0, wrong: 0, blank: 0, unique: 0, lastSeen: 0 };
    sections[`${code}:${section}`] ??= { code, section, correct: 0, wrong: 0, blank: 0 };
    if (hasAnswer) topics[code].unique++;
    topics[code].lastSeen = Math.max(topics[code].lastSeen, stats.lastSeen);
    for (const event of Object.values(record.events)) {
      const outcome = event.blank ? "blank" : event.correct ? "correct" : "wrong";
      topics[code][outcome]++;
      sections[`${code}:${section}`][outcome]++;
      if (!event.blank && localDayKey(event.at) === localDayKey(now)) answeredToday++;
    }
  }
  return {
    topics, sections, answeredToday, unique,
    active: state.attempts.filter((a) => a.status === "active").sort((a, b) => b.updatedAt - a.updatedAt),
    completed: state.attempts.filter((a) => a.status === "completed").sort((a, b) => b.finishedAt - a.finishedAt),
    pending: reviewRecords(state, { now }), due: reviewRecords(state, { filter: "due", now }),
  };
}
