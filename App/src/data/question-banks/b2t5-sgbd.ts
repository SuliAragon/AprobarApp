import generatedOfficialTests from "../generated/official-tests.json";
import { practiceQuestionExtensionsByCode } from "../practice-question-extensions.mjs";
import type { QuizQuestion } from "../question-bank";

const sectionByQuestionNumber = new Map<number, string>([
  [1, "objetos-y-bd-especializadas"],
  [2, "fundamentos-y-acid"],
  [3, "fundamentos-y-acid"],
  [4, "nosql-y-escalabilidad"],
  [5, "nosql-y-escalabilidad"],
  [6, "nosql-y-escalabilidad"],
  [7, "nosql-y-escalabilidad"],
  [8, "nosql-productos-y-casos"],
  [9, "relacional-y-codd"],
  [10, "nosql-y-escalabilidad"],
  [11, "nosql-y-escalabilidad"],
  [12, "nosql-y-escalabilidad"],
  [13, "nosql-y-escalabilidad"],
  [14, "nosql-y-escalabilidad"],
  [15, "nosql-y-escalabilidad"],
  [16, "nosql-y-escalabilidad"],
  [17, "objetos-y-bd-especializadas"],
  [18, "nosql-y-escalabilidad"],
  [19, "oracle-y-motores-relacionales"],
  [20, "oracle-y-motores-relacionales"],
  [21, "oracle-y-motores-relacionales"],
  [22, "oracle-y-motores-relacionales"],
  [23, "oracle-y-motores-relacionales"],
  [24, "relacional-y-codd"],
  [25, "relacional-y-codd"],
  [26, "relacional-y-codd"],
  [27, "relacional-y-codd"],
  [28, "relacional-y-codd"],
  [29, "fundamentos-y-acid"],
  [30, "relacional-y-codd"],
  [31, "relacional-y-codd"],
  [32, "objetos-y-bd-especializadas"],
  [33, "oracle-y-motores-relacionales"],
  [34, "fundamentos-y-acid"],
  [35, "relacional-y-codd"],
  [36, "nosql-y-escalabilidad"],
  [37, "nosql-productos-y-casos"],
  [38, "nosql-productos-y-casos"],
  [39, "nosql-productos-y-casos"],
  [40, "nosql-productos-y-casos"],
  [41, "oracle-y-motores-relacionales"],
  [42, "oracle-y-motores-relacionales"],
  [43, "oracle-y-motores-relacionales"],
  [44, "oracle-y-motores-relacionales"],
  [45, "nosql-y-escalabilidad"],
  [46, "nosql-y-escalabilidad"],
]);

function getQuestionNumber(id: string) {
  const match = id.match(/-(\d+)$/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

const b2t5OfficialTest = (generatedOfficialTests as Array<{
  code: string;
  questions: QuizQuestion[];
}>).find((test) => test.code === "B2T5");

const officialQuestions: QuizQuestion[] =
  b2t5OfficialTest?.questions.map((question) => {
    const questionNumber = getQuestionNumber(question.id);

    return {
      ...question,
      section: sectionByQuestionNumber.get(questionNumber) ?? "fundamentos-y-acid",
    };
  }) ?? [];

export const b2t5SgbdQuestionBank: QuizQuestion[] = [
  ...officialQuestions,
  ...(practiceQuestionExtensionsByCode.B2T5 ?? []),
];
