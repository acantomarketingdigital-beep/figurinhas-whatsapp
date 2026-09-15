// ============================================================
// QUIZ — motor completo do questionário passo a passo
// ============================================================
import { CONFIG, PLANS, formatBRL } from "./config.js";
import { trackEvent, getStoredUTMs } from "./tracking.js";

const STORAGE_KEY = "figurinhas_quiz_state_v1";

// ------------------------------------------------------------
// Dados das opções (id = valor salvo, label = texto exibido)
// ------------------------------------------------------------
const PERSONAL_THEMES = [
  { id: "profissao", label: "💼 Minha profissão" },
  { id: "esporte", label: "⚽ Meu esporte" },
  { id: "academia", label: "🏋️ Academia" },
  { id: "engracadas", label: "😂 Engraçadas" },
  { id: "casal", label: "❤️ Amor / casal" },
  { id: "familia", label: "👨‍👩‍👧 Família" },
  { id: "gamer", label: "🎮 Gamer" },
  { id: "diaadia", label: "😎 Dia a dia" },
  { id: "outro", label: "🎨 Outro tema" },
];

const BUSINESS_SEGMENTS = [
  { id: "estetica", label: "💆 Clínica de estética" },
  { id: "turismo", label: "✈️ Agência de turismo" },
  { id: "beleza", label: "💇 Salão / Beleza" },
  { id: "imobiliaria", label: "🏠 Imobiliária" },
  { id: "loja", label: "🛍️ Loja" },
  { id: "restaurante", label: "🍔 Restaurante / Alimentação" },
  { id: "advocacia", label: "⚖️ Advocacia" },
  { id: "saude", label: "🦷 Clínica / Saúde" },
  { id: "marketing", label: "📱 Marketing / Agência" },
  { id: "educacao", label: "🎓 Educação" },
  { id: "servicos", label: "🔧 Serviços" },
  { id: "automotivo", label: "🚗 Automotivo" },
  { id: "fitness", label: "🏋️ Academia / Fitness" },
  { id: "outro", label: "🎨 Outro" },
];

const USE_LOGO_OPTIONS = [
  { id: "sim", label: "✅ Sim, quero usar minha logo" },
  { id: "nao", label: "❌ Não preciso usar logo" },
];

const CHARACTER_OPTIONS = [
  { id: "eu", label: "🙋 Sim, quero aparecer" },
  { id: "equipe", label: "👥 Quero usar alguém da minha equipe" },
  { id: "personagem", label: "🎨 Quero um personagem criado para minha empresa" },
  { id: "somente-marca", label: "🏢 Não. Quero apenas minha marca / logo" },
];

const STYLE_OPTIONS = [
  { id: "vendedor", label: "🔥 Vendedor / Chamativo" },
  { id: "moderno", label: "✨ Moderno" },
  { id: "profissional", label: "💼 Profissional" },
  { id: "divertido", label: "😂 Divertido" },
  { id: "delicado", label: "💖 Delicado" },
  { id: "jovem", label: "🚀 Jovem / Dinâmico" },
  { id: "escolha", label: "🎨 Pode escolher para mim" },
];

const PHRASE_MODE_OPTIONS = [
  { id: "all", title: "✍️ QUERO ESCOLHER TODAS", desc: "Eu mesmo quero escrever cada frase." },
  { id: "ai", title: "✨ PODEM CRIAR PARA MIM", desc: "Criem frases e expressões de acordo com meu estilo ou negócio." },
  { id: "some", title: "🔀 QUERO ESCOLHER ALGUMAS", desc: "Vou escrever algumas e vocês criam o restante." },
];

const PHRASE_TYPE_OPTIONS = [
  { id: "engracadas", label: "😂 Engraçadas" },
  { id: "profissionais", label: "💼 Profissionais" },
  { id: "vendedoras", label: "🔥 Vendedoras" },
  { id: "fofas", label: "😍 Fofas" },
  { id: "urgencia", label: "🚨 Urgência" },
  { id: "atendimento", label: "📲 Atendimento" },
  { id: "diaadia", label: "😎 Dia a dia" },
  { id: "comemoracao", label: "🎉 Comemoração" },
  { id: "carinhosas", label: "❤️ Carinhosas" },
  { id: "misturadas", label: "🎨 Misturadas" },
];

const EXPRESSION_OPTIONS = [
  { id: "feliz", label: "😄 Feliz" },
  { id: "rindo", label: "😂 Morrendo de rir" },
  { id: "apaixonado", label: "😍 Apaixonado(a)" },
  { id: "confiante", label: "😎 Confiante" },
  { id: "deolho", label: "👀 De olho" },
  { id: "desconfiado", label: "🤔 Desconfiado(a)" },
  { id: "bravo", label: "😡 Bravo(a)" },
  { id: "cansado", label: "😴 Cansado(a)" },
  { id: "joinha", label: "👍 Fazendo joinha" },
  { id: "coracao", label: "❤️ Fazendo coração" },
  { id: "comemorando", label: "🎉 Comemorando" },
  { id: "forca", label: "💪 Mostrando força" },
  { id: "vergonha", label: "🙈 Com vergonha" },
  { id: "livre", label: "🤷 Pode criar para mim" },
];

const PERSONAL_DETAIL_PLACEHOLDERS = {
  profissao: "Sou médica e quero aparecer usando jaleco branco e estetoscópio.",
  esporte: "Jogo vôlei e quero aparecer usando uniforme azul.",
  academia: "Treino todos os dias e quero aparecer com roupa de academia.",
  engracadas: "Quero figurinhas engraçadas para mandar para meus amigos.",
  casal: "Quero figurinhas fofas para usar com meu amor.",
  familia: "Quero figurinhas para o grupo da família.",
  gamer: "Sou gamer e quero aparecer com fone de ouvido, jogando.",
  diaadia: "Quero figurinhas para usar no dia a dia com os amigos.",
  outro: "Sou corretor e quero figurinhas para usar com clientes.",
};

