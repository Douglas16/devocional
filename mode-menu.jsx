/*
 * Componente único do menu de "tipo de devocional" (React).
 * Usado por app.jsx (Provérbios) e por app-pedro.jsx (Apocalipse, Daniel —
 * qualquer STUDY que declare hasCartaMode: true). Não duplicar este
 * componente nem a lista de modos em nenhum outro arquivo.
 * Depende de window.LectioMode (devotional-mode.js), carregado antes deste arquivo.
 */
(function () {
  function icon(name) {
    if (name === 'letter') {
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>;
    }
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
  }

  function ModeMenu(props) {
    const mode = props.mode;
    const onSetMode = props.onSetMode;
    const available = props.available;
    const openState = React.useState(false);
    const isOpen = openState[0];
    const setOpen = openState[1];
    const ref = React.useRef(null);
    const MODES = window.LectioMode.MODES;

    React.useEffect(() => {
      if (!isOpen) return;
      const onDocClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
      const onEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
      document.addEventListener('mousedown', onDocClick);
      document.addEventListener('keydown', onEsc);
      return () => {
        document.removeEventListener('mousedown', onDocClick);
        document.removeEventListener('keydown', onEsc);
      };
    }, [isOpen]);

    if (!available) return null;

    return (
      <div className="mode-menu" ref={ref}>
        <button
          className="icon-btn"
          onClick={() => setOpen(o => !o)}
          title="Mudar tipo de devocional"
          aria-expanded={isOpen}
        >
          {mode === 'carta' ? icon('letter') : icon('book')}
        </button>
        {isOpen && (
          <div className="mode-menu-panel">
            {MODES.map(m => (
              <button
                key={m.id}
                className={`mode-menu-item ${m.id === mode ? 'active' : ''}`}
                onClick={() => { onSetMode(m.id); setOpen(false); }}
              >
                <span className="mode-menu-item-icon">{icon(m.id === 'carta' ? 'letter' : 'book')}</span>
                <span className="mode-menu-item-text">
                  <span className="mode-menu-item-label">{m.label}</span>
                  <span className="mode-menu-item-desc">{m.desc}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  window.LectioModeMenu = ModeMenu;
})();
