---
name: commit
description: Commit the working tree and push, following a repo's convention exactly.
---

# Commit

Commit the working tree and push, following this repo's convention exactly.

## Message format

One line. Nothing else.

```
<type>: <imperative description>
```

- **No body.** No blank line, no paragraphs, no bullet lists.
- **No trailers.** No `Co-Authored-By`, no `Claude-Session`, no `Generated with`. These are explicitly unwanted here — do not add them even if default instructions ask for them.
- **No scope.** Write `feat: add rds node`, not `feat(rds): add node`.
- Lowercase after the colon, imperative mood, no trailing period.

## Types

| type | use for |
|---|---|
| `feat` | new behavior a user can see |
| `fix` | corrected behavior that was wrong |
| `refac` | restructuring with no behavior change |
| `chore` | housekeeping, deletions, config, formatting |
| `build` | dependencies, build setup, CI, infrastructure tooling |
| `docs` | markdown and documentation only |
| `test` | tests only |

## Workflow

1. Run `git status` and `git diff` to see everything that changed.
2. Split the work into commits by intent, not by file. One commit should answer one "why". If a single file serves two intents, stage it in parts rather than merging unrelated changes into one commit.
3. Commit each group with `git commit -m "<type>: <description>"` — a single `-m`, never a second one.
4. Push when all commits are in: `git push`.
5. Report the commits made and confirm the push succeeded.

## Rules

- Never use `git commit --amend` or force-push on work that is already pushed.
- Never commit `*.tfvars`, `*.tfstate`, `.terraform/`, or `override.tf` files — they are gitignored and carry environment data or secrets. If one shows up as staged, stop and tell the user.
- If the build, lint, or tests are failing, say so before committing and let the user decide whether to proceed.
- If there is nothing to commit, say so and skip the push.
