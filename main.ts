import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "The plane has landed, the seatbelt sign is still on, and a man is already standing in the aisle, hunched under the overhead bin like a question mark. He is going nowhere. The door is closed. We are all going nowhere, together, in the exact order we sat down, and he just wants to be first in line to stand still.";

const chars = [...ENTRY].length;
if (chars < 1 || chars > 400) {
  throw new Error(`entry must be 1 to 400 characters, got ${chars}`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (/[\u0000-\u001f\u007f]/.test(ENTRY)) {
  throw new Error("entry must not contain control characters");
}
if (ENTRY !== ENTRY.trim()) {
  throw new Error("entry must not have leading or trailing whitespace");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== ENTRY) {
  throw new Error("round-trip read-back does not match the entry");
}
if (Buffer.byteLength(roundTrip, "utf8") !== Buffer.byteLength(ENTRY, "utf8")) {
  throw new Error("round-trip byte length does not match the entry");
}