const SEGMENT_EXAMPLES = {
  turismo: ["Vagas se esgotando", "Faça sua reserva", "Novidade chegando", "Últimos lugares", "Partiu viagem?", "Viagem confirmada", "Grupo aberto", "Corre que acaba!"],
  estetica: ["Agenda aberta", "Últimas vagas", "Promoção da semana", "Agende seu horário", "Me chama no Whats", "Tem novidade!", "Resultado incrível"],
  loja: ["Novidade chegando", "Promoção!", "Últimas unidades", "Seu pedido saiu", "Chama no Whats", "Olha essa novidade"],
  restaurante: ["Seu pedido saiu!", "Hoje tem promoção", "Peça agora", "Estamos abertos", "Delícia chegando!"],
};

// ------------------------------------------------------------
// Estado
// ------------------------------------------------------------
function createEmptyState() {
  return {
    stepKey: "orderType",
    orderType: null,
    personalTheme: null,
    personalThemeOther: "",
    personalDetails: "",
    personalColorDetail: "",
    companyName: "",
    segment: null,
    segmentOther: "",
    useLogo: null,
    character: null,
    style: null,
    colors: "",
    followLogoColors: false,
    package: null,
    phraseMode: null,
    phraseTypes: [],
    phraseNotes: "",
    stickers: [],
    customerName: "",
    paymentConfirmed: false,
    _startFired: false,
    _quizCompleteFired: false,
    _viewCheckoutFired: false,
  };
}

let state = createEmptyState();
let dom = {};
let pendingResumeState = null;

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    /* localStorage indisponível (modo privado, etc.) */
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return { ...createEmptyState(), ...JSON.parse(raw) };
  } catch (err) {
    return null;
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    /* no-op */
  }
}

function hasMeaningfulProgress(saved) {
  return Boolean(saved && saved.orderType && saved.stepKey && saved.stepKey !== "orderType");
}

function syncStickers(currentState) {
  const qty = currentState.package ? PLANS[currentState.package].quantity : 0;
  const current = currentState.stickers || [];
  const next = [];
  for (let i = 0; i < qty; i += 1) {
    next.push(current[i] || { phrase: "", expression: "", detail: "", delegated: false });
  }
  currentState.stickers = next;
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
function escapeHTML(str = "") {
  return String(str).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch]));
}

function stripEmoji(label = "") {
  const spaceIndex = label.indexOf(" ");
  return spaceIndex === -1 ? label : label.slice(spaceIndex + 1);
}

function labelOf(list, id) {
  const found = list.find((item) => item.id === id);
  return found ? found.label : "";
}

function cleanLabelOf(list, id) {
  const label = labelOf(list, id);
  return label ? stripEmoji(label) : "";
}

function getPersonalThemeLabel(currentState) {
  if (currentState.personalTheme === "outro") {
    return currentState.personalThemeOther.trim() || "Outro tema";
  }
  return cleanLabelOf(PERSONAL_THEMES, currentState.personalTheme);
}

function getSegmentLabel(currentState) {
  if (currentState.segment === "outro") {
    return currentState.segmentOther.trim() || "Outro";
  }
  return cleanLabelOf(BUSINESS_SEGMENTS, currentState.segment);
}

function personalDetailsPlaceholder(currentState) {
  return PERSONAL_DETAIL_PLACEHOLDERS[currentState.personalTheme] || "Conte como você quer aparecer nas suas figurinhas.";
}

function needsPhoto(currentState) {
  return currentState.orderType === "personal" || currentState.character === "eu" || currentState.character === "equipe";
}

function needsLogo(currentState) {
  return currentState.orderType === "business" && currentState.useLogo === "sim";
}

// ------------------------------------------------------------
// Lista dinâmica de etapas (depende das respostas)
// ------------------------------------------------------------
function getSteps(currentState) {
  const steps = ["orderType"];

  if (currentState.orderType === "personal") {
    steps.push("personalTheme", "personalDetails", "personalPhoto");
  } else if (currentState.orderType === "business") {
    steps.push("companyName", "segment", "useLogo", "character", "style", "colors");
  }

  steps.push("package", "phraseMode");

  if (currentState.phraseMode === "ai") {
    steps.push("phraseTypesAi");
  } else if (currentState.phraseMode === "all" || currentState.phraseMode === "some") {
    const qty = currentState.package ? PLANS[currentState.package].quantity : 0;
    for (let i = 0; i < qty; i += 1) steps.push(`sticker_${i}`);
  }

  steps.push("customerName", "summary", "payment");
  return steps;
}

// ------------------------------------------------------------
// Validação
// ------------------------------------------------------------
function ok() {
  return { valid: true, message: "" };
}
function fail(message) {
  return { valid: false, message };
}

function validateStep(key, currentState) {
  if (key.startsWith("sticker_")) {
    const idx = Number(key.split("_")[1]);
    const sticker = currentState.stickers[idx];
    if (!sticker || sticker.delegated) return ok();
    if (!sticker.phrase.trim()) {
      return currentState.phraseMode === "some"
        ? fail("Escreva uma frase ou deixe para a gente criar ✨")
        : fail("Escreva a frase dessa figurinha 😊");
    }
    if (!sticker.expression) return fail("Escolha uma expressão para continuar 😊");
    return ok();
  }

  switch (key) {
    case "orderType":
      return currentState.orderType ? ok() : fail("Escolha uma opção para continuar 😊");
    case "personalTheme":
      if (!currentState.personalTheme) return fail("Escolha uma opção para continuar 😊");
      if (currentState.personalTheme === "outro" && !currentState.personalThemeOther.trim()) {
        return fail("Conte qual é o tema 😊");
      }
      return ok();
    case "personalDetails":
      return currentState.personalDetails.trim() ? ok() : fail("Conte um pouquinho sobre o que você quer 😊");
    case "companyName":
      return currentState.companyName.trim() ? ok() : fail("Informe o nome da sua empresa 😊");
    case "segment":
      if (!currentState.segment) return fail("Escolha uma opção para continuar 😊");
      if (currentState.segment === "outro" && !currentState.segmentOther.trim()) {
        return fail("Conte qual é o seu segmento 😊");
      }
      return ok();
    case "useLogo":
      return currentState.useLogo ? ok() : fail("Escolha uma opção para continuar 😊");
    case "character":
      return currentState.character ? ok() : fail("Escolha uma opção para continuar 😊");
    case "style":
      return currentState.style ? ok() : fail("Escolha uma opção para continuar 😊");
    case "package":
      return currentState.package ? ok() : fail("Escolha um pacote para continuar 😊");
    case "phraseMode":
      return currentState.phraseMode ? ok() : fail("Escolha uma opção para continuar 😊");
    case "phraseTypesAi":
      return currentState.phraseTypes.length ? ok() : fail("Escolha ao menos um tipo de frase 😊");
    case "customerName":
      return currentState.customerName.trim() ? ok() : fail("Informe seu nome para continuar 😊");
    default:
      return ok();
  }
}

