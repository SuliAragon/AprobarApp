import test from "node:test";
import assert from "node:assert/strict";

import { topicOverrides } from "./topic-overrides.ts";

test("B2T1 define cinco rutas de practica que cubren todo el temario", () => {
  const topic = topicOverrides.B2T1;

  assert.ok(topic);
  assert.equal(topic.testPresets.length, 5);
  assert.deepEqual(
    new Set(topic.testPresets.flatMap((preset) => preset.focusSections)),
    new Set([
      "fundamentos-unidades",
      "numeracion-codificacion-logica",
      "sistemas-informacion",
      "procesador-von-neumann",
      "harvard-flynn-risc-cisc",
      "placa-buses-componentes",
      "memoria-cache-arranque",
    ]),
  );
});
