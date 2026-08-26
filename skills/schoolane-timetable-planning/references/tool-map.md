# Timetable-planning tool map

## Read and preview

- `get_my_school_context`: call first; verify the current school, school-administrator role, and current timetable capability boundary.
- `timetable_get_planning_context`
  - Input: `academicYearId`, `termId`, optional `includedGradeLevelIds`.
  - Output: bounded planning counts, shared-teacher summaries, and default bell schedule metadata.
- `timetable_list_projects`
  - Input: `academicYearId`, `termId`, optional cursor and limit.
  - Output: project summaries and each draft revision; no R2 storage keys.
- `timetable_get_project_draft`
  - Input: `academicYearId`, `termId`, `projectId`, optional bounded class or teacher view.
  - Output: project status, revision, counts, and a bounded card view.
- `timetable_get_project_conflicts`
  - Input: `academicYearId`, `termId`, `projectId`, optional conflict type, cursor and limit.
  - Output: bounded teacher-collision and unplaced-activity rows.
- `ui_render_timetable_preview`: render the current draft and conflicts when the MCP host supports apps. It is a preview, not a publish control.

## Draft writes

Every operation below requires server-resolved school-administrator access, `timetable:write`, an active timetable entitlement, and an `idempotencyKey`. Existing-project writes also require the exact `baseRevision` returned by `timetable_get_project_draft`.

- `timetable_create_project_draft`
  - Input: `academicYearId`, `termId`, `name`, optional `includedGradeLevelIds`, `idempotencyKey`.
  - Creates only status `draft`; returns project id, revision, and conflict summary.
- `timetable_generate_project_draft`
  - Input: `academicYearId`, `termId`, `projectId`, `baseRevision`, `idempotencyKey`.
  - Runs the deterministic scheduler. Never submit generated cards directly.
- `timetable_move_card_draft`
  - Input: `academicYearId`, `termId`, `projectId`, `baseRevision`, `cardId`, `targetDayId`, `targetSlotId`, `idempotencyKey`.
  - Moves one unpinned lesson after class, teacher, double-period, and availability validation.
- `timetable_set_card_pin_draft`
  - Input: `academicYearId`, `termId`, `projectId`, `baseRevision`, `cardId`, `pinned`, `idempotencyKey`.
  - Pins or unpins one existing lesson.
- `timetable_set_teacher_unavailability_draft`
  - Input: `academicYearId`, `termId`, `projectId`, `baseRevision`, `teacherId`, `dayId`, `slotId`, `unavailable`, `idempotencyKey`.
  - Adds or removes one unavailable teaching slot for a teacher participating in the project.
- `timetable_update_project_settings_draft`
  - Input: `academicYearId`, `termId`, `projectId`, `baseRevision`, `changes`, `idempotencyKey`.
  - `changes` can contain only project name, included grade levels, or a complete valid bell schedule. Inclusion or bell changes clear placements and require a fresh generate.

There is no timetable publish, delete, import, full-draft replacement, or live-class write tool.
