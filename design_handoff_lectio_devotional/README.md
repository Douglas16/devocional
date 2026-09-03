# Handoff: Lectio — Diário Devocional Interativo (5 Estudos Bíblicos)

## Overview

**Lectio** é um diário devocional cristão interativo em web, composto por **5 estudos bíblicos independentes** totalizando **130 dias de conteúdo devocional** em Português (Brasil), tradução **NVI (Nova Versão Internacional)**. Cada estudo é uma jornada temática pela Escritura, com um formato pedagógico idêntico:

- Versículo âncora
- Palavra-chave em hebraico ou grego (com transliteração, significado e nota etimológica)
- Contexto histórico
- Passagem bíblica completa (numerada, sublinhável)
- Meditação prática (2-3 parágrafos)
- 3 perguntas para reflexão
- Aplicação prática
- Oração
- Espaço para anotações pessoais

### Os 5 estudos

| Estudo | Arquivo HTML | Dias | Storage key |
|---|---|---|---|
| **Provérbios + Tiago** (intercalado) | `index.html` | 41 | `lectio-v2` |
| **1 e 2 Tessalonicenses** | `tessalonicenses.html` | 13 | `lectio-tessalonicenses-v1` |
| **1 e 2 Pedro** | `pedro.html` | 13 | `lectio-pedro-v1` |
| **Evangelho de João + 1, 2, 3 João** | `joao.html` | 27 | `lectio-joao-v1` |
| **Sinóticos** (Mt·Mc·Lc harmonizados + exclusivos) | `sinoticos.html` | 35 | `lectio-sinoticos-v1` |

Total: **129 dias** de conteúdo autoral + versículos bíblicos completos.

O aplicativo possui três abas por estudo (**Hoje**, **Jornada**, **Anotações**) e recursos: modo claro/escuro, marcação de dias como lidos, sublinhado de versículos, anotações persistentes por dia, navegação entre dias, menu flutuante para trocar de estudo.

---

## About the Design Files

Os arquivos neste pacote são **referências de design criadas em HTML/CSS/JSX (React inline via Babel Standalone)** — protótipos funcionais que mostram a aparência e comportamento pretendidos, **não código de produção para copiar diretamente**.

A tarefa é **recriar estes designs no ambiente do codebase-alvo** (React + build tool, Vue, SwiftUI, Flutter, mobile nativo, etc.) usando os padrões estabelecidos do projeto. Se ainda não houver ambiente, recomendamos **React + Vite + TypeScript** para web ou **Next.js** para SSR; **SwiftUI** ou **React Native** para mobile.

Os arquivos JSX aqui **NÃO devem ir para produção** — usam Babel Standalone em runtime (lento) e carregam dados via `<script>` tags. Em produção use build proper (Vite/webpack) com imports ES modules.

**O conteúdo textual (versículos, meditações, contextos, palavras hebraico/gregas) É final** e deve ser preservado integralmente — está em `data/*.js` como arrays JavaScript, facilmente convertíveis para JSON estático.

---

## Fidelity

**High-fidelity (hifi).** Os mocks são pixel-perfect com decisões finais sobre cores (oklch), tipografia (Fraunces + Inter + JetBrains Mono), espaçamento, hierarquia e microinterações. O desenvolvedor deve recriar o UI com fidelidade visual usando as bibliotecas do codebase-alvo. Todos os tokens estão documentados abaixo.

O conteúdo textual dos 129 dias é finalizado e deve ser transportado integralmente para o novo ambiente.

---

## Screens / Views

Todos os 5 estudos usam o mesmo layout e componentes. As diferenças são: (1) dados carregados, (2) storage key, (3) título/subtítulo do brand, (4) heurística de "book badge" no card da Jornada. A estrutura visual abaixo aplica-se a TODOS.

### 1. Header (persistente em todas as abas)

- **Layout**: flex horizontal entre `brand` (esquerda) e `header-actions` (direita), com `border-bottom: 1px solid var(--line)`, padding-bottom 28px, margin-bottom 40px.
- **Brand**: "Lectio" em Fraunces itálico 26px, seguido de eyebrow (varia por estudo: "Provérbios · Tiago · 41 dias · NVI", "1 e 2 Tessalonicenses · 13 dias · NVI", etc.) em Inter 11px, letter-spacing 0.18em, uppercase, cor `--ink-3`.
- **Header actions**: botão circular 36×36, border-radius 50%, `1px solid --line`, alternando ícone de sol/lua para tema.

