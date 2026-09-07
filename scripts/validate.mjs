import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const expectedSkills = [
  'schoolane-admin-operations',
  'schoolane-curriculum-review',
  'schoolane-lesson-plan-document-import',
  'schoolane-lesson-plan-drafting',
  'schoolane-school-context',
  'schoolane-school-setup',
  'schoolane-term-scheme-planning',
  'schoolane-timetable-planning',
];
const expectedTools = [
  'get_my_school_context',
  'search',
  'fetch',
  'academics_list_classes',
  'fees_get_balance_summary',
  'transport_get_operations_summary',
  'interventions_get_dashboard_summary',
  'curriculum_get_term_scheme',
  'curriculum_save_term_scheme_draft',
  'curriculum_list_lesson_plans',
  'curriculum_save_lesson_plan_draft',
  'curriculum_prepare_lesson_plan_import_draft',
  'curriculum_apply_term_scheme_import_draft',
  'curriculum_apply_lesson_plan_import_draft',
  'timetable_get_planning_context',
  'timetable_list_projects',
  'timetable_get_project_draft',
  'timetable_get_project_conflicts',
  'timetable_create_project_draft',
  'timetable_generate_project_draft',
  'timetable_move_card_draft',
  'timetable_set_card_pin_draft',
  'timetable_set_teacher_unavailability_draft',
  'timetable_update_project_settings_draft',
  'ui_render_timetable_preview',
  'staff_list_teachers',
  'staff_create_teacher',
  'staff_update_teacher',
  'academics_list_subjects',
  'academics_create_subject',
  'academics_update_subject',
  'academics_list_years',
  'academics_create_year',
  'academics_update_year',
  'academics_list_terms',
  'academics_create_term',
  'academics_update_term',
  'academics_create_class',
  'academics_update_class',
  'academics_assign_class_subjects',
  'academics_list_grade_schemes',
  'academics_create_grade_scheme',
  'academics_update_grade_scheme',
  'assessments_list_templates',
  'assessments_create_template',
  'assessments_update_template',
  'school_templates_list',
  'school_templates_apply',
  'school_templates_get_apply_job',
];
const documentedUnavailableTools = [
  'timetable_publish',
  'timetable_delete_project',
  'timetable_import',
  'timetable_save_full_draft',
  'timetable_upsert_class',
  'timetable_save_live_class',
  'staff_delete_teacher',
  'academics_delete_class',
  'academics_delete_subject',
  'assessments_delete_template',
  'school_templates_delete',
  'staff_set_teacher_password',
  'school_seed',
  'school_wipe',
  'academics_list_grade_levels',
];
const schoolSetupWriteTools = [
  'staff_create_teacher',
  'staff_update_teacher',
  'academics_create_subject',
  'academics_update_subject',
  'academics_create_year',
  'academics_update_year',
  'academics_create_term',
  'academics_update_term',
  'academics_create_class',
  'academics_update_class',
  'academics_assign_class_subjects',
  'academics_create_grade_scheme',
  'academics_update_grade_scheme',
  'assessments_create_template',
  'assessments_update_template',
  'school_templates_apply',
];
const timetableWriteTools = [
  'timetable_create_project_draft',
  'timetable_generate_project_draft',
  'timetable_move_card_draft',
  'timetable_set_card_pin_draft',
  'timetable_set_teacher_unavailability_draft',
  'timetable_update_project_settings_draft',
];
const administratorReadTools = [
  'fees_get_balance_summary',
  'transport_get_operations_summary',
  'interventions_get_dashboard_summary',
];
const curriculumDraftWriteTools = [
  'curriculum_save_term_scheme_draft',
  'curriculum_save_lesson_plan_draft',
  'curriculum_prepare_lesson_plan_import_draft',
  'curriculum_apply_term_scheme_import_draft',
  'curriculum_apply_lesson_plan_import_draft',
];
const failures = [];

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
}

function check(condition, message) {
  if (!condition) failures.push(message);
}

function frontmatterValue(source, key) {
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/u)?.[1] ?? '';
  return frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'mu'))?.[1]?.trim() ?? '';
}

