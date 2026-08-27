import test from "node:test";
import assert from "node:assert/strict";

import { topicOverrides } from "./topic-overrides.ts";

test("B2T2 define los cinco enfoques de repaso del temario de periféricos", () => {
  const topic = topicOverrides.B2T2;

  assert.equal(topic.shortTitle, "Periféricos");
  assert.equal(topic.testPresets.length, 5);
  assert.deepEqual(
    topic.testPresets.map((preset) => preset.focusSections),
    [
      ["perifericos-y-clasificacion", "conectividad-y-administracion"],
      ["impresion-y-tecnologias"],
      ["almacenamiento-hdd-y-ssd"],
      ["visualizacion-y-pantallas-tactiles"],
      ["entrada-y-teclados", "digitalizacion-y-nti"],
    ],
  );
});
