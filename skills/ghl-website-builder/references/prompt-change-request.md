# Mode: fix

Fixing or changing something in an existing GHL file. You've already read `platform-know-how.md`. Also check `references/issue-log.md` — many "something looks wrong" reports match a known symptom there.

## Inputs

Gather these from the conversation, or accept a pasted `INPUTS` block in this shape:

```
FILE_OR_PAGE*:
CHANGES*:
WHAT_I_SEE:
```

Fields marked `*` are required — if either is missing, stop and ask only for those before touching any code.

- `FILE_OR_PAGE`: which file or page to change (e.g. `02-global-header.html`, the services page).
- `CHANGES`: numbered list, each naming the section or element and what it should become.
- `WHAT_I_SEE`: what appears in GHL Preview, plus attached screenshots — ask for these if the report is a visual bug and none were attached. A description alone ("the header looks wrong") is rarely enough to diagnose against the CSS-scoping and full-width issues these builds are prone to; a screenshot usually resolves it in one pass instead of several guesses.

If you don't already have the current file's contents in this conversation, ask for it (or the current GHL Preview screenshots) rather than guessing what's there.

## What to do

Update that code. Keep everything else exactly the same and keep following `platform-know-how.md`. Check the symptom against `references/issue-log.md` first — most recurring GHL issues have a known cause and fix there, and re-deriving it from scratch risks missing the actual root cause (e.g. "boxed content" is almost always the full-width script missing or not re-run, not a CSS width bug).

## Output

1. The complete updated file in one code block (not a diff, not "...unchanged...").
2. A list of exactly what changed.
3. Confirmation that nothing else was modified.
