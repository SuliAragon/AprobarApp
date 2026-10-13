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

test("reparar preguntas de simulacros nunca sustituye las letras de la plantilla", async () => {
  const source = readFileSync(new URL("../../scripts/sync-temario.mjs", import.meta.url), "utf8");
  const start = source.indexOf("const simulationQuestionRepairs =");
  const end = source.indexOf("\nmkdirSync(", start);
  assert.ok(start >= 0 && end > start);
  const moduleSource = source.slice(start, end) + "\nexport { repairSimulationQuestions };";
  const { repairSimulationQuestions } = await import(`data:text/javascript;base64,${Buffer.from(moduleSource).toString("base64")}`);
  const answers = new Map([[74, "b"], [76, "c"]]);
  const parsed = { questions: [{ id: "simulacro-1-74", correctOption: "b" }] };
  const questions = repairSimulationQuestions(parsed, "simulacro-1", answers);
  assert.equal(questions.find((q) => q.id === "simulacro-1-74").correctOption, "b");
  assert.equal(questions.find((q) => q.id === "simulacro-1-76").correctOption, "c");
  assert.match(questions[0].explanation, /plantilla oficial.*b/i);
  const withoutKey = repairSimulationQuestions({ questions: [] }, "simulacro-1", new Map());
  assert.equal(withoutKey.length, 0);
});
