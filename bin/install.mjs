#!/usr/bin/env node

import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const targetArg = process.argv[2];

if (!targetArg || targetArg === "-h" || targetArg === "--help") {
  console.log(`Usage:
  install-recording-ingest-skill <target-skill-directory>

Example:
  npx --yes --package github:yechengyu/get-recording-ingest-public install-recording-ingest-skill ./skills/get-recording-ingest-public
`);
  process.exit(targetArg ? 0 : 1);
}

const target = resolve(targetArg.replace(/^~(?=$|\/|\\)/, process.env.HOME || "~"));
mkdirSync(target, { recursive: true });

const files = [
  "SKILL.md",
  "README.md",
  "README.zh-CN.md",
  "config.example.yaml",
  "glossary.example.yaml",
  ".gitignore",
];

for (const file of files) {
  copyFileSync(join(root, file), join(target, file));
}

const localConfig = join(target, "config.local.yaml");
const localGlossary = join(target, "glossary.local.yaml");

console.log(`Installed recording ingest skill to:
  ${target}

Next steps:
  cd ${target}
  ${existsSync(localConfig) ? "# config.local.yaml already exists" : "cp config.example.yaml config.local.yaml"}
  ${existsSync(localGlossary) ? "# glossary.local.yaml already exists" : "cp glossary.example.yaml glossary.local.yaml"}
`);
