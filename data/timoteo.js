(function () {
  function build(mode) {
    const first = window.LectioMode.resolveDays(window.TIMOTEO_1 || [], window.TIMOTEO_1_CARTA, mode);
    const second = window.LectioMode.resolveDays(window.TIMOTEO_2 || [], window.TIMOTEO_2_CARTA, mode);
    return [...first, ...second].map((entry, index) => ({ ...entry, day: index + 1 }));
  }
  window.buildTimoteo = build;
  window.TIMOTEO = build('classico');
})();