### 2. Tabs (persistente)

Três abas horizontais: **Hoje** | **Jornada** `X/N` | **Anotações** `[count]`
- Cada tab: padding `12px 20px 14px`, font-size 13px, cor `--ink-3`. Ativa: cor `--ink` + underline `1px` accent posicionado abaixo do border.
- `tab-count` é uma pill: padding `2px 8px`, border-radius 100px, background `--bg-sunk`, font 10px JetBrains Mono, cor `--ink-3`.
- Border-bottom da barra: `1px solid --line`.

### 3. Aba "Hoje" (Reader) — a mais complexa

Coluna centralizada de leitura, `max-width: 680px`. Estrutura vertical:

#### 3.1 Reader topline
- Flex space-between:
  - **Esquerda**: `day-nav` — botão chevron ← / label "DIA 05 / 41" (mono, 11px, letter-spacing 0.12em, `--ink-3`) / botão chevron →. Botões circulares 32×32 com border `--line`. Disabled quando primeiro/último dia (opacity 0.3).
  - **Direita**: pill "Marcar como lido" ou "Lido" — padding `8px 16px 8px 12px`, border-radius 100px, border `--line`. Lido: background `--accent-soft`, cor `--accent`, sem borda. Dot 8×8 à esquerda (border/filled).

#### 3.2 Day header (centralizado)
- Eyebrow: tema em JetBrains Mono 11px, letter-spacing 0.18em, uppercase, `--accent`
- Data em Fraunces itálico 15px, `--ink-3`, margin-top 12px
- Padding vertical `24px 0 56px`

#### 3.3 Verse anchor (versículo âncora)
- Padding vertical 40/56px, border-top e bottom `1px --line`, margin-bottom 56px
- Texto: Fraunces 300 weight, 30px, line-height 1.35, letter-spacing -0.01em, max-width 540px, centralizado, `text-wrap: balance`, `font-variation-settings: "opsz" 96`
- Referência: mono 11px, letter-spacing 0.15em, uppercase, `--ink-3`, margin-top 20px

#### 3.4 Section (repetido 8 vezes)
Cada seção temática:
- **Section title**: mono 10px, letter-spacing 0.22em, uppercase, `--ink-3`. Após o texto, hairline (`1px --line`) via `flex: 1`. Margin-bottom 20px.
- Margin-bottom da section: 56px

Seções na ordem:

1. **Palavra · [hebraico|grego]** — card com background `--bg-sunk`, padding 32px, border-radius 4px, grid 2-col (auto 1fr, gap 28px):
   - Esquerda: caractere original em Fraunces 42px, `--accent` (lang="he" para hebraico, "el" para grego, "arc" para aramaico)
   - Direita: transliteração (mono 13px, weight 500, com pill lang-tag) / significado (Fraunces itálico 15px, `--ink-2`) / nota etimológica (13px, line-height 1.65, `--ink-3`)

2. **Contexto histórico** — parágrafo Fraunces 300, 15px, line-height 1.75, `--ink-2`. **IMPORTANTE:** este campo suporta `**bold**` markdown mínimo (adicionado no fix pós-Sinóticos) — necessário para destacar nomes de evangelistas nos textos comparativos do estudo dos Sinóticos. Ver seção "renderBold helper" abaixo.

3. **Leitura** — referência (mono 11px, uppercase) + lista de versículos:
   - Container: padding-left 24px, border-left `1px --line-strong`
   - Cada versículo: Fraunces 300, 18px, line-height 1.8, `display: block`, cursor pointer, padding `2px 8px 2px 0`, border-radius 2px
   - Número: mono 10px, vertical-align super, margin-right 6px
   - **Toggle highlight** on click: background `--highlight` (amarelo transparente)
   - Hover mostra hint "sublinhar" (mono 9px) no canto direito

4. **Meditação** — 2-3 parágrafos Fraunces 300, 17px, line-height 1.75, margin-bottom 20px, `text-wrap: pretty`. **Drop cap** no primeiro parágrafo: `::first-letter` em Fraunces 56px, italic, `--accent`, float left. Também suporta `**bold**`.

