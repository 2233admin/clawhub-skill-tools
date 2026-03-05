import { readdir } from "node:fs/promises";
import type { SkillManifest, ValidationResult, ValidationError, ValidationWarning } from "./types";

const THRESHOLDS = {
  quality_score: 0.7,
  token_efficiency: 0.8,
  test_coverage: 0.9,
  max_core_lines: 500,
  max_description_tokens: 200,
};

export async function validateSkill(skillDir: string): Promise<ValidationResult> {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  const manifestPath = `${skillDir}/manifest.json`;
  const manifestFile = Bun.file(manifestPath);

  if (!(await manifestFile.exists())) {
    errors.push({
      layer: "metadata",
      field: "manifest.json",
      message: "manifest.json not found",
      severity: "critical",
    });
    return { valid: false, errors, warnings, score: 0 };
  }

  const manifest: SkillManifest = await manifestFile.json();

  // Layer 1: metadata validation
  if (!manifest.id || manifest.id.length === 0) {
    errors.push({ layer: "metadata", field: "id", message: "Skill ID is required", severity: "critical" });
  }
  if (!manifest.name) {
    errors.push({ layer: "metadata", field: "name", message: "Skill name is required", severity: "critical" });
  }
  if (!manifest.description || manifest.description.length < 10) {
    errors.push({ layer: "metadata", field: "description", message: "Description must be >= 10 chars", severity: "error" });
  }
  if (!manifest.targets || manifest.targets.length === 0) {
    errors.push({ layer: "metadata", field: "targets", message: "At least one target (claude/openclaw) required", severity: "error" });
  }

  // Layer 2: core_logic validation
  const entryFile = Bun.file(`${skillDir}/${manifest.core_logic?.entry || "skill.md"}`);
  if (await entryFile.exists()) {
    const content = await entryFile.text();
    const lines = content.split("\n").length;
    const tokens = estimateTokens(content);

    if (lines > THRESHOLDS.max_core_lines) {
      errors.push({
        layer: "core_logic",
        field: "entry",
        message: `Core logic ${lines} lines exceeds limit ${THRESHOLDS.max_core_lines}`,
        severity: "error",
      });
    }

    // Token efficiency: meaningful content / total tokens
    const emptyLines = content.split("\n").filter((l) => l.trim() === "").length;
    const commentLines = content.split("\n").filter((l) => l.trim().startsWith("<!--") || l.trim().startsWith("//") || l.trim().startsWith("#")).length;
    const efficiency = 1 - (emptyLines + commentLines * 0.5) / Math.max(lines, 1);
    manifest.quality_metrics.token_efficiency = Math.round(efficiency * 100) / 100;

    if (efficiency < THRESHOLDS.token_efficiency) {
      warnings.push({
        layer: "core_logic",
        field: "token_efficiency",
        message: `Token efficiency ${(efficiency * 100).toFixed(0)}% < ${THRESHOLDS.token_efficiency * 100}% threshold`,
      });
    }

    // Security scans
    const securityPatterns = [
      { pattern: /(api[_-]?key|secret|password|token)\s*[:=]\s*["'][^"']+["']/gi, issue: "Hardcoded secret detected" },
      { pattern: /https?:\/\/[^\s"']+/gi, issue: "External URL found (review needed)" },
      { pattern: /(\/etc\/|\/usr\/|C:\\Windows|C:\\Program)/gi, issue: "Absolute system path detected" },
      { pattern: /(rm\s+-rf|del\s+\/[sfq]|format\s+[a-z]:)/gi, issue: "Destructive system command detected" },
    ];

    for (const { pattern, issue } of securityPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        errors.push({
          layer: "quality_metrics",
          field: "security",
          message: `${issue}: ${matches[0].substring(0, 50)}`,
          severity: "critical",
        });
      }
    }
  } else {
    errors.push({
      layer: "core_logic",
      field: "entry",
      message: `Entry file '${manifest.core_logic?.entry}' not found`,
      severity: "critical",
    });
  }

  // Layer 3: dependency validation
  if (manifest.dependencies?.conflicts?.length > 0) {
    for (const conflict of manifest.dependencies.conflicts) {
      if (manifest.dependencies.skills.includes(conflict)) {
        errors.push({
          layer: "dependency",
          field: "conflicts",
          message: `Skill '${conflict}' is both a dependency and a conflict`,
          severity: "error",
        });
      }
    }
  }

  // Layer 4: quality metrics
  const testDir = `${skillDir}/tests`;
  try {
    const testFiles = await readdir(testDir);
    manifest.quality_metrics.test_coverage = testFiles.length > 0 ? 1.0 : 0;
  } catch {
    manifest.quality_metrics.test_coverage = 0;
    warnings.push({
      layer: "quality_metrics",
      field: "test_coverage",
      message: "No tests/ directory found",
    });
  }

  // Calculate overall score
  const criticalCount = errors.filter((e) => e.severity === "critical").length;
  const errorCount = errors.filter((e) => e.severity === "error").length;
  const score = Math.max(0, 1 - criticalCount * 0.3 - errorCount * 0.1 - warnings.length * 0.05);
  manifest.quality_metrics.quality_score = Math.round(score * 100) / 100;

  return {
    valid: criticalCount === 0,
    errors,
    warnings,
    score: manifest.quality_metrics.quality_score,
  };
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
