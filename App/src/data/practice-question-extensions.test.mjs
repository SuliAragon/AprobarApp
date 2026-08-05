import assert from "node:assert/strict";
import test from "node:test";

import { practiceQuestionExtensionsByCode } from "./practice-question-extensions.mjs";

const expandedTopics = ["B1T3", "B2T4", "B2T5", "B3T1", "B3T2", "B3T4"];

test("las ampliaciones de practica aportan preguntas originales completas a cada tema tecnico", () => {
  for (const topicCode of expandedTopics) {
    const questions = practiceQuestionExtensionsByCode[topicCode] ?? [];

    const minimumQuestions = topicCode === "B2T4" ? 50 : 10;
    assert.ok(questions.length >= minimumQuestions, `${topicCode} debe recibir al menos ${minimumQuestions} preguntas nuevas`);
    assert.equal(new Set(questions.map((question) => question.id)).size, questions.length);

    for (const question of questions) {
      assert.equal(question.options.length, 4);
      assert.match(question.explanation, /.+/);
      assert.ok(question.options.some((option) => option.id === question.correctOption));
    }
  }
});
