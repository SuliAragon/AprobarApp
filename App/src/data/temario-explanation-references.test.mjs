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

test("B2T1 enlaza cada explicacion con su apartado concreto del temario", () => {
  const cases = [
    ["Por que UTF-8 conserva compatibilidad con ASCII?", "Unicode y codificación de textos"],
    ["Que guarda el contador de programa PC?", "Registros y ciclo de instrucción"],
    ["Que diferencia existe entre SRAM y DRAM?", "Memoria interna"],
    ["Que secuencia sigue el POST durante el encendido?", "Proceso de arranque"],
  ];

  for (const [prompt, expectedSection] of cases) {
    const enriched = withTemarioReference({
      prompt,
      options: [{ id: "a", label: "Respuesta" }],
      correctOption: "a",
      explanation: "Explicacion especifica.",
    }, "B2T1");

    assert.match(enriched.explanation, new RegExp(expectedSection, "i"));
  }
});
