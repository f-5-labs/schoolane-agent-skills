# Lesson-plan tool map

## Discovery and context

- `get_my_school_context`: call first; check role and draft-write capability.
- `academics_list_classes`: resolve a permitted class.
- `search` and `fetch`: resolve school-scoped term and subject records.
- `curriculum_get_term_scheme`: resolve a real scheme item and its framework context.

## Lesson plans

- `curriculum_list_lesson_plans`
  - Input: `schemeItemId`; include `classId` for a precise result and always for teachers.
  - Output: existing plan ids, lesson numbers, revisions, statuses, durations, and content.
- `curriculum_save_lesson_plan_draft`
  - Input: optional `planId`, `schemeItemId`, `classId`, optional administrator-selected `teacherId`, lesson number/count, duration, template key, optional `baseRevision`, and content.
  - Content: title, performance indicators, keywords, references, 1–10 phases, assessment, and reflection.
  - Requires `curriculum:write` and active curriculum write entitlement.
  - This is a mutation but cannot submit, approve, or publish.

There is no generation tool: compose the draft in the agent, then save only with user authorization.
