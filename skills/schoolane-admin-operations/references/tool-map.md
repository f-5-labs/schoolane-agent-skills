# Administrator operations tool map

| Tool | Use | Boundary |
| --- | --- | --- |
| `get_my_school_context` | Resolve the current school, role, scopes, and active capabilities. | Call first; server-derived and never overridden. |
| `fees_get_balance_summary` | Read term, currency, outstanding-row/student totals, total outstanding, and active configuration counts. | School administrators only; no student rows, names, or payment account details. |
| `transport_get_operations_summary` | Read aggregate subscription, route, stop, assigned-student, and driver counts. | School administrators only; no names, addresses, contact details, or live locations. |
| `interventions_get_dashboard_summary` | Read term-scoped intervention workflow and overdue-review counts. | School administrators only; no student, staff, case-note, or support-plan details. |

All tools in this skill are read-only. `termId` is optional for term-scoped tools; when omitted, SchooLane resolves the current term server-side.
