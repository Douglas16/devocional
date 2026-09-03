// Lectio — Estudo do Evangelho + Cartas de João (NVI)
// Sequência: 20 dias do Evangelho + 7 dias das cartas = 27 dias
(function() {
  const EV1 = window.JOAO_EVANGELHO_1 || [];
  const EV2 = window.JOAO_EVANGELHO_2 || [];
  const CARTAS = window.JOAO_CARTAS || [];
  const sequence = [];
  let dayNum = 1;
  [...EV1, ...EV2, ...CARTAS].forEach(entry => sequence.push({ ...entry, day: dayNum++ }));
  window.JOAO = sequence;
})();
