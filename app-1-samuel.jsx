window.LECTIO_STUDY = {
  storageKey: 'lectio-1-samuel-v1',
  days: () => window.SAMUEL_1,
  subtitle: '1 Samuel · 31 dias · NVI',
  journeyTitle: 'Trinta e um dias com 1 Samuel: do juiz fiel ao rei rejeitado',
  journeySub: 'Da oração de Ana ao nascimento de Samuel, da ascensão e queda de Saul à amizade entre Davi e Jônatas em meio à perseguição — uma travessia completa pelo livro que prepara o trono para o rei segundo o coração de Deus. Tradução NVI.',
  sectionFor: (d) => {
    if (d.day <= 7) return 'Samuel: do nascimento ao juiz fiel';
    if (d.day <= 15) return 'O primeiro rei: a ascensão e queda de Saul';
    if (d.day <= 20) return 'Davi e Jônatas: a amizade em meio à perseguição';
    if (d.day <= 27) return 'Davi fugitivo: sobrevivendo à perseguição de Saul';
    return 'O fim de Saul';
  },
  accentFor: (d) => d.day > 15
};
