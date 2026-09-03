window.LECTIO_STUDY = {
  storageKey: 'lectio-jeremias-lamentacoes-v1',
  days: () => window.JEREMIAS_LAMENTACOES,
  subtitle: 'Jeremias + Lamentações · 57 dias · NVI',
  journeyTitle: 'Cinquenta e sete dias com Jeremias: lágrimas, juízo e uma aliança nova',
  journeySub: 'Do chamado de um jovem profeta ao luto sobre as ruínas de Jerusalém — uma travessia completa pelo profeta que chorou, confrontou reis e anunciou uma aliança escrita no coração. Tradução NVI.',
  sectionFor: (d) => {
    if (d.day <= 6) return 'Chamado e a acusação inicial';
    if (d.day <= 20) return 'O templo, os falsos deuses e as confissões de Jeremias';
    if (d.day <= 29) return 'Reis, falsos profetas e o jugo da Babilônia';
    if (d.day <= 33) return 'O Livro da Consolação e a Nova Aliança';
    if (d.day <= 45) return 'O cerco, a queda de Jerusalém e o remanescente';
    if (d.day <= 52) return 'Oráculos contra as nações e o apêndice histórico';
    return 'Lamentações: luto e esperança sobre as ruínas';
  },
  accentFor: (d) => d.day > 29
};
