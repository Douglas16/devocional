window.LECTIO_STUDY = {
  storageKey: 'lectio-ezequiel-v1',
  days: () => window.EZEQUIEL,
  subtitle: 'Ezequiel · 48 dias · NVI',
  journeyTitle: 'Quarenta e oito dias com Ezequiel: glória, juízo e o coração novo',
  journeySub: 'Das rodas cheias de olhos junto ao rio Quebar e dos sinais proféticos mais estranhos da Bíblia, pelo catálogo dos pecados de Jerusalém e os oráculos contra as nações, até o vale de ossos secos que ganham vida e a visão do templo onde a glória do Senhor retorna para sempre — uma travessia completa pelo profeta exilado que viu a santidade de Deus partir e prometeu que ela voltaria. Tradução NVI.',
  sectionFor: (d) => {
    if (d.day <= 11) return 'O chamado, os sinais e a partida da glória';
    if (d.day <= 24) return 'Parábolas e o catálogo do pecado de Jerusalém';
    if (d.day <= 32) return 'Oráculos contra as nações';
    if (d.day <= 39) return 'Restauração: o coração novo e o vale de ossos secos';
    return 'A visão do novo templo e o retorno da glória';
  },
  accentFor: (d) => d.day > 32
};