5. **Para refletir** — `<ol>` com counter-reset:
   - Cada `<li>` padding `20px 0 20px 48px`, border-bottom `--line`, Fraunces 300 itálico 17px
   - `::before` com counter em formato `decimal-leading-zero` (01, 02, 03), mono 11px, `--accent`, positioned absolute left 0

6. **Aplicação prática** — box background `--accent-soft`, padding `28px 32px 28px 40px`, border-radius 4px, Fraunces 17px, com `→` positioned absolute (`::before`) mono `--accent` à esquerda

7. **Oração** — Fraunces 300 itálico 19px, centralizado, max-width 520px, com hairlines decorativos `::before` e `::after` (24px×1px, `--accent`)

8. **Suas anotações** — textarea:
   - Full width, min-height 180px, background `--bg-elev`, border `1px --line`, border-radius 4px, padding 20px, Fraunces 300 16px
   - Focus: border-color `--accent`
   - Placeholder: `--ink-4`, italic
   - **Notes meta** abaixo (flex space-between): contador de caracteres | status "Salvo automaticamente" / "Salvando..." (mono 10px)

#### 3.5 Day end (rodapé)
- Border-top `1px --line`, margin-top 48px, padding vertical 60/20px
- Centralizado: "· · ·" em Fraunces itálico 20px, `--accent`, letter-spacing 0.2em

### 4. Aba "Jornada" (Journey)

- **Header centralizado** (max-width 720px, margin-bottom 56px):
  - Título (varia por estudo — ex.: "Quarenta e um dias na Palavra", "Trinta e cinco dias com os Sinóticos") — Fraunces 300 34px, letter-spacing -0.01em
  - Subtítulo Fraunces itálico 15px, `--ink-3`
  - **Progress line** (max-width 480px, margin-top 32px, height 1px, `--line`) com fill em `--accent` proporcional a `readCount/total`
  - Progress label: mono 11px, "5 de 41 · 12%"

- **Grid** `repeat(auto-fill, minmax(220px, 1fr))`, gap 16px, max-width 960px:
  - **Card** (button): background `--bg-elev`, border `1px --line`, border-radius 4px, padding `22px 22px 20px`, transition all 0.25s
  - Hover: border `--line-strong`, translateY(-1px), shadow
  - Classe `.current`: border-color `--accent`
  - Classe `.read`: background `--bg-sunk`
  - **Distinção de categoria** (filete lateral esquerdo 2px):
    - `.is-tiago`: `border-left: 2px solid var(--accent)` — usado para: Tiago (no plano PV+Tg), 2Ts (em Tess), 2Pedro (em Pedro), Cartas de João (em João), Exclusivos (em Sinóticos)
    - `.is-proverbios`: `border-left: 2px solid var(--ink-4)` — usado para: Provérbios, 1Ts, 1Pedro, Evangelho de João, Comuns dos Sinóticos
  - **Conteúdo do card**:
    - Header: "DIA 03 · [book]" (mono 10px, uppercase, letter-spacing 0.18em) + status dot 8×8 à direita
    - Tema: Fraunces 20px, letter-spacing -0.01em
    - Referência: mono 10px, uppercase, `--ink-3`

### 5. Aba "Anotações" (NotesView)

- Lista de entradas (max-width 720px), apenas dias com nota escrita OU highlights salvos
- **Empty state**: centralizado, título Fraunces 300 22px "Nada ainda", subtítulo Fraunces itálico 16px
- **Cada entrada**: padding vertical 32px, border-bottom `--line`:
  - Head flex space-between: à esquerda mini-metadata ("DIA 03 · Provérbios 3.5" em mono 11px `--accent` + tema Fraunces 22px); à direita botão texto "abrir dia →" (mono 10px uppercase `--ink-3`, hover `--accent`)
  - **Texto da anotação**: Fraunces 300 16px, `white-space: pre-wrap`
  - **Highlights salvos** (se houver): border-top dashed `--line`, cada item com Fraunces 300 itálico 14px, border-left `2px --highlight`, padding-left 12px, gradient horizontal do `--highlight` para transparente

### 6. Menu de estudos (flutuante)

