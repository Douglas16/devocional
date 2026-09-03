Novo estudo: Salmos (NVI)

Conceito

Uma jornada integral de 150 dias, um salmo por dia. Salmos não deve ser tratado como uma coleção de frases de efeito: é o livro de oração de Israel e da igreja, com espaço para louvor, lamento, medo, culpa, gratidão, sabedoria, protesto, confiança e esperança.

A jornada preservará a particularidade de cada salmo e, ao mesmo tempo, ajudará o leitor a aprender a orar com o texto. O objetivo não é fazer o leitor “sentir-se bem” todos os dias, mas oferecer linguagem fiel para dizer a verdade diante de Deus.

Estrutura do livro

O Saltério é dividido em cinco livros, cada um encerrado por uma doxologia:

1. Livro I — Salmos 1–41: dois caminhos, confiança individual, lamento e a realeza de Deus.
2. Livro II — Salmos 42–72: sede de Deus, lamentos comunitários, realeza e esperança para as nações.
3. Livro III — Salmos 73–89: crise, sofrimento coletivo, memória do templo e a pergunta sobre a promessa davídica.
4. Livro IV — Salmos 90–106: fragilidade humana, Deus como refúgio e o Senhor que reina.
5. Livro V — Salmos 107–150: gratidão, peregrinação, Torá, realeza, restauração e louvor final.

Formato da jornada

- 150 dias, exatamente um salmo por dia, seguindo a ordem canônica.
- O título de cada dia traz “Livro I–V” e o tipo predominante do salmo: lamento, louvor, sabedoria, ação de graças, real/messiânico, peregrinação, penitencial ou confiança.
- Salmos longos (especialmente 18, 78, 89, 119, 136 e 139) continuam sendo um dia completo para preservar a unidade literária. A leitura mostrará versículos selecionados; o campo de contexto orientará a leitura integral na NVI.
- No Salmo 119, a jornada destacará que ele é um acróstico hebraico de 22 estrofes, sem reduzir sua meditação ao tamanho do texto exibido.

Palavras-chave em hebraico

- tehil·lâ (תְּהִלָּה) — louvor. Mais que música animada, é a resposta pública à beleza, fidelidade e justiça de Deus.
- hesed (חֶסֶד) — amor leal, misericórdia perseverante. Descreve a fidelidade de Deus à sua aliança mesmo quando o povo é frágil.
- shalom (שָׁלוֹם) — paz, inteireza, bem-estar reconciliado. Não é somente ausência de conflito, mas a vida em ordem diante de Deus e do próximo.
- nefesh (נֶפֶשׁ) — vida, ser, pessoa inteira. Quando o salmista fala à sua nefesh, não se dirige a uma parte desencarnada, mas convoca todo o seu ser a esperar em Deus.
- ruach (רוּחַ) — sopro, vento, espírito. Pode nomear a vulnerabilidade humana e a ação vivificadora de Deus.
- tsedeq / tsedaqah (צֶדֶק / צְדָקָה) — justiça, retidão. Nos Salmos, a justiça de Deus protege, julga o mal e restaura o que foi quebrado.
- yashá‘ (יָשַׁע) — salvar, libertar, trazer para um lugar amplo. Salvação frequentemente aparece como livramento concreto da opressão e do perigo.
- batach (בָּטַח) — confiar, apoiar-se com segurança. Confiança bíblica não ignora a ameaça; entrega-se a Deus no meio dela.

Estratégia editorial

Para cada salmo:

1. Versículo-âncora na NVI, escolhido sem descontextualizar o gênero do salmo.
2. Palavra-chave em hebraico que realmente pertença ao salmo ou à sua imagem dominante, com transliteração e explicação breve.
3. Contexto literário: gênero, movimento interno, relação com o livro do Saltério e, quando pertinente, nota histórica prudente.
4. Leitura de 4–7 versículos selecionados que preservem o arco do salmo. Para salmos curtos, exibir o texto todo.
5. Três parágrafos de meditação: o que o salmo diz sobre Deus; a verdade humana que ele permite nomear; uma forma de orá-lo ou praticá-lo hoje.
6. Três perguntas, uma aplicação concreta e uma oração derivada do próprio salmo.

Cuidados teológicos e pastorais

- Lamentos devem manter a tensão do texto. Não acrescentar finais felizes onde o salmo não os oferece nem tratar tristeza, depressão ou trauma como falha espiritual.
- Salmos imprecatórios devem ser lidos como entrega da justiça a Deus, não como permissão para vingança pessoal ou violência.
- Salmos reais e messiânicos serão lidos primeiro em seu horizonte israelita e, em seguida, à luz da esperança cristã, sem apagar seu contexto.
- Salmos de prosperidade e justiça não serão convertidos em fórmula de ganho material. A justiça de Deus é maior que sucesso imediato.
- A oração final deve ser honesta: louvor onde há louvor, pedido onde há pedido, silêncio onde há espera.

Arquitetura de arquivos

- `data/salmos-1.js` — Salmos 1–41 (Livro I)
- `data/salmos-2.js` — Salmos 42–72 (Livro II)
- `data/salmos-3.js` — Salmos 73–89 (Livro III)
- `data/salmos-4.js` — Salmos 90–106 (Livro IV)
- `data/salmos-5.js` — Salmos 107–150 (Livro V)
- `data/salmos.js` — loader, ordem e numeração de 1 a 150
- `app-salmos.jsx` — configuração da jornada, com `storageKey: 'lectio-salmos-v1'`
- `salmos.html` — página da jornada
- `jornadas.html` — adicionar Salmos na posição alfabética

Distinção visual

As cinco divisões aparecerão na aba Jornada como seções de progresso:

- Livro I · Confiança e lamento
- Livro II · Sede e realeza
- Livro III · Crise e memória
- Livro IV · Refúgio e reinado
- Livro V · Peregrinação e louvor

Ordem de implementação

1. Escrever e revisar os cinco blocos editoriais, respeitando cada salmo.
2. Criar loader, página e configuração de progresso.
3. Inserir Salmos em Jornadas e verificar as 150 navegações, persistência de notas e marcações.
