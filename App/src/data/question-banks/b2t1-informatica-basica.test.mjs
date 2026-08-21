import test from "node:test";
import assert from "node:assert/strict";

import { b2t1InformaticaBasicaQuestionBank } from "./b2t1-informatica-basica.ts";

test("los simulacros de B2T1 cubren el temario con explicaciones especificas", () => {
  assert.equal(b2t1InformaticaBasicaQuestionBank.length, 50);
  assert.ok(b2t1InformaticaBasicaQuestionBank.every((question) => question.id.startsWith("b2t1-practice-")));
  assert.ok(b2t1InformaticaBasicaQuestionBank.every((question) => question.options.length === 4));
  assert.ok(b2t1InformaticaBasicaQuestionBank.every((question) => question.explanation.length >= 100));
  assert.ok(new Set(b2t1InformaticaBasicaQuestionBank.map((question) => question.explanation)).size >= 48);

  for (const question of b2t1InformaticaBasicaQuestionBank) {
    assert.doesNotMatch(question.explanation, /aplica el concepto preciso|se ajusta al criterio preguntado|apartado correspondiente/i);
  }
});
