window.LECTIO_STUDY = {
  storageKey: 'lectio-isaias-v1',
  days: () => window.ISAIAS,
  subtitle: 'Isaías · 66 dias · NVI',
  journeyTitle: 'Sessenta e seis dias com Isaías: juízo, consolo e o Servo Sofredor',
  journeySub: 'Do julgamento sobre a soberba humana ao consolo do Deus que carrega seu povo, até a promessa de novos céus e nova terra — uma travessia completa pelo maior dos profetas. Tradução NVI.',
  sectionFor: (d) => {
    if (d.day <= 12) return 'Julgamento e o Livro de Emanuel';
    if (d.day <= 27) return 'Oráculos contra as nações e o Apocalipse de Isaías';
    if (d.day <= 39) return 'Ais, promessas e a fé de Ezequias';
    if (d.day <= 55) return 'Consolo, o Servo Sofredor e o novo êxodo';
    return 'Novos céus, nova terra';
  },
  accentFor: (d) => d.day > 39
};
