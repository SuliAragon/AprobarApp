import { practiceQuestionExtensionsByCode } from "../practice-question-extensions.mjs";
import type { QuizQuestion } from "../question-bank";

// Simulacros only use original questions. Official questions remain in their own tab.
export const b2t4OperatingSystemsQuestionBank: QuizQuestion[] = practiceQuestionExtensionsByCode.B2T4 ?? [];
