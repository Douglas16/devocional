// Une os blocos de 1 Coríntios e atribui a numeração da jornada.
(function () {
  function build(mode) {
    const first = window.LectioMode.resolveDays(window.CORINTIOS_1 || [], window.CORINTIOS_1_CARTA, mode);
    const second = window.LectioMode.resolveDays(window.CORINTIOS_2 || [], window.CORINTIOS_2_CARTA, mode);
    return [...first, ...second].map((entry, index) => ({ ...entry, day: index + 1 }));
  }
  window.buildCorintios1 = build;
  window.CORINTIOS = build('classico');
})();
