import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const expectedSkills = [
  'schoolane-curriculum-review',
  'schoolane-lesson-plan-drafting',
  'schoolane-school-context',
  'schoolane-term-scheme-planning',
];
const expectedTools = [
  'get_my_school_context',
  'search',
  'fetch',
  'academics_list_classes',
  'curriculum_get_term_scheme',
  'curriculum_save_term_scheme_draft',
  'curriculum_list_lesson_plans',
  'curriculum_save_lesson_plan_draft',
];
const saveTools = expectedTools.filter((tool) => tool.startsWith('curriculum_save_'));
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
        match[1]?.startsWith('curriculum_')
      ) {
        referencedTools.add(match[1]);
      }
    }
  }
  for (const tool of referencedTools) check(expectedTools.includes(tool), `Unknown tool reference: ${tool}.`);
  for (const tool of expectedTools) check(referencedTools.has(tool), `No skill documents registered tool: ${tool}.`);

  check(scenarios.version === 1, 'Eval fixture version must be 1.');
  check(scenarios.scenarios?.length >= 16, 'At least sixteen routing scenarios are required.');
  const covered = new Set(scenarios.scenarios?.map((scenario) => scenario.skill));
  for (const skill of expectedSkills) check(covered.has(skill), `${skill}: no eval coverage.`);
  const scenarioIds = scenarios.scenarios?.map((scenario) => scenario.id) ?? [];
  check(new Set(scenarioIds).size === scenarioIds.length, 'Eval scenario ids must be unique.');
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
        saveTools.every((tool) => forbidden.has(tool)),
        `${scenario.id}: curriculum review must forbid both draft-save tools.`
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
