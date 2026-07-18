import assert from "node:assert/strict";
import test from "node:test";

import { buildExtendedPracticePresets } from "./practice-test-presets.mjs";

const basePresets = [
  { slug: "fundamentos", title: "Test 1 · Fundamentos", description: "Base", focusSections: ["fundamentos"] },
  { slug: "modelo", title: "Test 2 · Modelo", description: "Modelo", focusSections: ["modelo"] },
  { slug: "operaciones", title: "Test 3 · Operaciones", description: "Operaciones", focusSections: ["operaciones"] },
  { slug: "control", title: "Test 4 · Control", description: "Control", focusSections: ["control"] },
  { slug: "casos", title: "Test 5 · Casos", description: "Casos", focusSections: ["casos"] },
];

test("buildExtendedPracticePresets añade cinco simulacros distintos y un repaso global", () => {
  const presets = buildExtendedPracticePresets(basePresets);

  assert.equal(presets.length, 10);
  assert.equal(new Set(presets.map((preset) => preset.slug)).size, 10);
  assert.deepEqual(presets.at(-1)?.focusSections, ["fundamentos", "modelo", "operaciones", "control", "casos"]);
  assert.match(presets.at(-1)?.title ?? "", /^Test 10/);
});
