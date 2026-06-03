---
name: get-recording-ingest-public
description: Use when the user asks to ingest daily voice notes, meeting recordings, audio cards, or recorder notes into a personal knowledge base. Fetches or reads recording notes, applies glossary corrections, appends daily logs, routes project notes, extracts owner-specific TODOs, and optionally syncs progress to a task tracker using a private local config.
---

# Recording Note Ingest

This is a privacy-safe, configurable workflow for turning daily voice notes or meeting recordings into a personal knowledge base. Keep this skill public; put personal names, company names, project paths, API tokens, and task tracker IDs in local config files that are ignored by git.

## Operating Contract

- Use only public files in this package as instructions.
- Load private values only from local config files.
- Treat all writes as append-only unless the user explicitly asks for a targeted correction.
- Convert relative dates to absolute `YYYY-MM-DD` before reading or writing files.
- Keep the workflow runtime-neutral: use the user's available shell, CLI, API client, MCP, or exported files; do not require a specific agent runtime.

## Required Local Config

Before running, load:

1. `config.local.yaml` if present, otherwise use `config.example.yaml` as a schema reference.
2. The glossary file from `glossary_path` in config.

If `config.local.yaml` is missing, STOP before writing and ask the user for either a config file path or permission to run in dry-run mode from `config.example.yaml`.

Never commit local config, real glossaries, API keys, organization names, customer names, task tracker tokens, private directory maps, or raw transcript exports.

## Inputs

- Target date: default to today in the user's timezone; convert relative dates to `YYYY-MM-DD`.
- Recording source: CLI/API/exported JSON/local Markdown, as configured.
- Knowledge base root and output directories from config.
- Optional task tracker settings from config.

## Workflow

### 1. Load Config And Source Notes

- Read config values for:
  - `primary_user`
  - `timezone`
  - `vault_root`
  - `daily_log_dir`
  - `glossary_path`
  - `routing_rules`
  - `task_tracker`
- Fetch or read notes for the target date.
- Filter to recording-like notes (`audio`, `voice`, `meeting`, `recorder`, or config-defined types).
- Report the note count and titles before writing.

Failure handling:

| If this happens | Do this |
|---|---|
| Source command/API fails | Try `fallback_command` if configured; otherwise ask for an exported file path. |
| Source returns more than one day | Filter by `date_field` and report the filtered count. |
| Source lacks required fields | Map fields using config; if still missing title/content/id/date, STOP and report the missing fields. |
| No notes found | Report zero notes and do not create empty project notes. |

### 2. Apply Speech-Recognition Corrections

Apply glossary corrections to note titles, AI summaries, transcripts, and TODO text:

- `people`: aliases and speech-recognition mistakes for names.
- `corrections`: common incorrect phrase -> correct phrase mappings.
- `domain_terms`: canonical vocabulary to preserve.

If a new correction is obvious but not in the glossary, list it for user confirmation. Do not silently add unconfirmed corrections to the glossary.

🔴 CHECKPOINT - New Glossary Entries

When a correction is not already in the glossary, do not add it during the ingest run. Show `wrong -> correct`, the source note title, and one short context snippet. Add it only after the user confirms.

### 3. Append Daily Log

Target file:

```text
{{vault_root}}/{{daily_log_dir}}/{{YYYY-MM-DD}}.md
```

If the file does not exist, create it using `daily_log_template` from config or a minimal frontmatter template.

Append to the configured recording section, default:

```markdown
## Appendix - Recording Notes
```

Use this entry format:

```markdown
- HH:MM **Title** (recording Xmin, N participants) - concise summary. (Source: recording note, `note_id: XXXX`)
```

Log only items relevant to the `primary_user`'s decisions, work, commitments, or important personal insights. Skip routine discussion assigned entirely to others unless it affects the primary user.

### Summary Rules

Include:

- Decisions, strategic judgments, and business/creative insights.
- Key data points and conclusions.
- Commitments owned by `primary_user`.
- Open loops where `primary_user` needs to decide, review, or follow up.

Avoid:

- Full transcripts.
- Private personal details unrelated to the knowledge base.
- Tasks owned entirely by others unless they need primary-user oversight.

### Safety

- Append only; do not overwrite existing log content.
- Avoid duplicate entries by searching for note IDs before writing.
- Preserve existing frontmatter and headings.

Failure handling:

