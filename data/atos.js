// Lectio — Atos dos Apóstolos (NVI), 20 dias
(function () {
  const first = window.ATOS_1 || [];
  const second = window.ATOS_2 || [];
  window.ATOS = [...first, ...second].map((entry, index) => ({ ...entry, day: index + 1 }));
})();
