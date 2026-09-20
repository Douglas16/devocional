// Lectio — Estudo dos Evangelhos Sinóticos (NVI)
// Leitura integral dos três evangelhos, em ordem canônica:
// Mateus 1–28, Marcos 1–16, Lucas 1–24.
// 20 dias de passagens comuns (harmonização), 15 de passagens exclusivas
// e 35 dias escritos depois para os capítulos que faltavam. Total: 70 dias.
// Os dias mantêm o texto original; o que mudou foi a ordem e a numeração.

(function() {
  const ORDER = { 'Mateus': 0, 'Marcos': 1, 'Lucas': 2 };

  // Evangelho e capítulo de um dia, lidos da referência da passagem
  // ("Mateus 3 · capítulo completo (NVI)", "Lucas 1-2").
  function positionOf(entry) {
    const m = (entry.passage && entry.passage.ref || '').match(/^(Mateus|Marcos|Lucas)\s+(\d+)/);
    return m ? [ORDER[m[1]], +m[2]] : [99, 99];
  }

  function build(mode) {
    const C1 = window.LectioMode.resolveDays(window.SINOTICOS_COMUNS_1 || [], window.SINOTICOS_COMUNS_1_CARTA, mode);
    const C2 = window.LectioMode.resolveDays(window.SINOTICOS_COMUNS_2 || [], window.SINOTICOS_COMUNS_2_CARTA, mode);
    const EX = window.LectioMode.resolveDays(window.SINOTICOS_EXCLUSIVOS || [], window.SINOTICOS_EXCLUSIVOS_CARTA, mode);
    const RE = window.LectioMode.resolveDays(window.SINOTICOS_RESTANTES || [], window.SINOTICOS_RESTANTES_CARTA, mode);

    // Ordem canônica; empates (dois dias no mesmo capítulo) mantêm a ordem de origem.
    const sequence = [...C1, ...C2, ...EX, ...RE]
      .map((entry, i) => ({ entry: entry, i: i, pos: positionOf(entry) }))
      .sort((a, b) => a.pos[0] - b.pos[0] || a.pos[1] - b.pos[1] || a.i - b.i)
      .map((x, index) => Object.assign({}, x.entry, { day: index + 1 }));

    return sequence;
  }
  window.buildSinoticos = build;
  window.SINOTICOS = build('classico');
})();
