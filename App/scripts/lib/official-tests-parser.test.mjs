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
  assert.match(parsed.questions[0].explanation, /La respuesta correcta es «Opción C1\./i);
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
  assert.match(parsed.questions[0].explanation, /La respuesta correcta es «En ningún caso\./i);
});

test("parseOfficialTestText genera una explicación didáctica y no repite la plantilla oficial", () => {
  const source = `
26. Un árbol está equilibrado:
a) Si, y sólo si, para cada uno de sus nodos ocurre que las alturas de sus dos subárboles difieren como mucho en 1.
b) Si, para cada nodo, el número de nodos de sus subárboles difiere como mucho en una unidad.
c) Si los dos subárboles tienen siempre el mismo número de nodos.
d) Si basta con que algunos de sus nodos cumplan la condición de altura.

SOLUCIONES
26. A
`;

  const parsed = parseOfficialTestText(source, {
    code: "B2T3",
    slug: "b2t3-test-oficial",
    title: "Test oficial estructuras",
  });

  assert.match(parsed.questions[0].explanation, /^Por qué:/);
  assert.match(parsed.questions[0].explanation, /altura.*subárboles/i);
  assert.match(parsed.questions[0].explanation, /Referencia del temario: B2T3 · .*Árboles/i);
  assert.doesNotMatch(parsed.questions[0].explanation, /plantilla oficial/i);
});

test("parseOfficialTestText explica cada supuesto de transparencia con su regla concreta", () => {
  const source = `
3. El Presidente del Consejo de Transparencia y Buen Gobierno, de acuerdo con la Ley 19/2013, es nombrado por un período de:
a) 4 años, no renovable.
b) 5 años, renovable.
c) 4 años, renovable una sola vez.
d) 5 años, no renovable.

4. Cuando las infracciones de las normas de buen gobierno puedan ser constitutivas de delito, la Ley 19/2013:
a) Obliga a la Administración a poner los hechos en conocimiento del Consejo de Transparencia y Buen Gobierno.
b) Obliga a la Administración a poner los hechos en conocimiento del Fiscal General del Estado.
c) Faculta a la Administración para continuar con el procedimiento.
d) Permite a la Administración archivar los hechos.

5. La Ley 19/2013 establece la obligatoriedad por parte de las Administraciones Públicas de publicar las circulares en la medida en que:
a) Impliquen una aplicación no prevista en la normativa vigente.
b) Tengan efectos jurídicos.
c) Supongan una modificación de la normativa vigente.
d) No produzcan efectos jurídicos.

SOLUCIONES
3. D
4. B
5. B
`;

  const parsed = parseOfficialTestText(source, {
    code: "B1T4",
    slug: "b1t4-test-oficial",
    title: "Test oficial Transparencia",
  });

  const explanations = parsed.questions.map((question) => question.explanation);

  assert.equal(new Set(explanations).size, 3);
  assert.match(explanations[0], /artículo 37.*cinco años.*no renovable/i);
  assert.match(explanations[1], /Fiscal General del Estado.*proceso penal/i);
  assert.match(explanations[2], /artículo 7.*efectos jurídicos/i);
  assert.doesNotMatch(explanations[0], /obligaciones de publicidad activa.*Título I/i);
});

test("parseOfficialTestText distingue explicaciones cuando dos respuestas comparten el mismo literal", () => {
  const source = `
31. Indique la respuesta correcta:
a) Los datos personales que revelen la ideología, afiliación sindical, religión o creencias requieren consentimiento expreso y por escrito.
b) Los datos sobre origen racial, salud, vida sexual, datos genéticos o biométricos requieren consentimiento expreso o cobertura legal.
c) Ninguna de las respuestas anteriores es correcta.
d) Las respuestas a) y b) son correctas.

51. Señale la respuesta correcta sobre la Agenda 2030:
a) Los Objetivos de Desarrollo del Milenio se aprobaron en 2015 para Transformar nuestro mundo.
b) Transformar nuestro mundo: la Agenda 2030 fue aprobada por los Estados miembros de Naciones Unidas en 2015.
c) Las respuestas a) y b) son correctas.
d) Ninguna de las respuestas anteriores es correcta.

SOLUCIONES
31. D
51. C
`;

  const parsed = parseOfficialTestText(source, {
    code: "B1T4",
    slug: "b1t4-test-oficial-2",
    title: "Test oficial Transparencia 2",
  });

  const [proteccionDatos, agenda2030] = parsed.questions.map((question) => question.explanation);

  assert.notEqual(proteccionDatos, agenda2030);
  assert.match(proteccionDatos, /protección reforzada.*ideología/i);
  assert.match(agenda2030, /Agenda 2030.*2015.*Transformar nuestro mundo/i);
});

test("parseOfficialTestText prioriza la respuesta correcta frente a distractores al explicar B1T4", () => {
  const source = `
24. Señale la respuesta correcta respecto al Presidente del Consejo de Transparencia y Buen Gobierno, de conformidad con el art. 37 de la Ley 19/2013:
a) Será nombrado por un período no renovable de cuatro años mediante Real Decreto.
b) Las Cortes Generales deberán refrendar el nombramiento por mayoría absoluta.
c) Cesará en su cargo por separación acordada por el Gobierno entre otros motivos.
d) Todas las respuestas son correctas.

SOLUCIONES
24. C
`;

  const parsed = parseOfficialTestText(source, {
    code: "B1T4",
    slug: "b1t4-test-oficial-cese",
    title: "Test oficial Transparencia",
  });

  assert.match(parsed.questions[0].explanation, /cese.*separación acordada/i);
  assert.doesNotMatch(parsed.questions[0].explanation, /cinco años no renovable/i);
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

test("parseOfficialTestText ignora cabeceras temáticas incrustadas entre opciones", () => {
  const source = `
41. ¿Quién cesa a los Vicepresidentes del Gobierno?
a) El Rey, a propuesta del Presidente del Gobierno.
b) El Congreso de los Diputados.
c) El propio Vicepresidente.
d) El Consejo de Estado.

EL GOBIERNO

42. La acción del Gobierno la dirige y coordina:
a) El Presidente del Gobierno.
b) El Ministro de la Presidencia.
c) El Consejo de Ministros.
d) Las Cortes Generales.

SOLUCIONES
41. A
42. A
`;

  const parsed = parseOfficialTestText(source, {
    code: "B1T3",
    slug: "b1t3-test-oficial",
    title: "Test oficial Gobierno",
  });

  assert.equal(parsed.questions.length, 2);
  assert.equal(parsed.questions[0].options[3].label, "El Consejo de Estado.");
  assert.equal(parsed.questions[1].prompt, "La acción del Gobierno la dirige y coordina:");
});

test("parseOfficialTestText elimina cabeceras pegadas al final de una opción", () => {
  const source = `
1. ¿Qué sistema de ficheros no fue creado para Windows?
a) NTFS.
b) FAT32.
c) FAT16.
d) Ext2. B2T4test SISTEMAS OPERATIVOS

SOLUCIONES
1. D
`;

  const parsed = parseOfficialTestText(source, {
    code: "B2T4",
    slug: "b2t4-test-oficial",
    title: "Test oficial SSOO",
  });

  assert.equal(parsed.questions.length, 1);
  assert.equal(parsed.questions[0].options[3].label, "Ext2.");
  assert.match(parsed.questions[0].explanation, /Referencia del temario: B2T4/i);
});
