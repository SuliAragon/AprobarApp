import assert from "node:assert/strict";
import test from "node:test";

import { b1t3GobiernoQuestionBank } from "./b1t3-gobierno.ts";

test("los simulacros de B1T3 usan 50 preguntas originales", () => {
  assert.equal(b1t3GobiernoQuestionBank.length, 50);
  assert.ok(b1t3GobiernoQuestionBank.every((question) => question.id.startsWith("b1t3-practice-")));
  assert.ok(b1t3GobiernoQuestionBank.every((question) => question.options.length === 4));
});
