#!/usr/bin/env tsx

/**
 * Commit Analysis Script for Prismocker
 *
 * Analyzes conventional commits to determine the appropriate semantic version bump type.
 * Reads commit messages from stdin (one per line) and outputs: major, minor, or patch.
 *
 * **Semantic Versioning Rules:**
 * - **Major** (1.0.0 → 2.0.0): Breaking changes (`feat!:`, `BREAKING CHANGE:`)
 * - **Minor** (1.0.0 → 1.1.0): New features (`feat:`)
 * - **Patch** (1.0.0 → 1.0.1): Bug fixes (`fix:`), refactors, performance, style
 *
 * **Conventional Commit Types:**
 * - `feat!:` or `feat:` with `BREAKING CHANGE:` → MAJOR
 * - `feat:` → MINOR
 * - `fix:`, `perf:`, `refactor:`, `style:` → PATCH
 * - `chore:`, `docs:`, `test:`, `ci:`, `build:` → Ignored (no version bump)
 *
 * **Usage:**
 * ```bash
 * # Analyze commits from git log
 * git log --pretty=format:"%s" | tsx scripts/analyze-commits.ts
 *
 * # Or pipe directly
 * echo -e "feat: add search\nfix: resolve bug" | tsx scripts/analyze-commits.ts
 * ```
 *
 * **Output:**
 * - Writes bump type to stdout: `major`, `minor`, or `patch`
 * - Defaults to `patch` if no conventional commits found
 * - Defaults to `patch` on error
 *
 * **Exit codes:**
 * - `0` - Success (or no commits found, defaults to patch)
 * - `1` - Error (still outputs 'patch' to stdout)
 *
 * @see {@link https://www.conventionalcommits.org/ | Conventional Commits}
 * @see {@link https://semver.org/ | Semantic Versioning}
 */

/**
 * Analyzes commit messages and determines version bump type.
 *
 * Scans through commit messages and identifies the highest priority change type:
 * breaking changes (major), new features (minor), or fixes/improvements (patch).
 *
 * **Priority Order:**
 * 1. Breaking changes (`feat!:`, `BREAKING CHANGE:`) → `major`
 * 2. New features (`feat:`) → `minor`
 * 3. Fixes/improvements (`fix:`, `perf:`, `refactor:`, `style:`) → `patch`
 * 4. No conventional commits found → `patch` (default)
 *
 * **Commit Type Detection:**
 * - Breaking: Messages starting with `feat!:` or containing `BREAKING CHANGE:`
 * - Features: Messages starting with `feat:`
 * - Fixes: Messages starting with `fix:`, `perf:`, `refactor:`, or `style:`
 * - Ignored: Messages starting with `chore:`, `docs:`, `test:`, `ci:`, `build:`
 *
 * @param commitMessages - Array of commit message strings (one per line)
 * @returns The version bump type: 'major', 'minor', or 'patch'
 *
 * @example
 * ```typescript
 * const commits = [
 *   'feat: add search functionality',
 *   'fix: resolve bug in query parser'
 * ];
 * const bumpType = analyzeCommits(commits); // Returns: 'minor'
 * ```
 */
function analyzeCommits(commitMessages: string[]): 'major' | 'minor' | 'patch' {
  let hasBreakingChange = false;
  let hasFeature = false;
  let hasFix = false;

  for (const message of commitMessages) {
    const trimmed = message.trim();
    if (!trimmed) continue;

    // Check for breaking changes
    if (trimmed.startsWith('feat!:') || trimmed.includes('BREAKING CHANGE:')) {
      hasBreakingChange = true;
      continue;
    }

    // Check for features
    if (trimmed.startsWith('feat:')) {
      hasFeature = true;
      continue;
    }

    // Check for fixes
    if (
      trimmed.startsWith('fix:') ||
      trimmed.startsWith('perf:') ||
      trimmed.startsWith('refactor:') ||
      trimmed.startsWith('style:')
    ) {
      hasFix = true;
      continue;
    }

    // Ignore: chore, docs, test, ci, build
  }

  // Determine bump type based on priority
  if (hasBreakingChange) {
    return 'major';
  }
  if (hasFeature) {
    return 'minor';
  }
  if (hasFix) {
    return 'patch';
  }

  // Default to patch if no conventional commits found
  return 'patch';
}

/**
 * Main entry point for commit analysis.
 *
 * Reads commit messages from stdin, analyzes them to determine version bump type,
 * and outputs the result to stdout for use in shell scripts and workflows.
 *
 * **Input:**
 * - Reads from `process.stdin` (one commit message per line)
 * - Handles empty input gracefully (defaults to 'patch')
 *
 * **Output:**
 * - Writes bump type to `process.stdout`: `major`, `minor`, or `patch`
 * - Always outputs a valid bump type, even on error (defaults to 'patch')
 *
 * **Error Handling:**
 * - Logs errors to `console.error`
 * - Always outputs 'patch' to stdout (even on error) for script compatibility
 * - Exits with code 1 on error, 0 on success
 *
 * @throws {Error} If stdin reading fails (but still outputs 'patch' to stdout)
 *
 * @example
 * ```bash
 * # Pipe git log output
 * git log --pretty=format:"%s" | tsx scripts/analyze-commits.ts
 * # Output: minor
 * ```
 */
async function main() {
  try {
    // Read from stdin
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }

    const input = Buffer.concat(chunks).toString('utf8');
    const commitMessages = input
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (commitMessages.length === 0) {
      // Default to patch if no commits
      process.stdout.write('patch\n');
      process.exit(0);
    }

    const bumpType = analyzeCommits(commitMessages);

    // Output to stdout (for use in scripts)
    process.stdout.write(`${bumpType}\n`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to analyze commits:', error);
    // Default to patch on error
    process.stdout.write('patch\n');
    process.exit(1);
  }
}

main();

