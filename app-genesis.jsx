window.LECTIO_STUDY = {
  storageKey: 'lectio-genesis-v1',
  days: () => window.GENESIS,
  subtitle: 'Gênesis · 50 dias · NVI',
  journeyTitle: 'Cinquenta dias com Gênesis: das origens à providência',
  journeySub: 'Da criação do mundo à promessa feita a Abraão, da disputa entre Jacó e Esaú à providência de Deus na vida de José — uma travessia completa pelo livro dos começos. Tradução NVI.',
  sectionFor: (d) => {
    if (d.day <= 11) return 'As origens: criação, queda e o novo começo';
    if (d.day <= 25) return 'Abraão: o chamado e a promessa da aliança';
    if (d.day <= 36) return 'Isaque e Jacó: a promessa em disputa';
    return 'José: quando o mal é transformado em bem';
  },
  accentFor: (d) => d.day > 25
};
