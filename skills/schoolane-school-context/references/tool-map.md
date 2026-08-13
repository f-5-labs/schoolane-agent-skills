# School context tool map

| Tool | Use | Boundary |
| --- | --- | --- |
| `get_my_school_context` | Resolve the current organization, school, personas, scopes, and curriculum draft capability. | Call first. Server-derived; never override. |
| `academics_list_classes` | List permitted classes, optionally for a known academic year. | Teachers receive assigned classes only. |
| `search` | Find school-scoped classes, terms, subjects, and curriculum knowledge by name. | No student personal data. Query length is 1–200 characters. |
| `fetch` | Read one stable search result. | Use only an id returned by `search`. |

All tools are read-only. This skill never uses either curriculum draft-save tool.
