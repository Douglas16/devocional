window.LECTIO_STUDY = {
  storageKey: 'lectio-2-reis-v1',
  days: () => window.REIS_2,
  subtitle: '2 Reis · 41 dias · NVI',
  journeyTitle: 'Quarenta e um dias com 2 Reis: de Elias a Josias, até o fim do reino',
  journeySub: 'Do carro de fogo que arrebata Elias e dos milagres de Eliseu, pela queda de Samaria e o reino do norte, até as reformas de Ezequias e Josias e a queda final de Jerusalém — uma travessia por 2 Reis intercalada, capítulo a capítulo, com os relatos paralelos de 2 Crônicas. Tradução NVI.',
  sectionFor: (d) => {
    if (d.day <= 25) return '2 Reis 1–17 e 2 Crônicas 21–28: Elias, Eliseu e a queda de Israel';
    return '2 Reis 18–25 e 2 Crônicas 29–36: Ezequias, Josias e o fim de Judá';
  },
  accentFor: (d) => d.day > 25
};
