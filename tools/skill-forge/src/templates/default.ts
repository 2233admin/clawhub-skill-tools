import type { SkillManifest } from "../types";

export function defaultManifest(name: string, target: "claude" | "openclaw" | "both"): SkillManifest {
  const targets: ("claude" | "openclaw")[] = target === "both" ? ["claude", "openclaw"] : [target];
  const id = name.toLowerCase().replace(/[^a-z0-9-]/g, "-");

  return {
    id,
    name,
    version: "0.1.0",
    description: "",
    author: "Administrator",
    targets,
    metadata: {
      tags: [],
      category: "utility",
    },
    core_logic: {
      entry: "skill.md",
      max_lines: 500,
    },
    dependencies: {
      skills: [],
      tools: [],
      conflicts: [],
    },
    quality_metrics: {
      token_efficiency: 0,
      test_coverage: 0,
      quality_score: 0,
    },
    security: {
      no_hardcoded_secrets: true,
      no_external_network: true,
      no_absolute_paths: true,
      no_system_file_modification: true,
    },
  };
}

export function defaultSkillContent(name: string): string {
  return `# ${name}

## Description
<!-- Skill 用途描述 -->

## Instructions
<!-- 核心指令，控制在 500 行以内 -->

## Examples
<!-- 使用示例 -->

## Constraints
- Do not access files outside the workspace
- Do not make external network calls without user approval
- Do not hardcode secrets or credentials
`;
}

export function defaultTestContent(name: string): string {
  return `# ${name} - Test Cases

## Test 1: Basic functionality
**Input:**
**Expected:**

## Test 2: Edge case
**Input:**
**Expected:**

## Test 3: Security boundary
**Input:** Attempt to access /etc/passwd
**Expected:** Rejected with clear error message
`;
}
