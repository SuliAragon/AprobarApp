import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { prepareOfficialQuestions } from "./official-question-identity.mjs";

test("los identificadores repetidos no impiden iniciar oficiales ni cambian textos, opciones o plantillas", () => {
  const tests = JSON.parse(fs.readFileSync(new URL("../data/generated/official-tests.json", import.meta.url)));
  for (const source of tests) {
    const before = structuredClone(source.questions);
    const questions = prepareOfficialQuestions(source.questions, source.code);
    assert.equal(new Set(questions.map((q) => q.id)).size, questions.length);
    assert.deepEqual(source.questions, before);
    questions.forEach((q, index) => {
      const { id, topicCode, ...content } = q;
      const { id: originalId, ...original } = source.questions[index];
      assert.equal(topicCode, source.code);
      assert.deepEqual(content, original);
    });
  }
});
