import type { QuizQuestion } from "./question-bank";

const questionsRequiringPdfDiagram = new Set([23, 24, 28, 29]);

function getQuestionNumber(id: string) {
  const match = id.match(/-(\d+)$/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

export function isB3T2QuestionSuitableForPractice(question: QuizQuestion) {
  return !questionsRequiringPdfDiagram.has(getQuestionNumber(question.id));
}
