import test from "node:test";
import assert from "node:assert/strict";

import { buildTemarioCatalog } from "./temario-catalog.mjs";

test("buildTemarioCatalog agrupa pdf y podcast dentro de la carpeta del tema", () => {
  const catalog = buildTemarioCatalog([
    "Bloque 1/Tema 1/B1T1_CE_subrayado 1.pdf",
    "Bloque 1/Tema 1/Claves_de_la_Constitucion_para_opositores.m4a",
    "Bloque 2/Tema 3/B2T3_Estructuras_de_datos_subrayado 1.pdf",
  ]);

  assert.equal(catalog.length, 2);
  assert.equal(catalog[0].code, "B1T1");
  assert.equal(catalog[0].sourceFilename, "Bloque 1/Tema 1/B1T1_CE_subrayado 1.pdf");
  assert.equal(catalog[0].podcasts.length, 1);
  assert.equal(catalog[0].podcasts[0].sourceFilename, "Bloque 1/Tema 1/Claves_de_la_Constitucion_para_opositores.m4a");
  assert.equal(catalog[1].code, "B2T3");
  assert.equal(catalog[1].podcasts.length, 0);
});

test("buildTemarioCatalog mantiene temas separados si llegan pdfs sueltos en raiz", () => {
  const catalog = buildTemarioCatalog([
    "B1T1_CE_subrayado 1.pdf",
    "B2T3_Estructuras_de_datos_subrayado 1.pdf",
  ]);

  assert.equal(catalog.length, 2);
  assert.deepEqual(
    catalog.map((topic) => topic.code),
    ["B1T1", "B2T3"],
  );
});

test("buildTemarioCatalog prioriza el pdf actualizado frente al subrayado dentro del mismo tema", () => {
  const catalog = buildTemarioCatalog([
    "Bloque 1/Tema 1/B1T1_CE_subrayado 1.pdf",
    "Bloque 1/Tema 1/B1T1_CE 6.pdf",
    "Bloque 1/Tema 1/Claves_de_la_Constitucion_para_opositores.m4a",
  ]);

  assert.equal(catalog.length, 1);
  assert.equal(catalog[0].sourceFilename, "Bloque 1/Tema 1/B1T1_CE 6.pdf");
  assert.equal(catalog[0].title, "B1T1 CE");
});
