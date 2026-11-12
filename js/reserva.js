// Pesquisa e reserva
document.addEventListener("DOMContentLoaded", function () {
  const {
    t, plural, existe, formatarEuros, formatarData, idioma, nomeCurto, aoMudar
  } = window.idiomas;

  const checkIn = document.getElementById("check-in");
  const checkOut = document.getElementById("check-out");
  const tipoAlojamento = document.getElementById("tipo-alojamento");
  const formulario = document.getElementById("form-pesquisa");
  const resultados = document.getElementById("resultados");

  const botaoOcupacao = document.getElementById("botao-ocupacao");
  const menuOcupacao = document.getElementById("menu-ocupacao");
  const resumoOcupacao = document.getElementById("resumo-ocupacao");
  const confirmarOcupacao = document.getElementById("confirmar-ocupacao");

  const seccaoPesquisa = document.querySelector(".pesquisa-reserva");
  const seccaoDados = document.getElementById("dados-reserva");
  const resumoEscolha = document.getElementById("resumo-escolha");
  const formReserva = document.getElementById("form-reserva");
  const erroReserva = document.getElementById("erro-reserva");
  const botaoConfirmar = document.getElementById("botao-confirmar");
  const seccaoConfirmacao = document.getElementById("confirmacao");

  const parametros = new URLSearchParams(location.search);
  const alojamentoPedido = Number(parametros.get("alojamento")) || null;

  let adultos = 2;
  let criancas = 0;
  let quartos = 1;

  
  // Ocupação vinda do endereço
  if (parametros.get("adultos")) adultos = Math.min(Math.max(Number(parametros.get("adultos")) || 2, 1), 8);
  if (parametros.get("criancas")) criancas = Math.min(Math.max(Number(parametros.get("criancas")) || 0, 0), 8);
  if (parametros.get("quartos")) quartos = Math.min(Math.max(Number(parametros.get("quartos")) || 1, 1), 4);

  // Estado dos resultados
  let estado = { tipo: "vazio" };
  let busca = null;
  let escolhido = null;
  let confirmacao = null;
  let erroAtual = null;
  let codigoAplicado = null;

  // ---------- DATAS ----------

  const hoje = new Date();
  const dataHoje = [
    hoje.getFullYear(),
    String(hoje.getMonth() + 1).padStart(2, "0"),
    String(hoje.getDate()).padStart(2, "0")
  ].join("-");

  checkIn.min = dataHoje;
  checkOut.min = dataHoje;

  if (parametros.get("check_in") && parametros.get("check_in") >= dataHoje) {
    checkIn.value = parametros.get("check_in");
    checkOut.min = checkIn.value;
  }

  if (parametros.get("check_out") && parametros.get("check_out") > checkIn.value) {
    checkOut.value = parametros.get("check_out");
  }

  checkIn.addEventListener("change", function () {
    checkOut.min = checkIn.value || dataHoje;

    if (checkOut.value && checkOut.value <= checkIn.value) {
      checkOut.value = "";
    }
  });

  // ---------- OCUPAÇÃO ----------

  
  // Máximo de pessoas por tipo de alojamento
  const MAXIMO_PESSOAS = { Quarto: 4, T1: 4, T2: 6, T3: 8, T4: 8 };

  function maximoPessoas() {
    return MAXIMO_PESSOAS[tipoAlojamento.value] || 8;
  }

  // Ajustar ao máximo
  function ajustarOcupacao() {
    while (adultos + criancas > maximoPessoas()) {
      if (criancas > 0) criancas--;
      else adultos--;
    }
  }

  function desenharOcupacao() {
    resumoOcupacao.textContent = [
      plural("res.adultos", adultos),
      plural("res.criancas", criancas),
      plural("res.quartos", quartos)
    ].join(" · ");

    document.getElementById("valor-adultos").textContent = adultos;
    document.getElementById("valor-criancas").textContent = criancas;
    document.getElementById("valor-quartos").textContent = quartos;
    
    // Desativar o "+" no máximo
    const cheio = adultos + criancas >= maximoPessoas();

    document.querySelectorAll('.mais[data-tipo="adultos"], .mais[data-tipo="criancas"]').forEach(function (botao) {
      botao.disabled = cheio;
      botao.classList.toggle("opacity-40", cheio);
      botao.classList.toggle("pointer-events-none", cheio);
    });

    document.getElementById("maximo-pessoas").textContent = t("res.maximo_pessoas", { n: maximoPessoas() });
  }

  botaoOcupacao.addEventListener("click", function (evento) {
    evento.stopPropagation();
    menuOcupacao.classList.toggle("aberto");
  });

  document.querySelectorAll(".mais").forEach(function (botao) {
    botao.addEventListener("click", function () {
      const tipo = botao.dataset.tipo;

      const total = adultos + criancas;

      if (tipo === "adultos" && total < maximoPessoas()) adultos++;
      if (tipo === "criancas" && total < maximoPessoas()) criancas++;
      if (tipo === "quartos" && quartos < 4) quartos++;

      desenharOcupacao();
    });
  });

  document.querySelectorAll(".menos").forEach(function (botao) {
    botao.addEventListener("click", function () {
      const tipo = botao.dataset.tipo;

      if (tipo === "adultos" && adultos > 1) adultos--;
      if (tipo === "criancas" && criancas > 0) criancas--;
      if (tipo === "quartos" && quartos > 1) quartos--;

      desenharOcupacao();
    });
  });

  confirmarOcupacao.addEventListener("click", function () {
    menuOcupacao.classList.remove("aberto");
  });

  document.addEventListener("click", function (evento) {
    if (!botaoOcupacao.contains(evento.target) && !menuOcupacao.contains(evento.target)) {
      menuOcupacao.classList.remove("aberto");
    }
  });

  // Filtrar por tipo
  tipoAlojamento.addEventListener("change", function () {
    ajustarOcupacao();
    desenharOcupacao();
    if (estado.tipo === "lista") desenharResultados();
  });

  // Tipo vindo dos Alojamentos
  if (parametros.get("tipo")) {
    tipoAlojamento.value = parametros.get("tipo");
    ajustarOcupacao();
  }

  // ---------- AJUDAS ----------
  
  // Dados da pesquisa atual
  function parametrosPesquisa() {
    return new URLSearchParams({
      check_in: busca.check_in,
      check_out: busca.check_out,
      adultos: adultos,
      criancas: criancas,
      quartos: quartos,
      tipo: tipoAlojamento.value
    }).toString();
  }

  function criar(tag, classe, texto) {
    const el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto !== undefined) el.textContent = texto;
    return el;
  }

  function mensagemErro(dados) {
    const chave = "err." + (dados && dados.codigo);

    if (dados && existe(chave)) return t(chave);

    return (dados && dados.erro) || t("err.ERRO");
  }

  // ---------- RESULTADOS ----------

  function desenharResultados() {
    resultados.replaceChildren();

    if (estado.tipo === "vazio") return;

    if (estado.tipo === "carregando") {
      resultados.appendChild(criar("div", "py-10 text-center text-[#666]", t("res.a_procurar")));
      return;
    }

    if (estado.tipo === "erro") {
      const caixa = criar("div", "rounded-3xl border border-[#e8e1d7] bg-white p-8 text-center text-[#666] [&_h2]:mb-3 [&_h2]:font-['Georgia',serif] [&_h2]:text-3xl [&_h2]:text-[#14245d]");
      caixa.appendChild(criar("h2", "", t("res.falha_pesquisa")));
      caixa.appendChild(criar("p", "", estado.mensagem));
      resultados.appendChild(caixa);
      return;
    }

    // Filtrar por tipo
    const filtrados = busca ? busca.alojamentos.filter(function (alojamento) {
      if (tipoAlojamento.value === "apartamento") return alojamento.tipologia !== "Quarto";
      return !tipoAlojamento.value || alojamento.tipologia === tipoAlojamento.value;
    }) : [];

    if (filtrados.length === 0) {
      const caixa = criar("div", "rounded-3xl border border-[#e8e1d7] bg-white p-8 text-center text-[#666] [&_h2]:mb-3 [&_h2]:font-['Georgia',serif] [&_h2]:text-3xl [&_h2]:text-[#14245d]");
      caixa.appendChild(criar("p", "mb-2 text-xs tracking-[0.25em] text-[#1d2d78]", t("res.disp_label")));
      caixa.appendChild(criar("h2", "", t("res.sem_resultados")));
      caixa.appendChild(criar("p", "", t("res.sem_resultados_p")));
      resultados.appendChild(caixa);
      return;
    }

    const titulo = criar("div", "mb-8 [&_h2]:font-['Georgia',serif] [&_h2]:text-3xl [&_h2]:text-[#14245d] md:[&_h2]:text-4xl [&_p]:mb-3 [&_p]:text-xs [&_p]:tracking-[0.25em] [&_p]:text-[#1d2d78]");
    titulo.appendChild(criar("p", "", t("res.resultados_label")));
    titulo.appendChild(criar("h2", "", t("res.resultados_titulo")));

    const grelha = criar("div", "grid gap-6 md:grid-cols-2 lg:grid-cols-3");

    // O alojamento escolhido aparece primeiro
      const lista = filtrados.slice().sort((a, b) =>
      (b.id === alojamentoPedido) - (a.id === alojamentoPedido)
    );

    lista.forEach(function (alojamento) {
      const cartao = criar("article", "flex flex-col overflow-hidden rounded-3xl border border-[#e8e1d7] bg-white [&.destacado]:outline [&.destacado]:outline-2 [&.destacado]:outline-[#1d2d78]");

      if (alojamento.id === alojamentoPedido) cartao.classList.add("destacado");

      const caixaImagem = criar("div", "h-60 overflow-hidden");
      const imagem = document.createElement("img");
      imagem.src = alojamento.imagem;
      imagem.alt = alojamento.nome;
      imagem.loading = "lazy";
      imagem.className = "size-full object-cover";
      caixaImagem.appendChild(imagem);

      const info = criar("div", "flex grow flex-col gap-1 px-6 pb-7 pt-6 [&>p:first-child]:text-xs [&>p:first-child]:tracking-[0.2em] [&>p:first-child]:text-[#1d2d78] [&_h3]:font-['Georgia',serif] [&_h3]:text-2xl [&_h3]:text-[#14245d] [&_span]:text-sm [&_span]:text-[#666]");
      info.appendChild(criar("p", "", alojamento.tipologia.toUpperCase()));
      info.appendChild(criar("h3", "", nomeCurto(alojamento.nome)));
      info.appendChild(criar("span", "", t("res.ate_hospedes", { n: alojamento.capacidade })));

      const preco = criar("p", "my-3 font-bold text-[#14245d]", t("res.total_estadia", {
        total: formatarEuros(alojamento.preco_total),
        noites: plural("comum.noites", alojamento.noites)
      }));
      info.appendChild(preco);

      const botao = criar("button", "mt-auto w-fit border border-[#1d2d78] bg-[#1d2d78] px-6 py-3 text-xs tracking-[0.2em] text-white transition-colors hover:border-[#e5c89c] hover:bg-[#e5c89c] hover:text-[#14245d]", t("res.reservar"));
      botao.type = "button";
      botao.addEventListener("click", function () {
        escolher(alojamento);
      });

      const detalhes = criar("a", "mt-3 w-fit text-sm text-[#1d2d78] underline transition-colors hover:text-[#b49468]", t("res.ver_detalhes"));
      detalhes.href = "detalhes.html?id=" + alojamento.id + "&" + parametrosPesquisa();

      info.append(botao, detalhes);
      cartao.append(caixaImagem, info);
      grelha.appendChild(cartao);
    });

    resultados.append(titulo, grelha);
  }

  async function buscar() {
    const parametrosBusca = new URLSearchParams({
      check_in: checkIn.value,
      check_out: checkOut.value,
      adultos: adultos,
      criancas: criancas,
      quartos: quartos
    });

    const resposta = await fetch("api/disponibilidade.php?" + parametrosBusca.toString());
    const dados = await resposta.json();

    if (!resposta.ok) {
      const erro = new Error(mensagemErro(dados));
      throw erro;
    }

    busca = dados;
    return dados;
  }

  formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    mostrarPesquisa();

    if (!checkIn.value || !checkOut.value) {
      estado = { tipo: "erro", mensagem: t("res.selecione_datas") };
      desenharResultados();
      return;
    }

    if (checkIn.value < dataHoje) {
      estado = { tipo: "erro", mensagem: t("err.DATA_PASSADA") };
      desenharResultados();
      return;
    }

    if (checkOut.value <= checkIn.value) {
      estado = { tipo: "erro", mensagem: t("err.DATAS_INVALIDAS") };
      desenharResultados();
      return;
    }

    estado = { tipo: "carregando" };
    desenharResultados();

    try {
      await buscar();
      estado = { tipo: "lista" };
    } catch (erro) {
      estado = {
        tipo: "erro",
        mensagem: erro instanceof TypeError ? t("err.REDE") : erro.message
      };
    }

    desenharResultados();
  });

  // ---------- ESCOLHER E RESERVAR ----------

  function mostrarPesquisa() {
    seccaoPesquisa.hidden = false;
    resultados.hidden = false;
    seccaoDados.hidden = true;
    seccaoConfirmacao.hidden = true;
  }

  function desenharResumoEscolha() {
    resumoEscolha.replaceChildren();

    if (!escolhido || !busca) return;

    resumoEscolha.appendChild(criar("h3", "", escolhido.nome));
    resumoEscolha.appendChild(criar("p", "", t("res.resumo_datas", {
      de: formatarData(busca.check_in),
      ate: formatarData(busca.check_out),
      noites: plural("comum.noites", busca.noites)
    })));
    resumoEscolha.appendChild(criar("p", "", plural("comum.hospedes", busca.hospedes)));
    if (codigoAplicado) {
      resumoEscolha.appendChild(criar("p", "text-[#1c5a2b]", t("res.desconto", {
        codigo: codigoAplicado.codigo,
        pct: codigoAplicado.percentagem,
        valor: formatarEuros(calcularDesconto())
      })));
    }

    resumoEscolha.appendChild(criar("strong", "", t("res.resumo_total", {
      total: formatarEuros(escolhido.preco_total - calcularDesconto())
    })));
  }

  // ---------- TELEFONE ----------
  const indicativo = document.getElementById("cliente-indicativo");
  const campoTelefone = document.getElementById("cliente-telefone");
  const ajudaTelefone = document.getElementById("ajuda-telefone");

  // Regras do telefone
  indicativo.addEventListener("change", function () {
    const portugal = indicativo.value === "+351";

    campoTelefone.placeholder = portugal ? "912345678" : "";
    campoTelefone.pattern = portugal ? "(9[1236][0-9]{7}|2[0-9]{8})" : "[0-9 ]{6,15}";
    ajudaTelefone.dataset.idiomas = portugal ? "res.ajuda_telefone" : "res.ajuda_telefone_outro";
    ajudaTelefone.textContent = t(ajudaTelefone.dataset.idiomas);
  });

  // ---------- CÓDIGO PROMOCIONAL ----------

  const campoCodigo = document.getElementById("cliente-codigo");
  const mensagemCodigo = document.getElementById("mensagem-codigo");

  // Desconto em euros
  function calcularDesconto() {
    if (!codigoAplicado || !escolhido) return 0;
    return Math.round(escolhido.preco_total * codigoAplicado.percentagem) / 100;
  }

  function mostrarMensagemCodigo(texto, bom) {
    mensagemCodigo.textContent = texto;
    mensagemCodigo.classList.toggle("ok", bom);
    mensagemCodigo.hidden = !texto;
  }

  document.getElementById("aplicar-codigo").addEventListener("click", async function () {
    const texto = campoCodigo.value.trim();
    codigoAplicado = null;

    if (!texto) {
      mostrarMensagemCodigo("", false);
      desenharResumoEscolha();
      return;
    }

    try {
      const resposta = await fetch("api/codigo.php?codigo=" + encodeURIComponent(texto));
      const dados = await resposta.json();

      if (!resposta.ok) {
        mostrarMensagemCodigo(t("err.CODIGO_INVALIDO"), false);
      } else {
        codigoAplicado = dados;
        mostrarMensagemCodigo(t("res.codigo_ok", { codigo: dados.codigo, pct: dados.percentagem }), true);
      }
    } catch (erro) {
      mostrarMensagemCodigo(t("err.REDE"), false);
    }

    desenharResumoEscolha();
  });

  // Código alterado deixa de contar
  campoCodigo.addEventListener("input", function () {
    if (codigoAplicado) {
      codigoAplicado = null;
      mostrarMensagemCodigo("", false);
      desenharResumoEscolha();
    }
  });

  function desenharErroReserva() {
    if (!erroAtual) {
      erroReserva.hidden = true;
      erroReserva.textContent = "";
      return;
    }

    erroReserva.textContent = existe("err." + erroAtual.codigo)
      ? t("err." + erroAtual.codigo)
      : erroAtual.mensagem;
    erroReserva.hidden = false;
  }

  function escolher(alojamento) {
    escolhido = alojamento;
    erroAtual = null;

    seccaoPesquisa.hidden = true;
    resultados.hidden = true;
    seccaoDados.hidden = false;
    seccaoConfirmacao.hidden = true;

    desenharResumoEscolha();
    desenharErroReserva();

    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById("cliente-nome").focus({ preventScroll: true });
  }

  document.getElementById("voltar-resultados").addEventListener("click", function () {
    mostrarPesquisa();
    desenharResultados();
  });

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  formReserva.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const nome = document.getElementById("cliente-nome").value.trim();
    const email = document.getElementById("cliente-email").value.trim();
    const numero = document.getElementById("cliente-telefone").value.trim();
    const telefone = numero ? document.getElementById("cliente-indicativo").value + " " + numero : "";
    const notas = document.getElementById("cliente-notas").value.trim();

    if (!nome || !email) {
      erroAtual = { codigo: "CAMPOS" };
      desenharErroReserva();
      return;
    }

    if (!EMAIL.test(email)) {
      erroAtual = { codigo: "EMAIL" };
      desenharErroReserva();
      return;
    }

    erroAtual = null;
    desenharErroReserva();

    botaoConfirmar.disabled = true;
    botaoConfirmar.textContent = t("res.a_enviar");

    try {
      const resposta = await fetch("api/reservas.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          notas,
          alojamento_id: escolhido.id,
          check_in: busca.check_in,
          check_out: busca.check_out,
          hospedes: busca.hospedes,
          idioma: idioma(),
          codigo: codigoAplicado ? codigoAplicado.codigo : ""
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        erroAtual = { codigo: dados.codigo, mensagem: dados.erro };
        desenharErroReserva();

        // Atualizar a lista
        if (resposta.status === 409) {
          buscar().then(function () {
            estado = { tipo: "lista" };
          }).catch(function () {});
        }

        return;
      }

      confirmacao = { ...dados, nome, email };
      seccaoDados.hidden = true;
      seccaoConfirmacao.hidden = false;
      desenharConfirmacao();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (erro) {
      erroAtual = { codigo: "REDE", mensagem: t("err.REDE") };
      desenharErroReserva();
    } finally {
      botaoConfirmar.disabled = false;
      botaoConfirmar.textContent = t("res.confirmar");
    }
  });

  // ---------- CONFIRMAÇÃO ----------

  function desenharConfirmacao() {
    seccaoConfirmacao.replaceChildren();

    if (!confirmacao) return;

    const caixa = criar("div", "mx-auto grid max-w-2xl gap-2.5 rounded-3xl border border-[#e8e1d7] bg-white px-6 py-10 text-center shadow-sm md:px-10 [&_h2]:mb-3 [&_h2]:font-['Georgia',serif] [&_h2]:text-3xl [&_h2]:text-[#14245d]");

    caixa.appendChild(criar("p", "mb-2 text-xs tracking-[0.25em] text-[#1d2d78]", t("res.conf_label")));
    caixa.appendChild(criar("h2", "", t("res.conf_titulo", { nome: confirmacao.nome })));
    caixa.appendChild(criar("p", "text-xl font-bold text-[#1d2d78]", t("res.conf_numero", { id: confirmacao.referencia }))); 
    caixa.appendChild(criar("p", "", confirmacao.alojamento));
    caixa.appendChild(criar("p", "", t("res.resumo_datas", {
      de: formatarData(busca.check_in),
      ate: formatarData(busca.check_out),
      noites: plural("comum.noites", confirmacao.noites)
    })));
    
    if (confirmacao.desconto > 0) {
      caixa.appendChild(criar("p", "text-[#1c5a2b]", t("res.desconto", {
        codigo: confirmacao.codigo === "CLIENTE HABITUAL" ? t("res.cliente_habitual") : confirmacao.codigo,
        pct: confirmacao.percentagem,
        valor: formatarEuros(confirmacao.desconto)
      })));
    }

    caixa.appendChild(criar("strong", "", t("res.resumo_total", {
      total: formatarEuros(confirmacao.preco_total)
    })));

    caixa.appendChild(criar("p", "text-sm text-[#666]", confirmacao.email_real
      ? t("res.conf_email", { email: confirmacao.email })
      : t("res.conf_email_simulado")));

    const acoes = criar("div", "mt-3 flex flex-wrap items-center justify-center gap-3");

    const nova = criar("a", "border border-[#1d2d78] bg-[#1d2d78] px-6 py-3 text-xs tracking-[0.2em] text-white transition-colors hover:border-[#e5c89c] hover:bg-[#e5c89c] hover:text-[#14245d]", t("res.conf_nova"));
    nova.href = "reservar.html";

    const inicio = criar("a", "border border-[#1d2d78] px-6 py-3 text-xs tracking-[0.2em] text-[#1d2d78] transition-colors hover:border-[#e5c89c] hover:bg-[#e5c89c] hover:text-[#14245d]", t("res.conf_inicio"));
    inicio.href = "index.html";

    acoes.append(nova, inicio);
    caixa.appendChild(acoes);

    seccaoConfirmacao.appendChild(caixa);
  }

  // ---------- IDIOMA ----------

  aoMudar(function () {
    desenharOcupacao();
    desenharResultados();
    desenharResumoEscolha();
    desenharErroReserva();
    desenharConfirmacao();

    if (botaoConfirmar && !botaoConfirmar.disabled) {
      botaoConfirmar.textContent = t("res.confirmar");
    }
  });

  desenharOcupacao();

  // Repetir a pesquisa
  if (checkIn.value && checkOut.value) {
    formulario.requestSubmit();
  }
});
