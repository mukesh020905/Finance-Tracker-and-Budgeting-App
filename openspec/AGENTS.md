# OpenSpec AI Agent Guidelines

Welcome, AI Agent! This repository uses **OpenSpec** for Spec-Driven Development (SDD) to ensure code reliability, feature completeness, and maintainability.

Refer to the rules and workflow below for any changes.

## Commands & Skills

We support OpenSpec workflows directly. Use the slash commands or workflows found in `.agent/workflows/` and `.agent/skills/`:
- **Propose (`/opsx:propose`):** Propose a feature or change. Scaffolds `proposal.md`, `design.md`, `tasks.md`, and delta specs under `openspec/changes/<change-id>/`.
- **Explore (`/opsx:explore`):** Analyze the requirements and explore the workspace before writing the proposal.
- **Apply (`/opsx:apply`):** Apply tasks from `tasks.md` step-by-step and implement code changes.
- **Sync (`/opsx:sync`):** Synchronize changes and spec status.
- **Archive (`/opsx:archive`):** Archive completed changes and update the canonical specs in `openspec/specs/`.

## General Conventions

1. **Specs as the Source of Truth:**
   - Canonical specifications live in `openspec/specs/`.
   - Before implementing anything, check existing specs to avoid overlapping design decisions.
2. **Step-by-Step Execution:**
   - Do not skip tasks in `tasks.md`.
   - Verify each task (by running relevant tests or manual verification) before marking it as complete.
3. **Tech Stack Constraints:**
   - Spring Boot (Java 17) backend.
   - Vite + React + Tailwind CSS frontend.
   - Run Maven builds (`mvn clean install`) or React runs (`npm run dev`) to verify correctness.
