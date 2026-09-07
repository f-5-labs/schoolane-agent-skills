---
name: schoolane-school-setup
description: Set up a blank SchooLane school's academic structure and staff through school-admin MCP tools after a published template apply. Use when a current school administrator asks to apply Basic 1–9, create teachers, create classes, assign subject teachers, or finish Ghana-style structure without deleting records, minting passwords, or seeding demo people.
---

# Set up a SchooLane school

Use SchooLane as the source of truth. This skill writes school-admin setup records only. It does not seed demo people and it cannot delete anything.

Read [tool map](references/tool-map.md) before calling tools.

## Establish authority

1. Call `get_my_school_context` first.
2. Continue only when the caller is a current school administrator (`canAdminSchool`) for the active school. Teachers and parents cannot use these tools.
3. School-setup writes also need the `school:setup` OAuth scope. If a write says the connection is missing `school:setup`, stop and ask the human to reconnect and approve “Set up your school.”
4. Never pass `schoolId`, `organizationId`, `role`, `persona`, `permissionKeys`, or `teacherIdentity`. SchooLane rejects those authority keys.

## Preferred bootstrap

Prefer a published pack over dozens of one-off creates.

1. Call `school_templates_list`. Use the published `basic-1-9` pack for Ghana Basic 1–9 (Primary 1–6 and JHS 1–3).
2. Apply only to a **blank** school (no years, subjects, classes, or assessment templates). Call `school_templates_apply` with `templateId`, `yearName` such as `2026/2027`, and `yearStartDate` as `YYYY-MM-DD`.
3. Poll `school_templates_get_apply_job` until completed or failed. A second apply on a non-blank school fails with the blank-school error school_not_blank.
4. The v1 pack writes structure only: activity categories, Standard Grading A–F, the 50/50 TASKS + TERM EXAM template, about 19 subjects, level-subject links, and a three-term Ghana year. It does **not** create classes, teachers, students, or passwords. `plannedClassCount` is a reminder, not created rows.

If the school already has a year or subjects, do not apply. Inspect with the list tools and create only the missing staff and classes.

## Teachers, then classes

1. Call `staff_list_teachers`. If the roster is empty, call `staff_create_teacher` for each real staff email. Required: `firstName`, `lastName`, `email`. Do not send or expect a password. The result includes `passwordIssued: false`; the teacher uses forgot-password or a magic link.
2. Confirm the pack with `academics_list_years`, `academics_list_terms`, `academics_list_subjects`, `academics_list_grade_schemes`, and `assessments_list_templates`.
3. `academics_create_class` requires `name`, `academicYearId`, `gradeLevelId`, and `classTeacherId`. Get the year id from `academics_list_years` and the teacher id from `staff_list_teachers` or `staff_create_teacher`.
4. There is **no** grade-level directory tool. `academics_list_grade_levels` does not exist. Global grade levels are not returned by `search` (a “Primary 1” search returns no knowledge hits). If the user does not already have a gradeLevelId from SchooLane, stop and say class creation cannot be finished from MCP alone. Do not invent an id.
5. After a class exists, call `academics_assign_class_subjects` with `{ classId, subjects: [{ subjectId, teacherId }] }`. The call upserts those pairs and does not remove omitted subjects.

Create tools are not idempotent. Repeating `staff_create_teacher` or `academics_create_subject` can fail with `already exists` on email or subject code.

## Hard boundaries

Never call or imply `staff_delete_teacher`, `academics_delete_class`, `academics_delete_subject`, `assessments_delete_template`, `school_templates_delete`, `staff_set_teacher_password`, `school_seed`, or `school_wipe`. There are no delete tools.

Do not use `POST /api/system/schools/:id/seed`. That HTTP path is a system-admin overlay for `isDemo` schools (fake teachers, students, scores, attendance). MCP does not replace it.

Do not create students, parents, enrollments, attendance, fees, messages, or account roles. Do not author or publish template packs (`SaveSchoolTemplateDraft` stays system-admin HTTP).

## Example requests

- “Apply the Basic 1–9 template to this blank school for 2026/2027 starting 1 September.”
- “The template finished. Create these four teachers, then make Primary 1 A once we have a grade level id.”
- “Assign Numeracy and Science teachers on the class we just created. Do not delete anything.”
