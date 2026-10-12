/* =====================================================================
   LOJA DA ARTISTA — lógica do site (sem bibliotecas, só JavaScript)

   Seções deste arquivo:
   1. Utilidades (formatação, armazenamento, ícones)
   2. Carrinho
   3. Layout compartilhado (cabeçalho, menu, busca, rodapé, gaveta do carrinho)
   4. Página inicial
   5. Loja (catálogo com filtros)
   6. Página da obra
   7. Página do carrinho (finalizar pelo WhatsApp)
   8. Página de contato
   ===================================================================== */
(function () {
  'use strict';

  const L = window.LOJA;
  const PRODUTOS = window.PRODUTOS;
  const COLECOES = window.COLECOES;

  /* ------------------------------------------------------------------
     1. UTILIDADES
     ------------------------------------------------------------------ */
  const $ = (sel, el) => (el || document).querySelector(sel);
  const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));
  const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const normalizar = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  // Armazenamento seguro: se o navegador bloquear o localStorage, o site continua funcionando
  const memoria = {};
  const guardar = {
    ler(k, padrao) {
      try {
        const v = localStorage.getItem(L.chave + ':' + k);
        return v == null ? (k in memoria ? memoria[k] : padrao) : JSON.parse(v);
      } catch (e) { return k in memoria ? memoria[k] : padrao; }
    },
    gravar(k, v) {
      memoria[k] = v;
      try { localStorage.setItem(L.chave + ':' + k, JSON.stringify(v)); } catch (e) { /* ignora */ }
    }
  };

  const ICONES = {
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    busca: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
    cesta: '<path d="M2.5 3.5h2.6l2.2 11a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.78L20 7.5H6"/><circle cx="9.5" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/>',
    fechar: '<path d="M6 6l12 12M18 6 6 18"/>',
    esq: '<path d="m14.5 5-7 7 7 7"/>',
    dir: '<path d="m9.5 5 7 7-7 7"/>',
    cima: '<path d="m5 14.5 7-7 7 7"/>',
    baixo: '<path d="m5 9.5 7 7 7-7"/>',
    seta: '<path d="m6 9.5 6 6 6-6"/>',
    caminhao: '<path d="M2.5 6.5h11v10h-11zM13.5 10h4l3 3v3.5h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    cartao: '<rect x="2.5" y="5" width="19" height="14" rx="1.5"/><path d="M2.5 10h19M6 15h4"/>',
    lupa: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8M10.5 8v5M8 10.5h5"/>',
    caixa: '<path d="m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9z"/><path d="m3.5 7.5 8.5 4.5 8.5-4.5M12 12v9"/>',
    pix: '<path d="m12 2.8 4.6 4.6a2 2 0 0 0 1.4.6h1.2M12 21.2l4.6-4.6a2 2 0 0 1 1.4-.6h1.2M12 2.8 7.4 7.4a2 2 0 0 1-1.4.6H4.8M12 21.2l-4.6-4.6a2 2 0 0 0-1.4-.6H4.8"/><path d="m8.5 12 3.5-3.5 3.5 3.5-3.5 3.5z"/>',
    selo: '<circle cx="12" cy="9.5" r="6"/><path d="m9.2 14.6-1.4 6 4.2-2.2 4.2 2.2-1.4-6M9.5 9.5l1.8 1.8 3.2-3.4"/>',
    zap: '<path d="M4 20.2 5.4 16A8.4 8.4 0 1 1 8.3 18.7z"/><path d="M9.2 8.6c.4 2.8 2.6 5.2 6 6.2l1.1-1.4-2-1-.9.7c-.9-.4-1.9-1.4-2.3-2.3l.7-.9-1-2z" fill="currentColor" stroke="none"/>',
    pincel: '<path d="M20 4 10.5 13.5M9.8 14.2c-2.4-.4-4.4 1-4.4 3.3 0 1.6-.9 2.6-2 3 3.3.8 6.8-.1 7.8-3 .5-1.4-.1-2.7-1.4-3.3z"/>'
  };
  const ico = (nome) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + ICONES[nome] + '</svg>';

  // Abre uma nova aba. Devolve false se o navegador bloquear (aí mostramos um link clicável).
  function abrirAba(url) {
    const w = window.open(url, '_blank');
    if (!w) return false;
    try { w.opener = null; } catch (e) { /* ignora */ }
    return true;
  }
  const zapUrl = (msg) => 'https://wa.me/' + L.whatsapp + '?text=' + encodeURIComponent(msg);
  const mascaraCep = (v) => { const d = v.replace(/\D/g, '').slice(0, 8); return d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d; };

  // dados derivados das obras
  const porId = (id) => PRODUTOS.find((p) => p.id === id);
  const urlObra = (p) => 'produto.html?p=' + encodeURIComponent(p.id);
  const imgObra = (p, i) => 'assets/obras/' + p.imagens[i || 0];
  const LEGENDAS = ['obra inteira', 'detalhe', 'em ambiente, com medidas'];
  const altImg = (p, i) => p.nome + ': ' + (LEGENDAS[i] || 'imagem ' + (i + 1));
  const tecnicaCurta = (p) => p.tecnica.split(',')[0];
  const nomeCategoria = (c) => (c === 'quadros' ? 'Quadros' : 'Esculturas');
  const colecaoDe = (p) => COLECOES.find((c) => c.id === p.colecao);
  const parcelasDe = (preco) => {
    const n = Math.max(1, Math.min(L.parcelas.max, Math.floor(preco / L.parcelas.minimo)));
    return { n: n, valor: preco / n };
  };
  const precoPix = (preco) => Math.round(preco * (100 - L.descontoPix)) / 100;
  const textoParcela = (preco) => { const p = parcelasDe(preco); return p.n > 1 ? 'ou ' + p.n + 'x de ' + brl(p.valor) + ' sem juros' : ''; };
  const etiquetaDe = (p) => (p.estoque === 0 ? ['Vendido', 'etiqueta etiqueta--vendido'] : p.edicao ? ['Edição limitada', 'etiqueta'] : ['Peça única', 'etiqueta']);
  const recentes = () => PRODUTOS.slice().sort((a, b) => b.data.localeCompare(a.data));

  function aviso(msg) {
    let caixa = $('.avisos');
    if (!caixa) { caixa = document.createElement('div'); caixa.className = 'avisos'; caixa.setAttribute('role', 'status'); caixa.setAttribute('aria-live', 'polite'); document.body.appendChild(caixa); }
    const el = document.createElement('div');
    el.className = 'aviso';
    el.textContent = msg;
    caixa.appendChild(el);
    setTimeout(() => el.remove(), 4200);
  }

  function htmlCard(p) {
    const vendido = p.estoque === 0;
    const et = etiquetaDe(p);
    return '<a class="card' + (vendido ? ' card--vendido' : '') + '" href="' + urlObra(p) + '">' +
      '<div class="card__img"><span class="' + et[1] + '">' + et[0] + '</span>' +
      '<img src="' + imgObra(p, 0) + '" alt="' + esc(altImg(p, 0)) + '" width="600" height="600" loading="lazy">' +
      (p.imagens[1] ? '<img src="' + imgObra(p, 1) + '" alt="" width="600" height="600" loading="lazy">' : '') + '</div>' +
      '<div class="card__corpo"><h3 class="card__nome">' + esc(p.nome) + '</h3>' +
      '<p class="card__tipo">' + esc(tecnicaCurta(p)) + '</p>' +
      '<span class="card__preco">' + brl(p.preco) + '</span>' +
      '<span class="card__parcela">' + (vendido ? 'Esta obra já foi vendida' : esc(textoParcela(p.preco))) + '</span></div></a>';
  }

  /* ------------------------------------------------------------------
     2. CARRINHO
     ------------------------------------------------------------------ */
  const Carrinho = {
    itens: [],
    carregar() {
      const salvo = guardar.ler('carrinho', []);
      this.itens = (Array.isArray(salvo) ? salvo : []).filter((i) => {
        const p = i && porId(i.id);
        if (!p || p.estoque < 1) return false;
        i.q = Math.max(1, Math.min(p.estoque, parseInt(i.q, 10) || 1));
        return true;
      });
    },
    salvar() {
      guardar.gravar('carrinho', this.itens);
      $$('[data-cesta-n]').forEach((el) => { el.textContent = this.contar(); });
      document.dispatchEvent(new CustomEvent('carrinho:mudou'));
    },
    qtd(id) { const i = this.itens.find((x) => x.id === id); return i ? i.q : 0; },
    contar() { return this.itens.reduce((s, i) => s + i.q, 0); },
    linhas() { return this.itens.map((i) => ({ p: porId(i.id), q: i.q })); },
    subtotal() { return this.linhas().reduce((s, l) => s + l.p.preco * l.q, 0); },
    adicionar(id, q) {
      const p = porId(id);
      if (!p || p.estoque < 1) return { ok: false, msg: 'Esta obra já foi vendida.' };
      const atual = this.qtd(id);
      if (atual >= p.estoque) return { ok: false, msg: p.estoque === 1 ? 'Esta peça única já está no seu carrinho.' : 'Você já tem todas as unidades disponíveis no carrinho.' };
      const nova = Math.min(p.estoque, atual + (q || 1));
      if (atual) this.itens.find((x) => x.id === id).q = nova; else this.itens.push({ id: id, q: nova });
      this.salvar();
      return { ok: true };
    },
    definir(id, q) {
      const p = porId(id);
      const i = this.itens.find((x) => x.id === id);
      if (!p || !i) return;
      if (q < 1) return this.remover(id);
      i.q = Math.min(p.estoque, q);
      this.salvar();
    },
    remover(id) { this.itens = this.itens.filter((x) => x.id !== id); this.salvar(); },
    limpar() { this.itens = []; this.salvar(); }
  };

  function htmlItem(l) {
    const p = l.p;
    const stepper = p.estoque > 1
      ? '<div class="qtd" role="group" aria-label="Quantidade de ' + esc(p.nome) + '">' +
        '<button type="button" data-menos="' + p.id + '" aria-label="Diminuir quantidade">−</button>' +
        '<output aria-live="polite">' + l.q + '</output>' +
        '<button type="button" data-mais="' + p.id + '" aria-label="Aumentar quantidade"' + (l.q >= p.estoque ? ' disabled' : '') + '>+</button></div>'
      : '<span class="item__info">Peça única</span>';
    return '<article class="item">' +
      '<a href="' + urlObra(p) + '"><img class="item__img" src="' + imgObra(p, 0) + '" alt="" width="84" height="84"></a>' +
      '<div><a class="item__nome" href="' + urlObra(p) + '">' + esc(p.nome) + '</a>' +
      '<div class="item__info">' + esc(tecnicaCurta(p)) + ', ' + esc(p.dimensoes) + '</div>' +
      '<div class="item__linha">' + stepper + '<span class="item__preco">' + brl(p.preco * l.q) + '</span></div>' +
      '<button type="button" class="item__tirar" data-remover="' + p.id + '">Remover</button></div></article>';
  }

  // cliques de "+", "−" e "Remover" (funcionam na gaveta e na página do carrinho)
  function ligarControlesDeItem(container) {
    container.addEventListener('click', (e) => {
      const mais = e.target.closest('[data-mais]');
      const menos = e.target.closest('[data-menos]');
      const rem = e.target.closest('[data-remover]');
      if (mais) Carrinho.definir(mais.dataset.mais, Carrinho.qtd(mais.dataset.mais) + 1);
      else if (menos) Carrinho.definir(menos.dataset.menos, Carrinho.qtd(menos.dataset.menos) - 1);
      else if (rem) Carrinho.remover(rem.dataset.remover);
    });
  }

  function htmlTotais() {
    const sub = Carrinho.subtotal();
    return '<div class="totais"><div class="total"><span>Subtotal</span><span>' + brl(sub) + '</span></div>' +
      (L.descontoPix ? '<div class="pix"><span>No Pix (' + L.descontoPix + '% off)</span><span>' + brl(precoPix(sub)) + '</span></div>' : '') +
      '</div>';
  }

  /* ------------------------------------------------------------------
     3. LAYOUT COMPARTILHADO
     ------------------------------------------------------------------ */
  function htmlMenu(pagina) {
    const atual = (p) => (pagina === p ? ' aria-current="page"' : '');
    return '<nav class="menu" id="menu-principal" aria-label="Principal">' +
      '<button type="button" class="icone-btn menu__fechar" aria-label="Fechar menu">' + ico('fechar') + '</button>' +
      '<ul class="menu__lista">' +
      '<li class="menu__item"><a class="menu__link" href="index.html"' + atual('inicio') + '>Início</a></li>' +
      '<li class="menu__item"><a class="menu__link" href="loja.html"' + atual('loja') + '>Categorias ' + ico('seta') + '</a><ul class="submenu">' +
      '<li><a href="loja.html">Todas as obras</a></li><li><a href="loja.html?cat=quadros">Quadros</a></li><li><a href="loja.html?cat=esculturas">Esculturas</a></li></ul></li>' +
      '<li class="menu__item"><a class="menu__link" href="index.html#colecoes">Coleções ' + ico('seta') + '</a><ul class="submenu">' +
      COLECOES.map((c) => '<li><a href="loja.html?colecao=' + c.id + '">' + esc(c.nome) + '</a></li>').join('') + '</ul></li>' +
      '<li class="menu__item"><a class="menu__link" href="contato.html"' + atual('contato') + '>Contato</a></li>' +
      '<li class="menu__item"><a class="menu__link" href="sobre.html"' + atual('sobre') + '>Saiba</a></li>' +
      '</ul></nav>';
  }

  function htmlLogo() {
    return esc(L.logoParte1) + (L.logoParte2 ? '<span>&amp;</span>' + esc(L.logoParte2) : '');
  }

  function montarTopo(pagina) {
    const topo = document.createElement('template');
    topo.innerHTML =
      '<a class="pular" href="#conteudo">Pular para o conteúdo</a>' +
      '<header class="topo"><div class="container topo__linha">' +
      '<button type="button" class="icone-btn topo__menu" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu-principal">' + ico('menu') + '</button>' +
      '<form class="busca" role="search" action="loja.html" method="get">' +
      '<label class="so-leitor" for="busca-q">Buscar obras</label>' +
      '<input id="busca-q" name="q" type="search" placeholder="Buscar" autocomplete="off" aria-controls="sugestoes" aria-expanded="false">' +
      '<button class="busca__ok" type="submit" aria-label="Buscar">' + ico('busca') + '</button>' +
      '<div class="sugestoes" id="sugestoes" hidden></div></form>' +
      '<a class="logo" href="index.html" aria-label="' + esc(L.nome) + ', página inicial">' + htmlLogo() + '</a>' +
      '<div class="topo__acoes"><button type="button" class="icone-btn" data-abrir-carrinho aria-label="Abrir carrinho">' + ico('cesta') + '<span class="cesta__n" data-cesta-n>0</span></button></div>' +
      '</div>' + htmlMenu(pagina) + '</header>' +
      '<div class="menu__fundo" data-fundo-menu hidden></div>';
    document.body.insertBefore(topo.content, document.body.firstChild);
  }

  function ligarMenu() {
    const btn = $('.topo__menu');
    const menu = $('#menu-principal');
    const fundo = $('[data-fundo-menu]');
    const mq = window.matchMedia('(max-width: 900px)');
    function abrir() {
      menu.classList.add('menu--aberto'); fundo.hidden = false; btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      const primeiro = $('.menu__link', menu); if (primeiro) primeiro.focus();
    }
    function fechar(devolverFoco) {
      menu.classList.remove('menu--aberto'); fundo.hidden = true; btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (devolverFoco) btn.focus();
    }
    btn.addEventListener('click', abrir);
    $('.menu__fechar', menu).addEventListener('click', () => fechar(true));
    fundo.addEventListener('click', () => fechar(true));
    menu.addEventListener('click', (e) => { if (e.target.closest('a') && mq.matches) fechar(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('menu--aberto')) fechar(true); });
    mq.addEventListener('change', () => fechar(false));
  }

  function ligarBusca() {
    const form = $('.busca');
    const campo = $('#busca-q');
    const caixa = $('#sugestoes');
    const q0 = new URLSearchParams(location.search).get('q');
    if (q0 && document.body.dataset.pagina === 'loja') campo.value = q0;

    function fechar() { caixa.hidden = true; campo.setAttribute('aria-expanded', 'false'); }
    function buscar(termo) {
      const tokens = normalizar(termo).split(/\s+/).filter(Boolean);
      return PRODUTOS.filter((p) => {
        const palheiro = normalizar([p.nome, p.tecnica, nomeCategoria(p.categoria), (colecaoDe(p) || {}).nome || '', p.resumo].join(' '));
        return tokens.every((t) => palheiro.indexOf(t) !== -1);
      });
    }
    campo.addEventListener('input', () => {
      const termo = campo.value.trim();
      if (termo.length < 2) return fechar();
      const achados = buscar(termo).slice(0, 5);
      caixa.innerHTML = achados.length
        ? achados.map((p) => '<a href="' + urlObra(p) + '"><img src="' + imgObra(p, 0) + '" alt="" width="52" height="52"><span><b>' + esc(p.nome) + '</b><small>' + esc(tecnicaCurta(p)) + ', ' + brl(p.preco) + '</small></span></a>').join('') +
          '<a class="sugestoes__todos" href="loja.html?q=' + encodeURIComponent(termo) + '">Ver todos os resultados</a>'
        : '<p class="sugestoes__vazio">Nenhuma obra encontrada para “' + esc(termo) + '”.</p>';
      caixa.hidden = false; campo.setAttribute('aria-expanded', 'true');
    });
    form.addEventListener('keydown', (e) => {
      const links = $$('a', caixa);
      if (e.key === 'Escape') { fechar(); campo.focus(); }
      else if (e.key === 'ArrowDown' && links.length && !caixa.hidden) {
        e.preventDefault();
        const i = links.indexOf(document.activeElement);
        links[Math.min(links.length - 1, i + 1)].focus();
      } else if (e.key === 'ArrowUp' && links.length && !caixa.hidden) {
        e.preventDefault();
        const i = links.indexOf(document.activeElement);
        (i <= 0 ? campo : links[i - 1]).focus();
      }
    });
    document.addEventListener('click', (e) => { if (!form.contains(e.target)) fechar(); });
    form.addEventListener('submit', (e) => { if (!campo.value.trim()) { e.preventDefault(); campo.focus(); } });
  }

  function montarGaveta() {
    const dlg = document.createElement('dialog');
    dlg.className = 'gaveta';
    dlg.setAttribute('aria-labelledby', 'gaveta-titulo');
    dlg.innerHTML =
      '<div class="gaveta__topo"><h2 id="gaveta-titulo">Seu carrinho</h2>' +
      '<button type="button" class="icone-btn" data-fechar aria-label="Fechar carrinho">' + ico('fechar') + '</button></div>' +
      '<div class="gaveta__lista" data-gaveta-lista></div><div class="gaveta__rodape" data-gaveta-rodape></div>';
    document.body.appendChild(dlg);

    function desenhar() {
      const lista = $('[data-gaveta-lista]', dlg);
      const rodape = $('[data-gaveta-rodape]', dlg);
      const linhas = Carrinho.linhas();
      if (!linhas.length) {
        lista.innerHTML = '<div class="vazio"><h3>Seu carrinho está vazio</h3><p>Escolha uma obra para começar.</p><a class="btn" href="loja.html">Ver as obras</a></div>';
        rodape.hidden = true;
        return;
      }
      rodape.hidden = false;
      lista.innerHTML = linhas.map(htmlItem).join('');
      rodape.innerHTML = htmlTotais() +
        '<a class="btn btn--cheio" href="carrinho.html">Finalizar pedido</a>' +
        '<button type="button" class="btn btn--vazado btn--cheio" data-fechar>Continuar vendo obras</button>';
    }
    ligarControlesDeItem(dlg);
    dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.closest('[data-fechar]')) dlg.close(); });
    document.addEventListener('carrinho:mudou', desenhar);
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-abrir-carrinho]')) { desenhar(); if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); }
    });
    window.abrirGaveta = () => { desenhar(); if (dlg.showModal) { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute('open', ''); };
  }

  function montarRodape() {
    const f = document.createElement('footer');
    f.className = 'rodape';
    f.innerHTML =
      '<div class="container rodape__grade">' +
      '<div><a class="logo" href="index.html" aria-label="' + esc(L.nome) + ', página inicial">' + htmlLogo() + '</a><p>' + esc(L.slogan) + '</p></div>' +
      '<div><h3>Navegue</h3><ul><li><a href="loja.html?cat=quadros">Quadros</a></li><li><a href="loja.html?cat=esculturas">Esculturas</a></li><li><a href="index.html#colecoes">Coleções</a></li><li><a href="sobre.html">Saiba mais sobre o ateliê</a></li></ul></div>' +
      '<div><h3>Atendimento</h3><ul><li><a href="' + zapUrl('Olá! Vim pelo site da ' + L.nome + '.') + '" target="_blank" rel="noopener">WhatsApp ' + esc(L.whatsappExibir) + '</a></li>' +
      '<li><a href="mailto:' + esc(L.email) + '">' + esc(L.email) + '</a></li><li><a href="' + esc(L.instagram) + '" target="_blank" rel="noopener">Instagram ' + esc(L.instagramUsuario) + '</a></li>' +
      '<li>' + esc(L.horario) + '</li></ul></div>' +
      '<div><h3>Formas de pagamento</h3><div class="pagamentos"><span>Pix</span><span>Cartão de crédito</span></div>' +
      '<p style="margin-top:12px">Parcelamento em até ' + L.parcelas.max + 'x sem juros.</p></div></div>' +
      '<div class="rodape__fim"><div class="container">© ' + new Date().getFullYear() + ' ' + esc(L.nome) + '. Todas as obras são criações originais e protegidas por direitos autorais.</div></div>';
    document.body.appendChild(f);
  }

  function montarFlutuantes() {
    const a = document.createElement('a');
    a.className = 'zap';
    a.href = zapUrl('Olá! Vim pelo site do ' + L.nome + ' e queria conversar sobre uma obra.');
    a.target = '_blank'; a.rel = 'noopener';
    a.setAttribute('aria-label', 'Conversar pelo WhatsApp');
    a.innerHTML = ico('zap');
    document.body.appendChild(a);

    if (!guardar.ler('cookies-ok', false)) {
      const c = document.createElement('div');
      c.className = 'cookies';
      c.setAttribute('role', 'region');
      c.setAttribute('aria-label', 'Aviso sobre armazenamento');
      c.innerHTML = '<p>Guardamos o seu carrinho neste navegador para você não perder as obras escolhidas.</p><button type="button">Entendi</button>';
      document.body.appendChild(c);
      document.body.classList.add('tem-cookies');
      $('button', c).addEventListener('click', () => { guardar.gravar('cookies-ok', true); c.remove(); document.body.classList.remove('tem-cookies'); });
    }
  }

  /* ------------------------------------------------------------------
     4. PÁGINA INICIAL
     ------------------------------------------------------------------ */
  function paginaInicio() {
    // vitrine: cada obra tem a sua parede
    const hero = $('#hero');
    const slides = PRODUTOS.filter((p) => p.hero).sort((a, b) => a.hero - b.hero);
    if (hero && slides.length) {
      let atual = 0;
      hero.innerHTML =
        '<div class="container hero__grade"><div class="hero__texto">' +
        '<div data-hero-texto aria-live="polite"></div>' +
        '<div class="hero__acoes"><a class="btn" data-hero-ver href="#">Ver obra</a><a class="btn btn--vazado" href="loja.html"><span>Ver todas as obras</span></a></div>' +
        '<div class="hero__ctrl"><button type="button" class="icone-btn" data-ant aria-label="Obra anterior">' + ico('esq') + '</button>' +
        '<div class="hero__pontos">' + slides.map((p, i) => '<button type="button" class="hero__ponto" data-i="' + i + '" aria-label="Ver ' + esc(p.nome) + '"></button>').join('') + '</div>' +
        '<button type="button" class="icone-btn" data-prox aria-label="Próxima obra">' + ico('dir') + '</button></div></div>' +
        '<div class="hero__imagens">' + slides.map((p) => '<a href="' + urlObra(p) + '" tabindex="-1" aria-hidden="true"><img src="' + imgObra(p, 0) + '" alt="' + esc(altImg(p, 0)) + '" width="560" height="560"></a>').join('') + '</div></div>';
      const texto = $('[data-hero-texto]', hero);
      const imgs = $$('.hero__imagens a', hero);
      const pontos = $$('.hero__ponto', hero);
      const mostrar = (i) => {
        atual = (i + slides.length) % slides.length;
        const p = slides[atual];
        hero.style.setProperty('--parede', p.parede);
        hero.style.setProperty('--chao', p.chao);
        hero.classList.toggle('hero--escuro', p.temaHero === 'escuro');
        texto.innerHTML = '<h2 class="hero__titulo">' + esc(p.nome) + '</h2><p class="hero__meta">' + esc(tecnicaCurta(p)) + ', ' + esc(p.dimensoes) + '</p>' +
          '<p class="hero__preco">' + brl(p.preco) + '<small>' + esc(textoParcela(p.preco)) + '</small></p>';
        $('[data-hero-ver]', hero).href = urlObra(p);
        imgs.forEach((a, k) => { const on = k === atual; a.classList.toggle('ativo', on); a.tabIndex = on ? 0 : -1; a.setAttribute('aria-hidden', on ? 'false' : 'true'); });
        pontos.forEach((b, k) => { if (k === atual) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
      };
      $('[data-ant]', hero).addEventListener('click', () => mostrar(atual - 1));
      $('[data-prox]', hero).addEventListener('click', () => mostrar(atual + 1));
      pontos.forEach((b) => b.addEventListener('click', () => mostrar(parseInt(b.dataset.i, 10))));
      let x0 = null;
      hero.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
      hero.addEventListener('touchend', (e) => {
        if (x0 == null) return;
        const dx = e.changedTouches[0].clientX - x0; x0 = null;
        if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
      });
      mostrar(0);
    }

    // categorias
    const tiles = $('#tiles');
    if (tiles) {
      tiles.innerHTML = ['quadros', 'esculturas'].map((c) => {
        const obras = recentes().filter((p) => p.categoria === c);
        const capa = obras[0];
        const n = obras.filter((p) => p.estoque > 0).length;
        return '<a class="tile" href="loja.html?cat=' + c + '"><div class="tile__img"><img src="' + imgObra(capa, 1) + '" alt="" width="800" height="640" loading="lazy"></div>' +
          '<div class="tile__nome"><h3>' + nomeCategoria(c) + '</h3><span>' + n + (n === 1 ? ' obra disponível' : ' obras disponíveis') + '</span></div></a>';
      }).join('');
    }

    // obras recentes
    const rec = $('#recentes');
    if (rec) rec.innerHTML = recentes().slice(0, 8).map(htmlCard).join('');

    // coleções
    const col = $('#lista-colecoes');
    if (col) {
      col.innerHTML = COLECOES.map((c) => {
        const obras = PRODUTOS.filter((p) => p.colecao === c.id).slice(0, 3);
        return '<a class="colecao" href="loja.html?colecao=' + c.id + '"><div class="colecao__mosaico" data-n="' + obras.length + '">' +
          obras.map((p) => '<img src="' + imgObra(p, 0) + '" alt="" width="400" height="400" loading="lazy">').join('') + '</div>' +
          '<h3>' + esc(c.nome) + '</h3><p>' + esc(c.descricao) + '</p></a>';
      }).join('');
    }

    // vantagens (usam os valores de config.js)
    const van = $('#vantagens');
    if (van) {
      van.innerHTML = [
        ['caixa', 'Embalagem para arte', 'Cada obra viaja protegida e com seguro.'],
        ['pix', L.descontoPix ? L.descontoPix + '% de desconto no Pix' : 'Pagamento por Pix', 'Combinado direto com a artista, sem taxas extras.'],
        ['cartao', 'Até ' + L.parcelas.max + 'x sem juros', 'No cartão de crédito, por link de pagamento seguro.'],
        ['selo', 'Certificado de autenticidade', 'Assinado pela artista e enviado junto com a obra.']
      ].map((v) => '<div class="vantagem">' + ico(v[0]) + '<div><b>' + esc(v[1]) + '</b><span>' + esc(v[2]) + '</span></div></div>').join('');
    }
  }

  /* ------------------------------------------------------------------
     5. LOJA (catálogo com filtros)
     ------------------------------------------------------------------ */
  function paginaLoja() {
    const params = new URLSearchParams(location.search);
    const estado = {
      cat: params.get('cat') || '',
      colecao: params.get('colecao') || '',
      q: (params.get('q') || '').trim(),
      preco: params.get('preco') || '',
      disp: params.get('disp') === '1',
      ordem: params.get('ordem') || 'recentes'
    };
    const form = $('#filtros');
    const grade = $('#grade');
    const total = $('#total');
    const titulo = $('#titulo');
    const sub = $('#subtitulo');
    const trilha = $('#trilha');
    const faixas = { ate1000: [0, 1000], '1000a2000': [1000, 2000], acima2000: [2000, Infinity] };

    // monta as opções dos filtros
    const radio = (nome, valor, rotulo, marcado, n) =>
      '<label class="opcao"><input type="radio" name="' + nome + '" value="' + valor + '"' + (marcado ? ' checked' : '') + '>' + esc(rotulo) + (n != null ? '<small>' + n + '</small>' : '') + '</label>';
    form.innerHTML =
      '<button type="button" class="btn btn--vazado filtros__fechar" data-fechar-filtros>Fechar filtros</button>' +
      '<fieldset><legend>Categoria</legend>' + radio('cat', '', 'Todas', !estado.cat, PRODUTOS.length) +
      ['quadros', 'esculturas'].map((c) => radio('cat', c, nomeCategoria(c), estado.cat === c, PRODUTOS.filter((p) => p.categoria === c).length)).join('') + '</fieldset>' +
      '<fieldset><legend>Coleção</legend>' + radio('colecao', '', 'Todas', !estado.colecao) +
      COLECOES.map((c) => radio('colecao', c.id, c.nome, estado.colecao === c.id, PRODUTOS.filter((p) => p.colecao === c.id).length)).join('') + '</fieldset>' +
      '<fieldset><legend>Preço</legend>' + radio('preco', '', 'Qualquer valor', !estado.preco) +
      radio('preco', 'ate1000', 'Até R$ 1.000', estado.preco === 'ate1000') + radio('preco', '1000a2000', 'De R$ 1.000 a R$ 2.000', estado.preco === '1000a2000') +
      radio('preco', 'acima2000', 'Acima de R$ 2.000', estado.preco === 'acima2000') + '</fieldset>' +
      '<fieldset><legend>Disponibilidade</legend><label class="opcao"><input type="checkbox" name="disp" value="1"' + (estado.disp ? ' checked' : '') + '>Mostrar só obras disponíveis</label></fieldset>' +
      '<button type="button" class="filtros__limpar" data-limpar>Limpar filtros</button>';

    $('#ordem').value = estado.ordem;

    function filtrar() {
      const tokens = normalizar(estado.q).split(/\s+/).filter(Boolean);
      let lista = PRODUTOS.filter((p) => {
        if (estado.cat && p.categoria !== estado.cat) return false;
        if (estado.colecao && p.colecao !== estado.colecao) return false;
        if (estado.disp && p.estoque < 1) return false;
        if (estado.preco) { const f = faixas[estado.preco]; if (!f || p.preco < f[0] || p.preco >= f[1]) return false; }
        if (tokens.length) {
          const palheiro = normalizar([p.nome, p.tecnica, nomeCategoria(p.categoria), (colecaoDe(p) || {}).nome || '', p.resumo, p.descricao.join(' ')].join(' '));
          if (!tokens.every((t) => palheiro.indexOf(t) !== -1)) return false;
        }
        return true;
      });
      const ord = {
        recentes: (a, b) => b.data.localeCompare(a.data),
        menor: (a, b) => a.preco - b.preco,
        maior: (a, b) => b.preco - a.preco,
        az: (a, b) => a.nome.localeCompare(b.nome, 'pt-BR')
      }[estado.ordem] || null;
      if (ord) lista.sort(ord);
      // obras vendidas vão para o fim da lista
      lista = lista.filter((p) => p.estoque > 0).concat(lista.filter((p) => p.estoque < 1));
      return lista;
    }

    function atualizarUrl() {
      const p = new URLSearchParams();
      if (estado.cat) p.set('cat', estado.cat);
      if (estado.colecao) p.set('colecao', estado.colecao);
      if (estado.q) p.set('q', estado.q);
      if (estado.preco) p.set('preco', estado.preco);
      if (estado.disp) p.set('disp', '1');
      if (estado.ordem !== 'recentes') p.set('ordem', estado.ordem);
      try { history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p.toString() : '')); } catch (e) { /* ignora */ }
    }

    function desenhar() {
      const lista = filtrar();
      const col = COLECOES.find((c) => c.id === estado.colecao);
      let h1 = 'Todas as obras';
      let texto = 'Quadros e esculturas originais, feitos à mão. Cada peça é única ou de tiragem limitada.';
      let crumb = 'Obras';
      if (estado.q) { h1 = 'Resultados para “' + estado.q + '”'; texto = ''; crumb = 'Busca'; }
      else if (col) { h1 = col.nome; texto = col.descricao; crumb = col.nome; }
      else if (estado.cat) { h1 = nomeCategoria(estado.cat); texto = estado.cat === 'quadros' ? 'Pinturas em acrílica sobre tela, prontas para pendurar.' : 'Cerâmica, argila e metal modelados à mão.'; crumb = h1; }
      titulo.textContent = h1;
      sub.textContent = texto; sub.hidden = !texto;
      trilha.innerHTML = '<ol><li><a href="index.html">Início</a></li><li><a href="loja.html">Obras</a></li>' + (crumb !== 'Obras' ? '<li aria-current="page">' + esc(crumb) + '</li>' : '') + '</ol>';
      if (crumb === 'Obras') trilha.innerHTML = '<ol><li><a href="index.html">Início</a></li><li aria-current="page">Obras</li></ol>';
      document.title = h1 + ' | ' + L.nome;
      total.textContent = lista.length + (lista.length === 1 ? ' obra' : ' obras');
      if (!lista.length) {
        grade.className = '';
        grade.innerHTML = '<div class="vazio"><h2>Nenhuma obra encontrada</h2><p>Tente outra palavra ou tire algum filtro. Se procura algo específico, a artista também aceita encomendas.</p>' +
          '<button type="button" class="btn" data-limpar>Limpar filtros</button> <a class="btn btn--vazado" href="contato.html">Falar sobre uma encomenda</a></div>';
      } else {
        grade.className = 'grade grade--3';
        grade.innerHTML = lista.map(htmlCard).join('');
      }
    }

    function ler() {
      const dados = new FormData(form);
      estado.cat = dados.get('cat') || '';
      estado.colecao = dados.get('colecao') || '';
      estado.preco = dados.get('preco') || '';
      estado.disp = dados.get('disp') === '1';
    }
    form.addEventListener('change', () => { ler(); atualizarUrl(); desenhar(); });
    $('#ordem').addEventListener('change', (e) => { estado.ordem = e.target.value; atualizarUrl(); desenhar(); });
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-limpar]')) {
        estado.cat = estado.colecao = estado.preco = estado.q = ''; estado.disp = false;
        $$('input[type=radio][value=""]', form).forEach((r) => { r.checked = true; });
        $$('input[type=checkbox]', form).forEach((c) => { c.checked = false; });
        const campo = $('#busca-q'); if (campo) campo.value = '';
        atualizarUrl(); desenhar();
      }
    });

    // filtros no celular (painel lateral)
    const fundo = $('[data-fundo-filtros]');
    const abrir = () => { form.classList.add('filtros--aberto'); fundo.hidden = false; };
    const fechar = () => { form.classList.remove('filtros--aberto'); fundo.hidden = true; };
    $('[data-abrir-filtros]').addEventListener('click', abrir);
    fundo.addEventListener('click', fechar);
    form.addEventListener('click', (e) => { if (e.target.closest('[data-fechar-filtros]')) fechar(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fechar(); });

    desenhar();
  }

  /* ------------------------------------------------------------------
     6. PÁGINA DA OBRA
     ------------------------------------------------------------------ */
  function paginaObra() {
    const raiz = $('#obra');
    const id = new URLSearchParams(location.search).get('p');
    const p = porId(id);
    if (!p) {
      document.title = 'Obra não encontrada | ' + L.nome;
      raiz.innerHTML = '<div class="container"><div class="vazio"><h1 style="font-size:1.6rem">Não encontramos esta obra</h1><p>O endereço pode estar errado ou a obra saiu da loja.</p><a class="btn" href="loja.html">Ver todas as obras</a></div></div>';
      return;
    }
    document.title = p.nome + ' | ' + L.nome;
    const meta = $('meta[name="description"]');
    if (meta) meta.setAttribute('content', p.nome + ': ' + p.resumo + ' ' + p.tecnica + ', ' + p.dimensoes + '.');

    const vendido = p.estoque < 1;
    const par = parcelasDe(p.preco);
    const col = colecaoDe(p);
    const linkDaObra = /^https?:$/.test(location.protocol) ? ' ' + location.origin + location.pathname + '?p=' + encodeURIComponent(p.id) : '';
    const zapObra = zapUrl('Olá! Tenho uma dúvida sobre a obra “' + p.nome + '”.' + linkDaObra);
    let atual = 0;

    const thumbs = p.imagens.map((_, i) =>
      '<button type="button" class="mini" data-i="' + i + '" aria-label="Ver imagem ' + (i + 1) + ' de ' + p.imagens.length + ': ' + esc(LEGENDAS[i] || '') + '"' + (i === 0 ? ' aria-current="true"' : '') + '><img src="' + imgObra(p, i) + '" alt="" width="100" height="100"></button>').join('');

    const compra = vendido
      ? '<p class="compra__aviso"><b>Esta obra já foi vendida.</b> Quer algo parecido? A artista aceita encomendas: conte o tamanho e as cores que você imagina.</p>' +
        '<div class="compra__extra"><a class="btn btn--cheio" href="' + zapUrl('Olá! Vi que a obra “' + p.nome + '” já foi vendida e queria encomendar algo parecido.') + '" target="_blank" rel="noopener">Pedir uma obra parecida</a></div>'
      : '<div class="compra">' +
        (p.estoque > 1 ? '<div class="qtd" role="group" aria-label="Quantidade"><button type="button" data-menos aria-label="Diminuir quantidade">−</button><output data-qtd aria-live="polite">1</output><button type="button" data-mais aria-label="Aumentar quantidade">+</button></div>' : '') +
        '<button type="button" class="btn" data-comprar>Comprar</button></div>' +
        '<div class="compra__extra">' +
        (p.linkPagamento ? '<a class="btn btn--vazado btn--cheio" href="' + esc(p.linkPagamento) + '" target="_blank" rel="noopener">Pagar com cartão agora</a>' : '') +
        '<a class="link-icone" href="' + zapObra + '" target="_blank" rel="noopener">' + ico('zap') + 'Tirar dúvidas pelo WhatsApp</a></div>';

    const et = etiquetaDe(p);
    const ficha = [
      ['Técnica', p.tecnica], ['Dimensões', p.dimensoes], ['Peso', p.peso], ['Ano', p.ano],
      p.edicao ? ['Edição', 'Limitada a ' + p.edicao + ' exemplares'] : ['Exemplar', 'Peça única'],
      col ? ['Coleção', col.nome] : null,
      ['Autenticidade', 'Certificado assinado pela artista']
    ].filter(Boolean);

    raiz.innerHTML =
      '<div class="container produto">' +
      '<div class="galeria"><div class="galeria__minis">' +
      '<button type="button" class="galeria__seta" data-cima aria-label="Imagens anteriores" hidden>' + ico('cima') + '</button>' +
      '<div class="galeria__lista" data-lista>' + thumbs + '</div>' +
      '<button type="button" class="galeria__seta" data-baixo aria-label="Mais imagens" hidden>' + ico('baixo') + '</button></div>' +
      '<button type="button" class="galeria__principal" data-zoom aria-label="Ampliar imagem"><img data-principal src="' + imgObra(p, 0) + '" alt="' + esc(altImg(p, 0)) + '" width="1000" height="1000"><span class="galeria__lupa">' + ico('lupa') + '</span></button></div>' +
      '<div class="produto__info">' +
      '<nav class="migalhas" aria-label="Você está em"><ol><li><a href="index.html">Início</a></li><li><a href="loja.html?cat=' + p.categoria + '">' + nomeCategoria(p.categoria) + '</a></li><li aria-current="page">' + esc(p.nome) + '</li></ol></nav>' +
      '<h1 class="produto__titulo">' + esc(p.nome) + '</h1>' +
      '<p class="produto__preco">' + brl(p.preco) + '</p>' +
      (!vendido && par.n > 1 ? '<p class="produto__parcela">' + par.n + 'x de ' + brl(par.valor) + ' sem juros</p>' : '') +
      (!vendido && L.descontoPix ? '<p class="produto__pix">ou ' + brl(precoPix(p.preco)) + ' no Pix (' + L.descontoPix + '% de desconto)</p>' : '') +
      (!vendido ? '<button type="button" class="link-icone" data-pagamentos>' + ico('cartao') + 'Ver mais detalhes</button>' : '') +
      '<div><span class="produto__unica' + (vendido ? ' produto__unica--vendido' : '') + '">' + et[0] + (p.estoque > 1 ? ', restam ' + p.estoque : '') + '</span></div>' +
      compra +
      '<details class="acordeao"><summary>' + ico('caminhao') + 'Meios de envio</summary><div class="acordeao__corpo">' +
      '<p>Enviamos para todo o Brasil com embalagem própria para obras de arte e seguro contra extravio e danos. O valor depende do CEP e do tamanho da obra.</p>' +
      '<form class="cep" data-cep novalidate><label class="so-leitor" for="cep">Seu CEP</label><input id="cep" inputmode="numeric" autocomplete="postal-code" placeholder="00000-000" maxlength="9"><button class="btn btn--escuro" type="submit">Consultar</button></form>' +
      '<p class="cep__res" data-cep-res aria-live="polite"></p>' +
      (L.retiradaNoAtelie ? '<p>Prefere buscar? Retirada no ateliê (' + esc(L.cidade) + '), com hora marcada e sem custo.</p>' : '') +
      '</div></details></div></div>' +
      '<div class="container descricao"><div class="descricao__texto"><h2>Descrição</h2>' + p.descricao.map((t) => '<p>' + esc(t) + '</p>').join('') + '</div>' +
      '<div><h2>Ficha técnica</h2><dl class="ficha">' + ficha.map((f) => '<dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd>').join('') + '</dl></div></div>';

    // obras relacionadas
    const outras = PRODUTOS.filter((o) => o.id !== p.id && o.estoque > 0);
    const rel = outras.filter((o) => o.categoria === p.categoria).concat(outras.filter((o) => o.categoria !== p.categoria)).slice(0, 4);
    if (rel.length) {
      const sec = document.createElement('section');
      sec.className = 'secao secao--filete';
      sec.innerHTML = '<div class="container"><div class="secao__topo"><h2 class="secao__titulo">Você também pode gostar</h2></div><div class="grade">' + rel.map(htmlCard).join('') + '</div></div>';
      raiz.parentNode.insertBefore(sec, raiz.nextSibling);
    }

    // dados estruturados para buscadores
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: p.nome, description: p.resumo,
      image: p.imagens.map((_, i) => new URL(imgObra(p, i), location.href).href),
      offers: { '@type': 'Offer', priceCurrency: 'BRL', price: p.preco.toFixed(2), availability: vendido ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock' }
    });
    document.head.appendChild(ld);

    // galeria
    const principal = $('[data-principal]', raiz);
    const minis = $$('.mini', raiz);
    function ir(i) {
      atual = (i + p.imagens.length) % p.imagens.length;
      principal.classList.add('trocando');
      setTimeout(() => { principal.src = imgObra(p, atual); principal.alt = altImg(p, atual); principal.classList.remove('trocando'); }, 120);
      minis.forEach((m, k) => { if (k === atual) m.setAttribute('aria-current', 'true'); else m.removeAttribute('aria-current'); });
    }
    minis.forEach((m) => m.addEventListener('click', () => ir(parseInt(m.dataset.i, 10))));
    const lista = $('[data-lista]', raiz), cima = $('[data-cima]', raiz), baixo = $('[data-baixo]', raiz);
    const vertical = () => window.matchMedia('(min-width: 901px)').matches;
    function setas() { const sobra = lista.scrollHeight > lista.clientHeight + 4 && vertical(); cima.hidden = baixo.hidden = !sobra; }
    cima.addEventListener('click', () => lista.scrollBy({ top: -112, behavior: 'smooth' }));
    baixo.addEventListener('click', () => lista.scrollBy({ top: 112, behavior: 'smooth' }));
    window.addEventListener('resize', setas); setas();

    // ampliar imagem
    const lb = document.createElement('dialog');
    lb.className = 'lightbox';
    lb.setAttribute('aria-label', 'Imagem ampliada de ' + p.nome);
    lb.innerHTML = '<button type="button" class="lightbox__fechar" aria-label="Fechar">' + ico('fechar') + '</button>' +
      (p.imagens.length > 1 ? '<button type="button" class="lightbox__seta lightbox__seta--ant" aria-label="Imagem anterior">' + ico('esq') + '</button><button type="button" class="lightbox__seta lightbox__seta--prox" aria-label="Próxima imagem">' + ico('dir') + '</button>' : '') +
      '<img alt="">';
    document.body.appendChild(lb);
    const lbImg = $('img', lb);
    const lbMostrar = () => { lbImg.src = imgObra(p, atual); lbImg.alt = altImg(p, atual); };
    $('[data-zoom]', raiz).addEventListener('click', () => { lbMostrar(); lb.showModal(); });
    $('.lightbox__fechar', lb).addEventListener('click', () => lb.close());
    const ant = $('.lightbox__seta--ant', lb), prox = $('.lightbox__seta--prox', lb);
    if (ant) {
      ant.addEventListener('click', () => { ir(atual - 1); lbImg.src = imgObra(p, atual); lbImg.alt = altImg(p, atual); });
      prox.addEventListener('click', () => { ir(atual + 1); lbImg.src = imgObra(p, atual); lbImg.alt = altImg(p, atual); });
      lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') ant.click(); if (e.key === 'ArrowRight') prox.click(); });
    }
    lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });

    // quantidade e compra
    let qtd = 1;
    const out = $('[data-qtd]', raiz);
    const mais = $('[data-mais]', raiz), menos = $('[data-menos]', raiz);
    function pintarQtd() { if (!out) return; out.textContent = qtd; menos.disabled = qtd <= 1; mais.disabled = qtd >= p.estoque; }
    if (out) {
      mais.addEventListener('click', () => { qtd = Math.min(p.estoque, qtd + 1); pintarQtd(); });
      menos.addEventListener('click', () => { qtd = Math.max(1, qtd - 1); pintarQtd(); });
      pintarQtd();
    }
    const botao = $('[data-comprar]', raiz);
    if (botao) botao.addEventListener('click', () => {
      const r = Carrinho.adicionar(p.id, qtd);
      if (!r.ok) aviso(r.msg);
      window.abrirGaveta();
    });

    // formas de pagamento (janela)
    const bPag = $('[data-pagamentos]', raiz);
    if (bPag) {
      const jan = document.createElement('dialog');
      jan.className = 'janela';
      jan.setAttribute('aria-labelledby', 'pag-titulo');
      let linhas = '';
      for (let n = 1; n <= par.n; n++) linhas += '<tr><th scope="row">' + n + 'x sem juros</th><td>' + brl(p.preco / n) + '</td></tr>';
      jan.innerHTML = '<button type="button" class="icone-btn janela__fechar" aria-label="Fechar">' + ico('fechar') + '</button>' +
        '<h2 id="pag-titulo">Formas de pagamento</h2>' +
        (L.descontoPix ? '<p><b>Pix:</b> ' + brl(precoPix(p.preco)) + ' (' + L.descontoPix + '% de desconto sobre ' + brl(p.preco) + ').</p>' : '<p><b>Pix:</b> ' + brl(p.preco) + '.</p>') +
        '<p style="margin-bottom:0"><b>Cartão de crédito:</b></p><table class="tabela-parcelas"><tbody>' + linhas + '</tbody></table>' +
        '<p class="nota" style="margin-top:14px">O pagamento é combinado com a artista depois que você enviar o pedido: ela confirma a disponibilidade da obra, calcula o frete e envia a chave Pix ou o link do cartão.</p>';
      document.body.appendChild(jan);
      bPag.addEventListener('click', () => jan.showModal());
      $('.janela__fechar', jan).addEventListener('click', () => jan.close());
      jan.addEventListener('click', (e) => { if (e.target === jan) jan.close(); });
    }

    // consulta de CEP
    const formCep = $('[data-cep]', raiz), campoCep = $('#cep', raiz), resCep = $('[data-cep-res]', raiz);
    campoCep.addEventListener('input', () => { campoCep.value = mascaraCep(campoCep.value); });
    formCep.addEventListener('submit', async (e) => {
      e.preventDefault();
      const cep = campoCep.value.replace(/\D/g, '');
      if (cep.length !== 8) { resCep.textContent = 'Digite um CEP com 8 números.'; return; }
      resCep.textContent = 'Consultando…';
      let lugar = '';
      try {
        const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 4000);
        const r = await fetch('https://viacep.com.br/ws/' + cep + '/json/', { signal: ctl.signal });
        clearTimeout(t);
        const d = await r.json();
        if (d && !d.erro) lugar = d.localidade + '/' + d.uf;
      } catch (err) { /* sem internet ou serviço fora do ar: segue sem o nome da cidade */ }
      const msg = 'Olá! Quero saber o frete da obra “' + p.nome + '” para o CEP ' + mascaraCep(cep) + (lugar ? ' (' + lugar + ')' : '') + '.';
      resCep.innerHTML = (lugar ? 'Entrega para ' + esc(lugar) + '. ' : '') + 'O frete é calculado pela artista: <a href="' + zapUrl(msg) + '" target="_blank" rel="noopener">pedir o valor pelo WhatsApp</a>.';
    });
  }

  /* ------------------------------------------------------------------
     7. PÁGINA DO CARRINHO
     ------------------------------------------------------------------ */
  function paginaCarrinho() {
    const lista = $('#itens');
    const resumo = $('#resumo');
    const form = $('#pedido');
    const vazio = $('#carrinho-vazio');
    const conteudo = $('#carrinho-conteudo');
    const msgErro = $('#erro-pedido');

    function desenhar() {
      const linhas = Carrinho.linhas();
      conteudo.hidden = !linhas.length;
      vazio.hidden = !!linhas.length;
      if (!linhas.length) return;
      lista.innerHTML = linhas.map(htmlItem).join('');
      const sub = Carrinho.subtotal();
      const par = parcelasDe(sub);
      resumo.innerHTML = htmlTotais() +
        (par.n > 1 ? '<p class="nota" style="margin-top:8px">No cartão: ' + par.n + 'x de ' + brl(par.valor) + ' sem juros.</p>' : '');
    }
    ligarControlesDeItem(lista);
    document.addEventListener('carrinho:mudou', desenhar);

    $('#cep-pedido').addEventListener('input', (e) => { e.target.value = mascaraCep(e.target.value); });

    function montarMensagem() {
      const d = new FormData(form);
      const sub = Carrinho.subtotal();
      let t = 'Olá! Quero comprar estas obras do ' + L.nome + ':\n\n';
      Carrinho.linhas().forEach((l) => { t += '• ' + l.p.nome + ' (' + l.p.dimensoes + ')' + (l.q > 1 ? ', ' + l.q + ' unidades' : '') + ': ' + brl(l.p.preco * l.q) + '\n'; });
      t += '\nSubtotal: ' + brl(sub);
      const pg = d.get('pagamento');
      if (pg === 'Pix') t += '\nPagamento: Pix' + (L.descontoPix ? ' com ' + L.descontoPix + '% de desconto, total ' + brl(precoPix(sub)) : '');
      else if (pg === 'Cartão de crédito') { const p = parcelasDe(sub); t += '\nPagamento: cartão de crédito' + (p.n > 1 ? ', até ' + p.n + 'x de ' + brl(p.valor) : ''); }
      else t += '\nPagamento: ainda não decidi';
      t += '\n\nMeu nome: ' + (d.get('nome') || '').trim();
      const cep = (d.get('cep') || '').trim();
      if (cep) t += '\nCEP para o frete: ' + cep;
      const obs = (d.get('obs') || '').trim();
      if (obs) t += '\nObservações: ' + obs;
      return t;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      msgErro.textContent = '';
      const nome = form.nome.value.trim();
      const cepNum = form.cep.value.replace(/\D/g, '');
      if (!Carrinho.itens.length) { msgErro.textContent = 'Seu carrinho está vazio.'; return; }
      if (!nome) { msgErro.textContent = 'Digite o seu nome para a artista saber com quem está falando.'; form.nome.focus(); return; }
      if (cepNum && cepNum.length !== 8) { msgErro.textContent = 'O CEP precisa ter 8 números. Se preferir, deixe em branco.'; form.cep.focus(); return; }
      const url = zapUrl(montarMensagem());
      if (abrirAba(url)) {
        $('#pedido-enviado').hidden = false;
        $('#pedido-enviado').focus();
      } else {
        $('#pedido-enviado').hidden = true;
        msgErro.innerHTML = 'Não foi possível abrir o WhatsApp automaticamente. <a href="' + url + '" target="_blank" rel="noopener">Clique aqui para abrir a conversa com o pedido</a>.';
      }
    });

    $('#copiar-pedido').addEventListener('click', async () => {
      if (!form.nome.value.trim()) { msgErro.textContent = 'Digite o seu nome antes de copiar o pedido.'; form.nome.focus(); return; }
      msgErro.textContent = '';
      try { await navigator.clipboard.writeText(montarMensagem()); aviso('Pedido copiado. Cole na conversa com a artista.'); }
      catch (err) { msgErro.textContent = 'Não foi possível copiar. Use o botão do WhatsApp.'; }
    });
    $('#esvaziar').addEventListener('click', () => { Carrinho.limpar(); });

    desenhar();
  }

  /* ------------------------------------------------------------------
     8. PÁGINA DE CONTATO
     ------------------------------------------------------------------ */
  function paginaContato() {
    const form = $('#contato-form');
    const erro = $('#erro-contato');
    $('#canal-zap').href = zapUrl('Olá! Vim pelo site do ' + L.nome + '.');
    $('#canal-zap').textContent = L.whatsappExibir;
    $('#canal-email').href = 'mailto:' + L.email;
    $('#canal-email').textContent = L.email;
    $('#canal-insta').href = L.instagram;
    $('#canal-insta').textContent = L.instagramUsuario;
    $('#canal-local').textContent = L.cidade + '. ' + L.horario + '.';

    const ass = new URLSearchParams(location.search).get('assunto');
    if (ass) { const op = $$('option', form.assunto).find((o) => o.value === ass); if (op) form.assunto.value = ass; }

    function texto() {
      return 'Olá! Meu nome é ' + form.nome.value.trim() + '.\nAssunto: ' + form.assunto.value + '\n\n' + form.mensagem.value.trim();
    }
    function valido() {
      if (!form.nome.value.trim()) { erro.textContent = 'Digite o seu nome.'; form.nome.focus(); return false; }
      if (!form.mensagem.value.trim()) { erro.textContent = 'Escreva a sua mensagem.'; form.mensagem.focus(); return false; }
      erro.textContent = ''; return true;
    }
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!valido()) return;
      const url = zapUrl(texto());
      if (!abrirAba(url)) erro.innerHTML = 'Não foi possível abrir o WhatsApp automaticamente. <a href="' + url + '" target="_blank" rel="noopener">Clique aqui para abrir a conversa</a>.';
    });
    $('#enviar-email').addEventListener('click', () => {
      if (!valido()) return;
      location.href = 'mailto:' + L.email + '?subject=' + encodeURIComponent(form.assunto.value + ' | ' + form.nome.value.trim()) + '&body=' + encodeURIComponent(form.mensagem.value.trim());
    });
  }

  /* ------------------------------------------------------------------
     INÍCIO
     ------------------------------------------------------------------ */
  function iniciar() {
    const pagina = document.body.dataset.pagina || '';
    // os títulos das páginas trazem o nome de exemplo; troca pelo nome definido em config.js
    document.title = document.title.split('Ruth').join(L.nome);
    $$('[data-nome]').forEach((el) => { el.textContent = L.nome; });
    Carrinho.carregar();
    montarTopo(pagina);
    montarGaveta();
    montarRodape();
    montarFlutuantes();
    ligarMenu();
    ligarBusca();
    Carrinho.salvar();
    window.addEventListener('storage', (e) => { if (e.key === L.chave + ':carrinho') { Carrinho.carregar(); Carrinho.salvar(); } });

    const paginas = { inicio: paginaInicio, loja: paginaLoja, obra: paginaObra, carrinho: paginaCarrinho, contato: paginaContato };
    if (paginas[pagina]) paginas[pagina]();
  }

  iniciar();
})();
