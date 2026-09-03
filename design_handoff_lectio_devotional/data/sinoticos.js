// Lectio — Estudo dos Evangelhos Sinóticos (NVI)
// 20 dias de passagens comuns (harmonização cronológica)
// 15 dias de passagens exclusivas (5 Mateus + 2 Marcos + 8 Lucas)
// Total: 35 dias

(function() {
  const C1 = window.SINOTICOS_COMUNS_1 || [];
  const C2 = window.SINOTICOS_COMUNS_2 || [];
  const EX = window.SINOTICOS_EXCLUSIVOS || [];

  const sequence = [];
  let dayNum = 1;

  [...C1, ...C2, ...EX].forEach(entry => {
    sequence.push({ ...entry, day: dayNum++ });
  });

  window.SINOTICOS = sequence;
})();
