/**
 * AgentHQ - Main Entry Point
 * La tarea se ingresa DENTRO de la TUI.
 * El archivo se guarda solo con contenido limpio.
 */
import { createClient, askClaude } from './claudeClient.js';
import { runXocas, runMomo, runLlados } from './agents.js';
import { setState, resetAll, setMetadata, setAgentDescription } from './stateManager.js';
import { initTUI, getTaskFromTUI, startLive, log } from './tui.js';
import { startApi } from './api.js';
import { detectFormat, saveFile } from './fileWriter.js';

// Extraer metadatos de la tarea (formato y tema)
function extractTaskMetadata(task) {
  const format = detectFormat(task);
  const lowerTask = task.toLowerCase();

  // Palabras a ignorar (stopwords)
  const stopwords = ['crea', 'create', 'write', 'genera', 'generate', 'haz', 'make', 'un', 'una', 'unos', 'unas', 'a', 'an', 'con', 'with', 'sobre', 'about', 'de', 'of', 'el', 'la', 'los', 'las', 'the', 'resumen', 'summary', 'documento', 'document', 'archivo', 'file', 'word', 'pdf', 'markdown', 'texto'];

  // Extraer palabras significativas (>3 caracteres y no stopwords)
  const words = lowerTask
    .replace(/[^a-záéíóú\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopwords.includes(w));

  // Tomar la palabra más significativa (preferiblemente sustantivo/tema)
  let topic = 'task';
  if (words.length > 0) {
    // Si hay varias palabras, tomar la última (suele ser el tema principal)
    topic = words[words.length - 1].substring(0, 12);
  }

  return { format: format || 'txt', topic };
}

// Generar descripciones personalizadas con IA (Gemini 2.0 Flash - gratis y rápido)
async function generateAgentDescriptions(client, task) {
  const systemPrompt = `You are a creative LCD display text generator. Generate 3 SHORT, BEAUTIFUL descriptions for AI agents working on a task.

RULES:
- Each description is 16 characters MAX (must fit on LCD)
- Use creative, engaging verbs (not "planning", "researching")
- Be concise but descriptive
- Match the task theme
- Format: Return ONLY 3 lines, one per agent, NO numbers, NO bullets, NO explanations

Examples:
For "create PDF about history":
  Mapping history
  Digging deeper
  Crafting PDF

For "analyze user data":
  Structuring data
  Uncovering patterns
  Building report`;

  const userMessage = `Task: "${task}"

Generate 3 unique LCD descriptions (max 16 chars each):
1. XOCAS (planner) - what is XOCAS doing?
2. MOMO (researcher) - what is MOMO doing?
3. LLADOS (executor) - what is LLADOS doing?

ONLY output 3 lines, each under 16 characters.`;

  try {
    // Usar GitHub Models (GPT-4o gratis)
    const response = await askClaude(
      client,
      systemPrompt,
      userMessage
      // modelo por defecto: openai/gpt-4o
    );

    const lines = response
      .split('\n')
      .map(l => l.replace(/^\d+\.\s*/, '').trim())
      .filter(l => l.length > 0 && l.length <= 16)
      .slice(0, 3);

    if (lines.length >= 3) {
      return {
        xocas: lines[0].substring(0, 16),
        momo: lines[1].substring(0, 16),
        llados: lines[2].substring(0, 16)
      };
    }
  } catch (e) {
    log(`{grey-fg}⚠ Descriptions API failed: ${e.message}{/grey-fg}`);
  }

  // Fallback: descripciones simples pero bonitas
  return {
    xocas: 'Mapping task',
    momo: 'Researching',
    llados: 'Creating output'
  };
}

async function main() {
  // Iniciar TUI primero
  initTUI();
  startApi(5001);

  log('{cyan-fg}AgentHQ iniciado. Cargando agentes...{/cyan-fg}');
  log('');

  // Pedir tarea desde la TUI
  const task = await getTaskFromTUI();
  if (!task) { log('{red-fg}Sin tarea. Saliendo.{/red-fg}'); return; }

  // Crear cliente primero
  let client;
  try {
    client = createClient();
  } catch (e) {
    log(`{red-fg}Error de autenticacion: ${e.message}{/red-fg}`);
    return;
  }

  // Extraer metadatos (formato y tema)
  const metadata = extractTaskMetadata(task);
  setMetadata(metadata.format, metadata.topic);

  const live = startLive(task);
  log(`{white-fg}Tarea recibida:{/white-fg} {bold}"${task}"{/bold}`);
  log(`{grey-fg}  [${metadata.format.toUpperCase()} • ${metadata.topic}]{/grey-fg}`);
  log('');

  // Generar descripciones personalizadas en paralelo (no bloquea)
  generateAgentDescriptions(client, task)
    .then(descriptions => {
      setAgentDescription('xocas', descriptions.xocas);
      setAgentDescription('momo', descriptions.momo);
      setAgentDescription('llados', descriptions.llados);
      log(`{green-fg}✓ Descripciones personalizadas listas{/green-fg}`);
    })
    .catch(e => {
      log(`{yellow-fg}⚠ Descripciones: ${e.message.substring(0, 50)}{/yellow-fg}`);
      // Fallback automático
      setAgentDescription('xocas', 'Planning task');
      setAgentDescription('momo', 'Researching');
      setAgentDescription('llados', 'Creating');
    });

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
