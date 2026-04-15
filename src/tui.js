/**
 * AgentHQ TUI v2 - blessed full interactive dashboard
 * Agentes con representacion grafica por estado
 */
import blessed from 'blessed';
import { getStates } from './stateManager.js';

let screen, agentPanels, logBox, taskBox, statusBar;

// ASCII art por estado
const ART = {
  xocas: {
    IDLE: [
      '   .--.',
      '  (x  x)  zzz',
      '   \\--/',
      '  _/|  |\\_',
      ' [__|  |__]',
      '   [____]',
      '  ~SOFA~',
    ],
    WORKING: [
      '   .--.',
      '  (^  ^)',
      '   \\--/',
      '  ->|  |  [=]',
      ' [__|  |__||]',
      '   [____]',
      '  ~PC~',
    ],
    COMMUNICATING: [
      '   .--.',
      '  (o  o) )))',
      '   \\--/',
      '  /|  |c',
      ' [_|  |_]',
      '  [____]',
      '  ~PHONE~',
    ],
  },
};
// Momo y Llados comparten la misma forma
ART.momo = ART.xocas;
ART.llados = ART.xocas;

const STATE_COLOR = {
  IDLE: 'yellow',
  WORKING: 'green',
  COMMUNICATING: 'cyan',
};

const STATE_LABEL = {
  IDLE:          '  [ IDLE - En el sofa ]',
  WORKING:       '  [ WORKING - En el PC ]',
  COMMUNICATING: '  [ COMM  - Al telefono ]',
};

function buildAgentContent(agentId, info) {
  const { state, task } = info;
  const art = ART[agentId]?.[state] || ART.xocas.IDLE;
  const color = STATE_COLOR[state] || 'white';
  const label = STATE_LABEL[state] || '';

  const lines = [
    '',
    ...art.map(l => `  {${color}-fg}${l}{/${color}-fg}`),
    '',
    `{${color}-fg}${label}{/${color}-fg}`,
    '',
    `  {grey-fg}${task}{/grey-fg}`,
  ];
  return lines.join('\n');
}

export function initTUI() {
  screen = blessed.screen({ smartCSR: true, title: 'AgentHQ', fullUnicode: false });

  // HEADER
  const header = blessed.box({
    top: 0, left: 0, width: '100%', height: 3,
    content: '{center}{bold}{cyan-fg}=== AGENTHQ  -  Multi-Agent Dashboard ==={/cyan-fg}{/bold}{/center}',
    tags: true,
    border: { type: 'line' },
    style: { border: { fg: 'cyan' } },
  });

  // AGENT PANELS (3 cols, tall)
  const agents = [
    { id: 'xocas',  label: ' XOCAS - Planner ',    left: '0%',   width: '33%' },
    { id: 'momo',   label: ' MOMO  - Researcher ', left: '33%',  width: '34%' },
    { id: 'llados', label: ' LLADOS - Executor ',  left: '67%',  width: '33%' },
  ];

  agentPanels = {};
  agents.forEach(({ id, label, left, width }) => {
    const panel = blessed.box({
      top: 3, left, width, height: 16,
      label: `{bold}{white-fg}${label}{/white-fg}{/bold}`,
      tags: true,
      border: { type: 'line' },
      style: { border: { fg: 'yellow' } },
      content: buildAgentContent(id, { state: 'IDLE', task: 'Waiting...' }),
    });
    agentPanels[id] = panel;
    screen.append(panel);
  });

  // TASK BOX
  taskBox = blessed.box({
    top: 19, left: 0, width: '100%', height: 3,
    label: ' {bold}Task{/bold} ',
    tags: true,
    border: { type: 'line' },
    style: { border: { fg: 'white' } },
    content: '  Waiting for input...',
  });

  // LOG BOX
  logBox = blessed.log({
    top: 22, left: 0, width: '100%', height: '100%-23',
    label: ' {bold}Pipeline Log{/bold} ',
    tags: true,
    border: { type: 'line' },
    style: { border: { fg: 'magenta' } },
    scrollable: true,
    alwaysScroll: true,
    mouse: true,
    scrollbar: { ch: ' ', style: { bg: 'magenta' } },
  });

  // STATUS BAR
  statusBar = blessed.box({
    bottom: 0, left: 0, width: '100%', height: 1,
    content: ' {grey-fg}[Q] Salir   [Arrows] Scroll{/grey-fg}',
    tags: true,
    style: { bg: 'black', fg: 'grey' },
  });

  screen.append(header);
  screen.append(taskBox);
  screen.append(logBox);
  screen.append(statusBar);
  screen.key(['q', 'C-c'], () => process.exit(0));
  screen.render();
}

export function getTaskFromTUI() {
  return new Promise((resolve) => {
    // Input box encima del log
    const inputBox = blessed.textbox({
      bottom: 1, left: 0, width: '100%', height: 3,
      label: ' {bold}{cyan-fg}Ingresa tu tarea y presiona Enter:{/cyan-fg}{/bold} ',
      tags: true,
      border: { type: 'line' },
      style: { border: { fg: 'cyan' }, focus: { border: { fg: 'white' } } },
      inputOnFocus: true,
    });

    screen.append(inputBox);
    inputBox.focus();
    screen.render();

    inputBox.on('submit', (value) => {
      screen.remove(inputBox);
      resolve(value.trim());
      screen.render();
    });
  });
}

export function updateAgents() {
  if (!screen) return;
  const states = getStates();
  for (const [id, info] of Object.entries(states)) {
    const panel = agentPanels[id];
    if (!panel) continue;
    panel.setContent(buildAgentContent(id, info));
    panel.style.border.fg = STATE_COLOR[info.state] || 'yellow';
  }
  screen.render();
}

export function setTask(task) {
  if (!taskBox) return;
  taskBox.setContent(`  {white-fg}${task}{/white-fg}`);
  screen.render();
}

export function log(msg) {
  if (!logBox) return;
  logBox.log(msg);
  screen.render();
}

export function showDone(filepath) {
  if (!logBox) return;
  logBox.log('');
  logBox.log('{green-fg}============================================================{/green-fg}');
  logBox.log('{bold}{green-fg}  PIPELINE COMPLETADO{/green-fg}{/bold}');
  logBox.log('{green-fg}============================================================{/green-fg}');
  if (filepath) {
    logBox.log('');
    logBox.log('{white-fg}  Archivo guardado en:{/white-fg}');
    logBox.log(`{bold}{cyan-fg}  ${filepath}{/cyan-fg}{/bold}`);
  }
  logBox.log('');
  logBox.log('{grey-fg}  Presiona Q para salir{/grey-fg}');
  screen.render();
}

export function startLive(task) {
  setTask(task);
  const interval = setInterval(updateAgents, 150);
  return {
    log,
    showDone,
    stop: () => clearInterval(interval),
    stopAndUpdate: () => { clearInterval(interval); updateAgents(); },
  };
}
