// Box "Bíblia toda" (jornadas.html): ao clicar, abre uma palavra de renovo
// sobre a Palavra de Deus (sorteada a cada abertura, de palavra-renovo.js)
// e as estatísticas da leitura: início, dias decorridos e frequência,
// com um calendário mensal dos dias em que houve leitura.
// Depende de window.__lectioProgress (definido em jornadas.html) e de
// window.LECTIO_CHAPTERS (chapters-map.js). Cada jornada grava
// state.read[dia] = data ISO do momento em que o dia foi marcado como lido.
(() => {
  const card = document.getElementById('bibleProgressCard');
  const overlay = document.getElementById('bibleWordOverlay');
  const body = document.getElementById('bibleWordBody');
  const WORDS = window.PALAVRA_RENOVO || [];
  if (!card || !overlay || !body || !WORDS.length) return;

  const LAST_KEY = 'lectio-palavra-renovo-last';
  const DAY_MS = 86400000;

  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const plural = (n, one, many) => `${n.toLocaleString('pt-BR')} ${n === 1 ? one : many}`;
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayKey = (d) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  const fmtDate = (d) => d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  const daysBetween = (a, b) => Math.round((startOfDay(b) - startOfDay(a)) / DAY_MS);

  // Sorteia uma palavra diferente da última exibida.
  const pickWord = () => {
    let last = -1;
    try { last = parseInt(localStorage.getItem(LAST_KEY), 10); } catch {}
    let i = Math.floor(Math.random() * WORDS.length);
    if (WORDS.length > 1 && i === last) i = (i + 1 + Math.floor(Math.random() * (WORDS.length - 1))) % WORDS.length;
    try { localStorage.setItem(LAST_KEY, String(i)); } catch {}
    return WORDS[i];
  };

  // Reúne as datas de leitura de todas as jornadas.
  const collectStats = () => {
    const progress = window.__lectioProgress || {};
    const CH = window.LECTIO_CHAPTERS || { total: 1189, days: {} };
    const dates = [];
    const chapters = new Set();
    Object.keys(progress).forEach(href => {
      let state = {};
      try { state = JSON.parse(localStorage.getItem(progress[href][0]) || '{}'); } catch {}
      const dayChapters = CH.days[href] || {};
      Object.entries(state.read || {}).forEach(([day, value]) => {
        (dayChapters[day] || []).forEach(c => chapters.add(c));
        const d = typeof value === 'string' ? new Date(value) : null;
        if (d && !isNaN(d)) dates.push(d);
      });
    });
    return { dates, chapters: chapters.size, total: CH.total };
  };

  const frequencyLabel = (ratio) => {
    if (ratio >= 0.85) return 'Diária';
    if (ratio >= 0.55) return 'Quase diária';
    if (ratio >= 0.25) return 'Algumas vezes por semana';
    if (ratio >= 0.1) return 'Semanal';
    return 'Esporádica';
  };

  const relativeDay = (d, today) => {
    const n = daysBetween(d, today);
    if (n === 0) return 'hoje';
    if (n === 1) return 'ontem';
    return `há ${plural(n, 'dia', 'dias')}`;
  };

  const renderStats = () => {
    const { dates, chapters, total } = collectStats();
    if (!dates.length) {
      return `<p class="bw-empty">Você ainda não marcou nenhuma leitura. Escolha uma jornada e comece hoje — cada capítulo lido aparece aqui.</p>`;
    }
    const today = new Date();
    dates.sort((a, b) => a - b);
    const start = dates[0];
    const last = dates[dates.length - 1];
    const elapsed = daysBetween(start, today);          // dias desde o início
    const span = elapsed + 1;                           // dias do período, contando hoje
    const activeDays = new Set(dates.map(dayKey)).size; // dias distintos com leitura
    const ratio = activeDays / span;
    const perWeek = span >= 7 ? (activeDays / span) * 7 : activeDays;
    const perDay = chapters / span;

    const elapsedText = elapsed === 0 ? 'começou hoje' : plural(elapsed, 'dia', 'dias');
    const perWeekText = span >= 7
      ? `média de ${perWeek.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} ${perWeek === 1 ? 'dia' : 'dias'} de leitura por semana`
      : `${plural(activeDays, 'dia', 'dias')} de leitura na primeira semana`;

    return `
      <dl class="bw-stats">
        <div class="bw-stat"><dt>Início da leitura</dt><dd>${esc(fmtDate(start))}</dd></div>
        <div class="bw-stat"><dt>Dias desde o início</dt><dd>${esc(elapsedText)}</dd></div>
        <div class="bw-stat bw-stat-wide"><dt>Frequência</dt><dd>${esc(frequencyLabel(ratio))}
          <span class="bw-stat-note">leu em ${plural(activeDays, 'dia', 'dias')} de ${plural(span, 'dia', 'dias')} (${Math.round(ratio * 100)}%) · ${esc(perWeekText)}</span></dd></div>
        <div class="bw-stat"><dt>Capítulos lidos</dt><dd>${chapters.toLocaleString('pt-BR')} <span class="bw-stat-note">de ${total.toLocaleString('pt-BR')} · ${perDay.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}/dia</span></dd></div>
        <div class="bw-stat"><dt>Última leitura</dt><dd>${esc(relativeDay(last, today))} <span class="bw-stat-note">${esc(last.toLocaleDateString('pt-BR'))}</span></dd></div>
      </dl>`;
  };

  const render = () => {
    const w = pickWord();
    body.innerHTML = `
      <div class="bw-kicker">Palavra de renovo</div>
      <h2 class="reset-modal-title" id="bibleWordTitle">A Palavra de Deus em nossas vidas</h2>
      <blockquote class="bw-verse">
        <p>“${esc(w.text)}”</p>
        <cite>${esc(w.ref)} · NVI</cite>
      </blockquote>
      <p class="bw-word">${esc(w.word)}</p>
      <div class="bw-divider"></div>
      <h3 class="bw-section">Sua leitura da Bíblia toda</h3>
      ${renderStats()}
      <div class="reset-modal-actions">
        <button type="button" class="reset-btn" id="bibleWordCalendar">Calendário</button>
        <button type="button" class="reset-btn reset-btn-danger" id="bibleWordClose">Fechar</button>
      </div>`;
    body.querySelector('#bibleWordCalendar').addEventListener('click', () => {
      const now = new Date();
      renderCalendar(now.getFullYear(), now.getMonth());
    });
    body.querySelector('#bibleWordClose').addEventListener('click', close);
  };

  // Calendário mensal: pinta os dias em que houve ao menos uma leitura marcada.
  const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const renderCalendar = (year, month) => {
    const readDays = new Set(collectStats().dates.map(dayKey));
    const today = new Date();
    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const title = first.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    let monthCount = 0;
    const cells = [];
    for (let i = 0; i < first.getDay(); i++) cells.push('<span class="bw-cal-cell is-empty"></span>');
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const read = readDays.has(dayKey(date));
      if (read) monthCount++;
      const isToday = dayKey(date) === dayKey(today);
      const label = `${date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}${read ? ' — leitura feita' : ''}`;
      cells.push(`<span class="bw-cal-cell${read ? ' is-read' : ''}${isToday ? ' is-today' : ''}" title="${esc(label)}" aria-label="${esc(label)}">${d}</span>`);
    }
    body.innerHTML = `
      <div class="bw-kicker">Calendário de leitura</div>
      <div class="bw-cal-head">
        <button type="button" class="icon-btn bw-cal-nav" id="bwCalPrev" aria-label="Mês anterior"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>
        <h2 class="reset-modal-title bw-cal-title" id="bibleWordTitle">${esc(title.charAt(0).toUpperCase() + title.slice(1))}</h2>
        <button type="button" class="icon-btn bw-cal-nav" id="bwCalNext" aria-label="Próximo mês"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
      </div>
      <div class="bw-cal-grid bw-cal-weekdays" aria-hidden="true">${WEEKDAYS.map(w => `<span>${w}</span>`).join('')}</div>
      <div class="bw-cal-grid">${cells.join('')}</div>
      <p class="bw-cal-summary">${monthCount ? `${plural(monthCount, 'dia', 'dias')} com leitura neste mês` : 'Nenhuma leitura marcada neste mês'}</p>
      <div class="reset-modal-actions">
        <button type="button" class="reset-btn" id="bwCalBack">Voltar</button>
        <button type="button" class="reset-btn reset-btn-danger" id="bibleWordClose">Fechar</button>
      </div>`;
    const go = (delta) => { const d = new Date(year, month + delta, 1); renderCalendar(d.getFullYear(), d.getMonth()); };
    body.querySelector('#bwCalPrev').addEventListener('click', () => go(-1));
    body.querySelector('#bwCalNext').addEventListener('click', () => go(1));
    body.querySelector('#bwCalBack').addEventListener('click', render);
    body.querySelector('#bibleWordClose').addEventListener('click', close);
  };

  const open = () => { render(); overlay.hidden = false; body.querySelector('#bibleWordClose').focus(); };
  const close = () => { overlay.hidden = true; card.focus(); };

  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-haspopup', 'dialog');
  card.addEventListener('click', open);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) close(); });
})();
