window.LECTIO_STUDY = {
  storageKey: 'lectio-esdras-neemias-v1',
  days: () => window.ESDRAS_NEEMIAS,
  subtitle: 'Esdras + Neemias · 23 dias · NVI',
  journeyTitle: 'Vinte e três dias com Esdras e Neemias: o retorno e a reconstrução',
  journeySub: 'Do decreto de Ciro e o alicerce do templo lançado em meio a lágrimas e alegria, pela reforma espiritual de Esdras, até os muros de Jerusalém reerguidos em 52 dias sob a liderança corajosa de Neemias — uma travessia completa pelo povo que voltou do exílio para reconstruir sua cidade e sua fidelidade. Tradução NVI.',
  sectionFor: (d) => {
    if (d.day <= 6) return 'Esdras 1–6: o retorno e a reconstrução do templo';
    if (d.day <= 10) return 'Esdras 7–10: a reforma espiritual de Esdras';
    if (d.day <= 16) return 'Neemias 1–6: os muros de Jerusalém reconstruídos';
    return 'Neemias 7–13: a aliança renovada e as últimas reformas';
  },
  accentFor: (d) => d.day > 10
};
