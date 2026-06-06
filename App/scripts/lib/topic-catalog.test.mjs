import test from "node:test";
import assert from "node:assert/strict";

import { buildTopicNavigator, parseTopicCode } from "../../src/data/topic-catalog.js";

test("parseTopicCode identifica bloque y tema desde el código", () => {
  assert.deepEqual(parseTopicCode("B1T1"), { blockNumber: 1, topicNumber: 1 });
  assert.deepEqual(parseTopicCode("B2T3"), { blockNumber: 2, topicNumber: 3 });
  assert.deepEqual(parseTopicCode("OTRO"), { blockNumber: null, topicNumber: null });
});

test("buildTopicNavigator crea bloques fijos y temas cargados por bloque", () => {
  const navigator = buildTopicNavigator(
    [
      { code: "B1T1", slug: "b1t1-ce", shortTitle: "Constitución Española" },
      { code: "B2T3", slug: "b2t3-estructuras-de-datos", shortTitle: "Estructuras de datos" },
    ],
    { totalBlocks: 4 },
  );

  assert.deepEqual(
    navigator.blockOptions.map((block) => block.value),
    ["1", "2", "3", "4"],
  );
  assert.equal(navigator.blockOptions[0].loadedTopicCount, 1);
  assert.equal(navigator.blockOptions[1].loadedTopicCount, 1);
  assert.equal(navigator.blockOptions[2].loadedTopicCount, 0);
  assert.deepEqual(
    navigator.themeOptionsByBlock["1"].map((topic) => topic.value),
    ["1"],
  );
  assert.deepEqual(
    navigator.themeOptionsByBlock["2"].map((topic) => topic.label),
    ["Tema 3 · Estructuras de datos"],
  );
});
