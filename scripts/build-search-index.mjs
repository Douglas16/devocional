// Gera search-index.js, usado pela busca da aba Jornadas:
//  - chapters: em quais dias de qual jornada cada capítulo da Bíblia é lido;
//  - stems: palavras-raiz de cada devocional (modos Clássico e Carta) para busca por assunto;
//  - topics: assuntos prontos, com os devocionais que mais tratam de cada um.
// Rode `node scripts/build-search-index.mjs` sempre que jornadas ou textos mudarem.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..') + '/';
const read = (rel) => fs.readFileSync(ROOT + rel, 'utf8');

const bw = {};
new Function('window', read('bible-books.js'))(bw);
const BOOKS = bw.LECTIO_BOOKS;

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const bookByName = {};
BOOKS.forEach((b, i) => {
  bookByName[norm(b.n)] = i;
  (b.r || []).forEach((r) => { bookByName[norm(r)] = i; });
});

// ---------- jornadas e dias ----------
const home = read('jornadas.html');
const journeys = [...home.matchAll(/<a class="journey-choice" href="([^"]+\.html)"><div class="journey-choice-title">([^<]+)<\/div>/g)]
  .map((m) => ({ href: m[1], title: m[2] })).filter((j) => fs.existsSync(ROOT + j.href) && /src="data\//.test(read(j.href)));

const CUSTOM = { 'index.html': 'buildDevotional', 'joao.html': 'buildJoao' };
let mode = 'classico';
const resolveDays = (a, b, m) => (m === 'carta' && b && b.length ? a.map((d, i) => (b[i] ? { ...b[i], day: d.day } : d)) : a);

const loadJourney = (j) => {
  const html = read(j.href);
  const w = { localStorage: { getItem: () => null, setItem() {} } };
  w.window = w;
  w.LectioMode = { get: () => mode, resolveDays };
  const srcs = [...html.matchAll(/src="([^"]+)"/g)].map((m) => m[1]);
  for (const s of srcs.filter((x) => /^(data\/|salmos-layout)/.test(x))) new Function('window', 'localStorage', read(s)).call(w, w, w.localStorage);
  const app = 'app-' + j.href.replace('.html', '.jsx');
  const own = srcs.includes(app) && !CUSTOM[j.href] && !/^app-(pedro|sinoticos|tessalonicenses)\./.test(app);
  if (own) new Function('window', read(app)).call(w, w);
  return () => {
    if (own) return w.LECTIO_STUDY.days();
    if (CUSTOM[j.href]) return w[CUSTOM[j.href]](mode);
    const v = { 'pedro.html': ['PEDRO'], 'tessalonicenses.html': ['TESSALONICENSES'], 'sinoticos.html': ['SINOTICOS'] }[j.href][0];
    return v === 'SINOTICOS' ? (w.buildSinoticos ? w.buildSinoticos(mode) : w.SINOTICOS) : resolveDays(w[v], w[v + '_CARTA'], mode);
  };
};

const daysOf = journeys.map(loadJourney);
const classic = daysOf.map((f) => { mode = 'classico'; return f(); });
const carta = daysOf.map((f) => { mode = 'carta'; return f(); });

// ---------- referências bíblicas ----------
const parseRef = (ref, verses) => {
  const base = ref.split(' · ')[0].replace(/\s*\([^)]*\)\s*$/, '').trim();
  const m = base.match(/^(.+?) (\d+)(?:[.:](\d+))?(?:[-–](\d+)(?:[.:](\d+))?)?$/);
  if (!m) return [];
  const book = bookByName[norm(m[1])];
  if (book === undefined) return [];
  const [c1, v1, x, y] = [+m[2], m[3] && +m[3], m[4] && +m[4], m[5] && +m[5]];
  const ns = verses.map((v) => v.n);
  const partial = ref.match(/versículos (\d+)[-–](\d+)/);
  const out = [];
  if (partial) return [[book, c1, +partial[1], +partial[2]]];
  if (x && y) { // capítulo.verso-capítulo.verso: só a numeração do primeiro capítulo é confiável
    out.push([book, c1, 0, 0]);
    for (let c = c1 + 1; c <= x; c++) out.push([book, c, 0, 0]);
  } else if (x && v1) out.push([book, c1, v1, x]);
  else if (x) for (let c = c1; c <= x; c++) out.push([book, c, 0, 0]);
  else if (v1) out.push([book, c1, v1, v1]);
  else out.push([book, c1, ns.length ? Math.min(...ns) : 0, ns.length ? Math.max(...ns) : 0]);
  return out;
};

