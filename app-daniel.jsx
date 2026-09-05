window.LECTIO_STUDY = {
  storageKey: 'lectio-daniel-v1',
  hasCartaMode: true,
  days: () => window.LectioMode.resolveDays(window.DANIEL, window.DANIEL_CARTA, window.LectioMode.get()),
  subtitle: 'Daniel · 12 dias · NVI',
  journeyTitle: 'Doze dias com Daniel: fidelidade e o Reino que não passa',
  journeySub: 'Da integridade em Babilônia às visões do fim dos tempos — uma jornada por Daniel, com histórias de coragem e profecias do Reino eterno de Deus. Tradução NVI.',
  sectionFor: (d) => d.day <= 6 ? 'Fidelidade em Babilônia' : 'Visões do Reino eterno',
  accentFor: (d) => d.day > 6
};
