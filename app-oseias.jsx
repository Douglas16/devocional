window.LECTIO_STUDY = {
  storageKey: 'lectio-oseias-v1',
  days: () => window.OSEIAS,
  subtitle: 'Oseias · 14 dias · NVI',
  journeyTitle: 'Catorze dias com Oseias: o amor que não desiste',
  journeySub: 'Do casamento de Oseias com Gômer como sinal profético vivo, pelo processo judicial de Deus contra a infidelidade de Israel, até o coração de pai ferido do capítulo 11 e a promessa final de cura completa — uma travessia pelo profeta que viveu, em carne própria, o amor que persegue mesmo depois da traição. Tradução NVI.',
  sectionFor: (d) => {
    if (d.day <= 3) return 'O casamento de Oseias: um sinal profético vivo';
    if (d.day <= 8) return 'O processo de Deus contra a infidelidade de Israel';
    if (d.day <= 11) return 'Juízo iminente e o coração de pai de Deus';
    return 'Retorno e a promessa de cura completa';
  },
  accentFor: (d) => d.day > 8
};
