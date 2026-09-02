# Handoff: Lectio — Diário Devocional Interativo

## Overview

**Lectio** é um diário devocional cristão interativo em web, com um plano de leitura de 41 dias intercalando **Provérbios** (31 capítulos, 1 por dia) e **Tiago** (5 capítulos divididos em 10 blocos temáticos, 1 a cada 2 dias). Cada dia oferece: versículo âncora, palavra-chave em hebraico/grego com estudo etimológico, contexto histórico, passagem bíblica completa (tradução NAA — Nova Almeida Atualizada), meditação prática, perguntas de reflexão, aplicação prática, oração e espaço para anotações pessoais.

O aplicativo tem três abas principais (**Hoje**, **Jornada**, **Anotações**) e suporta modo claro/escuro, marcação de dias como lidos, sublinhado de versículos e anotações persistentes no navegador.

---

## About the Design Files

Os arquivos neste pacote são **referências de design criadas em HTML/CSS/JSX (React inline via Babel Standalone)** — protótipos que mostram a aparência e comportamento pretendidos, **não código de produção para copiar diretamente**.

A tarefa é **recriar estes designs no ambiente do codebase-alvo** (React + build tool, Vue, SwiftUI, Flutter, mobile nativo, etc.) usando os padrões estabelecidos do projeto (design system existente, bibliotecas de UI, estratégia de state management, etc.). Se ainda não houver ambiente, escolha o framework mais adequado (recomendamos **React + Vite + TypeScript** ou **Next.js** para web; **SwiftUI** ou **React Native** para mobile) e implemente lá.

Os arquivos HTML/JSX aqui **NÃO devem ir para produção** — eles usam Babel Standalone em runtime (lento) e carregam dados via `<script>` tags. Em produção use build proper (Vite/webpack) e imports ES modules.

---

## Fidelity

**High-fidelity (hifi).** Os mocks são pixel-perfect com decisões finais sobre cores (oklch), tipografia (Fraunces + Inter + JetBrains Mono), espaçamento, hierarquia e microinterações. O desenvolvedor deve recriar o UI com fidelidade visual usando as bibliotecas do codebase-alvo. Todos os tokens de design estão documentados abaixo.

Conteúdo textual (41 dias devocionais) também é final — deve ser transportado integralmente. Está estruturado como dados em `data/*.js` e pode ser convertido para JSON, banco, CMS ou o que fizer sentido no destino.

---

## Screens / Views

### 1. Header (persistente em todas as abas)

- **Layout**: flex horizontal entre `brand` (esquerda) e `header-actions` (direita), com border-bottom `1px solid var(--line)`, padding-bottom 28px, margin-bottom 40px.
- **Brand**: "Lectio" em Fraunces itálico 26px, seguido de eyebrow "Provérbios · Tiago · 41 dias" em Inter 11px, letter-spacing 0.18em, uppercase, cor `--ink-3`.
- **Header actions**: um único botão circular (36×36, border-radius 50%, `1px solid --line`) que alterna entre ícone de sol (light mode ativo) e lua (dark mode ativo). Hover: fundo `--bg-sunk`, cor `--ink`, borda `--line-strong`.

### 2. Tabs (persistente)

- Três abas horizontais: **Hoje** | **Jornada** `X/41` | **Anotações** `[count]`
- Cada tab: padding `12px 20px 14px`, font-size 13px, cor `--ink-3`. Ativa: cor `--ink` + underline `1px` accent posicionado abaixo do border.
- `tab-count` é uma pill: padding `2px 8px`, border-radius 100px, background `--bg-sunk`, font 10px JetBrains Mono, cor `--ink-3`.
- Border-bottom da barra: `1px solid --line`.

### 3. Aba "Hoje" (Reader)

Coluna centralizada de leitura, `max-width: 680px`. Estrutura vertical:

#### 3.1 Reader topline
- Flex space-between:
  - **Esquerda**: `day-nav` — botão chevron ← / label "DIA 05 / 41" (mono, 11px, letter-spacing 0.12em, cor `--ink-3`) / botão chevron →. Botões são circulares 32×32 com border `--line`. Disabled quando primeiro/último dia (opacity 0.3).
  - **Direita**: pill "Marcar como lido" ou "Lido" — padding `8px 16px 8px 12px`, border-radius 100px, border `--line`. Quando lido: background `--accent-soft`, cor `--accent`, sem borda. Dot 8×8 circular à esquerda (border quando não lido, filled quando lido).

