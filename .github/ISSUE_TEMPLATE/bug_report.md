---
name: Bug Report
about: Report a bug or issue with prismocker
title: '[BUG] '
labels: bug
assignees: ''
---

## Description

A clear and concise description of what the bug is.

## Reproduction Steps

1. Set up Prismocker with...
2. Execute query/operation with...
3. Expected result: ...
4. Actual result: ...

## Code Example

```typescript
// Minimal reproduction code
import { createPrismocker } from '@jsonbored/prismocker';
import type { PrismaClient } from '@prisma/client';

const prisma = createPrismocker<PrismaClient>();

// Seed data
prisma.setData('companies', [
  { id: 'company-1', name: 'Company 1' }
]);

// Issue occurs here...
const result = await prisma.companies.findMany();
```

## Expected Behavior

What you expected to happen.

## Actual Behavior

What actually happened.

## Environment

- **prismocker version:**
- **@prisma/client version:**
- **Jest/Vitest version:**
- **Node.js version:**
- **OS:**

## Additional Context

Add any other context, screenshots, or error messages about the problem here.
