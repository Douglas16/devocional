window.LECTIO_STUDY = {
  storageKey: 'lectio-rute-ester-canticos-v1',
  days: () => window.RUTE_ESTER_CANTICOS,
  subtitle: 'Rute + Ester + Cânticos · 22 dias · NVI',
  journeyTitle: 'Vinte e dois dias com Rute, Ester e Cânticos: lealdade, providência e amor',
  journeySub: 'Da lealdade silenciosa de Rute a Noemi e da redenção no portão de Belém, pela coragem de Ester diante do perigo e a providência escondida de Deus, até a poesia do amor conjugal em Cânticos — três pequenos livros, cada um mostrando de um jeito diferente como Deus tece fidelidade, propósito e beleza na vida comum. Tradução NVI.',
  sectionFor: (d) => {
    if (d.day <= 4) return 'Rute: lealdade e redenção em Belém';
    if (d.day <= 14) return 'Ester: coragem e a providência escondida de Deus';
    return 'Cânticos: a poesia do amor conjugal';
  },
  accentFor: (d) => d.day > 14
};
