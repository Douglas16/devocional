// Configuração da jornada de Atos; a interface compartilhada está em app-pedro.jsx.
window.LECTIO_STUDY = {
  storageKey: 'lectio-atos-v1',
  days: () => window.ATOS,
  subtitle: 'Atos dos Apóstolos · 20 dias · NVI',
  journeyTitle: 'Vinte dias com a igreja em movimento',
  journeySub: 'De Jerusalém a Roma: o Espírito forma uma comunidade, atravessa fronteiras e anuncia Jesus em meio a portas abertas, oposição e viagens. Tradução NVI.',
  sectionFor: (d) => d.day <= 10 ? 'Jerusalém' : 'Missão gentia',
  accentFor: (d) => d.day > 10
};