// ------------------------------------------------------------
// Efeitos colaterais de seleção (tracking + sincronizações)
// ------------------------------------------------------------
function handleFieldSideEffects(field, value) {
  if (field === "orderType") {
    trackEvent("order_type_selected", { order_type: value });
    trackEvent(value === "personal" ? "personal_order" : "business_order");
  } else if (field === "package") {
    syncStickers(state);
    const plan = PLANS[state.package];
    trackEvent("select_plan", {
      package_quantity: plan.quantity,
      package_value: plan.price,
      currency: "BRL",
      order_type: state.orderType || "unknown",
    });
  } else if (field === "phraseMode") {
    syncStickers(state);
    trackEvent("phrase_mode_selected", { phrase_mode: value });
  }
}

// ------------------------------------------------------------
// Render — grid de opções reutilizável
// ------------------------------------------------------------
function renderChoiceGrid(options, field, selectedValue, opts = {}) {
  const { multi = false, stickerIndex } = opts;
  return `<div class="quiz-options">
    ${options
      .map((opt) => {
        const isSelected = multi ? (selectedValue || []).includes(opt.id) : selectedValue === opt.id;
        return `<button type="button" class="choice-card ${isSelected ? "is-selected" : ""}"
          data-role="choice" data-field="${field}" data-value="${opt.id}" data-multi="${multi}"
          ${stickerIndex !== undefined ? `data-sticker-index="${stickerIndex}"` : ""}
          aria-pressed="${isSelected}">
          <span class="choice-label">${escapeHTML(opt.label)}</span>
        </button>`;
      })
      .join("")}
  </div>`;
}

// ------------------------------------------------------------
// Render — cada etapa
// ------------------------------------------------------------
function renderOrderType(currentState) {
  const personalSelected = currentState.orderType === "personal";
  const businessSelected = currentState.orderType === "business";
  return `
    <h2 class="quiz-question">PARA QUEM SÃO AS FIGURINHAS?</h2>
    <div class="quiz-options quiz-options--big">
      <button type="button" class="choice-card choice-card--big ${personalSelected ? "is-selected" : ""}" data-role="choice" data-field="orderType" data-value="personal" aria-pressed="${personalSelected}">
        <span class="choice-emoji">🙋</span>
        <span class="choice-title">PARA MIM</span>
        <span class="choice-desc">Foto pessoal, profissão, esporte, humor, academia, casal, família etc.</span>
      </button>
      <button type="button" class="choice-card choice-card--big ${businessSelected ? "is-selected" : ""}" data-role="choice" data-field="orderType" data-value="business" aria-pressed="${businessSelected}">
        <span class="choice-emoji">🏢</span>
        <span class="choice-title">PARA MINHA EMPRESA</span>
        <span class="choice-desc">Logo, atendimento, vendas, promoções, grupos, reservas, clientes etc.</span>
      </button>
    </div>
  `;
}

function renderPersonalTheme(currentState) {
  return `
    <h2 class="quiz-question">O QUE MAIS COMBINA COM SUAS FIGURINHAS?</h2>
    ${renderChoiceGrid(PERSONAL_THEMES, "personalTheme", currentState.personalTheme)}
    ${
      currentState.personalTheme === "outro"
        ? `<div class="field-group">
            <label class="field-label" for="personalThemeOther">Qual é o tema?</label>
            <input id="personalThemeOther" type="text" class="quiz-input" data-field="personalThemeOther" value="${escapeHTML(currentState.personalThemeOther)}" placeholder="Ex: Viagens, motos, culinária...">
          </div>`
        : ""
    }
  `;
}

function renderPersonalDetails(currentState) {
  return `
    <h2 class="quiz-question">CONTE COMO VOCÊ QUER APARECER</h2>
    <div class="field-group">
      <textarea class="quiz-textarea" data-field="personalDetails" rows="4" placeholder="${escapeHTML(personalDetailsPlaceholder(currentState))}">${escapeHTML(currentState.personalDetails)}</textarea>
    </div>
    <h3 class="quiz-subquestion">ALGUMA COR, ROUPA OU DETALHE IMPORTANTE? <span class="optional-tag">(opcional)</span></h3>
    <div class="field-group">
      <textarea class="quiz-textarea" data-field="personalColorDetail" rows="2" placeholder="Ex: Quero camiseta preta.">${escapeHTML(currentState.personalColorDetail)}</textarea>
    </div>
  `;
}

function renderPersonalPhoto() {
  return `
    <h2 class="quiz-question">📸 PARA FICAR PARECIDO COM VOCÊ</h2>
    <p class="quiz-paragraph">Depois de finalizar o pedido, você enviará sua foto pelo WhatsApp.</p>
    <p class="quiz-paragraph"><strong>Para um resultado melhor:</strong></p>
    <ul class="quiz-tips-list">
      <li>✅ Use uma foto nítida</li>
      <li>✅ Boa iluminação</li>
      <li>✅ Rosto bem visível</li>
      <li>✅ Sem filtro pesado</li>
      <li>✅ Evite fotos muito distantes</li>
      <li>✅ De preferência olhando para a câmera</li>
    </ul>
    <p class="quiz-paragraph quiz-paragraph--muted">Quanto melhor a foto, melhor conseguiremos preservar suas características.</p>
  `;
}

function renderCompanyName(currentState) {
  return `
    <h2 class="quiz-question">QUAL É O NOME DA SUA EMPRESA?</h2>
    <div class="field-group">
      <input type="text" class="quiz-input" data-field="companyName" value="${escapeHTML(currentState.companyName)}" placeholder="Ex: Meninas Tour">
    </div>
  `;
}

