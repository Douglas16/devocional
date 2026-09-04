window.LECTIO_STUDY = {
  storageKey: 'lectio-levitico-v1',
  days: () => window.LEVITICO,
  subtitle: 'Levítico · 27 dias · NVI',
  journeyTitle: 'Vinte e sete dias com Levítico: sejam santos, porque eu sou santo',
  journeySub: 'Dos sacrifícios que ensinam entrega total ao chamado de amar o próximo como a si mesmo — uma travessia pelo livro mais detalhado da lei, revelando um Deus que se importa com cada aspecto da vida do seu povo. Tradução NVI.',
  sectionFor: (d) => {
    if (d.day <= 7) return 'As leis dos sacrifícios';
    if (d.day <= 10) return 'A ordenação dos sacerdotes e o fogo estranho';
    if (d.day <= 15) return 'Leis de pureza: o que é limpo e impuro';
    if (d.day <= 17) return 'O Dia da Expiação e o valor do sangue';
    if (d.day <= 22) return 'O Código de Santidade: sejam santos, porque eu sou santo';
    if (d.day <= 25) return 'As festas, o sábado e o jubileu';
    return 'Bênçãos, maldições e votos';
  },
  accentFor: (d) => d.day > 16
};
