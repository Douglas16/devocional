// Configuração dos dados de Romanos: une os dois blocos e numera a jornada.
(function () {
  function build(mode) {
    const first = window.LectioMode.resolveDays(window.ROMANOS_1 || [], window.ROMANOS_1_CARTA, mode);
    const second = window.LectioMode.resolveDays(window.ROMANOS_2 || [], window.ROMANOS_2_CARTA, mode);
    return [...first, ...second].map((entry, index) => ({ ...entry, day: index + 1 }));
  }
  window.buildRomanos = build;
  window.ROMANOS = build('classico');
})();
