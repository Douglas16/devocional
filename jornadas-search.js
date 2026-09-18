// Busca da aba Jornadas: passagem bíblica (ex.: "Salmo 119", "Jo 3.16"). A busca por assunto (ex.: "sofrimento") está em standby (TOPICS_ENABLED).
// O índice (search-index.js, gerado por scripts/build-search-index.mjs) só é baixado no primeiro uso.
(function () {
  var input = document.getElementById('jsearchInput');
  var box = document.getElementById('jsearchResults');
  var topicsEl = document.getElementById('jsearchTopics');
  if (!input || !box || !topicsEl) return;

  var BOOKS = window.LECTIO_BOOKS || [];
  var MODE_KEY = 'lectio-devotional-mode-v1';
  // Busca por assunto (chips + texto livre) implementada mas desligada: mude para true para reativar.
  var TOPICS_ENABLED = false;
  var index = null, loading = null, timer = null;

  var norm = function (s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var bookKeys = BOOKS.map(function (b) { return norm(b.n).replace(/\s+/g, ''); });

  var mode = function () { try { return localStorage.getItem(MODE_KEY) || 'classico'; } catch (e) { return 'classico'; } };

  var isRead = function (href, day) {
    var cfg = (window.__lectioProgress || {})[href];
    if (!cfg) return false;
    try { var st = JSON.parse(localStorage.getItem(cfg[0]) || '{}'); return !!(st.read && st.read[day]); } catch (e) { return false; }
  };

  var loadIndex = function () {
    if (index) return Promise.resolve(index);
    if (loading) return loading;
    loading = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'search-index.js';
      s.onload = function () { index = window.LECTIO_INDEX; resolve(index); };
      s.onerror = function () { loading = null; reject(new Error('index')); };
      document.head.appendChild(s);
    });
    return loading;
  };

  var link = function (di, verse) {
    var d = index.days[di], j = index.journeys[d[0]];
    return j[0] + '?dia=' + d[1] + (verse ? '&v=' + verse : '');
  };
  var themeOf = function (d) { return mode() === 'carta' && d[4] ? d[4] : d[3]; };

  var row = function (di, opts) {
    opts = opts || {};
    var d = index.days[di], j = index.journeys[d[0]];
    var read = isRead(j[0], d[1]);
    return '<a class="jsearch-row" href="' + esc(link(di, opts.verse)) + '">' +
      '<span class="jsearch-row-ref">' + esc(opts.label || d[2]) + (opts.verse ? ':' + opts.verse : '') + '</span>' +
      '<span class="jsearch-row-title">' + esc(themeOf(d)) + '</span>' +
      (opts.snippet ? '<span class="jsearch-row-snippet">' + esc(opts.snippet) + '</span>' : '') +
      '<span class="jsearch-row-meta">' + esc(j[1]) + ' · dia ' + d[1] + (read ? ' · <b>lido</b>' : '') + '</span></a>';
  };

  // ---------- passagem ----------
  var parseRef = function (q) {
    var m = norm(q).replace(/[\s.]+$/, '').match(/^\s*([1-3])?\s*([a-z]+)\s*(?:(\d+)(?:\s*[:.,\s]\s*(\d+)(?:\s*-\s*(\d+))?)?)?\s*$/);
    if (!m) return null;
    var key = (m[1] || '') + m[2];
    var exact = [], prefix = [];
    BOOKS.forEach(function (b, i) {
      if (bookKeys[i] === key || b.a.indexOf(key) >= 0) exact.push(i);
      else if (bookKeys[i].indexOf(key) === 0 || (b.r || []).some(function (r) { return norm(r).indexOf(key) === 0; })) prefix.push(i);
    });
    var books = exact.length ? exact : prefix;
    if (!books.length) return null;
    return { books: books, chapter: m[3] ? +m[3] : 0, verse: m[4] ? +m[4] : 0 };
  };

  var chapterEntries = function (b, ch) { return (index.chapters[b + ':' + ch] || []); };

  var chapterGrid = function (b) {
    var out = '';
    for (var c = 1; c <= BOOKS[b].c; c++) {
      var es = chapterEntries(b, c);
      if (!es.length) out += '<span class="jsearch-chip is-off" title="Ainda não está em nenhuma jornada">' + c + '</span>';
      else if (es.length === 1) out += '<a class="jsearch-chip" href="' + esc(link(es[0][0])) + '">' + c + '</a>';
      else out += '<button type="button" class="jsearch-chip" data-q="' + esc(BOOKS[b].n + ' ' + c) + '" title="' + es.length + ' leituras">' + c + '</button>';
    }
    return '<div class="jsearch-chapters">' + out + '</div>';
  };

  var renderRef = function (ref) {
    var html = '';
    ref.books.slice(0, 6).forEach(function (b) {
      var name = BOOKS[b].n;
      if (!ref.chapter) {
        var any = false;
        for (var c = 1; c <= BOOKS[b].c && !any; c++) any = chapterEntries(b, c).length > 0;
        html += '<div class="jsearch-group"><div class="jsearch-group-title">' + esc(name) + '</div>' +
          (any ? chapterGrid(b) : '<p class="jsearch-empty">Este livro ainda não está em nenhuma jornada.</p>') + '</div>';
        return;
      }
      var es = chapterEntries(b, ref.chapter).filter(function (e) {
        return !ref.verse || (e[1] === 0 && e[2] === 0) || (ref.verse >= e[1] && ref.verse <= e[2]);
      });
      var title = name + ' ' + ref.chapter + (ref.verse ? ':' + ref.verse : '');
      if (!es.length) {
        html += '<div class="jsearch-group"><div class="jsearch-group-title">' + esc(title) + '</div>' +
          '<p class="jsearch-empty">' + (chapterEntries(b, ref.chapter).length ? 'Esse versículo não está nas leituras dessa jornada.' : 'Esse capítulo ainda não está em nenhuma jornada.') + '</p>' +
          (BOOKS[b].c > 1 ? chapterGrid(b) : '') + '</div>';
        return;
      }
      html += '<div class="jsearch-group"><div class="jsearch-group-title">' + esc(title) + '</div>' +
        es.map(function (e) { var v = ref.verse && e[1] !== 0 ? ref.verse : 0; return row(e[0], v ? { verse: v, label: name + ' ' + ref.chapter } : {}); }).join('') + '</div>';
    });
    return html;
  };

  // Mostra as primeiras linhas e esconde o resto atrás de um botão
  var LIMIT = 10;
  var limited = function (rows) {
    if (rows.length <= LIMIT + 2) return rows.join('');
    return rows.slice(0, LIMIT).join('') + '<div class="jsearch-more" hidden>' + rows.slice(LIMIT).join('') + '</div>' +
      '<button type="button" class="jsearch-showmore" data-more>Mostrar mais ' + (rows.length - LIMIT) + '</button>';
  };

  // ---------- assunto ----------
  var STOP = { 'para': 1, 'como': 1, 'sobre': 1, 'quero': 1, 'onde': 1, 'fala': 1, 'falam': 1, 'com': 1, 'uma': 1, 'que': 1, 'nos': 1, 'dos': 1, 'das': 1 };
  var tokensOf = function (q) { return norm(q).replace(/[^a-z0-9]+/g, ' ').split(' ').filter(function (t) { return t.length >= 3 && !STOP[t]; }); };

  var topicMatches = function (tokens) {
    if (!tokens.length) return [];
    return index.topics.filter(function (t) {
      var nameWords = norm(t.name).split(/[^a-z]+/);
      return tokens.every(function (tk) {
        return nameWords.some(function (w) { return w.indexOf(tk) === 0; }) ||
          t.kws.some(function (k) {
            if (k[0] === '=') return k.slice(1) === tk;
            k = k.trim();
            return tk.indexOf(k) === 0 || (tk.length >= 4 && k.indexOf(tk) === 0);
          });
      });
    });
  };

  var hasToken = function (di, tk) {
    var s = ' ' + index.stems[di];
    return tk.length >= 6 ? s.indexOf(' ' + tk.slice(0, 6) + ' ') >= 0 : s.indexOf(' ' + tk) >= 0;
  };

  var renderText = function (q) {
    var tokens = tokensOf(q);
    if (!tokens.length) return '<p class="jsearch-empty">Digite uma passagem (Salmo 119, Jo 3.16) ou um assunto (sofrimento, perdão…).</p>';
    var html = '', shown = {};
    var topics = topicMatches(tokens).slice(0, 2);
    topics.forEach(function (t) {
      html += '<div class="jsearch-group"><div class="jsearch-group-title">Assunto: ' + esc(t.name) + ' <span>' + esc(t.hint) + '</span></div>' +
        limited(t.hits.map(function (h) { shown[h[0]] = 1; return row(h[0], { snippet: h[2] }); })) + '</div>';
    });
    var found = [];
    for (var di = 0; di < index.days.length && found.length < 40; di++) {
      if (shown[di]) continue;
      if (tokens.every(function (tk) { return hasToken(di, tk); })) found.push(di);
    }
    var norms = tokens;
    found.sort(function (a, b) {
      var ta = norms.every(function (tk) { return norm(index.days[a][3] + ' ' + index.days[a][4]).indexOf(tk) >= 0; }) ? 0 : 1;
      var tb = norms.every(function (tk) { return norm(index.days[b][3] + ' ' + index.days[b][4]).indexOf(tk) >= 0; }) ? 0 : 1;
      return ta - tb || a - b;
    });
    if (found.length) {
      html += '<div class="jsearch-group"><div class="jsearch-group-title">' + (topics.length ? 'Também aparece em' : 'Devocionais que falam de “' + esc(q.trim()) + '”') + '</div>' +
        limited(found.map(function (di) { return row(di); })) + '</div>';
    }
    return html || '<p class="jsearch-empty">Nada encontrado para “' + esc(q.trim()) + '”. Tente outra palavra ou um dos assuntos abaixo.</p>';
  };

  // ---------- controle ----------
  var run = function () {
    var q = input.value.trim();
    if (!q) { box.innerHTML = ''; box.hidden = true; return; }
    box.hidden = false;
    if (!index) box.innerHTML = '<p class="jsearch-empty">Carregando…</p>';
    loadIndex().then(function () {
      if (input.value.trim() !== q) return;
      var ref = parseRef(q);
      if (ref) box.innerHTML = renderRef(ref);
      else if (TOPICS_ENABLED) box.innerHTML = renderText(q);
      else box.innerHTML = '<p class="jsearch-empty">Livro não encontrado. Tente o nome ou a abreviatura, como “Salmo 119”, “Mc 13” ou “1 Co 13”.</p>';
    }).catch(function () { box.innerHTML = '<p class="jsearch-empty">Não foi possível carregar o índice de busca.</p>'; });
  };
  var schedule = function () { clearTimeout(timer); timer = setTimeout(run, 120); };
  var setQuery = function (q) { input.value = q; run(); };

  input.addEventListener('focus', function () { loadIndex().catch(function () {}); });
  input.addEventListener('input', schedule);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      var first = box.querySelector('a.jsearch-row');
      if (first) window.location.href = first.getAttribute('href');
    } else if (e.key === 'Escape') { input.value = ''; run(); }
  });
  box.addEventListener('click', function (e) {
    var more = e.target.closest('[data-more]');
    if (more) { var hidden = more.previousElementSibling; hidden.hidden = false; more.remove(); return; }
    var b = e.target.closest('[data-q]');
    if (b) { e.preventDefault(); setQuery(b.getAttribute('data-q')); }
  });

  // chips de assuntos (lista fixa, espelha TOPICS do gerador)
  var SUBJECTS = ['Sofrimento', 'Ansiedade e medo', 'Perdão', 'Esperança', 'Fé e confiança', 'Oração', 'Gratidão', 'Sabedoria', 'Justiça', 'Solidão e abandono', 'Culpa e arrependimento', 'Graça', 'Família', 'Trabalho e descanso', 'Dinheiro e generosidade', 'Humildade e orgulho', 'Paciência e espera', 'Luto e morte', 'Ira e conflito', 'Cura e restauração', 'Coragem', 'Proteção e refúgio', 'Louvor e adoração', 'Identidade'];
  if (TOPICS_ENABLED) topicsEl.innerHTML = SUBJECTS.map(function (s) { return '<button type="button" class="jsearch-chip is-topic" data-q="' + esc(s) + '">' + esc(s) + '</button>'; }).join('');
  topicsEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-q]');
    if (b) { setQuery(b.getAttribute('data-q')); input.focus({ preventScroll: true }); }
  });

  // jornadas.html?q=Salmo+119 já abre com a busca feita
  try { var initial = new URLSearchParams(location.search).get('q'); if (initial) setQuery(initial); } catch (e) {}

  // atalho "/" foca a busca
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement === document.body) { e.preventDefault(); input.focus(); }
  });
})();
