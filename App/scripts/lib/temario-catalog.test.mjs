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

test("buildTemarioCatalog usa el temario principal y conserva pdfs complementarios del mismo tema", () => {
  const catalog = buildTemarioCatalog([
    "Bloque 3/Tema 1/B3T1_Modelo_ER 4.pdf",
    "Bloque 3/Tema 1/B3T1Test_ModeloER 1.pdf",
    "Bloque 3/Tema 1/B3T1Ejercicios_enunciados 1.pdf",
    "Bloque 3/Tema 1/B3T1Ejercicios_soluciones.pdf",
  ]);

  assert.equal(catalog.length, 1);
  assert.equal(catalog[0].sourceFilename, "Bloque 3/Tema 1/B3T1_Modelo_ER 4.pdf");
  assert.equal(catalog[0].relatedPdfFiles.length, 3);
  assert.deepEqual(catalog[0].relatedPdfFiles, [
    "Bloque 3/Tema 1/B3T1Ejercicios_enunciados 1.pdf",
    "Bloque 3/Tema 1/B3T1Ejercicios_soluciones.pdf",
    "Bloque 3/Tema 1/B3T1Test_ModeloER 1.pdf",
  ]);
});

test("buildTemarioCatalog conserva recursos auxiliares como sql dentro del mismo tema", () => {
  const catalog = buildTemarioCatalog([
    "Bloque 3/Tema 4/B3T4_Lenguajes_BD_SQL 1.pdf",
    "Bloque 3/Tema 4/B3T4Test_Lenguajes_BD_SQL 2.pdf",
    "Bloque 3/Tema 4/B3T4Ejercicios 1.pdf",
    "Bloque 3/Tema 4/B3T4_enunciado1 1.sql",
    "Bloque 3/Tema 4/B3T4Ejercicios_Batallas 1.sql",
  ]);

  assert.equal(catalog.length, 1);
  assert.equal(catalog[0].sourceFilename, "Bloque 3/Tema 4/B3T4_Lenguajes_BD_SQL 1.pdf");
  assert.deepEqual(catalog[0].relatedPdfFiles, [
    "Bloque 3/Tema 4/B3T4Ejercicios 1.pdf",
    "Bloque 3/Tema 4/B3T4Test_Lenguajes_BD_SQL 2.pdf",
  ]);
  assert.deepEqual(catalog[0].relatedResourceFiles, [
    "Bloque 3/Tema 4/B3T4_enunciado1 1.sql",
    "Bloque 3/Tema 4/B3T4Ejercicios_Batallas 1.sql",
  ]);
});

test("buildTemarioCatalog ignora esquemas pdf cuando existe un temario principal", () => {
  const catalog = buildTemarioCatalog([
    "Bloque 2/Tema 5/B2T5_SGBD 3.pdf",
    "Bloque 2/Tema 5/B2T5Test_SGBD 1.pdf",
    "Bloque 2/Tema 5/esquema_sgbd_3_paginas.pdf",
    "Bloque 2/Tema 5/Modelo_ACID_y_bases_de_datos_NoSQL.m4a",
  ]);

  assert.equal(catalog.length, 1);
  assert.equal(catalog[0].sourceFilename, "Bloque 2/Tema 5/B2T5_SGBD 3.pdf");
  assert.deepEqual(catalog[0].relatedPdfFiles, ["Bloque 2/Tema 5/B2T5Test_SGBD 1.pdf"]);
  assert.equal(catalog[0].podcasts.length, 1);
});
