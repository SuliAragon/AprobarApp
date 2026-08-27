import test from "node:test";
import assert from "node:assert/strict";

import { b2t2PerifericosQuestionBank } from "./b2t2-perifericos.ts";

test("los simulacros de B2T2 cubren periféricos con explicaciones específicas y respuestas equilibradas", () => {
  assert.equal(b2t2PerifericosQuestionBank.length, 50);
  assert.ok(b2t2PerifericosQuestionBank.every((question) => question.id.startsWith("b2t2-practice-")));
  assert.ok(b2t2PerifericosQuestionBank.every((question) => question.options.length === 4));
  assert.ok(b2t2PerifericosQuestionBank.every((question) => question.explanation.length >= 100));
  assert.ok(new Set(b2t2PerifericosQuestionBank.map((question) => question.explanation)).size >= 48);
  assert.ok(b2t2PerifericosQuestionBank.every((question) => !/aplica el concepto preciso|se ajusta al criterio preguntado|apartado correspondiente/i.test(question.explanation)));

  const correctCounts = Object.fromEntries(["a", "b", "c", "d"].map((option) => [option, 0]));
  b2t2PerifericosQuestionBank.forEach((question) => {
    correctCounts[question.correctOption] += 1;
  });

  const values = Object.values(correctCounts);
  assert.ok(Math.max(...values) - Math.min(...values) <= 1);
});
