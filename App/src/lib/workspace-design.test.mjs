import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const css = fs.readFileSync(new URL("../styles/redesign.css", import.meta.url), "utf8");
const luminance = (hex) => {
  const [r, g, b] = hex.slice(1).match(/../g).map((value) => parseInt(value, 16) / 255).map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
};

test("los textos y acciones del nuevo diseño mantienen contraste AA en claro y oscuro", () => {
  for (const mode of ["light", "dark"]) {
    const block = css.match(new RegExp(':root\\[data-theme="' + mode + '"\\] \\{([^}]+)'))[1];
    const tokens = Object.fromEntries([...block.matchAll(/--([\w-]+): (#[0-9a-f]{6});/g)].map((match) => [match[1], match[2]]));
    for (const [foreground, background] of [["text", "surface"], ["text-soft", "surface"], ["text-soft", "bg"], ["text-soft", "sidebar-bg"], ["button-primary-text", "accent"], ["hero-text", "hero-ink"]]) {
      const values = [luminance(tokens[foreground]), luminance(tokens[background])].sort((a, b) => b - a);
      const contrast = (values[0] + 0.05) / (values[1] + 0.05);
      assert.ok(contrast >= 4.5, `${mode}: ${foreground} sobre ${background} tiene contraste ${contrast.toFixed(2)}`);
    }
  }
});
