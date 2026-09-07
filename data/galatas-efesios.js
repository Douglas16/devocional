(function () {
  function build(mode) {
    const first = window.LectioMode.resolveDays(window.GALATAS_EFESIOS_1 || [], window.GALATAS_EFESIOS_1_CARTA, mode);
    const second = window.LectioMode.resolveDays(window.GALATAS_EFESIOS_2 || [], window.GALATAS_EFESIOS_2_CARTA, mode);
    return [...first, ...second].map((entry, index) => ({ ...entry, day: index + 1 }));
  }
  window.buildGalatasEfesios = build;
  window.GALATAS_EFESIOS = build('classico');
})();
