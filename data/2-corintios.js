// Une os blocos de 2 Coríntios e atribui a numeração da jornada.
(function () {
  const first = window.CORINTIOS_2A || [];
  const second = window.CORINTIOS_2B || [];
  window.CORINTIOS_2 = [...first, ...second].map((entry, index) => ({ ...entry, day: index + 1 }));
})();
