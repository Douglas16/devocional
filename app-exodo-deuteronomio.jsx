window.LECTIO_STUDY = {
  storageKey: 'lectio-exodo-deuteronomio-v1',
  days: () => window.EXODO_DEUTERONOMIO,
  subtitle: 'Êxodo + Deuteronômio · 74 dias · NVI',
  journeyTitle: 'Setenta e quatro dias entre Êxodo e Deuteronômio: libertação, lei e aliança',
  journeySub: 'Da escravidão no Egito à presença de Deus no tabernáculo, e da travessia pelo deserto à véspera da terra prometida — uma travessia completa pelos dois livros que formam o coração da lei e da aliança. Tradução NVI.',
  sectionFor: (d) => {
    if (d.day <= 18) return 'Libertação do Egito';
    if (d.day <= 24) return 'A aliança no Sinai e os Dez Mandamentos';
    if (d.day <= 31) return 'Instruções para o tabernáculo';
    if (d.day <= 34) return 'O bezerro de ouro e a intercessão de Moisés';
    if (d.day <= 40) return 'A construção do tabernáculo';
    if (d.day <= 44) return 'Moisés relembra a jornada';
    if (d.day <= 51) return 'Os grandes mandamentos e o Shemá';
    if (d.day <= 66) return 'O código de leis de Deuteronômio';
    if (d.day <= 70) return 'Bênçãos, maldições e a renovação da aliança';
    return 'As últimas palavras e a morte de Moisés';
  },
  accentFor: (d) => d.day > 40
};
