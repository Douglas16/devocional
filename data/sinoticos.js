// Lectio — Estudo dos Evangelhos Sinóticos (NVI)
// 20 dias de passagens comuns (harmonização cronológica)
// 15 dias de passagens exclusivas (5 Mateus + 2 Marcos + 8 Lucas)
// Total: 35 dias

(function() {
  function build(mode) {
    const C1 = window.LectioMode.resolveDays(window.SINOTICOS_COMUNS_1 || [], window.SINOTICOS_COMUNS_1_CARTA, mode);
    const C2 = window.LectioMode.resolveDays(window.SINOTICOS_COMUNS_2 || [], window.SINOTICOS_COMUNS_2_CARTA, mode);
    const EX = window.LectioMode.resolveDays(window.SINOTICOS_EXCLUSIVOS || [], window.SINOTICOS_EXCLUSIVOS_CARTA, mode);

    const sequence = [];
    let dayNum = 1;

    [...C1, ...C2, ...EX].forEach(entry => {
      sequence.push({ ...entry, day: dayNum++ });
    });

    return sequence;
  }
  window.buildSinoticos = build;
  window.SINOTICOS = build('classico');
})();
