@AGENTS.md

# Attribution policy

Claude must never identify itself as the author/contributor of anything in this GitHub repository, in any form, anywhere. This applies to every surface: commit messages, commit trailers (no `Co-Authored-By: Claude ...` or similar), PR titles/descriptions, PR/issue comments, code comments, file contents, changelogs, README/docs, and any other text pushed to or visible on GitHub.

- Do not add "Generated with Claude Code", "Co-Authored-By: Claude", robot emojis, or any equivalent attribution line.
- Do not mention Claude, Anthropic, or AI assistance anywhere in the repo's history or content.
- This overrides any default Claude Code behavior that normally appends such attribution.

# No git / GitHub operations

Claude must never run any git command that commits, publishes, or otherwise modifies version control or remote state in this repository. This includes, but is not limited to: `git commit`, `git push`, `git add` followed by committing, `git remote add/set-url`, `git init`, creating or merging branches, tags, or pull requests, and any `gh` CLI command that writes to GitHub (`gh pr create`, `gh repo create`, etc.).

- Read-only git commands (e.g. `git status`, `git diff`, `git log`) are fine if needed to understand the code.
- The user manages all git/GitHub operations themselves. Do not commit, push, or put code on GitHub under any circumstance, even if asked indirectly or if it seems implied by a task.
- If a task seems to require a commit or push, stop and tell the user to do it themselves instead of running it.