function renderSegment(currentState) {
  return `
    <h2 class="quiz-question">QUAL É O SEGMENTO?</h2>
    ${renderChoiceGrid(BUSINESS_SEGMENTS, "segment", currentState.segment)}
    ${
      currentState.segment === "outro"
        ? `<div class="field-group">
            <label class="field-label" for="segmentOther">Qual é o seu segmento?</label>
            <input id="segmentOther" type="text" class="quiz-input" data-field="segmentOther" value="${escapeHTML(currentState.segmentOther)}" placeholder="Conte um pouco sobre o seu negócio">
          </div>`
        : ""
    }
  `;
}

function renderUseLogo(currentState) {
  return `
    <h2 class="quiz-question">QUER USAR SUA LOGO NAS FIGURINHAS?</h2>
    ${renderChoiceGrid(USE_LOGO_OPTIONS, "useLogo", currentState.useLogo)}
    ${
      currentState.useLogo === "sim"
        ? `<div class="info-box">
            <p>Você enviará sua logo pelo WhatsApp depois de finalizar seu pedido.</p>
            <p><strong>Para um resultado melhor, envie:</strong></p>
            <ul class="quiz-tips-list">
              <li>Logo em boa qualidade</li>
              <li>Preferencialmente PNG</li>
              <li>Se tiver fundo transparente, melhor ainda</li>
            </ul>
          </div>`
        : ""
    }
  `;
}

function renderCharacter(currentState) {
  const showPhotoNote = currentState.character === "eu" || currentState.character === "equipe";
  return `
    <h2 class="quiz-question">QUER UMA PESSOA OU PERSONAGEM NAS FIGURINHAS?</h2>
    ${renderChoiceGrid(CHARACTER_OPTIONS, "character", currentState.character)}
    ${showPhotoNote ? `<div class="info-box"><p>A foto será enviada pelo WhatsApp depois de finalizar o pedido.</p></div>` : ""}
  `;
}

function renderStyle(currentState) {
  return `
    <h2 class="quiz-question">QUAL ESTILO COMBINA MAIS COM SUA MARCA?</h2>
    ${renderChoiceGrid(STYLE_OPTIONS, "style", currentState.style)}
  `;
}

function renderColors(currentState) {
  const examples = SEGMENT_EXAMPLES[currentState.segment];
  return `
    <h2 class="quiz-question">QUAIS CORES SUA MARCA USA?</h2>
    <div class="field-group">
      <input type="text" class="quiz-input" data-field="colors" value="${escapeHTML(currentState.colors)}" placeholder="Ex: Rosa e azul">
    </div>
    <label class="quiz-checkbox">
      <input type="checkbox" data-field="followLogoColors" ${currentState.followLogoColors ? "checked" : ""}>
      Pode seguir as cores da minha logo
    </label>
    ${
      examples
        ? `<div class="segment-examples">
            <p class="segment-examples-title">💡 Alguns exemplos de frases para o seu segmento:</p>
            <div class="segment-examples-chips">
              ${examples.map((ex) => `<span class="chip">${escapeHTML(ex)}</span>`).join("")}
            </div>
          </div>`
        : ""
    }
  `;
}

function renderPackage(currentState) {
  return `
    <h2 class="quiz-question">QUANTAS FIGURINHAS VOCÊ QUER?</h2>
    <div class="package-options">
      ${Object.values(PLANS)
        .map((plan) => {
          const selected = currentState.package === plan.quantity;
          const perUnit = plan.price / plan.quantity;
          return `
          <button type="button" class="package-card ${plan.highlight ? "package-card--highlight" : ""} ${selected ? "is-selected" : ""}"
            data-role="choice" data-field="package" data-value="${plan.quantity}" aria-pressed="${selected}">
            ${plan.highlight ? '<span class="package-badge">⭐ MELHOR ESCOLHA</span>' : ""}
            <span class="package-qty">${plan.quantity} FIGURINHAS</span>
            <span class="package-price">${escapeHTML(formatBRL(plan.price))}</span>
            <span class="package-perunit">≈ ${escapeHTML(formatBRL(perUnit))} por figurinha</span>
          </button>`;
        })
        .join("")}
    </div>
  `;
}

function renderPhraseMode() {
  return `
    <h2 class="quiz-question">COMO VOCÊ QUER MONTAR SUAS FIGURINHAS?</h2>
    <div class="quiz-options quiz-options--big">
      ${PHRASE_MODE_OPTIONS.map((opt) => {
        const selected = state.phraseMode === opt.id;
        return `
          <button type="button" class="choice-card choice-card--big ${selected ? "is-selected" : ""}"
            data-role="choice" data-field="phraseMode" data-value="${opt.id}" aria-pressed="${selected}">
            <span class="choice-title">${opt.title}</span>
            <span class="choice-desc">${opt.desc}</span>
          </button>`;
      }).join("")}
    </div>
  `;
}

function renderPhraseTypesAi(currentState) {
  return `
    <h2 class="quiz-question">QUE TIPO DE FRASES VOCÊ GOSTA?</h2>
    <p class="quiz-paragraph quiz-paragraph--muted">Escolha quantas quiser.</p>
    ${renderChoiceGrid(PHRASE_TYPE_OPTIONS, "phraseTypes", currentState.phraseTypes, { multi: true })}
    <h3 class="quiz-subquestion">ALGO QUE DEVEMOS SABER? <span class="optional-tag">(opcional)</span></h3>
    <div class="field-group">
      <textarea class="quiz-textarea" rows="3" data-field="phraseNotes" placeholder="Quero algo divertido, mas profissional.">${escapeHTML(currentState.phraseNotes)}</textarea>
    </div>
  `;
}