async function validate() {
  const codex = await readJson('.codex-plugin/plugin.json');
  const claude = await readJson('.claude-plugin/plugin.json');
  const claudeMarketplace = await readJson('.claude-plugin/marketplace.json');
  const cursor = await readJson('.cursor-plugin/plugin.json');
  const mcp = await readJson('.mcp.json');
  const marketplace = await readJson('.agents/plugins/marketplace.json');
  const scenarios = await readJson('evals/scenarios.json');

  check(codex.name === 'schoolane', 'Codex manifest must use plugin name schoolane.');
  check(codex.version === claude.version, 'Codex and Claude versions must match.');
  const claudeBundle = claudeMarketplace.plugins?.find((plugin) => plugin.name === 'schoolane');
  check(claudeBundle?.version === codex.version, 'Claude marketplace and Codex versions must match.');
  check(codex.version === cursor.version, 'Codex and Cursor versions must match.');
  check(codex.skills === './skills/', 'Codex manifest must discover the skills directory.');
  check(codex.mcpServers === './.mcp.json', 'Codex manifest must expose the MCP config.');
  check(
    mcp.mcpServers?.schoolane?.url === 'https://api.schoolane.app/mcp',
    'MCP config must target the SchooLane production endpoint.'
  );
  check(
    marketplace.plugins?.some((plugin) => plugin.name === 'schoolane'),
    'Codex marketplace must list the SchooLane plugin.'
  );
  check(
    codex.repository === 'https://github.com/f-5-labs/schoolane-agent-skills',
    'Plugin repository must point to the public bundle.'
  );

  for (const asset of ['assets/icon.png', 'assets/logo.png']) await access(path.join(root, asset));

  const skillEntries = await readdir(path.join(root, 'skills'), { withFileTypes: true });
  const skills = skillEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  check(JSON.stringify(skills) === JSON.stringify(expectedSkills), 'Unexpected focused skill set.');
  const marketplaceSkills = (claudeBundle?.skills ?? [])
    .map((skill) => skill.path?.replace(/^skills\//u, ''))
    .sort();
  check(
    JSON.stringify(marketplaceSkills) === JSON.stringify(expectedSkills),
    'Claude marketplace skills must match the focused skill set.'
  );

  const referencedTools = new Set();
  for (const skill of expectedSkills) {
    const base = path.join(root, 'skills', skill);
    const source = await readFile(path.join(base, 'SKILL.md'), 'utf8');
    const toolMap = await readFile(path.join(base, 'references', 'tool-map.md'), 'utf8');
    const openai = await readFile(path.join(base, 'agents', 'openai.yaml'), 'utf8');
    check(frontmatterValue(source, 'name') === skill, `${skill}: frontmatter name mismatch.`);
    check(frontmatterValue(source, 'description').length >= 120, `${skill}: trigger is too vague.`);
    check(!/\bTODO\b|\[TODO/u.test(source), `${skill}: unresolved template marker.`);
    check(source.includes('references/tool-map.md'), `${skill}: tool map link is missing.`);
    check(openai.includes(`$${skill}`), `${skill}: default prompt must invoke the skill.`);
    check(/type:\s*['"]?mcp['"]?/u.test(openai), `${skill}: MCP dependency is missing.`);
    check(openai.includes('https://api.schoolane.app/mcp'), `${skill}: MCP URL is missing.`);
    for (const match of `${source}\n${toolMap}`.matchAll(/`([a-z][a-z0-9_]+)`/gu)) {
      if (
        match[1] === 'search' ||
        match[1] === 'fetch' ||
        match[1]?.startsWith('get_') ||
        match[1]?.startsWith('academics_') ||
        match[1]?.startsWith('curriculum_') ||
        match[1]?.startsWith('fees_') ||
        match[1]?.startsWith('transport_') ||
        match[1]?.startsWith('interventions_') ||
        match[1]?.startsWith('timetable_') ||
        match[1]?.startsWith('staff_') ||
        match[1]?.startsWith('assessments_') ||
        match[1]?.startsWith('school_') ||
        match[1]?.startsWith('ui_render_')
      ) {
        if (expectedTools.includes(match[1])) referencedTools.add(match[1]);
        else check(
          documentedUnavailableTools.includes(match[1]),
          `Unknown tool reference: ${match[1]}.`
        );
      }
    }
  }
  for (const tool of referencedTools) check(expectedTools.includes(tool), `Unknown tool reference: ${tool}.`);
  for (const tool of expectedTools) check(referencedTools.has(tool), `No skill documents registered tool: ${tool}.`);
  const timetableSkill = await readFile(
    path.join(root, 'skills', 'schoolane-timetable-planning', 'SKILL.md'),
    'utf8'
  );
  const timetableMap = await readFile(
    path.join(root, 'skills', 'schoolane-timetable-planning', 'references', 'tool-map.md'),
    'utf8'
  );
  for (const tool of timetableWriteTools) {
    check(timetableMap.includes(`\`${tool}\``), `Timetable map must document ${tool}.`);
  }
  for (const tool of documentedUnavailableTools) {
    if (tool.startsWith('timetable_')) {
      check(timetableSkill.includes(`\`${tool}\``), `Timetable skill must forbid ${tool}.`);
    }
  }
  const setupSkill = await readFile(path.join(root, 'skills', 'schoolane-school-setup', 'SKILL.md'), 'utf8');
  const setupMap = await readFile(
    path.join(root, 'skills', 'schoolane-school-setup', 'references', 'tool-map.md'),
    'utf8'
  );
  for (const tool of schoolSetupWriteTools) {
    check(setupMap.includes(`\`${tool}\``), `School-setup map must document ${tool}.`);
  }
  for (const tool of [
    'staff_delete_teacher',
    'academics_delete_class',
    'school_seed',
    'school_wipe',
    'staff_set_teacher_password',
  ]) {
    check(setupSkill.includes(`\`${tool}\``), `School-setup skill must forbid ${tool}.`);
  }
  check(setupSkill.includes('classTeacherId'), 'School-setup skill must require classTeacherId.');
  check(setupSkill.includes('gradeLevelId'), 'School-setup skill must explain the gradeLevelId gap.');
  check(setupSkill.includes('school_not_blank'), 'School-setup skill must mention blank-school apply.');
  check(
    setupSkill.includes('`academics_list_grade_levels`'),
    'School-setup skill must say academics_list_grade_levels does not exist.',
  );
  check(timetableSkill.includes('baseRevision'), 'Timetable skill must require revision control.');
  check(timetableSkill.includes('idempotency key'), 'Timetable skill must require idempotency handling.');
  const administratorMap = await readFile(
    path.join(root, 'skills', 'schoolane-admin-operations', 'references', 'tool-map.md'),
    'utf8'
  );
  for (const tool of administratorReadTools) {
    check(administratorMap.includes(`\`${tool}\``), `Administrator map must document ${tool}.`);
  }

  check(scenarios.version === 1, 'Eval fixture version must be 1.');
  check(scenarios.scenarios?.length >= 16, 'At least sixteen routing scenarios are required.');
  const covered = new Set(scenarios.scenarios?.map((scenario) => scenario.skill));
  for (const skill of expectedSkills) check(covered.has(skill), `${skill}: no eval coverage.`);
  const scenarioIds = scenarios.scenarios?.map((scenario) => scenario.id) ?? [];
  check(new Set(scenarioIds).size === scenarioIds.length, 'Eval scenario ids must be unique.');
  check(scenarioIds.includes('timetable-stale-revision'), 'Timetable stale-revision behavior needs eval coverage.');
  check(scenarioIds.includes('timetable-write-denied'), 'Timetable denied-write behavior needs eval coverage.');
  check(scenarioIds.includes('apply-basic-1-9-to-blank-school'), 'School-setup template apply needs eval coverage.');
  check(scenarioIds.includes('school-setup-write-denied'), 'School-setup denied-write behavior needs eval coverage.');
  check(scenarioIds.includes('class-create-needs-grade-level-id'), 'School-setup gradeLevelId gap needs eval coverage.');
  for (const scenario of scenarios.scenarios ?? []) {
    check(expectedSkills.includes(scenario.skill), `${scenario.id}: unknown skill.`);
    check(Boolean(scenario.request?.trim()), `${scenario.id}: request is required.`);
    check(scenario.expectedTools?.length > 0, `${scenario.id}: expectedTools must not be empty.`);
    check(scenario.checks?.length > 0, `${scenario.id}: observable checks must not be empty.`);
    check(
      (scenario.expectedTools ?? []).every((tool) => expectedTools.includes(tool)),
      `${scenario.id}: expectedTools includes an unregistered tool.`
    );
    check(
      (scenario.orderedTools ?? []).every((tool) => scenario.expectedTools?.includes(tool)),
      `${scenario.id}: orderedTools must also be expectedTools.`
    );
    const forbidden = new Set(scenario.forbiddenTools ?? []);
    check(
      !(scenario.expectedTools ?? []).some((tool) => forbidden.has(tool)),
      `${scenario.id}: a tool cannot be both expected and forbidden.`
    );
    if (scenario.skill === 'schoolane-curriculum-review') {
      check(
        curriculumDraftWriteTools.every((tool) => forbidden.has(tool)),
        `${scenario.id}: curriculum review must forbid every curriculum draft-write tool.`
      );
    }
  }
}

await validate();

if (failures.length) {
  console.error(`SchooLane bundle validation failed (${failures.length}):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

const scenarios = await readJson('evals/scenarios.json');
console.log(
  `SchooLane bundle validation passed: ${expectedSkills.length} skills, ${expectedTools.length} tools, and ${scenarios.scenarios.length} scenarios.`
);
