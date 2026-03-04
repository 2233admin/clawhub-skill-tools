# 硅谷节点推送指南

## 方式一：使用节点（如果已连接）

### 检查节点状态

```bash
# 使用 OpenClaw nodes 工具检查可用节点
# 在 OpenClaw 会话中运行：
nodes(action=status)
```

### 如果有硅谷节点连接

```bash
# 使用 nodes(action=run) 在远程节点执行 git 推送
nodes(
  action="run",
  node="silicon-valley-node-name",
  command=[
    "cd /path/to/repo",
    "git remote add origin https://github.com/YOUR_USERNAME/clawhub-skill-tools.git",
    "git push -u origin main"
  ]
)
```

---

## 方式二：使用 Personal Access Token（推荐）

### Step 1: 创建 GitHub Personal Access Token

1. 访问：https://github.com/settings/tokens
2. 点击 **"Generate new token"** → **"Generate new token (classic)"**
3. 填写：
   - **Note:** `ClawHub Skill Tools Push`
   - **Expiration:** 选择合适的过期时间
   - **Scopes:** 勾选 `repo`（完整仓库访问权限）
4. 点击 **"Generate token"**
5. **重要：** 复制生成的 token（只显示一次！）

### Step 2: 使用 Token 推送

```bash
cd /root/.openclaw/workspace/clawhub-schema-upgrade

# 方式 A：在 URL 中嵌入 token
git remote add origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/clawhub-skill-tools.git

# 方式 B：使用 credential helper（推荐，更安全）
git config credential.helper store
git remote add origin https://github.com/YOUR_USERNAME/clawhub-skill-tools.git

# 推送
git push -u origin main
```

**注意：** 方式 A 会在 `.git/config` 中保存 token，请注意安全。

---

## 方式三：使用 SSH Key（如果已配置）

### 检查是否已有 SSH Key

```bash
ls -la ~/.ssh/
# 查看是否有 id_rsa, id_ed25519 等文件
```

### 如果已有 SSH Key

```bash
# 添加 GitHub SSH Key（如果还没添加）
# 访问：https://github.com/settings/keys
# 粘贴 ~/.ssh/id_*.pub 的内容

# 使用 SSH URL
cd /root/.openclaw/workspace/clawhub-schema-upgrade
git remote add origin git@github.com:YOUR_USERNAME/clawhub-skill-tools.git
git push -u origin main
```

### 生成新的 SSH Key（如果需要）

```bash
# 生成新密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 启动 ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 复制公钥到 GitHub
cat ~/.ssh/id_ed25519.pub
# 访问：https://github.com/settings/keys → New SSH key
```

---

## 方式四：使用 GitHub CLI（如果可以安装）

### 在当前机器安装

```bash
# Ubuntu/Debian
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# 登录
gh auth login

# 创建仓库并推送
cd /root/.openclaw/workspace/clawhub-schema-upgrade
gh repo create clawhub-skill-tools --public --source=. --remote=origin --push
```

---

## 方式五：手动上传（最简单）

如果以上方式都不行，直接通过网页上传：

1. 访问：https://github.com/new
2. 创建仓库 `clawhub-skill-tools`
3. 点击 **"uploading an existing file"**
4. 上传以下文件：
   - `README.md`
   - `PROJECT_OVERVIEW.md`
   - `CHANGELOG_v1.1.0.md`
   - `ClawHub_Skill_Ecosystem_Development_Spec_v1.1.0.json`
   - `.gitignore`
   - `migrations/v1.0.0_to_v1.1.0.py`
   - `tests/test_schema_v1.1.0.py`

---

## 推荐操作流程

### 最简单快速：Personal Access Token

```bash
# 1. 创建 Token: https://github.com/settings/tokens

# 2. 推送
cd /root/.openclaw/workspace/clawhub-schema-upgrade
git remote add origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/clawhub-skill-tools.git
git push -u origin main

# 3. 完成后可以移除 remote（可选）
git remote remove origin
```

### 最安全：SSH Key

```bash
# 如果已有 SSH Key 配置
cd /root/.openclaw/workspace/clawhub-schema-upgrade
git remote add origin git@github.com:YOUR_USERNAME/clawhub-skill-tools.git
git push -u origin main
```

---

## 推送后验证

1. 访问：`https://github.com/YOUR_USERNAME/clawhub-skill-tools`
2. 确认所有文件都已上传
3. 创建 Release v1.1.0（参考 GITHUB_PUBLISH_GUIDE.md）

---

## 故障排除

### 问题：提示认证失败

**解决方案：**
- 确认 Token 有 `repo` 权限
- 确认 Token 没有过期
- 尝试重新生成 Token

### 问题：remote origin already exists

**解决方案：**
```bash
git remote remove origin
# 然后重新添加
```

### 问题：权限被拒绝（SSH）

**解决方案：**
- 确认公钥已添加到 GitHub
- 尝试：`ssh -T git@github.com` 测试连接

---

*最后更新：2026-03-04*
