# git-clean

```
 ██████╗ ██╗████████╗       ██████╗██╗     ███████╗ █████╗ ███╗   ██╗
██╔════╝ ██║╚══██╔══╝      ██╔════╝██║     ██╔════╝██╔══██╗████╗  ██║
██║  ███╗██║   ██║   █████╗██║     ██║     █████╗  ███████║██╔██╗ ██║
██║   ██║██║   ██║   ╚════╝██║     ██║     ██╔══╝  ██╔══██║██║╚██╗██║
╚██████╔╝██║   ██║         ╚██████╗███████╗███████╗██║  ██║██║ ╚████║
 ╚═════╝ ╚═╝   ╚═╝          ╚═════╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝
```

> 🧹 Interactive CLI for cleaning up old Git branches.

[![npm version](https://img.shields.io/npm/v/@laabroms/git-clean.svg)](https://www.npmjs.com/package/@laabroms/git-clean)
[![GitHub](https://img.shields.io/github/stars/laabroms/git-clean?style=social)](https://github.com/laabroms/git-clean)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Demo](assets/demo.gif)

## Features

- **Interactive TUI** — Navigate with arrow keys, mark branches with spacebar
- **Smart detection** — Automatically identifies merged (against current branch + main/master), stale, and protected branches
- **Quick actions** — Mark all merged (`m`) or stale branches (`s`) with one key
- **Configurable** — Set your own stale threshold with `--stale-days`
- **Safe by default** — Protects current branch and `main`/`master`/`develop`
- **Git operations** — Fetch and pull without leaving the TUI
- **Visual status** — Color-coded branch status (current, merged, stale, protected)

## Installation


```bash
curl -fsSL https://raw.githubusercontent.com/laabroms/git-clean/main/install.sh | bash
```

### npm (global)

```bash
npm install -g @laabroms/git-clean
```

### npx (no install)

```bash
npx @laabroms/git-clean
```

## Usage

Navigate to any Git repository and run:

```bash
git-clean
```

### Options

```bash
git-clean --stale-days 14   # branches older than 14 days are "stale"
git-clean --stale-days 90   # more conservative (default: 30)
```

### Controls

| Key | Action |
|-----|--------|
| **↑/↓** | Navigate branches |
| **Space** | Mark/unmark branch for deletion |
| **d** | Delete marked branches |
| **m** | Mark all merged branches |
| **s** | Mark all stale branches |
| **c** | Clear all marks |
| **f** | Fetch from remote (`git fetch --prune`) |
| **p** | Pull from remote (`git pull --ff-only`) |
| **q** / **Esc** | Quit |

### Branch Status

- **● CURRENT** — The branch you're currently on (protected)
- **🔒 PROTECTED** — Protected branches (`main`, `master`, `develop`)
- **✓ MERGED** — Branch has been merged into current branch or main/master
- **⚠ Xd stale** — No commits in X days (yellow at threshold, red at 2×)

## Why?

After working on a project for a while, you end up with dozens of old feature branches. Cleaning them up manually is tedious. `git-clean` makes it easy:

1. See all your branches in one view
2. Identify which ones are safe to delete
3. Mark and delete in seconds

## License

MIT © [Lucas Abroms](https://github.com/laabroms)