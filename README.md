# AI Skill

Reusable [Claude Code](https://claude.com/claude-code) skills — packaged workflows so a proven approach doesn't have to be re-explained in every chat.

## Skills

- [`skills/ghl-website-builder`](skills/ghl-website-builder/SKILL.md) — build, extend, or fix a client website in GoHighLevel (GHL) using a tested 4-layer architecture that survives GHL's platform quirks (boxed content width, theme CSS bleed, an editor canvas that doesn't run JS, iframe form embeds). Three modes: `new-site`, `new-page`, `fix`.

## Using a skill from this repo

**Per-project** — clone or copy the skill folder into the project's `.claude/skills/`:

```
git clone https://github.com/michaeldinhca/ai-skill.git
cp -r ai-skill/skills/ghl-website-builder /path/to/project/.claude/skills/
```

**Available everywhere** — copy it into your personal skills folder instead:

```
cp -r ai-skill/skills/ghl-website-builder ~/.claude/skills/
```

Claude Code picks up any `SKILL.md` under a `skills/` directory automatically; invoke with `/ghl-website-builder` or just describe the task (e.g. "build a new GHL site for Acme Plumbing") and it triggers on its own.

## Adding a new skill

Create `skills/<skill-name>/SKILL.md` with YAML frontmatter (`name`, `description`, optionally `argument-hint`), keep the body under ~500 lines, and push large supporting material into `skills/<skill-name>/references/` (loaded on demand rather than every invocation). See Anthropic's [Agent Skills](https://docs.claude.com/en/docs/claude-code/skills) docs for the format.
