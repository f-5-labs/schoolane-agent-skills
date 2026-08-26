# SchooLane agent skills

[![Validate](https://github.com/f-5-labs/schoolane-agent-skills/actions/workflows/validate.yml/badge.svg)](https://github.com/f-5-labs/schoolane-agent-skills/actions/workflows/validate.yml)

Role-aware school context, aggregate administration reviews, curriculum review, document-guided lesson planning, and governed timetable drafting through [SchooLane](https://schoolane.app). The bundle connects an agent to the authenticated SchooLane MCP server and adds focused skills for the available governed operations.

> Release dependency: administrator operations, lesson-document import, and timetable drafting each require their corresponding SchooLane MCP application release. Do not merge or announce these capabilities until the server change is deployed and its production OAuth/MCP flow is verified.

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
| [`schoolane-admin-operations`](./skills/schoolane-admin-operations) | Reviewing aggregate fee, transport, and intervention workload without person-level data or writes. |
| [`schoolane-term-scheme-planning`](./skills/schoolane-term-scheme-planning) | Reviewing, creating, and revising whole-term scheme drafts with optimistic revision control. |
| [`schoolane-lesson-plan-drafting`](./skills/schoolane-lesson-plan-drafting) | Writing and saving class-assignment-scoped lesson-plan drafts for human review. |
| [`schoolane-lesson-plan-document-import`](./skills/schoolane-lesson-plan-document-import) | Reading an attached term lesson-plan document, proposing strands and mappings, then creating only reviewed curriculum drafts. |
| [`schoolane-curriculum-review`](./skills/schoolane-curriculum-review) | Auditing term schemes and lesson-plan drafts for coverage, sequencing, assessment, timing, and readiness gaps. |
| [`schoolane-timetable-planning`](./skills/schoolane-timetable-planning) | Preparing and revising unpublished, school-wide timetable drafts without publish or live-timetable authority. |

## Current governance boundary

- Read school context, school-scoped academic structure, term schemes, and lesson-plan drafts permitted by the signed-in role.
- Read aggregate fee-balance, transport-readiness, and intervention-workload summaries only for a current school administrator with `operations:read` and the active module capability.
- Write term-scheme and lesson-plan drafts only when `curriculum:write` and the school's active curriculum entitlement both allow it. Document import additionally requires `curriculum:read`, an active teacher assignment or school-administrator role, and explicit review before the append-only scheme and lesson-plan draft steps.
- Write unpublished timetable drafts only when the caller is a current school administrator, `timetable:write` is consented, and the school's timetable capability is active.
- Never trust caller-supplied school, role, persona, permission, or teacher identity as authorization.
- Never expose person-level fee, transport, or intervention data, and never mutate assessments, attendance, enrollment, fees, transport, interventions, messaging, accounts, or any other administration module.
- Never submit, review, approve, publish, archive, or independently delete curriculum through this bundle. Never publish, delete, import, replace in full, or write a live timetable. Lesson-document imports are private, time-limited staging records, not a general file store.
- Treat every save as a mutation. A term-scheme draft save can remove omitted draft rows, so preserve rows unless removal was explicitly requested.

## Validate

```bash
node scripts/validate.mjs
npx skills add . --list
```

Connection guidance and the live capability register are at [schoolane.app/ai/mcp](https://schoolane.app/ai/mcp).

## Release dependency

Keep this PR in draft and do not announce lesson-document import or timetable capability as available until the corresponding server change is deployed and its production OAuth/MCP flow is verified.
