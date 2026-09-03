#!/usr/bin/env node
/*
 * Gera leituras NVI estáticas dentro dos arquivos data/*.js.
 * Execute somente depois de revisar os alvos:
 *   node scripts/embed-nvi-passages.mjs data/romanos-1.js data/romanos-2.js
 *
 * O script cria um .bak ao lado de cada arquivo antes de regravá-lo.
 */
import fs from 'node:fs';
import vm from 'node:vm';

const books = {
  'Apocalipse':'ap','Atos':'atos','Colossenses':'cl','Eclesiastes':'ec','Efésios':'ef',
  'Filemom':'fm','Filipenses':'fp','Gálatas':'gl','Hebreus':'hb','Judas':'jd','João':'jo',
  'Romanos':'rm','Salmo':'sl','Salmos':'sl','Tito':'tt','1 Coríntios':'1co','2 Coríntios':'2co',
  '1 Pedro':'1pe','2 Pedro':'2pe','1 Timóteo':'1tm','2 Timóteo':'2tm',
  '1 Tessalonicenses':'1ts','2 Tessalonicenses':'2ts','Provérbios':'pv','Tiago':'tg'
  ,'Mateus':'mt','Marcos':'mc','Lucas':'lc','1 João':'1jo','2 João':'2jo','3 João':'3jo'
};
const bible = JSON.parse(fs.readFileSync('docs/nvi.json', 'utf8').replace(/^\uFEFF/, ''));
const byAbbrev = new Map(bible.map(book => [book.abbrev, book.chapters]));

function getChapter(reference) {
  for (const name of Object.keys(books).sort((a, b) => b.length - a.length)) {
    const match = reference.match(new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s+(\\d+))?`));
    if (!match) continue;
    const number = Number(match[1] || 1);
    const chapters = byAbbrev.get(books[name]);
    const chapter = chapters?.[number - 1] || (chapters?.length === 1 ? chapters[0] : null);
    if (chapter) return { name, number, verses: chapter };
  }
  return null;
}

function runFile(file) {
  const source = fs.readFileSync(file, 'utf8');
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: file });
  const variable = Object.keys(context.window).find(key => Array.isArray(context.window[key]));
  if (!variable) throw new Error(`${file}: nenhum array de dias foi encontrado`);
  const days = context.window[variable];
  let changed = 0;
  for (const day of days) {
    const chapter = getChapter(day.date || '') || getChapter(day.verse?.ref || '') || getChapter(day.passage?.ref || '');
    if (!chapter || !day.passage) continue;
    day.passage = {
      ...day.passage,
      ref: `${chapter.name} ${chapter.number} · capítulo completo (NVI)`,
      verses: chapter.verses.map((text, index) => ({ n: index + 1, text }))
    };
    changed += 1;
  }
  fs.copyFileSync(file, `${file}.bak`);
  fs.writeFileSync(file, `// Leitura integral NVI incorporada a partir de docs/nvi.json.\nwindow.${variable} = ${JSON.stringify(days, null, 2)};\n`);
  console.log(`${file}: ${changed}/${days.length} leituras substituídas; backup em ${file}.bak`);
}

const targets = process.argv.slice(2);
if (!targets.length) throw new Error('Informe pelo menos um arquivo data/*.js como alvo.');
targets.forEach(runFile);
