---
name: schoolane-admin-operations
description: Review aggregate SchooLane fee-balance, transport-readiness, and intervention-workload summaries for the signed-in school administrator. Use for operational health checks and prioritization that must not expose student rows, payment account details, addresses, live locations, case notes, or any write capability.
---

# Review SchooLane administration operations

Use SchooLane as the source of truth. This skill is read-only and aggregate-only.

Read [tool map](references/tool-map.md) before calling tools.

## Establish the boundary

1. Call `get_my_school_context` first.
2. Continue only for a current school administrator with the relevant `operations:read` scope and active module capability.
3. Never pass or infer a school id, role, permission, student, account, driver, or case identity to widen access.
4. If a tool is not advertised, explain that the role, consent, or school capability does not currently allow that view. Do not work around discovery.

## Build the operational view

- Use `fees_get_balance_summary` for current- or selected-term outstanding totals and configuration counts.
- Use `transport_get_operations_summary` for subscription, route, stop, assignment, and driver counts.
- Use `interventions_get_dashboard_summary` for current- or selected-term workflow and overdue-review counts.
- Call only the domains relevant to the request. For a broad administrator brief, group results by urgency and state which term each term-scoped result covers.
- Treat currency totals and intervention workload as sensitive aggregate data. Report useful totals without attempting to identify the people behind them.

## Preserve governance

- Do not request or expose student balance rows, names, payment account details, addresses, driver contact details, live locations, intervention cases, notes, or support plans.
- Do not create charges, record payments, change routes or subscriptions, assign drivers, open or update interventions, or simulate those missing writes through another interface.
- Do not present counts as proof that an individual is at fault. Use them to identify an administrator follow-up area.
- If the user needs person-level investigation or a mutation, link them to the returned SchooLane page and state that the action must be completed under SchooLane's normal UI permissions.

## Example requests

- “Give me a read-only admin health check for fees, transport, and student support.”
- “How many active transport subscriptions and routes do we have?”
- “Show the current-term intervention workload without student names or case notes.”
