// Configuração da jornada de 2 Coríntios; a interface está em app-pedro.jsx.
window.LECTIO_STUDY = {
  storageKey: 'lectio-2-corintios-v1',
  days: () => window.CORINTIOS_2,
  subtitle: '2 Coríntios · 13 dias · NVI',
  journeyTitle: 'Treze dias com a força que nasce da fraqueza',
  journeySub: 'Uma jornada por consolo, reconciliação, generosidade e graça suficiente na segunda carta de Paulo aos Coríntios. Tradução NVI.',
  sectionFor: (d) => {
    if (d.day <= 5) return 'Consolo e reconciliação';
    if (d.day <= 9) return 'Vida moldada pela graça';
    return 'Força na fraqueza';
  },
  accentFor: (d) => d.day > 7
};