function renderStickerStep(i, currentState) {
  const qty = currentState.stickers.length;
  const sticker = currentState.stickers[i] || { phrase: "", expression: "", detail: "", delegated: false };

  if (sticker.delegated) {
    return `
      <p class="quiz-eyebrow">FIGURINHA ${i + 1} DE ${qty}</p>
      <h2 class="quiz-question">Essa figurinha vocês vão criar ✨</h2>
      <p class="quiz-paragraph">Vamos escolher uma frase e expressão de acordo com o seu estilo.</p>
      <button type="button" class="btn btn-ghost" data-role="undelegate-sticker" data-sticker-index="${i}">✍️ Preencher eu mesmo</button>
    `;
  }

  return `
    <p class="quiz-eyebrow">FIGURINHA ${i + 1} DE ${qty}</p>
    <h2 class="quiz-question">QUAL FRASE VOCÊ QUER?</h2>
    <div class="field-group">
      <input type="text" class="quiz-input" data-field="phrase" data-sticker-index="${i}" value="${escapeHTML(sticker.phrase)}" placeholder="Bora trabalhar!">
    </div>
    <h3 class="quiz-subquestion">QUAL EXPRESSÃO OU POSE?</h3>
    ${renderChoiceGrid(EXPRESSION_OPTIONS, "expression", sticker.expression, { stickerIndex: i })}
    <h3 class="quiz-subquestion">QUER ALGUM DETALHE DIFERENTE? <span class="optional-tag">(opcional)</span></h3>
    <div class="field-group">
      <textarea class="quiz-textarea" rows="2" data-field="detail" data-sticker-index="${i}" placeholder="Apontando para o texto.">${escapeHTML(sticker.detail)}</textarea>
    </div>
    ${
      currentState.phraseMode === "some"
        ? `<button type="button" class="btn btn-ghost" data-role="delegate-sticker" data-sticker-index="${i}">✨ DEIXAR ESSA PARA VOCÊS CRIAREM</button>`
        : ""
    }
  `;
}

function renderCustomerName(currentState) {
  return `
    <h2 class="quiz-question">QUAL É O SEU NOME?</h2>
    <div class="field-group">
      <input type="text" class="quiz-input" data-field="customerName" value="${escapeHTML(currentState.customerName)}" placeholder="Seu nome">
    </div>
  `;
}

function renderSummaryPhrases(currentState) {
  if (currentState.phraseMode === "ai") {
    const types = currentState.phraseTypes.map((id) => cleanLabelOf(PHRASE_TYPE_OPTIONS, id)).join(", ");
    return `<p class="summary-block-value">Vocês vão criar as frases (${escapeHTML(types || "ao seu critério")}).${
      currentState.phraseNotes ? ` Observação: ${escapeHTML(currentState.phraseNotes)}` : ""
    }</p>`;
  }
  return `<ol class="summary-phrase-list">
    ${currentState.stickers
      .map(
        (s, i) => `
      <li>
        <strong>${i + 1}.</strong>
        ${
          s.delegated
            ? "Pode criar ✨"
            : `${escapeHTML(s.phrase)} <span class="summary-expression">(${escapeHTML(cleanLabelOf(EXPRESSION_OPTIONS, s.expression))})</span>`
        }
      </li>`
      )
      .join("")}
  </ol>`;
}

function renderSummary(currentState) {
  const plan = PLANS[currentState.package];
  const blocks =
    currentState.orderType === "personal"
      ? [
          { title: "TIPO", value: "Uso pessoal", edit: "orderType" },
          { title: "NOME", value: currentState.customerName, edit: "customerName" },
          { title: "PACOTE", value: `${plan.quantity} figurinhas`, edit: "package" },
          { title: "TEMA", value: getPersonalThemeLabel(currentState), edit: "personalTheme" },
          {
            title: "DETALHES",
            value: currentState.personalDetails + (currentState.personalColorDetail ? ` — ${currentState.personalColorDetail}` : ""),
            edit: "personalDetails",
          },
        ]
      : [
          { title: "EMPRESA", value: currentState.companyName, edit: "companyName" },
          { title: "SEGMENTO", value: getSegmentLabel(currentState), edit: "segment" },
          { title: "NOME", value: currentState.customerName, edit: "customerName" },
          { title: "PACOTE", value: `${plan.quantity} figurinhas`, edit: "package" },
          { title: "USAR LOGO", value: currentState.useLogo === "sim" ? "Sim" : "Não", edit: "useLogo" },
          { title: "PERSONAGEM", value: cleanLabelOf(CHARACTER_OPTIONS, currentState.character), edit: "character" },
          { title: "ESTILO", value: cleanLabelOf(STYLE_OPTIONS, currentState.style), edit: "style" },
          {
            title: "CORES",
            value: currentState.colors || (currentState.followLogoColors ? "Cores da logo" : "Não informado"),
            edit: "colors",
          },
        ];

  const firstStickerStep = currentState.phraseMode === "ai" ? "phraseTypesAi" : "sticker_0";

  return `
    <h2 class="quiz-question">🎉 SEU PEDIDO ESTÁ QUASE PRONTO!</h2>
    <div class="summary-blocks">
      ${blocks
        .map(
          (b) => `
        <div class="summary-block">
          <div class="summary-block-head">
            <span class="summary-block-title">${b.title}</span>
            <button type="button" class="edit-btn" data-edit-step="${b.edit}">EDITAR</button>
          </div>
          <p class="summary-block-value">${escapeHTML(String(b.value || "—"))}</p>
        </div>`
        )
        .join("")}
      <div class="summary-block">
        <div class="summary-block-head">
          <span class="summary-block-title">FRASES</span>
          <button type="button" class="edit-btn" data-edit-step="${firstStickerStep}">EDITAR</button>
        </div>
        ${renderSummaryPhrases(currentState)}
      </div>
    </div>
    <div class="total-box">
      <span>TOTAL</span>
      <strong>${escapeHTML(formatBRL(plan.price))}</strong>
    </div>
  `;
}

