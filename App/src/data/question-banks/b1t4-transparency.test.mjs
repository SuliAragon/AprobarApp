import assert from "node:assert/strict";
import test from "node:test";
import { b1t4TransparencyQuestionBank } from "./b1t4-transparency.ts";

test("los simulacros de B1T4 usan 50 preguntas originales", () => {
  assert.equal(b1t4TransparencyQuestionBank.length, 50);
  assert.ok(b1t4TransparencyQuestionBank.every((question) => question.id.startsWith("b1t4-practice-")));
  assert.ok(b1t4TransparencyQuestionBank.every((question) => question.options.length === 4));
});