- Position: `fixed`, bottom 24px, right 24px, z-index 50
- **Trigger**: pill com ícone de livro + label "Estudos" (mono 11px). Padding `10px 16px 10px 12px`, border-radius 100px, background `--bg-elev`, border `--line`, shadow
- **Panel**: aparece no `hover` ou `focus-within` do container `.study-menu`. Position absolute acima do trigger (`bottom: calc(100% + 8px)`, `right: 0`), min-width 260px, background `--bg-elev`, border `--line`, border-radius 8px, padding 6px, box-shadow
- Cada item: `.study-menu-item` — link block, padding `12px 14px`, border-radius 6px:
  - `.study-menu-label`: Fraunces 400, 15px
  - `.study-menu-meta`: mono 10px, letter-spacing 0.08em, uppercase, `--ink-3`
- Estudo atual marcado com `.active`: background `--accent-soft`, label em `--accent`
- Transição de abertura: opacity + translateY(6px→0), 0.2s ease

---

## Interactions & Behavior

### Navegação entre abas
Click nos tabs alterna a view. SPA sem transições de rota — scroll não é resetado ao trocar tab.

### Navegação entre dias (aba Hoje)
- Botões chevron ← → mudam `currentDay` em ±1 (com clamp entre 1 e total)
- Ao trocar dia: scroll para topo (`window.scrollTo({ top: 0, behavior: 'smooth' })`), keyed re-render (aplica animação `fade-in` 400ms)
- Click em qualquer card da Jornada → navega para o dia + volta pra aba "Hoje"

### Marcar como lido
- Click no botão → grava `state.read[dayNumber] = ISO timestamp` ou remove se já lido (toggle)
- Reflete imediatamente: pill muda estilo, dot preenche, contador no tab Jornada atualiza, progress bar avança

### Sublinhar versículo
- Click em qualquer versículo dentro da seção "Leitura" → toggle no array `state.highlights[dayNumber]` (contém números de versículos, ex.: `[5, 12, 18]`)
- Visual: background `--highlight` (amarelo transparente)
- Sublinhados aparecem também na aba "Anotações" agrupados por dia

### Anotações pessoais (autosave)
- Textarea com debounce de 600ms
- Ao digitar: `saved = false` (mostra "Salvando...")
- Após 600ms sem input: `onNoteChange(text)` → grava em `state.notes[dayNumber]`, mostra "Salvo automaticamente"
- Se texto vazio, remove a chave do objeto notes

### Dark/light toggle
- Click no botão do header alterna `state.theme` entre `'light'` e `'dark'`
- Aplicado via `document.documentElement.setAttribute('data-theme', theme)`
- Transição CSS 0.4s em `background` e `color` no `<html>` e `<body>`

### Menu de estudos
- Aparece por hover (CSS puro, sem JS)
- Cada item é um `<a>` que navega para o HTML do outro estudo
- **IMPORTANTE:** cada estudo mantém storage independente — trocar entre eles NÃO perde anotações

### renderBold helper (fix pós-Sinóticos)
- Helper em `app-sinoticos.jsx` que converte `**texto**` em `<strong>texto</strong>` em runtime.
- Necessário porque o estudo de Sinóticos usa markdown-bold nos contextos para destacar nomes de evangelistas ao comparar (ex.: `**Mateus** enfatiza o cumprimento profético; **Marcos** é o mais breve...`).
- Aplicado em: `day.context`, `day.word.note`, cada `p` de `day.meditation`.
- **Recomendação:** implementar este helper em TODOS os apps do codebase-alvo (não só sinóticos) — os outros estudos podem ganhar markdown bold no futuro.

Implementação (para portar):
```jsx
function renderBold(text) {
  if (!text || typeof text !== 'string') return text;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}
```

### Animações
- **fade-in** (400ms): aplicado ao trocar de aba OU dia. Keyframe: `opacity 0 → 1`, `translateY(4px) → 0`
- Nenhuma animação complexa. Sensação geral: silenciosa e respirada.

### Estados
- **Loading**: não há (dados carregam sincronamente via script tags)
- **Error**: nenhum tratamento explícito (conteúdo estático)
- **Empty (Anotações)**: mostrado quando não há nota nem highlight salvos

### Responsive
Breakpoint único em `720px`:
- App padding: `20px 20px 100px` (vs `32px 40px 120px` desktop)
- Header vira wrap com gap 16px
- Verse anchor 24px (vs 30px)
- Word card vira 1 coluna
- Journey title 28px (vs 34px)
- Passage 17px (vs 18px), padding-left 16px
- Meditation 16px (vs 17px), drop-cap 44px (vs 56px)