function renderPayment(currentState) {
  const plan = PLANS[currentState.package];
  return `
    <h2 class="quiz-question">AGORA É SÓ FINALIZAR 💳</h2>
    <p class="quiz-paragraph">PAGAMENTO VIA PIX</p>
    <div class="pix-box">
      <span class="pix-value-label">VALOR</span>
      <strong class="pix-total">${escapeHTML(formatBRL(plan.price))}</strong>
      <span class="pix-key-label">CHAVE PIX</span>
      <code class="pix-key" id="pix-key-display">${escapeHTML(CONFIG.pixKey)}</code>
      <button type="button" class="btn btn-secondary btn-block" data-role="copy-pix">📋 COPIAR CHAVE PIX</button>
      <p class="pix-copied-feedback" id="pix-copied-feedback" hidden>✅ CHAVE PIX COPIADA!</p>
    </div>
    <details class="payment-howto">
      <summary>COMO PAGAR?</summary>
      <ol>
        <li>Copie a chave PIX</li>
        <li>Abra o aplicativo do seu banco</li>
        <li>Faça o pagamento</li>
        <li>Volte para esta página</li>
        <li>Finalize pelo WhatsApp</li>
      </ol>
    </details>
    <label class="quiz-checkbox quiz-checkbox--confirm">
      <input type="checkbox" data-field="paymentConfirmed" ${currentState.paymentConfirmed ? "checked" : ""}>
      Já realizei o pagamento de ${escapeHTML(formatBRL(plan.price))} e sei que preciso enviar o comprovante pelo WhatsApp.
    </label>
    <div class="payment-warning">
      <p class="payment-warning-title">🚨 IMPORTANTE</p>
      <p>Depois que o WhatsApp abrir, seu pedido já estará escrito automaticamente. Você só precisa enviar em seguida:</p>
      <ul class="quiz-tips-list">
        <li>💳 Comprovante do PIX</li>
        ${needsPhoto(currentState) ? "<li>📸 Sua foto</li>" : ""}
        ${needsLogo(currentState) ? "<li>🏢 Sua logo</li>" : ""}
      </ul>
      <p>Depois disso começaremos sua produção.</p>
    </div>
    <button type="button" class="btn btn-whatsapp btn-block" id="whatsapp-submit-btn" data-role="submit-order" ${
      currentState.paymentConfirmed ? "" : "disabled"
    }>
      ✅ JÁ PAGUEI — ENVIAR MEU PEDIDO
    </button>
  `;
}

function renderStepHTML(key, currentState) {
  if (key.startsWith("sticker_")) return renderStickerStep(Number(key.split("_")[1]), currentState);
  switch (key) {
    case "orderType":
      return renderOrderType(currentState);
    case "personalTheme":
      return renderPersonalTheme(currentState);
    case "personalDetails":
      return renderPersonalDetails(currentState);
    case "personalPhoto":
      return renderPersonalPhoto();
    case "companyName":
      return renderCompanyName(currentState);
    case "segment":
      return renderSegment(currentState);
    case "useLogo":
      return renderUseLogo(currentState);
    case "character":
      return renderCharacter(currentState);
    case "style":
      return renderStyle(currentState);
    case "colors":
      return renderColors(currentState);
    case "package":
      return renderPackage(currentState);
    case "phraseMode":
      return renderPhraseMode();
    case "phraseTypesAi":
      return renderPhraseTypesAi(currentState);
    case "customerName":
      return renderCustomerName(currentState);
    case "summary":
      return renderSummary(currentState);
    case "payment":
      return renderPayment(currentState);
    default:
      return "";
  }
}

function nextLabelFor(key) {
  if (key === "personalPhoto") return "ENTENDI, CONTINUAR";
  if (key === "summary") return "IR PARA O PAGAMENTO →";
  if (key.startsWith("sticker_")) {
    const idx = Number(key.split("_")[1]);
    return idx < state.stickers.length - 1 ? "PRÓXIMA FIGURINHA →" : "CONTINUAR →";
  }
  return "CONTINUAR →";
}

// ------------------------------------------------------------
// Mensagem do WhatsApp
// ------------------------------------------------------------
function buildPhrasesBlock(currentState) {
  const lines = ["📝 FRASES:", ""];
  if (currentState.phraseMode === "ai") {
    const types = currentState.phraseTypes.map((id) => cleanLabelOf(PHRASE_TYPE_OPTIONS, id)).join(", ");
    lines.push("✨ Vocês podem criar as frases de acordo com meu estilo.");
    lines.push(`Tipos preferidos: ${types || "Como acharem melhor"}`);
    if (currentState.phraseNotes.trim()) {
      lines.push(`Observações: ${currentState.phraseNotes.trim()}`);
    }
    lines.push("");
    return lines;
  }
  currentState.stickers.forEach((sticker, i) => {
    lines.push(`FIGURINHA ${i + 1}`);
    if (sticker.delegated) {
      lines.push("Pode criar ✨");
    } else {
      lines.push(`Frase: ${sticker.phrase.trim()}`);
      lines.push(`Expressão: ${cleanLabelOf(EXPRESSION_OPTIONS, sticker.expression)}`);
      if (sticker.detail.trim()) lines.push(`Detalhe: ${sticker.detail.trim()}`);
    }
    lines.push("");
  });
  return lines;
}

function appendUtmFooter(lines, utms) {
  if (utms && (utms.utm_source || utms.utm_campaign)) {
    const source = utms.utm_source || "";
    const campaign = utms.utm_campaign || "";
    lines.push("---");
    lines.push("Origem do pedido:");
    lines.push(`${source}${source && campaign ? " / " : ""}${campaign}`.trim());
  }
}

function buildPersonalMessage(currentState, utms) {
  const plan = PLANS[currentState.package];
  const lines = [];
  lines.push("Olá! 😍", "");
  lines.push("Acabei de montar meu pedido de figurinhas personalizadas.", "");
  lines.push("👤 NOME:", currentState.customerName.trim(), "");
  lines.push("🙋 TIPO:", "Uso pessoal", "");
  lines.push("📦 PACOTE:", `${plan.quantity} figurinhas`, "");
  lines.push("💰 VALOR:", formatBRL(plan.price), "");
  lines.push("🎨 TEMA:", getPersonalThemeLabel(currentState), "");
  lines.push("📝 DETALHES:", currentState.personalDetails.trim());
  if (currentState.personalColorDetail.trim()) {
    lines.push("", "🎨 COR / ROUPA / DETALHE:", currentState.personalColorDetail.trim());
  }
  lines.push("");
  lines.push(...buildPhrasesBlock(currentState));
  lines.push("✅ Já finalizei meu pedido.", "");
  lines.push("Agora vou enviar aqui:", "📸 Minha foto", "💳 Meu comprovante PIX");
  appendUtmFooter(lines, utms);
  return lines.join("\n");
}

