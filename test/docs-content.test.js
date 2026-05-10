import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const README = readFileSync("README.md", "utf8")

function expectIncludes(text, expected) {
  assert.ok(text.includes(expected), `Expected README to include: ${expected}`)
}

test("README documents OpenCode install, boundaries, and companion packages", () => {
  expectIncludes(README, "Initial in v0.1.0 | v0.1.0 初始版本")
  expectIncludes(README, "面向人类用户")
  expectIncludes(README, "面向 LLM 智能体")
  expectIncludes(README, "For Humans")
  expectIncludes(README, "For LLM Agents")
  expectIncludes(README, "opencode plugin opencode-notify-tool@0.1.0 --force -g")
  expectIncludes(README, "不要手动编辑 OpenCode 配置，也不要使用裸包名或 latest")
  expectIncludes(README, "rm -rf ~/.cache/opencode/packages/opencode-notify-tool@*")
  expectIncludes(README, "`notify` 只用于非阻塞进度")
  expectIncludes(README, "需要用户响应、确认、授权、最终交接或无安全工作可继续时，应使用 `question`")
  expectIncludes(README, "opencode-wait")
  expectIncludes(README, "omp-notify-tool")
  expectIncludes(README, "omp plugin install npm:omp-notify-tool@0.1.0")
  expectIncludes(README, "不要把 OpenCode 包直接装到 OMP/Pi")
  expectIncludes(README, "What You Get")
  expectIncludes(README, "Companion Package")
  expectIncludes(
    README,
    `{
  "message": "Running verification",
  "variant": "info"
}`,
  )
  expectIncludes(README, "`MPL-2.0`")
  expectIncludes(README, "[LICENSE](./LICENSE)")
})
