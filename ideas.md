# Ideas de Design — FinanceTracker

## Abordagem 1: Neo-Brutalist Finance

<response>
<text>
**Design Movement:** Neo-Brutalismo Financeiro
**Core Principles:**
- Contraste agressivo entre blocos de cor sólida e tipografia pesada
- Bordas visíveis e sombras duras (sem blur)
- Hierarquia visual definida por peso tipográfico e cor, não por espaçamento

**Color Philosophy:** Fundo creme/off-white (#F5F0E8), preto puro para texto, amarelo-mostarda (#F5C842) como acento primário, vermelho-tijolo (#C0392B) para despesas/alertas. Paleta que remete a planilhas físicas antigas com energia moderna.

**Layout Paradigm:** Grid assimétrico com colunas de larguras variadas. Dashboard à esquerda com métricas em blocos empilhados; tabela ocupa 60% da tela à direita. Formulário em drawer lateral.

**Signature Elements:**
- Bordas de 2px sólidas em todos os cards
- Sombras offset (4px 4px 0px #000)
- Números financeiros em fonte monospace bold

**Interaction Philosophy:** Cliques com feedback visual imediato (scale down), sem animações suaves — tudo é direto e responsivo.

**Animation:** Transições de 100ms apenas, sem easing suave. Elementos "saltam" para posição.

**Typography System:** Títulos em Space Grotesk Bold, corpo em IBM Plex Mono para números, Inter Regular para texto corrido.
</text>
<probability>0.07</probability>
</response>

---

## Abordagem 2: Minimalismo Orgânico — ESCOLHIDA ✓

<response>
<text>
**Design Movement:** Minimalismo Orgânico com influência Scandinavian Finance
**Core Principles:**
- Espaço em branco generoso como elemento de design ativo
- Tipografia com contraste de peso (display bold + body regular)
- Profundidade sutil via sombras suaves e camadas de fundo
- Dados financeiros apresentados com clareza cirúrgica

**Color Philosophy:** Fundo quase-branco (#FAFAF8), verde-salva (#2D6A4F) como cor primária (remete a prosperidade sem ser clichê), âmbar (#D97706) para alertas e destaques, cinza-pedra para texto secundário. Modo escuro em verde-escuro profundo (#0D1F17) com superfícies em (#1A2E22).

**Layout Paradigm:** Sidebar fixa à esquerda com navegação; área principal com header de métricas em cards horizontais; formulário inline expansível; tabela com linhas alternadas sutis.

**Signature Elements:**
- Cards com cantos levemente arredondados (8px) e sombra difusa
- Ícones de categorias coloridos como único elemento de cor vibrante
- Separadores em gradiente verde-transparente

**Interaction Philosophy:** Hover states suaves com transição de 200ms; formulário expande com animação spring; linhas da tabela têm highlight ao hover.

**Animation:** Framer Motion para entrada de elementos (fade + slide up 12px), spring para modais, stagger para lista de despesas.

**Typography System:** Títulos em Sora SemiBold/Bold, números em JetBrains Mono, corpo em Inter.
</text>
<probability>0.09</probability>
</response>

---

## Abordagem 3: Data-Forward Dashboard

<response>
<text>
**Design Movement:** Data Visualization First — inspirado em Bloomberg Terminal modernizado
**Core Principles:**
- Dados são o design; UI serve os dados
- Alta densidade de informação sem sensação de sobrecarga
- Gráficos como elementos de navegação, não apenas decoração

**Color Philosophy:** Fundo escuro (#0F172A), azul-elétrico (#3B82F6) como primário, verde-neon (#22C55E) para positivo, vermelho-coral (#EF4444) para negativo. Paleta de gráficos em gradiente de azul a roxo.

**Layout Paradigm:** Layout de 3 colunas: métricas à esquerda, gráfico central dominante, lista à direita. Mobile: empilhado verticalmente.

**Signature Elements:**
- Linhas de grade sutis no fundo (como papel milimetrado)
- Números com animação de contagem ao carregar
- Gráficos com tooltip rico em dados

**Interaction Philosophy:** Filtros como chips clicáveis; seleção de período via gráfico interativo; drill-down em categorias.

**Animation:** Números contam de 0 ao valor final; gráficos desenham progressivamente; transições de página com slide horizontal.

**Typography System:** Títulos em Outfit Bold, números em Fira Code, corpo em Outfit Regular.
</text>
<probability>0.08</probability>
</response>
