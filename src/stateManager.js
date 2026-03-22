/**
 * ClawCity - State Manager
 * Tracks real-time state of each agent
 */

const states = {
  xocas:  { state: 'IDLE', task: 'Waiting...' },
  momo:   { state: 'IDLE', task: 'Waiting...' },
  llados: { state: 'IDLE', task: 'Waiting...' },
};

export const STATE_COLORS = {
  IDLE: 'yellow',
  WORKING: 'green',
  COMMUNICATING: 'blue',
};

export const STATE_EMOJI = {
  IDLE: '🟡',
  WORKING: '🟢',
  COMMUNICATING: '🔵',
};

export function getStates() {
  return JSON.parse(JSON.stringify(states));
}

export function setState(agent, state, task) {
  states[agent] = { state, task };
}

export function resetAll() {
  for (const agent of Object.keys(states)) {
    states[agent] = { state: 'IDLE', task: 'Waiting...' };
  }
}