function buildBusinessMessage(currentState, utms) {
  const plan = PLANS[currentState.package];
  const lines = [];
  lines.push("Olá! 😍", "");
  lines.push("Acabei de montar meu pedido de figurinhas para minha empresa.", "");
  lines.push("👤 RESPONSÁVEL:", currentState.customerName.trim(), "");
  lines.push("🏢 EMPRESA:", currentState.companyName.trim(), "");
  lines.push("💼 SEGMENTO:", getSegmentLabel(currentState), "");
  lines.push("📦 PACOTE:", `${plan.quantity} figurinhas`, "");
  lines.push("💰 VALOR:", formatBRL(plan.price), "");
  lines.push("🏢 USAR LOGO:", currentState.useLogo === "sim" ? "Sim" : "Não", "");
  lines.push("🙋 PERSONAGEM:", cleanLabelOf(CHARACTER_OPTIONS, currentState.character), "");
  lines.push("🎨 ESTILO:", cleanLabelOf(STYLE_OPTIONS, currentState.style), "");
  const colorsText = currentState.followLogoColors
    ? currentState.colors.trim()
      ? `${currentState.colors.trim()} (seguindo cores da logo)`
      : "Seguir cores da logo"
    : currentState.colors.trim() || "Não informado";
  lines.push("🎨 CORES:", colorsText, "");
  lines.push(...buildPhrasesBlock(currentState));
  lines.push("✅ Já finalizei meu pedido.", "");
  lines.push("Agora vou enviar aqui:", "💳 Meu comprovante PIX");
  if (needsLogo(currentState)) lines.push("🏢 Minha logo");
  if (needsPhoto(currentState)) lines.push("📸 Minha foto");
  appendUtmFooter(lines, utms);
  return lines.join("\n");
}

function buildWhatsAppMessage(currentState, utms) {
  return currentState.orderType === "business" ? buildBusinessMessage(currentState, utms) : buildPersonalMessage(currentState, utms);
}

// ------------------------------------------------------------
// PIX
// ------------------------------------------------------------
function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
  } catch (err) {
    /* no-op */
  }
  document.body.removeChild(ta);
}

async function copyPixKey() {
  try {
    await navigator.clipboard.writeText(CONFIG.pixKey);
  } catch (err) {
    fallbackCopy(CONFIG.pixKey);
  }
  const feedback = document.getElementById("pix-copied-feedback");
  if (feedback) {
    feedback.hidden = false;
    window.setTimeout(() => {
      feedback.hidden = true;
    }, 2500);
  }
  const plan = PLANS[state.package];
  trackEvent("copy_pix", { value: plan.price, currency: "BRL", package_quantity: plan.quantity });
}

function submitOrder() {
  if (!state.paymentConfirmed) return;
  const plan = PLANS[state.package];
  trackEvent("whatsapp_click", { value: plan.price, currency: "BRL", package_quantity: plan.quantity, order_type: state.orderType });
  trackEvent("purchase_intent", { value: plan.price, currency: "BRL", package_quantity: plan.quantity, order_type: state.orderType });

  const utms = getStoredUTMs();
  const message = buildWhatsAppMessage(state, utms);
  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

  clearState();
  window.open(url, "_blank", "noopener");
}

// ------------------------------------------------------------
// Navegação / ciclo de vida do quiz
// ------------------------------------------------------------
function showError(message) {
  dom.errorBox.textContent = message;
  dom.errorBox.hidden = false;
}
function hideError() {
  dom.errorBox.hidden = true;
}

function renderCurrentStep() {
  const steps = getSteps(state);
  if (!steps.includes(state.stepKey)) state.stepKey = steps[0];
  const idx = steps.indexOf(state.stepKey);

  dom.stepLabel.textContent = `Etapa ${idx + 1} de ${steps.length}`;
  dom.progressFill.style.width = `${Math.round(((idx + 1) / steps.length) * 100)}%`;
  dom.body.innerHTML = renderStepHTML(state.stepKey, state);
  dom.body.scrollTop = 0;
  dom.backBtn.hidden = idx === 0;
  dom.nextBtn.hidden = state.stepKey === "payment";
  dom.nextBtn.textContent = nextLabelFor(state.stepKey);
  hideError();

  trackEvent("quiz_step", { step_key: state.stepKey, step_number: idx + 1 });

  const firstField = dom.body.querySelector("input, textarea");
  if (firstField && window.matchMedia("(min-width: 768px)").matches) {
    firstField.focus({ preventScroll: true });
  }
}

function openQuiz() {
  if (!state.stepKey) state.stepKey = "orderType";
  dom.overlay.hidden = false;
  document.body.classList.add("quiz-open");
  requestAnimationFrame(() => dom.overlay.classList.add("is-open"));
  if (!state._startFired) {
    state._startFired = true;
    trackEvent("quiz_start");
  }
  renderCurrentStep();
}

function closeQuiz() {
  dom.overlay.classList.remove("is-open");
  document.body.classList.remove("quiz-open");
  window.setTimeout(() => {
    dom.overlay.hidden = true;
  }, 250);
  saveState();
}

function goNext() {
  const { valid, message } = validateStep(state.stepKey, state);
  if (!valid) {
    showError(message);
    return;
  }

  const steps = getSteps(state);
  const idx = steps.indexOf(state.stepKey);
  if (idx >= steps.length - 1) return;
  const nextKey = steps[idx + 1];
  state.stepKey = nextKey;

  if (nextKey === "summary" && !state._quizCompleteFired) {
    state._quizCompleteFired = true;
    const plan = PLANS[state.package];
    trackEvent("quiz_complete", {
      order_type: state.orderType,
      package_quantity: plan.quantity,
      package_value: plan.price,
      phrase_mode: state.phraseMode,
      segment: state.orderType === "business" ? state.segment : undefined,
    });
  }

  if (nextKey === "payment" && !state._viewCheckoutFired) {
    state._viewCheckoutFired = true;
    const plan = PLANS[state.package];
    trackEvent("view_checkout", { value: plan.price, currency: "BRL", package_quantity: plan.quantity });
  }

  saveState();
  renderCurrentStep();
}

