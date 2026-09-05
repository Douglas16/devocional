/*
 * Configuração única do "tipo de devocional" (modo de conteúdo).
 * Toda página que tem uma versão alternativa em data/carta/*.js usa
 * window.LectioMode — não duplicar a lista de modos nem a leitura/escrita
 * do localStorage em nenhum outro lugar.
 */
(function () {
  var KEY = 'lectio-devotional-mode-v1';

  var MODES = [
    { id: 'classico', label: 'Clássico', desc: 'Contexto histórico, palavra original e perguntas de estudo' },
    { id: 'carta', label: 'Carta ao Coração', desc: 'Tom pastoral e intimista, em forma de carta — mesma base bíblica' }
  ];

  function get() {
    try { return localStorage.getItem(KEY) || 'classico'; } catch (e) { return 'classico'; }
  }

  function set(mode) {
    try { localStorage.setItem(KEY, mode); } catch (e) {}
    document.dispatchEvent(new CustomEvent('lectio-mode', { detail: mode }));
  }

  // Combina um array clássico com seu par em data/carta/*, dia a dia
  // (por posição, já que o campo day pode ainda não ter sido atribuído).
  // Quando não existe versão alternativa para um dia específico, mantém o clássico.
  function resolveDays(classicArr, cartaArr, mode) {
    if (mode !== 'carta' || !cartaArr || !cartaArr.length) return classicArr;
    return classicArr.map(function (d, i) {
      var alt = cartaArr[i];
      return alt ? Object.assign({}, alt, { day: d.day }) : d;
    });
  }

  window.LectioMode = { KEY: KEY, MODES: MODES, get: get, set: set, resolveDays: resolveDays };
})();
