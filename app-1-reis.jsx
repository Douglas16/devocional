window.LECTIO_STUDY = {
  storageKey: 'lectio-1-reis-v1',
  days: () => window.REIS_1,
  subtitle: '1 Reis · 52 dias · NVI',
  journeyTitle: 'Cinquenta e dois dias com 1 Reis: de Davi a Salomão, do templo ao reino dividido',
  journeySub: 'Da linhagem que atravessa gerações e da entrega do trono de Davi a Salomão, pela sabedoria e pelo templo erguido em Jerusalém, até a divisão do reino e o fogo que desce sobre o Carmelo — uma travessia por 1 Reis intercalada, capítulo a capítulo, com os relatos paralelos de 1 e 2 Crônicas. Tradução NVI.',
  sectionFor: (d) => {
    if (d.day <= 2) return '1 Crônicas 1–9: a linhagem que chega ao trono';
    if (d.day <= 12) return '1 Crônicas 22–29 e 1 Reis 1–2: Davi entrega o reino a Salomão';
    if (d.day <= 30) return '1 Reis 3–11 e 2 Crônicas 1–9: a sabedoria e o templo de Salomão';
    return '1 Reis 12–22 e 2 Crônicas 10–20: o reino dividido e o profeta do fogo';
  },
  accentFor: (d) => d.day > 30
};
