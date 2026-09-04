window.LECTIO_STUDY = {
  storageKey: 'lectio-joel-amos-v1',
  days: () => window.JOEL_AMOS,
  subtitle: 'Joel + Amós · 12 dias · NVI',
  journeyTitle: 'Doze dias com Joel e Amós: o Dia do Senhor e a justiça que corre como águas',
  journeySub: 'Da praga de gafanhotos que se torna sinal do Dia do Senhor e da promessa do Espírito derramado sobre todo o povo, ao pastor de Judá que confrontou a opulência e a injustiça de Israel — dois profetas curtos e urgentes, terminando com a esperança da tenda caída de Davi reconstruída. Tradução NVI.',
  sectionFor: (d) => {
    if (d.day <= 3) return 'Joel: a praga, o Dia do Senhor e o Espírito derramado';
    if (d.day <= 6) return 'Amós: juízo sobre as nações e o privilégio de Israel';
    if (d.day <= 9) return 'Amós: a injustiça de Israel e o chamado à justiça';
    return 'Amós: as visões finais e a restauração prometida';
  },
  accentFor: (d) => d.day > 3
};
