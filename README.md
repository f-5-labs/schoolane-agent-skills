# SchooLane agent skills

[![Validate](https://github.com/f-5-labs/schoolane-agent-skills/actions/workflows/validate.yml/badge.svg)](https://github.com/f-5-labs/schoolane-agent-skills/actions/workflows/validate.yml)

Role-aware school context, curriculum review, term-scheme planning, and lesson-plan drafting through [SchooLane](https://schoolane.app). The bundle connects an agent to the authenticated SchooLane MCP server and adds four focused skills for the operations available in the first governed release.

> Release dependency: this initial bundle accompanies [SchooLane application PR #91](https://github.com/ehimah/K12SchoolAssessmentSystem/pull/91). Do not merge or announce the plugin as available until that MCP/OAuth foundation is deployed at the production endpoint.

## Install

### Claude

```text
/plugin marketplace add f-5-labs/schoolane-agent-skills
/plugin install schoolane@schoolane
```

### Codex

```bash
codex plugin marketplace add f-5-labs/schoolane-agent-skills
codex plugin add schoolane@schoolane
```

### Any MCP client

```json
{
  "mcpServers": {
    "schoolane": {
      "type": "http",
      "url": "https://api.schoolane.app/mcp"
    }
  }
}
```

### Portable skills

```bash
npx skills add f-5-labs/schoolane-agent-skills
```

The first SchooLane tool call opens browser sign-in and consent. SchooLane resolves the active school, role, personas, teacher assignment, OAuth scopes, and curriculum entitlement from current server state on every request. No API key is copied into the agent.

## Skills

| Skill | Best for |
| --- | --- |
| [`schoolane-school-context`](./skills/schoolane-school-context) | Discovering the signed-in user's school, role boundary, classes, terms, subjects, and curriculum records without student data. |
| [`schoolane-term-scheme-planning`](./skills/schoolane-term-scheme-planning) | Reviewing, creating, and revising whole-term scheme drafts with optimistic revision control. |
| [`schoolane-lesson-plan-drafting`](./skills/schoolane-lesson-plan-drafting) | Writing and saving class-assignment-scoped lesson-plan drafts for human review. |
| [`schoolane-curriculum-review`](./skills/schoolane-curriculum-review) | Auditing term schemes and lesson-plan drafts for coverage, sequencing, assessment, timing, and readiness gaps. |

## Current governance boundary

- Read school context, school-scoped academic structure, term schemes, and lesson-plan drafts permitted by the signed-in role.
- Write only term-scheme drafts and lesson-plan drafts when `curriculum:write` and the school's active curriculum entitlement both allow it.
- Never trust caller-supplied school, role, persona, permission, or teacher identity as authorization.
- Never read student records or mutate assessments, attendance, enrollment, fees, messaging, accounts, or any other module.
- Never submit, review, approve, publish, archive, or independently delete curriculum through this bundle.
- Treat every save as a mutation. A term-scheme draft save can remove omitted draft rows, so preserve rows unless removal was explicitly requested.

## Validate

```bash
node scripts/validate.mjs
npx skills add . --list
```

Connection guidance and the live capability register are at [schoolane.app/ai/mcp](https://schoolane.app/ai/mcp).

## Release dependency

This bundle accompanies [SchooLane application PR #91](https://github.com/ehimah/K12SchoolAssessmentSystem/pull/91). Keep this PR in draft and do not announce the production connection as available until the server change is deployed and its production OAuth/MCP flow is verified.