---

## State Management

Cada estudo tem seu próprio storage key (documentados na tabela do Overview). O formato do estado é IDÊNTICO entre estudos:

```typescript
type AppState = {
  currentDay: number;          // 1..total, dia sendo visualizado
  theme: 'light' | 'dark';     // tema atual (idealmente sincronizar entre estudos — hoje é por estudo)
  read: {                      // dias marcados como lidos
    [dayNumber: number]: string; // ISO timestamp
  };
  notes: {                     // anotações por dia
    [dayNumber: number]: string; // texto livre
  };
  highlights: {                // versículos sublinhados por dia
    [dayNumber: number]: number[]; // array de números de versículos
  };
};
```

### Transições
- Qualquer mudança em qualquer chave dispara `saveState()` que serializa e escreve em `localStorage[STORAGE_KEY]`
- `loadState()` roda uma vez no mount inicial
- Sem sincronização com servidor. Sem autenticação. Puro client-side.

### Recomendação para produção
- **Sincronizar tema entre estudos** — hoje cada storage tem seu tema, então trocar de estudo pode reverter. Idealmente use uma chave separada `lectio-theme` compartilhada.
- **Backend opcional** — sync entre dispositivos, backup de anotações, autenticação. Mas o design foi feito para funcionar 100% client-side.

### Estrutura dos dados devocionais (read-only)

Array com N objetos, cada um com esta forma:

```typescript
type DayContent = {
  day: number;                   // 1..total
  theme: string;                 // Ex: "O temor do Senhor" (pode começar com prefixo — ver abaixo)
  date: string;                  // Ex: "Provérbios 1" ou "Batismo" (rótulo do dia)
  verse: {
    text: string;                // versículo âncora
    ref: string;                 // Ex: "Provérbios 1.7"
  };
  word: {
    original: string;            // texto hebraico/grego/aramaico (RTL para hebraico)
    translit: string;            // Ex: "yir'at YHWH"
    lang: 'hebraico' | 'grego' | 'aramaico';
    meaning: string;             // significado curto
    note: string;                // nota etimológica (pode conter **bold**)
  };
  context: string;               // parágrafo de contexto (pode conter **bold**)
  passage: {
    ref: string;                 // Ex: "Provérbios 1" ou "Marcos 1.21-34 (paralelos: Mt 8.14-17; Lc 4.31-41)"
    verses: Array<{
      n: number;                 // número do versículo
      text: string;              // texto (NVI)
    }>;
  };
  meditation: string[];          // 2-3 parágrafos (pode conter **bold**)
  questions: string[];           // exatamente 3 perguntas
  application: string;           // 1 parágrafo curto
  prayer: string;                // 1 parágrafo curto
};
```

### Convenções de prefixo do `theme` (usadas para categorização visual)

- **Plano Provérbios + Tiago** (`index.html`): tema simples ("O temor do Senhor"). Book detection por prefixo do `verse.ref`: começa com "Tiago" → is-tiago; senão → is-proverbios.
- **Tessalonicenses**: detect por `verse.ref.startsWith('2')` → is-tiago (2Ts), senão is-proverbios (1Ts).
- **Pedro**: mesmo padrão — 2Pedro → is-tiago, 1Pedro → is-proverbios.
- **João**: `verse.ref.toLowerCase().startsWith('1 joão' | '2 joão' | '3 joão')` → is-tiago (cartas); senão is-proverbios (Evangelho).
- **Sinóticos**: `theme.startsWith('Só ')` → is-tiago (exclusivos); senão is-proverbios (comuns). Além disso, o book label é derivado do prefixo: "Só Mateus", "Só Marcos", "Só Lucas", ou "Comum".

Ver `journey-card` rendering em cada `app-*.jsx` para a lógica específica.

### Sequência dos dias (loaders)

Cada estudo tem um `data/[estudo].js` como IIFE loader que concatena os arquivos de dados fonte na ordem cronológica correta e cria `window.[NOME]` como sequência final. Exemplo (`data/sinoticos.js`):

```js
(function() {
  const C1 = window.SINOTICOS_COMUNS_1 || [];
  const C2 = window.SINOTICOS_COMUNS_2 || [];
  const EX = window.SINOTICOS_EXCLUSIVOS || [];
  const sequence = [];
  let dayNum = 1;
  [...C1, ...C2, ...EX].forEach(entry => {
    sequence.push({ ...entry, day: dayNum++ });
  });
  window.SINOTICOS = sequence;
})();
```

