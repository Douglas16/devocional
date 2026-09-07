// Une os blocos de 2 Coríntios e atribui a numeração da jornada.
(function () {
  function build(mode) {
    const first = window.LectioMode.resolveDays(window.CORINTIOS_2A || [], window.CORINTIOS_2A_CARTA, mode);
    const second = window.LectioMode.resolveDays(window.CORINTIOS_2B || [], window.CORINTIOS_2B_CARTA, mode);
    return [...first, ...second].map((entry, index) => ({ ...entry, day: index + 1 }));
  }
  window.buildCorintios2 = build;
  window.CORINTIOS_2 = build('classico');
})();
