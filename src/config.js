// ============================================================
// CONFIGURAÇÃO CENTRAL — altere aqui e o site inteiro atualiza
// ============================================================
// Veja o README.md para instruções detalhadas de cada campo.

export const CONFIG = {
  // Número do WhatsApp no formato internacional, SOMENTE dígitos.
  // Exemplo real: "5541999998888" (55 + DDD + número)
  whatsappNumber: "5541998362692",

  // Chave PIX que será exibida e copiada pelo cliente.
  pixKey: "36205410000116",

  // Domínio final do site (usado em SEO, canonical, sitemap e schema.org)
  domain: "https://SEUDOMINIO.com",

  // Nome da marca, usado em textos, título e dados estruturados
  brandName: "Figurinhas Personalizadas",
};

// Pacotes disponíveis. As chaves (3, 8, 15) são a quantidade de figurinhas.
export const PLANS = {
  3: { quantity: 3, price: 4.9, label: "3 figurinhas", highlight: false },
  8: { quantity: 8, price: 9.9, label: "8 figurinhas", highlight: false },
  15: { quantity: 15, price: 14.9, label: "15 figurinhas", highlight: true },
};

export function formatBRL(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
