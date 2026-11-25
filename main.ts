// One-Line Laugh-Off entry (C14): a single funny line, 91 chars.
// Writes the entry to $MAKEFUN_OUTPUT_DIR/entry.txt and self-checks by read-back.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I tried to quit coffee, but my coffee maker filed a restraining order against my willpower.";
const EXPECTED_SHA256 =
  "7ff607758647d48eeec7a107d2c12fe905468a4414ddf80b436155d1ab00a519";
const EXPECTED_LENGTH = 91;

function sha256Hex(data: Buffer): string {
  return createHash("sha256").update(data).digest("hex");
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (!outDir) {
    throw new Error("MAKEFUN_OUTPUT_DIR is not set");
  }
  const entryBytes = Buffer.from(ENTRY, "utf-8");
  if (entryBytes.length < 1 || entryBytes.length > 200) {
    throw new Error(`entry length ${entryBytes.length} outside gate 1-200`);
  }
  if (ENTRY.trim().length === 0) {
    throw new Error("entry is whitespace-only");
  }
  if (ENTRY.includes("\n")) {
    throw new Error("entry must be a single line");
  }
  if (ENTRY !== ENTRY.trim()) {
    throw new Error("entry has leading or trailing whitespace");
  }
  if (entryBytes[entryBytes.length - 1] === 0x0a) {
    throw new Error("entry must not end with a newline");
  }
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, entryBytes);
  // Self-check by read-back.
  const back = readFileSync(outPath);
  if (!back.equals(entryBytes)) {
    throw new Error("read-back mismatch: entry.txt differs from ENTRY");
  }
  if (sha256Hex(back) !== EXPECTED_SHA256) {
    throw new Error("read-back sha256 mismatch");
  }
  if (back.length !== EXPECTED_LENGTH) {
    throw new Error(`read-back length ${back.length} != ${EXPECTED_LENGTH}`);
  }
  console.log(`wrote ${outPath} (${back.length} chars)`);
}

main();
