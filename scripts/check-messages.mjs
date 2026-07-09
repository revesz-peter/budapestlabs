// Verifies en/hu/de message files have identical keys and array lengths.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const locales = ["en", "hu", "de"];

const flatten = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([k, v]) =>
    typeof v === "object" && v !== null && !Array.isArray(v)
      ? flatten(v, `${prefix}${k}.`)
      : [[`${prefix}${k}`, Array.isArray(v) ? `array:${v.length}` : "value"]]
  );

const maps = Object.fromEntries(
  locales.map((l) => [
    l,
    Object.fromEntries(
      flatten(JSON.parse(readFileSync(join(root, "src/messages", `${l}.json`), "utf8")))
    ),
  ])
);

let failed = false;
const base = maps[locales[0]];
for (const locale of locales.slice(1)) {
  const other = maps[locale];
  for (const key of Object.keys(base)) {
    if (!(key in other)) {
      console.error(`${locale}.json missing key: ${key}`);
      failed = true;
    } else if (base[key] !== other[key]) {
      console.error(`${locale}.json shape mismatch at ${key}: ${base[key]} vs ${other[key]}`);
      failed = true;
    }
  }
  for (const key of Object.keys(other)) {
    if (!(key in base)) {
      console.error(`${locale}.json extra key: ${key}`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log(`Messages in sync across: ${locales.join(", ")}`);