// ---------- texto para busca ----------
const STOP = new Set(('para como mais mas com uma uns umas que por nos nas dos das seu sua seus suas ele ela eles elas voce voces nosso nossa nossos nossas isso isto esse essa esses essas este esta estes estas aquele aquela quando onde ainda ate entre sobre sem porque pois tambem muito muita muitos muitas cada todo toda todos todas outro outra outros outras algo alguem nada mesmo mesma so ja ser esta estao foi sao era tem ter tinha foram sera pode podem posso deve deveria vai vou fazer faz fez feito seja sejam nao sim aqui ali la assim entao depois antes dia dias hoje vez vezes coisa coisas tudo qual quais quem cujo cuja lhe lhes meu minha meus minhas teu tua teus tuas dele dela deles delas numa num nesta neste nessa nesse pelo pela pelos pelas aos').split(' '));
const words = (s) => norm(s).replace(/[^a-z0-9]+/g, ' ').split(' ').filter(Boolean);
const dayFields = (d) => ({
  theme: d.theme || '', verse: (d.verse && d.verse.text) || '', context: d.context || '',
  meditation: (d.meditation || []).join(' '), questions: (d.questions || []).join(' '),
  application: d.application || '', prayer: d.prayer || '', word: d.word ? [d.word.meaning, d.word.translit].join(' ') : '',
});
const WEIGHT = { theme: 5, verse: 3, context: 2, meditation: 2, questions: 1, application: 1, prayer: 1, word: 1 };

