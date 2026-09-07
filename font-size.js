/*
 * Configuração única de tamanho de letra.
 * Toda página usa window.LectioFontSize — não duplicar a lista de tamanhos
 * nem a leitura/escrita do localStorage em nenhum outro lugar.
 * A escala é aplicada via a variável CSS --text-scale no elemento raiz;
 * styles.css usa unidades rem para que tudo escale junto (desktop e celular).
 */
(function () {
  var KEY = 'lectio-font-scale-v1';

  var SIZES = [
    { id: 'padrao', label: 'Padrão', desc: 'Tamanho normal de leitura', scale: 1 },
    { id: 'grande', label: 'Grande', desc: 'Um pouco maior, mais confortável', scale: 1.15 },
    { id: 'maior', label: 'Maior', desc: 'Leitura facilitada', scale: 1.3 },
    { id: 'extra', label: 'Extra grande', desc: 'Máximo conforto visual', scale: 1.45 }
  ];

  function get() {
    try { return localStorage.getItem(KEY) || 'padrao'; } catch (e) { return 'padrao'; }
  }

  function scaleFor(id) {
    var found = SIZES.filter(function (s) { return s.id === id; })[0];
    return found ? found.scale : 1;
  }

  function apply(id) {
    document.documentElement.style.setProperty('--text-scale', String(scaleFor(id)));
  }

  function set(id) {
    try { localStorage.setItem(KEY, id); } catch (e) {}
    apply(id);
    document.dispatchEvent(new CustomEvent('lectio-font-size', { detail: id }));
  }

  apply(get());

  window.LectioFontSize = { KEY: KEY, SIZES: SIZES, get: get, set: set, apply: apply, scaleFor: scaleFor };
})();
