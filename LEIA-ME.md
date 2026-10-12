# Loja da artista (HTML + CSS + JavaScript)

Site de loja para vender quadros e esculturas, feito só com HTML, CSS e JavaScript, sem servidor e sem banco de dados.
Para ver: dê dois cliques em `index.html`. Para publicar: envie a pasta inteira para qualquer hospedagem de sites estáticos (Netlify, GitHub Pages, Vercel, Hostinger, Locaweb…).

## O que tem

| Página | O que faz |
|---|---|
| `index.html` | Início: vitrine com troca de obra, categorias, obras recentes, coleções |
| `loja.html` | Todas as obras, com filtros (categoria, coleção, preço, disponibilidade) e ordenação |
| `produto.html?p=…` | Página da obra: galeria com miniaturas e ampliação, preço, parcelas, Comprar, frete, ficha técnica |
| `carrinho.html` | Carrinho e envio do pedido pelo WhatsApp |
| `sobre.html` | "Saiba": como as obras são feitas, cuidados e perguntas frequentes |
| `contato.html` | Formulário que abre o WhatsApp ou o e-mail |

Também tem busca com sugestões, gaveta do carrinho, botão flutuante de WhatsApp e aviso de armazenamento.

## Como a compra funciona

Um site só com HTML/CSS/JS não consegue cobrar cartão nem calcular frete sozinho. Por isso:

1. O cliente monta o carrinho (ele fica salvo no navegador).
2. Clica em **Enviar pedido pelo WhatsApp**: abre uma conversa com a artista com a lista das obras, o total e o nome do cliente.
3. A artista confirma que a peça continua disponível, calcula o frete e combina o pagamento (Pix ou link de cartão).

Isso combina com obras únicas: ninguém "compra" uma peça que já foi vendida.
Para aceitar cartão direto na página da obra, crie um link de pagamento (Mercado Pago, PagBank, InfinitePay…) e cole no campo `linkPagamento` da obra: aparece o botão **Pagar com cartão agora**.
Quando uma peça for vendida, troque `estoque: 1` por `estoque: 0`. Ela continua na loja com a etiqueta **Vendido**.

## O que você precisa trocar

Tudo que é de exemplo está em dois arquivos:

- **`js/config.js`**: nome do ateliê, WhatsApp (só números, com 55 e DDD), e-mail, Instagram, cidade, horário, desconto no Pix e número de parcelas.
- **`js/produtos.js`**: as obras (nome, preço, técnica, medidas, textos, imagens). Para cadastrar uma obra nova, copie um bloco `{ ... }`, cole no fim da lista e troque os dados. Os campos estão explicados no topo do arquivo.

Também são exemplos, e devem ser trocados pelos textos reais:

- os textos de `sobre.html` (marcado com `EDITE`) e da seção "Feito devagar, no ateliê" em `index.html`;
- as medidas, pesos, técnicas e descrições das obras;
- a política de devolução em `sobre.html`: confira com a artista antes de publicar.

## Fotos das obras

As imagens da pasta `assets/obras/` são ilustrações de exemplo. Para usar fotos reais:

1. Salve cada foto como JPG ou WebP **quadrado (1000 × 1000 px)**, com no máximo 300 KB. Fotos de outro formato são cortadas ao centro.
2. Coloque os arquivos em `assets/obras/`.
3. Em `js/produtos.js`, troque os nomes na lista `imagens` da obra. A primeira é a capa; a segunda aparece quando se passa o mouse no cartão.

Sugestão de 3 fotos por obra: a peça inteira, um detalhe de perto e a peça em um ambiente, com a medida.
A vitrine da página inicial usa as cores `parede` e `chao` de cada obra com `hero`. Escolha a cor de fundo da foto e um tom mais escuro para o chão.

## Cores, logo e fontes

- Cores: bloco `:root` no início de `css/style.css`.
- Logo: texto escrito com a fonte Chewy (`logoParte1` e `logoParte2` em `config.js`). Para usar uma imagem, troque o conteúdo de `htmlLogo()` em `js/app.js`.
- Fontes: carregadas do Google Fonts (Syne, Figtree e Chewy). Para o site funcionar sem internet ou sem o Google, baixe as fontes e declare-as com `@font-face` em `css/style.css`.

## Estrutura

```
index.html  loja.html  produto.html  carrinho.html  sobre.html  contato.html
css/style.css
js/config.js    dados da loja
js/produtos.js  catálogo de obras
js/app.js       carrinho, menu, busca, filtros e páginas
assets/obras/   imagens das obras
assets/favicon.svg
```
