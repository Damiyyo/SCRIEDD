// One-off: prefix page-specific stylesheets with :where(.pg-<name>) so they only apply on their own page.
// :where() adds zero specificity, so the cascade matches the original per-page <link> loading exactly.
import postcss from "postcss";
import fs from "node:fs";
const [,, src, name, out] = process.argv;
const css = fs.readFileSync(src, "utf8");
const scope = `:where(.pg-${name})`;
const plugin = {
  postcssPlugin: "scope",
  Rule(rule) {
    let p = rule.parent;
    while (p) { if (p.type === "atrule" && /keyframes$/i.test(p.name)) return; p = p.parent; }
    if (rule.__done) return; rule.__done = true;
    rule.selectors = rule.selectors.map((s) => `${scope} ${s}`);
  }
};
const res = await postcss([plugin]).process(css, { from: undefined });
fs.writeFileSync(out, res.css);
