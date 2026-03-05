export interface SkillManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  targets: ("claude" | "openclaw")[];
  metadata: {
    tags: string[];
    category: string;
  };
  core_logic: {
    entry: string;
    max_lines: number;
  };
  dependencies: {
    skills: string[];
    tools: string[];
    conflicts: string[];
  };
  quality_metrics: {
    token_efficiency: number;
    test_coverage: number;
    quality_score: number;
  };
  security: {
    no_hardcoded_secrets: boolean;
    no_external_network: boolean;
    no_absolute_paths: boolean;
    no_system_file_modification: boolean;
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score: number;
}

export interface ValidationError {
  layer: "metadata" | "core_logic" | "dependency" | "quality_metrics";
  field: string;
  message: string;
  severity: "critical" | "error";
}

export interface ValidationWarning {
  layer: string;
  field: string;
  message: string;
}

export interface BuildOutput {
  target: "claude" | "openclaw";
  path: string;
  content: string;
}