#### 3.2 Day header (centralizado)
- Eyebrow: tema em JetBrains Mono 11px, letter-spacing 0.18em, uppercase, cor `--accent`
- Data em Fraunces itálico 15px, cor `--ink-3`, margin-top 12px
- Padding vertical `24px 0 56px`

#### 3.3 Verse anchor (versículo âncora)
- Padding vertical 40/56px, border-top e border-bottom `1px solid --line`, margin-bottom 56px
- Texto: Fraunces 300 weight, 30px, line-height 1.35, letter-spacing -0.01em, max-width 540px, centralizado, `text-wrap: balance`, `font-variation-settings: "opsz" 96`
- Referência: mono 11px, letter-spacing 0.15em, uppercase, cor `--ink-3`, margin-top 20px

#### 3.4 Section (repetido 8 vezes)
Cada seção temática segue o padrão:
- **Section title**: mono 10px, letter-spacing 0.22em, uppercase, cor `--ink-3`. Depois do texto, um `hairline` (`1px` linha `--line`) que preenche o restante horizontal via `flex: 1`. Margin-bottom 20px.
- Margin-bottom da section inteira: 56px

Seções na ordem:

1. **Palavra · [hebraico|grego]** — card com background `--bg-sunk`, padding 32px, border-radius 4px, grid 2-col (auto 1fr, gap 28px):
   - Esquerda: caractere original em Fraunces 42px, cor `--accent` (lang="he" ou lang="el")
   - Direita: transliteração (mono 13px, weight 500, com pill lang-tag) / significado (Fraunces itálico 15px, cor `--ink-2`) / nota etimológica (13px, line-height 1.65, cor `--ink-3`)

2. **Contexto histórico** — parágrafo Fraunces 300, 15px, line-height 1.75, cor `--ink-2`

3. **Leitura** — referência (mono 11px, uppercase) + lista de versículos:
   - Container: padding-left 24px, border-left `1px solid --line-strong`
   - Cada versículo: Fraunces 300, 18px, line-height 1.8, `display: block`, cursor pointer, padding `2px 8px 2px 0`, border-radius 2px
   - Número do versículo: mono 10px, vertical-align super, margin-right 6px
   - **Toggle highlight** on click: background `--highlight` (amarelo suave translucido)
   - Hover mostra hint "sublinhar" (mono 9px) no canto direito

4. **Meditação** — 2-3 parágrafos Fraunces 300, 17px, line-height 1.75, margin-bottom 20px, `text-wrap: pretty`. **Drop cap** no primeiro parágrafo: `::first-letter` em Fraunces 56px, italic, cor `--accent`, float left

5. **Para refletir** — `<ol>` com counter-reset:
   - Cada `<li>` padding `20px 0 20px 48px`, border-bottom `--line`, Fraunces 300 itálico 17px
   - `::before` com counter em formato `decimal-leading-zero` (01, 02, 03), mono 11px, cor `--accent`, positioned absolute left 0

6. **Aplicação prática** — box background `--accent-soft`, padding `28px 32px 28px 40px`, border-radius 4px, Fraunces 17px, com `→` positioned absolute (`::before`) mono cor `--accent` à esquerda

7. **Oração** — Fraunces 300 itálico 19px, centralizado, max-width 520px, com hairlines decorativos `::before` e `::after` (24px×1px, cor `--accent`)

8. **Suas anotações** — textarea:
   - Full width, min-height 180px, background `--bg-elev`, border `1px --line`, border-radius 4px, padding 20px, Fraunces 300 16px
   - Focus: border-color `--accent`
   - Placeholder: cor `--ink-4`, italic
   - **Notes meta** abaixo (flex space-between): contador de caracteres | status "Salvo automaticamente" / "Salvando..." (mono 10px)

#### 3.5 Day end (rodapé do dia)
- Border-top `1px --line`, margin-top 48px, padding vertical 60/20px
- Centralizado: "· · ·" em Fraunces itálico 20px, cor `--accent`, letter-spacing 0.2em

### 4. Aba "Jornada" (Journey)

- **Header centralizado** (max-width 720px, margin-bottom 56px):
  - Título "Quarenta e um dias na Palavra" — Fraunces 300 34px, letter-spacing -0.01em
  - Subtítulo Fraunces itálico 15px, cor `--ink-3`
  - **Progress line** (max-width 480px, margin-top 32px, height 1px, background `--line`) com fill preenchido em `--accent` proporcional a `readCount/total`
  - Progress label: mono 11px, "5 de 41 · 12%"

