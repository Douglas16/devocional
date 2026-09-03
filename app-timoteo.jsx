window.LECTIO_STUDY = {
  storageKey: 'lectio-timoteo-v1',
  days: () => window.TIMOTEO,
  subtitle: '1 e 2 Timóteo · 11 dias · NVI',
  journeyTitle: 'Onze dias para guardar e transmitir a fé',
  journeySub: 'Uma jornada pelas cartas de Paulo a Timóteo: caráter, cuidado, perseverança e a graça de Cristo que sustenta até o fim. Tradução NVI.',
  sectionFor: (d) => d.day <= 6 ? 'Chamado e cuidado' : 'Perseverança e legado',
  accentFor: (d) => d.day > 6
};
