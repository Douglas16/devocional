window.LECTIO_STUDY = {
  storageKey: 'lectio-jo-v1',
  days: () => window.JO,
  subtitle: 'Jó · 42 dias · NVI',
  journeyTitle: 'Quarenta e dois dias com Jó: fé em meio ao sofrimento inexplicado',
  journeySub: 'Da prosperidade perdida num só dia e do silêncio de sete dias dos amigos, pelos longos e dolorosos ciclos de discursos sobre por que os justos sofrem, até a voz de Deus no redemoinho e a restauração final — uma travessia honesta pelo livro mais antigo e mais cru da Bíblia sobre fé, dúvida e mistério. Tradução NVI.',
  sectionFor: (d) => {
    if (d.day <= 3) return 'A prova de Jó e o primeiro lamento';
    if (d.day <= 14) return 'Primeiro ciclo de discursos: Elifaz, Bildade e Zofar';
    if (d.day <= 21) return 'Segundo ciclo de discursos: acusações mais duras';
    if (d.day <= 31) return 'Terceiro ciclo e o juramento final de integridade';
    if (d.day <= 37) return 'Os discursos de Eliú';
    if (d.day <= 41) return 'Deus responde do redemoinho';
    return 'O arrependimento de Jó e a restauração';
  },
  accentFor: (d) => d.day > 31
};