- **Grid** `repeat(auto-fill, minmax(220px, 1fr))`, gap 16px, max-width 960px:
  - **Card** (button): background `--bg-elev`, border `1px --line`, border-radius 4px, padding `22px 22px 20px`, transition all 0.25s
  - Hover: border `--line-strong`, translateY(-1px), shadow
  - Classe `.current`: border-color `--accent`
  - Classe `.read`: background `--bg-sunk`
  - **Distinção Provérbios vs Tiago** (filete lateral esquerdo):
    - `.is-tiago`: `border-left: 2px solid var(--accent)`
    - `.is-proverbios`: `border-left: 2px solid var(--ink-4)`
  - **Conteúdo do card**:
    - Header: "DIA 03 · Tiago" (mono 10px, uppercase, letter-spacing 0.18em) + status dot 8×8 à direita (border ou preenchido se lido)
    - Tema: Fraunces 20px, letter-spacing -0.01em
    - Referência: mono 10px, uppercase, cor `--ink-3` (ex.: "Provérbios 1.7" ou "Tiago 1.2")

### 5. Aba "Anotações" (NotesView)

- Lista de entradas (max-width 720px), apenas dias com nota escrita OU highlights salvos
- **Empty state**: centralizado, título Fraunces 300 22px "Nada ainda", subtítulo Fraunces itálico 16px
- **Cada entrada**: padding vertical 32px, border-bottom `--line`:
  - Head flex space-between: à esquerda mini-metadata ("DIA 03 · Provérbios 3.5" em mono 11px cor `--accent` + tema Fraunces 22px); à direita botão texto "abrir dia →" (mono 10px uppercase cor `--ink-3`, hover `--accent`)
  - **Texto da anotação**: Fraunces 300 16px, `white-space: pre-wrap`
  - **Highlights salvos** (se houver): border-top dashed `--line`, cada item com Fraunces 300 itálico 14px, border-left `2px --highlight`, padding-left 12px, background gradient horizontal do `--highlight` para transparente

---

## Interactions & Behavior

### Navegação entre abas
Click nos tabs alterna a view. Não há transição de rota — é um SPA. Ao trocar tab, o scroll não é resetado.

### Navegação entre dias (aba Hoje)
- Botões chevron ← → mudam `currentDay` em ±1 (com clamp entre 1 e 41)
- Ao trocar dia: scroll para topo (`window.scrollTo({ top: 0, behavior: 'smooth' })`), keyed re-render (aplica animação `fade-in` 400ms)
- Click em qualquer card da Jornada → navega para o dia + volta pra aba "Hoje"

### Marcar como lido
- Click no botão "Marcar como lido" → grava `state.read[dayNumber] = ISO timestamp` ou remove se já lido (toggle)
- Reflete imediatamente: pill muda estilo, dot preenche, contador no tab Jornada atualiza, progress bar avança

### Sublinhar versículo
- Click em qualquer versículo dentro da seção "Leitura" → toggle no array `state.highlights[dayNumber]` (contém números de versículos, ex.: `[5, 12, 18]`)
- Visual: background `--highlight` (transparente amarelo)
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
- Ícones: sun se dark ativo (para voltar ao light), moon se light ativo

### Animações
- **fade-in** (400ms): aplicado ao trocar de aba OU dia. Keyframe: `opacity 0 → 1`, `translateY(4px) → 0`
- Nenhuma animação complexa. Sensação geral: silenciosa e respirada.

### Estados
- **Loading**: não há estado de loading (dados carregam sincronamente via script tags)
- **Error**: nenhum tratamento explícito (é conteúdo estático, não há chamada de rede)
- **Empty (Anotações)**: mostrado quando não há nenhuma nota nem highlight salvos

### Responsive
- Breakpoint único em `720px`:
  - App padding: `20px 20px 100px` (vs `32px 40px 120px` desktop)
  - Header vira wrap com gap 16px
  - Verse anchor 24px (vs 30px)
  - Word card vira 1 coluna
  - Journey title 28px (vs 34px)
  - Passage 17px (vs 18px), padding-left 16px
  - Meditation 16px (vs 17px), drop-cap 44px (vs 56px)

---

## State Management

Todo o estado da app vive em um único objeto persistido em `localStorage['lectio-v2']`:

