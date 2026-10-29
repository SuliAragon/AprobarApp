import { readStudyState, emptyStudyState, reviewRecords } from "./study-state.mjs";
import { escapeHtml as e } from "./question-view.mjs";
import { mountQuiz } from "./quiz-client.mjs";

export function mountNotebook(root) {
  if (!root) return;
  const filter = root.querySelector("[data-review-filter]");
  const topic = root.querySelector("[data-review-topic]");
  const size = root.querySelector("[data-review-size]");
  const status = root.querySelector("[data-review-status]");
  const quizRoot = document.querySelector("[data-study-quiz]");
  const quiz = mountQuiz(quizRoot);
  const config = JSON.parse(quizRoot.querySelector("[data-study-config]").textContent);
  let selected = [];
  const requested = new URLSearchParams(location.search).get("filtro");
  if (["all", "due", "wrong", "doubt"].includes(requested)) filter.value = requested;
  const render = (event) => {
    let state;
    try { state = event?.detail ?? readStudyState(localStorage); }
    catch { state = emptyStudyState(); status.textContent = "No se puede leer el cuaderno. No se ha borrado nada; revisa tu copia de seguridad en Progreso."; }
    selected = reviewRecords(state, { filter: filter.value, topicCode: topic.value });
    root.querySelector("[data-review-count]").textContent = `${selected.length} ${selected.length === 1 ? "pregunta" : "preguntas"} en esta selección.`;
    root.querySelector("[data-review-start]").disabled = !selected.length;
    root.querySelector("[data-review-list]").innerHTML = selected.slice(0, 100).map((record, index) => `<article class="review-card"><p class="eyebrow">${e(record.question.topicCode ?? "Simulacro")} · ${record.kind === "official" || record.kind === "simulation" ? "Plantilla oficial" : "Práctica"}${record.doubtful ? " · con duda" : ""}</p><h3>${e(record.question.prompt)}</h3><p class="study-hint">${record.wrong} fallos · ${record.blank} blancos · ${record.streak} aciertos seguros seguidos. ${record.doubtful || record.dueAt <= Date.now() ? "Repaso pendiente hoy." : `Próximo repaso: ${new Date(record.dueAt).toLocaleDateString("es-ES")}.`}</p><details><summary>Consultar explicación</summary><p>${e(record.question.explanation)}</p></details><div class="study-actions"><button class="button button--secondary" type="button" data-review-one="${index}">Practicar esta pregunta</button></div></article>`).join("") || '<p class="study-empty">No hay preguntas en este filtro. Al responder tests, tus fallos y blancos se incorporan aquí. También puedes usar «Marcar duda» aunque hayas acertado.</p>';
    if (selected.length > 100) root.querySelector("[data-review-list]").insertAdjacentHTML("beforeend", '<p class="study-hint">Se muestran las primeras 100. El repaso se prepara sobre toda la selección; filtra por tema para localizar otras preguntas.</p>');
  };
  const prepare = (records) => {
    if (!records.length) return;
    const questions = records.map((record) => ({ ...record.question, originKind: record.kind, originHref: record.href, originTitle: record.title }));
    quiz.prepare({ ...config, title: `Cuaderno · ${questions.length} ${questions.length === 1 ? "pregunta" : "preguntas"}`, questions, topicCodes: [...new Set(questions.map((q) => q.topicCode).filter(Boolean))] });
    status.textContent = "Repaso preparado. Elige modo y pulsa Comenzar debajo. Se mantienen las opciones y las respuestas originales.";
  };
  root.addEventListener("change", () => render());
  root.querySelector("[data-review-start]").addEventListener("click", () => prepare(selected.slice(0, Number(size.value))));
  root.addEventListener("click", (event) => {
    const button = event.target.closest("[data-review-one]");
    if (button) prepare([selected[Number(button.dataset.reviewOne)]]);
  });
  window.addEventListener("aprobarapp:progress", render);
  window.addEventListener("storage", () => render());
  render();
}
