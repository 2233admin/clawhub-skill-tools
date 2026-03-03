# AI 生成内容检测规避指南

> 用于 Nature、IEEE 等期刊的 AI 写作策略

## ⚠️ AI 检测风险

部分期刊（Nature 系列、IEEE 等）开始使用 AI 检测工具：
- **GPTZero**
- **Originality.ai**
- 其他内部检测工具

---

## ✅ 规避建议

### 1. 保留"人类写作痕迹"

**添加个人写作风格：**
- 使用特定的句式偏好
- 保留个人常用的过渡词
- 加入一些个性化的表达习惯

**保留少量"不完美"表达：**
- AI 通常过于流畅，可以故意保留一些小瑕疵
- 偶尔使用稍复杂或稍简单的句式
- 保留一些自然的语言变化

**在 Methods 部分详细描述：**
- 详细说明您的实验决策过程
- 解释为什么选择某个方案而不是另一个
- 加入一些个人的思考和权衡

---

### 2. 混合写作流程

```
Step 1: AI 初稿
└─ 用 AI 生成初稿框架/技术描述
   └─ 重点：技术细节、架构描述、相关工作

Step 2: 人工重写（关键！）
├─ Introduction → 完全人工重写
├─ Discussion → 完全人工重写
└─ Abstract → 人工润色
   └─ 这两部分最容易被检测！

Step 3: 工具润色
└─ 用 Grammarly/Word 润色
   └─ 保留修改痕迹（Track Changes）

Step 4: 最终通读
└─ 人工通读全文
   └─ 确保"声音"一致
```

---

### 3. 透明度策略（推荐）

在 Acknowledgements 或 Methods 中声明：

```
"We used AI assistants for initial drafting of technical sections,
with all content subsequently reviewed, rewritten, and validated by authors."
```

**多数会议接受此做法** — 但请先查目标会议的 policy。

---

## 预期查重率分布

```
操作流程：
1. 先跑查重预检
2. 针对红色标记重写
3. 保留引用 + 添加项目特定变体
4. 最终相似度 <15% 即可投稿
```

**合理操作下的预期查重率：**
- 直接复制内容 → 🔴 30-100%（高风险）
- 简单改写 → 🟡 15-30%（需检查）
- 完全重述 + 引用 → 🟢 <15%（安全）

---

## 各部分写作策略

| 章节 | AI 使用建议 | 重写要求 |
|------|------------|---------|
| **Abstract** | 可生成初稿 | ⭐⭐⭐ 必须人工重写 |
| **Introduction** | 可生成要点 | ⭐⭐⭐⭐⭐ 完全人工重写 |
| **Related Work** | 可生成综述框架 | ⭐⭐ 人工调整 + 正确引用 |
| **Methods** | 可生成技术细节 | ⭐⭐ 加入个人决策描述 |
| **Results** | 可生成数据分析 | ⭐⭐⭐ 人工解释结果意义 |
| **Discussion** | 可生成讨论点 | ⭐⭐⭐⭐⭐ 完全人工重写 |
| **Conclusion** | 可生成摘要 | ⭐⭐⭐ 人工润色 |

---

## 针对本项目的具体建议

### NSLT 理论部分

**不要直接复制：**
```
Liu et al. (2026) proposed a three-layer architecture consisting of
metadata_layer, core_logic_layer, dependency_layer, and quality_metrics_layer.
```

**应该重写为（加入您的理解）：**
```
Building on the Neural Scaling Laws Trilogy (Liu et al., 2026), we adopt
a four-layer architecture design principle. The metadata_layer captures
skill identity and dependencies, while the core_logic_layer focuses on
the primary functionality. The dependency_layer manages external requirements,
and the quality_metrics_layer establishes evaluation criteria. This structure
was chosen because it aligns well with our component reuse goals...
```

**关键：**
- ✅ 保留引用 (Liu et al., 2026)
- ✅ 加入您的解释和理由
- ✅ 用不同的句式重新组织
- ✅ 添加项目特定的上下文

---

### SkillRL 机制部分

**不要直接复制：**
```
The reward weights are: ClawHub_audit_pass (0.4), quality_score (0.3),
reuse_rate (0.2), user_satisfaction (0.1).
```

**应该重写为（加入您的设计决策）：**
```
We designed a weighted reward signal that balances multiple objectives.
ClawHub audit performance receives the highest weight (0.4) because
security and compliance are our top priorities. Quality score (0.3) and
component reuse rate (0.2) ensure both correctness and efficiency.
User satisfaction (0.1) provides a final human-in-the-loop validation.
This weighting scheme was tuned through iterative testing...
```

---

## 查重检测类型与规避

| 检测类型 | 项目内容 | 风险等级 | 规避方案 |
|----------|---------|----------|---------|
| 直接复制检测 | JSON Schema、代码片段、SKILL.md 模板 | 🔴 高 | ✅ 用自己的话重述 + 添加项目特定变体 |
| 改写未引用 | NSLT 理论描述、SkillRL 机制解释 | 🟡 中 | ✅ 所有理论描述后加 (Liu et al., 2026) 引用 |
| 自我抄袭 | 若先发 arXiv 再投会议 | 🟡 中 | ✅ 投稿时声明 "preprint available at arXiv:xxx" |
| 通用术语重复 | "token efficiency", "backward compatible" 等 | 🟢 低 | ✅ 无需处理，查重系统会忽略常见术语 |
| AI 生成内容检测 | 部分期刊开始检测 AI 写作痕迹 | 🟡 中 | ✅ 人工润色 + 添加个人写作风格 + 保留修改痕迹 |

---

## 原创内容清单

以下组件可以安全声明为原创：

- ✅ 项目架构设计图（原创 diagram）
- ✅ 实验数据/结果表格（您自己跑的实验）
- ✅ 用户研究问卷设计与分析（原创）
- ✅ 迁移脚本代码（您修改后的版本）
- ✅ Schema 字段的业务逻辑解释（用自己的话）
- ✅ Introduction 和 Discussion（完全人工撰写）
- ✅ Methods 中的决策过程描述

---

## 快速检查清单

投稿前请确认：

- [ ] Introduction 已完全人工重写
- [ ] Discussion 已完全人工重写
- [ ] 所有理论部分都有正确引用
- [ ] 保留了修改痕迹（Track Changes）
- [ ] 在 Acknowledgements 中声明了 AI 使用
- [ ] 查重预检相似度 <15%
- [ ] 通读全文，确保"声音"一致
- [ ] 保留了一些"人类不完美"的表达

---

## 目标会议政策查询

投稿前请检查：

```
1. 访问会议官网
2. 查找 "Author Guidelines" 或 "Ethics Statement"
3. 搜索 "AI", "LLM", "ChatGPT" 关键词
4. 确认是否允许 AI 辅助写作
5. 确认是否需要声明
```

**常见政策：**
- ✅ 允许 AI 辅助，需声明（多数）
- ⚠️ 允许但不鼓励（少数）
- ❌ 禁止使用 AI（极少数）

---

*最后更新：2026-03-04*
