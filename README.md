# opencode-notify-tool

[![npm version](https://img.shields.io/npm/v/opencode-notify-tool.svg)](https://www.npmjs.com/package/opencode-notify-tool)
[![npm downloads](https://img.shields.io/npm/dw/opencode-notify-tool.svg)](https://www.npmjs.com/package/opencode-notify-tool)
[![License: MPL-2.0](https://img.shields.io/badge/License-MPL--2.0-brightgreen.svg)](LICENSE)

> **Initial in v0.1.0 | v0.1.0 初始版本**
>
> - Adds a standalone OpenCode `notify` tool plugin | 新增独立 OpenCode `notify` 工具插件
> - Sends non-blocking toast updates for progress and phase changes | 支持用非阻塞 toast 汇报进度和阶段切换
> - Keeps progress updates separate from `question`, `wait`, and final handoff | 将进度提示与 `question`、`wait` 和最终交接分离
> - Works together with `opencode-wait` for composable agent workflows | 可与 `opencode-wait` 组合使用

[中文](#中文) | [English](#english)

---

<a name="中文"></a>

## 中文

`opencode-notify-tool` 为 **OpenCode** 提供独立的 `notify` tool，让模型可以用非阻塞 toast 汇报进度、阶段切换和后台状态，而不把纯进度升级成需要用户回复的提问。

它适合把「我还在处理」「进入验证阶段」「后台任务已启动」这类状态更新从 `question` 中拆出来：需要明确用户决策时继续使用 `question`，只需要等待时使用 `opencode-wait`，只需要告知进度时使用 `notify`。

## 功能一览

- **非阻塞 toast** — `notify({ message, variant })` 通过 OpenCode `client.tui.showToast` 展示进度提示。
- **小而明确的参数** — 参数只包含 `message` 和可选 `variant`，避免把通知工具扩展成确认、等待或推送系统。
- **Fail-open** — OpenCode TUI toast 不可用或调用失败时，工具仍返回 `ok`，不打断主任务。
- **组合式工作流** — 等待交给 `opencode-wait`，需要用户响应时使用 `question`，进度提示交给本包。
- **测试友好** — `createNotifyPlugin()` 和 `createNotifyTool()` 支持注入客户端实现，便于稳定测试。

---

## 安装

<details open>
<summary><b>面向人类用户</b></summary>

**选项 A：让 LLM 帮你安装**

把下面这段话丢给任意 LLM（OpenCode / Claude Code / Cursor 等）：

```text
请先查看 opencode-notify-tool 最新 GitHub Release 正文里的安装或升级说明，然后严格执行其中带明确版本号的 OpenCode 安装命令。默认应使用带 `-g/--global` 的全局命令来更新你平时实际在用的 OpenCode 实例；只有你明确想改当前项目目录下的 `.opencode` 时，才省略 `-g`。不要手动编辑 OpenCode 配置，也不要使用裸包名或 latest。参考说明：https://github.com/jiwangyihao/opencode-notify-tool/releases/latest
```

**选项 B：手动安装**

当前版本：

```bash
opencode plugin opencode-notify-tool@0.1.0 --force -g
```

如果你是刻意只想改当前项目目录下的 `.opencode`，才使用不带 `-g` 的局部命令；否则默认不要省略 `-g`。

如果升级后看起来仍然没有变化，先清理 OpenCode 插件缓存，再重新执行同一条带版本号命令：

```bash
rm -rf ~/.cache/opencode/packages/opencode-notify-tool@*
```

如果 OpenCode 已在运行，安装或升级后重启再验证。

</details>

<details>
<summary><b>面向 LLM 智能体</b></summary>

### 步骤指引

1. 读取本仓库最新 GitHub Release 正文：

   `https://github.com/jiwangyihao/opencode-notify-tool/releases/latest`

2. 提取其中带明确版本号的安装或升级命令。当前版本示例：

   ```bash
   opencode plugin opencode-notify-tool@0.1.0 --force -g
   ```

3. 默认执行带 `-g/--global` 的全局命令。只有用户明确要改当前项目目录下的 `.opencode` 时，才省略 `-g`。

4. 不要手动编辑 OpenCode 配置，也不要使用裸包名或 `latest`。

5. 如果执行后版本看起来仍然没更新，先清理 OpenCode 插件缓存，再重新执行同一条带版本号命令：

   ```bash
   rm -rf ~/.cache/opencode/packages/opencode-notify-tool@*
   ```

6. 如果 OpenCode 已经运行，重启后再进行功能验证。

### 验证

让 Agent 调用 `notify`，例如：

```json
{
  "message": "Running verification",
  "variant": "info"
}
```

OpenCode TUI 可用时应显示非阻塞 toast；toast 不可用或发送失败时，本包仍会 fail open，不中断主任务。

</details>

---

## 使用方式

默认入口导出 OpenCode 插件函数：

```typescript
import NotifyPlugin from "opencode-notify-tool"

export default NotifyPlugin
```

如果需要在测试中注入 OpenCode client 或 toast 实现，可以使用 `createNotifyPlugin()`：

```typescript
import { createNotifyPlugin } from "opencode-notify-tool"

export default createNotifyPlugin({
  client: {
    tui: {
      showToast: async (options) => {
        console.log(options.body.message)
      },
    },
  },
})
```

## 工具参数

模型调用 `notify` 时只应传入 `message` 和可选 `variant`：

```json
{
  "message": "Running verification",
  "variant": "info"
}
```

- `message`：必填，非空字符串。
- `variant`：可选，只能是 `info`、`success`、`warning`、`error`；缺省为 `info`。

## 使用边界

`notify` 只用于非阻塞进度、阶段切换和后台状态。需要用户响应、确认、授权、最终交接或无安全工作可继续时，应使用 `question`。

需要等待时使用 [`opencode-wait`](https://github.com/jiwangyihao/opencode-wait)。等待交给 `opencode-wait`，进度交给 `opencode-notify-tool`。

## 相关版本

- 使用 **OMP/Pi**？请安装 [`omp-notify-tool`](https://github.com/jiwangyihao/omp-notify-tool)：

  ```bash
  omp plugin install npm:omp-notify-tool@0.1.0
  ```

- 两个包共享 `notify({ message, variant })` 的业务语义，但宿主适配层不同。不要把 OpenCode 包直接装到 OMP/Pi，也不要把 OMP/Pi 包直接装到 OpenCode。

## 与未来 `opencode-loop-safety` 配合

Loop Safety 可以通过外部 `notify`、`wait`、`question` 工具获得完整通道。本包只负责非阻塞通知。

## 本地开发

```bash
npm install
npm test
npm run build
```

---

<a name="english"></a>

## English

`opencode-notify-tool` gives **OpenCode** a dedicated `notify` tool so models can send non-blocking toast updates for progress, phase changes, and background status without turning pure progress into a question that needs a reply.

Use it for status updates like "still working", "starting verification", or "background task started". Use `question` when a real user decision is required, use `opencode-wait` when the agent needs to wait, and use `notify` when the agent only needs to report progress.

## What You Get

- **Non-blocking toast updates** — `notify({ message, variant })` sends progress through OpenCode `client.tui.showToast`.
- **Small input surface** — the tool only accepts `message` and optional `variant`; it is not a confirmation, wait, or push-notification system.
- **Fail-open behavior** — missing or failing toast support returns `ok` and does not interrupt the main agent task.
- **Composable workflow boundary** — waiting belongs to `opencode-wait`, user decisions belong to `question`, and progress updates belong here.
- **Test-friendly seams** — `createNotifyPlugin()` and `createNotifyTool()` accept injected client implementations for stable tests.

---

## Installation

<details open>
<summary><b>For Humans</b></summary>

**Option A: Let an LLM do it**

Paste this into any LLM agent (OpenCode, Claude Code, Cursor, etc.):

```text
First read the latest GitHub Release for opencode-notify-tool and execute the exact versioned install/upgrade command from the release notes. By default, use the global command with `-g/--global` so you update the OpenCode instances you actually run; omit `-g` only if you intentionally want to change the current project's `.opencode`. Do not manually edit the OpenCode config, and do not use a bare package name or latest. Reference: https://github.com/jiwangyihao/opencode-notify-tool/releases/latest
```

**Option B: Manual setup**

Current version:

```bash
opencode plugin opencode-notify-tool@0.1.0 --force -g
```

Only omit `-g` if you intentionally want to update the current project's `.opencode` instead of the global OpenCode config.

If an upgrade still looks stale, clear the OpenCode plugin cache and rerun the same versioned command:

```bash
rm -rf ~/.cache/opencode/packages/opencode-notify-tool@*
```

If OpenCode is already running, restart it before verification.

</details>

<details>
<summary><b>For LLM Agents</b></summary>

### Step-by-Step Instructions

1. Read the latest GitHub Release body for this repository:

   `https://github.com/jiwangyihao/opencode-notify-tool/releases/latest`

2. Extract the exact versioned install or upgrade command. Current version example:

   ```bash
   opencode plugin opencode-notify-tool@0.1.0 --force -g
   ```

3. By default, execute the global command with `-g/--global`; only omit `-g` if the user intentionally wants to update the current project's `.opencode`.

4. Do not install or upgrade this plugin by hand-editing OpenCode config, and do not use a bare package name or `latest`.

5. If the installed version still does not change, clear the OpenCode plugin cache and rerun the same versioned command:

   ```bash
   rm -rf ~/.cache/opencode/packages/opencode-notify-tool@*
   ```

6. If OpenCode is already running, restart before feature verification.

### Verification

Ask the agent to call `notify`, for example:

```json
{
  "message": "Running verification",
  "variant": "info"
}
```

When OpenCode TUI is available, a non-blocking toast should be displayed. If toast support is unavailable or fails, this package fails open and does not interrupt the main task.

</details>

---

## Usage

The default export is the OpenCode plugin function:

```typescript
import NotifyPlugin from "opencode-notify-tool"

export default NotifyPlugin
```

For tests, inject an OpenCode client or toast implementation with `createNotifyPlugin()`:

```typescript
import { createNotifyPlugin } from "opencode-notify-tool"

export default createNotifyPlugin({
  client: {
    tui: {
      showToast: async (options) => {
        console.log(options.body.message)
      },
    },
  },
})
```

## Tool Arguments

```json
{
  "message": "Running verification",
  "variant": "info"
}
```

- `message`: required, non-empty string.
- `variant`: optional, one of `info`, `success`, `warning`, or `error`; defaults to `info`.

## Boundaries

`notify` is only for non-blocking progress, phase changes, and background status. When you need a user response, confirmation, authorization, a final handoff, or no safe work remains, use `question`.

Use [`opencode-wait`](https://github.com/jiwangyihao/opencode-wait) when the agent needs to wait. Waiting belongs to `opencode-wait`; progress belongs to `opencode-notify-tool`.

## Companion Package

- Using **OMP/Pi**? Install [`omp-notify-tool`](https://github.com/jiwangyihao/omp-notify-tool):

  ```bash
  omp plugin install npm:omp-notify-tool@0.1.0
  ```

- Both packages share the `notify({ message, variant })` contract, but their host adapters are different. Do not install the OpenCode package into OMP/Pi or the OMP/Pi package into OpenCode.

## Working with future `opencode-loop-safety`

Loop Safety can get a complete channel through external `notify`, `wait`, and `question` tools. This package only handles non-blocking notifications.

## Local Development

```bash
npm install
npm test
npm run build
```

## License

`MPL-2.0`; see [LICENSE](./LICENSE).
