/*
 * Configuração única de temas do Lectio.
 * Toda página (livros React, jornadas.html, oracoes.html) carrega este
 * arquivo e usa window.LectioTheme — não duplicar a lista de temas
 * nem a leitura/escrita do localStorage em nenhum outro lugar.
 */
(function () {
  var KEY = 'lectio-theme-v1';

  var THEMES = [
    { id: 'light', label: 'Claro', desc: 'Branco quente · minimalista', swatch: '#c1673f' },
    { id: 'dark', label: 'Escuro', desc: 'Contraste suave para a noite', swatch: '#1a1a1a' },
    { id: 'monastic', label: 'Monástica', desc: 'Pergaminho, iluminuras, serifas clássicas', swatch: '#7a2e2e' },
    { id: 'vintage', label: 'Vintage', desc: 'Diário de viagem · papel envelhecido, manuscrito', swatch: '#a35a3a' },
    { id: 'editorial', label: 'Editorial', desc: 'Revista contemporânea cristã', swatch: '#c81e3a' },
    { id: 'nature', label: 'Natureza e Luz', desc: 'Tons terrosos e orgânicos', swatch: '#5c7a4e' }
  ];

  function get() {
    try {
      var stored = localStorage.getItem(KEY);
      if (stored) return stored;
    } catch (e) {}
    try {
      return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (e) { return 'light'; }
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  function set(theme) {
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    apply(theme);
    document.dispatchEvent(new CustomEvent('lectio-theme', { detail: theme }));
  }

  apply(get());

  window.LectioTheme = { KEY: KEY, THEMES: THEMES, get: get, set: set, apply: apply };
})();
