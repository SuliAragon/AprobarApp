import test from "node:test";
import assert from "node:assert/strict";

import { parseOfficialTestText } from "./official-tests-parser.mjs";

test("parseOfficialTestText extrae preguntas, opciones y soluciones oficiales", () => {
  const source = `
B1T1 test1

1. ¿Pregunta uno?
a) Opción A1.
b) Opción B1.
c) Opción C1.
d) Opción D1.

2. ¿Pregunta dos?
a) Opción A2.
b) Opción B2.
c) Opción C2.
d) Opción D2.

SOLUCIONES
1. C
2. A
`;

  const parsed = parseOfficialTestText(source, {
    code: "B1T1",
    slug: "b1t1-test-oficial",
    title: "Test oficial",
  });

  assert.equal(parsed.questions.length, 2);
  assert.equal(parsed.questions[0].prompt, "¿Pregunta uno?");
  assert.deepEqual(
    parsed.questions[0].options.map((option) => option.label),
    ["Opción A1.", "Opción B1.", "Opción C1.", "Opción D1."],
  );
  assert.equal(parsed.questions[0].correctOption, "c");
  assert.match(parsed.questions[0].explanation, /opción C/i);
  assert.equal(parsed.questions[1].correctOption, "a");
});

test("parseOfficialTestText ignora cabeceras y recompone opciones multilínea", () => {
  const source = `
2015-2016
Bloque 2 - Tema 3

7. ¿Cuántas pasadas hay que realizar?
a) N-1.
b) N.
c) N/2.
d) N+1.

PABLO ARELLANO
www.theglobeformacion.com
Página 3

8. En una lista enlazada, seleccione la opción correcta:
a) Primera línea de la respuesta
que continúa en la segunda línea.
b) Segunda opción.
c) Tercera opción.
d) Cuarta opción.

SOLUCIONES
7. A
8. A
`;

  const parsed = parseOfficialTestText(source, {
    code: "B2T3",
    slug: "b2t3-test-oficial",
    title: "Test oficial estructuras",
  });

  assert.equal(parsed.questions.length, 2);
  assert.equal(parsed.questions[1].options[0].label, "Primera línea de la respuesta que continúa en la segunda línea.");
});

test("parseOfficialTestText no confunde referencias legales con marcas de opción", () => {
  const source = `
19. La tutela podrá recabarse según el art. 161.1.a), en los términos previstos:
a) Solo ante el Tribunal Constitucional.
b) Solo ante los tribunales ordinarios.
c) Ante los tribunales ordinarios y, en su caso, por inconstitucionalidad.
d) Ante los tribunales ordinarios y, en su caso, por amparo.

SOLUCIONES
19. D
`;

  const parsed = parseOfficialTestText(source, {
    code: "B1T1",
    slug: "b1t1-test-oficial",
    title: "Test oficial",
  });

  assert.equal(parsed.questions.length, 1);
  assert.equal(parsed.questions[0].correctOption, "d");
  assert.equal(parsed.questions[0].options.length, 4);
});

test("parseOfficialTestText aplica correcciones manuales conocidas sobre la plantilla oficial", () => {
  const source = `
5. Un español de origen puede perder esta nacionalidad:
a) Por sanción administrativa.
b) Cuando libremente renuncie a la misma.
c) Por condena penal.
d) En ningún caso.

SOLUCIONES
5. B
`;

  const parsed = parseOfficialTestText(source, {
    code: "B1T1",
    slug: "b1t1-test-oficial-ce-2",
    title: "Test oficial CE 2",
  });

  assert.equal(parsed.questions.length, 1);
  assert.equal(parsed.questions[0].correctOption, "d");
  assert.match(parsed.questions[0].explanation, /opción D/i);
});

test("parseOfficialTestText no corta el examen si aparece la palabra resoluciones dentro del enunciado", () => {
  const source = `
18. En relación con el Defensor del Pueblo:
a) Puede anular resoluciones e imponer sanciones.
b) Carece de legitimación para el amparo.
c) Solo supervisa a la Administración del Estado.
d) Defiende derechos del Título I.

19. El Tribunal Constitucional:
a) Se compone de 12 miembros.
b) Tiene 8 miembros.
c) Renueva todos sus miembros a la vez.
d) Depende del Gobierno.

SOLUCIONES
18. D
19. A
`;

  const parsed = parseOfficialTestText(source, {
    code: "B1T2",
    slug: "b1t2-test-oficial",
    title: "Test oficial B1T2",
  });

  assert.equal(parsed.questions.length, 2);
  assert.equal(parsed.questions[0].correctOption, "d");
  assert.equal(parsed.questions[1].correctOption, "a");
});
