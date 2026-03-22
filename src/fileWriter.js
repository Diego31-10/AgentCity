/**
 * ClawCity - File Writer
 * Genera archivos en .txt, .docx, .pdf, .md según lo que pida el usuario
 */
import { writeFileSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import PDFDocument from 'pdfkit';

// Detectar formato solicitado en el texto de la tarea
export function detectFormat(task) {
  const t = task.toLowerCase();
  if (t.includes('.docx') || t.includes('word') || t.includes('documento word')) return 'docx';
  if (t.includes('.pdf') || t.includes('pdf')) return 'pdf';
  if (t.includes('.md') || t.includes('markdown')) return 'md';
  if (t.includes('.txt') || t.includes('texto') || t.includes('text')) return 'txt';
  // Si menciona archivo/documento pero no especifica → docx por default
  const fileKeywords = ['archivo', 'file', 'documento', 'document', 'guardar', 'save', 'escribe', 'write', 'crea', 'create', 'genera', 'generate'];
  if (fileKeywords.some(k => t.includes(k))) return 'docx';
  return null; // no guardar
}

function getDesktopPath(filename) {
  const desktop = join(homedir(), 'Desktop');
  try { mkdirSync(desktop, { recursive: true }); } catch {}
  return join(desktop, filename);
}

function cleanText(text) {
  return text
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`{1,3}/g, '')
    .replace(/_{1,2}/g, '')
    .trim();
}

function parseMarkdownToSections(text) {
  const lines = text.split('\n');
  const sections = [];
  for (const line of lines) {
    const h1 = line.match(/^#\s+(.+)/);
    const h2 = line.match(/^##\s+(.+)/);
    const h3 = line.match(/^###\s+(.+)/);
    if (h1) sections.push({ type: 'h1', text: h1[1] });
    else if (h2) sections.push({ type: 'h2', text: h2[1] });
    else if (h3) sections.push({ type: 'h3', text: h3[1] });
    else if (line.trim()) sections.push({ type: 'p', text: line.replace(/\*\*/g,'').replace(/\*/g,'').replace(/`/g,'') });
    else sections.push({ type: 'br' });
  }
  return sections;
}

// ── TXT ──────────────────────────────────────────────────────────────
export function saveTxt(content, slug) {
  const filename = `${slug}.txt`;
  const filepath = getDesktopPath(filename);
  writeFileSync(filepath, cleanText(content), { encoding: 'utf8' });
  return filepath;
}

// ── MARKDOWN ─────────────────────────────────────────────────────────
export function saveMd(content, slug) {
  const filename = `${slug}.md`;
  const filepath = getDesktopPath(filename);
  writeFileSync(filepath, content, { encoding: 'utf8' });
  return filepath;
}

// ── DOCX ─────────────────────────────────────────────────────────────
export async function saveDocx(content, slug) {
  const filename = `${slug}.docx`;
  const filepath = getDesktopPath(filename);
  const sections = parseMarkdownToSections(content);

  const children = sections.map(s => {
    if (s.type === 'h1') return new Paragraph({ text: s.text, heading: HeadingLevel.HEADING_1 });
    if (s.type === 'h2') return new Paragraph({ text: s.text, heading: HeadingLevel.HEADING_2 });
    if (s.type === 'h3') return new Paragraph({ text: s.text, heading: HeadingLevel.HEADING_3 });
    if (s.type === 'br') return new Paragraph({ text: '' });
    return new Paragraph({ children: [new TextRun({ text: s.text, size: 24 })] });
  });

  const doc = new Document({
    creator: 'ClawCity',
    title: slug,
    sections: [{ children }],
  });

  const buffer = await Packer.toBuffer(doc);
  writeFileSync(filepath, buffer);
  return filepath;
}

// ── PDF ──────────────────────────────────────────────────────────────
export function savePdf(content, slug) {
  return new Promise((resolve, reject) => {
    const filename = `${slug}.pdf`;
    const filepath = getDesktopPath(filename);
    const doc = new PDFDocument({ margin: 60 });
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
      writeFileSync(filepath, Buffer.concat(chunks));
      resolve(filepath);
    });
    doc.on('error', reject);

    const sections = parseMarkdownToSections(content);
    for (const s of sections) {
      if (s.type === 'h1') {
        doc.fontSize(20).font('Helvetica-Bold').text(s.text, { align: 'left' }).moveDown(0.5);
      } else if (s.type === 'h2') {
        doc.fontSize(16).font('Helvetica-Bold').text(s.text).moveDown(0.3);
      } else if (s.type === 'h3') {
        doc.fontSize(13).font('Helvetica-Bold').text(s.text).moveDown(0.2);
      } else if (s.type === 'br') {
        doc.moveDown(0.5);
      } else {
        doc.fontSize(11).font('Helvetica').text(s.text, { align: 'justify' }).moveDown(0.2);
      }
    }
    doc.end();
  });
}

// ── Dispatcher ───────────────────────────────────────────────────────
export async function saveFile(content, task, format) {
  const timestamp = new Date().toISOString().slice(0, 10);
  const slug = `clawcity-${task.slice(0, 25).replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${timestamp}`;

  switch (format) {
    case 'docx': return await saveDocx(content, slug);
    case 'pdf':  return await savePdf(content, slug);
    case 'md':   return saveMd(content, slug);
    default:     return saveTxt(content, slug);
  }
}
