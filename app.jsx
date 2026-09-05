const { useState, useEffect, useMemo, useCallback, useRef } = React;

// ============ STORAGE ============
const STORAGE_KEY = 'lectio-v2';

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch { return {}; }
};

const saveState = (state) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
};

// ============ ICONS ============
const Icon = {
  sun: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>,
  moon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  chevLeft: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  chevRight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
};

// ============ APP ============
function App() {
  const [state, setState] = useState(loadState);
  const [tab, setTab] = useState('today'); // today | journey | notes
  const [currentDay, setCurrentDay] = useState(() => {
    const s = loadState();
    return s.currentDay || 1;
  });

  // Tipo de devocional — global, compartilhado entre todos os livros (window.LectioMode)
  const [mode, setModeState] = useState(() => window.LectioMode.get());
  const setMode = (id) => {
    window.LectioMode.set(id);
    setModeState(id);
  };
  const hasCarta = !!(window.PROVERBIOS_1_10_CARTA || window.PROVERBIOS_11_20_CARTA || window.PROVERBIOS_21_31_CARTA);

  const days = window.buildDevotional(mode);
  const total = days.length;

  // Persist state changes
  useEffect(() => { saveState({ ...state, currentDay }); }, [state, currentDay]);

  // Theme handling — global, compartilhado entre todos os livros (window.LectioTheme)
  const [theme, setThemeState] = useState(() => window.LectioTheme.get());
  useEffect(() => { window.LectioTheme.apply(theme); }, [theme]);
  const setTheme = (id) => {
    window.LectioTheme.set(id);
    setThemeState(id);
  };

  // Read state helpers
  const isRead = (day) => !!(state.read && state.read[day]);
  const toggleRead = (day) => {
    setState(s => {
      const read = { ...(s.read || {}) };
      if (read[day]) delete read[day]; else read[day] = new Date().toISOString();
      return { ...s, read };
    });
  };
  const readCount = Object.keys(state.read || {}).length;

  // Notes
  const getNote = (day) => (state.notes && state.notes[day]) || '';
  const setNote = (day, text) => {
    setState(s => {
      const notes = { ...(s.notes || {}) };
      if (text) notes[day] = text; else delete notes[day];
      return { ...s, notes };
    });
  };

  // Highlights (verse indices per day)
  const getHighlights = (day) => (state.highlights && state.highlights[day]) || [];
  const toggleHighlight = (day, verseNum) => {
    setState(s => {
      const highlights = { ...(s.highlights || {}) };
      const arr = new Set(highlights[day] || []);
      if (arr.has(verseNum)) arr.delete(verseNum); else arr.add(verseNum);
      const next = [...arr];
      if (next.length) highlights[day] = next; else delete highlights[day];
      return { ...s, highlights };
    });
  };

  const goToDay = (n) => {
    if (n < 1 || n > total) return;
    setCurrentDay(n);
    setTab('today');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const dayData = days.find(d => d.day === currentDay);

  return (
    <div className="app">
      <Header theme={theme} onSetTheme={setTheme} mode={mode} onSetMode={setMode} hasCarta={hasCarta} />
      <Tabs
        tab={tab}
        onTabChange={setTab}
        readCount={readCount}
        notesCount={Object.keys(state.notes || {}).filter(k => state.notes[k]).length}
        total={total}
      />

      {tab === 'today' && (
        <Reader
          key={currentDay}
          day={dayData}
          total={total}
          isRead={isRead(currentDay)}
          onToggleRead={() => toggleRead(currentDay)}
          note={getNote(currentDay)}
          onNoteChange={(v) => setNote(currentDay, v)}
          highlights={getHighlights(currentDay)}
          onToggleHighlight={(v) => toggleHighlight(currentDay, v)}
          onPrev={() => goToDay(currentDay - 1)}
          onNext={() => goToDay(currentDay + 1)}
        />
      )}

      {tab === 'journey' && (
        <Journey
          days={days}
          currentDay={currentDay}
          readMap={state.read || {}}
          onSelect={goToDay}
          readCount={readCount}
        />
      )}

      {tab === 'notes' && (
        <NotesView
          days={days}
          notes={state.notes || {}}
          highlights={state.highlights || {}}
          onOpen={goToDay}
        />
      )}
    </div>
  );
}

// ============ HEADER ============
function Header({ theme, onSetTheme, mode, onSetMode, hasCarta }) {
  return (
    <header className="header">
      <div className="brand">
        <span className="brand-mark">Lectio</span>
        <span className="brand-sub">Provérbios · Tiago · 41 dias · NVI</span>
      </div>
      <div className="header-actions">
        <window.LectioModeMenu mode={mode} onSetMode={onSetMode} available={hasCarta} />
        <window.LectioThemeMenu theme={theme} onSetTheme={onSetTheme} />
      </div>
    </header>
  );
}

// ============ TABS ============
function Tabs({ tab, onTabChange, readCount, notesCount, total }) {
  return (
    <nav className="tabs">
      <button className={`tab ${tab === 'today' ? 'active' : ''}`} onClick={() => onTabChange('today')}>
        Hoje
      </button>
      <button className={`tab ${tab === 'journey' ? 'active' : ''}`} onClick={() => onTabChange('journey')}>
        Jornada
        <span className="tab-count">{readCount}/{total}</span>
      </button>
      <button className={`tab ${tab === 'notes' ? 'active' : ''}`} onClick={() => onTabChange('notes')}>
        Anotações
        {notesCount > 0 && <span className="tab-count">{notesCount}</span>}
      </button>
    </nav>
  );
}

// ============ READER ============
function Reader({ day, total, isRead, onToggleRead, note, onNoteChange, highlights, onToggleHighlight, onPrev, onNext }) {
  const [localNote, setLocalNote] = useState(note);
  const [saved, setSaved] = useState(true);
  const saveTimer = useRef(null);

  useEffect(() => { setLocalNote(note); }, [note, day.day]);

  const handleNote = (e) => {
    const v = e.target.value;
    setLocalNote(v);
    setSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      onNoteChange(v);
      setSaved(true);
    }, 600);
  };

  const dayStr = String(day.day).padStart(2, '0');

  return (
    <div className="reader fade-in">
      <div className="reader-topline">
        <div className="day-nav">
          <button className="day-nav-btn" onClick={onPrev} disabled={day.day <= 1} title="Dia anterior">{Icon.chevLeft}</button>
          <span className="day-label">DIA {dayStr} / {String(total).padStart(2,'0')}</span>
          <button className="day-nav-btn" onClick={onNext} disabled={day.day >= total} title="Próximo dia">{Icon.chevRight}</button>
        </div>
        <button className={`read-status ${isRead ? 'is-read' : ''}`} onClick={onToggleRead}>
          <span className="dot" />
          {isRead ? 'Lido' : 'Marcar como lido'}
        </button>
      </div>

      <div className="day-header">
        <div className="day-theme">{day.theme}</div>
        <div className="day-date serif">{day.date}</div>
      </div>

      <div className="verse-anchor">
        <div className="verse-anchor-text serif">{day.verse.text}</div>
        <div className="verse-anchor-ref">{day.verse.ref}</div>
      </div>

      {/* Palavra */}
      <section className="section">
        <div className="section-title">Palavra · {day.word.lang}</div>
        <div className="word-card">
          <div className="word-original serif" lang={day.word.lang === 'hebraico' ? 'he' : 'el'}>
            {day.word.original}
          </div>
          <div className="word-body">
            <div className="word-translit mono">
              {day.word.translit}
              <span className="lang-tag">{day.word.lang}</span>
            </div>
            <div className="word-meaning">{day.word.meaning}</div>
            <div className="word-note">{day.word.note}</div>
          </div>
        </div>
      </section>

      {/* Contexto */}
      <section className="section">
        <div className="section-title">Contexto histórico</div>
        <p className="context-text">{day.context}</p>
      </section>

      {/* Leitura */}
      <section className="section">
        <div className="section-title">Leitura</div>
        <div className="passage-ref">{day.passage.ref}</div>
        <div className="passage-verses serif">
          {day.passage.verses.map(v => (
            <span
              key={v.n}
              className={`verse ${highlights.includes(v.n) ? 'highlighted' : ''}`}
              onClick={() => onToggleHighlight(v.n)}
              title="Clique para sublinhar"
            >
              <span className="verse-num mono">{v.n}</span>
              {v.text}
              <span className="verse-highlight-hint">sublinhar</span>
            </span>
          ))}
        </div>
      </section>

      {/* Meditação */}
      <section className="section">
        <div className="section-title">Meditação</div>
        <div className="meditation-text">
          {day.meditation.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>

      {/* Perguntas */}
      <section className="section">
        <div className="section-title">Para refletir</div>
        <ol className="questions-list">
          {day.questions.map((q, i) => <li key={i}>{q}</li>)}
        </ol>
      </section>

      {/* Aplicação */}
      <section className="section">
        <div className="section-title">Aplicação prática</div>
        <div className="application-box">{day.application}</div>
      </section>

      {/* Oração */}
      <section className="section">
        <div className="section-title">Oração</div>
        <div className="prayer-text">{day.prayer}</div>
      </section>

      {/* Anotações */}
      <section className="section">
        <div className="section-title">Suas anotações</div>
        <textarea
          className="notes-textarea"
          placeholder="Escreva livremente — o que ficou, o que resistiu, o que quer levar para o dia..."
          value={localNote}
          onChange={handleNote}
        />
        <div className="notes-meta">
          <span>{localNote.length} caracteres</span>
          <span>{saved ? 'Salvo automaticamente' : 'Salvando...'}</span>
        </div>
      </section>

      <div className="day-end">
        <div className="day-end-mark serif">· · ·</div>
      </div>
    </div>
  );
}

