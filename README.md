# Figurinhas Personalizadas — Landing Page

Landing page completa, funcional e mobile-first para venda de figurinhas
personalizadas para WhatsApp. Sem framework pesado, sem backend: HTML, CSS e
JavaScript puro (ES Modules), pronta para publicar como site estático.

## O que está implementado

- Landing page completa (hero, exemplos, preços, como funciona, seção
  empresas, entrega, casos reais, conteúdo para SEO/GEO, FAQ, CTA final).
- Quiz interativo passo a passo, com fluxo condicional completo (pessoal x
  empresa), barra de progresso, validação amigável, edição via resumo,
  salvamento automático em `localStorage` e banner de retomada de pedido.
- Geração automática da mensagem do WhatsApp (pessoal e empresa), com
  `encodeURIComponent` e UTMs anexadas quando existirem.
- Pagamento via PIX: chave exibida, botão de copiar com feedback visual,
  checkbox de confirmação obrigatório antes de liberar o botão final.
- Captura e persistência de UTMs (`utm_source`, `utm_medium`, `utm_campaign`,
  `utm_content`, `utm_term`, `fbclid`, `gclid`).
- `window.dataLayer` + função `trackEvent()` prontos para GTM/GA4/Meta Pixel,
  disparando os eventos descritos no briefing (`quiz_start`, `select_plan`,
  `quiz_complete`, `copy_pix`, `whatsapp_click`, `purchase_intent` etc.).
- SEO técnico: title único, meta description, canonical, Open Graph, Twitter
  Card, `robots.txt`, `sitemap.xml`, um único `<h1>`, JSON-LD (Organization,
  WebSite, Service/Offer, FAQPage).
- Conteúdo para GEO (Generative Engine Optimization): uma seção dedicada em
  HTML puro explicando o que é, para quem serve, como funciona, preço, envio
  de foto/logo e atendimento — tudo também navegável fora do quiz.
- Responsivo (320px → desktop), acessível (labels, foco, `aria-*`, contraste)
  e sem dependências pesadas.

## Estrutura de arquivos

```
/
  index.html            Landing page principal
  privacy/index.html    Política de Privacidade
  terms/index.html      Termos de Uso
  obrigado/index.html   Página de obrigado (estrutura preparada)
  /src
    config.js           CONFIG (WhatsApp, PIX, domínio) e PLANS (pacotes/preços)
    tracking.js          dataLayer, trackEvent(), captura de UTMs
    quiz.js               Motor completo do quiz (estado, validação, mensagens)
    app.js                Header, botão flutuante, barra fixa, inicialização
    styles.css            Todo o CSS do site
  /assets
    /icons/favicon.svg
    /images/og-image.svg
  robots.txt
  sitemap.xml
  manifest.webmanifest
  netlify.toml
  vercel.json
```

## Como rodar localmente

Não há build. Basta servir a pasta como site estático:

```bash
npx serve .
# ou
python -m http.server 8080
```

Depois abra `http://localhost:8080` (ou a porta indicada).

## Onde alterar cada coisa

Tudo que muda com frequência está centralizado em **`src/config.js`**:

```js
export const CONFIG = {
  whatsappNumber: "55SEUNUMERO", // número no formato 55 + DDD + número, só dígitos
  pixKey: "SUA_CHAVE_PIX",       // chave PIX exibida e copiada pelo cliente
  domain: "https://SEUDOMINIO.com",
  brandName: "Figurinhas Personalizadas",
};

export const PLANS = {
  3:  { quantity: 3,  price: 4.9,  highlight: false },
  8:  { quantity: 8,  price: 9.9,  highlight: false },
  15: { quantity: 15, price: 14.9, highlight: true },
};
```

- **Número do WhatsApp:** troque `whatsappNumber` em `src/config.js`.
- **Chave PIX:** troque `pixKey` em `src/config.js`.
- **Preços/quantidades:** altere `PLANS` em `src/config.js`. Isso já atualiza
  automaticamente o quiz, o resumo do pedido e a mensagem do WhatsApp.
  ⚠️ **Importante:** os valores também aparecem como texto estático em
  `index.html` (seção `#precos`) e no bloco `Schema.org: Serviço` no `<head>`,
  para que fiquem visíveis a mecanismos de busca sem depender de JavaScript.
  Foram marcados com o comentário `<!-- Sincronize sempre estes valores com
  PLANS em src/config.js -->` — atualize-os manualmente junto com o `config.js`.
- **Domínio:** troque `domain` em `src/config.js` **e** todas as ocorrências
  de `https://SEUDOMINIO.com` em `index.html`, `privacy/index.html`,
  `terms/index.html`, `obrigado/index.html`, `robots.txt` e `sitemap.xml`.
