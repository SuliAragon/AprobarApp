import { questionBanksByCode } from "../data/question-banks";
import { buildCustomTest } from "../data/custom-test-generator.mjs";
import { recordStats } from "./study-state.mjs";
import { mountQuiz } from "./quiz-client.mjs";

export function mountCustomBuilder(root) {
  if (!root) return;
  const metadata = JSON.parse(root.querySelector("[data-custom-topic-metadata]").textContent);
  const quizRoot = document.querySelector("[data-study-quiz]");
  const quiz = mountQuiz(quizRoot);
  const original = JSON.parse(quizRoot.querySelector("[data-study-config]").textContent);
  const inputs = [...root.querySelectorAll("[data-custom-topic]")];
  const size = root.querySelector("[data-custom-size]");
  const unseen = root.querySelector("[data-custom-unseen]");
  const error = root.querySelector("[data-custom-error]");
  const key = "aprobarapp:custom-test-config";
  const selected = () => inputs.filter((input) => input.checked).map((input) => input.value);
  const summary = () => {
    const codes = selected();
    const count = metadata.filter((topic) => codes.includes(topic.code)).reduce((sum, topic) => sum + topic.count, 0);
    root.querySelector("[data-custom-selection-summary]").textContent = `${codes.length} temas · ${count} preguntas únicas disponibles. Se priorizan las menos practicadas.`;
    try { localStorage.setItem(key, JSON.stringify({ topics: codes, size: size.value, unseenOnly: unseen.checked })); } catch {}
  };
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? "null");
    for (const input of inputs) input.checked = Boolean(saved?.topics?.includes(input.value));
    if (["20", "30", "50", "100"].includes(saved?.size)) size.value = saved.size;
    unseen.checked = Boolean(saved?.unseenOnly);
  } catch {}
  const params = new URLSearchParams(location.search);
  const requestedTopic = params.get("tema");
  if (metadata.some((topic) => topic.code === requestedTopic)) {
    for (const input of inputs) input.checked = input.value === requestedTopic;
    unseen.checked = params.get("nuevas") === "1";
  }
  root.addEventListener("change", summary);
  root.querySelector("[data-select-all]").addEventListener("click", () => { inputs.forEach((input) => input.checked = true); summary(); });
  root.querySelector("[data-clear-selection]").addEventListener("click", () => { inputs.forEach((input) => input.checked = false); summary(); });
  root.querySelector("[data-generate-custom-test]").addEventListener("click", () => {
    try {
      const codes = selected();
      const state = quiz.getState();
      const seen = Object.fromEntries(Object.entries(state.records).map(([id, record]) => [id, recordStats(record).answered]));
      const test = buildCustomTest(codes.map((code) => ({ code, questions: questionBanksByCode[code] ?? [] })), { size: Number(size.value), seen, unseenOnly: unseen.checked });
      quiz.prepare({ ...original, title: `A medida · ${codes.join(", ")} · ${test.questions.length} preguntas`, topicCodes: codes, questions: test.questions, seed: test.seed });
      error.hidden = false;
      error.textContent = `${test.questions.length} preguntas preparadas. Elige estudio o examen y pulsa Comenzar debajo.`;
      error.classList.remove("is-danger");
    } catch (cause) {
      error.hidden = false;
      error.textContent = cause.message;
      error.classList.add("is-danger");
    }
  });
  summary();
}
