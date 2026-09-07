/*
 * Botão único de compartilhamento no WhatsApp (React).
 * Usado no Reader de todos os livros (verso, aplicação, oração) —
 * não duplicar este componente em nenhum outro arquivo.
 * Depende de window.LectioShare (share.js), carregado antes deste arquivo.
 */
(function () {
  function ShareButton(props) {
    const text = props.text;
    const label = props.label || 'Compartilhar no WhatsApp';
    const onClick = () => window.LectioShare.open(text);

    return (
      <button type="button" className="share-btn" onClick={onClick} title={label} aria-label={label}>
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.87 9.87 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.12-2.9-6.98A9.82 9.82 0 0 0 12.04 2zm5.8 14.14c-.24.68-1.4 1.3-1.93 1.38-.49.08-1.11.11-1.79-.11-.41-.13-.94-.31-1.62-.6-2.85-1.23-4.71-4.1-4.85-4.29-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09.99-2.38.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.16-.19.68-.79.86-1.06.18-.28.36-.23.6-.14.24.09 1.55.73 1.82.87.27.13.45.19.51.3.07.11.07.63-.17 1.31z"/>
        </svg>
        <span>Compartilhar</span>
      </button>
    );
  }

  window.LectioShareButton = ShareButton;
})();
