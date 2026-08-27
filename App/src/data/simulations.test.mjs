import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("el Simulacro 4 cubre los doce temas disponibles", () => {
  const source = readFileSync(new URL("./simulations.ts", import.meta.url), "utf8");
  const simulationMatch = source.match(/"simulacro-4": \{([\s\S]*?)\n  \},/);

  assert.ok(simulationMatch, "Falta la ficha del Simulacro 4");
  assert.match(simulationMatch[1], /Simulacro 4 · Repaso de los doce primeros temas/);
  assert.match(simulationMatch[1], /coveredTopicCodes: \[[\s\S]*?"B1T1"[\s\S]*?"B3T4"/);
});

test("el Simulacro 4 conserva las correcciones de su plantilla oficial", () => {
  const source = readFileSync(new URL("../../scripts/sync-temario.mjs", import.meta.url), "utf8");

  assert.match(source, /"simulacro-4": \{/);
  assert.match(source, /1: \{[\s\S]*?correctOption: "d"/);
  assert.match(source, /3: \{[\s\S]*?correctOption: "d"/);
  assert.match(source, /4: \{[\s\S]*?correctOption: "d"/);
  assert.match(source, /5: \{[\s\S]*?correctOption: "a"/);
});
