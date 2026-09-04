window.LECTIO_STUDY = {
  storageKey: 'lectio-zacarias-malaquias-v1',
  days: () => window.ZACARIAS_MALAQUIAS,
  subtitle: 'Zacarias + Malaquias · 18 dias · NVI',
  journeyTitle: 'Dezoito dias com Zacarias e Malaquias: as últimas palavras antes do silêncio',
  journeySub: 'Das oito visões noturnas e do rei que viria montado num jumento, pelo pastor traspassado e ferido, até as disputas finais de Malaquias sobre um povo que duvidava do amor de Deus — os dois últimos livros do Antigo Testamento, terminando com a promessa de Elias antes do grande Dia do Senhor. Tradução NVI.',
  sectionFor: (d) => {
    if (d.day <= 6) return 'Zacarias: as oito visões noturnas';
    if (d.day <= 8) return 'Zacarias: chamado à justiça e promessas de restauração';
    if (d.day <= 14) return 'Zacarias: o rei vindouro e o pastor traspassado';
    return 'Malaquias: as últimas palavras antes do silêncio';
  },
  accentFor: (d) => d.day > 14
};