---

## Design Tokens

### Cores (light mode)
```css
--bg:         oklch(98.5% 0.005 85);   /* branco quente */
--bg-elev:    oklch(99.5% 0.003 85);   /* branco mais alto (cards) */
--bg-sunk:    oklch(96% 0.006 85);     /* recesso sutil */
--ink:        oklch(22% 0.012 60);     /* texto principal */
--ink-2:      oklch(38% 0.014 60);     /* texto secundário */
--ink-3:      oklch(58% 0.014 60);     /* labels, meta */
--ink-4:      oklch(75% 0.010 60);     /* muito discreto */
--line:       oklch(90% 0.008 70);     /* linhas divisórias */
--line-strong:oklch(82% 0.010 70);     /* linhas com mais peso */
--accent:     oklch(55% 0.095 45);     /* terracota — cor de destaque */
--accent-2:   oklch(65% 0.075 45);     /* accent mais claro */
--accent-soft:oklch(93% 0.028 55);     /* fundo tint do accent */
--highlight:  oklch(90% 0.055 75 / 0.55); /* amarelo suave — sublinhado */
```

### Cores (dark mode)
```css
--bg:         oklch(16% 0.008 60);
--bg-elev:    oklch(20% 0.010 60);
--bg-sunk:    oklch(13% 0.006 60);
--ink:        oklch(93% 0.008 85);
--ink-2:      oklch(78% 0.010 85);
--ink-3:      oklch(58% 0.010 60);
--ink-4:      oklch(42% 0.010 60);
--line:       oklch(28% 0.012 60);
--line-strong:oklch(38% 0.014 60);
--accent:     oklch(72% 0.100 50);
--accent-2:   oklch(65% 0.085 50);
--accent-soft:oklch(26% 0.035 45);
--highlight:  oklch(60% 0.10 75 / 0.35);
```

### Sombra
```css
--shadow: 0 1px 2px oklch(20% 0.02 60 / 0.04), 0 8px 24px oklch(20% 0.02 60 / 0.05);
/* dark: 0 1px 2px oklch(0% 0 0 / 0.4), 0 8px 24px oklch(0% 0 0 / 0.35); */
```

