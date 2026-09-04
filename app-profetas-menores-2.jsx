window.LECTIO_STUDY = {
  storageKey: 'lectio-profetas-menores-2-v1',
  days: () => window.PROFETAS_MENORES_2,
  subtitle: 'Obadias + Jonas + Miquéias + Naum + Habacuque + Sofonias + Ageu · 23 dias · NVI',
  journeyTitle: 'Vinte e três dias com sete profetas: orgulho derrubado, misericórdia e um Deus que canta',
  journeySub: 'Do juízo sobre o orgulho de Edom e do profeta relutante enviado a Nínive, pela justiça e esperança messiânica de Miquéias, o Deus que sustenta a fé em meio à crise de Habacuque, até a alegria final de Sofonias e o chamado prático de Ageu a reordenar prioridades — sete livros curtos, cada um com sua própria voz. Tradução NVI.',
  sectionFor: (d) => {
    if (d.day <= 1) return 'Obadias: o orgulho de Edom derrubado';
    if (d.day <= 5) return 'Jonas: o profeta relutante e a misericórdia de Deus';
    if (d.day <= 12) return 'Miquéias: justiça, esperança messiânica e perdão';
    if (d.day <= 15) return 'Naum: o juízo sobre Nínive';
    if (d.day <= 18) return 'Habacuque: fé em meio à crise';
    if (d.day <= 21) return 'Sofonias: do juízo severo à alegria final';
    return 'Ageu: prioridades reordenadas para a casa de Deus';
  },
  accentFor: (d) => d.day > 12
};
