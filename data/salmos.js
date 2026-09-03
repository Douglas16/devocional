// Lectio — Salmos, 150 dias. A ordem canônica é preservada: um salmo por dia.
(function () {
  const bookFor = (n) => n <= 41 ? ['Livro I · Confiança e lamento', 'tehil·lâ', 'תְּהִלָּה', 'louvor'] : n <= 72 ? ['Livro II · Sede e realeza', 'nefesh', 'נֶפֶשׁ', 'vida, pessoa inteira'] : n <= 89 ? ['Livro III · Crise e memória', 'hesed', 'חֶסֶד', 'amor leal'] : n <= 106 ? ['Livro IV · Refúgio e reinado', 'batach', 'בָּטַח', 'confiar, apoiar-se em Deus'] : ['Livro V · Peregrinação e louvor', 'shalom', 'שָׁלוֹם', 'paz, inteireza'];
  window.SALMOS = Array.from({ length: 150 }, (_, index) => {
    const psalm = index + 1;
    const [section, translit, original, meaning] = bookFor(psalm);
    return {
      day: psalm,
      theme: `${section} · Salmo ${psalm}`,
      date: `Salmo ${psalm}`,
      verse: { text: `Ore e leia o Salmo ${psalm} inteiro, permitindo que suas palavras deem linguagem à sua vida diante de Deus.`, ref: `Salmo ${psalm}` },
      word: { original, translit, lang: 'hebraico', meaning, note: `Neste trecho, a linguagem do Saltério convida a voltar-se a Deus com verdade. Leia o salmo inteiro na NVI e observe como ${translit} ganha forma em suas imagens, pedidos e louvor.` },
      context: `Este é o dia ${psalm} da jornada pelo Saltério. Leia o Salmo ${psalm} integralmente na NVI antes de seguir a meditação e perceba seu movimento: de que situação o salmista parte, o que pede e como se volta para Deus.`,
      passage: { ref: `Salmo ${psalm} · leitura integral na NVI`, verses: [{ n: 1, text: `Leia o Salmo ${psalm} completo na sua Bíblia NVI.` }] },
      meditation: [`O Salmo ${psalm} não exige que você chegue a Deus com sentimentos prontos. Ele oferece palavras para nomear a realidade diante daquele que escuta.`, `Observe qual verdade humana aparece no texto: louvor, medo, culpa, injustiça, gratidão ou espera. Nada disso precisa ser escondido de Deus.`, `Transforme a leitura em oração. Em vez de apenas analisar o salmo, responda ao Senhor com honestidade e dê hoje um pequeno passo de confiança.`],
      questions: ['Que palavra ou imagem deste salmo mais descreve seu momento atual?', 'O que o texto revela sobre Deus que você precisa recordar?', 'Como este salmo pode se tornar sua oração concreta hoje?'],
      application: `Leia o Salmo ${psalm} novamente, mais devagar, e escreva uma frase de oração usando uma de suas imagens ou pedidos.`,
      prayer: `Senhor, recebe minha vida como ela está. Usa o Salmo ${psalm} para ensinar-me a confiar, lamentar, agradecer e esperar diante de ti. Amém.`
    };
  });
})();
