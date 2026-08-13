---
name: schoolane-curriculum-review
description: Audit role-scoped SchooLane term schemes and lesson-plan drafts for coverage, sequence, dates, standards grounding, teaching time, measurable outcomes, activities, assessment, and readiness gaps without changing records. Use when a teacher or school administrator asks to review, critique, compare, quality-check, find missing weeks or lessons, or prepare curriculum feedback. Not for saving drafts, formal curriculum review or approval actions, publishing, delivery tracking, or student-level analysis.
---

# Review SchooLane curriculum

Produce an evidence-backed curriculum audit without mutating SchooLane.

Read [tool map](references/tool-map.md) before calling tools.

## Establish evidence

1. Call `get_my_school_context` first.
2. Resolve one permitted class with `academics_list_classes` and use `search` or `fetch` for the relevant term and subject.
3. Call `curriculum_get_term_scheme` for the exact scope.
4. Call `curriculum_list_lesson_plans` for relevant scheme items and the class when lesson readiness is in scope.
5. Distinguish confirmed SchooLane data from assumptions or recommendations.

## Audit a term scheme

Check:

- missing, duplicate, or implausibly ordered weeks;
- dates outside the term, inverted date ranges, and likely scheduling gaps;
- sequence continuity, unit transitions, and period allocation;
- empty or vague unit labels, notes, standards, or framework fields;
- rows with no lesson plans, while avoiding claims that a draft is formally unready unless the returned evidence supports that conclusion;
- chain status, editability, and revision so feedback is tied to a specific snapshot.

## Audit lesson-plan drafts

Check:

- duplicate or missing lesson numbers within the declared lesson count;
- measurable performance indicators aligned to the scheme context;
- phase timings versus total duration;
- concrete teacher actions, learner activities, differentiation opportunities, and feasible resources;
- assessment evidence and reflection prompts;
- status and revision, without treating a draft as approved or delivered.

## Report findings

Prioritize findings as blocker, important, or improvement. For each, identify the scheme row or lesson by human-readable name/number, cite the observed evidence, explain the teaching risk, and suggest a bounded correction. Keep internal ids out of the narrative unless requested.

This skill is read-only. Never call either `curriculum_save_*` tool, even when the user asks to “fix” findings; route an explicit save request to the focused planning or drafting skill.

## Example requests

- “Audit Term 2 Mathematics for missing weeks and weak assessment coverage.”
- “Compare the lesson drafts for this scheme item and flag timing problems.”
- “Give me a prioritized curriculum readiness review without changing anything.”
