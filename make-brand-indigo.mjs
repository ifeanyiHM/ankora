#!/usr/bin/env node
/**
 * Switches Ankora's brand colour from green to Adire indigo.
 *
 *   node make-brand-indigo.mjs --dry    shows what would change, writes nothing
 *   node make-brand-indigo.mjs          applies it
 *
 * Run it from the project root (the folder that contains `src/`). Safe to run twice.
 *
 * What it does
 *  - Renames the colour utilities everywhere: bg-green -> bg-brand, text-green-dark -> text-brand-dark, etc.
 *  - Keeps green for SUCCESS meanings (Paid / Active pills, "free delivery", the checkout tick) as a new
 *    `success` colour, so a "Paid" badge doesn't turn indigo.
 *  - Updates the colour tokens in globals.css, and the hard-coded #008751 in the logo, favicon and emails.
 *  - Makes keyboard-focus outlines visible on the dark sections (footer, admin sidebar, occasions carousel).
 */
import fs from "node:fs";
import path from "node:path";

const DRY = process.argv.includes("--dry");
const SRC = path.join(process.cwd(), "src");
if (!fs.existsSync(SRC)) {
  console.error("Run this from the project root (the folder that contains src/).");
  process.exit(1);
}

const COLORS = { main: "#1f2d7a", dark: "#141e5c", light: "#3f51c1", tint: "#eceefa" };
const SKIP_DIRS = new Set(["node_modules", ".next", "data"]);
const EXTS = new Set([".ts", ".tsx", ".css", ".svg"]);

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* walk(path.join(dir, entry.name));
    } else if (EXTS.has(path.extname(entry.name))) {
      yield path.join(dir, entry.name);
    }
  }
}

// ---- class utilities ---------------------------------------------------------------------------
const UTILITY = /\b(bg|text|border|ring|decoration|accent|outline|fill|stroke|from|via|to|divide|shadow|caret)-green(-dark|-light|-tint)?(?![\w-])/g;
const BRAND = { "": "brand", "-dark": "brand-dark", "-light": "brand-light", "-tint": "brand-tint" };
const SUCCESS = { "": "success", "-dark": "success", "-light": "success", "-tint": "success-tint" };

/** Is this string of classes a success/positive state rather than brand styling? */
function isSuccess(literal, file) {
  const name = path.basename(file);
  if (name === "CategoryRail.tsx") return false; // its tint pill is the active-category nav item: brand
  if (/\bbg-green-tint\b/.test(literal)) return true; // Paid / Active pills, "order updated" message
  if (name === "CartDrawer.tsx" && /\btext-green-dark\b/.test(literal)) return true; // "gets free delivery"
  if (name === "TrackOrderForm.tsx" && /\btext-green-dark\b/.test(literal)) return true; // payment "Paid"
  if (file.includes(path.join("checkout", "verify")) && /\btext-green\b/.test(literal)) return true; // payment-received tick
  return false;
}

function convertUtilities(text, file) {
  // Work string by string so success and brand uses can be told apart by their surrounding classes.
  return text.replace(/(["`])((?:\\.|(?!\1)[^\\\n])*)\1/g, (whole, quote, body) => {
    if (!/green/.test(body)) return whole;
    const sidebar = path.basename(file) === "Sidebar.tsx";
    const map = isSuccess(body, file) ? SUCCESS : BRAND;
    const next = body.replace(UTILITY, (_m, prefix, shade = "") => {
      if (sidebar && prefix === "bg" && shade === "") return "bg-brand-light"; // brighter, so it reads on the black sidebar
      return `${prefix}-${map[shade]}`;
    });
    return quote + next + quote;
  });
}

// ---- globals.css --------------------------------------------------------------------------------
function convertCss(text) {
  let out = text;
  const token = (name, value) => {
    out = out.replace(new RegExp(`--color-${name}\\s*:\\s*[^;]+;`), `--color-${name}: ${value};`);
  };
  out = out.replace(/--color-green(-dark|-light|-tint)?\s*:/g, (_m, shade = "") => `--color-brand${shade}:`);
  token("brand", COLORS.main);
  token("brand-dark", COLORS.dark);
  token("brand-light", COLORS.light);
  token("brand-tint", COLORS.tint);
  out = out.replace(/\/\*\s*Brand \(carried over from endsars\.online\)\s*\*\//, "/* Brand: Adire indigo */");
  out = out.replace(/var\(--color-green\)/g, "var(--color-brand)");
  out = out.replace(/rgb\(0 135 81 \/ ([\d.]+)\)/g, "rgb(99 118 235 / 0.22)"); // glow in the occasions background

  if (!/--color-success\s*:/.test(out)) {
    out = out.replace(/(--color-brand-tint\s*:[^;]+;)/, `$1

  /* Success / positive states (Paid, Active, free delivery). Stays green so it isn't confused with the indigo brand. */
  --color-success: #006b40;
  --color-success-tint: #e7f4ed;`);
  }
  if (!/\.bg-occasions :focus-visible/.test(out)) {
    out += `
/* Keyboard focus rings: the indigo outline disappears on dark sections, so use gold there. */
.bg-occasions :focus-visible,
footer :focus-visible,
aside :focus-visible { outline-color: var(--color-gold); }
`;
  }
  return out;
}

// ---- run ----------------------------------------------------------------------------------------
const changed = [];
for (const file of walk(SRC)) {
  const before = fs.readFileSync(file, "utf8");
  let after = before;
  if (path.extname(file) === ".css") after = convertCss(after);
  else if (path.extname(file) !== ".svg") after = convertUtilities(after, file);
  after = after.replace(/#008751/gi, COLORS.main); // logo, favicon, email templates, swatch fallbacks
  if (after !== before) {
    changed.push(path.relative(process.cwd(), file));
    if (!DRY) fs.writeFileSync(file, after);
  }
}

console.log(`${DRY ? "Would change" : "Changed"} ${changed.length} file(s):`);
changed.forEach((f) => console.log("  " + f));

// anything left over?
const left = [];
for (const file of walk(SRC)) {
  const text = fs.readFileSync(file, "utf8");
  text.split("\n").forEach((line, i) => {
    if (/\b(?:bg|text|border|ring|decoration|accent|outline|fill|stroke)-green|--color-green/.test(line)) left.push(`${path.relative(process.cwd(), file)}:${i + 1}  ${line.trim().slice(0, 110)}`);
  });
}
if (!DRY && left.length) {
  console.log("\nStill mentions green (check by hand):");
  left.forEach((l) => console.log("  " + l));
} else if (!DRY) {
  console.log("\nNo green utilities or tokens left. Done.");
}
