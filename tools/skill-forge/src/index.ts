#!/usr/bin/env bun

import { initSkill } from "./init";
import { validateSkill } from "./validate";
import { buildSkill, deployBuild } from "./build";
import { listSkills } from "./list";

const HELP = `
SkillForge - NSLT-guided Skill Development Tool

Usage: sf <command> [options]

Commands:
  init <name> [--target claude|openclaw|both]   Create a new skill project
  validate [path]                               Validate skill against NSLT spec
  build [path]                                  Build skill for target platforms
  deploy [path]                                 Build and deploy to skill directories
  list                                          List all installed skills
  stats                                         Show skill statistics

Options:
  --target, -t   Target platform (claude, openclaw, both)  [default: both]
  --help, -h     Show this help message
`;

const args = process.argv.slice(2);
const command = args[0];

function getFlag(flag: string, short?: string): string | undefined {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === flag || args[i] === short) {
      return args[i + 1];
    }
  }
  return undefined;
}

async function main() {
  if (!command || command === "--help" || command === "-h") {
    console.log(HELP);
    process.exit(0);
  }

  switch (command) {
    case "init": {
      const name = args[1];
      if (!name) {
        console.error("Error: skill name required\nUsage: sf init <name> [--target claude|openclaw|both]");
        process.exit(1);
      }
      const target = (getFlag("--target", "-t") || "both") as "claude" | "openclaw" | "both";
      const dir = await initSkill(name, target);
      console.log(`Skill '${name}' created at ${dir}/`);
      console.log(`\nStructure (NSLT 4-layer):`);
      console.log(`  manifest.json    <- metadata_layer + dependency_layer + quality_metrics_layer`);
      console.log(`  skill.md         <- core_logic_layer (max 500 lines)`);
      console.log(`  tests/basic.md   <- quality validation`);
      console.log(`\nNext: edit skill.md, then run 'sf validate ${dir}'`);
      break;
    }

    case "validate": {
      const path = args[1] || ".";
      console.log(`Validating ${path}...\n`);
      const result = await validateSkill(path);

      if (result.errors.length > 0) {
        console.log("ERRORS:");
        for (const e of result.errors) {
          const icon = e.severity === "critical" ? "[CRITICAL]" : "[ERROR]";
          console.log(`  ${icon} [${e.layer}] ${e.field}: ${e.message}`);
        }
      }

      if (result.warnings.length > 0) {
        console.log("\nWARNINGS:");
        for (const w of result.warnings) {
          console.log(`  [WARN] [${w.layer}] ${w.field}: ${w.message}`);
        }
      }

      console.log(`\nScore: ${(result.score * 100).toFixed(0)}%`);
      console.log(`Status: ${result.valid ? "PASS" : "FAIL"}`);

      if (!result.valid) process.exit(1);
      break;
    }

    case "build": {
      const path = args[1] || ".";
      console.log(`Building ${path}...\n`);
      const outputs = await buildSkill(path);
      for (const o of outputs) {
        console.log(`  [${o.target}] -> ${o.path}`);
      }
      console.log(`\nBuild complete. Run 'sf deploy ${path}' to install.`);
      break;
    }

    case "deploy": {
      const path = args[1] || ".";
      console.log(`Building and deploying ${path}...\n`);
      const outputs = await buildSkill(path);
      const deployed = await deployBuild(outputs);
      for (const d of deployed) {
        console.log(`  Deployed -> ${d}`);
      }
      console.log("\nDone! Restart Claude Code / OpenClaw to load new skills.");
      break;
    }

    case "list": {
      const { claude, openclaw } = await listSkills();
      console.log(`Claude Code Skills (${claude.length}):`);
      for (const s of claude.slice(0, 20)) {
        console.log(`  ${s.id.padEnd(40)} ${(s.size / 1024).toFixed(1)}KB`);
      }
      if (claude.length > 20) console.log(`  ... and ${claude.length - 20} more`);

      console.log(`\nOpenClaw Skills (${openclaw.length}):`);
      for (const s of openclaw.slice(0, 20)) {
        console.log(`  ${s.id.padEnd(40)} ${s.path}`);
      }
      if (openclaw.length > 20) console.log(`  ... and ${openclaw.length - 20} more`);

      console.log(`\nTotal: ${claude.length + openclaw.length} skills`);
      break;
    }

    case "stats": {
      const { claude, openclaw } = await listSkills();
      const totalSize = claude.reduce((a, s) => a + s.size, 0);
      console.log(`=== SkillForge Stats ===`);
      console.log(`Claude Code:  ${claude.length} skills (${(totalSize / 1024).toFixed(0)}KB)`);
      console.log(`OpenClaw:     ${openclaw.length} skills`);
      console.log(`Total:        ${claude.length + openclaw.length} skills`);
      break;
    }

    default:
      console.error(`Unknown command: ${command}`);
      console.log(HELP);
      process.exit(1);
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