- **Logo da empresa:** hoje o cabeçalho e o quiz usam o texto "🎨 Figurinhas
  Personalizadas". Para usar uma logo de verdade, substitua o conteúdo de
  `.brand` em `index.html` (e nas outras páginas) por `<img src="/assets/images/logo.png" alt="...">`
  e ajuste `.brand` em `src/styles.css` se necessário.
- **Trocar imagens dos exemplos:** a seção "Veja o que dá para criar" usa
  placeholders ilustrados com emoji (`.example-visual`) em vez de fotos, já
  que ainda não há trabalhos reais para mostrar. Para usar fotos reais, troque
  cada `<div class="example-visual">🩺</div>` por
  `<img src="/assets/images/exemplo-medico.jpg" alt="Figurinha personalizada para médico" loading="lazy">`
  dentro do respectivo `<figure class="example-card">`.
- **Favicon / ícone do site:** `assets/icons/favicon.svg` (emoji 🎨 sobre
  gradiente). Troque pelo arquivo real da marca quando tiver um.
- **Imagem de compartilhamento (Open Graph):** `assets/images/og-image.svg` é
  um placeholder. Redes sociais como Facebook/WhatsApp/LinkedIn preferem
  imagens raster — substitua por um `.png`/`.jpg` de 1200×630px real e
  atualize os `<meta property="og:image">` e `<meta name="twitter:image">`
  em `index.html`.

## Onde adicionar tracking (GTM / GA4 / Meta Pixel)

- **Google Tag Manager:** cole o snippet oficial dentro do `<head>` de
  `index.html`, no comentário `GOOGLE TAG MANAGER`, e o snippet `<noscript>`
  logo após a abertura do `<body>` (também já marcado com comentário).
- **GA4 direto (sem GTM) ou Meta Pixel:** cole os snippets oficiais no mesmo
  local do `<head>`. O projeto já expõe `window.dataLayer` e chama
  `window.gtag(...)` / `window.fbq(...)` automaticamente dentro de
  `trackEvent()` (`src/tracking.js`) sempre que essas funções existirem — não
  precisa alterar mais nada no código.
- Todos os eventos do briefing já disparam nos pontos certos: `page_view`,
  `view_pricing`, `quiz_start`, `order_type_selected`, `personal_order` /
  `business_order`, `select_plan`, `quiz_step`, `phrase_mode_selected`,
  `quiz_complete`, `view_checkout`, `copy_pix`, `whatsapp_click`,
  `purchase_intent`.

## Publicando

### Netlify
1. Suba este repositório para o GitHub/GitLab.
2. Em "New site from Git", selecione o repositório.
3. Build command: (vazio) — Publish directory: `.`
4. O `netlify.toml` já configura headers de cache e segurança.

### Vercel
1. Suba este repositório para o GitHub.
2. Importe o projeto na Vercel — é detectado automaticamente como site
   estático ("Other"), sem build command necessário.
3. O `vercel.json` já configura os mesmos headers de cache e segurança.

## Testes já realizados

O quiz foi testado ponta a ponta com um navegador automatizado (Playwright),
cobrindo:

- Fluxo pessoal completo (tema, detalhes, foto informativa, pacote, "podem
  criar para mim", resumo, pagamento).
- Fluxo empresa completo (nome, segmento com exemplos de frases, logo,
  personagem, estilo, cores, pacote de 15, modo "escolher algumas" com
  delegar/desfazer delegação de figurinhas).
- Validações de campo obrigatório com mensagens amigáveis.
- Botão de copiar PIX (com feedback visual e conteúdo real na área de
  transferência).
- Geração da mensagem final do WhatsApp: emojis, quebras de linha e
  acentuação foram conferidos byte a byte (UTF-8 correto via
  `encodeURIComponent`).
- Banner de retomada de pedido após atualizar a página no meio do quiz,
  incluindo restauração do estado exato (inclusive placeholders dinâmicos).
- Nenhum erro no console em nenhum dos fluxos.

Durante os testes, um bug real de acessibilidade foi encontrado e corrigido:
o menu mobile fechado permanecia focável por teclado mesmo estando invisível
(`opacity: 0` sozinho não remove elementos da ordem de tabulação). A correção
usa `visibility: hidden` em conjunto, com uma pequena transição para não
quebrar a animação de abertura/fechamento.

## Limitações conhecidas / próximos passos

- As imagens de exemplo são placeholders ilustrados (emoji), não fotos reais
  — substitua conforme instruções acima assim que tiver material.
- `assets/images/og-image.svg` deve ser trocado por um PNG/JPG real para
  compartilhamento em redes sociais.
- A seção "Casos reais" está com estrutura pronta e vazia, aguardando
  conteúdo real (sem depoimentos ou dados fictícios, propositalmente).
