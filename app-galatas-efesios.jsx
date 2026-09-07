window.LECTIO_STUDY = {
  storageKey: 'lectio-galatas-efesios-v1',
  hasCartaMode: true, days: () => window.buildGalatasEfesios(window.LectioMode.get()),
  subtitle: 'Gálatas + Efésios · 12 dias · NVI',
  journeyTitle: 'Doze dias de liberdade e nova vida em Cristo',
  journeySub: 'Da liberdade do evangelho à nova humanidade formada pelo Espírito: uma jornada por Gálatas e Efésios. Tradução NVI.',
  sectionFor: (d) => d.day <= 6 ? 'Liberdade do evangelho' : 'Nova vida em Cristo',
  accentFor: (d) => d.day > 6
};
