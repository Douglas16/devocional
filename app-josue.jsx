window.LECTIO_STUDY = {
  storageKey: 'lectio-josue-v1',
  days: () => window.JOSUE,
  subtitle: 'Josué · 24 dias · NVI',
  journeyTitle: 'Vinte e quatro dias com Josué: coragem, conquista e uma promessa cumprida',
  journeySub: 'Da travessia do Jordão à divisão da terra e à renovação final da aliança em Siquém — uma travessia completa pelo livro que celebra a fidelidade de Deus a cada promessa feita. Tradução NVI.',
  sectionFor: (d) => {
    if (d.day <= 12) return 'A conquista da terra';
    if (d.day <= 21) return 'A divisão da terra entre as tribos';
    return 'Aliança renovada e despedida de Josué';
  },
  accentFor: (d) => d.day > 12
};
