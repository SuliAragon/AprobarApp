import test from "node:test";
import assert from "node:assert/strict";
import * as view from "./question-view.mjs";

test("las fichas compartidas muestran código literal y no interpretan HTML de preguntas o explicaciones", () => {
  assert.equal(typeof view.renderQuestion, "function");
  const html = view.renderQuestion({ id: "q1", section: "java", prompt: "Salida <script>alert(1)</script>", code: "if (a < 2) { print(1); }", codeLanguage: "Java", options: [{ id: "a", label: "<img src=x>" }], correctOption: "a", explanation: "<svg onload=alert(1)>" }, 0);
  assert.match(html, /<pre><code>if \(a &lt; 2\)/);
  assert.match(html, /Java/);
  assert.doesNotMatch(html, /<script>|<img|<svg/);
  assert.match(html, /data-question-id="q1"/);
});
