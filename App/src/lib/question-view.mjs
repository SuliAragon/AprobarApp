export function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

export function renderQuestion(question, index) {
  const e = escapeHtml;
  return `<article class="quiz-question" data-question data-question-id="${e(question.id)}" id="pregunta-${index + 1}">
    <div class="quiz-question__header"><span class="quiz-question__index">Pregunta ${e(question.displayNumber ?? index + 1)}</span><span class="quiz-question__section">${e(question.topicCode ?? "")} · ${e(question.section?.replace(/-/g, " ") ?? "")}</span></div>
    <h3>${e(question.prompt)}</h3>
    ${question.code ? `<div class="quiz-code"><span>${e(question.codeLanguage ?? "Código")}</span><pre><code>${e(question.code)}</code></pre></div>` : ""}
    <div class="quiz-options">${question.options.map((option) => `<button class="quiz-option" type="button" data-option="${e(option.id)}" aria-pressed="false"><span class="quiz-option__letter">${e(option.id.toUpperCase())}</span><span>${e(option.label)}</span></button>`).join("")}</div>
    <div class="question-tools"><button class="text-link" type="button" data-doubt aria-pressed="false">Marcar duda</button><span data-question-state></span></div>
    <div class="quiz-feedback" data-feedback hidden><p class="quiz-feedback__title" data-feedback-title></p><p class="quiz-feedback__body">${e(question.explanation)}</p></div>
  </article>`;
}
