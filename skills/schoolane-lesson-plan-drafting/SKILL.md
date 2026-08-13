---
name: schoolane-lesson-plan-drafting
description: Write, inspect, create, and revise role-scoped SchooLane lesson-plan drafts for an existing term-scheme item and class assignment. Use when a signed-in teacher or school administrator asks for a measurable lesson plan, lesson phases and timings, classroom activities, resources, assessment, reflection, or a saved lesson-plan draft. Not for term-scheme authoring, lesson delivery records, student observations, curriculum submission, review, approval, publishing, or other school writes.
---

# Draft SchooLane lesson plans

Create an actionable teaching draft grounded in the selected scheme item, class, and active teacher assignment.

Read [tool map](references/tool-map.md) before calling tools.

## Resolve and inspect

1. Call `get_my_school_context` and confirm curriculum reads are available.
2. Use `academics_list_classes`, `search`, and `fetch` to resolve the permitted class, term, subject, and relevant scheme context.
3. Call `curriculum_get_term_scheme` and select an existing scheme item; do not invent a `schemeItemId`.
4. Call `curriculum_list_lesson_plans` with the scheme item and class before drafting. Avoid duplicating an existing lesson number and capture the current plan id/revision when revising.

## Write a teachable plan

1. Give the lesson a concrete title and 1–12 observable, measurable performance indicators.
2. Keep the requested lesson number within the total lesson count.
3. Set 5–240 total minutes and make phase timings realistic. Reconcile phase totals with the lesson duration or explain a deliberate difference before saving.
4. For each phase, specify teacher actions, learner activities, and available resources rather than generic labels.
5. Add concise keywords, references, checks for understanding or assessment, and a useful post-lesson reflection prompt.
6. Follow the scheme's `templateKey` and standards vocabulary. Do not invent official standards or include student personal data.

## Save only a draft

Call `curriculum_save_lesson_plan_draft` only when the user asks to create, draft, revise, or save. Include `planId` and the last returned `baseRevision` when updating. Omit `teacherId` unless an administrator deliberately selected a different established assignment; the server resolves the signed-in teacher or active class-subject assignment and rejects inactive or cross-school assignments.

If the school is read-only, return the proposed plan without retrying a denied write. If a revision conflict occurs, list again and reconcile before another save.

Report the saved plan id, revision, class, lesson number, and that the result remains a draft. Never claim submission, approval, publishing, delivery, or parent communication.

## Example requests

- “Draft lesson 2 on equivalent fractions for my Primary 5 class.”
- “Revise the current plan into a 45-minute inquiry lesson and save the draft.”
- “Add a stronger formative assessment to lesson 1 without changing its scheme item.”
