# 录音笔记入库 Skill

[English README](README.md)

这是一个脱敏版 Agent Skill，用于把每天的语音笔记、会议录音、录音卡整理进个人知识库。

它可以帮助智能体：

- 读取或拉取指定日期的录音笔记
- 按术语表校正语音识别错误
- 追加每日日志
- 将可复用的项目内容路由到项目目录
- 提取主用户本人负责的 TODO
- 通过本地私有配置，可选同步进展到任务系统

这个仓库只包含公开工作流说明和示例配置。真实人名、公司名、项目路径、API token、任务表 ID、原始转写内容，都应该放在被忽略的本地文件里。

## 用 npm 安装

用 `npx` 安装到 skills 目录：

```bash
npx --yes --package github:yechengyu/get-recording-ingest-public install-recording-ingest-skill ./skills/get-recording-ingest-public
```

也可以安装到你的 agent runtime 支持的任意目录：

```bash
npx --yes --package github:yechengyu/get-recording-ingest-public install-recording-ingest-skill /path/to/your/skills/get-recording-ingest-public
```

安装器只复制公开 skill 文件：

```text
SKILL.md
README.md
README.zh-CN.md
config.example.yaml
glossary.example.yaml
.gitignore
```

它不会创建或复制 `config.local.yaml`、`glossary.local.yaml`、原始导出、转写稿或密钥。

## 文件

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

- `SKILL.md`：给智能体读取的工作流。
- `README.md`：英文文档。
- `README.zh-CN.md`：中文文档。
- `config.example.yaml`：本地配置的字段示例。
- `glossary.example.yaml`：语音识别校对表示例。
- `bin/install.mjs`：npm 安装器，用于把公开 skill 文件复制到目标 skills 目录。
- `.gitignore`：排除本地配置、原始导出、转写稿和私有文件。

## 本地配置

安装后，在 skill 目录中创建本地私有配置：

```bash
cd ./skills/get-recording-ingest-public
cp config.example.yaml config.local.yaml
cp glossary.example.yaml glossary.local.yaml
```

编辑 `config.local.yaml`。

填入你的知识库根目录、日志目录、笔记来源命令或导出路径、项目路由规则，以及可选的任务系统配置。

编辑 `glossary.local.yaml`。

加入真实姓名、别名、产品名、客户名和常见语音识别错误。不要提交这个文件。

## 示例提示词

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
- `README.zh-CN.md`
- `config.example.yaml`
- `glossary.example.yaml`
- `package.json`
- `bin/install.mjs`
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
