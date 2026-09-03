// Une os blocos de 1 Coríntios e atribui a numeração da jornada.
(function () {
  const first = window.CORINTIOS_1 || [];
  const second = window.CORINTIOS_2 || [];
  window.CORINTIOS = [...first, ...second].map((entry, index) => ({ ...entry, day: index + 1 }));
})();
