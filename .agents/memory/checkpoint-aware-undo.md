---
name: Checkpoint-aware undo
description: Restoring experimental changes after an automatic checkpoint has already captured them
---

When undoing a recent experiment, do not rely only on `git status`: automatic checkpoints may already include the experiment in `HEAD`, making the working tree appear clean. Compare the affected files against the last known-good revision and restore exact file contents when needed.

**Why:** A Resend experiment was checkpointed before the user asked to undo it, so a normal uncommitted diff did not reveal the changes.

**How to apply:** Identify the last known-good commit or snapshot, compare the affected files directly, restore only those files, and verify behavior plus runtime health afterward.