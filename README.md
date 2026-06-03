# Recording Note Ingest Skill

A privacy-safe Agent Skill for turning daily voice notes, meeting recordings, and audio cards into a structured personal knowledge base.

It helps an agent:

- read or fetch recording notes for a target date
- apply speech-recognition glossary corrections
- append daily log entries
- route reusable project notes into project folders
- extract TODOs owned by the primary user
- optionally sync progress to a task tracker through private local config

The repository contains only public workflow instructions and example configuration. Your real people, company, project paths, API tokens, task tracker IDs, and raw transcripts belong in ignored local files.

## Files

```text
.
├── SKILL.md
├── config.example.yaml
├── glossary.example.yaml
└── .gitignore
```

- `SKILL.md`: the agent-facing workflow.
- `config.example.yaml`: schema and placeholder values for local setup.
- `glossary.example.yaml`: example speech-recognition correction glossary.
- `.gitignore`: excludes local config, raw exports, transcripts, and private files.

## Quick Start

1. Clone this repository or copy the folder into your skills directory.

```bash
git clone https://github.com/yechengyu/get-recording-ingest-public.git
```

2. Create private local config files.

```bash
cp config.example.yaml config.local.yaml
cp glossary.example.yaml glossary.local.yaml
```

3. Edit `config.local.yaml`.

Set your knowledge base root, log directory, note source command or export path, routing rules, and optional task tracker settings.

4. Edit `glossary.local.yaml`.

Add private names, aliases, product terms, customer names, and speech-recognition corrections. Do not commit this file.

5. Ask your skills-aware agent to run the skill.

Example prompts:

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
- `config.example.yaml`
- `glossary.example.yaml`
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

---

# 录音笔记入库 Skill

这是一个脱敏版 Agent Skill，用于把每天的语音笔记、会议录音、录音卡整理进个人知识库。

它可以帮助智能体：

- 读取或拉取指定日期的录音笔记
- 按术语表校正语音识别错误
- 追加每日日志
- 将可复用的项目内容路由到项目目录
- 提取主用户本人负责的 TODO
- 通过本地私有配置，可选同步进展到任务系统

这个仓库只包含公开工作流说明和示例配置。真实人名、公司名、项目路径、API token、任务表 ID、原始转写内容，都应该放在被忽略的本地文件里。

## 文件

```text
.
├── SKILL.md
├── config.example.yaml
├── glossary.example.yaml
└── .gitignore
```

- `SKILL.md`：给智能体读取的工作流。
- `config.example.yaml`：本地配置的字段示例。
- `glossary.example.yaml`：语音识别校对表示例。
- `.gitignore`：排除本地配置、原始导出、转写稿和私有文件。

## 快速开始

1. 克隆仓库，或把这个目录复制到你的 skills 目录。

```bash
git clone https://github.com/yechengyu/get-recording-ingest-public.git
```

2. 创建本地私有配置。

```bash
cp config.example.yaml config.local.yaml
cp glossary.example.yaml glossary.local.yaml
```

3. 编辑 `config.local.yaml`。

填入你的知识库根目录、日志目录、笔记来源命令或导出路径、项目路由规则，以及可选的任务系统配置。

4. 编辑 `glossary.local.yaml`。

加入真实姓名、别名、产品名、客户名和常见语音识别错误。不要提交这个文件。

5. 让支持 skills 的智能体执行。

示例提示词：

```text
把今天的录音笔记入库。
```

```text
入库 2026-06-03 的录音，并提取我的 TODO。
```

```text
用 dry-run 跑一遍录音入库，先展示会写入什么。
```

## 配置模型

公开版 skill 只读取本地配置中的私有值：

- `primary_user`：只记录这个人的决策、承诺和 TODO。
- `recording_source`：录音笔记来源，可以是 CLI、API 导出、JSON 文件或 Markdown 文件夹。
- `glossary_path`：本地语音校对表。
- `routing_rules`：按关键词路由到项目目录。
- `task_tracker`：可选任务系统集成。

如果缺少 `config.local.yaml`，skill 应在写入前停止，并要求用户提供配置路径或授权 dry-run。

## 隐私边界

可以公开：

- `SKILL.md`
- `README.md`
- `config.example.yaml`
- `glossary.example.yaml`
- `.gitignore`

不要公开：

- `config.local.yaml`
- `glossary.local.yaml`
- `.env`
- API key 或任务系统 token
- 真实员工、客户、合作方、门店、项目映射
- 原始录音转写
- 未脱敏的笔记导出

## 运行环境中立

这个 skill 不绑定某一个 IDE、agent 或托管服务。任何能读取 `SKILL.md`、并能操作本地文件或配置笔记来源的 skills-aware agent 都可以使用。

任务系统同步是可选步骤。如果当前环境无法访问任务系统，skill 应继续完成本地日志和项目笔记入库。

## 安全默认值

- 追加每日日志，不整体覆盖。
- 写入前搜索已有 `note_id`，避免重复。
- 新增 glossary 校对词前先问用户。
- 创建任务、标记完成、修改负责人、修改截止日期前先问用户。
- TODO 归属不明确时，不写入主用户 TODO。

## 许可证

当前尚未声明许可证。如果要作为公开软件包或组织项目复用，请先补充 license。
