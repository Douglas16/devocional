// Configuração dos dados de Romanos: une os dois blocos e numera a jornada.
(function () {
  const first = window.ROMANOS_1 || [];
  const second = window.ROMANOS_2 || [];
  window.ROMANOS = [...first, ...second].map((entry, index) => ({ ...entry, day: index + 1 }));
})();
