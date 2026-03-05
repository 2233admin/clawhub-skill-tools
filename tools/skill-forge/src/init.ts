import { mkdir } from "node:fs/promises";
import { defaultManifest, defaultSkillContent, defaultTestContent } from "./templates/default";

export async function initSkill(
  name: string,
  target: "claude" | "openclaw" | "both",
  outputDir?: string,
): Promise<string> {
  const id = name.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const dir = outputDir || `./${id}`;

  await mkdir(`${dir}/tests`, { recursive: true });

  const manifest = defaultManifest(name, target);
  await Bun.write(`${dir}/manifest.json`, JSON.stringify(manifest, null, 2));
  await Bun.write(`${dir}/skill.md`, defaultSkillContent(name));
  await Bun.write(`${dir}/tests/basic.md`, defaultTestContent(name));

  return dir;
}
