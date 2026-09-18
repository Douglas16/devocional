// Lista dos 66 livros (NVI) usada pela busca da aba Jornadas e por scripts/build-search-index.mjs.
// n = nome exibido; a = abreviações aceitas na busca; r = grafias que aparecem nas referências dos dados;
// c = número de capítulos.
window.LECTIO_BOOKS = [
  { n: 'Gênesis', a: ['gn'], c: 50 }, { n: 'Êxodo', a: ['ex'], c: 40 }, { n: 'Levítico', a: ['lv'], c: 27 },
  { n: 'Números', a: ['nm'], c: 36 }, { n: 'Deuteronômio', a: ['dt'], c: 34 }, { n: 'Josué', a: ['js'], c: 24 },
  { n: 'Juízes', a: ['jz'], c: 21 }, { n: 'Rute', a: ['rt'], c: 4 }, { n: '1 Samuel', a: ['1sm'], c: 31 },
  { n: '2 Samuel', a: ['2sm'], c: 24 }, { n: '1 Reis', a: ['1rs'], c: 22 }, { n: '2 Reis', a: ['2rs'], c: 25 },
  { n: '1 Crônicas', a: ['1cr'], c: 29 }, { n: '2 Crônicas', a: ['2cr'], c: 36 }, { n: 'Esdras', a: ['ed', 'esd'], c: 10 },
  { n: 'Neemias', a: ['ne'], c: 13 }, { n: 'Ester', a: ['et', 'est'], c: 10 }, { n: 'Jó', a: [], c: 42 },
  { n: 'Salmos', a: ['sl'], r: ['Salmo'], c: 150 }, { n: 'Provérbios', a: ['pv', 'pr'], c: 31 }, { n: 'Eclesiastes', a: ['ec'], c: 12 },
  { n: 'Cânticos', a: ['ct', 'cantares'], c: 8 }, { n: 'Isaías', a: ['is'], c: 66 }, { n: 'Jeremias', a: ['jr'], c: 52 },
  { n: 'Lamentações', a: ['lm'], c: 5 }, { n: 'Ezequiel', a: ['ez'], c: 48 }, { n: 'Daniel', a: ['dn'], c: 12 },
  { n: 'Oseias', a: ['os'], c: 14 }, { n: 'Joel', a: ['jl'], c: 3 }, { n: 'Amós', a: ['am'], c: 9 },
  { n: 'Obadias', a: ['ob'], c: 1 }, { n: 'Jonas', a: ['jn'], c: 4 }, { n: 'Miquéias', a: ['mq'], c: 7 },
  { n: 'Naum', a: ['na'], c: 3 }, { n: 'Habacuque', a: ['hc'], c: 3 }, { n: 'Sofonias', a: ['sf'], c: 3 },
  { n: 'Ageu', a: ['ag'], c: 2 }, { n: 'Zacarias', a: ['zc'], c: 14 }, { n: 'Malaquias', a: ['ml'], c: 4 },
  { n: 'Mateus', a: ['mt'], c: 28 }, { n: 'Marcos', a: ['mc'], c: 16 }, { n: 'Lucas', a: ['lc'], c: 24 },
  { n: 'João', a: ['jo'], c: 21 }, { n: 'Atos', a: ['at'], c: 28 }, { n: 'Romanos', a: ['rm'], c: 16 },
  { n: '1 Coríntios', a: ['1co'], c: 16 }, { n: '2 Coríntios', a: ['2co'], c: 13 }, { n: 'Gálatas', a: ['gl'], c: 6 },
  { n: 'Efésios', a: ['ef'], c: 6 }, { n: 'Filipenses', a: ['fp'], c: 4 }, { n: 'Colossenses', a: ['cl'], c: 4 },
  { n: '1 Tessalonicenses', a: ['1ts'], c: 5 }, { n: '2 Tessalonicenses', a: ['2ts'], c: 3 }, { n: '1 Timóteo', a: ['1tm'], c: 6 },
  { n: '2 Timóteo', a: ['2tm'], c: 4 }, { n: 'Tito', a: ['tt'], c: 3 }, { n: 'Filemom', a: ['fm'], c: 1 },
  { n: 'Hebreus', a: ['hb'], c: 13 }, { n: 'Tiago', a: ['tg'], c: 5 }, { n: '1 Pedro', a: ['1pe'], c: 5 },
  { n: '2 Pedro', a: ['2pe'], c: 3 }, { n: '1 João', a: ['1jo'], c: 5 }, { n: '2 João', a: ['2jo'], c: 1 },
  { n: '3 João', a: ['3jo'], c: 1 }, { n: 'Judas', a: ['jd'], c: 1 }, { n: 'Apocalipse', a: ['ap'], c: 22 }
];
