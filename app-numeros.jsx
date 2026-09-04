window.LECTIO_STUDY = {
  storageKey: 'lectio-numeros-v1',
  days: () => window.NUMEROS,
  subtitle: 'Números · 36 dias · NVI',
  journeyTitle: 'Trinta e seis dias com Números: a jornada pelo deserto',
  journeySub: 'Do recenseamento no Sinai à véspera da terra prometida — uma travessia completa pelos quarenta anos de deserto, marcados por queixas, rebeliões e a fidelidade constante de Deus a cada nova geração. Tradução NVI.',
  sectionFor: (d) => {
    if (d.day <= 4) return 'O recenseamento e a organização do acampamento';
    if (d.day <= 10) return 'Leis de pureza, o voto nazireu e a partida do Sinai';
    if (d.day <= 14) return 'Queixas, os doze espias e a rebelião';
    if (d.day <= 19) return 'Leis adicionais, a rebelião de Corá e o florescer da vara de Arão';
    if (d.day <= 25) return 'A serpente de bronze, Balaão e a apostasia em Baal-Peor';
    if (d.day <= 30) return 'O segundo recenseamento e leis de sucessão e voto';
    return 'A guerra contra Midiã e a preparação final para a terra';
  },
  accentFor: (d) => d.day > 18
};
