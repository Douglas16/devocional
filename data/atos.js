// Lectio — Atos dos Apóstolos (NVI), 20 dias
(function () {
  function build(mode) {
    const first = window.LectioMode.resolveDays(window.ATOS_1 || [], window.ATOS_1_CARTA, mode);
    const second = window.LectioMode.resolveDays(window.ATOS_2 || [], window.ATOS_2_CARTA, mode);
    return [...first, ...second].map((entry, index) => ({ ...entry, day: index + 1 }));
  }
  window.buildAtos = build;
  window.ATOS = build('classico');
})();
