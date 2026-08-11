import assert from "node:assert/strict";
import test from "node:test";
import { b1t4TransparencyQuestionBank } from "./b1t4-transparency.ts";

test("los simulacros de B1T4 usan 50 preguntas originales", () => {
  assert.equal(b1t4TransparencyQuestionBank.length, 50);
  assert.ok(b1t4TransparencyQuestionBank.every((question) => question.id.startsWith("b1t4-practice-")));
  assert.ok(b1t4TransparencyQuestionBank.every((question) => question.options.length === 4));
});

test("B1T4 excluye infracciones disciplinarias del material de practica", () => {
  assert.doesNotMatch(JSON.stringify(b1t4TransparencyQuestionBank), /infracci|disciplinari|sanci[oó]n/i);
});

test("B1T4 cubre la tabla completa de los 17 ODS", () => {
  const agendaQuestions = b1t4TransparencyQuestionBank
    .filter((question) => question.section === "agenda-2030-y-ods")
    .map((question) => `${question.prompt} ${question.options.map((option) => option.label).join(" ")}`)
    .join(" ");

  [
    "Fin de la pobreza",
    "Hambre cero",
    "Salud y bienestar",
    "Educacion de calidad",
    "Igualdad de genero",
    "Agua limpia y saneamiento",
    "Energia asequible y no contaminante",
    "Trabajo decente y crecimiento economico",
    "Industria, innovacion e infraestructura",
    "Reduccion de las desigualdades",
    "Ciudades y comunidades sostenibles",
    "Produccion y consumo responsables",
    "Accion por el clima",
    "Vida submarina",
    "Vida de ecosistemas terrestres",
    "Paz, justicia e instituciones solidas",
    "Alianzas para lograr los objetivos",
  ].forEach((title) => assert.match(agendaQuestions, new RegExp(title)));
});