```typescript
type AppState = {
  currentDay: number;          // 1..41, dia sendo visualizado na aba Hoje
  theme: 'light' | 'dark';     // tema atual
  read: {                      // dias marcados como lidos
    [dayNumber: number]: string; // ISO timestamp de quando foi marcado
  };
  notes: {                     // anotações por dia
    [dayNumber: number]: string; // texto livre do usuário
  };
  highlights: {                // versículos sublinhados por dia
    [dayNumber: number]: number[]; // array de números de versículos
  };
};
```

### Transições
- Qualquer mudança em qualquer chave (currentDay, theme, read, notes, highlights) dispara um `saveState()` que serializa e escreve em `localStorage`
- `loadState()` roda uma vez no mount inicial
- Sem sincronização com servidor. Sem autenticação. Puro client-side.

### Estrutura dos dados devocionais (read-only)

Array `DEVOTIONAL` com 41 objetos, cada um com esta forma:

```typescript
type DayContent = {
  day: number;                   // 1..41
  theme: string;                 // Ex: "O temor do Senhor"
  date: string;                  // Ex: "Provérbios 1" (rótulo do dia)
  verse: {
    text: string;                // versículo âncora
    ref: string;                 // Ex: "Provérbios 1.7"
  };
  word: {
    original: string;            // texto hebraico/grego (RTL para hebraico)
    translit: string;            // Ex: "yir'at YHWH"
    lang: 'hebraico' | 'grego';
    meaning: string;             // significado curto
    note: string;                // nota etimológica mais longa
  };
  context: string;               // parágrafo de contexto histórico
  passage: {
    ref: string;                 // Ex: "Provérbios 1"
    verses: Array<{
      n: number;                 // número do versículo
      text: string;              // texto (tradução NAA)
    }>;
  };
  meditation: string[];          // 2-3 parágrafos
  questions: string[];           // exatamente 3 perguntas
  application: string;           // 1 parágrafo curto
  prayer: string;                // 1 parágrafo curto
};
```

O array é montado pela sequência: PV1, PV2, TG1, PV3, PV4, TG2, PV5, PV6, TG3... — 2 provérbios intercalados com 1 bloco de Tiago, sempre.

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

