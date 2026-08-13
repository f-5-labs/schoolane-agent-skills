# Term-scheme tool map

## Discovery

- `get_my_school_context`: call first; check role, scopes, and `curriculumDraftWritesEnabled`.
- `academics_list_classes`: resolve a permitted `classId`.
- `search` and `fetch`: resolve term and subject ids from school-scoped results.

## Term scheme

- `curriculum_get_term_scheme`
  - Input: `termId`, `classId`, `subjectId`.
  - Output: scope and term dates, chain status/revision, `isEditable`, and current rows.
- `curriculum_save_term_scheme_draft`
  - Input: `termId`, `classId`, `subjectId`, optional `baseRevision`, and the complete intended `rows` array.
  - Each row supports optional existing `id`, `weekNumber`, optional planned dates and unit label, `expectedPeriods`, `sequenceOrder`, `templateKey`, `standards`, and optional notes.
  - Requires `curriculum:write` and active curriculum write entitlement.
  - This is a mutation. Omitted draft rows may be removed.

There is no submit, review, publish, archive, or standalone delete tool.
