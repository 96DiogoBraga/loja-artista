/* =====================================================================
   CATÁLOGO DE OBRAS
   Para cadastrar uma obra nova: copie um bloco { ... } abaixo, cole
   no fim da lista (antes do ]) e troque os dados.

   Campos:
   id          nome curto, sem espaço nem acento (vai na URL da obra)
   nome        título da obra
   categoria   'quadros' ou 'esculturas'
   colecao     id de uma coleção (veja a lista COLECOES mais abaixo)
   preco       valor em reais (use ponto para centavos: 1450.5)
   estoque     quantas unidades existem. Peça única = 1. Vendida = 0
   edicao      (opcional) tamanho da edição, se for uma tiragem limitada
   data        data de cadastro, AAAA-MM-DD (define "mais recentes")
   imagens     nomes dos arquivos da pasta assets/obras (a 1ª é a capa)
   tecnica     técnica e material
   dimensoes   medidas (largura × altura × profundidade)
   peso        peso aproximado
   ano         ano de criação
   resumo      frase curta que aparece nos cards
   descricao   lista de parágrafos da página da obra
   linkPagamento (opcional) link de pagamento do Mercado Pago, PagBank,
               InfinitePay etc. Se preenchido, aparece o botão "Pagar com cartão"
   hero        (opcional) 1, 2 ou 3: coloca a obra na vitrine da página inicial
   parede/chao cores da vitrine (só para obras com "hero")
   temaHero    'claro' (texto escuro) ou 'escuro' (texto branco) na vitrine
   ===================================================================== */

window.COLECOES = [
  { id: 'casa-e-jardim', nome: 'Casa e jardim', descricao: 'Varandas, folhas, vasos: obras que trazem o quintal para dentro de casa.' },
  { id: 'beira-dagua',   nome: 'Beira d’água',  descricao: 'Mar, pedra e equilíbrio. Azuis e cinzas para paredes e estantes calmas.' },
  { id: 'sol-e-barro',   nome: 'Sol e barro',   descricao: 'Cores quentes, argila e metal polido.' }
];

