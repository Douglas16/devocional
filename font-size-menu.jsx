/*
 * Componente único do menu de tamanho de letra (React).
 * Usado por app.jsx, app-pedro.jsx, app-joao.jsx, app-sinoticos.jsx e
 * app-tessalonicenses.jsx — não duplicar este componente nem a lista de
 * tamanhos em nenhum outro arquivo.
 * Depende de window.LectioFontSize (font-size.js), carregado antes deste arquivo.
 */
(function () {
  function icon() {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <text x="2" y="17" fontSize="9" fontFamily="sans-serif" stroke="none" fill="currentColor">A</text>
        <text x="11" y="19" fontSize="15" fontFamily="sans-serif" stroke="none" fill="currentColor">A</text>
      </svg>
    );
  }

  function FontSizeMenu(props) {
    const size = props.size;
    const onSetSize = props.onSetSize;
    const openState = React.useState(false);
    const isOpen = openState[0];
    const setOpen = openState[1];
    const ref = React.useRef(null);
    const SIZES = window.LectioFontSize.SIZES;

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
      <div className="fontsize-menu" ref={ref}>
        <button
          className="icon-btn"
          onClick={() => setOpen(o => !o)}
          title="Tamanho da letra"
          aria-expanded={isOpen}
        >
          {icon()}
        </button>
        {isOpen && (
          <div className="fontsize-menu-panel">
            {SIZES.map(s => (
              <button
                key={s.id}
                className={`fontsize-menu-item ${s.id === size ? 'active' : ''}`}
                onClick={() => { onSetSize(s.id); setOpen(false); }}
              >
                <span className="fontsize-menu-item-glyph" style={{ fontSize: `${14 * s.scale}px` }}>Aa</span>
                <span className="fontsize-menu-item-text">
                  <span className="fontsize-menu-item-label">{s.label}</span>
                  <span className="fontsize-menu-item-desc">{s.desc}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  window.LectioFontSizeMenu = FontSizeMenu;
})();
