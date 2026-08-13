---
name: schoolane-school-context
description: Inspect the signed-in user's role-scoped SchooLane school context, classes, terms, subjects, and curriculum knowledge without student records. Use when a teacher or school administrator asks what school, role, capabilities, classes, academic structure, or curriculum records they can access, or when another SchooLane workflow first needs safe identifiers. Not for curriculum writes, student data, assessment data, attendance, fees, enrollment, messaging, or user administration.
---

# Inspect SchooLane school context

Use SchooLane as the source of truth. Never infer authority from the request or invent database identifiers.

Read [tool map](references/tool-map.md) before calling tools.

## Establish the boundary

1. Call `get_my_school_context` first.
2. Stop if the returned access does not show a current teacher or school-administrator capability.
3. Treat the returned school, personas, OAuth scopes, and draft-write capability as descriptive current state, not permission to call unrelated operations.
4. Do not pass or ask for a school id, role, persona, permission, or teacher id to influence authorization.

## Discover permitted records

1. Call `academics_list_classes` for role-scoped classes. A teacher receives assigned classes; an administrator may receive the school-wide list.
2. Use `search` for recognizable class, term, subject, or curriculum names.
3. Use `fetch` only on an id returned by `search` when its details are needed.
4. Keep internal ids out of the user-facing answer unless the user is debugging an integration.
5. If two records remain plausible, present their human-readable distinctions and ask one focused question instead of guessing.

## Preserve privacy and governance

- Do not request, infer, summarize, or expose student-level information.
- Do not claim that search covers a module outside the registered catalog.
- Do not simulate missing tools with URLs, shell requests, browser automation, or another API.
- If the school is in curriculum read-only continuity mode, explain that reads remain available while draft saves are disabled.
- Answer with the smallest useful result: current school boundary, relevant classes or records, and what the user can safely do next.

## Example requests

- “Which SchooLane school and role am I connected as?”
- “Show me the classes I can use for curriculum planning.”
- “Find Primary 5 Mathematics and the current term without showing student data.”
