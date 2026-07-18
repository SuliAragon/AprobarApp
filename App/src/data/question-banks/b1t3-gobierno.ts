import generatedOfficialTests from "../generated/official-tests.json";
import { practiceQuestionExtensionsByCode } from "../practice-question-extensions.mjs";
import type { QuizQuestion } from "../question-bank";

const sectionByQuestionNumber = new Map<number, string>([
  [1, "relaciones-con-las-cortes"],
  [2, "marco-constitucional-y-composicion"],
  [3, "relaciones-con-las-cortes"],
  [4, "relaciones-con-las-cortes"],
  [5, "funciones-del-gobierno"],
  [6, "marco-constitucional-y-composicion"],
  [7, "funciones-del-gobierno"],
  [8, "marco-constitucional-y-composicion"],
  [9, "funciones-del-gobierno"],
  [10, "nombramiento-investidura-y-cese"],
  [11, "marco-constitucional-y-composicion"],
  [12, "relaciones-con-las-cortes"],
  [13, "relaciones-con-las-cortes"],
  [14, "marco-constitucional-y-composicion"],
  [15, "funciones-del-gobierno"],
  [16, "nombramiento-investidura-y-cese"],
  [17, "nombramiento-investidura-y-cese"],
  [18, "funciones-del-gobierno"],
  [19, "nombramiento-investidura-y-cese"],
  [20, "nombramiento-investidura-y-cese"],
  [21, "relaciones-con-las-cortes"],
  [22, "marco-constitucional-y-composicion"],
  [23, "funciones-del-gobierno"],
  [24, "relaciones-con-las-cortes"],
  [25, "relaciones-con-las-cortes"],
  [26, "relaciones-con-las-cortes"],
  [27, "organos-de-apoyo-y-estatuto"],
  [28, "nombramiento-investidura-y-cese"],
  [29, "organos-de-apoyo-y-estatuto"],
  [30, "relaciones-con-las-cortes"],
  [31, "relaciones-con-las-cortes"],
  [32, "organos-de-apoyo-y-estatuto"],
  [33, "nombramiento-investidura-y-cese"],
  [34, "relaciones-con-las-cortes"],
  [35, "organos-de-apoyo-y-estatuto"],
  [36, "organos-de-apoyo-y-estatuto"],
  [37, "nombramiento-investidura-y-cese"],
  [38, "nombramiento-investidura-y-cese"],
  [39, "relaciones-con-las-cortes"],
  [40, "relaciones-con-las-cortes"],
  [41, "nombramiento-investidura-y-cese"],
  [42, "relaciones-con-las-cortes"],
  [43, "marco-constitucional-y-composicion"],
  [44, "relaciones-con-las-cortes"],
  [45, "marco-constitucional-y-composicion"],
  [46, "marco-constitucional-y-composicion"],
  [47, "relaciones-con-las-cortes"],
  [48, "funciones-del-gobierno"],
  [49, "relaciones-con-las-cortes"],
  [50, "relaciones-con-las-cortes"],
  [51, "organos-de-apoyo-y-estatuto"],
  [52, "organos-de-apoyo-y-estatuto"],
  [53, "funciones-del-gobierno"],
  [54, "nombramiento-investidura-y-cese"],
  [55, "marco-constitucional-y-composicion"],
  [56, "marco-constitucional-y-composicion"],
  [57, "funciones-del-gobierno"],
  [58, "funciones-del-gobierno"],
  [59, "nombramiento-investidura-y-cese"],
  [60, "nombramiento-investidura-y-cese"],
  [61, "nombramiento-investidura-y-cese"],
  [62, "funciones-del-gobierno"],
  [63, "organos-de-apoyo-y-estatuto"],
  [64, "relaciones-con-las-cortes"],
  [65, "relaciones-con-las-cortes"],
  [66, "relaciones-con-las-cortes"],
  [67, "nombramiento-investidura-y-cese"],
  [68, "relaciones-con-las-cortes"],
  [69, "relaciones-con-las-cortes"],
  [70, "funciones-del-gobierno"],
  [71, "funciones-del-gobierno"],
  [72, "relaciones-con-las-cortes"],
]);

function getQuestionNumber(id: string) {
  const match = id.match(/-(\d+)$/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

const b1t3OfficialTest = (generatedOfficialTests as Array<{
  code: string;
  questions: QuizQuestion[];
}>).find((test) => test.code === "B1T3");

const officialQuestions: QuizQuestion[] =
  b1t3OfficialTest?.questions.map((question) => {
    const questionNumber = getQuestionNumber(question.id);

    return {
      ...question,
      section: sectionByQuestionNumber.get(questionNumber) ?? "marco-constitucional-y-composicion",
    };
  }) ?? [];

export const b1t3GobiernoQuestionBank: QuizQuestion[] = [
  ...officialQuestions,
  ...(practiceQuestionExtensionsByCode.B1T3 ?? []),
];
