# Lesson-plan document-import tool map

## Scope and source resolution

- `get_my_school_context`: establish the current role, school, OAuth scope, and curriculum draft-write boundary.
- `academics_list_classes`: resolve a class available to the signed-in role.
- `search` and `fetch`: find school-scoped term and subject records when their identifiers are not already available.
- `curriculum_get_term_scheme`: load the editable term-scheme revision, current rows, and real scheme-item ids for the selected class and subject.

## Staged document import

- `curriculum_prepare_lesson_plan_import_draft`
  - Input: permitted term, class, subject, and bounded extracted document text with a filename and optional Word/PDF/plain-text media type.
  - Output: a private import id, proposed strands, likely lesson boundaries, detected objectives, bounded source excerpts, candidate term-scheme rows, and warnings.
  - Requires both `curriculum:read` and `curriculum:write`, plus active curriculum entitlement.
- `curriculum_apply_term_scheme_import_draft`
  - Input: the import id and exact `baseRevision` returned by `curriculum_get_term_scheme`.
  - Output: appended draft rows, skipped duplicates or capacity rows, and the updated term-scheme revision.
  - Requires both `curriculum:read` and `curriculum:write`; it cannot replace existing rows or submit/publish a scheme.
- `curriculum_apply_lesson_plan_import_draft`
  - Input: import id and reviewed lesson drafts, each mapped from a returned source-lesson id to a real in-scope scheme item and class.
  - Content: title, measurable performance indicators, keywords, references, 1–10 phases, assessment, and reflection.
  - Requires `curriculum:write` and active curriculum entitlement. It creates drafts only.

Do not use `curriculum_save_term_scheme_draft` in this import skill: that general operation replaces the full intended row set and is not a safe substitute for the append-only import workflow.
