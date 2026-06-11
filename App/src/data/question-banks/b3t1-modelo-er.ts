import generatedOfficialTests from "../generated/official-tests.json";
import type { QuizQuestion } from "../question-bank";

function getQuestionNumber(id: string) {
  const match = id.match(/-(\d+)$/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

function resolveSection(questionNumber: number) {
  if (questionNumber <= 10) {
    return "fundamentos-er";
  }

  if (questionNumber <= 20) {
    return "relaciones-y-cardinalidad";
  }

  if (questionNumber <= 30) {
    return "modelo-conceptual";
  }

  if (questionNumber <= 40) {
    return "jerarquias-y-abstraccion";
  }

  return "metricav3-y-diseno";
}

const b3t1OfficialTest = (generatedOfficialTests as Array<{
  code: string;
  questions: QuizQuestion[];
}>).find((test) => test.code === "B3T1");

export const b3t1ModeloErQuestionBank: QuizQuestion[] =
  b3t1OfficialTest?.questions.map((question) => ({
    ...question,
    section: resolveSection(getQuestionNumber(question.id)),
  })) ?? [];
