import { renderQuestion } from "./question-view.mjs";
import { startAttempt, saveAnswer, setDoubt, finishAttempt, attemptResult, recordStats, STUDY_KEY } from "./study-state.mjs";
import { studyRepository } from "./study-repository.mjs";
import { exportProgress } from "./progress-backup.mjs";
import { buildCustomTest } from "../data/custom-test-generator.mjs";

const controllers = new WeakMap();

export function downloadJson(value, name) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function attemptLink(attempt) {
  const url = new URL(attempt.href, location.origin);
  if (url.origin !== location.origin) return "#";
  url.searchParams.set("intento", attempt.id);
  return `${url.pathname}${url.search}${url.hash}`;
}

const countText = (number, singular, plural) => `${number} ${number === 1 ? singular : plural}`;

function practiceQuestions(config, state) {
  if (config.kind !== "practice" || !config.pool?.length) return config.questions;
  const seen = Object.fromEntries(Object.entries(state.records).map(([id, record]) => [id, recordStats(record).answered]));
  const seed = crypto.randomUUID();
  const focus = config.pool.filter((q) => config.focusSections?.includes(q.section));
  const primary = focus.length ? buildCustomTest([{ code: config.topicCodes[0], questions: focus }], { size: Math.min(Math.ceil(config.questions.length * 0.6), focus.length), seed, seen }).questions : [];
  const selected = new Set(primary.map((q) => q.id));
  const rest = config.pool.filter((q) => !selected.has(q.id));
  const remaining = Math.max(0, config.questions.length - primary.length);
  const secondary = remaining && rest.length ? buildCustomTest([{ code: config.topicCodes[0], questions: rest }], { size: remaining, seed: `${seed}-rest`, seen }).questions : [];
  return buildCustomTest([{ code: config.topicCodes[0], questions: [...primary, ...secondary] }], { size: config.questions.length, seed: `${seed}-mix`, preferUnseen: false }).questions;
}

