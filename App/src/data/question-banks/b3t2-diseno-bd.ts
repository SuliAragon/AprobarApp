import generatedOfficialTests from "../generated/official-tests.json";
import { practiceQuestionExtensionsByCode } from "../practice-question-extensions.mjs";
import type { QuizQuestion } from "../question-bank";

function getQuestionNumber(id: string) {
  const match = id.match(/-(\d+)$/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

function resolveSection(questionNumber: number) {
  if (questionNumber <= 10) {
    return "fundamentos-relacional";
  }

  if (questionNumber <= 20) {
    return "normalizacion";
  }

  if (questionNumber <= 30) {
    return "transformacion-er";
  }

  if (questionNumber <= 40) {
    return "arquitectura-y-diseno";
  }

  return "integridad-y-modelo-logico";
}

const b3t2OfficialTest = (generatedOfficialTests as Array<{
  code: string;
  questions: QuizQuestion[];
}>).find((test) => test.code === "B3T2");

const officialQuestions: QuizQuestion[] =
  b3t2OfficialTest?.questions.map((question) => ({
    ...question,
    section: resolveSection(getQuestionNumber(question.id)),
  })) ?? [];

export const b3t2DisenoBdQuestionBank: QuizQuestion[] = [
  ...officialQuestions,
  ...(practiceQuestionExtensionsByCode.B3T2 ?? []),
];