// ---------- assuntos ----------
// Prefixos sem acento; "=palavra" exige a palavra inteira.
const TOPICS = [
  ['Sofrimento', 'dor, aflição e provação', ['sofr', 'afli', 'angust', '=dor', '=dores', 'tribula', 'proval', 'lament', 'agonia']],
  ['Ansiedade e medo', 'medo, preocupação e paz', ['ansied', 'ansios', 'medo', 'temer', 'preocup', 'receio', 'aflit', 'inquiet']],
  ['Perdão', 'perdoar e ser perdoado', ['perdo', 'reconcil', 'miseric', 'remiss', 'absolv']],
  ['Esperança', 'esperar em Deus', ['esperan', 'esperar', '=espera', 'aguard', 'expectativ']],
  ['Fé e confiança', 'confiar em Deus', ['confia', '=fe', 'crer', 'creu', 'cren', 'fiel', 'fideli']],
  ['Oração', 'falar com Deus', ['=ora', 'orar', 'orac', 'orand', 'oramo', 'clam', 'suplic', 'interced']],
  ['Gratidão', 'agradecer e recordar', ['gratid', 'agrade', 'gratos', 'acao de gracas', 'obrigad']],
  ['Louvor e adoração', 'louvar ao Senhor', ['louv', 'adora', 'cantar', 'canto', 'aleluia', 'exalt']],
  ['Sabedoria', 'sabedoria e prudência', ['sabed', 'sabio', 'sabia', 'prudenc', 'entendim', 'discernim', 'insens']],
  ['Justiça', 'justiça e injustiça', ['justic', 'injust', 'justo', 'juiz', 'julgam', 'opress', 'direito']],
  ['Amor ao próximo', 'amar e servir', ['amor', 'amar', 'amai', '=ama', 'proxim', 'compaix', 'servir', 'servico']],
  ['Solidão e abandono', 'sentir-se só', ['solidao', 'sozinh', 'abandon', 'esquecid', 'isolad', 'desampar', 'orfao', 'orfaos']],
  ['Culpa e arrependimento', 'pecado, culpa e volta', ['culpa', 'arrepend', 'pecad', 'pecar', 'confess', 'vergonha', 'transgress', 'iniquid']],
  ['Graça', 'favor imerecido', ['graca', 'gracas', 'imerecid', 'gratuit']],
  ['Família', 'pais, filhos e casa', ['famil', 'filhos', 'filho', '=pais', 'maes', 'esposa', 'marido', 'casament', '=lar']],
  ['Trabalho e descanso', 'labor, sábado e repouso', ['trabalh', 'labor', 'descans', 'repous', 'sabado', 'cansac', 'esforc']],
  ['Dinheiro e generosidade', 'riqueza, pobreza e partilha', ['dinheir', 'riquez', 'ricos', 'rico', 'pobre', 'pobreza', 'generos', 'ofert', 'dizimo', 'ganan', 'possess']],
  ['Humildade e orgulho', 'humildade diante de Deus', ['humild', 'orgulh', 'soberb', 'arrogan', 'vaidad']],
  ['Paciência e espera', 'perseverar no tempo de Deus', ['pacien', 'perseve', 'constan', 'resist', 'aguent', 'demora']],
  ['Luto e morte', 'perda, morte e consolo', ['luto', 'morte', 'morrer', 'morreu', 'sepult', 'consol', 'saudade', 'pranto', 'lagrim']],
  ['Ira e conflito', 'raiva, briga e paz', ['=ira', 'raiva', 'furia', 'briga', 'conflit', 'vinganc', 'inimig', 'discord']],
  ['Idolatria', 'ídolos e prioridades', ['idol', 'falsos deuses', 'bezerro', 'baal']],
  ['Aliança', 'promessas e fidelidade de Deus', ['aliança', 'alianca', 'promessa', 'prometeu', 'juramento', 'pacto']],
  ['Obediência', 'ouvir e guardar a palavra', ['obedi', 'mandament', 'guardar', 'preceit', 'decreto', 'estatut', '=lei']],
  ['Liderança', 'reis, pastores e líderes', ['lider', 'pastor', '=rei', 'reis', 'governa', 'autorid']],
  ['Cura e restauração', 'ser curado e restaurado', ['cura', 'curar', 'curou', 'sarar', 'saude', 'doen', 'enferm', 'restaur', 'restabel']],
  ['Alegria', 'alegria e celebração', ['alegr', 'regozij', 'festa', 'celebr', 'contentam']],
  ['Tentação', 'resistir ao mal', ['tenta', 'seduc', 'cobic', 'luxuri', 'imoral']],
  ['Missão e evangelho', 'anunciar e testemunhar', ['missao', 'evangel', 'testemunh', 'anunci', 'pregar', 'discipul', 'nacoes']],
  ['Ressurreição e vida eterna', 'vitória sobre a morte', ['ressurr', 'ressusc', 'eterna', 'eternid', 'vida eterna']],
  ['Espírito Santo', 'presença e poder de Deus', ['espirito santo', '=espirito', 'consolador', 'paraclet', 'pentecost', 'folego', 'sopro']],
  ['Igreja e comunidade', 'viver junto', ['igreja', 'comunh', 'comunid', 'irmaos', 'irmao', 'congrega', 'unidade']],
  ['Verdade e mentira', 'verdade, engano e palavra', ['verdad', 'mentir', 'mentira', 'engan', 'falsid', 'hipocri']],
  ['Identidade', 'quem somos em Deus', ['identid', 'filhos de deus', 'criado', 'imagem de deus', 'escolhid', 'pertenc']],
  ['Exílio e retorno', 'exílio, deserto e volta', ['exilio', 'exilad', 'cativeiro', 'deserto', 'retorno', 'voltar', 'peregrin', 'estrangeir']],
  ['Reino de Deus', 'o reino e o rei', ['reino', 'reinar', 'reina', 'senhorio', 'soberan']],
  ['Criação', 'o mundo que Deus fez', ['criacao', 'criador', 'criou', 'natureza', 'terra e ceu', 'estrelas']],
  ['Juventude e velhice', 'fases da vida', ['jovem', 'jovens', 'juventud', 'velhice', 'idoso', 'anciao', 'envelhec']],
  ['Coragem', 'ousar e resistir', ['corag', 'valente', 'forca', 'fortale', 'ousad', 'firme']],
  ['Proteção e refúgio', 'abrigo em Deus', ['protec', 'refug', 'abrigo', 'escudo', 'rocha', 'fortaleza', 'guardi']],
];