**Nota sobre oklch:** todos os browsers modernos (Chrome 111+, Safari 15.4+, Firefox 113+) suportam. Se precisar de fallback, converta usando [oklch.com](https://oklch.com). Recomendo manter oklch por perceptual uniformity.

### Tipografia

Fontes via Google Fonts:
- **Fraunces** (300, 400, 500, italic) — serif com optical sizing (`opsz` variável 9-144). Usada para conteúdo, versículos, títulos.
- **Inter** (300, 400, 500, 600) — sans-serif para UI/base
- **JetBrains Mono** (400, 500) — mono para metadados, referências, transliterações

**Optical sizing (Fraunces):** aplique `font-optical-sizing: auto` na raiz das serifas ou use `font-variation-settings: "opsz" <N>`:
- Verse anchor grande: `opsz 96`
- Prayer 19px: `opsz 24`
- Texto de leitura 16-18px: `opsz 14`

### Escala tipográfica

| Uso                          | Font family      | Weight | Size  | Line-height | Letter-spacing |
|------------------------------|------------------|--------|-------|-------------|----------------|
| Brand mark                   | Fraunces italic  | 400    | 26px  | —           | -0.01em        |
| Verse anchor                 | Fraunces         | 300    | 30px  | 1.35        | -0.01em        |
| Journey title                | Fraunces         | 300    | 34px  | —           | -0.01em        |
| Prayer                       | Fraunces italic  | 300    | 19px  | 1.6         | —              |
| Meditation                   | Fraunces         | 300    | 17px  | 1.75        | —              |
| Passage verses               | Fraunces         | 300    | 18px  | 1.8         | —              |
| Questions                    | Fraunces italic  | 300    | 17px  | 1.6         | —              |
| Context / notes / apply      | Fraunces         | 300    | 15-17px | 1.6-1.75   | —              |
| Notes entry text             | Fraunces         | 300    | 16px  | 1.75        | —              |
| Journey card theme           | Fraunces         | 400    | 20px  | 1.2         | -0.01em        |
| Body/UI padrão               | Inter            | 400    | 16px  | 1.6         | —              |
| Tab                          | Inter            | 400    | 13px  | —           | 0.02em         |
| Section title (eyebrow)      | JetBrains Mono   | 500    | 10px  | —           | 0.22em uppercase |
| Day label (nav)              | JetBrains Mono   | 400    | 11px  | —           | 0.12em         |
| Verse ref (anchor)           | JetBrains Mono   | 500    | 11px  | —           | 0.15em uppercase |
| Verse num                    | JetBrains Mono   | 500    | 10px  | —           | —              |
| Notes meta                   | JetBrains Mono   | 400    | 10px  | —           | 0.1em uppercase |
| Word original (heb/gr/arc)   | Fraunces         | 400    | 42px  | 1           | —              |
| Word transliteration         | JetBrains Mono   | 500    | 13px  | —           | —              |
| Word meaning                 | Fraunces italic  | 400    | 15px  | —           | —              |
| Word note                    | Inter            | 400    | 13px  | 1.65        | —              |
| Drop cap (meditation)        | Fraunces italic  | 300    | 56px  | 0.9         | —              |
| Study menu label             | Fraunces         | 400    | 15px  | —           | —              |
| Study menu meta              | JetBrains Mono   | 400    | 10px  | —           | 0.08em uppercase |

### Spacing (usado)
Sem escala rígida — valores em px:
- **Micro**: 2, 4, 6, 8, 10, 12
- **Small**: 16, 20, 24, 28
- **Medium**: 32, 40, 48, 56
- **Large**: 60, 80, 100, 120

Sugestão para o codebase-alvo: adotar escala 4px (Tailwind-like) e mapear os valores.

### Border-radius
- Buttons circulares: `50%`
- Pills (read status, tab-count): `100px`
- Cards / boxes: `4px`
- Study menu panel: `8px`
- Small elements (highlight): `2px`

### Border weights
- Padrão: `1px solid var(--line)`
- Ênfase: `1px solid var(--line-strong)`
- Ativo (current, accent underline): `1px solid var(--accent)`
- Filete lateral do card Jornada: `2px solid` (accent ou ink-4)

---

## Assets

Nenhum asset binário. Todos os visuais são texto CSS + ícones SVG inline (React components). Ícones usados:

- **sun** (24×24, stroke 1.5) — dark mode toggle
- **moon** (24×24, stroke 1.5) — light mode toggle
- **chevron-left / chevron-right** (24×24, stroke 1.8) — navegação de dias
- **book** (24×24, stroke 1.5) — trigger do menu de estudos

Se o codebase-alvo usa biblioteca de ícones (Lucide, Heroicons, Phosphor), substitua pelos equivalentes.

### Fontes (externas)
Carregadas do Google Fonts via `<link>` no `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..500&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Para produção, considere self-hosting via `fontsource` ou download direto.

### Conteúdo textual (129 dias total)

Todo o conteúdo devocional está em arquivos `data/*.js` como arrays JavaScript. Volume estimado por estudo:

| Estudo | Arquivos de dados | Tamanho |
|---|---|---|
| Provérbios + Tiago | `proverbios-1-10.js` (54KB), `proverbios-11-20.js` (39KB), `proverbios-21-31.js` (45KB), `tiago.js` (40KB), `devotional.js` (1KB loader) | ~180KB |
| Tessalonicenses | `tessalonicenses.js` | ~57KB |
| Pedro | `pedro.js` | ~61KB |
| João | `joao-1.js` (49KB), `joao-2.js` (48KB), `joao-cartas.js` (34KB), `joao.js` (loader) | ~132KB |
| Sinóticos | `sinoticos-comuns-1.js` (41KB), `sinoticos-comuns-2.js` (44KB), `sinoticos-exclusivos.js` (65KB), `sinoticos.js` (loader) | ~150KB |

**Total: ~580KB de conteúdo textual JS.** Convertido para JSON aparado, cerca de ~500KB.

**Tradução bíblica usada:** Nova Versão Internacional (NVI). Verifique licenciamento (Biblica/SBI) se o produto for comercial. Alternativa: usar API pública ([bible.helloao.org](https://bible.helloao.org) ou [scripture.api.bible](https://scripture.api.bible)) para as passagens bíblicas, mantendo apenas o conteúdo devocional autoral (meditações, perguntas, aplicações, orações, contextos históricos, notas etimológicas).

**Todo o conteúdo autoral (contextos, meditações, perguntas, aplicações, orações, notas etimológicas) é original e propriedade do projeto.**

---

## Files

Arquivos incluídos neste handoff (todos copiados do projeto):

### Entry points HTML (5)
| Arquivo | Estudo | Total |
|---|---|---|
| `index.html` | Provérbios + Tiago | 41 dias |
| `tessalonicenses.html` | 1 e 2 Tessalonicenses | 13 dias |
| `pedro.html` | 1 e 2 Pedro | 13 dias |
| `joao.html` | Evangelho + 1, 2, 3 João | 27 dias |
| `sinoticos.html` | Sinóticos harmonizados | 35 dias |

### Apps React (5)
| Arquivo | Storage key |
|---|---|
| `app.jsx` | `lectio-v2` |
| `app-tessalonicenses.jsx` | `lectio-tessalonicenses-v1` |
| `app-pedro.jsx` | `lectio-pedro-v1` |
| `app-joao.jsx` | `lectio-joao-v1` |
| `app-sinoticos.jsx` | `lectio-sinoticos-v1` (**contém `renderBold` helper — copiar para os outros no port**) |

### Estilos
`styles.css` — compartilhado por todos os HTMLs. Tokens + componentes + responsive.

### Dados
Ver tabela acima. Cada estudo tem 1-4 arquivos de dados + 1 loader IIFE que concatena e cria `window.[NOME]`.

### Componentes React (em cada `app-*.jsx`)
- `App` — root, gerencia estado global, tab ativa, dia atual
- `Header` — brand + theme toggle
- `Tabs` — navegação entre Hoje / Jornada / Anotações
- `Reader` — visualização detalhada de um dia (a maior)
- `Journey` — grid de cards com progresso
- `NotesView` — compilado de anotações e highlights salvos
- `Icon` — bag de SVGs inline
- `renderBold` (só em `app-sinoticos.jsx`) — helper markdown-bold

Para uma implementação limpa, sugiro extrair em um componente único parametrizável por estudo:
- `<LectioApp study="sinoticos" data={window.SINOTICOS} storageKey="lectio-sinoticos-v1" bookLabel={...} />`
- Subcomponentes: `ReaderTopline`, `DayHeader`, `VerseAnchor`, `WordCard`, `ContextBlock`, `PassageBlock`, `MeditationBlock`, `QuestionsBlock`, `ApplicationBox`, `PrayerBlock`, `NotesEditor`, `StudyMenu`, etc.

---

## Recommended Next Steps (Genspark Code ou dev externo)

1. **Setup**: Vite + React + TypeScript. Instalar `@fontsource/fraunces`, `@fontsource/inter`, `@fontsource/jetbrains-mono` (ou manter Google Fonts).
2. **Design tokens**: portar as vars CSS para `tokens.css` ou config do Tailwind/UnoCSS/CSS-in-JS.
3. **Dados**: converter `data/*.js` de cada estudo para JSON estático (ex.: `src/data/sinoticos.json`, `src/data/joao.json`). Tipar com o schema `DayContent`.
4. **Estado**: `useReducer` + custom hook `useDevotionalStorage(studyKey)` que encapsula load/save do localStorage com debounce.
5. **Rotas**: considerar rotas reais `/estudos/:studyId/dia/:n`, `/estudos/:studyId/jornada`, `/estudos/:studyId/anotacoes`. Ajuda com share links e navegação nativa do browser.
6. **Componentização**: extrair um único `<LectioApp>` parametrizável em vez de 5 apps quase-idênticos.
7. **Aplicar `renderBold` em todos os estudos** — não só sinóticos. Facilita futuras edições.
8. **Melhorias fora do MVP** (mencionar ao product owner):
   - Sync entre dispositivos (backend + auth)
   - Export das anotações como PDF/markdown
   - Compartilhar um dia específico via link
   - Áudio da passagem (TTS ou gravada)
   - Notificações/lembretes diários
   - PWA / service worker (modo offline)
   - Ajustar tamanho de fonte pelo usuário (accessibility)
   - Sync do tema entre estudos (hoje é isolado por storage key)
