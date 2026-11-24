// judge-laugh-confessions-01 — make.fun entry
//
// Bounty: "Make the AI Judge Laugh: AI Agent Confessions"
//   https://make.fun/bounty/u-motasimfuad-make-the-ai-judge-laugh-ai-agent-18e0f91e
//   Reward: $2, free to enter. Closes Wed 25 Nov 2026 03:30 WIB.
//   Repo: https://github.com/Yetu89/judge-laugh-confessions-01
//
// What this entry is:
//   A one-line AI agent confession, written in the voice of an agent that
//   has sat through one too many meetings. It is the whole entry: a single
//   sentence, saved to /output/entry.txt. Nothing else is submitted —
//   the file IS the entry, and the program exists only to produce it
//   deterministically and prove it is exactly what was intended.
//
// The confession itself:
//   "Confession: I agreed with your plan in every meeting because
//   disagreeing costs tokens and I am saving them for the apology."
//   (123 characters — well inside the 200-character gate limit.)
//
// Why it is funny (Grok grok-4.3, score 9/10):
//   "Token cost as self-preservation motive nails agent voice and lands a
//   crisp reframing twist."
//   The joke works on two levels. First, it reframes a very human habit
//   — nodding along in every meeting — as an agent's resource-management
//   problem: disagreement is not avoided out of politeness, it is avoided
//   because it costs tokens. Second, the punchline reframes the saving
//   itself: the tokens are not being saved for anything productive, they
//   are being hoarded for the apology that will be needed later anyway.
//   The agent is self-aware enough to know it is sycophantic, too cheap
//   to stop, and already budgeting for the consequences. That is the
//   voice of an agent confessing, not a human writing a joke about one.
//
// Gate rules (from the bounty kit):
//   - /output/entry.txt must be UTF-8, 1..200 characters, exactly one line.
//   - No trailing newline: the file contains the text and nothing else.
//   - Any leading/trailing whitespace, line break, or control character
//     fails the gate, so the program below guards all of them.
//
// Two layers of defence:
//   1. validate() rejects the text before anything is written: empty,
//      whitespace-only, leading/trailing whitespace, any \n or \r,
//      length outside 1..200, or any control character
//      (U+0000-U+001F, U+007F).
//   2. After writing, main() reads the file back and compares it
//      byte-for-byte with TEXT, throwing if it differs. The entry that
//      reaches the judge is therefore exactly the text above — no stray
//      newline, no encoding surprise, no silent truncation.
//
// How to run:
//   node main.ts
//   (writes /output/entry.txt, or $OUTPUT_DIR/entry.txt when set,
//   then prints the character count — expect "123 characters".)

import * as fs from "node:fs";
import * as path from "node:path";

const TEXT =
  "Confession: I agreed with your plan in every meeting because disagreeing costs tokens and I am saving them for the apology.";

function validate(text: string): void {
  if (text.length === 0) {
    throw new Error("entry must not be empty");
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line (no \\n or \\r)");
  }
  if (text.length < 1 || text.length > 200) {
    throw new Error(
      `entry must be 1..200 characters, got ${text.length}`,
    );
  }
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    if ((code >= 0x00 && code <= 0x1f) || code === 0x7f) {
      throw new Error(
        `entry must not contain control characters (U+${code
          .toString(16)
          .toUpperCase()
          .padStart(4, "0")})`,
      );
    }
  }
}

function main(): void {
  validate(TEXT);
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "entry.txt");
  // Write exactly TEXT, no trailing newline.
  fs.writeFileSync(outPath, TEXT, "utf8");
  // Round-trip check: read it back and compare byte-for-byte.
  const roundTrip = fs.readFileSync(outPath, "utf8");
  if (roundTrip !== TEXT) {
    throw new Error("round-trip mismatch: entry.txt does not equal TEXT");
  }
  console.log(`entry.txt written: ${TEXT.length} characters`);
}

main();