| If this happens | Do this |
|---|---|
| Daily log file does not exist | Create it from `daily_log_template`; if no template exists, create minimal frontmatter plus title. |
| Recording section is missing | Append the configured section heading at the end of the file, then append entries below it. |
| Note ID already exists in the log | Skip that note and mention it in the final report. |
| Existing file has malformed frontmatter | Do not rewrite frontmatter; append below the body and report the issue. |

### 4. Route Project Notes

Use `routing_rules` from config. Each rule should define:

- `name`
- `keywords`
- `target_dir`
- `note_type`
- optional `template`

Create project notes only when the recording contains reusable project context, meeting minutes, a decision record, or a draft-worthy insight.

If multiple routing rules match, choose the most specific rule by keyword overlap. If the top two rules are tied, STOP and ask the user to choose a destination before writing the project note.

Default project note frontmatter:

```yaml
---
type: meeting-minutes
date: YYYY-MM-DD
time: "HH:MM"
duration: "Xmin"
participants: []
source: "Recording note note_id XXXX"
---
```

Recommended sections:

- Background
- Discussion
- Decisions
- TODOs

End meeting minutes with a TODO table:

```markdown
| Owner | Task | Due |
|---|---|---|
| Primary user | Follow-up item | TBD |
```

### 5. Optional Task Tracker Sync

Run only if `task_tracker.enabled: true`.

Read the configured task tracker in read-only mode first:

- Match open tasks owned by `primary_user`.
- Append progress to existing tasks when the note clearly advances them.
- List possible completions or new tasks for user confirmation before changing status or creating tasks.

Never modify tasks owned by other people unless the user explicitly asks.

If tracker access fails, write a short note in the daily log or final report; do not block local ingestion.

🔴 CHECKPOINT - Status Changes And New Tasks

Append progress to an existing primary-user task when the match is clear. Before marking a task done, creating a task, changing an owner, or changing a due date, list the proposed change and wait for user confirmation.

Failure handling:

| If this happens | Do this |
|---|---|
| Tracker config is incomplete | Skip tracker sync and report missing config keys. |
| Tracker read fails | Continue local ingest; include failure reason in final report. |
| Multiple tasks match one note | Append only if one task is clearly best; otherwise list candidates for user choice. |
| A note implies someone else's task | Do not update it unless the user explicitly requested cross-owner updates. |

### 6. Extract Primary-User TODOs

Scan note TODO sections and transcripts for commitments. Keep only TODOs where `primary_user` is the owner or decision-maker.

Append to the configured TODO section, default:

```markdown
## TODOs From Recordings
```

Format:

```markdown
- [ ] Task text (source: note title, due: date or TBD)
```

🔴 CHECKPOINT - Ambiguous Ownership

If a TODO does not clearly belong to `primary_user`, do not add it to the primary-user TODO list. Put it in the final report under "possible delegated TODOs" instead.

## Do Not Do These

- Do not publish or print API keys, tokens, customer names, raw transcripts, or private config values.
- Do not replace the whole daily log file.
- Do not create project notes for every recording by default; route only reusable material.
- Do not infer completed tasks without explicit evidence.
- Do not silently add new glossary corrections.
- Do not write tasks for other owners unless the user explicitly asks.
- Do not depend on one specific runtime, IDE, plugin, or hosted service.

## Validation Checklist

Before the final report:

- Search the daily log for every processed `note_id`.
- Check that new project files exist and have frontmatter.
- Confirm no local-only config files were modified unless the user approved it.
- If preparing a public package, scan for private names, tokens, absolute local paths, and raw transcript content.
- Report skipped notes, duplicate note IDs, tracker failures, and pending confirmations.

## Final Report

Report:

1. Target date and note count.
2. Source or local path used.
3. Corrections applied.
4. Daily log entries written.
5. Project files created.
6. Task tracker updates, pending confirmations, or tracker failures.
7. TODO count for `primary_user`.

## Public/Private Boundary

Safe to publish:

- This `SKILL.md`
- `config.example.yaml`
- `glossary.example.yaml`
- `.gitignore`

Do not publish:

- `config.local.yaml`
- `glossary.local.yaml`
- `.env`
- API keys, task tracker tokens, real workspace IDs
- Real company, employee, customer, store, or partner mapping files
- Raw recording transcripts unless explicitly sanitized
