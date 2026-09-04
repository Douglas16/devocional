window.LECTIO_STUDY = {
  storageKey: 'lectio-2-samuel-v1',
  days: () => window.SAMUEL_2,
  subtitle: '2 Samuel · 24 dias · NVI',
  journeyTitle: 'Vinte e quatro dias com 2 Samuel: um trono estabelecido para sempre',
  journeySub: 'Da ascensão de Davi como rei sobre todo Israel e a aliança que promete um trono eterno, passando pela queda com Bate-Seba e a rebelião de Absalão, até as últimas palavras do rei — uma travessia completa pela vida complexa e real do rei segundo o coração de Deus. Tradução NVI.',
  sectionFor: (d) => {
    if (d.day <= 5) return 'Davi se torna rei sobre todo Israel';
    if (d.day <= 10) return 'O reino estabelecido e a aliança davídica';
    if (d.day <= 12) return 'O pecado de Davi com Bate-Seba';
    if (d.day <= 18) return 'A rebelião de Absalão';
    if (d.day <= 21) return 'A restauração do reino';
    return 'Os últimos capítulos: cântico, últimas palavras e o altar';
  },
  accentFor: (d) => d.day > 12
};
