export const STUDY_KEY = "aprobarapp:study:v1";
export const emptyStudyState = () => ({ version: 1, attempts: [], records: {} });

const safeId = (value) => typeof value === "string" && /^[\w:.-]{1,250}$/.test(value) && !["__proto__", "constructor", "prototype"].includes(value);
const object = (value) => value && typeof value === "object" && !Array.isArray(value);
const localPath = (value) => typeof value === "string" && /^\/(?!\/)/.test(value) && !/[\\\u0000-\u0020]/.test(value);
const finite = (value) => typeof value === "number" && Number.isFinite(value) && value >= 0;

export function validateStudyState(state) {
  const fail = () => { throw new Error("El progreso contiene datos o enlaces no válidos. No se ha cambiado el almacenamiento."); };
  if (state?.version !== 1 || !Array.isArray(state.attempts) || !object(state.records) || state.attempts.length > 2000) fail();
  const checkQuestion = (q) => {
    if (!safeId(q?.id) || typeof q.prompt !== "string" || typeof q.section !== "string" || typeof q.explanation !== "string" || !Array.isArray(q.options) || q.options.length < 2 || q.options.length > 6) fail();
    if (q.code != null && typeof q.code !== "string") fail();
    if (!q.options.every((o) => /^[a-f]$/.test(o.id) && typeof o.label === "string") || new Set(q.options.map((o) => o.id)).size !== q.options.length || !q.options.some((o) => o.id === q.correctOption)) fail();
    if (q.originHref && !localPath(q.originHref)) fail();
  };
  if (new Set(state.attempts.map((a) => a.id)).size !== state.attempts.length) fail();
  for (const attempt of state.attempts) {
    if (!safeId(attempt.id) || typeof attempt.key !== "string" || typeof attempt.title !== "string" || !localPath(attempt.href) || !["active", "completed"].includes(attempt.status) || !["study", "exam"].includes(attempt.mode) || !finite(attempt.startedAt) || !finite(attempt.updatedAt)) fail();
    if (attempt.deadline !== null && !finite(attempt.deadline)) fail();
    if (!finite(attempt.penalty) || attempt.penalty > 1) fail();
    if (attempt.questions) {
      if (!Array.isArray(attempt.questions) || !attempt.questions.length || attempt.questions.length > 1000 || !object(attempt.answers)) fail();
      attempt.questions.forEach(checkQuestion);
      const byId = new Map(attempt.questions.map((q) => [q.id, q]));
      if (byId.size !== attempt.questions.length) fail();
      for (const [id, answer] of Object.entries(attempt.answers)) {
        const q = byId.get(id);
        if (!q || !object(answer) || (answer.option != null && !q.options.some((o) => o.id === answer.option)) || (answer.at != null && !finite(answer.at)) || (answer.doubt != null && typeof answer.doubt !== "boolean")) fail();
      }
    } else if (attempt.status === "active") fail();
    if (attempt.status === "completed" && (!finite(attempt.finishedAt) || !object(attempt.result) || !["total", "correct", "wrong", "blank", "answered", "percent"].every((key) => finite(attempt.result[key])) || !Number.isFinite(attempt.result.net))) fail();
  }
  for (const [id, record] of Object.entries(state.records)) {
    if (!safeId(id) || record.id !== id || !object(record.events) || !finite(record.updatedAt) || !localPath(record.href)) fail();
    if (record.question) checkQuestion(record.question);
    else if (typeof record.section !== "string" || record.doubtful || ((recordStats(record).wrong + recordStats(record).blank > 0) && recordStats(record).streak < 3)) fail();
    for (const [attemptId, event] of Object.entries(record.events)) {
      if (!safeId(attemptId) || !finite(event.at) || !["correct", "blank", "doubt"].every((key) => typeof event[key] === "boolean")) fail();
    }
  }
  if (state.legacyResults != null) {
    if (!object(state.legacyResults)) fail();
    for (const result of Object.values(state.legacyResults)) {
      if (!object(result) || typeof result.key !== "string" || !["finishedAt", "mistakes", "total"].every((key) => finite(result[key]))) fail();
    }
  }
  return state;
}

export function startAttempt(state, config, now = Date.now()) {
  const next = structuredClone(state);
  const id = config.id ?? `${now}-${crypto.randomUUID()}`;
  if (next.attempts.some((a) => a.id === id)) throw new Error("El intento ya existe.");
  if (!config.questions?.length || new Set(config.questions.map((q) => q.id)).size !== config.questions.length) throw new Error("El test debe contener preguntas únicas.");
  next.attempts.push({ ...structuredClone(config), id, status: "active", answers: {}, startedAt: now, updatedAt: now, mode: config.mode === "exam" ? "exam" : "study", penalty: Math.max(0, Number(config.penalty) || 0), deadline: config.mode === "exam" ? now + Math.max(1, Number(config.minutes) || 60) * 60000 : null });
  return next;
}

export function recordStats(record) {
  const events = Object.values(record.events ?? {}).sort((a, b) => a.at - b.at);
  let streak = 0;
  for (const event of events) streak = event.correct && !event.doubt ? streak + 1 : 0;
  const last = events.at(-1);
  const days = last?.correct && !last.doubt ? [1, 3, 7, 14, 30][Math.min(streak, 4)] : 1;
  return { seen: events.length, answered: events.filter((e) => !e.blank).length, wrong: events.filter((e) => !e.correct && !e.blank).length, blank: events.filter((e) => e.blank).length, streak, lastSeen: last?.at ?? 0, dueAt: record.doubtful ? 0 : (last?.at ?? 0) + days * 86400000 };
}

