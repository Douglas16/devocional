// Lectio v2 — Plano de Leitura: Provérbios + Tiago
// Sequência intercalada: 2 Provérbios, 1 Tiago, repete → 41 dias total
//
// window.buildDevotional(mode) monta a sequência para 'classico' ou 'carta'
// (data/carta/proverbios-*.js) — Tiago não tem versão carta, então nesses
// dias cai no clássico automaticamente (ver LectioMode.resolveDays).
// window.DEVOTIONAL continua sendo a versão clássica estática, usada pelas
// estatísticas de jornadas.html (que só precisam da estrutura da passagem,
// igual em ambos os modos).

(function() {
  function build(mode) {
    const PV = [
      ...window.LectioMode.resolveDays(window.PROVERBIOS_1_10  || [], window.PROVERBIOS_1_10_CARTA,  mode),
      ...window.LectioMode.resolveDays(window.PROVERBIOS_11_20 || [], window.PROVERBIOS_11_20_CARTA, mode),
      ...window.LectioMode.resolveDays(window.PROVERBIOS_21_31 || [], window.PROVERBIOS_21_31_CARTA, mode)
    ];
    const TG = window.TIAGO_BLOCOS || [];

    // Sequência: PV1, PV2, TG1, PV3, PV4, TG2, PV5, PV6, TG3, ...
    // Padrão de 3 dias que se repete: PV, PV, TG
    const sequence = [];
    let pvIdx = 0, tgIdx = 0, dayNum = 1;

    while (pvIdx < PV.length) {
      // dois provérbios
      if (pvIdx < PV.length) sequence.push({ ...PV[pvIdx++], day: dayNum++ });
      if (pvIdx < PV.length) sequence.push({ ...PV[pvIdx++], day: dayNum++ });
      // um Tiago (se ainda houver)
      if (tgIdx < TG.length) sequence.push({ ...TG[tgIdx++], day: dayNum++ });
    }

    // Se sobraram blocos de Tiago (raro, mas por segurança), coloca no fim
    while (tgIdx < TG.length) {
      sequence.push({ ...TG[tgIdx++], day: dayNum++ });
    }

    return sequence;
  }

  window.buildDevotional = build;
  window.DEVOTIONAL = build('classico');
})();
