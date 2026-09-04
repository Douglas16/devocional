window.LECTIO_STUDY = {
  storageKey: 'lectio-juizes-v1',
  days: () => window.JUIZES,
  subtitle: 'Juízes · 21 dias · NVI',
  journeyTitle: 'Vinte e um dias com Juízes: o ciclo da graça repetida',
  journeySub: 'Do fracasso da conquista incompleta ao caos moral de um povo sem rei — uma travessia completa pelos libertadores imperfeitos que Deus levantou repetidas vezes por seu povo. Tradução NVI.',
  sectionFor: (d) => {
    if (d.day <= 2) return 'A conquista incompleta e o ciclo de apostasia';
    if (d.day <= 8) return 'Otoniel, Eúde, Débora e Gideão';
    if (d.day <= 16) return 'Abimeleque, Jefté e Sansão';
    return 'Sem rei em Israel: o epílogo do caos moral';
  },
  accentFor: (d) => d.day > 8
};
