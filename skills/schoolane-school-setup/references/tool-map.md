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
| List global grade levels (`id`, `name`, `levelNumber`) | `academics_list_grade_levels` | Read | `academics:read` |
| List / create / update classes | `academics_list_classes`, `academics_create_class`, `academics_update_class` | Read / write | `academics:read` / `school:setup` |
| Assign subject teachers on a class | `academics_assign_class_subjects` | Write | `school:setup` |
| List / create / update assessment templates | `assessments_list_templates`, `assessments_create_template`, `assessments_update_template` | Read / write | `assessments:read` / `school:setup` |
| List / create / update grade schemes | `academics_list_grade_schemes`, `academics_create_grade_scheme`, `academics_update_grade_scheme` | Read / write | `academics:read` / `school:setup` |

`search` and `fetch` cover school-scoped classes and curriculum knowledge. They do not return the global grade-level catalog. Use `academics_list_grade_levels` for `gradeLevelId`.

List tools return `data: { items, nextCursor }`. Never treat `structuredContent` as a bare array.

## Production safety

Use localhost MCP and `*@schoolane.test` (or other local synthetic users) only. Never authenticate as a live Royal Diadem / RDS admin, teacher, or parent, and never trigger OTP email to a real inbox.

## Constraints from local setup

- `school_templates_apply` on a blank school writes structure only: subjects, year/terms, Standard Grading, and the 50/50 template. `plannedClassCount` is a reminder; classes stay 0 until teachers and `academics_create_class`.
- `staff_create_teacher` creates Better Auth users and returns `passwordIssued: false`.
- `academics_list_grade_levels` is the directory for `gradeLevelId`. Create, edit, and delete of grade levels stay off MCP.
- `assessments_list_templates` includes `nodeCount` for the template tree.

## Forbidden names

Never call `staff_delete_teacher`, `academics_delete_class`, `academics_delete_grade_level`, `academics_delete_subject`, `assessments_delete_template`, `school_templates_delete`, `staff_set_teacher_password`, `school_seed`, or `school_wipe`.
