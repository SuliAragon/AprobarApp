import generatedOfficialTests from "../generated/official-tests.json";
import { practiceQuestionExtensionsByCode } from "../practice-question-extensions.mjs";
import { withB2T4Explanation } from "../b2t4-explanations";
import type { QuizQuestion } from "../question-bank";

const questionsBySection = {
  "procesos-y-planificacion": new Set([2, 8, 16, 47, 48, 49, 54, 55, 57, 58]),
  "memoria-entrada-salida": new Set([3, 44, 45, 46, 60]),
  "ficheros-y-almacenamiento": new Set([1, 20, 26, 27, 28, 29, 30, 50]),
  "windows-y-servicios-cloud": new Set([17, 18, 19, 24, 25, 31, 32, 52]),
  "unix-linux-y-comandos": new Set([4, 5, 6, 7, 9, 15, 21, 22, 33, 34, 35, 36, 37, 38, 39, 40, 41, 59]),
  "moviles-y-plataformas": new Set([10, 11, 12, 13, 14, 23, 42, 43, 51, 56]),
};

function getQuestionNumber(id: string) {
  const match = id.match(/-(\d+)$/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

function resolveSection(questionNumber: number) {
  return (
    Object.entries(questionsBySection).find(([, questions]) => questions.has(questionNumber))?.[0] ??
    "arquitectura-y-componentes"
  );
}

const b2t4OfficialTest = (generatedOfficialTests as Array<{
  code: string;
  questions: QuizQuestion[];
}>).find((test) => test.code === "B2T4");

const officialQuestions: QuizQuestion[] =
  b2t4OfficialTest?.questions.map((question) => ({
    ...withB2T4Explanation(question),
    section: resolveSection(getQuestionNumber(question.id)),
  })) ?? [];

export const b2t4OperatingSystemsQuestionBank: QuizQuestion[] = [
  ...officialQuestions,
  ...(practiceQuestionExtensionsByCode.B2T4 ?? []),
];
