import test from "node:test";
import assert from "node:assert/strict";
import { getWorkspaceContext, workspaceLinks } from "./workspace-navigation.mjs";

test("la navegación reconoce la sección activa incluso en temas y tests anidados bajo la ruta de GitHub Pages", () => {
  const base = "/AprobarApp/";
  assert.equal(getWorkspaceContext(base, base).active, "home");
  assert.equal(getWorkspaceContext(`${base}temarios/b3t6-java-net/`, base).active, "temarios");
  assert.deepEqual(getWorkspaceContext(`${base}temarios/b3t6-java-net/tests/java-control/`, base), { active: "tests", label: "Sesión de estudio", kind: "quiz" });
  assert.equal(getWorkspaceContext(`${base}temarios/b3t7/oficiales/test/`, base).kind, "quiz");
  assert.equal(getWorkspaceContext(`${base}simulacros/simulacro-4/`, base).active, "simulacros");
  assert.equal(getWorkspaceContext("/cuaderno/", "/").active, "cuaderno");
  assert.equal(new Set(workspaceLinks.map((link) => link.id)).size, 8);
  assert.ok(workspaceLinks.every((link) => link.label && link.icon && link.group));
});
