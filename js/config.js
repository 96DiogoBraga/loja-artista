/* =====================================================================
   CONFIGURAÇÃO DA LOJA
   Troque os dados abaixo pelos da artista. Tudo que aparece no site
   (nome, WhatsApp, descontos, parcelas, textos do rodapé) vem daqui.
   ===================================================================== */
window.LOJA = {
  nome: 'Ruth',                 // nome do ateliê (aparece no título das páginas e no rodapé)
  logoParte1: 'Ruth',                   // o logo é escrito em duas partes com o "&" colorido entre elas
  logoParte2: '',
  slogan: 'Quadros e esculturas feitos à mão, uma peça de cada vez.',

  whatsapp: '5538992604420',           // DDI + DDD + número, só números (55 = Brasil)
  whatsappExibir: '(38) 99260-4420',
  email: 'contato@exemplo.com.br',
  instagram: 'https://instagram.com/ruthddc',
  instagramUsuario: '@ruthddc',
  cidade: 'Montes Claros, MG',
  horario: 'Segunda a sexta, das 9h às 17h',
  retiradaNoAtelie: true,              // mostra "retirada no ateliê" em Meios de envio

  descontoPix: 5,                      // % de desconto para pagamento via Pix (0 para desligar)
  parcelas: { max: 6, minimo: 150 },   // até 6x sem juros, parcela mínima de R$ 150

  chave: 'corebarro'                   // prefixo usado para guardar o carrinho no navegador
};
