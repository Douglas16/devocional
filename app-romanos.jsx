// Configuração da jornada de Romanos; a interface compartilhada está em app-pedro.jsx.
window.LECTIO_STUDY = {
  storageKey: 'lectio-romanos-v1',
  days: () => window.ROMANOS,
  subtitle: 'Romanos · 18 dias · NVI',
  journeyTitle: 'Dezoito dias com a graça que transforma',
  journeySub: 'Da justiça de Deus à vida compartilhada: uma jornada pela carta de Paulo aos Romanos, onde graça, esperança, misericórdia e missão formam um só caminho. Tradução NVI.',
  sectionFor: (d) => {
    if (d.day <= 6) return 'A justiça de Deus';
    if (d.day <= 10) return 'Vida no Espírito';
    if (d.day <= 13) return 'Misericórdia e promessa';
    return 'Vida em comunidade';
  },
  accentFor: (d) => d.day > 10
};
