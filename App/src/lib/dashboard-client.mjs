import { readStudyState, emptyStudyState } from "./study-state.mjs";
import { summarizeStudy, captureLegacyResults, localDayKey } from "./study-summary.mjs";
import { escapeHtml as e } from "./question-view.mjs";
import { exportProgress, parseProgressBackup, restoreProgress } from "./progress-backup.mjs";
import { attemptLink, downloadJson } from "./quiz-client.mjs";

const dateLabel = (at) => new Date(at).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" });
const percent = (correct, total) => total ? `${Math.round(correct / total * 100)} %` : "Sin datos";

export function mountDashboard(root) {
  const config = JSON.parse(root.querySelector("[data-dashboard-config]").textContent);
  const find = (selector) => root.querySelector(selector);
  const full = root.dataset.full === "true";
  let pendingImport = null;
  let state;

  const render = (event) => {
    try { state = captureLegacyResults(event?.detail ?? readStudyState(localStorage), localStorage); }
    catch { state = emptyStudyState(); find("[data-dashboard-status]").textContent = "No se puede leer el progreso de este navegador. No se ha borrado nada. Exporta una copia antes de intentar restaurarlo."; }
    const data = summarizeStudy(state);
    find("[data-stat-today]").textContent = data.answeredToday;
    find("[data-stat-unique]").textContent = data.unique;
    find("[data-stat-active]").textContent = data.active.length;
    find("[data-stat-due]").textContent = data.due.length;
    find("[data-today-message]").textContent = data.due.length ? `Tienes ${data.due.length} ${data.due.length === 1 ? "pregunta lista" : "preguntas listas"} para repasar hoy.` : data.pending.length ? `${data.pending.length} ${data.pending.length === 1 ? "pregunta sigue" : "preguntas siguen"} en tu cuaderno para próximos repasos.` : "Empieza por un test o continúa tu último intento.";
    const active = data.active[0];
    const continueLink = find("[data-continue-link]");
    continueLink.href = active ? attemptLink(active) : `${config.base}test-a-medida/`;
    continueLink.textContent = active ? "Continuar último intento" : "Preparar un test";
    find("[data-active-list]").innerHTML = data.active.slice(0, 5).map((a) => `<li><a href="${e(attemptLink(a))}">${e(a.title)}</a><small>${Object.values(a.answers ?? {}).filter((v) => v.option).length}/${a.questions?.length ?? 0} respondidas · ${a.mode === "exam" ? "Examen" : "Estudio"} · ${e(dateLabel(a.updatedAt))}</small></li>`).join("") || '<li>No tienes intentos abiertos. Tu siguiente sesión puede empezar con preguntas nuevas.</li>';
    let tasks = [];
    try { tasks = JSON.parse(localStorage.getItem("aprobarapp:calendar:v2") ?? '{"entries":[]}').entries ?? []; } catch {}
    const today = localDayKey();
    const dueTasks = tasks.filter((task) => !task.completed && task.dayKey <= today).sort((a, b) => a.dayKey.localeCompare(b.dayKey)).slice(0, 5);
    const suggested = [...config.topics].sort((a, b) => {
      const left = data.topics[a.code]; const right = data.topics[b.code];
      if (!left) return right ? -1 : 0;
      if (!right) return 1;
      return left.correct / Math.max(1, left.correct + left.wrong) - right.correct / Math.max(1, right.correct + right.wrong);
    })[0];
    const suggestions = data.due.length ? `<li><a href="${e(config.base)}cuaderno/?filtro=due">Repasar ${data.due.length} ${data.due.length === 1 ? "pregunta pendiente" : "preguntas pendientes"} hoy</a><small>Fallos, blancos o dudas según tu historial.</small></li>` : "";
    find("[data-today-list]").innerHTML = suggestions + dueTasks.map((task) => `<li>${e(task.title)}<small>${e(task.dayKey)} · ${e(task.topic ?? "")}${task.dayKey < today ? " · pendiente anterior" : ""}</small></li>`).join("") + (suggested ? `<li><a href="${e(config.base)}test-a-medida/?tema=${e(suggested.code)}">Practicar ${e(suggested.code)} · ${e(suggested.title)}</a><small>${data.topics[suggested.code] ? "Sugerido a partir de tus respuestas registradas." : "Todavía no tienes respuestas registradas de este tema."}</small></li>` : "");
    if (!full) return;
    find("[data-trend]").innerHTML = data.completed.slice(0, 10).map((a) => `<li><strong>${e(a.title)}</strong><small>${e(dateLabel(a.finishedAt))} · ${a.result.correct} aciertos / ${a.result.total} preguntas · ${percent(a.result.correct, a.result.total)}</small><meter min="0" max="100" value="${a.result.correct / a.result.total * 100}" aria-label="Porcentaje de aciertos">${percent(a.result.correct, a.result.total)}</meter></li>`).join("") || '<li>Todavía no hay intentos terminados en esta versión. Tu evolución aparecerá aquí.</li>';
    const topicRows = config.topics.map((topic) => {
      const metrics = data.topics[topic.code];
      return `<tr><td><a href="${e(topic.href)}">${e(topic.code)} · ${e(topic.title)}</a></td><td>${metrics?.unique ?? 0}</td><td>${metrics?.correct ?? 0}</td><td>${metrics?.wrong ?? 0}</td><td>${metrics?.blank ?? 0}</td><td>${metrics ? percent(metrics.correct, metrics.correct + metrics.wrong) : "Sin datos"}</td></tr>`;
    }).join("");
    const weakest = Object.values(data.sections).filter((s) => s.correct + s.wrong >= 3).sort((a, b) => a.correct / (a.correct + a.wrong) - b.correct / (b.correct + b.wrong)).slice(0, 5);
    find("[data-topic-progress]").innerHTML = `<table class="progress-table"><caption>La precisión excluye blancos y cuenta todos los intentos, no solo el último.</caption><thead><tr><th>Tema</th><th>Únicas</th><th>Aciertos</th><th>Fallos</th><th>Blancos</th><th>Precisión</th></tr></thead><tbody>${topicRows}</tbody></table><h3>Apartados para reforzar</h3><ul class="study-list">${weakest.map((s) => `<li>${e(s.code)} · ${e(s.section.replace(/-/g, " "))}<small>${percent(s.correct, s.correct + s.wrong)} de aciertos sobre ${s.correct + s.wrong} respuestas.</small></li>`).join("") || '<li>Hace falta un mínimo de tres respuestas por apartado para mostrar sugerencias.</li>'}</ul>`;
    const filter = find("[data-history-filter]").value;
    const attempts = [...state.attempts].sort((a, b) => b.updatedAt - a.updatedAt).filter((a) => filter === "all" || a.status === filter || a.mode === filter);
    find("[data-attempt-history]").innerHTML = `<table class="progress-table"><caption>${attempts.length} intentos en este filtro.</caption><thead><tr><th>Intento</th><th>Fecha</th><th>Modo</th><th>Estado</th><th>Resultado</th></tr></thead><tbody>${attempts.map((a) => `<tr><td>${a.questions ? `<a href="${e(attemptLink(a))}">${e(a.title)}</a>` : e(a.title)}</td><td>${e(dateLabel(a.updatedAt))}</td><td>${a.mode === "exam" ? "Examen" : "Estudio"}</td><td>${a.status === "active" ? "En curso" : "Terminado"}${a.status === "active" && a.deadline && a.deadline < Date.now() ? " · tiempo agotado; abre para corregir" : ""}</td><td>${a.result ? `${a.result.correct} aciertos · ${a.result.wrong} fallos · ${a.result.blank} blancos<br>${a.result.net.toLocaleString("es-ES", { maximumFractionDigits: 2 })} / ${a.result.total}` : `${Object.values(a.answers ?? {}).filter((v) => v.option).length}/${a.questions?.length ?? 0} respondidas`}</td></tr>`).join("") || '<tr><td colspan="5">No hay intentos para este filtro.</td></tr>'}</tbody></table>`;
    const legacy = Object.values(state.legacyResults ?? {}).sort((a, b) => b.finishedAt - a.finishedAt);
    find("[data-legacy-history]").innerHTML = legacy.length ? `<h3>Resultados de la versión anterior</h3><p class="study-hint">Se conserva el resultado que había guardado cada test. La versión anterior no guardaba respuestas individuales ni un historial de todos los intentos.</p><ul class="study-list">${legacy.map((a) => `<li>${e(a.key.replace(/^aprobarapp:/, "").replaceAll(":", " · "))}<small>${e(dateLabel(a.finishedAt))} · ${a.mistakes} fallos / ${a.total} preguntas · sin detalle por respuesta</small></li>`).join("")}</ul>` : "";
  };
  render();
  window.addEventListener("aprobarapp:progress", render);
  window.addEventListener("storage", () => render());
  find("[data-history-filter]")?.addEventListener("change", () => render());
  if (!full) return;
  const backupStatus = find("[data-backup-status]");
  find("[data-export-progress]").addEventListener("click", () => {
    try {
      const backup = exportProgress(localStorage);
      downloadJson(backup, `aprobarapp-progreso-${localDayKey()}.json`);
      backupStatus.textContent = "Copia global descargada. Guárdala fuera del navegador para trasladar o recuperar tu progreso.";
    } catch { backupStatus.textContent = "No se puede acceder al almacenamiento. No se ha cambiado ningún dato."; }
  });
  find("[data-import-progress]").addEventListener("change", async (event) => {
    pendingImport = null;
    find("[data-import-preview]").hidden = true;
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      if (file.size > 20 * 1024 * 1024) throw new Error("El archivo supera 20 MB.");
      const text = await file.text();
      const parsed = parseProgressBackup(text);
      pendingImport = text;
      find("[data-import-description]").textContent = `${Object.keys(parsed.entries).length} bloques de datos en la copia. Se combinarán los intentos por identificador, se conservarán las tareas actuales y se descargará primero un respaldo de seguridad.`;
      find("[data-import-preview]").hidden = false;
      backupStatus.textContent = "Archivo validado. Todavía no se ha importado nada.";
    } catch (error) { backupStatus.textContent = `No se ha importado: ${error.message}`; }
  });
  find("[data-confirm-import]").addEventListener("click", () => {
    if (!pendingImport) return;
    try {
      downloadJson(exportProgress(localStorage), `aprobarapp-antes-de-importar-${localDayKey()}.json`);
      restoreProgress(localStorage, pendingImport);
      pendingImport = null;
      find("[data-import-preview]").hidden = true;
      backupStatus.textContent = "Copia combinada. El historial y el calendario ya están disponibles. Recarga las otras pestañas antes de continuar estudiando.";
      render();
    } catch (error) { backupStatus.textContent = `No se ha completado la importación: ${error.message}`; }
  });
}
