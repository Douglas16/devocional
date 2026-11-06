// Configuração da jornada de Atos; a interface compartilhada está em app-pedro.jsx.
window.LECTIO_STUDY = {
  storageKey: 'lectio-atos-v1',
  hasCartaMode: true, days: () => window.buildAtos(window.LectioMode.get()),
  subtitle: 'Atos dos Apóstolos · 28 dias · NVI',
  journeyTitle: 'Vinte e oito dias com a igreja em movimento',
  journeySub: 'De Jerusalém a Roma: o Espírito forma uma comunidade, atravessa fronteiras e anuncia Jesus em meio a portas abertas, oposição e viagens. Tradução NVI.',
  sectionFor: (d) => d.day <= 8 ? 'Jerusalém' : d.day <= 12 ? 'Judeia e Samaria' : 'Missão gentia',
  accentFor: (d) => d.day > 12
};
