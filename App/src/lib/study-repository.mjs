import { emptyStudyState, readStudyState, writeStudyState } from "./study-state.mjs";
import { mergeStudyStates } from "./progress-backup.mjs";
import { captureLegacyResults } from "./study-summary.mjs";

export function studyRepository(onStatus = () => {}) {
  let state = emptyStudyState();
  let blocked = false;
  try { state = captureLegacyResults(readStudyState(localStorage), localStorage); }
  catch { blocked = true; onStatus("No se ha podido leer el progreso. Puedes seguir en esta pestaña, pero no se sobrescribirá el dato anterior. Revisa tu copia en Progreso.", true); }
  return {
    get: () => state,
    update(change) {
      if (!blocked) {
        try { state = mergeStudyStates(state, readStudyState(localStorage)); }
        catch { blocked = true; }
      }
      state = change(state);
      try {
        if (blocked) throw new Error("Almacenamiento no disponible");
        writeStudyState(localStorage, state);
        onStatus("Guardado en este navegador.");
      } catch {
        onStatus("No se ha podido guardar. No cierres esta pestaña: exporta una copia desde el botón «Rescatar sesión» o libera espacio en Progreso.", true);
      }
      window.dispatchEvent(new CustomEvent("aprobarapp:progress", { detail: state }));
      return state;
    },
  };
}
