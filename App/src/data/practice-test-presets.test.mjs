import assert from "node:assert/strict";
import test from "node:test";

import { buildExtendedPracticePresets } from "./practice-test-presets.mjs";
import * as presetApi from "./practice-test-presets.mjs";
import { b3t6PracticeGroups } from "./b3t6-config.mjs";

test("B3T6 conserva diez tests por cada uno de los cinco documentos", () => {
  assert.equal(typeof presetApi.buildGroupedPracticePresets, "function");
  const presets = presetApi.buildGroupedPracticePresets(b3t6PracticeGroups);
  assert.equal(presets.length, 50);
  assert.equal(new Set(presets.map((p) => p.slug)).size, 50);
  for (const group of b3t6PracticeGroups) {
    const groupPresets = presets.filter((p) => p.slug.startsWith(`${group.slug}-`));
    assert.equal(groupPresets.length, 10);
    assert.ok(groupPresets.every((p) => p.poolSections.length === 5 && p.poolSections.every((s) => s.startsWith(`${group.slug}-`))));
  }
});

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
