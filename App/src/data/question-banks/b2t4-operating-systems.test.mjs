import test from "node:test";
import assert from "node:assert/strict";

import { b2t4OperatingSystemsQuestionBank } from "./b2t4-operating-systems.ts";

test("los simulacros de B2T4 usan un banco original y no el test oficial", () => {
  assert.equal(b2t4OperatingSystemsQuestionBank.length, 50);
  assert.ok(b2t4OperatingSystemsQuestionBank.every((question) => question.id.startsWith("b2t4-practice-")));
  assert.ok(b2t4OperatingSystemsQuestionBank.every((question) => question.options.length === 4));
});