window.PRODUTOS = [
  {
    id: 'tarde-na-varanda',
    nome: 'Tarde na Varanda',
    categoria: 'quadros',
    colecao: 'casa-e-jardim',
    preco: 1800,
    estoque: 1,
    data: '2026-09-28',
    imagens: ['tarde-na-varanda-1.svg', 'tarde-na-varanda-2.svg', 'tarde-na-varanda-3.svg'],
    tecnica: 'Acrílica sobre tela',
    dimensoes: '60 × 80 × 3 cm',
    peso: '1,2 kg',
    ano: '2026',
    resumo: 'Um arco de janela enquadra o sol baixando sobre o mar.',
    descricao: [
      'Uma varanda no fim do dia: o arco da janela enquadra o sol baixando sobre o mar, e as plantas seguram a cena nos dois cantos.',
      'Pintada em camadas de tinta acrílica. As listras do fundo são feitas à mão livre, por isso nenhuma é igual à outra.',
      'Tela com chassi de madeira, pronta para pendurar. Assinada no verso e acompanhada de certificado de autenticidade.'
    ],
    hero: 1, parede: '#c44f39', chao: '#9d3f2e', temaHero: 'escuro'
  },
  {
    id: 'moringa-dancante',
    nome: 'Moringa Dançante',
    categoria: 'esculturas',
    colecao: 'casa-e-jardim',
    preco: 960,
    estoque: 1,
    data: '2026-09-22',
    imagens: ['moringa-dancante-1.svg', 'moringa-dancante-2.svg', 'moringa-dancante-3.svg'],
    tecnica: 'Cerâmica de alta temperatura (grés), esmalte azul e turquesa',
    dimensoes: '22 × 32 × 22 cm',
    peso: '1,9 kg',
    ano: '2026',
    resumo: 'Moringa torneada e esmaltada à mão, com alças de orelha.',
    descricao: [
      'Uma moringa que não está nem aí para a simetria: o esmalte azul escorre pelos ombros e cada pingo caiu onde quis.',
      'Torneada e esmaltada à mão. Pode ficar sobre aparador, estante ou mesa. Decorativa: não é indicada para alimentos.',
      'Acompanha certificado de autenticidade e embalagem própria para transporte.'
    ],
    hero: 2, parede: '#e9a23b', chao: '#ba822f', temaHero: 'claro'
  },
  {
    id: 'mar-de-dentro',
    nome: 'Mar de Dentro',
    categoria: 'quadros',
    colecao: 'beira-dagua',
    preco: 1450,
    estoque: 1,
    data: '2026-09-15',
    imagens: ['mar-de-dentro-1.svg', 'mar-de-dentro-2.svg', 'mar-de-dentro-3.svg'],
    tecnica: 'Acrílica sobre tela',
    dimensoes: '70 × 50 × 3 cm',
    peso: '1,1 kg',
    ano: '2026',
    resumo: 'Seis camadas de mar, do azul-claro ao quase preto.',
    descricao: [
      'Seis camadas de mar, do azul mais claro ao quase preto, e um sol que ainda não decidiu se vai embora.',
      'A espuma é desenhada à mão, uma onda por vez. Fica bonito na horizontal sobre sofás, cabeceiras e aparadores.',
      'Tela com chassi de madeira, pronta para pendurar. Assinada no verso e acompanhada de certificado de autenticidade.'
    ]
  },
  {
    id: 'ave-de-prumo',
    nome: 'Ave de Prumo',
    categoria: 'esculturas',
    colecao: 'sol-e-barro',
    preco: 2900,
    estoque: 1,
    data: '2026-09-10',
    imagens: ['ave-de-prumo-1.svg', 'ave-de-prumo-2.svg', 'ave-de-prumo-3.svg'],
    tecnica: 'Latão polido sobre base de pedra preta',
    dimensoes: '34 × 30 × 12 cm',
    peso: '3,4 kg',
    ano: '2025',
    resumo: 'Uma ave de pernas finas, desenhada com poucos planos.',
    descricao: [
      'Uma ave de pernas finas, feita com poucos planos de metal: o corpo, o bico, três penas de cauda. O resto é a luz da sala.',
      'O latão é polido à mão e muda de tom conforme a hora do dia. Para manter o brilho, basta um pano seco e macio.',
      'Acompanha certificado de autenticidade e embalagem própria para transporte.'
    ],
    hero: 3, parede: '#1e2a4a', chao: '#18223b', temaHero: 'escuro'
  },
  {
    id: 'horta-grande',
    nome: 'Horta Grande',
    categoria: 'quadros',
    colecao: 'casa-e-jardim',
    preco: 2200,
    estoque: 1,
    data: '2026-08-30',
    imagens: ['horta-grande-1.svg', 'horta-grande-2.svg', 'horta-grande-3.svg'],
    tecnica: 'Acrílica sobre tela',
    dimensoes: '70 × 70 × 3 cm',
    peso: '1,6 kg',
    ano: '2026',
    resumo: 'Folhas grandes demais para o quintal, tomates maduros demais para esperar.',
    descricao: [
      'Folhas grandes demais para o quintal e tomates maduros demais para esperar. O fundo rosa esquenta qualquer parede branca.',
      'Tela quadrada com chassi de madeira, pronta para pendurar. Assinada no verso e acompanhada de certificado de autenticidade.'
    ]
  },
  {
    id: 'tres-pedras',
    nome: 'Três Pedras',
    categoria: 'esculturas',
    colecao: 'beira-dagua',
    preco: 1350,
    estoque: 3,
    edicao: 3,
    data: '2026-08-18',
    imagens: ['tres-pedras-1.svg', 'tres-pedras-2.svg', 'tres-pedras-3.svg'],
    tecnica: 'Cerâmica modelada à mão, esmalte fosco',
    dimensoes: '20 × 28 × 20 cm',
    peso: '2,2 kg',
    ano: '2026',
    resumo: 'Três pedras em equilíbrio. Edição limitada a 3 exemplares.',
    descricao: [
      'Três pedras empilhadas em equilíbrio: cinza, areia e azul-ardósia.',
      'Edição limitada a 3 exemplares, numerados no fundo. Cada um é modelado à mão e, por isso, é um pouco diferente dos outros: a cor do esmalte e o desenho das veias mudam de um para o outro.',
      'Acompanha certificado de autenticidade com o número do exemplar.'
    ]
  },
  {
    id: 'corpo-de-barro',
    nome: 'Corpo de Barro',
    categoria: 'esculturas',
    colecao: 'sol-e-barro',
    preco: 1700,
    estoque: 1,
    data: '2026-08-05',
    imagens: ['corpo-de-barro-1.svg', 'corpo-de-barro-2.svg', 'corpo-de-barro-3.svg'],
    tecnica: 'Argila vermelha modelada à mão, brunida e queimada',
    dimensoes: '26 × 34 × 20 cm',
    peso: '2,6 kg',
    ano: '2025',
    resumo: 'Forma curva de argila brunida, com uma fenda e linhas riscadas.',
    descricao: [
      'Uma forma curva, de ombros largos e cintura fina, riscada à mão e cortada por uma fenda escura.',
      'A superfície é brunida com pedra até ganhar brilho próprio, sem esmalte. Base de madeira escura.',
      'Acompanha certificado de autenticidade e embalagem própria para transporte.'
    ]
  },
  {
    id: 'meio-dia',
    nome: 'Meio-dia',
    categoria: 'quadros',
    colecao: 'sol-e-barro',
    preco: 780,
    estoque: 0,
    data: '2026-07-20',
    imagens: ['meio-dia-1.svg', 'meio-dia-2.svg', 'meio-dia-3.svg'],
    tecnica: 'Acrílica sobre tela',
    dimensoes: '40 × 50 × 3 cm',
    peso: '0,8 kg',
    ano: '2025',
    resumo: 'O sol a pino, em anéis de cor, sobre um morro verde.',
    descricao: [
      'O sol a pino, em anéis de cor, sobre um morro verde. Esta obra já encontrou o seu lugar.',
      'Quer algo parecido? A artista aceita encomendas: fale pelo WhatsApp e conte o tamanho e as cores que você imagina.'
    ]
  }
];
