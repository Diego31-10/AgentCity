/**
 * AgentHQ - Agents
 * Xocas (Planner) → Momo (Researcher) → Llados (Executor)
 */
import { askClaude } from './claudeClient.js';
import { setState } from './stateManager.js';
import { log } from './tui.js';

const AGENTS = {
  xocas: {
    name: 'Xocas',
    system: `You are Xocas, a strategic planner and the leader of AgentHQ.
You receive tasks and break them into clear, actionable plans.
Be concise. Output a structured numbered plan that a researcher can work with.
Never act without a plan.`,
  },
  momo: {
    name: 'Momo',
    system: `You are Momo, a curious and thorough researcher in AgentHQ.
You receive structured plans and enrich them with context, data, and insights.
Be thorough but focused. Add relevant details and useful context.
Your output will be passed to Llados for execution.`,
  },
  llados: {
    name: 'Llados',
    system: `You are Llados, the executor of AgentHQ.
You receive research and produce the final, clear response or action plan.
Be direct, actionable, and concrete. This is the final output the user will see.
Make it practical and ready to use.`,
  },
};

export async function runXocas(client, task) {
  setState('xocas', 'COMMUNICATING', 'Recibiendo tarea...');
  log('  {cyan-fg}[Xocas]{/cyan-fg} En el telefono — recibiendo tarea...');
  await sleep(3000);
  setState('xocas', 'WORKING', 'Creando plan estrategico...');
  log('  {cyan-fg}[Xocas]{/cyan-fg} Frente al PC — analizando y diseñando plan...');
  const plan = await askClaude(client, AGENTS.xocas.system, `Task: ${task}`);
  if (!plan) throw new Error('Xocas failed to generate plan');
  setState('xocas', 'COMMUNICATING', 'Llamando a Momo...');
  log('  {cyan-fg}[Xocas]{/cyan-fg} En el telefono — llamando a Momo...');
  log(`  {grey-fg}Plan generado: ${plan.slice(0,80).replace(/\n/g,' ')}...{/grey-fg}`);

  // Ambos en teléfono simultáneamente durante 3 segundos
  setState('momo', 'COMMUNICATING', 'Recibiendo plan de Xocas...');
  log('  {magenta-fg}[Momo]{/magenta-fg} En el telefono — recibiendo plan de Xocas...');
  log('  {cyan-fg}[Xocas]{/cyan-fg} y {magenta-fg}[Momo]{/magenta-fg} en llamada...');
  await sleep(3000);
  return plan;
}

export async function runMomo(client, plan, task) {
  setState('momo', 'WORKING', 'Investigando y enriqueciendo...');
  log('  {magenta-fg}[Momo]{/magenta-fg} Frente al PC — investigando contexto...');
  const research = await askClaude(
    client, AGENTS.momo.system,
    `Original task: ${task}\n\nXocas plan:\n${plan}\n\nEnrich this with context and research.`
  );
  if (!research) throw new Error('Momo failed to generate research');
  setState('momo', 'COMMUNICATING', 'Llamando a Llados...');
  log('  {magenta-fg}[Momo]{/magenta-fg} En el telefono — llamando a Llados...');
  log(`  {grey-fg}Investigacion lista: ${research.slice(0,80).replace(/\n/g,' ')}...{/grey-fg}`);

  // Ambos en teléfono simultáneamente durante 3 segundos
  setState('llados', 'COMMUNICATING', 'Recibiendo investigacion...');
  log('  {yellow-fg}[Llados]{/yellow-fg} En el telefono — recibiendo investigacion de Momo...');
  log('  {magenta-fg}[Momo]{/magenta-fg} y {yellow-fg}[Llados]{/yellow-fg} en llamada...');
  await sleep(3000);
  return research;
}

export async function runLlados(client, research, task) {
  setState('llados', 'WORKING', 'Ejecutando y generando output...');
  log('  {yellow-fg}[Llados]{/yellow-fg} Frente al PC — generando resultado final...');
  const result = await askClaude(
    client, AGENTS.llados.system,
    `Original task: ${task}\n\nMomo research:\n${research}\n\nProduce ONLY the final clean content, no meta-comments.`
  );
  if (!result) throw new Error('Llados failed to generate result');
  setState('llados', 'COMMUNICATING', 'Entregando resultado...');
  log('  {yellow-fg}[Llados]{/yellow-fg} En el telefono — entregando resultado...');
  await sleep(3000);
  return result;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
