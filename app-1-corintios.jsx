// Configuração da jornada de 1 Coríntios; a interface está em app-pedro.jsx.
window.LECTIO_STUDY = {
  storageKey: 'lectio-1-corintios-v1',
  days: () => window.CORINTIOS,
  subtitle: '1 Coríntios · 14 dias · NVI',
  journeyTitle: 'Quatorze dias com uma igreja formada pela cruz',
  journeySub: 'De uma comunidade dividida à esperança da ressurreição: Paulo nos convida a viver liberdade, dons e coragem no caminho do amor. Tradução NVI.',
  sectionFor: (d) => {
    if (d.day <= 3) return 'A cruz forma uma comunidade';
    if (d.day <= 7) return 'Santidade no cotidiano';
    if (d.day <= 10) return 'Dons e amor';
    return 'A esperança da ressurreição';
  },
  accentFor: (d) => d.day > 7
};
