/*
 * Componente único do menu de aparência (React).
 * Todo livro (app.jsx, app-pedro.jsx, app-joao.jsx, app-sinoticos.jsx,
 * app-tessalonicenses.jsx) usa <window.LectioThemeMenu/> — não duplicar
 * este componente nem a lista de temas em nenhum app-*.jsx.
 * Depende de window.LectioTheme (theme.js), carregado antes deste arquivo.
 */
(function () {
  function icon(name) {
    if (name === 'sun') {
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>;
    }
    if (name === 'moon') {
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
    }
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.3A4.2 4.2 0 0 0 22 11c0-5-4.5-9-10-9z"/><circle cx="7" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="9.5" cy="7.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="7.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="17" cy="12" r="1.2" fill="currentColor" stroke="none"/></svg>;
  }

  function ThemeMenu(props) {
    const theme = props.theme;
    const onSetTheme = props.onSetTheme;
    const open = React.useState(false);
    const isOpen = open[0];
    const setOpen = open[1];
    const ref = React.useRef(null);
    const THEMES = window.LectioTheme.THEMES;

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

    return (
      <div className="theme-menu" ref={ref}>
        <button
          className="icon-btn"
          onClick={() => setOpen(o => !o)}
          title="Mudar aparência"
          aria-expanded={isOpen}
        >
          {theme === 'dark' ? icon('sun') : theme === 'light' ? icon('moon') : icon('palette')}
        </button>
        {isOpen && (
          <div className="theme-menu-panel">
            {THEMES.map(t => (
              <button
                key={t.id}
                className={`theme-menu-item ${t.id === theme ? 'active' : ''}`}
                onClick={() => { onSetTheme(t.id); setOpen(false); }}
              >
                <span className="theme-swatch" style={{ background: t.swatch }} />
                <span className="theme-menu-item-text">
                  <span className="theme-menu-item-label">{t.label}</span>
                  <span className="theme-menu-item-desc">{t.desc}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  window.LectioThemeMenu = ThemeMenu;
})();
