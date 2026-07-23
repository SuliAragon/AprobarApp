import assert from "node:assert/strict";
import test from "node:test";

import { withTemarioReference } from "./temario-explanation-references.mjs";

test("withTemarioReference añade el apartado del PDF sin duplicarlo", () => {
  const question = {
    prompt: "Un árbol está equilibrado cuando la altura de sus subárboles difiere como mucho en una unidad.",
    options: [{ id: "a", label: "Una unidad." }],
    correctOption: "a",
    explanation: "La diferencia de alturas es el criterio relevante.",
  };

  const enriched = withTemarioReference(question, "B2T3");

  assert.match(enriched.explanation, /Referencia del temario: B2T3 · .*Árboles/i);
  assert.equal(withTemarioReference(enriched, "B2T3").explanation, enriched.explanation);
});
