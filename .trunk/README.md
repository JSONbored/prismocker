# Trunk Setup for Prismocker

This directory contains the Trunk configuration for unified linting, formatting, and code quality checks.

## What is Trunk?

[Trunk](https://docs.trunk.io) is a unified tool that manages:
- **Linters** (ESLint, Prettier, TypeScript, etc.)
- **Git Hooks** (pre-commit formatting, pre-push linting)
- **Flaky Test Detection** (tracks and identifies flaky tests)
- **CI Integration** (GitHub Actions workflow)

## Setup

### 1. Install Trunk CLI

```bash
# macOS/Linux
curl https://get.trunk.io -fsSL | bash

# Or via Homebrew
brew install trunk-io
```

### 2. Initialize Trunk (if not already done)

```bash
trunk init
```

This will:
- Set up git hooks
- Install configured linters
- Create `.trunk/` directory structure

### 3. Verify Setup

```bash
# Check Trunk status
trunk check

# Run all linters
trunk check --all

# Format code
trunk fmt
```

## Configuration

The main configuration is in `.trunk/trunk.yaml`:

- **Linters**: ESLint, Prettier, TypeScript, Jest, Markdown, etc.
- **Hooks**: Pre-commit formatting, pre-push linting
- **Flaky Tests**: Automatic detection and tracking

## GitHub Actions

The `.github/workflows/trunk.yml` workflow runs Trunk checks on:
- Pull requests (checks changed files)
- Pushes to main (checks all files)

## Flaky Test Tracking (Optional)

To enable flaky test tracking:

1. Create a Trunk account at https://trunk.io
2. Create an organization
3. Add secrets to GitHub:
   - `TRUNK_ORG_SLUG` - Your Trunk organization slug
   - `TRUNK_API_TOKEN` - Your Trunk API token

The workflow will automatically upload test results for flaky test detection.

## Benefits

✅ **Unified Tooling** - One tool for all linting/formatting  
✅ **Git Hooks** - Automatic formatting on commit, linting on push  
✅ **CI Integration** - Runs in GitHub Actions automatically  
✅ **Flaky Test Detection** - Tracks and identifies flaky tests  
✅ **Fast** - Incremental checks (only changed files)  
✅ **Consistent** - Same checks locally and in CI

## Comparison to Manual Setup

**Before (Manual):**
- Separate ESLint config
- Separate Prettier config
- Manual git hooks (lefthook, husky, etc.)
- Separate CI steps for each linter

**After (Trunk):**
- Single `.trunk/trunk.yaml` config
- Automatic git hooks
- Single CI workflow
- Unified tooling

## Next Steps

1. Install Trunk CLI: `curl https://get.trunk.io -fsSL | bash`
2. Initialize: `trunk init` (if needed)
3. Test: `trunk check`
4. Commit: Trunk hooks will run automatically

## Documentation

- [Trunk Docs](https://docs.trunk.io)
- [Trunk GitHub Actions](https://github.com/trunk-io/trunk-action)
- [Trunk Flaky Tests](https://docs.trunk.io/features/flaky-tests)

