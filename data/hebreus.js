(function () {
  function build(mode) {
    const first = window.LectioMode.resolveDays(window.HEBREUS_1 || [], window.HEBREUS_1_CARTA, mode);
    const second = window.LectioMode.resolveDays(window.HEBREUS_2 || [], window.HEBREUS_2_CARTA, mode);
    return [...first, ...second].map((entry, index) => ({ ...entry, day: index + 1 }));
  }
  window.buildHebreus = build;
  window.HEBREUS = build('classico');
})();