const kwMatch = (tokens, kws) => {
  let n = 0;
  for (const t of tokens) for (const k of kws) {
    if (k[0] === '=') { if (t === k.slice(1)) { n++; break; } } else if (k.includes(' ')) continue; else if (t.startsWith(k.trim())) { n++; break; }
  }
  return n;
};
const phraseHits = (text, kws) => kws.filter((k) => k.includes(' ') && text.includes(k)).length;

// ---------- monta o índice ----------
const idx = { v: 1, journeys: journeys.map((j) => [j.href, j.title]), days: [], chapters: {}, stems: [], topics: [] };
const cache = []; // por dia: campos normalizados de cada modo
journeys.forEach((j, ji) => {
  classic[ji].forEach((d, i) => {
    const c = carta[ji][i] || d;
    const refBase = d.passage.ref.split(' · ')[0].replace(/\s*\([^)]*\)\s*$/, '');
    const range = (d.passage.ref.match(/versículos (\d+)[-–](\d+)/) || []);
    const label = range[1] ? `${refBase} · ${range[1]}–${range[2]}` : refBase;
    const di = idx.days.length;
    idx.days.push([ji, d.day, label, d.theme || '', c.theme && c.theme !== d.theme ? c.theme : '']);
    for (const [b, ch, a, z] of parseRef(d.passage.ref, d.passage.verses)) (idx.chapters[b + ':' + ch] ||= []).push([di, a, z]);
    const fa = dayFields(d), fb = dayFields(c);
    cache.push({ fa, fb });
    const set = new Set();
    for (const f of [fa, fb]) for (const w of words(Object.values(f).join(' '))) if (w.length >= 4 && !STOP.has(w)) set.add(w.slice(0, 6));
    idx.stems.push([...set].sort().join(' '));
  });
});

const sentences = (s) => s.split(/(?<=[.!?…])\s+/).filter((x) => x.length > 30);
TOPICS.forEach(([name, hint, rawKws], ti) => {
  const kws = [...new Set(rawKws.map(norm))];
  const hits = [];
  cache.forEach(({ fa, fb }, di) => {
    let score = 0, best = null, bestN = 0;
    for (const f of [fa, fb]) for (const [k, txt] of Object.entries(f)) {
      const toks = words(txt);
      const n = kwMatch(toks, kws) + phraseHits(norm(txt), kws);
      score += n * WEIGHT[k];
      if (['meditation', 'context', 'application', 'verse'].includes(k) && n) {
        for (const s of sentences(txt)) {
          const sn = kwMatch(words(s), kws);
          if (sn > bestN) { bestN = sn; best = s; }
        }
      }
    }
    if (score >= 8) hits.push([di, score, best ? (best.length > 170 ? best.slice(0, 167).replace(/\s+\S*$/, '') + '…' : best) : '']);
  });
  hits.sort((a, b) => b[1] - a[1]);
  idx.topics.push({ id: ti, name, hint, kws, hits: hits.slice(0, 40) });
});

const body = JSON.stringify(idx);
fs.writeFileSync(ROOT + 'search-index.js', '// Gerado por scripts/build-search-index.mjs — não editar à mão.\nwindow.LECTIO_INDEX=' + body + ';\n');
console.log('dias', idx.days.length, 'capítulos', Object.keys(idx.chapters).length, 'tamanho', (body.length / 1024).toFixed(0) + 'KB');
console.log(idx.topics.map((t) => t.name + ':' + t.hits.length).join(' | '));