// ============ JORNADA ============
function Journey({ days, currentDay, readMap, onSelect, readCount }) {
  const total = days.length;
  const pct = Math.round((readCount / total) * 100);

  return (
    <div className="fade-in">
      <div className="journey-header">
        <h1 className="journey-title">Quarenta e um dias na Palavra</h1>
        <p className="journey-sub">Um capítulo de Provérbios por dia, intercalado com blocos temáticos de Tiago — sabedoria antiga e fé prática lado a lado.</p>
        <div className="progress-line">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="progress-label mono">{readCount} de {total} · {pct}%</div>
      </div>

      <div className="journey-grid">
        {days.map(d => {
          const read = !!readMap[d.day];
          const current = d.day === currentDay;
          const isTiago = d.verse.ref.toLowerCase().includes('tiago');
          const book = isTiago ? 'Tiago' : 'Provérbios';
          return (
            <button
              key={d.day}
              className={`journey-card ${read ? 'read' : ''} ${current ? 'current' : ''} ${isTiago ? 'is-tiago' : 'is-proverbios'}`}
              onClick={() => onSelect(d.day)}
            >
              <div className="journey-card-day mono">
                <span>DIA {String(d.day).padStart(2, '0')} · {book}</span>
                <span className="journey-card-status" />
              </div>
              <div className="journey-card-theme serif">{d.theme}</div>
              <div className="journey-card-ref mono">{d.verse.ref}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============ NOTES VIEW ============
function NotesView({ days, notes, highlights, onOpen }) {
  const entries = days.filter(d => {
    const hasNote = notes[d.day] && notes[d.day].trim().length > 0;
    const hasHl = highlights[d.day] && highlights[d.day].length > 0;
    return hasNote || hasHl;
  });

  if (entries.length === 0) {
    return (
      <div className="notes-empty fade-in">
        <div className="notes-empty-title serif">Nada ainda</div>
        <div>Suas anotações e trechos sublinhados aparecerão aqui.</div>
      </div>
    );
  }

  const verseText = (day, num) => {
    const v = day.passage.verses.find(x => x.n === num);
    return v ? v.text : '';
  };

  return (
    <div className="notes-list fade-in">
      {entries.map(d => {
        const noteText = notes[d.day];
        const hl = highlights[d.day] || [];
        return (
          <div key={d.day} className="notes-entry">
            <div className="notes-entry-head">
              <div>
                <div className="notes-entry-day mono">DIA {String(d.day).padStart(2, '0')} · {d.verse.ref}</div>
                <div className="notes-entry-theme">{d.theme}</div>
              </div>
              <button className="notes-entry-open" onClick={() => onOpen(d.day)}>abrir dia →</button>
            </div>
            {noteText && <div className="notes-entry-text">{noteText}</div>}
            {hl.length > 0 && (
              <div className="notes-highlights">
                {hl.map(n => (
                  <div key={n} className="notes-highlight-item">
                    <span className="mono" style={{fontSize: 10, marginRight: 8, opacity: 0.6}}>{d.passage.ref} · {n}</span>
                    {verseText(d, n)}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============ MOUNT ============
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
