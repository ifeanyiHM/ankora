#!/usr/bin/env node
/**
 * Updates Ankora's brand colour to the new forest green (#163D2A).
 *
 *   node make-brand-green.mjs --dry    shows what would change, writes nothing
 *   node make-brand-green.mjs          applies it
 *
 * Run it from the project root (the folder that contains src/).
 * Safe to run twice.
 * The occasions section keeps its separate --color-adire tokens.
 */
import fs from "node:fs";
import path from "node:path";

const DRY = process.argv.includes("--dry");
const SRC = path.join(process.cwd(), "src");

if (!fs.existsSync(SRC)) {
  console.error(
    "Run this from the project root (the folder that contains src/).",
  );
  process.exit(1);
}

const GREEN = {
  main: "#163D2A",
  dark: "#0D2B1D",
  light: "#28563F",
  tint: "#E8EFEA",
};

const SKIP_DIRS = new Set(["node_modules", ".next", "data"]);
const EXTS = new Set([".ts", ".tsx", ".css", ".svg"]);

const ORIGINAL_LOGO = `import { cn } from "@/lib/cn";

/** Ankora mark: an "A" whose apex carries an anchor ring and whose crossbar is a line of stitches. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("size-9", className)} aria-hidden="true">
      <rect width="40" height="40" rx="10" fill="#163D2A" />
      <circle cx="20" cy="9.6" r="2.6" fill="none" stroke="#fff" strokeWidth="1.8" />
      <path d="M11.5 31 20 13l8.5 18" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.4 24.6h11.2" stroke="#D4A017" strokeWidth="2.4" strokeDasharray="2.4 2" />
    </svg>
  );
}

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className={cn("text-[1.4rem] font-bold leading-none tracking-tight", light ? "text-white" : "text-ink")}>Ankora</span>
    </span>
  );
}
`;

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) {
        yield* walk(path.join(dir, entry.name));
      }
    } else if (EXTS.has(path.extname(entry.name))) {
      yield path.join(dir, entry.name);
    }
  }
}

const UTILITY =
  /\b(bg|text|border|ring|decoration|accent|outline|fill|stroke|from|via|to|divide|shadow|caret)-(brand(?:-dark|-light|-tint)?|success(?:-tint)?)(?![\w-])/g;

function convertUtilities(text, file) {
  const sidebar = path.basename(file) === "Sidebar.tsx";
  const verify = file.includes(path.join("checkout", "verify"));

  return text.replace(
    /(["`])((?:\\.|(?!\1)[^\\\n])*)\1/g,
    (whole, quote, body) => {
      if (!/brand|success/.test(body)) return whole;

      const next = body.replace(UTILITY, (match, prefix, name) => {
        if (name === "brand-light") {
          return sidebar ? `${prefix}-green` : `${prefix}-green-light`;
        }

        if (name === "brand") return `${prefix}-green`;
        if (name === "brand-dark") return `${prefix}-green-dark`;

        if (name === "brand-tint" || name === "success-tint") {
          return `${prefix}-green-tint`;
        }

        if (prefix === "text") {
          return verify ? "text-green" : "text-green-dark";
        }

        return `${prefix}-green`;
      });

      return quote + next + quote;
    },
  );
}

function convertCss(text) {
  let out = text;

  out = out.replace(
    /--color-brand(-dark|-light|-tint)?\s*:/g,
    (match, shade = "") => `--color-green${shade}:`,
  );

  const token = (name, value) => {
    out = out.replace(
      new RegExp(`--color-${name}\\s*:\\s*[^;]+;`),
      `--color-${name}: ${value};`,
    );
  };

  token("green", GREEN.main);
  token("green-dark", GREEN.dark);
  token("green-light", GREEN.light);
  token("green-tint", GREEN.tint);

  out = out.replace(/\/\*\s*Brand: Adire indigo\s*\*\//, "/* Brand */");

  out = out.replace(/var\(--color-brand\)/g, "var(--color-green)");

  out = out.replace(/rgb\(99 118 235\s*\/\s*[\d.]+\)/g, "rgb(22 61 42 / 0.2)");

  out = out.replace(
    /\n\n\s*\/\* Success \/ positive states[\s\S]*?--color-success-tint\s*:[^;]+;/,
    "",
  );

  out = out.replace(
    /\n\/\* Keyboard focus rings: the indigo outline[\s\S]*?outline-color: var\(--color-gold\); \}\n/,
    "",
  );

  return out;
}

const changed = [];

for (const file of walk(SRC)) {
  const before = fs.readFileSync(file, "utf8");
  let after = before;
  const ext = path.extname(file);

  if (
    path.basename(file) === "Logo.tsx" &&
    file.includes(path.join("components", "brand")) &&
    /onDark/.test(before)
  ) {
    after = ORIGINAL_LOGO;
  } else {
    if (ext === ".css") {
      after = convertCss(after);
    } else if (ext !== ".svg") {
      after = convertUtilities(after, file);
    }

    after = after
      .replace(/#008751/gi, GREEN.main)
      .replace(/#006b40/gi, GREEN.dark)
      .replace(/#00a86b/gi, GREEN.light)
      .replace(/#e7f4ed/gi, GREEN.tint)
      .replace(/#1f2d7a/gi, GREEN.main)
      .replace(/#3f51c1/gi, GREEN.light);
  }

  if (after !== before) {
    changed.push(path.relative(process.cwd(), file));

    if (!DRY) {
      fs.writeFileSync(file, after);
    }
  }
}

console.log(
  changed.length
    ? `${DRY ? "Would change" : "Changed"} ${changed.length} file(s):`
    : "Nothing to change: the project already uses the new brand green.",
);

changed.forEach((file) => console.log("  " + file));

if (!DRY) {
  const left = [];

  for (const file of walk(SRC)) {
    fs.readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, i) => {
        if (
          /\b(?:bg|text|border|ring|decoration|accent|outline|fill|stroke)-(?:brand|success)|--color-(?:brand|success)|#1f2d7a|#008751|#006b40|#00a86b|#e7f4ed/i.test(
            line,
          )
        ) {
          left.push(
            `${path.relative(process.cwd(), file)}:${i + 1}  ${line.trim().slice(0, 110)}`,
          );
        }
      });
  }

  if (left.length) {
    console.log("\nStill mentions old brand/success colours (check by hand):");
    left.forEach((line) => console.log("  " + line));
  } else if (changed.length) {
    console.log("\nUpdated to the new forest green. Done.");
  }
}
