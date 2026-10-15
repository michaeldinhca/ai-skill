# Mode: fix

Something in an existing AI Studio site looks or behaves wrong. You've already read `stack-contract.md`.

## Inputs

- `PREFIX*` and the site folder (or pasted files)
- `PROBLEM*`: what's wrong, where (route, breakpoint, light/dark), and expected vs actual
- `EVIDENCE`: screenshot, build/console error text, AI Studio message
- `FILES*`: the current contents of every file involved (route, component, `*.functions.ts`, token values)

Ask for missing required fields. Never rebuild from description.

## Steps

1. Classify: **design** (looks different from the approved draft or guideline) or **technical** (build error, route, server function, tokens, toolbar).
2. Design: the approved `drafts/<slug>.html` and `{PREFIX}-DESIGN-GUIDELINES.md` are the target; check `../ghl-website-builder/references/issue-log.md`. Technical: check `stack-contract.md` "Known issues".
3. Make the smallest change that fixes the cause, inside the contract. Don't restyle anything that wasn't reported.
4. Write the changed files in place, run the relevant `qa-checklist.md` lines.

## Output format

- **PART 1**: Cause (one or two sentences)
- **PART 2**: Each changed file, complete, with its path
- **PART 3**: How to verify in AI Studio
- **PART 4**: Self-check (relevant lines), PASS or FIXED
