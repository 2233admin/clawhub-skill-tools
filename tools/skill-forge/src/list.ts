import { readdir } from "node:fs/promises";

interface SkillInfo {
  id: string;
  source: "claude" | "openclaw";
  path: string;
  size: number;
}

const HOME = process.env.USERPROFILE || process.env.HOME || "";

export async function listSkills(): Promise<{ claude: SkillInfo[]; openclaw: SkillInfo[] }> {
  const claude = await listClaudeSkills();
  const openclaw = await listOpenClawSkills();
  return { claude, openclaw };
}

async function listClaudeSkills(): Promise<SkillInfo[]> {
  const dir = `${HOME}/.claude/skills`;
  const skills: SkillInfo[] = [];

  try {
    const files = await readdir(dir);
    for (const file of files) {
      if (file.endsWith(".md")) {
        const f = Bun.file(`${dir}/${file}`);
        skills.push({
          id: file.replace(".md", ""),
          source: "claude",
          path: `${dir}/${file}`,
          size: f.size,
        });
      }
    }
  } catch {}

  return skills;
}

async function listOpenClawSkills(): Promise<SkillInfo[]> {
  const dir = `${HOME}/.openclaw/skills`;
  const skills: SkillInfo[] = [];

  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const jsonFile = Bun.file(`${dir}/${entry.name}/skill.json`);
        skills.push({
          id: entry.name,
          source: "openclaw",
          path: `${dir}/${entry.name}`,
          size: jsonFile.size,
        });
      }
    }
  } catch {}

  return skills;
}
