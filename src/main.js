/**
 * ClawCity - Main Entry Point
 * La tarea se ingresa DENTRO de la TUI.
 * El archivo se guarda solo con contenido limpio.
 */
import { createClient } from './claudeClient.js';
import { runXocas, runMomo, runLlados } from './agents.js';
import { setState, resetAll } from './stateManager.js';
import { initTUI, getTaskFromTUI, startLive, log } from './tui.js';
import { startApi } from './api.js';
import { detectFormat, saveFile } from './fileWriter.js';

async function main() {
  // Iniciar TUI primero
  initTUI();
  startApi(5001);

  log('{cyan-fg}ClawCity iniciado. Cargando agentes...{/cyan-fg}');
  log('');

  // Pedir tarea desde la TUI
  const task = await getTaskFromTUI();
  if (!task) { log('{red-fg}Sin tarea. Saliendo.{/red-fg}'); return; }

  // Crear cliente
  let client;
  try {
    client = createClient();
  } catch (e) {
    log(`{red-fg}Error de autenticacion: ${e.message}{/red-fg}`);
    return;
  }

  const live = startLive(task);
  log(`{white-fg}Tarea recibida:{/white-fg} {bold}"${task}"{/bold}`);
  log('');

  try {
    resetAll();

    // Paso 1: Xocas planifica
    log('{cyan-fg}--- PASO 1: XOCAS (Planner) ---{/cyan-fg}');
    const plan = await runXocas(client, task);
    setState('xocas', 'IDLE', 'Done');
    log('{green-fg}  Xocas completo{/green-fg}');
    log('');

    // Paso 2: Momo investiga
    log('{magenta-fg}--- PASO 2: MOMO (Researcher) ---{/magenta-fg}');
    const research = await runMomo(client, plan, task);
    setState('momo', 'IDLE', 'Done');
    log('{green-fg}  Momo completo{/green-fg}');
    log('');

    // Paso 3: Llados ejecuta — con instruccion especial para generar el contenido final
    log('{yellow-fg}--- PASO 3: LLADOS (Executor) ---{/yellow-fg}');

    // Si debe guardar archivo, decirle a Llados que genere SOLO el contenido
    const lladosInstruction = detectFormat(task)
      ? `${task}\n\nIMPORTANTE: Tu respuesta debe ser SOLO el contenido del archivo, texto limpio y directo, sin meta-comentarios, sin "voy a crear", sin explicaciones de lo que harás. Solo el documento final listo para guardar.`
      : task;

    const result = await runLlados(client, research, lladosInstruction);
    setState('llados', 'IDLE', 'Done');
    log('{green-fg}  Llados completo{/green-fg}');
    log('');

    live.stopAndUpdate();

    // Guardar archivo si aplica
    const format = detectFormat(task);
    let filepath = null;
    if (format) {
      log(`{white-fg}  Guardando como .${format}...{/white-fg}`);
      filepath = await saveFile(result, task, format);
      log(`{green-fg}  Archivo .${format} creado{/green-fg}`);
    }

    live.showDone(filepath);

  } catch (e) {
    live.stop();
    log(`{red-fg}Error en pipeline: ${e.message}{/red-fg}`);
  }
}

main();
