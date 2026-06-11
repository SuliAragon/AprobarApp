import type { QuizQuestion } from "../question-bank";
import { b1t1ConstitutionQuestionBank } from "./b1t1-constitution";
import { b2t3DataStructuresQuestionBank } from "./b2t3-data-structures";
import { b3t1ModeloErQuestionBank } from "./b3t1-modelo-er";

export const questionBanksByCode: Record<string, QuizQuestion[]> = {
  B1T1: b1t1ConstitutionQuestionBank,
  B2T3: b2t3DataStructuresQuestionBank,
  B3T1: b3t1ModeloErQuestionBank,
};
