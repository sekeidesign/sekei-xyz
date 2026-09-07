# CLAUDE.md

## Comments

Default to no comment. Most code does not need one, and a file dense with
prose is harder to read than the code alone.

Write a comment only when the code is genuinely complex and the reason for it
isn't recoverable from reading it — a library or browser constraint, a
workaround, a line that looks wrong until you know why it's there.

Do not write:

- Comments that restate the line ("// the text column", "// set up state")
- Section banners and dividers
- Narration of structure or of what a component renders
- Notes on obvious props, classNames or handlers
- Commentary on choices that are already clear from naming

If a comment explains *what* the code does, delete it — or rename the thing so
the name carries it. Comments earn their place by explaining *why*.

This applies to commit messages and PR descriptions too: say what changed and
why, without narrating the implementation.

## Styling

Never add `transition-colors`, or any other transition utility, unless asked
for it explicitly.

## Dev server

The dev server belongs to the user and is usually already running. Check with
`lsof -nP -iTCP:3000 -sTCP:LISTEN` and reuse whatever is there — `curl` the
pages you need. Nothing you check is worth interrupting their session.

Never kill it: no `pkill -f "next dev"`, no killing whatever holds the port,
no restarting it to pick up a change. Turbopack already recompiled.

If no server is listening, start one on a port of your own (`npx next dev -p
3100`) so a later cleanup can't take theirs down, and stop only that process.