function recordAnswer(state, attempt, question, now) {
  const answer = attempt.answers[question.id];
  const record = state.records[question.id] ?? { id: question.id, events: {}, doubtful: false };
  record.question = structuredClone(question);
  record.kind = question.originKind ?? attempt.kind;
  record.href = question.originHref ?? attempt.href;
  record.title = question.originTitle ?? attempt.title;
  record.updatedAt = now;
  record.events[attempt.id] = { at: answer?.at ?? now, updatedAt: now, correct: answer?.option === question.correctOption, blank: !answer?.option, doubt: Boolean(answer?.doubt) };
  record.doubtful = Boolean(answer?.doubt);
  compactRecord(record);
  state.records[question.id] = record;
}

function compactRecord(record) {
  if (record.question) {
    record.topicCode = record.question.topicCode;
    record.section = record.question.section;
  }
  const stats = recordStats(record);
  if (!record.doubtful && (stats.wrong + stats.blank === 0 || stats.streak >= 3)) record.question = null;
}

export function saveAnswer(state, attemptId, questionId, option, now = Date.now()) {
  const next = structuredClone(state);
  const attempt = next.attempts.find((a) => a.id === attemptId);
  if (!attempt || attempt.status !== "active" || (attempt.deadline && now >= attempt.deadline)) return state;
  const question = attempt.questions.find((q) => q.id === questionId);
  if (!question || (option !== null && !question.options.some((o) => o.id === option))) throw new Error("Respuesta no válida.");
  if (attempt.mode === "study" && attempt.answers[questionId]?.option) return state;
  attempt.answers[questionId] = { ...attempt.answers[questionId], option, at: now, changedAt: now };
  attempt.updatedAt = now;
  if (attempt.mode === "study" && option) recordAnswer(next, attempt, question, now);
  return next;
}

export function attemptResult(attempt) {
  let correct = 0;
  let wrong = 0;
  for (const question of attempt.questions ?? []) {
    const option = attempt.answers[question.id]?.option;
    if (option) option === question.correctOption ? correct++ : wrong++;
  }
  const total = attempt.questions?.length ?? attempt.result?.total ?? 0;
  const net = correct - wrong * (attempt.penalty ?? 0);
  return { total, correct, wrong, blank: total - correct - wrong, answered: correct + wrong, net, percent: total ? Math.max(0, net / total * 100) : 0 };
}

export function finishAttempt(state, id, now = Date.now(), reason = "manual") {
  const next = structuredClone(state);
  const attempt = next.attempts.find((a) => a.id === id);
  if (!attempt || attempt.status !== "active") return state;
  attempt.result = attemptResult(attempt);
  attempt.status = "completed";
  attempt.finishedAt = now;
  attempt.updatedAt = now;
  attempt.endReason = reason;
  for (const question of attempt.questions) recordAnswer(next, attempt, question, now);
  // Keep long-term results, but only ten complete answer sheets to bound storage.
  const completed = next.attempts.filter((a) => a.status === "completed").sort((a, b) => b.finishedAt - a.finishedAt);
  for (const old of completed.slice(10)) {
    delete old.questions;
    delete old.answers;
  }
  if (completed.length > 500) {
    const retained = new Set(completed.slice(0, 500).map((a) => a.id));
    next.attempts = next.attempts.filter((a) => a.status === "active" || retained.has(a.id));
  }
  return next;
}

export function setDoubt(state, attemptId, questionId, doubtful, now = Date.now()) {
  const next = structuredClone(state);
  const attempt = next.attempts.find((a) => a.id === attemptId);
  const question = attempt?.questions?.find((q) => q.id === questionId);
  if (!question || !attempt.answers) return state;
  attempt.answers[questionId] = { ...attempt.answers[questionId], doubt: Boolean(doubtful), changedAt: now };
  attempt.updatedAt = now;
  if (attempt.mode === "exam" && attempt.status === "active") return next;
  if (attempt.answers[questionId].option) recordAnswer(next, attempt, question, now);
  else {
    const record = next.records[questionId] ?? { id: questionId, events: {} };
    Object.assign(record, { doubtful: Boolean(doubtful), question: structuredClone(question), kind: question.originKind ?? attempt.kind, href: question.originHref ?? attempt.href, title: question.originTitle ?? attempt.title, updatedAt: now });
    compactRecord(record);
    next.records[questionId] = record;
  }
  return next;
}

export function reviewRecords(state, { filter = "all", topicCode = "", now = Date.now() } = {}) {
  return Object.values(state.records).map((record) => ({ ...record, ...recordStats(record) })).filter((record) => {
    if (!record.question || (topicCode && record.question.topicCode !== topicCode)) return false;
    const needsWork = (record.wrong + record.blank > 0 && record.streak < 3) || record.doubtful;
    if (!needsWork) return false;
    if (filter === "doubt") return record.doubtful;
    if (filter === "wrong") return record.wrong + record.blank > 0 && record.streak < 3;
    if (filter === "due") return record.dueAt <= now;
    return true;
  }).sort((a, b) => a.dueAt - b.dueAt || b.wrong - a.wrong);
}

export function readStudyState(storage) {
  const raw = storage.getItem(STUDY_KEY);
  if (!raw) return emptyStudyState();
  return validateStudyState(JSON.parse(raw));
}

export function writeStudyState(storage, state) {
  validateStudyState(state);
  storage.setItem(STUDY_KEY, JSON.stringify(state));
}
