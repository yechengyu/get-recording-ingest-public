# Recording Note Ingest Skill

[中文文档](README.zh-CN.md)

A privacy-safe Agent Skill for turning daily voice notes, meeting recordings, and audio cards into a structured personal knowledge base.

It helps an agent:

- read or fetch recording notes for a target date
- apply speech-recognition glossary corrections
- append daily log entries
- route reusable project notes into project folders
- extract TODOs owned by the primary user
- optionally sync progress to a task tracker through private local config

The repository contains only public workflow instructions and example configuration. Your real people, company, project paths, API tokens, task tracker IDs, and raw transcripts belong in ignored local files.

## Install With npm

Install into a skills directory with `npx`:

```bash
npx --yes --package github:yechengyu/get-recording-ingest-public install-recording-ingest-skill ./skills/get-recording-ingest-public
```

Use any destination supported by your agent runtime:

```bash
npx --yes --package github:yechengyu/get-recording-ingest-public install-recording-ingest-skill /path/to/your/skills/get-recording-ingest-public
```

The installer copies only the public skill files:

```text
SKILL.md
README.md
README.zh-CN.md
config.example.yaml
glossary.example.yaml
.gitignore
```

It does not create or copy `config.local.yaml`, `glossary.local.yaml`, raw exports, transcripts, or secrets.

## Files

```text
.
├── SKILL.md
├── README.md
├── README.zh-CN.md
├── config.example.yaml
├── glossary.example.yaml
├── package.json
├── bin/install.mjs
└── .gitignore
```

- `SKILL.md`: the agent-facing workflow.
- `README.md`: English documentation.
- `README.zh-CN.md`: Chinese documentation.
- `config.example.yaml`: schema and placeholder values for local setup.
- `glossary.example.yaml`: example speech-recognition correction glossary.
- `bin/install.mjs`: npm installer for copying public skill files into a target skills directory.
- `.gitignore`: excludes local config, raw exports, transcripts, and private files.

## Local Setup

After installation, create private local config files in the installed skill directory:

```bash
cd ./skills/get-recording-ingest-public
cp config.example.yaml config.local.yaml
cp glossary.example.yaml glossary.local.yaml
```

Edit `config.local.yaml`.

Set your knowledge base root, log directory, note source command or export path, routing rules, and optional task tracker settings.

Edit `glossary.local.yaml`.

Add private names, aliases, product terms, customer names, and speech-recognition corrections. Do not commit this file.

## Example Prompts

```text
Ingest today's recording notes.
```

```text
Ingest recordings for 2026-06-03 and extract my TODOs.
```

```text
Run recording ingest in dry-run mode and show what would be written.
```

## Configuration Model

The public skill expects private values to come from local config:

- `primary_user`: the person whose decisions, commitments, and TODOs should be logged.
- `recording_source`: where the notes come from, such as a CLI, API export, JSON file, or Markdown folder.
- `glossary_path`: local glossary used to correct speech-recognition errors.
- `routing_rules`: keyword-based project routing.
- `task_tracker`: optional integration settings.

If `config.local.yaml` is missing, the skill should stop before writing and ask for a config path or dry-run permission.

## Privacy Boundary

Safe to publish:

- `SKILL.md`
- `README.md`
- `README.zh-CN.md`
- `config.example.yaml`
- `glossary.example.yaml`
- `package.json`
- `bin/install.mjs`
- `.gitignore`

Do not publish:

- `config.local.yaml`
- `glossary.local.yaml`
- `.env`
- API keys or task tracker tokens
- real employee, customer, partner, store, or project mappings
- raw recording transcripts
- exported notes that have not been sanitized

## Runtime Neutrality

This skill is not tied to a single IDE, agent, or hosted service. It can be used by any skills-aware agent that can read `SKILL.md` and operate on local files or configured note sources.

The task tracker step is optional. If your environment cannot access the tracker, the skill should still complete local log and project-note ingestion.

## Safety Defaults

- Append daily logs instead of replacing them.
- Search for existing `note_id` values before writing to avoid duplicates.
- Ask before adding new glossary corrections.
- Ask before creating tasks, marking tasks complete, changing owners, or changing due dates.
- Skip TODOs whose owner is ambiguous.

## License

No license has been declared yet. Add one before reusing this repository in a public package or organization.