**Nota sobre oklch:** todos os browsers modernos (Chrome 111+, Safari 15.4+, Firefox 113+) suportam. Se precisar de fallback, converta para HSL/HEX usando ferramenta tipo [oklch.com](https://oklch.com). Recomendo manter oklch por questão de percepção linear das cores.

### Tipografia
Fontes carregadas via Google Fonts:
- **Fraunces** (300, 400, 500, italic) — serif expressiva com optical sizing (`opsz` variável 9-144). Usada para conteúdo, versículos, títulos, meditações. É a alma tipográfica do projeto.
- **Inter** (300, 400, 500, 600) — sans-serif para UI/base
- **JetBrains Mono** (400, 500) — mono para metadados, referências, translit

**Optical sizing (Fraunces):** aplique `font-optical-sizing: auto` no elemento raiz das serifas ou use `font-variation-settings: "opsz" <N>`:
- Verse anchor grande: `opsz 96`
- Prayer 19px: `opsz 24`
- Texto de leitura 16-18px: `opsz 14`

### Escala tipográfica (usada)
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
| Word original (heb/gr)       | Fraunces         | 400    | 42px  | 1           | —              |
| Word transliteration         | JetBrains Mono   | 500    | 13px  | —           | —              |
| Word meaning                 | Fraunces italic  | 400    | 15px  | —           | —              |
| Word note                    | Inter            | 400    | 13px  | 1.65        | —              |
| Drop cap (meditation)        | Fraunces italic  | 300    | 56px  | 0.9         | —              |

### Spacing scale (observado no design)
Sem escala rígida — valores usados diretamente em px:
- **Micro**: 2, 4, 6, 8, 10, 12
- **Small**: 16, 20, 24, 28
- **Medium**: 32, 40, 48, 56
- **Large**: 60, 80, 100, 120

Sugestão para o codebase-alvo: adotar escala 4px (Tailwind-like) e mapear os valores.

### Border-radius
- Buttons circulares: `50%`
- Pills (read status, tab-count): `100px`
- Cards / boxes: `4px`
- Small elements (highlight): `2px`

### Border weights
- Padrão: `1px solid var(--line)`
- Ênfase: `1px solid var(--line-strong)`
- Ativo (current, accent underline): `1px solid var(--accent)`
- Filete lateral do card Jornada: `2px solid` (accent ou ink-4)

---

## Assets

Nenhum asset binário. Todos os visuais são texto CSS + ícones SVG inline (React components). Ícones usados:

- **sun** (24×24, stroke 1.5, círculo + 8 raios) — dark mode toggle
- **moon** (24×24, stroke 1.5, formato de crescente) — light mode toggle
- **chevron-left / chevron-right** (24×24, stroke 1.8) — navegação de dias

Se o codebase-alvo usa uma biblioteca de ícones (Lucide, Heroicons, Phosphor), substitua pelos equivalentes. Estes três ícones existem em todas as bibliotecas mainstream com esses mesmos nomes.

### Fontes (externas)
Carregadas do Google Fonts via `<link>` no `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..500&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Para produção, considere self-hosting via `fontsource` ou download direto pra evitar dependência externa e melhorar performance.

### Conteúdo textual (41 dias)
Todo o conteúdo devocional está em arquivos `data/*.js` como arrays JavaScript. Total ~120KB de texto. Recomendação para produção:
- Converter para JSON estático (import direto no bundle) ou
- Servir por CMS/API se quiser editar o conteúdo sem deploy
- Um único arquivo `devotional.json` de ~120KB é aceitável para carregar tudo no client

**Tradução bíblica usada:** Nova Almeida Atualizada (NAA), com adaptações mínimas de estilo. Verifique licenciamento se o produto for comercial. Alternativa: usar API pública da Bíblia (ex.: [bible.helloao.org](https://bible.helloao.org) ou [scripture.api.bible](https://scripture.api.bible)) para os textos das passagens, mantendo apenas o conteúdo devocional autoral (meditações, perguntas, aplicações, orações).

---

## Files

Arquivos incluídos neste handoff:

| Arquivo                                | Descrição                                                    |
|----------------------------------------|--------------------------------------------------------------|
| `index.html`                           | Entry point — carrega React, Babel, CSS, dados e app         |
| `styles.css`                           | Todos os estilos (tokens + componentes) — ~500 linhas       |
| `app.jsx`                              | App React com todos os componentes                          |
| `data/devotional.js`                   | IIFE que intercala Provérbios + Tiago em `window.DEVOTIONAL` |
| `data/proverbios-1-10.js`              | Conteúdo devocional Provérbios 1-10                          |
| `data/proverbios-11-20.js`             | Conteúdo devocional Provérbios 11-20                         |
| `data/proverbios-21-31.js`             | Conteúdo devocional Provérbios 21-31                         |
| `data/tiago.js`                        | 10 blocos temáticos de Tiago                                 |

### Componentes React (em `app.jsx`)
- `App` — root, gerencia estado global, tab ativa, dia atual
- `Header` — brand + theme toggle
- `Tabs` — navegação entre Hoje / Jornada / Anotações
- `Reader` — visualização detalhada de um dia (a maior)
- `Journey` — grid de 41 cards com progresso
- `NotesView` — compilado de anotações e highlights salvos
- `Icon` — bag de SVGs inline

Para uma implementação limpa, sugiro quebrar `Reader` em subcomponentes (`ReaderTopline`, `DayHeader`, `VerseAnchor`, `WordCard`, `PassageBlock`, `MeditationBlock`, `QuestionsBlock`, `ApplicationBox`, `PrayerBlock`, `NotesEditor`) — no protótipo ficou tudo junto para agilidade.

---

## Recommended Next Steps (Genspark Code ou dev externo)

1. **Setup**: Vite + React + TypeScript. Instalar `@fontsource/fraunces`, `@fontsource/inter`, `@fontsource/jetbrains-mono` (ou manter Google Fonts).
2. **Design tokens**: portar as vars CSS pra um `tokens.css` ou (melhor) para o config do Tailwind/UnoCSS/CSS-in-JS do projeto.
3. **Dados**: converter `data/*.js` para um único `devotional.json` importado como módulo. Tipar com o schema `DayContent` acima.
4. **Estado**: se React puro, usar `useReducer` + custom hook `useDevotionalStorage()` que encapsula load/save do localStorage com debounce nas anotações. Se houver Zustand/Redux, adaptar.
5. **Rotas** (opcional): considerar rotas reais `/dia/:n`, `/jornada`, `/anotacoes` — melhora shareability e navegação por botão do browser. Atualmente é state interno.
6. **Melhorias que ficaram fora do MVP** (mencionar ao product owner):
   - Sync entre dispositivos (backend + auth)
   - Export das anotações como PDF/markdown
   - Compartilhar um dia específico via link
   - Áudio da passagem (TTS ou gravada)
   - Notificações/lembretes diários
   - Modo offline (PWA / service worker)
   - Ajustar tamanho de fonte pelo usuário (accessibility)
