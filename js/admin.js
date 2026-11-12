// Área de administração: reservas, alojamentos, avaliações, códigos e estatísticas.
(function () {
  const painel = document.getElementById("admin-painel");
  const login = document.getElementById("admin-login");
  const formLogin = document.getElementById("form-login");
  const erroLogin = document.getElementById("erro-login");
  const botaoSair = document.getElementById("sair");
  const mensagem = document.getElementById("admin-mensagem");

  const corpoReservas = document.getElementById("corpo-reservas");
  const resumoReservas = document.getElementById("resumo-reservas");
  const filtroEstado = document.getElementById("filtro-estado");
  const filtroAlojamento = document.getElementById("filtro-alojamento");
  const filtroTexto = document.getElementById("filtro-texto");
  const listaAlojamentos = document.getElementById("lista-alojamentos-admin");

  let palavraPasse = "";
  let reservas = [];
  let alojamentos = [];
  let avaliacoes = [];
  let codigos = [];

  const euros = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" });

  function criar(tag, classe, texto) {
    const el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto !== undefined) el.textContent = texto;
    return el;
  }

  function dataPT(iso) {
    const [a, m, d] = String(iso).split("-");
    return `${d}/${m}/${a}`;
  }

  function avisar(texto, bom = true) {
    mensagem.textContent = texto;
    mensagem.classList.toggle("erro", !bom);
    mensagem.hidden = false;

    clearTimeout(avisar.temporizador);
    avisar.temporizador = setTimeout(() => { mensagem.hidden = true; }, 5000);
  }

  // ---------- PEDIDOS ----------

  async function api(metodo, url, corpo) {
    const resposta = await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": palavraPasse
      },
      body: corpo ? JSON.stringify(corpo) : undefined
    });

    const dados = await resposta.json().catch(() => ({}));

    if (resposta.status === 401) {
      terminarSessao();
      throw new Error(dados.erro || "Sessão inválida.");
    }

    if (!resposta.ok) {
      throw new Error(dados.erro || "Ocorreu um erro.");
    }

    return dados;
  }

  // ---------- SESSÃO ----------

  function guardarSessao() {
    try { sessionStorage.setItem("admin7saias", palavraPasse); } catch (e) { /* sem armazenamento */ }
  }

  function terminarSessao() {
    palavraPasse = "";

    try { sessionStorage.removeItem("admin7saias"); } catch (e) { /* sem armazenamento */ }

    painel.hidden = true;
    login.hidden = false;
    botaoSair.hidden = true;
  }

  async function entrar(palavra) {
    palavraPasse = palavra;

    try {
      await carregarTudo();
    } catch (erro) {
      palavraPasse = "";
      throw erro;
    }

    guardarSessao();
    login.hidden = true;
    painel.hidden = false;
    botaoSair.hidden = false;
  }

  formLogin.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    erroLogin.hidden = true;

    try {
      await entrar(document.getElementById("admin-password").value);
      document.getElementById("admin-password").value = "";
    } catch (erro) {
      erroLogin.textContent = erro.message;
      erroLogin.hidden = false;
    }
  });

  botaoSair.addEventListener("click", terminarSessao);

  // ---------- ABAS ----------

  document.querySelectorAll(".admin-abas button").forEach((botao) => {
    botao.addEventListener("click", () => {
      document.querySelectorAll(".admin-abas button").forEach((b) => b.classList.toggle("ativo", b === botao));
      document.getElementById("aba-reservas").hidden = !["reservas", "canceladas"].includes(botao.dataset.aba);
      document.getElementById("aba-alojamentos").hidden = botao.dataset.aba !== "alojamentos";
      document.getElementById("aba-avaliacoes").hidden = botao.dataset.aba !== "avaliacoes";
      document.getElementById("aba-codigos").hidden = botao.dataset.aba !== "codigos";
      document.getElementById("aba-estatisticas").hidden = botao.dataset.aba !== "estatisticas";
      if (botao.dataset.aba === "reservas" || botao.dataset.aba === "canceladas") {
        filtroEstado.value = botao.dataset.aba === "reservas" ? "confirmada" : "cancelada";
        desenharReservas();
      }
    });
  });

  // ---------- DADOS ----------

  async function carregarTudo() {
    const [dadosReservas, dadosAlojamentos, dadosAvaliacoes, dadosCodigos] = await Promise.all([
      api("GET", "api/admin-reservas.php"),
      api("GET", "api/alojamentos.php"),
      api("GET", "api/avaliacoes.php"),
      api("GET", "api/admin-codigos.php")
    ]);
    reservas = dadosReservas.reservas;
    alojamentos = dadosAlojamentos.alojamentos;
    avaliacoes = dadosAvaliacoes.avaliacoes;
    codigos = dadosCodigos.codigos;

    preencherFiltroAlojamentos();
    desenharReservas();
    desenharAlojamentos();
    desenharAvaliacoes();
    desenharCodigos();
    desenharEstatisticas();
  }

  function preencherFiltroAlojamentos() {
    const atual = filtroAlojamento.value;
    filtroAlojamento.replaceChildren(new Option("Todos", ""));

    alojamentos.forEach((a) => filtroAlojamento.appendChild(new Option(a.nome, String(a.id))));

    filtroAlojamento.value = atual;
  }

  // ---------- RESERVAS ----------

  function reservasFiltradas() {
    const texto = filtroTexto.value.trim().toLowerCase();

    return reservas.filter((r) => {
      if (filtroEstado.value !== "todas" && !r.estado.startsWith(filtroEstado.value)) return false;
      if (filtroAlojamento.value && String(r.alojamento_id) !== filtroAlojamento.value) return false;

      const referencia = (r.referencia || "").toLowerCase();

      if (texto && !(r.nome.toLowerCase().includes(texto) || r.email.toLowerCase().includes(texto) || referencia.includes(texto))) {
        return false;
      }

      return true;
    });
  }
  const ESTADOS = {
    confirmada: "Confirmada",
    cancelada: "Cancelada",
    cancelada_cliente: "Cancelada pelo cliente",
    cancelada_alojamento: "Cancelada pelo alojamento"
  };

  function botaoAcao(texto, acao, perigo = false) {
    const cor = perigo ? "border-[#8a1c13] text-[#8a1c13] hover:bg-[#8a1c13] hover:text-white" : "border-[#1d2d78] text-[#1d2d78] hover:border-[#e5c89c] hover:bg-[#e5c89c] hover:text-[#14245d]";
    const botao = criar("button", `mb-1.5 mr-1.5 border bg-white px-2.5 py-1.5 text-xs transition-colors ${cor}`, texto);
    botao.type = "button";
    botao.addEventListener("click", acao);
    return botao;
  }

  function desenharReservas() {
    const lista = reservasFiltradas();
    corpoReservas.replaceChildren();

    const total = lista
      .filter((r) => r.estado === "confirmada")
      .reduce((soma, r) => soma + r.preco_total, 0);

    resumoReservas.textContent =
      `${lista.length} reserva(s) · valor das confirmadas: ${euros.format(total)}`;

    if (lista.length === 0) {
      const linha = criar("tr");
      const celula = criar("td", "", "Sem reservas para mostrar.");
      celula.colSpan = 9;
      linha.appendChild(celula);
      corpoReservas.appendChild(linha);
      return;
    }

    lista.forEach((r) => {
      const linha = criar("tr", r.estado !== "confirmada" ? "cancelada" : "");

      const cliente = criar("td");
      cliente.appendChild(criar("strong", "", r.nome));
      cliente.appendChild(criar("br"));
      cliente.appendChild(criar("span", "", r.email));

      if (r.telefone) {
        cliente.appendChild(criar("br"));
        cliente.appendChild(criar("span", "", r.telefone));
      }

      if (r.notas) {
        cliente.appendChild(criar("br"));
        cliente.appendChild(criar("em", "", r.notas));
      }

      const estado = criar("td");
      estado.appendChild(criar("span", "inline-block rounded-full px-2.5 py-0.5 text-xs " + (r.estado === "confirmada" ? "bg-[#e7f4ea] text-[#1c5a2b]" : "bg-[#fdecea] text-[#8a1c13]"), ESTADOS[r.estado] || r.estado));

      const acoes = criar("td", "whitespace-nowrap");
            if (r.estado === "confirmada") {
        acoes.append(
          botaoAcao("Cliente cancelou", () => alterarEstado(r, "cancelada_cliente")),
          botaoAcao("Alojamento cancelou", () => alterarEstado(r, "cancelada_alojamento"))
        );
      } else {
        acoes.append(
          botaoAcao("Reativar", () => alterarEstado(r, "confirmada")),
          botaoAcao("Eliminar", () => eliminarReserva(r), true)
        );
      }

      linha.append(
        celulaNumero(r),
        cliente,
        criar("td", "", r.alojamento_nome || "—"),
        criar("td", "", dataPT(r.check_in)),
        criar("td", "", dataPT(r.check_out)),
        criar("td", "", String(r.hospedes)),
        celulaTotal(r),
        estado,
        acoes
      );

      corpoReservas.appendChild(linha);
    });
  }


  // N.º e referência
  function celulaNumero(r) {
    const celula = criar("td", "", String(r.id));

    if (r.referencia) {
      celula.appendChild(criar("br"));
      celula.appendChild(criar("span", "whitespace-nowrap text-xs text-[#666]", r.referencia));
    }

    return celula;
  }

  // Total e código
  function celulaTotal(r) {
    const celula = criar("td", "", euros.format(r.preco_total));

    if (r.codigo) {
      celula.appendChild(criar("br"));
      celula.appendChild(criar("span", "whitespace-nowrap text-xs text-[#1c5a2b]", `${r.codigo.toLowerCase()} (−${euros.format(r.desconto)})`));
    }

    return celula;
  }

  async function alterarEstado(reserva, estado) {
    try {
      const dados = await api("PATCH", `api/admin-reservas.php?id=${reserva.id}`, { estado });
      avisar(`Reserva ${reserva.id}: ${ESTADOS[estado].toLowerCase()}.` + (dados.email_enviado ? " O cliente foi avisado por e-mail." : ""));
      await carregarTudo();
    } catch (erro) {
      avisar(erro.message, false);
    }
  }

  async function eliminarReserva(reserva) {
    if (!confirm(`Eliminar definitivamente a reserva n.º ${reserva.id} de ${reserva.nome}?`)) return;

    try {
      await api("DELETE", `api/admin-reservas.php?id=${reserva.id}`);
      avisar(`Reserva ${reserva.id} eliminada.`);
      await carregarTudo();
    } catch (erro) {
      avisar(erro.message, false);
    }
  }

  [filtroEstado, filtroAlojamento].forEach((el) => el.addEventListener("change", desenharReservas));
  filtroTexto.addEventListener("input", desenharReservas);

  // ---------- ALOJAMENTOS ----------

  function campo(rotulo, elemento) {
    const caixa = criar("label", "grid content-start gap-1.5 text-[13px] text-[#666] [&>*:last-child]:w-full [&>*:last-child]:border [&>*:last-child]:border-[#ddd] [&>*:last-child]:bg-white [&>*:last-child]:p-2.5 [&>*:last-child]:text-[#222]");
    caixa.appendChild(criar("span", "", rotulo));
    caixa.appendChild(elemento);
    return caixa;
  }

  function entrada(tipo, valor, extra = {}) {
    const el = criar("input");
    el.type = tipo;
    el.value = valor;
    Object.assign(el, extra);
    return el;
  }

  function desenharAlojamentos() {
    listaAlojamentos.replaceChildren();

    alojamentos.forEach((a) => {
      const detalhes = criar("details", "mb-3 border border-[#ddd] bg-white [&>summary]:cursor-pointer [&>summary]:px-4 [&>summary]:py-3.5 [&>summary]:font-bold [&>summary]:text-[#14245d]");
      detalhes.appendChild(criar(
        "summary",
        "",
        `${a.nome} · ${a.tipologia} · Baixa: ${euros.format(a.preco_baixa ?? a.preco_noite)} · Média: ${euros.format(a.preco_media ?? a.preco_noite)} · Alta: ${euros.format(a.preco_alta ?? a.preco_noite)}`
      ));

      const form = criar("form", "grid gap-4 border-t border-[#ddd] p-4 sm:grid-cols-2 lg:grid-cols-3");

      const nome = entrada("text", a.nome, { required: true, maxLength: 120 });

      const tipologia = criar("select");
      ["T1", "T2", "T3", "T4", "Quarto"].forEach((t) => tipologia.appendChild(new Option(t, t)));
      tipologia.value = a.tipologia;

      const capacidade = entrada("number", a.capacidade, { min: 1, required: true });
      const quartos = entrada("number", a.quartos, { min: 1, required: true });
      const precoBaixa = entrada("number", a.preco_baixa ?? a.preco_noite, {
        min: 0, step: "0.01", required: true
      });

      const precoMedia = entrada("number", a.preco_media ?? a.preco_noite, {
        min: 0, step: "0.01", required: true
      });

      const precoAlta = entrada("number", a.preco_alta ?? a.preco_noite, {
        min: 0, step: "0.01", required: true
      });

      const comodidades = criar("textarea");
      comodidades.rows = 4;
      comodidades.value = (a.comodidades || []).join("\n");

      const descricao = criar("textarea");
      descricao.rows = 4;
      descricao.value = a.descricao || "";

      const descricaoEn = criar("textarea");
      descricaoEn.rows = 4;
      descricaoEn.value = a.descricao_en || "";
      // Características específicas do alojamento
      const caracteristicas = criar("textarea");
      caracteristicas.rows = 5;
      caracteristicas.placeholder =
        "Ex.: 2 camas de casal\n2.º andar sem elevador\nVista para o mar";
      caracteristicas.value = Array.isArray(a.detalhes)
        ? a.detalhes.join("\n")
        : "";

      // Localização
      const localizacao = entrada("text", a.localizacao || "", {
        placeholder: "Morada do alojamento"
      });

      // Ligação ao mapa
      const linkMapa = entrada("url", a.link_mapa || "", {
        placeholder: "https://www.google.com/maps/..."
      });

      const guardar = criar("button", "w-fit border border-[#1d2d78] bg-[#1d2d78] px-6 py-3 text-xs tracking-[0.2em] text-white hover:border-[#e5c89c] hover:bg-[#e5c89c] hover:text-[#14245d] sm:col-span-full", "GUARDAR ALTERAÇÕES");
      guardar.type = "submit";

      form.append(
        campo("Nome", nome),
        campo("Tipologia", tipologia),
        campo("Capacidade (hóspedes)", capacidade),
        campo("Quartos", quartos),
        campo("Época baixa (€ / noite)", precoBaixa),
        campo("Época média (€ / noite)", precoMedia),
        campo("Época alta (€ / noite)", precoAlta),
        campo("Comodidades (uma por linha)", comodidades),
        campo("Descrição (português)", descricao),
        campo("Descrição (inglês)", descricaoEn),
        campo("Características adicionais (uma por linha)", caracteristicas),
        campo("Localização / Morada", localizacao),
        campo("Ligação ao Google Maps", linkMapa),
        guardar
      );

      form.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        try {
          await api("PUT", `api/admin-alojamentos.php?id=${a.id}`, {
            nome: nome.value,
            tipologia: tipologia.value,
            capacidade: capacidade.value,
            quartos: quartos.value,
            preco_baixa: precoBaixa.value,
            preco_media: precoMedia.value,
            preco_alta: precoAlta.value,
            comodidades: comodidades.value.split("\n"),
            descricao: descricao.value,
            descricao_en: descricaoEn.value,
            detalhes: caracteristicas.value
              .split("\n")
              .map(texto => texto.trim())
              .filter(Boolean),
            localizacao: localizacao.value.trim(),
            link_mapa: linkMapa.value.trim()
          });

          avisar(`${nome.value} atualizado.`);
          await carregarTudo();
        } catch (erro) {
          avisar(erro.message, false);
        }
      });

      detalhes.appendChild(form);
      listaAlojamentos.appendChild(detalhes);
    });
  }

  // ---------- AVALIAÇÕES ----------

  function desenharAvaliacoes() {
    const lista = document.getElementById("lista-avaliacoes-admin");
    lista.replaceChildren();

    if (avaliacoes.length === 0) {
      lista.appendChild(criar("p", "text-[#666]", "Ainda não há avaliações."));
      return;
    }

    avaliacoes.forEach((v) => {
      const linha = criar("div", "flex flex-col gap-3 border border-[#ddd] bg-white p-4 sm:flex-row sm:items-start sm:justify-between");
      const info = criar("div", "grid gap-1");

      info.appendChild(criar("strong", "text-[#14245d]", `${"★".repeat(v.classificacao)}${"☆".repeat(5 - v.classificacao)} · ${v.nome}`));
      info.appendChild(criar("span", "text-sm text-[#666]", `${v.alojamento_nome} · ${dataPT(v.criado_em.slice(0, 10))}`));

      if (v.comentario) {
        info.appendChild(criar("p", "", v.comentario));
      }

      const eliminar = criar("button", "w-fit border border-[#8a1c13] bg-white px-2.5 py-1.5 text-xs text-[#8a1c13] hover:bg-[#8a1c13] hover:text-white", "Eliminar");
      eliminar.type = "button";
      eliminar.addEventListener("click", () => eliminarAvaliacao(v));

      linha.append(info, eliminar);
      lista.appendChild(linha);
    });
  }

  async function eliminarAvaliacao(avaliacao) {
    if (!confirm(`Eliminar a avaliação de ${avaliacao.nome}?`)) return;

    try {
      await api("DELETE", `api/admin-avaliacoes.php?id=${avaliacao.id}`);
      avisar("Avaliação eliminada.");
      await carregarTudo();
    } catch (erro) {
      avisar(erro.message, false);
    }
  }

  // ---------- CÓDIGOS PROMOCIONAIS ----------

  function desenharCodigos() {
    const lista = document.getElementById("lista-codigos-admin");
    lista.replaceChildren();

    if (codigos.length === 0) {
      lista.appendChild(criar("p", "text-[#666]", "Ainda não há códigos."));
      return;
    }

    codigos.forEach((c) => {
      const linha = criar("div", "flex flex-col gap-3 border border-[#ddd] bg-white p-4 sm:flex-row sm:items-center sm:justify-between");
      const info = criar("div", "grid gap-1");

      info.appendChild(criar("strong", "text-[#14245d]", `${c.codigo} · ${c.percentagem}% de desconto`));
      info.appendChild(criar("span", "text-sm text-[#666]", c.valido_ate ? `Válido até ${dataPT(c.valido_ate)}` : "Sem data de fim"));

      const expirado = c.valido_ate && c.valido_ate < new Date().toISOString().slice(0, 10);
      const valido = c.ativo && !expirado;
      const estado = criar("span", "w-fit rounded-full px-2.5 py-0.5 text-xs " + (valido ? "bg-[#e7f4ea] text-[#1c5a2b]" : "bg-[#fdecea] text-[#8a1c13]"), expirado ? "Expirado" : (c.ativo ? "Ativo" : "Desativado"));
      info.appendChild(estado);

      const acoes = criar("div");
      acoes.append(
        botaoAcao(c.ativo ? "Desativar" : "Ativar", () => alterarCodigo(c)),
        botaoAcao("Eliminar", () => eliminarCodigo(c), true)
      );

      linha.append(info, acoes);
      lista.appendChild(linha);
    });
  }

  document.getElementById("form-codigo").addEventListener("submit", async (evento) => {
    evento.preventDefault();

    try {
      await api("POST", "api/admin-codigos.php", {
        codigo: document.getElementById("novo-codigo").value,
        percentagem: document.getElementById("nova-percentagem").value,
        valido_ate: document.getElementById("nova-validade").value
      });

      evento.target.reset();
      avisar("Código criado.");
      await carregarTudo();
    } catch (erro) {
      avisar(erro.message, false);
    }
  });

  async function alterarCodigo(codigo) {
    try {
      const dados = await api("PATCH", `api/admin-codigos.php?id=${codigo.id}`, { ativo: !codigo.ativo });
      avisar(dados.mensagem);
      await carregarTudo();
    } catch (erro) {
      avisar(erro.message, false);
    }
  }

  async function eliminarCodigo(codigo) {
    if (!confirm(`Eliminar o código ${codigo.codigo}?`)) return;

    try {
      await api("DELETE", `api/admin-codigos.php?id=${codigo.id}`);
      avisar("Código eliminado.");
      await carregarTudo();
    } catch (erro) {
      avisar(erro.message, false);
    }
  }

  // ---------- ESTATÍSTICAS ----------

  const periodo = document.getElementById("periodo-estatisticas");
  const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

  // Barra horizontal
  function linhaBarra(nome, valor, maximo, texto) {
    const linha = criar("li", "grid grid-cols-[7rem_1fr_auto] items-center gap-3 sm:grid-cols-[9rem_1fr_auto]");
    const fundo = criar("span", "h-3 rounded bg-[#f2efe9]");
    const barra = criar("span", "block h-3 rounded bg-[#1d2d78]");

    barra.style.width = (maximo ? (valor / maximo) * 100 : 0) + "%";
    fundo.appendChild(barra);
    linha.append(criar("span", "truncate", nome), fundo, criar("span", "text-right tabular-nums text-[#666]", texto));

    return linha;
  }

  function desenharEstatisticas() {
    // Filtro do período
    const anos = [...new Set(reservas.map((r) => r.check_in.slice(0, 4)))].sort().reverse();
    const escolhido = periodo.value;
    periodo.replaceChildren(new Option("Todo o período", ""), ...anos.map((a) => new Option(a, a)));
    periodo.value = anos.includes(escolhido) ? escolhido : "";

    const doPeriodo = reservas.filter((r) => !periodo.value || r.check_in.startsWith(periodo.value));
    const confirmadas = doPeriodo.filter((r) => r.estado === "confirmada");
    const canceladas = doPeriodo.length - confirmadas.length;

    const receita = confirmadas.reduce((soma, r) => soma + Number(r.preco_total), 0);
    const noites = confirmadas.reduce((soma, r) => soma + (new Date(r.check_out) - new Date(r.check_in)) / 86400000, 0);
    const notaMedia = avaliacoes.length ? avaliacoes.reduce((soma, a) => soma + Number(a.classificacao), 0) / avaliacoes.length : 0;

    // Indicadores
    const indicadores = [
      ["Reservas confirmadas", confirmadas.length, `${noites} noites reservadas`],
      ["Receita", euros.format(receita), confirmadas.length ? `média de ${euros.format(receita / confirmadas.length)} por reserva` : "—"],
      ["Cancelamentos", canceladas, doPeriodo.length ? `${Math.round((canceladas / doPeriodo.length) * 100)}% das reservas` : "—"],
      ["Nota média", notaMedia ? notaMedia.toLocaleString("pt-PT", { maximumFractionDigits: 1 }) : "—", `${avaliacoes.length} avaliações · em 5`]
    ];

    const lista = document.getElementById("indicadores");
    lista.replaceChildren();

    indicadores.forEach(([titulo, valor, nota]) => {
      const caixa = criar("div", "rounded-lg border border-[#ddd] bg-white p-4");
      caixa.append(
        criar("dt", "text-[11px] uppercase tracking-wider text-[#666]", titulo),
        criar("dd", "font-['Georgia',serif] text-3xl text-[#14245d]", String(valor)),
        criar("dd", "text-xs text-[#666]", nota)
      );
      lista.appendChild(caixa);
    });

    // Reservas por mês (barras verticais)
    const porMes = MESES.map((_, i) => confirmadas.filter((r) => Number(r.check_in.slice(5, 7)) === i + 1).length);
    const maximoMes = Math.max(...porMes, 1);
    const grafico = document.getElementById("grafico-meses");
    grafico.replaceChildren();

    porMes.forEach((total, i) => {
      const coluna = criar("div", "flex h-full flex-1 flex-col items-center justify-end gap-1");
      const barra = criar("div", "w-full rounded-t bg-[#1d2d78]");
      barra.style.height = (total / maximoMes) * 100 + "%";
      barra.title = `${total} reserva(s)`;
      coluna.append(criar("span", "text-xs tabular-nums text-[#666]", total ? String(total) : ""), barra, criar("span", "text-[11px] uppercase text-[#666]", MESES[i]));
      grafico.appendChild(coluna);
    });

    // Receita por tipologia
    const tipologias = ["Quarto", "T1", "T2", "T3", "T4"];
    const tipologiaDe = (r) => (alojamentos.find((a) => Number(a.id) === Number(r.alojamento_id)) || {}).tipologia;
    const receitaTipo = tipologias.map((tipo) => confirmadas.filter((r) => tipologiaDe(r) === tipo).reduce((soma, r) => soma + Number(r.preco_total), 0));
    const maximoTipo = Math.max(...receitaTipo);
    document.getElementById("barras-tipologia").replaceChildren(
      ...tipologias.map((tipo, i) => linhaBarra(tipo === "Quarto" ? "Quartos" : tipo, receitaTipo[i], maximoTipo, euros.format(receitaTipo[i])))
    );

    // Top 5 alojamentos
    const contagem = {};
    confirmadas.forEach((r) => {
      const nome = r.alojamento_nome || "—";
      contagem[nome] = (contagem[nome] || 0) + 1;
    });
    const top = Object.entries(contagem).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const barrasTop = document.getElementById("barras-top");
    barrasTop.replaceChildren(...top.map(([nome, total]) => linhaBarra(nome, total, top[0][1], String(total))));

    if (top.length === 0) {
      barrasTop.appendChild(criar("li", "text-[#666]", "Ainda não há reservas neste período."));
    }

    // Descontos usados
    const descontos = {};
    confirmadas.filter((r) => r.codigo).forEach((r) => {
      descontos[r.codigo] = descontos[r.codigo] || { reservas: 0, total: 0 };
      descontos[r.codigo].reservas++;
      descontos[r.codigo].total += Number(r.desconto);
    });

    const tabela = document.getElementById("tabela-descontos");
    tabela.replaceChildren();

    Object.entries(descontos).forEach(([codigo, d]) => {
      const linha = criar("tr");
      linha.append(
        criar("td", "py-2 pr-3", codigo === "CLIENTE HABITUAL" ? "Cliente habitual" : codigo),
        criar("td", "py-2 pr-3 text-right tabular-nums", String(d.reservas)),
        criar("td", "py-2 text-right tabular-nums", euros.format(d.total))
      );
      tabela.appendChild(linha);
    });

    if (Object.keys(descontos).length === 0) {
      const linha = criar("tr");
      const celula = criar("td", "py-2 text-[#666]", "Nenhum desconto usado neste período.");
      celula.colSpan = 3;
      linha.appendChild(celula);
      tabela.appendChild(linha);
    }
  }

  periodo.addEventListener("change", desenharEstatisticas);

  // ---------- ARRANQUE ----------
})();
