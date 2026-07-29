import test from "node:test";
import assert from "node:assert/strict";

import { isB3T2QuestionSuitableForPractice } from "../b3t2-practice-quality.ts";

const question = (number) => ({
  id: `b3t2-test-oficial-diseno-bd-${number}`,
  section: "demo",
  prompt: "Demo",
  options: [
    { id: "a", label: "A" },
    { id: "b", label: "B" },
    { id: "c", label: "C" },
    { id: "d", label: "D" },
  ],
  correctOption: "a",
  explanation: "Demo",
});

test("los simulacros de B3T2 excluyen preguntas cuyo diagrama no llega al navegador", () => {
  assert.equal(isB3T2QuestionSuitableForPractice(question(24)), false);
  assert.equal(isB3T2QuestionSuitableForPractice(question(28)), false);
  assert.equal(isB3T2QuestionSuitableForPractice(question(1)), true);
});