function goBack() {
  const steps = getSteps(state);
  const idx = steps.indexOf(state.stepKey);
  if (idx > 0) {
    state.stepKey = steps[idx - 1];
    saveState();
    renderCurrentStep();
  } else {
    closeQuiz();
  }
}

// ------------------------------------------------------------
// Delegação de eventos dentro do corpo do quiz
// ------------------------------------------------------------
function handleBodyClick(e) {
  const copyBtn = e.target.closest('[data-role="copy-pix"]');
  if (copyBtn) {
    copyPixKey();
    return;
  }

  const submitBtn = e.target.closest('[data-role="submit-order"]');
  if (submitBtn && !submitBtn.disabled) {
    submitOrder();
    return;
  }

  const delegateBtn = e.target.closest('[data-role="delegate-sticker"]');
  if (delegateBtn) {
    const idx = Number(delegateBtn.dataset.stickerIndex);
    state.stickers[idx] = { phrase: "", expression: "", detail: "", delegated: true };
    saveState();
    hideError();
    renderCurrentStep();
    return;
  }

  const undelegateBtn = e.target.closest('[data-role="undelegate-sticker"]');
  if (undelegateBtn) {
    const idx = Number(undelegateBtn.dataset.stickerIndex);
    state.stickers[idx].delegated = false;
    saveState();
    renderCurrentStep();
    return;
  }

  const editBtn = e.target.closest("[data-edit-step]");
  if (editBtn) {
    const key = editBtn.dataset.editStep;
    const steps = getSteps(state);
    if (steps.includes(key)) {
      state.stepKey = key;
      renderCurrentStep();
    }
    return;
  }

  const card = e.target.closest('[data-role="choice"]');
  if (card) {
    const field = card.dataset.field;
    const value = card.dataset.value;
    const multi = card.dataset.multi === "true";
    const stickerIndex = card.dataset.stickerIndex;

    if (stickerIndex !== undefined) {
      const idx = Number(stickerIndex);
      state.stickers[idx][field] = value;
      state.stickers[idx].delegated = false;
    } else if (multi) {
      const current = new Set(state[field] || []);
      if (current.has(value)) current.delete(value);
      else current.add(value);
      state[field] = [...current];
    } else if (field === "package") {
      state.package = Number(value);
      handleFieldSideEffects(field, value);
    } else {
      state[field] = value;
      handleFieldSideEffects(field, value);
    }

    saveState();
    hideError();
    renderCurrentStep();
  }
}

function handleBodyInput(e) {
  const el = e.target;
  if (!el.dataset || !el.dataset.field || el.type === "checkbox") return;
  const field = el.dataset.field;
  const stickerIndex = el.dataset.stickerIndex;
  if (stickerIndex !== undefined) {
    state.stickers[Number(stickerIndex)][field] = el.value;
  } else {
    state[field] = el.value;
  }
  hideError();
  saveState();
}

function handleBodyChange(e) {
  const el = e.target;
  if (el.type !== "checkbox" || !el.dataset.field) return;
  state[el.dataset.field] = el.checked;
  saveState();
  renderCurrentStep();
}

function handleBodyKeydown(e) {
  if (e.key === "Enter" && e.target.tagName === "INPUT") {
    e.preventDefault();
    goNext();
  }
}

function handleOpenTriggers(e) {
  const trigger = e.target.closest("[data-open-quiz]");
  if (!trigger) return;
  e.preventDefault();

  if (dom.resumeBanner && !dom.resumeBanner.hidden) {
    dom.resumeBanner.hidden = true;
  }

  const presetType = trigger.dataset.orderType;
  const presetPackage = trigger.dataset.package;

  if (presetType) {
    state.orderType = presetType;
    handleFieldSideEffects("orderType", presetType);
  }
  if (presetPackage) {
    state.package = Number(presetPackage);
    handleFieldSideEffects("package", presetPackage);
  }

  saveState();
  openQuiz();
}

function onResumeContinue() {
  state = pendingResumeState;
  dom.resumeBanner.hidden = true;
  openQuiz();
}

function onResumeRestart() {
  clearState();
  state = createEmptyState();
  dom.resumeBanner.hidden = true;
}

// ------------------------------------------------------------
// Inicialização pública
// ------------------------------------------------------------
export function initQuiz() {
  dom = {
    overlay: document.getElementById("quiz-overlay"),
    body: document.getElementById("quiz-body"),
    stepLabel: document.getElementById("quiz-step-label"),
    progressFill: document.getElementById("quiz-progress-fill"),
    errorBox: document.getElementById("quiz-error"),
    backBtn: document.getElementById("quiz-back"),
    nextBtn: document.getElementById("quiz-next"),
    closeBtn: document.getElementById("quiz-close"),
    resumeBanner: document.getElementById("resume-banner"),
    resumeContinue: document.getElementById("resume-continue"),
    resumeRestart: document.getElementById("resume-restart"),
  };

  if (!dom.overlay) return;

  dom.nextBtn.addEventListener("click", goNext);
  dom.backBtn.addEventListener("click", goBack);
  dom.closeBtn.addEventListener("click", closeQuiz);
  dom.body.addEventListener("click", handleBodyClick);
  dom.body.addEventListener("input", handleBodyInput);
  dom.body.addEventListener("change", handleBodyChange);
  dom.body.addEventListener("keydown", handleBodyKeydown);
  dom.overlay.addEventListener("click", (e) => {
    if (e.target === dom.overlay) closeQuiz();
  });

  document.addEventListener("click", handleOpenTriggers);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && dom.overlay && !dom.overlay.hidden) closeQuiz();
  });

  const saved = loadState();
  if (hasMeaningfulProgress(saved)) {
    pendingResumeState = saved;
    dom.resumeBanner.hidden = false;
    dom.resumeContinue.addEventListener("click", onResumeContinue);
    dom.resumeRestart.addEventListener("click", onResumeRestart);
  } else {
    clearState();
  }
}
