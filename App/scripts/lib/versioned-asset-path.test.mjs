import test from "node:test";
import assert from "node:assert/strict";

import { buildVersionedAssetPath } from "../../src/utils/versioned-asset-path.ts";

test("buildVersionedAssetPath añade una versión derivada del fichero fuente", () => {
  const result = buildVersionedAssetPath("/temario/b2t3-estructuras-de-datos.pdf", "Bloque 2/Tema 3/B2T3_Estructuras_de_datos 1.pdf");

  assert.equal(result, "/temario/b2t3-estructuras-de-datos.pdf?v=Bloque%202%2FTema%203%2FB2T3_Estructuras_de_datos%201.pdf");
});
