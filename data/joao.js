// Lectio — Estudo do Evangelho + Cartas de João (NVI)
// Sequência: 20 dias do Evangelho + 7 dias das cartas = 27 dias
(function() {
  function build(mode) {
    const EV1 = window.LectioMode.resolveDays(window.JOAO_EVANGELHO_1 || [], window.JOAO_EVANGELHO_1_CARTA, mode);
    const EV2 = window.LectioMode.resolveDays(window.JOAO_EVANGELHO_2 || [], window.JOAO_EVANGELHO_2_CARTA, mode);
    const CARTAS = window.LectioMode.resolveDays(window.JOAO_CARTAS || [], window.JOAO_CARTAS_CARTA, mode);
    const sequence = [];
    let dayNum = 1;
    [...EV1, ...EV2, ...CARTAS].forEach(entry => sequence.push({ ...entry, day: dayNum++ }));
    return sequence;
  }
  window.buildJoao = build;
  window.JOAO = build('classico');
})();
