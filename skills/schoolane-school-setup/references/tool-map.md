# School-setup tool map

Load this reference before using the skill. SchooLane resolves the active school from the OAuth token. Do not send school, role, or teacher identity as authorization.

| Intent | Tool | Access | Required scope |
| --- | --- | --- | --- |
| Confirm active school and `canAdminSchool` | `get_my_school_context` | Read | `school:read` |
| List published setup packs | `school_templates_list` | Read | `school:read` + `operations:read` |
| Apply a pack to the blank current school | `school_templates_apply` | Write | `school:setup` |
| Poll an apply job previously returned to this school | `school_templates_get_apply_job` | Read | `school:read` + `operations:read` |
| List teachers | `staff_list_teachers` | Read | `staff:read` |
| Create a teacher (no password returned) | `staff_create_teacher` | Write | `school:setup` |
| Edit a teacher profile (not email, role, or password) | `staff_update_teacher` | Write | `school:setup` |
| List / create / update STANDARD subjects | `academics_list_subjects`, `academics_create_subject`, `academics_update_subject` | Read / write | `academics:read` / `school:setup` |
| List / create / update years | `academics_list_years`, `academics_create_year`, `academics_update_year` | Read / write | `academics:read` / `school:setup` |
| List / create / update terms | `academics_list_terms`, `academics_create_term`, `academics_update_term` | Read / write | `academics:read` / `school:setup` |
| List / create / update classes | `academics_list_classes`, `academics_create_class`, `academics_update_class` | Read / write | `academics:read` / `school:setup` |
| Assign subject teachers on a class | `academics_assign_class_subjects` | Write | `school:setup` |
| List / create / update assessment templates | `assessments_list_templates`, `assessments_create_template`, `assessments_update_template` | Read / write | `assessments:read` / `school:setup` |
| List / create / update grade schemes | `academics_list_grade_schemes`, `academics_create_grade_scheme`, `academics_update_grade_scheme` | Read / write | `academics:read` / `school:setup` |

`search` and `fetch` cover school-scoped classes and curriculum knowledge. They do not return the global grade-level catalog, so they cannot supply `gradeLevelId` for `academics_create_class`.

## Constraints verified in a live local run

- `school_templates_apply` on a blank school returned a job that reached `completed` after local queue processing. The Basic 1–9 fixture wrote 19 subjects, year `2026/2027` with three terms, default Standard Grading A–F, and the 50/50 TASKS + TERM EXAM template. `plannedClassCount` was 9. Class count stayed 0 until teachers exist.
- `staff_create_teacher` created Better Auth users and returned `passwordIssued: false`.
- `academics_create_class` cannot be completed from tools alone: there is no grade-level list tool, and `search` for “Primary 1” returned `{ results: [] }`.
- `academics_list_classes` is registered, but an array `structuredContent` can be rejected by MCP SDK 1.30 clients. Prefer wrapping consumers that read `items` after the server fix, or treat a client `-32602` on that tool as a transport bug, not a missing class.

## Forbidden names

Never call `staff_delete_teacher`, `academics_delete_class`, `academics_delete_subject`, `assessments_delete_template`, `school_templates_delete`, `staff_set_teacher_password`, `school_seed`, or `school_wipe`.