export function mountQuiz(root) {
  if (controllers.has(root)) return controllers.get(root);
  let config = JSON.parse(root.querySelector("[data-study-config]").textContent);
  const find = (selector) => root.querySelector(selector);
  const settings = find("[data-study-settings]");
  const session = find("[data-study-session]");
  const paper = find("[data-study-questions]");
  const status = find("[data-save-status]");
  let saveFailed = false;
  const repository = studyRepository((message, error = false) => {
    saveFailed = error;
    status.textContent = message;
    status.classList.toggle("is-danger", error);
  });
  let currentId = null;
  let interval;
  const current = () => repository.get().attempts.find((a) => a.id === currentId);

  const updateSettings = () => {
    for (const control of settings.querySelectorAll("[data-exam-setting]")) {
      control.hidden = find("[data-mode]").value !== "exam";
      control.querySelector("input, select").disabled = control.hidden;
    }
    find("[data-start]").disabled = !config.questions?.length;
    find("[data-bank-note]").textContent = config.pool?.length ? `${config.pool.length} preguntas únicas en este banco. Cada intento prioriza las menos practicadas; si ya las has visto todas se reutilizan, sin inventar preguntas.` : "";
  };

  const paint = () => {
    const attempt = current();
    if (!attempt?.questions) return;
    const complete = attempt.status === "completed";
    const reveal = complete || attempt.mode === "study";
    const result = complete ? attempt.result : attemptResult(attempt);
    find("[data-answered-count]").textContent = result.answered;
    find("[data-total-count]").textContent = result.total;
    find("[data-mistakes-count]").textContent = reveal ? result.wrong : "Al entregar";
    const score = find("[data-score-label]");
    score.textContent = complete ? "Finalizado" : attempt.mode === "exam" ? "Examen en curso" : "En curso";
    score.className = complete ? result.wrong + result.blank === 0 ? "is-perfect" : result.wrong + result.blank <= 3 ? "is-warning" : "is-danger" : "";
    find("[data-session-label]").textContent = `${attempt.title} · ${attempt.mode === "exam" ? "Modo examen" : "Modo estudio"}`;
    find("[data-finish]").hidden = complete;
    find("[data-result-summary]").textContent = complete ? `${countText(result.correct, "acierto", "aciertos")} · ${countText(result.wrong, "fallo", "fallos")} · ${result.blank} en blanco. Puntuación de práctica: ${result.net.toLocaleString("es-ES", { maximumFractionDigits: 2 })} / ${result.total} (${result.percent.toLocaleString("es-ES", { maximumFractionDigits: 1 })} %).${attempt.endReason === "time" ? " Entregado al agotarse el tiempo." : ""}` : "Cada respuesta y cada duda se guardan al momento. Puedes cerrar y continuar después.";
    find("[data-next-pending]").hidden = complete || result.blank === 0;
    const filter = find("[data-question-filter]").value;
    let visible = 0;
    const navButtons = find("[data-question-nav]").querySelectorAll("button");
    for (const [index, question] of attempt.questions.entries()) {
      const card = paper.children[index];
      const answer = attempt.answers[question.id] ?? {};
      const answered = Boolean(answer.option);
      const wrong = answer.option !== question.correctOption;
      const show = filter === "all" || (filter === "pending" && !answered) || (filter === "doubt" && answer.doubt) || (filter === "wrong" && complete && wrong);
      card.hidden = !show;
      if (show) visible++;
      card.classList.toggle("is-answered", answered);
      card.classList.toggle("has-doubt", Boolean(answer.doubt));
      const doubt = card.querySelector("[data-doubt]");
      doubt.textContent = answer.doubt ? "Quitar duda" : "Marcar duda";
      doubt.setAttribute("aria-pressed", String(Boolean(answer.doubt)));
      card.querySelector("[data-question-state]").textContent = answer.doubt ? "En tu cuaderno de dudas" : "";
      for (const button of card.querySelectorAll("[data-option]")) {
        const id = button.dataset.option;
        button.disabled = complete || (attempt.mode === "study" && answered);
        button.setAttribute("aria-pressed", String(id === answer.option));
        button.classList.toggle("is-selected", id === answer.option);
        button.classList.toggle("is-correct", reveal && (answered || complete) && id === question.correctOption);
        button.classList.toggle("is-incorrect", reveal && answered && wrong && id === answer.option);
      }
      const feedback = card.querySelector("[data-feedback]");
      feedback.hidden = !reveal || (!answered && !complete);
      feedback.classList.toggle("is-incorrect", wrong);
      feedback.classList.toggle("is-correct", !wrong);
      card.querySelector("[data-feedback-title]").textContent = !answered ? "En blanco. Revisa la respuesta y la explicación." : wrong ? "Respuesta incorrecta. La opción válida queda marcada en verde." : "Respuesta correcta. Sigue así.";
      navButtons[index].className = `question-number ${answered ? "is-filled" : ""} ${answer.doubt ? "has-doubt" : ""}`;
      navButtons[index].setAttribute("aria-label", `Pregunta ${question.displayNumber ?? index + 1}${answer.doubt ? ", con duda" : answered ? ", respondida" : ", sin responder"}`);
    }
    find("[data-filter-empty]").hidden = visible > 0;
    find("[data-clock-box]").hidden = !attempt.deadline || complete;
  };

  const finish = (reason = "manual") => {
    const attempt = current();
    if (!attempt || attempt.status !== "active") { paint(); return; }
    repository.update((state) => finishAttempt(state, currentId, Date.now(), reason));
    const completed = current();
    try {
      if (completed.legacyKey) localStorage.setItem(completed.legacyKey, JSON.stringify({ answered: completed.result.answered, mistakes: completed.result.wrong + completed.result.blank, totalQuestions: completed.result.total, completedAt: new Date(completed.finishedAt).toISOString() }));
    } catch { /* The central result is already saved; the legacy badge is optional. */ }
    clearInterval(interval);
    paint();
    find("[data-result-summary]").scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const tick = () => {
    const attempt = current();
    if (!attempt?.deadline || attempt.status !== "active") return;
    const remaining = Math.max(0, Math.ceil((attempt.deadline - Date.now()) / 1000));
    find("[data-clock]").textContent = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
    if (!remaining) finish("time");
  };

  const showAttempt = (attempt) => {
    if (!attempt.questions) {
      status.textContent = "Este intento conserva su resultado en el historial. Su hoja de respuestas ya se ha compactado; puedes comenzar otro.";
      return;
    }
    if (["official", "simulation"].includes(config.kind)) {
      const canonical = new Map(config.questions.map((q) => [q.id, q]));
      const signature = (q) => JSON.stringify([q?.prompt, q?.options, q?.correctOption, q?.code]);
      if (attempt.questions.length !== config.questions.length || attempt.questions.some((q, index) => q.id !== config.questions[index].id || signature(q) !== signature(canonical.get(q.id)))) {
        status.textContent = "La versión del test oficial ha cambiado respecto al intento guardado. Se conserva su historial; comienza otro para usar la plantilla actual.";
        return;
      }
    }
    currentId = attempt.id;
    if (!config.questions?.length && ["custom", "review"].includes(config.kind)) config = { ...config, questions: attempt.questions, title: attempt.title, topicCodes: attempt.topicCodes };
    find("[data-mode]").value = attempt.mode;
    find("[data-minutes]").value = attempt.minutes ?? 60;
    find("[data-penalty]").value = String(attempt.penalty ?? 0);
    settings.hidden = true;
    session.hidden = false;
    paper.innerHTML = attempt.questions.map(renderQuestion).join("");
    const nav = find("[data-question-nav]");
    nav.replaceChildren(...attempt.questions.map((q, i) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = q.displayNumber ?? i + 1;
      button.addEventListener("click", () => {
        if (paper.children[i].hidden) { find("[data-question-filter]").value = "all"; paint(); }
        paper.children[i].scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return button;
    }));
    paint();
    clearInterval(interval);
    tick();
    if (current().status === "active") interval = setInterval(tick, 1000);
    if (attempt.status === "active" && !saveFailed) status.textContent = "Intento recuperado. Tus respuestas y dudas están guardadas.";
  };

  const controller = {
    getState: () => repository.get(),
    prepare(nextConfig) {
      config = nextConfig;
      settings.hidden = false;
      updateSettings();
      find("[data-start]").textContent = `Comenzar ${countText(config.questions.length, "pregunta", "preguntas")}`;
      settings.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    start(nextConfig) {
      if (nextConfig) config = { ...nextConfig };
      if (!config.questions?.length) { status.textContent = "Selecciona preguntas antes de comenzar."; return; }
      if (current()?.status === "active" && !window.confirm("El intento actual seguirá guardado en Progreso. ¿Quieres comenzar otro?")) return;
      const now = Date.now();
      const options = { ...config, questions: practiceQuestions(config, repository.get()), mode: find("[data-mode]").value, minutes: Math.min(360, Math.max(1, Number(find("[data-minutes]").value) || 60)), penalty: Number(find("[data-penalty]").value) };
      delete options.pool;
      delete options.focusSections;
      const state = repository.update((state) => startAttempt(state, options, now));
      const attempt = state.attempts.at(-1);
      showAttempt(attempt);
      if (!saveFailed) status.textContent = "Intento iniciado. Se guardará cada respuesta en este navegador.";
      const url = new URL(location.href);
      url.searchParams.set("intento", attempt.id);
      history.replaceState(null, "", url);
      tick();
    },
  };
  controllers.set(root, controller);
  settings.addEventListener("submit", (event) => { event.preventDefault(); controller.start(); });
  find("[data-mode]").addEventListener("change", updateSettings);
  find("[data-new-attempt]").addEventListener("click", () => {
    settings.hidden = false;
    updateSettings();
    settings.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  find("[data-next-pending]").addEventListener("click", () => {
    const index = current().questions.findIndex((q) => !current().answers[q.id]?.option);
    if (index < 0) return;
    find("[data-question-filter]").value = "all";
    paint();
    paper.children[index].scrollIntoView({ behavior: "smooth", block: "start" });
  });
  find("[data-finish]").addEventListener("click", () => {
    const blank = attemptResult(current()).blank;
    if (!blank || window.confirm(`Quedan ${blank} preguntas en blanco. ¿Entregar el test?`)) finish();
  });
  find("[data-rescue]").addEventListener("click", () => {
    let data;
    try { data = exportProgress(localStorage); }
    catch { data = { app: "AprobarApp", version: 1, exportedAt: new Date().toISOString(), entries: {} }; }
    data.entries[STUDY_KEY] = JSON.stringify(repository.get());
    downloadJson(data, "aprobarapp-rescate-sesion.json");
  });
  find("[data-question-filter]").addEventListener("change", paint);
  paper.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    const card = button?.closest("[data-question-id]");
    if (!card || !current()) return;
    const questionId = card.dataset.questionId;
    if (button.hasAttribute("data-doubt")) repository.update((state) => setDoubt(state, currentId, questionId, !current().answers[questionId]?.doubt));
    else if (button.hasAttribute("data-option")) {
      const attempt = current();
      if (attempt.deadline && Date.now() >= attempt.deadline) { finish("time"); return; }
      const selected = attempt.answers[questionId]?.option;
      const option = attempt.mode === "exam" && selected === button.dataset.option ? null : button.dataset.option;
      repository.update((state) => saveAnswer(state, currentId, questionId, option));
      if (current().mode === "study" && attemptResult(current()).blank === 0) { finish(); return; }
    }
    paint();
  });
  document.addEventListener("visibilitychange", tick);
  window.addEventListener("pagehide", () => clearInterval(interval));
  window.addEventListener("pageshow", () => { clearInterval(interval); interval = setInterval(tick, 1000); tick(); });
  updateSettings();
  const requestedId = new URLSearchParams(location.search).get("intento");
  const attempts = repository.get().attempts.filter((a) => a.key === config.key);
  const existing = attempts.find((a) => a.id === requestedId) ?? attempts.filter((a) => a.status === "active").sort((a, b) => b.updatedAt - a.updatedAt)[0] ?? attempts.at(-1);
  if (existing) showAttempt(existing);
  return controller;
}
