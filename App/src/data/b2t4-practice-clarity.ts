import type { QuizQuestion } from "./question-bank";

const practicePromptOverrides: Record<number, string> = {
  12: "Según la versión de referencia indicada en este temario, ¿qué versión de iOS se considera actual?",
  13: "En la arquitectura de iOS, ¿qué capa agrupa las tecnologías de audio, vídeo, gráficos y otros contenidos multimedia?",
  22: "Se presentan los comandos UNIX: 1) \"ls\". 2) \"pwd\". 3) \"cat\". 4) \"more\". Relaciónelos con estas funciones: I) lista los archivos del directorio activo; II) muestra un archivo página a página; III) muestra la ruta completa del directorio actual; IV) imprime el contenido de un archivo en la salida estándar.",
  26: "Según la tabla comparativa del temario, ¿cuál es el tamaño máximo de archivo que admite JFS2?",
  34: "Según la clasificación recogida en el temario, ¿qué distribución se cita como derivada de Lubuntu?",
  41: "Partiendo del modo base 777, ¿qué umask deja los permisos 741?",
  43: "Según las características recogidas en el temario, ¿cuál de las siguientes NO describe al sistema operativo Android?",
};

function getQuestionNumber(id: string) {
  const match = id.match(/-(\d+)$/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

export function withB2T4PracticeClarity(question: QuizQuestion): QuizQuestion {
  return {
    ...question,
    prompt: practicePromptOverrides[getQuestionNumber(question.id)] ?? question.prompt,
  };
}
