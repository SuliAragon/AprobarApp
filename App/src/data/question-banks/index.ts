import type { QuizQuestion } from "../question-bank";
import { b1t1ConstitutionQuestionBank } from "./b1t1-constitution";
import { b1t2CortesGeneralesQuestionBank } from "./b1t2-cortes-generales";
import { b2t3DataStructuresQuestionBank } from "./b2t3-data-structures";
import { b3t1ModeloErQuestionBank } from "./b3t1-modelo-er";
import { b3t2DisenoBdQuestionBank } from "./b3t2-diseno-bd";
import { b3t4SqlQuestionBank } from "./b3t4-sql";

export const questionBanksByCode: Record<string, QuizQuestion[]> = {
  B1T1: b1t1ConstitutionQuestionBank,
  B1T2: b1t2CortesGeneralesQuestionBank,
  B2T3: b2t3DataStructuresQuestionBank,
  B3T1: b3t1ModeloErQuestionBank,
  B3T2: b3t2DisenoBdQuestionBank,
  B3T4: b3t4SqlQuestionBank,
};
