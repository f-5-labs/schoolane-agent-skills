---
name: schoolane-term-scheme-planning
description: Review, create, and revise role-scoped SchooLane term-scheme drafts with whole-term sequencing and optimistic revision control. Use when a signed-in teacher or school administrator asks to plan a term, revise teaching weeks, preserve framework standards, change dates or periods, or save a term-scheme draft. Not for lesson-plan drafting, curriculum submission or publishing, standalone deletion, or writes outside curriculum drafts.
---

# Plan SchooLane term schemes

Build a coherent whole-term teaching sequence without bypassing SchooLane authorization or human governance.

Read [tool map](references/tool-map.md) before calling tools.

## Resolve the scope

1. Call `get_my_school_context` and confirm that curriculum reads are available.
2. Use `academics_list_classes`, `search`, and `fetch` to resolve one permitted class, term, and subject.
3. Use only identifiers returned by SchooLane or supplied unambiguously by the user.
4. Call `curriculum_get_term_scheme` before planning any save.

## Review the current draft

Check the returned scope, term dates, chain status and revision, editability, existing rows, week order, dates, expected periods, template key, standards, notes, and lesson-plan counts. Flag ambiguities that materially affect the plan, such as unknown holidays, framework vocabulary, contact periods, or required units.

Do not save when `isEditable` is false or `connection.curriculumDraftWritesEnabled` is false. Continue with a useful review instead.

## Create or revise the whole term

1. Preserve useful existing row ids, teaching content, standards, notes, and ordering.
2. Keep week numbers between 1 and 60 and planned dates inside the term.
3. Give each row an explicit non-negative `sequenceOrder`, 1–30 expected periods, and a recognized or school-provided lowercase template key.
4. Preserve framework-specific standard fields as data; do not translate or invent official standard codes.
5. Treat the `rows` input as the complete intended draft. Omitted unlinked draft rows may be removed.
6. Include the last returned chain revision as `baseRevision`.

## Save only on authorization

Call `curriculum_save_term_scheme_draft` only when the user asked to create, draft, revise, or save. After saving, report the new revision and a compact summary of changed, added, and intentionally removed rows. If SchooLane reports a conflict, reload with `curriculum_get_term_scheme`; never retry with a guessed revision.

Never claim the scheme was submitted, reviewed, published, archived, or delivered. Those actions are deliberately unavailable.

## Example requests

- “Review Primary 5 Mathematics for Term 2 and flag sequencing gaps.”
- “Spread these objectives across ten teaching weeks and save a draft.”
- “Move fractions to week 4 but preserve the rest of the current scheme.”
