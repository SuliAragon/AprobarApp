import type { QuizQuestion } from "../question-bank";
import { b1t1ConstitutionQuestionBank } from "./b1t1-constitution";
import { b1t2CortesGeneralesQuestionBank } from "./b1t2-cortes-generales";
import { b1t3GobiernoQuestionBank } from "./b1t3-gobierno";
import { b2t4OperatingSystemsQuestionBank } from "./b2t4-operating-systems";
import { b2t3DataStructuresQuestionBank } from "./b2t3-data-structures";
import { b2t5SgbdQuestionBank } from "./b2t5-sgbd";
import { b3t1ModeloErQuestionBank } from "./b3t1-modelo-er";
import { b3t2DisenoBdQuestionBank } from "./b3t2-diseno-bd";
import { b3t4SqlQuestionBank } from "./b3t4-sql";
import { withTemarioReference } from "../temario-explanation-references.mjs";

const rawQuestionBanksByCode: Record<string, QuizQuestion[]> = {
  B1T1: b1t1ConstitutionQuestionBank,
  B1T2: b1t2CortesGeneralesQuestionBank,
  B1T3: b1t3GobiernoQuestionBank,
  B2T3: b2t3DataStructuresQuestionBank,
  B2T4: b2t4OperatingSystemsQuestionBank,
  B2T5: b2t5SgbdQuestionBank,
  B3T1: b3t1ModeloErQuestionBank,
  B3T2: b3t2DisenoBdQuestionBank,
  B3T4: b3t4SqlQuestionBank,
};

export const questionBanksByCode: Record<string, QuizQuestion[]> = Object.fromEntries(
  Object.entries(rawQuestionBanksByCode).map(([code, questions]) => [
    code,
    questions.map((question) => withTemarioReference(question, code)),
  ]),
);
