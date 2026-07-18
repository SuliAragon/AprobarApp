import generatedOfficialTests from "../generated/official-tests.json";
import { practiceQuestionExtensionsByCode } from "../practice-question-extensions.mjs";
import type { QuizQuestion } from "../question-bank";

function getQuestionNumber(id: string) {
  const match = id.match(/-(\d+)$/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

function resolveSection(questionNumber: number) {
  if (questionNumber <= 12) {
    return "ansi-sql-y-ddl";
  }

  if (questionNumber <= 24) {
    return "dml-dcl-y-consultas";
  }

  if (questionNumber <= 36) {
    return "joins-agrupaciones-y-vistas";
  }

  if (questionNumber <= 48) {
    return "procedimientos-eventos-y-disparadores";
  }

  return "conectividad-y-casos-practicos";
}

const b3t4OfficialTest = (generatedOfficialTests as Array<{
  code: string;
  questions: QuizQuestion[];
}>).find((test) => test.code === "B3T4");

const officialQuestions: QuizQuestion[] =
  b3t4OfficialTest?.questions.map((question) => ({
    ...question,
    section: resolveSection(getQuestionNumber(question.id)),
  })) ?? [];

export const b3t4SqlQuestionBank: QuizQuestion[] = [
  ...officialQuestions,
  ...(practiceQuestionExtensionsByCode.B3T4 ?? []),
];
